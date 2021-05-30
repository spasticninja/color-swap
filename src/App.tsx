import GameGrid from './components/GameGrid/GameGrid';
import TitleBar from './components/TitleBar/TitleBar';

import { demoGame } from '../data/sample-game';
import './app.scss';

const App = () => {
  const _appName:string = 'Color Swap';

  return (
    <div className="color-swap-wrapper">
      <TitleBar title={_appName} subtitle="test"></TitleBar>
      <GameGrid tileColumns={demoGame}></GameGrid>
    </div>
  );
}

export default App;