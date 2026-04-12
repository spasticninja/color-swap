import useGenerateBoard from './useGenerateBoard';

describe('useGenerateBoard', () => {
  it('creates a board with the requested dimensions', () => {
    const board = useGenerateBoard(['#111111', '#222222', '#333333', '#444444'], 3, 4);

    expect(board).toHaveLength(3);
    expect(board[0]).toHaveLength(4);
  });

  it('locks only the four corners of the generated board', () => {
    const board = useGenerateBoard(['#111111', '#222222', '#333333', '#444444'], 3, 4);

    expect(board[0][0].isLocked).toBe(true);
    expect(board[0][3].isLocked).toBe(true);
    expect(board[2][0].isLocked).toBe(true);
    expect(board[2][3].isLocked).toBe(true);
    expect(board[1][1].isLocked).toBe(false);
  });

  it('stores each tile correct coordinate', () => {
    const board = useGenerateBoard(['#111111', '#222222', '#333333', '#444444'], 2, 2);

    expect(board[0][1].correctCoord).toEqual([0, 1]);
    expect(board[1][0].correctCoord).toEqual([1, 0]);
  });
});
