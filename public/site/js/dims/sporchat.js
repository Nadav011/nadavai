// dims/sporchat.js: SporChat's dimension (2026-10-28). Nadav, on the flat shader world: "not at all a complete dimension
// of each app". So this page is a place: a night stadium built as real geometry (pitch, stands with a crowd, four
// floodlight towers with their beams, the tunnel, the scoreboard, haze), and the app's real screens are physical phone
// cards inside it. The scroll flies one camera along a spline through the stadium; each chapter of the page is its own
// formation of the cards, and every chapter boundary tears the frame with a chromatic glitch-wipe.
//
//   hero       the camera comes up the tunnel; the cards float in a slow cloud over the near half of the pitch
//   problem    the cards scatter and tumble across the whole bowl (the crowded group chat)
//   built      they snap into one ordered wall: a room per match
//   now        the wall winds into a rising helix (live, and version 4 being built)
//   screens    the camera dives into one card until the screen fills the frame
//   game       pitch level at the goal mouth, the cards stand behind the goal like giant screens
//   tech       a ring of cards orbits the camera on the centre circle
//   cta        the cards fly up into the night, the camera settles over the centre spot
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

const SHOTS = ['room', 'match', 'arena', 'chats', 'feed', 'leagues'].map((n) => `/site/assets/work/sporchat-${n}.webp`);
const ACC = [0x8c / 255, 0xc2 / 255, 1];          // the app's light, #8CC2FF
const CARD_W = 3.0, CARD_H = 6.36, CARD_R = 0.42; // a phone card in metres (the screenshots are 520 × 1103)

// pitch 105 × 68 along x / z, the centre spot at the origin; the bowl is a superellipse around it
const A0 = 58, B0 = 41, NE = 3.2;
const PROF = [[0, 0], [0, 1.4], [1.2, 1.4], [20, 11.5], [20, 14.6], [21.6, 15.3], [42, 32], [42, 35], [44, 35.6]];
const KIND = [0, 4, 1, 2, 4, 3, 0, 4]; // per profile segment: 0 wall, 1 lower tier, 2 the lit band, 3 upper tier, 4 ledge
const TUN = { x: 4.2, h: 4.6, z0: 37.5, z1: 82 };
const TOWERS = [[80, 66], [-80, 66], [80, -66], [-80, -66]];
const TOWER_H = 58;

// the camera's chapters: position, target, vertical fov (for a 16:10 screen), roll; pp / tp override on portrait screens
const CAMK = [
  { pos: [0, 1.9, 35.5], tgt: [6, 6.2, 0], fov: 54, roll: 0, tp: [-6, 7.5, 0], pp: [0, 1.9, 37] },              // hero, out of the tunnel mouth
  { pos: [24, 16, 31], tgt: [-6, 11, -4], fov: 56, roll: -0.07, tp: [-8, 12, -4], pp: [14, 13, 24] },                           // problem
  { pos: [9, 14.5, 33], tgt: [-4, 15.5, -6], fov: 46, roll: 0, tp: [-15, 15.5, -8], pp: [-15, 14.5, 21] },       // built
  { pos: [16, 10, 25], tgt: [-4, 16.5, -2], fov: 50, roll: 0.04, tp: [-12, 16, -2], pp: [2, 11, 17] },         // now
  { pos: [0, 10, 17.4], tgt: [0, 10, 10], fov: 40, roll: 0, pp: [0, 10, 14.8] },                                // screens: the dive
  { pos: [-33, 2.0, 7], tgt: [-52.5, 4.6, 0], fov: 50, roll: 0, tp: [-52.5, 5, 0], pp: [-31, 2.4, 3] },         // game, at the goal
  { pos: [0, 7, 0], tgt: [-11, 6.4, -7], fov: 64, roll: 0, tp: [-6, 6.4, -12] },                               // tech, inside the ring
  { pos: [0, 25, 11], tgt: [5, 0, 0], fov: 44, roll: 0, tp: [0, 0, 2], pp: [0, 34, 8] },                       // cta, over the centre spot
];
const VIA = [ // the flight between chapters: [pos, target] halfway from chapter c to c + 1
  [[9, 8, 31], [0, 8.5, -2]],
  [[22, 21, 36], [-6, 13, -6]],
  [[16, 12, 34], [-6, 15, -4]],
  [[10, 12, 30], [-2, 12, 4]],
  [[-12, 5.5, 18], [-34, 5, 2]],
  [[-18, 4.5, 6], [-30, 6, -4]],
  [[0, 15, 6], [0, 2, -2]],
];
// where each chapter sits in the page: the scroll position at which the camera holds that formation
const ANCHORS = [
  () => 0,
  (vh) => mid('.wks__item:nth-child(1)', vh),
  (vh) => mid('.wks__item:nth-child(2)', vh),
  (vh) => mid('.wks__item:nth-child(3)', vh),
  (vh) => top('.wkg__cloud') - vh * 1.02,
  (vh) => mid('.wkx__stage', vh),
  (vh) => mid('.wkt', vh),
  (vh, max) => max,
];
function top(sel) { const el = document.querySelector(sel); return el ? el.getBoundingClientRect().top + scrollY : 0; }
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
  // the cards are the app now: the hero's poster phone (and its own WebGL phone) step aside, but only once the stadium draws
  const stage = document.querySelector('.wkh__stage');
  const parent = stage?.parentNode, next = stage?.nextSibling;
  const back = () => {
    root.classList.remove('dim-on', 'dim-ready');
    document.querySelector('.dim')?.remove();
    if (stage && parent && !stage.isConnected) parent.insertBefore(stage, next);
  };
  root.classList.add('dim-on');
  let timer = 0;
  const late = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`not loaded in ${LOAD_MS / 1000} s`)), LOAD_MS); });
  const loaded = (p) => Promise.race([p, late]);
  try {
    const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }] = await loaded(Promise.all([
      import('three'),
      import('three/addons/postprocessing/EffectComposer.js'),
      import('three/addons/postprocessing/RenderPass.js'),
      import('three/addons/postprocessing/UnrealBloomPass.js'),
      import('three/addons/postprocessing/ShaderPass.js'),
      import('three/addons/postprocessing/OutputPass.js'),
    ]));
    await build(THREE, { EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass }, { lenis, loaded, onLost: () => { back(); onLost?.(); } });
    stage?.remove();
    return true;
  } catch (e) {
    console.warn('[dim] the stadium is off, the page keeps its shader world', e);
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

function drawPitch(g, W, H) {
  const PW = 130, PH = 92, s = W / PW;                     // the plane is 130 × 92 m, the pitch 105 × 68 in its middle
  const X = (m) => (m + PW / 2) * s, Y = (m) => (m + PH / 2) * s;
  // mown stripes, a little light in the middle of the field, then grain
  const n = 22;
  for (let i = 0; i < n; i++) {
    g.fillStyle = i % 2 ? '#1f5a2c' : '#286a35';
    g.fillRect(Math.floor((i / n) * W), 0, Math.ceil(W / n) + 1, H);
  }
  const glow = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.62);
  glow.addColorStop(0, 'rgba(255,255,230,.10)'); glow.addColorStop(0.6, 'rgba(0,0,0,0)'); glow.addColorStop(1, 'rgba(0,10,0,.45)');
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 26000; i++) {
    const x = Math.random() * W, y = Math.random() * H, l = Math.random();
    g.fillStyle = l > 0.5 ? `rgba(120,190,110,${0.05 + l * 0.06})` : `rgba(0,20,5,${0.08 + l * 0.1})`;
    g.fillRect(x, y, 1 + Math.random() * 2, 1 + Math.random() * 2);
  }
  // wear: the goal mouths and the centre
  for (const [cx, cy, r] of [[-50, 0, 7], [50, 0, 7], [0, 0, 5]]) {
    const w = g.createRadialGradient(X(cx), Y(cy), 1, X(cx), Y(cy), r * s);
    w.addColorStop(0, 'rgba(70,60,30,.28)'); w.addColorStop(1, 'rgba(70,60,30,0)');
    g.fillStyle = w; g.fillRect(X(cx) - r * s, Y(cy) - r * s, r * 2 * s, r * 2 * s);
  }
  // the chalk
  g.strokeStyle = 'rgba(240,244,236,.93)'; g.fillStyle = 'rgba(240,244,236,.93)'; g.lineWidth = 0.14 * s;
  const L = 52.5, Wd = 34;
  g.strokeRect(X(-L), Y(-Wd), 2 * L * s, 2 * Wd * s);
  g.beginPath(); g.moveTo(X(0), Y(-Wd)); g.lineTo(X(0), Y(Wd)); g.stroke();
  g.beginPath(); g.arc(X(0), Y(0), 9.15 * s, 0, TAU); g.stroke();
  g.beginPath(); g.arc(X(0), Y(0), 0.3 * s, 0, TAU); g.fill();
  for (const sd of [-1, 1]) {
    const gx = sd * L;
    g.strokeRect(Math.min(X(gx), X(gx - sd * 16.5)), Y(-20.16), 16.5 * s, 40.32 * s);
    g.strokeRect(Math.min(X(gx), X(gx - sd * 5.5)), Y(-9.16), 5.5 * s, 18.32 * s);
    g.beginPath(); g.arc(X(gx - sd * 11), Y(0), 0.25 * s, 0, TAU); g.fill();
    const a = Math.acos(5.5 / 9.15);
    g.beginPath();
    if (sd < 0) g.arc(X(gx - sd * 11), Y(0), 9.15 * s, -a, a); else g.arc(X(gx - sd * 11), Y(0), 9.15 * s, Math.PI - a, Math.PI + a);
    g.stroke();
    for (const sz of [-1, 1]) { g.beginPath(); g.arc(X(gx), Y(sz * Wd), 1 * s, 0, TAU); g.stroke(); }
  }
}

