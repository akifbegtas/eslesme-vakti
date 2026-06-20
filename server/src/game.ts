import type { Server } from 'socket.io';
import type {
  ClientToServerEvents,
  ServerToClientEvents,
  RevealPayload,
  Question,
} from '../../shared/types';
import { getQuestion, shuffledQuestionIds } from '../../shared/questions';
import {
  MAX_WRONGS,
  QUESTION_MS,
  TURN_CHANGE_MS,
  activeCouple,
  snapshot,
  toPublicCouple,
  type Room,
} from './rooms';

export type IO = Server<ClientToServerEvents, ServerToClientEvents>;

export function broadcast(io: IO, room: Room): void {
  io.to(room.code).emit('room:update', snapshot(room));
}

function clearTimers(room: Room): void {
  if (room.questionTimer) {
    clearTimeout(room.questionTimer);
    room.questionTimer = null;
  }
  if (room.turnTimer) {
    clearTimeout(room.turnTimer);
    room.turnTimer = null;
  }
}

export function validateStart(room: Room): string | null {
  if (room.couples.length === 0) return 'En az bir çift gerekli.';
  if (room.couples.some((c) => c.memberIds.length !== 2)) {
    return 'Her çift tam 2 kişiden oluşmalı (yarım çift var).';
  }
  return null;
}

export function startGame(io: IO, room: Room): string | null {
  const err = validateStart(room);
  if (err) return err;
  clearTimers(room);
  room.questionOrder = shuffledQuestionIds();
  room.currentQuestionIndex = 0;
  room.activeCoupleIndex = 0;
  for (const c of room.couples) {
    c.score = 0;
    c.wrongs = 0;
  }
  sendQuestion(io, room);
  return null;
}

export function currentQuestionPayload(room: Room) {
  if (room.status !== 'question') return null;
  const couple = activeCouple(room);
  const question = getQuestion(room.questionOrder[room.currentQuestionIndex]);
  if (!couple || !question) return null;
  return {
    question,
    deadlineTs: room.deadlineTs,
    activeCoupleId: couple.id,
    questionNumber: room.currentQuestionIndex + 1,
    totalQuestions: room.questionOrder.length,
  };
}

export function sendQuestion(io: IO, room: Room): void {
  room.selections.clear();
  room.readyForNext.clear();
  clearTimers(room);

  if (room.currentQuestionIndex >= room.questionOrder.length) {
    finishGame(io, room);
    return;
  }
  const couple = activeCouple(room);
  const question = getQuestion(room.questionOrder[room.currentQuestionIndex]);
  if (!couple || !question) {
    finishGame(io, room);
    return;
  }

  room.status = 'question';
  room.deadlineTs = Date.now() + QUESTION_MS;
  room.questionTimer = setTimeout(() => revealNow(io, room), QUESTION_MS);

  io.to(room.code).emit('game:question', {
    question,
    deadlineTs: room.deadlineTs,
    activeCoupleId: couple.id,
    questionNumber: room.currentQuestionIndex + 1,
    totalQuestions: room.questionOrder.length,
  });
  broadcast(io, room);
}

export function handleSelect(io: IO, room: Room, playerId: string, optionId: string): void {
  if (room.status !== 'question') return;
  const couple = activeCouple(room);
  if (!couple || !couple.memberIds.includes(playerId)) return;

  // Geçerli optionId mi?
  const question = getQuestion(room.questionOrder[room.currentQuestionIndex]);
  if (!question || !question.options.some((o) => o.id === optionId)) return;

  room.selections.set(playerId, optionId);
  io.to(room.code).emit('game:selection', {
    selectedPlayerIds: [...room.selections.keys()],
  });

  const bothSelected = couple.memberIds.every((id) => room.selections.has(id));
  if (bothSelected) revealNow(io, room);
}

function roleOf(question: Question | undefined, optionId?: string) {
  return optionId
    ? question?.options.find((o) => o.id === optionId)?.role
    : undefined;
}

