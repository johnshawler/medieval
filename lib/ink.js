// INK AND TOON: the look, shared by every experience in this set. The first half (inkKit) is the reference style's kit:
// banded fill, brush outline, turned shapes, marks, lettering, caption boxes and the print finish. The second half
// (inkWorld) is the staging every scene here uses: ground, the on-twos clock, pose helpers, the framing camera and
// the lettered labels that stand in the scene facing their own framing.
(function (root) {
  const INK = '#1c1622', PAPER = '#f7ecd6';
  const PAL = {
    teal: { lit: '#2a9d94', shade: '#1c7376', deep: '#12565c' },
    tealDot: { lit: '#3db0a4', shade: '#1c7376', deep: '#12565c' },
    cream: { lit: '#f7e8cc', shade: '#b3c9bd' },
    paper: { lit: '#fffdf6', shade: '#c9dcd4' },
    persimmon: { lit: '#ee5a36', shade: '#ae2f33', gloss: '#ffd2bd' },
    mustard: { lit: '#f6b63c', shade: '#c9722c', gloss: '#fff1c4' },
    navy: { lit: '#3b4568', shade: '#222641', gloss: '#b4c0e6' },
    vinyl: { lit: '#2b2d4a', shade: '#17162a', gloss: '#aab6de' },
    screen: { lit: '#d8f1e6', shade: '#8cc9bf', gloss: '#ffffff' },
    steel: { lit: '#e9eee6', shade: '#93b3b4', gloss: '#ffffff' },
  };
  const DPS = 15, F = 1 / DPS, at = (n) => n / DPS;

  function inkKit(S, o = {}) {
    const { THREE, K } = S, px = S.H / 1080;
    const G = { res: { value: new THREE.Vector2(S.W, S.H) }, light: { value: new THREE.Vector3(0, 1, 0) }, up: { value: new THREE.Vector3(0, 1, 0) }, seed: { value: 0 }, pitch: { value: (o.pitch || 11) * px } };
    const srgb = (hex) => new THREE.Vector3(parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255);

    // One hard sun. Its direction is the "hand-placed shadow shape": low and from the side gives big readable shadows.
    const sun = K.sun(S, { pos: o.sun || [-6.2, 6.2, 4.8], target: o.sunTarget || [0.3, 1, 0], power: Math.PI, size: o.sunSize || 6.5, mapSize: 4096, normalBias: 0.03 });

    // FILL. MeshToonMaterial with a plain 0..1 ramp as its gradient map, so three.js hands us one number per pixel:
    // how lit it is (half-Lambert times the cast shadow). The patch turns that number into print: lit colour, shadow
    // colour, a band of halftone dots where light turns into shadow, optional hatching inside the shadow, and a
    // hard-edged highlight (a round glint, or a vertical streak down turned shapes).
    const ramp = new THREE.DataTexture(new Uint8Array(1024).map((_, i) => (i % 4 === 3 ? 255 : i >> 2)), 256, 1);
    ramp.minFilter = ramp.magFilter = THREE.LinearFilter; ramp.needsUpdate = true;
    const FILL_PARS = `
      uniform vec3 uLit, uShade, uDeep, uGloss, uUp; uniform float uThr, uBand, uPitch, uHatch, uGlossSize, uStreak;`;
    const FILL_MAIN = `{
      float v = outgoingLight.r;                                            // 0 = in shadow, 1 = facing the light
      float k = clamp((v - uThr) / max(uBand, 1e-4), 0.0, 1.0);             // 0 at the shadow edge, 1 in full light
      vec2 g = mat2(0.819, 0.574, -0.574, 0.819) * gl_FragCoord.xy / uPitch;   // dot screen, turned 35 degrees, fixed to the page
      float rad = 0.74 * (1.0 - k), aa = 0.8 / uPitch;                      // dots grow until they merge into solid shadow
      float tone = v < uThr ? 1.0 : (1.0 - smoothstep(rad - aa, rad + aa, length(fract(g) - 0.5))) * step(k, 0.999);
      vec3 c = mix(uLit, uShade, tone);
      if (uHatch > 0.0) {                                                   // pen hatching inside the shadow
        float sp = uPitch * 1.3, h = abs(fract((gl_FragCoord.x + gl_FragCoord.y) / sp) - 0.5) * sp;
        float lw = uHatch * (0.75 + 0.5 * sin(gl_FragCoord.x * 0.011 - gl_FragCoord.y * 0.017));
        c = mix(c, uDeep, (1.0 - smoothstep(lw - 0.7, lw + 0.7, h)) * step(v, uThr));
      }
      #if NUM_DIR_LIGHTS > 0
        vec3 hv = normalize(directionalLights[0].direction + normalize(vViewPosition));
        float lit = step(uThr + uBand, v);
        if (uGlossSize > 0.0) c = mix(c, uGloss, step(1.0 - uGlossSize, dot(normal, hv)) * lit);
        if (uStreak > 0.0) {                                                // the long glint down a turned shape
          float ny = dot(normal, uUp); vec3 nh = normalize(normal - uUp * ny), hh = normalize(hv - uUp * dot(hv, uUp));
          c = mix(c, uGloss, step(1.0 - uStreak, dot(nh, hh)) * step(abs(ny), 0.55) * lit);
        }
      #endif
      outgoingLight = c;
    }`;
    function fill(c, f = {}) {
      const m = new THREE.MeshToonMaterial({ color: '#ffffff', gradientMap: ramp, side: f.side || THREE.FrontSide });
      const u = m.userData.u = { uLit: { value: new THREE.Color(c.lit) }, uShade: { value: new THREE.Color(c.shade) }, uDeep: { value: new THREE.Color(c.deep || c.shade) }, uGloss: { value: new THREE.Color(c.gloss || '#ffffff') },
        uUp: G.up, uPitch: G.pitch, uThr: { value: f.thr == null ? 0.56 : f.thr }, uBand: { value: f.band == null ? 0.1 : f.band }, uHatch: { value: (f.hatch || 0) * px }, uGlossSize: { value: f.gloss || 0 }, uStreak: { value: f.streak || 0 } };
      m.onBeforeCompile = (sh) => {
        Object.assign(sh.uniforms, u);
        sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\n' + FILL_PARS).replace('#include <opaque_fragment>', FILL_MAIN + '\n#include <opaque_fragment>');
      };
      return m;
    }

    // OUTLINE: the inverted hull. A back-faced copy of the mesh in ink, pushed outwards along its normals by a number
    // of screen pixels. The push is not even: it swells on the side away from the light, thins towards the light and
    // wavers along the form, like a brush line. Needs smooth normals (turned, rounded and tube shapes all have them).
    function hull(width, color) {
      return new THREE.ShaderMaterial({
        side: THREE.BackSide,
        uniforms: { uRes: G.res, uLight: G.light, uSeed: G.seed, uWidth: { value: width * px }, uColor: { value: new THREE.Color(color) } },
        vertexShader: `uniform vec2 uRes; uniform vec3 uLight; uniform float uWidth, uSeed;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec3 n = normalize(normalMatrix * normal);
            float waver = 0.6 * sin(dot(position, vec3(7.1, 5.3, 6.7)) + uSeed * 2.1) + 0.4 * sin(dot(position, vec3(-17.3, 12.9, 15.1)) + uSeed * 5.3);
            float w = uWidth * (1.0 + 0.3 * waver) * mix(0.55, 1.45, smoothstep(-0.6, 0.8, -dot(n, uLight)));
            // surfaces that face the ground come a little towards the lens, so the line survives where a prop stands on it
            mv.xyz *= 1.0 - 0.006 * smoothstep(0.85, 1.0, -normalize(mat3(modelMatrix) * normal).y);
            gl_Position = projectionMatrix * mv;
            gl_Position.xy += n.xy / max(length(n.xy), 0.35) * w * 2.0 / uRes * gl_Position.w;
          }`,
        fragmentShader: 'uniform vec3 uColor; void main() { gl_FragColor = vec4(uColor, 1.0); }',
      });
    }
    // Shapes with hard edges (extrusions, cylinders) have split normals, which would tear the hull open at every edge:
    // their hull is drawn from a copy whose normals are averaged across each edge.
    function smoothed(geo) {
      const g = geo.index ? geo.toNonIndexed() : geo.clone(), p = g.attributes.position, acc = new Map(), key = (i) => Math.round(p.getX(i) * 2e3) + ',' + Math.round(p.getY(i) * 2e3) + ',' + Math.round(p.getZ(i) * 2e3);
      const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3(), n = new THREE.Vector3();
      for (let i = 0; i < p.count; i += 3) {
        a.fromBufferAttribute(p, i); b.fromBufferAttribute(p, i + 1); c.fromBufferAttribute(p, i + 2); n.subVectors(b, a).cross(c.sub(a));   // area-weighted
        for (let k = 0; k < 3; k++) { const id = key(i + k), v = acc.get(id) || [0, 0, 0]; v[0] += n.x; v[1] += n.y; v[2] += n.z; acc.set(id, v); }
      }
      const nr = new Float32Array(p.count * 3);
      for (let i = 0; i < p.count; i++) { const v = acc.get(key(i)), l = Math.hypot(v[0], v[1], v[2]) || 1; nr[i * 3] = v[0] / l; nr[i * 3 + 1] = v[1] / l; nr[i * 3 + 2] = v[2] / l; }
      g.setAttribute('normal', new THREE.BufferAttribute(nr, 3)); return g;
    }
    const outline = (mesh, width = 4.2, color = INK, hard = false) => { const h = new THREE.Mesh(hard ? smoothed(mesh.geometry) : mesh.geometry, hull(width, color)); h.frustumCulled = false; mesh.add(h); return mesh; };
    // a filled, outlined, shadow-casting solid: the basic building block. f.hard: the shape has hard edges
    const solid = (geo, mat, parent, f = {}) => { const m = new THREE.Mesh(geo, mat); m.castShadow = f.cast !== false; m.receiveShadow = true; if (f.line !== 0) outline(m, f.line, INK, f.hard); if (parent) parent.add(m); return m; };

    const flat = (color) => new THREE.MeshBasicMaterial({ color, side: THREE.DoubleSide });
    // INNER LINES: a thin ink line round a turned shape at height y, drawn only part of the way (angles in degrees,
    // 0 = right, 90 = towards the camera) so it breaks off on the lit side. Thinner than the outline on purpose.
    const crease = (parent, r, y, a0 = -70, a1 = 105, w = 0.0085) => { const n = 28, pts = Array.from({ length: n + 1 }, (_, i) => { const a = (a0 + (a1 - a0) * i / n) * Math.PI / 180; return [Math.cos(a) * r, y, Math.sin(a) * r]; });
      const m = new THREE.Mesh(K.tube(pts, w, { segments: 56, radial: 5 }), flat(INK)); parent.add(m); return m; };
    // a straight or bent ink line through 3D points (strings, seams, slots)
    const line3 = (parent, pts, w = 0.0085, color = INK) => { const m = new THREE.Mesh(K.tube(pts, w, { segments: Math.max(6, pts.length * 4), radial: 5 }), flat(color)); parent.add(m); return m; };

    // TURNED SHAPES: a profile of [radius, height] points, corners softened, spun round the axis. Draw the profile from
    // the bottom of the axis, out, up the outside, over the lip and back down the inside, so the shape is closed.
    const soften = (pts, n = 2) => { for (; n > 0; n--) { const q = [pts[0]]; for (let i = 0; i < pts.length - 1; i++) { const a = pts[i], b = pts[i + 1]; q.push([a[0] * 0.75 + b[0] * 0.25, a[1] * 0.75 + b[1] * 0.25], [a[0] * 0.25 + b[0] * 0.75, a[1] * 0.25 + b[1] * 0.75]); } q.push(pts[pts.length - 1]); pts = q; } return pts; };
    const turned = (pts, seg = 64, n = 2) => new THREE.LatheGeometry(soften(pts, n).map(([r, y]) => new THREE.Vector2(r, y)), seg);

    // MARKS: brush strokes as flat geometry (speed lines, impact bursts, steam, arrows). strokes([[points, width,
    // taper], ...]) -> one geometry in the XY plane; taper 'both' | 'head' | 'tail' | 'none' thins the ends like a brush.
    function strokes(list, grow = 0) {
      const pos = [], idx = [];
      for (let [pts, w, taper = 'both'] of list) {
        while (pts.length < 5) pts = pts.flatMap((p, i) => (i ? [[(p[0] + pts[i - 1][0]) / 2, (p[1] + pts[i - 1][1]) / 2], p] : [p]));   // short strokes need points to taper over
        const n = pts.length, base = pos.length / 3;
        for (let i = 0; i < n; i++) {
          const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, u = i / (n - 1);
          const k = taper === 'both' ? Math.pow(Math.sin(Math.PI * u), 0.5) : taper === 'head' ? Math.pow(1 - u, 0.6) : taper === 'tail' ? Math.pow(u, 0.6) : 1;
          const hw = (w * k + grow * Math.min(1, k * 3)) / 2;
          pos.push(pts[i][0] - dy / l * hw, pts[i][1] + dx / l * hw, 0, pts[i][0] + dy / l * hw, pts[i][1] - dx / l * hw, 0);
          if (i < n - 1) idx.push(base + 2 * i, base + 2 * i + 1, base + 2 * i + 2, base + 2 * i + 1, base + 2 * i + 3, base + 2 * i + 2);
        }
      }
      const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); return g;
    }
    // an ink mark, or (with a colour) a coloured mark with an ink edge
    function mark(list, color, edge = 0.03) {
      const g = new THREE.Group();
      if (!color) { g.add(new THREE.Mesh(strokes(list), flat(INK))); return g; }
      if (edge > 0) g.add(new THREE.Mesh(strokes(list, edge * 2), flat(INK)));
      const top = new THREE.Mesh(strokes(list), flat(color)); top.position.z = 0.004; g.add(top);
      return g;
    }
    const arc = (r, a0, a1, n = 24, ry = r) => Array.from({ length: n + 1 }, (_, i) => { const a = a0 + (a1 - a0) * i / n; return [Math.cos(a) * r, Math.sin(a) * ry]; });
    // radial impact ticks around an ellipse
    const burst = (n, rx, ry, len, w, seed = 1) => { const r = K.rng(seed); return Array.from({ length: n }, (_, i) => { const a = (i + r.range(-0.25, 0.25)) / n * Math.PI * 2, l = len * r.range(0.6, 1.25), c = Math.cos(a), s = Math.sin(a); return [[[c * rx, s * ry], [c * (rx + l * 0.5), s * (ry + l * 0.5)], [c * (rx + l), s * (ry + l)]], w, 'head']; }); };

    // LETTERING: display type drawn like a comic sound effect: slanted, cream face with a dot-screen fade, heavy ink
    // edge and a solid colour block behind it. Returns a flat mesh; `height` is the world height of a capital.
    function lettering(text, f = {}) {
      const fpx = 260, font = `${fpx}px "Anton"`, sk = -0.13, dep = 26, lw = 30, pad = 54, ls = '10px';
      const m = document.createElement('canvas').getContext('2d'); m.font = font; m.letterSpacing = ls;
      const mt = m.measureText(text), asc = Math.ceil(mt.actualBoundingBoxAscent), W = Math.ceil(mt.width + pad * 2 + dep + asc * -sk), H = asc + pad * 2 + dep, x = pad, y = pad + asc;
      const prep = (c) => { c.font = font; c.letterSpacing = ls; c.lineJoin = 'round'; c.textBaseline = 'alphabetic'; c.setTransform(1, 0, sk, 1, -sk * y, 0); c.lineWidth = lw; c.strokeStyle = INK; };
      const tex = K.canvasTex(W, H, (ctx) => {
        prep(ctx);
        for (let k = dep; k >= 0; k -= 2) ctx.strokeText(text, x + k, y + k);                    // ink round the whole block
        ctx.fillStyle = f.block || PAL.persimmon.lit; for (let k = dep; k > 0; k -= 1) ctx.fillText(text, x + k, y + k);   // the block
        ctx.strokeText(text, x, y); ctx.fillStyle = f.face || PAPER; ctx.fillText(text, x, y);   // the face
        const dots = document.createElement('canvas'); dots.width = W; dots.height = H; const d = dots.getContext('2d');   // dot-screen fade up from the baseline
        d.fillStyle = f.dots || PAL.mustard.lit;
        for (let j = -2; j < H / 13 + 2; j++) for (let i = -2; i < W / 13 + 2; i++) { const cx = i * 15 + (j % 2) * 7.5, cy = j * 13, r = 9.4 * K.clamp((cy - (y - asc * 0.62)) / (asc * 0.6)); if (r > 0.5) { d.beginPath(); d.arc(cx, cy, r, 0, 7); d.fill(); } }
        prep(d); d.globalCompositeOperation = 'destination-in'; d.fillStyle = '#000'; d.fillText(text, x, y);
        ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.drawImage(dots, 0, 0);
      });
      const unit = (f.height || 0.6) / asc, mesh = new THREE.Mesh(new THREE.PlaneGeometry(W * unit, H * unit), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      mesh.userData.size = [W * unit, H * unit]; return mesh;
    }
    // the step number (or a year) in a starburst
    function badge(text, f = {}) {
      const tex = K.canvasTex(420, 420, (ctx) => {
        const r = K.rng(text + 'b'); ctx.translate(210, 210); ctx.lineJoin = 'round';
        ctx.beginPath(); for (let i = 0; i < 24; i++) { const a = i / 24 * Math.PI * 2, rr = (i % 2 ? 142 : 188) * r.range(0.95, 1.05); ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr); } ctx.closePath();
        ctx.save(); ctx.translate(12, 14); ctx.fillStyle = INK; ctx.fill(); ctx.restore();
        ctx.fillStyle = f.color || PAL.mustard.lit; ctx.fill(); ctx.lineWidth = 15; ctx.strokeStyle = INK; ctx.stroke();
        const big = text.length <= 2, fs = big ? 230 : 112;
        ctx.font = fs + 'px "Anton"'; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic'; ctx.fillStyle = INK; ctx.fillText(text, 0, big ? 84 : 42);
      });
      const s = f.height || 0.8; return new THREE.Mesh(new THREE.PlaneGeometry(s, s), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
    }
    // a caption box, as in a graphic novel: hand-written note on a slip of paper with an inked edge
    function caption(text, f = {}) {
      const fpx = 150, font = `700 ${fpx}px "Caveat"`, m = document.createElement('canvas').getContext('2d'); m.font = font;
      const tw = Math.ceil(m.measureText(text).width), bw = tw + 110, bh = 190, W = bw + 60, H = bh + 60;
      const tex = K.canvasTex(W, H, (ctx) => {
        const r = K.rng(text), j = () => r.range(-7, 7), box = (dx, dy) => { ctx.beginPath(); ctx.moveTo(20 + dx + j(), 20 + dy + j()); ctx.lineTo(20 + bw + dx + j(), 20 + dy + j()); ctx.lineTo(20 + bw + dx + j(), 20 + bh + dy + j()); ctx.lineTo(20 + dx + j(), 20 + bh + dy + j()); ctx.closePath(); };
        ctx.lineJoin = 'round'; box(14, 16); ctx.fillStyle = INK; ctx.fill();
        box(0, 0); ctx.fillStyle = f.paper || PAPER; ctx.fill(); ctx.lineWidth = 11; ctx.strokeStyle = INK; ctx.stroke();
        ctx.font = font; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = INK; ctx.fillText(text, 20 + bw / 2, 20 + bh / 2 + 6);
      });
      const unit = (f.height || 0.42) / bh, mesh = new THREE.Mesh(new THREE.PlaneGeometry(W * unit, H * unit), new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false }));
      mesh.userData.size = [W * unit, H * unit]; return mesh;
    }

    // PRINT FINISH: a filter over the finished picture. Edges wander by about a pixel and are "redrawn" a few times a
    // second (line boil), paper tooth and fibres multiply through the colour, tiny pinholes where ink did not take,
    // and a hand-ruled panel border with bare paper outside it.
    function print(f = {}) {
      return S.addFilter(`uniform vec3 uPaper, uInk; uniform float uBoil, uBorder;
        float h21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
        float vn(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f); return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
        void main(){
          float s = res.y / 1080.0; vec2 px = vUv * res; float b = floor(time * uBoil);
          vec2 w = (vec2(vn(px / (42.0 * s) + b * 7.31), vn(px / (42.0 * s) + 19.7 - b * 3.17)) - 0.5) * 3.0 * s;
          vec3 c = texture2D(tex, (px + w) / res).rgb;
          if (uBorder > 0.0) {
            vec2 q = abs(px + w * 1.6 - res * 0.5) - (res * 0.5 - (uBorder + 16.0) * s);
            float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - 16.0 * s, lw = (2.6 + 1.5 * vn(px / (120.0 * s))) * s;
            c = mix(c, uInk, 1.0 - smoothstep(lw - 0.8, lw + 0.8, abs(d)));
            c = mix(c, uPaper, smoothstep(lw - 0.6, lw + 0.8, d));
          }
          float tooth = 0.6 * vn(px / (1.8 * s)) + 0.4 * vn(px / (6.0 * s)), fibre = vn(px * vec2(0.03, 0.8) / s + 3.0);
          c *= mix(vec3(1.0), uPaper, 0.3) * (0.95 + 0.07 * tooth + 0.025 * fibre);
          c = mix(c, uPaper, 0.4 * step(0.9988, h21(floor(px / (2.0 * s)) + 5.0)));
          gl_FragColor = vec4(c, 1.0);
        }`, { uPaper: { value: srgb(PAPER) }, uInk: { value: srgb(INK) }, uBoil: { value: f.boil == null ? 6 : f.boil }, uBorder: { value: f.border == null ? 26 : f.border } });
    }

    // call once per update(t), after the camera is placed: gives the outline and the fills the light and "up" in view space
    const frame = (t, camera) => {
      camera.updateMatrixWorld();
      G.light.value.copy(sun.position).sub(sun.target.position).normalize().transformDirection(camera.matrixWorldInverse);
      G.up.value.set(0, 1, 0).transformDirection(camera.matrixWorldInverse);
      G.seed.value = Math.floor(t * 6);
    };
    return { G, sun, fill, outline, solid, turned, crease, line3, strokes, mark, arc, burst, lettering, badge, caption, print, frame, flat, smoothed };
  }

  // ---------------------------------------------------------------- staging shared by every scene in this set
  function inkWorld(S, o = {}) {
    const { THREE, K, scene, camera } = S;
    const ink = inkKit(S, o), { fill, mark, burst } = ink;
    ink.print();
    const M = {
      cream: fill(PAL.cream), paper: fill(PAL.paper, { band: 0.06 }), mustard: fill(PAL.mustard, { streak: 0.028, gloss: 0.02 }), wood: fill(PAL.mustard), persimmon: fill(PAL.persimmon, { streak: 0.04, gloss: 0.03 }),
      red: fill(PAL.persimmon), navy: fill(PAL.navy, { gloss: 0.05, streak: 0.03 }), navyFlat: fill(PAL.navy), vinyl: fill(PAL.vinyl, { band: 0.05, gloss: 0.012 }), screen: fill(PAL.screen, { band: 0.04, gloss: 0.04 }),
      steel: fill(PAL.steel, { streak: 0.05, gloss: 0.04 }), tealProp: fill({ lit: '#3db0a4', shade: '#1c7376', gloss: '#d8f1e6' }, { gloss: 0.03, streak: 0.03 }),
    };
    const group = (parent = scene) => { const g = new THREE.Group(); parent.add(g); return g; };
    const pop = (x, d = 0.25) => (x < 0 ? 0 : K.ease.outBack(Math.min(1, (x + F / 2) / d), 2.4));        // lands on its frame: 0.7, 1.18, 1.05, 1
    const wobble = (x, f = 3.4, k = 9) => (x <= 0 ? 0 : Math.exp(-k * x) * Math.sin(x * 2 * Math.PI * f));   // the settle after a hit
    const onTwos = (t) => { const q = Math.floor(t * DPS + 1e-3) / DPS; return [q, Math.round(q * DPS)]; };   // the drawing we are on, and its number
    // SMEAR: on a drawing where a prop has travelled far since the last one, stretch it along its path, as an
    // animator draws one long in-between instead of motion blur.
    const X = new THREE.Vector3(1, 0, 0), dv = new THREE.Vector3();
    const rig = (inner, parent) => { const outer = group(parent), mid = group(outer); mid.add(inner); return { outer, inner, set(p, p0, max = 0.9) {
      dv.set(p[0] - p0[0], p[1] - p0[1], p[2] - p0[2]); const speed = dv.length() / F, s = 1 + Math.min(max, Math.max(0, speed - 7) * 0.04);
      outer.position.set(p[0], p[1], p[2]); outer.quaternion.identity(); if (s > 1) outer.quaternion.setFromUnitVectors(X, dv.normalize());
      mid.quaternion.copy(outer.quaternion).invert(); outer.scale.set(s, 1 / Math.sqrt(s), 1 / Math.sqrt(s));
    } }; };
    // squash and stretch that keeps the volume
    const squash = (obj, sy) => obj.scale.set(1 / Math.sqrt(sy), sy, 1 / Math.sqrt(sy));

    // ---- the ground: one flat colour with a field of printed dots lying on it in perspective
    const cx = o.centre || [0.4, -0.5], wide = o.wide || 0;
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 90), fill(PAL.teal, { band: 0, hatch: 1.7 })); ground.rotation.x = -Math.PI / 2; ground.receiveShadow = true; scene.add(ground);
    { const pts = [], r = 0.7, nx = 16 + Math.ceil(wide / r);
      for (let j = -16; j <= 16; j++) for (let i = -nx; i <= nx; i++) { const x = (i + (j & 1) * 0.5) * r, z = j * r * 0.866, d = Math.hypot(Math.max(0, Math.abs(x - cx[0]) - wide), z - cx[1]), s = 0.17 * (1 - K.smooth(2.2, 8.5, d)); if (s > 0.02) pts.push([x, z, s]); }
      const dots = new THREE.InstancedMesh(new THREE.CircleGeometry(1, 20).rotateX(-Math.PI / 2), fill(PAL.tealDot, { band: 0, hatch: 1.7 }), pts.length); dots.receiveShadow = true;
      pts.forEach(([x, z, s], i) => K.place(dots, i, [x, 0.004, z], null, s)); scene.add(dots); }

    // ---- the camera: one framing per step. Keys are [time, [aim x, y, z, elevation deg, azimuth deg, distance], ease]
    const D = Math.PI / 180, TAN = Math.tan(S.R.fov / 2 * D);
    let cam = null;
    const sunDir = new THREE.Vector3().copy(ink.sun.position).sub(ink.sun.target.position);
    const setCamera = (keys) => { cam = K.track(keys.map(([t, v, e]) => [t, [v[0], v[1], v[2], v[3] * D, v[4] * D, v[5]], e])); };
    const camPos = (c) => [c[0] + c[5] * Math.sin(c[4]) * Math.cos(c[3]), c[1] + c[5] * Math.sin(c[3]), c[2] + c[5] * Math.cos(c[4]) * Math.cos(c[3])];
    // place the camera for time t; the sun (and its shadow area) follows the framing sideways so long sets stay shadowed
    const shoot = (t) => { const c = cam(t); K.look(camera, camPos(c), c);
      ink.sun.target.position.set(c[0] + 0.3, 1, 0); ink.sun.position.copy(ink.sun.target.position).add(sunDir); ink.sun.target.updateMatrixWorld();
      ink.frame(t, camera); };
    // the world point that sits at screen position (sx, sy) (-1..1) at a given time, and the rotation that lies flat to the
    // picture there; `push` moves it away from the lens
    const spot = (time, sx, sy, push = 0) => { const c = cam(time), p = camPos(c), e = c[3], a = c[4], d = c[5] + push, hh = d * TAN, hw = hh * S.W / S.H;
      const f = [-Math.sin(a) * Math.cos(e), -Math.sin(e), -Math.cos(a) * Math.cos(e)], r = [Math.cos(a), 0, -Math.sin(a)], u = [-Math.sin(a) * Math.sin(e), Math.cos(e), -Math.cos(a) * Math.sin(e)];
      return { pos: [0, 1, 2].map((i) => p[i] + f[i] * d + r[i] * sx * hw + u[i] * sy * hh), rot: new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3(...r), new THREE.Vector3(...u), new THREE.Vector3(...f).negate())) }; };

    // ---- lettering: a word, an optional badge and a caption box, standing in the scene and turned to face the camera
    // of their own framing. step = { word, note, n }; wordAt / capAt = [screen x, screen y, push] in the framing at
    // time f.look (default: just after `when`). Returns the function that poses it for drawing time q.
    const labels = [];
    const onTop = (m, order = 20) => { m.traverse((o) => { if (o.material) { o.material.depthTest = false; o.material.depthWrite = false; o.renderOrder = order; } }); return m; };   // lettering is printed over the picture
    const fit = (look, at2, halfW) => { const d = cam(look)[5] + (at2[2] || 0), hw = d * TAN * S.W / S.H, lim = Math.max(0, 0.9 - halfW / hw); return [K.clamp(at2[0], -lim, lim), at2[1], at2[2] || 0]; };   // keep it inside the panel
    const label = (step, when, until, wordAt, capAt, f = {}) => {
      const look = f.look == null ? when + 0.9 : f.look, g = group(), capG = group();
      let word = null, ticks = null, bd = null, cap = null;
      if (step.word) { word = ink.lettering(step.word, { height: f.height || 0.56, block: f.block }); const [ww, wh] = word.userData.size, yr = step.n && step.n.length > 2, a = spot(look, ...fit(look, wordAt, ww / 2 + (step.n ? wh * (yr ? 1.25 : 0.45) : 0.1))); g.add(word); g.position.set(...a.pos); g.quaternion.copy(a.rot);
        ticks = mark(burst(9, ww * 0.56, wh * 0.62, 0.3, 0.06, 7 + when)); ticks.position.z = -0.01; g.add(ticks);
        if (step.n) { bd = ink.badge(step.n, { height: wh * (step.n.length > 2 ? 1.0 : 0.82), color: f.badge }); bd.position.set(-ww / 2 + (yr ? -wh * 0.42 : 0.02), wh * (yr ? 0.3 : 0.22), 0.02); g.add(bd); }
        onTop(ticks, 20); onTop(word, 21); if (bd) onTop(bd, 22); }
      if (step.note) { cap = ink.caption(step.note, { height: f.cap || 0.36 }); const b = spot(look, ...fit(look, capAt, cap.userData.size[0] / 2)); capG.add(cap); capG.position.set(...b.pos); capG.quaternion.copy(b.rot); cap.rotation.z = f.tilt == null ? -0.04 : f.tilt; onTop(cap, 23); }
      const capDelay = f.capDelay == null ? (word ? 3 : 0) : f.capDelay;
      const fn = (q) => {
        const x = q - when, out = 1 - K.seg(q, until, until + 2 * F), s = pop(x) * out;
        g.visible = !!word && x >= 0 && out > 0;
        if (word) { g.scale.setScalar(Math.max(s, 1e-3)); word.rotation.z = 0.05 * wobble(x + 0.03, 4, 10);
          ticks.visible = x >= 0 && x < 2 * F - 1e-3; ticks.scale.setScalar(x < F - 1e-3 ? 0.92 : 1.06); }
        if (bd) { const b = pop(x - F); bd.scale.setScalar(Math.max(b, 1e-3)); bd.rotation.z = 0.18 - 0.5 * (1 - Math.min(1, b)); }
        const cs = pop(x - capDelay * F) * out; capG.visible = !!cap && x >= capDelay * F - 1e-3 && out > 0; capG.scale.setScalar(Math.max(cs, 1e-3));
      };
      labels.push(fn); return fn;
    };
    // marks that always face the lens
    const faceCam = [];
    const sprite = (m, parent = scene) => { parent.add(m); faceCam.push(m); m.visible = false; return m; };
    // call at the end of update(t)
    const finish = (q) => { for (const f of labels) f(q); for (const m of faceCam) m.quaternion.copy(camera.quaternion); };
    return { S, THREE, K, ink, M, PAL, INK, PAPER, group, pop, wobble, onTwos, rig, squash, setCamera, shoot, spot, label, sprite, finish, onTop, D };
  }

  root.INKTOON = { INK, PAPER, PAL, DPS, F, at, inkKit, inkWorld };
})(window);
