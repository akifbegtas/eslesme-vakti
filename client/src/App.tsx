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
      {content}
      {error && <Toast message={error} onClose={clearError} />}
    </div>
  );
}
