# Color Swap Agent Notes

## Product Summary
- `Color Swap` is a browser-based color-gradient puzzle.
- The active board is generated from entries in `data/game-boards.ts`.
- Each board has a `name`, `slug`, and four corner colors used to generate a 9x10 grid.
- The app uses `react-router-dom@5`, React context for game state, and SCSS for styling.

## Main Pages

### `/`
- Home page in `src/pages/home.tsx`.
- Shows the product intro and a single primary CTA.
- If `localStorage` contains an unfinished game, the CTA says `Continue playing`.
- If the saved game is already solved, the home page clears it on load and falls back to `Start a new game`.

### `/game` and `/game/:slug`
- Game page in `src/pages/game.tsx`.
- `/game/:slug` is the shareable route for a specific puzzle from `game-boards.ts`.
- `/game` is a generic entry point that redirects to `/game/{slug}` once the current board is known.
- If a user opens a shared slug while they have a different unfinished game in `localStorage`, the app prompts before replacing the saved game.
- If the slug is invalid, the app redirects back to `/`.

### `/win`
- Win page in `src/pages/win.tsx`.
- Shows the solved puzzle name when available.
- Falls back to `You solved the puzzle.` if no name is present.
- The win page itself does not clear saved state on mount.
- Saved solved games are cleared when the user returns to `/`, or when they start another puzzle from the win screen.

## Core Game Mechanics
- Board generation happens in `useGenerateBoard`.
- Scrambling happens in `useGameScramble`.
- The board is a 9-column by 10-row grid.
- The four corner tiles are locked and cannot be moved.
- A move is always a swap of two non-locked tiles.
- A selected tile is stored in context as `selectedTile`.
- Undo is single-step history:
  - Disabled before any completed move.
  - Enabled after a completed swap.
  - Undo restores the previous board.
  - After undo, it is disabled again until another move is made.
- Hints mark two tiles that should be swapped next.
- Win detection is coordinate-based, not based on stale `isCorrect` flags.
  - The source of truth is `tile.correctCoord` versus the tile’s current board position.
- The `incorrect tiles` console log updates after swaps and after undo.

## Persistence and Sharing
- Saved game key: `color-swap-game`.
- Saved state includes:
  - `gameName`
  - `gameSlug`
  - `gameBoard`
- Shared links should preserve the slug in the URL.
- Specific puzzle links should use `/game/{slug}`.

## Release Versioning
- Current release line should use semver tags like `v2.1.0`.
- Treat the package version and git tag as a matched release pair.
- Use a `major` bump for breaking changes or a substantial relaunch.
- Use a `minor` bump for player-facing features, new game flows, significant UI refreshes, or deployment/share improvements worth announcing.
- Use a `patch` bump for bug fixes, tuning, accessibility fixes, CSS cleanup, SEO metadata fixes, and GitHub Pages/deployment fixes.
- A commit is worth versioning when it leaves the game in a clearly releasable state, not just because it merges to `main`.
- Before tagging a release, run:
  - `npm test -- --runInBand`
  - `npm run typecheck`
  - `npm run build`

## Accessibility and Keyboard Features
- Tiles are buttons.
- Locked tiles are disabled buttons.
- Arrow-key navigation across the board is implemented in `GameGrid`.
- Tile status text uses `sr-only` labels:
  - locked tile
  - selected tile
  - swap with selected tile
- Action buttons in the title bar have both `aria-label` and `title` attributes:
  - Undo move
  - Show hint
  - Copy game link
- Keyboard shortcuts on the game page:
  - `Cmd+U` / `Ctrl+U` for undo when undo is available
  - `Cmd+H` / `Ctrl+H` for hint when a hint is available
- Note: browser-reserved shortcuts may still win depending on the browser.

## UI Notes
- The project intentionally uses the existing SCSS stack instead of Tailwind.
- Recent styling work introduced:
  - a card-based shell for home and win screens
  - grouped circular action buttons in the title bar
  - framed board styling and refined tile states

## Implementation Cautions
- Prefer coordinate-based correctness checks whenever touching hints, undo, win logic, or saved games.
- Keep `gameSlug` in sync with board loads and saved games.
- When changing context shape, update the many provider fixtures in the tests.
- The project has active Jest coverage around pages, title bar behavior, tile behavior, routing, and board correctness. Run:
  - `npm test -- --runInBand`
  - `npm run typecheck`
  - `npm run build`
