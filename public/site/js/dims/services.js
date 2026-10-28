// dims/services.js: the services page's dimension (2026-10-28). The page's idea was a circuit board routing power to
// the service in view (js/worlds/w-services.js); the full version is a place: a foundry. A long steel hall built as
// geometry (plate floor with guide lights, I-beam columns, roof trusses, a gantry crane on its rails, hanging lamps
// with their beams, a furnace at the door, sparks). Seven stations stand down the hall, one per service, and one swarm
// of steel blocks is the work: at each station it is assembled into that service's object while a weld line climbs
// it. The phone cards are the page's own real screens, hanging on the line; at its station a service's three come down.
//
//   hero         raw stock: the blocks lie in a glowing heap by the furnace, the cards hang down the hall
//   systems      a gear train                          agents   a chat bubble, typing
//   apps         a phone with its app grid             web      a browser window
//   content      a week's posting calendar             security a shield with a keyhole
//   enablement   three people around one network       process  five platforms rising, one per step
//   vow          a seal: a ring with a tick, forged hot  end    a gate at the end of the hall, open to the light
//
// The DOM stays the page; core.js runs the camera, the cards, the swarm, the cuts and every fallback.
import { startDim, TAU, clamp, lerp, sstep, rnd, canvasTex, FOG_ADD, HASH } from './core.js';

const SHOTS = ['/site/hero/assets/cards/cash-day.webp', '/site/assets/story/br-stock.webp', '/site/assets/story/br-shifts.webp',
  '/site/hero/assets/cards/medizen-3.webp', '/site/hero/assets/cards/medizen-4.webp', '/site/hero/assets/cards/medizen-2.webp',
  '/site/hero/assets/cards/sporchat-room.webp', '/site/hero/assets/cards/greenroom-home.webp', '/site/hero/assets/cards/greenroom-book.webp',
  '/site/hero/assets/cards/social-gr-offer.webp', '/site/hero/assets/cards/social-gr-food.webp', '/site/hero/assets/cards/social-gr-room.webp'];
const GROUP = [0, 1, 2, 4];                 // the station whose screens each three cards are (systems, agents, apps, content)
const CW = 2.2, CHh = 4.77;                 // a phone card in metres (540 × 1170)
const ZS = (j) => -34 - j * 28;             // station j down the hall
const SX = -5.2, SY = 3.4;                  // the sculpture's centre at a station: on its pedestal, low on the inline-end side
const HALL = { w: 36, z0: 26, z1: -330, h: 19 };
const ACC = '#E8913C';