function drawBoards(g, W, H) {
  g.fillStyle = '#04070c'; g.fillRect(0, 0, W, H);
  g.textBaseline = 'middle';
  const items = [['SporChat', '#8CC2FF', 800], ['LIVE ●', '#ff5a5a', 700], [__t('sporchat.dims.led.room'), '#e8eef7', 600], ['SporChat', '#8CC2FF', 800], [__t('sporchat.dims.led.commentator'), '#e8eef7', 600]];
  const seg = W / items.length;
  items.forEach(([t, c, w], i) => {
    g.font = `${w} ${Math.round(H * 0.56)}px Rubik, Archivo, system-ui, sans-serif`;
    g.fillStyle = c; g.direction = /[֐-׿]/.test(t) ? 'rtl' : 'ltr';
    g.textAlign = 'center';
    g.fillText(t, seg * i + seg / 2, H * 0.53);
  });
  g.fillStyle = 'rgba(140,194,255,.5)'; g.fillRect(0, 0, W, 3); g.fillRect(0, H - 3, W, 3);
}

function drawScoreboard(g, W, H) {
  g.fillStyle = '#03060b'; g.fillRect(0, 0, W, H);
  // LED texture
  g.fillStyle = 'rgba(140,194,255,.05)';
  for (let y = 0; y < H; y += 6) for (let x = 0; x < W; x += 6) g.fillRect(x, y, 3, 3);
  g.textBaseline = 'middle'; g.textAlign = 'center';
  g.font = `800 ${H * 0.16}px Archivo, Rubik, system-ui, sans-serif`;
  g.fillStyle = '#8CC2FF'; g.direction = 'ltr'; g.fillText('SporChat', W / 2, H * 0.16);
  g.font = `800 ${H * 0.38}px Archivo, Rubik, system-ui, sans-serif`;
  g.fillStyle = '#ffffff'; g.fillText('1 – 1', W / 2, H * 0.55);
  g.direction = 'rtl'; g.font = `600 ${H * 0.12}px Rubik, system-ui, sans-serif`; g.fillStyle = '#cfe2ff';
  g.fillText(__t('sporchat.try.team.blue'), W * 0.83, H * 0.55); g.fillText(__t('sporchat.try.team.red'), W * 0.17, H * 0.55);
  g.direction = 'ltr'; g.font = `700 ${H * 0.11}px Archivo, Rubik, sans-serif`; g.fillStyle = '#ff6b6b';
  g.fillText('● LIVE  63′', W / 2, H * 0.86);
}

function drawLamps(g, W, H) {
  g.fillStyle = '#0b0f14'; g.fillRect(0, 0, W, H);
  const cols = 8, rows = 5, cw = W / cols, ch = H / rows;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const x = cw * (c + 0.5), y = ch * (r + 0.5), rr = Math.min(cw, ch) * 0.42;
    const gr = g.createRadialGradient(x, y, 0, x, y, rr);
    gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.55, '#e6f0ff'); gr.addColorStop(1, 'rgba(160,190,255,0)');
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, TAU); g.fill();
  }
}

function drawGlare(g, W, H) {
  const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.12, 'rgba(220,235,255,.55)');
  gr.addColorStop(0.4, 'rgba(140,180,255,.12)'); gr.addColorStop(1, 'rgba(140,180,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(220,235,255,.22)'; g.fillRect(0, H / 2 - 1, W, 2); // the streak of an anamorphic lens
}

