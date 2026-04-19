import * as React from 'react';
import GameContext from '../context/gameContext';
import TitleBar from '../components/TitleBar/TitleBar';
import GameGrid from '../components/GameGrid/GameGrid';
import { useHistory, useParams } from "react-router-dom";

const Game = () => {
  const { canUndo, gameBoard, gameSlug, openGame, undoMove } = React.useContext(GameContext);
  const history = useHistory();
  const { slug } = useParams<{ slug?: string }>();
  
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
      if (!(event.metaKey || event.ctrlKey) || event.key.toLowerCase() !== 'u') {
        return;
      }

      if (!canUndo) {
        return;
      }

      event.preventDefault();
      undoMove();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [canUndo, undoMove]);

  return (
    <>
      <TitleBar title="Color Swap" showTitle></TitleBar>
      <GameGrid></GameGrid>
    </>
  );
};

export default Game;
