import * as React from 'react';
import classnames from 'classnames';
import GameContext from '../../context/gameContext';
import { tGameTile } from '../global';
import './game-tile.scss';

type tGameTileProps = {
  tile: tGameTile;
  xCoord: number;
  yCoord: number;
};

const GameTile = (props: tGameTileProps) => {
  const { tile, xCoord, yCoord } = props;
  const { hasSelectedTile, selectedTile, updateGameBoard } = React.useContext(GameContext);
  const isSelected = selectedTile?.[0] === xCoord && selectedTile?.[1] === yCoord;

  const classes = classnames('game-tile', {
    'selected': isSelected,
    'locked': tile.isLocked,
    'swap-ready': hasSelectedTile && !isSelected
  });
  const iconClass = classnames('tile-icon', {
    'selected-icon': isSelected,
    'swap-icon': hasSelectedTile && !isSelected
  });

  const onTileClick = () => {
    if (tile.isLocked) {
      return;
    }

    updateGameBoard(xCoord, yCoord);
  };

  const icon = tile.isLocked ? (
    <span className="lock-icon">
      <span className="sr-only">Locked Tile</span>
    </span>
  ) : (
    <span className={iconClass}>
      {isSelected ? (
        <span className="sr-only">Tile selected</span>
      ) : hasSelectedTile ? (
        <>
          <i aria-hidden="true" className="fa-solid fa-arrows-rotate"></i>
          <span className="sr-only">Swap with selected tile</span>
        </>
      ) : (
        <span className="sr-only">Selectable tile</span>
      )}
    </span>
  );

  return (
    <button
      style={{ backgroundColor: tile.color }}
      onClick={onTileClick}
      disabled={tile.isLocked}
      className={classes}
    >
      {icon}
    </button>
  );
};

export default GameTile;
