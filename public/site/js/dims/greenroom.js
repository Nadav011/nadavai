// dims/greenroom.js: Green Room's dimension (2026-10-28). Nadav, on the flat shader world: "not at all a complete
// dimension of each app". So this page is a place: a snooker hall at night, built as real geometry (tables with felt,
// polished wood and pockets, canopy lamps with their light, balls, a cue, dust in the beams, a neon sign), plus the
// lobby with the empty desk and the door that opens with a code. The app's real screens are physical phone cards in it.
// The scroll flies one camera along a spline; each chapter of the page is its own formation of the cards, and every
// chapter boundary is a cue strike: a flash at the contact point, a gold ring, a radial rush, and the lamps swing.
//
//   hero       low over a table's felt, between the balls, toward the lit table: the phones hang over it as its lamps
//   problem    (story 01) the lobby at 03:07: the desk is empty, the hall goes dark, the phones lie scattered
//   built      (story 02) the booking flow: the keypad lights up digit by digit, the door opens, the hall lamps come on
//   today      (story 03) the phones line up along the table's rail: live, in order
//   screens    a wide shot of the hall, a phone over every table like a status light (calm behind the gallery)
//   game       straight down on the table, as in the game below it
//   tech       the phones rack up in a triangle, like the reds
//   cta        the break: the cue strikes, the cue ball hits the rack and the phones scatter into the room
//
// The DOM stays the page: text on the reading side (RTL, right) over a soft scrim, transparent sections, every control
// as it was. Started from work-pages.js on this page only; it returns false (and the page keeps its shader world and
// poster phone) under reduced motion, without WebGL2, on software GL, or when three cannot load.

const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };

// the page's lifecycle guards (ported from dims/core.js and hero/kit/lifecycle.js)
const LOAD_MS = 8000;      // three, the addons and the screens: past this the page keeps its own world
const PX_BUDGET = 8.3e6;   // device pixels per frame at most, so a large screen never allocates 4K-sized targets
const calmNow = () => { let c = null; try { c = localStorage.getItem('nadavai.calm'); } catch { /* private mode */ } return c === '1' || (c !== '0' && matchMedia('(prefers-reduced-motion: reduce)').matches); };
function disposeScene(root) {   // unique geometries, materials, textures (uniforms too), instanced buffers
  const geos = new Set(), mats = new Set(), texs = new Set();
  root.traverse((o) => {
    if (o.geometry) geos.add(o.geometry);
    for (const m of Array.isArray(o.material) ? o.material : o.material ? [o.material] : []) {
      mats.add(m);
      for (const k in m) { const v = m[k]; if (v && v.isTexture) texs.add(v); }
      if (m.uniforms) for (const u of Object.values(m.uniforms)) if (u?.value?.isTexture) texs.add(u.value);
    }
    if (o.isInstancedMesh) o.dispose?.();
  });
  for (const g of geos) g.dispose();
  for (const m of mats) m.dispose();
  for (const t of texs) t.dispose();
}

const SHOTS = ['home', 'book', 'food', 'help'].map((n) => `/site/assets/work/greenroom-${n}.webp`)
  .concat(['offer', 'room', 'food'].map((n) => `/site/assets/work/social-gr-${n}.webp`));
const GOLD = [0xe4 / 255, 0xc5 / 255, 0x7e / 255];  // the app's light, #E4C57E
const CARD_W = 0.46, CARD_H = 0.997, CARD_R = 0.055; // a phone card in metres (the screenshots are 540 × 1170)

// a snooker table, long axis along z, baulk end toward +z
const TL = 3.57, TW = 1.78, FELT = 0.86, RAIL = 0.905, BALL = 0.02625;
const LAMP_Y = 1.87;                                   // the canopy's underside
// M (the lit table) at the origin, N (the near one the camera starts on) behind it, then the rest of the hall
const TABLES_ALL = [[0, 0], [0, 6.2], [-4.6, 0], [-4.6, 6.2], [-4.6, -6.2], [0, -6.2]];
const WALL_X = 7;                                     // the wall between the hall and the lobby, the door in it at z = 0
const DESK = { x: 10.6, z: 1.0, len: 2.4, top: 1.06 };
const DOOR = { w: 1.0, h: 2.15 };
const CODE = ['2', '4', '0', '7'];

// the camera's chapters: position, target, vertical fov (for a 16:10 screen), roll; pp / tp override on portrait screens
const CAMK = [
  { pos: [0.15, 1.08, 7.6], tgt: [0, 1.62, -0.6], fov: 40, roll: 0, pp: [0.15, 1.12, 8.4], tp: [0, 1.9, -0.6] },  // hero, over N's felt
  { pos: [8.5, 2.25, 4.3], tgt: [10.6, 1.0, 0.7], fov: 46, roll: 0, pp: [8.0, 3.0, 5.8], tp: [10.4, 0.8, 0.8] },  // problem, the desk
  { pos: [10.4, 1.5, 0.75], tgt: [7, 1.3, 0.3], fov: 44, roll: 0, pp: [11.4, 1.55, 0.5], tp: [7, 1.45, 0.45] },    // built, the door
  { pos: [2.45, 1.3, 3.0], tgt: [0.5, 0.98, -0.6], fov: 40, roll: 0, pp: [2.9, 1.65, 3.9], tp: [0.6, 0.95, -0.3] }, // today, the rail
  { pos: [6.0, 3.7, 8.4], tgt: [-2.4, 1.4, -2.2], fov: 46, roll: 0, pp: [6.2, 5.0, 10.5], tp: [-2.0, 1.4, -2.0] },  // screens, the hall
  { pos: [0, 6.0, 0.02], tgt: [0, FELT, 0], fov: 46, roll: Math.PI / 2, pp: [0, 7.6, 0.02], tp: [0, FELT, 0], pr: 0 }, // game, from above
  { pos: [0, 2.6, 2.3], tgt: [0, FELT, -0.15], fov: 46, roll: 0, sx: 0.5, pp: [0, 3.0, 2.3], tp: [0, FELT, -0.1] }, // tech, the rack
  { pos: [2.6, 2.1, 4.2], tgt: [-0.4, 1.9, -1.0], fov: 52, roll: 0, sx: 0.12, sy: -0.36, pp: [3.2, 2.6, 6.2], tp: [-0.3, 2.1, -1.0] }, // cta, the break
];
const VIA = [ // the flight between chapters: [pos, target] halfway from chapter c to c + 1
  [[5.6, 2.7, 7.6], [10.5, 1.2, 2.8]],
  [[9.9, 2.0, 2.9], [8.0, 1.25, 0.5]],
  [[6.2, 1.45, 0.08], [0.5, 1.05, 0.2]],
  [[4.6, 2.5, 6.2], [-0.8, 1.3, -0.8]],
  [[2.4, 5.2, 2.8], [0, 0.9, 0.2]],
  [[0, 4.0, 1.9], [0, FELT, -0.4]],
  [[0.85, 1.6, 2.45], [0, 0.95, 0.35]],
];
// what each chapter looks at, for the strike's contact point
const FOCUS = [[0, 1.9, 0], [10.5, 1.1, 1.0], [7, 1.3, 0.4], [0.9, 1.1, 0], [-1.5, 2.2, -1], [0, FELT, 0], [0, FELT, 0.2], [0, FELT, 0.9]];
// where each chapter sits in the page: the scroll position at which the camera holds that formation
const ANCHORS = [
  () => 0,
  (vh) => mid('.wks__item:nth-child(1)', vh),
  (vh) => mid('.wks__item:nth-child(2)', vh),
  (vh) => mid('.wks__item:nth-child(3)', vh),
  (vh) => mid('.wkg .wk-head', vh),
  (vh) => mid('.wkx__stage', vh),
  (vh) => mid('.wkt', vh),
  (vh, max) => Math.min(max, mid('.wkn__grid', vh)),
];
function mid(sel, vh) { const el = document.querySelector(sel); if (!el) return 0; const r = el.getBoundingClientRect(); return r.top + scrollY + r.height / 2 - vh / 2; }

function probeGL() {
  try {
    const c = document.createElement('canvas');
    const gl = c.getContext('webgl2');
    if (!gl) return false;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const name = String((ext && gl.getParameter(ext.UNMASKED_RENDERER_WEBGL)) || gl.getParameter(gl.RENDERER) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return !/swiftshader|llvmpipe|softpipe|lavapipe|software|basic render/i.test(name);
  } catch { return false; }
}

export async function initDim({ lenis = null, reduce = false, onLost = null } = {}) {
  const root = document.documentElement;
  if (reduce || root.classList.contains('reduce') || !probeGL()) return false;
  // the phones are the app now: the hero's poster phone (and its own WebGL phone) step aside, but only once the hall draws
  const stage = document.querySelector('.wkh__stage');
  const parent = stage?.parentNode, next = stage?.nextSibling;
  const back = () => {
    root.classList.remove('dim-greenroom', 'dim-greenroom-ready');
    document.querySelector('.gdim')?.remove();
    if (stage && parent && !stage.isConnected) parent.insertBefore(stage, next);
  };
  root.classList.add('dim-greenroom');
  let timer = 0;
  const late = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`not loaded in ${LOAD_MS / 1000} s`)), LOAD_MS); });
  const loaded = (p) => Promise.race([p, late]);
  try {
    const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }, { mergeGeometries }] = await loaded(Promise.all([
      import('three'),
      import('three/addons/postprocessing/EffectComposer.js'),
      import('three/addons/postprocessing/RenderPass.js'),
      import('three/addons/postprocessing/UnrealBloomPass.js'),
      import('three/addons/postprocessing/ShaderPass.js'),
      import('three/addons/postprocessing/OutputPass.js'),
      import('three/addons/utils/BufferGeometryUtils.js'),
    ]));
    await build(THREE, { EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass, mergeGeometries }, { lenis, loaded, onLost: () => { back(); onLost?.(); } });
    stage?.remove();
    return true;
  } catch (e) {
    console.warn('[dim] the snooker hall is off, the page keeps its shader world', e);
    back();
    return false;
  } finally { clearTimeout(timer); }
}