function drawHaze(g, W, H) {
  for (let i = 0; i < 9; i++) {
    const x = W * (0.25 + Math.random() * 0.5), y = H * (0.3 + Math.random() * 0.4), r = W * (0.18 + Math.random() * 0.22);
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, 'rgba(255,255,255,.22)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }
}

/* ── shaders ────────────────────────────────────────────────── */
const FOG_ADD = /* glsl */`
#ifdef USE_FOG
  float ff_ = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  gl_FragColor.rgb *= 1.0 - ff_;
#endif`;

const CARD_VS = /* glsl */`
attribute float aCell; attribute float aSeed; attribute float aFade; attribute float aFocus;
varying vec2 vUv; varying float vCell, vSeed, vFade, vFocus; varying vec3 vN, vV;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vCell = aCell; vSeed = aSeed; vFade = aFade; vFocus = aFocus;
  vec4 mvPosition = modelViewMatrix * instanceMatrix * vec4(position, 1.0);
  vN = normalize(mat3(modelViewMatrix) * mat3(instanceMatrix) * vec3(0.0, 0.0, 1.0));
  vV = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const CARD_FS = /* glsl */`
uniform sampler2D uAtlas; uniform vec2 uCells; uniform vec2 uSize; uniform float uR; uniform vec3 uAcc; uniform float uTime;
varying vec2 vUv; varying float vCell, vSeed, vFade, vFocus; varying vec3 vN, vV;
#include <fog_pars_fragment>
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main(){
  vec2 p = (vUv - 0.5) * uSize;
  float d = sdRB(p, uSize * 0.5, uR);
  float aa = max(fwidth(d), 1e-4);
  float a = 1.0 - smoothstep(-aa, aa, d);
  if (a < 0.01) discard;
  vec3 N = normalize(vN), V = normalize(vV);
  float ndv = min(abs(dot(N, V)), 1.0);
  float fres = pow(1.0 - ndv, 3.0);
  vec3 col;
  if (gl_FrontFacing) {
    float ci = floor(vCell + 0.5), cy = floor((ci + 0.5) / uCells.x);   // not mod(): 4.0 / 4.0 can land a hair under 1 on the GPU
    vec2 cell = vec2(ci - cy * uCells.x, cy);
    vec2 inset = vec2(0.0285, 0.004);                       // the screenshot inside its cell (483 × 1024 of 512 × 1024)
    vec2 suv = vec2(mix(inset.x, 1.0 - inset.x, vUv.x), mix(inset.y, 1.0 - inset.y, vUv.y));
    vec2 auv = vec2((cell.x + suv.x) / uCells.x, 1.0 - (cell.y + 1.0 - suv.y) / uCells.y);
    col = texture2D(uAtlas, auv).rgb * (0.82 + 0.45 * vFocus);
    // glass: a soft diagonal sheen that slides as the card turns
    float s = vUv.x * 0.75 + vUv.y * 0.55 + (V.x - V.y) * 0.35 + vSeed;
    col += vec3(0.75, 0.85, 1.0) * exp(-((fract(s) - 0.5) * 7.0) * ((fract(s) - 0.5) * 7.0)) * 0.07;
  } else {
    // the back: dark glass, a camera island and the app's mark
    col = vec3(0.012, 0.017, 0.026) + vec3(0.02, 0.03, 0.05) * (1.0 - vUv.y);
    vec2 cam = p - vec2(-uSize.x * 0.5 + 0.62, uSize.y * 0.5 - 0.72);
    float ci = sdRB(cam, vec2(0.42), 0.18);
    col = mix(col, vec3(0.05, 0.06, 0.075), 1.0 - smoothstep(-0.01, 0.01, ci));
    float lens = min(length(cam - vec2(-0.16, 0.16)), length(cam - vec2(0.16, -0.16))) - 0.11;
    col = mix(col, vec3(0.0), 1.0 - smoothstep(-0.01, 0.01, lens));
    float mark = abs(length(p - vec2(0.0, 0.4)) - 0.42) - 0.035;
    col += uAcc * 0.5 * (1.0 - smoothstep(0.0, 0.02, mark));
  }
  // the titanium band around the glass, catching the floodlights at grazing angles
  float ring = smoothstep(-0.085, -0.045, d);
  col = mix(col, vec3(0.42, 0.46, 0.52) * (0.35 + fres * 2.2), ring);
  col += uAcc * fres * 0.28;
  gl_FragColor = vec4(col, a * vFade);
  #include <fog_fragment>
}`;

const HALO_FS = /* glsl */`
uniform vec2 uSize; uniform float uR; uniform vec3 uAcc; uniform vec2 uGeo;
varying vec2 vUv; varying float vCell, vSeed, vFade, vFocus; varying vec3 vN, vV;
#include <fog_pars_fragment>
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main(){
  vec2 p = (vUv - 0.5) * uGeo;
  float d = sdRB(p, uSize * 0.5, uR);
  if (d < 0.0) discard;
  float g = exp(-d * 1.5) * 0.16 + exp(-d * 6.0) * 0.22;
  gl_FragColor = vec4(uAcc * g * (0.45 + vFocus * 1.4) * vFade, 1.0);
  ${FOG_ADD}
}`;

const SHADOW_VS = /* glsl */`
attribute float aOp; varying vec2 vUv; varying float vOp;
void main(){ vUv = uv; vOp = aOp; gl_Position = projectionMatrix * modelViewMatrix * instanceMatrix * vec4(position, 1.0); }`;
const SHADOW_FS = /* glsl */`
varying vec2 vUv; varying float vOp;
void main(){ float r = length(vUv - 0.5) * 2.0; float a = pow(clamp(1.0 - r, 0.0, 1.0), 1.6) * vOp; gl_FragColor = vec4(0.0, 0.0, 0.0, a); }`;

const BOWL_VS = /* glsl */`
attribute float aKind; attribute vec2 aSt;
varying float vKind; varying vec2 vSt; varying vec3 vW;
#include <fog_pars_vertex>
void main(){
  vKind = aKind; vSt = aSt;
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const BOWL_FS = /* glsl */`
uniform float uTime; uniform vec3 uAcc;
varying float vKind; varying vec2 vSt; varying vec3 vW;
#include <fog_pars_fragment>
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main(){
  // spill from the floodlights: brighter low and towards the pitch
  float spill = 0.55 + 0.45 * smoothstep(36.0, 4.0, vW.y);
  vec3 col = vec3(0.030, 0.036, 0.048) * spill;
  float k = vKind;
  if (k > 0.5 && k < 1.5 || k > 2.5 && k < 3.5) {
    // seat rows: a dark step every 0.85 m, the seats a deep blue
    float rows = vSt.y * (k < 1.5 ? 13.0 : 20.0);
    float edge = smoothstep(0.0, 0.12, fract(rows)) * smoothstep(1.0, 0.8, fract(rows));
    col = mix(vec3(0.012, 0.014, 0.02), vec3(0.035, 0.05, 0.085) * spill, edge);
    col *= 0.85 + 0.3 * h21(floor(vec2(vSt.x * 900.0, rows)));
  } else if (k > 1.5 && k < 2.5) {
    // the hospitality band: a strip of warm windows and the app's light
    float win = step(0.18, fract(vSt.x * 520.0)) * smoothstep(0.15, 0.3, vSt.y) * smoothstep(0.75, 0.6, vSt.y);
    float lit = step(0.35, h21(vec2(floor(vSt.x * 520.0), 3.0)));
    col = vec3(0.02, 0.022, 0.03) + vec3(1.0, 0.82, 0.6) * win * lit * 0.9;
    col += uAcc * 1.6 * smoothstep(0.86, 0.95, vSt.y) * smoothstep(1.0, 0.95, vSt.y);
  } else if (k > 3.5) {
    // ledges and the rim: the rim carries a line of light
    col = vec3(0.04, 0.045, 0.055) * spill;
    col += uAcc * 0.9 * step(31.0, vW.y) * smoothstep(0.6, 0.9, vSt.y);
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;

const CROWD_VS = /* glsl */`
attribute vec3 aCol; attribute float aR;
uniform float uTime; uniform float uScale;
varying vec3 vCol; varying float vFlash;
#include <fog_pars_vertex>
float h11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
void main(){
  float cyc = uTime * 0.65 + aR * 97.0;
  float on = step(0.982, h11(aR * 913.0 + floor(cyc)));
  vFlash = on * exp(-fract(cyc) * 16.0);
  vCol = aCol;
  vec3 p = position; p.y += sin(uTime * 2.4 + aR * 60.0) * 0.05;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = clamp((0.44 + vFlash * 1.1) * uScale / -mvPosition.z, 1.0, 14.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const CROWD_FS = /* glsl */`
varying vec3 vCol; varying float vFlash;
#include <fog_pars_fragment>
void main(){
  vec2 c = gl_PointCoord - 0.5; float r = dot(c, c);
  if (r > 0.25) discard;
  gl_FragColor = vec4(vCol + vec3(9.0, 9.5, 10.0) * vFlash * (1.0 - r * 4.0), 1.0);
  #include <fog_fragment>
}`;

const CONE_VS = /* glsl */`
uniform float uLen; varying vec3 vN, vV, vW; varying float vY;
#include <fog_pars_vertex>
void main(){
  vY = -position.y / uLen;
  vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  vN = normalize(normalMatrix * normal); vV = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const CONE_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; uniform float uTime;
varying vec3 vN, vV, vW; varying float vY;
#include <fog_pars_fragment>
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
void main(){
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float core = pow(min(facing, 1.0), 1.7);
  float along = pow(clamp(1.0 - vY, 0.0, 1.0), 1.4) * smoothstep(0.0, 0.04, vY);   // clamped: pow() of a negative is NaN, and bloom spreads NaN
  float dust = 0.65 + 0.7 * n2(vW.xz * 0.08 + vec2(uTime * 0.05, vW.y * 0.06 - uTime * 0.03));
  gl_FragColor = vec4(uCol * core * along * dust * uI, 1.0);
  ${FOG_ADD}
}`;

const SKY_VS = /* glsl */`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FS = /* glsl */`
varying vec3 vD; uniform vec3 uAcc;
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main(){
  float y = vD.y;
  vec3 col = mix(vec3(0.02, 0.032, 0.056), vec3(0.002, 0.004, 0.01), smoothstep(-0.05, 0.5, y));
  col += vec3(0.04, 0.055, 0.085) * exp(-abs(y - 0.06) * 9.0);  // the stadium's glow in the haze
  // stars
  vec2 g = vD.xz / (1.0 + max(y, 0.0)) * 220.0;
  vec2 i = floor(g); float s = h21(i);
  float star = step(0.9965, s) * smoothstep(0.5, 0.0, length(fract(g) - 0.5)) * smoothstep(0.15, 0.45, y);
  col += vec3(0.9, 0.95, 1.0) * star * (0.6 + 1.6 * h21(i + 7.0));
  gl_FragColor = vec4(col, 1.0);
}`;

const DUST_VS = /* glsl */`
attribute float aR; uniform float uTime; uniform float uScale; varying float vA;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  p.y = mod(p.y + uTime * (0.25 + aR * 0.5), 34.0) + 1.0;
  p.x += sin(uTime * 0.2 + aR * 40.0) * 1.5; p.z += cos(uTime * 0.17 + aR * 30.0) * 1.5;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  vA = 0.35 + 0.65 * sin(uTime * (0.6 + aR) + aR * 50.0) * 0.5 + 0.5;
  gl_PointSize = clamp(0.12 * uScale / -mvPosition.z, 1.0, 4.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const DUST_FS = /* glsl */`
varying float vA;
#include <fog_pars_fragment>
void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c); if (r > 0.25) discard;
  gl_FragColor = vec4(vec3(0.75, 0.85, 1.0) * vA * 0.55 * (1.0 - r * 4.0), 1.0);
  ${FOG_ADD}
}`;

const GLITCH = {
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uAmt: { value: 0 }, uWipe: { value: -1 }, uVel: { value: 0 },
    uAspect: { value: 1 }, uAcc: { value: null },
  },
  vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
uniform sampler2D tDiffuse; uniform float uTime, uAmt, uWipe, uVel, uAspect; uniform vec3 uAcc;
varying vec2 vUv;
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
void main(){
  vec2 uv = vUv;
  float amt = uAmt;
  float wd = uWipe < -0.5 ? 9.0 : (vUv.y - uWipe);
  float near = exp(-wd * wd * 26.0) * step(-0.5, uWipe);
  float tick = floor(uTime * 24.0);
  // torn slices: more of them and wider as the crossing peaks, densest at the wipe
  float rows = mix(14.0, 70.0, h21(vec2(tick, 3.1)));
  float row = floor(uv.y * rows);
  float r = h21(vec2(row, tick));
  float tear = step(1.0 - clamp(amt * 0.42 + near * amt * 1.1, 0.0, 0.95), r);
  uv.x += (h21(vec2(row, tick + 7.0)) - 0.5) * 0.14 * tear * (0.4 + amt);
  // a few blocks jump
  vec2 bq = floor(vUv * vec2(18.0, 10.0));
  float rb = h21(bq + tick * 1.7);
  if (rb > 1.0 - amt * amt * 0.1) uv += (vec2(h21(bq + 1.3), h21(bq + 2.9)) - 0.5) * 0.07;
  // chromatic split, always a breath of it at the edges
  vec2 cq = vUv - 0.5; float e = dot(cq, cq);
  float ca = 0.0009 + amt * 0.016 + near * amt * 0.022 + uVel * 0.0045;
  vec3 col;
  col.r = texture2D(tDiffuse, uv + vec2(ca, 0.0) + cq * e * 0.02).r;
  col.g = texture2D(tDiffuse, uv).g;
  col.b = texture2D(tDiffuse, uv - vec2(ca, 0.0) - cq * e * 0.02).b;
  // the seam of the wipe in the app's light
  col += uAcc * (near * amt * 0.35 + exp(-wd * wd * 5000.0) * amt * 2.2);
  col *= 1.0 + amt * 0.25;
  col *= 1.0 - amt * 0.22 * step(0.5, fract(gl_FragCoord.y * 0.5));
  // grain
  float g = h21(gl_FragCoord.xy + fract(uTime * 7.13) * vec2(113.0, 71.0)) - 0.5;
  col += g * (0.018 + amt * 0.09) * (0.25 + col);
  // vignette
  vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0);
  col *= mix(1.0, smoothstep(1.2, 0.25, length(q)), 0.62);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`,
};

/* ── the build ─────────────────────────────────────────────── */
async function build(THREE, P, { lenis, loaded, onLost }) {
  const root = document.documentElement;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const phone = coarse || innerWidth < 760;
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const N = phone ? 18 : 36;
  const maxDpr = phone ? 1 : 1.5;
  const acc = new THREE.Color().setRGB(...ACC);
  const dbgOn = new URLSearchParams(location.search).has('dimdbg');
  const dbg = { cones: [], hazes: [] };

  // the screenshots first: without them there is no app in the world
  const imgs = await loaded(Promise.all(SHOTS.map((src) => new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(im); im.onerror = rej; im.src = src; }))));

  const wrap = document.createElement('div'); wrap.className = 'dim'; wrap.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas'); canvas.className = 'dim__cv';
  const scrim = document.createElement('i'); scrim.className = 'dim__scrim';
  wrap.append(canvas, scrim);
  document.body.prepend(wrap);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' });
  let dpr = Math.min(devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.08;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => { shaderFailed = true; };   // a shader that does not compile: the page's world instead
  // half-float targets need a renderable float format; without one, 8-bit targets (less bloom range, but a picture)
  const floatRT = renderer.extensions.has('EXT_color_buffer_half_float') || renderer.extensions.has('EXT_color_buffer_float');
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const fogCol = new THREE.Color(0x070c17);
  scene.background = fogCol;
  scene.fog = new THREE.FogExp2(fogCol, 0.0056);
  const camera = new THREE.PerspectiveCamera(54, innerWidth / innerHeight, 0.1, 1200);

  const fogU = () => THREE.UniformsUtils.clone(THREE.UniformsLib.fog);
  const time = { value: 0 };
  const pointScale = { value: 600 };

  /* sky and stars */
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.ShaderMaterial({
    vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false, uniforms: { uAcc: { value: acc } },
  }));
  sky.renderOrder = -10; scene.add(sky);

  /* light */
  scene.add(new THREE.HemisphereLight(0x3a4a66, 0x0b140d, 0.4));
  const spots = [];
  const heads = TOWERS.map(([x, z]) => new THREE.Vector3(x, TOWER_H, z));
  const aims = TOWERS.map(([x, z]) => new THREE.Vector3(-x * 0.16, 0, -z * 0.12));
  heads.forEach((h, i) => {
    const s = new THREE.SpotLight(0xe4eeff, 2.3, 0, 0.42, 0.75, 0);
    s.position.copy(h); s.target.position.copy(aims[i]);
    scene.add(s, s.target); spots.push(s);
  });

  /* the pitch */
  const pitchTex = canvasTex(THREE, 2048, 1450, drawPitch, { aniso });
  const pitch = new THREE.Mesh(new THREE.PlaneGeometry(130, 92), new THREE.MeshStandardMaterial({ map: pitchTex, roughness: 0.86, metalness: 0 }));
  pitch.rotation.x = -Math.PI / 2; scene.add(pitch);
  // the apron around it (the plane ends at the stands' front wall)
  const apron = new THREE.Mesh(new THREE.PlaneGeometry(260, 220), new THREE.MeshStandardMaterial({ color: 0x0b1a10, roughness: 0.95 }));
  apron.rotation.x = -Math.PI / 2; apron.position.y = -0.02; scene.add(apron);

  /* goals with nets */
  const white = new THREE.MeshStandardMaterial({ color: 0xf2f4f6, roughness: 0.4, emissive: 0x9aa6b8, emissiveIntensity: 0.35 });
  const netMat = new THREE.LineBasicMaterial({ color: 0xdfe6f0, transparent: true, opacity: 0.32, fog: true });
  const goals = []; // [left, right]; the left one hides in the game chapter, where the kick game draws its own
  for (const sd of [-1, 1]) {
    const g = new THREE.Group(); goals.push(g);
    const post = new THREE.CylinderGeometry(0.07, 0.07, 2.44, 10);
    for (const z of [-3.66, 3.66]) { const m = new THREE.Mesh(post, white); m.position.set(0, 1.22, z); g.add(m); }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.07, 7.32 + 0.14, 10), white); bar.rotation.x = Math.PI / 2; bar.position.set(0, 2.44, 0); g.add(bar);
    const pts = [];
    const D = 2.0;
    for (let i = 0; i <= 24; i++) { const z = -3.66 + (7.32 * i) / 24; pts.push(0, 2.44, z, D, 2.0, z, D, 2.0, z, D, 0, z); }
    for (let j = 0; j <= 8; j++) { const y = (2.44 * j) / 8; const xb = D * Math.min(1, y / 2.0 + 0.0); pts.push(xb, Math.min(y, 2.0), -3.66, xb, Math.min(y, 2.0), 3.66); }
    for (let j = 0; j <= 6; j++) { const x = (D * j) / 6; const y = 2.44 - (0.44 * j) / 6; pts.push(x, y, -3.66, x, y, 3.66); }
    for (const z of [-3.66, 3.66]) for (let j = 0; j <= 8; j++) { const y = (2.44 * j) / 8; pts.push(0, y, z, D, Math.min(y, 2.0), z); }
    const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    g.add(new THREE.LineSegments(ng, netMat));
    g.position.set(sd * 52.5, 0, 0); g.rotation.y = sd > 0 ? 0 : Math.PI; // the net runs away from the pitch
    scene.add(g);
  }

  /* the ball on the centre spot */
  const ballTex = canvasTex(THREE, 256, 128, (g, W, H) => {
    g.fillStyle = '#f4f6f8'; g.fillRect(0, 0, W, H); g.fillStyle = '#15181d';
    for (let i = 0; i < 12; i++) { const x = (i % 6) * (W / 6) + (i < 6 ? 0 : W / 12), y = i < 6 ? H * 0.3 : H * 0.72; g.beginPath(); for (let k = 0; k < 5; k++) { const a = (k / 5) * TAU - Math.PI / 2; g.lineTo(x + Math.cos(a) * 13, y + Math.sin(a) * 13); } g.fill(); }
  });
  const ball = new THREE.Mesh(new THREE.SphereGeometry(0.24, 24, 16), new THREE.MeshStandardMaterial({ map: ballTex, roughness: 0.45 }));
  ball.position.set(0, 0.24, 0); scene.add(ball);

  /* the bowl: a terraced superellipse, with a hole for the tunnel */
  const sePt = (th, d) => { const c = Math.cos(th), s = Math.sin(th); return [(A0 + d) * Math.sign(c) * Math.pow(Math.abs(c), 2 / NE), (B0 + d) * Math.sign(s) * Math.pow(Math.abs(s), 2 / NE)]; };
  {
    const TH = phone ? 220 : 340;
    const pos = [], kind = [], st = [], idx = [];
    for (let sgi = 0; sgi < PROF.length - 1; sgi++) {
      const [d0, h0] = PROF[sgi], [d1, h1] = PROF[sgi + 1];
      const rowsN = Math.max(1, Math.ceil(Math.hypot(d1 - d0, h1 - h0) / 2.4));
      const base = pos.length / 3;
      for (let r = 0; r <= rowsN; r++) {
        const t = r / rowsN, d = lerp(d0, d1, t), h = lerp(h0, h1, t);
        for (let j = 0; j <= TH; j++) {
          const [x, z] = sePt((j / TH) * TAU, d);
          pos.push(x, h, z); kind.push(KIND[sgi]); st.push(j / TH, t);
        }
      }
      for (let r = 0; r < rowsN; r++) for (let j = 0; j < TH; j++) {
        const a = base + r * (TH + 1) + j, b = a + 1, c = a + TH + 1, e = c + 1;
        // the tunnel's opening: no stand where the tunnel runs under it
        const ax = pos[a * 3], az = pos[a * 3 + 2], bx = pos[b * 3], ch = pos[c * 3 + 1];
        if (az > 0 && Math.abs(ax) < TUN.x + 0.6 && Math.abs(bx) < TUN.x + 0.6 && ch < TUN.h + 0.9) continue;
        idx.push(a, c, b, b, c, e);
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    geo.setAttribute('aKind', new THREE.Float32BufferAttribute(kind, 1));
    geo.setAttribute('aSt', new THREE.Float32BufferAttribute(st, 2));
    geo.setIndex(idx);
    const mat = new THREE.ShaderMaterial({ vertexShader: BOWL_VS, fragmentShader: BOWL_FS, fog: true, side: THREE.DoubleSide,
      uniforms: { ...fogU(), uTime: time, uAcc: { value: acc } } });
    dbg.bowl = new THREE.Mesh(geo, mat); scene.add(dbg.bowl);
  }

  /* the crowd: points on the two tiers, home and away ends, camera flashes */
  {
    const n = phone ? 14000 : 42000;
    const pos = new Float32Array(n * 3), col = new Float32Array(n * 3), rr = new Float32Array(n);
    const tiers = [[2, 0.45], [5, 0.55]];
    const home = [0.5, 0.07, 0.08], away = [0.09, 0.22, 0.6], pale = [0.42, 0.44, 0.47], dark = [0.06, 0.065, 0.075];
    let k = 0;
    for (let tries = 0; k < n && tries < n * 3; tries++) {
      const [sg] = Math.random() < tiers[0][1] ? tiers[0] : tiers[1];
      const [d0, h0] = PROF[sg], [d1, h1] = PROF[sg + 1];
      const t = Math.random(), th = Math.random() * TAU;
      const d = lerp(d0, d1, t), h = lerp(h0, h1, t);
      const [x, z] = sePt(th, d);
      if (z > 0 && Math.abs(x) < TUN.x + 1.5 && h < TUN.h + 2) continue;
      pos[k * 3] = x; pos[k * 3 + 1] = h + 0.45; pos[k * 3 + 2] = z;
      const c = Math.cos(th), u = Math.random();
      const team = c > 0.62 ? home : c < -0.62 ? away : (u < 0.5 ? (Math.sin(th) > 0 ? home : away) : null);
      const src = team && u < 0.78 ? team : (u < 0.9 ? dark : pale);
      const l = 0.35 + Math.random() * 0.5;
      col[k * 3] = src[0] * l; col[k * 3 + 1] = src[1] * l; col[k * 3 + 2] = src[2] * l;
      rr[k] = Math.random();
      k++;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos.subarray(0, k * 3), 3));
    geo.setAttribute('aCol', new THREE.BufferAttribute(col.subarray(0, k * 3), 3));
    geo.setAttribute('aR', new THREE.BufferAttribute(rr.subarray(0, k), 1));
    const mat = new THREE.ShaderMaterial({ vertexShader: CROWD_VS, fragmentShader: CROWD_FS, fog: true,
      uniforms: { ...fogU(), uTime: time, uScale: pointScale } });
    dbg.crowd = new THREE.Points(geo, mat); scene.add(dbg.crowd);
  }

  /* the tunnel the camera comes out of */
  {
    const g = new THREE.Group();
    const wallMat = new THREE.MeshStandardMaterial({ color: 0x1a2028, roughness: 0.9, side: THREE.DoubleSide });
    const L = TUN.z1 - TUN.z0, zc = (TUN.z0 + TUN.z1) / 2;
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(TUN.x * 2, L), new THREE.MeshStandardMaterial({ color: 0x0d1712, roughness: 0.8 }));
    floor.rotation.x = -Math.PI / 2; floor.position.set(0, 0.01, zc); g.add(floor);
    const ceil = new THREE.Mesh(new THREE.PlaneGeometry(TUN.x * 2, L), wallMat); ceil.rotation.x = Math.PI / 2; ceil.position.set(0, TUN.h, zc); g.add(ceil);
    for (const sd of [-1, 1]) { const w = new THREE.Mesh(new THREE.PlaneGeometry(L, TUN.h), wallMat); w.rotation.y = -sd * Math.PI / 2; w.position.set(sd * TUN.x, TUN.h / 2, zc); g.add(w); }
    const lightMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(5, 5.4, 6) });
    for (let z = TUN.z0 + 2; z < TUN.z1; z += 3.2) {
      const l = new THREE.Mesh(new THREE.BoxGeometry(2.4, 0.06, 0.32), lightMat); l.position.set(0, TUN.h - 0.04, z); g.add(l);
    }
    const stripMat = new THREE.MeshBasicMaterial({ color: acc.clone().multiplyScalar(2.2) });
    for (const sd of [-1, 1]) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, L), stripMat); s.position.set(sd * (TUN.x - 0.04), 0.5, zc); g.add(s); }
    const end = new THREE.Mesh(new THREE.PlaneGeometry(TUN.x * 2, TUN.h), new THREE.MeshBasicMaterial({ color: new THREE.Color(1.6, 1.7, 2.0) }));
    end.position.set(0, TUN.h / 2, TUN.z1); end.rotation.y = Math.PI; g.add(end);
    // the canopy over the mouth
    const can = new THREE.Mesh(new THREE.BoxGeometry(TUN.x * 2 + 0.6, 0.35, 4.6), new THREE.MeshStandardMaterial({ color: 0x0e1218, roughness: 0.6 }));
    can.position.set(0, TUN.h + 0.18, TUN.z0 + 2.1); g.add(can);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(TUN.x * 2 + 0.6, 0.06, 0.06), stripMat); lip.position.set(0, TUN.h, TUN.z0 - 0.2); g.add(lip);
    scene.add(g);
  }

  /* LED boards around the pitch */
  const boardTex = canvasTex(THREE, 2048, 96, drawBoards, { repeat: true, aniso });
  {
    const X = 56.5, Z = 38.2, H = 0.95;
    const path = [[-X, -Z], [X, -Z], [X, Z], [TUN.x + 1, Z], null, [-TUN.x - 1, Z], [-X, Z], [-X, -Z]];
    const pos = [], uv = [], idx = [];
    let u = 0, prev = null;
    for (const p of path) {
      if (!p) { prev = null; continue; }
      if (prev) u += Math.hypot(p[0] - prev[0], p[1] - prev[1]) / 26;
      const b = pos.length / 3;
      pos.push(p[0], 0, p[1], p[0], H, p[1]); uv.push(u, 0, u, 1);
      if (prev) idx.push(b - 2, b, b - 1, b - 1, b, b + 1);
      prev = p;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2)); geo.setIndex(idx);
    scene.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: boardTex, color: new THREE.Color(1.7, 1.7, 1.7), side: THREE.DoubleSide })));
  }

  /* the scoreboard over the far end */
  {
    const tex = canvasTex(THREE, 1024, 420, drawScoreboard, { aniso });
    const g = new THREE.Group();
    const scr = new THREE.Mesh(new THREE.PlaneGeometry(30, 12.3), new THREE.MeshBasicMaterial({ map: tex, color: new THREE.Color(1.5, 1.5, 1.5) }));
    const frame = new THREE.Mesh(new THREE.BoxGeometry(31.4, 13.6, 1.2), new THREE.MeshStandardMaterial({ color: 0x0a0d12, roughness: 0.7 }));
    frame.position.z = -0.65;
    g.add(frame, scr);
    for (const sx of [-9, 9]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.8, 14, 0.8), frame.material); leg.position.set(sx, -12, -1); g.add(leg); }
    g.position.set(-(A0 + 42), 45, 0); g.rotation.y = Math.PI / 2;
    scene.add(g);
  }

  /* four floodlight towers: mast, lamp head, glare and a volumetric beam */
  const glareTex = canvasTex(THREE, 256, 256, drawGlare, { srgb: false });
  const lampTex = canvasTex(THREE, 512, 320, drawLamps, { aniso });
  const coneMats = [];
  {
    const mastMat = new THREE.MeshStandardMaterial({ color: 0x1c222b, roughness: 0.6, metalness: 0.4 });
    const headMat = new THREE.MeshBasicMaterial({ map: lampTex, color: new THREE.Color(7, 7, 7.4) });
    const center = new THREE.Vector3(0, 0, 0);
    heads.forEach((h, i) => {
      const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 1.4, TOWER_H, 8), mastMat);
      mast.position.set(h.x, TOWER_H / 2, h.z); scene.add(mast);
      // lattice braces as lines
      const lp = [];
      for (let y = 2; y < TOWER_H - 3; y += 3) { const a = y * 0.9; lp.push(h.x + Math.cos(a) * 1.4, y, h.z + Math.sin(a) * 1.4, h.x - Math.cos(a) * 1.4, y + 3, h.z - Math.sin(a) * 1.4); }
      const lg = new THREE.BufferGeometry(); lg.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
      scene.add(new THREE.LineSegments(lg, new THREE.LineBasicMaterial({ color: 0x2a3340 })));
      const head = new THREE.Group();
      const back = new THREE.Mesh(new THREE.BoxGeometry(12, 7.5, 0.9), mastMat); back.position.z = -0.5;
      const lamps = new THREE.Mesh(new THREE.PlaneGeometry(11.4, 6.9), headMat); lamps.position.z = 0.0;
      head.add(back, lamps);
      head.position.copy(h); head.lookAt(new THREE.Vector3(aims[i].x * 0.5, 10, aims[i].z * 0.5));
      scene.add(head);
      const glare = new THREE.Sprite(new THREE.SpriteMaterial({ map: glareTex, color: 0xdfe9ff, blending: THREE.AdditiveBlending, depthWrite: false, fog: false, transparent: true, opacity: 0.85 }));
      glare.scale.set(42, 42, 1);
      glare.position.copy(h).add(new THREE.Vector3().subVectors(center, h).normalize().multiplyScalar(2));
      scene.add(glare);
      // the beam
      const dir = new THREE.Vector3().subVectors(aims[i], h);
      const len = dir.length() * 1.02;
      const cg = new THREE.ConeGeometry(len * Math.tan(0.36), len, 48, 1, true);
      cg.translate(0, -len / 2, 0);
      const cm = new THREE.ShaderMaterial({ vertexShader: CONE_VS, fragmentShader: CONE_FS, fog: true, transparent: true, depthWrite: false,
        blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
        uniforms: { ...fogU(), uLen: { value: len }, uCol: { value: new THREE.Color(0.62, 0.74, 1.0) }, uI: { value: 0.34 }, uTime: time } });
      coneMats.push(cm);
      const cone = new THREE.Mesh(cg, cm);
      cone.position.copy(h);
      cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.normalize());
      cone.renderOrder = 5; dbg.cones.push(cone);
      scene.add(cone);
    });
  }

  /* haze drifting over the stands, dust in the light */
  const hazeTex = canvasTex(THREE, 256, 256, drawHaze, { srgb: false });
  const hazes = [];
  for (let i = 0; i < (phone ? 7 : 12); i++) {
    const s = new THREE.Sprite(new THREE.SpriteMaterial({ map: hazeTex, color: 0x6f86a8, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.032, fog: false }));
    const a = (i / 12) * TAU + rnd(i, 3), r = 46 + rnd(i, 4) * 28;
    s.position.set(Math.cos(a) * r, 10 + rnd(i, 5) * 22, Math.sin(a) * r * 0.75);
    const sc = 70 + rnd(i, 6) * 60; s.scale.set(sc, sc * 0.55, 1);
    s.userData = { a, r, y: s.position.y, sp: 0.01 + rnd(i, 7) * 0.02 };
    s.renderOrder = 6;
    hazes.push(s); dbg.hazes.push(s); scene.add(s);
  }
  {
    const n = phone ? 700 : 1800;
    const pos = new Float32Array(n * 3), rr = new Float32Array(n);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 110; pos[i * 3 + 1] = Math.random() * 34; pos[i * 3 + 2] = (Math.random() - 0.5) * 76; rr[i] = Math.random(); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aR', new THREE.BufferAttribute(rr, 1));
    const pts = new THREE.Points(geo, new THREE.ShaderMaterial({ vertexShader: DUST_VS, fragmentShader: DUST_FS, fog: true, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, uniforms: { ...fogU(), uTime: time, uScale: pointScale } }));
    pts.renderOrder = 7; dbg.dust = pts; scene.add(pts);
  }

  /* the app: phone cards (one atlas of the real screens; body, glow and ground shadow are three instanced draws) */
  const atlas = canvasTex(THREE, 2048, 2048, (g) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, 2048, 2048);
    imgs.forEach((im, i) => {
      const cx = (i % 4) * 512, cy = Math.floor(i / 4) * 1024;
      const h = 1024, w = Math.round((im.width / im.height) * h);
      g.drawImage(im, cx + (512 - w) / 2, cy, w, h);
    });
  }, { aniso });
  atlas.generateMipmaps = true; atlas.minFilter = THREE.LinearMipmapLinearFilter; dbg.atlas = atlas;
  const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H);
  const HALO = [CARD_W + 5, CARD_H + 5];
  const haloGeo = new THREE.PlaneGeometry(HALO[0], HALO[1]); haloGeo.translate(0, 0, -0.04);
  const shadowGeo = new THREE.PlaneGeometry(1, 1); shadowGeo.rotateX(-Math.PI / 2);
  const inst = (n) => { const a = new THREE.InstancedBufferAttribute(new Float32Array(n), 1); a.setUsage(THREE.DynamicDrawUsage); return a; };
  const aCell = inst(N), aSeed = inst(N), aFade = inst(N), aFocus = inst(N), aOp = inst(N);
  for (const [nm, a] of [['aCell', aCell], ['aSeed', aSeed], ['aFade', aFade], ['aFocus', aFocus]]) { cardGeo.setAttribute(nm, a); haloGeo.setAttribute(nm, a); }
  shadowGeo.setAttribute('aOp', aOp);
  const cardU = { ...fogU(), uAtlas: { value: atlas }, uCells: { value: new THREE.Vector2(4, 2) }, uSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
    uR: { value: CARD_R }, uAcc: { value: acc }, uTime: time, uGeo: { value: new THREE.Vector2(...HALO) } };
  const cards = new THREE.InstancedMesh(cardGeo, new THREE.ShaderMaterial({ vertexShader: CARD_VS, fragmentShader: CARD_FS, uniforms: cardU, fog: true,
    side: THREE.DoubleSide, transparent: true, depthWrite: true }), N);
  const halos = new THREE.InstancedMesh(haloGeo, new THREE.ShaderMaterial({ vertexShader: CARD_VS, fragmentShader: HALO_FS, uniforms: cardU, fog: true,
    side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), N);
  const shadows = new THREE.InstancedMesh(shadowGeo, new THREE.ShaderMaterial({ vertexShader: SHADOW_VS, fragmentShader: SHADOW_FS, transparent: true, depthWrite: false }), N);
  for (const m of [cards, halos, shadows]) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; }
  shadows.renderOrder = 1; cards.renderOrder = 2; halos.renderOrder = 3;
  scene.add(shadows, cards, halos);

  /* formations: one per chapter, each writes position, rotation, scale and fade of card i at time t */
  const R = Array.from({ length: N }, (_, i) => Array.from({ length: 8 }, (__, k) => rnd(i + 1, k + 1)));
  const V3 = (a) => new THREE.Vector3(...a);
  const camPos = CAMK.map((c) => V3(c.pos));
  const camHold = CAMK.map((c, i) => [V3(c.pos), ...(c.pp ? [V3(c.pp)] : []), ...(VIA[i] ? [V3(VIA[i][0])] : []), ...(VIA[i - 1] ? [V3(VIA[i - 1][0])] : [])]);
  const e = new THREE.Euler(), q2 = new THREE.Quaternion(), m4 = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0), tmp = new THREE.Vector3();
  const face = (o, to, rx = 0, ry = 0, rz = 0) => { m4.lookAt(to, o.p, up); o.q.setFromRotationMatrix(m4); if (rx || ry || rz) o.q.multiply(q2.setFromEuler(e.set(rx, ry, rz))); };
  const yaw = (o, a, rx = 0, rz = 0) => o.q.setFromEuler(e.set(rx, a, rz, 'YXZ'));
  const cols = phone ? 6 : 9, wallRows = Math.ceil(N / cols);
  const wallC = new THREE.Vector3(-15, 15.5, -8);
  const F = [
    (i, t, o) => { // hero: a slow cloud over the near half
      const r = R[i];
      o.p.set(-9 + (r[0] - 0.5) * (phone ? 26 : 36), 8.5 + (r[1] - 0.5) * 10 + Math.sin(t * 0.55 + r[2] * 9) * 0.5, 17 + (r[2] - 0.5) * 20);
      face(o, camPos[0], (r[3] - 0.5) * 0.3, (r[4] - 0.5) * 0.55, (r[5] - 0.5) * 0.3 + Math.sin(t * 0.4 + r[0] * 7) * 0.06);
      o.s = 1; o.f = 1; o.lift = 3;
    },
    (i, t, o) => { // problem: chaos
      const r = R[i];
      o.p.set((r[0] - 0.5) * 92 + Math.sin(t * 0.3 + r[4] * 9) * 2, 3.5 + r[1] * 26 + Math.sin(t * 0.7 + r[3] * 9) * 1.4, (r[2] - 0.5) * 62);
      // keep the chaos out of the lens: nothing within 14 m of where the camera reads this chapter
      for (const cp of camHold[1]) { tmp.subVectors(o.p, cp); const d = tmp.length(); if (d < 14) o.p.addScaledVector(tmp.normalize(), 14 - d); }
      o.q.setFromEuler(e.set(r[3] * TAU + t * (r[6] - 0.5) * 1.8, r[4] * TAU + t * (r[7] - 0.5) * 1.5, r[5] * TAU + t * (r[0] - 0.5) * 1.1));
      o.s = 1; o.f = 1; o.lift = 8;
    },
    (i, t, o) => { // built: one ordered wall, a room per match, the rooms breathing
      const c = i % cols, rw = Math.floor(i / cols);
      o.p.set(wallC.x + (c - (cols - 1) / 2) * 3.75, wallC.y + ((wallRows - 1) / 2 - rw) * 7.5, wallC.z);
      tmp.subVectors(camPos[2], wallC).setY(0).normalize();
      o.p.addScaledVector(tmp, Math.sin(t * 2.0 - c * 0.55 - rw * 0.9) * 0.22);
      m4.lookAt(tmp.clone().add(wallC), wallC, up); o.q.setFromRotationMatrix(m4);
      o.s = 1; o.f = 1; o.lift = 2;
    },
    (i, t, o) => { // now: a rising helix, turning
      const a = i * 0.62 + t * 0.16, Rr = phone ? 7 : 8.5;
      o.p.set(-12 + Math.cos(a) * Rr, 3 + i * ((phone ? 27 : 30) / N), -2 + Math.sin(a) * Rr);
      yaw(o, Math.atan2(Math.cos(a), Math.sin(a)), 0, 0);
      o.s = 1; o.f = 1; o.lift = 3;
    },
    (i, t, o) => { // screens: one card in front, the rest a constellation around it
      const r = R[i];
      if (i === 0) { o.p.set(0, 10 + Math.sin(t * 0.5) * 0.08, 10); yaw(o, Math.sin(t * 0.35) * 0.03); o.s = 1; o.f = 1; o.lift = 2; return; }
      const a = ((i - 1) / (N - 1)) * TAU + 0.4, rad = 9 + r[0] * 9;
      o.p.set(Math.cos(a) * rad * 1.5, 10 + Math.sin(a) * rad * 0.75, 3 - r[1] * 14);
      yaw(o, (r[2] - 0.5) * 0.5 - Math.cos(a) * 0.25, (r[3] - 0.5) * 0.3, (r[4] - 0.5) * 0.25);
      o.s = 1; o.f = 1; o.lift = 4;
    },
    (i, t, o) => { // game: behind the goal like giant screens
      const m = Math.ceil(N / 2), j = i % m, row = Math.floor(i / m), s = j / (m - 1) - 0.5;
      o.p.set(-57.5 + s * s * 22, 7.4 + row * 7.6 + Math.sin(t * 1.3 + j * 0.7) * 0.12, s * (phone ? 34 : 50));
      tmp.set(-26, 6, 0); face(o, tmp);
      o.s = 1; o.f = 1; o.lift = 5;
    },
    (i, t, o, k) => { // tech: a ring around the camera
      const a = (i / N) * TAU + t * 0.09 + k * 0.8;
      o.p.set(Math.cos(a) * 13, 7 + Math.sin(a * 3 + t * 0.8) * 0.7, Math.sin(a) * 13);
      yaw(o, Math.atan2(-Math.cos(a), -Math.sin(a)), 0, 0);
      o.s = 1; o.f = 1; o.lift = 2;
    },
    (i, t, o) => { // cta: up into the night
      const r = R[i], a = (i / N) * TAU + t * 0.05;
      o.p.set(Math.cos(a) * (24 + r[0] * 40), 70 + r[1] * 90 + Math.sin(t * 0.3 + r[2] * 9) * 2, Math.sin(a) * (20 + r[0] * 34));
      o.q.setFromEuler(e.set(r[3] * TAU + t * 0.2, r[4] * TAU + t * 0.15, r[5] * TAU));
      o.s = 0.9; o.f = 0.85; o.lift = 6;
    },
  ];
  const NCH = F.length;
  const A = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, f: 1, lift: 0 };
  const B = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, f: 1, lift: 0 };
  const cardP = Array.from({ length: N }, () => new THREE.Vector3());
  const cardQ = Array.from({ length: N }, () => new THREE.Quaternion());
  const cardS = new Float32Array(N), cardF = new Float32Array(N);
  const order = Array.from({ length: N }, (_, i) => i), dist = new Float32Array(N);
  const mtx = new THREE.Matrix4(), sc = new THREE.Vector3(), shQ = new THREE.Quaternion();

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
    return Math.min(92, Math.max(v, (Math.atan((h * (a < 1 ? 0.62 : 0.9)) / a) * 360) / Math.PI));
  };

  /* post: bloom, then the glitch-wipe and grain, then tone mapping */
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: floatRT ? THREE.HalfFloatType : THREE.UnsignedByteType, samples: 0 });
  const composer = new P.EffectComposer(renderer, rt);
  // the composer clones rt into renderTarget2, and renderTarget2 is its first readBuffer: the RenderPass always draws
  // into it (the buffers are re-aligned after every frame). So only that one multisamples; rt holds post output only.
  composer.renderTarget2.samples = phone ? 0 : 2;
  composer.addPass(new P.RenderPass(scene, camera));
  const bloom = new P.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.6, 0.5, 0.9); // runs at half the buffer
  composer.addPass(bloom);
  if (!floatRT) for (const t of [bloom.renderTargetBright, ...bloom.renderTargetsHorizontal, ...bloom.renderTargetsVertical]) t.texture.type = THREE.UnsignedByteType;
  const glitch = new P.ShaderPass({ ...GLITCH, uniforms: THREE.UniformsUtils.clone(GLITCH.uniforms) });
  glitch.uniforms.uAcc.value = acc;
  composer.addPass(glitch);
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
    glitch.uniforms.uAspect.value = w / h;
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
        return i + 0.28 * f + 0.72 * (f * f * (3 - 2 * f));   // slow over the text, fast across the boundary
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
  let glitchT = -10, glitchDir = 1, vel = 0;
  const intro = { t: k < 0.3 ? 0 : 1 };
  const camP = new THREE.Vector3(), camT = new THREE.Vector3(), right = new THREE.Vector3(), camUp = new THREE.Vector3();
  const stats = { frames: 0, slow: 0, ms: 0, dpr, bloom: true, samples: [] };
  let govN = 0, govSum = 0, slowRuns = 0, last0 = performance.now();

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;
    time.value = t;

    // the scroll, smoothed once more so the flight never jerks
    const kT = kOf(scrollY_());
    kPrev = k; k = damp(k, kT, 3.6, dt);
    if (Math.abs(k - kT) < 1e-4) k = kT;
    const dk = (k - kPrev) / Math.max(dt, 1e-3);
    vel = damp(vel, Math.abs(dk), 6, dt);
    const idx = Math.round(k);
    if (idx !== lastIdx) { glitchDir = idx > lastIdx ? 1 : -1; lastIdx = idx; glitchT = t; }
    if (intro.t < 1) intro.t = Math.min(1, intro.t + dt / 2.8);
    const ie = 1 - Math.pow(1 - intro.t, 3);

    // the camera on its spline
    const u = clamp(k / (NCH - 1));
    curves.p.getPoint(u, camP); curves.t.getPoint(u, camT);
    const c = Math.min(Math.floor(k), NCH - 2), f = k - c;
    const fe = sstep(0, 1, f);
    camera.fov = fovFor(lerp(CAMK[c].fov, CAMK[c + 1].fov, fe));
    const roll = lerp(CAMK[c].roll, CAMK[c + 1].roll, fe);
    // the opening: the camera comes up the tunnel
    camP.z += (1 - ie) * 24; camP.y += (1 - ie) * -0.3;
    // life: a breath of drift, and the pointer
    camP.x += Math.sin(t * 0.21) * 0.25; camP.y += Math.sin(t * 0.17 + 1) * 0.18;
    ptr.sx = damp(ptr.sx, ptr.x, 2.5, dt); ptr.sy = damp(ptr.sy, ptr.y, 2.5, dt);
    camera.position.copy(camP);
    camera.lookAt(camT);
    if (hover) {
      right.set(1, 0, 0).applyQuaternion(camera.quaternion); camUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(right, ptr.sx * 0.9).addScaledVector(camUp, -ptr.sy * 0.5);
      camera.lookAt(camT);
    }
    camera.rotateZ(roll);
    camera.updateProjectionMatrix();
    goals[0].visible = Math.abs(k - 5) > 0.55;
    pointScale.value = (renderer.getDrawingBufferSize(tmp2).y * 0.5) / Math.tan((camera.fov * Math.PI) / 360);

    // the cards: formation c → c + 1, each card on its own beat
    for (let i = 0; i < N; i++) {
      F[c](i, t, A, k); F[c + 1](i, t, B, k);
      const s = R[i][7];
      const b = easeIO(clamp((f - 0.1 - s * 0.28) / 0.52));
      cardP[i].lerpVectors(A.p, B.p, b);
      cardP[i].y += Math.sin(Math.PI * b) * lerp(A.lift, B.lift, 0.5);
      cardQ[i].slerpQuaternions(A.q, B.q, b);
      cardS[i] = lerp(A.s, B.s, b) * (0.2 + 0.8 * sstep(i / N * 0.5, i / N * 0.5 + 0.5, ie));
      cardF[i] = lerp(A.f, B.f, b);
      dist[i] = cardP[i].distanceToSquared(camera.position);
    }
    // far to near, so the soft edges blend over what is behind them
    order.sort((a, b) => dist[b] - dist[a]);
    const focus = c === 4 ? 1 - f : c === 3 ? f : 0;
    for (let j = 0; j < N; j++) {
      const i = order[j];
      sc.setScalar(cardS[i]);
      mtx.compose(cardP[i], cardQ[i], sc);
      cards.setMatrixAt(j, mtx); halos.setMatrixAt(j, mtx);
      aCell.array[j] = i % SHOTS.length; aSeed.array[j] = R[i][6]; aFade.array[j] = cardF[i];
      aFocus.array[j] = i === 0 ? sstep(0.2, 1, focus) : 0;
      // a soft shadow on the grass, wider and fainter the higher the card floats
      const hgt = Math.max(0, cardP[i].y);
      const spread = 1 + hgt / 9;
      e.setFromQuaternion(cardQ[i], 'YXZ'); shQ.setFromEuler(e.set(0, e.y, 0, 'YXZ'));
      sc.set(CARD_W * 1.5 * spread * cardS[i], 1, CARD_W * 0.9 * spread * cardS[i]);
      tmp.set(cardP[i].x, 0.04, cardP[i].z);
      mtx.compose(tmp, shQ, sc); shadows.setMatrixAt(j, mtx);
      aOp.array[j] = 0.55 * clamp(1 - hgt / 40) * cardF[i];
    }
    for (const m of [cards, halos, shadows]) m.instanceMatrix.needsUpdate = true;
    for (const a of [aCell, aSeed, aFade, aFocus, aOp]) a.needsUpdate = true;

    // the world keeps living
    boardTex.offset.x = (t * 0.04) % 1;
    for (const h of hazes) { const d = h.userData; const a = d.a + t * d.sp; h.position.set(Math.cos(a) * d.r, d.y + Math.sin(t * 0.1 + d.a) * 2, Math.sin(a) * d.r * 0.75); }
    // the problem chapter: the floodlights stutter
    const chaos = c === 0 ? sstep(0.5, 1, f) : c === 1 ? 1 - sstep(0, 0.6, f) : 0;
    const flick = chaos * (0.3 * (Math.sin(t * 23) * Math.sin(t * 7.3) > 0.55 ? 1 : 0));
    // the end: the cards leave, the floodlights dim to the centre spot
    const night = c === 6 ? sstep(0.4, 1, f) : 0;
    for (const cm of coneMats) cm.uniforms.uI.value = 0.42 * (1 - flick) * (1 - night * 0.55);
    for (const sp of spots) sp.intensity = 2.3 * (1 - flick * 0.5) * (1 - night * 0.62);

    // the crossing: a glitch-wipe on every boundary, plus the scroll's own speed
    const gp = (t - glitchT) / 0.75;
    const env = gp >= 0 && gp < 1 ? (gp < 0.12 ? gp / 0.12 : Math.exp(-(gp - 0.12) * 4.2)) : 0;
    glitch.uniforms.uAmt.value = clamp(Math.max(env, (vel - 0.35) * 0.55) + flick * 0.15);
    glitch.uniforms.uWipe.value = gp >= 0 && gp < 1 ? (glitchDir > 0 ? gp * 1.3 - 0.15 : 1.15 - gp * 1.3) : -1;
    glitch.uniforms.uVel.value = clamp(vel);
    glitch.uniforms.uTime.value = t;

    composer.render(dt);
    if (composer.readBuffer !== composer.renderTarget2) composer.swapBuffers();   // the scene draws into the multisampled one

    // a small governor: steps the pixel ratio down (then the bloom off) if frames run long
    // (stalls over 100 ms are the page or the tab, not the scene, and two slow windows in a row are needed)
    stats.frames++; stats.ms = dt * 1000;
    if (stats.frames > 150 && now - last0 < 100) { govN++; govSum += now - last0; }
    last0 = now;
    if (govN >= 120 && !dbgOn) {
      const avg = govSum / govN; govN = 0; govSum = 0;
      stats.samples.push(Math.round(avg * 10) / 10);
      slowRuns = avg > 29 ? slowRuns + 1 : 0;
      if (slowRuns >= 2) {
        slowRuns = 0;
        if (dpr > 0.75) { dpr = Math.max(0.75, dpr - 0.25); stats.dpr = dpr; resize(); }
        else if (bloom.enabled) { bloom.enabled = false; stats.bloom = false; }
      }
    }
    if (stats.frames === 2) root.classList.add('dim-ready');
  }
  const tmp2 = new THREE.Vector2();

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
  window.__dim = { stats, get k() { return k; }, anchors: () => anchors, dispose };
  if (dbgOn) Object.assign(window.__dim, { dbg, bloom, renderer, composer, rt, setDpr(v) { dpr = v; resize(); } });
}
