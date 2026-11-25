# Colour logic game: Level 8 solver

One-page helper for Level 8 of a mobile bus-parking colour puzzle. Ben counts the people groups on the tracks himself and enters them. The tabs are Map, Blocks, People, Scenarios and Play (see `README.md`).

Live: https://bengalebg23.github.io/Colourlogicgame/

## How to change it
- **Don't edit `index.html` directly.** It's generated. Edit `src/model.js` (vehicles, default track counts) or `src/app_template.html`, then run `python3 src/build.py "what changed"`. That rebuilds `index.html` and bumps `version.json`, and open pages then show an **Update now** bar.
- Commit the sources, the rebuilt `index.html` and `version.json` together, then push to `main` (GitHub Pages deploys it).
- Ben works from his phone, so Claude pushes directly. Afterwards, tell him the new version number and what changed.

## Game model
- Large bus seats 40, medium bus 24, small car 16. There are four parking spaces.
- A vehicle moves only when nothing lies in its path.
- Anyone in the middle can board. The left track feeds the middle first, and the right track only once the left is empty.
- The right track's make-up is still an estimate. Ben's real counts and block fixes override the defaults.