/* ── textures drawn on a canvas ─────────────────────────────── */
function canvasTex(THREE, w, h, draw, { srgb = true, repeat = false, aniso = 8 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = aniso;
  return t;
}
const rr = (g, x, y, w, h, r) => { g.beginPath(); g.roundRect(x, y, w, h, r); };

function drawFelt(g, W, H) {                    // W across the table (x), H along it (z), the far end at the top
  g.fillStyle = '#0a5a2d'; g.fillRect(0, 0, W, H);
  const glow = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, H * 0.62);
  glow.addColorStop(0, 'rgba(60,170,90,.18)'); glow.addColorStop(1, 'rgba(0,20,8,.32)');
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 52000; i++) {             // the nap: short fibres, mostly along the table
    const x = Math.random() * W, y = Math.random() * H, l = Math.random();
    g.fillStyle = l > 0.5 ? `rgba(110,200,130,${0.03 + l * 0.05})` : `rgba(0,30,10,${0.05 + l * 0.08})`;
    g.fillRect(x, y, 1, 1 + Math.random() * 3);
  }
  const s = H / TL, by = H - 0.737 * s;         // the baulk line, the D and the spots, in chalk
  g.strokeStyle = 'rgba(235,240,225,.55)'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(0, by); g.lineTo(W, by); g.stroke();
  g.beginPath(); g.arc(W / 2, by, 0.292 * s, 0, Math.PI); g.stroke();
  g.fillStyle = 'rgba(235,240,225,.6)';
  for (const [dx, z] of [[0, TL / 2], [0, TL / 4], [0, 0.324]]) { g.beginPath(); g.arc(W / 2 + dx * s, z * s, 3, 0, TAU); g.fill(); }
}
function drawWood(g, W, H) {                    // mahogany, the grain along u
  const base = g.createLinearGradient(0, 0, 0, H);
  base.addColorStop(0, '#3c1a0c'); base.addColorStop(0.5, '#4a2210'); base.addColorStop(1, '#341508');
  g.fillStyle = base; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 260; i++) {
    const y0 = Math.random() * H, a = 1 + Math.random() * 6, f = 0.002 + Math.random() * 0.01, ph = Math.random() * TAU;
    g.strokeStyle = Math.random() > 0.5 ? `rgba(110,48,18,${0.08 + Math.random() * 0.18})` : `rgba(15,5,2,${0.1 + Math.random() * 0.25})`;
    g.lineWidth = 0.6 + Math.random() * 2.2;
    g.beginPath();
    for (let x = 0; x <= W; x += 16) { const y = y0 + Math.sin(x * f + ph) * a + Math.sin(x * f * 3.1 + ph) * a * 0.3; x ? g.lineTo(x, y) : g.moveTo(x, y); }
    g.stroke();
  }
}
function drawFloor(g, W, H) {                   // dark planks, 8 m of floor in the tile
  const pw = W / 44;                            // 0.18 m planks
  for (let i = 0; i < 44; i++) {
    let y = -Math.random() * H;
    while (y < H) {
      const len = H * (0.18 + Math.random() * 0.3), l = 16 + Math.random() * 12;
      g.fillStyle = `hsl(${22 + Math.random() * 8},${34 + Math.random() * 12}%,${l * 0.55}%)`;
      g.fillRect(i * pw, y, pw, len);
      for (let k = 0; k < 7; k++) {
        g.strokeStyle = `rgba(0,0,0,${0.06 + Math.random() * 0.12})`; g.lineWidth = 1;
        const x = i * pw + Math.random() * pw;
        g.beginPath(); g.moveTo(x, y); g.bezierCurveTo(x + 3, y + len * 0.3, x - 3, y + len * 0.6, x + Math.random() * 4 - 2, y + len); g.stroke();
      }
      g.fillStyle = 'rgba(0,0,0,.55)'; g.fillRect(i * pw, y, pw, 2);
      y += len;
    }
    g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(i * pw, 0, 1.5, H);
  }
}
function drawWall(g, W, H) {                    // 4 m wide, 4.6 m high: deep green above a wood wainscot
  const s = H / 4.6, wy = H - 1.05 * s;
  const up = g.createLinearGradient(0, 0, 0, wy);
  up.addColorStop(0, '#07110c'); up.addColorStop(1, '#10241a');
  g.fillStyle = up; g.fillRect(0, 0, W, wy);
  for (let x = 0; x < W; x += 6) { g.fillStyle = `rgba(255,255,255,${0.008 + Math.random() * 0.012})`; g.fillRect(x, 0, 2, wy); }
  drawWood(g, W, H);                            // grain over everything, then the green back on top
  g.globalCompositeOperation = 'source-over';
  g.fillStyle = up; g.globalAlpha = 0.93; g.fillRect(0, 0, W, wy); g.globalAlpha = 1;
  g.fillStyle = '#2a1408'; g.fillRect(0, wy - 6, W, 10);                         // the dado rail
  g.fillStyle = 'rgba(228,197,126,.25)'; g.fillRect(0, wy - 7, W, 1.5);
  for (let x = 12; x < W; x += W / 4) { g.strokeStyle = 'rgba(0,0,0,.4)'; g.lineWidth = 3; g.strokeRect(x, wy + 18, W / 4 - 24, H - wy - 40); }
  g.fillStyle = '#120804'; g.fillRect(0, H - 0.12 * s, W, 0.12 * s);              // skirting
}
function drawNeon(g, W, H, text, sub, col) {
  g.clearRect(0, 0, W, H);
  g.textAlign = 'center'; g.textBaseline = 'middle';
  let fs = Math.round(H * (sub ? 0.5 : 0.62));
  try { g.fontStretch = 'expanded'; } catch { /* older canvas */ }
  g.font = `800 ${fs}px Archivo, Rubik, sans-serif`;
  const tw = g.measureText(text).width;
  if (tw > W * 0.86) { fs = Math.floor(fs * (W * 0.86) / tw); g.font = `800 ${fs}px Archivo, Rubik, sans-serif`; }
  for (const [blur, a, lw] of [[H * 0.18, 0.55, 10], [H * 0.06, 0.9, 6], [0, 1, 2.2]]) {
    g.shadowColor = col; g.shadowBlur = blur; g.strokeStyle = blur ? col : '#fffbe8'; g.globalAlpha = a; g.lineWidth = lw;
    g.strokeText(text, W / 2, sub ? H * 0.4 : H / 2);
  }
  g.globalAlpha = 0.35; g.fillStyle = col; g.fillText(text, W / 2, sub ? H * 0.4 : H / 2);
  if (sub) {
    g.font = `600 ${Math.round(H * 0.16)}px Archivo, Rubik, sans-serif`;
    g.globalAlpha = 1; g.shadowBlur = H * 0.08; g.shadowColor = '#E4C57E'; g.fillStyle = '#f5e2b0';
    g.fillText(sub, W / 2, H * 0.84);
    g.fillRect(W * 0.18, H * 0.71, W * 0.64, 3);
  }
  g.globalAlpha = 1; g.shadowBlur = 0;
}
function drawKeypad(g, W, H, st) {             // st: { lit: key or '', n: digits entered, open }
  g.clearRect(0, 0, W, H);
  const bg = g.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#26292c'); bg.addColorStop(1, '#0d0e10');
  rr(g, 4, 4, W - 8, H - 8, 26); g.fillStyle = bg; g.fill();
  g.strokeStyle = 'rgba(228,197,126,.45)'; g.lineWidth = 3; g.stroke();
  // the display
  rr(g, 34, 34, W - 68, 92, 12); g.fillStyle = '#030404'; g.fill();
  g.textAlign = 'center'; g.textBaseline = 'middle';
  if (st.open) {
    g.shadowColor = '#7CFFB2'; g.shadowBlur = 24; g.fillStyle = '#b8ffd6'; g.font = '700 50px Archivo, Rubik, sans-serif';
    g.fillText('OPEN', W / 2, 82);
  } else {
    g.shadowColor = '#E4C57E'; g.shadowBlur = 18; g.fillStyle = '#ffe9b5';
    for (let i = 0; i < 4; i++) { const x = W / 2 + (i - 1.5) * 52; g.beginPath(); g.arc(x, 80, i < st.n ? 13 : 5, 0, TAU); g.globalAlpha = i < st.n ? 1 : 0.35; g.fill(); }
    g.globalAlpha = 1;
  }
  g.shadowBlur = 0;
  const keys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'];
  const kw = (W - 68 - 2 * 20) / 3, kh = 74, y0 = 150;
  keys.forEach((k, i) => {
    const x = 34 + (i % 3) * (kw + 20), y = y0 + Math.floor(i / 3) * (kh + 18);
    const on = st.lit === k;
    rr(g, x, y, kw, kh, 14);
    if (on) { g.shadowColor = '#E4C57E'; g.shadowBlur = 36; g.fillStyle = '#ffe2a0'; g.fill(); g.shadowBlur = 0; }
    else { const kg = g.createLinearGradient(0, y, 0, y + kh); kg.addColorStop(0, '#2d3034'); kg.addColorStop(1, '#17191b'); g.fillStyle = kg; g.fill(); g.strokeStyle = 'rgba(255,255,255,.09)'; g.lineWidth = 2; g.stroke(); }
    g.fillStyle = on ? '#2a1d05' : 'rgba(240,232,214,.82)'; g.font = '600 38px Archivo, Rubik, sans-serif';
    g.fillText(k, x + kw / 2, y + kh / 2 + 2);
  });
  // the lock's LED and the mark
  g.beginPath(); g.arc(W / 2, H - 46, 11, 0, TAU);
  g.shadowColor = st.open ? '#3dff9a' : '#ff4a3a'; g.shadowBlur = 22; g.fillStyle = st.open ? '#9dffc8' : '#ff8a6e'; g.fill(); g.shadowBlur = 0;
  g.fillStyle = 'rgba(228,197,126,.7)'; g.font = '600 18px Archivo, Rubik, sans-serif'; g.fillText('GREEN ROOM', W / 2, H - 82);
}
function drawDoor(g, W, H) {                    // 1.0 × 2.15 m, a dark lacquered door with two panels and a brass plate
  drawWood(g, W, H);
  g.fillStyle = 'rgba(8,3,1,.55)'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(0,0,0,.55)'; g.lineWidth = 8;
  g.strokeRect(W * 0.14, H * 0.07, W * 0.72, H * 0.4); g.strokeRect(W * 0.14, H * 0.53, W * 0.72, H * 0.4);
  g.strokeStyle = 'rgba(228,197,126,.22)'; g.lineWidth = 2;
  g.strokeRect(W * 0.14 + 6, H * 0.07 + 6, W * 0.72 - 12, H * 0.4 - 12); g.strokeRect(W * 0.14 + 6, H * 0.53 + 6, W * 0.72 - 12, H * 0.4 - 12);
  rr(g, W * 0.3, H * 0.245, W * 0.4, H * 0.045, 6); g.fillStyle = '#b8954f'; g.fill();
  g.fillStyle = '#2a1d07'; g.font = `700 ${Math.round(H * 0.026)}px Archivo, Rubik, sans-serif`; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.fillText('VIP', W / 2, H * 0.268);
}
function drawClock(g, W, H) {                   // 03:07
  g.clearRect(0, 0, W, H);
  g.beginPath(); g.arc(W / 2, H / 2, W * 0.47, 0, TAU); g.fillStyle = '#d9d4c6'; g.fill();
  g.lineWidth = W * 0.035; g.strokeStyle = '#1b1b1b'; g.stroke();
  g.fillStyle = '#1b1b1b';
  for (let i = 0; i < 12; i++) { const a = (i / 12) * TAU; g.save(); g.translate(W / 2, H / 2); g.rotate(a); g.fillRect(-3, -W * 0.42, 6, W * 0.06); g.restore(); }
  const hand = (a, l, w) => { g.save(); g.translate(W / 2, H / 2); g.rotate(a); g.fillRect(-w / 2, -l, w, l + 10); g.restore(); };
  hand(((3 + 7 / 60) / 12) * TAU, W * 0.24, 10); hand((7 / 60) * TAU, W * 0.36, 6);
  g.fillStyle = '#b3261e'; hand((7 / 60) * TAU + 1.2, W * 0.4, 2);
}
function drawWindow(g, W, H) {                  // a night window behind blinds
  const sky = g.createLinearGradient(0, 0, 0, H); sky.addColorStop(0, '#2b3d63'); sky.addColorStop(1, '#0d1626');
  g.fillStyle = sky; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 40; i++) { g.fillStyle = `rgba(255,220,150,${Math.random() * 0.5})`; g.fillRect(Math.random() * W, H * 0.55 + Math.random() * H * 0.4, 2 + Math.random() * 3, 2 + Math.random() * 4); }
  for (let y = 0; y < H; y += 18) { g.fillStyle = 'rgba(6,10,18,.78)'; g.fillRect(0, y, W, 11); g.fillStyle = 'rgba(160,190,255,.08)'; g.fillRect(0, y + 11, W, 1); }
  g.strokeStyle = '#0a0d12'; g.lineWidth = 14; g.strokeRect(0, 0, W, H);
}
function drawSign(g, W, H) {                    // a tent card on the desk
  g.fillStyle = '#e9e2d0'; g.fillRect(0, 0, W, H);
  g.fillStyle = '#16301f'; g.textAlign = 'center'; g.textBaseline = 'middle';
  g.direction = 'rtl'; g.font = `700 ${Math.round(H * 0.34)}px Rubik, sans-serif`; g.fillText(__t('greenroom.dims.sign.closed'), W / 2, H * 0.42);
  g.font = `500 ${Math.round(H * 0.17)}px Rubik, sans-serif`; g.fillStyle = '#6a5a32'; g.fillText(__t('greenroom.dims.sign.book'), W / 2, H * 0.76);
}
function drawDiffusers(g, W, H) {              // under a canopy: three round diffusers in dark metal
  g.fillStyle = '#060807'; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 3; i++) {
    const cy = H * (0.2 + i * 0.3), r = W * 0.36;
    const gr = g.createRadialGradient(W / 2, cy, 0, W / 2, cy, r);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.55, '#fff3dc'); gr.addColorStop(0.8, 'rgba(255,214,150,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(W / 2, cy, r, 0, TAU); g.fill();
  }
}
function drawPool(g, W, H) {                  // the light a canopy lays on its table: even, falling off at the cushions
  const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, H * 0.62);
  gr.addColorStop(0, '#fff'); gr.addColorStop(0.55, '#e6e6e6'); gr.addColorStop(1, '#5c5c5c');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
function drawAO(g, W, H) {                      // the soft dark under a table
  g.clearRect(0, 0, W, H);
  g.filter = `blur(${Math.round(W * 0.08)}px)`;
  g.fillStyle = 'rgba(0,0,0,.85)'; g.fillRect(W * 0.2, H * 0.14, W * 0.6, H * 0.72);
  g.filter = 'none';
}
function drawCue(g, W, H) {                     // along u: tip, ferrule, maple shaft, ebony butt with a brass ring
  const x = (m) => (m / 1.47) * W;
  g.fillStyle = '#2c5c9c'; g.fillRect(0, 0, x(0.012), H);
  g.fillStyle = '#efe9da'; g.fillRect(x(0.012), 0, x(0.03), H);
  const sh = g.createLinearGradient(x(0.042), 0, x(0.95), 0); sh.addColorStop(0, '#e2c493'); sh.addColorStop(1, '#c79a5c');
  g.fillStyle = sh; g.fillRect(x(0.042), 0, x(0.95) - x(0.042), H);
  for (let i = 0; i < 6; i++) { g.fillStyle = '#1c0f08'; g.beginPath(); const s = x(0.75), e = x(1.02); g.moveTo(s + i * 6, 0); g.lineTo(e, 0); g.lineTo(e, H); g.lineTo(s + i * 6, H); g.fill(); }
  g.fillStyle = '#140904'; g.fillRect(x(1.0), 0, W - x(1.0), H);
  g.fillStyle = '#c9a24e'; g.fillRect(x(1.02), 0, x(0.012), H); g.fillRect(W - x(0.02), 0, x(0.02), H);
}

