// EXPERIENCE 2: "Two worlds: church and court" (deck slide 3). Sacred music was written down; secular music was passed on by ear.
{
  const { PAL, INK, PAPER, F, at, inkWorld, props, medieval, snd } = INKTOON;
  // ---------------------------------------------------------------- content (from the slide)
  const TEXT = {
    sacred: { word: 'SACRED', note: 'music for worship: prayer and church services' },
    sacred2: { note: 'sung in Latin by monks, nuns, and choirs' },
    secular: { word: 'SECULAR', note: 'music for everyday life: entertainment and dancing' },
    left: { word: 'SACRED', note: 'carefully written down' },
    right: { word: 'SECULAR', note: 'mostly passed on by ear' },
  };
  const T = { cut2: at(39), write: at(46), cut3: at(78), lute: at(76), luteLand: at(80), strum: at(86), cut4: at(123), sides: at(130), play: at(176) }; T.quiz = T.play + 0.4;
  const X = { book: -2.7, candle: -4.4, lute: 2.5, balls: 4.1 };

  registerStyle({
    id: 'm2', name: 'Ink and Toon', title: 'Two worlds: church and court', slides: 'Slide 3', question: 'What is the difference between sacred and secular music?',
    duration: T.play + 0.6, play: T.play, quizAt: T.quiz,
    fonts: ['260px "Anton"', '700 150px "Caveat"'],
    render: { samples: 16, preview: 2, shutter: 0, tone: 'linear', exposure: 1, bloom: 0, vignette: 0, grain: 0, fov: 26, background: PAL.teal.lit },
    beats: [
      { t0: 0, t1: T.cut2, key: 1.6, text: [TEXT.sacred.word, TEXT.sacred.note], moves: 'Opens on a chant book lying open on a lectern, a candle beside it. The flame flickers on threes.', camera: 'Long lens, level with the book, drifting.', sound: 'Room tone, one low held sung tone, a candle flutter.' },
      { t0: T.cut2, t1: T.cut3, key: T.write + 22 * F, text: [TEXT.sacred.word, TEXT.sacred2.note], moves: 'A quill moves across the page and sets down square notes one by one. Every note stays where it is written.', camera: 'Whips a little higher and closer to look down on the page.', sound: 'Pen strokes on parchment, a sung tone for each note, all in step.' },
      { t0: T.cut3, t1: T.cut4, key: T.strum + 20 * F, text: [TEXT.secular.word, TEXT.secular.note], moves: 'The other end of the table: a lute hops in and strums. Notes fly up out of it and vanish in the air, one after another.', camera: 'Fast whip right across the table.', sound: 'Whoosh, a wooden tock, plucked lute notes in a dance rhythm, a small pop as each note vanishes.' },
      { t0: T.cut4, t1: T.play, key: T.play - 0.3, text: [TEXT.left.word, TEXT.left.note, TEXT.right.word, TEXT.right.note], moves: 'Both at once: on the left the notes sit safe in the book; on the right three juggling balls go round and the lute’s notes keep flying off and disappearing.', camera: 'Pulls back to a wide two-shot and holds.', sound: 'Held chant on the left, lute dance on the right, two paper slaps for the captions.' },
    ],
    quiz: { key: T.quiz, prompt: 'Sacred or secular? Tap the book or the lute for each clue.', how: 'Six clues from the slide, one at a time in shuffled order ("Latin", "entertainment and dancing", "monks, nuns, and choirs", "troubadours and minstrels", "prayer and church services", "local, everyday languages"). Tap the chant book for sacred or the lute for secular.', points: 6 },
    check: [
      { type: 'match', prompt: 'Sacred or secular? Tap the book or the lute.', names: { sacred: 'chant book: sacred', secular: 'lute: secular' },
        clues: [['prayer and church services', 'sacred'], ['entertainment and dancing', 'secular'], ['Latin', 'sacred'], ['local, everyday languages', 'secular'], ['monks, nuns, and choirs', 'sacred'], ['troubadours and minstrels', 'secular']] },
    ],

    build(S) {
      const { THREE, K, scene } = S, W = inkWorld(S, { wide: 3.5, centre: [0, -0.3] }), P = props(W), Md = medieval(W, P), { M, ink, group, pop, wobble, rig } = W, { mark, burst } = ink;

      // ---- the church: a chant book on a lectern, a candle, a quill
      const lec = Md.lectern(); lec.position.set(X.book, 0, 0); lec.rotation.y = 0.2; scene.add(lec);
      const book = Md.openBook(); book.position.y = 0.07; lec.userData.desk.add(book);
      const written = []; for (let r = 0; r < 2; r++) for (const s of [-1, 1]) for (let i = 0; i < 4; i++) { const n = Md.sq(INK, 0.75); n.position.set(s * 0.5 - 0.27 + i * 0.18, 0.34 - r * 0.38 + [0.02, 0.065, 0.02, -0.025][(i + r) % 4], 0.004); book.userData.top.add(n); written.push(n); }
      written.sort((a, b) => (b.position.y > a.position.y + 0.2 ? 1 : a.position.y > b.position.y + 0.2 ? -1 : a.position.x - b.position.x));
      const quill = Md.quill(); quill.scale.setScalar(0.62); book.userData.top.add(quill);
      const candle = Md.candle(); candle.position.set(X.candle, 0, 0.7); candle.scale.setScalar(1.25); scene.add(candle);
      const hush = [0, 1, 2].map((k) => W.sprite(P.wave(1.2, 0.1, k * 2.1, 0.05)));

      // ---- the court: a lute, notes that fly away, juggling balls
      const lute = Md.lute(), luteRig = rig(lute); lute.scale.setScalar(1.15); lute.rotation.set(-0.08, -0.25, 0);
      const fly = [0, 1, 2, 3].map((i) => W.sprite(P.note([PAL.mustard.lit, PAPER, PAL.persimmon.lit, PAPER][i], 0.85, i % 2 === 1)));
      const gone = [0, 1].map((k) => W.sprite(mark(burst(7, 0.16, 0.16, 0.2, 0.045, 30 + k))));
      const balls = [M.red, M.mustard, M.paper].map((m) => { const b = Md.jugglingBall(m); scene.add(b); return b; });

      W.setCamera([[0, [X.book - 0.5, 1.5, 0.3, 21, -6, 8.2]], [T.cut2 - 5 * F, [X.book - 0.45, 1.5, 0.3, 22, -2, 8.0], 'linear'], [T.cut2, [X.book + 0.1, 1.55, 0.4, 37, 4, 6.4], 'inOutQuint'], [T.cut3 - 5 * F, [X.book + 0.15, 1.55, 0.4, 38, 7, 6.2], 'linear'],
        [T.cut3, [X.lute - 0.5, 1.3, 0.2, 23, -5, 8.2], 'inOutQuint'], [T.cut4 - 6 * F, [X.lute - 0.45, 1.3, 0.2, 24, -1, 8.0], 'linear'], [T.cut4, [0.0, 1.25, 0.2, 27, 0, 13.2], 'inOutQuint'], [T.play, [0.0, 1.25, 0.2, 28, 2, 12.9], 'linear'], [T.quiz + 1, [0.0, 1.25, 0.2, 28, 2, 12.9]]]);

      W.label({ word: TEXT.sacred.word }, -1, T.cut2 - 6 * F, [-0.5, 0.66, 0.4], null, { look: 0.5, block: PAL.navy.lit });
      W.label({ note: TEXT.sacred.note }, -1, T.cut2 - 6 * F, null, [0.2, -0.74, -0.4], { tilt: 0.03, look: 0.5 });
      W.label({ word: TEXT.sacred.word }, T.cut2 + F, T.cut3 - 6 * F, [-0.56, 0.66, 0.4], null, { height: 0.46, block: PAL.navy.lit });
      W.label(TEXT.sacred2, T.write + 4 * F, T.cut3 - 6 * F, null, [0.2, -0.76, -0.4], { tilt: -0.03, cap: 0.3 });
      W.label(TEXT.secular, T.luteLand + F, T.cut4 - 7 * F, [-0.5, 0.66, 0.4], [0.1, -0.74, -0.5], { tilt: 0.03 });
      const sideWords = [W.label({ word: TEXT.left.word }, T.sides, 99, [-0.56, 0.68, 0], null, { height: 0.62, look: T.play - 0.2, block: PAL.navy.lit }), W.label({ word: TEXT.right.word }, T.sides + 4 * F, 99, [0.5, 0.68, 0], null, { height: 0.62, look: T.play - 0.2 })];
      W.label({ note: TEXT.left.note }, T.sides + 3 * F, 99, null, [-0.5, -0.72, -1.2], { tilt: 0.03, cap: 0.54, look: T.play - 0.2 });
      W.label({ note: TEXT.right.note }, T.sides + 7 * F, 99, null, [0.48, -0.72, -1.2], { tilt: -0.03, cap: 0.54, look: T.play - 0.2 });

      const lutePos = (q) => { const u = K.seg(q, T.lute, T.luteLand); return [X.lute + 4.5 * (1 - u), 2.4 * Math.sin(Math.PI * u) * (1 - u * 0.6), 0]; };

      return {
        targets: { sacred: [lec, candle], secular: [luteRig.outer, ...balls] },
        update(t) {
          const [q, n] = W.onTwos(t), quiz = t >= T.play + 0.01;
          W.shoot(t);

          // the candle, the held tone, and the quill writing the chant down
          candle.userData.flames.forEach((f, k) => { f.visible = Math.floor(n / 3) % 2 === k; });
          const hw = Math.floor(n / 3) % 3; hush.forEach((m, k) => { m.visible = !quiz && q < T.cut2 - 6 * F && k === hw; m.position.set(X.book + 1.3, 2.3, 0.4); });
          const wi = Math.floor((q - T.write) / (2 * F) + 1e-3), writing = wi >= 0 && wi < written.length && !quiz;
          written.forEach((m, i) => { const x = q - (T.write + i * 2 * F); m.visible = x >= 0 || quiz; m.scale.setScalar(quiz ? 1 : Math.max(pop(x, 0.18), 1e-3)); });
          const cur = written[Math.max(0, Math.min(written.length - 1, wi))]; quill.visible = q >= T.cut2 - 2 * F && !quiz; quill.rotation.set(0.9, 0, -0.5); quill.position.set(cur.position.x + 0.03, cur.position.y + (writing && n % 2 ? 0.03 : 0), 0.02 + (writing ? 0 : 0.12));

          // the lute arrives and plays; its notes fly off and vanish
          const ll = q - T.luteLand; luteRig.set(lutePos(q), lutePos(q - F)); luteRig.outer.visible = q >= T.lute || quiz;
          const playing = q >= T.strum && !quiz, beat = Math.floor((q - T.strum) / (4 * F) + 1e-3);
          W.squash(lute, 1 - 0.16 * wobble(ll + F * 0.5, 3.2, 8)); lute.scale.multiplyScalar(1.15); lute.rotation.z = playing ? 0.05 * (beat % 2 ? 1 : -1) : 0; luteRig.outer.position.y += playing && n % 4 < 2 ? 0.07 : 0;
          fly.forEach((m, i) => { const per = 16 * F, st = T.strum + i * 4 * F, x = (((q - st) % per) + per) % per, live = playing && q >= st && x < 9 * F; m.visible = live; if (!live) return; const k = x / (9 * F); m.position.set(X.lute + 0.5 + k * (0.7 + i * 0.25), 1.6 + k * 1.3, 0.5); m.scale.setScalar(pop(x, 0.2)); });
          gone.forEach((m, k) => { let on = false; for (let i = 0; i < 4 && !on; i++) { const per = 16 * F, st = T.strum + i * 4 * F, x = (((q - st) % per) + per) % per; if (playing && q >= st + 9 * F && x >= 9 * F && x < 11 * F - 1e-3 && (x < 10 * F - 1e-3 ? 0 : 1) === k) { on = true; m.position.set(X.lute + 0.5 + 0.7 + i * 0.25 + 0.1, 3.0, 0.5); } } m.visible = on; m.scale.setScalar(k ? 1.5 : 1); });
          balls.forEach((b, i) => { const on = q >= T.sides + 6 * F || quiz, a = (n / 2 + i * 4) % 12 / 12; b.visible = on; b.position.set(X.balls + (quiz ? (i - 1) * 0.35 : Math.cos(a * Math.PI * 2) * 0.5), quiz ? 0 : 1.2 + Math.sin(a * Math.PI * 2) * 0.75, 0.6); b.scale.setScalar(on ? Math.max(pop(q - T.sides - 6 * F, 0.2), quiz ? 1 : 1e-3) : 1e-3); });

          W.finish(quiz ? 200 : q);
        },
      };
    },

    sound(k) {
      const CH = ['D4', 'E4', 'F4', 'E4', 'D4', 'F4', 'G4', 'F4', 'E4', 'D4', 'C4', 'D4', 'F4', 'E4', 'D4', 'D4'], DANCE = ['D4', 'A4', 'D5', 'A4', 'F4', 'A4', 'C5', 'A4', 'G4', 'B4', 'D5', 'B4', 'A4', 'C5', 'E5', 'A4'];
      const held = (t0, t1, g, pan) => { for (const n of ['D3', 'A3']) for (const d of [-5, 5]) k.tone(t0, { f: n, detune: d, dur: t1 - t0, gain: 0.045 * g, a: 0.6, hold: t1 - t0 - 1.2, pan, verb: 0.45 }); };
      k.bed('room', 0, T.play, { gain: 0.7 });
      k.play('stamp', 0, { gain: 0.45 }); held(0.15, T.cut3 - 0.5, 1, -0.1);
      k.withMinor(() => { for (let n = 4; n < 36; n += 9) k.noise(at(n), { dur: 0.08, filter: 'highpass', f: 5000, gain: 0.03, a: 0.03, pan: -0.5 }); });
      k.play('whoosh', T.cut2 - 5 * F, { gain: 0.45, dur: 0.4 }); k.play('stamp', T.cut2 + F, { gain: 0.5, pan: -0.3 }); k.play('slap', T.write + 4 * F, { gain: 0.3 });
      CH.forEach((n, i) => { const t = T.write + i * 2 * F; k.play('stroke', t, { material: 'pen', dur: 0.09, gain: 1.3, minor: true }); snd.voice(k, t, n, 0.3, { gain: 0.06, minor: true }); });
      k.play('whoosh', T.cut3 - 5 * F, { gain: 1, dur: 0.45, pan: 0.3 }); k.play('swish', T.lute, { gain: 0.7, dur: 0.22, pan: 0.5 }); k.play('tock', T.luteLand, { gain: 0.9, f: 380, pan: 0.1 }); k.play('thud', T.luteLand, { gain: 0.4 }); k.play('stamp', T.luteLand + F, { gain: 0.9, pan: -0.3 }); k.play('slap', T.luteLand + 4 * F, { gain: 0.3 });
      for (let t = T.strum, i = 0; t < T.play - 0.35; t += 2 * F, i++) { const wide = t >= T.cut4; snd.pluck(k, t, DANCE[i % 16], { gain: wide ? 0.12 : 0.16, pan: wide ? 0.5 : 0.1 }); if (i % 4 === 0) snd.pluck(k, t, 'D3', { gain: 0.1, pan: wide ? 0.5 : 0.1, dur: 0.3 }); }
      for (let i = 0; i < 4; i++) for (let t = T.strum + i * 4 * F + 9 * F; t < T.play - 0.3; t += 16 * F) k.play('pop', t, { gain: 0.3, f: 1100 + i * 120, pan: 0.4, minor: true });
      k.play('whoosh', T.cut4 - 6 * F, { gain: 0.7, dur: 0.45 }); held(T.cut4, T.play, 0.9, -0.55);
      k.play('stamp', T.sides, { gain: 0.7, pan: -0.45 }); k.play('stamp', T.sides + 4 * F, { gain: 0.7, pan: 0.45 }); k.play('slap', T.sides + 3 * F, { gain: 0.3, pan: -0.45 }); k.play('slap', T.sides + 7 * F, { gain: 0.3, pan: 0.45 });
      k.withMinor(() => { for (let t = T.sides + 6 * F; t < T.play - 0.3; t += 4 * F) k.play('tock', t, { gain: 0.18, f: 520, pan: 0.7 }); });
      snd.pluck(k, T.play - 0.33, 'D4', { gain: 0.16, pan: 0.4, dur: 0.8 }); snd.pluck(k, T.play - 0.33, 'A4', { gain: 0.12, pan: 0.4, dur: 0.8 });
    },
  });
}
