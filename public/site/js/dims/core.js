// dims/core.js: the shared engine of the page dimensions (2026-10-28). Extracted from what sporchat.js and medizen.js
// do, so a page only describes its place: the environment as geometry, the camera's stops, and one formation per
// chapter. Nadav, on the flat shader worlds: "not even close... not a whole dimension". A dimension is a 3D place the
// scroll flies one camera through; its objects re-form per chapter, and every chapter boundary is a strong cut.
//
// A page calls startDim(spec, { lenis, reduce, onLost }) and gets true (the place runs) or false (the page keeps its
// old shader world: reduced motion or calm mode, the light look, no WebGL2, software GL, three or the screens failed).
//
// spec = {
//   name      'services': html gets dim3-on, dim3-services and, after the second frame, dim3-ready
//   base      the page colour under the place (also the fog and the clear colour unless fog.color is given)
//   accent    the place's light, '#rrggbb' (re-tints the nav like the worlds, and lights the cuts)
//   fog       { color, density }            exposure  tone mapping exposure   bloom  { strength, radius, threshold }
//   intro     [dx, dy, dz]: where the camera starts relative to chapter 0, easing in over 2.8 s
//   card      { shots: [urls], w, h, r, n: [desktop, phone] } optional: phone cards with the real screens (one atlas)
//   swarm     { n: [desktop, phone], geo?, key?, keyCol?, amb?, uniforms?, head?, glsl? } optional: instanced blocks that
//             morph between chapters (head declares the extra uniforms, glsl edits col from vW, vSeed, vB)
//   chapters  [{ at, cam: { pos, tgt, fov, roll, pp?, tp? }, via?: [pos, tgt], cut?, cards?(i, t, o, ctx), swarm?(ctx) }]
//             at     a selector (its middle is held at mid-screen), 'top' (scroll 0), 'end' (max) or (vh, max) => y
//             via    the flight from this chapter to the next passes here (halfway)
//             cut    how the frame crosses INTO this chapter: 'glitch' | 'warp' | 'fold' | 'ink' | 'scan'
//             cards  writes o.p (Vector3), o.q (Quaternion), o.s (scale), o.f (fade), o.lift (arc height) of card i
//             swarm  returns { p: Float32Array n*3, c: Float32Array n*4 (rgb + glow), s: Float32Array n, lift }
//   build     async (ctx) => ({ update?(ctx) }): the environment; ctx has THREE, scene, camera, renderer, time, acc,
//             phone, aniso, fogU(), pointScale, st (k, c, f, t, dt, vel, ie), cards, swarm, helpers (face, yaw, R),
//             and kick(cut) to cut the frame on a page event
// }
//
// The DOM stays the page: the canvas sits behind it (aria-hidden), a reading-side scrim (RTL: the right) keeps the text
// at 4.5:1, every control works as before. A hidden tab pauses, pagehide (not into the back-forward cache) disposes,
// a lost context hands the page back to its old world (onLost). ?nodim forces the old world, ?dimdbg keeps the governor off.

export const TAU = Math.PI * 2;
const PX_BUDGET = 8.3e6;   // device pixels per frame at most, so a large screen never allocates 4K-sized targets
const LOAD_MS = 8000;      // three, the addons and the screens: past this the page keeps its own world
const CUT_GAP = 0.5;       // s between two cuts at least, and the glitch tears at 2 Hz: under 3 flashes a second (WCAG 2.3.1)
export const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));
export const sstep = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const easeIO = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const rnd = (i, k) => { const x = Math.sin(i * 12.9898 + k * 78.233) * 43758.5453; return x - Math.floor(x); };

/* where a chapter sits in the page */
export function top(sel) { const el = document.querySelector(sel); return el ? el.getBoundingClientRect().top + scrollY : 0; }
export function mid(sel, vh) { const el = document.querySelector(sel); if (!el) return 0; const r = el.getBoundingClientRect(); return r.top + scrollY + r.height / 2 - vh / 2; }

/* a camera target that puts `focus` off-centre: side > 0 shifts it toward the inline-end of an RTL frame (the left) */
export function aim(pos, focus, side = 0, dy = 0) {
  const dx = focus[0] - pos[0], dz = focus[2] - pos[2], l = Math.hypot(dx, dz) || 1;
  return [focus[0] - (dz / l) * side, focus[1] + dy, focus[2] + (dx / l) * side];
}

