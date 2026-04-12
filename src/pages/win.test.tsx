import { fireEvent, render, screen } from '@testing-library/react';
import Win from './win';
import GameContext from '../context/gameContext';

const push = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push
  })
}));

describe('Win', () => {
  beforeEach(() => {
    push.mockClear();
  });

  it('clears the saved game when the win screen loads', () => {
    const clearSavedGame = jest.fn();

    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: 'Solved Puzzle',
          gameSlug: 'solved-puzzle',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          openGame: () => 'loaded',
          startNewGame: () => true,
          clearSavedGame
        }}
      >
        <Win />
      </GameContext.Provider>
    );

    expect(clearSavedGame).toHaveBeenCalledTimes(1);
  });

  it('starts a fresh game from the win screen', () => {
    const startNewGame = jest.fn();

    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: 'Solved Puzzle',
          gameSlug: 'solved-puzzle',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          openGame: () => 'loaded',
          startNewGame,
          clearSavedGame: () => {}
        }}
      >
        <Win />
      </GameContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Try another puzzle' }));

    expect(startNewGame).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/game');
  });
});
