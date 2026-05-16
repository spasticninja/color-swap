import { gameSizeOptions } from '../config/gameOptions';
import { getBoardDifficulty } from './getBoardDifficulty';
import { getAvailableDifficultyTiers, getSelectableGameBoards } from './getSelectableGameBoards';

describe('getSelectableGameBoards', () => {
  it('returns only boards that match the requested difficulty for the selected board size', () => {
    const classicSize = gameSizeOptions.find(option => option.id === 'classic');

    if (!classicSize) {
      throw new Error('Missing classic size option');
    }

    const mediumBoards = getSelectableGameBoards(classicSize, 'medium');

    expect(mediumBoards.length).toBeGreaterThan(0);
    expect(mediumBoards.every(board => getBoardDifficulty(board, classicSize).tier === 'medium')).toBe(true);
  });

  it('reports the difficulty tiers available for the selected board size', () => {
    const compactSize = gameSizeOptions.find(option => option.id === 'compact');

    if (!compactSize) {
      throw new Error('Missing compact size option');
    }

    expect(getAvailableDifficultyTiers(compactSize)).toEqual(['easy']);
  });
});