/* ── a voxel sculpture from a 2D mask: as many cells as fit in n, extruded d metres ── */
function vox(mask, n, W, H, D) {
  let lo = 0.12, hi = 2.5, best = null;
  for (let it = 0; it < 14; it++) {
    const s = (lo + hi) / 2, out = [];
    const nx = Math.ceil(W / s), ny = Math.ceil(H / s), nz = Math.max(1, Math.round(D / s));
    for (let y = 0; y < ny; y++) for (let x = 0; x < nx; x++) {
      const u = ((x + 0.5) / nx) * 2 - 1, v = ((y + 0.5) / ny) * 2 - 1;
      if (!mask(u * (W / H), v)) continue;
      for (let z = 0; z < nz; z++) out.push([(x + 0.5 - nx / 2) * s, (y + 0.5 - ny / 2) * s, (z + 0.5 - nz / 2) * s]);
    }
    if (out.length <= n) { best = { pts: out, s }; hi = s; } else lo = s;
  }
  return best;
}
const sdBox = (x, y, bx, by, r = 0) => { const qx = Math.abs(x) - bx + r, qy = Math.abs(y) - by + r; return Math.hypot(Math.max(qx, 0), Math.max(qy, 0)) + Math.min(Math.max(qx, qy), 0) - r; };
const ring = (x, y, r0, r1) => { const r = Math.hypot(x, y); return r > r0 && r < r1; };
// the masks take u in [-aspect, aspect], v in [-1, 1]
const MASKS = [
  /* systems: two gears in mesh */ (u, v) => {
    const g = (x, y, R, teeth, ph) => { const r = Math.hypot(x, y), a = Math.atan2(y, x); const tooth = Math.cos(a * teeth + ph) > 0.2 ? R * 0.18 : 0; return (r < R + tooth && r > R * 0.38) || r < R * 0.16; };
    return g(u + 0.38, v + 0.12, 0.72, 12, 0) || g(u - 0.78, v - 0.52, 0.4, 8, 0.4);
  },
  /* agents: a chat bubble with its tail and three typing dots */ (u, v) => {
    const b = sdBox(u, v - 0.12, 0.98, 0.7, 0.32) < 0;
    const tail = v < -0.5 && v > -1 && u > 0.25 && u < 0.75 && (u - 0.25) < (v + 1) * 0.9;
    const dot = [-0.45, 0, 0.45].some((x) => Math.hypot(u - x, v - 0.12) < 0.16);
    return (b || tail) && !dot;
  },
  /* apps: a phone, its notch and a grid of app tiles */ (u, v) => {
    const frame = sdBox(u, v, 0.52, 0.98, 0.16), inner = sdBox(u, v + 0.02, 0.42, 0.86, 0.06);
    if (frame < 0 && inner > 0) return !(Math.abs(u) < 0.14 && v > 0.88);
    const gx = (u + 0.42) / 0.84, gy = (v + 0.6) / 1.3;
    if (gx > 0 && gx < 1 && gy > 0 && gy < 1) { const fx = (gx * 3) % 1, fy = (gy * 4) % 1; return fx > 0.2 && fx < 0.82 && fy > 0.22 && fy < 0.8; }
    return false;
  },
  /* web: a browser window: frame, its bar with three dots, a hero block and lines */ (u, v) => {
    const fr = sdBox(u, v, 1.42, 0.98, 0.08), inner = sdBox(u, v + 0.08, 1.32, 0.78, 0.02);
    if (fr < 0 && inner > 0) return !(v > 0.78 && [-1.24, -1.08, -0.92].some((x) => Math.hypot(u - x, v - 0.88) < 0.06));
    if (sdBox(u + 0.45, v - 0.25, 0.75, 0.38) < 0) return true;
    if (u > 0.45 && u < 1.22 && [0.45, 0.2, -0.05].some((y) => Math.abs(v - y) < 0.07)) return true;
    return v < -0.35 && v > -0.75 && [-1.0, -0.2, 0.6].some((x) => u > x - 0.3 && u < x + 0.3);
  },
  /* content: a week's posting calendar, a few days marked */ (u, v) => {
    if (sdBox(u, v, 1.3, 1, 0.08) > 0) return false;
    if (v > 0.66) return !(Math.abs(u + 0.7) < 0.08 || Math.abs(u - 0.7) < 0.08);
    const gx = (u + 1.2) / 2.4, gy = (v + 0.92) / 1.48;
    if (gx < 0 || gx > 1 || gy < 0 || gy > 1) return false;
    const fx = (gx * 7) % 1, fy = (gy * 4) % 1;
    return fx > 0.12 && fx < 0.88 && fy > 0.12 && fy < 0.88;
  },
  /* security: a shield and its keyhole */ (u, v) => {
    const w = 0.92 * (v > 0.1 ? 1 : Math.sqrt(Math.max(0, (v + 1) / 1.1)));
    const shield = Math.abs(u) < w && v < 0.92 && v > -1 && !(v > 0.72 && Math.abs(u) < 0.5 - (v - 0.72) * 2);
    const hole = Math.hypot(u, v - 0.18) < 0.2 || (Math.abs(u) < 0.08 + (0.1 - v) * 0.12 && v < 0.1 && v > -0.42);
    const band = Math.abs(u) < w && Math.abs(u) > w - 0.16;
    return shield && !hole && (band || Math.abs(u) < w - 0.3 || v > 0.5);
  },
  /* enablement: three people around one network */ (u, v) => {
    const P = [[-1.0, -0.15], [0, 0.1], [1.0, -0.15]];
    for (const [x, y] of P) {
      if (Math.hypot(u - x, v - y - 0.38) < 0.24) return true;                      // head
      if (v < y + 0.06 && v > y - 0.55 && Math.hypot((u - x) / 0.42, (v - y + 0.55) / 0.6) < 1) return true; // shoulders
    }
    const seg = (ax, ay, bx, by) => { const dx = bx - ax, dy = by - ay, t = clamp(((u - ax) * dx + (v - ay) * dy) / (dx * dx + dy * dy)); return Math.hypot(u - ax - dx * t, v - ay - dy * t) < 0.05; };
    const N = [[-1.25, -0.9], [-0.35, -0.75], [0.45, -0.88], [1.25, -0.75]];
    return N.some(([x, y]) => Math.hypot(u - x, v - y) < 0.1) || seg(-1.25, -0.9, -0.35, -0.75) || seg(-0.35, -0.75, 0.45, -0.88) || seg(0.45, -0.88, 1.25, -0.75);
  },
];

