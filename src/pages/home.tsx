import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import useCheckSolution from '../hooks/useCheckSolution';
import { useHistory } from "react-router-dom";

const STORAGE_KEY = 'color-swap-game';

const Home = () => {
  const { openGame } = React.useContext(GameContext);
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

  return (
    <>
      <TitleBar title="Color Swap"></TitleBar>
      <h2>Welcome to Color Swap!</h2>
      <p>Rules are simple. Select one tile and then select a second to swap them. You can select the same tile again to unselect it. The tiles with the dots are unclickable and unswapable, but that's fine, they're already in the right place!</p>
      <p>Have fun!</p>
      <button onClick={startGame}>{hasSavedGame ? 'Continue playing' : 'Start a new game'}</button>
    </>
  );
};

export default Home;
