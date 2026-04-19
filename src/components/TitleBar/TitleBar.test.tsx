import { fireEvent, render, screen } from '@testing-library/react';
import TitleBar from './TitleBar';
import GameContext from '../../context/gameContext';

describe('TitleBar', () => {
  it('renders the base title', () => {
    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: 'Ignored Puzzle',
          gameSlug: 'ignored-puzzle',
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
        <TitleBar title="Color Swap" />
      </GameContext.Provider>
    );

    expect(screen.getByRole('heading', { name: 'Color Swap' })).toBeInTheDocument();
    expect(screen.queryByText('Ignored Puzzle')).not.toBeInTheDocument();
  });

  it('renders the puzzle title when showTitle is enabled', () => {
    render(
      <GameContext.Provider
        value={{
          gameBoard: [[{
            color: '#ffffff',
            isCorrect: false,
            isLocked: false,
            correctCoord: [0, 1]
          }]],
          gameName: 'Four deep colors',
          gameSlug: 'four-deep-colors',
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
        <TitleBar title="Color Swap" showTitle />
      </GameContext.Provider>
    );

    expect(screen.getByText('Four deep colors')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Undo move' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Show hint' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy game link' })).toBeInTheDocument();
  });

  it('calls showHint from the hint button', () => {
    const showHint = jest.fn();

    render(
      <GameContext.Provider
        value={{
          gameBoard: [[{
            color: '#ffffff',
            isCorrect: false,
            isLocked: false,
            correctCoord: [0, 1]
          }]],
          gameName: 'Four deep colors',
          gameSlug: 'four-deep-colors',
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame: () => 'loaded',
          startNewGame: () => true,
          clearSavedGame: () => {},
          showHint,
          undoMove: () => {}
        }}
      >
        <TitleBar title="Color Swap" showTitle />
      </GameContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Show hint' }));

    expect(showHint).toHaveBeenCalledTimes(1);
  });

  it('calls undoMove from the undo button when enabled', () => {
    const undoMove = jest.fn();

    render(
      <GameContext.Provider
        value={{
          gameBoard: [[{
            color: '#ffffff',
            isCorrect: false,
            isLocked: false,
            correctCoord: [0, 0]
          }]],
          gameName: 'Four deep colors',
          gameSlug: 'four-deep-colors',
          swapClear: false,
          hasSelectedTile: false,
          canUndo: true,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame: () => 'loaded',
          startNewGame: () => true,
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove
        }}
      >
        <TitleBar title="Color Swap" showTitle />
      </GameContext.Provider>
    );

    fireEvent.click(screen.getByRole('button', { name: 'Undo move' }));

    expect(undoMove).toHaveBeenCalledTimes(1);
  });
});
