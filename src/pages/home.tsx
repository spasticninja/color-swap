import * as React from 'react';
import { gameSizeOptions } from '../config/gameOptions';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import useCheckSolution from '../hooks/useCheckSolution';
import { useHistory } from "react-router-dom";

const STORAGE_KEY = 'color-swap-game';

const Home = () => {
  const { boardSize, openGame, setBoardSize, startNewGame } = React.useContext(GameContext);
  const history = useHistory();
  const [hasSavedGame, setHasSavedGame] = React.useState(false);

  React.useEffect(() => {
    const savedGameRaw = window.localStorage.getItem(STORAGE_KEY);
    if (!savedGameRaw) {
      setHasSavedGame(false);
      return;
    }

    const savedGame = JSON.parse(savedGameRaw) as { gameBoard?: Parameters<typeof useCheckSolution>[0] };
    if (savedGame.gameBoard && useCheckSolution(savedGame.gameBoard) === 0) {
      window.localStorage.removeItem(STORAGE_KEY);
      setHasSavedGame(false);
      return;
    }

    setHasSavedGame(true);
  }, []);

  const startGame = () => {
    openGame();
    history.push('/game');
  };

  const startFreshGame = () => {
    startNewGame();
    history.push('/game');
  };

  return (
    <main className="panel-page home-page">
      <TitleBar title="Color Swap"></TitleBar>
      <section className="panel-card intro-card">
        <p className="panel-eyebrow">{hasSavedGame ? 'Puzzle in progress' : 'A quick browser puzzle'}</p>
        <h2>Welcome to Color Swap!</h2>
        <p>Swap two color tiles at a time until the full gradient locks back into place.</p>
        <p>Select one tile, then another, and watch the palette snap toward the solution. Corner dots mark the fixed anchor tiles that cannot be moved.</p>
        <div className="game-options">
          <p className="game-options-label">Board size</p>
          <div className="size-options" role="radiogroup" aria-label="Board size">
            {gameSizeOptions.map(option => {
              const isSelected = option.id === boardSize.id;

              return (
                <button
                  aria-checked={isSelected}
                  className={`size-option${isSelected ? ' selected' : ''}`}
                  key={option.id}
                  onClick={() => setBoardSize(option)}
                  role="radio"
                  type="button"
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="page-actions">
          {hasSavedGame ? (
            <>
              <button className="secondary-action" onClick={startGame}>Continue playing</button>
              <button className="primary-action" onClick={startFreshGame}>Start a new game</button>
            </>
          ) : (
            <button className="primary-action" onClick={startGame}>Start a new game</button>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;
