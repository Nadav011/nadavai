// dims/home.js: the hub of dimensions (2026-10-28). Home is the place where all of Nadav's worlds meet, so after the
// hero the page is a deep, dark space built as real geometry: a grid floor that runs to the horizon, a vast ring on the
// far horizon (the hub), a gateway at every chapter boundary, and the real app screens as physical phone cards that
// re-form for every chapter. The scroll flies one camera along a spline through it:
//
//   hero       the hero keeps its own canvas; as it lets go, a wall of screens falls away into the space
//   value      the screens settle into three slow constellations, one lights with each "what you get" beat
//   services   they wheel into one ring of light, the skill wheel
//   process    they line a track the camera rides along; a gate per step, lit as the step lights in the DOM
//   work       three rooms: a night stadium (SporChat), teal glass and a heartbeat (MediZen), a snooker lamp over
//              green felt (Green Room), each with its own screens; hover or focus a phone and its room brightens
//   branch     the screens assemble into a storefront, outlined in neon
//   check      they fall flat into a scanning grid, a sweep of light runs across it
//   plans      three pillars, the tallest for the full partnership
//   bio        a horizon of drifting screens
//   play       a playful field: screens and neon balls hopping on the floor
//   faq        the screens drift up and away, the camera looks up at the stars and the hub
//
// Every chapter boundary has its own signature transition (a warp-stretch, a fold-through, an ink-wipe, a glitch-tear,
// a shatter-scan), scaled by the speed of the scroll. The DOM stays the page: text on the reading side over a soft
// scrim, every control as it was. Started from main.js; it resolves false (and the page stays exactly as it was)
// under reduced motion, in the light look, without WebGL2, on software GL, or when three cannot load.

const TAU = Math.PI * 2;
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };
const PX_BUDGET = 8.3e6;   // device pixels per frame at most, so a large screen never allocates 4K-sized targets
const LOAD_MS = 8000;      // three, the addons and the screens: past this the page keeps its own look
const CROSS_GAP = 0.5;     // s between two crossings at least, and the tear re-rolls at 2 Hz: under 3 flashes a second (WCAG 2.3.1)

// the real screens, one atlas of 8 × 2 cells; cells 0-5 SporChat, 6-9 MediZen, 10-13 Green Room, 14-15 the cash system
const SHOTS = ['sporchat-room', 'sporchat-match', 'sporchat-arena', 'sporchat-chats', 'sporchat-feed', 'sporchat-leagues',
  'medizen-2', 'medizen-3', 'medizen-1', 'medizen-4', 'greenroom-home', 'greenroom-book', 'greenroom-food', 'greenroom-help',
  'cash-day', 'cash-history'].map((n) => `/site/assets/work/${n}.webp`);
const APPS = ['sporchat', 'medizen', 'greenroom'];
const APP_CELLS = [[0, 6], [6, 10], [10, 14]];
const APP_COL = ['#8CC2FF', '#6BD6A6', '#F2B66A'];
const CARD_W = 2.4, CARD_H = 5.2, CARD_R = 0.34;
const FLOOR = -14;

// the camera's chapters: where it holds while that chapter's text is read (position, target, vertical fov on 16:10, roll)
const POSES = [
  { p: [0, 0, 0], t: [0, -1, -60], fov: 50, roll: 0 },              // 0 the hero lets go
  { p: [4, 2, -90], t: [0, 0, -150], fov: 48, roll: 0.03 },          // 1 value
  { p: [-8, 7, -180], t: [-2, 2, -240], fov: 50, roll: -0.04 },      // 2 services
  { p: [0, -3, -270], t: [0, -3.6, -330], fov: 54, roll: 0 },        // 3 process: the track
  { p: [0, 5, -420], t: [0, -1.5, -480], fov: 46, roll: 0 },         // 4 work: three rooms
  { p: [-6, 3, -510], t: [-9, 1, -570], fov: 46, roll: 0.035 },      // 5 branch
  { p: [0, 9, -600], t: [0, 0, -660], fov: 50, roll: 0 },            // 6 check
  { p: [8, 1, -690], t: [4, 3, -750], fov: 50, roll: -0.03 },        // 7 plans
  { p: [0, -8.5, -780], t: [0, -9.5, -880], fov: 46, roll: 0 },      // 8 bio: the horizon
  { p: [-6, -3, -870], t: [-3, -13, -910], fov: 56, roll: 0.02 },    // 9 play
  { p: [0, 2, -960], t: [0, 34, -1020], fov: 52, roll: 0 },          // 10 faq: up to the stars
];
const SWING = [[0, -7], [12, 6], [-10, -4], [0, 9], [-12, 3], [9, 7], [-7, -5], [7, -4], [-9, 4], [0, 7]];
const TINT = ['#E8913C', '#E8913C', '#F2B36F', '#E8913C', null, '#E8913C', '#6FE3A1', '#F2B36F', '#E8A86A', '#FF5FA2', '#9FB4D9'];
const EXPO = [1.0, 1.04, 1.0, 1.06, 1.1, 1.06, 1.0, 1.0, 1.04, 1.1, 0.86];
// the signature crossing at each boundary: 0 warp-stretch, 1 fold-through, 2 ink-wipe, 3 glitch-tear, 4 shatter-scan
const CROSS = [0, 1, 0, 2, 3, 4, 1, 2, 0, 2];
const SECTIONS = ['#value', '#services', '#process', '#work', '#branch', '#check', '#plans', '#bio', '#play'];

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

export async function initDim({ lenis = null, reduce = false } = {}) {
  const root = document.documentElement;
  const look = root.dataset.look;
  if (reduce || root.classList.contains('reduce') || (look && look !== 'a')) return false;
  if (!document.getElementById('value') || !document.querySelector('.hero') || !probeGL()) return false;
  // the hero's intro runs alone: the space is built only once #value comes within two viewports of the screen
  await new Promise((res) => {
    const io = new IntersectionObserver((es) => { if (es.some((x) => x.isIntersecting)) { io.disconnect(); res(); } }, { rootMargin: '200% 0px' });
    io.observe(document.getElementById('value'));
  });
  let timer = 0;
  const late = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`not loaded in ${LOAD_MS / 1000} s`)), LOAD_MS); });
  const loaded = (p) => Promise.race([p, late]);
  const life = { dispose: null };
  try {
    const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }] = await loaded(Promise.all([
      import('three'),
      import('three/addons/postprocessing/EffectComposer.js'),
      import('three/addons/postprocessing/RenderPass.js'),
      import('three/addons/postprocessing/UnrealBloomPass.js'),
      import('three/addons/postprocessing/ShaderPass.js'),
      import('three/addons/postprocessing/OutputPass.js'),
    ]));
    return await build(THREE, { EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass }, { lenis, loaded, life });
  } catch (e) {
    console.warn('[dim] the hub is off, the page keeps its own look', e);
    life.dispose?.();   // listeners, the ResizeObserver, the context
    root.classList.remove('dim-home', 'dim-home-ready');
    document.querySelector('.dimh')?.remove();
    return false;
  } finally { clearTimeout(timer); }
}

