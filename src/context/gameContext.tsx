import * as React from 'react';
import { demoGame } from '../../data/sample-game';

type tGameContext = {
  gameBoard: Array<Array<string>>;
  updateGameBoard: Function;
}

const GameContext = React.createContext<tGameContext>(null);

export default GameContext;

export const GameContextProvider = ({children}) => {
  const [gameBoard, setGameBoard] = React.useState<Array<Array<string>>>(demoGame);
  const [point1, setPoint1] = React.useState([-1,-1]); // -1 indicates no selection

  const updateGameBoard = (x, y) => {
    if (point1[0] === -1 && point1[1] === -1) {
      // set point
      setPoint1([x, y]);
    } else if (point1[0] === x && point1[1] === y) {
      // unselect
      point1[0] = -1;
      point1[1] = -1;
    } else {
      // swap scenario
      let currentBoard = [...gameBoard];
      let point1Val = gameBoard[point1[0]][point1[1]];
      console.log(point1Val);
      
      currentBoard[point1[0]][point1[1]] = currentBoard[x][y];
      currentBoard[x][y] = point1Val;
      setGameBoard(currentBoard);

      point1[0] = -1;
      point1[1] = -1;
    }
  }

  return (
    <GameContext.Provider
      value={{
        gameBoard,
        updateGameBoard
      }}
    >
      {children}
    </GameContext.Provider>
  )
}