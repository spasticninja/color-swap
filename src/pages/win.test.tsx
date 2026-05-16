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

  it('starts a fresh game from the win screen', () => {
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

    fireEvent.click(screen.getByRole('button', { name: 'Try another puzzle' }));

    expect(startNewGame).toHaveBeenCalledTimes(1);
    expect(push).toHaveBeenCalledWith('/game');
  });
});
