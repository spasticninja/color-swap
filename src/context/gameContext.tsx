import * as React from 'react';
import { getGameBoardBySlug, getRandomGameBoard } from '../../data/game-boards';
import useGenerateBoard from '../hooks/useGenerateBoard';
import useGameScramble from '../hooks/useGameScramble';
import useCheckSolution from '../hooks/useCheckSolution';
import { tGameTile } from '../components/global';
import { useHistory } from "react-router-dom";

const STORAGE_KEY = 'color-swap-game';
const REPLACE_GAME_MESSAGE = 'You already have an unfinished game in progress. Do you want to switch to the shared game link? Your current game will be reset.';

type tSavedGame = {
  gameBoard: tGameTile[][];
  gameName: string;
  gameSlug: string;
};

type tOpenGameResult = 'loaded' | 'missing' | 'rejected';
type tHintTiles = [[number, number], [number, number]] | null;

const cloneGameBoard = (gameBoard: tGameTile[][]): tGameTile[][] => (
  gameBoard.map(column => column.map(tile => ({
    ...tile,
    correctCoord: [...tile.correctCoord] as [number, number]
  })))
);

const logIncorrectTiles = (gameBoard: tGameTile[][], history: ReturnType<typeof useHistory>) => {
  const incorrectTiles = useCheckSolution(gameBoard);
  if (incorrectTiles === 0) {
    history.push('/win');
  } else {
    console.log('incorrect tiles: ', incorrectTiles);
  }
};

type tGameContext = {
  gameBoard?: tGameTile[][];
  gameName: string;
  gameSlug: string;
  swapClear: boolean;
  hasSelectedTile: boolean;
  canUndo: boolean;
  selectedTile: [number, number] | null;
  hintTiles: tHintTiles;
  updateGameBoard: (x: number, y: number) => void;
  openGame: (slug?: string) => tOpenGameResult;
  startNewGame: (slug?: string) => boolean;
  clearSavedGame: () => void;
  showHint: () => void;
  undoMove: () => void;
};

const GameContext = React.createContext<tGameContext>({
  gameBoard: undefined,
  gameName: '',
  gameSlug: '',
  swapClear: false,
  hasSelectedTile: false,
  canUndo: false,
  selectedTile: null,
  hintTiles: null,
  updateGameBoard: () => {},
  openGame: () => 'loaded',
  startNewGame: () => false,
  clearSavedGame: () => {},
  showHint: () => {},
  undoMove: () => {}
});

export default GameContext;

type GameContextProviderProps = {
  children: React.ReactNode;
};

