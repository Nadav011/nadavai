// cloud.js — the v4 hero: a cloud of real app and social screens that locks into NADAV AI,
// with the code that builds them (variant A's glyphs) flowing through the gaps between the cards.
//
// World units are stage pixels (the camera puts z = 0 exactly on the stage), so a card at rest sits
// on the DOM letterform it replaces, and every card rides its half's live transform during the split.
//
// API (returned, and exposed by hero-cloud.js as window.__cloud):
//   formShape(key)       'wordmark' | 'phones' | 'tree' | 'xp' | 'controller': the same cards reassemble
//   rectOf(i)            screen rect of card i (for the DOM zoom layer)
//   hide(i) / show(i)    take a card out of the cloud while its enlarged twin is on screen
//   hit(x, y)            the card under a stage point, or -1
//   slotsOf(cardId)      instance indices showing a given screen

import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const COLS = 9, CW = 224, CH = 485; // atlas: 9 × 4 cells of 224×485 in 2048²
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
const easeOutExpo = (t) => (t >= 1 ? 1 : 1 - Math.pow(2, -10 * t));
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Portrait cells (cw × ch) where most of the cell is ink. */
function cells(x0, x1, y0, y1, cw, ch, inside) {
  const out = [];
  for (let y = y0 + ch / 2; y < y1; y += ch) {
    for (let x = x0 + cw / 2; x < x1; x += cw) {
      const kx = cw * 0.3, ky = ch * 0.32;
      let n = 0, w = -1;
      for (const [dx, dy] of [[0, 0], [-kx, -ky], [kx, -ky], [-kx, ky], [kx, ky], [0, -ky], [0, ky]]) { const v = inside(x + dx, y + dy); if (v >= 0) { n++; w = v; } }
      if (n >= 5) out.push({ x, y, w: cw, h: ch, half: inside(x, y) >= 0 ? inside(x, y) : w });
    }
  }
  return out;
}

function shapeMask(key, W, H) {
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d', { willReadFrequently: true });
  g.fillStyle = '#f00'; g.strokeStyle = '#f00'; g.lineCap = 'round';
  const S = Math.min(H * 0.62, W * 0.5), cx = W / 2, cy = H / 2;
  const rr = (x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); g.fill(); };
  if (key === 'phones') {
    for (const [ox, k] of [[-0.62, 0.86], [0, 1], [0.62, 0.86]]) {
      const w = S * 0.5 * k, h = S * k, x = cx + ox * S - w / 2, y = cy - h / 2;
      g.lineWidth = S * 0.05; g.beginPath(); g.roundRect(x, y, w, h, S * 0.07); g.stroke();
      for (let i = 0; i < 3; i++) rr(x + w * 0.16, y + h * (0.24 + i * 0.16), w * (i % 2 ? 0.5 : 0.68), S * 0.05, S * 0.02);
    }
  } else if (key === 'tree') {
    const N = [[0, 0.42], [-0.3, 0.1], [0.3, 0.12], [-0.48, -0.28], [-0.14, -0.36], [0.18, -0.38], [0.46, -0.26]].map(([x, y]) => [cx + x * S * 1.4, cy - y * S]);
    g.lineWidth = S * 0.05;
    for (const [a, b] of [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]]) { g.beginPath(); g.moveTo(...N[a]); g.lineTo(...N[b]); g.stroke(); }
    N.forEach(([x, y], i) => { g.beginPath(); g.arc(x, y, S * (i ? 0.085 : 0.1), 0, Math.PI * 2); g.fill(); });
  } else if (key === 'xp') {
    const w = Math.min(W * 0.84, S * 2.6), h = S * 0.24, x = cx - w / 2, y = cy - h / 2;
    g.lineWidth = S * 0.05; g.beginPath(); g.roundRect(x, y, w, h, h / 2); g.stroke();
    rr(x + w * 0.32, y + h * 0.2, w * 0.66, h * 0.6, h * 0.3); // RTL: 68 % full from the right
  } else if (key === 'controller') {
    const k = S / 520; g.save(); g.translate(cx - 600 * k, cy - 400 * k); g.scale(k, k);
    rr(220, 200, 760, 300, 150);
    for (const [x, a] of [[330, 0.5], [870, -0.5]]) { g.save(); g.translate(x, 470); g.rotate(a); g.beginPath(); g.ellipse(0, 0, 125, 195, 0, 0, Math.PI * 2); g.fill(); g.restore(); }
    g.globalCompositeOperation = 'destination-out';
    rr(350, 270, 42, 128, 8); rr(307, 313, 128, 42, 8);
    for (const [x, y] of [[850, 268], [850, 392], [788, 330], [912, 330]]) { g.beginPath(); g.arc(x, y, 30, 0, Math.PI * 2); g.fill(); }
    g.restore();
  }
  const d = g.getImageData(0, 0, W, H).data;
  return (x, y) => { const X = x | 0, Y = y | 0; return X < 0 || Y < 0 || X >= W || Y >= H ? -1 : d[(Y * W + X) * 4] > 127 ? 0 : -1; };
}

