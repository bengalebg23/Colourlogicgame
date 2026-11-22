# Colour logic game: Level 8 solver

A one-page helper for Level 8 of the bus-parking colour game. Open `index.html` in any browser (or via GitHub Pages).

## Tabs
1. **Map** – every vehicle named (Y1, C2, LP3…), with size, seats, what blocks it and what it frees. `level8-map.png` is the same map as an image.
2. **Blocks** – visual checker: tap a vehicle to see its path, what blocks it and what it frees; mark it checked or fix its blockers. Fixes feed Scenarios and Play.
3. **People** – the left track, front to back, with group sizes (4 people per line), plus what's in the middle at the start. Edits are kept in the browser.
4. **Scenarios** – Route A, Route B and the app's own search, each played until it dies. Optional move-number overlay.
5. **Play** – guided play: colour chart of what's coming, parking spaces, and the moves available now, best first. Save, load and copy play-throughs.

## Rules the model uses
- Large bus 40, medium bus 24, small car 16. Four parking spaces.
- A vehicle moves only when nothing lies in its path.
- Anyone in the middle can board; the left track feeds the middle first, the right track only once the left is empty.
- The right track's make-up is still estimated (whatever the left track and middle don't cover).

## Editing
The source is in `src/`. Change `model.js` (vehicles, default track counts) or `app_template.html`, then run `python3 src/build.py` to rebuild `index.html`.