/**
 * Eşleşme kuralı:
 * - Normal soru: iki partner AYNI şıkkı seçer.
 * - Bakış açılı ("kim?") soru: aynı kişiyi işaret ederler — biri 'Ben' (self)
 *   diğeri 'O' (other) derse aynı kişi → eşleşme. Ortak cevaplarda (Eşit,
 *   İkimiz de, Başkası…) ise aynı şıkkı seçmeleri gerekir.
 */
function computeMatch(question: Question | undefined, a?: string, b?: string): boolean {
  if (!a || !b) return false;
  if (!question?.perspective) return a === b;
  const ra = roleOf(question, a) ?? 'shared';
  const rb = roleOf(question, b) ?? 'shared';
  if (ra === 'shared' || rb === 'shared') return a === b;
  return ra !== rb; // self + other → aynı kişi
}

export function revealNow(io: IO, room: Room): void {
  if (room.status !== 'question') return; // çift tetiklemeyi engelle
  clearTimers(room);
  const couple = activeCouple(room);
  if (!couple) return;

  room.status = 'reveal';
  room.readyForNext.clear();

  const question = getQuestion(room.questionOrder[room.currentQuestionIndex]);
  const [m0, m1] = couple.memberIds;
  const sel0 = room.selections.get(m0);
  const sel1 = room.selections.get(m1);
  const match = computeMatch(question, sel0, sel1);

  if (match) {
    couple.score += 1;
  } else {
    couple.wrongs += 1;
  }

  const selections: Record<string, string> = {};
  if (sel0) selections[m0] = sel0;
  if (sel1) selections[m1] = sel1;

  const payload: RevealPayload = {
    coupleId: couple.id,
    selections,
    match,
    scoreDelta: match ? 1 : 0,
    score: couple.score,
    wrongs: couple.wrongs,
  };
  io.to(room.code).emit('game:reveal', payload);
  broadcast(io, room);
}

export function handleReady(io: IO, room: Room, playerId: string): void {
  if (room.status !== 'reveal') return;
  const couple = activeCouple(room);
  if (!couple || !couple.memberIds.includes(playerId)) return;

  room.readyForNext.add(playerId);
  io.to(room.code).emit('game:ready', {
    readyPlayerIds: [...room.readyForNext],
  });

  const bothReady = couple.memberIds.every((id) => room.readyForNext.has(id));
  if (bothReady) proceedAfterReady(io, room);
}

function proceedAfterReady(io: IO, room: Room): void {
  const couple = activeCouple(room);
  if (!couple) return;
  if (couple.wrongs >= MAX_WRONGS) {
    goToNextCouple(io, room, 'wrongs');
  } else {
    room.currentQuestionIndex += 1;
    sendQuestion(io, room);
  }
}

function goToNextCouple(io: IO, room: Room, reason: 'wrongs' | 'completed'): void {
  clearTimers(room);
  const finished = activeCouple(room);
  if (finished) finished.wrongs = 0;

  room.activeCoupleIndex += 1;
  room.currentQuestionIndex += 1;
  room.selections.clear();
  room.readyForNext.clear();

  if (
    room.activeCoupleIndex >= room.couples.length ||
    room.currentQuestionIndex >= room.questionOrder.length
  ) {
    finishGame(io, room);
    return;
  }

  const next = activeCouple(room)!;
  room.status = 'turnChange';
  io.to(room.code).emit('game:turnChange', { activeCoupleId: next.id, reason });
  broadcast(io, room);

  room.turnTimer = setTimeout(() => sendQuestion(io, room), TURN_CHANGE_MS);
}

export function finishGame(io: IO, room: Room): void {
  clearTimers(room);
  room.status = 'finished';
  const leaderboard = [...room.couples]
    .sort((a, b) => b.score - a.score)
    .map(toPublicCouple);
  io.to(room.code).emit('game:over', { leaderboard });
  broadcast(io, room);
}

export function restartGame(io: IO, room: Room): void {
  clearTimers(room);
  room.status = 'lobby';
  room.activeCoupleIndex = 0;
  room.currentQuestionIndex = 0;
  room.questionOrder = [];
  room.selections.clear();
  room.readyForNext.clear();
  for (const c of room.couples) {
    c.score = 0;
    c.wrongs = 0;
  }
  broadcast(io, room);
}
