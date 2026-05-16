# Difficulty Scoring

`Color Swap` stores a raw palette difficulty score for each board and combines that with board size at runtime to derive the displayed difficulty tier.

## Current Model

The scoring logic exists in:

- [scripts/add-game.js](/Users/allison/Documents/workspace/color-swap/scripts/add-game.js:1)
- [src/utils/getBoardDifficulty.ts](/Users/allison/Documents/workspace/color-swap/src/utils/getBoardDifficulty.ts:1)

The stored raw palette score is an integer from `0` to `55`.
The runtime total score is an integer from `0` to `100`.

## How The Score Is Calculated

The four corner colors are converted from hex to CIE Lab color space. The code then measures the distance between every pair of colors.

From those distances, it calculates:

- `averageDistance`: the average distance across all color pairs
- `minimumDistance`: the closest pair of colors

Smaller distances mean the colors are more visually similar, which increases difficulty.

The raw stored palette score is built from two parts:

- `colorSimilarityScore`: up to `35`
- `lowContrastPenalty`: up to `20`

At runtime, the app adds:

- `sizeScore`: up to `45`

The total is then clamped to the range `0..100`.

## Score Components

### `colorSimilarityScore`

This increases when the average distance between colors gets smaller.

- Formula: `round(clamp(((55 - averageDistance) / 55) * 35, 0, 35))`

### `lowContrastPenalty`

This increases when the closest pair of colors is very close together.

- Formula: `round(clamp(((35 - minimumDistance) / 35) * 20, 0, 20))`

### `sizeScore`

This is based on the active board size when a game is played.

- Formula: `round(clamp(((tileCount - 36) / 84) * 45, 0, 45))`

## Tier Mapping

The numeric score maps to the current difficulty tier thresholds:

- `0-23`: `easy`
- `24-35`: `medium`
- `36-45`: `hard`
- `46-100`: `expert`

## Important Note

The stored board field is `difficultyScore`, which represents only the palette-based portion of difficulty.

The app then adds `sizeScore` at runtime and maps the total to a tier.

## Why Some Boards Have `difficultyScore: 0`

A stored score of `0` does not mean the full puzzle has no difficulty.

It means the palette itself is not adding extra difficulty under the current formula.

If the four corner colors are already far apart in Lab space, both of these values can clamp to `0`:

- `colorSimilarityScore`
- `lowContrastPenalty`

When that happens, the stored `difficultyScore` is `0`.

The played puzzle can still be difficult because the app adds `sizeScore` at runtime based on the active board dimensions.

For example, the default `9 x 10` board size contributes a positive `sizeScore`, so a board with `difficultyScore: 0` still has a non-zero total runtime difficulty score and can still be labeled `easy`.