async function atlasOf(THREE, cards) {
  const cv = document.createElement('canvas'); cv.width = 2048; cv.height = 2048;
  const g = cv.getContext('2d');
  g.fillStyle = '#0A0C0E'; g.fillRect(0, 0, 2048, 2048);
  await Promise.all(cards.map((c, i) => new Promise((res) => {
    const im = new Image(); im.decoding = 'async';
    im.onload = () => { g.drawImage(im, (i % COLS) * CW, Math.floor(i / COLS) * CH, CW, CH); res(); };
    im.onerror = res;
    im.src = c.src;
  })));
  const t = new THREE.CanvasTexture(cv);
  t.colorSpace = THREE.SRGBColorSpace; t.flipY = false; t.anisotropy = 8;
  t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

// ---------- the code layer: tokens + Hebrew letters from variant A ----------
const GLYPHS = ['{', '}', '<', '>', '/', ';', '=', '(', ')', '[', ']', '*', '+', '#', '$', '&', '0', '1', '_', ':', '=>', '</>', '&&', '()', ...'אבגדהוזחטיכלמנסעפצקרשת'.split('')];
function glyphAtlas(THREE) {
  const C = 64, cols = 8, rows = 6, c = document.createElement('canvas');
  c.width = cols * C; c.height = rows * C;
  const g = c.getContext('2d');
  g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
  GLYPHS.forEach((s, i) => {
    const he = /[א-ת]/.test(s);
    const px = he ? C * 0.7 : s.length > 1 ? C * (s.length > 2 ? 0.36 : 0.46) : C * 0.66;
    g.font = he ? `700 ${px}px Rubik, "Arial Hebrew", sans-serif` : `700 ${px}px ui-monospace, Menlo, Consolas, monospace`;
    g.fillText(s, (i % cols) * C + C / 2, Math.floor(i / cols) * C + C / 2);
  });
  const t = new THREE.CanvasTexture(c);
  t.flipY = false; t.minFilter = THREE.LinearMipmapLinearFilter;
  return t;
}

// codeLetters (Nadav, 2026-10-27): in the hero the wordmark is built by the code layer (hero-a.js) and the cards
// stay out of the letters; they still carry the chapters below (site mode) and anchor the hero's screen peeks.
export async function createCloud(ctx, { cards, codeLetters = false }) {
  const { THREE, renderer, scene, U, geo, mobile, mask, rng, HALF_GLSL } = ctx;
  const W = geo.W, H = geo.H, r = rng(42);

  const FOV = 30, dist = H / 2 / Math.tan((FOV * Math.PI) / 360);
  const camera = new THREE.PerspectiveCamera(FOV, W / H, dist * 0.08, dist * 3);
  camera.position.set(0, 0, dist);

  // ---------- rest layout: portrait mini screens on the letterforms ----------
  const cw = Math.max(mobile ? 5.6 : 8, geo.size * 0.063), ch = cw * 2.05;
  const { x0, x1, y0, y1 } = mask.box;
  const rest = cells(x0, x1, y0, y1, cw, ch, mask.word);
  const n = rest.length;
  const depth = cw * 0.26;
  // balanced mix: every screen appears about equally often, never twice in a row
  const order = [];
  while (order.length < n) { const pass = cards.map((_, i) => i); for (let i = pass.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [pass[i], pass[j]] = [pass[j], pass[i]]; } order.push(...pass); }
  const blocks = rest.map((b, i) => {
    const R = [r(), r(), r(), r()];
    return {
      ...b, R, card: order[i], lift: 0, hidden: 0,
      delay: 0.35 + (1 - b.x / W) * 0.75 + R[0] * 0.35,
      from: { x: W / 2 + (R[1] - 0.5) * W * 1.15, y: H / 2 + (R[2] - 0.5) * H * 0.85, z: -dist * 0.55 + R[3] * dist * 0.75, rx: (R[2] - 0.5) * 1.6, ry: (R[3] - 0.5) * 2.2, rz: (R[1] - 0.5) * 0.8 },
    };
  });

  // ---------- cards: thin rounded glass slabs, the front face is the whole screen ----------
  const atlas = await atlasOf(THREE, cards);
  const box = new RoundedBoxGeometry(1, 1, 1, 2, 0.1);
  const mat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.14, metalness: 0, envMapIntensity: 1.6 });
  const uSide = { value: new THREE.Color(0x4a5058) };
  mat.onBeforeCompile = (sh) => {
    sh.uniforms.uScreens = { value: atlas };
    sh.uniforms.uSide = uSide;
    sh.vertexShader = sh.vertexShader
      .replace('#include <common>', '#include <common>\nattribute vec4 aUv;\nattribute float aGlow;\nvarying vec2 vTile;\nvarying float vFront;\nvarying float vGlow;')
      .replace('#include <uv_vertex>', '#include <uv_vertex>\nvTile = aUv.xy + vec2(uv.x, 1.0 - uv.y) * aUv.zw;\nvFront = step(0.5, normal.z);\nvGlow = aGlow;');
    sh.fragmentShader = sh.fragmentShader
      .replace('#include <common>', '#include <common>\nuniform sampler2D uScreens;\nuniform vec3 uSide;\nvarying vec2 vTile;\nvarying float vFront;\nvarying float vGlow;')
      .replace('#include <map_fragment>', 'vec3 scr = texture2D(uScreens, vTile).rgb;\ndiffuseColor.rgb = mix(uSide, scr * 0.35, vFront);')
      .replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\ntotalEmissiveRadiance += (scr * 1.02 + 0.02) * vFront * (1.0 + 0.55 * vGlow);');
  };
  const mesh = new THREE.InstancedMesh(box, mat, n);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  mesh.renderOrder = 2;
  const uvs = new Float32Array(n * 4);
  blocks.forEach((b, i) => { const c = b.card; uvs.set([((c % COLS) * CW + 1) / 2048, (Math.floor(c / COLS) * CH + 1) / 2048, (CW - 2) / 2048, (CH - 2) / 2048], i * 4); });
  box.setAttribute('aUv', new THREE.InstancedBufferAttribute(uvs, 4));
  const glow = new THREE.InstancedBufferAttribute(new Float32Array(n), 1); glow.setUsage(THREE.DynamicDrawUsage);
  box.setAttribute('aGlow', glow);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; pmrem.dispose();
  const prevEnv = scene.environment; scene.environment = env;
  const prev = { tm: renderer.toneMapping, exp: renderer.toneMappingExposure };
  renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  const group = new THREE.Group();
  const key = new THREE.DirectionalLight(0xfff4e6, 0.9); key.position.set(W * 0.3, H * 0.6, dist * 0.7);
  const rim = new THREE.DirectionalLight(0xe8913c, 0.6); rim.position.set(-W * 0.4, -H * 0.2, -dist * 0.3);
  group.add(key, rim, mesh);
  // review looks (css/looks.css): card edges and the two lights follow --lk-side / --lk-rim / --lk-key; unset = look A
  const lookTint = () => {
    const cs = getComputedStyle(document.documentElement), v = (n) => cs.getPropertyValue(n).trim();
    if (v('--lk-side')) uSide.value.set(v('--lk-side')); else uSide.value.setHex(0x4a5058);
    if (v('--lk-rim')) rim.color.set(v('--lk-rim')); else rim.color.setHex(0xe8913c);
    if (v('--lk-key')) key.color.set(v('--lk-key')); else key.color.setHex(0xfff4e6);
  };
  if (window.__look && window.__look.id !== 'a') { lookTint(); window.__look.ready.then(lookTint); }
  document.addEventListener('look:change', lookTint);
  matchMedia('(max-width: 600px)').addEventListener('change', lookTint); // B darkens --lk-side on phones

  // ---------- code flowing between the cards (behind them, inside the letters only) ----------
  const maskTex = new THREE.CanvasTexture(mask.canvas); maskTex.flipY = false; maskTex.minFilter = maskTex.magFilter = THREE.NearestFilter; maskTex.generateMipmaps = false;
  const gTex = glyphAtlas(THREE);
  const gs = Math.max(mobile ? 3.4 : 4.4, geo.size * 0.03);
  const T = [], GR = [], GI = [];
  for (let y = y0 + gs * 0.7; y < y1; y += gs * 1.25) {
    let any = false; for (let x = x0; x < x1; x += gs) if (mask.word(x, y) >= 0) { any = true; break; }
    if (!any) continue;
    for (let x = x0; x < x1; x += gs * 1.05) { if (r() < 0.62) { T.push(x, y); GR.push(r(), r(), r(), r()); GI.push(Math.floor(r() * GLYPHS.length)); } }
  }
  const ng = T.length / 2;
  const gg = new THREE.BufferGeometry();
  gg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ng * 3), 3));
  gg.setAttribute('aT', new THREE.BufferAttribute(new Float32Array(T), 2));
  gg.setAttribute('aR', new THREE.BufferAttribute(new Float32Array(GR), 4));
  gg.setAttribute('aG', new THREE.BufferAttribute(new Float32Array(GI), 1));
  const gm = new THREE.ShaderMaterial({
    uniforms: { ...U, uAtlas: { value: gTex }, uMask: { value: maskTex }, uSize: { value: gs * 1.6 }, uSpan: { value: x1 - x0 }, uX0: { value: x0 }, uN: { value: GLYPHS.length } },
    vertexShader: /* glsl */ `
      ${HALF_GLSL}
      uniform sampler2D uMask;
      uniform float uSize, uSpan, uX0, uN;
      uniform vec3 uInk, uAcc;
      attribute vec2 aT; attribute vec4 aR; attribute float aG;
      varying vec2 vCell; varying vec3 vCol; varying float vA;
      void main(){
        // a line of code typed right-to-left through the letters, wrapping inside the wordmark box
        float speed = 18.0 + aR.y * 30.0;
        float x = uX0 + mod(aT.x - uX0 - uTime * speed, uSpan);
        vec2 p = vec2(x, aT.y);
        vec4 m = texture2D(uMask, p / uRes);
        float inside = max(m.r, m.g);
        float h = m.g > m.r ? 1.0 : 0.0;
        // intro: the code arrives first, as a stream from the reading start
        float t = clamp((uIntro - (1.0 - aT.x / uRes.x) * 0.6 - aR.x * 0.3) / 0.7, 0.0, 1.0);
        p.x += (1.0 - (1.0 - pow(1.0 - t, 3.0))) * uRes.x * 0.35;
        vec2 q = halfX(p, h);
        gl_Position = clipOf(q);
        float epoch = floor(uTime * (0.6 + aR.z) + aR.x * 9.0);
        float g = floor(hash1(epoch * 7.3 + aR.w * 91.0) * uN);
        vCell = vec2(mod(g, 8.0), floor(g / 8.0));
        vCol = mix(uInk * 0.62, uAcc, step(0.82, aR.z));
        vA = inside * smoothstep(0.0, 0.3, t) * (0.55 + 0.45 * aR.w) * (1.0 - smoothstep(0.1, 0.6, uA));
        gl_PointSize = uSize * uDpr;
      }`,
    fragmentShader: /* glsl */ `
      uniform sampler2D uAtlas;
      varying vec2 vCell; varying vec3 vCol; varying float vA;
      void main(){
        float m = texture2D(uAtlas, (vCell + gl_PointCoord) / vec2(8.0, 6.0)).a;
        if (m * vA < 0.02) discard;
        gl_FragColor = vec4(vCol * m * vA, m * vA);
      }`,
    transparent: true, depthTest: false, depthWrite: false, premultipliedAlpha: true, toneMapped: false,
  });
  const code = new THREE.Points(gg, gm); code.renderOrder = 1; code.frustumCulled = false;
  code.visible = !codeLetters; // with codeLetters the denser hero-a layer writes the name instead
  group.add(code);

  // ---------- formShape ----------
  const shapes = {};
  const alias = { phone: 'phones' };
  function targetsFor(k) {
    if (k === 'wordmark') return null;
    if (!shapes[k]) {
      const inside = shapeMask(k, W, H);
      let s = cw, t = cells(0, W, 0, H, s, s * 2.05, inside);
      while (t.length > n && s < cw * 4) { s *= 1.08; t = cells(0, W, 0, H, s, s * 2.05, inside); }
      shapes[k] = t.slice(0, n);
    }
    return shapes[k];
  }
  let form = { key: 'wordmark', from: null, to: null, t: 1, dur: 1.6 };
  function formShape(k0, { duration = 1.7 } = {}) {
    const k = alias[k0] || k0;
    const snap = blocks.map((b) => ({ x: b.cx ?? b.x, y: b.cy ?? b.y, z: b.cz ?? 0, w: b.cw ?? b.w, h: b.ch ?? b.h }));
    form = { key: k, from: snap, to: targetsFor(k), t: 0, dur: duration };
    blocks.forEach((b, i) => { b.formDelay = (i / n) * 0.35 + b.R[1] * 0.2; });
    return new Promise((res) => { form.done = res; });
  }

  // ---------- per frame ----------
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), pos = new THREE.Vector3(), scl = new THREE.Vector3(), v3 = new THREE.Vector3();
  const halfW = Math.max(1, (x1 - x0) / 2);
  // ---------- site mode: after the hero, the same cards carry the story between chapters ----------
  // window.__siteCloud (js/transit.js) names the active scene: a list of docks, each with a scroll
  // progress p (0..1) and either a DOM rect to tile (the cards build that screen, then flip away
  // as the real DOM screen appears under them) or a shape key (the cards form it, then burst).
  // Pure function of p: scrolling back plays it backwards.
  const P0 = {}, P1 = {}, P2 = {};
  const pose = (o, x, y, z, w, h, rx, ry, rz, s) => { o.x = x; o.y = y; o.z = z; o.w = w; o.h = h; o.rx = rx; o.ry = ry; o.rz = rz; o.s = s; return o; };
  const mixP = (A, B, k, o) => pose(o, A.x + (B.x - A.x) * k, A.y + (B.y - A.y) * k, A.z + (B.z - A.z) * k, A.w + (B.w - A.w) * k, A.h + (B.h - A.h) * k,
    A.rx + (B.rx - A.rx) * k, A.ry + (B.ry - A.ry) * k, A.rz + (B.rz - A.rz) * k, A.s + (B.s - A.s) * k);
  function grid(d, m) {
    const r = d.rect; if (!r || r.w < 2) return null;
    const s0 = Math.sqrt((r.w * r.h) / (Math.max(1, m) * 2.05));
    const cols = Math.max(1, Math.floor(r.w / s0)), rows = Math.max(1, Math.floor(r.h / (s0 * 2.05)));
    return { r, cols, rows, cw: r.w / cols, ch: r.h / rows };
  }
  const mobileish = W < 720;
  function siteUpdate(dt, S) {
    const time = U.uTime.value, G = window.__wmGeo, sc = S.scene();
    const docks = sc ? sc.docks : null, nd = docks ? docks.length : 1;
    const grids = docks ? docks.map((d) => (d.shape ? null : grid(d, Math.ceil(n / nd)))) : null;
    // the globe gathers over the screens it is about to build, so the chapter title stays clear
    let gcx = W / 2, gcy = H / 2;
    if (grids && grids.some(Boolean)) {
      let sx = 0, sy = 0, k = 0;
      grids.forEach((gd) => { if (gd) { sx += gd.r.x + gd.r.w / 2; sy += gd.r.y + gd.r.h / 2; k++; } });
      gcx = sx / k; gcy = Math.min(H * 0.72, Math.max(H * 0.4, sy / k));
    }
    for (let i = 0; i < n; i++) {
      const b = blocks[i], R = b.R;
      if (!docks) { m4.makeScale(0, 0, 0); mesh.setMatrixAt(i, m4); glow.array[i] = 0; continue; }
      const di = i % nd, d = docks[di], li = Math.floor(i / nd), gd = grids[di];
      const u = Math.min(1, Math.max(0, d.p * 1.25 - R[0] * 0.25));
      // from: where the cards were (the hero's split edges) or below the fold
      if (d.from === 'off' && G) {
        const left = G.words[b.half].left;
        pose(P0, b.x + (left ? -(G.gx + cw * 6 + R[1] * W * 0.2) : (W - G.gx + cw * 6 + R[1] * W * 0.2)), b.y + (R[2] - 0.5) * H * 0.3, cw * 8 * R[1], b.w, b.h, (R[2] - 0.5), (left ? -1 : 1) * 0.8, 0, 1);
      } else {
        pose(P0, W * (0.06 + 0.88 * R[0]), H + ch * 3 + R[2] * H * 0.35, R[3] * cw * 12, b.w, b.h, (R[1] - 0.5) * 2, (R[2] - 0.5) * 2, (R[3] - 0.5), 1);
      }
      // the construct: a slowly turning globe of real screens (Fibonacci sphere), facing outward
      const phi = Math.acos(1 - (2 * (i + 0.5)) / n), th = Math.PI * (1 + Math.sqrt(5)) * i;
      const vx = Math.sin(phi) * Math.cos(th), vy = Math.cos(phi), vz = Math.sin(phi) * Math.sin(th);
      const ra = time * 0.22 + d.p * 2.4, ca = Math.cos(ra), sa = Math.sin(ra);
      const gx = vx * ca + vz * sa, gz = -vx * sa + vz * ca, Rs = Math.min(W, H) * (mobileish ? 0.36 : 0.3), sw = Math.max(1.4, Rs * 0.011);
      pose(P1, gcx + gx * Rs, gcy - vy * Rs, gz * Rs, b.w * sw, b.h * sw, Math.asin(vy) * 0.9, Math.atan2(gx, gz), 0, 1);
      // target
      let gone = false;
      if (d.shape) {
        const t = targetsFor(d.shape)[li];
        if (t) pose(P2, t.x, t.y, 0, t.w, t.h, 0, 0, 0, 1); else { gone = true; pose(P2, P1.x, P1.y, P1.z, P1.w, P1.h, 0, 0, 0, 0); }
      } else if (gd) {
        const { r, cols, rows } = gd;
        if (li < cols * rows) {
          const c = li % cols, rr = Math.floor(li / cols);
          pose(P2, r.x + r.w - (c + 0.5) * gd.cw, r.y + (rr + 0.5) * gd.ch, 0, gd.cw / 0.88 * 0.97, gd.ch / 0.9 * 0.97, 0, 0, 0, 1);
        } else { gone = true; pose(P2, r.x + r.w / 2, r.y + r.h / 2, 0, b.w, b.h, 0, 0, 0, 0); }
      } else { gone = true; pose(P2, P1.x, P1.y, P1.z, P1.w, P1.h, 0, 0, 0, 0); }
      let o;
      if (d.direct && u < 0.84) {
        // straight in from the side edges at the target's own height: never across the copy above it
        P0.y = P2.y + (R[2] - 0.5) * 30; P0.z = cw * 4 * R[1];
        const k = easeInOut(u / 0.84);
        o = mixP(P0, P2, k, P0); o.z += Math.sin(Math.PI * k) * cw * 4;
        if (gone) o.s = 1 - k;
      } else if (u < 0.42) o = mixP(P0, P1, easeInOut(u / 0.42), P0);
      else if (u < 0.84) {
        const k = easeInOut((u - 0.42) / 0.42);
        o = mixP(P1, P2, k, P1); o.z += Math.sin(Math.PI * k) * cw * (gone ? 2 : 10);
        if (gone) o.s = 1 - k;
      } else {
        o = P2; const r = smooth(0.84, 1, u);
        if (d.shape) { o.z += r * dist * 0.35 * (0.5 + R[1]); o.x += (o.x - W / 2) * r * 0.6; o.y += (o.y - H / 2) * r * 0.6; o.rx += r * (R[2] - 0.5) * 3; o.ry += r * (R[3] - 0.5) * 3; o.s *= 1 - r * r; }
        else { o.ry = r * Math.PI * 0.5 * (R[2] > 0.5 ? 1 : -1); o.s *= 1 - smooth(0.4, 1, r); o.z = r * cw * 2; }
      }
      pos.set(o.x - W / 2, H / 2 - o.y, o.z);
      e.set(o.rx, o.ry, o.rz); q.setFromEuler(e);
      scl.set(Math.max(1e-4, o.w * 0.88 * o.s), Math.max(1e-4, o.h * 0.9 * o.s), Math.max(1e-4, depth * o.s));
      m4.compose(pos, q, scl);
      mesh.setMatrixAt(i, m4);
      glow.array[i] = d.shape ? 0.4 : 0.15;
      b.cx = o.x; b.cy = o.y; b.cz = o.z;
    }
    mesh.instanceMatrix.needsUpdate = true; glow.needsUpdate = true;
  }

  let wasQuiet = false;
  function update(dt) {
    const SC = window.__siteCloud;
    if (SC && SC.on) { wasQuiet = false; siteUpdate(dt, SC); return; }
    const G = window.__wmGeo, words = G.words, intro = U.uIntro.value, a = G.a, time = U.uTime.value, P = U.uPtr.value;
    if (form.t < 1) { form.t = Math.min(1, form.t + dt / form.dur); if (form.t >= 1) form.done?.(); }
    // during the cloud phase the whole cloud parallaxes with the pointer (depth), then settles
    const cloudness = 1 - smooth(1.4, 2.8, intro);
    for (let i = 0; i < n; i++) {
      const b = blocks[i], R = b.R;
      let x = b.x, y = b.y, z = 0, w = b.w, h = b.h, rx = 0, ry = 0, rz = 0, s = 1, gl = 0;
      // intro: a soft 3D cloud drifts, then each card locks into its slot (reading start first)
      const t = Math.min(1, Math.max(0, (intro - b.delay) / 1.2));
      if (t < 1) {
        const f = b.from, k = easeOutExpo(t);
        const drift = intro * 0.6;
        const fx = f.x + Math.sin(drift + R[0] * 9) * 18 + (P.x - W / 2) * 0.02 * (f.z / dist), fy = f.y + Math.cos(drift * 0.8 + R[1] * 7) * 14;
        x = fx + (b.x - fx) * k; y = fy + (b.y - fy) * k; z = f.z * (1 - k);
        rx = f.rx * (1 - k); ry = f.ry * (1 - k); rz = f.rz * (1 - k);
        s = Math.min(1, intro / 0.5) * (0.7 + 0.3 * k);
      }
      // breathing + pointer: nearby cards lift and turn their face toward the cursor
      if (intro > 2.2) { z += Math.sin(time * 0.8 + R[0] * 12) * cw * 0.18; rx += Math.sin(time * 0.6 + R[2] * 9) * 0.03; }
      const dx = x - P.x, dy = y - P.y, dd = Math.hypot(dx, dy);
      const pf = P.z * smooth(170, 0, dd);
      b.lift += (pf - b.lift) * (1 - Math.exp(-dt * 8));
      z += b.lift * cw * 2.4; ry += -b.lift * (dx / (dd + 1)) * 0.75; rx += -b.lift * (dy / (dd + 1)) * 0.75;
      gl = b.lift;
      // the split: cards near the seam peel first, turn and drift out toward the portal edges
      const sd = Math.abs(x - G.gx) / halfW;
      const L = smooth(sd * 0.35 + R[0] * 0.12, sd * 0.35 + R[0] * 0.12 + 0.45, a);
      if (L > 0) {
        const dir = words[b.half].left ? -1 : 1;
        ry += L * dir * (0.6 + R[2] * 0.9); rz += (R[1] - 0.5) * L * 0.8; rx += (R[3] - 0.5) * L * 0.6;
        z += L * cw * (4 + R[1] * 10); x += dir * L * cw * (1 + R[3] * 4); y += (R[2] - 0.5) * L * ch * 2;
      }
      let useHalf = form.key === 'wordmark';
      if (form.from && (form.t < 1 || form.key !== 'wordmark')) {
        const tgt = form.to ? form.to[i] : { x: b.x, y: b.y, w: b.w, h: b.h };
        const ft = Math.min(1, Math.max(0, (form.t * 1.55 - b.formDelay)));
        const k = easeInOut(ft), lift = Math.sin(Math.PI * ft), f = form.from[i];
        const tx = tgt ? tgt.x : W / 2 + (R[0] - 0.5) * W * 0.3, ty = tgt ? tgt.y : H * 1.3;
        x = f.x + (tx - f.x) * k; y = f.y + (ty - f.y) * k; z = f.z * (1 - k) + lift * cw * 9;
        w = f.w + ((tgt?.w ?? b.w) - f.w) * k; h = f.h + ((tgt?.h ?? b.h) - f.h) * k;
        rx = lift * (R[1] - 0.5) * 2; ry = lift * (R[2] - 0.5) * 2;
        if (!tgt) s *= 1 - k;
        useHalf = false;
      }
      if (useHalf) {
        const o = words[b.half], g = G.grow;
        x = o.ox + (x - o.ox) * g + G.tx[b.half]; y = o.oy + (y - o.oy) * g; s *= g;
      }
      b.hidden += ((b.hide ? 1 : 0) - b.hidden) * (b.hide ? 1 : 1 - Math.exp(-dt * 10));
      s *= 1 - b.hidden;
      if (codeLetters && useHalf) s = 0; // the card keeps its slot (peek anchor) but is not drawn in the name
      b.cx = x; b.cy = y; b.cz = z; b.cw = w * s; b.ch = h * s;
      pos.set(x - W / 2, H / 2 - y, z);
      e.set(rx, ry, rz); q.setFromEuler(e);
      scl.set(w * 0.88 * s, h * 0.9 * s, depth * s);
      m4.compose(pos, q, scl);
      mesh.setMatrixAt(i, m4);
      glow.array[i] = gl;
    }
    const quiet = codeLetters && form.key === 'wordmark' && !(form.from && form.t < 1);
    if (!quiet || !wasQuiet) { mesh.instanceMatrix.needsUpdate = true; glow.needsUpdate = true; }
    wasQuiet = quiet;
  }

  function rectOf(i) {
    const b = blocks[i];
    if (b.cx == null) return { x: b.x - b.w / 2, y: b.y - b.h / 2, w: b.w, h: b.h };
    v3.set(b.cx - W / 2, H / 2 - b.cy, b.cz).project(camera);
    const k = dist / Math.max(1, dist - b.cz);
    const cx = (v3.x * 0.5 + 0.5) * W, cy = (-v3.y * 0.5 + 0.5) * H, w = b.w * 0.88 * k, h = b.h * 0.9 * k;
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }
  function hit(px, py) {
    let best = -1, bd = Infinity;
    for (let i = 0; i < n; i++) {
      const b = blocks[i]; if (b.cx == null || b.hide) continue;
      const dx = Math.abs(px - b.cx), dy = Math.abs(py - b.cy);
      if (dx < b.w * 0.5 && dy < b.h * 0.5) { const d = dx + dy; if (d < bd) { bd = d; best = i; } }
    }
    return best;
  }
  const slotsOf = (cardIdx) => blocks.map((b, i) => (b.card === cardIdx ? i : -1)).filter((i) => i >= 0);

  try { await renderer.compileAsync(group, camera, scene); renderer.initTexture(atlas); } catch { /* older three: compiles on first draw */ }
  scene.add(group);
  return {
    objects: [], camera, count: n, update, formShape, rectOf, hit, slotsOf, blocks,
    hide(i) { blocks[i].hide = true; }, show(i) { blocks[i].hide = false; },
    restore() { atlas.needsUpdate = true; gTex.needsUpdate = true; maskTex.needsUpdate = true; },
    dispose() {
      scene.remove(group); scene.environment = prevEnv; renderer.toneMapping = prev.tm; renderer.toneMappingExposure = prev.exp;
      box.dispose(); mat.dispose(); env.dispose(); atlas.dispose(); gg.dispose(); gm.dispose(); gTex.dispose(); maskTex.dispose(); mesh.dispose?.();
    },
  };
}
