// EXPERIENCE 3: "One melody, then many" (deck slides 4 and 6). From monophony to polyphony.
{
  const { PAL, INK, PAPER, F, at, inkWorld, props, medieval, snd } = INKTOON;
  // ---------------------------------------------------------------- content (from the slides)
  const STEPS = [
    { word: 'MONOPHONY', note: 'chant, c. 500–900: one line for everyone' },
    { word: 'ORGANUM', note: 'from c. 900: a second voice travels along with the chant' },
    { word: 'NOTRE DAME, PARIS', note: 'c. 1160–1250: Léonin writes for 2 voices; Pérotin for 3 and 4' },
    { word: 'POLYPHONY', note: 'two or more different melodies at the same time' },
  ];
  const COLORS = [INK, PAL.persimmon.lit, PAL.mustard.lit, PAL.teal.shade];   // the chant, then each added voice
  // one contour per voice: how far each note sits above its own line
  const LINES = [
    [0, 1, 1, 2, 1, 0, 1, 2, 2, 1, 0, 0],
    [0, 1, 1, 2, 1, 0, 1, 2, 2, 1, 0, 0],                             // organum: the same shape, a step away
    [2, 0, 1, 3, 2, 3, 1, 0, 2, 3, 1, 2, 0, 1, 3, 2, 1, 0],
    [1, 3, 2, 0, 1, 2, 3, 1, 0, 2, 1, 3, 2, 0, 1, 3, 2, 1],
  ];
  const STEP = 42;
  const T = { at: STEPS.map((_, i) => at(i * STEP)), play: at(4 * STEP + 8) }; T.quiz = T.play + 0.4;

  registerStyle({
    id: 'm3', name: 'Ink and Toon', title: 'One melody, then many', slides: 'Slides 4 and 6', question: 'Is Gregorian chant monophonic or polyphonic? How can you tell?',
    duration: T.play + 0.6, play: T.play, quizAt: T.quiz,
    fonts: ['260px "Anton"', '700 150px "Caveat"'],
    render: { samples: 16, preview: 2, shutter: 0, tone: 'linear', exposure: 1, bloom: 0, vignette: 0, grain: 0, fov: 26, background: PAL.teal.lit },
    beats: [
      { t0: T.at[0], t1: T.at[1], key: T.at[0] + 34 * F, text: [STEPS[0].word, STEPS[0].note], moves: 'Opens on four monks in a row behind a long sheet of parchment. They bob together, mouths open, and ONE row of black square notes steps across the sheet as they sing. A black tag over each head shows they share the line.', camera: 'Long lens from the front, slow drift.', sound: 'One sung line in unison (stacked sine voices), no beat, a long church echo.' },
      { t0: T.at[1], t1: T.at[2], key: T.at[1] + 34 * F, text: [STEPS[1].word, STEPS[1].note], moves: 'Two of the monks’ tags flip to red and a second, red row of notes appears just above the chant, moving in step with it.', camera: 'Snaps to a slightly higher angle on the sheet.', sound: 'The same line, now doubled a fifth above.' },
      { t0: T.at[2], t1: T.at[3], key: T.at[2] + 36 * F, text: [STEPS[2].word, STEPS[2].note], moves: 'A third (gold) and a fourth (white) row arrive with busier shapes of their own. Every monk now has his own colour and they bob out of step.', camera: 'Snaps round and pulls back a little to hold four rows.', sound: 'Two quick upper voices dancing over the slow chant; a bell on the fourth voice.' },
      { t0: T.at[3], t1: T.play, key: T.play - 0.3, text: [STEPS[3].word, STEPS[3].note], moves: 'All four rows complete on the sheet, four colours, four shapes. The monks keep singing. Holds.', camera: 'Settles square-on above the sheet and holds.', sound: 'All four voices land on one open chord that rings out.' },
    ],
    quiz: { key: T.quiz, prompt: 'Look at the sheet and choose.', how: 'The sheet changes for each question. One row of notes: "This is Gregorian chant. Monophonic or polyphonic?" Four rows: "And this?" Two rows: "What is this early polyphony called?" Then: "Who wrote for 3 and 4 voices at Notre Dame?"', points: 4 },
    check: [
      { type: 'choice', low: true, pose: 1, prompt: 'This is Gregorian chant: four monks, one line. Monophonic or polyphonic?', options: ['monophonic', 'polyphonic'], answer: 0 },
      { type: 'choice', low: true, pose: 4, prompt: 'Now each monk has his own line. Monophonic or polyphonic?', options: ['monophonic', 'polyphonic'], answer: 1 },
      { type: 'choice', low: true, pose: 2, prompt: 'A second voice travels along with the chant. What is it called?', options: ['estampie', 'organum', 'motet'], answer: 1 },
      { type: 'choice', low: true, pose: 4, prompt: 'Who wrote for 3 and 4 voices at Notre Dame?', options: ['Léonin', 'Pérotin', 'Guillaume de Machaut'], answer: 1 },
    ],

    build(S) {
      const { THREE, K, scene } = S, W = inkWorld(S, { wide: 1.5, centre: [0, 0] }), P = props(W), Md = medieval(W, P), { M, ink, group, pop, wobble } = W, { mark, burst } = ink;
      const MX = [-2.7, -0.9, 0.9, 2.7];
      const monks = MX.map((x, i) => { const m = Md.pawn({ kind: 'monk', robe: M.navyFlat }); m.position.set(x, 0, -1.3); m.rotation.y = (1.5 - i) * 0.08; scene.add(m); return m; });
      const tags = monks.map((m, i) => COLORS.map((c) => { const t = W.sprite(Md.sq(c, 2.0)); return t; }));
      const sheet = Md.parchment(7.6, 2.5, 0); sheet.position.set(0, 0, 0.9); scene.add(sheet);
      const guide = mark([0, 1, 2, 3].map((r) => [[[-3.5, -0.92 + r * 0.56], [3.5, -0.92 + r * 0.56]], 0.012, 'none']), '#b9a98a', 0); guide.position.z = 0.002; sheet.userData.top.add(guide);
      const rows = LINES.map((line, r) => line.map((h, i) => { const n = Md.sq(COLORS[r], 1.5, r > 1 ? 0.8 : 1.25); n.position.set(-3.2 + i * 6.4 / (line.length - 1), -0.92 + r * 0.56 + (h - 1) * 0.09, 0.006); sheet.userData.top.add(n); return n; }));
      const sing = [0, 1, 2].map((k) => W.sprite(P.wave(1.6, 0.13, k * 2.1, 0.06)));

      // when each row starts to be written, and how fast
      const R0 = [T.at[0] + 4 * F, T.at[1] + 8 * F, T.at[2] + 8 * F, T.at[2] + 16 * F], RD = [3 * F, 2 * F, 1.4 * F, 1.4 * F];
      const shown = (q, r, i) => q >= R0[r] + Math.floor(i * RD[r] / F + 1e-3) * F;
      // which line each monk sings in each step
      const VOICE = [[0, 0, 0, 0], [0, 0, 1, 1], [0, 1, 2, 3], [0, 1, 2, 3]];

      const C = [-0.9, 0.5, 0.6];
      W.setCamera([[0, [...C, 31, -6, 12.8]], [T.at[1] - 5 * F, [...C, 32, -3, 12.6], 'linear'], [T.at[1], [...C, 34, 3, 12.6], 'inOutQuint'], [T.at[2] - 5 * F, [...C, 35, 6, 12.4], 'linear'],
        [T.at[2], [...C, 34, -5, 12.8], 'inOutQuint'], [T.at[3] - 5 * F, [...C, 35, -2, 12.6], 'linear'], [T.at[3], [...C, 35, 0, 12.7], 'inOutQuint'], [T.play, [...C, 36, 1.5, 12.5], 'linear'], [T.play + 0.02, [0, 0.24, 0.6, 36, 0, 13.9], 'linear'], [T.quiz + 1, [0, 0.24, 0.6, 36, 0, 13.9]]]);   // for the check: centred and a little higher, clear of the question
      STEPS.forEach((s, i) => { W.label({ word: s.word }, i ? T.at[i] + 3 * F : -1, (i < 3 ? T.at[i + 1] - 5 * F : T.play + 0.005), [-0.62, 0.7, 0], null, { height: 0.56, look: T.at[i] + 1.0 });
        W.label({ note: s.note }, i ? T.at[i] + 6 * F : -1, (i < 3 ? T.at[i + 1] - 5 * F : T.play + 0.005), null, [0, -0.72, -0.8], { tilt: i % 2 ? 0.015 : -0.015, cap: [0.56, 0.5, 0.45, 0.56][i], look: T.at[i] + 1.0 }); });

      return {
        targets: {},
        update(t) {
          const [q, n] = W.onTwos(t), quiz = t >= T.play + 0.01, pose = quiz ? (S.pose || 4) : 0;
          W.shoot(t);
          const step = quiz ? (pose === 1 ? 0 : pose === 2 ? 1 : 3) : q >= T.at[3] ? 3 : q >= T.at[2] + 8 * F ? 2 : q >= T.at[1] + 6 * F ? 1 : 0, nRows = [1, 2, 4, 4][step];
          rows.forEach((row, r) => row.forEach((m, i) => { const on = quiz ? r < nRows : shown(q, r, i); m.visible = on; if (on && !quiz) { const x = q - (R0[r] + Math.floor(i * RD[r] / F + 1e-3) * F); m.scale.setScalar(Math.max(pop(x, 0.18), 1e-3)); } else m.scale.setScalar(1); }));
          monks.forEach((m, i) => { const v = VOICE[step][i], ph = step < 1 ? 0 : v * 1.7; m.position.y = quiz ? 0 : 0.07 * (Math.floor(n / 2 + ph) % 2); m.userData.mouth.visible = !quiz; m.userData.head.rotation.x = quiz ? 0 : -0.12 * (Math.floor(n / 2 + ph) % 2);
            tags[i].forEach((tg, c) => { tg.visible = c === v; tg.position.set(MX[i], 1.98 + (quiz ? 0 : 0.05 * (Math.floor(n / 2 + ph) % 2)), -1.3); }); });
          const w = Math.floor(n / 3) % 3; sing.forEach((m, k) => { m.visible = !quiz && step === 0 && k === w; m.position.set(3.4, 1.5, -1.3); });
          W.finish(quiz ? 200 : q);
        },
      };
    },

    sound(k) {
      const R0 = [T.at[0] + 4 * F, T.at[1] + 8 * F, T.at[2] + 8 * F, T.at[2] + 16 * F], RD = [3 * F, 2 * F, 1.4 * F, 1.4 * F], when = (r, i) => R0[r] + Math.floor(i * RD[r] / F + 1e-3) * F;
      const PITCH = [['D4', 'E4', 'F4', 'G4'], ['A4', 'B4', 'C5', 'D5'], ['D5', 'E5', 'F5', 'G5'], ['A4', 'C5', 'D5', 'E5']];
      k.bed('room', 0, T.play, { gain: 0.7 });
      STEPS.forEach((s, i) => { k.play('stamp', i ? T.at[i] + 3 * F : 0, { gain: i ? 0.7 : 0.45, pan: -0.3 }); k.play('slap', i ? T.at[i] + 6 * F : 0.1, { gain: 0.25 }); if (i) k.play('swish', T.at[i] - 4 * F, { gain: 0.35, dur: 0.3 }); });
      // monophony: every monk on the one line
      LINES[0].forEach((h, i) => { for (const p of [-0.5, -0.15, 0.15, 0.5]) snd.voice(k, when(0, i), PITCH[0][h], 0.36, { gain: 0.035, pan: p }); });
      // organum: the chant again, with a second voice a fifth above, in step
      LINES[1].forEach((h, i) => { snd.voice(k, when(1, i), PITCH[0][h], 0.3, { gain: 0.06, pan: -0.3 }); snd.voice(k, when(1, i), PITCH[1][h], 0.3, { gain: 0.055, pan: 0.3 }); });
      // Notre Dame: the chant stretched out below, two quick voices of their own above
      for (let t = T.at[2] + 8 * F, i = 0; t < T.at[3] - 4 * F; t += 8 * F, i++) snd.voice(k, t, ['D4', 'F4', 'E4', 'D4'][i % 4], 0.62, { gain: 0.07, pan: -0.45 });
      LINES[2].forEach((h, i) => snd.voice(k, when(2, i), PITCH[2][h], 0.16, { gain: 0.04, pan: 0.2 })); LINES[3].forEach((h, i) => snd.voice(k, when(3, i), PITCH[3][h], 0.16, { gain: 0.04, pan: 0.5 })); snd.bell(k, R0[3], 'D6', { gain: 0.4 });
      // polyphony: all four voices land together
      snd.chord(k, T.at[3] + 4 * F, ['D4', 'A4', 'D5', 'A5'], T.play - T.at[3] - 0.4, { gain: 0.06 });
    },
  });
}
