// hero-a.js — "קוד שבונה": the wordmark is assembled from tiny code tokens and Hebrew letters.
// Glyphs stream in from the reading start (right), scramble while they fly, lock into the letters,
// and keep a quiet life: a slow re-roll and a compile scan. On the split they ride the halves and a
// few keep drifting down the portrait edges.

const CODE = ['{', '}', '<', '>', '/', ';', '=', '(', ')', '[', ']', '*', '+', '#', '$', '&', '0', '1', '_', ':', '=>', '</>', '&&', '()'];
const HEB = 'אבגדהוזחטיכלמנסעפצקרשת'.split('');
export const GLYPHS = [...CODE, ...HEB];
// the glyphs from the sparsest to the densest ink, measured once: the portrait shades with them like ASCII art
let RANK = null;
function inkRank() {
  if (RANK) return RANK;
  const S = 48, c = document.createElement('canvas'); c.width = c.height = S;
  const g = c.getContext('2d', { willReadFrequently: true });
  g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff';
  const ink = GLYPHS.map((s, i) => {
    g.clearRect(0, 0, S, S);
    const he = /[א-ת]/.test(s), px = he ? S * 0.7 : s.length > 1 ? S * (s.length > 2 ? 0.36 : 0.46) : S * 0.66;
    g.font = he ? `700 ${px}px Rubik, "Arial Hebrew", sans-serif` : `700 ${px}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
    g.fillText(s, S / 2, S / 2);
    const d = g.getImageData(0, 0, S, S).data; let a = 0; for (let k = 3; k < d.length; k += 4) a += d[k];
    return { i, a };
  });
  RANK = ink.sort((p, q) => p.a - q.a).map((o) => o.i);
  return RANK;
}
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

// the glyph targets: the name (T, its half Hh), per-glyph randoms (R), glyph (Gi), edge (E), and each glyph's point in
// the head portrait (F, its half HF, its tone FT). Shared by the WebGL layer below and the 2D fallback (hero-2d.js).
export function samplePoints({ geo, mobile, mask, faceMask, rng }) {
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
  const n0 = Hh.length; // the name's own glyphs
  // the head (scroll phase m): its own grid over the head stencil, fine enough for the features at any size. Every
  // point gets one glyph: the name's glyphs first, and where the head has more points than the name has glyphs,
  // extra glyphs that exist for the portrait only (born inside the name, invisible there, they fly out with the rest)
  const rank = inkRank(), NG = rank.length;
  const fp = [];
  let fc = cell;
  if (faceMask) {
    const fb = faceMask.box, orig = faceMask.man === 'orig';
    fc = orig ? cell : cell * 0.62;
    const cap = n0 * (orig ? 1.1 : 2.5); // past this many points the grid coarsens instead
    for (let pass = 0; pass < 4; pass++) {
      fp.length = 0;
      for (let y = fb.y0; y < fb.y1; y += fc) for (let x = fb.x0; x < fb.x1; x += fc) {
        const px = x + (r() - 0.5) * fc * 0.7, py = y + (r() - 0.5) * fc * 0.7, w = faceMask.word(px, py); // loose enough that no rows show
        if (w >= 0) fp.push(px, py, w, faceMask.tone(px, py));
      }
      const m0 = fp.length / 4;
      if (m0 <= cap) break;
      fc *= Math.sqrt(m0 / cap);
    }
  }
  const m = fp.length / 4;
  for (let k = 0, extra = Math.max(0, m - n0); k < extra; k++) {
    const j = Math.floor(r() * n0);
    T.push(T[j * 2], T[j * 2 + 1]); Hh.push(Hh[j]); R.push(r(), r(), r(), r()); Gi.push(Math.floor(r() * GLYPHS.length)); E.push(0);
  }
  const n = Hh.length;
  const X = new Float32Array(n); for (let k = n0; k < n; k++) X[k] = 1;
  const F = new Float32Array(n * 2), HF = new Float32Array(n), FT = new Float32Array(n), FG = new Float32Array(n);
  // a shuffled order, so the name's glyphs and the extras mix evenly over the head
  const order = Array.from({ length: m }, (_, k) => k);
  for (let k = m - 1; k > 0; k--) { const s = Math.floor(r() * (k + 1)); [order[k], order[s]] = [order[s], order[k]]; }
  for (let i = 0; i < n; i++) {
    if (!m) { F[i * 2] = T[i * 2]; F[i * 2 + 1] = T[i * 2 + 1]; HF[i] = Hh[i]; FT[i] = 1; FG[i] = Gi[i]; continue; }
    const j = m >= n ? order[i] : Math.floor(((i * 0.6180339887) % 1) * m); // one glyph per point, or a golden-ratio spread
    F[i * 2] = fp[j * 4] + (r() - 0.5) * fc * 0.25; F[i * 2 + 1] = fp[j * 4 + 1] + (r() - 0.5) * fc * 0.25; HF[i] = fp[j * 4 + 2]; FT[i] = fp[j * 4 + 3];
    FG[i] = FT[i] < 0.35 || faceMask?.man === 'orig' ? Gi[i] : rank[Math.max(0, Math.min(NG - 1, Math.round(FT[i] * (NG - 1) + (r() - 0.5) * 4)))];
  }
  // the portrait's glyph size, relative to the name's: it follows the head grid
  const headK = faceMask?.man === 'orig' ? 1 : Math.min(1, Math.max(0.62, fc / cell * 1.3));
  return { cell, T, Hh, R, Gi, E, F, HF, FT, FG, X, n, n0, headK };
}

export async function create({ THREE, U, geo, mobile, mask, faceMask, HALF_GLSL, rng }) {
  const { cell, T, Hh, R, Gi, E, F, HF, FT, FG, X, n, headK } = samplePoints({ geo, mobile, mask, faceMask, rng });
  const geom = new THREE.BufferGeometry();
  geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(n * 3), 3));
  geom.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(T), 2));
  geom.setAttribute('aH', new THREE.BufferAttribute(new Float32Array(Hh), 1));
  geom.setAttribute('aR', new THREE.BufferAttribute(new Float32Array(R), 4));
  geom.setAttribute('aG', new THREE.BufferAttribute(new Float32Array(Gi), 1));
  geom.setAttribute('aE', new THREE.BufferAttribute(new Float32Array(E), 1));
  geom.setAttribute('aF', new THREE.BufferAttribute(F, 2));
  geom.setAttribute('aHF', new THREE.BufferAttribute(HF, 1));
  geom.setAttribute('aFT', new THREE.BufferAttribute(FT, 1));
  geom.setAttribute('aFG', new THREE.BufferAttribute(FG, 1));
  geom.setAttribute('aX', new THREE.BufferAttribute(X, 1));

  const tex = atlas(THREE);
  const mat = new THREE.ShaderMaterial({
    uniforms: { ...U, uAtlas: { value: tex }, uSize: { value: cell * 1.95 }, uN: { value: GLYPHS.length } },
    vertexShader: /* glsl */ `
      ${HALF_GLSL}
      uniform float uSize, uN;
      uniform vec3 uInk, uAcc;
      attribute vec2 aT; attribute float aH; attribute vec4 aR; attribute float aG; attribute float aE;
      attribute vec2 aF; attribute float aHF; attribute float aFT; attribute float aFG; attribute float aX;
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
        // landed in the portrait: the glyph whose ink matches the spot's tone (it still scrambles under the cursor)
        if (smoothstep(0.82, 1.0, mk) > 0.6 && f < 0.25) g = aFG;
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
        // in the head, a glyph takes the brightness of its spot in the portrait: ink in the light, almost nothing in the
        // aviators and the beard, a warm touch in the mid-tones; it settles as it lands
        float land = smoothstep(0.82, 1.0, mk);
        // two tones (Nadav, 2026-10-27: version A with the first head): the face and the shirt in light code, the hair,
        // the aviators and the beard filled with ember code, the outline bright; sparks of ember in the light parts
        float dark = 1.0 - smoothstep(0.22, 0.5, aFT);
        vec3 face = mix(uInk * (0.55 + 0.55 * aFT), uAcc * (1.0 + 0.35 * aR.z), dark);
        face = mix(face, uAcc * 1.25, step(0.9, aR.y) * 0.75 * (1.0 - dark));
        vCol = mix(vCol, face, land);
        // a band of light crosses the portrait every few seconds, like a scanner passing over it
        float sweep = exp(-pow((p.x * 0.8 + p.y * 0.45 - mod(uTime * 150.0, uRes.x + uRes.y + 600.0) + 300.0) / 55.0, 2.0));
        vCol += (uInk * 0.32 + uAcc * 0.12) * sweep * land * (0.35 + 0.65 * aFT);
        vA *= mix(1.0, 0.72 + 0.28 * smoothstep(0.0, 0.5, aFT), land); // everything filled, as in the first head
        vA *= mix(1.0, smoothstep(0.35, 0.9, mk), aX); // the portrait's own glyphs show only on the way to the head
        gl_PointSize = uSize * uDpr * (1.0 + f * 0.35) * mix(1.0, ${headK.toFixed(3)}, smoothstep(0.82, 1.0, mk)); // in the portrait the glyphs follow its grid, so its features hold
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