/* ── textures drawn on a canvas ─────────────────────────────── */
function canvasTex(THREE, w, h, draw, { srgb = true, aniso = 4 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = aniso;
  return t;
}
function drawGlare(g, W, H) {
  const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.14, 'rgba(225,235,255,.5)');
  gr.addColorStop(0.42, 'rgba(160,190,255,.1)'); gr.addColorStop(1, 'rgba(160,190,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(220,235,255,.2)'; g.fillRect(0, H / 2 - 1, W, 2);
}
function drawSoft(g, W, H) {
  const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.35, 'rgba(255,255,255,.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
function drawPitch(g, W, H) {
  const n = 12;
  for (let i = 0; i < n; i++) { g.fillStyle = i % 2 ? '#1d5629' : '#276833'; g.fillRect(0, Math.floor((i / n) * H), W, Math.ceil(H / n) + 1); }
  const glow = g.createRadialGradient(W / 2, H * 0.55, 10, W / 2, H * 0.55, W * 0.75);
  glow.addColorStop(0, 'rgba(255,255,235,.16)'); glow.addColorStop(1, 'rgba(0,10,0,.5)');
  g.fillStyle = glow; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(240,244,236,.9)'; g.lineWidth = 3;
  const m = 18; g.strokeRect(m, m, W - 2 * m, H - 2 * m);
  g.beginPath(); g.moveTo(m, H / 2); g.lineTo(W - m, H / 2); g.stroke();
  g.beginPath(); g.arc(W / 2, H / 2, W * 0.13, 0, TAU); g.stroke();
  g.strokeRect(W * 0.3, m, W * 0.4, H * 0.13); g.strokeRect(W * 0.3, H - m - H * 0.13, W * 0.4, H * 0.13);
}
function drawFelt(g, W, H) {
  g.fillStyle = '#0f5a2b'; g.fillRect(0, 0, W, H);
  const gr = g.createRadialGradient(W / 2, H / 2, 10, W / 2, H / 2, W * 0.6);
  gr.addColorStop(0, 'rgba(120,255,150,.28)'); gr.addColorStop(0.6, 'rgba(40,160,80,.06)'); gr.addColorStop(1, 'rgba(0,0,0,.55)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 9000; i++) { g.fillStyle = Math.random() > 0.5 ? 'rgba(150,255,170,.035)' : 'rgba(0,30,10,.06)'; g.fillRect(Math.random() * W, Math.random() * H, 2, 2); }
  g.strokeStyle = 'rgba(235,240,230,.55)'; g.lineWidth = 2;
  g.beginPath(); g.moveTo(W * 0.21, 4); g.lineTo(W * 0.21, H - 4); g.stroke();
  g.beginPath(); g.arc(W * 0.21, H / 2, H * 0.17, Math.PI / 2, Math.PI * 1.5); g.stroke();
}
function drawPool(col, edge) {
  return (g, W, H) => {
    g.fillStyle = edge; g.fillRect(0, 0, W, H);
    const gr = g.createRadialGradient(W / 2, H * 0.55, 4, W / 2, H * 0.55, W * 0.62);
    gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  };
}
function drawMatcap(g, W, H) {
  const gr = g.createRadialGradient(W * 0.38, H * 0.32, 2, W / 2, H / 2, W / 2);
  gr.addColorStop(0, '#ffffff'); gr.addColorStop(0.12, '#f2f2f2'); gr.addColorStop(0.45, '#9a9a9a'); gr.addColorStop(0.9, '#2a2a2a'); gr.addColorStop(1, '#101010');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

/* ── shaders ────────────────────────────────────────────────── */
const H21 = 'float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }';
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
uniform sampler2D uAtlas; uniform vec2 uCells; uniform vec2 uSize; uniform float uR; uniform vec3 uTint;
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
  float fres = pow(1.0 - min(abs(dot(N, V)), 1.0), 3.0);
  vec3 col;
  if (gl_FrontFacing) {
    float ci = floor(vCell + 0.5), cy = floor((ci + 0.5) / uCells.x);
    vec2 cell = vec2(ci - cy * uCells.x, cy);
    vec2 suv = vec2(mix(0.039, 0.961, vUv.x), vUv.y);
    vec2 auv = vec2((cell.x + suv.x) / uCells.x, 1.0 - (cell.y + 1.0 - suv.y) / uCells.y);
    col = texture2D(uAtlas, auv).rgb * (0.62 + 0.62 * vFocus);
    float s = vUv.x * 0.75 + vUv.y * 0.55 + (V.x - V.y) * 0.35 + vSeed;
    col += vec3(0.85, 0.9, 1.0) * exp(-((fract(s) - 0.5) * 7.0) * ((fract(s) - 0.5) * 7.0)) * 0.06;
  } else {
    col = vec3(0.012, 0.015, 0.02) + vec3(0.02, 0.025, 0.035) * (1.0 - vUv.y);
    float mark = abs(length(p - vec2(0.0, 0.4)) - 0.36) - 0.03;
    col += uTint * 0.6 * (1.0 - smoothstep(0.0, 0.02, mark));
  }
  float ring = smoothstep(-0.08, -0.04, d);
  col = mix(col, vec3(0.4, 0.42, 0.46) * (0.3 + fres * 2.2), ring);
  col += uTint * (fres * 0.3 + ring * vFocus * 1.4);
  gl_FragColor = vec4(col, a * vFade);
  #include <fog_fragment>
}`;
const HALO_FS = /* glsl */`
uniform vec2 uSize; uniform float uR; uniform vec3 uTint; uniform vec2 uGeo;
varying vec2 vUv; varying float vCell, vSeed, vFade, vFocus; varying vec3 vN, vV;
#include <fog_pars_fragment>
float sdRB(vec2 p, vec2 b, float r){ vec2 q = abs(p) - b + r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
void main(){
  vec2 p = (vUv - 0.5) * uGeo;
  float d = sdRB(p, uSize * 0.5, uR);
  if (d < 0.0) discard;
  float g = exp(-d * 1.4) * 0.12 + exp(-d * 6.0) * 0.2;
  gl_FragColor = vec4(uTint * g * (0.25 + vFocus * 1.6) * vFade, 1.0);
  ${FOG_ADD}
}`;

const SKY_VS = /* glsl */`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FS = /* glsl */`
varying vec3 vD; uniform vec3 uTint; uniform float uTime;
${H21}
void main(){
  vec3 d = normalize(vD); float y = d.y;
  vec3 col = mix(vec3(0.012, 0.016, 0.026), vec3(0.002, 0.003, 0.007), smoothstep(-0.05, 0.55, y));
  col += uTint * 0.05 * exp(-abs(y + 0.01) * 14.0);                         // the horizon takes the chapter's light
  // nebulae: three soft clouds of colour far off
  col += vec3(0.55, 0.28, 0.08) * 0.07 * pow(max(dot(d, normalize(vec3(-0.6, 0.25, -0.75))), 0.0), 10.0);
  col += vec3(0.12, 0.3, 0.55) * 0.06 * pow(max(dot(d, normalize(vec3(0.7, 0.35, -0.6))), 0.0), 8.0);
  col += vec3(0.1, 0.4, 0.3) * 0.04 * pow(max(dot(d, normalize(vec3(0.1, 0.8, -0.5))), 0.0), 6.0);
  // stars
  vec2 g = vec2(atan(d.x, d.z) * 180.0, y * 260.0);
  vec2 i = floor(g); float s = h21(i);
  float star = step(0.9955, s) * smoothstep(0.5, 0.0, length(fract(g) - 0.5)) * smoothstep(-0.02, 0.12, y);
  float tw = 0.6 + 0.4 * sin(uTime * (1.0 + h21(i + 3.0) * 3.0) + s * 40.0);
  col += vec3(0.9, 0.94, 1.0) * star * tw * (0.5 + 1.8 * h21(i + 7.0));
  gl_FragColor = vec4(col, 1.0);
}`;

const FLOOR_VS = /* glsl */`
varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const FLOOR_FS = /* glsl */`
uniform vec3 uTint; uniform vec3 uCam; uniform float uGrid; uniform float uScan;
varying vec3 vW;
#include <fog_pars_fragment>
float gridLine(vec2 p){ vec2 g = abs(fract(p - 0.5) - 0.5) / max(fwidth(p), vec2(1e-4)); return 1.0 - min(min(g.x, g.y), 1.0); }
void main(){
  float dist = length(vW.xz - uCam.xz);
  float minor = gridLine(vW.xz / 4.0), major = gridLine(vW.xz / 24.0);
  vec3 col = vec3(0.005, 0.007, 0.011);
  col += uTint * (minor * 0.05 + major * 0.2) * uGrid * exp(-dist * 0.009);
  col += uTint * 0.018 * exp(-dist * 0.025);
  col += uTint * uScan * 0.35 * major * exp(-(fract(vW.z / 60.0) - 0.5) * (fract(vW.z / 60.0) - 0.5) * 60.0);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;

const DUST_VS = /* glsl */`
attribute float aR; uniform float uTime; uniform float uScale; uniform vec3 uCam; varying float vA;
#include <fog_pars_vertex>
void main(){
  vec3 p = position;
  p.y += uTime * (0.2 + aR * 0.4);
  p.x += sin(uTime * 0.2 + aR * 40.0) * 1.5;
  p = mod(p - uCam + 45.0, 90.0) - 45.0 + uCam;
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  vA = 0.35 + 0.65 * (0.5 + 0.5 * sin(uTime * (0.6 + aR) + aR * 50.0));
  gl_PointSize = clamp(0.1 * uScale / -mvPosition.z, 1.0, 3.5);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const DUST_FS = /* glsl */`
varying float vA; uniform vec3 uTint;
#include <fog_pars_fragment>
void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c); if (r > 0.25) discard;
  gl_FragColor = vec4(mix(vec3(0.8, 0.85, 1.0), uTint, 0.35) * vA * 0.5 * (1.0 - r * 4.0), 1.0);
  ${FOG_ADD}
}`;

// a portal's membrane: transparent, the room shows through, the edge shimmers in the app's light
const MEMB_VS = /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const MEMB_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; uniform float uTime; uniform vec2 uSize;
varying vec2 vUv;
${H21}
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
void main(){
  vec2 p = (vUv - 0.5) * uSize;
  vec2 q = uSize * 0.5 - abs(p); float e = min(q.x, q.y);
  float w = n2(p * 0.9 + vec2(uTime * 0.25, -uTime * 0.18)) * 0.6 + n2(p * 2.3 - uTime * 0.3) * 0.4;
  float g = exp(-e * 3.2) * 0.22 + exp(-e * 14.0) * 0.55;
  gl_FragColor = vec4(uCol * (g * (0.6 + w * 0.6) + w * 0.012) * uI, 1.0);
}`;
// the walls of a room: a vertical gradient (and a starry night where the room is outdoors)
const WALL_VS = /* glsl */`varying vec3 vP; void main(){ vP = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const WALL_FS = /* glsl */`
uniform vec3 uTop, uBot; uniform float uStars, uL, uH;
varying vec3 vP;
${H21}
void main(){
  float y = vP.y / uH + 0.5;
  vec3 col = mix(uBot, uTop, smoothstep(0.0, 1.0, y));
  vec2 g = (vP.xy + vP.zz) * 7.0; vec2 i = floor(g);
  col += vec3(0.9, 0.95, 1.0) * uStars * step(0.985, h21(i)) * smoothstep(0.5, 0.0, length(fract(g) - 0.5)) * smoothstep(0.45, 0.8, y);
  gl_FragColor = vec4(col * uL, 1.0);
}`;
// a volumetric beam: a cone, brightest along its axis and near its source
const CONE_VS = /* glsl */`
uniform float uLen; varying vec3 vN, vV; varying float vY;
void main(){
  vY = -position.y / uLen;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  vN = normalize(normalMatrix * normal); vV = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
}`;
const CONE_FS = /* glsl */`
uniform vec3 uCol; uniform float uI;
varying vec3 vN, vV; varying float vY;
void main(){
  float facing = abs(dot(normalize(vN), normalize(vV)));
  float along = pow(clamp(1.0 - vY, 0.0, 1.0), 1.3) * smoothstep(0.0, 0.05, vY);
  gl_FragColor = vec4(uCol * pow(min(facing, 1.0), 1.8) * along * uI, 1.0);
}`;
// a glass pane: a rim of light, a faint body and a sheen that slides
const GLASS_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; uniform float uTime; uniform vec2 uSize; varying vec2 vUv;
void main(){
  vec2 p = (vUv - 0.5) * uSize; vec2 q = uSize * 0.5 - abs(p); float e = min(q.x, q.y);
  float rim = exp(-e * 9.0);
  float sx = fract(vUv.x * 0.6 + vUv.y * 0.4 - uTime * 0.07) - 0.5;
  float sheen = exp(-sx * sx * 90.0);
  gl_FragColor = vec4(uCol * (rim * 1.1 + 0.035 + sheen * 0.12) * uI, 1.0);
}`;
// the heartbeat: a ribbon that lights where the pulse has just passed
const ECG_VS = /* glsl */`attribute float aX; varying float vX; void main(){ vX = aX; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const ECG_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; uniform float uPh; varying float vX;
void main(){ float b = fract(uPh - vX); float g = 0.12 + 2.6 * exp(-b * 9.0) + 6.0 * exp(-b * 120.0);
  gl_FragColor = vec4(uCol * g * uI, 1.0); }`;
const CROWD_VS = /* glsl */`
attribute vec3 aCol; attribute float aR; uniform float uTime; uniform float uScale; uniform float uL;
varying vec3 vCol; varying float vFlash;
float h11(float p){ p = fract(p * 0.1031); p *= p + 33.33; p *= p + p; return fract(p); }
void main(){
  float cyc = uTime * 0.65 + aR * 97.0;
  vFlash = step(0.975, h11(aR * 913.0 + floor(cyc))) * exp(-fract(cyc) * 16.0);
  vCol = aCol * uL;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_PointSize = clamp((0.12 + vFlash * 0.25) * uScale / -mvPosition.z, 1.0, 6.0);
  gl_Position = projectionMatrix * mvPosition;
}`;
const CROWD_FS = /* glsl */`
varying vec3 vCol; varying float vFlash;
void main(){ vec2 c = gl_PointCoord - 0.5; if (dot(c, c) > 0.25) discard; gl_FragColor = vec4(vCol + vec3(6.0) * vFlash, 1.0); }`;
const SWEEP_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; varying vec2 vUv;
void main(){ float x = abs(vUv.x - 0.5) * 2.0; float y = smoothstep(0.0, 0.12, vUv.y) * smoothstep(1.0, 0.88, vUv.y);
  gl_FragColor = vec4(uCol * (exp(-x * 9.0) * 1.4 + exp(-x * 2.2) * 0.25) * y * uI, 1.0); }`;

// the crossing between chapters (one pass, five kinds) plus the scroll's own speed, grain and vignette
const CROSS_PASS = {
  uniforms: { tDiffuse: { value: null }, uTime: { value: 0 }, uAmt: { value: 0 }, uType: { value: 0 }, uProg: { value: 0 },
    uDir: { value: 1 }, uVel: { value: 0 }, uAspect: { value: 1 }, uTint: { value: null } },
  vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
uniform sampler2D tDiffuse; uniform float uTime, uAmt, uType, uProg, uDir, uVel, uAspect; uniform vec3 uTint;
varying vec2 vUv;
${H21}
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }
float fbm(vec2 p){ float s = 0.0, a = 0.5; for (int i = 0; i < 4; i++){ s += a * n2(p); p *= 2.03; a *= 0.5; } return s; }
vec2 mirror(vec2 u){ u = abs(u); return 1.0 - abs(1.0 - u); }
void main(){
  vec2 uv = vUv; float a = uAmt; vec2 c = vUv - 0.5;
  vec3 add = vec3(0.0); float shade = 1.0; float blur = uVel * 0.045;
  float ink = 0.0, rim = 0.0;
  if (uType < 0.5) {                     // warp-stretch: the frame is pulled into the centre
    uv = 0.5 + c * (1.0 - a * 0.18);
    blur += a * 0.22;
    add += uTint * a * 0.14 * smoothstep(0.25, 0.8, length(c * vec2(uAspect, 1.0)));
  } else if (uType < 1.5) {              // fold-through: the frame folds over a travelling crease
    vec2 dir = normalize(vec2(uDir, 0.34));
    float s = dot(c, dir), L = mix(0.72, -0.72, uProg);
    if (s > L) { uv = mirror(uv - dir * 2.0 * (s - L) * a); shade = 1.0 - a * 0.5 * smoothstep(0.0, 0.25, s - L); }
    else shade = 1.0 - a * 0.4 * exp(-(L - s) * 14.0);
    add += uTint * exp(-abs(s - L) * 110.0) * a * 1.8;
  } else if (uType < 2.5) {              // ink-wipe: a band of ink with a lit edge runs across the frame
    float n = fbm(vec2(c.x * uAspect, c.y) * 3.2 + uTime * 0.12);
    float co = uDir > 0.0 ? vUv.y : 1.0 - vUv.y;
    float e = co + (n - 0.5) * 0.38 - (uProg * 1.8 - 0.4);
    ink = smoothstep(0.02, -0.02, e) * smoothstep(-0.52, -0.38, e) * a;
    rim = exp(-e * e * 2200.0) * a;
    uv += (n - 0.5) * 0.03 * a * exp(-e * e * 30.0);
  } else if (uType < 3.5) {              // glitch-tear: torn slices and a seam
    float tick = floor(uTime * 2.0);                  // the tears re-roll twice a second, never at frame rate
    float row = floor(uv.y * mix(14.0, 60.0, h21(vec2(tick, 3.1))));
    float wd = vUv.y - (uDir > 0.0 ? 1.15 - uProg * 1.3 : uProg * 1.3 - 0.15);
    float near = exp(-wd * wd * 26.0);
    float tear = step(1.0 - clamp(a * 0.45 + near * a, 0.0, 0.95), h21(vec2(row, tick)));
    uv.x += (h21(vec2(row, tick + 7.0)) - 0.5) * 0.14 * tear * (0.4 + a);
    add += uTint * (exp(-wd * wd * 5000.0) * a * 2.0 + near * a * 0.25);
  } else {                               // shatter-scan: the frame breaks into tiles behind a scan line
    float sy = uDir > 0.0 ? 1.0 - uProg : uProg;
    float behind = uDir > 0.0 ? step(sy, vUv.y) : step(vUv.y, sy);
    float cells = mix(150.0, 22.0, a);
    vec2 g = vec2(cells * uAspect, cells); vec2 id = floor(vUv * g);
    vec2 tu = (id + 0.5) / g + (vec2(h21(id), h21(id + 3.0)) - 0.5) * a * 0.05;
    uv = mix(uv, tu, behind * step(0.02, a));
    add += uTint * exp(-(vUv.y - sy) * (vUv.y - sy) * 1600.0) * a * 2.4;
  }
  float ca = 0.0007 + a * 0.006 + uVel * 0.004;
  vec3 col = vec3(0.0);
  if (blur > 0.002) {
    vec2 cc = uv - 0.5;
    for (int i = 0; i < 8; i++) {
      vec2 q = uv - cc * blur * (float(i) / 7.0);
      col.r += texture2D(tDiffuse, q + vec2(ca, 0.0)).r; col.g += texture2D(tDiffuse, q).g; col.b += texture2D(tDiffuse, q - vec2(ca, 0.0)).b;
    }
    col /= 8.0;
  } else {
    col = vec3(texture2D(tDiffuse, uv + vec2(ca, 0.0)).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - vec2(ca, 0.0)).b);
  }
  col *= shade;
  col = mix(col, vec3(0.006, 0.008, 0.012) + uTint * 0.03, ink * 0.94);
  col += uTint * rim * 2.2 + add;
  float gr = h21(gl_FragCoord.xy + fract(uTime * 7.13) * vec2(113.0, 71.0)) - 0.5;
  col += gr * (0.016 + a * 0.05) * (0.25 + col);
  vec2 v = c * vec2(uAspect, 1.0);
  col *= mix(1.0, smoothstep(1.25, 0.2, length(v)), 0.6);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`,
};

/* ── shapes ─────────────────────────────────────────────────── */
function rrShape(THREE, w, h, r) {
  const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r); s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h); s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r); s.quadraticCurveTo(x, y, x + r, y);
  return s;
}
function frameGeo(THREE, w, h, r, t) {
  const s = rrShape(THREE, w, h, r);
  s.holes.push(new THREE.Path(rrShape(THREE, w - 2 * t, h - 2 * t, Math.max(0.05, r - t)).getPoints(10)));
  return new THREE.ShapeGeometry(s, 10);
}
// an ECG trace across [0, 1]: baseline, P wave, QRS spike, T wave; three beats
function ecg(x) {
  const u = (x * 3) % 1;
  const g = (c, w, h) => h * Math.exp(-((u - c) * (u - c)) / (w * w));
  return g(0.2, 0.03, 0.12) + g(0.38, 0.012, -0.18) + g(0.42, 0.014, 1.0) + g(0.46, 0.012, -0.32) + g(0.68, 0.05, 0.26);
}
// the storefront in its own plane (metres, centre of the facade at the origin): windows, door, awning, sign, roof
function storeSlots(n) {
  const out = [];
  const win = n >= 30 ? [3, 2] : [2, 2];
  for (const side of [1, -1]) for (let r = 0; r < win[1]; r++) for (let c = 0; c < win[0]; c++) {
    out.push({ x: side * (3.4 + c * 1.55), y: -4.4 + r * 3.0, z: 0, rx: 0, rz: 0, s: 0.52 });
  }
  out.push({ x: -0.72, y: -4.0, z: 0.1, rx: 0, rz: 0, s: 0.64 }, { x: 0.72, y: -4.0, z: 0.1, rx: 0, rz: 0, s: 0.64 });
  const aw = n >= 30 ? 8 : 6;
  for (let i = 0; i < aw; i++) out.push({ x: (i / (aw - 1) - 0.5) * 17, y: 0.9, z: 1.3, rx: -1.05, rz: 0, s: 0.5 });
  const sg = n >= 30 ? 4 : 3;
  for (let i = 0; i < sg; i++) out.push({ x: (i / (sg - 1) - 0.5) * 9.6, y: 4.0, z: 0.2, rx: 0, rz: Math.PI / 2, s: 0.5 });
  const rest = Math.max(0, n - out.length);
  for (let i = 0; i < rest; i++) {
    const f = rest > 1 ? i / (rest - 1) : 0.5, x = (f - 0.5) * 20, y = 6.6 + (1 - Math.abs(f - 0.5) * 2) * 2.6;
    out.push({ x, y, z: -0.2, rx: 0, rz: (f < 0.5 ? -1 : 1) * 0.25, s: 0.46 });
  }
  return out;
}
const STORE_LINES = [
  [-10, -6.4, 10, -6.4], [10, -6.4, 10, 2.2], [10, 2.2, -10, 2.2], [-10, 2.2, -10, -6.4],     // the facade
  [-1.6, -6.4, -1.6, -1.3], [-1.6, -1.3, 1.6, -1.3], [1.6, -1.3, 1.6, -6.4],                  // the door
  [-9, 2.2, -10.4, 0.0], [9, 2.2, 10.4, 0.0], [-10.4, 0.0, 10.4, 0.0],                        // the awning's edge
  [-5.6, 3.0, 5.6, 3.0], [5.6, 3.0, 5.6, 5.0], [5.6, 5.0, -5.6, 5.0], [-5.6, 5.0, -5.6, 3.0], // the sign
  [-10.6, 6.0, 0, 9.4], [0, 9.4, 10.6, 6.0], [-10.6, 6.0, 10.6, 6.0],                         // the roof
];