/* ── shaders ── */
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
const SPARK_VS = /* glsl */`
attribute vec4 aR; uniform float uTime; uniform float uScale; uniform vec3 uO; uniform float uRate;
varying float vA; varying vec3 vC;
#include <fog_pars_vertex>
void main(){
  float L = 0.9 + aR.w * 0.9, age = fract(uTime / L + aR.x) * L;
  vec3 v = normalize(vec3(aR.y - 0.5, 0.55 + aR.z * 0.6, aR.w - 0.5)) * (3.0 + aR.z * 6.0);
  vec3 p = uO + vec3((aR.x - 0.5) * 2.4, (aR.y - 0.5) * 2.0, (aR.z - 0.5) * 1.4) + v * age + vec3(0.0, -6.5, 0.0) * age * age;
  p.y = max(p.y, 0.05);
  float life = 1.0 - age / L;
  vA = life * life * step(aR.y, uRate);
  vC = mix(vec3(1.0, 0.3, 0.05), vec3(1.0, 0.85, 0.55), life);
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_PointSize = clamp(0.07 * uScale / -mvPosition.z, 1.0, 4.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const SPARK_FS = /* glsl */`
varying float vA; varying vec3 vC;
#include <fog_pars_fragment>
void main(){ vec2 c = gl_PointCoord - 0.5; float r = dot(c, c); if (r > 0.25 || vA < 0.01) discard;
  gl_FragColor = vec4(vC * vA * 1.7 * (1.0 - r * 4.0), 1.0);
  ${FOG_ADD}
}`;
const GUIDE_FS = /* glsl */`
uniform vec3 uAcc; uniform float uTime; uniform float uZ; varying vec2 vUv; varying vec3 vW;
#include <fog_pars_fragment>
void main(){
  float dash = step(0.45, fract(vW.z * 0.25));
  float run = exp(-((fract((vW.z - uTime * 9.0) * 0.02) - 0.5) * (fract((vW.z - uTime * 9.0) * 0.02) - 0.5)) * 60.0);   // a pulse running down the line
  float near = exp(-abs(vW.z - uZ) * 0.05);
  gl_FragColor = vec4(uAcc * dash * (0.35 + 1.4 * run + 1.2 * near), 1.0);
  ${FOG_ADD}
}`;
const GUIDE_VS = /* glsl */`varying vec2 vUv; varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;

function drawPlates(g, W, H) {
  const n = 4, s = W / n;
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    const l = 18 + rnd(x + 1, y + 3) * 10;
    g.fillStyle = `rgb(${l},${l + 2},${l + 5})`; g.fillRect(x * s, y * s, s, s);
    for (let i = 0; i < 260; i++) { const a = Math.random() * 0.06; g.fillStyle = Math.random() > 0.5 ? `rgba(255,255,255,${a})` : `rgba(0,0,0,${a * 2})`; g.fillRect(x * s + Math.random() * s, y * s + Math.random() * s, 2 + Math.random() * 30, 1); }
    // tread: the diamond plate's raised lozenges
    g.fillStyle = 'rgba(255,255,255,.035)';
    for (let ty = 0; ty < s; ty += 22) for (let tx = (ty / 22) % 2 ? 11 : 0; tx < s; tx += 22) { g.save(); g.translate(x * s + tx, y * s + ty); g.rotate((ty / 22) % 2 ? 0.7 : -0.7); g.fillRect(-6, -1.5, 12, 3); g.restore(); }
    g.strokeStyle = 'rgba(0,0,0,.7)'; g.lineWidth = 3; g.strokeRect(x * s + 1.5, y * s + 1.5, s - 3, s - 3);
    g.fillStyle = 'rgba(120,125,135,.35)';
    for (const [rx, ry] of [[10, 10], [s - 10, 10], [10, s - 10], [s - 10, s - 10]]) { g.beginPath(); g.arc(x * s + rx, y * s + ry, 3, 0, TAU); g.fill(); }
  }
  for (let i = 0; i < 7; i++) { // oil and scorch
    const x = Math.random() * W, y = Math.random() * H, r = 30 + Math.random() * 90;
    const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, 'rgba(0,0,0,.35)'); gr.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2);
  }
}
function drawMouth(g, W, H) {
  const gr = g.createRadialGradient(W / 2, H * 0.75, 4, W / 2, H * 0.6, W * 0.7);
  gr.addColorStop(0, '#fff3c4'); gr.addColorStop(0.25, '#ffb347'); gr.addColorStop(0.6, '#e2531a'); gr.addColorStop(1, '#3a0d02');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}
