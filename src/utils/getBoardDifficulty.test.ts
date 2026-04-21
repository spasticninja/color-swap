import { getBoardDifficulty } from './getBoardDifficulty';
import { tGameBoardBase } from '../../data/game-boards';

const baseBoard = (overrides: Partial<tGameBoardBase> = {}): tGameBoardBase => ({
  name: 'Test Board',
  slug: 'test-board',
  colors: ['#111111', '#eeeeee', '#cc3333', '#3366cc'],
  width: 9,
  height: 10,
  ...overrides
});

describe('getBoardDifficulty', () => {
  it('treats larger boards as more difficult', () => {
    const smallBoard = getBoardDifficulty(baseBoard({ width: 6, height: 6 }));
    const largeBoard = getBoardDifficulty(baseBoard({ width: 12, height: 12 }));

    expect(largeBoard.score).toBeGreaterThan(smallBoard.score);
  });

  it('treats more visually similar palettes as more difficult', () => {
    const lowContrastBoard = getBoardDifficulty(baseBoard({
      colors: ['#b7b2ac', '#c1bbb5', '#a9a39d', '#cec7c1']
    }));
    const highContrastBoard = getBoardDifficulty(baseBoard({
      colors: ['#111111', '#ffffff', '#0057ff', '#ff2a00']
    }));

    expect(lowContrastBoard.score).toBeGreaterThan(highContrastBoard.score);
  });

  it('respects manual difficulty overrides', () => {
    const difficulty = getBoardDifficulty(baseBoard({
      difficulty: {
        manualScore: 88,
        manualTier: 'expert'
      }
    }));

    expect(difficulty.score).toBe(88);
    expect(difficulty.tier).toBe('expert');
  });
});
