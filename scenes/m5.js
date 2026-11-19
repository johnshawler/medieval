// EXPERIENCE 5: "Four composers to remember" (deck slide 11). One figure, one object and one action for each.
{
  const { PAL, INK, PAPER, F, at, inkWorld, props, medieval, snd } = INKTOON;
  // ---------------------------------------------------------------- content (from the slide)
  const WHO = [
    { id: 'hildegard', word: 'HILDEGARD OF BINGEN', name: 'Hildegard of Bingen', when: '1098–1179, German abbess', note: 'wrote more than 70 chants and a sung play' },
    { id: 'leonin', word: 'LÉONIN', name: 'Léonin', when: 'active late 1100s, Notre Dame, Paris', note: 'two-voice organum for the whole church year' },
    { id: 'perotin', word: 'PÉROTIN', name: 'Pérotin', when: 'active c. 1200, Notre Dame, Paris', note: 'expanded organum to three and four voices' },
    { id: 'machaut', word: 'GUILLAUME DE MACHAUT', name: 'Guillaume de Machaut', when: 'c. 1300–1377, French poet-composer', note: 'the Messe de Nostre Dame and many love songs' },
  ];
  const ENDING = { note: 'we know these four because their names were written down' };
  const STEP = 42;
  const T = { at: WHO.map((_, i) => at(i * STEP)), wide: at(4 * STEP), names: at(4 * STEP + 7), play: at(4 * STEP + 44) }; T.quiz = T.play + 0.4;
  const X = [-9, -3, 3, 9], XL = [-4.2, -1.4, 1.4, 4.2];

  registerStyle({
    id: 'm5', name: 'Ink and Toon', title: 'Four composers to remember', slides: 'Slide 11', question: 'Which composer was an abbess? Which one wrote a complete Mass?',
    duration: T.play + 0.6, play: T.play, quizAt: T.quiz,
    fonts: ['260px "Anton"', '700 150px "Caveat"'],
    render: { samples: 16, preview: 2, shutter: 0, tone: 'linear', exposure: 1, bloom: 0, vignette: 0, grain: 0, fov: 26, background: PAL.teal.lit },
    beats: [
      { t0: T.at[0], t1: T.at[1], key: T.at[0] + 30 * F, text: [WHO[0].word, WHO[0].when, WHO[0].note], moves: 'Opens on an abbess in a veil. Beside her, pages of chant drop one after another onto a pile that keeps growing.', camera: 'Long lens on the figure and the pile, drifting.', sound: 'One clear high sung line; a soft paper landing for every page.' },
      { t0: T.at[1], t1: T.at[2], key: T.at[1] + 30 * F, text: [WHO[1].word, WHO[1].when, WHO[1].note], moves: 'A cleric with a sheet in front of him. Two rows of square notes, black and red, step across it together.', camera: 'Whips right to Léonin.', sound: 'Two sung lines moving together, pen strokes.' },
      { t0: T.at[2], t1: T.at[3], key: T.at[2] + 32 * F, text: [WHO[2].word, WHO[2].when, WHO[2].note], moves: 'A second cleric. His sheet starts with two rows, then a third (gold) and a fourth (teal) row pop in above them.', camera: 'Whips right to Pérotin.', sound: 'The two lines again, then a third and a fourth voice stacking into a chord.' },
      { t0: T.at[3], t1: T.wide, key: T.at[3] + 30 * F, text: [WHO[3].word, WHO[3].when, WHO[3].note], moves: 'A poet in a soft hat. A thick book lands in front of him (the Mass) and two hearts pop up beside it (the love songs).', camera: 'Whips right to Machaut.', sound: 'A heavy book thud, a full chord, two light pops.' },
      { t0: T.wide, t1: T.play, key: T.play - 0.3, text: [...WHO.map((w) => w.name), ENDING.note], moves: 'All four hop into one row with their objects. A name slip pops under each from left to right. Holds on the four.', camera: 'Pulls back to hold the line-up.', sound: 'Four paper slaps in a run, then one chord that rings out.' },
    ],
    quiz: { key: T.quiz, prompt: 'Who was it? Tap the composer for each clue.', how: 'Four clues, one at a time in shuffled order ("a German abbess who wrote more than 70 chants", "wrote a complete Mass, the Messe de Nostre Dame", "two-voice organum for the whole church year", "expanded organum to three and four voices"). Tap the figure in the line-up of four.', points: 4 },
    check: [
      { type: 'match', prompt: 'Who was it? Tap the composer for each clue.', shuffle: true, names: Object.fromEntries(WHO.map((w) => [w.id, w.name])),
        clues: [['a German abbess who wrote more than 70 chants', 'hildegard'], ['wrote two-voice organum for the whole church year', 'leonin'], ['expanded organum to three and four voices', 'perotin'], ['wrote a complete Mass, the Messe de Nostre Dame', 'machaut']] },
    ],

    build(S) {
      const { THREE, K, scene } = S, W = inkWorld(S, { wide: 11, centre: [0, -0.3], sunSize: 9 }), P = props(W), Md = medieval(W, P), { M, ink, group, pop, wobble, rig } = W, { mark, burst } = ink;
      const st = WHO.map((_, i) => { const g = group(); g.position.x = X[i]; return g; });
      const COLORS = [INK, PAL.persimmon.lit, PAL.mustard.lit, PAL.teal.shade];
      const figs = [Md.pawn({ kind: 'nun', robe: M.navyFlat }), Md.pawn({ kind: 'cleric', robe: M.tealProp, trim: M.red }), Md.pawn({ kind: 'cleric', robe: M.wood, trim: M.navyFlat }), Md.pawn({ kind: 'poet', robe: M.red, trim: M.tealProp })];
      figs.forEach((f, i) => { f.scale.setScalar(1.25); f.position.set(-0.95, 0, -0.4); f.rotation.y = 0.2; st[i].add(f); });
      const PX = (lu) => K.lerp(1.3, 0.55, lu), PZ = (lu) => K.lerp(0.0, 1.0, lu);   // each one's object: beside them for the solo, in front for the line-up

      // Hildegard: a growing pile of chants
      const pile = Array.from({ length: 9 }, (_, i) => { const p = Md.parchment(1.15, 1.45, i === 8 ? 4 : 0, { gap: 0.2 }); p.rotation.y = (K.hash(i, 3) - 0.5) * 0.5; st[0].add(p); return p; });
      const pileNotes = [0, 1, 2, 3, 4].map((i) => { const n = Md.sq(i % 2 ? PAL.persimmon.shade : INK, 1.1); n.position.set(-0.36 + i * 0.18, 0.1 * ((i * 2) % 3) - 0.1, 0.004); pile[8].userData.top.add(n); return n; });
      // Léonin and Pérotin: sheets of organum
      const sheets = [];
      const sheetOf = (i, nRows) => { const s = Md.parchment(2.5, 1.9, 0); s.rotation.y = -0.12; st[i].add(s); sheets.push(s);
        const rows = Array.from({ length: nRows }, (_, r) => Array.from({ length: 7 }, (_, k) => { const n = Md.sq(COLORS[r], 1.25); n.position.set(-0.93 + k * 0.31, -0.66 + r * 0.42 + [0, 0.07, 0.07, 0.14, 0.07, 0, 0.07][(k + r * 2) % 7] - 0.03, 0.004); s.userData.top.add(n); return n; })); return rows; };
      const rowsL = sheetOf(1, 2), rowsP = sheetOf(2, 4);
      // Machaut: the Mass, and love songs
      const mass = Md.book({ w: 1.3, d: 1.7, h: 0.42 }), massRig = rig(mass, st[3]); mass.rotation.y = -0.3;
      const hearts = [W.sprite(Md.heart(0.34)), W.sprite(Md.heart(0.24, PAL.mustard.lit))];
      const quill = Md.quill(); quill.scale.setScalar(0.8); scene.add(quill);

      const FR = [[0.2, 1.15, 26, -6, 8.4], [0.3, 0.95, 28, 5, 8.6], [0.6, 0.95, 28, -4, 8.6], [0.5, 1.15, 26, 5, 8.6]], keys = [];
      FR.forEach((f, i) => { const a = [X[i] + f[0], f[1], 0.2, f[2], f[3], f[4]], b = a.slice(); b[4] += 3.5; b[5] -= 0.2; keys.push([i ? T.at[i] + F : 0, a, 'inOutQuint'], [(i < 3 ? T.at[i + 1] : T.wide) - 4 * F, b, 'linear']); });
      keys.push([T.wide + 3 * F, [0.25, 0.75, 0.6, 27, 0, 16.4], 'inOutQuint'], [T.play, [0.25, 0.75, 0.6, 28, 1.2, 16.1], 'linear'], [T.play + 0.02, [0.25, 0.1, 0.6, 28, 0, 19.5], 'linear'], [T.quiz + 1, [0.25, 0.1, 0.6, 28, 0, 19.5]]);   // for the check the row sits higher, clear of the clue card
      W.setCamera(keys);

      WHO.forEach((w, i) => { const end = (i < 3 ? T.at[i + 1] : T.wide) - 5 * F;
        W.label({ word: w.word }, i ? T.at[i] + 6 * F : -1, end, [w.word.length > 12 ? -0.56 : -0.78, 0.7, 0.4], null, { height: w.word.length > 12 ? 0.36 : 0.56, look: T.at[i] + 1.0 });
        W.label({ note: w.when }, i ? T.at[i] + 8 * F : -1, end, null, [0.5, 0.5, 0.2], { tilt: 0.02, cap: 0.34, look: T.at[i] + 1.0 });
        W.label({ note: w.note }, i ? T.at[i] + 11 * F : -1, end, null, [0.05, -0.78, -0.5], { tilt: i % 2 ? 0.02 : -0.02, cap: 0.38, look: T.at[i] + 1.0 }); });
      W.label(ENDING, T.names + 14 * F, T.play + 0.005, null, [0, 0.7, 0], { tilt: -0.015, cap: 0.62, look: T.play - 0.2 });
      const names = WHO.map((w, i) => { const c = ink.caption(w.name, { height: 0.5 }), g = group(); g.add(c); g.quaternion.copy(W.spot(T.play - 0.2, 0, 0, 0).rot); g.position.set(XL[i] + [0.3, 0.1, 0.1, -0.3][i], 0.4, 2.3 + (i % 2) * 0.85); c.rotation.z = i % 2 ? 0.03 : -0.03; W.onTop(g, 23); return g; });

      const massPos = (q, lu) => [PX(lu), 4.6 * (1 - K.seg(q, T.at[3] + 8 * F, T.at[3] + 12 * F, K.ease.in)), PZ(lu)];

      return {
        targets: Object.fromEntries(WHO.map((w, i) => [w.id, [st[i], names[i]]])),
        update(t) {
          const [q, n] = W.onTwos(t), quiz = t >= T.play + 0.01, all = q >= T.wide - 1e-3 && !quiz;
          W.shoot(t);
          const lu = quiz ? 1 : K.seg(q, T.wide - 3 * F, T.wide + 3 * F), XS = X.map((x, i) => K.lerp(x, XL[i], lu)); st.forEach((g, i) => g.position.set(XS[i], 0.8 * Math.sin(Math.PI * lu), 0));
          const on = (i) => (q >= T.at[i] && (all || q < (i < 3 ? T.at[i + 1] + 4 * F : 99))) && !quiz;
          figs.forEach((f, i) => { const a = on(i); f.position.y = a ? 0.06 * (Math.floor(n / 2 + i) % 2) : 0; f.userData.mouth.visible = a && i < 3; });

          // Hildegard's pile grows, page by page
          pile.forEach((p, i) => { const land = T.at[0] + (2 + i * 3) * F, u = quiz ? 1 : K.seg(q, land - 3 * F, land, K.ease.in); p.visible = quiz || q >= land - 3 * F; p.position.set(PX(lu), i * 0.05 + 3.0 * (1 - u), PZ(lu)); p.rotation.z = 0.5 * (1 - u) * (i % 2 ? 1 : -1); });
          // Léonin: two voices; Pérotin: two, then three and four
          rowsL.forEach((row, r) => row.forEach((m, k) => { const x = q - (T.at[1] + (6 + k * 2 + r) * F); m.visible = quiz || x >= 0; m.scale.setScalar(quiz ? 1 : Math.max(pop(x, 0.18), 1e-3)); }));
          rowsP.forEach((row, r) => row.forEach((m, k) => { const x = q - (T.at[2] + (r < 2 ? 4 + k : 14 + (r - 2) * 8 + k) * F); m.visible = quiz || x >= 0; m.scale.setScalar(quiz ? 1 : Math.max(pop(x, 0.18), 1e-3)); }));
          // Machaut: the Mass lands, hearts for the love songs
          const ml = q - (T.at[3] + 12 * F); massRig.set(massPos(q, lu), massPos(q - F, lu), 0.5); sheets.forEach((s) => s.position.set(PX(lu) + 0.25 * (1 - lu), 0, PZ(lu))); massRig.outer.visible = quiz || q >= T.at[3] + 8 * F; W.squash(mass, 1 - 0.14 * wobble(ml + F * 0.5, 3.2, 8));
          hearts.forEach((h, i) => { const x = ml - (5 + i * 4) * F; h.visible = quiz || x >= 0; h.position.set(XS[3] + K.lerp(0.75, 0.5, lu) + i * 0.75, 1.15 + i * 0.3 + (quiz ? 0 : 0.05 * (Math.floor(n / 3 + i) % 2)), 0.4); h.scale.setScalar(quiz ? 1 : Math.max(pop(x, 0.22), 1e-3)); });
          // the names are written down
          names.forEach((g, i) => { const x = quiz ? 9 : q - (T.names + i * 3 * F); g.visible = x >= 0; g.scale.setScalar(Math.max(pop(x, 0.22), 1e-3)); });
          const ni = Math.max(0, Math.min(3, Math.floor((q - T.names) / (3 * F)))); quill.visible = all && q >= T.names - 2 * F && q < T.names + 14 * F; quill.rotation.set(-0.4, 0, -0.5); quill.position.set(XL[ni] + 1.2, 0.5 + (n % 2 ? 0.06 : 0), 2.5 + (ni % 2) * 0.85);

          W.finish(quiz ? 200 : q);
        },
      };
    },

    sound(k) {
      const SOLO = ['A4', 'C5', 'D5', 'E5', 'D5', 'C5', 'A4', 'G4', 'A4', 'C5', 'D5', 'A4'], LOW = ['D4', 'E4', 'E4', 'F4', 'E4', 'D4', 'E4'], HIGH = ['A4', 'B4', 'B4', 'C5', 'B4', 'A4', 'B4'];
      k.bed('room', 0, T.play, { gain: 0.7 });
      WHO.forEach((w, i) => { k.play('stamp', i ? T.at[i] + 6 * F : 0, { gain: i ? 0.85 : 0.5, pan: -0.3 }); k.play('slap', i ? T.at[i] + 8 * F : 0.1, { gain: 0.25, pan: 0.4 }); k.play('slap', i ? T.at[i] + 11 * F : 0.3, { gain: 0.25 }); if (i) k.play('whoosh', T.at[i] - 4 * F, { gain: 0.75, dur: 0.38 }); });
      // Hildegard: one high line, and page after page
      for (let t = 0.3, i = 0; t < T.at[1] - 0.5; t += 4 * F, i++) snd.voice(k, t, SOLO[i % 12], 0.42, { gain: 0.07 });
      for (let i = 0; i < 9; i++) { k.play('paper', T.at[0] + (i * 3) * F, { gain: 0.45, dur: 0.14, pan: 0.3, minor: true }); k.play('slap', T.at[0] + (2 + i * 3) * F, { gain: 0.18, pan: 0.3, minor: true }); }
      // Leonin: two voices, moving together
      LOW.forEach((n, i) => { const t = T.at[1] + (6 + i * 2) * F; snd.voice(k, t, n, 0.3, { gain: 0.065, pan: -0.25 }); snd.voice(k, t + F, HIGH[i], 0.3, { gain: 0.06, pan: 0.25 }); k.play('stroke', t, { material: 'pen', dur: 0.08, gain: 1.1, minor: true }); });
      // Perotin: two, then three, then four
      LOW.forEach((n, i) => { const t = T.at[2] + (4 + i) * F; snd.voice(k, t, n, 0.2, { gain: 0.05, pan: -0.3 }); snd.voice(k, t, HIGH[i], 0.2, { gain: 0.045, pan: 0.1 }); });
      [['D5', 'E5', 'F5', 'E5', 'D5', 'F5', 'E5'], ['A5', 'G5', 'A5', 'C6', 'A5', 'G5', 'A5']].forEach((line, r) => line.forEach((n, i) => snd.voice(k, T.at[2] + (14 + r * 8 + i) * F, n, 0.2, { gain: 0.045, pan: 0.3 + r * 0.2 })));
      snd.chord(k, T.at[2] + 30 * F, ['D4', 'A4', 'D5', 'A5'], 0.7); snd.bell(k, T.at[2] + 22 * F, 'D6', { gain: 0.35 });
      // Machaut: the Mass lands; love songs
      const ml = T.at[3] + 12 * F; k.play('swish', T.at[3] + 8 * F, { gain: 0.5, dur: 0.22 }); k.play('thud', ml, { gain: 1, f: 80 }); k.play('paper', ml, { gain: 0.6, dur: 0.2 }); snd.chord(k, ml + 2 * F, ['D3', 'A3', 'D4', 'F4', 'A4'], 1.3);
      k.play('pop', ml + 5 * F, { gain: 0.7, f: 700, pan: 0.3 }); k.play('pop', ml + 9 * F, { gain: 0.6, f: 880, pan: 0.4 }); snd.pluck(k, ml + 5 * F, 'A4', { gain: 0.12, pan: 0.3 }); snd.pluck(k, ml + 9 * F, 'D5', { gain: 0.12, pan: 0.4 });
      // the four together; their names written down
      k.play('whoosh', T.wide - 3 * F, { gain: 0.9, dur: 0.5 }); k.play('thud', T.wide + 3 * F, { gain: 0.7, f: 90 });
      WHO.forEach((w, i) => { k.play('slap', T.names + i * 3 * F, { gain: 0.5, pan: (i - 1.5) * 0.4 }); k.play('stroke', T.names + i * 3 * F, { material: 'pen', dur: 0.14, gain: 1.2, pan: (i - 1.5) * 0.4, minor: true }); });
      k.play('slap', T.names + 14 * F, { gain: 0.35 }); snd.chord(k, T.names + 16 * F, ['D3', 'A3', 'D4', 'F#4', 'A4', 'D5'], 1.6);
    },
  });
}
