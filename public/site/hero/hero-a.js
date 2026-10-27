// hero-a.js — "קוד שבונה": the wordmark is assembled from tiny code tokens and Hebrew letters.
// Glyphs stream in from the reading start (right), scramble while they fly, lock into the letters,
// and keep a quiet life: a slow re-roll and a compile scan. On the split they ride the halves and a
// few keep drifting down the portrait edges.

const CODE = ['{', '}', '<', '>', '/', ';', '=', '(', ')', '[', ']', '*', '+', '#', '$', '&', '0', '1', '_', ':', '=>', '</>', '&&', '()'];
const HEB = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
const GLYPHS = [...CODE, ...HEB];
const COLS = 8, ROWS = 6, CELL = 64;

function atlas(THREE) {
  const c = document.createElement('canvas');
  c.width = COLS * CELL; c.height = ROWS * CELL;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  GLYPHS.forEach((s, i) => {
    const x = (i % COLS) * CELL + CELL / 2, y = Math.floor(i / COLS) * CELL + CELL / 2;
    const he = /[א-ת]/.test(s);
    const px = he ? CELL * 0.7 : s.length > 1 ? CELL * (s.length > 2 ? 0.36 : 0.46) : CELL * 0.66;
    g.font = he ? `700 ${px}px Rubik, "Arial Hebrew", sans-serif` : `700 ${px}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
    g.fillText(s, x, y + (he ? CELL * 0.03 : 0));
  });
  const t = new THREE.CanvasTexture(c);
  t.flipY = false; t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.magFilter = THREE.LinearFilter;
  t.anisotropy = 1;
  return t;
}

export async function create({ THREE, U, geo, mobile, mask, faceMask, HALF_GLSL, rng }) {
  const r = rng(77);
  const cell = Math.max(mobile ? 3.1 : 3.9, Math.min(7, geo.size * 0.027));
  const T = [], Hh = [], R = [], Gi = [], E = [];
  const { x0, x1, y0, y1 } = mask.box;
  for (let y = y0; y < y1; y += cell) {
    for (let x = x0; x < x1; x += cell) {
      const px = x + (r() - 0.5) * cell * 0.5, py = y + (r() - 0.5) * cell * 0.5;
      const w = mask.word(px, py);
      if (w < 0) continue;
      T.push(px, py); Hh.push(w); R.push(r(), r(), r(), r()); Gi.push(Math.floor(r() * GLYPHS.length)); E.push(mask.edge(px, py) ? 1 : 0);
    }
  }
  const n = Hh.length;
  // the head (scroll phase m): the same sampling over the head stencil; each glyph of the name is given one of
  // those points (spread evenly, so the head is as dense as the name) and its half, so the portal splits the head
  const F = new Float32Array(n * 2), HF = new Float32Array(n);
  const fp = [];
  if (faceMask) {
    const fb = faceMask.box;
    for (let y = fb.y0; y < fb.y1; y += cell) for (let x = fb.x0; x < fb.x1; x += cell) {
      const px = x + (r() - 0.5) * cell * 0.5, py = y + (r() - 0.5) * cell * 0.5, w = faceMask.word(px, py);
      if (w >= 0) fp.push(px, py, w);
    }
  }
  const m = fp.length / 3;
  for (let i = 0; i < n; i++) {
    if (!m) { F[i * 2] = T[i * 2]; F[i * 2 + 1] = T[i * 2 + 1]; HF[i] = Hh[i]; continue; }
    const j = Math.floor(((i * 0.6180339887) % 1) * m); // golden-ratio spread: every head point is used
    F[i * 2] = fp[j * 3] + (r() - 0.5) * cell * 0.6; F[i * 2 + 1] = fp[j * 3 + 1] + (r() - 0.5) * cell * 0.6; HF[i] = fp[j * 3 + 2];
  }
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geom.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(T), 2));
  geom.setAttribute('aH', new THREE.BufferAttribute(new Float32Array(Hh), 1));
  geom.setAttribute('aR', new THREE.BufferAttribute(new Float32Array(R), 4));
  geom.setAttribute('aG', new THREE.BufferAttribute(new Float32Array(Gi), 1));
  geom.setAttribute('aE', new THREE.BufferAttribute(new Float32Array(E), 1));
  geom.setAttribute('aF', new THREE.BufferAttribute(F, 2));
  geom.setAttribute('aHF', new THREE.BufferAttribute(HF, 1));

  const tex = atlas(THREE);
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...U, uAtlas: { value: tex }, uSize: { value: cell * 1.95 }, uN: { value: GLYPHS.length } },
    vertexShader: /* glsl */ `
      ${HALF_GLSL}
      uniform float uSize, uN;
      uniform vec3 uInk, uAcc;
      attribute vec2 aT; attribute float aH; attribute vec4 aR; attribute float aG; attribute float aE;
      attribute vec2 aF; attribute float aHF;
      varying vec2 vCell; varying vec3 vCol; varying float vA;
      void main(){
        float W = uRes.x;
        // stream in from the reading start: the right edge first, each glyph on its own row
        float delay = (1.0 - clamp((aT.x - uGx * 0.0) / W, 0.0, 1.0)) * 0.75 + aR.x * 0.45;
        float t = clamp((uIntro - delay) / 1.05, 0.0, 1.0);
        float e = 1.0 - pow(1.0 - t, 4.0);
        vec2 from = vec2(W + 24.0 + aR.y * W * 0.3, aT.y + (aR.z - 0.5) * 18.0);
        // the scroll's head phase (uMorph): each glyph leaves its letter for its point in Nadav's head,
        // staggered and on a small arc, and switches to the head's half so the portal splits the head
        float mk = clamp(uMorph * 1.35 - aR.y * 0.35, 0.0, 1.0); mk = mk * mk * (3.0 - 2.0 * mk);
        float fly = sin(3.14159 * mk);
        vec2 tgt = mix(aT, aF, mk);
        vec2 p = mix(from, tgt, e) + vec2(0.0, -fly * (18.0 + 40.0 * aR.z));
        float hh = mk > 0.5 ? aHF : aH;
        // pointer: glyphs part around the cursor and re-roll
        vec2 d = p - uPtr.xy; float dl = length(d);
        float f = uPtr.z * smoothstep(140.0, 0.0, dl); // wider and brighter: the name answers the cursor, so it reads as touchable
        p += d / max(dl, 1.0) * f * (10.0 + 10.0 * aR.z);
        // depth: with the cursor over the hero each glyph shifts by its own depth, so the name reads three-dimensional;
        // uPtr.z eases to 0 a few seconds after the last movement, and the name settles back
        vec2 par = (uPtr.xy / uRes - 0.5) * uPtr.z * t;
        p += par * (4.0 + 10.0 * aR.x) * vec2(1.0, 0.6);
        vec2 q = halfX(p, hh);
        // drifters: a few glyphs let go of the halves and drift down the portrait edges
        float dr = step(aR.w, 0.05) * smoothstep(0.03, 0.32, uA);
        float lf = leftOf(hh);
        float side = lf > 0.5 ? uEdge.x : uEdge.y;
        float inward = lf > 0.5 ? 1.0 : -1.0;
        float y = mod(aT.y + uTime * (10.0 + aR.y * 22.0) + aR.z * uRes.y, uRes.y + 40.0) - 20.0;
        q = mix(q, vec2(side + inward * (-22.0 + aR.x * 40.0) + sin(uTime * 0.7 + aR.z * 30.0) * 4.0, y), dr);
        gl_Position = clipOf(q);
        // which glyph: scrambles in flight and near the cursor, a quiet re-roll at rest
        float epoch = floor(uTime / (2.2 + aR.y * 2.6) + aR.x * 9.0);
        float g = aG;
        if (hash1(epoch * 13.1 + aR.z * 91.0) > 0.9) g = floor(hash1(epoch + aR.x * 57.0) * uN);
        float scr = (1.0 - t) + f * 1.4 + fly * 1.2; // glyphs re-roll while they fly to the head
        if (scr > 0.04) g = floor(hash1(floor(uTime * 16.0) + aR.y * 311.0) * uN);
        vCell = vec2(mod(g, ${COLS}.0), floor(g / ${COLS}.0));
        // colour: ember while flying, ink when locked; edges a touch brighter; a compile scan R→L
        float period = 6.5, sx = uRes.x * (1.15 - fract(max(uIntro - 3.0, 0.0) / period) * 1.3);
        float scan = (uIntro > 3.0 ? 1.0 : 0.0) * exp(-pow((aT.x - sx) / 46.0, 2.0));
        float accent = step(0.9, aR.y);
        vec3 rest = mix(uInk * (0.84 + 0.16 * aE), uAcc, accent * 0.9);
        vCol = mix(uAcc, rest, smoothstep(0.55, 1.0, t));
        vCol = mix(vCol, uAcc * 1.4, max(max(f, scan * 0.8), fly * 0.7)); // ember in flight
        vCol += scan * 0.18;
        vA = smoothstep(0.0, 0.18, t) * (1.0 - smoothstep(0.85, 1.0, uB)) * mix(1.0, 0.7, dr);
        // the real avatar is printed over the code head line by line: a glyph that has landed goes once the line passes it
        vA *= 1.0 - step(0.97, mk) * smoothstep(-10.0, 10.0, uScan - p.y);
        gl_PointSize = uSize * uDpr * (1.0 + f * 0.35);
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uAtlas;
      varying vec2 vCell; varying vec3 vCol; varying float vA;
      void main(){
        vec2 uv = (vCell + gl_PointCoord) / vec2(${COLS}.0, ${ROWS}.0);
        float m = texture2D(uAtlas, uv).a;
        if (m < 0.03) discard;
        gl_FragColor = vec4(vCol * m * vA, m * vA);
      }`,
    transparent: true, depthTest: false, depthWrite: false, premultipliedAlpha: true, blending: THREE.NormalBlending,
  });
  const pts = new THREE.Points(geom, mat);
  return {
    objects: [pts], count: n,
    restore() { tex.needsUpdate = true; },
    dispose() { geom.dispose(); mat.dispose(); tex.dispose(); },
  };
}
