# Music of the Medieval Period: five graded experiences

Five short 3D animations in the "Ink and Toon" style, built with three.js from the slides of a general-music lesson
on medieval music. Each one ends with a check the student answers in the scene, and a score card adds the marks up
out of 26. It was made from the same kit and work brief as [johnshawler/50s](https://github.com/johnshawler/50s).

| # | Experience | From the deck | Check |
|---|---|---|---|
| 1 | About 900 years | Slide 2 | match six dates to six objects; one question on the years (7 points) |
| 2 | Two worlds: church and court | Slide 3 | sort six clues: sacred or secular (6) |
| 3 | One melody, then many | Slides 4 and 6 | four questions about the sheet of notes as it changes (4) |
| 4 | Plucked, bowed, cranked | Slides 9 and 10 | match five clues to five instruments (5) |
| 5 | Four composers to remember | Slide 11 | match four clues to four composers (4) |

Live at https://medieval.johnshawler.com (storyboard at `/storyboard.html`, videos under `/video/`).

## Use it

`index.html` is the whole thing in one file. It loads three.js 0.187.0 and three Google Fonts from their CDNs, so it
needs to be served over http(s) (GitHub Pages works; opening the file straight from disk may not, because browsers
block module imports on `file://`).

- Play/pause, scrub, time, sound toggle, loop (on by default).
- "Your turn" starts the check for that chapter. Answer by tapping the picture or the buttons under it.
- "Score card" shows the name, every answer and the total, and can be copied as text. Scores are kept in the
  browser they were made in (`localStorage`), nowhere else.

`storyboard.html` is the approved storyboard: one still per beat, with timings, on-screen text, moves, camera and
sound. A few framings changed after approval; the player is the final word.

`video/` holds one MP4 of each animation: 1920x1080, 30 fps, 16 samples a frame, sound at about -15 LUFS. They were
rendered in headless Chrome with a software renderer (no GPU was available), which changes the speed, not the picture.

`WORK_BRIEF.md` is the brief this was built from, for doing the same with another deck.

## How it is put together

```
lib/stage.js            the rendering kit (unchanged)
lib/sound.js            the synthesized sound kit (unchanged)
lib/ink.js              the Ink and Toon look and the staging helpers
lib/props.js            shared prop helpers and marks (and the 1950s objects, unused here)
lib/props_medieval.js   the medieval objects: figures, books, quill, column, crown, cathedral, lute, harp, vielle ...
lib/tunes.js            shared timing helpers
lib/tunes_medieval.js   sung voices, plucked and bowed strings, drone, shawm, nakers
scenes/m1..m5           one style object per experience: content, timing, build(S) -> update(t), sound(k), check
src/app.html            the player: chapters, controls, checks, score card
tools/                  build and render scripts
```

Every scene is a pure function of time: `update(t)` sets the whole scene for time `t`. Props move on twos
(15 drawings a second); only the camera moves on every frame. People are shown as plain turned figures.

## Rebuild

```bash
python3 tools/make_final.py
```

writes `index.html` (and local test copies under `out/`). To render stills or video you also need a local copy of
three.js and a web server on port 8766:

```bash
mkdir -p out && curl -o lib/three.module.js https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.module.js && curl -o lib/three.core.js https://cdn.jsdelivr.net/npm/three@0.187.0/build/three.core.js
```

```bash
python3 -m http.server 8766
```

```bash
node tools/render.mjs 1
```

## How it is published

`cloudflare/worker.js` is the Cloudflare Worker named `medieval`, attached to `medieval.johnshawler.com`. It serves
`index.html`, `storyboard.html` and `video/*.mp4` straight from the `main` branch of this repository and keeps a copy
at Cloudflare's edge (five minutes for the pages, an hour for the videos). A push to `main` is what publishes; the
Worker itself only needs redeploying if `cloudflare/worker.js` changes. Nothing else in the repository is public
through the site.

## Facts shown

All dates and numbers come from the slide faces: 476, 800, c. 1025, c. 1200, 1360s, c. 1400; the medieval period
as c. 500-1400, "about 900 years"; chant alone c. 500-900, organum from c. 900, Notre Dame c. 1160-1250; the four
composers' dates. The timeline in experience 1 is drawn to scale until its last beat. Five of the deck's eleven
instruments are shown: harp, vielle, hurdy-gurdy, shawm and nakers.