/* ── shaders ─────────────────────────────────────────────── */
const FOG_ADD = /* glsl */`
#ifdef USE_FOG
  float ff_ = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  gl_FragColor.rgb *= 1.0 - ff_;
#endif`;

const CARD_VS = /* glsl */`
attribute float aCell; attribute float aSeed; attribute float aFade; attribute float aGlow;
varying vec2 vUv; varying float vCell, vSeed, vFade, vGlow; varying vec3 vN, vV;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vCell = aCell; vSeed = aSeed; vFade = aFade; vGlow = aGlow;
  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelViewMatrix) * mat3(instanceMatrix) * vec3(0.0, 0.0, 1.0));
  vV = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const CARD_FS = /* glsl */`
uniform sampler2D uAtlas; uniform vec2 uCells; uniform vec2 uSize; uniform float uR; uniform vec3 uAcc; uniform float uInset;
varying vec2 vUv; varying float vCell, vSeed, vFade, vGlow; varying vec3 vN, vV;
#include <fog_pars_fragment>
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main(){
  vec2 p = (vUv - 0.5) * uSize;
  float d = sdRB(p, uSize * 0.5, uR);
  float aa = max(fwidth(d), 1e-4);
  float a = 1.0 - smoothstep(-aa, aa, d);
  if (a < 0.01) discard;
  vec3 N = normalize(vN), V = normalize(vV);
  float fres = pow(max(1.0 - abs(dot(N, V)), 0.0), 3.0);   // max: pow() of a negative is NaN
  vec3 col;
  if (gl_FrontFacing) {
    float cy = floor((vCell + 0.5) / uCells.x);                         // the cell, robust to an interpolated index
    vec2 cell = vec2(floor(vCell + 0.5) - cy * uCells.x, cy);
    vec2 suv = vec2(mix(uInset, 1.0 - uInset, vUv.x), mix(0.004, 0.996, vUv.y));
    vec2 auv = vec2((cell.x + suv.x) / uCells.x, 1.0 - (cell.y + 1.0 - suv.y) / uCells.y);
    col = texture2D(uAtlas, auv).rgb * (0.42 + 0.95 * vGlow);
    float s = vUv.x * 0.75 + vUv.y * 0.55 + (V.x - V.y) * 0.35 + vSeed;  // the glass: a sheen that slides as it turns
    col += vec3(1.0, 0.92, 0.78) * exp(-((fract(s) - 0.5) * 7.0) * ((fract(s) - 0.5) * 7.0)) * 0.06;
  } else {
    col = vec3(0.016, 0.02, 0.018) + vec3(0.02, 0.03, 0.022) * (1.0 - vUv.y);   // the back: dark glass and the club's mark
    float mark = abs(length(p - vec2(0.0, 0.08)) - 0.085) - 0.008;
    col += uAcc * 0.6 * (1.0 - smoothstep(0.0, 0.004, mark));
  }
  float ring = smoothstep(-0.016, -0.008, d);                            // the gold band around the glass
  col = mix(col, uAcc * (0.25 + fres * 2.4), ring);
  col += uAcc * fres * 0.22;
  gl_FragColor = vec4(col, a * vFade);
  #include <fog_fragment>
}`;
const HALO_FS = /* glsl */`
uniform vec2 uSize; uniform float uR; uniform vec3 uAcc; uniform vec2 uGeo;
varying vec2 vUv; varying float vCell, vSeed, vFade, vGlow; varying vec3 vN, vV;
#include <fog_pars_fragment>
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main(){
  vec2 p = (vUv - 0.5) * uGeo;
  float d = sdRB(p, uSize * 0.5, uR);
  if (d < 0.0) discard;
  float g = exp(-d * 9.0) * 0.16 + exp(-d * 34.0) * 0.26;
  gl_FragColor = vec4(uAcc * g * vGlow * vFade, 1.0);
  ${FOG_ADD}
}`;
// light, as a volume: a cone of light under a lamp (and under a phone hanging like one)
const BEAM_VS = /* glsl */`
attribute float aFade; varying float vY, vFade; varying vec3 vN, vV;
#include <fog_pars_vertex>
void main(){
  vY = uv.y; vFade = aFade;
  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelViewMatrix) * mat3(instanceMatrix) * normal);
  vV = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const BEAM_FS = /* glsl */`
uniform vec3 uCol; uniform float uI;
varying float vY, vFade; varying vec3 vN, vV;
#include <fog_pars_fragment>
void main(){
  float e = abs(dot(normalize(vN), normalize(vV)));
  float a = pow(e, 1.7) * (0.12 + 0.88 * pow(max(vY, 0.0), 1.3)) * vFade * uI;
  gl_FragColor = vec4(uCol * a, 1.0);
  ${FOG_ADD}
}`;
const POOL_VS = /* glsl */`
attribute float aFade; varying vec2 vUv; varying float vFade;
#include <fog_pars_vertex>
void main(){ vUv = uv; vFade = aFade; vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const POOL_FS = /* glsl */`
uniform vec3 uCol; varying vec2 vUv; varying float vFade;
#include <fog_pars_fragment>
void main(){ float r = length(vUv - 0.5) * 2.0; float a = pow(clamp(1.0 - r, 0.0, 1.0), 1.8) * vFade; gl_FragColor = vec4(uCol * a, 1.0);
  ${FOG_ADD}
}`;
const SHADOW_VS = /* glsl */`
attribute float aOp; varying vec2 vUv; varying float vOp;
void main(){ vUv = uv; vOp = aOp; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`;
const SHADOW_FS = /* glsl */`
varying vec2 vUv; varying float vOp;
void main(){ float r = length(vUv - 0.5) * 2.0; float a = pow(clamp(1.0 - r, 0.0, 1.0), 1.5) * vOp; gl_FragColor = vec4(0.0, 0.0, 0.0, a); }`;
const DUST_VS = /* glsl */`
attribute vec3 aSeed; attribute float aT;
uniform float uTime, uScale; uniform vec4 uOn; uniform vec3 uC0, uC1;
varying float vA;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  p.x += sin(uTime * 0.13 + aSeed.x * 30.0) * 0.14;
  p.y += sin(uTime * 0.07 + aSeed.y * 40.0) * 0.16;
  p.z += cos(uTime * 0.11 + aSeed.z * 20.0) * 0.18;
  vec3 c = aT < 0.5 ? uC0 : uC1; float on = aT < 0.5 ? uOn.x : uOn.y;
  vec2 q = (p.xz - c.xz) / vec2(0.95, 1.9);
  float inside = smoothstep(1.05, 0.5, length(q)) * smoothstep(${FELT.toFixed(2)}, 1.05, p.y) * smoothstep(2.5, 1.85, p.y);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  gl_PointSize = max(1.0, (0.0035 + aSeed.x * 0.0055) * uScale / -mvPosition.z);
  vA = inside * on * (0.3 + 0.7 * fract(aSeed.y * 7.3 + uTime * 0.06 * (0.5 + aSeed.z)));
  #include <fog_vertex>
}`;
const DUST_FS = /* glsl */`
varying float vA;
#include <fog_pars_fragment>
void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r); gl_FragColor = vec4(vec3(1.0, 0.87, 0.64) * vA * a * 0.85, 1.0);
  ${FOG_ADD}
}`;
// the crossing: a cue strike at the contact point (flash, gold ring, radial rush), plus grain and vignette always
const STRIKE = {
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uAmt: { value: 0 }, uRing: { value: 0 }, uVel: { value: 0 },
    uAspect: { value: 1 }, uC: { value: null }, uAcc: { value: null },
  },
  vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
uniform sampler2D tDiffuse; uniform float uTime, uAmt, uRing, uVel, uAspect; uniform vec2 uC; uniform vec3 uAcc;
varying vec2 vUv;
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main(){
  vec2 d = vUv - uC;
  float ca = 0.0006 + uVel * 0.0025 + uAmt * 0.01;
  vec3 col;
  if (uAmt > 0.003) {
    vec3 acc = vec3(0.0); float tw = 0.0;
    for (int i = 0; i < 9; i++) {
      float fi = float(i) / 8.0;
      vec2 uv = uC + d * (1.0 - fi * uAmt * 0.07);
      acc += texture2D(tDiffuse, uv).rgb * (1.0 - fi * 0.55); tw += 1.0 - fi * 0.55;
    }
    col = acc / tw;
    col.r = mix(col.r, texture2D(tDiffuse, vUv + d * ca * 2.0).r, 0.5);
    col.b = mix(col.b, texture2D(tDiffuse, vUv - d * ca * 2.0).b, 0.5);
  } else {
    col = vec3(texture2D(tDiffuse, vUv + d * ca).r, texture2D(tDiffuse, vUv).g, texture2D(tDiffuse, vUv - d * ca).b);
  }
  vec2 q = d * vec2(uAspect, 1.0); float r = length(q);
  float ring = exp(-((r - uRing) * 22.0) * ((r - uRing) * 22.0)) * uAmt;
  float core = exp(-r * r * 26.0) * uAmt * uAmt;
  col += uAcc * (ring * 0.7 + core * 0.4);
  col *= 1.0 + uAmt * 0.12 * exp(-r * 3.0);
  float g = h21(gl_FragCoord.xy + fract(uTime * 7.13) * vec2(113.0, 71.0)) - 0.5;
  col += g * 0.022 * (0.3 + col);
  vec2 v = (vUv - 0.5) * vec2(uAspect, 1.0);
  col *= mix(1.0, smoothstep(1.3, 0.22, length(v)), 0.62);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`,
};

