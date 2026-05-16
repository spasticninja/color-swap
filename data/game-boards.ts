import gameBoardsFromJson from './game-boards.json';

export type tDifficultyTier = 'easy' | 'medium' | 'hard' | 'expert';

export type tDifficultyConfig = {
  manualTier?: tDifficultyTier;
  manualScore?: number;
  notes?: string;
};

export type tGameBoardBase = {
  name: string;
  slug: string;
  colors: [string, string, string, string];
  difficultyScore?: number;
  difficulty?: tDifficultyConfig;
};

export const gameBoardsBase: tGameBoardBase[] = gameBoardsFromJson as tGameBoardBase[];

export const getGameBoardBySlug = (slug: string): tGameBoardBase | undefined => (
  gameBoardsBase.find(gameBoard => gameBoard.slug === slug)
);

export const getRandomGameBoard = (): tGameBoardBase => {
  const randomIndex = Math.floor(Math.random() * gameBoardsBase.length);
  return gameBoardsBase[randomIndex];
};
