import { tDifficultyTier } from '../../data/game-boards';

export type tBoardSizeOption = {
  height: number;
  id: 'compact' | 'balanced' | 'large' | 'classic';
  label: string;
  width: number;
};

export type tDifficultyPreference = 'any' | tDifficultyTier;

export type tDifficultyOption = {
  id: tDifficultyPreference;
  label: string;
};

export const gameSizeOptions: tBoardSizeOption[] = [
  { id: 'compact', label: '6 x 6', width: 6, height: 6 },
  { id: 'balanced', label: '7 x 8', width: 7, height: 8 },
  { id: 'large', label: '8 x 9', width: 8, height: 9 },
  { id: 'classic', label: '9 x 10', width: 9, height: 10 }
];

export const gameDifficultyOptions: tDifficultyOption[] = [
  { id: 'any', label: 'Any' },
  { id: 'easy', label: 'Easy' },
  { id: 'medium', label: 'Medium' },
  { id: 'hard', label: 'Hard' },
  { id: 'expert', label: 'Expert' }
];

export const defaultGameSizeOption = gameSizeOptions[gameSizeOptions.length - 1];
export const defaultDifficultyPreference: tDifficultyPreference = 'any';

export const getGameSizeOption = (width: number, height: number): tBoardSizeOption => (
  gameSizeOptions.find(option => option.width === width && option.height === height) ?? {
    id: 'classic',
    label: `${width} x ${height}`,
    width,
    height
  }
);