// a frustum of light between two ellipses (top a0 × b0, bottom a1 × b1, height 1 downward); uv.y = 1 at the lamp
function beamGeo(THREE, a0, b0, a1, b1, seg = 48) {
  const pos = [], nor = [], uv = [], idx = [];
  for (let i = 0; i <= seg; i++) {
    const a = (i / seg) * TAU, c = Math.cos(a), s = Math.sin(a);
    pos.push(c * a0, 0, s * b0, c * a1, -1, s * b1);
    const n = new THREE.Vector3(c / Math.max(a1, 1e-3), (a1 - a0) * 0.2, s / Math.max(b1, 1e-3)).normalize();
    nor.push(n.x, n.y, n.z, n.x, n.y, n.z);
    uv.push(i / seg, 1, i / seg, 0);
    if (i < seg) { const k = i * 2; idx.push(k, k + 1, k + 2, k + 1, k + 3, k + 2); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('normal', new THREE.Float32BufferAttribute(nor, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  return g;
}

/* ── the build ─────────────────────────────────────────────── */
async function build(THREE, P, { lenis, loaded, onLost }) {
  const root = document.documentElement;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const phone = coarse || innerWidth < 760;
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const N = phone ? 10 : 15;                       // a full rack: 15 on a desktop, 10 on a phone
  const TABLES = TABLES_ALL.slice(0, phone ? 3 : 6);
  const T = TABLES.length;
  const maxDpr = phone ? 1 : 1.5;
  const gold = new THREE.Color().setRGB(...GOLD);
  const dbgOn = new URLSearchParams(location.search).has('dimdbg');
  const V3 = (a) => new THREE.Vector3(...a);

  // the screenshots and the fonts first: without them there is no app in the world, and the neon has no letters
  const imgs = await loaded(Promise.all(SHOTS.map((src) => new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(im); im.onerror = rej; im.src = src; }))));
  try { await Promise.race([Promise.all(['800 64px Archivo', '600 32px Archivo', '700 32px Rubik', '500 32px Rubik'].map((f) => document.fonts.load(f))), new Promise((r) => setTimeout(r, 1500))]); } catch { /* system fonts then */ }

  const wrap = document.createElement('div'); wrap.className = 'gdim'; wrap.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas'); canvas.className = 'gdim__cv';
  const scrim = document.createElement('i'); scrim.className = 'gdim__scrim';
  wrap.append(canvas, scrim);
  document.body.prepend(wrap);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' });
  let dpr = Math.min(devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => { shaderFailed = true; };   // a shader that does not compile: the page's world instead
  // half-float targets need a renderable float format; without one, 8-bit targets (less bloom range, but a picture)
  const floatRT = renderer.extensions.has('EXT_color_buffer_half_float') || renderer.extensions.has('EXT_color_buffer_float');
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const fogCol = new THREE.Color(0x040605);
  scene.background = fogCol;
  scene.fog = new THREE.FogExp2(fogCol, 0.052);
  const camera = new THREE.PerspectiveCamera(40, innerWidth / innerHeight, 0.07, 90);
  const fogU = () => THREE.UniformsUtils.clone(THREE.UniformsLib.fog);
  const time = { value: 0 };
  const pointScale = { value: 600 };

  /* reflections: a dark room with warm lamps and a green neon, for the balls, the lacquer and the floor */
  {
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(new THREE.BoxGeometry(30, 10, 30), new THREE.MeshBasicMaterial({ color: 0x050505, side: THREE.BackSide })));
    const lampM = new THREE.MeshBasicMaterial({ color: new THREE.Color(9, 7, 4.4) });
    for (const [x, z] of [[0, 0], [-5, 0], [5, 0], [0, -6], [0, 6], [-5, 6], [-5, -6]]) { const m = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 2.4), lampM); m.rotation.x = Math.PI / 2; m.position.set(x, 3.2, z); env.add(m); }
    const neon = new THREE.Mesh(new THREE.PlaneGeometry(5, 0.6), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.6, 3, 1.4) })); neon.position.set(0, 2.5, -14.5); env.add(neon);
    const pm = new THREE.PMREMGenerator(renderer);
    scene.environment = pm.fromScene(env, 0.04).texture;
    pm.dispose();
  }
  scene.add(new THREE.HemisphereLight(0x5a6a60, 0x0a0604, 0.12));

  /* materials */
  const woodTex = canvasTex(THREE, 1024, 256, drawWood, { repeat: true, aniso });
  const wood = new THREE.MeshStandardMaterial({ map: woodTex, roughness: 0.3, envMapIntensity: 0.8 });
  const feltTex = canvasTex(THREE, 512, 1024, drawFelt, { aniso });
  // the cloth is lit by its own lamp only: a baked pool (light map) times the lamp's state (instance colour); no per-light BRDF
  const poolTex = canvasTex(THREE, 128, 256, drawPool, { srgb: false });
  const felt = new THREE.MeshBasicMaterial({ map: feltTex, lightMap: poolTex, lightMapIntensity: Math.PI, polygonOffset: true, polygonOffsetFactor: -1, polygonOffsetUnits: -1 });
  const cushion = new THREE.MeshBasicMaterial({ color: 0x0a4f27 });
  const black = new THREE.MeshStandardMaterial({ color: 0x020202, roughness: 0.9, envMapIntensity: 0 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xb8954f, metalness: 1, roughness: 0.32, envMapIntensity: 1.2 });
  const metal = new THREE.MeshStandardMaterial({ color: 0x18201b, metalness: 0.7, roughness: 0.38, envMapIntensity: 0.7 });

  /* the floor */
  const floorTex = canvasTex(THREE, 2048, 2048, drawFloor, { repeat: true, aniso });
  floorTex.repeat.set(6, 6);
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(48, 48), new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.38, metalness: 0, envMapIntensity: 0.55 }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(2, 0, -2);
  scene.add(floor);

  /* walls: the hall's back and side, the wall with the door, the lobby */
  const wallTex = canvasTex(THREE, 1024, 1178, drawWall, { repeat: true, aniso });
  const wallMat = (len) => { const t = wallTex.clone(); t.repeat.set(len / 4, 1); t.needsUpdate = true; return new THREE.MeshStandardMaterial({ map: t, roughness: 0.75, envMapIntensity: 0.25 }); };
  const wall = (x0, z0, x1, z1, h = 4.6, y0 = 0) => {
    const len = Math.hypot(x1 - x0, z1 - z0);
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, h, 0.2), wallMat(len));
    if (h < 4.6) { const t = m.material.map; t.repeat.set(len / 4, h / 4.6); t.offset.y = y0 / 4.6; }
    m.position.set((x0 + x1) / 2, y0 + h / 2, (z0 + z1) / 2);
    m.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
    scene.add(m); return m;
  };
  wall(-8, -11, WALL_X, -11);                             // the hall's back wall, the neon on it
  wall(-8, -11, -8, 12);                                 // the left wall
  wall(WALL_X, -11, WALL_X, -DOOR.w / 2, 3.4);            // the wall with the door: left of it, right of it, over it
  wall(WALL_X, DOOR.w / 2, WALL_X, 4.0, 3.4);
  wall(WALL_X, -DOOR.w / 2, WALL_X, DOOR.w / 2, 3.4 - DOOR.h, DOOR.h);
  wall(13.8, -4, 13.8, 4.5, 3.4);                         // the lobby
  wall(WALL_X, -4, 13.8, -4, 3.4);

  /* the tables: felt, cushions, lacquered wood, pockets; each part one instanced draw for the whole hall */
  const tableParts = (() => {
    const box = (w, h, d, x, y, z) => new THREE.BoxGeometry(w, h, d).translate(x, y, z);
    const feltG = new THREE.PlaneGeometry(TW, TL).rotateX(-Math.PI / 2).translate(0, FELT, 0);
    const cush = P.mergeGeometries([
      box(0.05, 0.042, TL, TW / 2 + 0.025, FELT + 0.021, 0), box(0.05, 0.042, TL, -TW / 2 - 0.025, FELT + 0.021, 0),
      box(TW + 0.1, 0.042, 0.05, 0, FELT + 0.021, TL / 2 + 0.025), box(TW + 0.1, 0.042, 0.05, 0, FELT + 0.021, -TL / 2 - 0.025),
    ]);
    const rw = 0.17, ox = TW / 2 + 0.05 + rw / 2, oz = TL / 2 + 0.05 + rw / 2;
    const parts = [
      box(rw, 0.11, TL + 0.1 + 2 * rw, ox, RAIL - 0.055, 0), box(rw, 0.11, TL + 0.1 + 2 * rw, -ox, RAIL - 0.055, 0),
      box(TW + 0.1, 0.11, rw, 0, RAIL - 0.055, oz), box(TW + 0.1, 0.11, rw, 0, RAIL - 0.055, -oz),
      box(TW + 0.3, 0.16, TL + 0.3, 0, 0.70, 0),          // the body's top stays well under the cloth (no depth fight at grazing angles)
    ];
    for (const sx of [-1, 1]) for (const z of [-(TL / 2 - 0.16), -TL / 6, TL / 6, TL / 2 - 0.16]) {
      parts.push(new THREE.CylinderGeometry(0.075, 0.06, 0.62, 14).translate(sx * (TW / 2 - 0.02), 0.31, z));
      parts.push(new THREE.CylinderGeometry(0.095, 0.095, 0.05, 14).translate(sx * (TW / 2 - 0.02), 0.54, z));
    }
    const woodG = P.mergeGeometries(parts.map((g) => g.index ? g.toNonIndexed() : g));
    const pk = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0]].map(([sx, sz]) => [sx * (TW / 2 + (sz ? 0.035 : 0.05)), sz * (TL / 2 + 0.035)]);
    const holes = P.mergeGeometries(pk.map(([x, z]) => new THREE.CylinderGeometry(0.062, 0.062, 0.012, 20).translate(x, RAIL + 0.002, z)));
    const plates = P.mergeGeometries(pk.map(([x, z]) => new THREE.CylinderGeometry(0.09, 0.09, 0.01, 20).translate(x, RAIL - 0.001, z)));
    return [[feltG, felt], [cush, cushion], [woodG, wood], [holes, black], [plates, brass]];
  })();
  const m4 = new THREE.Matrix4();
  const tableMeshes = tableParts.map(([g, mat]) => {
    const im = new THREE.InstancedMesh(g, mat, T);
    TABLES.forEach(([x, z], j) => { im.setMatrixAt(j, m4.makeTranslation(x, 0, z)); if (mat.isMeshBasicMaterial) im.setColorAt(j, new THREE.Color(1, 1, 1)); });
    scene.add(im); return im;
  });
  const clothMeshes = tableMeshes.slice(0, 2);
  // the spill on the floor around each lit table
  const aSpillT = new THREE.InstancedBufferAttribute(new Float32Array(T), 1); aSpillT.setUsage(THREE.DynamicDrawUsage);
  const floorSpillGeo = new THREE.PlaneGeometry(4.6, 6.6).rotateX(-Math.PI / 2); floorSpillGeo.setAttribute('aFade', aSpillT);
  const floorSpill = new THREE.InstancedMesh(floorSpillGeo, new THREE.ShaderMaterial({ vertexShader: POOL_VS, fragmentShader: POOL_FS,
    uniforms: { ...fogU(), uCol: { value: new THREE.Color(0.55, 0.36, 0.18) } }, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), T);
  TABLES.forEach(([x, z], j) => floorSpill.setMatrixAt(j, m4.makeTranslation(x, 0.002, z)));
  scene.add(floorSpill);
  // the dark under each table
  {
    const ao = new THREE.InstancedMesh(new THREE.PlaneGeometry(TW + 1.6, TL + 1.6).rotateX(-Math.PI / 2),
      new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 128, 256, drawAO, { srgb: false }), transparent: true, depthWrite: false, color: 0x000000 }), T);
    TABLES.forEach(([x, z], j) => ao.setMatrixAt(j, m4.makeTranslation(x, 0.003, z)));
    scene.add(ao);
  }

  /* the lamps: a green canopy over every table but M (M is lit by the phones), with its light, its beam and its swing */
  const LAMPS = TABLES.slice(1);
  const NL = LAMPS.length;
  const shade = new THREE.InstancedMesh(new THREE.BoxGeometry(0.66, 0.17, 2.36).translate(0, 0.085, 0), new THREE.MeshStandardMaterial({ color: 0x0f2e1c, metalness: 0.55, roughness: 0.42, envMapIntensity: 0.9 }), NL);
  const bulbs = new THREE.InstancedMesh(new THREE.PlaneGeometry(0.62, 2.32).rotateX(Math.PI / 2).translate(0, -0.002, 0), new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 128, 480, drawDiffusers) }), NL);
  const chains = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.006, 0.006, 1, 6).translate(0, 0.5, 0), metal, NL * 2);
  const lampBeamGeo = beamGeo(THREE, 0.3, 1.13, 1.0, 2.05);
  const beamU = (col, i) => ({ ...fogU(), uCol: { value: col }, uI: { value: i } });
  const aLampFade = new THREE.InstancedBufferAttribute(new Float32Array(NL), 1); aLampFade.setUsage(THREE.DynamicDrawUsage);
  lampBeamGeo.setAttribute('aFade', aLampFade);
  const lampBeams = new THREE.InstancedMesh(lampBeamGeo, new THREE.ShaderMaterial({ vertexShader: BEAM_VS, fragmentShader: BEAM_FS, uniforms: beamU(new THREE.Color(1, 0.8, 0.52), 0.16), fog: true,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), NL);
  for (const m of [shade, bulbs, chains, lampBeams]) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; }
  bulbs.setColorAt(0, new THREE.Color());
  lampBeams.renderOrder = 4;
  scene.add(shade, bulbs, chains, lampBeams);
  // one spot per table, its pool shaped like the table by a cookie
  const spots = TABLES.slice(0, 2).map(([x, z], j) => {
    const h = j === 0 ? 3.1 : LAMP_Y - 0.02;
    const s = new THREE.SpotLight(0xffd7a0, 0, 0, Math.atan(2.1 / (h - FELT)), 0.55, 2);
    s.position.set(x, h, z);
    s.target.position.set(x, FELT, z + 0.001);
    s.userData = { h, base: j === 0 ? 26 : 9 };
    scene.add(s, s.target);
    return s;
  });

  /* the neon on the back wall, and the lobby's own */
  const neonMat = (tex, c) => new THREE.MeshBasicMaterial({ map: tex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, color: c, toneMapped: true });
  const neonHall = new THREE.Mesh(new THREE.PlaneGeometry(4.6, 1.44), neonMat(canvasTex(THREE, 1024, 320, (g, W, H) => drawNeon(g, W, H, 'GREEN ROOM', 'SNOOKER CLUB · 24/7', '#3dff8e')), new THREE.Color(2.2, 2.2, 2.2)));
  neonHall.position.set(-2.2, 3.05, -10.88);
  const neonLobby = new THREE.Mesh(new THREE.PlaneGeometry(1.7, 0.53), neonMat(canvasTex(THREE, 512, 160, (g, W, H) => drawNeon(g, W, H, 'OPEN 24/7', '', '#E4C57E')), new THREE.Color(2, 2, 2)));
  neonLobby.position.set(13.68, 2.25, 0.9); neonLobby.rotation.y = -Math.PI / 2;
  scene.add(neonHall, neonLobby);
  const neonLight = new THREE.PointLight(0x3dff8e, 5, 0, 2); neonLight.position.set(-2.2, 3.0, -10.1);
    const moon = new THREE.PointLight(0x7f9fe0, 7, 0, 2); moon.position.set(12.2, 2.7, 2.6);
  scene.add(neonLight, moon);

  /* the lobby: the desk nobody stands behind, a stool, a clock at 03:07, a window, a tent card */
  {
    const deskG = P.mergeGeometries([
      new THREE.BoxGeometry(0.62, DESK.top - 0.04, DESK.len).translate(DESK.x + 0.02, (DESK.top - 0.04) / 2, DESK.z),
    ]);
    const desk = new THREE.Mesh(deskG, wood); scene.add(desk);
    const top = new THREE.Mesh(new THREE.BoxGeometry(0.78, 0.04, DESK.len + 0.12), new THREE.MeshPhysicalMaterial({ color: 0x0b0d0c, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.14, envMapIntensity: 0.9 }));
    top.position.set(DESK.x, DESK.top - 0.02, DESK.z); scene.add(top);
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.012, DESK.len - 0.1), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.3, 0.75) }));
    strip.position.set(DESK.x - 0.3, DESK.top - 0.12, DESK.z); scene.add(strip);
    const stool = new THREE.Group();
    stool.add(new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.07, 24).translate(0, 0.74, 0), new THREE.MeshStandardMaterial({ color: 0x2a1a10, roughness: 0.5 })));
    stool.add(new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.72, 8).translate(0, 0.36, 0), metal));
    stool.add(new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.03, 24).translate(0, 0.015, 0), metal));
    stool.position.set(DESK.x + 0.85, 0, DESK.z + 0.3); scene.add(stool);
    const lamp = new THREE.Group();                                  // the desk lamp, off
    lamp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.02, 20), brass));
    lamp.add(new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.36, 8).translate(0, 0.18, 0), brass));
    lamp.add(new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.12, 24, 1, true).translate(0, 0.38, 0), new THREE.MeshStandardMaterial({ color: 0x0e3b22, metalness: 0.4, roughness: 0.4, side: THREE.DoubleSide })));
    lamp.add(new THREE.Mesh(new THREE.SphereGeometry(0.03, 12, 8).translate(0, 0.35, 0), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 2.9, 1.6) })));
    lamp.position.set(DESK.x + 0.15, DESK.top, DESK.z + 0.95); scene.add(lamp);
    // the light the lamp lays on the desk, its small cone, the clock's halo, and the gap under the door
    const glow = (w, h, col, x, y, z, ry = 0, flat = true) => {
      const g = new THREE.PlaneGeometry(w, h); if (flat) g.rotateX(-Math.PI / 2); else g.rotateY(ry);
      g.setAttribute('aFade', new THREE.InstancedBufferAttribute(new Float32Array([1]), 1));
      const m = new THREE.InstancedMesh(g, new THREE.ShaderMaterial({ vertexShader: POOL_VS, fragmentShader: POOL_FS, uniforms: { ...fogU(), uCol: { value: col } }, fog: true,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), 1);
      m.setMatrixAt(0, new THREE.Matrix4().makeTranslation(x, y, z)); m.renderOrder = 1; scene.add(m); return m;
    };
    glow(1.1, 1.1, new THREE.Color(1.0, 0.7, 0.36), DESK.x + 0.05, DESK.top + 0.003, DESK.z + 0.8);
    glow(2.6, 2.6, new THREE.Color(0.28, 0.18, 0.08), DESK.x - 0.4, 0.004, DESK.z + 0.8);
    glow(0.95, 0.95, new THREE.Color(0.32, 0.36, 0.5), 13.697, 2.05, -1.25, -Math.PI / 2, false);
    glow(1.5, 0.9, new THREE.Color(0.9, 0.62, 0.3), WALL_X + 0.55, 0.004, 0);
    const lampBeam = new THREE.InstancedMesh(beamGeo(THREE, 0.09, 0.09, 0.42, 0.42, 24), new THREE.ShaderMaterial({ vertexShader: BEAM_VS, fragmentShader: BEAM_FS,
      uniforms: beamU(new THREE.Color(1, 0.8, 0.5), 0.35), fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), 1);
    lampBeam.geometry.setAttribute('aFade', new THREE.InstancedBufferAttribute(new Float32Array([1]), 1));
    lampBeam.setMatrixAt(0, new THREE.Matrix4().compose(new THREE.Vector3(DESK.x + 0.15, DESK.top + 0.33, DESK.z + 0.95), new THREE.Quaternion(), new THREE.Vector3(1, 0.33, 1)));
    lampBeam.renderOrder = 4; scene.add(lampBeam);
    const gap = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, DOOR.w - 0.06), new THREE.MeshBasicMaterial({ color: new THREE.Color(3.2, 2.2, 1.1) }));
    gap.position.set(WALL_X + 0.03, 0.007, 0); scene.add(gap);
    const bell = new THREE.Mesh(new THREE.SphereGeometry(0.045, 20, 10, 0, TAU, 0, Math.PI / 2), brass); bell.position.set(DESK.x - 0.2, DESK.top, DESK.z - 0.85); scene.add(bell);
    const sign = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.13), new THREE.MeshStandardMaterial({ map: canvasTex(THREE, 512, 220, drawSign), roughness: 0.7 }));
    sign.position.set(DESK.x - 0.18, DESK.top + 0.06, DESK.z - 0.35); sign.rotation.set(0, -Math.PI / 2, 0); sign.rotateX(-0.25); scene.add(sign);
    const clock = new THREE.Mesh(new THREE.CircleGeometry(0.22, 40), new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 256, 256, drawClock), color: new THREE.Color(0.8, 0.82, 0.9) }));
    clock.position.set(13.69, 2.05, -1.25); clock.rotation.y = -Math.PI / 2; scene.add(clock);
    const win = new THREE.Mesh(new THREE.PlaneGeometry(1.5, 1.7), new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 384, 448, drawWindow), color: new THREE.Color(0.9, 0.95, 1.15) }));
    win.position.set(13.69, 1.55, 2.9); win.rotation.y = -Math.PI / 2; scene.add(win);
  }

  /* the door with its keypad, and the light of the hall that comes through when it opens */
  const keypadCv = document.createElement('canvas'); keypadCv.width = 384; keypadCv.height = 640;
  const keypadTex = new THREE.CanvasTexture(keypadCv); keypadTex.colorSpace = THREE.SRGBColorSpace; keypadTex.anisotropy = aniso;
  let keyState = '';
  const setKeys = (st) => { const s = JSON.stringify(st); if (s === keyState) return; keyState = s; drawKeypad(keypadCv.getContext('2d'), 384, 640, st); keypadTex.needsUpdate = true; };
  setKeys({ lit: '', n: 0, open: false });
  const keypad = new THREE.Mesh(new THREE.PlaneGeometry(0.27, 0.45), new THREE.MeshBasicMaterial({ map: keypadTex, transparent: true, color: new THREE.Color(1.15, 1.15, 1.15) }));
  keypad.position.set(WALL_X + 0.115, 1.32, 0.98); keypad.rotation.y = Math.PI / 2;
  scene.add(keypad);
  const doorPivot = new THREE.Group(); doorPivot.position.set(WALL_X, 0, -DOOR.w / 2);
  const slab = new THREE.Mesh(new THREE.BoxGeometry(0.05, DOOR.h, DOOR.w), new THREE.MeshStandardMaterial({ map: canvasTex(THREE, 256, 550, drawDoor), roughness: 0.3, envMapIntensity: 0.6 }));
  slab.position.set(0, DOOR.h / 2, DOOR.w / 2);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.03, 0.16), brass); handle.position.set(0.05, 1.02, DOOR.w - 0.14);
  doorPivot.add(slab, handle);
  scene.add(doorPivot);
  for (const [w, h, z, y] of [[0.24, 0.05, 0, DOOR.h + 0.025], [0.24, DOOR.h, -DOOR.w / 2 - 0.025, DOOR.h / 2], [0.24, DOOR.h, DOOR.w / 2 + 0.025, DOOR.h / 2]]) {
    const f = new THREE.Mesh(new THREE.BoxGeometry(w, h, z ? 0.05 : DOOR.w + 0.1), brass); f.position.set(WALL_X, y, z); scene.add(f);
  }
  const vip = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 0.22), neonMat(canvasTex(THREE, 512, 128, (g, W, H) => drawNeon(g, W, H, 'VIP · HALL', '', '#E4C57E')), new THREE.Color(1.4, 1.4, 1.4)));
  vip.position.set(WALL_X + 0.115, DOOR.h + 0.32, 0); vip.rotation.y = Math.PI / 2; scene.add(vip);
  const spillMat = new THREE.ShaderMaterial({ vertexShader: POOL_VS, fragmentShader: /* glsl */`
    uniform vec3 uCol; varying vec2 vUv; varying float vFade;
    #include <fog_pars_fragment>
    void main(){ float w = abs(vUv.x - 0.5) * 2.0; float a = smoothstep(1.0, 0.55 - vUv.y * 0.3, w) * pow(max(1.0 - vUv.y, 0.0), 1.6) * vFade; gl_FragColor = vec4(uCol * a, 1.0);
      ${FOG_ADD}
    }`,
  uniforms: { ...fogU(), uCol: { value: new THREE.Color(1, 0.78, 0.48) } }, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const spillGeo = new THREE.PlaneGeometry(1.0, 3.4); { // a trapezoid on the lobby floor, narrow at the door
    const p = spillGeo.attributes.position; for (let i = 0; i < p.count; i++) { const v = (p.getY(i) + 1.7) / 3.4; p.setX(i, p.getX(i) * (1 + v * 1.1)); }
    spillGeo.rotateX(-Math.PI / 2); spillGeo.rotateY(-Math.PI / 2); spillGeo.translate(WALL_X + 0.1 + 1.7, 0.004, 0);
  }
  const aSpill = new THREE.InstancedBufferAttribute(new Float32Array([0]), 1); spillGeo.setAttribute('aFade', aSpill);
  const spill = new THREE.InstancedMesh(spillGeo, spillMat, 1); spill.setMatrixAt(0, new THREE.Matrix4());
  scene.add(spill);
  const doorLight = new THREE.PointLight(0xffc98e, 0, 0, 2); doorLight.position.set(WALL_X - 0.6, 1.6, 0); scene.add(doorLight);

  /* balls: M laid out for a frame, N mid-frame with two rolling, a few on the others; one instanced draw */
  const BCOL = { r: 0xa8121a, y: 0xf0be12, g: 0x0b7a3e, br: 0x6a3a1c, bl: 0x1846b6, p: 0xf28fb2, k: 0x0b0b0b, w: 0xf2eee2 };
  const balls = [];                                  // { t: table, x, z, c, roll? }
  for (let r = 0; r < 5; r++) for (let j = 0; j <= r; j++) balls.push({ t: 0, x: (j - r / 2) * BALL * 2.02, z: -0.893 - BALL * 2 - r * BALL * 1.75, c: 'r', m: 1 });
  [['y', 0.292, 1.048], ['g', -0.292, 1.048], ['br', 0, 1.048], ['bl', 0, 0], ['p', 0, -0.893], ['k', 0, -1.461]].forEach(([c, x, z]) => balls.push({ t: 0, x, z, c, m: 1 }));
  const CUEBALL = balls.length; balls.push({ t: 0, x: 0, z: 1.25, c: 'w' });
  [[0.42, 1.3, 'r'], [-0.33, 0.95, 'y'], [0.62, 0.32, 'r'], [-0.55, -0.22, 'r'], [0.27, -0.62, 'bl'], [-0.14, 0.12, 'r'], [0.72, -1.25, 'p'], [-0.7, -1.42, 'r'], [0.06, -1.55, 'k'], [0.33, 0.6, 'r'], [-0.45, 1.55, 'g']]
    .forEach(([x, z, c]) => balls.push({ t: 1, x, z, c }));
  balls.push({ t: 1, x: 0.5, z: 1.4, c: 'w', roll: [-0.05, -0.12] }, { t: 1, x: -0.6, z: -0.9, c: 'r', roll: [0.09, 0.05] });
  for (let j = 2; j < T; j++) for (let i = 0; i < 5; i++) balls.push({ t: j, x: (rnd(j, i) - 0.5) * 1.5, z: (rnd(j, i + 9) - 0.5) * 3.2, c: ['r', 'r', 'w', 'bl', 'k'][i] });
  const NB = balls.length;
  const ballMesh = new THREE.InstancedMesh(new THREE.SphereGeometry(BALL, phone ? 18 : 28, phone ? 12 : 18),
    new THREE.MeshPhysicalMaterial({ roughness: 0.16, clearcoat: 1, clearcoatRoughness: 0.1, envMapIntensity: 1.1 }), NB);
  const ballShadow = new THREE.InstancedMesh(new THREE.PlaneGeometry(BALL * 4.2, BALL * 4.2).rotateX(-Math.PI / 2),
    new THREE.ShaderMaterial({ vertexShader: SHADOW_VS, fragmentShader: SHADOW_FS, transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -2, polygonOffsetUnits: -2 }), NB);
  const aBallOp = new THREE.InstancedBufferAttribute(new Float32Array(NB).fill(0.6), 1); ballShadow.geometry.setAttribute('aOp', aBallOp);
  const ballCol = new THREE.Color();
  balls.forEach((b, i) => { ballMesh.setColorAt(i, ballCol.setHex(BCOL[b.c])); b.q = new THREE.Quaternion().setFromEuler(new THREE.Euler(rnd(i, 1) * TAU, rnd(i, 2) * TAU, 0)); b.p = new THREE.Vector3(); });
  for (const m of [ballMesh, ballShadow]) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; }
  scene.add(ballShadow, ballMesh);

  /* the cue, for the break; and the wooden triangle that racks the phones */
  const cueLen = 1.47;
  const cueGeo = new THREE.CylinderGeometry(0.0055, 0.0145, cueLen, 16, 1).rotateZ(Math.PI / 2).translate(cueLen / 2, 0, 0); // tip at the origin, along +x
  { const uv = cueGeo.attributes.uv, p = cueGeo.attributes.position; for (let i = 0; i < uv.count; i++) uv.setXY(i, p.getX(i) / cueLen, uv.getY(i)); }
  const cue = new THREE.Mesh(cueGeo, new THREE.MeshPhysicalMaterial({ map: canvasTex(THREE, 1024, 16, drawCue, { aniso }), roughness: 0.3, clearcoat: 0.7, envMapIntensity: 0.7 }));
  cue.visible = false; scene.add(cue);
  const rackMat = new THREE.MeshPhysicalMaterial({ map: woodTex, roughness: 0.4, clearcoat: 1, transparent: true, opacity: 0 });
  const rack = new THREE.Group(); scene.add(rack);

  /* dust in the light of M and N */
  const ND = phone ? 220 : 520;
  {
    const pos = new Float32Array(ND * 3), seed = new Float32Array(ND * 3), tt = new Float32Array(ND);
    for (let i = 0; i < ND; i++) {
      const t = i % 2, [cx, cz] = TABLES[t];
      pos.set([cx + (Math.random() - 0.5) * 2.2, FELT + 0.05 + Math.random() * 1.6, cz + (Math.random() - 0.5) * 4.2], i * 3);
      seed.set([Math.random(), Math.random(), Math.random()], i * 3); tt[i] = t;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3)); g.setAttribute('aSeed', new THREE.BufferAttribute(seed, 3)); g.setAttribute('aT', new THREE.BufferAttribute(tt, 1));
    var dustU = { ...fogU(), uTime: time, uScale: pointScale, uOn: { value: new THREE.Vector4(1, 1, 0, 0) }, uC0: { value: V3([TABLES[0][0], 0, TABLES[0][1]]) }, uC1: { value: V3([TABLES[1][0], 0, TABLES[1][1]]) } };
    const dust = new THREE.Points(g, new THREE.ShaderMaterial({ vertexShader: DUST_VS, fragmentShader: DUST_FS, uniforms: dustU, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    dust.frustumCulled = false; dust.renderOrder = 5; scene.add(dust);
  }

  /* the app: phone cards (one atlas of the real screens; body, glow, beam, pool and wire are instanced draws) */
  const atlas = canvasTex(THREE, 2048, 2048, (g) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, 2048, 2048);
    imgs.forEach((im, i) => {
      const cx = (i % 4) * 512, cy = Math.floor(i / 4) * 1024;
      const h = 1024, w = Math.round((im.width / im.height) * h);
      g.drawImage(im, cx + (512 - w) / 2, cy, w, h);
    });
  }, { aniso });
  atlas.generateMipmaps = true; atlas.minFilter = THREE.LinearMipmapLinearFilter;
  const inset = (512 - Math.round((imgs[0].width / imgs[0].height) * 1024)) / 2 / 512 + 0.002;
  const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H);
  const HALO = [CARD_W + 0.7, CARD_H + 0.7];
  const haloGeo = new THREE.PlaneGeometry(HALO[0], HALO[1]); haloGeo.translate(0, 0, -0.004);
  const inst = (n) => { const a = new THREE.InstancedBufferAttribute(new Float32Array(n), 1); a.setUsage(THREE.DynamicDrawUsage); return a; };
  const aCell = inst(N), aSeed = inst(N), aFade = inst(N), aGlow = inst(N), aBeam = inst(N);
  for (const [nm, a] of [['aCell', aCell], ['aSeed', aSeed], ['aFade', aFade], ['aGlow', aGlow]]) { cardGeo.setAttribute(nm, a); haloGeo.setAttribute(nm, a); }
  const cardU = { ...fogU(), uAtlas: { value: atlas }, uCells: { value: new THREE.Vector2(4, 2) }, uSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
    uR: { value: CARD_R }, uAcc: { value: gold }, uInset: { value: inset }, uGeo: { value: new THREE.Vector2(...HALO) } };
  const cards = new THREE.InstancedMesh(cardGeo, new THREE.ShaderMaterial({ vertexShader: CARD_VS, fragmentShader: CARD_FS, uniforms: cardU, fog: true,
    side: THREE.DoubleSide, transparent: true, depthWrite: true }), N);
  const halos = new THREE.InstancedMesh(haloGeo, new THREE.ShaderMaterial({ vertexShader: CARD_VS, fragmentShader: HALO_FS, uniforms: cardU, fog: true,
    side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), N);
  const cardBeamGeo = beamGeo(THREE, 0.2, 0.08, 0.62, 0.62, 32); cardBeamGeo.setAttribute('aFade', aBeam);
  const cardBeams = new THREE.InstancedMesh(cardBeamGeo, new THREE.ShaderMaterial({ vertexShader: BEAM_VS, fragmentShader: BEAM_FS, uniforms: beamU(new THREE.Color(1, 0.84, 0.58), 0.22), fog: true,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), N);
  const poolGeo = new THREE.PlaneGeometry(1.5, 1.5).rotateX(-Math.PI / 2); poolGeo.setAttribute('aFade', aBeam);
  const pools = new THREE.InstancedMesh(poolGeo, new THREE.ShaderMaterial({ vertexShader: POOL_VS, fragmentShader: POOL_FS, uniforms: { ...fogU(), uCol: { value: new THREE.Color(0.95, 0.72, 0.42).multiplyScalar(0.55) } }, fog: true,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), N);
  const wireGeo = new THREE.BufferGeometry();
  const wirePos = new Float32Array(N * 6), wireCol = new Float32Array(N * 8);
  wireGeo.setAttribute('position', new THREE.BufferAttribute(wirePos, 3).setUsage(THREE.DynamicDrawUsage));
  wireGeo.setAttribute('color', new THREE.BufferAttribute(wireCol, 4).setUsage(THREE.DynamicDrawUsage));
  const wires = new THREE.LineSegments(wireGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, depthWrite: false }));
  for (const m of [cards, halos, cardBeams, pools, wires]) { m.frustumCulled = false; if (m.instanceMatrix) m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); }
  pools.renderOrder = 1; cards.renderOrder = 2; halos.renderOrder = 3; cardBeams.renderOrder = 4;
  scene.add(pools, wires, cards, halos, cardBeams);

  /* formations: one per chapter, each writes position, rotation, scale, fade, glow, beam and wire of card i at time t */
  const R = Array.from({ length: N }, (_, i) => Array.from({ length: 8 }, (__, k) => rnd(i + 1, k + 1)));
  const camPos = CAMK.map((c) => V3(c.pos));
  const e = new THREE.Euler(), q2 = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3();
  const yaw = (o, a, rx = 0, rz = 0) => o.q.setFromEuler(e.set(rx, a, rz, 'YXZ'));
  const faceYaw = (o, to, rx = 0, rz = 0) => yaw(o, Math.atan2(to.x - o.p.x, to.z - o.p.z), rx, rz);
  const flat = (o, a) => o.q.setFromEuler(e.set(-Math.PI / 2, a, 0, 'YXZ'));   // lying face up, its top toward -z rotated by a
  const rows = phone ? 4 : 5;
  const rackPos = (i) => { let r = 0, n = i; while (n > r) { n -= r + 1; r++; } return [r, n]; }; // the i-th card: row r, place n
  const RS = 0.34, RZ0 = 0.72, RDZ = 0.36, RDX = 0.175;
  const hangCols = 5, hangRows = Math.ceil(N / hangCols);
  const F = [
    (i, t, o) => { // hero: hung over M like its lamps
      const c = i % hangCols, r = Math.floor(i / hangCols);
      o.p.set((c - (hangCols - 1) / 2) * 0.7, 2.02 + (c % 2 ? 0.26 : 0) + (r - (hangRows - 1) / 2) * 0.1 + Math.sin(t * 0.8 + i) * 0.02, (r - (hangRows - 1) / 2) * 1.15);
      faceYaw(o, camPos[0], Math.sin(t * 0.6 + i * 1.7) * 0.03, Math.sin(t * 0.9 + i) * 0.025);
      o.s = 1; o.f = 1; o.g = 1; o.beam = 1; o.wire = 1; o.lift = 0.3;
    },
    (i, t, o) => { // problem: dropped on the desk and the floor, screens dim
      const r = R[i], s = 0.5;
      const onDesk = i < (phone ? 3 : 5);
      if (onDesk) {
        o.p.set(DESK.x - 0.12 + (r[0] - 0.5) * 0.3, DESK.top + 0.003 + i * 0.002, DESK.z - 0.9 + i * (1.9 / (phone ? 3 : 5)) + (r[1] - 0.5) * 0.15);
        flat(o, (r[2] - 0.5) * 1.6 + Math.PI / 2);
      } else {
        const a = r[0] * Math.PI * 1.1 + 1.2, rad = 1.0 + r[1] * 1.9;
        o.p.set(DESK.x - 0.4 + Math.cos(a) * rad * 0.9, 0.003 + i * 0.0015, DESK.z + Math.sin(a) * rad);
        flat(o, r[2] * TAU);
        if (r[3] > 0.72) { o.p.y = 0.12; o.q.multiply(q2.setFromEuler(e.set(0.45, 0, 0))); }
      }
      o.s = s; o.f = 1; o.g = 0.5 + r[4] * 0.3; o.beam = 0; o.wire = 0; o.lift = 0.6;
    },
    (i, t, o) => { // built: an arch of screens around the door, waiting for the code
      const a = Math.PI * (-0.08 + 1.16 * (i / (N - 1)));
      o.p.set(WALL_X + 0.5 + Math.sin(a) * 0.12, 1.12 + Math.sin(a) * 1.62 + Math.sin(t * 0.9 + i) * 0.015, Math.cos(a) * 1.5 * (phone ? 0.85 : 1) - 0.05);
      yaw(o, Math.PI / 2, 0, (Math.cos(a)) * -0.15);
      o.s = 0.5; o.f = 1; o.g = 0.85; o.beam = 0; o.wire = 0; o.lift = 0.2;
    },
    (i, t, o) => { // today: lined up along M's rail
      const span = TL - 0.2, z = -span / 2 + (i + 0.5) * (span / N);
      o.p.set(TW / 2 + 0.12, RAIL + CARD_H * 0.24 + 0.004, z);
      yaw(o, Math.PI / 2, -0.08 + Math.sin(t * 1.4 - i * 0.5) * 0.01, 0);
      o.s = 0.48; o.f = 1; o.g = 1; o.beam = 0; o.wire = 0; o.lift = 0.35;
    },
    (i, t, o) => { // screens: one over every table, like a status light
      const j = i % T, slot = Math.floor(i / T), m = Math.ceil((N - j) / T);
      const [tx, tz] = TABLES[j];
      o.p.set(tx, (j === 0 ? 2.02 : 2.7) + Math.sin(t * 0.7 + i) * 0.02, tz + (slot - (m - 1) / 2) * 1.05);
      faceYaw(o, camPos[4], 0, Math.sin(t * 0.8 + i) * 0.02);
      o.s = j === 0 ? 1 : 0.85; o.f = 1; o.g = 1; o.beam = j === 0 ? 1 : 0.0; o.wire = 1; o.lift = 0.5;
    },
    (i, t, o) => { // game: a slow ring around the table, seen from above
      const a = (i / N) * TAU + t * 0.04;
      o.p.set(Math.cos(a) * 1.75, 1.45 + Math.sin(t * 0.7 + i) * 0.02, Math.sin(a) * 2.85);
      o.q.setFromEuler(e.set(-Math.PI / 2, 0, -a + Math.PI / 2, 'YXZ'));
      o.s = 0.7; o.f = 1; o.g = 0.95; o.beam = 0; o.wire = 0; o.lift = 0.4;
    },
    (i, t, o) => { // tech: racked in a triangle on the felt, apex toward the cue
      const [r, n] = rackPos(i);
      o.p.set((n - r / 2) * RDX, FELT + 0.004 + i * 0.0006, RZ0 - r * RDZ);
      flat(o, 0);
      o.s = RS; o.f = 1; o.g = 1; o.beam = 0; o.wire = 0; o.lift = 0.5;
    },
    (i, t, o) => { // cta: broken: scattered up into the room, turning slowly
      const [r, n] = rackPos(i), rr2 = R[i];
      tmp.set((n - r / 2) * RDX, 0, RZ0 - r * RDZ - (RZ0 + 0.3));
      const dir = tmp.normalize();
      const dist = 0.9 + rr2[0] * 2.2 + r * 0.2;
      o.p.set(dir.x * dist * 1.9 + (rr2[1] - 0.5) * 1.6, 1.35 + rr2[2] * 1.5 + Math.sin(t * 0.45 + i) * 0.06, RZ0 + 0.3 + dir.z * dist * 0.8);
      o.q.setFromEuler(e.set((rr2[3] - 0.5) * 1.6 + Math.sin(t * 0.3 + i) * 0.2, (rr2[4] - 0.5) * 2.4 + t * 0.12 * (rr2[5] - 0.5), (rr2[6] - 0.5) * 1.2));
      o.s = 0.62; o.f = 1; o.g = 1; o.beam = 0; o.wire = 0; o.lift = 0.6;
    },
  ];
  const NCH = F.length;
  const mk = () => ({ p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, f: 1, g: 1, beam: 0, wire: 0, lift: 0 });
  const A = mk(), B = mk();
  const cardP = Array.from({ length: N }, () => new THREE.Vector3());
  const cardQ = Array.from({ length: N }, () => new THREE.Quaternion());
  const cardS = new Float32Array(N), cardF = new Float32Array(N), cardG = new Float32Array(N), cardB = new Float32Array(N), cardWi = new Float32Array(N);
  const order = Array.from({ length: N }, (_, i) => i), dist = new Float32Array(N);
  const mtx = new THREE.Matrix4(), sc = new THREE.Vector3(), qI = new THREE.Quaternion();
  const doorPt = new THREE.Vector3(WALL_X, 1.25, 0.05);
  const surfaceY = (x, z) => {                       // what is under a point: a table, the desk, the floor
    for (const [tx, tz] of TABLES) if (Math.abs(x - tx) < TW / 2 + 0.2 && Math.abs(z - tz) < TL / 2 + 0.2) return FELT;
    if (Math.abs(x - DESK.x) < 0.4 && Math.abs(z - DESK.z) < DESK.len / 2) return DESK.top;
    return 0;
  };

  /* the camera path */
  const portrait = () => innerWidth / innerHeight < 1;
  let curves = null;
  function makeCurves() {
    const pt = portrait();
    const ps = [], ts = [];
    CAMK.forEach((c, i) => {
      ps.push(V3(pt && c.pp ? c.pp : c.pos)); ts.push(V3(pt && c.tp ? c.tp : c.tgt));
      if (i < VIA.length) { ps.push(V3(VIA[i][0])); ts.push(V3(VIA[i][1])); }
    });
    curves = { p: new THREE.CatmullRomCurve3(ps, false, 'centripetal'), t: new THREE.CatmullRomCurve3(ts, false, 'centripetal') };
  }
  makeCurves();
  const fovFor = (v) => {
    const a = innerWidth / innerHeight;
    if (a >= 1.6) return v;
    const h = Math.tan((v * Math.PI) / 360) * 1.6;
    return Math.min(84, Math.max(v, (Math.atan((h * (a < 1 ? 0.6 : 0.9)) / a) * 360) / Math.PI));
  };
  // the subject sits on the open side of the text: left of centre on a wide screen, above it on a phone
  const shiftOf = (ck) => (portrait() ? [0, ck.psy ?? -0.2] : [ck.sx ?? 0.34, ck.sy ?? 0]);

  /* post: bloom, then the strike, grain and vignette, then tone mapping */
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: floatRT ? THREE.HalfFloatType : THREE.UnsignedByteType, samples: 0 });
  const composer = new P.EffectComposer(renderer, rt);
  // the composer clones rt into renderTarget2, and renderTarget2 is its first readBuffer: the RenderPass always draws
  // into it (the buffers are re-aligned after every frame). So only that one multisamples; rt holds post output only.
  composer.renderTarget2.samples = phone ? 0 : 4;
  composer.addPass(new P.RenderPass(scene, camera));
  composer.addPass(new P.ShaderPass({ uniforms: { tDiffuse: { value: null } },
    vertexShader: STRIKE.vertexShader,
    fragmentShader: /* glsl */`uniform sampler2D tDiffuse; varying vec2 vUv;
      void main(){ vec3 c = texture2D(tDiffuse, vUv).rgb; c = (any(isnan(c)) || any(isinf(c))) ? vec3(0.0) : min(c, vec3(24.0)); gl_FragColor = vec4(c, 1.0); }` }));
  const bloom = new P.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.7, 0.62, 0.86);
  composer.addPass(bloom);
  if (!floatRT) for (const t of [bloom.renderTargetBright, ...bloom.renderTargetsHorizontal, ...bloom.renderTargetsVertical]) t.texture.type = THREE.UnsignedByteType;
  const strike = new P.ShaderPass({ ...STRIKE, uniforms: THREE.UniformsUtils.clone(STRIKE.uniforms) });
  strike.uniforms.uAcc.value = gold; strike.uniforms.uC.value = new THREE.Vector2(0.33, 0.5);
  composer.addPass(strike);
  composer.addPass(new P.OutputPass());

  const view = { w: innerWidth, h: innerHeight };   // the size the buffers and the anchors were made for
  function resize() {
    const w = innerWidth, h = innerHeight;
    view.w = w; view.h = h;
    const px = Math.min(dpr, Math.sqrt(PX_BUDGET / (w * h)));
    renderer.setPixelRatio(px);
    renderer.setSize(w, h, false);
    composer.setPixelRatio(px);
    composer.setSize(w, h);
    camera.aspect = w / h;
    strike.uniforms.uAspect.value = w / h;
    makeCurves();
    measure();
  }

  /* scroll → chapter: k runs 0..NCH-1, holding each formation while its text is centred */
  let anchors = new Array(NCH).fill(0);
  function measure() {
    const vh = view.h, max = Math.max(1, document.documentElement.scrollHeight - vh);
    anchors = ANCHORS.map((f) => clamp(f(vh, max), 0, max));
    for (let i = 1; i < NCH; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 1);
  }
  const kOf = (y) => {
    if (y <= anchors[0]) return 0;
    for (let i = 0; i < NCH - 1; i++) {
      if (y < anchors[i + 1]) {
        const f = (y - anchors[i]) / (anchors[i + 1] - anchors[i]);
        return i + 0.25 * f + 0.75 * (f * f * (3 - 2 * f));   // slow over the text, fast across the boundary
      }
    }
    return NCH - 1;
  };
  const scrollY_ = () => (lenis ? lenis.scroll : scrollY);

  /* pointer parallax on desktop */
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPtr = (ev) => { ptr.x = (ev.clientX / innerWidth) * 2 - 1; ptr.y = (ev.clientY / innerHeight) * 2 - 1; };
  if (hover) addEventListener('pointermove', onPtr, { passive: true });

  // resize: debounced; on a phone a height-only change under 150 px is the browser's toolbar sliding,
  // so nothing reallocates and the anchors stay (no false chapter cut)
  let rsT = 0;
  const onResize = () => {
    clearTimeout(rsT);
    rsT = setTimeout(() => { if (!(coarse && innerWidth === view.w && Math.abs(innerHeight - view.h) < 150)) resize(); }, 160);
  };
  resize();
  addEventListener('resize', onResize);
  const ro = new ResizeObserver(() => measure()); ro.observe(document.body);
  addEventListener('load', measure);

  /* the loop */
  let k = kOf(scrollY_()), kPrev = k, lastIdx = Math.round(k), raf = 0, last = performance.now(), t0 = last;
  let strikeT = -10, vel = 0, swingT = -10;
  const intro = { t: k < 0.3 ? 0 : 1 };
  const camP = new THREE.Vector3(), camT = new THREE.Vector3(), right = new THREE.Vector3(), camUp = new THREE.Vector3(), proj = new THREE.Vector3();
  const stats = { frames: 0, ms: 0, dpr, bloom: true, samples: [] };
  let govN = 0, govSum = 0, slowRuns = 0, last0 = performance.now();
  const lampOn = new Float32Array(T);
  const warm = new THREE.Color(1, 0.8, 0.55);
  const tmp2 = new THREE.Vector2();
  const pivot = new THREE.Vector3(), lq = new THREE.Quaternion(), lp = new THREE.Vector3();

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;
    time.value = t;

    // the scroll, smoothed once more so the flight never jerks
    const kT = kOf(scrollY_());
    kPrev = k; k = damp(k, kT, 3.4, dt);
    if (Math.abs(k - kT) < 1e-4) k = kT;
    vel = damp(vel, Math.abs((k - kPrev) / Math.max(dt, 1e-3)), 6, dt);
    const idx = Math.round(k);
    const c = Math.min(Math.floor(k), NCH - 2), f = k - c;
    if (idx !== lastIdx) {   // a chapter boundary: the cue strikes
      lastIdx = idx; strikeT = t; swingT = t;
      proj.set(...FOCUS[idx]).project(camera);
      strike.uniforms.uC.value.set(clamp(proj.x * 0.5 + 0.5, 0.08, 0.92), clamp(proj.y * 0.5 + 0.5, 0.1, 0.9));
    }
    if (intro.t < 1) intro.t = Math.min(1, intro.t + dt / 3.2);
    const ie = 1 - Math.pow(1 - intro.t, 3);

    // the camera on its spline
    const u = clamp(k / (NCH - 1));
    curves.p.getPoint(u, camP); curves.t.getPoint(u, camT);
    const fe = sstep(0, 1, f);
    const pt = portrait();
    camera.fov = fovFor(lerp(CAMK[c].fov, CAMK[c + 1].fov, fe));
    const rollOf = (ck) => (pt && ck.pr !== undefined ? ck.pr : ck.roll);
    const roll = lerp(rollOf(CAMK[c]), rollOf(CAMK[c + 1]), fe);
    // the opening: a glide in over the near table's felt, skimming its cushion
    camP.z += (1 - ie) * 3.6; camP.y -= (1 - ie) * 0.12;
    camP.x += Math.sin(t * 0.21) * 0.03; camP.y += Math.sin(t * 0.17 + 1) * 0.02;
    ptr.sx = damp(ptr.sx, ptr.x, 2.5, dt); ptr.sy = damp(ptr.sy, ptr.y, 2.5, dt);
    camera.position.copy(camP);
    camera.lookAt(camT);
    if (hover) {
      right.set(1, 0, 0).applyQuaternion(camera.quaternion); camUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(right, ptr.sx * 0.12).addScaledVector(camUp, -ptr.sy * 0.07);
      camera.lookAt(camT);
    }
    camera.rotateZ(roll);
    camera.updateProjectionMatrix();
    const s0 = shiftOf(CAMK[c]), s1 = shiftOf(CAMK[c + 1]);
    const shx = lerp(s0[0], s1[0], fe), shy = lerp(s0[1], s1[1], fe);
    camera.projectionMatrix.elements[8] += shx; camera.projectionMatrix.elements[9] += shy;
    camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert();
    pointScale.value = (renderer.getDrawingBufferSize(tmp2).y * 0.5) / Math.tan((camera.fov * Math.PI) / 360);

    // the hall's lamps: on for the opening, off for the night at the desk, back on one by one when the door opens
    for (let j = 0; j < T; j++) {
      const s0 = 2.16 + j * 0.045;
      let on = Math.max(1 - sstep(0.3, 0.72, k), sstep(s0, s0 + 0.05, k));
      if (k > s0 && k < s0 + 0.12) on *= Math.sin(t * 57 + j * 3) * Math.sin(t * 23 + j) > -0.1 ? 1 : 0.15; // the tubes catching
      lampOn[j] = on;
    }
    const swing = (j) => { const st = t - swingT; return (st > 0 ? 0.055 * Math.exp(-st / 1.6) * Math.sin(st * 2.6 + j * 0.7) : 0) + Math.sin(t * 0.6 + j * 1.3) * 0.006; };
    for (let j = 0; j < NL; j++) {
      const [tx, tz] = LAMPS[j], on = lampOn[j + 1], a = swing(j + 1);
      pivot.set(tx, 4.6, tz);
      lq.setFromEuler(e.set(a, 0, a * 0.4));
      lp.set(0, LAMP_Y - 4.6, 0).applyQuaternion(lq).add(pivot);
      shade.setMatrixAt(j, mtx.compose(lp, lq, sc.set(1, 1, 1)));
      bulbs.setMatrixAt(j, mtx);
      bulbs.setColorAt(j, ballCol.copy(warm).multiplyScalar(0.06 + 1.5 * on));
      lampBeams.setMatrixAt(j, mtx.compose(lp, lq, sc.set(1, LAMP_Y - FELT, 1)));
      aLampFade.array[j] = on;
      for (const s of [-1, 1]) { tmp.set(0, 0.17, s * 0.95).applyQuaternion(lq).add(lp); chains.setMatrixAt(j * 2 + (s > 0 ? 1 : 0), mtx.compose(tmp, lq, sc.set(1, 4.6 - tmp.y, 1))); }
      const sp = spots[j + 1]; if (sp) { sp.position.copy(lp); sp.intensity = sp.userData.base * on; }
    }
    spots[0].intensity = spots[0].userData.base * lampOn[0];
    for (let j = 0; j < T; j++) {
      const L = 0.035 + 2.1 * lampOn[j];
      for (const m of clothMeshes) m.setColorAt(j, ballCol.setRGB(L, L * 0.88, L * 0.7));
      aSpillT.array[j] = lampOn[j];
    }
    for (const m of clothMeshes) m.instanceColor.needsUpdate = true;
    aSpillT.needsUpdate = true;
    for (const m of [shade, bulbs, chains, lampBeams]) m.instanceMatrix.needsUpdate = true;
    bulbs.instanceColor.needsUpdate = true; aLampFade.needsUpdate = true;
    dustU.uOn.value.set(lampOn[0], lampOn[1], 0, 0);
    neonLight.intensity = 5 * (0.92 + 0.08 * Math.sin(t * 31) * Math.sin(t * 7));
    const nf = Math.sin(t * 13) * Math.sin(t * 5.3) > 0.8 ? 0.35 : 1;   // the lobby's neon stutters
    neonLobby.material.color.setScalar(3.2 * nf);

    // the booking: the code goes in digit by digit, the lock turns green, the door swings into the hall
    const kp = [1.62, 1.75, 1.88, 2.0];
    let n = 0, lit = '';
    kp.forEach((s, i) => { if (k >= s) { n = i + 1; if (k < s + 0.07) lit = CODE[i]; } });
    setKeys({ lit, n, open: k >= 2.08 });
    const open = easeIO(sstep(2.1, 2.44, k));
    doorPivot.rotation.y = -1.75 * open;
    aSpill.array[0] = open * lampOn[1] * 0.55; aSpill.needsUpdate = true;
    doorLight.intensity = open * lampOn[1] * 9;

    // the balls: two roll on N, M's set steps off the cloth for the rack, the cue ball takes the break
    const breakF = c === 6 ? f : c > 6 ? 1 : 0;
    const mGone = sstep(5.45, 5.8, k);
    balls.forEach((b, i) => {
      const [tx, tz] = TABLES[b.t];
      let x = b.x, z = b.z, s = 1;
      if (b.roll) {
        const tri = (v, h) => { const p = ((v + h) % (4 * h) + 4 * h) % (4 * h); return p < 2 * h ? p - h : 3 * h - p; };
        const hx = TW / 2 - BALL, hz = TL / 2 - BALL;
        x = tri(b.x + b.roll[0] * t, hx); z = tri(b.z + b.roll[1] * t, hz);
        const dx = x - b.p.x + tx, dz = z - b.p.z + tz, d = Math.hypot(dx, dz);
        if (d > 1e-5 && d < 0.2) { tmp.set(dz, 0, -dx).normalize(); b.q.premultiply(q2.setFromAxisAngle(tmp, d / BALL)); }
      }
      if (b.m) s = 1 - mGone;
      if (i === CUEBALL) {
        const hit = sstep(0.44, 0.5, breakF), roll2 = sstep(0.5, 0.95, breakF);
        z = lerp(1.25, RZ0 + 0.17 + BALL, hit) - roll2 * 0.5 * (1 - roll2 * 0.4);
      }
      b.p.set(tx + x, FELT + BALL, tz + z);
      ballMesh.setMatrixAt(i, mtx.compose(b.p, b.q, sc.setScalar(s)));
      ballShadow.setMatrixAt(i, mtx.compose(tmp.set(b.p.x + 0.006, FELT + 0.004, b.p.z + 0.004), qI, sc.setScalar(s)));
    });
    ballMesh.instanceMatrix.needsUpdate = true; ballShadow.instanceMatrix.needsUpdate = true;
    // the cue: in from the tech chapter, drawn back, struck through
    cue.visible = k > 5.4;
    if (cue.visible) {
      const back = easeIO(sstep(0.12, 0.4, breakF)), thru = sstep(0.4, 0.46, breakF);
      const gap = 0.05 + back * 0.28 - thru * 0.37 + (1 - sstep(5.4, 5.9, k)) * 0.6;
      const el = 0.1;
      cue.position.set(0, FELT + BALL + 0.004, 1.25 + BALL + gap);
      cue.rotation.set(0, -Math.PI / 2, el);
    }
    rackMat.opacity = sstep(5.55, 5.85, k) * (1 - sstep(6.2, 6.4, k));
    rack.visible = rackMat.opacity > 0.01;

    // the cards: formation c → c + 1, each card on its own beat
    for (let i = 0; i < N; i++) {
      F[c](i, t, A, k); F[c + 1](i, t, B, k);
      const s = R[i][7];
      let b;
      if (c === 6) { const [r] = rackPos(i); b = 1 - Math.pow(1 - clamp((f - 0.5 - r * 0.02) / 0.42), 4); }  // the break: all at once
      else if (c === 2) b = easeIO(clamp((f - 0.3 - s * 0.25) / 0.45));                                      // through the open door
      else b = easeIO(clamp((f - 0.1 - s * 0.28) / 0.52));
      if (c === 2) { // a quadratic through the doorway
        const u1 = 1 - b;
        cardP[i].copy(A.p).multiplyScalar(u1 * u1).addScaledVector(doorPt, 2 * u1 * b).addScaledVector(B.p, b * b);
      } else {
        cardP[i].lerpVectors(A.p, B.p, b);
        cardP[i].y += Math.sin(Math.PI * b) * lerp(A.lift, B.lift, 0.5);
      }
      cardQ[i].slerpQuaternions(A.q, B.q, b);
      cardS[i] = lerp(A.s, B.s, b) * (0.15 + 0.85 * sstep((i / N) * 0.5, (i / N) * 0.5 + 0.5, ie));
      cardF[i] = lerp(A.f, B.f, b);
      cardG[i] = lerp(A.g, B.g, b);
      cardB[i] = A.beam * Math.pow(1 - b, 3) + B.beam * Math.pow(b, 3);
      cardWi[i] = A.wire * Math.pow(1 - b, 3) + B.wire * Math.pow(b, 3);
      dist[i] = cardP[i].distanceToSquared(camera.position);
    }
    order.sort((a, b) => dist[b] - dist[a]);
    for (let j = 0; j < N; j++) {
      const i = order[j];
      sc.setScalar(cardS[i]);
      mtx.compose(cardP[i], cardQ[i], sc);
      cards.setMatrixAt(j, mtx); halos.setMatrixAt(j, mtx);
      aCell.array[j] = i % SHOTS.length; aSeed.array[j] = R[i][6]; aFade.array[j] = cardF[i]; aGlow.array[j] = cardG[i];
      // under a hanging phone: its beam down to what is below, and the pool it lights there
      const bottom = cardP[i].y - (CARD_H / 2) * cardS[i];
      const below = surfaceY(cardP[i].x, cardP[i].z);
      const hgt = Math.max(0.05, bottom - below);
      aBeam.array[j] = cardB[i];
      cardBeams.setMatrixAt(j, mtx.compose(tmp.set(cardP[i].x, bottom, cardP[i].z), qI, sc.set(cardS[i], hgt, cardS[i])));
      pools.setMatrixAt(j, mtx.compose(tmp.set(cardP[i].x, below + 0.003, cardP[i].z), qI, sc.setScalar(0.6 + hgt * 0.7)));
      const top = cardP[i].y + (CARD_H / 2) * cardS[i];
      wirePos.set([cardP[i].x, top, cardP[i].z, cardP[i].x, 4.6, cardP[i].z], j * 6);
      const wa = cardWi[i] * 0.55;
      wireCol.set([0.9, 0.78, 0.5, wa, 0.9, 0.78, 0.5, 0], j * 8);
    }
    for (const m of [cards, halos, cardBeams, pools]) m.instanceMatrix.needsUpdate = true;
    for (const a of [aCell, aSeed, aFade, aGlow, aBeam]) a.needsUpdate = true;
    wireGeo.attributes.position.needsUpdate = true; wireGeo.attributes.color.needsUpdate = true;

    // the crossing: a cue strike on every boundary, plus the scroll's own speed
    const gp = (t - strikeT) / 0.95;
    const env = gp >= 0 && gp < 1 ? (gp < 0.07 ? gp / 0.07 : Math.exp(-(gp - 0.07) * 5.2)) : 0;
    strike.uniforms.uAmt.value = env;
    strike.uniforms.uRing.value = Math.max(0, gp) * 1.15;
    strike.uniforms.uVel.value = clamp(vel);
    strike.uniforms.uTime.value = t;

    composer.render(dt);
    if (composer.readBuffer !== composer.renderTarget2) composer.swapBuffers();   // the scene draws into the multisampled one

    // a small governor: steps the pixel ratio down (then the bloom off) if frames run long
    stats.frames++; stats.ms = dt * 1000;
    if (stats.frames > 150 && now - last0 < 100) { govN++; govSum += now - last0; }
    last0 = now;
    if (govN >= 120 && !dbgOn) {
      const avg = govSum / govN; govN = 0; govSum = 0;
      stats.samples.push(Math.round(avg * 10) / 10);
      slowRuns = avg > 26 ? slowRuns + 1 : 0;
      if (slowRuns >= 2) {
        slowRuns = 0;
        if (dpr > 0.75) { dpr = Math.max(0.75, dpr - 0.25); stats.dpr = dpr; resize(); }
        else if (bloom.enabled) { bloom.enabled = false; stats.bloom = false; }
      }
    }
    if (stats.frames === 2) root.classList.add('dim-greenroom-ready');
  }

  // the rack's wooden triangle, around the racked phones
  {
    const [r4] = [rows - 1];
    const apex = new THREE.Vector3(0, FELT + 0.03, RZ0 + RS * CARD_H / 2 + 0.07);
    const baseZ = RZ0 - r4 * RDZ - RS * CARD_H / 2 - 0.05, hw = (r4 / 2) * RDX + RS * CARD_W / 2 + 0.16;
    const pts = [apex, new THREE.Vector3(-hw, FELT + 0.03, baseZ), new THREE.Vector3(hw, FELT + 0.03, baseZ)];
    for (let i = 0; i < 3; i++) {
      const a = pts[i], b = pts[(i + 1) % 3], len = a.distanceTo(b);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.05, len + 0.04), rackMat);
      bar.position.copy(a).add(b).multiplyScalar(0.5);
      bar.lookAt(b.x, bar.position.y, b.z);
      rack.add(bar);
    }
  }

  /* lifecycle: pause when hidden, dispose on the way out, hand back to the page's world on a lost context */
  let alive = true, started = false;
  const play = () => { if (alive && !raf && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const pause = () => { cancelAnimationFrame(raf); raf = 0; };
  const onVis = () => (document.hidden ? pause() : play());
  const onHide = (ev) => { if (ev.persisted) pause(); else dispose(); };
  // back from the bfcache: calm mode may have been switched on in another tab (or by the device) meanwhile
  const onShow = (ev) => { if (!ev.persisted || !alive) return; if (calmNow()) location.reload(); else play(); };
  function dispose() {
    if (!alive) return;
    alive = false; pause(); clearTimeout(rsT);
    document.removeEventListener('visibilitychange', onVis);
    removeEventListener('resize', onResize); removeEventListener('pointermove', onPtr); removeEventListener('load', measure);
    removeEventListener('pagehide', onHide); removeEventListener('pageshow', onShow);
    ro.disconnect();
    disposeScene(scene);
    for (const p of composer.passes) p.dispose?.();
    composer.dispose(); renderer.dispose();
  }
  canvas.addEventListener('webglcontextlost', (ev) => {
    ev.preventDefault(); dispose();
    if (started) onLost?.();   // before the start, the failed build hands back itself
  });
  addEventListener('pagehide', onHide); addEventListener('pageshow', onShow);
  document.addEventListener('visibilitychange', onVis);

  // compile before the first frame so the opening does not hitch, then one frame through the whole chain:
  // compileAsync resolves even when a shader fails, so the error flag is the only honest answer
  try { await renderer.compileAsync(scene, camera); } catch { /* compiles on the first draw */ }
  if (!alive) throw new Error('the context went away while compiling');
  composer.render(0);
  if (composer.readBuffer !== composer.renderTarget2) composer.swapBuffers();
  if (shaderFailed) { dispose(); throw new Error('a shader did not compile'); }
  started = true;
  play();
  window.__gdim = { stats, get k() { return k; }, anchors: () => anchors, dispose };
  if (dbgOn) Object.assign(window.__gdim, { bloom, renderer, composer, scene, camera, rt, setDpr(v) { dpr = v; resize(); } });
}
