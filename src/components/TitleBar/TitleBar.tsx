import * as React from 'react';
import GameContext from '../../context/gameContext';
import './title-bar.scss';

export type tTitleBar = {
  title: string;
  showTitle?: boolean;
}

const CopyButton = () => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
  };

  return (
    <button aria-label="Copy game link" onClick={copyToClipboard} type="button">
      <i className="fa-solid fa-paperclip"></i>
    </button>
  );
};

const HintButton = () => {
  const { gameBoard, showHint } = React.useContext(GameContext);
  const hasMoves = Boolean(gameBoard && gameBoard.some((column, x) => (
    column.some((tile, y) => !tile.isLocked && (tile.correctCoord[0] !== x || tile.correctCoord[1] !== y))
  )));

  return (
    <button aria-label="Show hint" disabled={!hasMoves} onClick={showHint} type="button">
      <i className="fa-solid fa-lightbulb"></i>
    </button>
  );
};

const UndoButton = () => {
  const { canUndo, undoMove } = React.useContext(GameContext);

  return (
    <button aria-label="Undo move" disabled={!canUndo} onClick={undoMove} type="button">
      <i className="fa-solid fa-rotate-left"></i>
    </button>
  );
};

const TitleBar = (props: tTitleBar) => {
  const {title, showTitle = false} = props;
  const { gameName } = React.useContext(GameContext);
  
  return (
    <h1>
      {title}
      {showTitle ? <>
        <small>{gameName}</small>
        <span className="title-bar-actions">
          <UndoButton />
          <HintButton />
          <CopyButton />
        </span>
      </> : <></>}
    </h1>
  );
};

export default TitleBar;
