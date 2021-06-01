import * as React from 'react';
import classnames from 'classnames';
import GameContext from '../../context/gameContext';
import './game-tile.scss';

type tGameTile = {
  color: string;
  xCoord: Number;
  yCoord: Number;
}

const GameTile = (props: tGameTile) => {
  const { color, xCoord, yCoord } = props;
  const [isSelected, setIsSelected] = React.useState(false);
  const { swapClear, updateGameBoard } = React.useContext(GameContext);

  React.useEffect(() => {
    if (isSelected) {
      setIsSelected(false);
    }
  }, [swapClear])

  const classes = classnames('game-tile', {
    'selected': isSelected
  });

  const onTileClick = () => {    
    if (!isSelected) {
      updateGameBoard(xCoord, yCoord);
      // TODO: how do I unselect the tiles when updateGameBoard flips a pair of tile?
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