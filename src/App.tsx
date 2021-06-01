import * as React from 'react';
import GameGrid from './components/GameGrid/GameGrid';
import TitleBar from './components/TitleBar/TitleBar';
import { GameContextProvider } from './context/gameContext';

import './app.scss';

const App = () => {
  const _appName:string = 'Color Swap';

  return (
    <div className="color-swap-wrapper">
      <GameContextProvider>
        <TitleBar title={_appName}></TitleBar>
        <GameGrid></GameGrid>
      </GameContextProvider>
    </div>
  );
}

export default App;