import type { PublicCouple } from '../../../shared/types';

export function ScoreBoard({
  couples,
  activeCoupleId,
}: {
  couples: PublicCouple[];
  activeCoupleId?: string | null;
}) {
  const sorted = [...couples].sort((a, b) => b.score - a.score);
  return (
    <div className="scoreboard">
      {sorted.map((c) => (
        <div
          key={c.id}
          className={`score-row ${c.id === activeCoupleId ? 'active' : ''}`}
        >
          <span className="name">
            {c.id === activeCoupleId ? '👉 ' : ''}
            {c.name}
          </span>
          <span className="score">{c.score} 💞</span>
        </div>
      ))}
      {sorted.length === 0 && <span className="muted">Henüz çift yok.</span>}
    </div>
  );
}
