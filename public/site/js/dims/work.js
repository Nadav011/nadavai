// dims/work.js: the works index's dimension (2026-10-28). The page's flat world was a cloud of glowing tiles
// (js/worlds/w-work.js); the full version is a place: the gallery of worlds. A long dark hall with track lights on the
// ceiling, and down its inline-end side a row of doorways, one per work in page order. Each doorway looks into that
// project's own world (its real picture, with depth: the view through it shifts as the camera walks), and on a plinth
// at its threshold stands that world in miniature. The real phone screens float beside their doorway.
//
//   top        the entrance: the whole hall in perspective, every doorway faintly lit, the screens hanging in the air
//   SporChat   a night pitch, four floodlight masts, a ball in play     MediZen   teal glass panels and a heartbeat
//   Green Room a snooker lamp over felt                                 My Branch a storefront, lit at closing time
//   network    a map of branches, linked to the hub                     Neon Alley neon tubes down a wet alley
//   Hashmalka  a charger, its cable and the car                         flyers    three posters on easels
//   AutoCAD    a blueprint drawing itself
//   Nadav 2.0  the pixel pet, and its window of sessions
//   the list   the archive: nine small lit niches down both walls       end       the end door, open to the light
//
// The card crossing the middle of the screen is the doorway in front: it brightens, the camera turns to it, and the
// card itself takes the doorway's light. Two or three cards in one grid row take their turn in reading order.
// The DOM stays the page; core.js runs the camera, the cards, the cuts and every fallback.
import { startDim, TAU, clamp, lerp, sstep, rnd, canvasTex, loadImages, FOG_ADD, HASH } from './core.js';

const ACC = '#E8913C';
const NP = 10;                                            // doorways: the six featured works, then the four more
const PX = -6.2;                                          // the doorways' line, on the inline-end side of the hall
const ZP = (j) => -24 - j * 26 - (j >= 6 ? 8 : 0);        // a breath between the featured and the more
const HALL = { xl: -13, xr: 8.4, h: 10, z0: 46, z1: -382 };
const CY = [2.7, 3.3, 2.4, 3.0, 3.6, 1.7, 2.8, 3.4, 4.6, 2.6];
const FOV = [50, 50, 50, 50, 50, 54, 50, 50, 50, 50];
const DOOR = (j) => (j < 6 ? { W: 5, H: 7.4 } : { W: 4.4, H: 6.6 });
const STEP = 0.6;                                         // the doorway stands on a step
// each work: its light, its picture through the doorway (null: drawn here), and its phone screens beside it
const WORKS = [
  { col: '#8CC2FF', img: '/site/assets/work/world-sporchat-wide.webp' },
  { col: '#3FD6C2', img: '/site/assets/work/world-medizen-wide.webp' },
  { col: '#E7C47A', img: '/site/assets/work/world-greenroom-wide.webp' },
  { col: '#F0A048', img: '/site/assets/work/world-mexicani-wide.webp' },
  { col: '#FF7448', img: null },
  { col: '#FF4FB8', img: '/site/assets/work/neon-hero.webp' },
  { col: '#59E07E', img: '/site/assets/work/social-hashmalka.webp' },
  { col: '#FFC24A', img: '/site/assets/work/social-asian-bar.webp' },
  { col: '#5AA9FF', img: null },
  { col: '#F08A5D', img: '/site/assets/work/pet-hero.webp' },
];
const SHOTS = ['/site/assets/work/sporchat-room.webp', '/site/assets/work/sporchat-match.webp', '/site/assets/work/medizen-2.webp', '/site/assets/work/medizen-3.webp',
  '/site/assets/work/greenroom-home.webp', '/site/assets/work/greenroom-book.webp', '/site/assets/work/cash-day.webp', '/site/assets/work/cash-history.webp',
  '/site/assets/work/mexicani-cash.webp', '/site/assets/work/social-hashmalka.webp', '/site/assets/work/social-asian-bar.webp'];
const OWN = [0, 0, 1, 1, 2, 2, 3, 3, 4, 6, 7];             // whose doorway each screen stands by
const SIDE = [-1, 1, -1, 1, -1, 1, -1, 1, -1, -1, -1];

/* ── the doorways' places (pure maths, shared by the camera, the cards and the build) ── */
const DESK_ASP = 1.6;
const PORT = Array.from({ length: NP }, (_, j) => {
  const z = ZP(j), cx = 2.2 + (j % 2) * 0.7, cz = z + 16.5;
  const yaw = Math.atan2(cx - PX, cz - z);               // each doorway turns to the visitor walking up to it
  const c = Math.cos(yaw), s = Math.sin(yaw);
  const w = (lx, ly, lz) => [PX + lx * c + lz * s, ly, z - lx * s + lz * c];
  return { j, z, yaw, w, cam: [cx, CY[j], cz] };
});
/* a target that holds `p` at horizontal screen position ndcX (negative: the inline-end side of an RTL page, the left) */
function look(C, p, ndcX, fov, py = p[1]) {
  const dx = p[0] - C[0], dz = p[2] - C[2], d = Math.hypot(dx, dz);
  const a = Math.atan2(dx, -dz), hf = Math.atan(Math.tan((fov * Math.PI) / 360) * DESK_ASP);
  const yaw = a - Math.atan(ndcX * Math.tan(hf));
  return [C[0] + Math.sin(yaw) * d, py, C[2] - Math.cos(yaw) * d];
}

/* where a card's chapter sits: the moment it crosses the middle of the screen. Cards side by side in one grid row
   share the row's crossing, in reading order; a card the filter hides collapses into its neighbour. */
const workCards = () => [...document.querySelectorAll('.wi-feat > .wc, .wi-more > .wc')];
const cardAt = (i) => (vh) => {
  const el = workCards()[i];
  if (!el || el.classList.contains('is-out') || !el.offsetParent) return 0;
  const row = [...el.parentElement.children].filter((x) => !x.classList.contains('is-out') && x.offsetParent === el.offsetParent && Math.abs(x.offsetTop - el.offsetTop) < 6);
  const m = Math.max(1, row.length), ix = Math.max(0, row.indexOf(el));
  const h = Math.max(...row.map((x) => x.offsetHeight), el.offsetHeight);
  const top = el.offsetParent.getBoundingClientRect().top + scrollY + el.offsetTop;   // the reveal's transform left out
  return top + (h * (ix + 0.5)) / m - vh / 2;
};
const listAt = (vh) => {
  const s = document.querySelector('.wl')?.closest('.wi-sec');
  if (!s || s.hidden) return 0;
  const r = s.getBoundingClientRect();
  return r.top + scrollY + Math.min(r.height * 0.5, vh * 0.6) - vh / 2;
};

