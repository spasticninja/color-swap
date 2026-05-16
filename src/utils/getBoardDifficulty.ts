import { tDifficultyTier, tGameBoardBase } from '../../data/game-boards';
import { defaultGameSizeOption, tBoardSizeOption } from '../config/gameOptions';

export type tBoardDifficulty = {
  breakdown: {
    colorSimilarityScore: number;
    lowContrastPenalty: number;
    paletteScore: number;
    sizeScore: number;
  };
  score: number;
  tier: tDifficultyTier;
};

const clamp = (value: number, min: number, max: number): number => (
  Math.min(max, Math.max(min, value))
);

const hexToRgb = (hex: string): [number, number, number] => {
  const normalizedHex = hex.replace('#', '');
  const chunkSize = normalizedHex.length === 3 ? 1 : 2;
  const [r, g, b] = normalizedHex.match(new RegExp(`.{1,${chunkSize}}`, 'g')) ?? [];

  const expand = (value: string) => (chunkSize === 1 ? `${value}${value}` : value);

  return [
    Number.parseInt(expand(r), 16),
    Number.parseInt(expand(g), 16),
    Number.parseInt(expand(b), 16)
  ];
};

const toLinearRgb = (channel: number): number => {
  const normalized = channel / 255;
  return normalized <= 0.04045
    ? normalized / 12.92
    : ((normalized + 0.055) / 1.055) ** 2.4;
};

const rgbToLab = (hex: string): [number, number, number] => {
  const [r, g, b] = hexToRgb(hex).map(toLinearRgb) as [number, number, number];

  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

  const pivot = (value: number): number => (
    value > 0.008856 ? value ** (1 / 3) : (7.787 * value) + (16 / 116)
  );

  const fx = pivot(x);
  const fy = pivot(y);
  const fz = pivot(z);

  return [
    (116 * fy) - 16,
    500 * (fx - fy),
    200 * (fy - fz)
  ];
};

const getLabDistance = (left: string, right: string): number => {
  const [l1, a1, b1] = rgbToLab(left);
  const [l2, a2, b2] = rgbToLab(right);

  return Math.sqrt(((l1 - l2) ** 2) + ((a1 - a2) ** 2) + ((b1 - b2) ** 2));
};

const getDifficultyTier = (score: number): tDifficultyTier => {
  if (score >= 46) {
    return 'expert';
  }

  if (score >= 36) {
    return 'hard';
  }

  if (score >= 24) {
    return 'medium';
  }

  return 'easy';
};

const getColorDifficultyBreakdown = (colors: tGameBoardBase['colors']) => {
  const pairDistances: number[] = [];
  for (let index = 0; index < colors.length; index++) {
    for (let innerIndex = index + 1; innerIndex < colors.length; innerIndex++) {
      pairDistances.push(getLabDistance(colors[index], colors[innerIndex]));
    }
  }

  const averageDistance = pairDistances.reduce((sum, distance) => sum + distance, 0) / pairDistances.length;
  const minimumDistance = Math.min(...pairDistances);
  const colorSimilarityScore = Math.round(clamp(((55 - averageDistance) / 55) * 35, 0, 35));
  const lowContrastPenalty = Math.round(clamp(((35 - minimumDistance) / 35) * 20, 0, 20));

  return {
    colorSimilarityScore,
    lowContrastPenalty,
    paletteScore: clamp(colorSimilarityScore + lowContrastPenalty, 0, 55)
  };
};

export const getBoardDifficulty = (
  board: tGameBoardBase,
  sizeOverride?: Pick<tBoardSizeOption, 'width' | 'height'>
): tBoardDifficulty => {
  if (board.difficulty?.manualTier && board.difficulty?.manualScore !== undefined) {
    return {
      breakdown: {
        colorSimilarityScore: 0,
        lowContrastPenalty: 0,
        paletteScore: 0,
        sizeScore: 0
      },
      score: board.difficulty.manualScore,
      tier: board.difficulty.manualTier
    };
  }

  const width = sizeOverride?.width ?? defaultGameSizeOption.width;
  const height = sizeOverride?.height ?? defaultGameSizeOption.height;
  const tileCount = width * height;
  const sizeScore = Math.round(clamp(((tileCount - 36) / 84) * 45, 0, 45));
  const computedBreakdown = getColorDifficultyBreakdown(board.colors);
  const paletteScore = board.difficultyScore ?? computedBreakdown.paletteScore;
  const score = clamp(sizeScore + paletteScore, 0, 100);

  return {
    breakdown: {
      colorSimilarityScore: computedBreakdown.colorSimilarityScore,
      lowContrastPenalty: computedBreakdown.lowContrastPenalty,
      paletteScore,
      sizeScore
    },
    score,
    tier: board.difficulty?.manualTier ?? getDifficultyTier(score)
  };
};
