# Work brief: graded Ink and Toon experiences from a PowerPoint deck

Give this brief to Claude Code together with a PowerPoint file. It asks for the same thing that was built for
"Pop Music of the 1950s": a set of short 3D animations in the Ink and Toon style, each followed by a check the
student answers by tapping objects in the scene, with a score card at the end.

## Fill these in before you send it

| | |
|---|---|
| Deck | *attach the .pptx* |
| Start from | https://github.com/johnshawler/50s (the kit, the player and a worked example) |
| Push the result to | *repository URL, or "do not push"* |
| Who it is for | *for example: grade 7 general music* |
| How many experiences | *default: one per question on the deck's review slide* |
| How grades are collected | *default: a score card the student shows or copies* |
| Slides to leave out or to be sure to include | *optional* |

## The goal

Turn the deck into short, gradable experiences a student can work through alone in a browser.

Each experience is one 10 to 15 second animation that explains one idea from the slides, then a check on that
idea. The student watches, presses "Your turn", and answers by tapping the objects they just watched. A score
card adds up the marks.

Done means:

- one self-contained `index.html` holding every chapter, its check and the score card
- one MP4 per chapter
- an approved storyboard
- everything pushed to the repository named above

## What you are starting from

Clone the "start from" repository. Most of it is reused as it stands; the scenes are what you write new.

| Path | What it is | For a new deck |
|---|---|---|
| `lib/stage.js`, `lib/sound.js` | Rendering kit and sound kit | Do not change |
| `lib/ink.js` | The Ink and Toon look and the staging helpers (ground, camera framings, lettered labels) | Reuse; extend only if the look needs a new piece |
| `lib/props.js` | Objects built in code | Keep the ones the new topic needs, add new ones in the same way |
| `lib/tunes.js` | Shared music on the drawing grid | Reuse or replace to suit the topic |
| `scenes/e1.js` to `e5.js` | One scene per experience | Replace all of them; read two first as the pattern |
| `src/app.html` | The player: chapters, controls, checks, score card | Reuse; change the page title, the heading and the storage key |
| `tools/` | Build, still, storyboard and video scripts | Reuse; update the scene lists if the chapter count changes |

The scene list is hard-coded in `tools/make_final.py` and `board_render.html`. Update both when the number of
chapters is not five.

## How to read the deck

- Use what is on the slide faces. Speaker notes may help you understand a slide, but every word, date and number
  shown on screen must come from a slide face.
- "Graded" means scored for a class.
- If the deck has a review or quiz slide, build one experience per question and say which slides feed each one.
  If it has none, choose the three to five ideas the deck spends most time on.
- Shorten captions to fit a caption box, and list every shortened caption in the storyboard.
- Count things. If a title says "four", the screen shows four. If you add a fifth, change the title or leave it
  out, and say which you did.
- Say which slides you did not use.

## Process

1. **Read the deck.** Extract the text of every slide and render the slides to images so you see the layout.
2. **Storyboard first, then stop and wait for an OK.** One page with one row per experience and one panel per beat,
   plus a panel for the check. Each panel is a still rendered from the real scene code at 16 samples. Under each:
   beat number, start and end time, exact on-screen text, what moves, what the camera does, key sounds. Below the
   grid: every fact or number you assumed, the slides you left out, and the decisions you need (the set of
   experiences, how grades are collected, anything to change). Publish it as an artifact.
3. **Build** exactly as storyboarded, reusing the storyboard's scene code. Add the sound score and the check to
   each scene.
4. **Check the motion** before the long render: low-sample frames three times a second for every chapter, tiled
   into one sheet per chapter, and look at them.
5. **Test the player** in headless Chrome: play, answer every kind of check, open the score card, phone width.
6. **Render the MP4s**, look at the first, last and four middle frames of each, then push.

## Rules for each animation

The look is fixed; the story, objects and words change with the deck.

- **Look.** Real 3D that reads as a hand-inked cel: two flat tones per material, a brush outline, halftone dots
  where light turns to shadow, hatching in cast shadows, warm paper inside a ruled panel. Paper, one ink and four
  spot colours. No textures, no downloaded models or images.
- **Motion.** Props move on twos (15 drawings a second) and snap between held poses with an overshoot and a quick
  settle. Speed lines and impact ticks last two or three drawings. Only the camera moves on every frame.
- **Camera.** Long lens looking down at a table-top. One framing per beat; a slow drift while the pose holds, a
  whip of about a third of a second to the next.
