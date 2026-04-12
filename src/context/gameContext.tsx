import * as React from 'react';
import { gameBoardsBase } from '../../data/game-boards';
import useGenerateBoard from '../hooks/useGenerateBoard';
import useGameScramble from '../hooks/useGameScramble';
import useCheckSolution from '../hooks/useCheckSolution';
import { tGameTile } from '../components/global';
import { useHistory } from "react-router-dom";

type tGameContext = {
  gameBoard?: tGameTile[][];
  gameName: string;
  swapClear: boolean;
  updateGameBoard: (x: number, y: number) => void;
  initGame: () => void;
};

const GameContext = React.createContext<tGameContext>({
  gameBoard: undefined,
  gameName: '',
  swapClear: false,
  updateGameBoard: () => {},
  initGame: () => {}
});

export default GameContext;

type GameContextProviderProps = {
  children: React.ReactNode;
};

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const [gameBoard, setGameBoard] = React.useState<tGameTile[][] | undefined>();
  const [gameName, setGameName] = React.useState('');
  const [swapClear, setSwapClear] = React.useState(false);
  const [point1, setPoint1] = React.useState<[number, number]>([-1, -1]); // -1 indicates no selection
  const history = useHistory();

  React.useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      // auto switches to false for the next pairing
      setSwapClear(false);
    }, 200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [swapClear]);

  React.useEffect(() => {
    updateLocalStorage();
  }, [gameBoard, gameName]);

  const updateLocalStorage = () => {
    if (gameName && gameBoard) {
      const newGameStatus = {
        gameName: gameName,
        gameBoard: gameBoard,
      };
      window.localStorage.setItem('color-swap-game', JSON.stringify(newGameStatus));
    }
  };

  const initGame = () => {
    const savedGameRaw = window.localStorage.getItem('color-swap-game');
    const savedGame = savedGameRaw ? JSON.parse(savedGameRaw) : null;

    if (savedGame && savedGame.gameName && savedGame.gameBoard) {
      setGameName(savedGame.gameName);
      setGameBoard(savedGame.gameBoard);
    } else {
      const numBoards = gameBoardsBase.length;
      const randomIndex = Math.floor(Math.random() * (numBoards - 1));
      const initGameBoard = useGenerateBoard(gameBoardsBase[randomIndex].colors, 9, 10); 
      // TODO: difficulty mode via game board size

      setGameName(gameBoardsBase[randomIndex].name); 
      setGameBoard(useGameScramble(initGameBoard));
    }
  };

  const updateGameBoard = (x: number, y: number) => {
    if (!gameBoard) {
      return;
    }

    if (point1[0] === -1 && point1[1] === -1) {
      // set first point
      setPoint1([x, y]);
    } else if (point1[0] === x && point1[1] === y) {
      // unselect first point
      setPoint1([-1, -1]);
    } else {
      // swap scenario
      const currentBoard = [...gameBoard];
      const point1Val = currentBoard[point1[0]][point1[1]];
      const point2Val = currentBoard[x][y];
      
      if (point2Val.correctCoord[0] === point1[0] && point2Val.correctCoord[1] === point1[1]) {
        point2Val.isCorrect = true
      } else {
        point2Val.isCorrect = false;
      }

      if (point1Val.correctCoord[0] === x && point1Val.correctCoord[1] === y) {
        point1Val.isCorrect = true
      } else {
        point1Val.isCorrect = false;
      }
      
      currentBoard[point1[0]][point1[1]] = currentBoard[x][y];
      currentBoard[x][y] = point1Val;

      setGameBoard(currentBoard);
      setSwapClear(true);

      setPoint1([-1, -1]);
    }

    const incorrectTiles = useCheckSolution(gameBoard);
    if (incorrectTiles === 0) {
      // winning condition
      history.push('/win');
    } else {
      console.log('incorrect tiles: ', incorrectTiles);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameBoard,
        gameName,
        swapClear,
        updateGameBoard,
        initGame
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
