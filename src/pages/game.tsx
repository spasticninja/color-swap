import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import GameGrid from '../components/GameGrid/GameGrid';

const Game = () => {
  const { gameBoard, gameName } = React.useContext(GameContext);
  return (
    <React.Fragment>
      <TitleBar title="Color Swap"></TitleBar>
      <GameGrid></GameGrid>
    </React.Fragment>
  )
}

export default Game;