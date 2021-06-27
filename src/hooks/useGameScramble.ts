const useGameScramble = (gameGrid) => {
  let shuffledGrid = gameGrid; 
  const xLength = shuffledGrid.length;
  const yLength = shuffledGrid[0].length;

  for (let i = 0; i < xLength; i++) {
    for (let j = 0; j < yLength; j++) {
      const x = Math.floor(Math.random() * (xLength));
      const y = Math.floor(Math.random() * (yLength));

      if (!shuffledGrid[i][j].isLocked && !shuffledGrid[x][y].isLocked) {
        // good to swap if niether tile is locked
        
        if (i !== x || j !== y) {
          // if random isn't the same tile flip isCorrect flag to false
          shuffledGrid[i][j].isCorrect = false;
          shuffledGrid[x][y].isCorrect = false;
        }

        let temp = shuffledGrid[i][j];
        shuffledGrid[i][j] = shuffledGrid[x][y];
        shuffledGrid[x][y] = temp;
      }
    }
  }

  return shuffledGrid;
}

export default useGameScramble;