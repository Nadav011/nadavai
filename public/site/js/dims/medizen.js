// dims/medizen.js: MediZen's dimension (2026-10-28). Nadav, on the flat shader world: "not at all a complete dimension
// of each app". So this page is a place: a calm, luminous clinic built as real geometry. Frosted glass partitions and
// membrane doors, translucent cells with glowing nuclei drifting in teal haze, skylight shafts, a floor ruled like a
// calendar, and heart-monitor traces on the horizon. One slow heartbeat (lub-dub, 62 bpm) travels outward from the
// visitor through all of it: cells, glass, floor and traces brighten as the wave passes. The app's real screens are
// physical glass phone cards in the room; the scroll flies one camera along a spline, each chapter of the page is its
// own formation of the cards, and every chapter boundary is a membrane door the camera passes through, with a frosted
// heartbeat ripple (two rings, lub and dub) across the frame.
//
//   hero      the cards float in a slow helix around the camera axis
//   problem   paper chaos: cards and paper sheets (invoices, forms, a paper diary) swirl in a vortex
//   built     the papers are absorbed; the cards settle into a week calendar grid that lights up row by row
//   today     small clusters of four, one per clinic, circling slowly
//   gallery   the cards radiate in a ring that frames the page's own screens
//   demo      the camera glides toward the real demo phone (DOM); the cards form a funnel onto it, a halo beats behind it
//   tech      the cards orbit the camera as a ring
//   cta       a calm settle: the cards line up as a heart trace whose beat fades to a gentle wave
//
// The DOM stays the page: text on the reading side (RTL, right) over a soft scrim, transparent sections, every control
// as it was. Started from work-pages.js on this page only; it returns false (and the page keeps its shader world and
// poster phone) under reduced motion, without WebGL2, on software GL, or when three or the screens cannot load.

import { dimAllowed, dimWatch } from './core.js';   // the shared phone device tier (see core.js)

const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
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

const SHOTS = [2, 3, 1, 4].map((n) => `/site/assets/work/medizen-${n}.webp`);
const ACC_HEX = '#6BD6A6';
const CW = 1.2, CH = 2.6;           // a phone card in metres (the screenshots are 540 × 1170)
const SW = 1.75, SH = 2.45;         // a paper sheet (A4)
const PERIOD = 60 / 62;             // the resting heartbeat
const NCH = 8;

// the chapters: F the formation's centre, C the camera, T where it looks (Tm on portrait screens), fov for 16:10
const CHAP = [
  { F: [0, 0, 0], C: [0, 0.4, 14], T: [4.4, 0.2, 0], Tm: [0, -2.4, 0], fov: 52 },                 // hero
  { F: [-9, 3, -58], C: [-3, 5, -40], T: [-4.6, 3.4, -57], Tm: [-9, 0, -58], fov: 52 },            // problem
  { F: [7, -1, -116], C: [3, 2, -97.5], T: [11.8, -0.4, -114.5], Tm: [7, -5.5, -116], fov: 48 },   // built
  { F: [-5, 4, -172], C: [-1, 3, -151], T: [-0.2, 3.6, -171], Tm: [-5, -0.5, -172], fov: 50 },     // today
  { F: [0, 2, -228], C: [0, 1.4, -204], T: [0, 1.8, -228], Tm: [0, 1.8, -228], fov: 50 },          // gallery
  { F: [2, 0, -284], C: [2, 0.6, -262], T: [2, 0.4, -284], Tm: [2, 0.4, -284], fov: 48 },          // demo
  { F: [0, 0, -330], C: [0, 0.75, -330], T: [-6.5, 0.5, -341], Tm: [-3.5, -1.2, -342], fov: 62 },  // tech, inside the ring
  { F: [0, -2, -392], C: [0, 3.2, -364], T: [0, -6.4, -392], Tm: [0, -13.8, -392], fov: 46 },       // cta
];
const VIA_OFF = [[2.5, 3, 0], [-3, -1.5, 0], [3, 3.5, 0], [-2, 1, 0], [1.5, -1, 0], [-1, 7, 0], [0, 4, 0]];
// where each chapter sits in the page: the scroll position at which the camera holds that formation
const ANCHORS = [
  () => 0,
  (vh) => mid('.wks__item:nth-child(1)', vh),
  (vh) => mid('.wks__item:nth-child(2)', vh),
  (vh) => mid('.wks__item:nth-child(3)', vh),
  (vh) => mid('.wkg__cloud', vh),
  (vh) => mid('.mz__phone', vh),
  (vh) => mid('.wkt', vh),
  (vh, max) => Math.min(max, mid('.wkn', vh) + vh * 0.1),
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
  if (reduce || new URLSearchParams(location.search).has('nodim') || root.classList.contains('reduce') || !probeGL()) return false; // ?nodim as in core.js
  // the cards are the app now: the hero's poster phone (and its own WebGL phone) step aside, but only once the clinic draws
  const stage = document.querySelector('.wkh__stage');
  const parent = stage?.parentNode, next = stage?.nextSibling;
  const back = () => {
    root.classList.remove('dim-medizen', 'dim-medizen-ready');
    document.querySelector('.mzd')?.remove();
    if (stage && parent && !stage.isConnected) parent.insertBefore(stage, next);
  };
  root.classList.add('dim-medizen');
  let timer = 0;
  const late = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`not loaded in ${LOAD_MS / 1000} s`)), LOAD_MS); });
  const loaded = (p) => Promise.race([p, late]);
  const allowed = dimAllowed();   // the device tier (core.js), measured while three loads
  try {
    const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }] = await loaded(Promise.all([
      import('three'),
      import('three/addons/postprocessing/EffectComposer.js'),
      import('three/addons/postprocessing/RenderPass.js'),
      import('three/addons/postprocessing/UnrealBloomPass.js'),
      import('three/addons/postprocessing/ShaderPass.js'),
      import('three/addons/postprocessing/OutputPass.js'),
    ]));
    if (!(await allowed)) { console.info('[dim] the clinic is skipped on this device, the page keeps its shader world', window.__dimTier); back(); return false; }
    await build(THREE, { EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass }, { lenis, loaded, onLost: () => { back(); onLost?.(); } });
    stage?.remove();
    return true;
  } catch (e) {
    console.warn('[dim] the clinic is off, the page keeps its shader world', e);
    back();
    return false;
  } finally { clearTimeout(timer); }
}

/* ── textures ─────────────────────────────────────────────── */
function loadImg(src) {
  return new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(im); im.onerror = () => rej(new Error(`screen ${src}`)); im.src = src; });
}

