import * as React from 'react';
import classnames from 'classnames';
import GameContext from '../../context/gameContext';
import { tGameTile } from '../global';
import './game-tile.scss';

type tGameTileProps = {
  tile: tGameTile
  xCoord: Number;
  yCoord: Number;
}

const GameTile = (props: tGameTileProps) => {
  const { tile, xCoord, yCoord } = props;
  const [isSelected, setIsSelected] = React.useState(false);
  const { swapClear, updateGameBoard } = React.useContext(GameContext);

  React.useEffect(() => {
    if (isSelected) {
      setIsSelected(false);
    }
  }, [swapClear])

  const classes = classnames('game-tile', {
    'selected': isSelected,
    'locked': tile.isLocked
  });
  const iconClass = classnames('open-tile', {
    'selected-icon': isSelected
  })

  const onTileClick = () => {
    if (tile.isLocked) { return false };

    if (!isSelected) {
      updateGameBoard(xCoord, yCoord);
    }
    setIsSelected(!isSelected);
  };

  const icon = tile.isLocked ? (
    <span className="lock-icon">
      <span className="sr-only">Locked Tile</span>
    </span>
  ) : (
    <span className={iconClass}>
      <span className="sr-only">Tile selected: {isSelected}</span>
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