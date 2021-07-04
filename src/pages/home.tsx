import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import { useHistory } from "react-router-dom";

const Home = () => {
  const { gameBoard, gameName } = React.useContext(GameContext);
  const history = useHistory();

  const startGame = () => {
    history.push('/game');
  }

  return (
    <React.Fragment>
      <TitleBar title="Color Swap"></TitleBar>
      <h2>Welcome to Color Swap!</h2>
      <p>Rules are simple. Select one tile and then select a second to swap them. The tiles with the dots are unclickable and unswapanle, but that's fine. They are already in the right place.</p>
      <button onClick={startGame}>Get to playing!</button>
    </React.Fragment>
  )
}

export default Home;