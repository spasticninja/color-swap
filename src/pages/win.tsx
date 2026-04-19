import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import { useHistory } from "react-router-dom";

const Win = () => {
  const { gameName, startNewGame } = React.useContext(GameContext);
  const history = useHistory();
  const solvedMessage = gameName ? `You solved "${gameName}".` : 'You solved the puzzle.';

  const onNewGame = () => {
    startNewGame();
    history.push('/game');
  };
  
  return(
    <main className="panel-page win-page">
      <TitleBar title="Color Swap"></TitleBar>
      <section className="panel-card celebration-card">
        <p className="panel-eyebrow">Puzzle completed</p>
        <h2>Congratulations!</h2>
        <p>{solvedMessage}</p>
        <div className="page-actions">
          <button className="primary-action" onClick={onNewGame}>Try another puzzle</button>
        </div>
      </section>
      <div className="footer panel-card panel-card--subtle">
        <p>This game was created by SpasticNinja. Feel free to checkout the <a href="https://github.com/spasticninja/color-swap" rel="nofollow noopener" target="_blank">code behind this project!</a></p>
      </div>
    </main>
  );
};

export default Win;
