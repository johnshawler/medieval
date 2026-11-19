// TUNES: the little bits of music the scores share. Everything sits on the drawing grid: an eighth note is three
// drawings (0.2 s), a beat is six (0.4 s, 150 beats a minute), so sound and picture land on the same frames.
(function (root) {
  const E8 = 0.2, BEAT = 0.4, tr = (hz, semis) => hz * Math.pow(2, semis / 12);
  const RIFF = ['C4', 'E4', 'G4', 'A4', 'Bb4', 'A4', 'G4', 'E4'], ROOTS = [0, 0, 5, 0, 7, 5, 0, 7];   // one boogie bar per chord
  const VOICE = {                                                       // the same record through different machines
    radio: { type: 'square', filter: 'bandpass', f2: 2300, q: 2.2, gain: 0.07 },
    player: { type: 'square', filter: 'lowpass', f2: 1700, q: 0.8, gain: 0.055 },
    juke: { type: 'sawtooth', filter: 'lowpass', f2: 2400, q: 1, gain: 0.075 },
    tv: { type: 'square', filter: 'bandpass', f2: 1500, q: 1.2, gain: 0.06 },
    full: { type: 'sawtooth', filter: 'lowpass', f2: 3200, q: 0.9, gain: 0.08 },
  };
  const grid = (t, step) => Math.ceil(t / step - 1e-6) * step;
  const snd = {
    E8, BEAT,
    // the hit record, always in step with the clock so it carries on from one machine to the next
    riff(k, t0, t1, voice = 'full', o = {}) { const v = Object.assign({}, VOICE[voice], o);
      for (let t = grid(t0, E8); t < t1 - 0.05; t += E8) { const i = Math.round(t / E8), f = tr(k.hz(RIFF[i % 8]), ROOTS[Math.floor(i / 8) % 8]);
        k.tone(t, { f, type: v.type, dur: 0.18, gain: v.gain, a: 0.004, hold: 0.08, filter: v.filter, f2: v.f2, q: v.q, pan: v.pan || 0, minor: true }); } },
    bass(k, t0, t1, o = {}) { for (let t = grid(t0, BEAT); t < t1 - 0.05; t += BEAT) { const i = Math.round(t / BEAT), f = tr(k.hz(['C2', 'E2', 'G2', 'A2'][i % 4]), ROOTS[Math.floor(i / 4) % 8]);
      k.tone(t, { f, type: 'triangle', dur: 0.34, gain: (o.gain || 0.2), a: 0.006, hold: 0.12, pan: o.pan || 0 }); } },
    clap(k, t, o = {}) { const g = o.gain == null ? 1 : o.gain; k.noise(t, { dur: 0.11, filter: 'bandpass', f: 1500, q: 0.9, gain: 0.5 * g, a: 0.001, pan: o.pan || 0, verb: o.verb == null ? 0.2 : o.verb }); k.noise(t + 0.012, { dur: 0.05, filter: 'highpass', f: 2600, gain: 0.25 * g, pan: o.pan || 0 }); k.tone(t, { f: [[0, 210], [0.07, 150]], dur: 0.09, gain: 0.2 * g, pan: o.pan || 0 }); },
    // kick on 1 and 3, loud clap on 2 and 4, counted from t0
    backbeat(k, t0, t1, o = {}) { let i = 0; for (let t = t0; t < t1 - 0.05; t += BEAT, i++) { if (i % 2) snd.clap(k, t, o); else k.play('thud', t, { gain: 0.55 * (o.gain == null ? 1 : o.gain), f: 95, pan: o.pan || 0 }); } },
    // an overdriven electric guitar note or chord
    guitar(k, t, notes, o = {}) { (Array.isArray(notes) ? notes : [notes]).forEach((n, j) => { const f = k.hz(n); for (const d of [-7, 7]) k.tone(t + j * (o.strum || 0), { f: o.bend ? [[0, f * 0.944], [o.bend, f]] : f, type: 'sawtooth', detune: d, dur: o.dur || 0.22, gain: (o.gain || 0.07), a: 0.003, hold: (o.dur || 0.22) * 0.4, filter: 'bandpass', f2: o.f2 || 1500, q: o.q || 1.6, pan: o.pan || 0, verb: o.verb || 0.12 }); }); },
    // a struck piano cluster
    piano(k, t, notes, o = {}) { notes.forEach((n) => { const f = k.hz(n); k.tone(t, { f, type: 'triangle', dur: o.dur || 0.2, gain: (o.gain || 0.09), a: 0.002, pan: o.pan || 0, verb: 0.1 }); k.tone(t, { f: f * 2.01, dur: (o.dur || 0.2) * 0.6, gain: (o.gain || 0.09) * 0.35, a: 0.002, pan: o.pan || 0 }); }); k.noise(t, { dur: 0.02, filter: 'bandpass', f: 2200, q: 1.5, gain: 0.12, pan: o.pan || 0 }); },
  };
  root.INKTOON.snd = snd;
})(window);
