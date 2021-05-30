import * as React from 'react';
import classnames from 'classnames';
import './game-tile.scss';

type tGameTile = {
  color: string;
  xCoord: Number;
  yCoord: Number;
}

const GameTile = (props: tGameTile) => {
  const { color, xCoord, yCoord } = props;

  const [isSelected, setIsSelected] = React.useState(false);

  const classes = classnames('game-tile', {
    'selected': isSelected
  });

  const onTileClick = () => {
    if (!isSelected) {
      // TODO: context update selection for updating our game
      // onClickHandler(xCoord, yCoord);
    }
    setIsSelected(!isSelected);
  };

  // TODO: create a selected icon

  return (
    <button
      style={{ backgroundColor: color }}
      onClick={onTileClick}
      className={classes}
    >{xCoord}, {yCoord}</button>
  );
};

export default GameTile;