import useCheckSolution from './useCheckSolution';
import { tGameTile } from '../components/global';

const createTile = (isCorrect: boolean, x: number, y: number): tGameTile => ({
  color: '#ffffff',
  isCorrect,
  isLocked: false,
  correctCoord: [x, y]
});

describe('useCheckSolution', () => {
  it('counts incorrect tiles in the board', () => {
    const gameBoard = [
      [createTile(true, 0, 0), createTile(false, 1, 0)],
      [createTile(false, 0, 1), createTile(true, 1, 1)]
    ];

    expect(useCheckSolution(gameBoard)).toBe(2);
  });

  it('returns zero for a solved board', () => {
    const gameBoard = [
      [createTile(true, 0, 0), createTile(true, 0, 1)],
      [createTile(true, 1, 0), createTile(true, 1, 1)]
    ];

    expect(useCheckSolution(gameBoard)).toBe(0);
  });

  it('uses tile coordinates instead of stale isCorrect flags', () => {
    const gameBoard = [
      [createTile(true, 0, 0), createTile(true, 0, 1)],
      [createTile(true, 1, 1), createTile(true, 1, 0)]
    ];

    expect(useCheckSolution(gameBoard)).toBe(2);
  });
});
