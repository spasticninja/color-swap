import * as React from 'react';
import { demoGame } from '../../data/sample-game';
import { gameBoardsBase } from '../../data/game-boards';
import Gradient from 'javascript-color-gradient';

type tGameContext = {
  gameBoard: Array<Array<string>>;
  gameName: string;
  swapClear: boolean;
  updateGameBoard: Function;
}

const GameContext = React.createContext<tGameContext>(null);

export default GameContext;

const generateBoard = (colorArray: Array<string>): Array<Array<string>> => {
  const topRow = new Gradient;
  const bottomRow = new Gradient;
  let board = [];

  topRow.setGradient(colorArray[0], colorArray[1]);
  topRow.setMidpoint(9);
  bottomRow.setGradient(colorArray[2], colorArray[3]);
  bottomRow.setMidpoint(9);

  for (let i = 0; i < 9; i ++) {
    const columnGradient = new Gradient;
    columnGradient.setGradient(topRow.getColor(i+1), bottomRow.getColor(i+1));
    board.push(columnGradient.getArray());
  }
  
  return board;
}

export const GameContextProvider = ({children}) => {
  const [gameBoard, setGameBoard] = React.useState<Array<Array<string>>>(
    generateBoard(gameBoardsBase[1].colors)
  );
  const [gameSolution, setGameSolution] = React.useState<Array<Array<string>>>(
    generateBoard(gameBoardsBase[1].colors)
  );
  const [gameName, setGameName] = React.useState(gameBoardsBase[1].name);
  const [swapClear, setSwapClear] = React.useState(false);
  const [point1, setPoint1] = React.useState([-1,-1]); // -1 indicates no selection

  // React.useEffect(() => {
  //   // initial render
  //   const initialGameBoard = generateBoard(gameBoardsBase[0].colors);
  //   setGameName(gameBoardsBase[0].name);
  //   setGameBoard(initialGameBoard);
  //   setGameSolution(initialGameBoard);
  // }, []);

  React.useEffect(() => {
    setTimeout(() => {
      // auto switches to false for the next pairing
      setSwapClear(false);
    }, 200)
  }, [swapClear])

  const updateGameBoard = (x, y) => {
    if (point1[0] === -1 && point1[1] === -1) {
      // set first point
      setPoint1([x, y]);
    } else if (point1[0] === x && point1[1] === y) {
      // unselect first point
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
      setSwapClear(true);

      point1[0] = -1;
      point1[1] = -1;
    }
  }

  return (
    <GameContext.Provider
      value={{
        gameBoard,
        gameName,
        swapClear,
        updateGameBoard
      }}
    >
      {children}
    </GameContext.Provider>
  )
}