export function probeGL() {
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

/* ── device tier: may this device run a dimension? (2026-10-28) ───────────────────────────────────────────────
   One small check shared by every dimension: startDim (all the pages built on this file) and dims/home.js call it.
   It only ever answers no on a phone (coarse pointer or under 760 px wide), so a desktop always gets its place.
     dimTier()       sync: 'low' when the phone reports navigator.hardwareConcurrency <= 4, or navigator.deviceMemory
                     <= 4 GB (Chromium only; a browser that does not report it gives no verdict), else 'ok'
     dimWarmup()     async: about 40 frames of the page as it runs now (after its load); true when the median frame is
                     over WARM_MS, i.e. the page alone already runs under ~36 fps and a dimension would take it under 30
     dimAllowed()    both together: false means skip the dimension (the page keeps its shader world, or home its own look)
     dimWatch()      after the start: feed it every frame's interval; true once two windows of 60 frames in a row have a
                     median over SLOW_MS (under ~30 fps), so the caller hands the page back. Phones only, like the rest.
   ?dim forces the dimension on any device (review), ?nodim off (as before). window.__dimTier keeps the last verdict. */
const WARM_MS = 28, SLOW_MS = 34;
export const isPhone = () => matchMedia('(pointer: coarse)').matches || innerWidth < 760;
const forced = () => new URLSearchParams(location.search).has('dim');
export function dimTier() {
  if (forced() || !isPhone()) return 'ok';
  const cores = navigator.hardwareConcurrency || 0, mem = navigator.deviceMemory || 0;
  return (cores && cores <= 4) || (mem && mem <= 4) ? 'low' : 'ok';
}
export async function dimWarmup({ frames = 40, maxMs = 3000 } = {}) {
  if (forced() || !isPhone()) return false;
  if (document.readyState !== 'complete') await new Promise((r) => addEventListener('load', r, { once: true }));
  const iv = [];
  await new Promise((done) => {
    const cap = setTimeout(done, maxMs);   // a hidden tab runs no frames: no verdict
    let last = 0;
    const f = (now) => { if (last && now - last < 250) iv.push(now - last); last = now; if (iv.length < frames) requestAnimationFrame(f); else { clearTimeout(cap); done(); } };
    requestAnimationFrame(f);
  });
  if (iv.length < frames / 2) return false;
  iv.sort((a, b) => a - b);
  return iv[iv.length >> 1] > WARM_MS;
}
export async function dimAllowed() {
  const tier = dimTier();
  const slow = tier === 'low' ? false : await dimWarmup();
  const ok = tier === 'ok' && !slow;
  window.__dimTier = { tier, warmup: slow ? 'slow' : 'ok', ok };
  return ok;
}
export function dimWatch() {
  if (forced() || !isPhone()) return () => false;
  const win = new Float32Array(60); let n = 0, slowRuns = 0;
  return (interval) => {
    if (!(interval > 0 && interval < 250)) return false;   // a stall (a hidden tab, a load) is not the dimension's
    win[n++] = interval;
    if (n < win.length) return false;
    n = 0; const s = Float32Array.from(win).sort();
    slowRuns = s[s.length >> 1] > SLOW_MS ? slowRuns + 1 : 0;
    if (slowRuns >= 2) { window.__dimTier = { ...(window.__dimTier || {}), ok: false, watch: 'slow' }; return true; }
    return false;
  };
}

export function canvasTex(THREE, w, h, draw, { srgb = true, repeat = false, aniso = 8 } = {}) {
  const c = document.createElement('canvas'); c.width = w; c.height = h;
  draw(c.getContext('2d'), w, h);
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = aniso;
  return t;
}

export const loadImages = (srcs) => Promise.all(srcs.map((src) => new Promise((res, rej) => {
  // decode() off the main thread: an undecoded image would decode synchronously inside the atlas's drawImage
  const im = new Image(); im.decoding = 'async'; im.onerror = () => rej(new Error('screen ' + src));
  im.onload = () => (im.decode ? im.decode().catch(() => {}) : Promise.resolve()).then(() => res(im)); im.src = src;
})));

/* fog for additive materials: they fade to black, not to the fog colour */
export const FOG_ADD = /* glsl */`
#ifdef USE_FOG
  float ff_ = 1.0 - exp(-fogDensity * fogDensity * vFogDepth * vFogDepth);
  gl_FragColor.rgb *= 1.0 - ff_;
#endif`;
export const HASH = /* glsl */`float h21(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
float n2(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(h21(i), h21(i + vec2(1, 0)), f.x), mix(h21(i + vec2(0, 1)), h21(i + vec2(1, 1)), f.x), f.y); }`;

/* ── shaders: the cards (one atlas of real screens), their glow, the swarm, the cuts ── */
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
uniform sampler2D uAtlas; uniform vec2 uCells; uniform vec2 uSize; uniform float uR; uniform vec3 uAcc;
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
    float ci = floor(vCell + 0.5), cy = floor((ci + 0.5) / uCells.x);   // not mod(): 4.0 / 4.0 can land a hair under 1
    vec2 cell = vec2(ci - cy * uCells.x, cy);
    vec2 auv = vec2((cell.x + vUv.x) / uCells.x, 1.0 - (cell.y + 1.0 - vUv.y) / uCells.y);
    col = texture2D(uAtlas, auv).rgb * (0.8 + 0.45 * vFocus);
    float s = vUv.x * 0.75 + vUv.y * 0.55 + (V.x - V.y) * 0.35 + vSeed;  // glass: a sheen that slides as the card turns
    col += vec3(0.85, 0.9, 1.0) * exp(-(((fract(s) - 0.5) * 7.0) * ((fract(s) - 0.5) * 7.0))) * 0.06;
  } else {
    col = vec3(0.012, 0.015, 0.02) + vec3(0.02, 0.025, 0.035) * (1.0 - vUv.y);   // the back: dark glass and a ring of the light
    float mark = abs(length(p - vec2(0.0, uSize.y * 0.06)) - uSize.x * 0.14) - uSize.x * 0.012;
    col += uAcc * 0.5 * (1.0 - smoothstep(0.0, 0.02, mark));
  }
  float ring = smoothstep(-uSize.x * 0.028, -uSize.x * 0.015, d);           // the metal band, bright at grazing angles
  col = mix(col, vec3(0.42, 0.44, 0.48) * (0.35 + fres * 2.2), ring);
  col += uAcc * fres * 0.25;
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
  float d = sdRB(p, uSize * 0.5, uR) / uSize.x;
  if (d < 0.0) discard;
  float g = exp(-d * 5.0) * 0.14 + exp(-d * 20.0) * 0.2;
  gl_FragColor = vec4(uAcc * g * (0.45 + vFocus * 1.4) * vFade, 1.0);
  ${FOG_ADD}
}`;

const SWARM_VS = /* glsl */`
attribute vec3 aA; attribute vec3 aB; attribute vec4 aCA; attribute vec4 aCB; attribute float aSA; attribute float aSB; attribute float aSeed;
uniform float uF, uT, uLift, uBreathe;
varying vec3 vN, vW, vCol; varying float vGlow, vSeed, vB;
#include <fog_pars_vertex>
mat3 rotAx(vec3 a, float t){ float c = cos(t), s = sin(t), o = 1.0 - c;
  return mat3(c + a.x*a.x*o, a.y*a.x*o + a.z*s, a.z*a.x*o - a.y*s, a.x*a.y*o - a.z*s, c + a.y*a.y*o, a.z*a.y*o + a.x*s, a.x*a.z*o + a.y*s, a.y*a.z*o - a.x*s, c + a.z*a.z*o); }
