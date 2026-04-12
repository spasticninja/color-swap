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
          swapClear: false,
          updateGameBoard: () => {},
          initGame: () => {}
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
          swapClear: false,
          updateGameBoard: () => {},
          initGame: () => {}
        }}
      >
        <TitleBar title="Color Swap" showTitle />
      </GameContext.Provider>
    );

    expect(screen.getByText('Four deep colors')).toBeInTheDocument();
  });
});
