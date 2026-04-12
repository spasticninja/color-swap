import { render } from '@testing-library/react';
import Game from './game';
import GameContext from '../context/gameContext';

type OpenGameResult = 'loaded' | 'missing' | 'rejected';

const replace = jest.fn();
const useParams = jest.fn();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    replace
  }),
  useParams: () => useParams()
}));

describe('Game', () => {
  beforeEach(() => {
    replace.mockClear();
    useParams.mockReset();
  });

  it('opens the saved or random game when no slug is present', () => {
    const openGame = jest.fn<OpenGameResult, [string?]>(() => 'loaded');
    useParams.mockReturnValue({});

    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: '',
          gameSlug: '',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          openGame,
          startNewGame: () => true,
          clearSavedGame: () => {}
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    expect(openGame).toHaveBeenCalledWith();
  });

  it('redirects the generic game route to the canonical slug url', () => {
    useParams.mockReturnValue({});

    render(
      <GameContext.Provider
        value={{
          gameBoard: [[]],
          gameName: 'Summer Dream',
          gameSlug: 'summer-dream',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          openGame: jest.fn<OpenGameResult, [string?]>(() => 'loaded'),
          startNewGame: () => true,
          clearSavedGame: () => {}
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    expect(replace).toHaveBeenCalledWith('/game/summer-dream');
  });

  it('opens a shared slug when one is present', () => {
    const openGame = jest.fn<OpenGameResult, [string?]>(() => 'loaded');
    useParams.mockReturnValue({ slug: 'summer-dream' });

    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: '',
          gameSlug: '',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          openGame,
          startNewGame: () => true,
          clearSavedGame: () => {}
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    expect(openGame).toHaveBeenCalledWith('summer-dream');
    expect(replace).not.toHaveBeenCalled();
  });

  it('redirects to the current game when the user declines a shared slug swap', () => {
    const openGame = jest.fn<OpenGameResult, [string?]>(() => 'rejected');
    useParams.mockReturnValue({ slug: 'summer-dream' });

    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: '',
          gameSlug: '',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          openGame,
          startNewGame: () => true,
          clearSavedGame: () => {}
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    expect(replace).toHaveBeenCalledWith('/game');
  });

  it('redirects home when a shared slug is missing', () => {
    const openGame = jest.fn<OpenGameResult, [string?]>(() => 'missing');
    useParams.mockReturnValue({ slug: 'not-a-real-board' });

    render(
      <GameContext.Provider
        value={{
          gameBoard: undefined,
          gameName: '',
          gameSlug: '',
          swapClear: false,
          hasSelectedTile: false,
          selectedTile: null,
          updateGameBoard: () => {},
          openGame,
          startNewGame: () => true,
          clearSavedGame: () => {}
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    expect(replace).toHaveBeenCalledWith('/');
  });
});
