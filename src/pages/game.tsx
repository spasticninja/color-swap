import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import GameGrid from '../components/GameGrid/GameGrid';

const Game = () => {
  const { gameBoard, gameName } = React.useContext(GameContext);
  return (
    <>
      <TitleBar title="Color Swap" showTitle></TitleBar>
      <GameGrid></GameGrid>
    </>
  )
}

export default Game;