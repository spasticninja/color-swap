# Color Swap
A react color tile swap game! Inspired by Color Puzzle and I Love Hue.

## Getting Started
1. Pull down project. 
2. Run `npm install` or `npm ci`
3. Start app with `npm run dev`. 
4. Go to `http://localhost:1234` in your browser to view the app.

## Adding Games
Run `npm run add:game` to add a new puzzle. The script will prompt for:

1. puzzle name
2. slug (optional; generated from the name if left blank)
3. four corner colors as hex values

The script computes a raw numeric `difficultyScore` from the color distances and appends the new entry to [data/game-boards.json](/Users/allison/Documents/workspace/color-swap/data/game-boards.json).
The scoring model is documented in [docs/difficulty-scoring.md](/Users/allison/Documents/workspace/color-swap/docs/difficulty-scoring.md:1).

## GitHub Pages
This repo is configured to deploy to GitHub Pages from GitHub Actions.

1. In GitHub repo settings, set Pages to use `GitHub Actions` as the source.
2. Push to `main` to run tests, build the static site, and deploy it.

The build writes static assets to `docs/` and also creates `docs/404.html` so direct links like `/game/{slug}` can fall back to the app on GitHub Pages.
The post-build metadata generator uses `SITE_ORIGIN` when it writes canonical URLs, route-specific share pages, and the sitemap. It defaults to `https://spasticninja.github.io/color-swap`, but you can override it for another host.

## Plan
1. 9 x 10 game board
2. color gradient tiles
3. select, swap or unselect actions

## TODOS:
* [x] generator & randomizer
* [x] selected icon
* [x] make selected color box more obvious
* [x] Add swap icon
* [x] game routing to different boards
* [x] save game to localStorage to persist game
  * [x] Clear state and refresh bug
* [x] Undo (1 level)
* [x] Hints
* [ ] Add streak counter
* [x] Start screen will either randomly select game on intial start or allow them to continue playing (if game in localStorage)
* [x] win screen love - make prettier and linkable?
* [x] share & next game selection
* [x] allow for different difficulties (game size?)
* [x] Make pre-determined games so we can link to different ones?
* [ ] Choose game by color swatch (secret mode)

## Credits
1. Icons: [IconMonstr](https://iconmonstr.com)
2. Color Generator: 
  1. mostly from: [Canva](https://www.canva.com/colors/color-palettes)
  2. random choices by me
