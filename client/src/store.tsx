import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { socket } from './socket';
import type {
  PublicCouple,
  Question,
  RevealPayload,
  RoomSnapshot,
} from '../../shared/types';

export type Role = 'home' | 'host' | 'player';

interface QuestionState {
  question: Question;
  deadlineTs: number;
  activeCoupleId: string;
  questionNumber: number;
  totalQuestions: number;
}

interface Session {
  code: string;
  isHost?: boolean;
  playerId?: string;
}

const SESSION_KEY = 'eslesme-vakti-session';

function loadSession(): Session | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}
function saveSession(s: Session | null): void {
  try {
    if (s) sessionStorage.setItem(SESSION_KEY, JSON.stringify(s));
    else sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* yok say */
  }
}

interface GameContextValue {
  connected: boolean;
  role: Role;
  isHost: boolean; // bu cihaz odayı kurdu mu (oyuncu da olabilir)
  code: string;
  playerId: string | null;
  snapshot: RoomSnapshot | null;
  question: QuestionState | null;
  selectedPlayerIds: string[];
  reveal: RevealPayload | null;
  readyPlayerIds: string[];
  turnChange: { activeCoupleId: string | null; reason: string } | null;
  leaderboard: PublicCouple[] | null;
  mySelection: string | null;
  error: string | null;
  clearError: () => void;
  // türetilmiş
  myCoupleId: string | null;
  // aksiyonlar
  hostCreate: () => void;
  hostPlayHere: (name: string) => void; // oda kuran kişi bu cihazdan da oynar
  hostStart: () => void;
  hostRestart: () => void;
  playerJoin: (code: string, name: string) => void;
  createCouple: (name: string) => void;
  joinCouple: (coupleId: string) => void;
  leaveCouple: () => void;
  select: (optionId: string) => void;
  ready: () => void;
  goHome: () => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(socket.connected);
  const [role, setRole] = useState<Role>('home');
  const [isHost, setIsHost] = useState(false);
  const [code, setCode] = useState('');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<RoomSnapshot | null>(null);
  const [question, setQuestion] = useState<QuestionState | null>(null);
  const [selectedPlayerIds, setSelectedPlayerIds] = useState<string[]>([]);
  const [reveal, setReveal] = useState<RevealPayload | null>(null);
  const [readyPlayerIds, setReadyPlayerIds] = useState<string[]>([]);
  const [turnChange, setTurnChange] = useState<GameContextValue['turnChange']>(null);
  const [leaderboard, setLeaderboard] = useState<PublicCouple[] | null>(null);
  const [mySelection, setMySelection] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<Session | null>(loadSession());

  function resetGameState() {
    setSnapshot(null);
    setQuestion(null);
    setSelectedPlayerIds([]);
    setReveal(null);
    setReadyPlayerIds([]);
    setTurnChange(null);
    setLeaderboard(null);
    setMySelection(null);
  }

  useEffect(() => {
    function onConnect() {
      setConnected(true);
      const s = sessionRef.current;
      if (!s) return;
      // Yeniden bağlanınca oturumu geri yükle (bir cihaz hem host hem oyuncu olabilir).
      setCode(s.code);
      setIsHost(!!s.isHost);
      // Oyuncu kimliği varsa görünüm 'player', yoksa salt host (pano).
      setRole(s.playerId ? 'player' : s.isHost ? 'host' : 'home');
      if (s.isHost) {
        socket.emit('host:resume', { code: s.code }, (res) => {
          if (!res.ok && !s.playerId) {
            sessionRef.current = null;
            saveSession(null);
            setRole('home');
            setIsHost(false);
          }
        });
      }
      if (s.playerId) {
        socket.emit('player:rejoin', { code: s.code, playerId: s.playerId }, (res) => {
          if (res.ok) {
            setPlayerId(res.playerId ?? s.playerId ?? null);
            if (res.snapshot) setSnapshot(res.snapshot);
          } else {
            sessionRef.current = null;
            saveSession(null);
            setRole('home');
            setIsHost(false);
          }
        });
      }
    }
    function onDisconnect() {
      setConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    if (socket.connected) onConnect();

    socket.on('room:update', (snap) => setSnapshot(snap));

    socket.on('game:question', (q) => {
      setQuestion(q);
      setReveal(null);
      setSelectedPlayerIds([]);
      setReadyPlayerIds([]);
      setMySelection(null);
      setTurnChange(null);
      setLeaderboard(null);
    });

    socket.on('game:selection', ({ selectedPlayerIds }) =>
      setSelectedPlayerIds(selectedPlayerIds)
    );

    socket.on('game:reveal', (payload) => {
      setReveal(payload);
      setSelectedPlayerIds(Object.keys(payload.selections));
      setReadyPlayerIds([]);
    });

    socket.on('game:ready', ({ readyPlayerIds }) => setReadyPlayerIds(readyPlayerIds));

    socket.on('game:turnChange', (tc) => {
      setTurnChange(tc);
      setReveal(null);
      setQuestion(null);
    });

    socket.on('game:over', ({ leaderboard }) => setLeaderboard(leaderboard));

    socket.on('errorMsg', ({ message }) => setError(message));

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room:update');
      socket.off('game:question');
      socket.off('game:selection');
      socket.off('game:reveal');
      socket.off('game:ready');
      socket.off('game:turnChange');
      socket.off('game:over');
      socket.off('errorMsg');
    };
  }, []);

