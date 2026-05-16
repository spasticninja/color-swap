import * as React from 'react';
import { useHistory } from 'react-router-dom';
import GameContext from '../../context/gameContext';
import GameSetupOptions from './GameSetupOptions';

type GameSetupModalProps = {
  isOpen: boolean;
  onClose: () => void;
  showCopyLink?: boolean;
};

const GameSetupModal = ({ isOpen, onClose, showCopyLink = false }: GameSetupModalProps) => {
  const { startNewGame } = React.useContext(GameContext);
  const history = useHistory();

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  const startSelectedGame = () => {
    startNewGame();
    onClose();
    history.push('/game');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
    >
      <section
        aria-labelledby="game-setup-modal-title"
        aria-modal="true"
        className="modal-card panel-card"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
      >
        <div className="modal-header">
          <div>
            <p className="panel-eyebrow">Puzzle setup</p>
            <h2 id="game-setup-modal-title">Choose your next game</h2>
          </div>
          <button aria-label="Close game setup" className="modal-close-button" onClick={onClose} type="button">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>
        <GameSetupOptions />
        <div className="page-actions modal-actions">
          {showCopyLink ? (
            <button className="secondary-action" onClick={copyToClipboard} type="button">Copy game link</button>
          ) : null}
          <button className="secondary-action" onClick={onClose} type="button">Cancel</button>
          <button className="primary-action" onClick={startSelectedGame} type="button">Start selected game</button>
        </div>
      </section>
    </div>
  );
};

export default GameSetupModal;
