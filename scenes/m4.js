// EXPERIENCE 4: "Plucked, bowed, cranked" (deck slides 9 and 10). How medieval instruments make their sound, and loud or soft.
{
  const { PAL, INK, PAPER, F, at, inkWorld, props, medieval, snd } = INKTOON;
  // ---------------------------------------------------------------- content (from the slides)
  const WAYS = [
    { word: 'PLUCKED', note: 'harp: small enough to rest on the lap' },
    { word: 'BOWED', note: 'vielle: the medieval fiddle' },
    { word: 'CRANKED', note: 'hurdy-gurdy: a crank turns a wheel that rubs the strings' },
    { word: 'LOUD', note: 'shawm, a double reed, and nakers, small kettledrums' },
  ];
  const ENDING = { soft: { word: 'SOFT', note: 'like most strings: played indoors' }, loud: { word: 'LOUD', note: 'outdoors and for dancing' } };
  const STEP = 39;
  const T = { at: WAYS.map((_, i) => at(i * STEP)), wide: at(4 * STEP), sides: at(4 * STEP + 8), play: at(4 * STEP + 46) }; T.quiz = T.play + 0.4;
  const X = [-9, -3, 3, 9], XL = [-5.2, -3.1, -0.4, 3.4];             // harp, vielle, hurdy-gurdy, the loud pair

  registerStyle({
    id: 'm4', name: 'Ink and Toon', title: 'Plucked, bowed, cranked', slides: 'Slides 9 and 10', question: 'Name two medieval instruments. How does each one make its sound?',
    duration: T.play + 0.6, play: T.play, quizAt: T.quiz,
    fonts: ['260px "Anton"', '700 150px "Caveat"'],
    render: { samples: 16, preview: 2, shutter: 0, tone: 'linear', exposure: 1, bloom: 0, vignette: 0, grain: 0, fov: 26, background: PAL.teal.lit },
    beats: [
      { t0: T.at[0], t1: T.at[1], key: T.at[0] + 28 * F, text: [WAYS[0].word, WAYS[0].note], moves: 'Opens on a small harp. A quill plectrum steps from string to string; each pluck throws a tick mark and a round note.', camera: 'Long lens on the harp, drifting.', sound: 'Plucked notes rising up a scale, short and clear.' },
      { t0: T.at[1], t1: T.at[2], key: T.at[1] + 28 * F, text: [WAYS[1].word, WAYS[1].note], moves: 'A vielle. A bow slides back and forth across its strings on twos and a long wavy line of sound streams out.', camera: 'Whips right to the vielle.', sound: 'A sustained, reedy bowed tone that swells with each stroke.' },
      { t0: T.at[2], t1: T.at[3], key: T.at[2] + 28 * F, text: [WAYS[2].word, WAYS[2].note], moves: 'A hurdy-gurdy lying on the table. Its crank goes round, the wheel spins and one unbroken line of sound comes out: the drone.', camera: 'Whips right, higher, to look down at the wheel.', sound: 'A buzzing drone that never stops, with a click on every turn of the crank.' },
      { t0: T.at[3], t1: T.wide, key: T.at[3] + 28 * F, text: [WAYS[3].word, WAYS[3].note], moves: 'A shawm standing on its bell and a pair of nakers. The sticks beat the drums in turn, the shawm blasts jagged lines and bolts, and both jump with every hit.', camera: 'Whips right and back to take in both.', sound: 'A piercing nasal blast and pounding kettledrums, much louder than anything before.' },
      { t0: T.wide, t1: T.play, key: T.play - 0.3, text: [ENDING.soft.word, ENDING.soft.note, ENDING.loud.word, ENDING.loud.note], moves: 'All five hop into one row: the three strings together on the left, playing gently; the shawm and nakers on the right, still blasting. Holds.', camera: 'Pulls back to hold the whole row.', sound: 'Soft strings on the left, loud band on the right, two paper slaps for the captions.' },
    ],
    quiz: { key: T.quiz, prompt: 'How does it make its sound? Tap the instrument for each clue.', how: 'Five clues, one at a time in shuffled order ("plucked", "bowed: the medieval fiddle", "a crank turns a wheel that rubs the strings", "a double reed with a piercing sound", "a pair of small kettledrums"). Tap the instrument that fits.', points: 5 },
    check: [
      { type: 'match', prompt: 'How does it make its sound? Tap the instrument.', shuffle: true, names: { harp: 'harp', vielle: 'vielle', hurdy: 'hurdy-gurdy', shawm: 'shawm', nakers: 'nakers' },
        clues: [['plucked strings, small enough to rest on the lap', 'harp'], ['bowed: the medieval fiddle', 'vielle'], ['a crank turns a wheel that rubs the strings', 'hurdy'], ['a double reed with a piercing sound', 'shawm'], ['a pair of small kettledrums', 'nakers']] },
    ],

    build(S) {
      const { THREE, K, scene } = S, W = inkWorld(S, { wide: 11, centre: [0, -0.3], sunSize: 9 }), P = props(W), Md = medieval(W, P), { M, ink, group, pop, wobble } = W, { mark, burst } = ink;
      const st = WAYS.map((_, i) => { const g = group(); g.position.x = X[i]; return g; });

      // plucked: the harp and a plectrum
      const harp = Md.harp(); harp.rotation.y = 0.35; harp.scale.setScalar(1.15); st[0].add(harp);
      const plec = Md.quill(); plec.scale.setScalar(0.5); st[0].add(plec);
      const pluck = [0, 1].map((k) => W.sprite(mark(burst(6, 0.14, 0.14, 0.2, 0.045, 11 + k))));
      const hnotes = [0, 1, 2].map((i) => W.sprite(P.note(i % 2 ? PAL.mustard.lit : PAPER, 0.8)));
      // bowed: the vielle and its bow
      const vielle = Md.vielle(); vielle.scale.setScalar(1.3); vielle.rotation.set(-0.1, 0.15, 0); st[1].add(vielle);
      const bow = Md.bow(); bow.scale.setScalar(1.15); st[1].add(bow);
      const vwave = [0, 1, 2].map((k) => W.sprite(P.wave(2.0, 0.16, k * 2.1, 0.075)));
      // cranked: the hurdy-gurdy
      const hurdy = Md.hurdy(); hurdy.rotation.y = 0.3; hurdy.scale.setScalar(1.15); st[2].add(hurdy);
      const drone = [0, 1, 2].map((k) => W.sprite(mark([[Array.from({ length: 20 }, (_, i) => [i / 19 * 2.6, 0.03 * Math.sin(i * 1.7 + k * 2)]), 0.085, 'tail']], PAPER, 0.026)));
      const turn = [0, 1].map((k) => { const m = W.sprite(mark([[ink.arc(0.5, 0.4 + k, 2.3 + k, 14), 0.055, 'tail'], [ink.arc(0.5, 3.5 + k, 5.4 + k, 14), 0.055, 'tail']])); return m; });
      // loud: shawm and nakers
      const shawm = Md.shawm(), shawmG = group(st[3]); shawmG.add(shawm); shawmG.position.set(-1.0, 0, -0.2);
      const nak = Md.nakers(), nakG = group(st[3]); nakG.add(nak); nakG.position.set(0.9, 0, 0.3); nak.rotation.y = -0.15;
      const blast = [0, 1].map((k) => [W.sprite(P.zig(1.1, 0.2, 0.11, PAL.mustard.lit)), W.sprite(P.bolt(PAL.persimmon.lit, 1)), W.sprite(P.bolt(PAL.mustard.lit, 0.9))]);
      const bang = [0, 1].map((k) => W.sprite(mark(burst(8, 0.55, 0.25, 0.4, 0.07, 40 + k))));

      const FR = [[-0.5, 1.25, 24, -6, 7.8], [-0.5, 1.2, 24, 5, 8.2], [-0.1, 0.75, 32, -4, 9.2], [-0.1, 1.5, 24, 4, 9.2]], keys = [];
      FR.forEach((f, i) => { const a = [X[i] + f[0], f[1], 0.2, f[2], f[3], f[4]], b = a.slice(); b[4] += 3.5; b[5] -= 0.2; keys.push([i ? T.at[i] + F : 0, a, 'inOutQuint'], [(i < 3 ? T.at[i + 1] : T.wide) - 4 * F, b, 'linear']); });
      keys.push([T.wide + 3 * F, [-0.6, 0.85, 0.3, 27, 0, 16.4], 'inOutQuint'], [T.play, [-0.6, 0.85, 0.3, 28, 1.2, 16.1], 'linear'], [T.quiz + 1, [-0.6, 0.85, 0.3, 28, 1.2, 16.1]]);
      W.setCamera(keys);

      WAYS.forEach((w, i) => { W.label({ word: w.word }, i ? T.at[i] + 6 * F : -1, (i < 3 ? T.at[i + 1] : T.wide) - 5 * F, [-0.5, 0.68, 0.4], null, { height: 0.58, look: T.at[i] + 1.0, block: i === 3 ? undefined : PAL.navy.lit });
        W.label({ note: w.note }, i ? T.at[i] + 9 * F : -1, (i < 3 ? T.at[i + 1] : T.wide) - 5 * F, null, [0, -0.78, -0.5], { tilt: i % 2 ? 0.02 : -0.02, cap: i > 1 ? 0.36 : 0.4, look: T.at[i] + 1.0 }); });
      const sideWords = [W.label({ word: ENDING.soft.word }, T.sides, 99, [-0.42, 0.68, 0], null, { height: 0.8, look: T.play - 0.2, block: PAL.navy.lit }), W.label({ word: ENDING.loud.word }, T.sides + 4 * F, 99, [0.56, 0.68, 0], null, { height: 0.8, look: T.play - 0.2 })];
      W.label({ note: ENDING.soft.note }, T.sides + 3 * F, 99, null, [-0.4, -0.74, -1.2], { tilt: 0.02, cap: 0.62, look: T.play - 0.2 });
      W.label({ note: ENDING.loud.note }, T.sides + 7 * F, 99, null, [0.56, -0.74, -1.2], { tilt: -0.02, cap: 0.62, look: T.play - 0.2 });

      return {
        targets: { harp: st[0], vielle: st[1], hurdy: st[2], shawm: shawmG, nakers: nakG },
        update(t) {
          const [q, n] = W.onTwos(t), quiz = t >= T.play + 0.01, all = q >= T.wide - 1e-3 && !quiz;
          W.shoot(t);
          const lu = quiz ? 1 : K.seg(q, T.wide - 3 * F, T.wide + 3 * F), XS = X.map((x, i) => K.lerp(x, XL[i], lu)); st.forEach((g, i) => g.position.set(XS[i], 0.8 * Math.sin(Math.PI * lu), 0));
          const act = (i) => (q >= T.at[i] + 5 * F && (all || q < (i < 3 ? T.at[i + 1] + 4 * F : 99))) && !quiz;

          // plucked
          const a0 = act(0) || (q < T.at[1] && q >= 0.2 && !quiz), si = Math.floor(n / 3) % 9, s0 = harp.userData.strings;
          const lx = (-0.46 + si / 8 * 0.98) * 1.15, px = lx * Math.cos(0.35), pz = -lx * Math.sin(0.35);
          plec.visible = !quiz; plec.rotation.set(0, 0.35, -1.9); plec.position.set(px + 0.02 + (a0 && n % 3 === 0 ? -0.05 : 0.04), 1.3, pz + 0.1);
          pluck.forEach((m, k) => { m.visible = a0 && n % 3 === k && lu < 0.5; m.position.set(XS[0] + px, 1.3, pz + 0.2); });
          hnotes.forEach((m, i) => { const per = 18 * F, x = (((q - 0.4 - i * 6 * F) % per) + per) % per, live = a0 && q > 0.4 + i * 6 * F && x < 12 * F; m.visible = live; if (!live) return; const k = x / (12 * F); m.position.set(XS[0] + 1.0 + k * 0.6, 1.6 + k * 1.0 + i * 0.12, 0.4); m.scale.setScalar(pop(x, 0.2) * (1 - K.seg(k, 0.8, 1))); });
          // bowed
          const a1 = act(1), bx = a1 ? [-0.5, -0.25, 0.1, 0.4, 0.5, 0.25, -0.1, -0.4][Math.floor(n / 2) % 8] : -0.5;
          bow.visible = !quiz || true; bow.rotation.set(0, 0.15, 0.12); bow.position.set(bx * 1.1, quiz ? 0.1 : 0.72, quiz ? 0.9 : 0.34); if (quiz) bow.rotation.set(-Math.PI / 2, 0, 0.3);
          const vw = Math.floor(n / 3) % 3; vwave.forEach((m, k) => { m.visible = a1 && k === vw; m.position.set(XS[1] + 0.75, 1.75 + (lu > 0.5 ? 0.6 : 0), 0.4); if (lu > 0.5) m.scale.setScalar(0.6); else m.scale.setScalar(1); });
          vielle.rotation.z = a1 ? 0.03 * (Math.floor(n / 2) % 2 ? 1 : -1) : 0;
          // cranked
          const a2 = act(2); hurdy.userData.crank.rotation.x = a2 ? -n * 0.7 : 0.6; hurdy.userData.spin.rotation.x = a2 ? -n * 0.7 : 0;
          const dw = Math.floor(n / 3) % 3; drone.forEach((m, k) => { m.visible = a2 && k === dw; m.position.set(XS[2] - 0.4, 1.35, 0.4); m.scale.setScalar(lu > 0.5 ? 0.6 : 1); });
          turn.forEach((m, k) => { m.visible = a2 && lu < 0.5 && Math.floor(n / 2) % 2 === k; m.position.set(XS[2] + 1.55, 0.95, 0.75); });
          // loud
          const a3 = act(3), hit = Math.floor(n / 3), hx = n % 3;
          nak.userData.sticks.forEach((s, k) => { s.position.y = 0.72 + (a3 && hit % 2 === k && hx === 0 ? -0.06 : a3 ? 0.3 : 0.12); s.rotation.x = a3 && hit % 2 === k && hx === 0 ? 0.25 : 0; });
          nakG.position.y = a3 && hx === 0 ? 0.08 : 0; shawmG.position.y = a3 && hit % 2 === 0 && hx < 2 ? 0.14 : 0; shawm.rotation.z = a3 ? 0.06 * (hit % 2 ? 1 : -1) : 0;
          blast.forEach((set, k) => set.forEach((m, i) => { const on = a3 && hit % 2 === k && hx < 2; m.visible = on; if (!on) return; const a = [1.1, 2.3, 0.3][i] + k * 0.3, r = 1.0 + hx * 0.25; m.position.set(XS[3] - 1.0 + Math.cos(a) * r * (i ? 1 : 0.2) + (i ? 0 : 0.2), 2.25 + Math.sin(a) * r * 0.5, 0.4); m.scale.setScalar(lu > 0.5 ? 0.7 : 1); }));
          bang.forEach((m, k) => { m.visible = a3 && hit % 2 === k && hx === 0; m.position.set(XS[3] + 0.9 + (k ? 0.5 : -0.5), 0.85, 0.8); });

          W.finish(quiz ? 200 : q);
        },
      };
    },

    sound(k) {
      const SCALE = ['D4', 'E4', 'F4', 'G4', 'A4', 'B4', 'C5', 'D5', 'E5'], BOW = ['A3', 'D4', 'F4', 'E4', 'D4', 'C4', 'D4', 'A3'], TUNE = ['D5', 'F5', 'E5', 'D5', 'A4', 'C5', 'D5', 'D5'];
      k.bed('room', 0, T.play, { gain: 0.7 });
      WAYS.forEach((w, i) => { k.play('stamp', i ? T.at[i] + 6 * F : 0, { gain: i ? 0.85 : 0.5, pan: -0.3 }); k.play('slap', i ? T.at[i] + 9 * F : 0.1, { gain: 0.25 }); if (i) k.play('whoosh', T.at[i] - 4 * F, { gain: 0.75, dur: 0.38 }); });
      const harp = (t0, t1, g, pan) => { for (let t = Math.ceil(t0 / (3 * F) - 1e-6) * 3 * F; t < t1; t += 3 * F) snd.pluck(k, t, SCALE[Math.round(t / (3 * F)) % 9], { gain: 0.15 * g, pan }); };
      const bow = (t0, t1, g, pan) => { for (let t = t0, i = 0; t < t1; t += 8 * F, i++) snd.bowed(k, t, BOW[i % 8], 0.6, { gain: 0.075 * g, pan }); };
      const hurdy = (t0, t1, g, pan) => { snd.drone(k, t0, t1 - t0, { gain: 0.05 * g, pan }); for (let t = t0; t < t1; t += 9 * F) k.play('click', t, { gain: 0.5 * g, pan, minor: true }); };
      const loud = (t0, t1, g, pan) => { for (let t = Math.ceil(t0 / (3 * F) - 1e-6) * 3 * F, i = 0; t < t1; t += 3 * F, i++) { snd.naker(k, t, i % 2 === 1, { gain: 1.0 * g, pan: pan + 0.1 }); if (i % 2 === 0) snd.shawm(k, t, TUNE[(i / 2) % 8], 0.36, { gain: 0.11 * g, pan: pan - 0.1 }); } };
      harp(0.2, T.at[1] - 4 * F, 1, 0); bow(T.at[1] + 5 * F, T.at[2] - 5 * F, 1, 0); hurdy(T.at[2] + 5 * F, T.at[3] - 4 * F, 1, 0);
      k.play('riser', T.at[3] + 1 * F, { gain: 0.4, dur: 0.26 }); loud(T.at[3] + 5 * F, T.wide - 4 * F, 1, 0.1);
      // the row: soft strings on the left, the loud pair on the right
      k.play('whoosh', T.wide - 3 * F, { gain: 0.9, dur: 0.5 }); k.play('thud', T.wide + 3 * F, { gain: 0.7, f: 90 });
      const e0 = T.wide + 5 * F, e1 = T.play - 0.45; harp(e0, e1, 0.6, -0.6); bow(e0, e1, 0.6, -0.4); hurdy(e0, e1, 0.6, -0.15); loud(e0, e1, 0.8, 0.55);
      k.play('stamp', T.sides, { gain: 0.7, pan: -0.4 }); k.play('stamp', T.sides + 4 * F, { gain: 0.8, pan: 0.5 }); k.play('slap', T.sides + 3 * F, { gain: 0.3, pan: -0.4 }); k.play('slap', T.sides + 7 * F, { gain: 0.3, pan: 0.5 });
      snd.naker(k, e1, false, { gain: 1.2, pan: 0.5 }); snd.shawm(k, e1, 'D5', 0.4, { gain: 0.1, pan: 0.45 }); snd.pluck(k, e1, 'D4', { gain: 0.14, pan: -0.5, dur: 0.8 });
    },
  });
}