/* ── shaders ── */
const WIN_VS = /* glsl */`
varying vec3 vP;
#include <fog_pars_vertex>
void main(){ vP = position; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
// the view through a doorway: the picture hangs uD metres behind it, so it shifts with the camera like a real room
const WIN_FS = /* glsl */`
uniform sampler2D uMap; uniform float uHas, uF, uT, uD; uniform vec2 uWH, uPlane; uniform vec3 uCamL, uCol;
varying vec3 vP;
#include <fog_pars_fragment>
${HASH}
float sdArch(vec2 p){ float r = uWH.x * 0.5, yc = uWH.y - r; return p.y < yc ? max(abs(p.x) - r, -p.y) : length(vec2(p.x, p.y - yc)) - r; }
void main(){
  float d = sdArch(vP.xy);
  if (d > 0.0) discard;
  vec3 dir = vP - uCamL;
  float t = (-uD - vP.z) / min(dir.z, -0.001);
  vec2 h = vP.xy + dir.xy * t;
  vec2 uv = (h - vec2(-uPlane.x * 0.5, uWH.y * 0.55 - uPlane.y * 0.5)) / uPlane;
  vec3 img = texture2D(uMap, clamp(uv, vec2(0.002), vec2(0.998))).rgb;
  vec3 pro = uCol * (0.1 + 0.22 * n2(uv * 6.0 + uT * 0.05));
  vec3 col = mix(pro, img, uHas);
  float low = 1.0 - smoothstep(0.0, uWH.y * 0.5, vP.y);
  col = mix(col, uCol * 0.16, 0.06 + 0.2 * low);                    // a haze of the world's light, thicker low down
  col *= 0.22 + 0.95 * uF;
  float edge = exp(d * 5.0);
  col += uCol * edge * (0.08 + 0.32 * uF);
  col += uCol * exp(d * 1.2) * 0.03 * sin(uT * 0.8 + vP.y) * uF;      // the world breathing behind the door
  gl_FragColor = vec4(max(col, 0.0), 1.0);
  #include <fog_fragment>
}`;
const ADD_VS = /* glsl */`
varying vec2 vUv; varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
// a pool of a doorway's light on the floor
const POOL_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; varying vec2 vUv; varying vec3 vW;
#include <fog_pars_fragment>
void main(){ vec2 q = (vUv - vec2(0.5, 0.62)) * vec2(1.0, 1.35); float r = dot(q, q);
  gl_FragColor = vec4(uCol * (exp(-r * 9.0) * 0.8 + exp(-r * 40.0) * 0.6) * uI, 1.0);
  ${FOG_ADD}
}`;
// a pulse running along a tube (the heartbeat, the map's links, the charger's cable)
const PULSE_FS = /* glsl */`
uniform vec3 uCol; uniform float uT, uF, uSp, uLo; varying vec2 vUv; varying vec3 vW;
#include <fog_pars_fragment>
void main(){ float s = fract(uT * uSp - vUv.x); float g = exp(-s * 7.0);
  gl_FragColor = vec4(uCol * (uLo + 2.6 * g * (0.35 + uF)), 1.0);
  ${FOG_ADD}
}`;
// a beam from the ceiling onto a plinth (the services' foundry lamps, cooler)
const CONE_VS = /* glsl */`
uniform float uLen; varying vec3 vN, vV, vW; varying float vY;
#include <fog_pars_vertex>
void main(){ vY = -position.y / uLen; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp;
  vN = normalize(normalMatrix * normal); vV = -mvPosition.xyz; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const CONE_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; uniform float uTime; varying vec3 vN, vV, vW; varying float vY;
#include <fog_pars_fragment>
${HASH}
void main(){
  float core = pow(min(abs(dot(normalize(vN), normalize(vV))), 1.0), 1.6);
  float along = pow(clamp(1.0 - vY, 0.0, 1.0), 1.3) * smoothstep(0.0, 0.05, vY);
  float dust = 0.6 + 0.8 * n2(vW.xz * 0.3 + vec2(uTime * 0.06, vW.y * 0.2 - uTime * 0.05));
  gl_FragColor = vec4(uCol * core * along * dust * uI, 1.0);
  ${FOG_ADD}
}`;
// the blueprint, drawn as the scroll waits
const PRINT_FS = /* glsl */`
uniform sampler2D uMap; uniform float uT, uF; uniform vec3 uCol; varying vec2 vUv; varying vec3 vW;
#include <fog_pars_fragment>
void main(){ vec3 tx = texture2D(uMap, vUv).rgb; float lines = clamp((tx.r + tx.g + tx.b) / 3.0 * 1.6 - 0.25, 0.0, 1.0);
  float edge = fract(uT * 0.09) * 1.25 - 0.1; float drawn = smoothstep(edge + 0.02, edge - 0.02, vUv.x);
  float pen = exp(-abs(vUv.x - edge) * 70.0);
  vec3 col = vec3(0.02, 0.06, 0.14) + uCol * lines * (0.15 + drawn * (0.55 + 0.7 * uF)) + uCol * pen * lines * 2.0;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;
const DUST_VS = /* glsl */`
attribute vec4 aR; uniform float uTime, uScale, uZ; varying float vA;
#include <fog_pars_vertex>
void main(){
  vec3 p = vec3(mix(${HALL.xl.toFixed(1)}, ${HALL.xr.toFixed(1)}, aR.x), 0.4 + aR.y * 9.0, uZ - aR.z * 70.0 + 14.0);
  p += vec3(sin(uTime * 0.13 + aR.w * 40.0), sin(uTime * 0.09 + aR.x * 30.0) * 0.6, cos(uTime * 0.11 + aR.y * 20.0)) * 0.8;
  vA = 0.35 + 0.65 * fract(aR.w * 7.0);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = clamp(0.035 * uScale / -mvPosition.z, 1.0, 3.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const DUST_FS = /* glsl */`
varying float vA;
#include <fog_pars_fragment>
void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c); if (r > 0.25) discard;
  gl_FragColor = vec4(vec3(0.9, 0.85, 0.75) * 0.22 * vA * (1.0 - r * 4.0), 1.0);
  ${FOG_ADD}
}`;

/* ── canvases (drawn here, never generated) ── */
function drawFloor(g, W, H) {
  g.fillStyle = '#121418'; g.fillRect(0, 0, W, H);
  const n = 4, s = W / n;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const l = 16 + rnd(x + 3, y + 7) * 7;
    g.fillStyle = `rgb(${l},${l + 1},${l + 3})`; g.fillRect(x * s, y * s, s, s);
    for (let i = 0; i < 160; i++) { const a = Math.random() * 0.04; g.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a * 2})`; g.fillRect(x * s + Math.random() * s, y * s + Math.random() * s, 1 + Math.random() * 20, 1); }
    g.strokeStyle = 'rgba(0,0,0,.75)'; g.lineWidth = 2; g.strokeRect(x * s + 1, y * s + 1, s - 2, s - 2);
  }
}
function drawGlow(g, W, H) {
  const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.15, 'rgba(220,235,255,.5)'); gr.addColorStop(0.5, 'rgba(160,200,255,.1)'); gr.addColorStop(1, 'rgba(140,180,255,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
function drawPitch(g, W, H) {
  for (let i = 0; i < 10; i++) { g.fillStyle = i % 2 ? '#1c5a2a' : '#215f2f'; g.fillRect((i * W) / 10, 0, W / 10, H); }
  g.strokeStyle = 'rgba(255,255,255,.85)'; g.lineWidth = 3;
  const m = 14; g.strokeRect(m, m, W - 2 * m, H - 2 * m);
  g.beginPath(); g.moveTo(W / 2, m); g.lineTo(W / 2, H - m); g.stroke();
  g.beginPath(); g.arc(W / 2, H / 2, H * 0.16, 0, TAU); g.stroke();
  for (const x of [m, W - m]) { const d = x === m ? 1 : -1; g.strokeRect(Math.min(x, x + d * W * 0.14), H * 0.25, W * 0.14, H * 0.5); g.strokeRect(Math.min(x, x + d * W * 0.05), H * 0.38, W * 0.05, H * 0.24); }
}
function drawMap(g, W, H) {
  g.fillStyle = '#0a0f19'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(40,90,140,.5)'; g.lineWidth = 18; g.beginPath(); g.moveTo(0, H * 0.7);
  g.bezierCurveTo(W * 0.3, H * 0.55, W * 0.6, H * 0.95, W, H * 0.62); g.stroke();   // a river
  for (let i = 0; i < 46; i++) {                                                       // the streets
    const hz = i % 2, p = rnd(i, 3) * (hz ? H : W), w = 1 + rnd(i, 4) * 3.5;
    g.strokeStyle = `rgba(150,170,200,${0.12 + rnd(i, 5) * 0.2})`; g.lineWidth = w; g.beginPath();
    if (hz) { g.moveTo(0, p); g.lineTo(W, p + (rnd(i, 6) - 0.5) * 120); } else { g.moveTo(p, 0); g.lineTo(p + (rnd(i, 6) - 0.5) * 120, H); }
    g.stroke();
  }
}
function drawNetwork(g, W, H) {                                                          // the network's doorway: the country at night
  drawMap(g, W, H);
  const gr = g.createRadialGradient(W * 0.5, H * 0.5, 0, W * 0.5, H * 0.5, W * 0.6); gr.addColorStop(0, 'rgba(255,116,72,.18)'); gr.addColorStop(1, 'rgba(0,0,0,.5)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  for (let i = 0; i < 18; i++) {
    const x = W * (0.12 + rnd(i, 8) * 0.76), y = H * (0.12 + rnd(i, 9) * 0.76);
    const r = g.createRadialGradient(x, y, 0, x, y, 26); r.addColorStop(0, 'rgba(255,190,140,1)'); r.addColorStop(0.2, 'rgba(255,116,72,.8)'); r.addColorStop(1, 'rgba(255,116,72,0)');
    g.fillStyle = r; g.fillRect(x - 26, y - 26, 52, 52);
    g.strokeStyle = 'rgba(255,140,90,.28)'; g.lineWidth = 2; g.beginPath(); g.moveTo(W / 2, H / 2); g.lineTo(x, y); g.stroke();
  }
}
function drawPlan(g, W, H) {                                                             // a floor plan, rooms and their sizes
  g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
  g.strokeStyle = 'rgba(255,255,255,.12)'; g.lineWidth = 1;
  for (let x = 0; x < W; x += 24) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, H); g.stroke(); }
  for (let y = 0; y < H; y += 24) { g.beginPath(); g.moveTo(0, y); g.lineTo(W, y); g.stroke(); }
  g.strokeStyle = '#fff'; g.lineWidth = 5;
  const R = [[0.06, 0.1, 0.36, 0.5], [0.42, 0.1, 0.24, 0.32], [0.66, 0.1, 0.28, 0.5], [0.42, 0.42, 0.24, 0.18], [0.06, 0.6, 0.5, 0.3], [0.56, 0.6, 0.38, 0.3]];
  for (const [x, y, w, h] of R) g.strokeRect(x * W, y * H, w * W, h * H);
  g.lineWidth = 2;
  for (const [x, y, w] of R) { g.beginPath(); g.moveTo(x * W, (y - 0.04) * H); g.lineTo((x + w) * W, (y - 0.04) * H); g.stroke(); }
  for (const [x, y, r] of [[0.42, 0.3, 0.07], [0.66, 0.5, 0.06], [0.2, 0.6, 0.07]]) { g.beginPath(); g.arc(x * W, y * H, r * W, 0, Math.PI / 2); g.stroke(); }
}
function drawPrint(g, W, H) {                                                           // the AutoCAD doorway: a lit drafting sheet
  g.fillStyle = '#071a38'; g.fillRect(0, 0, W, H);
  g.globalAlpha = 0.55; drawPlan(g, W, H); g.globalAlpha = 1;
  g.globalCompositeOperation = 'multiply'; g.fillStyle = '#5aa9ff'; g.fillRect(0, 0, W, H); g.globalCompositeOperation = 'source-over';
}
function drawShop(g, W, H) {                                                             // the storefront's window, from outside
  const gr = g.createLinearGradient(0, 0, 0, H); gr.addColorStop(0, '#ffcf8a'); gr.addColorStop(1, '#c4621e');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(60,24,6,.75)';
  for (let i = 0; i < 3; i++) g.fillRect(0, H * (0.18 + i * 0.2), W, 5);
  for (let i = 0; i < 26; i++) g.fillRect(rnd(i, 1) * W, H * (0.06 + Math.floor(rnd(i, 2) * 3) * 0.2), 10 + rnd(i, 3) * 18, H * 0.11);
  g.fillStyle = 'rgba(40,14,2,.85)'; g.fillRect(0, H * 0.72, W, H * 0.28);
  g.fillRect(W * 0.62, H * 0.5, W * 0.12, H * 0.22);
}
function drawAwning(g, W, H) { for (let i = 0; i < 12; i++) { g.fillStyle = i % 2 ? '#1a120c' : '#c9782e'; g.fillRect((i * W) / 12, 0, W / 12, H); } }
function drawPanel(g, W, H) {                                                            // Nadav 2.0's window: a list of sessions
  g.fillStyle = '#f4f1ee'; g.beginPath(); g.roundRect(4, 4, W - 8, H - 8, 26); g.fill();
  const C = ['#3b82f6', '#22c55e', '#9ca3af', '#9ca3af', '#f59e0b'];
  C.forEach((c, i) => {
    const y = 40 + i * ((H - 70) / 5);
    g.fillStyle = c; g.beginPath(); g.arc(36, y + 10, 9, 0, TAU); g.fill();
    g.fillStyle = 'rgba(30,30,40,.7)'; g.fillRect(58, y + 4, W * (0.35 + rnd(i, 4) * 0.25), 12);
    g.fillStyle = 'rgba(30,30,40,.3)'; g.fillRect(W - 90, y + 4, 56, 12);
  });
}
const PET = [                                                                            // the pixel pet, from its own picture
  '..##.....',
  '.######..',
  '########.',
  '#.###.###',
  '#########',
  '.#######.',
  '.#.#.#.#.',
];

