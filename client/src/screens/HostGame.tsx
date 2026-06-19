import { useGame } from '../store';
import { OptionCard } from '../components/OptionCard';
import { Timer } from '../components/Timer';
import { Confetti } from '../components/Confetti';
import { ScoreBoard } from '../components/ScoreBoard';
import { tenseLabel } from '../util';
import type { PublicCouple } from '../../../shared/types';

function MemberPills({
  ids,
  activeSet,
  doneWord,
  pendingWord,
  memberName,
}: {
  ids: string[];
  activeSet: string[];
  doneWord: string;
  pendingWord: string;
  memberName: (id: string) => string;
}) {
  return (
    <div className="row" style={{ justifyContent: 'center', gap: 16 }}>
      {ids.map((id) => {
        const on = activeSet.includes(id);
        return (
          <span className="pill" key={id}>
            <span className={`dot ${on ? 'on' : ''}`} />
            {memberName(id)} {on ? doneWord : pendingWord}
          </span>
        );
      })}
    </div>
  );
}

export function HostGame() {
  const {
    snapshot,
    question,
    reveal,
    selectedPlayerIds,
    readyPlayerIds,
    turnChange,
    leaderboard,
    hostRestart,
    goHome,
  } = useGame();
  if (!snapshot) return null;

  const couples = snapshot.couples;
  const activeId = snapshot.activeCoupleId;
  const active = couples.find((c) => c.id === activeId) ?? null;
  const memberName = (id: string) =>
    snapshot.players.find((p) => p.id === id)?.name ?? '—';

  // ---- BİTİŞ ----
  if (snapshot.status === 'finished' || leaderboard) {
    const board: PublicCouple[] =
      leaderboard ?? [...couples].sort((a, b) => b.score - a.score);
    const winner = board[0];
    return (
      <div className="screen center-col">
        <Confetti count={70} />
        <h1 className="brand">Oyun Bitti! 🎉</h1>
        {winner && (
          <div className="winner">
            🏆 {winner.name} — {winner.score} 💞
          </div>
        )}
        <div className="card" style={{ width: '100%', maxWidth: 560 }}>
          <ScoreBoard couples={board} />
        </div>
        <div className="row">
          <button className="btn btn--accent" onClick={hostRestart}>
            Tekrar Oyna
          </button>
          <button className="btn btn--ghost" onClick={goHome}>
            Çık
          </button>
        </div>
      </div>
    );
  }

  // ---- SIRA DEĞİŞİMİ ----
  if (snapshot.status === 'turnChange') {
    const next = couples.find(
      (c) => c.id === (turnChange?.activeCoupleId ?? activeId)
    );
    return (
      <div className="screen center-col">
        <h2 className="result-banner good">Sıra değişiyor…</h2>
        <div className="winner">👉 {next?.name ?? 'Sıradaki çift'}</div>
        <p className="subtitle">
          {turnChange?.reason === 'wrongs' ? '3 yanlış doldu! ' : ''}
          Hazır olun, sorular geliyor…
        </p>
        <div className="card" style={{ width: '100%', maxWidth: 480 }}>
          <ScoreBoard couples={couples} activeCoupleId={next?.id} />
        </div>
      </div>
    );
  }

  const q = question?.question;

  return (
    <div className="screen">
      <div className="topbar">
        <span className="pill">
          Soru {snapshot.questionNumber}/{snapshot.totalQuestions}
        </span>
        <span className="pill">{active ? `👉 ${active.name}` : ''}</span>
        <span className="pill">
          {active
            ? `Yanlış: ${'❌'.repeat(active.wrongs)}${'⚪'.repeat(
                Math.max(0, snapshot.maxWrongs - active.wrongs)
              )}`
            : ''}
        </span>
      </div>

      {q && (
        <div className="center-col">
          <span className="pill badge-tense">{tenseLabel(q.tense)}</span>
          <h2 className="question-text">{q.text}</h2>

          {snapshot.status === 'question' && question && (
            <>
              <Timer deadlineTs={question.deadlineTs} />
              {active && (
                <MemberPills
                  ids={active.memberIds}
                  activeSet={selectedPlayerIds}
                  doneWord="seçti ✓"
                  pendingWord="seçiyor…"
                  memberName={memberName}
                />
              )}
            </>
          )}

          <div className="options-grid" data-count={q.options.length}>
            {q.options.map((opt) => {
              const pickers = reveal
                ? Object.entries(reveal.selections)
                    .filter(([, oid]) => oid === opt.id)
                    .map(([pid]) => memberName(pid))
                : undefined;
              const isMatched =
                !!reveal?.match && reveal.matchedOptionId === opt.id;
              const dimmed = !!reveal && (pickers?.length ?? 0) === 0;
              return (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  matched={isMatched}
                  dimmed={dimmed}
                  badges={pickers}
                />
              );
            })}
          </div>

          {reveal && (
            <>
              {reveal.match && <Confetti />}
              {reveal.match && <div className="plus-one">+1</div>}
              <h2 className={`result-banner ${reveal.match ? 'good' : 'bad'}`}>
                {reveal.match ? 'EŞLEŞME! 💞 +1' : 'Eşleşemediniz 💔'}
              </h2>
              {active && (
                <MemberPills
                  ids={active.memberIds}
                  activeSet={readyPlayerIds}
                  doneWord="hazır ✓"
                  pendingWord="bekleniyor…"
                  memberName={memberName}
                />
              )}
              <p className="muted">
                Her iki eş de “Sıradaki Soru”ya basınca devam edilecek.
              </p>
            </>
          )}
        </div>
      )}

      <div className="card" style={{ marginTop: 24 }}>
        <h3>Skor Tablosu</h3>
        <ScoreBoard couples={couples} activeCoupleId={activeId} />
      </div>
    </div>
  );
}
