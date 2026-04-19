# Color Swap
A react color tile swap game! Inspired by Color Puzzle and I Love Hue.

## Getting Started
1. Pull down project. 
2. Run `npm install` or `npm ci`
3. Start app with `npm run dev`. 
4. Go to `http://localhost:1234` in your browser to view the app.

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
* [ ] win screen love - make prettier and linkable?
* [ ] share & next game selection
* [ ] allow for different difficulties (game size?)
* [ ] Make pre-determined games so we can link to different ones?
* [ ] Come up with a better way to ensure the four starting colors are far enough apart. This distance (and game board size) can determine difficulty.

## Credits
1. Icons: [IconMonstr](https://iconmonstr.com)
2. Color Generator: 
  1. mostly from: [Canva](https://www.canva.com/colors/color-palettes)
  2. random choices by me