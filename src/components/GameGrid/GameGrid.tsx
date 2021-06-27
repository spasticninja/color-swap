import * as React from 'react';
import GameTile from '../GameTile/GameTile';
import GameContext from '../../context/gameContext';
import './game-grid.scss';

const GameGrid = () => {
  const { gameBoard } = React.useContext(GameContext);

  const _grid = React.createRef<HTMLDivElement>();

  const onAccessibleKeyDown = (e: React.KeyboardEvent) => {
    const allTiles = Array.from(_grid.current.getElementsByClassName('game-tile')) as HTMLButtonElement[];
    const findCurrentFocusIndex = allTiles.findIndex(tile => tile === document.activeElement);
    const ycoord = findCurrentFocusIndex % 10;
    // Note: all of the keydown logic is dependent on the 9 x 10 grid. 

    switch (e.key) {
      case 'ArrowLeft': 
        e.preventDefault();
        if (findCurrentFocusIndex <= 10) {
          // need to go last column
          allTiles[80 + ycoord].focus();
        } else {
          allTiles[findCurrentFocusIndex - 10].focus();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (findCurrentFocusIndex > 80) {
          // need to go back to column 1
          allTiles[ycoord].focus();
        } else {
          allTiles[findCurrentFocusIndex + 10].focus();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (ycoord === 9) {
          // need to go back to top
          allTiles[findCurrentFocusIndex - 9].focus();
        } else {
          allTiles[findCurrentFocusIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (ycoord === 0) {
          // need to go bottom
          allTiles[findCurrentFocusIndex + 9].focus();
        } else {
          allTiles[findCurrentFocusIndex - 1].focus();
        }
        break;
    }
  }

  return (
    <div 
      className="game-grid" 
      onKeyDown={onAccessibleKeyDown} 
      ref={_grid}
    >
      {gameBoard.map((column, cIndex) => {
        return (
          <div key={cIndex} className="game-grid-column">
            {column.map((tile, tIndex) => {
              return (
                <GameTile 
                  tile={tile} 
                  xCoord={cIndex} 
                  yCoord={tIndex} 
                  key={tIndex}
                />
              )
            })}
          </div>
        );
        })}
    </div>
  )
}

export default GameGrid;