import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useGame } from '../store';

export function HostLobby() {
  const { code, snapshot, hostStart, hostPlayHere, goHome } = useGame();
  const [hostName, setHostName] = useState('');
  if (!snapshot) return <div className="screen center-col"><p className="muted">Oda hazırlanıyor…</p></div>;

  const joinBase = `${window.location.origin}${import.meta.env.BASE_URL}`;
  const joinUrl = `${joinBase}?code=${code}`;
  const joinLabel = `${window.location.host}${import.meta.env.BASE_URL}`;
  const couples = snapshot.couples;
  const ungrouped = snapshot.players.filter((p) => !p.coupleId);
  const fullCouples = couples.filter((c) => c.memberIds.length === 2);
  const canStart =
    couples.length >= 1 && couples.every((c) => c.memberIds.length === 2);
  const memberName = (id: string) =>
    snapshot.players.find((p) => p.id === id)?.name ?? '—';

  return (
    <div className="screen">
      <div className="center-col">
        <h1 className="brand">Eşleşme Vakti 💞</h1>
        <p className="subtitle">
          Telefonunuzdan QR'ı okutun ya da adrese gidip kodu girin:
        </p>

        <div
          className="row row--wrap"
          style={{ justifyContent: 'center', alignItems: 'center', gap: 32 }}
        >
          <div className="stack" style={{ alignItems: 'center' }}>
            <div className="qr-box">
              <QRCodeSVG value={joinUrl} size={184} />
            </div>
            <span className="muted">{joinLabel}</span>
          </div>
          <div className="stack" style={{ alignItems: 'center' }}>
            <span className="muted">ODA KODU</span>
            <div className="code-big">{code}</div>
          </div>
        </div>

        <div className="card" style={{ width: '100%', maxWidth: 720 }}>
          <h3>Çiftler ({fullCouples.length} hazır)</h3>
          {couples.length === 0 && (
            <p className="muted">
              Henüz çift yok. Oyuncular telefonlarından çift kuracak.
            </p>
          )}
          <div className="stack" style={{ marginTop: 12 }}>
            {couples.map((c) => (
              <div
                key={c.id}
                className={`score-row ${c.memberIds.length === 2 ? 'active' : ''}`}
              >
                <span className="name">💞 {c.name}</span>
                <span className="muted">
                  {c.memberIds.map(memberName).join(' & ')}
                  {c.memberIds.length < 2 ? ' (eş bekliyor…)' : ' ✓'}
                </span>
              </div>
            ))}
          </div>
          {ungrouped.length > 0 && (
            <p className="muted" style={{ marginTop: 12 }}>
              Çift kurmayanlar: {ungrouped.map((p) => p.name).join(', ')}
            </p>
          )}
        </div>

        <div className="card stack" style={{ width: '100%', maxWidth: 720 }}>
          <h3>📱 Bu cihazdan ben de oynayacağım</h3>
          <p className="muted">
            Ayrı ekranın yoksa: adını yaz, bu cihaz hem pano hem senin oyuncun
            olsun. Eşin de kendi telefonundan kodla girip çiftine katılır.
          </p>
          <div className="row">
            <input
              className="input"
              placeholder="Adın"
              value={hostName}
              maxLength={24}
              onChange={(e) => setHostName(e.target.value)}
            />
            <button
              className="btn"
              disabled={hostName.trim().length < 1}
              onClick={() => hostPlayHere(hostName.trim())}
            >
              Oynamaya katıl
            </button>
          </div>
        </div>

        <button
          className="btn btn--accent btn--lg"
          disabled={!canStart}
          onClick={hostStart}
        >
          Oyunu Başlat ▶
        </button>
        {!canStart && (
          <p className="muted">
            Başlamak için en az 1 çift olmalı ve her çift tam 2 kişi olmalı.
          </p>
        )}
        <button className="btn btn--ghost" onClick={goHome}>
          Çık
        </button>
      </div>
    </div>
  );
}
