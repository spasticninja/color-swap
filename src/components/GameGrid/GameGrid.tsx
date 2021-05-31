import * as React from 'react';
import GameTile from '../GameTile/GameTile';
import GameContext from '../../context/gameContext';
import './game-grid.scss';

const GameGrid = () => {
  const { gameBoard } = React.useContext(GameContext);

  const _grid = React.createRef<HTMLDivElement>();

  const onAccessibleKeyDown = (e: React.KeyboardEvent) => {
    // TODO: accessibility, allow keyboard navigation
    // const allTiles = Array.from(_grid.current.getElementsByClassName('game-tile')) as HTMLButtonElement[];
    // const findCurrentFocus = allTiles.find(tile => tile === document.activeElement);

    // console.log(findCurrentFocus);
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
                  color={tile} 
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