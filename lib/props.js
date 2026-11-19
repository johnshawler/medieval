// PROPS: the objects of 1950s pop, built from the Ink and Toon kit's turned shapes, rounded boxes, tubes and marks.
// Every prop is a Group standing on the table (y = 0 at its foot) and facing +z (the camera).
(function (root) {
  const { PAL, INK, PAPER } = root.INKTOON;
  root.INKTOON.props = function (W) {
    const { THREE, K, ink, M, group } = W, { solid, turned, crease, line3, mark, arc, fill, flat } = ink;
    const G = () => new THREE.Group();
    const box = (w, h, d, r, mat, x, y, z, parent, f) => { const m = solid(K.roundedBox(w, h, d, r, 4), mat, parent, f); m.position.set(x, y, z); return m; };
    const ball = (r, mat, x, y, z, parent, f) => { const m = solid(new THREE.SphereGeometry(r, 20, 14), mat, parent, f); m.position.set(x, y, z); return m; };
    const rod = (r, len, mat, parent, f) => solid(new THREE.CapsuleGeometry(r, len, 6, 12), mat, parent, f);       // along y, centred
    const lay = (m) => { m.rotation.x = -Math.PI / 2; return m; };                                               // XY marks -> flat on the table
    const closedShape = (pts, n = 90) => new THREE.Shape(new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, 'centripetal').getPoints(n).map((p) => new THREE.Vector2(p.x, p.y)));
    const slab = (shape, depth, bevel = 0.02) => { const g = new THREE.ExtrudeGeometry(shape, { depth: depth - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 20 }); g.translate(0, 0, -(depth - 2 * bevel) / 2); return g; };

    // ---- records. A 45: seven inches, big 1.5-inch hole. A 78: ten inches, small hole, brittle shellac.
    function record45(labelMat = M.red) {
      const g = G(), R = 0.6, rh = 0.13, t = 0.036;
      solid(turned([[rh, 0], [R - 0.012, 0], [R, t / 2], [R - 0.012, t], [rh, t], [rh, 0]], 56, 1), M.vinyl, g, { line: 3.6 });
      solid(turned([[rh + 0.004, t], [0.3, t], [0.3, t + 0.007], [rh + 0.004, t + 0.007]], 48, 0), labelMat, g, { line: 0, cast: false });
      crease(g, 0.305, t + 0.008, 0, 360, 0.006); crease(g, 0.4, t + 0.002, 200, 330, 0.005); crease(g, 0.5, t + 0.002, 20, 150, 0.005); crease(g, 0.45, t + 0.002, 60, 120, 0.004);
      const glint = lay(mark([[arc(0.45, 2.05, 2.45, 8), 0.11, 'both'], [arc(0.45, 5.2, 5.55, 8), 0.1, 'both']], PAL.vinyl.gloss, 0)); glint.position.y = t + 0.003; g.add(glint);
      g.userData.t = t; return g;
    }
    function record78() {
      const g = G(), R = 0.86, t = 0.05;
      solid(turned([[0, 0], [R - 0.014, 0], [R, t / 2], [R - 0.014, t], [0, t]], 64, 1), M.vinyl, g, { line: 4 });
      solid(turned([[0.02, t], [0.27, t], [0.27, t + 0.007], [0.02, t + 0.007]], 48, 0), M.cream, g, { line: 0, cast: false });
      crease(g, 0.275, t + 0.008, 0, 360, 0.006); crease(g, 0.02, t + 0.009, 0, 360, 0.012);
      for (const [r, a0, a1] of [[0.4, 190, 340], [0.52, 10, 160], [0.64, 200, 330], [0.76, 30, 150]]) crease(g, r, t + 0.002, a0, a1, 0.005);
      const glint = lay(mark([[arc(0.56, 2.05, 2.4, 8), 0.2, 'both'], [arc(0.56, 5.2, 5.55, 8), 0.18, 'both']], PAL.vinyl.gloss, 0)); glint.position.y = t + 0.003; g.add(glint);
      return g;
    }
    // the same 78 as broken pieces: wedges with jagged edges, each its own little group lying flat
    function shards78(n = 7, seed = 5) {
      const r = K.rng(seed), R = 0.86, cuts = Array.from({ length: n }, (_, i) => (i + r.range(-0.28, 0.28)) / n * Math.PI * 2), c0 = [r.range(-0.08, 0.08), r.range(-0.08, 0.08)];
      const vinyl = fill(PAL.vinyl, { side: THREE.DoubleSide, band: 0.05 }), lab = fill(PAL.cream, { side: THREE.DoubleSide });
      return cuts.map((a0, i) => {
        const a1 = i === n - 1 ? cuts[0] + Math.PI * 2 : cuts[i + 1], am = (a0 + a1) / 2, jag = (a) => { const m = 0.45 + r.range(-0.1, 0.1); return [Math.cos(a + r.range(-0.07, 0.07)) * R * m, Math.sin(a + r.range(-0.07, 0.07)) * R * m]; };
        const rim = arc(R, a0, a1, 10), out = [c0, jag(a0), ...rim, jag(a1)], cx = Math.cos(am) * R * 0.55, cy = Math.sin(am) * R * 0.55;
        const pts = out.map(([x, y]) => [x - cx, y - cy]), sh = new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)));
        const g = G(), piece = new THREE.Mesh(new THREE.ShapeGeometry(sh), vinyl); piece.receiveShadow = true; g.add(piece);
        const edge = new THREE.Mesh(ink.strokes([[[...pts, pts[0]], 0.035, 'none']]), flat(INK)); edge.position.z = 0.002; g.add(edge);
        const lp = [[c0[0] - cx, c0[1] - cy], ...arc(0.27, a0 + 0.02, a1 - 0.02, 6).map(([x, y]) => [x - cx, y - cy])], lm = new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(lp.map(([x, y]) => new THREE.Vector2(x, y)))), lab); lm.position.z = 0.003; g.add(lm);
        g.userData = { home: [cx, cy], dir: am, spin: r.range(-1, 1), far: r.range(0.75, 1.5) };
        return g;
      });
    }
    function coin() { const g = G(); solid(turned([[0, 0], [0.16, 0], [0.175, 0.022], [0.16, 0.045], [0, 0.045]], 28, 1), M.mustard, g, { line: 3 }); crease(g, 0.115, 0.047, 0, 360, 0.006); return g; }

    // ---- Regency TR-1 style pocket transistor radio (1954): no aerial, round dial, perforated grille
    function pocketRadio() {
      const g = G(); box(0.8, 1.3, 0.34, 0.08, M.red, 0, 0.65, 0, g);
      const pts = []; for (let j = 0; j < 7; j++) for (let i = 0; i < 6; i++) pts.push([(i - 2.5) * 0.105 + (j % 2 ? 0.026 : -0.026), 1.12 - j * 0.085]);
      const holes = new THREE.InstancedMesh(new THREE.CircleGeometry(0.03, 10), flat(INK), pts.length); pts.forEach(([x, y], i) => K.place(holes, i, [x, y, 0.173], null, 1)); g.add(holes);
      const dial = solid(turned([[0, 0], [0.2, 0], [0.22, 0.02], [0.2, 0.05], [0, 0.05]], 32, 1), M.mustard, g, { line: 3 }); dial.rotation.x = Math.PI / 2; dial.position.set(0.1, 0.33, 0.17);
      const tick = line3(g, [[0.1, 0.33, 0.225], [0.1, 0.5, 0.225]], 0.012); const hub = ball(0.045, M.cream, 0.1, 0.33, 0.215, g, { line: 2.4, cast: false });
      const vol = solid(turned([[0, 0], [0.07, 0], [0.075, 0.03], [0, 0.03]], 16, 1), M.navy, g, { line: 2.4 }); vol.rotation.x = Math.PI / 2; vol.position.set(-0.24, 0.3, 0.17);
      return g;
    }

    // ---- a 1950s television set: wooden cabinet on legs, bulging tube, two knobs, rabbit ears
    function tv() {
      const g = G(), cab = box(2.0, 1.5, 1.1, 0.14, M.wood, 0, 1.08, 0, g);
      for (const [x, z] of [[-0.78, 0.38], [0.78, 0.38], [-0.78, -0.38], [0.78, -0.38]]) { const leg = solid(turned([[0, 0], [0.04, 0], [0.075, 0.36], [0, 0.36]], 12, 0), M.navy, g, { line: 3 }); leg.position.set(x, 0, z); }
      box(1.34, 1.14, 0.1, 0.2, M.navyFlat, -0.2, 1.1, 0.53, g, { line: 3, cast: false });
      const screen = box(1.14, 0.94, 0.12, 0.2, M.screen, -0.2, 1.1, 0.56, g, { line: 2.6, cast: false });
      for (const y of [1.38, 1.02]) { const k = solid(turned([[0, 0], [0.1, 0], [0.11, 0.03], [0.08, 0.08], [0, 0.08]], 20, 1), M.cream, g, { line: 3 }); k.rotation.x = Math.PI / 2; k.position.set(0.73, y, 0.55); }
      for (let i = 0; i < 4; i++) line3(g, [[0.6, 0.74 - i * 0.07, 0.557], [0.86, 0.74 - i * 0.07, 0.557]], 0.011);
      const ears = G(); ears.position.set(0.1, 1.83, -0.1); g.add(ears);
      solid(turned([[0, 0], [0.16, 0], [0.17, 0.03], [0.09, 0.09], [0, 0.1]], 20, 1), M.navy, ears, { line: 3 });
      for (const s of [-1, 1]) { const e = rod(0.018, 0.95, M.steel, ears, { line: 2.6 }); e.position.set(s * 0.26, 0.5, 0); e.rotation.z = -s * 0.5; ball(0.04, M.steel, s * 0.5, 0.94, 0, ears, { line: 2.4 }); }
      g.userData = { screen, front: [-0.2, 1.1, 0.63] }; return g;
    }

    // ---- the crooner's microphone (Shure 55 style) on a desk stand
    function mic() {
      const g = G();
      solid(turned([[0, 0], [0.36, 0], [0.4, 0.035], [0.36, 0.08], [0.1, 0.11], [0.06, 0.16], [0, 0.16]], 40), M.navy, g);
      const pole = rod(0.035, 0.62, M.steel, g, { line: 3 }); pole.position.y = 0.47;
      const head = G(); head.position.y = 1.2; head.rotation.x = -0.16; g.add(head);
      box(0.56, 0.84, 0.46, 0.2, M.steel, 0, 0, 0, head);
      box(0.6, 0.1, 0.5, 0.045, M.navy, 0, 0, 0, head, { line: 2.6, cast: false });
      for (const x of [-0.16, -0.08, 0, 0.08, 0.16]) for (const s of [-1, 1]) { const zf = 0.236 - Math.abs(x) * 0.22; line3(head, [[x, s * 0.09, zf], [x, s * 0.2, zf - 0.005], [x, s * (0.33 - Math.abs(x) * 0.5), zf - 0.05]], 0.013); }
      const yoke = solid(K.tube([[-0.33, 0.02, 0], [-0.34, -0.3, 0], [-0.2, -0.52, 0], [0, -0.56, 0], [0.2, -0.52, 0], [0.34, -0.3, 0], [0.33, 0.02, 0]], 0.03, { segments: 30, radial: 8 }), M.navy, head, { line: 2.8 });
      g.userData.head = head; return g;
    }

    // ---- guitars. kind: 'tele' (1950 Fender solid-body), 'strat' (double cutaway), 'arch' (hollow archtop with
    // f-holes), 'archcut' (hollow with a cutaway). Stands upright, body down, about 2.6 tall before scaling.
    const BODY = {
      tele: [[0, -0.7], [0.28, -0.68], [0.47, -0.55], [0.54, -0.33], [0.5, -0.1], [0.42, 0.08], [0.41, 0.24], [0.46, 0.38], [0.45, 0.5], [0.36, 0.56], [0.25, 0.5], [0.17, 0.4], [0.13, 0.5], [0.12, 0.62], [-0.12, 0.62], [-0.16, 0.66], [-0.3, 0.66], [-0.42, 0.56], [-0.46, 0.4], [-0.42, 0.22], [-0.42, 0.06], [-0.5, -0.12], [-0.54, -0.33], [-0.47, -0.55], [-0.28, -0.68]],
      strat: [[0, -0.7], [0.28, -0.68], [0.47, -0.55], [0.54, -0.33], [0.49, -0.1], [0.4, 0.06], [0.38, 0.2], [0.44, 0.36], [0.46, 0.52], [0.4, 0.62], [0.31, 0.58], [0.22, 0.44], [0.14, 0.38], [0.12, 0.5], [0.12, 0.6], [-0.12, 0.6], [-0.13, 0.48], [-0.2, 0.5], [-0.3, 0.66], [-0.4, 0.8], [-0.47, 0.78], [-0.5, 0.62], [-0.47, 0.42], [-0.41, 0.24], [-0.42, 0.08], [-0.5, -0.12], [-0.55, -0.33], [-0.47, -0.55], [-0.28, -0.68]],
      arch: [[0, -0.78], [0.35, -0.74], [0.57, -0.56], [0.63, -0.3], [0.55, -0.02], [0.43, 0.2], [0.44, 0.4], [0.48, 0.56], [0.4, 0.72], [0.2, 0.79], [0, 0.8], [-0.2, 0.79], [-0.4, 0.72], [-0.48, 0.56], [-0.44, 0.4], [-0.43, 0.2], [-0.55, -0.02], [-0.63, -0.3], [-0.57, -0.56], [-0.35, -0.74]],
      archcut: [[0, -0.78], [0.35, -0.74], [0.57, -0.56], [0.63, -0.3], [0.55, -0.02], [0.43, 0.2], [0.45, 0.38], [0.47, 0.52], [0.42, 0.66], [0.33, 0.68], [0.22, 0.56], [0.14, 0.46], [0.12, 0.62], [0.12, 0.8], [0, 0.8], [-0.2, 0.79], [-0.4, 0.72], [-0.48, 0.56], [-0.44, 0.4], [-0.43, 0.2], [-0.55, -0.02], [-0.63, -0.3], [-0.57, -0.56], [-0.35, -0.74]],
    };
    function guitar(kind = 'tele', o = {}) {
      const g = G(), b = G(); g.add(b); const hollow = kind.startsWith('arch'), top = hollow ? 0.8 : kind === 'strat' ? 0.6 : 0.62, foot = hollow ? 0.78 : 0.7, th = hollow ? 0.22 : 0.13, zf = th / 2;
      b.position.y = foot;
      solid(slab(closedShape(BODY[kind]), th, hollow ? 0.035 : 0.025), o.body || M.wood, b, { hard: true });
      const neckLen = 1.22, neck = box(0.17, neckLen + 0.2, 0.075, 0.03, o.neck || M.cream, 0, top + neckLen / 2 - 0.1, zf - 0.02, b, { line: 3.4 });
      const fb = box(0.15, neckLen + 0.32, 0.03, 0.012, hollow || kind === 'strat' ? M.navyFlat : M.cream, 0, top + neckLen / 2 - 0.17, zf + 0.022, b, { line: 0, cast: false });
      for (let i = 1; i <= 9; i++) line3(b, [[-0.075, top + neckLen - neckLen * (1 - Math.pow(0.891, i)) * 1.55, zf + 0.04], [0.075, top + neckLen - neckLen * (1 - Math.pow(0.891, i)) * 1.55, zf + 0.04]], 0.006, hollow || kind === 'strat' ? PAPER : INK);
      const hy = top + neckLen + 0.2;
      if (hollow) { const h = box(0.27, 0.42, 0.06, 0.05, M.navy, 0, hy, zf - 0.04, b, { line: 3.4 }); h.rotation.x = -0.12; for (let i = 0; i < 3; i++) for (const s of [-1, 1]) ball(0.035, M.cream, s * 0.17, hy - 0.12 + i * 0.12, zf - 0.05, b, { line: 2.2 }); }
      else { const h = solid(slab(closedShape([[-0.085, -0.22], [0.085, -0.22], [0.1, -0.1], [0.11, 0.1], [0.09, 0.22], [0.0, 0.27], [-0.1, 0.24], [-0.15, 0.14], [-0.13, 0.0], [-0.1, -0.12]], 40), 0.05, 0.012), o.neck || M.cream, b, { hard: true, line: 3.4 }); h.position.set(0, hy + 0.02, zf - 0.03);
        for (let i = 0; i < 6; i++) ball(0.03, M.steel, -0.155, hy - 0.13 + i * 0.065, zf - 0.03, b, { line: 2 }); }
      const bridgeY = hollow ? -0.3 : -0.36;
      for (let i = 0; i < 6; i++) { const x = (i - 2.5) * 0.022; line3(b, [[x * 1.5, bridgeY, zf + 0.05], [x, top + neckLen + 0.05, zf + 0.045]], 0.0045, i < 3 ? INK : '#5a5470'); }
      if (hollow) {
        box(0.3, 0.05, 0.05, 0.02, M.navyFlat, 0, bridgeY, zf + 0.02, b, { line: 2.4, cast: false });
        const tail = solid(slab(closedShape([[-0.1, 0], [0.1, 0], [0.07, -0.34], [0, -0.4], [-0.07, -0.34]], 30), 0.03, 0.008), M.steel, b, { hard: true, line: 2.6, cast: false }); tail.position.set(0, bridgeY - 0.1, zf + 0.02);
        const fh = (s) => { const pts = Array.from({ length: 15 }, (_, i) => { const u = i / 14 - 0.5; return [s * (0.33 + 0.05 * Math.sin(u * 5.2)), -0.2 + u * 0.5]; }); const m = mark([[pts, 0.05, 'both']]); m.position.z = zf + 0.004; b.add(m); };
        fh(-1); fh(1);
        for (const y of [0.42, 0.02]) box(0.24, 0.1, 0.04, 0.03, M.steel, 0, y, zf + 0.012, b, { line: 2.4, cast: false });
        for (const [x, y] of [[0.36, -0.42], [0.46, -0.3]]) { const k = solid(turned([[0, 0], [0.045, 0], [0.04, 0.04], [0, 0.04]], 14, 1), M.mustard, b, { line: 2.2 }); k.rotation.x = Math.PI / 2; k.position.set(x, y, zf); }
      } else {
        const guard = kind === 'tele' ? [[-0.3, 0.5], [-0.1, 0.56], [0.1, 0.52], [0.16, 0.38], [0.28, 0.3], [0.33, 0.14], [0.22, -0.04], [0.05, -0.1], [-0.12, -0.02], [-0.3, 0.1], [-0.36, 0.3]]
          : [[-0.34, 0.5], [-0.2, 0.42], [0.1, 0.36], [0.24, 0.42], [0.36, 0.34], [0.4, 0.1], [0.44, -0.2], [0.32, -0.42], [0.12, -0.36], [-0.04, -0.14], [-0.22, -0.02], [-0.34, 0.2]];
        const pg = new THREE.Mesh(new THREE.ShapeGeometry(closedShape(guard, 60)), fill(kind === 'tele' ? PAL.navy : PAL.paper)); pg.position.z = zf + 0.003; pg.receiveShadow = true; b.add(pg);
        const pe = new THREE.Mesh(ink.strokes([[closedShape(guard, 60).getPoints().map((p) => [p.x, p.y]).concat([[closedShape(guard, 60).getPoints()[0].x, closedShape(guard, 60).getPoints()[0].y]]), 0.018, 'none']]), flat(INK)); pe.position.z = zf + 0.005; b.add(pe);
        box(0.3, 0.2, 0.04, 0.02, M.steel, 0, bridgeY, zf + 0.01, b, { line: 2.4, cast: false });
        for (const y of kind === 'tele' ? [0.38] : [0.36, 0.14, -0.08]) box(0.2, 0.07, 0.04, 0.03, kind === 'tele' ? M.steel : M.cream, 0, y, zf + 0.012, b, { line: 2.2, cast: false });
        const kn = kind === 'tele' ? [[0.33, -0.36], [0.33, -0.5]] : [[0.26, -0.26], [0.33, -0.4], [0.4, -0.52]];
        if (kind === 'tele') box(0.1, 0.42, 0.03, 0.02, M.steel, 0.33, -0.4, zf + 0.005, b, { line: 2.2, cast: false });
        for (const [x, y] of kn) { const k = solid(turned([[0, 0], [0.04, 0], [0.036, 0.045], [0, 0.045]], 14, 1), kind === 'tele' ? M.steel : M.cream, b, { line: 2.2 }); k.rotation.x = Math.PI / 2; k.position.set(x, y, zf + 0.01); }
      }
      g.userData = { body: b, height: foot + top + neckLen + 0.45 }; return g;
    }

    // ---- a small tweed combo amplifier
    function amp() {
      const g = G(); box(1.5, 1.3, 0.72, 0.09, M.wood, 0, 0.65, 0, g);
      box(1.24, 0.82, 0.06, 0.07, M.navyFlat, 0, 0.52, 0.35, g, { line: 2.8, cast: false });
      const cone = mark([[arc(0.3, 0, Math.PI * 2, 30), 0.022, 'none'], [arc(0.12, 0, Math.PI * 2, 18), 0.02, 'none']], PAL.navy.gloss, 0); cone.position.set(0, 0.52, 0.385); g.add(cone);
      box(1.24, 0.16, 0.05, 0.03, M.steel, 0, 1.1, 0.35, g, { line: 2.4, cast: false });
      for (let i = 0; i < 4; i++) { const k = solid(turned([[0, 0], [0.04, 0], [0.036, 0.05], [0, 0.05]], 14, 1), M.navy, g, { line: 2 }); k.rotation.x = Math.PI / 2; k.position.set(-0.4 + i * 0.26, 1.1, 0.375); }
      solid(K.tube([[-0.3, 1.3, 0], [-0.26, 1.42, 0], [0, 1.45, 0], [0.26, 1.42, 0], [0.3, 1.3, 0]], 0.035, { segments: 20, radial: 8 }), M.navy, g, { line: 2.8 });
      g.userData = { cone }; return g;
    }

    // ---- sheet music: a few printed pages, lying on the table
    function sheets(n = 3) {
      const g = G(), pages = [];
      for (let i = 0; i < n; i++) { const p = G(); p.position.y = 0.012 + i * 0.016; p.rotation.y = (i - 1) * 0.16; g.add(p); pages.push(p);
        const pg = lay(new THREE.Mesh(K.roundedRect(0.95, 1.25, 0.03), fill(PAL.paper, { side: THREE.DoubleSide, band: 0.04 }))); pg.receiveShadow = true; pg.castShadow = true; p.add(pg);
        const st = [[[[-0.475, -0.625], [0.475, -0.625], [0.475, 0.625], [-0.475, 0.625], [-0.475, -0.625]], 0.03, 'none']];
        for (let s = 0; s < 4; s++) for (let l = 0; l < 5; l++) st.push([[[-0.38, 0.46 - s * 0.27 - l * 0.03], [0.38, 0.46 - s * 0.27 - l * 0.03]], 0.008, 'none']);
        const r = K.rng(4 + i); for (let s = 0; s < 4; s++) for (let k = 0; k < 6; k++) { const x = -0.3 + k * 0.12 + r.range(-0.02, 0.02), y = 0.46 - s * 0.27 - r.int(0, 4) * 0.03; st.push([[[x - 0.018, y], [x + 0.018, y]], 0.034, 'none'], [[[x + 0.016, y], [x + 0.016, y + 0.1]], 0.008, 'none']); }
        const m = lay(mark(st)); m.position.y = 0.004; p.add(m); }
      g.userData = { pages }; return g;
    }

    // ---- a small 45 rpm record player: box, platter, the fat spindle that 45s stack on, tone arm
    function player(o = {}) {
      const g = G(); box(1.7, 0.42, 1.5, 0.1, o.body || M.navyFlat, 0, 0.21, 0, g);
      const platter = solid(turned([[0, 0], [0.58, 0], [0.6, 0.025], [0.58, 0.05], [0, 0.05]], 48, 1), M.cream, g, { line: 3 }); platter.position.set(-0.15, 0.42, 0.05);
      const spin = G(); spin.position.set(-0.15, 0.47, 0.05); g.add(spin);                                         // records sit in here and turn with it
      const sp = solid(turned([[0, 0], [0.118, 0], [0.118, o.spindle || 0.42], [0.09, (o.spindle || 0.42) + 0.06], [0, (o.spindle || 0.42) + 0.07]], 28, 1), M.red, g, { line: 3 }); sp.position.set(-0.15, 0.46, 0.05);
      const arm = G(); arm.position.set(0.62, 0.42, -0.5); g.add(arm);
      solid(turned([[0, 0], [0.09, 0], [0.09, 0.12], [0, 0.13]], 18, 1), M.steel, g, { line: 2.6 }).position.copy(arm.position);
      const a = box(0.11, 0.07, 0.95, 0.03, M.cream, 0, 0.16, 0.4, arm, { line: 3 }); box(0.15, 0.09, 0.2, 0.03, M.cream, 0, 0.14, 0.86, arm, { line: 3 });
      const knob = solid(turned([[0, 0], [0.07, 0], [0.065, 0.06], [0, 0.07]], 16, 1), M.mustard, g, { line: 2.4 }); knob.position.set(0.62, 0.42, 0.5);
      g.userData = { spin, arm, top: 0.47, centre: [-0.15, 0.05] }; return g;
    }

    // ---- a jukebox: arched wooden cabinet, glowing coloured arch, record window, grille, coin slot
    function jukebox() {
      const g = G(), w = 0.8, sh = 1.45, depth = 0.85, zf = depth / 2;
      const arch = (hw, y0, y1, n = 16) => [[-hw, y0], [-hw, y1], ...arc(hw, Math.PI, 0, n).map(([x, y]) => [x, y + y1]), [hw, y0]];
      const s = new THREE.Shape(); s.moveTo(-w, 0); s.lineTo(-w, sh); s.absarc(0, sh, w, Math.PI, 0, true); s.lineTo(w, 0); s.closePath();
      const cab = solid(slab(s, depth, 0.04), M.wood, g, { hard: true }); cab.position.y = 0.16;
      box(1.76, 0.2, 0.95, 0.07, M.navyFlat, 0, 0.1, 0, g);
      const tubeAt = (hw, r, mat) => { const p = arch(hw, 0.12, sh), m = solid(K.tube(p.map(([x, y]) => [x, y + 0.16, zf]), r, { segments: 60, radial: 8 }), mat, g, { line: 2.8, cast: false }); return m; };
      tubeAt(0.66, 0.075, M.persimmon); tubeAt(0.5, 0.05, M.mustard);
      const win = new THREE.Shape(); win.moveTo(-0.4, 1.3); win.lineTo(-0.4, 1.62); win.absarc(0, 1.62, 0.4, Math.PI, 0, true); win.lineTo(0.4, 1.3); win.closePath();
      const wm = new THREE.Mesh(new THREE.ShapeGeometry(win, 20), fill(PAL.navy)); wm.position.z = zf + 0.004; wm.receiveShadow = true; g.add(wm);
      const we = new THREE.Mesh(ink.strokes([[[...arch(0.4, 1.3, 1.62, 16), [-0.4, 1.3]], 0.03, 'none']]), flat(INK)); we.position.z = zf + 0.006; g.add(we);
      const disc = mark([[arc(0.15, 0, Math.PI * 2, 20), 0.2, 'none']], PAL.vinyl.gloss, 0.012), lab = mark([[arc(0.05, 0, Math.PI * 2, 12), 0.08, 'none']], PAL.persimmon.lit, 0);
      const rec = G(); rec.add(disc, lab); lab.position.z = 0.006; rec.position.set(0, 1.68, zf + 0.01); g.add(rec);
      box(0.9, 0.16, 0.06, 0.03, M.cream, 0, 1.17, zf, g, { line: 2.6, cast: false });
      for (let i = 0; i < 6; i++) line3(g, [[-0.35 + i * 0.14, 1.13, zf + 0.035], [-0.35 + i * 0.14, 1.21, zf + 0.035]], 0.014);
      box(0.84, 0.74, 0.05, 0.08, M.cream, 0, 0.66, zf, g, { line: 2.8, cast: false });
      for (let i = 0; i < 5; i++) { const x = -0.28 + i * 0.14; line3(g, [[x, 0.36, zf + 0.03], [x, 0.96, zf + 0.03]], 0.022, PAL.persimmon.lit); }
      const slot = box(0.16, 0.26, 0.05, 0.03, M.steel, 0.6, 1.17, zf, g, { line: 2.4, cast: false }); line3(g, [[0.6, 1.11, zf + 0.03], [0.6, 1.23, zf + 0.03]], 0.012);
      g.userData = { slot: [0.6, 1.33, zf + 0.05], rec, top: sh + w + 0.16 }; return g;
    }

    // ---- a pair of bobby socks (the sock hop): each is its own group so they can dance
    function sock(side = 1) {
      const g = G(), mat = M.paper;
      solid(K.tube([[0, 0.98, 0], [0, 0.6, 0], [0, 0.3, 0.01], [0.0, 0.17, 0.1], [0.0, 0.15, 0.3], [0.0, 0.15, 0.5]], 0.15, { segments: 28, radial: 14 }), mat, g);
      ball(0.15, mat, 0, 0.15, 0.5, g);
      const cuff = solid(new THREE.TorusGeometry(0.155, 0.055, 10, 24), M.persimmon, g, { line: 3 }); cuff.rotation.x = Math.PI / 2; cuff.position.y = 0.97;
      const hole = new THREE.Mesh(new THREE.CircleGeometry(0.13, 20), flat(INK)); hole.rotation.x = -Math.PI / 2; hole.position.y = 0.985; g.add(hole);
      crease(g, 0.152, 0.8, -40, 220, 0.012); crease(g, 0.152, 0.72, -40, 220, 0.012);
      g.rotation.y = side * 0.25; return g;
    }

    // ---- upright piano with keys that can be struck
    function piano(nKeys = 14) {
      const g = G(), wKey = 0.15, width = nKeys * wKey + 0.3;
      box(width, 2.0, 0.7, 0.07, M.navyFlat, 0, 1.0, -0.3, g);
      box(width + 0.12, 0.1, 0.84, 0.04, M.navyFlat, 0, 2.03, -0.28, g, { line: 3.4 });
      box(width, 0.2, 0.62, 0.05, M.navyFlat, 0, 0.92, 0.3, g);
      for (const s of [-1, 1]) { box(0.16, 0.86, 0.5, 0.05, M.navyFlat, s * (width / 2 - 0.08), 0.43, 0.32, g); box(0.15, 0.2, 0.6, 0.04, M.navyFlat, s * (width / 2 - 0.075), 1.1, 0.3, g, { line: 3 }); }
      box(width * 0.62, 0.5, 0.05, 0.03, M.wood, 0, 1.55, 0.07, g, { line: 3, cast: false }).rotation.x = -0.12;
      const keys = [], blacks = [];
      for (let i = 0; i < nKeys; i++) { const k = box(wKey - 0.012, 0.07, 0.5, 0.018, M.paper, (i - (nKeys - 1) / 2) * wKey, 1.055, 0.36, g, { line: 2.6, cast: false }); keys.push(k); }
      for (let i = 0; i < nKeys - 1; i++) if (![2, 6].includes(i % 7)) { const k = box(0.08, 0.075, 0.3, 0.02, M.vinyl, (i - (nKeys - 1) / 2 + 0.5) * wKey, 1.115, 0.25, g, { line: 2.2, cast: false }); blacks.push(k); }
      g.userData = { keys, blacks, keyY: 1.055, width }; return g;
    }

    // ---- horn-rimmed glasses
    function glasses() {
      const g = G(), rim = (cx) => { const p = [[-0.2, 0.12], [0, 0.15], [0.2, 0.12], [0.23, -0.02], [0.14, -0.15], [-0.1, -0.15], [-0.22, -0.04]].map(([x, y]) => [cx + x, y + 0.2, 0]);
        solid(K.tube(p, 0.04, { closed: true, segments: 40, radial: 8 }), M.vinyl, g, { line: 3 });
        const lens = new THREE.Mesh(new THREE.ShapeGeometry(closedShape(p.map(([x, y]) => [x, y]), 40)), fill(PAL.screen, { side: THREE.DoubleSide, gloss: 0.05 })); g.add(lens); };
      rim(-0.29); rim(0.29);
      solid(K.tube([[-0.08, 0.27, 0], [0, 0.31, 0.01], [0.08, 0.27, 0]], 0.035, { segments: 10, radial: 8 }), M.vinyl, g, { line: 3 });
      for (const s of [-1, 1]) { solid(K.tube([[s * 0.5, 0.3, 0], [s * 0.54, 0.3, -0.3], [s * 0.54, 0.28, -0.62], [s * 0.53, 0.14, -0.76]], 0.03, { segments: 18, radial: 8 }), M.vinyl, g, { line: 3 }); ball(0.03, M.vinyl, s * 0.53, 0.14, -0.76, g, { line: 3 }); }
      return g;
    }
    function pencil() {
      const g = G();
      solid(turned([[0, 0], [0.01, 0], [0.05, 0.17], [0, 0.17]], 12, 0), M.cream, g, { line: 2.6 });
      solid(turned([[0, 0.17], [0.05, 0.17], [0.05, 0.95], [0, 0.95]], 12, 0), M.mustard, g, { line: 3 });
      solid(turned([[0, 0.95], [0.053, 0.95], [0.053, 1.02], [0, 1.02]], 12, 0), M.steel, g, { line: 2.6 });
      solid(turned([[0, 1.02], [0.05, 1.02], [0.05, 1.1], [0.03, 1.13], [0, 1.13]], 12, 1), M.red, g, { line: 2.6 });
      const tip = new THREE.Mesh(new THREE.ConeGeometry(0.014, 0.05, 8), flat(INK)); tip.rotation.x = Math.PI; tip.position.y = 0.022; g.add(tip);
      return g;
    }

    // ---- marks: musical notes (soft and round for crooners), bolts (loud), stars
    const note = (color = PAPER, s = 1, two = false) => { const h = (x, y) => [arc(0.055 * s, 0, Math.PI * 2, 12, 0.04 * s).map(([a, b]) => [a + x, b + y]), 0.085 * s, 'none'];
      const list = [h(0, 0), [[[0.075 * s, 0], [0.075 * s, 0.5 * s]], 0.035 * s, 'none']];
      if (two) list.push(h(0.34 * s, 0.06 * s), [[[0.415 * s, 0.06 * s], [0.415 * s, 0.56 * s]], 0.035 * s, 'none'], [[[0.075 * s, 0.5 * s], [0.415 * s, 0.56 * s]], 0.09 * s, 'none']);
      else list.push([[[0.075 * s, 0.5 * s], [0.2 * s, 0.4 * s], [0.22 * s, 0.26 * s]], 0.07 * s, 'tail']);
      return mark(list, color, 0.028); };
    const bolt = (color = PAL.mustard.lit, s = 1) => mark([[[[0, 0.5 * s], [0.14 * s, 0.16 * s], [-0.02 * s, 0.12 * s], [0.16 * s, -0.3 * s]], 0.13 * s, 'tail']], color, 0.028);
    const star = (s, color = PAPER) => mark([[[[0, -s], [0, 0], [0, s]], s * 0.34], [[[-s * 0.7, 0], [0, 0], [s * 0.7, 0]], s * 0.3]], color, 0.024);
    const star5 = (r, color = PAL.mustard.lit) => { const pts = Array.from({ length: 10 }, (_, i) => { const a = Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? r * 0.45 : r; return [Math.cos(a) * rr, Math.sin(a) * rr]; }), g = G();
      g.add(new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)))), flat(color))); const e = new THREE.Mesh(ink.strokes([[[...pts, pts[0], pts[1]], r * 0.11, 'none']]), flat(INK)); e.position.z = 0.003; g.add(e); return g; };
    const wave = (len, amp, ph, w = 0.07, color = PAPER) => mark([[Array.from({ length: 26 }, (_, i) => { const u = i / 25; return [u * len, Math.sin(u * 9 + ph) * amp * Math.sin(Math.PI * u)]; }), w]], color, 0.026);
    const zig = (len, amp, w = 0.1, color = PAL.mustard.lit) => mark([[Array.from({ length: 9 }, (_, i) => [i / 8 * len, (i % 2 ? amp : -amp) * (i === 0 || i === 8 ? 0 : 1)]), w, 'tail']], color, 0.028);

    // notes that keep rising from a point, stepped on twos: rise(marks, { t0, from, dx, dy, period }) -> (q, on)
    const rise = (marks, o) => (q, on = true) => marks.forEach((m, i) => { const per = o.period || 1.6, st = o.t0 + i * per / marks.length, x = (((q - st) % per) + per) % per, live = on && q >= st && (o.t1 == null || q < o.t1) && x < per * 0.72; m.visible = live; if (!live) return;
      const k = Math.floor(x * 7.5 + 1e-3) / 7.5 / (per * 0.72); m.position.set(o.from[0] + (o.dx == null ? 0.5 : o.dx) * k * (i % 2 ? 1.3 : 0.8), o.from[1] + (o.dy == null ? 0.9 : o.dy) * k + (i % 2) * 0.12, o.from[2]); m.scale.setScalar(W.pop(x, 0.2) * (1 - K.seg(x, per * 0.6, per * 0.72)) * (o.size || 1)); });

    return { star5, rise, box, ball, rod, lay, record45, record78, shards78, coin, pocketRadio, tv, mic, guitar, amp, sheets, player, jukebox, sock, piano, glasses, pencil, note, bolt, star, wave, zig };
  };
})(window);