export const GameContextProvider = ({ children }: GameContextProviderProps) => {
  const [gameBoard, setGameBoard] = React.useState<tGameTile[][] | undefined>();
  const [gameName, setGameName] = React.useState('');
  const [gameSlug, setGameSlug] = React.useState('');
  const [swapClear, setSwapClear] = React.useState(false);
  const [point1, setPoint1] = React.useState<[number, number]>([-1, -1]); // -1 indicates no selection
  const [hintTiles, setHintTiles] = React.useState<tHintTiles>(null);
  const [undoBoard, setUndoBoard] = React.useState<tGameTile[][] | null>(null);
  const history = useHistory();
  const hasSelectedTile = point1[0] !== -1 && point1[1] !== -1;
  const canUndo = Boolean(undoBoard);

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

  const clearSavedGame = () => {
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const clearActiveSelection = () => {
    setPoint1([-1, -1]);
    setSwapClear(false);
    setHintTiles(null);
  };

  const resetUndoState = () => {
    setUndoBoard(null);
  };

  const readSavedGame = (): tSavedGame | null => {
    const savedGameRaw = window.localStorage.getItem(STORAGE_KEY);
    if (!savedGameRaw) {
      return null;
    }

    const savedGame = JSON.parse(savedGameRaw) as Partial<tSavedGame>;
    if (!savedGame.gameName || !savedGame.gameSlug || !savedGame.gameBoard) {
      return null;
    }

    return savedGame as tSavedGame;
  };

  const updateLocalStorage = () => {
    if (gameName && gameSlug && gameBoard) {
      const newGameStatus = {
        gameName: gameName,
        gameSlug: gameSlug,
        gameBoard: gameBoard,
      };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(newGameStatus));
    }
  };

  const showHint = () => {
    if (!gameBoard) {
      return;
    }

    for (let x = 0; x < gameBoard.length; x++) {
      for (let y = 0; y < gameBoard[x].length; y++) {
        const tile = gameBoard[x][y];
        if (!tile.isLocked && (tile.correctCoord[0] !== x || tile.correctCoord[1] !== y)) {
          setHintTiles([[x, y], tile.correctCoord]);
          return;
        }
      }
    }

    setHintTiles(null);
  };

  const loadSavedGame = (savedGame: tSavedGame) => {
    setGameName(savedGame.gameName);
    setGameSlug(savedGame.gameSlug);
    setGameBoard(cloneGameBoard(savedGame.gameBoard));
    clearActiveSelection();
    resetUndoState();
  };

  const createNewGame = (slug?: string): boolean => {
    const boardConfig = slug ? getGameBoardBySlug(slug) : getRandomGameBoard();
    if (!boardConfig) {
      return false;
    }

    const initGameBoard = useGenerateBoard(boardConfig.colors, 9, 10);
    // TODO: difficulty mode via game board size

    setGameName(boardConfig.name);
    setGameSlug(boardConfig.slug);
    setGameBoard(useGameScramble(initGameBoard));
    clearActiveSelection();
    resetUndoState();
    return true;
  };

  const openGame = (slug?: string): tOpenGameResult => {
    if (slug && gameBoard && gameSlug === slug) {
      return 'loaded';
    }

    const savedGame = readSavedGame();

    if (!slug) {
      if (savedGame) {
        loadSavedGame(savedGame);
        return 'loaded';
      }

      createNewGame();
      return 'loaded';
    }

    if (!getGameBoardBySlug(slug)) {
      return 'missing';
    }

    if (savedGame?.gameSlug === slug) {
      loadSavedGame(savedGame);
      return 'loaded';
    }

    if (savedGame && savedGame.gameSlug !== slug && !window.confirm(REPLACE_GAME_MESSAGE)) {
      return 'rejected';
    }

    clearSavedGame();
    createNewGame(slug);
    return 'loaded';
  };

  const startNewGame = (slug?: string): boolean => {
    clearSavedGame();
    return createNewGame(slug);
  };

  const undoMove = () => {
    if (!canUndo || !undoBoard) {
      return;
    }

    const restoredBoard = cloneGameBoard(undoBoard);
    setGameBoard(restoredBoard);
    clearActiveSelection();
    setUndoBoard(null);
    logIncorrectTiles(restoredBoard, history);
  };

  const updateGameBoard = (x: number, y: number) => {
    if (!gameBoard) {
      return;
    }

    setHintTiles(null);

    if (point1[0] === -1 && point1[1] === -1) {
      // set first point
      setPoint1([x, y]);
      return;
    } else if (point1[0] === x && point1[1] === y) {
      // unselect first point
      setPoint1([-1, -1]);
      return;
    } else {
      // swap scenario
      const currentBoard = cloneGameBoard(gameBoard);
      setUndoBoard(cloneGameBoard(gameBoard));
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
      clearActiveSelection();
      logIncorrectTiles(currentBoard, history);
    }
  };

  return (
    <GameContext.Provider
      value={{
        gameBoard,
        gameName,
        gameSlug,
        swapClear,
        hasSelectedTile,
        canUndo,
        selectedTile: hasSelectedTile ? point1 : null,
        hintTiles,
        updateGameBoard,
        openGame,
        startNewGame,
        clearSavedGame,
        showHint,
        undoMove
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
