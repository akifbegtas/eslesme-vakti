import { createServer } from 'node:http';
import { networkInterfaces } from 'node:os';
import { existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import express from 'express';
import { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../shared/types';
import {
  ROOM_TTL_MS,
  addPlayer,
  allRooms,
  createCouple,
  createRoom,
  deleteRoom,
  getRoom,
  joinCouple,
  playerBySocket,
  removeFromCouple,
  snapshot,
  type Room,
} from './rooms';
import {
  broadcast,
  currentQuestionPayload,
  handleReady,
  handleSelect,
  restartGame,
  startGame,
} from './game';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3001);

const app = express();
const httpServer = createServer(app);
const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpServer, {
  cors: { origin: true },
});

// Sağlık ucu (Render health check için).
app.get('/healthz', (_req, res) => res.json({ ok: true }));

// Üretimde istemci build çıktısını servis et (tek-URL / Render full-stack).
// İstemci ayrı barındırılıyorsa (GitHub Pages) dist olmaz; sadece API çalışır.
const clientDist = join(__dirname, '../../client/dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')));
} else {
  app.get('/', (_req, res) =>
    res.send('Eşleşme Vakti sunucusu çalışıyor 💞 (API + Socket.IO)')
  );
}

// Soket başına bağlam (oda/rol/oyuncu) — generic karmaşası olmadan.
interface SocketCtx {
  code: string;
  isHost?: boolean;
  playerId?: string;
}
const socketCtx = new Map<string, SocketCtx>();

function roomOf(socketId: string): Room | undefined {
  const ctx = socketCtx.get(socketId);
  return ctx ? getRoom(ctx.code) : undefined;
}

function isRoomEmpty(room: Room): boolean {
  if (room.hostSocketId) return false;
  for (const p of room.players.values()) if (p.connected) return false;
  return true;
}