  const myCoupleId = useMemo(() => {
    if (!snapshot || !playerId) return null;
    return snapshot.players.find((p) => p.id === playerId)?.coupleId ?? null;
  }, [snapshot, playerId]);

  const value: GameContextValue = {
    connected,
    role,
    isHost,
    code,
    playerId,
    snapshot,
    question,
    selectedPlayerIds,
    reveal,
    readyPlayerIds,
    turnChange,
    leaderboard,
    mySelection,
    error,
    clearError: () => setError(null),
    myCoupleId,

    hostCreate: () => {
      socket.emit('host:create', (res) => {
        if (res.ok && res.code) {
          setRole('host');
          setIsHost(true);
          setCode(res.code);
          resetGameState();
          const s: Session = { code: res.code, isHost: true };
          sessionRef.current = s;
          saveSession(s);
        } else {
          setError(res.error ?? 'Oda oluşturulamadı.');
        }
      });
    },
    hostPlayHere: (name) => {
      // Oda kuran cihaz aynı zamanda oyuncu olur; görünüm oyuncuya döner.
      socket.emit('player:join', { code, name }, (res) => {
        if (res.ok && res.playerId) {
          setRole('player');
          setPlayerId(res.playerId);
          if (res.snapshot) setSnapshot(res.snapshot);
          const s: Session = { code, isHost: true, playerId: res.playerId };
          sessionRef.current = s;
          saveSession(s);
        } else {
          setError(res.error ?? 'Bu cihazdan oyuncu eklenemedi.');
        }
      });
    },
    hostStart: () => {
      socket.emit('host:start', (res) => {
        if (!res.ok) setError(res.error ?? 'Oyun başlatılamadı.');
      });
    },
    hostRestart: () => {
      socket.emit('host:restart', () => {});
    },
    playerJoin: (joinCode, name) => {
      socket.emit('player:join', { code: joinCode.toUpperCase(), name }, (res) => {
        if (res.ok && res.playerId) {
          setRole('player');
          setIsHost(false);
          setCode(joinCode.toUpperCase());
          setPlayerId(res.playerId);
          resetGameState();
          if (res.snapshot) setSnapshot(res.snapshot);
          const s: Session = {
            code: joinCode.toUpperCase(),
            playerId: res.playerId,
          };
          sessionRef.current = s;
          saveSession(s);
        } else {
          setError(res.error ?? 'Odaya katılınamadı.');
        }
      });
    },
    createCouple: (name) => {
      socket.emit('player:createCouple', { coupleName: name }, (res) => {
        if (!res.ok) setError(res.error ?? 'Çift oluşturulamadı.');
      });
    },
    joinCouple: (coupleId) => {
      socket.emit('player:joinCouple', { coupleId }, (res) => {
        if (!res.ok) setError(res.error ?? 'Çifte katılınamadı.');
      });
    },
    leaveCouple: () => {
      socket.emit('player:leaveCouple', () => {});
    },
    select: (optionId) => {
      setMySelection(optionId);
      socket.emit('player:select', { optionId });
    },
    ready: () => {
      socket.emit('player:ready');
    },
    goHome: () => {
      sessionRef.current = null;
      saveSession(null);
      setRole('home');
      setIsHost(false);
      setCode('');
      setPlayerId(null);
      resetGameState();
    },
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