/* ── the build ─────────────────────────────────────────────── */
async function build(THREE, P_, { lenis, loaded, life }) {
  const root = document.documentElement;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const phone = coarse || innerWidth < 760;
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const N = phone ? 22 : 40;
  const maxDpr = Math.min(devicePixelRatio || 1, phone ? 1.25 : 1.5);
  const dbgOn = new URLSearchParams(location.search).has('dimdbg');
  const ac = new AbortController(); const sig_ = { signal: ac.signal };
  const NCH = POSES.length;

  const imgs = await loaded(Promise.all(SHOTS.map((src) => new Promise((res, rej) => { const im = new Image(); im.decoding = 'async'; im.onload = () => res(im); im.onerror = rej; im.src = src; }))));

  const wrap = document.createElement('div'); wrap.className = 'dimh'; wrap.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas'); canvas.className = 'dimh__cv';
  const scrim = document.createElement('i'); scrim.className = 'dimh__scrim';
  wrap.append(canvas, scrim); wrap.style.opacity = '0';
  document.body.prepend(wrap);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' });
  const budgetDpr = () => Math.sqrt(PX_BUDGET / (innerWidth * innerHeight));
  let dpr = Math.min(maxDpr, budgetDpr());
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  let shaderFailed = false;
  // a shader that does not compile: the page keeps its own look (setting the hook silences three, so it logs here)
  renderer.debug.onShaderError = (gl, program, vs, fs) => {
    shaderFailed = true;
    console.warn('[dim] a hub shader did not compile', gl.getProgramInfoLog(program), gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs));
  };
  // half-float targets need a renderable float format; without one, 8-bit targets (less bloom range, but a picture)
  const floatRT = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();

  /* lifecycle: one dispose for every way out (a failed build, a lost context, a failed shader, pagehide). It removes the
     classes and the wrap, so the page's own backgrounds (.work__worlds, .branch__bg) come back */
  let alive = true, started = false, raf = 0, rsT = 0, composer = null, rt = null, ro = null;
  function dispose() {
    if (!alive) return;
    alive = false; cancelAnimationFrame(raf); raf = 0; clearTimeout(rsT);
    ac.abort(); ro?.disconnect();
    window.ScrollTrigger?.removeEventListener?.('refresh', measure);
    const seen = new Set();
    const drop = (x) => { if (x && !seen.has(x)) { seen.add(x); x.dispose?.(); } };
    scene.traverse((o) => {
      drop(o.geometry);
      for (const m of [].concat(o.material || [])) {
        for (const v of Object.values(m)) if (v && v.isTexture) drop(v);
        if (m.uniforms) for (const uu of Object.values(m.uniforms)) if (uu?.value?.isTexture) drop(uu.value);
        drop(m);
      }
    });
    if (composer) { for (const p of composer.passes) p.dispose?.(); composer.dispose(); }
    rt?.dispose(); renderer.dispose();
    if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
    wrap.remove();
    root.classList.remove('dim-home', 'dim-home-ready');
    if (window.__dimHome?.dispose === dispose) delete window.__dimHome;
  }
  life.dispose = dispose;
  canvas.addEventListener('webglcontextlost', (ev) => { ev.preventDefault(); dispose(); }, sig_);
  const fogCol = new THREE.Color().setRGB(0.011, 0.015, 0.024);   // the sky's own colour at the horizon, so the floor melts into it
  scene.background = fogCol;
  scene.fog = new THREE.FogExp2(fogCol, 0.0062);
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 4000);
  const fogU = () => THREE.UniformsUtils.clone(THREE.UniformsLib.fog);
  const time = { value: 0 }, pointScale = { value: 600 };
  const tint = { value: new THREE.Color(TINT[1]) };
  const camU = { value: new THREE.Vector3() };
  const tints = TINT.map((h) => (h ? new THREE.Color(h) : null));
  const appCol = APP_COL.map((h) => new THREE.Color(h));
  const V3 = (a) => new THREE.Vector3(...a);
  const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3(), tmpC = new THREE.Color(), v2 = new THREE.Vector2();
  const m4 = new THREE.Matrix4(), e = new THREE.Euler(), q2 = new THREE.Quaternion(), worldUp = new THREE.Vector3(0, 1, 0);

  /* the sky, the floor, the dust and the hub on the horizon */
  const sky = new THREE.Mesh(new THREE.SphereGeometry(3000, 32, 16), new THREE.ShaderMaterial({
    vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false, uniforms: { uTint: tint, uTime: time } }));
  sky.renderOrder = -10; scene.add(sky);
  const floorU = { ...fogU(), uTint: tint, uCam: camU, uGrid: { value: 1 }, uScan: { value: 0 } };
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(3200, 3200), new THREE.ShaderMaterial({ vertexShader: FLOOR_VS, fragmentShader: FLOOR_FS, fog: true, uniforms: floorU }));
  floor.rotation.x = -Math.PI / 2; floor.position.y = FLOOR; scene.add(floor);
  {
    const n = phone ? 700 : 1700;
    const pos = new Float32Array(n * 3), rr = new Float32Array(n);
    for (let i = 0; i < n; i++) { pos[i * 3] = (Math.random() - 0.5) * 90; pos[i * 3 + 1] = (Math.random() - 0.5) * 90; pos[i * 3 + 2] = (Math.random() - 0.5) * 90; rr[i] = Math.random(); }
    const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aR', new THREE.BufferAttribute(rr, 1));
    const pts = new THREE.Points(geo, new THREE.ShaderMaterial({ vertexShader: DUST_VS, fragmentShader: DUST_FS, fog: true, transparent: true, depthWrite: false,
      blending: THREE.AdditiveBlending, uniforms: { ...fogU(), uTime: time, uScale: pointScale, uCam: camU, uTint: tint } }));
    pts.frustumCulled = false; pts.renderOrder = 7; scene.add(pts);
  }
  const hub = new THREE.Group();
  const hubMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.5, 0.2), fog: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  const hubMat2 = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.35, 0.45, 0.7), fog: false, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false });
  hub.add(new THREE.Mesh(new THREE.TorusGeometry(300, 1.4, 6, 220), hubMat), new THREE.Mesh(new THREE.TorusGeometry(262, 0.6, 6, 200), hubMat2));
  for (let i = 0; i < 24; i++) { // the spokes of light around the hub
    const s = new THREE.Mesh(new THREE.BoxGeometry(0.5, 26, 0.5), hubMat2); const a = (i / 24) * TAU;
    s.position.set(Math.cos(a) * 281, Math.sin(a) * 281, 0); s.rotation.z = a + Math.PI / 2; hub.add(s);
  }
  hub.position.set(0, 70, -1500); hub.renderOrder = -5; scene.add(hub);

  /* the gateways the camera flies through between chapters */
  const gateGeo = frameGeo(THREE, 18, 24, 2.2, 0.32);
  const gates = [];
  for (let b = 0; b < NCH - 1; b++) {
    const m = new THREE.Mesh(gateGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    m.renderOrder = 4; gates.push(m); scene.add(m);
  }

  /* the cards: one atlas of the real screens; body and glow are two instanced draws */
  const cw = phone ? 256 : 512, ch = cw * 2;
  const atlas = canvasTex(THREE, cw * 8, ch * 2, (g) => {
    g.fillStyle = '#000'; g.fillRect(0, 0, cw * 8, ch * 2);
    imgs.forEach((im, i) => {
      const bw = Math.round(cw * 0.922), x = (i % 8) * cw + (cw - bw) / 2, y = Math.floor(i / 8) * ch;
      const sa = bw / ch, ia = im.width / im.height;   // cover-crop each screen into its box
      let sw = im.width, sh = im.height, sx = 0, sy = 0;
      if (ia > sa) { sw = im.height * sa; sx = (im.width - sw) / 2; } else { sh = im.width / sa; sy = (im.height - sh) / 2; }
      g.drawImage(im, sx, sy, sw, sh, x, y, bw, ch);
    });
  }, { aniso });
  atlas.generateMipmaps = true; atlas.minFilter = THREE.LinearMipmapLinearFilter;
  const cardGeo = new THREE.PlaneGeometry(CARD_W, CARD_H);
  const HALO = [CARD_W + 4.4, CARD_H + 4.4];
  const haloGeo = new THREE.PlaneGeometry(HALO[0], HALO[1]); haloGeo.translate(0, 0, -0.04);
  const inst = (n) => { const a = new THREE.InstancedBufferAttribute(new Float32Array(n), 1); a.setUsage(THREE.DynamicDrawUsage); return a; };
  const aCell = inst(N), aSeed = inst(N), aFade = inst(N), aFocus = inst(N);
  for (const [nm, a] of [['aCell', aCell], ['aSeed', aSeed], ['aFade', aFade], ['aFocus', aFocus]]) { cardGeo.setAttribute(nm, a); haloGeo.setAttribute(nm, a); }
  const cardU = { ...fogU(), uAtlas: { value: atlas }, uCells: { value: new THREE.Vector2(8, 2) }, uSize: { value: new THREE.Vector2(CARD_W, CARD_H) },
    uR: { value: CARD_R }, uTint: tint, uGeo: { value: new THREE.Vector2(...HALO) } };
  const cards = new THREE.InstancedMesh(cardGeo, new THREE.ShaderMaterial({ vertexShader: CARD_VS, fragmentShader: CARD_FS, uniforms: cardU, fog: true,
    side: THREE.DoubleSide, transparent: true, depthWrite: true }), N);
  const halos = new THREE.InstancedMesh(haloGeo, new THREE.ShaderMaterial({ vertexShader: CARD_VS, fragmentShader: HALO_FS, uniforms: cardU, fog: true,
    side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), N);
  for (const m of [cards, halos]) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; }
  cards.renderOrder = 2; halos.renderOrder = 3;
  scene.add(cards, halos);

  /* the links between cards: a constellation's lines (value) and the wheel's rim (services) */
  const linkPos = new Float32Array(N * 2 * 2 * 3), linkCol = new Float32Array(N * 2 * 2 * 3);
  const linkGeo = new THREE.BufferGeometry();
  linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3).setUsage(THREE.DynamicDrawUsage));
  linkGeo.setAttribute('color', new THREE.BufferAttribute(linkCol, 3).setUsage(THREE.DynamicDrawUsage));
  const links = new THREE.LineSegments(linkGeo, new THREE.LineBasicMaterial({ vertexColors: true, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false }));
  links.frustumCulled = false; links.renderOrder = 4; scene.add(links);

  /* process: five gates along the track */
  const stepGeo = frameGeo(THREE, 7.6, 9.6, 1.1, 0.22);
  const steps = Array.from({ length: 5 }, () => {
    const m = new THREE.Mesh(stepGeo, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
    m.renderOrder = 4; scene.add(m); return m;
  });

  /* work: three rooms behind three portals */
  const glareTex = canvasTex(THREE, 128, 128, drawGlare, { srgb: false });
  const softTex = canvasTex(THREE, 128, 128, drawSoft, { srgb: false });
  const RW = 10, RH = 21, RD = 15;
  const rooms = APPS.map((app, a) => {
    const g = new THREE.Group(); const lit = []; const col = appCol[a];
    const tie = (mat, base, key = 'color') => { lit.push([mat, base.clone(), key]); return mat; };
    // the frame and its membrane
    const frame = new THREE.Mesh(frameGeo(THREE, RW, RH, 1.6, 0.26), tie(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), col.clone().multiplyScalar(2.6)));
    frame.position.z = 0.02; g.add(frame);
    const membU = { uCol: { value: col }, uI: { value: 1 }, uTime: time, uSize: { value: new THREE.Vector2(RW - 0.5, RH - 0.5) } };
    const memb = new THREE.Mesh(new THREE.PlaneGeometry(RW - 0.5, RH - 0.5), new THREE.ShaderMaterial({ vertexShader: MEMB_VS, fragmentShader: MEMB_FS, uniforms: membU,
      transparent: true, blending: THREE.AdditiveBlending, depthWrite: false }));
    memb.renderOrder = 6; g.add(memb);
    // the room itself, open towards the camera
    const wallU = { uTop: { value: new THREE.Color() }, uBot: { value: new THREE.Color() }, uStars: { value: a === 0 ? 1 : 0 }, uL: { value: 1 }, uH: { value: RH } };
    if (a === 0) { wallU.uTop.value.set(0x01030a); wallU.uBot.value.set(0x0b1830); }
    if (a === 1) { wallU.uTop.value.set(0x020c0b); wallU.uBot.value.set(0x0b2a26); }
    if (a === 2) { wallU.uTop.value.set(0x030202); wallU.uBot.value.set(0x120b06); }
    const box = new THREE.Mesh(new THREE.BoxGeometry(RW, RH, RD), new THREE.ShaderMaterial({ vertexShader: WALL_VS, fragmentShader: WALL_FS, uniforms: wallU, side: THREE.BackSide }));
    box.position.z = -RD / 2; g.add(box);
    const coneMat = (c, i) => new THREE.ShaderMaterial({ vertexShader: CONE_VS, fragmentShader: CONE_FS, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide, uniforms: { uLen: { value: 1 }, uCol: { value: c }, uI: { value: i } } });
    const beam = (from, to, rad, c, i, sx = 1, sz = 1) => {
      const dir = new THREE.Vector3().subVectors(to, from); const len = dir.length();
      const geo = new THREE.ConeGeometry(rad, len, 40, 1, true); geo.translate(0, -len / 2, 0);
      const mat = coneMat(c, i); mat.uniforms.uLen.value = len;
      const m = new THREE.Mesh(geo, mat); m.position.copy(from); m.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), dir.normalize()); m.scale.set(sx, 1, sz);
      m.renderOrder = 5; g.add(m); return mat;
    };
    const fy = -RH / 2;
    const extra = { beams: [], uniforms: [] };
    if (a === 0) { // SporChat: a night stadium in miniature
      const pitch = new THREE.Mesh(new THREE.PlaneGeometry(RW - 0.6, RD - 0.6), tie(new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 384, 512, drawPitch, { aniso }) }), new THREE.Color(1.15, 1.15, 1.15)));
      pitch.rotation.x = -Math.PI / 2; pitch.position.set(0, fy + 0.02, -RD / 2); g.add(pitch);
      const n = phone ? 360 : 900, pos = new Float32Array(n * 3), cc = new Float32Array(n * 3), rr = new Float32Array(n);
      for (let i = 0; i < n; i++) {
        const sd = i % 2 ? 1 : -1, t = Math.random();
        pos[i * 3] = sd * (RW / 2 - 0.25 - t * 1.6); pos[i * 3 + 1] = fy + 0.4 + t * 2.6; pos[i * 3 + 2] = -1 - Math.random() * (RD - 2);
        const home = Math.random() < 0.5, l = 0.25 + Math.random() * 0.45;
        cc[i * 3] = (home ? 0.55 : 0.12) * l; cc[i * 3 + 1] = (home ? 0.1 : 0.25) * l; cc[i * 3 + 2] = (home ? 0.1 : 0.7) * l; rr[i] = Math.random();
      }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); geo.setAttribute('aCol', new THREE.BufferAttribute(cc, 3)); geo.setAttribute('aR', new THREE.BufferAttribute(rr, 1));
      const cu = { uTime: time, uScale: pointScale, uL: { value: 1 } }; extra.uniforms.push(cu.uL);
      g.add(new THREE.Points(geo, new THREE.ShaderMaterial({ vertexShader: CROWD_VS, fragmentShader: CROWD_FS, uniforms: cu })));
      const mast = new THREE.MeshBasicMaterial({ color: 0x10151c });
      const aim = new THREE.Vector3(0, fy, -RD / 2);
      for (const [x, z] of [[-RW / 2 + 0.7, -1.4], [RW / 2 - 0.7, -1.4], [-RW / 2 + 0.7, -RD + 1.4], [RW / 2 - 0.7, -RD + 1.4]]) {
        const top = RH / 2 - 3.2;
        const m = new THREE.Mesh(new THREE.BoxGeometry(0.18, top - fy, 0.18), mast); m.position.set(x, (top + fy) / 2, z); g.add(m);
        const head = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.9), tie(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), new THREE.Color(6, 6.2, 6.8)));
        head.position.set(x, top + 0.4, z); head.lookAt(aim); g.add(head);
        const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glareTex, color: 0xdfe9ff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
        gl.scale.set(6, 6, 1); gl.position.set(x, top + 0.4, z); g.add(gl); lit.push([gl.material, new THREE.Color(0xdfe9ff), 'color']);
        extra.beams.push(beam(new THREE.Vector3(x, top + 0.4, z), aim, 4.2, new THREE.Color(0.62, 0.74, 1.0), 0.32));
      }
    } else if (a === 1) { // MediZen: teal glass and a heartbeat
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(RW, RD), tie(new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 256, 256, drawPool('rgba(120,235,200,.55)', '#06201c')) }), new THREE.Color(1, 1, 1)));
      fl.rotation.x = -Math.PI / 2; fl.position.set(0, fy + 0.02, -RD / 2); g.add(fl);
      for (let i = 0; i < 5; i++) {
        const w = 2.4, h = 10 + (i % 2) * 3;
        const gu = { uCol: { value: col }, uI: { value: 1 }, uTime: time, uSize: { value: new THREE.Vector2(w, h) } }; extra.uniforms.push(gu.uI);
        const pane = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.ShaderMaterial({ vertexShader: MEMB_VS, fragmentShader: GLASS_FS, uniforms: gu,
          transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
        pane.position.set((i - 2) * 1.9, fy + h / 2, -3.5 - (i % 3) * 3.6); pane.rotation.y = (i - 2) * 0.32; pane.renderOrder = 5; g.add(pane);
      }
      const M = 260, pos = [], ax = [], idx = [], w = RW - 1.4, th = 0.06;
      for (let i = 0; i <= M; i++) { const x = i / M, y = 5.2 + ecg(x) * 2.2; pos.push((x - 0.5) * w, y - th, 0, (x - 0.5) * w, y + th, 0); ax.push(x, x); if (i < M) { const b = i * 2; idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); } }
      const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); geo.setAttribute('aX', new THREE.Float32BufferAttribute(ax, 1)); geo.setIndex(idx);
      const eu = { uCol: { value: col.clone().multiplyScalar(1.3) }, uI: { value: 1 }, uPh: { value: 0 } }; extra.ecg = eu; extra.uniforms.push(eu.uI);
      const line = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: ECG_VS, fragmentShader: ECG_FS, uniforms: eu, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
      line.position.z = -RD + 0.4; line.renderOrder = 5; g.add(line);
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: col, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.35, fog: false }));
      halo.scale.set(9, 9, 1); halo.position.set(0, fy + 1.5, -RD / 2); g.add(halo); lit.push([halo.material, col.clone(), 'color']);
    } else { // Green Room: a snooker lamp over green felt
      const fl = new THREE.Mesh(new THREE.PlaneGeometry(RW, RD), tie(new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 256, 256, drawPool('rgba(120,70,30,.55)', '#070403')) }), new THREE.Color(1, 1, 1)));
      fl.rotation.x = -Math.PI / 2; fl.position.set(0, fy + 0.02, -RD / 2); g.add(fl);
      const tz = -RD * 0.55, top = fy + 2.6;
      const wood = tie(new THREE.MeshBasicMaterial({ color: 0x1b0f07 }), new THREE.Color(0x1b0f07));
      const body = new THREE.Mesh(new THREE.BoxGeometry(8.4, 1.4, 4.6), wood); body.position.set(0, top - 0.75, tz); g.add(body);
      for (const [x, z] of [[-3.7, -1.9], [3.7, -1.9], [-3.7, 1.9], [3.7, 1.9]]) { const l = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.3, 0.4), wood); l.position.set(x, fy + 0.65, tz + z); g.add(l); }
      const felt = new THREE.Mesh(new THREE.PlaneGeometry(7.8, 4.0), tie(new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 512, 264, drawFelt, { aniso }) }), new THREE.Color(1.25, 1.25, 1.25)));
      felt.rotation.x = -Math.PI / 2; felt.position.set(0, top + 0.01, tz); g.add(felt);
      const cush = tie(new THREE.MeshBasicMaterial({ color: 0x0b3d1d }), new THREE.Color(0x0b3d1d));
      for (const [w, d, x, z] of [[8.2, 0.22, 0, -2.1], [8.2, 0.22, 0, 2.1], [0.22, 4.4, -4.0, 0], [0.22, 4.4, 4.0, 0]]) { const c = new THREE.Mesh(new THREE.BoxGeometry(w, 0.2, d), cush); c.position.set(x, top + 0.1, tz + z); g.add(c); }
      const shade = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.45, 1.2), new THREE.MeshBasicMaterial({ color: 0x0c1a10 })); shade.position.set(0, top + 6.2, tz); g.add(shade);
      const bulb = new THREE.Mesh(new THREE.PlaneGeometry(5.1, 0.95), tie(new THREE.MeshBasicMaterial({ side: THREE.DoubleSide }), new THREE.Color(7, 5.4, 3.2)));
      bulb.rotation.x = Math.PI / 2; bulb.position.set(0, top + 5.96, tz); g.add(bulb);
      const cg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2, top + 6.4, tz), new THREE.Vector3(-2, RH / 2, tz), new THREE.Vector3(2, top + 6.4, tz), new THREE.Vector3(2, RH / 2, tz)]);
      g.add(new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: 0x2a2a2a })));
      extra.beams.push(beam(new THREE.Vector3(0, top + 5.9, tz), new THREE.Vector3(0, top, tz), 3.1, new THREE.Color(1.0, 0.78, 0.48), 0.42, 1.55, 0.62));
      // the balls: the reds in their triangle, the colours on their spots, the cue ball
      const balls = []; const R = 0.13;
      for (let r = 0; r < 5; r++) for (let c = 0; c <= r; c++) balls.push([1.9 + r * R * 1.8, (c - r / 2) * R * 2.1, 0xb01818]);
      balls.push([1.55, 0, 0xd8508a], [3.35, 0, 0x111111], [0, 0, 0x2050c8], [-2.3, 0, 0x6b3a1c], [-2.3, -0.85, 0xd8b020], [-2.3, 0.85, 0x1f8a3a], [-2.9, 0.4, 0xf2efe6]);
      const bm = new THREE.InstancedMesh(new THREE.SphereGeometry(R, 16, 12), tie(new THREE.MeshMatcapMaterial({ matcap: canvasTex(THREE, 128, 128, drawMatcap) }), new THREE.Color(1.15, 1.15, 1.15)), balls.length);
      balls.forEach(([x, z, c], i) => { m4.makeTranslation(x, top + R, tz + z); bm.setMatrixAt(i, m4); bm.setColorAt(i, new THREE.Color(c)); });
      g.add(bm);
    }
    scene.add(g);
    return { g, lit, membU, wallU, extra, L: 0.5, hov: 0, foc: 0, base: new THREE.Vector3() };
  });

  /* branch: the storefront's neon outline */
  const storePos = new Float32Array(STORE_LINES.length * 2 * 3);
  const storeGeo = new THREE.BufferGeometry(); storeGeo.setAttribute('position', new THREE.BufferAttribute(storePos, 3));
  const storeMat = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, fog: false });
  const store = new THREE.LineSegments(storeGeo, storeMat); store.frustumCulled = false; store.renderOrder = 4; scene.add(store);
  const storeGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: 0xe8913c, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
  storeGlow.renderOrder = 1; scene.add(storeGlow);

  /* check: the sweep */
  const sweepU = { uCol: { value: new THREE.Color(TINT[6]) }, uI: { value: 0 } };
  const sweep = new THREE.Mesh(new THREE.PlaneGeometry(4, 1), new THREE.ShaderMaterial({ vertexShader: MEMB_VS, fragmentShader: SWEEP_FS, uniforms: sweepU,
    transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide }));
  sweep.renderOrder = 6; scene.add(sweep);

  /* bio: the glow on the horizon; play: the neon balls */
  const sun = new THREE.Sprite(new THREE.SpriteMaterial({ map: softTex, color: 0xe8a86a, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
  sun.renderOrder = -4; scene.add(sun);
  const NB = phone ? 5 : 8;
  const ballMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const balls = new THREE.InstancedMesh(new THREE.SphereGeometry(0.85, 20, 14), ballMat, NB);
  const ballC = [0xff5fa2, 0x6fe3a1, 0xe8913c, 0x8cc2ff, 0xffd166, 0xff5fa2, 0x6fe3a1, 0xb18cff];
  for (let i = 0; i < NB; i++) balls.setColorAt(i, new THREE.Color(ballC[i]).multiplyScalar(2.4));
  balls.instanceMatrix.setUsage(THREE.DynamicDrawUsage); balls.frustumCulled = false; scene.add(balls);

  /* the chapters' poses, and a frame of each for placing things in front of it */
  const PZ = POSES.map(() => ({ pos: new THREE.Vector3(), tgt: new THREE.Vector3(), fwd: new THREE.Vector3(), right: new THREE.Vector3(), up: new THREE.Vector3(), fov: 50, hh: 0.46 }));
  let aspect = innerWidth / innerHeight, pt = aspect < 1, ls = pt ? 0.55 : 1;
  const fovFor = (v) => {
    if (aspect >= 1.6) return v;
    const h = Math.tan((v * Math.PI) / 360) * 1.6;
    return Math.min(92, Math.max(v, (Math.atan((h * (aspect < 1 ? 0.62 : 0.9)) / aspect) * 360) / Math.PI));
  };
  let curves = null;
  function makePoses() {
    aspect = innerWidth / innerHeight; pt = aspect < 1; ls = pt ? 0.55 : 1;
    PZ.forEach((z, i) => {
      z.pos.set(...POSES[i].p); z.tgt.set(...POSES[i].t);
      z.fwd.subVectors(z.tgt, z.pos).normalize();
      z.right.crossVectors(z.fwd, worldUp).normalize(); z.up.crossVectors(z.right, z.fwd);
      z.fov = fovFor(POSES[i].fov); z.hh = Math.tan((z.fov * Math.PI) / 360);
    });
    const ps = [], ts = [];
    PZ.forEach((z, i) => {
      ps.push(z.pos.clone()); ts.push(z.tgt.clone());
      if (i < NCH - 1) {
        const n = PZ[i + 1], [sx, sy] = SWING[i];
        ps.push(z.pos.clone().add(n.pos).multiplyScalar(0.5).add(tmp.set(sx, sy, 0)));
        ts.push(z.tgt.clone().add(n.tgt).multiplyScalar(0.5).add(tmp.set(sx * 0.4, sy * 0.4, 0)));
      }
    });
    curves = { p: new THREE.CatmullRomCurve3(ps, false, 'centripetal'), t: new THREE.CatmullRomCurve3(ts, false, 'centripetal') };
    gates.forEach((gm, b) => {
      const u = (b + 0.5) / (NCH - 1);
      curves.p.getPoint(u, gm.position); curves.p.getTangent(u, tmp);
      gm.lookAt(tmp.add(gm.position));
    });
  }
  const at = (i, x, y, d, out) => out.copy(PZ[i].pos).addScaledVector(PZ[i].right, x).addScaledVector(PZ[i].up, y).addScaledVector(PZ[i].fwd, d);
  const ndc = (i, nx, ny, d, out) => at(i, nx * d * PZ[i].hh * aspect, ny * d * PZ[i].hh, d, out);
  const face = (o, i, rx = 0, ry = 0, rz = 0) => { m4.lookAt(PZ[i].pos, o.p, PZ[i].up); o.q.setFromRotationMatrix(m4); if (rx || ry || rz) o.q.multiply(q2.setFromEuler(e.set(rx, ry, rz))); };
  const faceTo = (o, to, upv) => { m4.lookAt(to, o.p, upv); o.q.setFromRotationMatrix(m4); };

  /* the DOM: where things are on the page, measured on resize and refresh */
  const valItems = [...document.querySelectorAll('#value .ba__item')];
  const valSec = document.getElementById('value');
  const phonesEl = [...document.querySelectorAll('#phones .phone')];
  const workStage = document.getElementById('workStage');
  const dialEl = document.getElementById('dial');
  const branchStage = document.getElementById('branchStage');
  const nights = [...document.querySelectorAll('#process .night')];
  const view = { w: innerWidth, h: innerHeight };   // the size the buffers and the anchors were made for
  const L = { valTop: 0, valH: 1, valC: [0, 0, 0], valX: [0.62, 0, -0.62], valRow: true, phX: [0.43, 0, -0.43], phY: 0, dial: [-0.25, 0], anchors: new Array(NCH).fill(0) };
  const pageTop = (el) => (el ? el.getBoundingClientRect().top + scrollY : 0);
  const midOf = (sel, vh) => { const el = document.querySelector(sel); if (!el) return 0; const r = el.getBoundingClientRect(); return r.top + scrollY + r.height / 2 - vh / 2; };
  function measure() {
    const vw = view.w, vh = view.h, max = Math.max(1, document.documentElement.scrollHeight - vh), gap = Math.min(1, max / NCH);
    const a = [Math.max(0, pageTop(valSec) - vh)];
    SECTIONS.forEach((s) => a.push(midOf(s, vh)));
    a.push(max);
    for (let i = 0; i < NCH; i++) a[i] = clamp(a[i], 0, max);
    for (let i = 1; i < NCH; i++) a[i] = Math.max(a[i], a[i - 1] + gap);
    for (let i = NCH - 1; i >= 0; i--) a[i] = Math.min(a[i], i === NCH - 1 ? max : a[i + 1] - gap);   // a short page: the last chapters stay reachable
    L.anchors = a;
    { const r = valSec.getBoundingClientRect(); L.valTop = r.top + scrollY; L.valH = Math.max(1, r.height); }
    if (valItems.length === 3) {
      const r = valItems.map((x) => x.getBoundingClientRect());
      L.valC = r.map((q) => q.top + scrollY + q.height / 2);
      L.valRow = Math.abs(r[0].top - r[2].top) < 40;
      L.valX = r.map((q) => clamp(((q.left + q.width / 2) / vw) * 2 - 1, -0.8, 0.8) * 1.08);
    }
    if (phonesEl.length === 3 && workStage) {
      const s = workStage.getBoundingClientRect();
      L.phX = phonesEl.map((p) => { const q = p.getBoundingClientRect(); return ((q.left + q.width / 2) / vw) * 2 - 1; });
      const q = phonesEl[1].getBoundingClientRect();
      L.phY = 1 - ((q.top + q.height / 2 - s.top) / vh) * 2;
    }
    if (dialEl && branchStage) {
      const s = branchStage.getBoundingClientRect(), q = dialEl.getBoundingClientRect();
      L.dial = [((q.left + q.width / 2) / vw) * 2 - 1, 1 - ((q.top + q.height / 2 - s.top) / vh) * 2];
    }
    placeStatic();
  }
  function placeStatic() {
    // process gates
    steps.forEach((m, g) => { at(3, 0, -2.4, 18 + g * 14, m.position); m.lookAt(PZ[3].pos); m.scale.setScalar(pt ? 0.55 : 0.78); });
    // the storefront outline, around the dial
    const fx = pt ? 0 : L.dial[0], fy = pt ? 0.1 : L.dial[1] * 0.6, d = 36, s = pt ? 0.5 : 1;
    ndc(5, fx, fy, d, tmp2);
    STORE_LINES.forEach(([x0, y0, x1, y1], i) => {
      tmp.copy(tmp2).addScaledVector(PZ[5].right, x0 * s).addScaledVector(PZ[5].up, y0 * s); storePos.set([tmp.x, tmp.y, tmp.z], i * 6);
      tmp.copy(tmp2).addScaledVector(PZ[5].right, x1 * s).addScaledVector(PZ[5].up, y1 * s); storePos.set([tmp.x, tmp.y, tmp.z], i * 6 + 3);
    });
    storeGeo.attributes.position.needsUpdate = true;
    storeGlow.position.copy(tmp2).addScaledVector(PZ[5].fwd, 6); storeGlow.scale.set(46 * s, 30 * s, 1);
    at(8, 0, -4, 300, sun.position); sun.scale.set(pt ? 260 : 520, 70, 1);
  }

  /* formations: one per chapter, each writes position, rotation, scale, fade, focus and lift of card i at time t */
  const RR = Array.from({ length: N }, (_, i) => Array.from({ length: 8 }, (__, k) => rnd(i + 1, k + 1)));
  const sig = { val: [0, 0, 0], lit: 0, app: 1, sweep: 0, scan: 0 };
  const roomCards = new Array(N).fill(null);
  APP_CELLS.forEach(([c0, c1], a) => { let n = 0; for (let i = 0; i < N && n < 3; i++) { const c = i % 16; if (c >= c0 && c < c1) roomCards[i] = [a, n++]; } });
  const others = [], otherIdx = new Int16Array(N); for (let i = 0; i < N; i++) if (!roomCards[i]) { otherIdx[i] = others.length; others.push(i); }
  const slots = storeSlots(N);
  const ROOM_SLOTS = [[-2.9, 6.3, -RD + 3.0, 0.3], [0, 7.4, -RD + 2.0, 0], [2.9, 6.3, -RD + 3.0, -0.3]];
  const F = [
    (i, t, o) => { // the hero lets go: a wall of screens close to the lens
      const cols = phone ? 4 : 8, rows = Math.ceil(N / cols), c = i % cols, r = Math.floor(i / cols), R = RR[i];
      ndc(0, ((c + 0.5) / cols * 2 - 1) * 0.92, (1 - ((r + 0.5) / rows) * 2) * 0.82, 13 + R[0] * 4, o.p);
      face(o, 0, (R[1] - 0.5) * 0.2, (R[2] - 0.5) * 0.3, (R[3] - 0.5) * 0.15);
      o.s = 0.52; o.f = 1; o.lift = -6; o.foc = 0.3;
    },
    (i, t, o) => { // value: three constellations, each lit by its beat
      const j = i % 3, m = Math.floor(i / 3), cnt = Math.ceil((N - j) / 3), R = RR[i];
      if (pt) ndc(1, 0, [0.42, 0, -0.42][j], 34, tmp); else ndc(1, L.valX[j], 0.02, 34, tmp);
      const a = (m / cnt) * TAU + t * 0.1 * (j === 1 ? -1 : 1), rr = (3.4 + R[0] * 2.6) * ls * (pt ? 0.8 : 1);
      o.p.copy(tmp).addScaledVector(PZ[1].right, Math.cos(a) * rr)
        .addScaledVector(PZ[1].up, Math.sin(a * 2 + R[1] * 3) * rr * 0.55 + Math.sin(t * 0.5 + R[2] * 9) * 0.3)
        .addScaledVector(PZ[1].fwd, Math.sin(a) * rr * 0.9);
      face(o, 1, (R[3] - 0.5) * 0.3, (R[4] - 0.5) * 0.5, (R[5] - 0.5) * 0.25);
      const Lj = sig.val[j]; o.s = 0.56 + 0.1 * Lj; o.f = 0.45 + 0.55 * Lj; o.lift = -5; o.foc = Lj;
    },
    (i, t, o) => { // services: one wheel of light
      const a = (i / N) * TAU + t * 0.07, Rr = 15 * ls;
      ndc(2, pt ? 0 : -0.12, pt ? 0.62 : 0.66, 70, tmp);
      o.p.copy(tmp).addScaledVector(PZ[2].right, Math.cos(a) * Rr).addScaledVector(PZ[2].up, Math.sin(a) * Rr * 0.3 + Math.sin(t * 0.6 + i) * 0.2)
        .addScaledVector(PZ[2].fwd, Math.sin(a) * Rr * 0.8);
      face(o, 2);
      o.s = 0.72; o.f = 0.5; o.lift = 4; o.foc = 0.1 + 0.7 * Math.pow(0.5 + 0.5 * Math.sin(a * 3 - t * 1.4), 8);
    },
    (i, t, o) => { // process: the track
      const side = i % 2 ? 1 : -1, row = Math.floor(i / 2), d = 7 + row * (phone ? 9.5 : 5.6);
      at(3, side * 4.8 * (pt ? 0.62 : 1), -2.6 + Math.sin(t * 1.3 + row * 0.7) * 0.06, d, o.p);
      at(3, 0, -2.6, d - 10, tmp); faceTo(o, tmp, PZ[3].up);
      const reach = 18 + (sig.lit - 1) * 14 + 3;
      o.s = 0.78; o.f = 0.58; o.lift = 3; o.foc = sig.lit > 0.2 ? 0.6 * sstep(reach + 3, reach - 3, d) : 0;
    },
    (i, t, o) => { // work: the screens of each app inside its room, the rest a slow halo behind
      const rc = roomCards[i];
      if (rc) {
        const room = rooms[rc[0]], [x, y, z, yw] = ROOM_SLOTS[rc[1]];
        o.p.set(x, y + Math.sin(t * 0.8 + i) * 0.1, z).applyMatrix4(room.g.matrixWorld);
        o.q.copy(room.g.quaternion).multiply(q2.setFromEuler(e.set(0, yw, 0)));
        o.s = 0.72 * room.g.scale.x; o.f = 0.5 + 0.5 * room.L; o.lift = 6; o.foc = room.foc; return;
      }
      const a = (otherIdx[i] / others.length) * TAU + t * 0.04;
      ndc(4, 0, 0.1, 62, tmp);
      o.p.copy(tmp).addScaledVector(PZ[4].right, Math.cos(a) * 34 * ls).addScaledVector(PZ[4].up, Math.sin(a) * 19 * ls);
      face(o, 4, 0, 0, a);
      o.s = 0.8; o.f = 0.4; o.lift = 6; o.foc = 0;
    },
    (i, t, o) => { // branch: a storefront
      const sl = slots[i], s = pt ? 0.5 : 1;
      ndc(5, pt ? 0 : L.dial[0], pt ? 0.1 : L.dial[1] * 0.6, 36, tmp);
      o.p.copy(tmp).addScaledVector(PZ[5].right, sl.x * s).addScaledVector(PZ[5].up, sl.y * s + Math.sin(t * 0.7 + i) * 0.04).addScaledVector(PZ[5].fwd, -sl.z * s);
      face(o, 5, sl.rx, 0, sl.rz);
      o.s = sl.s * s * 1.05; o.f = 0.6; o.lift = 5; o.foc = sl.rz ? 0.45 : 0.12;
    },
    (i, t, o) => { // check: a scanning grid
      const cols = phone ? 4 : 8, c = i % cols, r = Math.floor(i / cols);
      const x = (c - (cols - 1) / 2) * 3.0 * (pt ? 0.75 : 1);
      at(6, x, -15 + r * 1.5, 28 + r * 2.9, o.p);
      face(o, 6, -0.6, 0, 0);
      const fo = Math.exp(-Math.pow((x - sig.sweep) / 2.3, 2)); o.s = 0.86; o.f = 0.38 + 0.5 * fo; o.lift = 4; o.foc = fo * 0.8;
    },
    (i, t, o) => { // plans: three pillars, the tallest for the full partnership
      const k = i % 3, m = Math.floor(i / 3), lvl = Math.floor(m / 4), ang = ((m % 4) / 4) * TAU + t * 0.22 * (k === 1 ? -1 : 1) + lvl * 0.7;
      ndc(7, pt ? (1 - k) * 0.62 : [0.6, 0, -0.6][k], -0.62, 44, tmp);
      const rad = 2.7 * ls;
      tmp.addScaledVector(PZ[7].up, lvl * 4.6 * [1.25, 1, 0.82][k]);
      o.p.copy(tmp).addScaledVector(PZ[7].right, Math.cos(ang) * rad).addScaledVector(PZ[7].fwd, Math.sin(ang) * rad);
      tmp2.subVectors(o.p, tmp).add(o.p); faceTo(o, tmp2, PZ[7].up);
      o.s = 0.62; o.f = 0.85; o.lift = 5; o.foc = k === 0 ? 0.7 : 0.12;
    },
    (i, t, o) => { // bio: a horizon of drifting screens
      const R = RR[i], span = pt ? 90 : 150;
      let x = ((i / N) - 0.5) * span + t * 1.3; x = (((x + span / 2) % span) + span) % span - span / 2;
      at(8, x, -1.4 + Math.sin(t * 0.4 + R[0] * 9) * 0.3 + R[1] * 1.2, 78 + R[2] * 34, o.p);
      face(o, 8, 0, (R[3] - 0.5) * 0.4, 0);
      o.s = 1.05; o.f = 0.75; o.lift = 6; o.foc = 0.12 + R[4] * 0.35;
    },
    (i, t, o) => { // play: hopping on the floor
      const R = RR[i];
      at(9, (R[0] - 0.5) * 30 * ls, 0, 13 + R[1] * 26, o.p);
      const hop = Math.abs(Math.sin(t * (1.5 + R[2] * 1.1) + R[3] * TAU));
      o.p.y = FLOOR + 1.75 + hop * (2 + R[4] * 3.4);
      o.q.setFromEuler(e.set(Math.sin(t * 0.9 + R[5] * 9) * 0.25, t * (R[6] - 0.5) * 2.2 + R[7] * TAU, Math.sin(t * 1.3 + R[0] * 7) * 0.2, 'YXZ'));
      o.s = 0.6; o.f = 1; o.lift = 6; o.foc = Math.pow(hop, 10);
    },
    (i, t, o) => { // faq: up and away, among the stars
      const R = RR[i];
      at(10, (R[0] - 0.5) * 130, 0, 50 + R[1] * 90, o.p);
      o.p.y = 34 + R[2] * 70 + Math.sin(t * 0.2 + R[3] * 9) * 1.5;
      o.q.setFromEuler(e.set(R[4] * TAU + t * 0.05, R[5] * TAU + t * 0.04, R[6] * TAU));
      o.s = 1.1; o.f = 0.16; o.lift = 10; o.foc = 0;
    },
  ];
  const A = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, f: 1, lift: 0, foc: 0 };
  const B = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, f: 1, lift: 0, foc: 0 };
  const cardP = Array.from({ length: N }, () => new THREE.Vector3());
  const cardQ = Array.from({ length: N }, () => new THREE.Quaternion());
  const cardS = new Float32Array(N), cardF = new Float32Array(N), cardFo = new Float32Array(N);
  const order = Array.from({ length: N }, (_, i) => i), dist = new Float32Array(N);
  const mtx = new THREE.Matrix4(), sc = new THREE.Vector3();

  /* post: bloom, then the crossing, then tone mapping */
  rt = new THREE.WebGLRenderTarget(1, 1, { type: floatRT ? THREE.HalfFloatType : THREE.UnsignedByteType, samples: 0 });
  composer = new P_.EffectComposer(renderer, rt);
  // the composer clones rt into renderTarget2, its first readBuffer: the RenderPass always draws into it (the buffers are
  // re-aligned after every frame). So only that one multisamples; rt holds post output only, at half the memory.
  composer.renderTarget2.samples = phone ? 0 : 2;
  const renderAll = (dt) => { composer.render(dt); if (composer.readBuffer !== composer.renderTarget2) composer.swapBuffers(); };
  composer.addPass(new P_.RenderPass(scene, camera));
  const bloom = new P_.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), 0.72, 0.55, 0.82);
  composer.addPass(bloom);
  if (!floatRT) for (const t of [bloom.renderTargetBright, ...bloom.renderTargetsHorizontal, ...bloom.renderTargetsVertical]) t.texture.type = THREE.UnsignedByteType;
  const cross = new P_.ShaderPass({ ...CROSS_PASS, uniforms: THREE.UniformsUtils.clone(CROSS_PASS.uniforms) });
  cross.uniforms.uTint.value = tint.value;
  composer.addPass(cross);
  composer.addPass(new P_.OutputPass());

  function resize() {
    const w = innerWidth, h = innerHeight;
    view.w = w; view.h = h;
    const px = Math.min(dpr, budgetDpr());
    renderer.setPixelRatio(px); renderer.setSize(w, h, false);
    composer.setPixelRatio(px); composer.setSize(w, h);
    camera.aspect = w / h; cross.uniforms.uAspect.value = w / h;
    makePoses(); measure();
  }

  /* scroll → chapter: k runs 0..NCH-1, holding each formation while its text is read */
  const kOf = (y) => {
    const a = L.anchors;
    if (y <= a[0]) return 0;
    for (let i = 0; i < NCH - 1; i++) {
      if (y < a[i + 1]) { const f = (y - a[i]) / (a[i + 1] - a[i]); return i + 0.28 * f + 0.72 * (f * f * (3 - 2 * f)); }
    }
    return NCH - 1;
  };
  const scrollNow = () => (lenis ? lenis.scroll : scrollY);
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  if (hover) addEventListener('pointermove', (ev) => { ptr.x = (ev.clientX / innerWidth) * 2 - 1; ptr.y = (ev.clientY / innerHeight) * 2 - 1; }, { passive: true, ...sig_ });
  // a work phone under the pointer or the keyboard lights its room
  let hovApp = -1;
  phonesEl.forEach((p, a) => {
    const idx = APPS.indexOf(p.dataset.app);
    p.addEventListener('pointerenter', () => { hovApp = idx; }, sig_);
    p.addEventListener('pointerleave', () => { if (hovApp === idx) hovApp = -1; }, sig_);
    p.addEventListener('focusin', () => { hovApp = idx; }, sig_);
    p.addEventListener('focusout', () => { if (hovApp === idx) hovApp = -1; }, sig_);
  });
  document.getElementById('ck')?.addEventListener('submit', () => { sig.scan = 1; }, sig_);

  // resize: debounced; on a phone a height-only change under 150 px is the browser's toolbar sliding,
  // so nothing reallocates and the anchors stay (no false crossing)
  addEventListener('resize', () => {
    clearTimeout(rsT);
    rsT = setTimeout(() => { if (alive && !(coarse && innerWidth === view.w && Math.abs(innerHeight - view.h) < 150)) resize(); }, 150);
  }, sig_);
  ro = new ResizeObserver(() => measure()); ro.observe(document.body);
  addEventListener('load', measure, sig_);
  window.ScrollTrigger?.addEventListener?.('refresh', measure);
  makePoses(); resize();

  /* the loop */
  let k = kOf(scrollNow()), kPrev = k, lastIdx = Math.round(k), last = performance.now(), t0 = last, booted = 0;
  let crossT = -10, crossDir = 1, crossType = 0, vel = 0, ride = 0, appF = 1, expo = 1, readyOnce = false;
  const camP = new THREE.Vector3(), camT = new THREE.Vector3(), right = new THREE.Vector3(), camUp = new THREE.Vector3();
  const stats = { frames: 0, rendered: 0, cpu: 0, dpr, bloom: true, samples: [], drops: 0 };
  const gov = new Float32Array(90); let govN = 0, slowRuns = 0, fastRuns = 0, lastF = performance.now();
  const W = (i) => Math.max(0, 1 - Math.abs(k - i));

  function frame(now) {
    if (!alive) return;
    if (shaderFailed) { dispose(); return; }   // a material compiled late (first drawn now) and failed: the page's own look
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;
    time.value = t;

    // the hero covers the space until it lets go; nothing renders under it
    // (no layout reads in the loop: GSAP has just written styles, and a read here would force a layout every frame)
    const vh = innerHeight, sy = scrollNow(), cpu0 = performance.now();
    const hb = L.valTop - sy;   // the hero (and its pin) ends where #value begins
    const show = sstep(0.015, 0.33, 1 - hb / vh);
    if (show <= 0.001) { if (wrap.style.opacity !== '0') wrap.style.opacity = '0'; lastF = now; return; }
    booted = Math.min(1, booted + dt / 1.2);
    const op = show * booted;
    wrap.style.opacity = op.toFixed(3);

    // the scroll, smoothed once more so the flight never jerks
    const kT = kOf(sy);
    kPrev = k; k = damp(k, kT, 3.4, dt);
    if (Math.abs(k - kT) < 1e-4) k = kT;
    vel = damp(vel, Math.abs((k - kPrev) / Math.max(dt, 1e-3)), 6, dt);
    const idx = Math.round(k);
    if (idx !== lastIdx) {   // a fast fling crosses some boundaries uncut
      if (t - crossT >= CROSS_GAP) { crossDir = idx > lastIdx ? 1 : -1; crossType = CROSS[Math.min(idx, lastIdx)]; crossT = t; }
      lastIdx = idx;
    }
    const c = Math.min(Math.floor(k), NCH - 2), f = k - c, fe = sstep(0, 1, f);

    // the page's signals
    if (W(1) > 0) {
      const sp = clamp((vh * 0.9 - (L.valTop - sy)) / L.valH);
      for (let j = 0; j < 3; j++) {
        let target;
        if (L.valRow) target = sstep(0.33 + j * 0.17, 0.45 + j * 0.17, sp);
        else target = 1 - sstep(0.12, 0.42, Math.abs(L.valC[j] - sy - vh / 2) / vh);
        sig.val[j] = damp(sig.val[j], target, 4, dt);
      }
    }
    if (W(3) > 0) { let n = 0; for (const x of nights) if (x.classList.contains('is-lit')) n++; sig.lit = damp(sig.lit, n, 3, dt); }
    if (W(4) > 0) {
      const fp = phonesEl.findIndex((p) => p.classList.contains('is-focus'));
      appF = damp(appF, fp >= 0 ? APPS.indexOf(phonesEl[fp].dataset.app) : 1, 3.2, dt);
    }
    sig.scan = damp(sig.scan, 0, 0.6, dt);
    sig.sweep = Math.sin(t * (0.9 + sig.scan * 2.2)) * (phone ? 5.5 : 11);
    ride = damp(ride, Math.max(0, sig.lit - 1) * 14, 2.2, dt);

    // the camera on its spline
    const u = clamp(k / (NCH - 1));
    curves.p.getPoint(u, camP); curves.t.getPoint(u, camT);
    const w3 = c === 3 ? 1 - sstep(0, 1, f) : c === 2 ? sstep(0.4, 1, f) : 0;
    camP.addScaledVector(PZ[3].fwd, ride * w3); camT.addScaledVector(PZ[3].fwd, ride * w3);
    const w4 = W(4);
    // work: on a wide screen the camera leans towards the room in focus; on a phone the rooms slide like a carousel
    if (!pt) { const lean = lerp(L.phX[0], L.phX[2], appF / 2) * 1.3 * 46 * PZ[4].hh * aspect * 0.18; camP.addScaledVector(PZ[4].right, lean * w4); camT.addScaledVector(PZ[4].right, lean * w4 * 0.7); }
    camP.x += Math.sin(t * 0.21) * 0.3; camP.y += Math.sin(t * 0.17 + 1) * 0.2;
    ptr.sx = damp(ptr.sx, ptr.x, 2.5, dt); ptr.sy = damp(ptr.sy, ptr.y, 2.5, dt);
    camera.position.copy(camP); camera.up.copy(worldUp); camera.lookAt(camT);
    if (hover) {
      right.set(1, 0, 0).applyQuaternion(camera.quaternion); camUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(right, ptr.sx * 0.8).addScaledVector(camUp, -ptr.sy * 0.45);
      camera.lookAt(camT);
    }
    camera.rotateZ(lerp(POSES[c].roll, POSES[c + 1].roll, fe));
    camera.fov = lerp(PZ[c].fov, PZ[c + 1].fov, fe) + clamp(vel) * 9;
    camera.updateProjectionMatrix();
    camU.value.copy(camera.position);
    sky.position.copy(camera.position);
    floor.position.x = camera.position.x; floor.position.z = camera.position.z;
    pointScale.value = (renderer.getDrawingBufferSize(v2).y * 0.5) / Math.tan((camera.fov * Math.PI) / 360);

    // the chapter's light
    const tA = c === 4 ? appCol[Math.round(clamp(appF, 0, 2))] : tints[c], tB = c + 1 === 4 ? appCol[Math.round(clamp(appF, 0, 2))] : tints[c + 1];
    tmpC.copy(tA).lerp(tB, fe); tint.value.lerp(tmpC, 1 - Math.exp(-6 * dt));
    expo = lerp(EXPO[c], EXPO[c + 1], fe);
    renderer.toneMappingExposure = expo;
    scene.fog.density = lerp(c >= 7 ? 0.0042 : 0.0062, c + 1 >= 8 ? 0.0042 : 0.0062, fe);

    // the rooms
    const roomsOn = k > 2.3 && k < 5.7;
    rooms.forEach((rm, a) => {
      rm.g.visible = roomsOn;
      if (!roomsOn) return;
      const fo = clamp(1 - Math.abs(appF - a));
      rm.hov = damp(rm.hov, hovApp === a ? 1 : 0, 6, dt);
      rm.foc = fo; rm.L = 0.32 + 0.68 * fo + 0.5 * rm.hov;
      const d = 34 - 4 * fo - 2.5 * rm.hov;
      let sx = 1;
      if (pt) { const halfW = d * PZ[4].hh * aspect; sx = Math.min(1, (halfW * 2 * 0.86) / RW); ndc(4, 0, 0.02, d, rm.g.position); rm.g.position.addScaledVector(PZ[4].right, (a - appF) * (RW * sx + 1.2)); }
      else ndc(4, L.phX[a] * 1.3, L.phY * 0.4, d, rm.g.position);
      rm.g.scale.setScalar(sx);
      rm.g.lookAt(tmp.copy(PZ[4].pos).setY(rm.g.position.y));
      rm.g.updateMatrixWorld(true);
      const Lr = rm.L * (0.4 + 0.6 * sstep(3, 4, k)) * (1 - sstep(4.6, 5.5, k));
      for (const [m, base, key] of rm.lit) m[key].copy(base).multiplyScalar(Lr);
      rm.membU.uI.value = 0.25 + Lr * 0.7;
      rm.wallU.uL.value = 0.5 + Lr * 1.1;
      for (const b of rm.extra.beams) b.uniforms.uI.value = 0.38 * Lr;
      for (const uu of rm.extra.uniforms) uu.value = Lr;
      if (rm.extra.ecg) rm.extra.ecg.uPh.value = (t * 0.33) % 1;
    });

    // the cards: formation c → c + 1, each card on its own beat
    const ie = 1 - Math.pow(1 - booted, 3);
    for (let i = 0; i < N; i++) {
      F[c](i, t, A); F[c + 1](i, t, B);
      const b = easeIO(clamp((f - 0.08 - RR[i][7] * 0.3) / 0.52));
      cardP[i].lerpVectors(A.p, B.p, b);
      cardP[i].y += Math.sin(Math.PI * b) * lerp(A.lift, B.lift, 0.5);
      cardQ[i].slerpQuaternions(A.q, B.q, b);
      cardS[i] = lerp(A.s, B.s, b) * (0.3 + 0.7 * ie);
      cardF[i] = lerp(A.f, B.f, b);
      cardFo[i] = lerp(A.foc, B.foc, b);
      dist[i] = cardP[i].distanceToSquared(camera.position);
      cardF[i] *= sstep(10, 52, dist[i]);   // a card that flies past the lens fades instead of filling the frame with glow
    }
    order.sort((x, y) => dist[y] - dist[x]);
    for (let j = 0; j < N; j++) {
      const i = order[j];
      sc.setScalar(cardS[i]); mtx.compose(cardP[i], cardQ[i], sc);
      cards.setMatrixAt(j, mtx); halos.setMatrixAt(j, mtx);
      aCell.array[j] = i % SHOTS.length; aSeed.array[j] = RR[i][6]; aFade.array[j] = cardF[i]; aFocus.array[j] = cardFo[i];
    }
    for (const m of [cards, halos]) m.instanceMatrix.needsUpdate = true;
    for (const a of [aCell, aSeed, aFade, aFocus]) a.needsUpdate = true;

    // the links: the constellations (value) and the wheel's rim (services)
    const w1 = W(1), w2 = W(2);
    links.visible = w1 + w2 > 0.01;
    if (links.visible) {
      for (let i = 0; i < N; i++) {
        const j1 = i + 3 < N ? i + 3 : i, j2 = (i + 1) % N, o = i * 12;
        linkPos.set([cardP[i].x, cardP[i].y, cardP[i].z, cardP[j1].x, cardP[j1].y, cardP[j1].z, cardP[i].x, cardP[i].y, cardP[i].z, cardP[j2].x, cardP[j2].y, cardP[j2].z], o);
        const a1 = w1 * (0.12 + 0.6 * sig.val[i % 3]) * (j1 === i ? 0 : 1), a2 = w2 * (0.15 + 0.6 * (cardFo[i] + cardFo[j2]) * 0.5);
        const tc = tint.value;
        linkCol.set([tc.r * a1, tc.g * a1, tc.b * a1, tc.r * a1, tc.g * a1, tc.b * a1, tc.r * a2, tc.g * a2, tc.b * a2, tc.r * a2, tc.g * a2, tc.b * a2], o);
      }
      linkGeo.attributes.position.needsUpdate = true; linkGeo.attributes.color.needsUpdate = true;
    }

    // the gateways, the process gates, the storefront, the sweep, the horizon, the balls, the hub
    gates.forEach((gm, b) => {
      const dd = gm.position.distanceTo(camera.position);
      const near = Math.exp(-dd / 16), pass = Math.exp(-Math.pow((k - (b + 0.5)) * 4, 2));
      gm.material.color.copy(tints[b + 1] || appCol[1]).multiplyScalar((0.02 + near * 1.2 + pass * 1.6) * (0.7 + 0.3 * Math.sin(t * 1.4 + b)));
    });
    const w3s = Math.max(W(3), c === 2 ? f * 0.5 : 0);
    steps.forEach((m, g) => {
      m.visible = w3s > 0.01;
      const on = clamp(sig.lit - g);
      m.material.color.copy(tints[3]).multiplyScalar(w3s * (0.08 + on * 0.55));
    });
    const w5 = W(5); store.visible = storeGlow.visible = w5 > 0.01;
    storeMat.color.copy(tints[5]).multiplyScalar(w5 * (1.8 + Math.sin(t * 9) * Math.sin(t * 2.3) * 0.25));
    storeGlow.material.opacity = w5 * 0.16;
    const w6 = W(6); sweep.visible = w6 > 0.01;
    if (sweep.visible) {
      const rows = Math.ceil(N / (phone ? 4 : 8));
      at(6, sig.sweep, -15 + rows * 0.75, 28 + rows * 1.45, sweep.position);
      sweep.quaternion.copy(camera.quaternion); sweep.scale.set(1, rows * 4.2, 1);
      sweepU.uI.value = w6 * (1 + sig.scan);
    }
    floorU.uScan.value = w6; floorU.uGrid.value = 0.7 + 0.6 * w6 + 0.4 * W(9);
    const wb = Math.max(W(8), W(7) * 0.4, W(9) * 0.6); sun.visible = wb > 0.01; sun.material.opacity = wb * 0.55;
    const w9 = W(9); balls.visible = w9 > 0.01;
    if (balls.visible) {
      for (let i = 0; i < NB; i++) {
        const R = RR[i];
        at(9, (R[5] - 0.5) * 26 * ls, 0, 11 + R[6] * 22, tmp);
        const hop = Math.abs(Math.sin(t * (1.9 + R[2]) + R[1] * TAU));
        tmp.y = FLOOR + 0.85 + hop * (3 + R[3] * 4) - (1 - w9) * 6;
        const sq = 1 - 0.25 * Math.pow(1 - hop, 8);
        mtx.compose(tmp, q2.identity(), sc.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq)).multiplyScalar(w9));
        balls.setMatrixAt(i, mtx);
      }
      balls.instanceMatrix.needsUpdate = true;
    }
    hub.rotation.z = t * 0.01;
    const hw = 0.35 + 0.65 * sstep(7, 10, k);
    hubMat.color.setRGB(0.9 * hw, 0.5 * hw, 0.2 * hw); hubMat2.color.setRGB(0.35 * hw, 0.45 * hw, 0.7 * hw);

    // the crossing: a signature move on every boundary, scaled by the scroll's speed
    const gp = (t - crossT) / 0.9;
    const env = gp >= 0 && gp < 1 ? (gp < 0.15 ? gp / 0.15 : Math.exp(-(gp - 0.15) * 3.6)) : 0;
    cross.uniforms.uAmt.value = clamp(env * (0.55 + 0.75 * clamp(vel)));
    cross.uniforms.uType.value = crossType;
    cross.uniforms.uProg.value = clamp(gp);
    cross.uniforms.uDir.value = crossDir;
    cross.uniforms.uVel.value = clamp((vel - 0.05) * 1.1);
    cross.uniforms.uTime.value = t;

    renderAll(dt);
    stats.rendered++; stats.cpu = stats.cpu * 0.97 + (performance.now() - cpu0) * 0.03;
    if (!readyOnce) { readyOnce = true; lastIdx = Math.round(k); crossT = -10; root.classList.add('dim-home', 'dim-home-ready'); }

    // the governor: steps the pixel ratio down when frames run long, back up when there is room. It reads the
    // median of 90 frames, so a stall of the page itself (a pin, a font, the avatar loading) never costs resolution.
    stats.frames++;
    if (stats.rendered > 90 && now - lastF < 100) gov[govN++] = now - lastF;
    lastF = now;
    if (govN >= 90 && !dbgOn) {
      gov.sort(); const avg = gov[45]; govN = 0;
      stats.samples.push(Math.round(avg * 10) / 10); if (stats.samples.length > 40) stats.samples.shift();
      slowRuns = avg > 19.5 ? slowRuns + 1 : 0; fastRuns = avg < 17.4 ? fastRuns + 1 : 0;
      if (slowRuns >= 2) {
        slowRuns = 0; stats.drops++;
        const cur = Math.min(dpr, budgetDpr());   // steps from what is drawn, never from a ratio above the budget
        if (cur > 0.75) { dpr = Math.max(0.75, cur - 0.25); stats.dpr = dpr; resize(); }
        else if (bloom.enabled) { bloom.enabled = false; stats.bloom = false; }
      } else if (fastRuns >= 6 && dpr < Math.min(maxDpr, budgetDpr()) && stats.drops < 3) { fastRuns = 0; dpr = Math.min(maxDpr, budgetDpr(), dpr + 0.25); stats.dpr = dpr; resize(); }
    }
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (!raf && alive && started) { last = performance.now(); lastF = last; raf = requestAnimationFrame(frame); }
  }, sig_);
  // leaving the page: let the GPU go; back from the back-forward cache: build it again
  addEventListener('pagehide', (ev) => {
    dispose();
    if (ev.persisted) addEventListener('pageshow', (p) => { if (p.persisted) initDim({ lenis, reduce: false }); }, { once: true });
  }, { once: true, ...sig_ });

  // compileAsync resolves even when a shader fails, so one frame through the whole chain (the wrap is still at opacity 0)
  // and the error flag decide; a throw here lands in initDim's catch, which disposes
  try { await renderer.compileAsync(scene, camera); } catch { /* compiles on first draw */ }
  if (!alive) throw new Error('the context went away while compiling');
  renderAll(0);
  if (shaderFailed) throw new Error('a hub shader did not compile');
  started = true;
  raf = requestAnimationFrame(frame);
  const api = { stats, get k() { return k; }, anchors: () => L.anchors, dispose };
  if (dbgOn) Object.assign(api, { renderer, composer, bloom, sig, L, setDpr(v) { dpr = v; resize(); } });
  window.__dimHome = api;
  return api;
}
