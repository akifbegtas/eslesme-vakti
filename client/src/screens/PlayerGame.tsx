import { useGame } from '../store';
import { OptionCard } from '../components/OptionCard';
import { Timer } from '../components/Timer';
import { Confetti } from '../components/Confetti';
import { tenseLabel } from '../util';

export function PlayerGame() {
  const {
    snapshot,
    playerId,
    myCoupleId,
    question,
    reveal,
    selectedPlayerIds,
    readyPlayerIds,
    mySelection,
    select,
    ready,
  } = useGame();
  if (!snapshot) return null;

  const memberName = (id: string) =>
    snapshot.players.find((p) => p.id === id)?.name ?? '—';
  const activeCouple = snapshot.couples.find(
    (c) => c.id === snapshot.activeCoupleId
  );
  const isMyTurn = !!myCoupleId && myCoupleId === snapshot.activeCoupleId;

  // ---- BİTİŞ ----
  if (snapshot.status === 'finished') {
    const myCouple = snapshot.couples.find((c) => c.id === myCoupleId);
    return (
      <div className="screen screen--narrow center-col">
        <Confetti />
        <h1 className="brand">Oyun Bitti 🎉</h1>
        {myCouple && (
          <div className="winner">
            {myCouple.name}: {myCouple.score} 💞
          </div>
        )}
        <p className="subtitle">Sonuçlar ana ekranda!</p>
      </div>
    );
  }

  // ---- SIRA SİZDE DEĞİL ----
  if (!isMyTurn) {
    return (
      <div className="screen screen--narrow center-col">
        <span className="pill">👀 İzliyorsunuz</span>
        <h2>Sıra: {activeCouple?.name ?? '—'}</h2>
        <p className="subtitle">Sıranızı bekleyin, ana ekranı izleyin 💞</p>
      </div>
    );
  }

  // ---- SIRA SİZDE: geçiş ekranı ----
  if (snapshot.status === 'turnChange') {
    return (
      <div className="screen screen--narrow center-col">
        <h2 className="result-banner good">Sıra sizde! 🎯</h2>
        <p className="subtitle">Hazır olun…</p>
      </div>
    );
  }

  const q = question?.question;
  const partnerId = activeCouple?.memberIds.find((id) => id !== playerId);
  const iAmReady = !!playerId && readyPlayerIds.includes(playerId);

  return (
    <div className="screen screen--narrow">
      <div className="center-col">
        <span className="pill">
          Soru {snapshot.questionNumber}/{snapshot.totalQuestions}
        </span>
        {q && <span className="pill badge-tense">{tenseLabel(q.tense)}</span>}
        {snapshot.status === 'question' && question && (
          <Timer deadlineTs={question.deadlineTs} />
        )}
        {q && <h2 className="question-text">{q.text}</h2>}

        {snapshot.status === 'question' && q && (
          <>
            <div className="options-grid" data-count={q.options.length}>
              {q.options.map((opt) => (
                <OptionCard
                  key={opt.id}
                  option={opt}
                  onClick={mySelection ? undefined : () => select(opt.id)}
                  selected={mySelection === opt.id}
                  dimmed={!!mySelection && mySelection !== opt.id}
                />
              ))}
            </div>
            {mySelection ? (
              <p className="subtitle">
                Seçtin!{' '}
                {partnerId && selectedPlayerIds.includes(partnerId)
                  ? 'Eşin de seçti, açılıyor…'
                  : 'Eşin bekleniyor…'}
              </p>
            ) : (
              <p className="subtitle">
                Birini seç — eşinle aynı olursa puan! ⏱
              </p>
            )}
          </>
        )}

        {reveal && snapshot.status === 'reveal' && (
          <>
            {reveal.match && <Confetti />}
            <h2 className={`result-banner ${reveal.match ? 'good' : 'bad'}`}>
              {reveal.match ? 'EŞLEŞME! 💞 +1' : 'Eşleşemediniz 💔'}
            </h2>
            <div className="options-grid" data-count={q?.options.length ?? 2}>
              {q?.options.map((opt) => {
                const pickers = Object.entries(reveal.selections)
                  .filter(([, oid]) => oid === opt.id)
                  .map(([pid]) => memberName(pid));
                const isMatched = reveal.match && pickers.length > 0;
                return (
                  <OptionCard
                    key={opt.id}
                    option={opt}
                    matched={isMatched}
                    dimmed={pickers.length === 0}
                    badges={pickers}
                  />
                );
              })}
            </div>
            <button
              className="btn btn--accent btn--lg btn--block"
              disabled={iAmReady}
              onClick={ready}
            >
              {iAmReady ? 'Eşin bekleniyor…' : 'Sıradaki Soru →'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
