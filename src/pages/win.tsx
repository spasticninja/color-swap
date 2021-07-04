import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';

const Win = () => {
  const { gameName } = React.useContext(GameContext);

  const onNewGame = () => {
    console.log('new puzzle button');
  }
  
  return(
    <>
      <TitleBar title="Color Swap"></TitleBar>
      <h2>Congratulations!</h2>
      <p>You solved "{gameName}".</p>
      <p>This game was created by SpasticNinja. Feel free to checkout the <a href="https://github.com/spasticninja/color-swap" rel="nofollow noopener" target="_blank">code behind this project!</a></p>
      <button onClick={onNewGame}>Try another puzzle</button>
    </>
  );
}

export default Win;