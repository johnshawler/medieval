// prop sheet: every medieval prop on one table, for checking shapes
{
  const { PAL, inkWorld, props, medieval } = INKTOON;
  registerStyle({ id: 'sheet', name: 'prop sheet', duration: 2, play: 2, fonts: ['260px "Anton"', '700 150px "Caveat"'],
    render: { samples: 16, preview: 2, shutter: 0, tone: 'linear', exposure: 1, bloom: 0, vignette: 0, grain: 0, fov: 26, background: PAL.teal.lit },
    build(S) {
      const W = inkWorld(S, { wide: 5, sunSize: 10 }), P = props(W), Md = medieval(W, P), { scene } = S, M = W.M;
      const put = (o, x, z, ry = 0, s = 1) => { o.position.x = x; o.position.z = z; o.rotation.y += ry; o.scale.multiplyScalar(s); scene.add(o); return o; };
      put(Md.pawn({ kind: 'monk' }), -6.2, 1.8); put(Md.pawn({ kind: 'nun' }), -5.2, 1.8); put(Md.pawn({ kind: 'cleric', robe: M.tealProp }), -4.2, 1.8); put(Md.pawn({ kind: 'poet', robe: M.red }), -3.2, 1.8);
      const pm = Md.parchment(3, 1.5, 4); put(pm, -1.0, 2.4); [0, 1, 2, 3, 4].forEach((i) => { const n = Md.sq(i % 2 ? PAL.persimmon.lit : undefined); n.position.set(-1.0 + i * 0.3, 0.1 * (i % 3), 0); pm.userData.top.add(n); });
      put(Md.book(), 1.6, 2.4, 0.3); const lec = put(Md.lectern(), -5.6, -1.6, 0.2); const ob = Md.openBook(); ob.position.y = 0.07; lec.userData.desk.add(ob);
      put(Md.candle(), -3.9, -0.6); const q = Md.quill(); q.position.set(3.0, 1.2, 2.2); q.rotation.z = -0.5; scene.add(q);
      put(Md.column(), -2.7, -1.4); const cu = put(Md.cushion(), -1.2, -0.4); const cr = Md.crown(); cr.position.y = 0.34; cu.add(cr);
      put(Md.cathedral(), 0.9, -1.8, -0.15); const sr = Md.sunrise(); sr.position.set(3.0, 1.2, -1.8); scene.add(sr); put(Md.flag('c. 1025 · Guido’s staff'), 3.4, 3.3);
      put(Md.lute(), 3.3, 0.4, -0.2); put(Md.harp(), 4.7, 0.6, 0.3); put(Md.vielle(), 6.0, 0.6, -0.1); const b = Md.bow(); b.position.set(6.2, 0.9, 1.0); b.rotation.z = 0.3; scene.add(b);
      put(Md.hurdy(), 5.4, 2.6, 0.25); put(Md.shawm(), 4.4, -1.6); put(Md.nakers(), 6.2, -1.4, -0.2); put(Md.jugglingBall(M.red), 2.6, 3.4); const h = Md.heart(); h.position.set(1.6, 1.6, 1.0); scene.add(h);
      W.setCamera([[0, (new URLSearchParams(location.search).get('cam') || '0,1.0,0.5,30,0,23').split(',').map(Number)]]);
      return { update(t) { W.shoot(t); W.finish(t); } };
    } });
}
