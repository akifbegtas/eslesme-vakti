import { io, type Socket } from 'socket.io-client';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
} from '../../shared/types';

const STORAGE_KEY = 'eslesme-server-url';

// Sunucu adresi çözümü:
// 1) ?server=https://... query param (localStorage'a kaydedilir — tek seferlik)
// 2) Daha önce kaydedilmiş adres
// 3) Build sırasında gömülen VITE_SERVER_URL (Render)
// 4) Aynı origin (yerel geliştirme / tek-URL kurulum)
function resolveServerUrl(): string | undefined {
  try {
    const param = new URLSearchParams(window.location.search).get('server');
    if (param) localStorage.setItem(STORAGE_KEY, param);
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return stored;
  } catch {
    /* yok say */
  }
  return import.meta.env.VITE_SERVER_URL || undefined;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
  resolveServerUrl(),
  { autoConnect: true }
);
