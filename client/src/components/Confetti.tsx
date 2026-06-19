import { useMemo } from 'react';

const EMOJIS = ['💞', '💖', '❤️', '💘', '✨', '🎉', '💝', '🌟'];

export function Confetti({ count = 42 }: { count?: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        i,
        left: Math.random() * 100,
        delay: Math.random() * 0.6,
        dur: 2.2 + Math.random() * 1.8,
        emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
        size: 18 + Math.random() * 24,
      })),
    [count]
  );

  return (
    <div className="confetti" aria-hidden>
      {pieces.map((p) => (
        <span
          key={p.i}
          style={{
            left: p.left + '%',
            animationDelay: p.delay + 's',
            animationDuration: p.dur + 's',
            fontSize: p.size + 'px',
          }}
        >
          {p.emoji}
        </span>
      ))}
    </div>
  );
}
