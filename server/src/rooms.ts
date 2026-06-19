import { randomUUID } from 'node:crypto';
import type {
  PublicCouple,
  PublicPlayer,
  RoomSnapshot,
  RoomStatus,
} from '../../shared/types';
import { QUESTIONS } from '../../shared/questions';

export const MAX_WRONGS = 3;
export const QUESTION_MS = 15_000;
export const TURN_CHANGE_MS = 3_500;
export const ROOM_TTL_MS = 30 * 60 * 1000; // boş oda 30 dk sonra silinir

export interface InternalPlayer {
  id: string;
  name: string;
  socketId: string | null;
  coupleId: string | null;
  connected: boolean;
}

export interface InternalCouple {
  id: string;
  name: string;
  memberIds: string[]; // en fazla 2
  score: number;
  wrongs: number;
}

export interface Room {
  code: string;
  hostSocketId: string | null;
  players: Map<string, InternalPlayer>; // playerId -> player
  socketToPlayer: Map<string, string>; // socketId -> playerId
  couples: InternalCouple[];
  status: RoomStatus;
  activeCoupleIndex: number;
  questionOrder: string[];
  currentQuestionIndex: number;
  selections: Map<string, string>; // playerId -> optionId (aktif çift)
  readyForNext: Set<string>; // playerId (aktif çift)
  deadlineTs: number;
  questionTimer: NodeJS.Timeout | null;
  turnTimer: NodeJS.Timeout | null;
  emptySince: number | null;
}

const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // karışabilen 0/O/1/I yok
const rooms = new Map<string, Room>();

function makeCode(): string {
  let code = '';
  do {
    code = '';
    for (let i = 0; i < 4; i++) {
      code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
    }
  } while (rooms.has(code));
  return code;
}

export function createRoom(hostSocketId: string): Room {
  const room: Room = {
    code: makeCode(),
    hostSocketId,
    players: new Map(),
    socketToPlayer: new Map(),
    couples: [],
    status: 'lobby',
    activeCoupleIndex: 0,
    questionOrder: [],
    currentQuestionIndex: 0,
    selections: new Map(),
    readyForNext: new Set(),
    deadlineTs: 0,
    questionTimer: null,
    turnTimer: null,
    emptySince: null,
  };
  rooms.set(room.code, room);
  return room;
}

export function getRoom(code: string): Room | undefined {
  return rooms.get(code.toUpperCase());
}

export function deleteRoom(code: string): void {
  const room = rooms.get(code);
  if (room) {
    if (room.questionTimer) clearTimeout(room.questionTimer);
    if (room.turnTimer) clearTimeout(room.turnTimer);
    rooms.delete(code);
  }
}

export function allRooms(): Room[] {
  return [...rooms.values()];
}

// ---- Oyuncu / çift yönetimi ----

export function addPlayer(room: Room, name: string, socketId: string): InternalPlayer {
  const player: InternalPlayer = {
    id: randomUUID(),
    name: name.trim().slice(0, 24) || 'Oyuncu',
    socketId,
    coupleId: null,
    connected: true,
  };
  room.players.set(player.id, player);
  room.socketToPlayer.set(socketId, player.id);
  room.emptySince = null;
  return player;
}

export function playerBySocket(room: Room, socketId: string): InternalPlayer | undefined {
  const pid = room.socketToPlayer.get(socketId);
  return pid ? room.players.get(pid) : undefined;
}

function cleanupEmptyCouples(room: Room): void {
  room.couples = room.couples.filter((c) => c.memberIds.length > 0);
}

export function removeFromCouple(room: Room, player: InternalPlayer): void {
  if (!player.coupleId) return;
  const couple = room.couples.find((c) => c.id === player.coupleId);
  if (couple) {
    couple.memberIds = couple.memberIds.filter((id) => id !== player.id);
  }
  player.coupleId = null;
  cleanupEmptyCouples(room);
}

export function createCouple(room: Room, player: InternalPlayer, name: string): void {
  removeFromCouple(room, player);
  const couple: InternalCouple = {
    id: randomUUID(),
    name: name.trim().slice(0, 24) || `Çift ${room.couples.length + 1}`,
    memberIds: [player.id],
    score: 0,
    wrongs: 0,
  };
  room.couples.push(couple);
  player.coupleId = couple.id;
}

export function joinCouple(room: Room, player: InternalPlayer, coupleId: string): string | null {
  const couple = room.couples.find((c) => c.id === coupleId);
  if (!couple) return 'Çift bulunamadı.';
  if (couple.memberIds.includes(player.id)) return null;
  if (couple.memberIds.length >= 2) return 'Bu çift dolu.';
  removeFromCouple(room, player);
  couple.memberIds.push(player.id);
  player.coupleId = couple.id;
  return null;
}

export function activeCouple(room: Room): InternalCouple | null {
  return room.couples[room.activeCoupleIndex] ?? null;
}

export function isActiveMember(room: Room, playerId: string): boolean {
  const couple = activeCouple(room);
  return !!couple && couple.memberIds.includes(playerId);
}

// ---- Snapshot ----

export function toPublicCouple(c: InternalCouple): PublicCouple {
  return {
    id: c.id,
    name: c.name,
    memberIds: [...c.memberIds],
    score: c.score,
    wrongs: c.wrongs,
  };
}

export function toPublicPlayer(p: InternalPlayer): PublicPlayer {
  return { id: p.id, name: p.name, coupleId: p.coupleId, connected: p.connected };
}

export function snapshot(room: Room): RoomSnapshot {
  const active = activeCouple(room);
  const playing = room.status !== 'lobby' && room.status !== 'finished';
  return {
    code: room.code,
    status: room.status,
    players: [...room.players.values()].map(toPublicPlayer),
    couples: room.couples.map(toPublicCouple),
    activeCoupleId: playing ? active?.id ?? null : null,
    questionNumber: playing ? room.currentQuestionIndex + 1 : 0,
    totalQuestions: room.questionOrder.length || QUESTIONS.length,
    maxWrongs: MAX_WRONGS,
  };
}