// the paperwork MediZen replaced: an invoice, an intake form, a paper diary page with scribbles
function drawPapers(g, W, H) {
  const pw = W / 3;
  const ink = (a) => `rgba(40,52,58,${a})`;
  const bars = (x0, y, n, gap, maxW, h, a, seed) => {
    for (let i = 0; i < n; i++) { const w = maxW * (0.45 + 0.55 * rnd(i, seed)); g.fillStyle = ink(a); g.fillRect(x0 - w, y + i * gap, w, h); }
  };
  const scrib = (x, y, w, seed, col) => {
    g.strokeStyle = col; g.lineWidth = 2; g.beginPath(); g.moveTo(x, y);
    for (let i = 1; i <= 7; i++) g.quadraticCurveTo(x - (w * (i - 0.5)) / 7, y + (rnd(i, seed) - 0.5) * 14, x - (w * i) / 7, y + (rnd(i, seed + 1) - 0.5) * 8);
    g.stroke();
  };
  g.textAlign = 'right'; g.direction = 'rtl';
  for (let k = 0; k < 3; k++) {
    const x0 = k * pw, R = x0 + pw - 30;
    g.fillStyle = '#F6F3EC'; g.fillRect(x0, 0, pw, H);
    for (let i = 0; i < 2200; i++) { g.fillStyle = `rgba(120,110,90,${rnd(i, k) * 0.05})`; g.fillRect(x0 + rnd(i, k + 3) * pw, rnd(i, k + 7) * H, 1.5, 1.5); }
    g.fillStyle = ink(0.88);
    g.font = '600 30px Rubik, Arial, sans-serif';
    if (k === 0) {
      g.fillText(__t('medizen.dims.invoice.title'), R, 62);
      g.font = '400 18px Rubik, Arial, sans-serif'; g.fillStyle = ink(0.6); g.fillText(__t('medizen.dims.invoice.patient'), R, 96);
      g.strokeStyle = ink(0.35); g.lineWidth = 1.5;
      for (let r = 0; r < 8; r++) { const y = 140 + r * 44; g.beginPath(); g.moveTo(x0 + 30, y); g.lineTo(R, y); g.stroke(); }
      g.beginPath(); g.moveTo(x0 + 120, 140); g.lineTo(x0 + 120, 140 + 7 * 44); g.stroke();
      bars(R - 10, 155, 7, 44, pw * 0.42, 9, 0.32, 3);
      for (let r = 0; r < 7; r++) { g.fillStyle = ink(0.4); g.fillRect(x0 + 40, 155 + r * 44, 60, 9); }
      g.font = '600 22px Rubik, Arial, sans-serif'; g.fillStyle = ink(0.8); g.fillText(__t('medizen.dims.invoice.total'), R, 520);
      g.strokeStyle = 'rgba(190,60,60,.55)'; g.lineWidth = 3; g.beginPath(); g.arc(x0 + 95, 600, 46, 0, TAU); g.stroke();
      g.font = '600 16px Rubik, Arial, sans-serif'; g.fillStyle = 'rgba(190,60,60,.6)'; g.textAlign = 'center'; g.fillText(__t('medizen.dims.invoice.paid'), x0 + 95, 606); g.textAlign = 'right';
      scrib(R, 620, 150, 9, 'rgba(30,60,140,.6)');
    } else if (k === 1) {
      g.fillText(__t('medizen.dims.form.title'), R, 62);
      g.font = '400 18px Rubik, Arial, sans-serif';
      const labels = [__t('medizen.dims.form.name'), __t('medizen.dims.form.id'), __t('medizen.dims.form.phone'), __t('medizen.dims.form.allergies'), __t('medizen.dims.form.meds'), __t('medizen.dims.form.signature')];
      labels.forEach((l, i) => {
        const y = 120 + i * 78;
        g.fillStyle = ink(0.7); g.fillText(l, R, y);
        g.strokeStyle = ink(0.35); g.lineWidth = 1.5; g.strokeRect(x0 + 30, y + 12, pw - 60, 36);
        if (i % 2 === 0) scrib(R - 16, y + 34, 110 + 60 * rnd(i, 4), i + 11, 'rgba(30,60,140,.55)');
      });
      for (let i = 0; i < 3; i++) { g.strokeStyle = ink(0.4); g.strokeRect(x0 + 40 + i * 64, H - 70, 22, 22); }
    } else {
      g.fillText(__t('medizen.dims.calendar.title'), R, 62);
      g.strokeStyle = ink(0.3); g.lineWidth = 1.2;
      const gx = x0 + 30, gy = 100, cw = (pw - 60) / 5, chh = (H - 150) / 9;
      for (let c = 0; c <= 5; c++) { g.beginPath(); g.moveTo(gx + c * cw, gy); g.lineTo(gx + c * cw, gy + 9 * chh); g.stroke(); }
      for (let r = 0; r <= 9; r++) { g.beginPath(); g.moveTo(gx, gy + r * chh); g.lineTo(gx + 5 * cw, gy + r * chh); g.stroke(); }
      for (let i = 0; i < 16; i++) {
        const c = Math.floor(rnd(i, 21) * 5), r = Math.floor(rnd(i, 22) * 9);
        scrib(gx + (c + 1) * cw - 8, gy + r * chh + chh * 0.55, cw - 16, i + 30, i % 5 === 0 ? 'rgba(190,60,60,.6)' : 'rgba(30,60,140,.5)');
        if (i % 4 === 0) { g.strokeStyle = 'rgba(190,60,60,.5)'; g.lineWidth = 2; g.beginPath(); g.moveTo(gx + c * cw + 6, gy + r * chh + 6); g.lineTo(gx + (c + 1) * cw - 6, gy + (r + 1) * chh - 6); g.stroke(); }
      }
    }
  }
}

/* ── GLSL ─────────────────────────────────────────────────── */
const COMMON = /* glsl */`
uniform float uTime; uniform vec3 uAcc;
#define PERIOD ${PERIOD.toFixed(4)}
#define SPEED 30.0
#define FOGD 0.0108
float gs(float x){ return exp(-x * x); }
float beatAt(float t){ float s = mod(t, PERIOD); return gs((s - 0.06) / 0.05) + 0.6 * gs((s - 0.33) / 0.065); }
float pulse(vec3 p){ return beatAt(uTime - length(p - cameraPosition) / SPEED); }
vec3 skyCol(vec3 d){
  vec3 deep = vec3(0.003, 0.012, 0.012), hor = vec3(0.016, 0.06, 0.054), top = vec3(0.04, 0.13, 0.115);
  vec3 c = mix(hor, top, smoothstep(0.0, 0.75, d.y));
  return mix(c, deep, smoothstep(0.02, -0.5, d.y));
}
float fogF(vec3 p){ float z = length(p - cameraPosition) * FOGD; return 1.0 - exp(-z * z); }
vec3 fogged(vec3 c, vec3 p){ return mix(c, skyCol(normalize(p - cameraPosition)), fogF(p)); }
float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float n21(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3. - 2. * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
`;