/* ── start ── */
export function initDim(opts) {
  const P = {};
  const portalCam = (j) => {
    const p = PORT[j], C = p.cam, focus = p.w(0, STEP + DOOR(j).H * 0.48, 0);
    return {
      pos: C, tgt: look(C, focus, -0.64, FOV[j], 3.5 + (CY[j] - 3) * 0.35), fov: FOV[j], roll: j === 5 ? 0.04 : (j % 2 ? 0.015 : -0.015),
      pp: p.w(0.2, CY[j] + 0.6, 10.2), tp: p.w(0, STEP + DOOR(j).H * 0.42, 0),
    };
  };
  const CUT = ['warp', 'scan', 'fold', 'glitch', 'scan', 'warp', 'ink', 'scan', 'glitch', 'scan'];
  const chapters = [
    { at: 'top', cam: { pos: [1.4, 3.3, 14], tgt: [-6.5, 3.2, -30], fov: 52, pp: [-0.6, 3.4, 18], tp: [-4.6, 3.6, -24] }, via: [[1.6, 3.2, 3], [-3.5, 3.6, -26]] },
    ...PORT.map((p, j) => {
      const zm = j < NP - 1 ? (p.z + ZP(j + 1)) / 2 : 0;
      return { at: cardAt(j), cam: portalCam(j), cut: CUT[j],
        via: j < NP - 1 ? [[1.0, 3.0 + (j === 5 ? 1.6 : 0), zm + 12], [-2.5, 3.4, zm - 16]] : [[1.2, 5.2, -300], [-1, 3.8, -330]] };
    }),
    { at: listAt, cam: { pos: [0.6, 7.6, -288], tgt: [-1.2, 2.2, -340], fov: 52, roll: -0.02, pp: [0, 8, -282], tp: [-0.5, 2.5, -340] }, via: [[0.6, 5.4, -318], [0, 4.2, -370]], cut: 'ink' },
    { at: (vh, max) => { const e = document.querySelector('.wkn'); if (!e) return max; const r = e.getBoundingClientRect(); return r.top + scrollY + r.height / 2 - vh * 0.42; }, cam: { pos: [1.6, 3.0, -348], tgt: look([1.6, 3.0, -348], [-0.6, 4.6, -381], -0.5, 54), fov: 54, pp: [-0.3, 3.4, -342], tp: [-0.6, 4.8, -380] }, cut: 'warp' },
  ];

  /* the cards: the real phone screens, each beside its own doorway; the doorway in front brings its screens forward */
  const byDoor = (i, t, o, ctx, near) => {
    const p = PORT[OWN[i]], sd = SIDE[i], b = Math.sin(t * 0.7 + i * 1.9) * 0.08;
    const [x, y, z] = near ? p.w(sd * (sd < 0 ? 2.9 : 3.2), (sd < 0 ? 4.4 : 3.4) + b, sd < 0 ? 2.2 : 2.4) : p.w(sd * 3.5, (sd < 0 ? 4.6 : 3.8) + b, sd < 0 ? 0.4 : 1.0);
    o.p.set(x, y, z);
    const C = p.cam; P.v ??= new ctx.THREE.Vector3();
    ctx.face(o, P.v.set(C[0], C[1], C[2]), 0, sd * (near ? 0.05 : 0.18), Math.sin(t * 0.5 + i) * 0.02);
    o.s = near ? 1 : 0.72; o.f = near ? 1 : 0.5; o.focus = near ? 1 : 0; o.lift = 1.2;
  };
  const cardForms = [
    (i, t, o, ctx) => { const r = ctx.R[i];   // the entrance: the screens hang in the air ahead, on the doorways' side
      o.p.set(-1.5 - r[0] * 6.5, 2.6 + r[1] * 4.2 + Math.sin(t * 0.6 + i) * 0.12, 6 - i * 3.1 - r[2] * 2);
      ctx.face(o, ctx.camPos[0], 0, (r[3] - 0.5) * 0.5, (r[4] - 0.5) * 0.1); o.s = 0.75; o.f = 0.85; o.lift = 1.5; },
    ...PORT.map((p, j) => (i, t, o, ctx) => byDoor(i, t, o, ctx, OWN[i] === j)),
    (i, t, o, ctx) => { const sd = i % 2 ? 1 : -1;   // the archive: the screens line the ceiling over the niches
      o.p.set(sd < 0 ? -5 : 3.6, 7.2 + Math.sin(t * 0.5 + i) * 0.1, -304 - (i >> 1) * 8 - (i % 2) * 3);
      ctx.face(o, ctx.camPos[NP + 1], 0, 0, 0); o.s = 0.75; o.f = 0.8; o.lift = 2; },
    (i, t, o, ctx) => { const a = Math.PI * (0.1 + (0.8 * i) / 10);   // the end: an arch of every screen over the door
      o.p.set(-0.6 + Math.cos(a) * 7.4, 4.4 + Math.sin(a) * 5.6 + Math.sin(t * 0.6 + i) * 0.06, -368);
      ctx.face(o, ctx.camPos[NP + 2]); o.s = 0.8; o.f = 0.95; o.focus = 0.4; o.lift = 2; },
  ];
  chapters.forEach((c, i) => { c.cards = cardForms[i]; });

  const spec = {
    name: 'work', base: '#07090C', accent: ACC, ink: '#020305',
    fog: { color: 0x07090c, density: 0.017 }, exposure: 1.0, bloom: { strength: 0.72, radius: 0.55, threshold: 0.8 },
    intro: [0, -0.8, 14], parallax: 0.5,
    card: { shots: SHOTS, w: 1.5, h: 3.25, r: 0.2, n: [SHOTS.length, SHOTS.length] },
    chapters,
    async build(ctx) {
      const { THREE, scene, time, phone, aniso, fogU } = ctx;
      const C3 = (hex, k = 1) => new THREE.Color(hex).multiplyScalar(k);
      scene.add(new THREE.HemisphereLight(0x55606f, 0x0c0d10, 0.75));
      const key = new THREE.PointLight(0xffffff, 140, 32, 1.6); scene.add(key);
      const fill = new THREE.PointLight(0xffe2c0, 40, 26, 1.6); scene.add(fill);

      /* the hall: a polished floor, two walls, a ceiling with beams and two track lights running its length */
      const L = HALL.z0 - HALL.z1, zc = (HALL.z0 + HALL.z1) / 2, Wd = HALL.xr - HALL.xl, xc = (HALL.xr + HALL.xl) / 2;
      const ftex = canvasTex(THREE, 1024, 1024, drawFloor, { repeat: true, aniso });
      ftex.repeat.set(Wd / 8, L / 8);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(Wd, L), new THREE.MeshStandardMaterial({ map: ftex, roughness: 0.38, metalness: 0.3, color: 0xa0a4ac }));
      floor.rotation.x = -Math.PI / 2; floor.position.set(xc, 0, zc); scene.add(floor);
      const wallMat = new THREE.MeshStandardMaterial({ color: 0x15171b, roughness: 0.85, metalness: 0.1 });
      for (const [x, ry] of [[HALL.xl, Math.PI / 2], [HALL.xr, -Math.PI / 2]]) {
        const w = new THREE.Mesh(new THREE.PlaneGeometry(L, HALL.h), wallMat); w.rotation.y = ry; w.position.set(x, HALL.h / 2, zc); scene.add(w);
      }
      const ceil = new THREE.Mesh(new THREE.PlaneGeometry(Wd, L), new THREE.MeshBasicMaterial({ color: 0x050608 }));
      ceil.rotation.x = Math.PI / 2; ceil.position.set(xc, HALL.h, zc); scene.add(ceil);
      const steel = new THREE.MeshStandardMaterial({ color: 0x1d2128, roughness: 0.55, metalness: 0.6 });
      const spans = Math.floor(L / 9), m = new THREE.Matrix4();
      const beams = new THREE.InstancedMesh(new THREE.BoxGeometry(Wd, 0.45, 0.4), steel, spans);
      const piers = new THREE.InstancedMesh(new THREE.BoxGeometry(0.7, HALL.h, 0.7), steel, spans * 2);
      for (let i = 0; i < spans; i++) {
        const z = HALL.z0 - 4 - i * 9;
        beams.setMatrixAt(i, m.makeTranslation(xc, HALL.h - 0.25, z));
        piers.setMatrixAt(i * 2, m.makeTranslation(HALL.xr - 0.35, HALL.h / 2, z)); piers.setMatrixAt(i * 2 + 1, m.makeTranslation(HALL.xl + 0.35, HALL.h / 2, z));
      }
      scene.add(beams, piers);
      const track = new THREE.MeshBasicMaterial({ color: new THREE.Color(1.5, 1.42, 1.3) });
      for (const x of [-2.2, 3.4]) { const s = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, L), track); s.position.set(x, HALL.h - 0.55, zc); scene.add(s); }
      // the skirting light along the doorways' wall
      const skirt = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, L), new THREE.MeshBasicMaterial({ color: C3(ACC, 0.9) }));
      skirt.position.set(HALL.xl + 0.1, 0.06, zc); scene.add(skirt);

      /* shared pieces */
      const glareTex = canvasTex(THREE, 128, 128, drawGlow, { srgb: false });
      const stone = new THREE.MeshStandardMaterial({ color: 0x1b1d22, roughness: 0.5, metalness: 0.45 });
      const dark = new THREE.MeshStandardMaterial({ color: 0x24272d, roughness: 0.6, metalness: 0.3 });
      const addMat = (fs, u) => new THREE.ShaderMaterial({ vertexShader: ADD_VS, fragmentShader: fs, uniforms: { ...fogU(), ...u }, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
      const mesh = (geo, mat, x = 0, y = 0, z = 0, parent) => { const o = new THREE.Mesh(geo, mat); o.position.set(x, y, z); parent?.add(o); return o; };
      const box = (w, h, d, mat, x, y, z, parent) => mesh(new THREE.BoxGeometry(w, h, d), mat, x, y, z, parent);
      const tube = (pts, r, mat, parent, seg = 64) => { const o = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts.map((p) => new THREE.Vector3(...p))), seg, r, 6, false), mat); parent?.add(o); return o; };
      const archPts = (ri, H, n = 40) => {
        const yc = H - ri, out = [];
        for (let i = 0; i <= 6; i++) out.push([-ri, (yc * i) / 6, 0]);
        for (let i = 1; i < n; i++) { const a = Math.PI - (Math.PI * i) / n; out.push([Math.cos(a) * ri, yc + Math.sin(a) * ri, 0]); }
        for (let i = 6; i >= 0; i--) out.push([ri, (yc * i) / 6, 0]);
        return out;
      };
      const archShape = (ri, H, ro, Ho) => {
        const s = new THREE.Shape(), yc = H - ri;
        s.moveTo(-ro, 0); s.lineTo(-ro, yc); s.absarc(0, yc, ro, Math.PI, 0, true); s.lineTo(ro, 0); s.lineTo(-ro, 0);
        const h = new THREE.Path(); h.moveTo(-ri, 0); h.lineTo(-ri, yc); h.absarc(0, yc, ri, Math.PI, 0, true); h.lineTo(ri, 0); h.lineTo(-ri, 0);
        s.holes.push(h); return s;
      };
      const texLoad = (src, max = 1024) => loadImages([src]).then(([im]) => {
        const s = Math.min(1, max / Math.max(im.width, im.height));
        const t = canvasTex(THREE, Math.round(im.width * s), Math.round(im.height * s), (g, W, H) => g.drawImage(im, 0, 0, W, H), { aniso });
        t.generateMipmaps = true; t.minFilter = THREE.LinearMipmapLinearFilter; t.userData.asp = im.width / im.height;
        return t;
      });

      /* the doorways */
      const doors = [];
      const glowOf = (list, mat, base, k0, k1) => { list.push({ mat, base: base.clone(), k0, k1 }); return mat; };
      for (let j = 0; j < NP; j++) {
        const p = PORT[j], { W, H } = DOOR(j), col = new THREE.Color(WORKS[j].col), ri = W / 2, glows = [];
        const g = new THREE.Group(); g.position.set(PX, 0, p.z); g.rotation.y = p.yaw; scene.add(g);
        // the step, the frame (stone, extruded) and the line of the world's light round its opening
        box(W + 2.4, STEP, 2.2, stone, 0, STEP / 2, 0.2, g);
        const frame = new THREE.Mesh(new THREE.ExtrudeGeometry(archShape(ri, H, ri + 0.55, H + 0.55), { depth: 0.7, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.05, bevelSegments: 1, curveSegments: 28 }), stone);
        frame.position.set(0, STEP, -0.35); g.add(frame);
        const lineMat = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), col, 0.8, 2.2);
        const ln = tube(archPts(ri - 0.04, H - 0.04), 0.045, lineMat, g, 96); ln.position.set(0, STEP, 0.42);
        // the view through it
        const win = new THREE.Mesh(new THREE.PlaneGeometry(W, H).translate(0, H / 2, 0), new THREE.ShaderMaterial({ vertexShader: WIN_VS, fragmentShader: WIN_FS, fog: true,
          uniforms: { ...fogU(), uMap: { value: null }, uHas: { value: 0 }, uF: { value: 0 }, uT: time, uD: { value: 7 }, uWH: { value: new THREE.Vector2(W, H) },
            uPlane: { value: new THREE.Vector2(W * 2.6, H * 1.7) }, uCamL: { value: new THREE.Vector3(0, H / 2, 10) }, uCol: { value: col } } }));
        win.position.set(0, STEP, 0); g.add(win);
        const fit = (asp) => { const rw = W * 2.6, rh = H * 1.7; win.material.uniforms.uPlane.value.set(asp > rw / rh ? rh * asp : rw, asp > rw / rh ? rh : rw / asp); };
        const setMap = (t) => { win.material.uniforms.uMap.value = t; win.material.uniforms.uHas.value = 1; fit(t.userData.asp || t.image.width / t.image.height); };
        if (j === 4) { const t = canvasTex(THREE, 1024, 1024, drawNetwork, { aniso }); t.userData.asp = 1; setMap(t); }
        else if (j === 8) {
          const t = canvasTex(THREE, 1200, 800, drawPrint, { aniso }); t.userData.asp = 1.5; setMap(t);
          loadImages(['/site/assets/work/autocad-plan.webp']).then(([im]) => {   // the tool's own output, pinned on the sheet
            const g2 = t.image.getContext('2d'), w = 1200 * 0.86, h = (w * im.height) / im.width;
            g2.globalCompositeOperation = 'screen'; g2.drawImage(im, 600 - w / 2, 400 - h / 2, w, h); g2.globalCompositeOperation = 'source-over'; t.needsUpdate = true;
          }).catch(() => {});
        } else texLoad(WORKS[j].img).then(setMap).catch(() => {});
        // the plinth with the world in miniature, its pool of light, and the beam from the ceiling
        const plinth = mesh(new THREE.CylinderGeometry(1.9, 2.05, 1.0, 40), stone, 0, 0.5, 3.2, g);
        const ringMat = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), col, 0.4, 2.2);
        const ring = mesh(new THREE.TorusGeometry(1.92, 0.025, 6, 80), ringMat, 0, 1.0, 3.2, g); ring.rotation.x = Math.PI / 2;
        const mini = new THREE.Group(); mini.position.set(0, 1.0, 3.2); g.add(mini);
        const poolU = { uCol: { value: col }, uI: { value: 0.1 } };
        const pool = mesh(new THREE.PlaneGeometry(10, 10), addMat(POOL_FS, poolU), 0, 0.02, 3.4, g); pool.rotation.x = -Math.PI / 2; pool.renderOrder = 4;
        const len = HALL.h - 1.0;
        const cg = new THREE.ConeGeometry(2.4, len, 28, 1, true); cg.translate(0, -len / 2, 0);
        const coneU = { ...fogU(), uLen: { value: len }, uCol: { value: col.clone().lerp(new THREE.Color(1, 1, 1), 0.5) }, uI: { value: 0.08 }, uTime: time };
        const cone = mesh(cg, new THREE.ShaderMaterial({ vertexShader: CONE_VS, fragmentShader: CONE_FS, uniforms: coneU, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), 0, HALL.h, 3.2, g);
        cone.renderOrder = 5;
        const tick = MINI[j]({ THREE, g: mini, col, glows, glowOf, box, mesh, tube, dark, stone, addMat, glareTex, time, aniso, C3, texLoad, fogU });
        doors.push({ j, g, win, glows, poolU, coneU, tick, f: 0, col });
      }

      /* the archive: nine small lit niches down both walls, one per short entry */
      const niches = [];
      {
        const shape = archShape(0.75, 2.3, 1.05, 2.6);
        const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.4, bevelEnabled: false, curveSegments: 16 });
        const lgeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(archPts(0.72, 2.27, 20).map((q) => new THREE.Vector3(...q))), 48, 0.03, 5, false);
        const inGeo = new THREE.PlaneGeometry(1.5, 2.3).translate(0, 1.15, 0);
        for (let i = 0; i < 9; i++) {
          const left = i % 2 === 0, z = -302 - i * 4.6;
          const g = new THREE.Group(); g.position.set(left ? HALL.xl + 0.05 : HALL.xr - 0.05, 0.8, z); g.rotation.y = left ? Math.PI / 2 : -Math.PI / 2; scene.add(g);
          mesh(geo, stone, 0, 0, 0, g);
          const c = new THREE.Color(ACC).lerp(new THREE.Color(WORKS[i].col), 0.35);
          const lm = new THREE.MeshBasicMaterial({ color: c.clone() }); mesh(lgeo, lm, 0, 0, 0.42, g);
          const im = new THREE.MeshBasicMaterial({ color: c.clone().multiplyScalar(0.1), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
          mesh(inGeo, im, 0, 0, 0.05, g);
          niches.push({ lm, im, c });
        }
      }
      /* the end door: a great arch in the end wall, open to a warm light that comes up at the end of the page */
      {
        const endWall = new THREE.Mesh(new THREE.ShapeGeometry(archShape(4.4, 9.2, 30, 30)), wallMat);
        endWall.position.set(-0.6, 0, -381); scene.add(endWall);
        const fr = new THREE.Mesh(new THREE.ExtrudeGeometry(archShape(4.4, 9.2, 5.1, 9.9), { depth: 0.9, bevelEnabled: false, curveSegments: 32 }), stone);
        fr.position.set(-0.6, 0, -381.5); scene.add(fr);
        const lightMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0), fog: false });
        const out = new THREE.Mesh(new THREE.ShapeGeometry((() => { const s = new THREE.Shape(); s.moveTo(-4.4, 0); s.lineTo(-4.4, 4.8); s.absarc(0, 4.8, 4.4, Math.PI, 0, true); s.lineTo(4.4, 0); s.lineTo(-4.4, 0); return s; })()), lightMat);
        out.position.set(-0.6, 0, -381.6); scene.add(out);
        const em = new THREE.MeshBasicMaterial({ color: C3(ACC, 0.3) }); const el = tube(archPts(4.3, 9.1, 40), 0.06, em, scene, 96); el.position.set(-0.6, 0, -380.5);
        const poolU = { uCol: { value: new THREE.Color(ACC) }, uI: { value: 0 } };
        const pool = mesh(new THREE.PlaneGeometry(16, 22), addMat(POOL_FS, poolU), -0.6, 0.02, -372, scene); pool.rotation.x = -Math.PI / 2; pool.renderOrder = 4;
        Object.assign(P, { endLight: lightMat, endLine: em, endPool: poolU });
      }

      /* dust in the air round the camera */
      const nd = phone ? 380 : 900;
      const ar = new Float32Array(nd * 4); for (let i = 0; i < nd * 4; i++) ar[i] = Math.random();
      const dg = new THREE.BufferGeometry(); dg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(nd * 3), 3)); dg.setAttribute('aR', new THREE.BufferAttribute(ar, 4));
      const dustU = { ...fogU(), uTime: time, uScale: ctx.pointScale, uZ: { value: 0 } };
      const dust = new THREE.Points(dg, new THREE.ShaderMaterial({ vertexShader: DUST_VS, fragmentShader: DUST_FS, uniforms: dustU, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      dust.frustumCulled = false; dust.renderOrder = 6; scene.add(dust);

      /* the page's cards take the light of their doorway */
      const els = workCards();
      els.forEach((el, i) => { if (WORKS[i]) el.style.setProperty('--lit', WORKS[i].col); });
      let litIdx = -1;
      const setLit = (i) => { if (i === litIdx) return; els[litIdx]?.classList.remove('is-lit'); litIdx = i; els[i]?.classList.add('is-lit'); };

      scene.updateMatrixWorld(true);
      const camL = new THREE.Vector3(), tmpC = new THREE.Color();
      return {
        update(c) {
          const { k, t } = c.st, cam = c.camera.position;
          const atDoors = 1 - sstep(NP + 0.2, NP + 0.9, k);
          let best = -1, bestF = 0;
          for (const d of doors) {
            const near = Math.exp(-((k - (d.j + 1)) * (k - (d.j + 1))) * 4.5);
            const out = !!(els[d.j] && els[d.j].classList.contains('is-out'));
            const f = (0.14 + 0.3 * (1 - sstep(0.2, 1, k)) + 0.86 * near * atDoors) * (out ? 0.35 : 1);
            d.f = f;
            const z = PORT[d.j].z;
            d.g.visible = z < cam.z + 16 && z > cam.z - 120;
            if (!d.g.visible) continue;
            if (near > bestF) { bestF = near; best = d.j; }
            d.win.material.uniforms.uF.value = f;
            d.win.worldToLocal(camL.copy(cam)); d.win.material.uniforms.uCamL.value.copy(camL);
            for (const gl of d.glows) gl.mat.color.copy(gl.base).multiplyScalar(gl.k0 + gl.k1 * f);
            d.poolU.uI.value = 0.05 + 0.32 * f; d.coneU.uI.value = 0.04 + 0.14 * f;
            d.tick?.(t, f);
          }
          // the key light stands at the doorway in front, in its colour
          if (best >= 0) {
            const p = PORT[best], [x, y, z] = p.w(0, 5.2, 6.5);
            key.position.set(x, y, z); key.color.copy(doors[best].col).lerp(tmpC.set(1, 1, 1), 0.45); key.intensity = 30 + 150 * bestF * atDoors;
          }
          fill.position.set(cam.x + 1, cam.y + 2.5, cam.z - 6);
          setLit(bestF > 0.55 && atDoors > 0.5 ? best : -1);
          // the archive and the end door
          const arc = sstep(NP + 0.3, NP + 1, k) * (1 - 0.6 * sstep(NP + 1.6, NP + 2, k));
          niches.forEach((n, i) => { const w = 0.5 + 0.5 * Math.sin(t * 1.3 + i * 0.9); n.lm.color.copy(n.c).multiplyScalar(0.3 + arc * (1.9 + 0.8 * w)); n.im.color.copy(n.c).multiplyScalar(0.03 + arc * 0.3); });
          const end = sstep(NP + 1.2, NP + 2, k);
          P.endLight.color.setRGB(1.3, 1.05, 0.78).multiplyScalar(0.04 + end * 0.96);
          P.endLine.color.set(ACC).multiplyScalar(0.3 + end * 2.4);
          P.endPool.uI.value = end * 0.6;
          dustU.uZ.value = cam.z;
        },
        dispose() { setLit(-1); els.forEach((el) => el.style.removeProperty('--lit')); },
      };
    },
  };
  return startDim(spec, opts);
}