io.on('connection', (socket) => {
  // ---- Host ----
  socket.on('host:create', (ack) => {
    const room = createRoom(socket.id);
    room.emptySince = null;
    socket.join(room.code);
    socketCtx.set(socket.id, { code: room.code, isHost: true });
    ack({ ok: true, code: room.code });
    socket.emit('room:update', snapshot(room));
  });

  socket.on('host:resume', ({ code }, ack) => {
    const room = getRoom(code);
    if (!room) {
      ack({ ok: false, error: 'Oda bulunamadı.' });
      return;
    }
    room.hostSocketId = socket.id;
    room.emptySince = null;
    socket.join(room.code);
    socketCtx.set(socket.id, { ...socketCtx.get(socket.id), code: room.code, isHost: true });
    ack({ ok: true });
    socket.emit('room:update', snapshot(room));
    const q = currentQuestionPayload(room);
    if (q) socket.emit('game:question', q);
  });

  socket.on('host:start', (ack) => {
    const room = roomOf(socket.id);
    if (!room) return ack({ ok: false, error: 'Oda bulunamadı.' });
    const err = startGame(io, room);
    ack({ ok: !err, error: err ?? undefined });
  });

  socket.on('host:restart', (ack) => {
    const room = roomOf(socket.id);
    if (!room) return ack({ ok: false, error: 'Oda bulunamadı.' });
    restartGame(io, room);
    ack({ ok: true });
  });

  // ---- Oyuncu ----
  socket.on('player:join', ({ code, name }, ack) => {
    const room = getRoom(code);
    if (!room) return ack({ ok: false, error: 'Oda bulunamadı.' });
    if (room.status !== 'lobby') {
      return ack({ ok: false, error: 'Oyun başladı, şu an katılım kapalı.' });
    }
    const player = addPlayer(room, name, socket.id);
    socket.join(room.code);
    socketCtx.set(socket.id, { ...socketCtx.get(socket.id), code: room.code, playerId: player.id });
    ack({ ok: true, playerId: player.id, coupleId: null, snapshot: snapshot(room) });
    broadcast(io, room);
  });

  socket.on('player:rejoin', ({ code, playerId }, ack) => {
    const room = getRoom(code);
    const player = room?.players.get(playerId);
    if (!room || !player) {
      return ack({ ok: false, error: 'Oturum bulunamadı.' });
    }
    player.socketId = socket.id;
    player.connected = true;
    room.socketToPlayer.set(socket.id, player.id);
    room.emptySince = null;
    socket.join(room.code);
    socketCtx.set(socket.id, { ...socketCtx.get(socket.id), code: room.code, playerId: player.id });
    ack({ ok: true, playerId: player.id, coupleId: player.coupleId, snapshot: snapshot(room) });
    broadcast(io, room);
    const q = currentQuestionPayload(room);
    if (q) socket.emit('game:question', q);
  });

  socket.on('player:createCouple', ({ coupleName }, ack) => {
    const room = roomOf(socket.id);
    const player = room && playerBySocket(room, socket.id);
    if (!room || !player) return ack({ ok: false, error: 'Önce odaya katıl.' });
    if (room.status !== 'lobby') return ack({ ok: false, error: 'Lobi kapandı.' });
    createCouple(room, player, coupleName);
    ack({ ok: true });
    broadcast(io, room);
  });

  socket.on('player:joinCouple', ({ coupleId }, ack) => {
    const room = roomOf(socket.id);
    const player = room && playerBySocket(room, socket.id);
    if (!room || !player) return ack({ ok: false, error: 'Önce odaya katıl.' });
    if (room.status !== 'lobby') return ack({ ok: false, error: 'Lobi kapandı.' });
    const err = joinCouple(room, player, coupleId);
    ack({ ok: !err, error: err ?? undefined });
    broadcast(io, room);
  });

  socket.on('player:leaveCouple', (ack) => {
    const room = roomOf(socket.id);
    const player = room && playerBySocket(room, socket.id);
    if (!room || !player) return ack({ ok: false, error: 'Önce odaya katıl.' });
    if (room.status !== 'lobby') return ack({ ok: false, error: 'Lobi kapandı.' });
    removeFromCouple(room, player);
    ack({ ok: true });
    broadcast(io, room);
  });

  socket.on('player:select', ({ optionId }) => {
    const room = roomOf(socket.id);
    const player = room && playerBySocket(room, socket.id);
    if (room && player) handleSelect(io, room, player.id, optionId);
  });

  socket.on('player:ready', () => {
    const room = roomOf(socket.id);
    const player = room && playerBySocket(room, socket.id);
    if (room && player) handleReady(io, room, player.id);
  });

  socket.on('disconnect', () => {
    const ctx = socketCtx.get(socket.id);
    socketCtx.delete(socket.id);
    if (!ctx) return;
    const room = getRoom(ctx.code);
    if (!room) return;
    // Bir soket hem host hem oyuncu olabilir; ikisini de temizle.
    if (room.hostSocketId === socket.id) room.hostSocketId = null;
    const player = playerBySocket(room, socket.id);
    if (player) {
      player.connected = false;
      player.socketId = null;
      room.socketToPlayer.delete(socket.id);
    }
    if (isRoomEmpty(room) && room.emptySince === null) {
      room.emptySince = Date.now();
    }
    broadcast(io, room);
  });
});

// Boş odaları periyodik temizle.
setInterval(() => {
  const now = Date.now();
  for (const room of allRooms()) {
    if (isRoomEmpty(room) && room.emptySince && now - room.emptySince > ROOM_TTL_MS) {
      deleteRoom(room.code);
    }
  }
}, 5 * 60 * 1000);

httpServer.listen(PORT, '0.0.0.0', () => {
  const urls: string[] = [`http://localhost:${PORT}`];
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      if (net.family === 'IPv4' && !net.internal) {
        urls.push(`http://${net.address}:${PORT}`);
      }
    }
  }
  console.log('💞 Eşleşme Vakti sunucusu çalışıyor:');
  for (const u of urls) console.log('   ' + u);
  if (!existsSync(clientDist)) {
    console.log('   (geliştirme: istemci için Vite http://localhost:5173)');
  }
});