- **Story.** An explainer, not a title card. Things happen to objects over three to six beats that follow from
  each other. Words are small labels and captions. End on the result, not on a slogan.
- **Reading time.** Every caption stays up at least a second and a half. The first frame is worth looking at and
  the last second holds.
- **Phone-sized.** The subject fills most of the frame, and everything that matters stays inside the frame for
  the whole camera move.
- **Accuracy.** Draw the real thing. Simple forms that are right beat detailed ones that are wrong.

## Rules for each check

- The check happens in the scene the student just watched, posed for the purpose. They tap objects; a row of
  buttons under the picture offers the same answers for keyboard users and small screens.
- Four kinds exist in the player: pick several from a set, match a run of clues to objects, choose one of a few
  options, and clap along to a count. Add a new kind only if the content needs it.
- Decoys come from elsewhere in the same deck.
- The posed scene must not give the answer away: hide captions and read-outs that state it.
- A right answer makes the object hop and ding; a wrong one shakes and buzzes. Each answer is recorded with its
  text so the score card can show what the student chose and what was correct.
- State the points for every check in the storyboard. Students may retry; the card shows the attempt number.

## What a scene file contains

Follow `scenes/e1.js` and `scenes/e3.js`. In order:

- **Content block**: every on-screen word and number, named after the slide it came from.
- **Timing block**: every event time as a count of drawings, so picture and sound share one schedule.
- **Style object**: `id`, `title`, `slides`, `question`, `duration`, `play` (where the animation ends), `quizAt`
  (the time of the check pose, just after `play`), `beats` (the storyboard text for each beat), `quiz` (the
  storyboard summary of the check), `check` (the stages the player runs), `build(S)` and `sound(k)`.
- **`build(S)`** returns `{ targets, update(t) }`. `targets` maps each answer id to the object or objects that can
  be tapped. `update(t)` sets the whole scene for time `t` and nothing may build up between calls: no
  `Math.random`, no dates, no timers.
- **`sound(k)`** schedules every sound at the same times the picture uses. Effects in front, a quiet room bed
  underneath, short silences before the big hits.

## The player

Keep what `src/app.html` already does: a 1920x1080 canvas scaled to fit, play/pause, scrub, time, sound toggle,
loop on by default, chapter tabs that show each score, "Your turn", and a score card with name, every answer,
total and "copy as text". It exposes `window.seek(t)` and `window.DURATION`. Scores are stored in the browser
only; if a whole-class view is wanted, say so in the fill-in table and it becomes part of the storyboard decisions.

## Rendering

Each command below is run from the repository root.

```bash
python3 tools/make_final.py
```

```bash
python3 -m http.server 8765
```

```bash
node tools/render.mjs 1
```

`render.mjs` takes the chapter number. It seeks every frame at 30 fps with the scene's full sample count, pipes
the frames to ffmpeg, renders the sound offline and muxes it at about -15 LUFS. With no GPU, five chapters
rendered side by side took about 90 minutes for 65 seconds of animation, so start it in the background and
finish the testing while it runs. A change to one scene means re-rendering only that chapter.

## Traps already found

- **Thin flat things turn black.** The outline pulls ground-facing faces towards the lens. Build paper, shards and
  similar as a flat shape with an inked stroke round it, not as a thin box.
- **Glossy materials blow out flat faces.** Use the plain variants (`M.red`, `M.navyFlat`, `M.wood`) on boxes.
- **Hard-edged shapes tear the outline.** Pass `hard: true` for extrusions so the outline uses smoothed normals.
- **Lettering runs off the panel.** Place labels with `W.label`, which keeps them inside and prints them on top;
  give each beat's label a `look` time that falls inside that beat's framing.
- **Neighbours creep into frame.** Space stations at least five units apart when the camera visits them one at a
  time, and close them up for a group shot.
- **Empty frames after a whip.** Have the next object arrive with the camera, not after it.
- **Group shots sit small or clipped.** Render the line-up frame on its own and check every name is inside.
- **Sorting frame files by name** puts `_0.jpg` after `_0.995.jpg`. Number them with leading zeros.
- **Headless Chrome under load** makes clicks time out and timing games look broken. Test the player while no
  render is running, and test scoring rules as pure functions.

## How to report

At the storyboard: what each experience covers and its points, what you assumed, which slides you left out, and
the decisions you need.

At the end: the links, what changed from the storyboard, what you tested, and what you could not test. Say plainly
if you have not listened to the sound or tried a timing game on a real device.
