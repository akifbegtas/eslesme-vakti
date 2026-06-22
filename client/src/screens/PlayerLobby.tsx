import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useGame } from '../store';

export function PlayerLobby() {
  const {
    snapshot,
    playerId,
    myCoupleId,
    isHost,
    code,
    createCouple,
    joinCouple,
    leaveCouple,
    hostStart,
    goHome,
  } = useGame();
  const [coupleName, setCoupleName] = useState('');

  if (!snapshot)
    return (
      <div className="screen center-col">
        <p className="muted">Bağlanılıyor…</p>
      </div>
    );

  const me = snapshot.players.find((p) => p.id === playerId);
  const myCouple = snapshot.couples.find((c) => c.id === myCoupleId);
  const memberName = (id: string) =>
    snapshot.players.find((p) => p.id === id)?.name ?? '—';
  const openCouples = snapshot.couples.filter(
    (c) => c.memberIds.length < 2 && c.id !== myCoupleId
  );

  return (
    <div className="screen screen--narrow center-col">
      <span className="pill">Oda {code}</span>
      <h2>Merhaba {me?.name ?? ''} 👋</h2>

      {isHost && (
        <div
          className="card stack"
          style={{ width: '100%', alignItems: 'center' }}
        >
          <span className="muted">Eşin bu QR ya da kod ile girsin 👇</span>
          <div className="qr-box">
            <QRCodeSVG
              value={`${window.location.origin}${import.meta.env.BASE_URL}?code=${code}`}
              size={150}
            />
          </div>
          <div className="code-big" style={{ fontSize: 52 }}>
            {code}
          </div>
        </div>
      )}

      {myCouple ? (
        <div className="card stack" style={{ width: '100%' }}>
          <h3>💞 {myCouple.name}</h3>
          <p className="muted">{myCouple.memberIds.map(memberName).join(' & ')}</p>
          {myCouple.memberIds.length < 2 ? (
            <p className="muted">Eşinin katılması bekleniyor…</p>
          ) : (
            <p style={{ color: 'var(--good)', fontWeight: 700 }}>
              Hazırsınız! Ana ekrandan oyunun başlamasını bekleyin 💫
            </p>
          )}
          <button className="btn btn--ghost" onClick={leaveCouple}>
            Çiftten Ayrıl
          </button>
        </div>
      ) : (
        <>
          <div className="card stack" style={{ width: '100%' }}>
            <h3>Yeni çift kur</h3>
            <input
              className="input"
              placeholder="Çift adı (örn. Ayşe & Mehmet)"
              value={coupleName}
              maxLength={24}
              onChange={(e) => setCoupleName(e.target.value)}
            />
            <button
              className="btn btn--accent btn--block"
              onClick={() => createCouple(coupleName || 'Bizim Çift')}
            >
              Çift Oluştur
            </button>
          </div>

          {openCouples.length > 0 && (
            <div className="card stack" style={{ width: '100%' }}>
              <h3>Eşine katıl</h3>
              {openCouples.map((c) => (
                <button
                  key={c.id}
                  className="btn btn--block"
                  onClick={() => joinCouple(c.id)}
                >
                  {c.name} — {c.memberIds.map(memberName).join(', ')} (katıl)
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {isHost && (
        <>
          <button
            className="btn btn--accent btn--lg btn--block"
            disabled={
              !(
                snapshot.couples.length >= 1 &&
                snapshot.couples.every((c) => c.memberIds.length === 2)
              )
            }
            onClick={hostStart}
          >
            Oyunu Başlat ▶
          </button>
          <p className="muted">Herkes çiftini kurunca başlat.</p>
        </>
      )}

      <button className="btn btn--ghost" onClick={goHome}>
        Çık
      </button>
    </div>
  );
}