function drawGlow(g, W, H) {
  const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.15, 'rgba(255,220,170,.5)'); gr.addColorStop(0.5, 'rgba(255,160,80,.1)'); gr.addColorStop(1, 'rgba(255,140,60,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

/* ── the chapters ── */
const station = (j) => ({ at: ['#svc-systems', '#svc-agents', '#svc-apps', '#svc-web', '#svc-content', '#svc-security', '#svc-enablement'][j],
  cam: { pos: [2.6 + (j % 2) * 1.2, 4.1 + (j % 3) * 0.3, ZS(j) + 15.5], tgt: [-1.8, 6.4, ZS(j) - 1], fov: 48, roll: (j % 2 ? 0.02 : -0.02),
    pp: [-2, 6.4, ZS(j) + 19], tp: [SX + 0.6, 5.2, ZS(j)] },
  via: [[j % 2 ? 7 : -1, j % 2 ? 12 : 3.2, ZS(j) - 6], [-3, j % 2 ? 6 : 5, ZS(j) - 30]],
  cut: ['warp', 'glitch', 'fold', 'ink', 'scan', 'glitch', 'warp'][j] });

export function initDim(opts) {
  let N = 0;                                     // the swarm's size, known at build
  const P = {};                                  // shared between build, formations and update
  const spec = {
    name: 'services', base: '#06080C', accent: ACC, ink: '#020305',
    fog: { color: 0x07090d, density: 0.0125 }, exposure: 1.0, bloom: { strength: 0.7, radius: 0.55, threshold: 0.82 },
    intro: [0, -1.2, 12], parallax: 0.7,
    card: { shots: SHOTS, w: CW, h: CHh, r: 0.28, n: [12, 12] },
    swarm: {
      n: [1100, 620], key: [-0.3, 1, 0.5], keyCol: 0xffe2c0, amb: 0x2a2f38,
      uniforms: { uSt: { value: null }, uWeld: { value: 0 }, uHot: { value: 0 } },
      head: 'uniform vec3 uSt; uniform float uWeld, uHot;',
      glsl: /* glsl */`
        // the weld line climbs the object at the station in front of the camera
        float dS = length(vW.xz - uSt.xz);
        float band = exp(-(((vW.y - uWeld) * 2.6) * ((vW.y - uWeld) * 2.6))) * (1.0 - smoothstep(6.0, 9.0, dS));
        col += uAcc * band * 2.4 * uHot + vec3(1.0, 0.9, 0.7) * pow(band, 8.0) * uHot * 1.5;
        col += uAcc * 0.05 * (1.0 - smoothstep(4.0, 12.0, dS)) * uHot;`,
    },
    chapters: [
      { at: 'top', cam: { pos: [0.5, 4.6, 16], tgt: [-3, 4.2, -30], fov: 54, pp: [0, 5, 20], tp: [-6, 3.6, -20] }, via: [[4, 7, -2], [-2, 5.2, -36]] },
      ...Array.from({ length: 7 }, (_, j) => station(j)),
      { at: '#process', cam: { pos: [10, 9, -212], tgt: [-4, 6.5, -238], fov: 50, pp: [6, 11, -204], tp: [-6, 7, -236] }, via: [[4, 8, -232], [-6, 7, -258]], cut: 'fold' },
      { at: '.vow', cam: { pos: [0, 8, -246], tgt: [0, 8.4, -276], fov: 48, pp: [0, 8.4, -238] }, cut: 'ink' },
      { at: 'end', cam: { pos: [1, 5, -284], tgt: [0, 7, -330], fov: 56, pp: [0, 5.5, -280] }, cut: 'warp' },
    ],
    async build(ctx) {
      const { THREE, scene, time, acc, phone, aniso, fogU } = ctx;
      N = ctx.swarm.n;
      ctx.swarm.u.uSt.value = new THREE.Vector3(SX, 0, ZS(0));
      scene.add(new THREE.HemisphereLight(0x5a6478, 0x16100a, 0.55));
      const key = new THREE.PointLight(0xffb070, 260, 60, 1.6); key.position.set(-2, 13, ZS(0) + 4); scene.add(key);
      const furnL = new THREE.PointLight(0xff7a2a, 240, 50, 1.6); furnL.position.set(-11, 4, -9); scene.add(furnL);

      /* the floor: diamond plate, with a guide line of the light on each side of the aisle */
      const L = HALL.z0 - HALL.z1, zc = (HALL.z0 + HALL.z1) / 2;
      const plate = canvasTex(THREE, 1024, 1024, drawPlates, { repeat: true, aniso });
      plate.repeat.set(HALL.w / 12, L / 12);
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(HALL.w + 8, L), new THREE.MeshStandardMaterial({ map: plate, roughness: 0.55, metalness: 0.6, color: 0x9aa0aa }));
      floor.rotation.x = -Math.PI / 2; floor.position.z = zc; scene.add(floor);
      const guideU = { ...fogU(), uAcc: { value: acc }, uTime: time, uZ: { value: 0 } };
      const guideMat = new THREE.ShaderMaterial({ vertexShader: GUIDE_VS, fragmentShader: GUIDE_FS, uniforms: guideU, fog: true });
      for (const x of [-2.6, 2.6]) { const g = new THREE.Mesh(new THREE.PlaneGeometry(0.12, L), guideMat); g.rotation.x = -Math.PI / 2; g.position.set(x, 0.02, zc); scene.add(g); }

      /* the hall: I-beam columns, roof trusses, the crane rails and its bridge */
      const steel = new THREE.MeshStandardMaterial({ color: 0x232830, roughness: 0.6, metalness: 0.7 });
      const colGeo = new THREE.BoxGeometry(0.9, HALL.h, 0.6), beamGeo = new THREE.BoxGeometry(HALL.w, 0.6, 0.5);
      const spans = Math.floor(L / 12);
      const cols = new THREE.InstancedMesh(colGeo, steel, spans * 2), beams = new THREE.InstancedMesh(beamGeo, steel, spans);
      const m = new THREE.Matrix4();
      const truss = [];
      for (let i = 0; i < spans; i++) {
        const z = HALL.z0 - i * 12;
        cols.setMatrixAt(i * 2, m.makeTranslation(-HALL.w / 2, HALL.h / 2, z)); cols.setMatrixAt(i * 2 + 1, m.makeTranslation(HALL.w / 2, HALL.h / 2, z));
        beams.setMatrixAt(i, m.makeTranslation(0, HALL.h, z));
        for (let s = 0; s < 6; s++) { const x0 = -HALL.w / 2 + (s * HALL.w) / 6, x1 = x0 + HALL.w / 6; truss.push(x0, HALL.h, z, x1, HALL.h + 3.5 - Math.abs((x0 + x1) / 2) * 0.15, z - 6, x1, HALL.h + 3.5 - Math.abs((x0 + x1) / 2) * 0.15, z - 6, x1, HALL.h, z - 12); }
      }
      scene.add(cols, beams);
      const tg = new THREE.BufferGeometry(); tg.setAttribute('position', new THREE.Float32BufferAttribute(truss, 3));
      scene.add(new THREE.LineSegments(tg, new THREE.LineBasicMaterial({ color: 0x2c333d })));
      for (const x of [-14, 14]) { const r = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.9, L), steel); r.position.set(x, 15, zc); scene.add(r); }
      const crane = new THREE.Group();
      const bridge = new THREE.Mesh(new THREE.BoxGeometry(29, 1.3, 1.6), new THREE.MeshStandardMaterial({ color: 0x3a2a12, roughness: 0.5, metalness: 0.6, emissive: 0x2a1404 }));
      bridge.position.y = 15.9; crane.add(bridge);
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(29.1, 0.12, 1.62), new THREE.MeshBasicMaterial({ color: acc.clone().multiplyScalar(1.6) }));
      stripe.position.y = 15.3; crane.add(stripe);
      const trolley = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), steel); trolley.position.set(SX, 15, 0); crane.add(trolley);
      const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute([SX - 0.3, 14.4, 0, SX - 0.3, 10.5, 0, SX + 0.3, 14.4, 0, SX + 0.3, 10.5, 0], 3));
      crane.add(new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: 0x8a919c })));
      const hook = new THREE.Mesh(new THREE.TorusGeometry(0.45, 0.12, 8, 16, Math.PI * 1.4), steel); hook.position.set(SX, 10.1, 0); hook.rotation.z = 0.6; crane.add(hook);
      scene.add(crane);

      /* lamps over the stations: a shade, a hot bulb, a glare and a dusty beam to the floor */
      const glareTex = canvasTex(THREE, 128, 128, drawGlow, { srgb: false });
      const coneMats = [];
      const lampZ = [ZS(0) + 22, ...Array.from({ length: 7 }, (_, j) => ZS(j)), -238];
      const shadeGeo = new THREE.ConeGeometry(1.1, 0.9, 20, 1, true), bulbMat = new THREE.MeshBasicMaterial({ color: new THREE.Color(6, 4.6, 3) });
      lampZ.forEach((z, i) => {
        const x = i === 0 ? -1 : SX + 0.4;
        const shade = new THREE.Mesh(shadeGeo, new THREE.MeshStandardMaterial({ color: 0x15181d, metalness: 0.7, roughness: 0.4, side: THREE.DoubleSide }));
        shade.position.set(x, 13.6, z); scene.add(shade);
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), bulbMat); bulb.position.set(x, 13.3, z); scene.add(bulb);
        const wire = new THREE.BufferGeometry(); wire.setAttribute('position', new THREE.Float32BufferAttribute([x, 14, z, x, HALL.h, z], 3));
        scene.add(new THREE.LineSegments(wire, new THREE.LineBasicMaterial({ color: 0x20252c })));
        const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glareTex, color: 0xffc890, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.45 }));
        gl.scale.set(6, 6, 1); gl.position.set(x, 13.2, z); scene.add(gl);
        const len = 13.2;
        const geo = new THREE.ConeGeometry(4.6, len, 32, 1, true); geo.translate(0, -len / 2, 0);
        const cm = new THREE.ShaderMaterial({ vertexShader: CONE_VS, fragmentShader: CONE_FS, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
          uniforms: { ...fogU(), uLen: { value: len }, uCol: { value: new THREE.Color(1, 0.72, 0.45) }, uI: { value: 0.12 }, uTime: time } });
        const cone = new THREE.Mesh(geo, cm); cone.position.set(x, 13.2, z); cone.renderOrder = 5; scene.add(cone);
        coneMats.push({ m: cm, z });
      });

      /* the stations: a pedestal with a ring of the light, and its number on the plate in front */
      const ringMats = [];
      const pedMat = new THREE.MeshStandardMaterial({ color: 0x1b1f26, metalness: 0.75, roughness: 0.35 });
      for (let j = 0; j < 7; j++) {
        const ped = new THREE.Mesh(new THREE.CylinderGeometry(4.6, 5, 0.7, 48), pedMat); ped.position.set(SX, 0.35, ZS(j)); scene.add(ped);
        const rm = new THREE.MeshBasicMaterial({ color: acc.clone() });
        const r = new THREE.Mesh(new THREE.TorusGeometry(4.75, 0.06, 6, 96), rm); r.rotation.x = Math.PI / 2; r.position.set(SX, 0.72, ZS(j)); scene.add(r);
        ringMats.push(rm);
        const num = canvasTex(THREE, 256, 128, (g, W, H) => { g.clearRect(0, 0, W, H); g.font = '800 96px Archivo, Rubik, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = 'rgba(232,145,60,.85)'; g.fillText('0' + (j + 1), W / 2, H / 2 + 4); }, { aniso });
        const nm = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.2), new THREE.MeshBasicMaterial({ map: num, transparent: true, depthWrite: false, color: new THREE.Color(1.3, 1.3, 1.3) }));
        nm.rotation.x = -Math.PI / 2; nm.position.set(SX + 2.2, 0.03, ZS(j) + 6.8); scene.add(nm);
      }

      /* the furnace at the door: a squat stack with a hot mouth */
      {
        const g = new THREE.Group();
        const body = new THREE.Mesh(new THREE.CylinderGeometry(4.2, 4.8, 10, 32), new THREE.MeshStandardMaterial({ color: 0x1a1512, roughness: 0.8, metalness: 0.3 }));
        body.position.y = 5; g.add(body);
        const stack = new THREE.Mesh(new THREE.CylinderGeometry(1.3, 1.6, 12, 16), body.material); stack.position.y = 16; g.add(stack);
        const mouth = new THREE.Mesh(new THREE.PlaneGeometry(3.6, 3), new THREE.MeshBasicMaterial({ map: canvasTex(THREE, 128, 128, drawMouth), color: new THREE.Color(1.5, 1.25, 1.1) }));
        mouth.position.set(0, 2.6, 4.35); g.add(mouth);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(4.5, 0.18, 8, 48), new THREE.MeshBasicMaterial({ color: new THREE.Color(2.2, 0.8, 0.2) })); rim.rotation.x = Math.PI / 2; rim.position.y = 10; g.add(rim);
        g.position.set(-12, 0, -10); g.rotation.y = 0.7; scene.add(g);
      }
      /* the gate at the end of the hall, open to a pale day */
      {
        const out = new THREE.Mesh(new THREE.PlaneGeometry(26, 16), new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0), fog: false }));
        out.position.set(0, 8, -318); scene.add(out); P.day = out.material;   // the day comes up only at the end of the page
        for (const x of [-14, 14]) { const w = new THREE.Mesh(new THREE.BoxGeometry(6, HALL.h, 1.5), steel); w.position.set(x, HALL.h / 2, -316); scene.add(w); }
        const lin = new THREE.Mesh(new THREE.BoxGeometry(34, 3, 1.5), steel); lin.position.set(0, 17.5, -316); scene.add(lin);
      }

      /* sparks: one emitter that follows the weld */
      const ns = phone ? 500 : 1400;
      const ar = new Float32Array(ns * 4); for (let i = 0; i < ns * 4; i++) ar[i] = Math.random();
      const sg = new THREE.BufferGeometry(); sg.setAttribute('position', new THREE.BufferAttribute(new Float32Array(ns * 3), 3)); sg.setAttribute('aR', new THREE.BufferAttribute(ar, 4));
      const sparkU = { ...fogU(), uTime: time, uScale: ctx.pointScale, uO: { value: new THREE.Vector3(-11, 3, -6) }, uRate: { value: 0.5 } };
      const sparks = new THREE.Points(sg, new THREE.ShaderMaterial({ vertexShader: SPARK_VS, fragmentShader: SPARK_FS, uniforms: sparkU, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      sparks.frustumCulled = false; sparks.renderOrder = 6; scene.add(sparks);

      Object.assign(P, { key, crane, coneMats, ringMats, guideU, sparkU, furnL, tmp: new THREE.Vector3() });

      return {
        update(c) {
          const { k, t } = c.st;
          const j = clamp(k - 1, 0, 6.999), js = Math.round(j);       // the station in front of the camera
          const zNow = k < 1 ? lerp(ZS(0) + 26, ZS(0), sstep(0, 1, k)) : k <= 7 ? ZS(0) - (k - 1) * 28 : lerp(ZS(6), -240, clamp(k - 7, 0, 1)) - Math.max(0, k - 8) * 30;
          P.crane.position.z = zNow;
          P.key.position.set(-2, 13, zNow + 4);
          const atStation = k > 0.6 && k < 7.6;
          const hold = 1 - Math.min(1, Math.abs(k - Math.round(k)) * 2.4);
          const hot = atStation ? hold : (Math.round(k) === 9 ? hold : 0);
          const su = c.swarm.u;
          su.uSt.value.set(SX, 0, Math.round(k) === 9 ? -272 : ZS(js));
          su.uWeld.value = 0.7 + ((t * 0.4) % 1) * 7.2;
          su.uHot.value = hot;
          P.sparkU.uO.value.set(atStation ? SX + 1.5 : Math.round(k) === 9 ? 0 : -11, atStation || Math.round(k) === 9 ? su.uWeld.value : 3.2, atStation ? ZS(js) + 1.2 : Math.round(k) === 9 ? -270 : -6);
          P.sparkU.uRate.value = 0.1 + hot * 0.38 + (k < 0.6 ? 0.2 : 0);
          P.guideU.uZ.value = zNow;
          for (const cm of P.coneMats) cm.m.uniforms.uI.value = 0.07 + 0.16 * Math.exp(-Math.abs(cm.z - zNow) * 0.05);
          P.ringMats.forEach((rm, i) => rm.color.copy(c.acc).multiplyScalar(i === js && atStation ? 2.2 + Math.sin(t * 3) * 0.4 : 0.55));
          // the hero holds the skill tree over the hall: the hall stays low until the first station
          c.renderer.toneMappingExposure = lerp(0.58, 1, sstep(0.55, 1, k)) * lerp(1, 0.82, sstep(7.6, 8.2, k) * (1 - sstep(8.6, 9, k)));
          P.day.color.setRGB(1.35, 1.2, 1.02).multiplyScalar(sstep(9.4, 10, k));
          P.furnL.intensity = 240 * (0.85 + 0.15 * Math.sin(t * 7.1) * Math.sin(t * 3.3));
        },
      };
    },
  };

  /* the swarm's shapes, one per chapter */
  const steelC = [0.28, 0.3, 0.34], hotC = [1, 0.42, 0.1];
  const form = (pts, s, glowFrac = 0.06, place, lift = 3, glow = 1.6) => {
    const p = new Float32Array(N * 3), c = new Float32Array(N * 4), sz = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const q = pts[i % Math.max(1, pts.length)] || [0, 0, 0];
      const [x, y, z] = place(q, i);
      p[i * 3] = x; p[i * 3 + 1] = y; p[i * 3 + 2] = z;
      const hot = rnd(i + 5, 21) < glowFrac;
      const l = 0.85 + rnd(i, 22) * 0.3;
      const col = hot ? hotC : steelC;
      c[i * 4] = col[0] * l; c[i * 4 + 1] = col[1] * l; c[i * 4 + 2] = col[2] * l; c[i * 4 + 3] = hot ? glow : 0;
      sz[i] = i < pts.length ? s * 0.84 : 0;
    }
    return { p, c, s: sz, lift };
  };
  const at = (cx, cy, cz, yaw) => (q) => [cx + q[0] * Math.cos(yaw) + q[2] * Math.sin(yaw), cy + q[1], cz - q[0] * Math.sin(yaw) + q[2] * Math.cos(yaw)];
  const YAW = 0.42;
  const forms = [
    // hero: raw stock in a heap by the furnace, some of it still glowing
    () => { const pts = Array.from({ length: N }, (_, i) => { const a = rnd(i, 1) * TAU, r = Math.sqrt(rnd(i, 2)) * 7.5, h = Math.max(0, 3.2 - r * 0.45) * rnd(i, 3); return [Math.cos(a) * r, 0.3 + h, Math.sin(a) * r * 0.7]; });
      return form(pts, 0.55, 0.1, (q) => [-6 + q[0], q[1], -16 + q[2]], 2, 0.7); },
    ...MASKS.map((mask, j) => () => {
      const asp = [1.55, 1.4, 0.55, 1.45, 1.3, 1.0, 1.45][j], H = j === 2 ? 6.4 : 4.6;
      const v = vox(mask, N, H * asp, H, j === 5 ? 1.4 : 1.1);
      return form(v.pts, v.s, 0.05, at(SX, 1.0 + H / 2, ZS(j), YAW), 4);
    }),
    // process: five platforms rising across the hall, one per step
    () => { const pts = []; const per = Math.floor(N / 5);
      for (let s = 0; s < 5; s++) for (let i = 0; i < per; i++) { const gx = i % 8, gz = Math.floor(i / 8) % 8, gy = Math.floor(i / 64); pts.push([(gx - 3.5) * 0.62 + (s - 2) * 6.5, gy * 0.62 + s * 1.7 + 0.4, (gz - 3.5) * 0.62 - s * 3.2]); }
      return form(pts, 0.62, 0.04, (q) => [q[0] - 3, q[1], -238 + q[2]], 5); },
    // vow: a seal forged hot, a ring with a crown of rivets, the words held in its dark middle
    () => { const v = vox((u, w) => ring(u, w, 0.8, 0.99) || (ring(u, w, 0.62, 0.7) && Math.cos(Math.atan2(w, u) * 24) > 0.3), N, 15, 15, 1.2);
      return form(v.pts, v.s, 0.3, at(0, 8.6, -276, 0), 6, 0.8); },
    // end: the gate, the blocks stacked as its two posts and lintel, the day beyond
    () => { const v = vox((u, w) => (Math.abs(Math.abs(u) - 1.05) < 0.22 && w < 0.7) || (w > 0.62 && w < 0.96 && Math.abs(u) < 1.4), N, 16, 11.5, 1.6);
      return form(v.pts, v.s, 0.04, at(0, 5.9, -300, 0), 4); },
  ];
  spec.chapters.forEach((c, i) => { c.swarm = forms[i]; });

  /* the cards: the page's real screens on the line, each service's three come down at its station */
  const hang = (i, t, o, ctx, zc, spread = 7.5) => {
    const z = zc + 6 - ((i * spread + t * 1.2) % (12 * spread)) * 0.5;
    o.p.set(-13.2, 9.6 + Math.sin(t * 1.3 + i) * 0.08, z);
    ctx.yaw(o, Math.PI / 2 - 0.25, 0, Math.sin(t * 0.9 + i * 1.7) * 0.03);
    o.s = 0.8; o.f = 0.75; o.lift = 1.5;
  };
  const cardsAt = (j) => (i, t, o, ctx) => {
    hang(i, t, o, ctx, ZS(j) - 4);
    if (GROUP[Math.floor(i / 3)] !== j) return;
    const s = i % 3;   // this service's own screens come down the line, lit, beside its station
    o.p.set(-12.4 + s * 0.4, 6.4 + Math.sin(t * 0.8 + i) * 0.1, ZS(j) - 3 - s * 3.4);
    ctx.yaw(o, Math.PI / 2 - 0.5, 0, 0);
    o.s = 1; o.f = 1; o.focus = 1;
  };
  const cards = [
    (i, t, o, ctx) => hang(i, t, o, ctx, -4, 9),
    ...Array.from({ length: 7 }, (_, j) => cardsAt(j)),
    (i, t, o, ctx) => { const s = i % 5; o.p.set((s - 2) * 6.5 - 3 + (i >= 5 ? 1.6 : -1.6) * (i % 2), s * 1.7 + 3.4 + Math.floor(i / 5) * 0.4, -238 - s * 3.2 - 2.4 - Math.floor(i / 5) * 0.8);
      ctx.face(o, ctx.camPos[8], 0, 0, 0); o.s = 0.6; o.f = 0.9; },
    (i, t, o, ctx) => { const a = (i / 12) * TAU + t * 0.12; o.p.set(Math.cos(a) * 10.5, 8.6 + Math.sin(a) * 9, -278 + Math.sin(a * 2 + t) * 0.6);
      ctx.face(o, ctx.camPos[9]); o.s = 0.55; o.f = 0.95; },
    (i, t, o, ctx) => { const r = ctx.R[i]; o.p.set((r[0] - 0.5) * 24, 6 + r[1] * 9, -306 - r[2] * 12 + Math.sin(t * 0.4 + i) * 0.5);
      ctx.face(o, ctx.camPos[10], 0, (r[3] - 0.5) * 0.4); o.s = 0.85; o.f = 0.85; },
  ];
  spec.chapters.forEach((c, i) => { c.cards = cards[i]; });
  return startDim(spec, opts);
}
