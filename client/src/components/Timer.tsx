import { useEffect, useState } from 'react';

export function Timer({
  deadlineTs,
  totalMs = 15000,
}: {
  deadlineTs: number;
  totalMs?: number;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(id);
  }, []);

  const remaining = Math.max(0, deadlineTs - now);
  const secs = Math.ceil(remaining / 1000);
  const pct = Math.max(0, Math.min(100, (remaining / totalMs) * 100));
  const low = secs <= 5;

  return (
    <div className="timer-wrap">
      <div className="timer-track">
        <div
          className={`timer-fill ${low ? 'low' : ''}`}
          style={{ width: pct + '%' }}
        />
      </div>
      <div className="timer-num">{secs}</div>
    </div>
  );
}
