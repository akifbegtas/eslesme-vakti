import { useEffect } from 'react';
import { useGame } from './store';
import { Home } from './screens/Home';
import { HostLobby } from './screens/HostLobby';
import { HostGame } from './screens/HostGame';
import { PlayerLobby } from './screens/PlayerLobby';
import { PlayerGame } from './screens/PlayerGame';

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [message, onClose]);
  return <div className="toast">{message}</div>;
}

export function App() {
  const { role, snapshot, error, clearError } = useGame();

  let content;
  if (role === 'home') {
    content = <Home />;
  } else if (role === 'host') {
    content =
      !snapshot || snapshot.status === 'lobby' ? <HostLobby /> : <HostGame />;
  } else {
    content =
      !snapshot || snapshot.status === 'lobby' ? <PlayerLobby /> : <PlayerGame />;
  }

  return (
    <div className="app">
      <div className="rotate-hint">
        <div className="rotate-hint__icon">📱</div>
        <h2>Telefonu yan çevir</h2>
        <p>Eşleşme Vakti yatay (yan) modda oynanır 🔄</p>
      </div>
      {content}
      {error && <Toast message={error} onClose={clearError} />}
    </div>
  );
}
