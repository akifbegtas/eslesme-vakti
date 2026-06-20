// Eşleşme Vakti — istemci ve sunucu arasında paylaşılan tipler.
// Hem client/ (Vite) hem server/ (tsx) bu dosyayı relative import ile kullanır.

export type Tense = 'past' | 'present' | 'future';

export interface Option {
  id: string;
  label: string;
  /** Emoji — görsel yüklenene kadar / başarısız olursa yedek. */
  icon: string;
  /** Şıkkın fotoğrafı için İngilizce anahtar kelime metni (stok foto araması). */
  imgPrompt?: string;
  /**
   * Bakış açılı ("kim?") sorularda şıkkın kimi gösterdiği:
   * 'self' = Ben/Benimki, 'other' = O/Onunki, 'shared' = ortak/üçüncü cevap.
   */
  role?: 'self' | 'other' | 'shared';
}

export interface Question {
  id: string;
  tense: Tense;
  text: string;
  /** 2–4 şık. Her şıkkın istisnasız bir görseli (icon) olur. */
  options: Option[];
  /**
   * true ise "kim?" tipi bakış açılı soru: eşleşme, iki partnerin AYNI kişiyi
   * işaret etmesidir (biri 'Ben' diğeri 'O' derse aynı kişi → eşleşme).
   */
  perspective?: boolean;
}

// ---- Oyun durumu (clientlara gönderilen "public" görünüm) ----

export type RoomStatus =
  | 'lobby'
  | 'question'
  | 'reveal'
  | 'turnChange'
  | 'finished';

export interface PublicPlayer {
  id: string;
  name: string;
  coupleId: string | null;
  connected: boolean;
}

export interface PublicCouple {
  id: string;
  name: string;
  memberIds: string[]; // en fazla 2
  score: number;
  wrongs: number; // aktif turdaki yanlış (eşleşmeme) sayısı
}

export interface RoomSnapshot {
  code: string;
  status: RoomStatus;
  players: PublicPlayer[];
  couples: PublicCouple[];
  activeCoupleId: string | null;
  questionNumber: number; // aktif çiftin kaçıncı sorusunda (1 tabanlı), başlamadıysa 0
  totalQuestions: number;
  maxWrongs: number;
}

// ---- Reveal yükü ----

export interface RevealPayload {
  coupleId: string;
  /** playerId -> seçilen optionId (artık açık). Seçmeyen üye için alan olmaz. */
  selections: Record<string, string>;
  match: boolean;
  scoreDelta: number;
  score: number;
  wrongs: number;
}

// ---- Socket.IO event imzaları ----

export interface AckResult {
  ok: boolean;
  error?: string;
}

export interface JoinAck extends AckResult {
  playerId?: string;
  coupleId?: string | null;
  snapshot?: RoomSnapshot;
}

export interface CreateAck extends AckResult {
  code?: string;
}

export interface ServerToClientEvents {
  'room:update': (snapshot: RoomSnapshot) => void;
  'game:question': (data: {
    question: Question;
    deadlineTs: number;
    activeCoupleId: string;
    questionNumber: number;
    totalQuestions: number;
  }) => void;
  /** Kimlerin seçtiği — seçilen şık AÇIKLANMADAN. */
  'game:selection': (data: { selectedPlayerIds: string[] }) => void;
  'game:reveal': (data: RevealPayload) => void;
  'game:ready': (data: { readyPlayerIds: string[] }) => void;
  'game:turnChange': (data: {
    activeCoupleId: string | null;
    reason: 'wrongs' | 'completed';
  }) => void;
  'game:over': (data: { leaderboard: PublicCouple[] }) => void;
  errorMsg: (data: { message: string }) => void;
}

export interface ClientToServerEvents {
  'host:create': (ack: (res: CreateAck) => void) => void;
  'host:resume': (data: { code: string }, ack: (res: AckResult) => void) => void;
  'host:start': (ack: (res: AckResult) => void) => void;
  'host:restart': (ack: (res: AckResult) => void) => void;
  'player:join': (
    data: { code: string; name: string },
    ack: (res: JoinAck) => void
  ) => void;
  'player:rejoin': (
    data: { code: string; playerId: string },
    ack: (res: JoinAck) => void
  ) => void;
  'player:createCouple': (
    data: { coupleName: string },
    ack: (res: AckResult) => void
  ) => void;
  'player:joinCouple': (
    data: { coupleId: string },
    ack: (res: AckResult) => void
  ) => void;
  'player:leaveCouple': (ack: (res: AckResult) => void) => void;
  'player:select': (data: { optionId: string }) => void;
  'player:ready': () => void;
}
