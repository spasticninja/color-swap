import { render, screen } from '@testing-library/react';
import Home from './home';
import GameContext from '../context/gameContext';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn()
  })
}));

describe('Home', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('shows a new game label when no saved game exists', () => {
    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: '',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          initGame: () => {},
          startNewGame: () => {},
          clearSavedGame: () => {}
        }}
      >
        <Home />
      </GameContext.Provider>
    );

    expect(screen.getByRole('button', { name: 'Start a new game' })).toBeInTheDocument();
  });

  it('shows a continue label when a saved game exists', () => {
    window.localStorage.setItem('color-swap-game', JSON.stringify({ gameName: 'Saved', gameBoard: [] }));

    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: '',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          initGame: () => {},
          startNewGame: () => {},
          clearSavedGame: () => {}
        }}
      >
        <Home />
      </GameContext.Provider>
    );

    expect(screen.getByRole('button', { name: 'Continue playing' })).toBeInTheDocument();
  });
});
