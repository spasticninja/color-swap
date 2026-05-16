import { fireEvent, render, screen } from '@testing-library/react';
import { defaultDifficultyPreference, defaultGameSizeOption } from '../config/gameOptions';
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

  it('opens the chooser modal from the win screen and starts a fresh game', () => {
    const startNewGame = jest.fn();

    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: 'Solved Puzzle',
          gameSlug: 'solved-puzzle',
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame: () => 'loaded',
          startNewGame,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove: () => {}
        }}
      >
        <Win />
      </GameContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Choose another puzzle' }));
    expect(screen.getByRole('dialog', { name: 'Choose your next game' })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Start selected game' }));

    expect(startNewGame).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/game');
  });
});
