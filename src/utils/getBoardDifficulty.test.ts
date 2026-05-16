import { getBoardDifficulty } from './getBoardDifficulty';
import { tGameBoardBase } from '../../data/game-boards';

const baseBoard = (overrides: Partial<tGameBoardBase> = {}): tGameBoardBase => ({
  name: 'Test Board',
  slug: 'test-board',
  colors: ['#111111', '#eeeeee', '#cc3333', '#3366cc'],
  ...overrides
});

describe('getBoardDifficulty', () => {
  it('treats larger boards as more difficult', () => {
    const smallBoard = getBoardDifficulty(baseBoard(), { width: 6, height: 6 });
    const largeBoard = getBoardDifficulty(baseBoard(), { width: 12, height: 12 });

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

  it('uses a stored raw palette score when one is present', () => {
    const difficulty = getBoardDifficulty(baseBoard({
      difficultyScore: 22
    }));

    expect(difficulty.breakdown.paletteScore).toBe(22);
    expect(difficulty.score).toBe(51);
    expect(difficulty.tier).toBe('expert');
  });

  it('maps the recalibrated score thresholds to all four tiers', () => {
    expect(getBoardDifficulty(baseBoard({ difficultyScore: 0 }), { width: 6, height: 6 }).tier).toBe('easy');
    expect(getBoardDifficulty(baseBoard({ difficultyScore: 13 }), { width: 7, height: 8 }).tier).toBe('medium');
    expect(getBoardDifficulty(baseBoard({ difficultyScore: 17 }), { width: 8, height: 9 }).tier).toBe('hard');
    expect(getBoardDifficulty(baseBoard({ difficultyScore: 17 }), { width: 9, height: 10 }).tier).toBe('expert');
  });
});