/* ── the worlds in miniature: each gets the plinth's top as its floor (y 0, radius 1.8) and returns its tick ── */
const MINI = [
  // SporChat: a night pitch, four floodlight masts turned on it, a ball in play
  ({ THREE, g, col, glows, glowOf, box, mesh, dark, glareTex, aniso, C3 }) => {
    const pitch = mesh(new THREE.PlaneGeometry(2.7, 1.75), new THREE.MeshStandardMaterial({ map: canvasTex(THREE, 512, 332, drawPitch, { aniso }), roughness: 0.9 }), 0, 0.02, 0, g);
    pitch.rotation.x = -Math.PI / 2;
    box(2.95, 0.12, 0.12, dark, 0, 0.06, -0.98, g); box(2.95, 0.12, 0.12, dark, 0, 0.06, 0.98, g);
    const head = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), C3('#dfeaff'), 1.2, 3.2);
    for (const [x, z] of [[-1.5, -1.05], [1.5, -1.05], [-1.5, 1.05], [1.5, 1.05]]) {
      mesh(new THREE.CylinderGeometry(0.025, 0.035, 1.9, 8), dark, x, 0.95, z, g);
      const h = box(0.36, 0.2, 0.05, head, x * 0.96, 1.92, z * 0.96, g); h.rotation.set(-0.6 * Math.sign(z), Math.atan2(-x, -z) + Math.PI, 0, 'YXZ');
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: glareTex, color: 0xdfeaff, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55 }));
      sp.scale.set(1.1, 1.1, 1); sp.position.set(x * 0.96, 1.92, z * 0.96); g.add(sp);
    }
    const ball = mesh(new THREE.SphereGeometry(0.06, 14, 10), new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x444444, roughness: 0.4 }), 0, 0.1, 0, g);
    return (t) => { ball.position.set(Math.sin(t * 0.9) * 0.95, 0.07 + Math.abs(Math.sin(t * 3.1)) * 0.34, Math.sin(t * 1.37) * 0.5); };
  },
  // MediZen: three panes of teal glass, a heartbeat running across them, the clinic's cross
  ({ THREE, g, col, glows, glowOf, box, addMat, time }) => {
    const pane = new THREE.MeshBasicMaterial({ color: col.clone().multiplyScalar(0.12), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
    const edge = glowOf(glows, new THREE.LineBasicMaterial({ color: col.clone() }), col, 0.5, 1.8);
    [[-0.85, 0.2, -0.25], [0, -0.35, 0.1], [0.85, 0.15, -0.3]].forEach(([x, z, r]) => {
      const p = box(0.95, 1.45, 0.03, pane, x, 0.85, z, g); p.rotation.y = r;
      const e = new THREE.LineSegments(new THREE.EdgesGeometry(p.geometry), edge); e.position.copy(p.position); e.rotation.copy(p.rotation); g.add(e);
    });
    const ecg = [[-1.5, 0.9, 0.7], [-0.8, 0.9, 0.7], [-0.5, 0.9, 0.7], [-0.38, 1.05, 0.7], [-0.25, 0.9, 0.7], [-0.12, 0.9, 0.7], [-0.04, 0.62, 0.7], [0.06, 1.62, 0.7], [0.16, 0.55, 0.7], [0.26, 0.9, 0.7], [0.5, 0.9, 0.7], [0.66, 1.08, 0.7], [0.82, 0.9, 0.7], [1.5, 0.9, 0.7]];
    const u = { uCol: { value: col }, uT: time, uF: { value: 0 }, uSp: { value: 0.45 }, uLo: { value: 0.12 } };
    const line = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(ecg.map((q) => new THREE.Vector3(...q)), false, 'catmullrom', 0.1), 160, 0.022, 6), addMat(PULSE_FS, u));
    line.renderOrder = 4; g.add(line);
    const crossM = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), col, 0.8, 2.2);
    const cross = new THREE.Group(); cross.position.set(0, 2.1, -0.1); g.add(cross);
    box(0.36, 0.11, 0.05, crossM, 0, 0, 0, cross); box(0.11, 0.36, 0.05, crossM, 0, 0, 0, cross);
    return (t, f) => { u.uF.value = f; cross.rotation.y = t * 0.6; cross.position.y = 2.1 + Math.sin(t * 1.1) * 0.06; };
  },
  // Green Room: a snooker table under its lamp, the reds racked, the white waiting
  ({ THREE, g, col, glows, glowOf, box, mesh, dark, time, fogU }) => {
    const felt = new THREE.MeshStandardMaterial({ color: 0x0f6a33, roughness: 0.95 }), wood = new THREE.MeshStandardMaterial({ color: 0x3b2414, roughness: 0.5, metalness: 0.2 });
    box(2.3, 0.1, 1.25, felt, 0, 0.62, 0, g);
    box(2.5, 0.12, 0.1, wood, 0, 0.66, 0.67, g); box(2.5, 0.12, 0.1, wood, 0, 0.66, -0.67, g); box(0.1, 0.12, 1.45, wood, 1.2, 0.66, 0, g); box(0.1, 0.12, 1.45, wood, -1.2, 0.66, 0, g);
    box(2.2, 0.5, 1.1, wood, 0, 0.32, 0, g);
    const red = new THREE.MeshStandardMaterial({ color: 0xb01818, roughness: 0.25, emissive: 0x220000 });
    let n = 0; for (let r = 0; r < 4; r++) for (let i = 0; i <= r; i++) { mesh(new THREE.SphereGeometry(0.045, 12, 8), red, 0.45 + r * 0.078, 0.715, (i - r / 2) * 0.092, g); n++; }
    mesh(new THREE.SphereGeometry(0.045, 12, 8), new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.25 }), -0.7, 0.715, 0.1, g);
    mesh(new THREE.SphereGeometry(0.045, 12, 8), new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2 }), 0.9, 0.715, 0, g);
    const shade = mesh(new THREE.CylinderGeometry(0.35, 0.75, 0.32, 4, 1, true), new THREE.MeshStandardMaterial({ color: 0x0d3b22, roughness: 0.4, metalness: 0.5, side: THREE.DoubleSide }), 0, 1.75, 0, g);
    shade.rotation.y = Math.PI / 4; shade.scale.set(1.6, 1, 0.95);
    const bulb = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), new THREE.Color(1, 0.9, 0.7), 1.2, 2.6);
    box(1.4, 0.03, 0.4, bulb, 0, 1.6, 0, g);
    const len = 0.95, cg = new THREE.CylinderGeometry(0.75, 1.3, len, 4, 1, true); cg.translate(0, -len / 2, 0);
    const cu = { ...fogU(), uLen: { value: len }, uCol: { value: new THREE.Color(1, 0.86, 0.6) }, uI: { value: 0.2 }, uTime: time };
    const beam = mesh(cg, new THREE.ShaderMaterial({ vertexShader: CONE_VS, fragmentShader: CONE_FS, uniforms: cu, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }), 0, 1.58, 0, g);
    beam.rotation.y = Math.PI / 4; beam.scale.set(1.45, 1, 0.85); beam.renderOrder = 5;
    for (const x of [-0.5, 0.5]) mesh(new THREE.CylinderGeometry(0.008, 0.008, 1.4, 4), dark, x, 2.6, 0, g);
    return (t, f) => { cu.uI.value = 0.12 + 0.25 * f; };
  },
  // My Branch: the storefront at closing time, the window lit, the awning out
  ({ THREE, g, col, glows, glowOf, box, mesh, dark, aniso }) => {
    const brick = new THREE.MeshStandardMaterial({ color: 0x2b1f19, roughness: 0.9 });
    box(2.4, 1.7, 1.1, brick, 0, 0.85, -0.3, g);
    const win = glowOf(glows, new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 512, 256, drawShop, { aniso }), color: col.clone() }), new THREE.Color(1, 1, 1), 0.5, 1.0);
    mesh(new THREE.PlaneGeometry(1.45, 0.75), win, -0.25, 0.85, 0.26, g);
    const door = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), new THREE.Color(1, 0.75, 0.45), 0.4, 1.1);
    mesh(new THREE.PlaneGeometry(0.42, 1.0), door, 0.8, 0.5, 0.26, g);
    const aw = mesh(new THREE.PlaneGeometry(2.0, 0.55), new THREE.MeshStandardMaterial({ map: canvasTex(THREE, 256, 64, drawAwning), side: THREE.DoubleSide, roughness: 0.8 }), 0, 1.38, 0.45, g);
    aw.rotation.x = -1.05;
    const sign = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), col, 0.8, 2.4);
    box(1.5, 0.16, 0.05, sign, 0, 1.6, 0.27, g);
    box(0.5, 0.04, 0.36, dark, -1.0, 0.02, 0.6, g);   // the step at the door
    return null;
  },
  // the network: a map of the branches, every one linked to the hub, the orders running out along the links
  ({ THREE, g, col, glows, glowOf, mesh, dark, addMat, time, aniso }) => {
    const map = mesh(new THREE.CircleGeometry(1.75, 48), new THREE.MeshStandardMaterial({ map: canvasTex(THREE, 512, 512, drawMap, { aniso }), roughness: 0.7, emissive: 0x101820, emissiveMap: null }), 0, 0.02, 0, g);
    map.rotation.x = -Math.PI / 2;
    const pinM = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), col, 0.9, 2.6);
    const pins = [];
    const hub = mesh(new THREE.SphereGeometry(0.11, 14, 10), pinM, 0, 0.55, 0, g); mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.5, 6), dark, 0, 0.27, 0, g);
    const u = { uCol: { value: col }, uT: time, uF: { value: 0 }, uSp: { value: 0.6 }, uLo: { value: 0.1 } };
    const linkM = addMat(PULSE_FS, u);
    for (let i = 0; i < 9; i++) {
      const a = (i / 9) * TAU + rnd(i, 2) * 0.5, r = 0.75 + rnd(i, 3) * 0.85, x = Math.cos(a) * r, z = Math.sin(a) * r, h = 0.22 + rnd(i, 4) * 0.18;
      mesh(new THREE.CylinderGeometry(0.012, 0.012, h, 5), dark, x, h / 2, z, g);
      pins.push(mesh(new THREE.SphereGeometry(0.055, 10, 8), pinM, x, h, z, g));
      const crv = new THREE.QuadraticBezierCurve3(new THREE.Vector3(0, 0.55, 0), new THREE.Vector3(x * 0.5, 0.95, z * 0.5), new THREE.Vector3(x, h, z));
      const l = new THREE.Mesh(new THREE.TubeGeometry(crv, 28, 0.012, 5, false), linkM); l.renderOrder = 4; g.add(l);
    }
    return (t, f) => { u.uF.value = f; hub.scale.setScalar(1 + Math.sin(t * 3) * 0.12); pins.forEach((p, i) => { p.scale.setScalar(1 + Math.max(0, Math.sin(t * 2 - i)) * 0.3); }); };
  },
  // Neon Alley: two walls, neon tubes buzzing on them, a wet floor
  ({ THREE, g, glows, glowOf, box, mesh }) => {
    const brick = new THREE.MeshStandardMaterial({ color: 0x17141c, roughness: 0.8 });
    box(0.14, 1.9, 2.6, brick, -0.85, 0.95, 0, g); box(0.14, 1.9, 2.6, brick, 0.85, 0.95, 0, g);
    const wet = mesh(new THREE.PlaneGeometry(1.56, 2.6), new THREE.MeshStandardMaterial({ color: 0x08080c, roughness: 0.12, metalness: 0.9 }), 0, 0.02, 0, g); wet.rotation.x = -Math.PI / 2;
    const tubes = [];
    const neon = (hex, w, h, x, y, z, ry = 0) => { const m = glowOf(glows, new THREE.MeshBasicMaterial({ color: new THREE.Color(hex) }), new THREE.Color(hex), 1.6, 2.6); const b = box(w, h, 0.03, m, x, y, z, g); b.rotation.y = ry; tubes.push(m); return b; };
    neon('#ff3fb4', 0.03, 0.8, -0.77, 1.15, 0.4, Math.PI / 2); neon('#ff3fb4', 0.03, 0.5, -0.77, 0.9, -0.5, Math.PI / 2);
    neon('#34e4ff', 0.03, 0.9, 0.77, 1.25, -0.2, Math.PI / 2); neon('#7dff6a', 0.03, 0.03, 0.77, 1.75, 0.6, Math.PI / 2).scale.set(1, 1, 18);
    neon('#ff3fb4', 1.6, 0.04, 0, 1.9, -1.3); neon('#34e4ff', 0.6, 0.04, 0, 1.55, -1.3);
    const puddle = (hex, x, z) => { const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(hex).multiplyScalar(0.35), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }); const p = mesh(new THREE.CircleGeometry(0.35, 24), m, x, 0.03, z, g); p.rotation.x = -Math.PI / 2; p.scale.set(1, 1.8, 1); };
    puddle('#ff3fb4', -0.4, 0.3); puddle('#34e4ff', 0.4, -0.3);
    return (t) => { const fl = Math.sin(t * 17.3) * Math.sin(t * 7.1) > 0.72 ? 0.35 : 1; tubes[2].color.multiplyScalar(fl); };
  },
  // Hashmalka: a home charger on its post, the cable to the car, the charge running along it
  ({ THREE, g, col, glows, glowOf, box, mesh, dark, addMat, time }) => {
    box(0.36, 1.3, 0.26, dark, 0.9, 0.65, -0.2, g);
    const scr = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), col, 0.6, 2.0);
    box(0.22, 0.14, 0.02, scr, 0.9, 1.08, -0.06, g);
    const bolt = new THREE.Shape(); bolt.moveTo(0.02, 0.14); bolt.lineTo(-0.07, -0.01); bolt.lineTo(0.0, -0.01); bolt.lineTo(-0.03, -0.14); bolt.lineTo(0.08, 0.03); bolt.lineTo(0.01, 0.03); bolt.lineTo(0.02, 0.14);
    const bm = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), col, 1.0, 2.8);
    const b = mesh(new THREE.ExtrudeGeometry(bolt, { depth: 0.02, bevelEnabled: false }), bm, 0.9, 0.78, -0.06, g); b.scale.setScalar(1.3);
    const car = new THREE.MeshStandardMaterial({ color: 0x2a2f36, roughness: 0.3, metalness: 0.7 });
    box(1.5, 0.34, 0.7, car, -0.45, 0.3, 0.25, g); box(0.8, 0.26, 0.6, car, -0.55, 0.6, 0.25, g);
    for (const [x, z] of [[-0.95, -0.1], [0.05, -0.1], [-0.95, 0.6], [0.05, 0.6]]) { const w = mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.08, 14), dark, x, 0.14, z, g); w.rotation.x = Math.PI / 2; }
    const hl = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), new THREE.Color(1, 0.95, 0.85), 1.0, 2.0);
    box(0.04, 0.06, 0.14, hl, 0.31, 0.36, 0.05, g); box(0.04, 0.06, 0.14, hl, 0.31, 0.36, 0.45, g);
    const u = { uCol: { value: col }, uT: time, uF: { value: 0 }, uSp: { value: 0.8 }, uLo: { value: 0.08 } };
    const cab = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([[0.9, 0.9, -0.06], [0.75, 0.2, 0.15], [0.45, 0.05, 0.45], [0.3, 0.32, 0.62]].map((q) => new THREE.Vector3(...q))), 48, 0.022, 6), addMat(PULSE_FS, u));
    cab.renderOrder = 4; g.add(cab);
    return (t, f) => { u.uF.value = f; };
  },
  // flyers and branding: three of the real flyers on easels, in a fan
  ({ THREE, g, col, glows, glowOf, box, mesh, dark, texLoad }) => {
    const fr = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), col, 0.4, 1.4);
    ['/site/assets/work/social-asian-bar.webp', '/site/assets/work/social-matan.webp', '/site/assets/work/social-breslev-home.webp'].forEach((src, i) => {
      const a = (i - 1) * 0.42, x = Math.sin(a) * 1.0, z = -Math.cos(a) * 0.5 + 0.4;
      const e = new THREE.Group(); e.position.set(x, 0, z); e.rotation.y = -a; g.add(e);
      box(0.78, 1.62, 0.03, fr, 0, 1.05, -0.02, e);
      const m = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.12, 0.12, 0.12) });
      mesh(new THREE.PlaneGeometry(0.72, 1.56), m, 0, 1.05, 0.0, e);
      texLoad(src, 512).then((t) => { m.map = t; m.color.setRGB(0.95, 0.95, 0.95); m.needsUpdate = true; }).catch(() => {});
      for (const lx of [-0.3, 0.3]) { const l = mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.0, 5), dark, lx, 0.38, -0.12, e); l.rotation.x = -0.18; }
    });
    return null;
  },
  // AutoCAD: a drafting table, the plan drawing itself room by room
  ({ THREE, g, col, glows, glowOf, box, mesh, dark, addMat, time, aniso, fogU }) => {
    const t0 = canvasTex(THREE, 1024, 700, drawPlan, { aniso, srgb: false });
    const u = { ...fogU(), uMap: { value: t0 }, uT: time, uF: { value: 0 }, uCol: { value: col } };
    const sheet = mesh(new THREE.PlaneGeometry(2.7, 1.85), new THREE.ShaderMaterial({ vertexShader: ADD_VS, fragmentShader: PRINT_FS, uniforms: u, fog: true }), 0, 1.0, 0, g);
    sheet.rotation.x = -0.75;
    box(2.85, 0.05, 2.0, dark, 0, 0.97, -0.05, g).rotation.x = -0.75;
    for (const x of [-1.2, 1.2]) mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.95, 6), dark, x, 0.47, 0, g);
    const cur = glowOf(glows, new THREE.MeshBasicMaterial({ color: col.clone() }), new THREE.Color(1, 1, 1), 0.8, 2.0);
    const cx = new THREE.Group(); g.add(cx); box(0.3, 0.012, 0.012, cur, 0, 0, 0, cx); box(0.012, 0.3, 0.012, cur, 0, 0, 0, cx); cx.rotation.x = -0.75;
    return (t, f) => {
      u.uF.value = f;
      const e = (t * 0.09) % 1 * 1.25 - 0.1, ux = clamp(e, 0, 1), vy = 0.5 + Math.sin(t * 2.3) * 0.35;
      const lx = (ux - 0.5) * 2.7, ly = (vy - 0.5) * 1.85;
      cx.position.set(lx, 1.0 + ly * Math.cos(0.75) + 0.02, -ly * Math.sin(0.75) + 0.02);
    };
  },
  // Nadav 2.0: the pixel pet stepping on the plinth, its window of sessions floating beside it
  ({ THREE, g, col, glows, glowOf, mesh, aniso }) => {
    const cells = []; PET.forEach((row, y) => [...row].forEach((ch, x) => { if (ch === '#') cells.push([x, y]); }));
    const s = 0.14, pet = new THREE.InstancedMesh(new THREE.BoxGeometry(s * 0.96, s * 0.96, s * 2.2), new THREE.MeshStandardMaterial({ color: 0xe8805a, roughness: 0.6, emissive: 0x3a1408 }), cells.length);
    const m = new THREE.Matrix4(), legs = [];
    cells.forEach(([x, y], i) => { m.makeTranslation((x - 4) * s, (6 - y) * s + s * 0.5, 0); pet.setMatrixAt(i, m); if (y === 6) legs.push(i); });
    const eyes = new THREE.MeshBasicMaterial({ color: 0x1a0d08 });
    const pg = new THREE.Group(); pg.position.set(-0.25, 0, 0.2); pg.add(pet); g.add(pg);
    for (const x of [-3, 1]) mesh(new THREE.BoxGeometry(s * 0.7, s * 0.7, 0.02), eyes, (x) * s, 3 * s + s * 0.5, s * 1.12, pg);
    const panelM = glowOf(glows, new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 512, 340, drawPanel, { aniso }), color: col.clone(), transparent: true }), new THREE.Color(1, 1, 1), 0.55, 0.45);
    const panel = mesh(new THREE.PlaneGeometry(1.15, 0.76), panelM, 0.55, 1.85, -0.3, g); panel.rotation.y = -0.25;
    return (t) => {
      pg.position.y = Math.abs(Math.sin(t * 2.4)) * 0.06; pg.rotation.y = Math.sin(t * 0.5) * 0.35;
      legs.forEach((i, k) => { const [x] = cells[i]; m.makeTranslation((x - 4) * s, s * 0.5 + (k % 2 === Math.floor(t * 4.8) % 2 ? 0.04 : 0), 0); pet.setMatrixAt(i, m); });
      pet.instanceMatrix.needsUpdate = true; panel.position.y = 1.85 + Math.sin(t * 0.9) * 0.05;
    };
  },
];
