// EXPERIENCE 1: "About 900 years" (deck slide 2). The medieval period on a timeline drawn to scale.
{
  const { PAL, INK, PAPER, F, at, inkWorld, props, medieval, snd } = INKTOON;
  // ---------------------------------------------------------------- content (from the slide)
  const EVENTS = [
    { year: 476, word: '476', note: 'Western Roman Empire falls', id: 'column', name: 'the fallen column' },
    { year: 800, word: '800', note: 'Charlemagne crowned emperor', id: 'crown', name: 'the crown' },
    { year: 1025, word: 'c. 1025', note: 'Guido’s staff notation', id: 'staff', name: 'the four-line staff' },
    { year: 1200, word: 'c. 1200', note: 'four-voice music in Paris', id: 'paris', name: 'the cathedral in Paris' },
    { year: 1365, word: '1360s', note: 'Machaut’s Mass', id: 'mass', name: 'the Mass book' },
    { year: 1400, word: 'c. 1400', note: 'Renaissance begins', id: 'dawn', name: 'the rising sun' },
  ];
  const ENDING = { word: 'c. 500–1400', note: 'about 900 years, between ancient Rome and the Renaissance' };
  // ---------------------------------------------------------------- timing and the scale of the table
  const STEP = 33, xOf = (year) => (year - 950) / 38;                // 38 years to one unit: 500 is at -11.8, 1400 at +11.8
  const T = { at: EVENTS.map((_, i) => at(i * STEP)), wide: at(6 * STEP), play: at(6 * STEP + 40) }; T.quiz = T.play + 0.4;
  const X = EVENTS.map((e) => xOf(e.year)), XL = [-6.3, -3.3, -0.9, 1.8, 4.3, 5.9];   // to scale for the journey, closed up for the last look

  registerStyle({
    id: 'm1', name: 'Ink and Toon', title: 'About 900 years', slides: 'Slide 2', question: 'About what years does the medieval period cover?',
    duration: T.play + 0.6, play: T.play, quizAt: T.quiz,
    fonts: ['260px "Anton"', '700 150px "Caveat"'],
    render: { samples: 16, preview: 2, shutter: 0, tone: 'linear', exposure: 1, bloom: 0, vignette: 0, grain: 0, fov: 26, background: PAL.teal.lit },
    beats: [
      { t0: T.at[0], t1: T.at[1], key: T.at[0] + 26 * F, text: [EVENTS[0].word, EVENTS[0].note], moves: 'Opens on a Roman column. A crack runs across it, the top half topples and lands beside the stump. A gold band (the medieval period) starts to roll out along the table from the year 500.', camera: 'Long lens on the column, slow drift.', sound: 'Stone creak, a heavy fall and rubble, then the band unrolling like a ribbon.' },
      { t0: T.at[1], t1: T.at[2], key: T.at[1] + 24 * F, text: [EVENTS[1].word, EVENTS[1].note], moves: 'The band runs on, to scale, and the camera follows it to a cushion. A crown drops onto it and settles with a glint.', camera: 'Whips right along the band to the year 800.', sound: 'Whoosh, a soft thump on velvet, a bright metal ring.' },
      { t0: T.at[2], t1: T.at[3], key: T.at[2] + 26 * F, text: [EVENTS[2].word, EVENTS[2].note], moves: 'A sheet ruled with four lines. A quill sets six square notes on it, stepping upwards one at a time.', camera: 'Whips right to c. 1025, a little higher to read the page.', sound: 'Six pen strokes, each with a rising plucked note.' },
      { t0: T.at[3], t1: T.at[4], key: T.at[3] + 24 * F, text: [EVENTS[3].word, EVENTS[3].note], moves: 'The twin towers of Notre Dame. Four notes in four colours pop up in a stack in front of it, one voice at a time.', camera: 'Whips right to c. 1200, pulled back for the towers.', sound: 'Four sung tones building a chord, with a bell.' },
      { t0: T.at[4], t1: T.at[5], key: T.at[4] + 24 * F, text: [EVENTS[4].word, EVENTS[4].note], moves: 'A thick bound book lands on the table: a whole Mass by one composer.', camera: 'Whips right to the 1360s.', sound: 'A heavy book thud, a page rustle, one chord.' },
      { t0: T.at[5], t1: T.wide, key: T.at[5] + 24 * F, text: [EVENTS[5].word, EVENTS[5].note], moves: 'The gold band reaches its end. A sun rises behind the end post, rays flicking on twos.', camera: 'A short whip right to the end of the band.', sound: 'The ribbon stops with a tick; a warm rising tone and a ding.' },
      { t0: T.wide, t1: T.play, key: T.play - 0.3, text: [ENDING.word, ENDING.note], moves: 'Everything hops together into one row over a short gold band: column, crown, staff, cathedral, book, sunrise. Holds.', camera: 'Pulls back to hold the whole row for the last second and a half.', sound: 'Six landings in a run, a paper slap for the caption, a last chord.' },
    ],
    quiz: { key: T.quiz, prompt: 'When was it? Tap the object for each date.', how: 'Six dates come up one at a time in shuffled order (476, 800, c. 1025, c. 1200, 1360s, c. 1400). Tap the object that marks each one. Then: "About what years does the medieval period cover?" with three choices.', points: 7 },
    check: [
      { type: 'match', prompt: 'When was it? Tap the object for each date.', shuffle: true, names: Object.fromEntries(EVENTS.map((e) => [e.id, e.name])), clues: EVENTS.map((e) => [e.word, e.id]) },
      { type: 'choice', prompt: 'About what years does the medieval period cover?', options: ['c. 100–500', 'c. 500–1400', 'c. 1400–1600'], answer: 1 },
    ],

    build(S) {
      const { THREE, K, scene } = S, W = inkWorld(S, { wide: 15, centre: [0, -0.3], sunSize: 9 }), P = props(W), Md = medieval(W, P), { M, ink, group, pop, wobble, rig } = W, { mark, burst } = ink;
      const st = EVENTS.map((_, i) => { const g = group(); g.position.x = X[i]; return g; });

      // the gold band: the medieval period, from 500 to 1400, rolled out to scale
      const B0 = xOf(500);
      const band = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.42).translate(0.5, 0, 0).rotateX(-Math.PI / 2), ink.fill(PAL.mustard, { band: 0 })); band.receiveShadow = true; band.position.set(B0, 0.012, 1.0); scene.add(band);
      const edges = [-1, 1].map((s) => { const m = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.045).translate(0.5, 0, 0).rotateX(-Math.PI / 2), ink.flat(INK)); m.position.set(B0, 0.016, 1.0 + s * 0.21); scene.add(m); return m; });
      const posts = EVENTS.map((e, i) => { const p = P.ball(0.13, i === 0 ? M.navyFlat : M.red, 0, 0.13, 1.0, st[i], { line: 3 }); return p; });
      const roll = P.ball(0.22, M.mustard, 0, 0.22, 1.0, scene, { line: 3 }); roll.scale.set(0.6, 1, 1.3);
      const bandTo = K.track([[0, B0], [T.at[0] + 22 * F, B0], [T.at[1], X[1], 'inOut'], [T.at[2] - 5 * F, X[1]], [T.at[2], X[2], 'inOut'], [T.at[3] - 5 * F, X[2]], [T.at[3], X[3], 'inOut'], [T.at[4] - 5 * F, X[3]], [T.at[4], X[4], 'inOut'], [T.at[5] - 5 * F, X[4]], [T.at[5] + 2 * F, X[5], 'inOut']]);

      // 476: the column that breaks
      const col = Md.column(); col.position.z = -0.9; st[0].add(col);
      const dust = W.sprite(mark(burst(11, 0.8, 0.3, 0.45, 0.07, 3)));
      // 800: the crown and its cushion
      const cush = Md.cushion(); cush.position.z = -0.8; st[1].add(cush); const crown = Md.crown(), crownRig = rig(crown, st[1]);
      const glint = [W.sprite(P.star(0.26)), W.sprite(P.star(0.16))];
      // c. 1025: four lines and six notes
      const page = Md.parchment(2.6, 1.7, 4, { gap: 0.22 }); page.position.z = -0.7; page.rotation.y = 0.12; st[2].add(page);
      const six = [0, 1, 2, 3, 4, 5].map((i) => { const n = Md.sq(i % 2 ? PAL.persimmon.shade : INK, 1.3); n.position.set(-0.85 + i * 0.34, -0.44 + i * 0.11, 0); page.userData.top.add(n); return n; });
      const quill = Md.quill(); quill.scale.setScalar(0.9); st[2].add(quill);
      // c. 1200: Notre Dame and four voices
      const paris = Md.cathedral(); paris.position.z = -1.3; paris.rotation.y = -0.12; paris.scale.setScalar(0.9); st[3].add(paris);
      const voices = [INK, PAL.persimmon.lit, PAL.mustard.lit, PAPER].map((c, i) => { const n = W.sprite(Md.sq(c, 2.4, 1.6)); return n; });
      // 1360s: the Mass
      const mass = Md.book({ w: 1.3, d: 1.7, h: 0.42 }), massRig = rig(mass, st[4]); mass.rotation.y = 0.35;
      // c. 1400: sunrise
      const dawn = Md.sunrise(0.62), dawnG = group(st[5]); dawnG.add(dawn);

      const FR = [[0.35, 1.25, 25, -6, 8.4], [0.1, 0.8, 28, 4, 7.4], [0.05, 0.6, 34, -4, 7.2], [1.3, 1.45, 24, 4, 9.6], [0.5, 0.7, 30, -4, 7.4], [-0.2, 1.05, 26, 3, 7.6]], keys = [];
      FR.forEach((f, i) => { const a = [X[i] + f[0], f[1], 0.1, f[2], f[3], f[4]], b = a.slice(); b[4] += 3.5; b[5] -= 0.2; keys.push([i ? T.at[i] + F : 0, a, 'inOutQuint'], [(i < 5 ? T.at[i + 1] : T.wide) - 4 * F, b, 'linear']); });
      keys.push([T.wide + 3 * F, [0.1, 0.9, 0.4, 28, 0, 19.4], 'inOutQuint'], [T.play, [0.1, 0.9, 0.4, 29, 1.2, 19.1], 'linear'], [T.quiz + 1, [0.1, 0.9, 0.4, 29, 1.2, 19.1]]);
      W.setCamera(keys);

      EVENTS.forEach((e, i) => { W.label({ word: e.word }, i ? T.at[i] + 6 * F : -1, (i < 5 ? T.at[i + 1] : T.wide) - 5 * F, [-0.5, 0.66, 0.4], null, { height: 0.62, look: T.at[i] + 1.0 });
        W.label({ note: e.note }, i ? T.at[i] + 9 * F : -1, (i < 5 ? T.at[i + 1] : T.wide) - 5 * F, null, [0.05, -0.76, -0.5], { tilt: i % 2 ? 0.02 : -0.02, cap: 0.42, look: T.at[i] + 1.0 }); });
      W.label({ word: ENDING.word }, T.wide + 8 * F, T.play + 0.005, [-0.5, 0.68, 0], null, { height: 1.05, look: T.play - 0.2 });
      W.label({ note: ENDING.note }, T.wide + 12 * F, T.play + 0.005, null, [0, -0.72, -1.0], { tilt: -0.015, cap: 0.7, look: T.play - 0.2 });

      const crownPos = (q) => [0, 0.36 + 4.2 * (1 - K.seg(q, T.at[1] + 4 * F, T.at[1] + 8 * F, K.ease.in)), -0.8];
      const massPos = (q) => [0, 4.6 * (1 - K.seg(q, T.at[4] - F, T.at[4] + 3 * F, K.ease.in)), -0.5];

      return {
        targets: { column: st[0], crown: st[1], staff: st[2], paris: st[3], mass: st[4], dawn: [dawnG, posts[5]] },
        update(t) {
          const [q, n] = W.onTwos(t), quiz = t >= T.play + 0.01;
          W.shoot(t);
          // for the last look everything hops into one short row
          const lu = quiz ? 1 : K.seg(q, T.wide - 3 * F, T.wide + 3 * F), XS = X.map((x, i) => K.lerp(x, XL[i], lu)); st.forEach((g, i) => g.position.set(XS[i], 0.8 * Math.sin(Math.PI * lu), 0));
          const end = lu > 0.5 ? XL[5] : bandTo(q), start = lu > 0.5 ? XL[0] + 0.6 : B0, len = Math.max(0.001, end - start);
          band.position.x = start; band.scale.x = len; edges.forEach((e) => { e.position.x = start; e.scale.x = len; }); band.visible = q >= T.at[0] + 22 * F || lu > 0.5; edges.forEach((e) => (e.visible = band.visible));
          roll.visible = band.visible && lu < 0.5 && q < T.at[5] + 2 * F; roll.position.x = end; roll.rotation.z = -n * 0.9;
          posts.forEach((p, i) => { p.visible = i === 0 || lu > 0.5 || bandTo(q) >= X[i] - 0.05; });

          // 476: crack, topple, land
          const c0 = T.at[0] + 12 * F, c1 = T.at[0] + 16 * F, c2 = T.at[0] + 20 * F, f = K.seg(q, c1, c2, K.ease.in), hi = col.userData.high;
          col.userData.crack.visible = q >= c0 && q < c2; hi.position.set(0.95 * f, 1.1 - 0.72 * f * f, 0.25 * f); hi.rotation.z = -(Math.PI / 2 - 0.12) * f; col.rotation.z = q < c1 ? 0.03 * wobble(q - c0 + 0.02, 6, 6) : 0;
          const dx = q - c2; dust.visible = dx >= 0 && dx < 2 * F - 1e-3; dust.position.set(XS[0] + 1.3, 0.25, -0.5); dust.scale.setScalar(dx < F - 1e-3 ? 0.85 : 1.15);
          // 800: the crown lands
          const cl = q - (T.at[1] + 8 * F); crownRig.set(crownPos(q), crownPos(q - F), 0.5); crownRig.outer.visible = q >= T.at[1] + 4 * F || quiz; W.squash(cush, 1 - 0.2 * wobble(cl + F * 0.5, 3.2, 8));
          glint.forEach((m, i) => { const x = cl - (3 + i * 3) * F; m.visible = x >= 0 && !quiz && lu < 0.5 && Math.floor(n / 3) % 2 === i; m.position.set(XS[1] + (i ? 0.5 : -0.45), 1.15 + i * 0.2, -0.4); });
          // c. 1025: the quill sets six notes on four lines
          const w0 = T.at[2] + 7 * F, wi = Math.floor((q - w0) / (3 * F) + 1e-3), writing = wi >= 0 && wi < 6 && !quiz;
          six.forEach((m, i) => { const x = q - (w0 + i * 3 * F); m.visible = x >= 0 || quiz; m.scale.setScalar(quiz ? 1 : Math.max(pop(x, 0.2), 1e-3)); });
          const qi = Math.max(0, Math.min(5, wi)); quill.visible = q >= T.at[2] + 3 * F; quill.rotation.set(-0.5, 0.12, -0.45); quill.position.set(-0.85 + qi * 0.34 + (writing ? 0.03 : 0.5), 0.05 + (writing && n % 2 ? 0.05 : 0), -0.7 - (-0.44 + qi * 0.11) + (writing ? 0 : 0.5));
          // c. 1200: four voices stack up
          voices.forEach((m, i) => { const x = q - (T.at[3] + (7 + i * 3) * F); m.visible = (x >= 0 && q < T.at[4] - 4 * F && !quiz); m.position.set(XS[3] + 1.75, 0.5 + i * 0.5, 0.2); m.scale.setScalar(Math.max(pop(x, 0.2), 1e-3)); });
          // 1360s: the book lands
          const ml = q - (T.at[4] + 3 * F); massRig.set(massPos(q), massPos(q - F), 0.5); massRig.outer.visible = q >= T.at[4] - F || quiz; W.squash(mass, 1 - 0.14 * wobble(ml + F * 0.5, 3.2, 8));
          // c. 1400: the sun comes up
          const up = quiz ? 1 : K.seg(q, T.at[5] + 4 * F, T.at[5] + 12 * F, K.ease.out); dawnG.visible = q >= T.at[5] + 4 * F || quiz; dawnG.position.set(0.5, -0.5 + 1.75 * up, -1.6); dawnG.quaternion.copy(S.camera.quaternion);
          dawn.userData.rays.forEach((r, k) => { r.visible = up > 0.9 && Math.floor(n / 3) % 2 === k; });

          W.finish(quiz ? 200 : q);
        },
      };
    },

    sound(k) {
      // every time below is a frame the picture also changes on (see T)
      const c0 = T.at[0] + 12 * F, c2 = T.at[0] + 20 * F, HEX = ['C4', 'D4', 'E4', 'F4', 'G4', 'A4'];
      k.bed('room', 0, T.play, { gain: 0.7 });
      EVENTS.forEach((e, i) => { k.play('stamp', i ? T.at[i] + 6 * F : 0, { gain: i ? 0.85 : 0.5, pan: -0.3 }); k.play('slap', i ? T.at[i] + 9 * F : 0.1, { gain: 0.25 }); if (i) { k.play('whoosh', T.at[i] - 4 * F, { gain: 0.75, dur: 0.38 }); k.play('tape', T.at[i] - 5 * F, { gain: 0.5, dur: 0.4 }); } });
      // 476: the column cracks and falls
      k.noise(c0, { dur: 0.3, color: 'brown', filter: 'bandpass', f: 320, q: 3, gain: 0.5, a: 0.02 }); k.play('tick', c0, { gain: 0.8, f: 1800 }); k.play('swish', T.at[0] + 16 * F, { gain: 0.5, dur: 0.25 });
      k.play('impact', c2, { gain: 1, f: 100 }); for (let i = 0; i < 4; i++) k.play('tock', c2 + (1 + i * 1.5) * F, { gain: 0.5 - i * 0.1, f: 240 + i * 45, pan: 0.2 }); k.play('tape', T.at[0] + 22 * F, { gain: 0.6, dur: 0.5 });
      // 800: the crown
      const cl = T.at[1] + 8 * F; k.play('swish', T.at[1] + 4 * F, { gain: 0.5, dur: 0.22 }); k.play('thud', cl, { gain: 0.55, f: 90 }); k.play('ding', cl, { gain: 0.6, f: 'A6' }); k.play('sparkle', cl + 3 * F, { gain: 0.9 });
      // c. 1025: six notes on four lines
      HEX.forEach((n, i) => { const t = T.at[2] + (7 + i * 3) * F; k.play('stroke', t, { material: 'pen', dur: 0.12, gain: 1.4, minor: true }); snd.pluck(k, t, n, { gain: 0.14 }); });
      // c. 1200: four voices
      ['D4', 'A4', 'D5', 'F5'].forEach((n, i) => snd.voice(k, T.at[3] + (7 + i * 3) * F, n, 1.5 - i * 0.2, { gain: 0.075, pan: (i - 1.5) * 0.25 })); snd.bell(k, T.at[3] + 16 * F, 'D6', { gain: 0.45 });
      // 1360s: the Mass
      const ml = T.at[4] + 3 * F; k.play('swish', T.at[4] - F, { gain: 0.5, dur: 0.22 }); k.play('thud', ml, { gain: 1, f: 80 }); k.play('paper', ml, { gain: 0.7, dur: 0.2 }); snd.chord(k, ml + 3 * F, ['D3', 'A3', 'D4', 'F4'], 1.2);
      // c. 1400: the sun comes up
      k.play('tick', T.at[5] + 2 * F, { gain: 1 }); k.tone(T.at[5] + 4 * F, { f: [[0, 196], [0.5, 587]], type: 'triangle', dur: 0.6, gain: 0.1, a: 0.3, verb: 0.3 }); snd.bell(k, T.at[5] + 12 * F, 'D6'); snd.bell(k, T.at[5] + 15 * F, 'A6', { gain: 0.4 });
      // the last look
      k.play('whoosh', T.wide - 3 * F, { gain: 0.9, dur: 0.5 }); for (let i = 0; i < 6; i++) k.play('tock', T.wide + 3 * F + i * 0.03, { gain: 0.5, f: 200 + i * 40, pan: (i - 2.5) * 0.25 }); k.play('thud', T.wide + 3 * F, { gain: 0.7, f: 90 });
      k.play('stamp', T.wide + 8 * F, { gain: 0.9, pan: -0.3 }); k.play('slap', T.wide + 12 * F, { gain: 0.4 }); snd.chord(k, T.wide + 14 * F, ['D3', 'A3', 'D4', 'F#4', 'A4'], 1.7);
    },
  });
}
