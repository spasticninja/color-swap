import * as React from 'react';
import { gameDifficultyOptions, gameSizeOptions } from '../../config/gameOptions';
import GameContext from '../../context/gameContext';
import { getAvailableDifficultyTiers } from '../../utils/getSelectableGameBoards';

const GameSetupOptions = () => {
  const { boardSize, difficultyPreference, setBoardSize, setDifficultyPreference } = React.useContext(GameContext);
  const availableDifficultyTiers = React.useMemo(() => getAvailableDifficultyTiers(boardSize), [boardSize]);

  return (
    <>
      <div className="game-options">
        <h3 className="game-options-label">Board size</h3>
        <div className="size-options" role="radiogroup" aria-label="Board size">
          {gameSizeOptions.map(option => {
            const isSelected = option.id === boardSize.id;

            return (
              <button
                aria-checked={isSelected}
                className={`size-option${isSelected ? ' selected' : ''}`}
                key={option.id}
                onClick={() => setBoardSize(option)}
                role="radio"
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
      <div className="game-options">
        <h3 className="game-options-label">Difficulty</h3>
        <p className="game-options-help">Difficulty options depend on which puzzle tiers exist for the selected board size.</p>
        <div className="size-options" role="radiogroup" aria-label="Difficulty">
          {gameDifficultyOptions.map(option => {
            const isSelected = option.id === difficultyPreference;
            const isAvailable = option.id === 'any' || availableDifficultyTiers.includes(option.id);

            return (
              <button
                aria-checked={isSelected}
                className={`size-option${isSelected ? ' selected' : ''}`}
                disabled={!isAvailable}
                key={option.id}
                onClick={() => setDifficultyPreference(option.id)}
                role="radio"
                type="button"
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default GameSetupOptions;
