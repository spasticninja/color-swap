import * as React from 'react';
import Home from './pages/home';
import Game from './pages/game';
import Win from './pages/win';
import { GameContextProvider } from './context/gameContext';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";

import './app.scss';

const App = () => {

  return (
    <div className="color-swap-wrapper">
      <Router>
        <GameContextProvider>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/win">
              <Win />
            </Route>
            <Route path="/game">
              <Game />
            </Route>
          </Switch>
        </GameContextProvider>
      </Router>
    </div>
  );
}

export default App;