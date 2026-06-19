import { io, type Socket } from 'socket.io-client';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../shared/types';

// Geliştirmede ve tek-URL (Render full-stack) kurulumunda aynı origin'e bağlanır.
// GitHub Pages + ayrı backend kurulumunda VITE_SERVER_URL build sırasında
// Render sunucusunun adresine ayarlanır.
const serverUrl = import.meta.env.VITE_SERVER_URL || undefined;

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  serverUrl,
  { autoConnect: true }
);
