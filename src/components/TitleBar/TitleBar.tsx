import * as React from 'react';
import GameContext from '../../context/gameContext';
import './title-bar.scss';

export type tTitleBar = {
  title: string;
  showTitle?: boolean;
}

const CopyButton = () => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <button aria-label="Copy game link" className="title-action-button" onClick={copyToClipboard} title="Copy game link" type="button">
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
    <button aria-label="Show hint" className="title-action-button" disabled={!hasMoves} onClick={showHint} title="Show hint" type="button">
      <i className="fa-solid fa-lightbulb"></i>
    </button>
  );
};

const UndoButton = () => {
  const { canUndo, undoMove } = React.useContext(GameContext);

  return (
    <button aria-label="Undo move" className="title-action-button" disabled={!canUndo} onClick={undoMove} title="Undo move" type="button">
      <i className="fa-solid fa-rotate-left"></i>
    </button>
  );
};

const TitleBar = (props: tTitleBar) => {
  const {title, showTitle = false} = props;
  const { gameName } = React.useContext(GameContext);
  const showGameName = showTitle && Boolean(gameName);
  
  return (
    <header className="title-bar">
      <div>
        <p className="title-bar-kicker">Color Logic Puzzle</p>
        <h1 className="title-bar-heading">
          {title}
          {showGameName ? <small>{gameName}</small> : null}
        </h1>
      </div>
      {showTitle ? (
        <span className="title-bar-actions">
          <UndoButton />
          <HintButton />
          <CopyButton />
        </span>
      ) : null}
    </header>
  );
};

export default TitleBar;
