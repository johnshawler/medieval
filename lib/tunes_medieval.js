// MEDIEVAL TUNES: sung voices, plucked and bowed strings, a drone, a shawm and nakers, all on the drawing grid.
(function (root) {
  const snd = root.INKTOON.snd;
  Object.assign(snd, {
    // one sung note: a soft sine voice with a little chorus, in a stone room
    voice(k, t, note, dur = 0.4, o = {}) { const f = k.hz(note), g = o.gain == null ? 0.09 : o.gain;
      for (const d of [-6, 6]) k.tone(t, { f, detune: d, dur, gain: g, a: Math.min(0.07, dur * 0.3), hold: dur * 0.5, pan: o.pan || 0, verb: o.verb == null ? 0.45 : o.verb, minor: o.minor });
      k.tone(t, { f: f * 2, dur: dur * 0.8, gain: g * 0.18, a: 0.06, hold: dur * 0.3, pan: o.pan || 0, verb: 0.4 }); k.tone(t, { f: f * 3, dur: dur * 0.6, gain: g * 0.06, a: 0.06, pan: o.pan || 0 }); },
    // a plucked string (harp, lute)
    pluck(k, t, note, o = {}) { const f = k.hz(note), g = o.gain == null ? 0.16 : o.gain; k.tone(t, { f, type: 'triangle', dur: o.dur || 0.45, gain: g, a: 0.002, pan: o.pan || 0, verb: 0.2, minor: o.minor }); k.tone(t, { f: f * 2, type: 'sawtooth', dur: 0.12, gain: g * 0.3, a: 0.001, filter: 'bandpass', f2: o.bright || 2400, q: 2, pan: o.pan || 0 }); k.noise(t, { dur: 0.012, filter: 'highpass', f: 3500, gain: g * 0.4, pan: o.pan || 0 }); },
    // a bowed string (vielle)
    bowed(k, t, note, dur = 0.5, o = {}) { const f = k.hz(note), g = o.gain == null ? 0.07 : o.gain; for (const d of [-5, 5]) k.tone(t, { f, type: 'sawtooth', detune: d, dur, gain: g, a: 0.09, hold: dur * 0.55, filter: 'bandpass', f2: 1300, q: 1.2, pan: o.pan || 0, verb: 0.2 }); k.noise(t, { dur: dur * 0.9, filter: 'bandpass', f: 3200, q: 1.5, gain: g * 0.12, a: 0.06, hold: dur * 0.5, pan: o.pan || 0 }); },
    // the hurdy-gurdy's drone: a root and a fifth that never stop, with a buzz
    drone(k, t, dur, o = {}) { const g = o.gain == null ? 0.05 : o.gain; for (const [n, d] of [['D3', 0], ['D3', 8], ['A3', -4]]) k.tone(t, { f: n, type: 'sawtooth', detune: d, dur, gain: g, a: 0.25, hold: dur - 0.5, filter: 'lowpass', f2: 1100, q: 1.5, pan: o.pan || 0 }); k.tone(t, { f: 'D4', type: 'square', dur, gain: g * 0.3, a: 0.3, hold: dur - 0.5, filter: 'bandpass', f2: 2200, q: 5, pan: o.pan || 0 }); },
    // a shawm: nasal, piercing, loud
    shawm(k, t, note, dur = 0.35, o = {}) { const f = k.hz(note), g = o.gain == null ? 0.1 : o.gain; k.tone(t, { f, type: 'square', dur, gain: g, a: 0.01, hold: dur * 0.7, filter: 'bandpass', f2: 1500, q: 4, pan: o.pan || 0, verb: 0.15 }); k.tone(t, { f, type: 'sawtooth', dur, gain: g * 0.7, a: 0.01, hold: dur * 0.7, filter: 'bandpass', f2: 2600, q: 3, pan: o.pan || 0 }); },
    // one stroke on a naker (hi or lo)
    naker(k, t, hi, o = {}) { const g = o.gain == null ? 1 : o.gain; k.tone(t, { f: [[0, hi ? 210 : 150], [0.12, hi ? 150 : 105]], dur: 0.2, gain: 0.4 * g, pan: o.pan || 0 }); k.noise(t, { dur: 0.045, filter: 'bandpass', f: hi ? 900 : 650, q: 1.5, gain: 0.35 * g, a: 0.001, pan: o.pan || 0 }); },
    bell(k, t, note = 'D6', o = {}) { k.play('ding', t, { f: note, gain: o.gain == null ? 0.6 : o.gain, pan: o.pan || 0 }); },
    chord(k, t, notes, dur = 1.4, o = {}) { notes.forEach((n, i) => snd.voice(k, t, n, dur, { gain: (o.gain || 0.07), pan: (i - (notes.length - 1) / 2) * 0.25, verb: 0.5 })); },
  });
})(window);
