import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import GameGrid from '../components/GameGrid/GameGrid';

const Game = () => {
  const { gameBoard, initGame } = React.useContext(GameContext);
  
  React.useEffect(() => {
    if (!gameBoard) {
      // check to see we have a valid game first
      initGame();
    }
  }, []);

  return (
    <>
      <TitleBar title="Color Swap" showTitle></TitleBar>
      <GameGrid></GameGrid>
    </>
  )
}

export default Game;