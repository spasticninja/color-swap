import { render, screen } from '@testing-library/react';
import Home from './home';
import GameContext from '../context/gameContext';
import { tGameTile } from '../components/global';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}));

describe('Home', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  const solvedBoard: tGameTile[][] = [[{
    color: '#ffffff',
    isCorrect: true,
    isLocked: false,
    correctCoord: [0, 0]
  }]];

  const unsolvedBoard: tGameTile[][] = [[{
    color: '#ffffff',
    isCorrect: false,
    isLocked: false,
    correctCoord: [0, 1]
  }]];

  it('shows a new game label when no saved game exists', () => {
    render(
      <GameContext.Provider
        value={{
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
          startNewGame: () => true,
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove: () => {}
        }}
      >
        <Home />
      </GameContext.Provider>
    );

    expect(screen.getByRole('button', { name: 'Start a new game' })).toBeInTheDocument();
  });

  it('shows a continue label when a saved game exists', () => {
    window.localStorage.setItem('color-swap-game', JSON.stringify({
      gameName: 'Saved',
      gameSlug: 'saved-game',
      gameBoard: unsolvedBoard
    }));

    render(
      <GameContext.Provider
        value={{
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
          startNewGame: () => true,
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove: () => {}
        }}
      >
        <Home />
      </GameContext.Provider>
    );

    expect(screen.getByRole('button', { name: 'Continue playing' })).toBeInTheDocument();
  });

  it('clears solved games when landing on the root url', () => {
    window.localStorage.setItem('color-swap-game', JSON.stringify({
      gameName: 'Solved',
      gameSlug: 'solved-game',
      gameBoard: solvedBoard
    }));

    render(
      <GameContext.Provider
        value={{
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
          startNewGame: () => true,
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove: () => {}
        }}
      >
        <Home />
      </GameContext.Provider>
    );

    expect(screen.getByRole('button', { name: 'Start a new game' })).toBeInTheDocument();
    expect(window.localStorage.getItem('color-swap-game')).toBeNull();
  });
});
