import { fireEvent, render, screen } from '@testing-library/react';
import GameTile from './GameTile';
import GameContext from '../../context/gameContext';
import { tGameTile } from '../global';

const tile: tGameTile = {
  color: '#ffffff',
  isCorrect: true,
  isLocked: false,
  correctCoord: [0, 0]
};

describe('GameTile', () => {
  it('shows selected state for the active tile', () => {
    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: '',
          swapClear: false,
          hasSelectedTile: true,
          selectedTile: [0, 0],
          updateGameBoard: () => {},
          initGame: () => {},
          startNewGame: () => {},
          clearSavedGame: () => {}
        }}
      >
        <GameTile tile={tile} xCoord={0} yCoord={0} />
      </GameContext.Provider>
    );

    expect(screen.getByRole('button')).toHaveClass('selected');
    expect(screen.getByText('Tile selected')).toBeInTheDocument();
  });

  it('shows the swap prompt only after another tile is selected', () => {
    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: '',
          swapClear: false,
          hasSelectedTile: true,
          selectedTile: [1, 1],
          updateGameBoard: () => {},
          initGame: () => {},
          startNewGame: () => {},
          clearSavedGame: () => {}
        }}
      >
        <GameTile tile={tile} xCoord={0} yCoord={0} />
      </GameContext.Provider>
    );

    expect(screen.getByRole('button')).toHaveClass('swap-ready');
    expect(screen.getByText('Swap with selected tile')).toBeInTheDocument();
  });

  it('calls updateGameBoard when clicked', () => {
    const updateGameBoard = jest.fn();

    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: '',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard,
          initGame: () => {},
          startNewGame: () => {},
          clearSavedGame: () => {}
        }}
      >
        <GameTile tile={tile} xCoord={2} yCoord={3} />
      </GameContext.Provider>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(updateGameBoard).toHaveBeenCalledWith(2, 3);
  });
});