const SKY_VS = /* glsl */`varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const SKY_FS = /* glsl */`${COMMON}
varying vec3 vW;
float h3(vec3 p){ p = fract(p * 0.3183099 + .1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float n3(vec3 x){ vec3 i = floor(x), f = fract(x); f = f * f * (3. - 2. * f);
  return mix(mix(mix(h3(i), h3(i + vec3(1,0,0)), f.x), mix(h3(i + vec3(0,1,0)), h3(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(h3(i + vec3(0,0,1)), h3(i + vec3(1,0,1)), f.x), mix(h3(i + vec3(0,1,1)), h3(i + vec3(1,1,1)), f.x), f.y), f.z); }
void main(){
  vec3 d = normalize(vW - cameraPosition);
  vec3 col = skyCol(d);
  float m = n3(d * 2.6 + vec3(0.0, uTime * 0.012, uTime * 0.006)) * 0.62 + n3(d * 6.5 - vec3(uTime * 0.01)) * 0.38;
  col += uAcc * 0.045 * m * smoothstep(-0.25, 0.6, d.y);
  col += vec3(0.05, 0.12, 0.105) * pow(max(d.y, 0.0), 2.4) * 0.7;              // the skylight overhead
  col += uAcc * 0.03 * gs(d.y / 0.08) * (0.6 + 0.4 * m);            // a luminous band of haze on the horizon
  float sun = max(dot(d, normalize(vec3(0.12, 0.16, -1.0))), 0.0);   // the light at the end of the clinic, always ahead
  col += vec3(0.5, 0.95, 0.82) * (pow(sun, 60.0) * 0.5 + pow(sun, 9.0) * 0.12) + uAcc * pow(sun, 3.0) * 0.04 * (0.7 + 0.3 * m);
  gl_FragColor = vec4(col, 1.0);
}`;

const FLOOR_FS = /* glsl */`${COMMON}
varying vec3 vW;
void main(){
  vec2 g = vW.xz / vec2(3.0, 3.6);
  vec2 gw = abs(fract(g - 0.5) - 0.5) / max(fwidth(g), 1e-4);
  float line = 1.0 - min(min(gw.x, gw.y), 1.0);
  float dist = length(vW - cameraPosition);
  float pul = pulse(vW);
  vec3 col = vec3(0.005, 0.02, 0.019);
  col += uAcc * line * (0.05 + 0.75 * pul) * exp(-dist * 0.011);
  col += uAcc * 0.02 * n21(vW.xz * 0.05 + uTime * 0.02);
  gl_FragColor = vec4(fogged(col, vW), 1.0);
}`;

const CARD_VS = /* glsl */`
attribute float aShot; attribute float aLit;
varying vec2 vUv; varying vec3 vW; varying vec3 vN; varying vec3 vR; varying vec3 vC; varying float vShot; varying float vLit;
void main(){
  vUv = uv; vShot = aShot; vLit = aLit;
  mat4 m = modelMatrix * instanceMatrix;
  vec4 w = m * vec4(position, 1.0); vW = w.xyz;
  vN = mat3(m) * vec3(0.0, 0.0, 1.0); vR = mat3(m) * vec3(1.0, 0.0, 0.0);
  vC = (m * vec4(0.0, 0.0, 0.0, 1.0)).xyz;
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const CARD_FS = /* glsl */`${COMMON}
uniform sampler2D uAtlas; uniform float uNShots;
varying vec2 vUv; varying vec3 vW; varying vec3 vN; varying vec3 vR; varying vec3 vC; varying float vShot; varying float vLit;
void main(){
  vec2 sz = vec2(${CW.toFixed(2)}, ${CH.toFixed(2)});
  vec2 p = (vUv - 0.5) * sz;
  float dO = sdRB(p, sz * 0.5, 0.2);
  float aa = max(fwidth(dO), 1e-4);
  float cov = 1.0 - smoothstep(-aa, aa, dO);
  if (cov < 0.02) discard;
  float bz = 0.055;
  float dS = sdRB(p, sz * 0.5 - bz, 0.155);
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN), Rr = normalize(vR);
  float ndv = abs(dot(N, V));
  float pul = pulse(vC);
  float sheenPos = dot(V, Rr) * 1.8;
  float sheen = gs((p.x * 0.75 + p.y * 0.4 - sheenPos) / 0.24);
  vec3 col;
  if (gl_FrontFacing) {
    vec2 su = clamp((p + sz * 0.5 - bz) / (sz - 2.0 * bz), 0.004, 0.996);
    vec3 tex = texture2D(uAtlas, vec2((vShot + su.x) / uNShots, su.y)).rgb;
    float lum = mix(0.3, 0.8, vLit);
    vec3 scr = tex * lum;
    scr = mix(scr, dot(scr, vec3(0.3, 0.55, 0.15)) * vec3(0.5, 1.0, 0.88), (1.0 - vLit) * 0.6);   // asleep: a teal monochrome
    float inS = 1.0 - smoothstep(-0.006, 0.006, dS);
    vec3 bez = vec3(0.012, 0.03, 0.028) + uAcc * 0.04;
    col = mix(bez, scr, inS);
    col += vec3(0.85, 1.0, 0.96) * sheen * 0.08;
  } else {
    float gy = 0.5 + p.y / sz.y;
    col = mix(vec3(0.01, 0.05, 0.045), uAcc * 0.2, gy * 0.6) + vec3(0.8, 1.0, 0.95) * sheen * 0.06;
    vec2 q = p - vec2(0.0, 0.42);
    col += uAcc * 0.4 * exp(-dot(q, q) * 9.0);
  }
  float rim = gs(max(-dO, 0.0) / 0.028);
  col += uAcc * rim * (0.18 + 2.2 * vLit * vLit + 1.2 * pul);
  col += uAcc * pow(max(1.0 - ndv, 0.0), 3.0) * 0.25;
  gl_FragColor = vec4(fogged(col, vW), cov);
}`;

const SHEET_VS = /* glsl */`${COMMON}
attribute float aVar; attribute float aBend;
varying vec2 vUv; varying vec3 vW; varying vec3 vN; varying float vVar;
void main(){
  vUv = uv; vVar = aVar;
  vec3 p = position;
  float cx = uv.x - 0.5, cy = uv.y - 0.5;
  p.z += (cx * cx * 1.6 + sin(uv.y * 3.1416 + uTime * 1.3 + aVar * 4.0) * 0.18) * aBend;
  mat4 m = modelMatrix * instanceMatrix;
  vec4 w = m * vec4(p, 1.0); vW = w.xyz;
  vN = mat3(m) * normalize(vec3(-cx * 3.2 * aBend, 0.0, 1.0));
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const SHEET_FS = /* glsl */`${COMMON}
uniform sampler2D uPaper;
varying vec2 vUv; varying vec3 vW; varying vec3 vN; varying float vVar;
void main(){
  vec3 V = normalize(cameraPosition - vW);
  vec3 N = normalize(vN);
  float f = abs(dot(N, V));
  vec2 uv = gl_FrontFacing ? vUv : vec2(1.0 - vUv.x, vUv.y);
  vec3 tex = texture2D(uPaper, vec2((vVar + uv.x) / 3.0, uv.y)).rgb;
  vec3 col = tex * (gl_FrontFacing ? 0.42 + 0.3 * f : 0.22 + 0.12 * f);
  col = mix(col, col * vec3(0.8, 1.0, 0.95), 0.4);
  col += uAcc * pow(max(1.0 - f, 0.0), 2.0) * 0.18 + uAcc * pulse(vW) * 0.05;
  gl_FragColor = vec4(fogged(col, vW), 1.0);
}`;

const CELL_VS = /* glsl */`${COMMON}
attribute float aSeed;
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vR; varying float vSeed;
void main(){
  vSeed = aSeed;
  mat4 m = modelMatrix * instanceMatrix;
  vec3 drift = vec3(sin(uTime * 0.11 + aSeed * 7.0), sin(uTime * 0.09 + aSeed * 3.0) * 0.7, cos(uTime * 0.1 + aSeed * 5.0)) * 0.9;
  vec3 c = (m * vec4(0.0, 0.0, 0.0, 1.0)).xyz + drift;
  float r = length(mat3(m) * vec3(1.0, 0.0, 0.0));
  float pul = pulse(c);
  vec3 pos = position * (1.0 + 0.055 * sin(position.x * 3.0 + uTime * 0.8 + aSeed * 6.0) * sin(position.y * 2.6 - uTime * 0.6) + 0.04 * pul);
  vec3 w = (m * vec4(pos, 1.0)).xyz + drift;
  vW = w; vC = c; vR = r; vN = mat3(m) * normal;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`;
const CELL_FS = /* glsl */`${COMMON}
varying vec3 vW; varying vec3 vN; varying vec3 vC; varying float vR; varying float vSeed;
void main(){
  vec3 V = normalize(cameraPosition - vW);
  float ndv = abs(dot(normalize(vN), V));
  float fres = pow(max(1.0 - ndv, 0.0), 2.4);
  vec3 nc = vC + vec3(sin(vSeed * 11.0), cos(vSeed * 7.0), sin(vSeed * 5.0)) * vR * 0.3;
  vec3 dir = -V;
  float t = dot(nc - cameraPosition, dir);
  float d = length(cameraPosition + dir * t - nc);
  float nuc = gs(d / (vR * 0.2));
  float halo = gs(d / (vR * 0.55));
  float pul = pulse(vC);
  float vis = (1.0 - fogF(vW)) * smoothstep(2.5, 10.0, length(vW - cameraPosition));
  vec3 col = uAcc * fres * (0.26 + 1.0 * pul) + vec3(0.6, 1.0, 0.88) * nuc * (0.12 + 0.34 * pul) + uAcc * halo * 0.03 + uAcc * 0.01;
  gl_FragColor = vec4(col * vis, 1.0);
}`;

const DUST_VS = /* glsl */`${COMMON}
attribute float aSeed; uniform float uPx;
varying float vA;
void main(){
  vec3 p = position + vec3(sin(uTime * 0.2 + aSeed * 9.0), sin(uTime * 0.15 + aSeed * 4.0), cos(uTime * 0.17 + aSeed * 6.0)) * 0.7;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;
  float dist = -mv.z;
  gl_PointSize = clamp(uPx * (0.5 + aSeed) / max(dist, 0.1), 1.0, 10.0);
  vA = (1.0 - fogF(p)) * smoothstep(1.5, 5.0, dist) * (0.3 + 0.9 * pulse(p));
}`;
const DUST_FS = /* glsl */`${COMMON}
varying float vA;
void main(){ float r = length(gl_PointCoord - 0.5); float a = smoothstep(0.5, 0.0, r) * vA; gl_FragColor = vec4((uAcc * 1.2 + vec3(0.15)) * a, 1.0); }`;

const ECG_VS = /* glsl */`attribute float aS; attribute float aTr; varying float vS; varying float vTr; varying vec3 vW;
void main(){ vS = aS; vTr = aTr; vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`;
const ECG_FS = /* glsl */`${COMMON}
uniform float uLen; uniform float uSpd;
varying float vS; varying float vTr; varying vec3 vW;
void main(){
  float span = uLen + 40.0;
  float head = mod(uTime * uSpd + vTr * 41.0, span) - 20.0;
  float d = head - vS;
  float trail = d >= 0.0 ? exp(-d / 26.0) : 0.0;
  float hd = exp(-d * d / 0.5);
  vec3 col = uAcc * (0.06 + 1.5 * trail) + vec3(0.8, 1.0, 0.95) * hd * 2.4;
  gl_FragColor = vec4(col * (1.0 - fogF(vW)), 1.0);
}`;

const SHAFT_VS = /* glsl */`${COMMON}
attribute vec3 aC; attribute vec2 aSz; attribute float aSeed;
varying vec2 vUv; varying vec3 vW; varying float vSeed;
void main(){
  vUv = uv; vSeed = aSeed;
  vec3 camR = vec3(viewMatrix[0][0], viewMatrix[1][0], viewMatrix[2][0]);
  vec3 right = normalize(vec3(camR.x, 0.0, camR.z) + 1e-5);
  float hy = position.y + 0.5;
  float lean = 0.18 + sin(uTime * 0.12 + aSeed * 6.0) * 0.05;
  vec3 w = aC + right * (position.x * aSz.x * (0.6 + 0.4 * hy) + hy * aSz.y * lean) + vec3(0.0, hy * aSz.y, 0.0);
  vW = w;
  gl_Position = projectionMatrix * viewMatrix * vec4(w, 1.0);
}`;
const SHAFT_FS = /* glsl */`${COMMON}
varying vec2 vUv; varying vec3 vW; varying float vSeed;
void main(){
  float x = vUv.x * 2.0 - 1.0;
  float a = pow(max(1.0 - x * x, 0.0), 2.2) * smoothstep(0.0, 0.75, vUv.y) * (0.65 + 0.35 * sin(vUv.y * 5.0 + uTime * 0.25 + vSeed * 5.0));
  vec3 col = mix(uAcc, vec3(0.85, 1.0, 0.95), 0.55) * a * 0.075;
  gl_FragColor = vec4(col * (1.0 - fogF(vW)), 1.0);
}`;

// frosted glass: membrane doors (an annulus around the camera's path) and floating partitions (rounded slabs)
const GLASS_VS = /* glsl */`
attribute vec2 aSize; attribute float aHole;
varying vec2 vUv; varying vec3 vW; varying vec2 vSize; varying float vHole; varying vec3 vN;
void main(){
  vUv = uv; vSize = aSize; vHole = aHole;
  mat4 m = modelMatrix * instanceMatrix;
  vec4 w = m * vec4(position, 1.0); vW = w.xyz; vN = mat3(m) * vec3(0.0, 0.0, 1.0);
  gl_Position = projectionMatrix * viewMatrix * w;
}`;
const GLASS_FS = /* glsl */`${COMMON}
varying vec2 vUv; varying vec3 vW; varying vec2 vSize; varying float vHole; varying vec3 vN;
void main(){
  vec2 p = (vUv - 0.5) * vSize;
  float a, rim, fill;
  float n = n21(p * 0.18 + uTime * 0.015) * 0.65 + n21(p * 0.7 - uTime * 0.02) * 0.35;
  if (vHole > 0.0) {
    float r = length(p);
    float wob = (n21(vec2(atan(p.y, p.x) * 2.0, uTime * 0.2)) - 0.5) * 0.5;
    float e = r - vHole - wob;
    a = smoothstep(0.0, 0.9, e) * (1.0 - smoothstep(vSize.x * 0.26, vSize.x * 0.5, r));
    rim = gs((e - 0.3) / 0.16) + 0.35 * gs((e - 0.3) / 0.6);
    fill = 0.1 + 0.32 * exp(-max(e, 0.0) / 3.5);
  } else {
    float d = sdRB(p, vSize * 0.5, 0.9);
    a = 1.0 - smoothstep(-0.4, 0.0, d);
    rim = gs(d / 0.06) * step(d, 0.15);
    float sheen = gs((p.x * 0.6 + p.y * 0.8 - vSize.y * 0.15) / (vSize.y * 0.18));
    fill = 0.13 + 0.16 * (0.5 + p.y / vSize.y) + 0.2 * sheen;
  }
  float pul = pulse(vW);
  float ndv = abs(dot(normalize(vN), normalize(cameraPosition - vW)));
  vec3 frost = mix(vec3(0.16, 0.36, 0.33), vec3(0.6, 0.9, 0.84), n) * (0.3 + 0.25 * pul);
  vec3 col = frost + uAcc * rim * (1.0 + 2.4 * pul);
  float alpha = a * fill * (0.75 + 0.5 * n) * (0.8 + 0.4 * (1.0 - ndv)) + rim * 0.6;
  float near = smoothstep(1.0, 6.0, length(vW - cameraPosition));
  gl_FragColor = vec4(fogged(col, vW), clamp(alpha, 0.0, 1.0) * near * (1.0 - fogF(vW) * 0.8));
}`;

// the demo phone's halo: a glow that beats behind the real (DOM) phone
const HALO_FS = /* glsl */`${COMMON}
uniform float uW; uniform float uAsp;
varying vec2 vUv;
void main(){
  vec2 p = (vUv - 0.5) * 2.0;
  vec2 q = p; q.x /= uAsp;
  float d = max(abs(q.x) * 1.0, abs(q.y)) ;                // a soft rounded-square around the phone
  float r = mix(length(q), d, 0.6);
  float glow = gs(max(r - 0.4, 0.0) / 0.16) * 0.75 + exp(-r * r * 3.0) * 0.08;
  float ph = mod(uTime, PERIOD) / PERIOD;
  float ring = 0.0;
  for (int i = 0; i < 2; i++) {
    float f = fract(ph - float(i) * 0.28);
    float rr = 0.42 + f * 0.58;
    ring += gs((r - rr) / 0.02) * (1.0 - f) * (i == 0 ? 1.0 : 0.6);
  }
  float edge = 1.0 - smoothstep(0.85, 1.0, length(p) * 0.75);
  vec3 col = uAcc * (glow * (0.8 + 0.9 * beatAt(uTime)) + ring * 2.2) * edge;
  gl_FragColor = vec4(col * uW, 1.0);
}`;
const PLAIN_VS = /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;

// the boundary: a frosted heartbeat ripple (lub and dub) that refracts, frosts and lights the frame as it passes
const RIPPLE = {
  uniforms: { tDiffuse: { value: null }, uRes: { value: null }, uRip: { value: 99 }, uRipC: { value: null }, uAcc: { value: null }, uVig: { value: 0.5 } },
  vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
uniform sampler2D tDiffuse; uniform vec2 uRes; uniform float uRip; uniform vec2 uRipC; uniform vec3 uAcc; uniform float uVig;
varying vec2 vUv;
float gs(float x){ return exp(-x * x); }
float ringAt(float dist, float t){
  if (t < 0.0) return 0.0;
  float r = t * 1.15, w = 0.045 + t * 0.07;
  return gs((dist - r) / w) * (1.0 - smoothstep(0.5, 1.6, t));
}
void main(){
  vec2 asp = vec2(uRes.x / uRes.y, 1.0);
  vec2 d = (vUv - uRipC) * asp;
  float dist = length(d);
  vec2 dir = (d / max(dist, 1e-4)) / asp;
  float b = ringAt(dist, uRip) + 0.7 * ringAt(dist, uRip - 0.3);
  vec2 uv = vUv - dir * b * 0.03;
  vec3 col = texture2D(tDiffuse, uv).rgb;
  if (b > 0.004) {
    vec3 acc = vec3(0.0);
    float rad = 0.012 * b + 0.0015;
    for (int i = 0; i < 8; i++) {
      float a = float(i) * 0.7854 + fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453) * 0.8;
      acc += texture2D(tDiffuse, uv + vec2(cos(a), sin(a)) * rad / asp).rgb;
    }
    acc /= 8.0;
    float fb = clamp(b * 1.5, 0.0, 1.0);
    col = mix(col, acc, fb);
    col.r = mix(col.r, texture2D(tDiffuse, uv - dir * b * 0.007).r, 0.5 * fb);
    col.b = mix(col.b, texture2D(tDiffuse, uv + dir * b * 0.007).b, 0.5 * fb);
    col = mix(col, col * 0.85 + vec3(0.06, 0.1, 0.095), fb * 0.5) + uAcc * b * 0.22;
  }
  vec2 q = vUv - 0.5;
  col *= 1.0 - dot(q * vec2(0.9, 1.1), q * vec2(0.9, 1.1)) * uVig;
  gl_FragColor = vec4(col, 1.0);
}`,
};

/* ── the ECG trace in two dimensions (s along, y up) ───────────── */
function ecg(ph) {
  const g = (c, w) => Math.exp(-(((ph - c) / w) ** 2));
  return 0.13 * g(0.18, 0.04) - 0.16 * g(0.36, 0.014) + 1.0 * g(0.39, 0.016) - 0.28 * g(0.425, 0.016) + 0.27 * g(0.63, 0.055);
}

/* ── build ────────────────────────────────────────────────── */
async function build(THREE, P, { lenis, loaded, onLost }) {
  const root = document.documentElement;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const mob = coarse || Math.min(innerWidth, innerHeight) < 600;
  const Q = mob
    ? { cards: 16, sheets: 10, cells: 34, dust: 520, shafts: 7, slabs: 6, atlas: 1024, samples: 2, maxDpr: 1 }
    : { cards: 28, sheets: 18, cells: 72, dust: 1400, shafts: 12, slabs: 12, atlas: 2048, samples: 4, maxDpr: 1.5 };
  let dpr = Math.min(devicePixelRatio || 1, Q.maxDpr);
  const minDpr = Math.min(dpr, mob ? 0.75 : 1);
  const N = Q.cards, S = Q.sheets;

  // the screens first: if they cannot load, there is no dimension
  const fontReady = Promise.race([document.fonts?.load?.('600 30px Rubik') ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1500))]).catch(() => {});
  const [imgs] = await loaded(Promise.all([Promise.all(SHOTS.map(loadImg)), fontReady]));

  const wrap = document.createElement('div');
  wrap.className = 'mzd'; wrap.setAttribute('aria-hidden', 'true');
  wrap.innerHTML = '<canvas class="mzd__cv"></canvas><div class="mzd__scrim"></div>';
  document.body.prepend(wrap);
  const canvas = wrap.querySelector('canvas');
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.NeutralToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  let shaderFailed = false;
  renderer.debug.onShaderError = () => { shaderFailed = true; };   // a shader that does not compile: the page's world instead
  // half-float targets need a renderable float format; without one, 8-bit targets (less bloom range, but a picture)
  const floatRT = renderer.extensions.has('EXT_color_buffer_half_float') || renderer.extensions.has('EXT_color_buffer_float');

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1400);
  const acc = new THREE.Color(ACC_HEX); // linear
  const U = { uTime: { value: 0 }, uAcc: { value: new THREE.Vector3(acc.r, acc.g, acc.b) } };
  const V3 = (a) => new THREE.Vector3(a[0], a[1], a[2]);

  // chapters: vectors and a basis per formation (x right, y up, z toward its camera)
  const ch = CHAP.map((c) => ({ ...c, F: V3(c.F), C: V3(c.C), T: V3(c.T), Tm: V3(c.Tm) }));
  for (const c of ch) {
    let B = c.C.clone().sub(c.F);
    if (B.lengthSq() < 4) B = c.C.clone().sub(c.T);
    B.normalize();
    const R = new THREE.Vector3(0, 1, 0).cross(B).normalize();
    const Uv = B.clone().cross(R);
    c.R = R; c.U = Uv; c.B = B; c.q = new THREE.Quaternion().setFromRotationMatrix(new THREE.Matrix4().makeBasis(R, Uv, B));
    c.d = c.C.distanceTo(c.F);
  }
  // the flight: chapter, door, chapter, door … through Catmull-Rom splines for the eye and for the target
  const posPts = [], tgtPts = [], tgtPtsM = [], doors = [];
  for (let i = 0; i < NCH; i++) {
    const c = ch[i];
    posPts.push(c.C); tgtPts.push(c.T); tgtPtsM.push(c.Tm);
    if (i < NCH - 1) {
      const n = ch[i + 1];
      const v = c.C.clone().lerp(n.C, 0.5).add(V3(VIA_OFF[i]));
      const fwd = n.C.clone().sub(c.C).normalize();
      const vt = v.clone().addScaledVector(fwd, 26);
      posPts.push(v); tgtPts.push(vt); tgtPtsM.push(vt.clone());
      doors.push({ p: v, n: fwd });
    }
  }
  const curveP = new THREE.CatmullRomCurve3(posPts, false, 'centripetal');
  const curveT = new THREE.CatmullRomCurve3(tgtPts, false, 'centripetal');
  const curveTm = new THREE.CatmullRomCurve3(tgtPtsM, false, 'centripetal');

  /* textures */
  const aw = Q.atlas, cw = aw / 4, chh = Math.round((cw * 1170) / 540);
  const ac = document.createElement('canvas'); ac.width = aw; ac.height = chh;
  const ag = ac.getContext('2d');
  imgs.forEach((im, i) => ag.drawImage(im, i * cw, 0, cw, chh));
  const atlas = new THREE.CanvasTexture(ac);
  atlas.colorSpace = THREE.SRGBColorSpace; atlas.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const pc = document.createElement('canvas'); pc.width = mob ? 768 : 1152; pc.height = Math.round((pc.width / 3) * 1.414);
  { const g = pc.getContext('2d'); g.scale(pc.width / 1152, pc.height / Math.round(384 * 1.414)); drawPapers(g, 1152, Math.round(384 * 1.414)); }
  const paper = new THREE.CanvasTexture(pc); paper.colorSpace = THREE.SRGBColorSpace; paper.anisotropy = 4;

  /* the room */
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 32, 16), new THREE.ShaderMaterial({ uniforms: { ...U }, vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false }));
  sky.renderOrder = -10; sky.frustumCulled = false; scene.add(sky);

  const floor = new THREE.Mesh(new THREE.PlaneGeometry(700, 900), new THREE.ShaderMaterial({ uniforms: { ...U }, vertexShader: SKY_VS, fragmentShader: FLOOR_FS }));
  floor.rotation.x = -Math.PI / 2; floor.position.set(0, -15, -220); floor.renderOrder = -5; scene.add(floor);

  // the cards
  const cardGeo = new THREE.PlaneGeometry(CW, CH);
  const aShot = new Float32Array(N), aLit = new Float32Array(N);
  for (let i = 0; i < N; i++) aShot[i] = i % 4;
  cardGeo.setAttribute('aShot', new THREE.InstancedBufferAttribute(aShot, 1));
  const litAttr = new THREE.InstancedBufferAttribute(aLit, 1); litAttr.setUsage(THREE.DynamicDrawUsage);
  cardGeo.setAttribute('aLit', litAttr);
  const cardMat = new THREE.ShaderMaterial({ uniforms: { ...U, uAtlas: { value: atlas }, uNShots: { value: 4 } }, vertexShader: CARD_VS, fragmentShader: CARD_FS, side: THREE.DoubleSide, alphaToCoverage: true });
  const cards = new THREE.InstancedMesh(cardGeo, cardMat, N);
  cards.instanceMatrix.setUsage(THREE.DynamicDrawUsage); cards.frustumCulled = false; scene.add(cards);

  // the paper sheets of the problem chapter
  const sheetGeo = new THREE.PlaneGeometry(SW, SH, 8, 10);
  const aVar = new Float32Array(S), aBend = new Float32Array(S);
  for (let i = 0; i < S; i++) { aVar[i] = i % 3; aBend[i] = 0.15 + rnd(i, 40) * 0.35; }
  sheetGeo.setAttribute('aVar', new THREE.InstancedBufferAttribute(aVar, 1));
  sheetGeo.setAttribute('aBend', new THREE.InstancedBufferAttribute(aBend, 1));
  const sheets = new THREE.InstancedMesh(sheetGeo, new THREE.ShaderMaterial({ uniforms: { ...U, uPaper: { value: paper } }, vertexShader: SHEET_VS, fragmentShader: SHEET_FS, side: THREE.DoubleSide }), S);
  sheets.instanceMatrix.setUsage(THREE.DynamicDrawUsage); sheets.frustumCulled = false; scene.add(sheets);

  // cells: translucent membranes with a glowing nucleus, scattered around the flight
  const cellGeo = new THREE.IcosahedronGeometry(1, mob ? 2 : 3);
  const aSeed = new Float32Array(Q.cells);
  const cells = new THREE.InstancedMesh(cellGeo, new THREE.ShaderMaterial({ uniforms: { ...U }, vertexShader: CELL_VS, fragmentShader: CELL_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), Q.cells);
  {
    const m = new THREE.Matrix4(), p = new THREE.Vector3(), q = new THREE.Quaternion(), s = new THREE.Vector3();
    for (let i = 0; i < Q.cells; i++) {
      const u = (i + rnd(i, 1)) / Q.cells;
      const c = curveP.getPoint(u);
      const big = rnd(i, 2) > 0.86;
      const r = big ? 6 + rnd(i, 3) * 7 : 0.7 + Math.pow(rnd(i, 3), 1.8) * 3.2;
      const ang = rnd(i, 4) * TAU, dist = (big ? 24 : 7) + r + rnd(i, 5) * (big ? 26 : 16);
      p.set(c.x + Math.cos(ang) * dist * 1.25, c.y + Math.sin(ang) * dist * 0.62 + 1, c.z - rnd(i, 6) * 18);
      s.setScalar(r); m.compose(p, q, s); cells.setMatrixAt(i, m); aSeed[i] = rnd(i, 7);
    }
    cellGeo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSeed, 1));
  }
  cells.frustumCulled = false; cells.renderOrder = 2; scene.add(cells);

  // light shafts from the skylights
  {
    const g = new THREE.InstancedBufferGeometry().copy(new THREE.PlaneGeometry(1, 1));
    const n = Q.shafts, aC = new Float32Array(n * 3), aSz = new Float32Array(n * 2), aSd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const c = ch[Math.floor((i / n) * NCH)];
      const side = i % 2 ? 1 : -1;
      aC[i * 3] = c.F.x + side * (5 + rnd(i, 1) * 14); aC[i * 3 + 1] = -15; aC[i * 3 + 2] = c.F.z - 8 - rnd(i, 2) * 22;
      aSz[i * 2] = 5 + rnd(i, 3) * 9; aSz[i * 2 + 1] = 60; aSd[i] = rnd(i, 4);
    }
    g.setAttribute('aC', new THREE.InstancedBufferAttribute(aC, 3));
    g.setAttribute('aSz', new THREE.InstancedBufferAttribute(aSz, 2));
    g.setAttribute('aSeed', new THREE.InstancedBufferAttribute(aSd, 1));
    g.instanceCount = n;
    const shafts = new THREE.Mesh(g, new THREE.ShaderMaterial({ uniforms: { ...U }, vertexShader: SHAFT_VS, fragmentShader: SHAFT_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    shafts.frustumCulled = false; shafts.renderOrder = 1; scene.add(shafts);
  }

  // heart-monitor traces on the horizon of every chapter, swept by a bright head
  {
    const L = 150, step = 0.07, per = 15, amp = 3.2, wdt = 0.07;
    const n = Math.floor(L / step) + 1;
    const pos = [], aS = [], aTr = [], idx = [];
    let base = 0;
    ch.forEach((c, k) => {
      const z = -30 - (k % 2) * 8, y0 = (k === 6 ? 7 : -5.5) + (k % 3) * 1.2;
      for (let j = 0; j < n; j++) {
        const s = j * step;
        const y = ecg(((s / per) + k * 0.37) % 1) * amp;
        const y2 = ecg((((s + step) / per) + k * 0.37) % 1) * amp;
        let tx = step, ty = y2 - y; const tl = Math.hypot(tx, ty); tx /= tl; ty /= tl;
        for (const sd of [-1, 1]) {
          const lx = s - L / 2 - ty * sd * wdt, ly = y0 + y + tx * sd * wdt;
          const w = c.F.clone().addScaledVector(c.R, lx).addScaledVector(c.U, ly).addScaledVector(c.B, z);
          pos.push(w.x, w.y, w.z); aS.push(s); aTr.push(k);
        }
        if (j < n - 1) { const a = base + j * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
      }
      base += n * 2;
    });
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
    g.setAttribute('aS', new THREE.Float32BufferAttribute(aS, 1));
    g.setAttribute('aTr', new THREE.Float32BufferAttribute(aTr, 1));
    g.setIndex(idx);
    const ecgMesh = new THREE.Mesh(g, new THREE.ShaderMaterial({ uniforms: { ...U, uLen: { value: L }, uSpd: { value: per / PERIOD } }, vertexShader: ECG_VS, fragmentShader: ECG_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
    ecgMesh.frustumCulled = false; ecgMesh.renderOrder = 3; scene.add(ecgMesh);
  }

  // dust motes
  let dustMat = null;
  {
    const n = Q.dust, pos = new Float32Array(n * 3), sd = new Float32Array(n);
    for (let i = 0; i < n; i++) {
      const c = curveP.getPoint(rnd(i, 1));
      pos[i * 3] = c.x + (rnd(i, 2) - 0.5) * 50; pos[i * 3 + 1] = c.y + (rnd(i, 3) - 0.5) * 26; pos[i * 3 + 2] = c.z + (rnd(i, 4) - 0.5) * 40;
      sd[i] = rnd(i, 5);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    g.setAttribute('aSeed', new THREE.BufferAttribute(sd, 1));
    const dust = new THREE.Points(g, new THREE.ShaderMaterial({ uniforms: { ...U, uPx: { value: 0 } }, vertexShader: DUST_VS, fragmentShader: DUST_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    dust.frustumCulled = false; dust.renderOrder = 4; scene.add(dust);
    dustMat = dust.material;
  }

  // frosted glass: a membrane door at every chapter boundary, partitions floating around the chapters
  {
    const nd = doors.length, n = nd + Q.slabs;
    const g = new THREE.PlaneGeometry(1, 1);
    const aSize = new Float32Array(n * 2), aHole = new Float32Array(n);
    const glass = new THREE.InstancedMesh(g, new THREE.ShaderMaterial({ uniforms: { ...U }, vertexShader: GLASS_VS, fragmentShader: GLASS_FS, transparent: true, depthWrite: false, side: THREE.DoubleSide }), n);
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), s = new THREE.Vector3(), z = new THREE.Vector3(0, 0, 1);
    doors.forEach((d, i) => {
      q.setFromUnitVectors(z, d.n); s.set(64, 64, 1); m.compose(d.p, q, s); glass.setMatrixAt(i, m);
      aSize[i * 2] = 64; aSize[i * 2 + 1] = 64; aHole[i] = 6.5;
    });
    for (let j = 0; j < Q.slabs; j++) {
      const i = nd + j, c = ch[Math.floor((j / Q.slabs) * NCH)];
      const side = j % 2 ? 1 : -1;
      const w = 7 + rnd(j, 1) * 6, h = 10 + rnd(j, 2) * 8;
      const p = c.F.clone().addScaledVector(c.R, side * (13 + rnd(j, 3) * 9)).addScaledVector(c.U, (rnd(j, 4) - 0.4) * 6).addScaledVector(c.B, -10 - rnd(j, 5) * 14);
      q.copy(c.q).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler(0, -side * (0.35 + rnd(j, 6) * 0.4), (rnd(j, 7) - 0.5) * 0.12)));
      s.set(w, h, 1); m.compose(p, q, s); glass.setMatrixAt(i, m);
      aSize[i * 2] = w; aSize[i * 2 + 1] = h; aHole[i] = 0;
    }
    g.setAttribute('aSize', new THREE.InstancedBufferAttribute(aSize, 2));
    g.setAttribute('aHole', new THREE.InstancedBufferAttribute(aHole, 1));
    glass.frustumCulled = false; glass.renderOrder = 6; scene.add(glass);
  }

  // the halo behind the live demo phone
  const haloMat = new THREE.ShaderMaterial({ uniforms: { ...U, uW: { value: 0 }, uAsp: { value: 540 / 1170 } }, vertexShader: PLAIN_VS, fragmentShader: HALO_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const halo = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), haloMat);
  halo.frustumCulled = false; halo.renderOrder = 5; halo.visible = false; scene.add(halo);

  /* post */
  const rt = new THREE.WebGLRenderTarget(1, 1, { type: floatRT ? THREE.HalfFloatType : THREE.UnsignedByteType, samples: 0 });
  const composer = new P.EffectComposer(renderer, rt);
  // the composer clones rt into renderTarget2, and renderTarget2 is its first readBuffer: the RenderPass always draws
  // into it (the buffers are re-aligned after every frame). So only that one multisamples; rt holds post output only.
  composer.renderTarget2.samples = Q.samples;
  composer.addPass(new P.RenderPass(scene, camera));
  const bloom = new P.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), mob ? 0.6 : 0.72, 0.62, 0.82);
  composer.addPass(bloom);
  if (!floatRT) for (const t of [bloom.renderTargetBright, ...bloom.renderTargetsHorizontal, ...bloom.renderTargetsVertical]) t.texture.type = THREE.UnsignedByteType;
  const ripple = new P.ShaderPass(RIPPLE);
  ripple.uniforms.uRes.value = new THREE.Vector2(innerWidth, innerHeight);
  ripple.uniforms.uRipC.value = new THREE.Vector2(0.5, 0.5);
  ripple.uniforms.uAcc.value = U.uAcc.value;
  composer.addPass(ripple);
  composer.addPass(new P.OutputPass());

  /* state */
  let W = innerWidth, H = innerHeight, portrait = W < H * 0.95;
  let anchors = [], maxScroll = 1;
  const measure = () => {
    const vh = H; maxScroll = Math.max(1, document.documentElement.scrollHeight - vh);
    anchors = ANCHORS.map((f) => clamp(f(vh, maxScroll), 0, maxScroll));
    for (let i = 1; i < anchors.length; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + 40);
  };
  const resize = () => {
    W = innerWidth; H = innerHeight; portrait = W < H * 0.95;
    const px = Math.min(dpr, Math.sqrt(PX_BUDGET / (W * H)));
    renderer.setPixelRatio(px); renderer.setSize(W, H, false);
    composer.setPixelRatio(px); composer.setSize(W, H);
    ripple.uniforms.uRes.value.set(W, H);
    camera.aspect = W / H; camera.updateProjectionMatrix();
    dustMat.uniforms.uPx.value = H * px * 0.11;
    measure();
  };
  // resize: debounced; on a phone a height-only change under 150 px is the browser's toolbar sliding,
  // so nothing reallocates and the anchors stay (no false ripple)
  let rsT = 0;
  const onResize = () => {
    clearTimeout(rsT);
    rsT = setTimeout(() => { if (!(coarse && innerWidth === W && Math.abs(innerHeight - H) < 150)) resize(); }, 160);
  };
  resize();
  addEventListener('resize', onResize);
  const ro = new ResizeObserver(() => measure()); ro.observe(document.body);

  const kFromScroll = (y) => {
    if (y <= anchors[0]) return 0;
    for (let c = 0; c < NCH - 1; c++) {
      if (y < anchors[c + 1]) { const t = (y - anchors[c]) / (anchors[c + 1] - anchors[c]); return c + sstep(0.1, 0.9, t) * 0.86 + t * 0.14; }
    }
    return NCH - 1;
  };

  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  const onPtr = (e) => { ptr.tx = (e.clientX / W) * 2 - 1; ptr.ty = (e.clientY / H) * 2 - 1; };
  if (!mob) addEventListener('pointermove', onPtr, { passive: true });

  // formations
  const tmpE = new THREE.Euler(), tmpQ = new THREE.Quaternion(), tmpV = new THREE.Vector3(), tmpV2 = new THREE.Vector3();
  const mk = (n) => Array.from({ length: n }, () => ({ p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, lit: 0.5 }));
  const fa = mk(N), fb = mk(N), sa = mk(S), sb = mk(S);
  const halo3 = { p: new THREE.Vector3(), h: 4, ok: false };
  let time = 0;

  const local = (c, x, y, z, rx, ry, rz, o) => {
    o.p.copy(c.F).addScaledVector(c.R, x).addScaledVector(c.U, y).addScaledVector(c.B, z);
    tmpE.set(rx, ry, rz); o.q.copy(c.q).multiply(tmpQ.setFromEuler(tmpE));
  };
  const pres = (k, c) => clamp(k - c + 0.5);

  function cardForm(ci, i, o, k) {
    const c = ch[ci], P = portrait, t = time;
    o.s = 1; o.lit = 0.75;
    switch (ci) {
      case 0: { // hero: a helix around the camera axis
        const a = i * 0.74 + t * 0.07;
        const z = 9 - (i / (N - 1)) * 36;
        const r = (P ? 2.5 : 4.3) + Math.sin(i * 1.7) * 0.45;
        const x = Math.cos(a) * r * (P ? 1 : 1.32), y = Math.sin(a) * r * (P ? 1.45 : 0.85) + Math.sin(t * 0.5 + i) * 0.12;
        local(c, x, y, z, y * 0.13, -x * 0.12, Math.sin(a) * 0.12, o);
        o.lit = 0.85;
        if (!P) {
          tmpV.copy(o.p).applyMatrix4(camera.matrixWorldInverse);
          const lim = -tmpV.z * Math.tan((camera.fov * Math.PI) / 360) * camera.aspect * 0.06;
          if (tmpV.x > lim) { tmpV.x = lim - (tmpV.x - lim); tmpV.z -= 2; o.p.copy(tmpV.applyMatrix4(camera.matrixWorld)); }
          o.lit = 0.85 - 0.4 * sstep(lim - 6, lim, tmpV.x);
        }
        break;
      }
      case 1: { // problem: paper chaos, a vortex
        const s1 = rnd(i, 11), s2 = rnd(i, 12), s3 = rnd(i, 13);
        const a = s1 * TAU + t * (0.16 + s2 * 0.2);
        const rad = 2 + s2 * (P ? 3.6 : 7.5);
        local(c, Math.cos(a) * rad, (s3 - 0.5) * (P ? 12 : 9) + Math.sin(t * 0.5 + i) * 0.6, Math.sin(a) * rad * 0.7 - 1,
          t * (0.25 + s1 * 0.4) + s2 * 6, t * (0.18 + s3 * 0.35) + s1 * 6, s3 * 6 + t * 0.15, o);
        o.lit = 0.35; o.s = 0.9; break;
      }
      case 2: { // built: the week's calendar, lit row by row
        const cols = P ? 4 : 7, rows = Math.ceil(N / cols);
        const col = i % cols, row = Math.floor(i / cols);
        const gx = ((cols - 1) / 2 - col) * (CW + 0.34), gy = ((rows - 1) / 2 - row) * (CH + 0.36);
        const g = P ? 0 : 0.3;
        local(c, gx * Math.cos(g), gy, -gx * Math.sin(g), 0, g, 0, o);
        const p = pres(k, 2);
        o.lit = 0.08 + 0.9 * sstep(0.2 + row * 0.07, 0.3 + row * 0.07, p);
        break;
      }
      case 3: { // today: a cluster of four screens per clinic
        const nc = Math.ceil(N / 4), j = Math.floor(i / 4), m = i % 4;
        const a = (j / nc) * TAU + t * 0.05 + 0.5;
        const R = P ? 3.2 : 7.4;
        const cx = Math.cos(a) * R * (P ? 1 : 1.12), cy = Math.sin(a) * R * (P ? 1.7 : 0.62), cz = Math.sin(a * 2 + 1) * 1.6;
        local(c, cx + (m - 1.5) * 0.5, cy - Math.abs(m - 1.5) * 0.12, cz + m * 0.06, 0, -cx * 0.04, -(m - 1.5) * 0.17, o);
        o.s = P ? 0.62 : 0.72; o.lit = 0.8; break;
      }
      case 4: { // gallery: a ring of screens radiating around the page's own
        const a = (i / N) * TAU + t * 0.035 + (pres(k, 4) - 0.5) * 0.9;
        const rx = P ? 4.6 : 10.2, ry = P ? 8.6 : 6.9;
        local(c, Math.cos(a) * rx, Math.sin(a) * ry, -3 + Math.sin(a * 3 + t * 0.3) * 0.6, 0, 0, a - Math.PI / 2, o);
        o.s = P ? 0.7 : 0.9; o.lit = 0.7; break;
      }
      case 5: { // demo: a funnel onto the real phone
        if (!halo3.ok) { local(c, 0, 0, 0, 0, 0, 0, o); o.s = 0.0001; break; }
        const nr = Math.ceil(N / 4), q = Math.floor(i / 4), m = i % 4;
        const f = 0.3 + 0.62 * (q / Math.max(1, nr - 1));
        tmpV.copy(halo3.p).sub(camera.position);
        const L = tmpV.length(); tmpV.divideScalar(L);
        const ang = Math.atan2(halo3.h * 0.5, L) * 1.65 + 0.06;
        const rad = L * f * Math.tan(ang);
        const th = m * (TAU / 4) + q * 0.62 + t * 0.12;
        tmpV2.setFromMatrixColumn(camera.matrixWorld, 0);
        o.p.copy(camera.position).addScaledVector(tmpV, L * f).addScaledVector(tmpV2, Math.cos(th) * rad * 1.15);
        tmpV2.setFromMatrixColumn(camera.matrixWorld, 1);
        o.p.addScaledVector(tmpV2, Math.sin(th) * rad);
        tmpE.set(Math.sin(th) * 0.35, -Math.cos(th) * 0.35, th * 0.1);
        o.q.copy(camera.quaternion).multiply(tmpQ.setFromEuler(tmpE));
        o.s = 0.5 + f * 0.3; o.lit = 0.65; break;
      }
      case 6: { // tech: a ring that orbits the camera
        const a = (i / N) * TAU + t * 0.06 + pres(k, 6) * 1.1;
        const R = P ? 6.2 : 8.6;
        o.p.set(c.F.x + Math.cos(a) * R, c.F.y + 0.75 + (i % 2 ? 1.6 : -1.6) * (P ? 1.25 : 1), c.F.z + Math.sin(a) * R);
        tmpE.set(0, Math.atan2(-Math.cos(a), -Math.sin(a)), 0); o.q.setFromEuler(tmpE);
        o.s = 1.05; o.lit = 0.75; break;
      }
      default: { // cta: a heart trace that calms down
        const cols = N, row = 0, idx = i;
        const sp = P ? 0.88 : 1.32;
        const x = ((cols - 1) / 2 - idx) * sp;
        const calm = 1 - 0.8 * sstep(0.45, 1, pres(k, 7));
        const ph = ((idx / cols) * (P ? 1 : 2) + 0.12 + t * 0.03) % 1;
        const y = ecg(ph) * (P ? 2.8 : 3.2) * calm + Math.sin(t * 0.6 + idx * 0.45) * 0.14 + row;
        local(c, x, y, -Math.abs(x) * 0.12, 0, x * 0.02, 0, o);
        o.s = P ? 0.5 : 0.78; o.lit = 0.82; break;
      }
    }
  }
  function sheetForm(ci, j, o, k, cardsF) {
    if (ci === 1) {
      const c = ch[1], P = portrait, t = time;
      const s1 = rnd(j, 21), s2 = rnd(j, 22), s3 = rnd(j, 23);
      const a = s1 * TAU + t * (0.2 + s2 * 0.25);
      const rad = 1.2 + s2 * (P ? 4.2 : 8.5);
      local(c, Math.cos(a) * rad, (s3 - 0.5) * (P ? 13 : 10), Math.sin(a) * rad * 0.7 - 1.5,
        t * (0.4 + s1 * 0.6) + s2 * 5, t * (0.3 + s3 * 0.5) + s1 * 5, s3 * 5 + t * 0.3, o);
      o.s = 1; return;
    }
    const src = cardsF[(j * 3) % N];
    o.p.copy(src.p); o.q.copy(src.q); o.s = 0.0001;
  }

  const m4 = new THREE.Matrix4(), sc = new THREE.Vector3(), pv = new THREE.Vector3(), qv = new THREE.Quaternion(), spin = new THREE.Quaternion(), ax = new THREE.Vector3();
  function blend(A, B, w, i, seed, o, near = 0) {
    const mid = Math.sin(Math.PI * w);
    pv.copy(A.p).lerp(B.p, w);
    tmpV2.setFromMatrixColumn(camera.matrixWorld, 0); pv.addScaledVector(tmpV2, (rnd(i, seed) - 0.5) * 9 * mid);
    tmpV2.setFromMatrixColumn(camera.matrixWorld, 1); pv.addScaledVector(tmpV2, (rnd(i, seed + 1) - 0.4) * 5 * mid);
    qv.copy(A.q).slerp(B.q, w);
    ax.set(rnd(i, seed + 2) - 0.5, rnd(i, seed + 3) - 0.5, rnd(i, seed + 4) - 0.5).normalize();
    spin.setFromAxisAngle(ax, mid * 1.3); qv.multiply(spin);
    let s = Math.max(1e-4, lerp(A.s, B.s, w));
    if (near) s = Math.max(1e-4, s * sstep(near * 0.45, near, pv.distanceTo(camera.position)));
    sc.setScalar(s); o.compose(pv, qv, sc);
    return lerp(A.lit, B.lit, w);
  }

  /* ripple trigger and the loop */
  let kS = -1, lastB = -1, ripT = 99;
  const prj = new THREE.Vector3();
  const mzPhone = document.querySelector('.mz__phone');
  const stats = { frames: 0, t0: performance.now(), fps: 0, dts: [] };
  window.__mzd = { stats, bloom, get k() { return kS; }, get dpr() { return dpr; }, anchors: () => anchors, dispose };
  let last = performance.now(), raf = 0, slow = 0;
  const intro0 = performance.now();

  const watch = new URLSearchParams(location.search).has('dimdbg') ? () => false : dimWatch();   // a phone that stays under 30 fps
  let watchLast = performance.now();
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000); last = now;
    const calm = root.classList.contains('reduce');
    if (!calm) time += dt;
    U.uTime.value = time;

    const kT = kFromScroll(lenis ? lenis.scroll : scrollY);
    kS = kS < 0 ? kT : damp(kS, kT, calm ? 20 : 4.2, dt);
    const c0 = clamp(Math.floor(kS), 0, NCH - 2), tt = kS - c0;

    // the camera
    const u = kS / (NCH - 1);
    curveP.getPoint(u, camera.position);
    (portrait ? curveTm : curveT).getPoint(u, tmpV);
    const intro = sstep(0, 3.2, (now - intro0) / 1000);
    camera.position.z += (1 - intro) * 12; camera.position.y += (1 - intro) * 2.5;
    ptr.x = damp(ptr.x, calm ? 0 : ptr.tx, 2.5, dt); ptr.y = damp(ptr.y, calm ? 0 : ptr.ty, 2.5, dt);
    camera.lookAt(tmpV);
    camera.updateMatrixWorld();
    tmpV2.setFromMatrixColumn(camera.matrixWorld, 0); camera.position.addScaledVector(tmpV2, ptr.x * 0.55);
    tmpV2.setFromMatrixColumn(camera.matrixWorld, 1); camera.position.addScaledVector(tmpV2, -ptr.y * 0.32);
    camera.lookAt(tmpV);
    const fv = lerp(ch[c0].fov, ch[c0 + 1].fov, sstep(0, 1, tt));
    camera.fov = portrait ? fv * 1.3 : fv;
    camera.updateProjectionMatrix(); camera.updateMatrixWorld();
    sky.position.copy(camera.position);

    // the halo behind the DOM phone (the demo chapter)
    const wDemo = clamp(1 - Math.abs(kS - 5) * 1.5);
    halo3.ok = false;
    if (mzPhone && wDemo > 0) {
      const r = mzPhone.getBoundingClientRect();
      if (r.height > 0) {
        const D = 20;
        prj.set(((r.left + r.width / 2) / W) * 2 - 1, -(((r.top + r.height / 2) / H) * 2 - 1), 0.5).unproject(camera).sub(camera.position).normalize();
        tmpV2.setFromMatrixColumn(camera.matrixWorld, 2).negate();
        halo3.p.copy(camera.position).addScaledVector(prj, D / Math.max(0.2, prj.dot(tmpV2)));
        halo3.h = (r.height / H) * 2 * D * Math.tan((camera.fov * Math.PI) / 360);
        halo3.ok = true;
        halo.position.copy(halo3.p); halo.quaternion.copy(camera.quaternion);
        halo.scale.set(halo3.h * (portrait ? 2.0 : 2.6), halo3.h * (portrait ? 2.0 : 2.6), 1);
        haloMat.uniforms.uAsp.value = (r.width / r.height);
      }
    }
    halo.visible = halo3.ok; haloMat.uniforms.uW.value = sstep(0, 1, wDemo);

    // the formations: chapter c0 and c0 + 1, blended per card with a stagger
    for (let i = 0; i < N; i++) { cardForm(c0, i, fa[i], kS); cardForm(c0 + 1, i, fb[i], kS); }
    for (let i = 0; i < N; i++) {
      const st = rnd(i, 31);
      const w = sstep(st * 0.32, 0.68 + st * 0.32, tt);
      aLit[i] = blend(fa[i], fb[i], w, i, 40, m4);
      cards.setMatrixAt(i, m4);
    }
    cards.instanceMatrix.needsUpdate = true; litAttr.needsUpdate = true;
    for (let j = 0; j < S; j++) { sheetForm(c0, j, sa[j], kS, fa); sheetForm(c0 + 1, j, sb[j], kS, fb); }
    for (let j = 0; j < S; j++) {
      const st = rnd(j, 51);
      blend(sa[j], sb[j], sstep(st * 0.3, 0.7 + st * 0.3, tt), j + 100, 60, m4, 9);
      sheets.setMatrixAt(j, m4);
    }
    sheets.instanceMatrix.needsUpdate = true;
    sheets.visible = c0 <= 2 && kS < 2.6;

    // the boundary: passing a door fires the frosted heartbeat ripple from the new formation
    const b = Math.round(kS);
    if (lastB < 0) lastB = b;
    if (b !== lastB) {
      lastB = b;
      if (!calm) {
        ripT = 0;
        if (b === 5 && halo3.ok) prj.copy(halo3.p); else prj.copy(ch[b].F);
        prj.project(camera);
        ripple.uniforms.uRipC.value.set(clamp(prj.x * 0.5 + 0.5, 0.15, 0.85), clamp(prj.y * 0.5 + 0.5, 0.2, 0.8));
      }
    }
    ripT += dt; ripple.uniforms.uRip.value = ripT;

    composer.render(dt);
    if (composer.readBuffer !== composer.renderTarget2) composer.swapBuffers();   // the scene draws into the multisampled one

    // pace: a slow GPU loses resolution before it loses frames
    stats.frames++;
    if (stats.frames > 90 && watch(now - watchLast)) { console.info('[dim] the clinic handed back: under 30 fps on this device'); dispose(); onLost?.(); return; }
    watchLast = now;
    if (stats.frames === 2) root.classList.add('dim-medizen-ready');
    stats.dts.push(dt); if (stats.dts.length > 90) stats.dts.shift();
    if (now - stats.t0 > 1000) { stats.fps = Math.round((stats.frames - (stats.f0 || 0)) * 1000 / (now - stats.t0)); stats.f0 = stats.frames; stats.t0 = now; }
    if (stats.frames > 120 && stats.frames % 60 === 0) {
      const avg = stats.dts.reduce((a, x) => a + x, 0) / stats.dts.length;
      if (avg > 0.024) { if (++slow >= 2 && dpr > minDpr + 0.01) { dpr = Math.max(minDpr, dpr - 0.25); resize(); slow = 0; } else if (slow >= 4 && bloom.enabled) { bloom.enabled = false; slow = 0; } } else slow = 0;
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
    removeEventListener('resize', onResize); removeEventListener('pointermove', onPtr);
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
  // re-measure after late layout (fonts, the games, the gallery images)
  [300, 1200, 3000, 6000].forEach((ms) => setTimeout(measure, ms));
}
