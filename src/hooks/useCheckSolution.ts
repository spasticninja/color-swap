import { tGameTile } from "../components/global";

const useCheckSolution = (gameBoard: tGameTile[][]): number => {
  let incorrectTiles = 0;

  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[i].length; j++) {
      const tile = gameBoard[i][j];
      if (tile.correctCoord[0] !== i || tile.correctCoord[1] !== j) {
        incorrectTiles ++;
      }
    }
  }

  return incorrectTiles;
};

export default useCheckSolution;
