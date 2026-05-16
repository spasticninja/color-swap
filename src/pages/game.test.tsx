import { render } from '@testing-library/react';
import { defaultDifficultyPreference, defaultGameSizeOption } from '../config/gameOptions';
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
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame,
          startNewGame: () => true,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove: () => {}
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
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame: jest.fn<OpenGameResult, [string?]>(() => 'loaded'),
          startNewGame: () => true,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove: () => {}
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
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame,
          startNewGame: () => true,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove: () => {}
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
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame,
          startNewGame: () => true,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove: () => {}
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
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame,
          startNewGame: () => true,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove: () => {}
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    expect(replace).toHaveBeenCalledWith('/');
  });

  it('triggers undo from cmd/ctrl+u when undo is available', () => {
    const undoMove = jest.fn();
    useParams.mockReturnValue({});

    render(
      <GameContext.Provider
        value={{
          gameBoard: [[]],
          gameName: 'Summer Dream',
          gameSlug: 'summer-dream',
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: true,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame: jest.fn<OpenGameResult, [string?]>(() => 'loaded'),
          startNewGame: () => true,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'u', ctrlKey: true }));

    expect(undoMove).toHaveBeenCalledTimes(1);
  });

  it('does not trigger undo from cmd/ctrl+u when undo is disabled', () => {
    const undoMove = jest.fn();
    useParams.mockReturnValue({});

    render(
      <GameContext.Provider
        value={{
          gameBoard: [[]],
          gameName: 'Summer Dream',
          gameSlug: 'summer-dream',
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame: jest.fn<OpenGameResult, [string?]>(() => 'loaded'),
          startNewGame: () => true,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint: () => {},
          undoMove
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'u', metaKey: true }));

    expect(undoMove).not.toHaveBeenCalled();
  });

  it('triggers hint from cmd/ctrl+h when a hint is available', () => {
    const showHint = jest.fn();
    useParams.mockReturnValue({});

    render(
      <GameContext.Provider
        value={{
          gameBoard: [[{
            color: '#ffffff',
            isCorrect: false,
            isLocked: false,
            correctCoord: [0, 1]
          }]],
          gameName: 'Summer Dream',
          gameSlug: 'summer-dream',
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame: jest.fn<OpenGameResult, [string?]>(() => 'loaded'),
          startNewGame: () => true,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint,
          undoMove: () => {}
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', ctrlKey: true }));

    expect(showHint).toHaveBeenCalledTimes(1);
  });

  it('does not trigger hint from cmd/ctrl+h when no hint is available', () => {
    const showHint = jest.fn();
    useParams.mockReturnValue({});

    render(
      <GameContext.Provider
        value={{
          gameBoard: [[{
            color: '#ffffff',
            isCorrect: true,
            isLocked: false,
            correctCoord: [0, 0]
          }]],
          gameName: 'Summer Dream',
          gameSlug: 'summer-dream',
          boardSize: defaultGameSizeOption,
          difficultyPreference: defaultDifficultyPreference,
          swapClear: false,
          hasSelectedTile: false,
          canUndo: false,
          selectedTile: null,
          hintTiles: null,
          updateGameBoard: () => {},
          openGame: jest.fn<OpenGameResult, [string?]>(() => 'loaded'),
          startNewGame: () => true,
          setBoardSize: () => {},
          setDifficultyPreference: () => {},
          clearSavedGame: () => {},
          showHint,
          undoMove: () => {}
        }}
      >
        <Game />
      </GameContext.Provider>
    );

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'h', metaKey: true }));

    expect(showHint).not.toHaveBeenCalled();
  });
});
