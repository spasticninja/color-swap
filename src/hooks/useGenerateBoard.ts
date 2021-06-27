import Gradient from 'javascript-color-gradient';
import { tGameTile } from '../components/global';

const useGenerateBoard = (colorArray: Array<string>, xLength: number, yLength: number): Array<Array<tGameTile>> => {
  const topRow = new Gradient;
  const bottomRow = new Gradient;
  let board = new Array<Array<tGameTile>>(xLength);

  topRow.setGradient(colorArray[0], colorArray[1]);
  topRow.setMidpoint(xLength);
  bottomRow.setGradient(colorArray[2], colorArray[3]);
  bottomRow.setMidpoint(xLength);

  for (let i = 0; i < xLength; i++) {
    const columnGradient = new Gradient;
    columnGradient.setGradient(topRow.getColor(i + 1), bottomRow.getColor(i + 1));
    columnGradient.setMidpoint(yLength);
    board[i] = new Array<tGameTile>(yLength);

    for (let j = 0; j < yLength; j++) {
      let isLocked = false;
      if ((i === 0 && j === 0) || (i === 0 && j === yLength - 1) || (i === xLength - 1 && j === 0) || (i === xLength - 1 && j === yLength - 1)) {
        isLocked = true;
      } 

      const tile: tGameTile = {
        color: columnGradient.getColor(j + 1),
        isLocked: isLocked,
        isCorrect: true,
        correctCoord: [i, j]
      }
      board[i][j] = tile;
    }
  }

  return board;
}

export default useGenerateBoard;