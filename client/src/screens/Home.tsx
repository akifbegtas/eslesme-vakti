import { useEffect, useState } from 'react';
import { useGame } from '../store';

export function Home() {
  const { hostCreate, playerJoin, connected } = useGame();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const c = params.get('code');
    if (c) setCode(c.toUpperCase().slice(0, 4));
  }, []);

  const canJoin = code.trim().length >= 3 && name.trim().length >= 1;

  return (
    <div className="screen screen--narrow center-col">
      <h1 className="brand">Eşleşme Vakti 💞</h1>
      <p className="subtitle">
        Çiftler için eşleşme oyunu! Aynı cevabı verirseniz puan kazanırsınız.
        Geçmiş, şimdi ve gelecek üzerine sorularla birbirinizi ne kadar
        tanıyorsunuz görün.
      </p>

      <div className="card stack" style={{ width: '100%' }}>
        <h3>🖥️ Ana ekranı kur</h3>
        <p className="muted">
          Bir TV / bilgisayar / tabletten odayı aç, oda kodunu paylaş.
        </p>
        <button
          className="btn btn--accent btn--lg btn--block"
          disabled={!connected}
          onClick={hostCreate}
        >
          Oda Kur
        </button>
      </div>

      <div className="card stack" style={{ width: '100%' }}>
        <h3>📱 Odaya katıl</h3>
        <input
          className="input input--code"
          maxLength={4}
          placeholder="KOD"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <input
          className="input"
          placeholder="Adın"
          value={name}
          maxLength={24}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          className="btn btn--lg btn--block"
          disabled={!canJoin || !connected}
          onClick={() => playerJoin(code, name)}
        >
          Gir
        </button>
      </div>

      {!connected && <p className="muted">Sunucuya bağlanılıyor…</p>}
    </div>
  );
}
