import { gameBoardsBase, tDifficultyTier, tGameBoardBase } from '../../data/game-boards';
import { tBoardSizeOption, tDifficultyPreference } from '../config/gameOptions';
import { getBoardDifficulty } from './getBoardDifficulty';

const matchesDifficultyPreference = (
  board: tGameBoardBase,
  boardSize: tBoardSizeOption,
  difficultyPreference: tDifficultyPreference
) => {
  if (difficultyPreference === 'any') {
    return true;
  }

  return getBoardDifficulty(board, boardSize).tier === difficultyPreference;
};

export const getSelectableGameBoards = (
  boardSize: tBoardSizeOption,
  difficultyPreference: tDifficultyPreference
): tGameBoardBase[] => (
  gameBoardsBase.filter(board => matchesDifficultyPreference(board, boardSize, difficultyPreference))
);

export const getAvailableDifficultyTiers = (boardSize: tBoardSizeOption): tDifficultyTier[] => {
  const tiers = new Set<tDifficultyTier>();

  gameBoardsBase.forEach(board => {
    tiers.add(getBoardDifficulty(board, boardSize).tier);
  });

  return Array.from(tiers);
};
