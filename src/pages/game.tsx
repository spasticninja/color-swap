import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import GameGrid from '../components/GameGrid/GameGrid';
import { useHistory, useParams } from "react-router-dom";

const Game = () => {
  const { canUndo, gameBoard, gameSlug, openGame, showHint, undoMove } = React.useContext(GameContext);
  const history = useHistory();
  const { slug } = useParams<{ slug?: string }>();
  const canShowHint = Boolean(gameBoard && gameBoard.some((column, x) => (
    column.some((tile, y) => !tile.isLocked && (tile.correctCoord[0] !== x || tile.correctCoord[1] !== y))
  )));
  
  React.useEffect(() => {
    if (slug) {
      const result = openGame(slug);
      if (result === 'missing') {
        history.replace('/');
      } else if (result === 'rejected') {
        history.replace('/game');
      }
      return;
    }

    if (gameBoard && gameSlug) {
      history.replace(`/game/${gameSlug}`);
      return;
    }

    if (!gameBoard) {
      // check to see we have a valid game first
      openGame();
    }
  }, [gameBoard, gameSlug, history, openGame, slug]);

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey)) {
        return;
      }

      const shortcut = event.key.toLowerCase();
      if (shortcut === 'u') {
        if (!canUndo) {
          return;
        }

        event.preventDefault();
        undoMove();
        return;
      }

      if (shortcut === 'h') {
        if (!canShowHint) {
          return;
        }

        event.preventDefault();
        showHint();
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [canShowHint, canUndo, showHint, undoMove]);

  return (
    <main className="game-page">
      <TitleBar title="Color Swap" showTitle></TitleBar>
      <GameGrid></GameGrid>
    </main>
  );
};

export default Game;
