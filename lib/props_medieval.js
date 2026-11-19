// MEDIEVAL PROPS: the objects of the Middle Ages, built with the Ink and Toon kit. Every prop is a Group standing on
// the table (y = 0 at its foot) and facing +z. People are shown as plain turned figures, like chess pawns.
(function (root) {
  const { PAL, INK, PAPER } = root.INKTOON;
  root.INKTOON.medieval = function (W, P) {
    const { THREE, K, ink, M } = W, { solid, turned, crease, line3, mark, arc, fill, flat } = ink, { box, ball, rod, lay } = P;
    const G = () => new THREE.Group();
    const closedShape = (pts, n = 90) => new THREE.Shape(new THREE.CatmullRomCurve3(pts.map(([x, y]) => new THREE.Vector3(x, y, 0)), true, 'centripetal').getPoints(n).map((p) => new THREE.Vector2(p.x, p.y)));
    const slab = (shape, depth, bevel = 0.02) => { const g = new THREE.ExtrudeGeometry(shape, { depth: depth - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 2, curveSegments: 20 }); g.translate(0, 0, -(depth - 2 * bevel) / 2); return g; };
    const dot = (parent, r, x, y, z, color = INK) => { const m = new THREE.Mesh(new THREE.CircleGeometry(r, 14), flat(color)); m.position.set(x, y, z); parent.add(m); return m; };
    const knob = (parent, r, h, mat, f = {}) => solid(turned([[0, 0], [r, 0], [r * 0.92, h], [0, h * 1.05]], 14, 1), mat, parent, Object.assign({ line: 2.4 }, f));
    const stone = M.cream, gold = M.mustard;

    // ---- a person: robe, head, and a hood, veil or hat. o: { robe, kind: 'monk' | 'nun' | 'cleric' | 'poet', trim }
    function pawn(o = {}) {
      const g = G(), robe = o.robe || M.navyFlat, kind = o.kind || 'monk';
      solid(turned([[0, 0], [0.4, 0], [0.45, 0.06], [0.36, 0.5], [0.26, 0.95], [0.2, 1.12], [0, 1.14]], 36), robe, g);
      const head = G(); head.position.y = 1.36; g.add(head);
      ball(0.23, M.cream, 0, 0, 0, head, { line: 3.4 });
      dot(head, 0.026, -0.08, 0.035, 0.218); dot(head, 0.026, 0.08, 0.035, 0.218);
      const mouth = dot(head, 0.05, 0, -0.085, 0.214); mouth.visible = false;
      const cap = (mat, y, tilt, len = 0.62, r = 0.265) => { const h = solid(new THREE.SphereGeometry(r, 22, 14, 0, Math.PI * 2, 0, Math.PI * len), mat, head, { line: 3 }); h.position.set(0, y, -0.03); h.rotation.x = tilt; return h; };
      if (kind === 'monk') cap(robe, 0.02, -0.55);
      if (kind === 'nun') { solid(turned([[0, -0.3], [0.27, -0.3], [0.3, -0.22], [0.22, -0.12], [0, -0.12]], 24, 1), M.paper, head, { line: 2.6 }); cap(M.paper, 0.0, -0.45, 0.6, 0.25); cap(robe, 0.03, -0.75, 0.6, 0.285); }
      if (kind === 'cleric') { const c = solid(new THREE.SphereGeometry(0.2, 18, 10, 0, Math.PI * 2, 0, Math.PI * 0.32), o.trim || M.red, head, { line: 2.6 }); c.position.y = 0.06; }
      if (kind === 'poet') { const hat = solid(turned([[0, 0.12], [0.3, 0.12], [0.33, 0.2], [0.26, 0.34], [0, 0.38]], 24, 2), o.trim || M.tealProp, head, { line: 3 }); solid(K.tube([[0.2, 0.3, 0], [0.38, 0.22, 0.02], [0.42, 0.0, 0.04], [0.36, -0.2, 0.05]], 0.07, { segments: 14, radial: 8 }), o.trim || M.tealProp, head, { line: 2.8 }); }
      g.userData = { head, mouth }; return g;
    }

    // ---- writing things
    // a sheet of parchment lying flat (w along x, d along z), with optional ruled lines; marks added to .top lie on it
    function parchment(w = 3, d = 1.6, lines = 0, o = {}) {
      const g = G(), pg = lay(new THREE.Mesh(K.roundedRect(w, d, 0.05), fill(PAL.paper, { side: THREE.DoubleSide, band: 0.04 }))); pg.receiveShadow = true; pg.castShadow = true; pg.position.y = 0.012; g.add(pg);
      const st = [[[[-w / 2, -d / 2], [w / 2, -d / 2], [w / 2, d / 2], [-w / 2, d / 2], [-w / 2, -d / 2]], 0.035, 'none']];
      for (let i = 0; i < lines; i++) { const y = (i - (lines - 1) / 2) * (o.gap || 0.16); st.push([[[-w / 2 + 0.2, y], [w / 2 - 0.2, y]], 0.012, 'none']); }
      const m = lay(mark(st, o.ink)); m.position.y = 0.016; g.add(m);
      const top = G(); top.rotation.x = -Math.PI / 2; top.position.y = 0.02; g.add(top); g.userData = { top, w, d }; return g;
    }
    // one square chant note (a flat mark in the XY plane)
    const sq = (color = INK, s = 1, wide = 1) => mark([[[[-0.065 * s * wide, 0], [0.065 * s * wide, 0]], 0.13 * s, 'none']], color === INK ? null : color, 0.022);
    function book(o = {}) {                                             // closed: a thick bound book lying flat
      const g = G(), w = o.w || 1.2, d = o.d || 1.6, h = o.h || 0.34;
      box(w, h, d, 0.05, o.cover || M.red, 0, h / 2, 0, g); box(w - 0.06, h - 0.1, d - 0.05, 0.02, M.paper, 0.04, h / 2, 0.0, g, { line: 0, cast: false });
      for (const z of [-d * 0.28, d * 0.28]) line3(g, [[-w / 2 - 0.004, 0.04, z], [-w / 2 - 0.004, h - 0.04, z]], 0.02, PAL.mustard.lit);
      const clasp = box(0.14, 0.1, 0.2, 0.03, gold, w / 2, h / 2, 0, g, { line: 2.2, cast: false });
      const cross = lay(mark([[[[0, -0.26], [0, 0.26]], 0.07, 'none'], [[[-0.17, 0.07], [0.17, 0.07]], 0.07, 'none']], PAL.mustard.lit, 0.02)); cross.position.set(-0.02, h + 0.006, 0); if (o.cross !== false) g.add(cross);
      g.userData = { h }; return g;
    }
    function openBook() {                                               // open, to stand on a lectern or lie on the table
      const g = G(); box(2.06, 0.1, 1.5, 0.04, M.red, 0, 0.05, 0, g);
      const pages = [-1, 1].map((s) => { const p = box(0.98, 0.2, 1.4, 0.05, M.paper, s * 0.5, 0.18, 0, g, { line: 3 }); p.rotation.z = -s * 0.06; return p; });
      line3(g, [[0, 0.275, -0.68], [0, 0.275, 0.68]], 0.014);
      const top = G(); top.rotation.x = -Math.PI / 2; top.position.y = 0.29; g.add(top);
      const lines = []; for (const s of [-1, 1]) for (let r = 0; r < 3; r++) for (let l = 0; l < 4; l++) lines.push([[[s * 0.5 - 0.36, 0.4 - r * 0.38 - l * 0.045], [s * 0.5 + 0.36, 0.4 - r * 0.38 - l * 0.045]], 0.008, 'none']);
      const m = mark(lines, PAL.persimmon.shade, 0); top.add(m); g.userData = { top }; return g;
    }
    function lectern() {
      const g = G(); solid(turned([[0, 0], [0.5, 0], [0.55, 0.05], [0.5, 0.1], [0.16, 0.16], [0.12, 0.3], [0, 0.3]], 32), M.wood, g);
      rod(0.09, 1.0, M.wood, g, { line: 3.4 }).position.y = 0.75;
      const desk = G(); desk.position.set(0, 1.42, 0.05); desk.rotation.x = 0.62; g.add(desk);
      box(2.3, 0.14, 1.7, 0.05, M.wood, 0, 0, 0, desk); box(2.3, 0.16, 0.12, 0.04, M.wood, 0, 0.14, 0.8, desk, { line: 3 });
      g.userData = { desk }; return g;
    }
    function candle() {
      const g = G(); solid(turned([[0, 0], [0.3, 0], [0.34, 0.04], [0.3, 0.09], [0.1, 0.12], [0, 0.12]], 24), gold, g, { line: 3 });
      solid(turned([[0, 0.1], [0.1, 0.1], [0.1, 0.9], [0.07, 0.94], [0, 0.94]], 16, 1), M.paper, g, { line: 3 });
      const flames = [0, 1].map((k) => { const m = mark([[[[0, 0], [k ? 0.035 : -0.03, 0.14], [k ? -0.01 : 0.02, 0.32]], 0.17, 'head']], PAL.mustard.lit, 0.024); m.position.set(0, 0.96, 0); g.add(m); return m; });
      g.userData = { flames }; return g;
    }
    function quill() {                                                  // flat, in the XY plane, nib at the origin, feather up
      const g = G(), vane = closedShape([[0.02, 0.3], [0.14, 0.5], [0.2, 0.85], [0.16, 1.2], [0.04, 1.42], [-0.06, 1.2], [-0.12, 0.85], [-0.1, 0.5]], 40);
      const v = new THREE.Mesh(new THREE.ShapeGeometry(vane), flat(PAL.paper.lit)); g.add(v);
      const pts = vane.getPoints(); const e = new THREE.Mesh(ink.strokes([[pts.map((p) => [p.x, p.y]).concat([[pts[0].x, pts[0].y]]), 0.024, 'none'], [[[0, 0], [0.03, 0.7], [0.05, 1.38]], 0.03, 'none']]), flat(INK)); e.position.z = 0.003; g.add(e);
      return g;
    }

    // ---- places and powers
    function column() {                                                 // a Roman column in two parts, so it can break
      const g = G(), low = G(), high = G(); g.add(low, high); high.position.y = 1.1;
      solid(turned([[0, 0], [0.5, 0], [0.5, 0.1], [0.4, 0.14], [0.4, 0.2], [0.33, 0.24], [0.33, 1.1], [0, 1.1]], 28, 1), stone, low);
      solid(turned([[0, 0], [0.33, 0], [0.31, 1.0], [0.36, 1.04], [0.42, 1.12], [0.42, 1.16], [0, 1.16]], 28, 1), stone, high);
      box(0.98, 0.14, 0.98, 0.03, stone, 0, 1.22, 0, high);
      for (let i = 0; i < 7; i++) { const a = (i - 3) * 0.36, x = Math.sin(a) * 0.335, z = Math.cos(a) * 0.335; line3(low, [[x, 0.3, z], [x, 1.08, z]], 0.009); line3(high, [[x * 0.97, 0.02, z * 0.97], [x * 0.94, 0.98, z * 0.94]], 0.009); }
      const crack = mark([[[[-0.34, 0], [-0.18, 0.07], [-0.05, -0.05], [0.1, 0.06], [0.22, -0.04], [0.34, 0.02]], 0.05, 'both']]); crack.position.set(0, 1.1, 0.34); crack.visible = false; g.add(crack);
      g.userData = { low, high, crack }; return g;
    }
    function crown() {
      const g = G(); solid(turned([[0.36, 0], [0.42, 0], [0.44, 0.05], [0.42, 0.3], [0.38, 0.3], [0.36, 0.05], [0.36, 0]], 36, 1), gold, g);
      for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI * 2, x = Math.cos(a) * 0.4, z = Math.sin(a) * 0.4; const p = solid(turned([[0, 0], [0.09, 0], [0.012, 0.3], [0, 0.3]], 10, 0), gold, g, { line: 3 }); p.position.set(x, 0.26, z); ball(0.045, M.red, x, 0.6, z, g, { line: 2.2 }); }
      for (let i = 0; i < 6; i++) { const a = (i + 0.5) / 6 * Math.PI * 2; ball(0.04, M.tealProp, Math.cos(a) * 0.43, 0.15, Math.sin(a) * 0.43, g, { line: 2 }); }
      return g;
    }
    function cushion() { const g = G(); box(1.3, 0.34, 1.1, 0.16, M.red, 0, 0.17, 0, g); for (const [x, z] of [[-0.6, 0.5], [0.6, 0.5], [-0.6, -0.5], [0.6, -0.5]]) ball(0.07, gold, x, 0.17, z, g, { line: 2.4 }); return g; }
    function cathedral() {                                              // the west front of Notre Dame, Paris, as blocks
      const g = G(); box(2.2, 1.7, 1.0, 0.04, stone, 0, 0.85, 0, g);
      for (const s of [-1, 1]) { box(0.78, 2.9, 1.04, 0.04, stone, s * 0.72, 1.45, 0.02, g); for (const y of [2.1, 2.5]) for (const dx of [-0.13, 0.13]) { const w = mark([[[[0, -0.14], [0, 0.1]], 0.1, 'none'], [arc(0.05, 0, Math.PI, 8).map(([x, y2]) => [x, y2 + 0.1]), 0.035, 'none']]); w.position.set(s * 0.72 + dx, y, 0.545); g.add(w); } }
      const rose = mark([[arc(0.27, 0, Math.PI * 2, 28), 0.05, 'none'], ...[0, 1, 2, 3].map((i) => [[[Math.cos(i * Math.PI / 4) * -0.26, Math.sin(i * Math.PI / 4) * -0.26], [Math.cos(i * Math.PI / 4) * 0.26, Math.sin(i * Math.PI / 4) * 0.26]], 0.022, 'none'])]), glass = dot(g, 0.27, 0, 1.3, 0.512, PAL.mustard.lit); rose.position.set(0, 1.3, 0.516); g.add(rose);
      for (const [x, s] of [[-0.72, 0.8], [0, 1], [0.72, 0.8]]) { const sh = new THREE.Shape(); sh.moveTo(-0.2 * s, 0); sh.lineTo(-0.2 * s, 0.4 * s); sh.absarc(0, 0.4 * s, 0.2 * s, Math.PI, 0, true); sh.lineTo(0.2 * s, 0); const d = new THREE.Mesh(new THREE.ShapeGeometry(sh, 12), flat(PAL.navy.shade)); d.position.set(x, 0.02, x ? 0.545 : 0.512); g.add(d); }
      line3(g, [[-1.1, 0.95, 0.515], [1.1, 0.95, 0.515]], 0.014); line3(g, [[-1.1, 1.72, 0.515], [1.1, 1.72, 0.515]], 0.014);
      return g;
    }
    // the sun coming up: a flat disc with rays (XY plane)
    function sunrise(r = 0.6) { const g = G(), rays = [0, 1].map((k) => { const m = mark(ink.burst(11, r * 1.25, r * 1.25, r * 0.55, 0.07, 3 + k)); g.add(m); return m; }); const disc = G(); disc.add(new THREE.Mesh(new THREE.CircleGeometry(r, 36), flat(PAL.mustard.lit))); const ring = mark([[arc(r, 0, Math.PI * 2 + 0.2, 40), 0.05, 'none']]); ring.position.z = 0.003; disc.add(ring); disc.position.z = 0.01; g.add(disc); g.userData = { rays }; return g; }
    // a caption slip on a short post, for marking a spot on the table
    function flag(text, h = 0.42) { const g = G(), c = ink.caption(text, { height: h }); c.position.y = 0.55; g.add(c); line3(g, [[0, 0, -0.01], [0, 0.34, -0.01]], 0.02); g.userData = { slip: c }; return g; }

    // ---- instruments
    function lute() {                                                   // stands upright, bowl-backed, peg box bent back
      const g = G(), b = G(); b.position.y = 0.72; g.add(b);
      const prof = [[0, -0.72], [0.3, -0.68], [0.5, -0.45], [0.55, -0.15], [0.45, 0.2], [0.26, 0.52], [0.13, 0.74], [0.1, 0.8]];
      const bowl = solid(new THREE.LatheGeometry(prof.map(([r, y]) => new THREE.Vector2(r, y)), 28, Math.PI / 2, Math.PI), M.wood, b); bowl.scale.z = 0.8;
      for (const a of [-0.9, -0.45, 0, 0.45, 0.9]) line3(b, prof.slice(1).map(([r, y]) => [Math.sin(Math.PI + a) * r, y, Math.cos(Math.PI + a) * r * 0.8]), 0.008);
      const face = closedShape([...prof.map(([r, y]) => [r, y]), [-0.1, 0.8], ...prof.slice(1, -1).reverse().map(([r, y]) => [-r, y])], 70);
      const top = new THREE.Mesh(new THREE.ShapeGeometry(face), fill(PAL.cream, { band: 0.05 })); top.receiveShadow = true; b.add(top);
      const fp = face.getPoints(); const edge = new THREE.Mesh(ink.strokes([[fp.map((p) => [p.x, p.y]).concat([[fp[0].x, fp[0].y]]), 0.03, 'none']]), flat(INK)); edge.position.z = 0.004; b.add(edge);
      const rose = mark([[arc(0.14, 0, Math.PI * 2, 20), 0.03, 'none'], [arc(0.07, 0, Math.PI * 2, 14), 0.025, 'none'], [[[-0.13, 0], [0.13, 0]], 0.02, 'none'], [[[0, -0.13], [0, 0.13]], 0.02, 'none']]); rose.position.set(0, -0.02, 0.006); b.add(rose);
      box(0.18, 0.95, 0.07, 0.03, M.navyFlat, 0, 1.2, 0.0, b, { line: 3.2 });
      const peg = G(); peg.position.set(0, 1.66, -0.02); peg.rotation.x = -1.25; b.add(peg); box(0.2, 0.46, 0.08, 0.03, M.wood, 0, 0.2, 0, peg, { line: 3 }); for (let i = 0; i < 3; i++) for (const s of [-1, 1]) ball(0.035, M.cream, s * 0.14, 0.1 + i * 0.12, 0, peg, { line: 2 });
      box(0.34, 0.05, 0.04, 0.015, M.navyFlat, 0, -0.42, 0.02, b, { line: 2.2, cast: false });
      for (let i = 0; i < 6; i++) { const x = (i - 2.5) * 0.026; line3(b, [[x * 1.6, -0.42, 0.03], [x, 1.66, 0.045]], 0.0045, i % 2 ? INK : '#5a5470'); }
      g.userData = { body: b }; return g;
    }
    function harp() {                                                   // a small lap harp
      const g = G(); solid(K.tube([[-0.5, 0.12, 0], [-0.6, 0.6, 0], [-0.62, 1.2, 0], [-0.5, 1.75, 0]], 0.1, { segments: 24, radial: 10 }), M.wood, g);           // sound box side
      solid(K.tube([[-0.5, 1.75, 0], [-0.25, 1.95, 0], [0.1, 1.86, 0], [0.42, 1.98, 0], [0.62, 1.86, 0]], 0.075, { segments: 26, radial: 10 }), M.wood, g);       // neck
      solid(K.tube([[0.62, 1.86, 0], [0.7, 1.3, 0], [0.5, 0.6, 0], [-0.2, 0.14, 0], [-0.5, 0.12, 0]], 0.06, { segments: 30, radial: 10 }), M.wood, g);            // pillar
      ball(0.11, gold, 0.62, 1.88, 0, g, { line: 3 }); solid(turned([[0, 0], [0.3, 0], [0.32, 0.05], [0.2, 0.12], [0, 0.12]], 20, 1), M.wood, g, { line: 3 }).position.set(-0.45, 0, 0);
      const strings = []; for (let i = 0; i < 9; i++) { const u = i / 8, x = -0.46 + u * 0.98, y0 = 0.22 + u * 0.75 + Math.max(0, u - 0.7) * 1.6, y1 = 1.8 + 0.1 * Math.sin(u * 7); const s = line3(g, [[x - 0.06 * (1 - u), y0, 0], [x, y1, 0]], 0.007, i % 3 ? PAPER : PAL.persimmon.lit); strings.push(s); }
      g.userData = { strings }; return g;
    }
    function vielle() {                                                 // the medieval fiddle, standing upright; the bow is separate
      const g = G(), b = G(); b.position.y = 0.62; g.add(b);
      solid(slab(closedShape([[0, -0.62], [0.26, -0.6], [0.42, -0.42], [0.42, -0.18], [0.33, 0.02], [0.35, 0.22], [0.36, 0.4], [0.24, 0.56], [0.1, 0.6], [-0.1, 0.6], [-0.24, 0.56], [-0.36, 0.4], [-0.35, 0.22], [-0.33, 0.02], [-0.42, -0.18], [-0.42, -0.42], [-0.26, -0.6]]), 0.2, 0.03), M.wood, b, { hard: true });
      box(0.15, 0.62, 0.07, 0.03, M.navyFlat, 0, 0.86, 0.05, b, { line: 3 });
      const head = solid(slab(closedShape([[0, -0.2], [0.17, -0.1], [0.2, 0.08], [0.1, 0.22], [-0.1, 0.22], [-0.2, 0.08], [-0.17, -0.1]], 40), 0.07, 0.015), M.wood, b, { hard: true, line: 3 }); head.position.set(0, 1.34, 0.03);
      for (const [x, y] of [[-0.09, 1.3], [0.09, 1.3], [0, 1.4], [-0.08, 1.46], [0.08, 1.46]]) knob(b, 0.03, 0.07, M.cream, { line: 2 }).position.set(x, y, 0.06);
      for (const s of [-1, 1]) { const m = mark([[arc(0.1, s > 0 ? 2.0 : -1.14, s > 0 ? 4.28 : 1.14, 12), 0.04, 'both']]); m.position.set(s * 0.2, 0.06, 0.104); b.add(m); }
      box(0.3, 0.04, 0.06, 0.015, M.cream, 0, -0.12, 0.11, b, { line: 2, cast: false }); box(0.12, 0.3, 0.03, 0.02, M.navyFlat, 0, -0.42, 0.105, b, { line: 2, cast: false });
      for (let i = 0; i < 5; i++) { const x = (i - 2) * 0.026; line3(b, [[x * 1.4, -0.3, 0.125], [x * 1.3, -0.12, 0.15], [x, 1.2, 0.1]], 0.0045, i % 2 ? INK : '#5a5470'); }
      g.userData = { body: b }; return g;
    }
    function bow() { const g = G(); solid(K.tube([[-0.9, 0, 0], [-0.45, 0.13, 0], [0, 0.17, 0], [0.45, 0.13, 0], [0.9, 0, 0]], 0.028, { segments: 24, radial: 8 }), M.red, g, { line: 3 }); line3(g, [[-0.88, -0.02, 0], [0.88, -0.02, 0]], 0.012, PAPER); ball(0.05, M.navyFlat, -0.9, 0, 0, g, { line: 2.4 }); return g; }
    function hurdy() {                                                  // lies on the table: body, key box, wheel, crank at the tail (towards +x)
      const g = G(); const body = solid(slab(closedShape([[-1.1, 0], [-0.95, 0.34], [-0.55, 0.46], [0, 0.36], [0.5, 0.5], [0.95, 0.42], [1.12, 0.14], [1.12, -0.14], [0.95, -0.42], [0.5, -0.5], [0, -0.36], [-0.55, -0.46], [-0.95, -0.34]]), 0.42, 0.04), M.wood, g, { hard: true }); body.rotation.x = -Math.PI / 2; body.position.y = 0.23;
      box(1.15, 0.2, 0.34, 0.04, M.navyFlat, -0.42, 0.52, 0, g); for (let i = 0; i < 6; i++) box(0.09, 0.07, 0.16, 0.02, M.paper, -0.86 + i * 0.17, 0.5, 0.2, g, { line: 2, cast: false });
      const wheel = G(); wheel.position.set(0.55, 0.5, 0); g.add(wheel); const w = solid(turned([[0, -0.05], [0.3, -0.05], [0.32, 0], [0.3, 0.05], [0, 0.05]], 28, 1), M.cream, wheel, { line: 3 }); w.rotation.x = Math.PI / 2; w.rotation.z = Math.PI / 2;
      const spokes = mark([[[[-0.26, 0], [0.26, 0]], 0.03, 'none'], [[[0, -0.26], [0, 0.26]], 0.03, 'none']]); spokes.rotation.y = Math.PI / 2; spokes.position.x = 0.056; const sp2 = spokes.clone(); sp2.position.x = -0.056; const spin = G(); spin.add(spokes, sp2); wheel.add(spin);
      const crank = G(); crank.position.set(1.14, 0.5, 0); g.add(crank); const sh = rod(0.035, 0.2, M.steel, crank, { line: 2.4 }); sh.rotation.z = Math.PI / 2; sh.position.x = 0.12;
      const arm = box(0.07, 0.42, 0.07, 0.03, M.steel, 0.24, 0.18, 0, crank, { line: 2.4 }); const grip = rod(0.06, 0.16, M.red, crank, { line: 3 }); grip.rotation.z = Math.PI / 2; grip.position.set(0.38, 0.38, 0);
      for (const z of [-0.07, 0, 0.07]) line3(g, [[-1.0, 0.46, z * 1.6], [0.5, 0.82, z], [1.02, 0.46, z * 1.3]], 0.006);
      g.userData = { crank, spin }; return g;
    }
    function shawm() {                                                  // stands on its bell
      const g = G(); solid(turned([[0, 0], [0.36, 0], [0.38, 0.04], [0.2, 0.3], [0.12, 0.7], [0.075, 1.5], [0.06, 1.9], [0.085, 1.94], [0.085, 2.0], [0, 2.0]], 28), M.wood, g);
      solid(turned([[0, 2.0], [0.03, 2.0], [0.022, 2.2], [0, 2.2]], 10, 0), M.paper, g, { line: 2.4 });
      for (let i = 0; i < 6; i++) dot(g, 0.026, 0, 0.78 + i * 0.17, 0.118 - i * 0.008);
      crease(g, 0.125, 0.66, -60, 240, 0.012); crease(g, 0.09, 1.88, -60, 240, 0.012);
      return g;
    }
    function nakers() {                                                 // a pair of small kettledrums and two sticks
      const g = G(), sticks = [];
      for (const s of [-1, 1]) { const d = G(); d.position.set(s * 0.5, 0, 0); g.add(d);
        solid(turned([[0, 0], [0.16, 0], [0.34, 0.14], [0.44, 0.4], [0.46, 0.56], [0, 0.56]], 28), M.red, d); solid(turned([[0, 0.55], [0.46, 0.55], [0.48, 0.6], [0.44, 0.63], [0, 0.63]], 28, 1), M.paper, d, { line: 3 }); crease(d, 0.47, 0.54, -70, 250, 0.014);
        const st = G(); st.position.set(s * 0.5 + s * 0.1, 0.72, 0.3); g.add(st); const r = rod(0.028, 0.7, M.wood, st, { line: 2.6 }); r.rotation.x = 1.1; r.position.set(0, 0.16, 0.3); ball(0.065, M.cream, 0, 0, 0, st, { line: 2.6 }); sticks.push(st); }
      g.userData = { sticks }; return g;
    }
    function jugglingBall(mat) { const g = G(); ball(0.14, mat, 0, 0.14, 0, g, { line: 3 }); crease(g, 0.142, 0.14, -60, 240, 0.01); return g; }
    const heart = (s = 0.3, color = PAL.persimmon.lit) => { const pts = Array.from({ length: 30 }, (_, i) => { const a = i / 30 * Math.PI * 2; return [s * 0.06 * 16 * Math.pow(Math.sin(a), 3), s * 0.06 * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a))]; }), g = G();
      g.add(new THREE.Mesh(new THREE.ShapeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y)))), flat(color))); const e = new THREE.Mesh(ink.strokes([[[...pts, pts[0], pts[1]], s * 0.12, 'none']]), flat(INK)); e.position.z = 0.003; g.add(e); return g; };

    return { pawn, parchment, sq, book, openBook, lectern, candle, quill, column, crown, cushion, cathedral, sunrise, flag, lute, harp, vielle, bow, hurdy, shawm, nakers, jugglingBall, heart };
  };
})(window);