void main(){
  float s = aSeed;
  float b = clamp((uF - 0.08 - s * 0.3) / 0.55, 0.0, 1.0);                // each block on its own beat
  b = b < 0.5 ? 4.0 * b * b * b : 1.0 - pow(-2.0 * b + 2.0, 3.0) / 2.0;
  vB = b;
  vec3 p = mix(aA, aB, b);
  p.y += sin(3.14159 * b) * uLift * (0.4 + s);
  p += vec3(sin(uT * 0.7 + s * 40.0), sin(uT * 0.9 + s * 31.0), cos(uT * 0.6 + s * 23.0)) * uBreathe;
  float sc = mix(aSA, aSB, b);
  mat3 R = rotAx(normalize(vec3(s - 0.5, 1.0, fract(s * 7.0) - 0.5)), sin(3.14159 * b) * 3.14159 * (s * 2.0 - 1.0)); // a tumble in flight
  vec4 wp = modelMatrix * vec4(p + R * (position * sc), 1.0);
  vW = wp.xyz;
  vN = normalize(mat3(modelMatrix) * (R * normal));
  vCol = mix(aCA.rgb, aCB.rgb, b); vGlow = mix(aCA.w, aCB.w, b); vSeed = s;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const swarmFS = (glsl = '', head = '') => /* glsl */`
${head}
uniform vec3 uKey; uniform vec3 uKeyCol; uniform vec3 uAmb; uniform vec3 uAcc; uniform float uT;
varying vec3 vN, vW, vCol; varying float vGlow, vSeed, vB;
#include <fog_pars_fragment>
${HASH}
void main(){
  vec3 N = normalize(vN), V = normalize(cameraPosition - vW);
  float k = max(dot(N, normalize(uKey)), 0.0);
  float rim = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.5);
  vec3 col = vCol * (uAmb + uKeyCol * k) + vCol * vGlow + uAcc * rim * 0.18;
  ${glsl}
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;

const TRANS = {
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uAmt: { value: 0 }, uP: { value: -1 }, uDir: { value: 1 }, uKind: { value: 0 },
    uVel: { value: 0 }, uAspect: { value: 1 }, uSeed: { value: 0 }, uAcc: { value: null }, uInk: { value: null }, uRtl: { value: 1 },
  },
  vertexShader: /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: /* glsl */`
uniform sampler2D tDiffuse; uniform float uTime, uAmt, uP, uDir, uKind, uVel, uAspect, uSeed, uRtl; uniform vec3 uAcc, uInk;
varying vec2 vUv;
${HASH}
float sstep2(float x){ return x * x * (3.0 - 2.0 * x); }
float fbm(vec2 p){ return n2(p) * 0.55 + n2(p * 2.1 + 3.7) * 0.3 + n2(p * 4.3 + 8.1) * 0.15; }
vec3 tex(vec2 uv){ return texture2D(tDiffuse, clamp(uv, vec2(0.001), vec2(0.999))).rgb; }
vec3 split(vec2 uv, vec2 off){ return vec3(tex(uv + off).r, tex(uv).g, tex(uv - off).b); }
void main(){
  vec2 uv = vUv; float amt = uAmt, P = uP; bool on = P >= 0.0 && P <= 1.0;
  int K = int(uKind + 0.5);
  vec2 cq = vUv - 0.5; float e = dot(cq, cq);
  float ca = 0.0008 + uVel * 0.004 + amt * 0.012;
  vec3 col, add = vec3(0.0);
  if (K == 1 && on) {
    // warp-stretch: the frame streaks toward the centre while a shock ring of the light runs out
    vec2 c = vec2(0.5); vec2 d = uv - c;
    float r = length(d * vec2(uAspect, 1.0));
    float ring = P * 1.5, w = exp(-(((r - ring) * 6.0) * ((r - ring) * 6.0)));
    vec2 uv2 = c + d * (1.0 - w * amt * 0.08);
    col = vec3(0.0);
    for (int i = 0; i < 8; i++) { float k = float(i) / 7.0; vec2 q = c + (uv2 - c) * (1.0 - k * amt * 0.11 * (0.3 + r)); col += split(q, d * ca * 3.0); }
    col /= 8.0;
    add += uAcc * w * amt * 0.55 + vec3(1.0) * pow(w, 6.0) * amt * 0.25;
  } else if (K == 2 && on) {
    // fold: a crease runs from the reading side; ahead of it the frame is folded back over itself, shaded like paper
    float x = uRtl > 0.5 ? 1.0 - uv.x : uv.x;
    float xc = mix(-0.05, 1.25, P);
    float ahead = x - xc;
    if (ahead < 0.0 && xc + (xc - x) <= 1.25) {
      float xm = xc + (xc - x) * 0.85;                        // the folded flap, seen from behind and foreshortened
      float yy = 0.5 + (uv.y - 0.5) * (1.0 + (xc - x) * 0.35 * amt);
      vec2 fu = vec2(uRtl > 0.5 ? 1.0 - xm : xm, yy);
      float sh = 0.45 + 0.55 * smoothstep(0.0, 0.25, xc - x);
      vec3 flap = xm < 1.0 && yy > 0.0 && yy < 1.0 ? split(fu, vec2(ca, 0.0)) * sh : uInk;
      col = mix(split(uv, vec2(ca, 0.0)), flap, clamp(amt * 1.4, 0.0, 1.0) * step(xc - 0.33, x));
    } else col = split(uv, vec2(ca, 0.0));
    add += uAcc * exp(-((ahead * 60.0) * (ahead * 60.0))) * amt * 1.2 + uAcc * exp(-abs(ahead) * 12.0) * amt * 0.12;
  } else if (K == 3 && on) {
    // ink: blots of the place's own dark spread from the world side with a bright rim, then draw back
    float n = fbm(uv * vec2(uAspect, 1.0) * 2.4 + uSeed * 9.0);
    vec2 o = vec2(uRtl > 0.5 ? 0.0 : 1.0, 0.1);
    float field = length((uv - o) * vec2(uAspect, 1.0)) * 0.55 - n * 0.55;
    float f1 = mix(-0.4, 1.05, sstep2(P)), f2 = mix(-0.4, 1.05, clamp(P * 1.6 - 0.6, 0.0, 1.0));
    float in1 = smoothstep(f1, f1 - 0.03, field), in2 = smoothstep(f2, f2 - 0.03, field);
    float ink = in1 * (1.0 - in2) * clamp(amt * 1.8, 0.0, 1.0);
    float rim = exp(-(((field - f1) * 45.0) * ((field - f1) * 45.0))) + exp(-(((field - f2) * 45.0) * ((field - f2) * 45.0))) * 0.6;
    vec2 g = vec2(fbm(uv * 6.0 + 1.3) - 0.5, fbm(uv * 6.0 + 7.1) - 0.5);
    col = split(uv + g * rim * 0.04 * amt, vec2(ca, 0.0));
    col = mix(col, uInk, ink * 0.93);
    add += uAcc * rim * amt * 0.9;
  } else if (K == 4 && on) {
    // scan: a band of light passes down the frame; inside it the rows tear sideways, behind it a fading tint
    float yb = uDir > 0.0 ? mix(1.15, -0.15, P) : mix(-0.15, 1.15, P);
    float dy = uv.y - yb, band = exp(-((dy * 9.0) * (dy * 9.0)));
    float row = floor(uv.y * 160.0), tick = floor(uTime * 2.0);
    uv.x += (h21(vec2(row, tick)) - 0.5) * 0.05 * band * amt;
    col = split(uv, vec2(ca + band * amt * 0.012, 0.0));
    float passed = uDir > 0.0 ? step(yb, uv.y) : step(uv.y, yb);
    add += uAcc * (band * amt * 0.45 + exp(-((dy * 300.0) * (dy * 300.0))) * amt * 1.6 + passed * amt * 0.035);
  } else {
    // glitch-wipe (and the scroll's own speed): torn rows, jumping blocks, a seam of the light
    float wd = on ? (uDir > 0.0 ? vUv.y - (P * 1.3 - 0.15) : vUv.y - (1.15 - P * 1.3)) : 9.0;
    float near = on ? exp(-wd * wd * 26.0) : 0.0;
    float tick = floor(uTime * 2.0);                                   // the tears re-roll twice a second, never at frame rate
    float rows = mix(14.0, 70.0, h21(vec2(tick, 3.1)));
    float row = floor(uv.y * rows), r = h21(vec2(row, tick));
    float tear = step(1.0 - clamp(amt * 0.42 + near * amt * 1.1, 0.0, 0.95), r);
    uv.x += (h21(vec2(row, tick + 7.0)) - 0.5) * 0.14 * tear * (0.4 + amt);
    vec2 bq = floor(vUv * vec2(18.0, 10.0));
    if (h21(bq + tick * 1.7) > 1.0 - amt * amt * 0.1) uv += (vec2(h21(bq + 1.3), h21(bq + 2.9)) - 0.5) * 0.07;
    col = split(uv + cq * e * 0.02, vec2(ca + near * amt * 0.02, 0.0));
    add += uAcc * (near * amt * 0.35 + exp(-wd * wd * 5000.0) * amt * 2.0);
    col *= 1.0 - amt * 0.2 * step(0.5, fract(gl_FragCoord.y * 0.5));
  }
  col += add;
  col *= 1.0 + amt * 0.06;
  float gr = h21(gl_FragCoord.xy + fract(uTime * 7.13) * vec2(113.0, 71.0)) - 0.5;      // grain
  col += gr * (0.016 + amt * 0.06) * (0.25 + col);
  vec2 q = (vUv - 0.5) * vec2(uAspect, 1.0);                                             // vignette
  col *= mix(1.0, smoothstep(1.2, 0.25, length(q)), 0.6);
  gl_FragColor = vec4(max(col, 0.0), 1.0);
}`,
};
const CUTS = { glitch: [0, 0.75], warp: [1, 0.95], fold: [2, 1.05], ink: [3, 1.25], scan: [4, 0.95] };

/* ── start ─────────────────────────────────────────────────── */
export async function startDim(spec, { lenis = null, reduce = false, onLost = null } = {}) {
  const root = document.documentElement;
  const q = new URLSearchParams(location.search);
  if (reduce || q.has('nodim') || root.classList.contains('reduce') || (root.dataset.look && root.dataset.look !== 'a') || !probeGL()) return false;
  // the page's classes (they hide its own sky and grid, and re-lay some heroes) wait for the first frame, next to dim3-ready
  const cls = ['dim3-on', `dim3-${spec.name}`, 'has-world'];
  let timer = 0;
  const late = new Promise((_, rej) => { timer = setTimeout(() => rej(new Error(`not loaded in ${LOAD_MS / 1000} s`)), LOAD_MS); });
  const loaded = (p) => Promise.race([p, late]);
  const life = { dispose: null };
  const allowed = dimAllowed();   // the device tier (above), measured while three loads
  try {
    const [THREE, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }] = await loaded(Promise.all([
      import('three'),
      import('three/addons/postprocessing/EffectComposer.js'),
      import('three/addons/postprocessing/RenderPass.js'),
      import('three/addons/postprocessing/UnrealBloomPass.js'),
      import('three/addons/postprocessing/ShaderPass.js'),
      import('three/addons/postprocessing/OutputPass.js'),
    ]));
    if (!(await allowed)) { console.info(`[dim] ${spec.name} skipped on this device, the page keeps its world`, window.__dimTier); return false; }
    await build(THREE, { EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass }, spec, { lenis, onLost, cls, dbgOn: q.has('dimdbg'), loaded, life });
    return true;
  } catch (e) {
    console.warn(`[dim] ${spec.name} is off, the page keeps its world`, e);
    life.dispose?.();
    root.classList.remove(...cls, 'dim3-ready');
    document.querySelector('.dim3')?.remove();
    return false;
  } finally { clearTimeout(timer); }
}

async function build(THREE, P, spec, { lenis, onLost, cls, dbgOn, loaded, life }) {
  const root = document.documentElement;
  const coarse = matchMedia('(pointer: coarse)').matches;
  const phone = coarse || innerWidth < 760;
  const hover = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const maxDpr = phone ? 1 : 1.5;
  const acc = new THREE.Color(spec.accent);
  const CH = spec.chapters, NCH = CH.length;
  const card = spec.card || null;

  // the screens first: without them there is no work in the place
  const imgs = card ? await loaded(loadImages(card.shots)) : [];

  const wrap = document.createElement('div'); wrap.className = 'dim3'; wrap.setAttribute('aria-hidden', 'true');
  const canvas = document.createElement('canvas'); canvas.className = 'dim3__cv';
  const scrim = document.createElement('i'); scrim.className = 'dim3__scrim';
  wrap.append(canvas, scrim);
  document.body.prepend(wrap);

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: false, stencil: false, powerPreference: 'high-performance' });
  let dpr = Math.min(devicePixelRatio || 1, maxDpr);
  renderer.setPixelRatio(dpr);
  renderer.setSize(innerWidth, innerHeight, false);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = spec.exposure ?? 1.05;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  let shaderFailed = false;
  // a shader that does not compile: the old world instead (setting the hook silences three, so it logs here)
  renderer.debug.onShaderError = (gl, program, vs, fs) => {
    shaderFailed = true;
    console.warn('[dim] a shader did not compile', gl.getProgramInfoLog(program), gl.getShaderInfoLog(vs), gl.getShaderInfoLog(fs));
  };
  // half-float targets need a renderable float format; without one, 8-bit targets (less bloom range, but a picture)
  const floatRT = renderer.extensions.has('EXT_color_buffer_float') || renderer.extensions.has('EXT_color_buffer_half_float');
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());

  const scene = new THREE.Scene();
  const fogCol = new THREE.Color(spec.fog?.color ?? spec.base);
  scene.background = fogCol;
  scene.fog = new THREE.FogExp2(fogCol, spec.fog?.density ?? 0.01);

  /* lifecycle: one dispose for every way out (a failed build, a lost context, a failed shader, pagehide) */
  let alive = true, started = false, raf = 0, rsT = 0, env = {}, composer = null, rt = null, ro = null;
  const ac = new AbortController(), sig = { signal: ac.signal };
  function dispose() {
    if (!alive) return;
    alive = false; cancelAnimationFrame(raf); raf = 0; clearTimeout(rsT);
    ac.abort(); ro?.disconnect();
    scene.traverse((o) => { o.geometry?.dispose(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((x) => { for (const v of Object.values(x)) if (v?.isTexture) v.dispose(); for (const v of Object.values(x.uniforms || {})) if (v?.value?.isTexture) v.value.dispose(); x.dispose(); }); });
    env.dispose?.();
    if (composer) { for (const p of composer.passes) p.dispose?.(); composer.dispose(); }
    rt?.dispose(); renderer.dispose();
    if (!renderer.getContext().isContextLost()) renderer.forceContextLoss();
    wrap.remove();
  }
  life.dispose = dispose;
  // after the start the page gets its old world back; before it, the failed build hands back itself (startDim's catch)
  function handBack() { dispose(); root.classList.remove(...cls, 'dim3-ready'); onLost?.(); }
  canvas.addEventListener('webglcontextlost', (ev) => { ev.preventDefault(); if (started) handBack(); else dispose(); }, sig);
  const camera = new THREE.PerspectiveCamera(50, innerWidth / innerHeight, 0.1, 1500);
  const time = { value: 0 };
  const pointScale = { value: 600 };
  const V3 = (a) => new THREE.Vector3(...a);
  const st = { k: 0, c: 0, f: 0, t: 0, dt: 0, vel: 0, ie: 0 };
  const e = new THREE.Euler(), q2 = new THREE.Quaternion(), m4 = new THREE.Matrix4(), up = new THREE.Vector3(0, 1, 0);
  const R = Array.from({ length: 4096 }, (_, i) => Array.from({ length: 8 }, (__, k) => rnd(i + 1, k + 1)));
  const ctx = {
    THREE, scene, camera, renderer, time, acc, phone, aniso, pointScale, st, R, V3, root,
    fogU: () => THREE.UniformsUtils.clone(THREE.UniformsLib.fog),
    camPos: CH.map((c) => V3(c.cam.pos)),
    face(o, to, rx = 0, ry = 0, rz = 0) { m4.lookAt(to, o.p, up); o.q.setFromRotationMatrix(m4); if (rx || ry || rz) o.q.multiply(q2.setFromEuler(e.set(rx, ry, rz))); },
    yaw(o, a, rx = 0, rz = 0) { o.q.setFromEuler(e.set(rx, a, rz, 'YXZ')); },
  };

  /* the cards: one atlas of the real screens; body and glow are two instanced draws */
  let cards = null;
  if (card) {
    const N = phone ? card.n[1] : card.n[0];
    const cols = Math.min(4, imgs.length), rows = Math.ceil(imgs.length / cols);
    const cw = 512, chh = Math.round((512 * card.h) / card.w);
    const atlas = canvasTex(THREE, cw * cols, chh * rows, (g) => {
      g.fillStyle = '#000'; g.fillRect(0, 0, cw * cols, chh * rows);
      imgs.forEach((im, i) => {   // cover-fit each screen into its cell
        const x0 = (i % cols) * cw, y0 = Math.floor(i / cols) * chh;
        const s = Math.max(cw / im.width, chh / im.height), w = im.width * s, h = im.height * s;
        g.save(); g.beginPath(); g.rect(x0, y0, cw, chh); g.clip();
        g.drawImage(im, x0 + (cw - w) / 2, y0 + (chh - h) / 2, w, h); g.restore();
      });
    }, { aniso });
    atlas.generateMipmaps = true; atlas.minFilter = THREE.LinearMipmapLinearFilter;
    const cardGeo = new THREE.PlaneGeometry(card.w, card.h);
    const HALO = [card.w * 2.4, card.h * 1.7];
    const haloGeo = new THREE.PlaneGeometry(HALO[0], HALO[1]); haloGeo.translate(0, 0, -0.03);
    const inst = (n) => { const a = new THREE.InstancedBufferAttribute(new Float32Array(n), 1); a.setUsage(THREE.DynamicDrawUsage); return a; };
    const aCell = inst(N), aSeed = inst(N), aFade = inst(N), aFocus = inst(N);
    for (const [nm, a] of [['aCell', aCell], ['aSeed', aSeed], ['aFade', aFade], ['aFocus', aFocus]]) { cardGeo.setAttribute(nm, a); haloGeo.setAttribute(nm, a); }
    const u = { ...ctx.fogU(), uAtlas: { value: atlas }, uCells: { value: new THREE.Vector2(cols, rows) }, uSize: { value: new THREE.Vector2(card.w, card.h) },
      uR: { value: card.r }, uAcc: { value: acc }, uGeo: { value: new THREE.Vector2(...HALO) } };
    const body = new THREE.InstancedMesh(cardGeo, new THREE.ShaderMaterial({ vertexShader: CARD_VS, fragmentShader: CARD_FS, uniforms: u, fog: true,
      side: THREE.DoubleSide, transparent: true, depthWrite: true }), N);
    const halo = new THREE.InstancedMesh(haloGeo, new THREE.ShaderMaterial({ vertexShader: CARD_VS, fragmentShader: HALO_FS, uniforms: u, fog: true,
      side: THREE.DoubleSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }), N);
    for (const m of [body, halo]) { m.instanceMatrix.setUsage(THREE.DynamicDrawUsage); m.frustumCulled = false; }
    body.renderOrder = 2; halo.renderOrder = 3;
    scene.add(body, halo);
    cards = { N, n: imgs.length, body, halo, aCell, aSeed, aFade, aFocus, P: Array.from({ length: N }, () => new THREE.Vector3()),
      Q: Array.from({ length: N }, () => new THREE.Quaternion()), S: new Float32Array(N), F: new Float32Array(N), focus: new Float32Array(N),
      order: Array.from({ length: N }, (_, i) => i), dist: new Float32Array(N) };
    ctx.cards = cards;
  }

  /* the swarm: instanced blocks, each chapter one target shape; the morph runs on the GPU */
  let swarm = null;
  if (spec.swarm) {
    const n = phone ? spec.swarm.n[1] : spec.swarm.n[0];
    const geo = new THREE.InstancedBufferGeometry().copy(spec.swarm.geo ? spec.swarm.geo(THREE) : new THREE.BoxGeometry(1, 1, 1));
    geo.instanceCount = n;
    const at = (k) => { const a = new THREE.InstancedBufferAttribute(new Float32Array(n * k), k); a.setUsage(THREE.DynamicDrawUsage); return a; };
    const A = { aA: at(3), aB: at(3), aCA: at(4), aCB: at(4), aSA: at(1), aSB: at(1) };
    for (const [nm, a] of Object.entries(A)) geo.setAttribute(nm, a);
    const seed = new Float32Array(n); for (let i = 0; i < n; i++) seed[i] = rnd(i + 3, 11);
    geo.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 1));
    const u = { ...ctx.fogU(), uF: { value: 0 }, uT: time, uLift: { value: 0 }, uBreathe: { value: 0.04 }, uAcc: { value: acc },
      uKey: { value: V3(spec.swarm.key || [0.4, 1, 0.6]) }, uKeyCol: { value: new THREE.Color(spec.swarm.keyCol ?? 0xffffff) },
      uAmb: { value: new THREE.Color(spec.swarm.amb ?? 0x30343c) }, ...(spec.swarm.uniforms || {}) };
    const mesh = new THREE.Mesh(geo, new THREE.ShaderMaterial({ vertexShader: SWARM_VS, fragmentShader: swarmFS(spec.swarm.glsl, spec.swarm.head), uniforms: u, fog: true }));
    mesh.frustumCulled = false; mesh.renderOrder = 1;
    scene.add(mesh);
    swarm = { n, mesh, A, u, forms: null, pair: -1 };
    ctx.swarm = swarm;
  }

  env = (await spec.build?.(ctx)) || {};
  if (!alive) throw new Error('the context went away while building');
  if (swarm) swarm.forms = CH.map((c) => c.swarm(ctx));   // after the build: the shapes can sit on its geometry
  function setPair(c) {
    if (!swarm || swarm.pair === c) return;
    swarm.pair = c;
    const a = swarm.forms[c], b = swarm.forms[Math.min(c + 1, NCH - 1)], A = swarm.A;
    A.aA.array.set(a.p); A.aB.array.set(b.p); A.aCA.array.set(a.c); A.aCB.array.set(b.c); A.aSA.array.set(a.s); A.aSB.array.set(b.s);
    for (const x of Object.values(A)) x.needsUpdate = true;
    swarm.u.uLift.value = ((a.lift ?? 2) + (b.lift ?? 2)) / 2;
  }

  /* the camera path: chapter stops, and a via point halfway to the next */
  const portrait = () => innerWidth / innerHeight < 1;
  let curves = null;
  function makeCurves() {
    const pt = portrait(), ps = [], ts = [];
    CH.forEach((c, i) => {
      ps.push(V3(pt && c.cam.pp ? c.cam.pp : c.cam.pos)); ts.push(V3(pt && c.cam.tp ? c.cam.tp : c.cam.tgt));
      if (i < NCH - 1) {
        const v = c.via || [CH[i].cam.pos.map((x, j) => (x + CH[i + 1].cam.pos[j]) / 2), CH[i].cam.tgt.map((x, j) => (x + CH[i + 1].cam.tgt[j]) / 2)];
        ps.push(V3(v[0])); ts.push(V3(v[1]));
      }
    });
    curves = { p: new THREE.CatmullRomCurve3(ps, false, 'centripetal'), t: new THREE.CatmullRomCurve3(ts, false, 'centripetal') };
  }
  makeCurves();
  const fovFor = (v) => {   // keep the horizontal view on narrow screens
    const a = innerWidth / innerHeight;
    if (a >= 1.6) return v;
    const h = Math.tan((v * Math.PI) / 360) * 1.6;
    return Math.min(92, Math.max(v, (Math.atan((h * (a < 1 ? 0.62 : 0.9)) / a) * 360) / Math.PI));
  };

  /* post: bloom, then the cuts with grain and vignette, then tone mapping */
  rt = new THREE.WebGLRenderTarget(1, 1, { type: floatRT ? THREE.HalfFloatType : THREE.UnsignedByteType, samples: 0 });
  composer = new P.EffectComposer(renderer, rt);
  // the composer clones rt into renderTarget2, its first readBuffer: the RenderPass always draws into it (the buffers are
  // re-aligned after every frame). So only that one multisamples; rt holds post output only, at half the memory.
  composer.renderTarget2.samples = phone ? 0 : 2;
  const renderAll = (dt) => { composer.render(dt); if (composer.readBuffer !== composer.renderTarget2) composer.swapBuffers(); };
  composer.addPass(new P.RenderPass(scene, camera));
  const bl = spec.bloom || {};
  const bloom = new P.UnrealBloomPass(new THREE.Vector2(innerWidth, innerHeight), bl.strength ?? 0.6, bl.radius ?? 0.5, bl.threshold ?? 0.85);
  composer.addPass(bloom);
  if (!floatRT) for (const t of [bloom.renderTargetBright, ...bloom.renderTargetsHorizontal, ...bloom.renderTargetsVertical]) t.texture.type = THREE.UnsignedByteType;
  const cut =new P.ShaderPass({ ...TRANS, uniforms: THREE.UniformsUtils.clone(TRANS.uniforms) });
  cut.uniforms.uAcc.value = acc; cut.uniforms.uInk.value = new THREE.Color(spec.ink ?? spec.base).multiplyScalar(0.6);
  cut.uniforms.uRtl.value = getComputedStyle(root).direction === 'rtl' ? 1 : 0;
  composer.addPass(cut);
  composer.addPass(new P.OutputPass());

  /* scroll → chapter: k runs 0..NCH-1, holding each formation while its text is centred */
  let anchors = new Array(NCH).fill(0);
  const view = { w: innerWidth, h: innerHeight };   // the size the buffers and the anchors were made for
  function measure() {
    const vh = view.h, max = Math.max(1, root.scrollHeight - vh), gap = Math.min(1, max / NCH);
    anchors = CH.map((c) => clamp(c.at === 'top' ? 0 : c.at === 'end' ? max : typeof c.at === 'string' ? mid(c.at, vh) : c.at(vh, max), 0, max));
    for (let i = 1; i < NCH; i++) anchors[i] = Math.max(anchors[i], anchors[i - 1] + gap);
    // a short page: pushed past the end, the last chapters (and their cuts) could never be reached, so pull them back in
    for (let i = NCH - 1; i >= 0; i--) anchors[i] = Math.min(anchors[i], i === NCH - 1 ? max : anchors[i + 1] - gap);
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
  const scrollNow = () => (lenis ? lenis.scroll : scrollY);
  function resize() {
    const w = innerWidth, h = innerHeight;
    view.w = w; view.h = h;
    const px = Math.min(dpr, Math.sqrt(PX_BUDGET / (w * h)));
    renderer.setPixelRatio(px); renderer.setSize(w, h, false);
    composer.setPixelRatio(px); composer.setSize(w, h);
    camera.aspect = w / h;
    cut.uniforms.uAspect.value = camera.aspect;
    makeCurves(); measure();
  }
  const ptr = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPtr = (ev) => { ptr.x = (ev.clientX / innerWidth) * 2 - 1; ptr.y = (ev.clientY / innerHeight) * 2 - 1; };
  if (hover) addEventListener('pointermove', onPtr, { passive: true, ...sig });
  // resize: debounced; on a phone a height-only change under 150 px is the browser's toolbar sliding,
  // so nothing reallocates and the anchors stay (no false chapter cut)
  const onResize = () => {
    clearTimeout(rsT);
    rsT = setTimeout(() => { if (alive && !(coarse && innerWidth === view.w && Math.abs(innerHeight - view.h) < 150)) resize(); }, 150);
  };
  resize();
  addEventListener('resize', onResize, sig);
  ro = new ResizeObserver(() => measure()); ro.observe(document.body);
  addEventListener('load', measure, sig);

  /* the loop */
  let k = kOf(scrollNow()), lastIdx = Math.round(k), last = performance.now();
  const t0 = last;
  const cutS = { t: -10, dir: 1, kind: 0, dur: 0.8 };
  // a scene can cut the frame itself (the check's analysis starting, say): ctx.kick('scan'); never within CUT_GAP of the last
  ctx.kick = (name, dir = 1) => {
    if (time.value - cutS.t < CUT_GAP) return;
    const [kind, dur] = CUTS[name] || CUTS.glitch; Object.assign(cutS, { t: time.value, dir, kind, dur }); cut.uniforms.uSeed.value = Math.random();
  };
  let intro = k < 0.3 ? 0 : 1;
  const camP = new THREE.Vector3(), camT = new THREE.Vector3(), right = new THREE.Vector3(), camUp = new THREE.Vector3();
  const mtx = new THREE.Matrix4(), sc = new THREE.Vector3(), tmp2 = new THREE.Vector2();
  const OA = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, f: 1, lift: 0 }, OB = { p: new THREE.Vector3(), q: new THREE.Quaternion(), s: 1, f: 1, lift: 0 };
  const stats = { frames: 0, fps: 0, dpr, bloom: true, samples: [] };
  let govN = 0, govSum = 0, slowRuns = 0, lastF = performance.now(), fpsN = 0, fpsT = performance.now();
  const watch = dbgOn ? () => false : dimWatch();   // the device tier's last word: a phone that stays under 30 fps
  const introOff = V3(spec.intro || [0, 0, 0]);

  function frame(now) {
    if (!alive) return;
    if (shaderFailed) { handBack(); return; }   // a material compiled late (first drawn now) and failed
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    const t = (now - t0) / 1000;
    time.value = t;
    const kT = kOf(scrollNow());
    const kPrev = k; k = damp(k, kT, 3.6, dt);
    if (Math.abs(k - kT) < 1e-4) k = kT;
    st.vel = damp(st.vel, Math.abs(k - kPrev) / Math.max(dt, 1e-3), 6, dt);
    const idx = Math.round(k);
    if (idx !== lastIdx) {   // a boundary: the cut of the chapter on the far side of it (a fast fling crosses some uncut)
      if (t - cutS.t >= CUT_GAP) {
        const into = Math.max(idx, lastIdx);
        const [kind, dur] = CUTS[CH[into].cut || 'glitch'];
        Object.assign(cutS, { t, dir: idx > lastIdx ? 1 : -1, kind, dur });
        cut.uniforms.uSeed.value = Math.random();
      }
      lastIdx = idx;
    }
    if (intro < 1) intro = Math.min(1, intro + dt / 2.8);
    const ie = 1 - Math.pow(1 - intro, 3);
    const c = Math.min(Math.floor(k), NCH - 2), f = k - c, fe = sstep(0, 1, f);
    Object.assign(st, { k, c, f, t, dt, ie });

    // the camera on its spline
    const u = clamp(k / (NCH - 1));
    curves.p.getPoint(u, camP); curves.t.getPoint(u, camT);
    camera.fov = fovFor(lerp(CH[c].cam.fov, CH[c + 1].cam.fov, fe));
    camP.addScaledVector(introOff, 1 - ie);
    camP.x += Math.sin(t * 0.21) * 0.12; camP.y += Math.sin(t * 0.17 + 1) * 0.1;
    camera.position.copy(camP); camera.lookAt(camT);
    if (hover) {
      ptr.sx = damp(ptr.sx, ptr.x, 2.5, dt); ptr.sy = damp(ptr.sy, ptr.y, 2.5, dt);
      right.set(1, 0, 0).applyQuaternion(camera.quaternion); camUp.set(0, 1, 0).applyQuaternion(camera.quaternion);
      camera.position.addScaledVector(right, ptr.sx * (spec.parallax ?? 0.6)).addScaledVector(camUp, -ptr.sy * (spec.parallax ?? 0.6) * 0.5);
      camera.lookAt(camT);
    }
    camera.rotateZ(lerp(CH[c].cam.roll || 0, CH[c + 1].cam.roll || 0, fe));
    camera.updateProjectionMatrix();
    pointScale.value = (renderer.getDrawingBufferSize(tmp2).y * 0.5) / Math.tan((camera.fov * Math.PI) / 360);

    // the cards: formation c → c + 1, each card on its own beat, drawn far to near
    if (cards) {
      const C = cards;
      for (let i = 0; i < C.N; i++) {
        OA.s = OB.s = 1; OA.f = OB.f = 1; OA.lift = OB.lift = 2; OA.focus = OB.focus = 0;
        CH[c].cards(i, t, OA, ctx); CH[c + 1].cards(i, t, OB, ctx);
        const b = easeIO(clamp((f - 0.1 - R[i][7] * 0.28) / 0.52));
        C.P[i].lerpVectors(OA.p, OB.p, b);
        C.P[i].y += Math.sin(Math.PI * b) * lerp(OA.lift, OB.lift, 0.5);
        C.Q[i].slerpQuaternions(OA.q, OB.q, b);
        C.S[i] = lerp(OA.s, OB.s, b) * (0.2 + 0.8 * sstep((i / C.N) * 0.5, (i / C.N) * 0.5 + 0.5, ie));
        C.F[i] = lerp(OA.f, OB.f, b);
        C.focus[i] = lerp(OA.focus || 0, OB.focus || 0, b);
        C.dist[i] = C.P[i].distanceToSquared(camera.position);
      }
      C.order.sort((a, b) => C.dist[b] - C.dist[a]);
      for (let j = 0; j < C.N; j++) {
        const i = C.order[j];
        sc.setScalar(C.S[i]); mtx.compose(C.P[i], C.Q[i], sc);
        C.body.setMatrixAt(j, mtx); C.halo.setMatrixAt(j, mtx);
        C.aCell.array[j] = i % C.n; C.aSeed.array[j] = R[i][6]; C.aFade.array[j] = C.F[i]; C.aFocus.array[j] = C.focus[i];
      }
      C.body.instanceMatrix.needsUpdate = C.halo.instanceMatrix.needsUpdate = true;
      for (const a of [C.aCell, C.aSeed, C.aFade, C.aFocus]) a.needsUpdate = true;
    }
    if (swarm) { setPair(c); swarm.u.uF.value = f; }
    env.update?.(ctx);

    // the cut: its envelope, scaled by the scroll's speed; a fast scroll alone tears the frame a little
    const gp = (t - cutS.t) / cutS.dur;
    const envl = gp >= 0 && gp < 1 ? (gp < 0.12 ? gp / 0.12 : Math.exp(-(gp - 0.12) * 3.6)) : 0;
    const inCut = gp >= 0 && gp < 1;
    const U = cut.uniforms;
    U.uKind.value = inCut ? cutS.kind : 0;
    U.uP.value = inCut ? gp : -1;
    U.uDir.value = cutS.dir;
    U.uAmt.value = clamp(Math.max(envl * (0.7 + 0.6 * clamp(st.vel)), (st.vel - 0.35) * 0.5));
    U.uVel.value = clamp(st.vel); U.uTime.value = t;

    renderAll(dt);

    // the governor: steps the pixel ratio down (then the bloom off) if frames run long, two slow windows in a row
    stats.frames++; fpsN++;
    if (now - fpsT > 1000) { stats.fps = Math.round((fpsN * 1000) / (now - fpsT)); fpsN = 0; fpsT = now; }
    if (stats.frames > 150 && now - lastF < 100) { govN++; govSum += now - lastF; }
    if (stats.frames > 90 && watch(now - lastF)) { console.info(`[dim] ${spec.name} handed back: under 30 fps on this device`); handBack(); return; }
    lastF = now;
    if (govN >= 120 && !dbgOn) {
      const avg = govSum / govN; govN = 0; govSum = 0;
      stats.samples.push(Math.round(avg * 10) / 10);
      slowRuns = avg > 21 ? slowRuns + 1 : 0;
      if (slowRuns >= 2) {
        slowRuns = 0;
        const cur = Math.min(dpr, Math.sqrt(PX_BUDGET / (view.w * view.h)));   // from what is drawn, not a ratio above the budget
        if (cur > 0.75) { dpr = Math.max(0.75, cur - 0.25); stats.dpr = dpr; resize(); }
        else if (bloom.enabled) { bloom.enabled = false; stats.bloom = false; }
      }
    }
    if (stats.frames === 2) {   // the page steps aside only now that the place draws
      root.style.setProperty('--world-base', spec.base); root.style.setProperty('--world-accent', spec.accent);
      root.classList.add(...cls, 'dim3-ready');
    }
  }

  /* pause when hidden, dispose on the way out (dispose and the lost context are above) */
  const play = () => { if (!raf && alive && started && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const pause = () => { cancelAnimationFrame(raf); raf = 0; };
  const onVis = () => (document.hidden ? pause() : play());
  addEventListener('pagehide', (ev) => { if (ev.persisted) pause(); else dispose(); }, sig);
  addEventListener('pageshow', (ev) => { if (ev.persisted) play(); }, sig);
  document.addEventListener('visibilitychange', onVis, sig);

  // compileAsync resolves even when a shader fails, so one frame through the whole chain and the error flag decide
  try { await renderer.compileAsync(scene, camera); } catch { /* compiles on the first draw */ }
  if (!alive) throw new Error('the context went away while compiling');
  renderAll(0);
  if (shaderFailed) throw new Error('a shader did not compile');   // startDim's catch disposes
  started = true;
  play();
  window.__dim3 = { name: spec.name, stats, get k() { return k; }, anchors: () => anchors, dispose };
  if (dbgOn) Object.assign(window.__dim3, { ctx, bloom, renderer, composer, setDpr(v) { dpr = v; resize(); } });
}
