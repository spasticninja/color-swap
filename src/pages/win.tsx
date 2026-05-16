import * as React from 'react';
import GameContext from '../context/gameContext';
import GameSetupModal from '../components/GameSetup/GameSetupModal';
import TitleBar from '../components/TitleBar/TitleBar';

const Win = () => {
  const { gameName } = React.useContext(GameContext);
  const [isGameSetupOpen, setIsGameSetupOpen] = React.useState(false);
  const solvedMessage = gameName ? `You solved "${gameName}".` : 'You solved the puzzle.';
  
  return(
    <main className="panel-page win-page">
      <TitleBar title="Color Swap"></TitleBar>
      <section className="panel-card celebration-card">
        <p className="panel-eyebrow">Puzzle completed</p>
        <h2>Congratulations!</h2>
        <p>{solvedMessage}</p>
        <div className="page-actions">
          <button className="primary-action" onClick={() => setIsGameSetupOpen(true)} type="button">Choose another puzzle</button>
        </div>
      </section>
      <GameSetupModal isOpen={isGameSetupOpen} onClose={() => setIsGameSetupOpen(false)} />
      <div className="footer panel-card panel-card--subtle">
        <p>This game was created by SpasticNinja. Feel free to checkout the <a href="https://github.com/spasticninja/color-swap" rel="nofollow noopener" target="_blank">code behind this project!</a></p>
      </div>
    </main>
  );
};

export default Win;
