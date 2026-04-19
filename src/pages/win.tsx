import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import { useHistory } from "react-router-dom";

const Win = () => {
  const { gameName, startNewGame } = React.useContext(GameContext);
  const history = useHistory();

  const onNewGame = () => {
    startNewGame();
    history.push('/game');
  };
  
  return(
    <>
      <TitleBar title="Color Swap"></TitleBar>
      <h2>Congratulations!</h2>
      <p>You solved "{gameName}".</p>
      <button onClick={onNewGame}>Try another puzzle</button>
      <div className="footer">
        <p>This game was created by SpasticNinja. Feel free to checkout the <a href="https://github.com/spasticninja/color-swap" rel="nofollow noopener" target="_blank">code behind this project!</a></p>
      </div>
    </>
  );
};

export default Win;
