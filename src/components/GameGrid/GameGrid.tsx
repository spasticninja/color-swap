import * as React from 'react';
import GameTile from '../GameTile/GameTile';
import GameContext from '../../context/gameContext';
import './game-grid.scss';

const GameGrid = () => {
  const { gameBoard } = React.useContext(GameContext);
  const gridRef = React.useRef<HTMLDivElement>(null);
  const columnCount = gameBoard?.length ?? 0;
  const rowCount = gameBoard?.[0]?.length ?? 0;

  const onAccessibleKeyDown = (e: React.KeyboardEvent) => {
    const grid = gridRef.current;
    if (!grid || !columnCount || !rowCount) {
      return;
    }

    const allTiles = Array.from(grid.getElementsByClassName('game-tile')) as HTMLButtonElement[];
    const findCurrentFocusIndex = allTiles.findIndex(tile => tile === document.activeElement);

    if (findCurrentFocusIndex === -1) {
      return;
    }

    const columnIndex = Math.floor(findCurrentFocusIndex / rowCount);
    const rowIndex = findCurrentFocusIndex % rowCount;

    switch (e.key) {
      case 'ArrowLeft': 
        e.preventDefault();
        if (columnIndex === 0) {
          allTiles[((columnCount - 1) * rowCount) + rowIndex].focus();
        } else {
          allTiles[findCurrentFocusIndex - rowCount].focus();
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (columnIndex === columnCount - 1) {
          allTiles[rowIndex].focus();
        } else {
          allTiles[findCurrentFocusIndex + rowCount].focus();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (rowIndex === rowCount - 1) {
          allTiles[findCurrentFocusIndex - (rowCount - 1)].focus();
        } else {
          allTiles[findCurrentFocusIndex + 1].focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (rowIndex === 0) {
          allTiles[findCurrentFocusIndex + (rowCount - 1)].focus();
        } else {
          allTiles[findCurrentFocusIndex - 1].focus();
        }
        break;
    }
  };

  return (
    <>{gameBoard && 
      <div
        className="game-grid"
        onKeyDown={onAccessibleKeyDown}
        ref={gridRef}
        style={{ gridTemplateColumns: `repeat(${columnCount}, 1fr)` }}
      >
        {gameBoard.map((column, cIndex) => {
          return (
            <div
              key={cIndex}
              className="game-grid-column"
              style={{ gridTemplateRows: `repeat(${column.length}, minmax(0, 1fr))` }}
            >
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
    }</>
  );
};

export default GameGrid;
