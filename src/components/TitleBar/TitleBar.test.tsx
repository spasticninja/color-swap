import { render, screen } from '@testing-library/react';
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
          selectedTile: null,
          updateGameBoard: () => {},
          openGame: () => 'loaded',
          startNewGame: () => true,
          clearSavedGame: () => {}
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
          gameBoard: undefined,
          gameName: 'Four deep colors',
          gameSlug: 'four-deep-colors',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          openGame: () => 'loaded',
          startNewGame: () => true,
          clearSavedGame: () => {}
        }}
      >
        <TitleBar title="Color Swap" showTitle />
      </GameContext.Provider>
    );

    expect(screen.getByText('Four deep colors')).toBeInTheDocument();
  });
});
