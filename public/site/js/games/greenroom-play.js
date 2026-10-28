// greenroom-play.js: the Green Room page's game (2026-10-28 rebuild): a 3D snooker table, "clear the colours".
// Nothing here touches the real app: no prizes, no payment. (The old prize-style wheel is gone.)
//   table    three.js: felt with its markings, cushions with real jaws, six pockets, a polished wooden frame. The
//            canvas is transparent, so the hall of js/dims/greenroom.js (or the page's poster world) shows around it.
//            Landscape screens see it from the long side, a phone from the baulk end.
//   physics  our own, in the plane of the felt: rolling friction, elastic ball-to-ball contact, cushions and jaws as
//            segments (a ball can rattle in the jaws), pockets that swallow a ball that reaches them. No spin.
//   play     pull back from the cue ball (drag), aim by the dotted guide (ghost ball, the object ball's line, the cue
//            ball's deflection), release to strike; the pull is the power. Keyboard on the cue ball: arrows aim
//            (Shift for fine), up and down set the power, Space or Enter strikes.
//   game     the six colours in order, yellow to black, against a 90 s clock that starts on the first strike. A colour
//            out of order goes back on its spot; the cue ball in a pocket costs 4. Clearing adds the seconds left.
//            The best score stays in this browser (localStorage, guarded).
//   intro    the app's real intro film plays on the phone while it is on screen.
// One frame loop in demand mode: it sleeps off-screen and when nothing moves; the clock pauses off-screen too.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createFrameLoop } from '../../hero/kit/frame-loop.js';
import { createGovernor } from '../../hero/kit/quality.js';
import { detectGpu } from '../../hero/kit/gpu-profile.js';

const HX = 1.78, HZ = 0.89, R = 0.034, CG = 0.088, MG = 0.064, RAIL = 0.2, CUSH = 0.045;
const BAULK = -HX + 0.737, DR = 0.292, ROUND = 90, BEST_KEY = 'nadavai.gr.best';
const TAU = Math.PI * 2;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const COLOURS = [
  { k: 'yellow', name: __t('greenroom.clear.color.yellow'), v: 2, c: 0xf2c014, css: '#F2C014', spot: [BAULK, DR] },
  { k: 'green', name: __t('greenroom.clear.color.green'), v: 3, c: 0x0f8a45, css: '#1FA35A', spot: [BAULK, -DR] },
  { k: 'brown', name: __t('greenroom.clear.color.brown'), v: 4, c: 0x7a4120, css: '#9A5A32', spot: [BAULK, 0] },
  { k: 'blue', name: __t('greenroom.clear.color.blue'), v: 5, c: 0x1b4fd0, css: '#3D74F0', spot: [0, 0] },
  { k: 'pink', name: __t('greenroom.clear.color.pink'), v: 6, c: 0xf08db4, css: '#F08DB4', spot: [HX / 2, 0] },
  { k: 'black', name: __t('greenroom.clear.color.black'), v: 7, c: 0x101010, css: '#2A2D31', spot: [HX - 0.324, 0] },
];
const CUE_SPOT = [BAULK - 0.17, 0.11];
// pockets: centres just outside the cushion lines, a capture radius each
const POCKETS = [[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([sx, sz]) => ({ x: sx * (HX + 0.02), z: sz * (HZ + 0.02), r: 0.074, vr: 0.085 }))
  .concat([-1, 1].map((sz) => ({ x: 0, z: sz * (HZ + 0.036), r: 0.06, vr: 0.072 })));

export function init(stage, { reduce }) {
  table(stage.querySelector('.snk__wrap'), { reduce });
  intro(stage.querySelector('.gr__intro'), { reduce });
}

/* cushions and jaws as segments [x1, z1, x2, z2] */
function cushionSegments() {
  // [x1, z1, x2, z2, outX, outZ]: the cushion noses carry their outward normal, the jaws carry none
  const s = [], J = 0.042;
  for (const sz of [-1, 1]) {
    const z = sz * HZ;
    s.push([-HX + CG, z, -MG, z, 0, sz], [MG, z, HX - CG, z, 0, sz]);
    s.push([-HX + CG, z, -HX + CG - J, z + sz * J], [HX - CG, z, HX - CG + J, z + sz * J]);   // corner jaws
    s.push([-MG, z, -MG + 0.006, z + sz * 0.05], [MG, z, MG - 0.006, z + sz * 0.05]);       // middle jaws
  }
  for (const sx of [-1, 1]) {
    const x = sx * HX;
    s.push([x, -HZ + CG, x, HZ - CG, sx, 0]);
    s.push([x, -HZ + CG, x + sx * J, -HZ + CG - J], [x, HZ - CG, x + sx * J, HZ - CG + J]);
  }
  return s;
}

/* the wooden frame: a rounded rectangle with the playing area and the six pocket mouths cut out */
function frameShape() {
  const A = HX + CUSH, B = HZ + CUSH, OA = HX + RAIL, OB = HZ + RAIL, rr = 0.07;
  const outer = new THREE.Shape();
  outer.moveTo(-OA + rr, -OB); outer.lineTo(OA - rr, -OB); outer.quadraticCurveTo(OA, -OB, OA, -OB + rr);
  outer.lineTo(OA, OB - rr); outer.quadraticCurveTo(OA, OB, OA - rr, OB); outer.lineTo(-OA + rr, OB);
  outer.quadraticCurveTo(-OA, OB, -OA, OB - rr); outer.lineTo(-OA, -OB + rr); outer.quadraticCurveTo(-OA, -OB, -OA + rr, -OB);
  const pts = [];
  const arc = (cx, cz, r, a0, d, n = 18) => { for (let i = 0; i <= n; i++) { const a = a0 + (d * i) / n; pts.push(new THREE.Vector2(cx + Math.cos(a) * r, cz + Math.sin(a) * r)); } };
  // an arc from a0 to a1 that runs around the outside of the pocket (through the outward angle aO)
  const norm = (x) => Math.atan2(Math.sin(x), Math.cos(x));
  const arcOut = (cx, cz, r, a0, a1, aO, n) => {
    let d = norm(a1 - a0); const t = norm(aO - a0);
    if (!(Math.sign(t) === Math.sign(d) && Math.abs(t) < Math.abs(d))) d -= Math.sign(d) * TAU;
    arc(cx, cz, r, a0, d, n);
  };
  const corner = (sx, sz, fromSide) => {
    const p = POCKETS.find((q) => q.x !== 0 && Math.sign(q.x) === sx && Math.sign(q.z) === sz), r = p.vr;
    const hE = Math.sqrt(r * r - (B - Math.abs(p.z)) ** 2), hS = Math.sqrt(r * r - (A - Math.abs(p.x)) ** 2);
    const aE = Math.atan2(sz * B - p.z, -sx * hE), aS = Math.atan2(-sz * hS, sx * A - p.x);
    arcOut(p.x, p.z, r, fromSide ? aS : aE, fromSide ? aE : aS, Math.atan2(sz, sx), 22);
  };
  const middle = (sz) => {
    const p = POCKETS.find((q) => q.x === 0 && Math.sign(q.z) === sz), r = p.vr, h = Math.sqrt(r * r - (B - Math.abs(p.z)) ** 2);
    const aL = Math.atan2(sz * B - p.z, -h), aR = Math.atan2(sz * B - p.z, h);
    if (sz < 0) arcOut(0, p.z, r, aL, aR, -Math.PI / 2, 16); else arcOut(0, p.z, r, aR, aL, Math.PI / 2, 16);
  };
  corner(-1, -1, true); middle(-1); corner(1, -1, false); corner(1, 1, true); middle(1); corner(-1, 1, false);
  const hole = new THREE.Path(pts);
  outer.holes.push(hole);
  return outer;
}

function feltTexture() {
  const W = 2048, H = Math.round(W * (HZ + CUSH) / (HX + CUSH)), cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  const gr = g.createRadialGradient(W / 2, H / 2, H * 0.1, W / 2, H / 2, W * 0.62);
  gr.addColorStop(0, '#1c8a47'); gr.addColorStop(0.6, '#157138'); gr.addColorStop(1, '#0d5228');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  const img = g.getImageData(0, 0, W, H), d = img.data;
  for (let i = 0; i < d.length; i += 4) { const n = (Math.random() - 0.5) * 10; d[i] += n; d[i + 1] += n; d[i + 2] += n; }
  g.putImageData(img, 0, 0);
  const X = (x) => ((x + HX + CUSH) / (2 * (HX + CUSH))) * W, Z = (z) => ((z + HZ + CUSH) / (2 * (HZ + CUSH))) * H, k = W / (2 * (HX + CUSH));
  g.strokeStyle = 'rgba(255,255,255,.42)'; g.lineWidth = 2.2;
  g.beginPath(); g.moveTo(X(BAULK), Z(-HZ)); g.lineTo(X(BAULK), Z(HZ)); g.stroke();
  g.beginPath(); g.arc(X(BAULK), Z(0), DR * k, Math.PI / 2, Math.PI * 1.5); g.stroke();
  g.fillStyle = 'rgba(255,255,255,.5)';
  for (const c of COLOURS) { g.beginPath(); g.arc(X(c.spot[0]), Z(c.spot[1]), 3.2, 0, TAU); g.fill(); }
  // the club's mark, faint on the cloth
  g.save(); g.globalAlpha = 0.07; g.fillStyle = '#E4C57E'; g.font = `800 ${Math.round(H * 0.26)}px Georgia, serif`; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText('GR', X(HX / 2 - 0.2), Z(0)); g.restore();
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8;
  return t;
}

function table(box, { reduce }) {
  if (!box) return;
  const hasGL = !!document.createElement('canvas').getContext('webgl2');
  if (!hasGL) { box.classList.add('is-static'); return; }
  const wrap = box.querySelector('.snk__stage'), canvas = box.querySelector('.snk__gl'), grab = box.querySelector('.snk__grab');
  const el = (k) => box.querySelector(`[data-snk="${k}"]`);
  const timeEl = el('time'), scoreEl = el('score'), bestEl = el('best'), msgEl = el('msg'), live = el('live');
  const callEl = box.querySelector('.snk__call'), endEl = box.querySelector('.snk__end'), coach = box.querySelector('.snk__coach');
  const order = [...box.querySelectorAll('.snk__order li')];
  const appCol = new THREE.Color('#E4C57E');
  let best = 0; try { best = +(localStorage.getItem(BEST_KEY) || 0) || 0; } catch { best = 0; }
  bestEl.textContent = best ? String(best) : '0';

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0, 0);
  renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  const envRT = pmrem.fromScene(new RoomEnvironment(), 0.03); pmrem.dispose();
  scene.environment = envRT.texture; scene.environmentIntensity = 0.55;
  scene.add(new THREE.HemisphereLight(0xfff1d6, 0x0a0604, 0.35));
  // the canopy over the table: a warm key from above that throws the balls' shadows, two soft lamps along it
  const key = new THREE.DirectionalLight(0xffe2b8, 2.3); key.position.set(0.3, 4.2, 0.5); key.target.position.set(0, 0, 0);
  key.castShadow = true; key.shadow.mapSize.set(2048, 1024); key.shadow.bias = -0.0003; key.shadow.normalBias = 0.01; key.shadow.radius = 4;
  Object.assign(key.shadow.camera, { left: -2.1, right: 2.1, top: 1.2, bottom: -1.2, near: 2, far: 6 });
  scene.add(key, key.target);
  for (const x of [-0.9, 0.9]) { const l = new THREE.PointLight(0xffd7a0, 1.1, 3.2, 2); l.position.set(x, 1.1, 0); scene.add(l); }
  const camera = new THREE.PerspectiveCamera(36, 1, 0.05, 30);

  /* the table */
  const felt = new THREE.Mesh(new THREE.PlaneGeometry(2 * (HX + CUSH), 2 * (HZ + CUSH)), new THREE.MeshStandardMaterial({ map: feltTexture(), roughness: 0.92, metalness: 0 }));
  felt.rotation.x = -Math.PI / 2; felt.receiveShadow = true; scene.add(felt);
  const cushMat = new THREE.MeshStandardMaterial({ color: 0x0f6a33, roughness: 0.85 });
  const SEG = cushionSegments();
  for (const [x1, z1, x2, z2, ox, oz] of SEG) {
    if (ox === undefined) continue;   // the jaws are drawn by the frame's cut
    const len = Math.hypot(x2 - x1, z2 - z1), a = Math.atan2(z2 - z1, x2 - x1);
    // the rubber sits behind its nose line, away from the bed
    const m = new THREE.Mesh(new THREE.BoxGeometry(len, 0.044, CUSH), cushMat);
    m.position.set((x1 + x2) / 2 + ox * CUSH / 2, 0.022, (z1 + z2) / 2 + oz * CUSH / 2); m.rotation.y = -a; m.receiveShadow = true; scene.add(m);
  }
  const wood = new THREE.MeshPhysicalMaterial({ color: 0x4a2312, roughness: 0.38, clearcoat: 1, clearcoatRoughness: 0.12, envMapIntensity: 0.9 });
  const frameG = new THREE.ExtrudeGeometry(frameShape(), { depth: 0.07, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 10 });
  const frame = new THREE.Mesh(frameG, wood); frame.rotation.x = Math.PI / 2; frame.position.y = 0.062; frame.receiveShadow = true; scene.add(frame);
  const apron = new THREE.Mesh(new THREE.BoxGeometry(2 * (HX + RAIL) - 0.04, 0.2, 2 * (HZ + RAIL) - 0.04), wood); apron.position.y = -0.11; scene.add(apron);
  const holeMat = new THREE.MeshBasicMaterial({ color: 0x020202 });
  const brass = new THREE.MeshStandardMaterial({ color: 0xb8954f, metalness: 1, roughness: 0.3 });
  for (const p of POCKETS) {
    const d = new THREE.Mesh(new THREE.CircleGeometry(p.vr, 28), holeMat); d.rotation.x = -Math.PI / 2; d.position.set(p.x, 0.0015, p.z); scene.add(d);
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(p.vr, p.vr * 0.8, 0.12, 24, 1, true), holeMat); cup.position.set(p.x, 0.0, p.z); scene.add(cup);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(p.vr + 0.004, 0.007, 8, 32), brass); rim.rotation.x = Math.PI / 2; rim.position.set(p.x, 0.064, p.z); scene.add(rim);
  }

  /* balls */
  const ballGeo = new THREE.SphereGeometry(R, 36, 24);
  const mkBall = (k, c) => {
    const m = new THREE.Mesh(ballGeo, new THREE.MeshPhysicalMaterial({ color: c, roughness: 0.12, clearcoat: 1, clearcoatRoughness: 0.05, envMapIntensity: 1.1 }));
    m.castShadow = true; scene.add(m);
    return { k, m, x: 0, z: 0, vx: 0, vz: 0, on: true, sink: null };
  };
  const cue = mkBall('cue', 0xf4f1e6);
  const cols = COLOURS.map((c) => Object.assign(mkBall(c.k, c.c), { c }));
  const balls = [cue, ...cols];
  // the target's halo on the felt
  const halo = new THREE.Mesh(new THREE.RingGeometry(R * 1.35, R * 1.75, 40), new THREE.MeshBasicMaterial({ color: appCol, transparent: true, opacity: 0.85, depthWrite: false }));
  halo.rotation.x = -Math.PI / 2; scene.add(halo);

  /* the cue and the guide */
  const cueG = new THREE.Group(); scene.add(cueG);
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.0062, 0.0135, 1.45, 18), new THREE.MeshStandardMaterial({ color: 0xd8b46c, roughness: 0.45 }));
  stick.rotation.z = -Math.PI / 2; stick.position.x = -0.735 - 0.012; cueG.add(stick);
  const butt = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.0142, 0.5, 18), new THREE.MeshStandardMaterial({ color: 0x2a1408, roughness: 0.4 }));
  butt.rotation.z = -Math.PI / 2; butt.position.x = -1.21; cueG.add(butt);
  const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.0062, 0.0062, 0.024, 16), new THREE.MeshStandardMaterial({ color: 0xf2efe6, roughness: 0.6 }));
  tip.rotation.z = -Math.PI / 2; tip.position.x = -0.012; cueG.add(tip);
  cueG.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  cueG.visible = false;
  const dotGeo = new THREE.CircleGeometry(0.0085, 12).rotateX(-Math.PI / 2);
  const mkDots = (n, col, op) => { const m = new THREE.InstancedMesh(dotGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: op, depthWrite: false }), n); m.frustumCulled = false; m.count = 0; scene.add(m); return m; };
  const dotsCue = mkDots(80, 0xffffff, 0.85), dotsObj = mkDots(30, 0xffffff, 0.95), dotsDef = mkDots(24, 0xffffff, 0.4);
  const ghost = new THREE.Mesh(new THREE.RingGeometry(R * 0.86, R, 36).rotateX(-Math.PI / 2), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.8, depthWrite: false }));
  ghost.visible = false; scene.add(ghost);

  /* game state */
  let target = 0, score = 0, timeLeft = ROUND, running = false, over = false, moving = false, shotPots = [], firstStrike = false, visible = true;
  let aim = { a: 0, p: 0.55, on: false }, drag = null, strike = null;
  function place(b, x, z) { b.x = x; b.z = z; b.vx = b.vz = 0; b.on = true; b.sink = null; b.m.visible = true; b.m.position.set(x, R, z); }
  function freeSpot(x, z) {
    // a colour goes back on its own spot; if that is taken, the nearest free point toward the top cushion
    for (let i = 0; i < 80; i++) { const xx = clamp(x + i * 0.02, -HX + R, HX - R); if (balls.every((b) => !b.on || Math.hypot(b.x - xx, b.z - z) > 2 * R + 0.002)) return [xx, z]; }
    return [x, z];
  }
  function rack() {
    place(cue, ...CUE_SPOT);
    cols.forEach((b) => place(b, ...b.c.spot));
    target = 0; score = 0; timeLeft = ROUND; running = false; over = false; firstStrike = false; shotPots = [];
    endEl.hidden = true; wrap.classList.remove('is-end', 'has-struck');
    aimAtTarget(); paint(); say(__t('greenroom.clear.msg.start'));
    loop?.invalidate();
  }
  function paint() {
    scoreEl.textContent = String(score);
    const s = Math.max(0, Math.ceil(timeLeft)); timeEl.textContent = `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
    wrap.classList.toggle('is-late', running && timeLeft < 15);
    order.forEach((li, i) => { li.classList.toggle('is-done', i < target); li.classList.toggle('is-now', i === target && !over); });
    const t = cols[target];
    if (t && t.on && !over) { halo.visible = true; halo.position.set(t.x, 0.002, t.z); } else halo.visible = false;
  }
  const say = (t) => { msgEl.textContent = t; };
  function call(t, good) {
    callEl.textContent = t; callEl.dataset.kind = good ? 'good' : 'bad';
    wrap.classList.remove('is-call'); void wrap.offsetWidth; wrap.classList.add('is-call');
  }
  function aimAtTarget() { const t = cols[target]; if (t?.on) aim.a = Math.atan2(t.z - cue.z, t.x - cue.x); }

  /* physics: 240 Hz steps in the plane of the felt */
  function step(dt) {
    if (!moving) return;
    for (const b of balls) {
      if (b.sink) { b.sink.t += dt; continue; }
      if (!b.on) continue;
      const sp = Math.hypot(b.vx, b.vz);
      if (sp > 0) { const ns = Math.max(0, sp - (0.26 + 0.14 * sp) * dt); b.vx *= ns / sp; b.vz *= ns / sp; }
      b.x += b.vx * dt; b.z += b.vz * dt;
    }
    for (let i = 0; i < balls.length; i++) {
      const a = balls[i]; if (!a.on || a.sink) continue;
      for (let j = i + 1; j < balls.length; j++) {
        const b = balls[j]; if (!b.on || b.sink) continue;
        const dx = b.x - a.x, dz = b.z - a.z, d2 = dx * dx + dz * dz, m = 2 * R;
        if (d2 >= m * m || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, nz = dz / d, o = (m - d) / 2;
        a.x -= nx * o; a.z -= nz * o; b.x += nx * o; b.z += nz * o;
        const rel = (a.vx - b.vx) * nx + (a.vz - b.vz) * nz;
        if (rel <= 0) continue;
        const k = rel * (1 + 0.94) / 2;
        a.vx -= k * nx; a.vz -= k * nz; b.vx += k * nx; b.vz += k * nz;
      }
    }
    for (const b of balls) {
      if (!b.on || b.sink) continue;
      for (const [x1, z1, x2, z2] of SEG) {
        const ex = x2 - x1, ez = z2 - z1, l2 = ex * ex + ez * ez;
        const t = clamp(((b.x - x1) * ex + (b.z - z1) * ez) / l2, 0, 1), cx = x1 + ex * t, cz = z1 + ez * t;
        const dx = b.x - cx, dz = b.z - cz, d2 = dx * dx + dz * dz;
        if (d2 >= R * R || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, nz = dz / d;
        b.x = cx + nx * R; b.z = cz + nz * R;
        const vn = b.vx * nx + b.vz * nz;
        if (vn < 0) { b.vx -= (1 + 0.76) * vn * nx; b.vz -= (1 + 0.76) * vn * nz; b.vx *= 0.97; b.vz *= 0.97; }
      }
      for (const p of POCKETS) if (Math.hypot(b.x - p.x, b.z - p.z) < p.r) { pot(b, p); break; }
      if (!b.sink && (Math.abs(b.x) > HX + 0.06 || Math.abs(b.z) > HZ + 0.06)) { const p = POCKETS.reduce((q, c) => (Math.hypot(b.x - c.x, b.z - c.z) < Math.hypot(b.x - q.x, b.z - q.z) ? c : q)); pot(b, p); }
    }
    if (balls.every((b) => !b.on || b.sink?.t > 0.3 || (!b.sink && Math.hypot(b.vx, b.vz) < 0.006))) settle();
  }
  function pot(b, p) {
    b.sink = { t: 0, x0: b.x, z0: b.z, px: p.x, pz: p.z }; b.vx = b.vz = 0;
    shotPots.push(b);
  }
  function settle() {
    moving = false;
    balls.forEach((b) => { b.vx = b.vz = 0; if (b.sink) { b.on = false; b.m.visible = false; b.sink = null; } });
    let gained = 0, foul = '';
    for (const b of shotPots) {
      if (b === cue) { foul = __t('greenroom.clear.foul.cue'); score = Math.max(0, score - 4); continue; }
      if (b === cols[target]) { gained += b.c.v; target++; }
      else { const [x, z] = freeSpot(...b.c.spot); place(b, x, z); foul = foul || __t('greenroom.clear.foul.order', { color: b.c.name, target: cols[target].c.name }); }
    }
    // a colour potted in order earlier in this shot may have made the next one legal too
    score += gained;
    if (!cue.on) { const [x, z] = freeSpot(...CUE_SPOT); place(cue, x, z); }
    if (gained) { const last = cols[target - 1]; call(__t('greenroom.clear.call.potted', { color: last.c.name, n: gained }), true); say(target < cols.length ? __t('greenroom.clear.msg.next', { color: cols[target].c.name, n: cols[target].c.v }) : __t('greenroom.clear.msg.clear')); live.textContent = __t('greenroom.clear.live.potted', { color: last.c.name, score: score }); }
    if (foul) { call(foul.split(':')[0], false); say(foul); live.textContent = foul; }
    if (!gained && !foul && firstStrike && target < cols.length) say(__t('greenroom.clear.msg.next', { color: cols[target].c.name, n: cols[target].c.v }));
    shotPots = [];
    if (target >= cols.length) finish(true);
    else if (running && timeLeft <= 0) finish(false);
    else { aimAtTarget(); }
    paint(); loop.invalidate();
  }
  function shoot(a, p) {
    if (moving || over || !cue.on) return;
    if (!firstStrike) { firstStrike = true; running = true; wrap.classList.add('has-struck'); }
    const v = 0.3 + p * 4.0;
    strike = { t: 0, a, p, v };
    hideGuide();
    if (reduce) { cue.vx = Math.cos(a) * v; cue.vz = Math.sin(a) * v; strike = null; cueG.visible = false; moving = true; }
    loop.invalidate();
  }
  function finish(cleared) {
    running = false; over = true;
    const bonus = cleared ? Math.ceil(timeLeft) : 0;
    score += bonus;
    const isBest = score > best;
    if (isBest) { best = score; try { localStorage.setItem(BEST_KEY, String(best)); } catch { /* private mode: the best lives for this visit only */ } }
    bestEl.textContent = best ? String(best) : '0';
    endEl.querySelector('.snk__end-k').textContent = cleared ? __t('greenroom.clear.msg.clear') : __t('greenroom.clear.end.k.time');
    endEl.querySelector('.snk__end-h').textContent = __t('greenroom.clear.end.h', { n: score });
    endEl.querySelector('.snk__end-p').textContent = (cleared ? __t('greenroom.clear.end.p.clear.proto', { points: score - bonus, bonus: bonus, best: '' }).trim() : __t('greenroom.clear.end.p.time', { color: cols[Math.min(target, 5)].c.name })) + ' ' + (isBest ? __t('greenroom.clear.end.best.new') : cleared ? '' : __t('greenroom.clear.end.best.yours', { n: best }));
    endEl.hidden = false; wrap.classList.add('is-end');
    live.textContent = __t('greenroom.clear.live.end', { title: endEl.querySelector('.snk__end-k').textContent, n: score });
    if (box.contains(document.activeElement)) endEl.querySelector('button').focus({ preventScroll: true });
    paint();
  }

  /* the guide: where the cue ball meets the first ball (or cushion), where that ball goes, where the cue ball goes */
  const m4 = new THREE.Matrix4(), V = new THREE.Vector3();
  function setDots(mesh, x0, z0, dx, dz, len, gap = 0.035) {
    const n = Math.min(mesh.instanceMatrix.count, Math.max(0, Math.floor(len / gap)));
    for (let i = 0; i < n; i++) { V.set(x0 + dx * gap * (i + 1), 0.003, z0 + dz * gap * (i + 1)); m4.makeTranslation(V.x, V.y, V.z); mesh.setMatrixAt(i, m4); }
    mesh.count = n; mesh.instanceMatrix.needsUpdate = true;
  }
  function wallDist(x, z, dx, dz, r = R) {
    let t = Infinity;
    if (dx > 1e-6) t = Math.min(t, (HX - r - x) / dx); if (dx < -1e-6) t = Math.min(t, (-HX + r - x) / dx);
    if (dz > 1e-6) t = Math.min(t, (HZ - r - z) / dz); if (dz < -1e-6) t = Math.min(t, (-HZ + r - z) / dz);
    return Math.max(0, t);
  }
  function showGuide() {
    if (!cue.on || moving || over) { hideGuide(); return; }
    const dx = Math.cos(aim.a), dz = Math.sin(aim.a);
    let hit = null, tMin = wallDist(cue.x, cue.z, dx, dz);
    for (const b of cols) {
      if (!b.on) continue;
      const ox = b.x - cue.x, oz = b.z - cue.z, pr = ox * dx + oz * dz; if (pr <= 0) continue;
      const pe2 = ox * ox + oz * oz - pr * pr, rr = 4 * R * R; if (pe2 >= rr) continue;
      const t = pr - Math.sqrt(rr - pe2); if (t < tMin) { tMin = t; hit = b; }
    }
    setDots(dotsCue, cue.x, cue.z, dx, dz, Math.max(0, tMin - R * 0.6));
    const gx = cue.x + dx * tMin, gz = cue.z + dz * tMin;
    ghost.visible = true; ghost.position.set(gx, 0.004, gz);
    if (hit) {
      let nx = hit.x - gx, nz = hit.z - gz; const nl = Math.hypot(nx, nz); nx /= nl; nz /= nl;
      dotsObj.material.color.set(hit.c.c === 0x101010 ? 0xbfc5cc : hit.c.c);
      setDots(dotsObj, hit.x, hit.z, nx, nz, Math.min(0.55, wallDist(hit.x, hit.z, nx, nz) + 0.06), 0.03);
      let tx = dx - (dx * nx + dz * nz) * nx, tz = dz - (dx * nx + dz * nz) * nz; const tl = Math.hypot(tx, tz);
      if (tl > 0.05) { tx /= tl; tz /= tl; setDots(dotsDef, gx, gz, tx, tz, Math.min(0.24 * tl, wallDist(gx, gz, tx, tz))); } else dotsDef.count = 0;
      ghost.material.color.set(hit === cols[target] ? appCol : 0xff7a59);
    } else {
      dotsObj.count = 0;
      // off a cushion: the reflection
      const rx = Math.abs(Math.abs(gx) - (HX - R)) < 1e-3 ? -dx : dx, rz = Math.abs(Math.abs(gz) - (HZ - R)) < 1e-3 ? -dz : dz;
      setDots(dotsDef, gx, gz, rx, rz, Math.min(0.35, wallDist(gx, gz, rx, rz)));
      ghost.material.color.set(0xffffff);
    }
    // the cue, pulled back by the power
    const back = R + 0.02 + aim.p * 0.22;
    cueG.visible = true; cueG.position.set(cue.x - dx * back, R + 0.012, cue.z - dz * back);
    cueG.rotation.set(0, -aim.a, -0.09, 'YZX');
    wrap.style.setProperty('--snk-p', aim.p.toFixed(3));
  }
  function hideGuide() { dotsCue.count = dotsObj.count = dotsDef.count = 0; ghost.visible = false; if (!strike) cueG.visible = false; }

  /* camera: the long side on a landscape stage, the baulk end on a portrait one; framed to the table */
  const L = { W: 1, H: 1 };
  const look = new THREE.Vector3();
  function layout() {
    const r = wrap.getBoundingClientRect(), W = Math.max(1, r.width), H = Math.max(1, r.height), port = H > W * 1.05;
    Object.assign(L, { W, H, port });
    renderer.setSize(W, H, false);
    camera.aspect = W / H;
    if (port) { camera.position.set(-2.15, 3.55, 0); look.set(0.3, -0.1, 0); }
    else { camera.position.set(0, 2.45, 2.15); look.set(0, -0.06, 0.1); }
    camera.lookAt(look); camera.updateMatrixWorld();
    const pts = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) pts.push(new THREE.Vector3(sx * (HX + RAIL), 0.07, sz * (HZ + RAIL)).applyMatrix4(camera.matrixWorldInverse));
    const fits = (fov) => {
      const f = (H / 2) / Math.tan(THREE.MathUtils.degToRad(fov) / 2);
      return pts.every((q) => { const sx = W / 2 + (q.x / -q.z) * f, sy = H / 2 - (q.y / -q.z) * f; return sx > 10 && sx < W - 10 && sy > H * (port ? 0.13 : 0.15) && sy < H - 12; });
    };
    let lo = 10, hi = 90; for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (fits(m)) hi = m; else lo = m; }
    camera.fov = hi; camera.updateProjectionMatrix();
    placeGrab(); loop?.invalidate();
  }
  const proj = new THREE.Vector3();
  function placeGrab() {
    proj.set(cue.x, R, cue.z).project(camera);
    const x = (proj.x * 0.5 + 0.5) * L.W, y = (-proj.y * 0.5 + 0.5) * L.H;
    // physical coordinates from the projection: placed by left/top, not by the reading side
    grab.style.transform = `translate(${x}px, ${y}px)`;
    const cw = coach.offsetWidth || 220;
    coach.style.left = `${clamp(x - cw / 2, 10, L.W - cw - 10)}px`;
    coach.style.top = `${clamp(y + (L.port ? -96 : 44), 10, L.H - 50)}px`;
  }

  /* input: pull back from the cue ball. On touch the pull starts on the ball (the page still scrolls elsewhere);
     with a mouse it can start anywhere on the table */
  const ray = new THREE.Raycaster(), plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), -R), hitP = new THREE.Vector3(), ndc = new THREE.Vector2();
  function toTable(e) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, camera);
    return ray.ray.intersectPlane(plane, hitP) ? hitP : null;
  }
  function pullFrom(p) {
    const dx = cue.x - p.x, dz = cue.z - p.z, d = Math.hypot(dx, dz);
    if (d > 1e-4) aim.a = Math.atan2(dz, dx);
    aim.p = clamp((d - 0.06) / 0.55, 0, 1);
  }
  function down(e) {
    if (moving || over || !cue.on || strike) return;
    if (e.currentTarget === canvas) { if (e.pointerType !== 'mouse') return; const q = toTable(e); if (!q || Math.hypot(q.x - cue.x, q.z - cue.z) > 0.35) return; }
    e.preventDefault();
    (e.currentTarget).setPointerCapture(e.pointerId);
    drag = { id: e.pointerId, el: e.currentTarget };
    const p = toTable(e); if (p) pullFrom(p);
    if (e.currentTarget === grab) aim.p = 0;
    wrap.classList.add('is-aiming'); showGuide(); loop.invalidate();
  }
  function move(e) { if (!drag || e.pointerId !== drag.id) return; const p = toTable(e); if (p) pullFrom(p); showGuide(); loop.invalidate(); }
  function up(e) {
    if (!drag || e.pointerId !== drag.id) return; drag = null; wrap.classList.remove('is-aiming');
    if (aim.p > 0.03) shoot(aim.a, aim.p); else { showGuide(); loop.invalidate(); }
  }
  for (const t of [grab, canvas]) { t.addEventListener('pointerdown', down); t.addEventListener('pointermove', move); t.addEventListener('pointerup', up); t.addEventListener('pointercancel', () => { drag = null; wrap.classList.remove('is-aiming'); loop.invalidate(); }); }
  grab.addEventListener('focus', () => { aim.on = true; showGuide(); loop.invalidate(); });
  grab.addEventListener('keydown', (e) => {
    const k = e.key, fine = e.shiftKey ? 0.005 : 0.03;
    if (k === 'ArrowLeft' || k === 'ArrowRight') aim.a += (k === 'ArrowLeft' ? -1 : 1) * fine * (L.port ? -1 : 1);
    else if (k === 'ArrowUp' || k === 'ArrowDown') aim.p = clamp(aim.p + (k === 'ArrowUp' ? 0.05 : -0.05), 0.05, 1);
    else if (k === 'Enter' || k === ' ') { e.preventDefault(); shoot(aim.a, aim.p); return; }
    else return;
    e.preventDefault(); aim.on = true; showGuide(); loop.invalidate();
  });
  grab.addEventListener('click', (e) => e.preventDefault());
  endEl.querySelector('button').addEventListener('click', () => { rack(); grab.focus({ preventScroll: true }); });
  box.querySelector('[data-act="rack"]')?.addEventListener('click', () => rack());

  /* the clock: ticks only while a round runs and the table is on screen */
  let clockT = 0;
  const clock = () => {
    clearInterval(clockT); clockT = 0;
    if (!running || !visible) return;
    let last = performance.now();
    clockT = setInterval(() => {
      const now = performance.now(); timeLeft -= (now - last) / 1000; last = now;
      if (timeLeft <= 0) { timeLeft = 0; clearInterval(clockT); clockT = 0; if (!moving) finish(false); else running = true; }
      paint();
    }, 250);
  };
  const vio = new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; clock(); });
  vio.observe(wrap);

  /* loop */
  const profile = detectGpu();
  const top = Math.min(devicePixelRatio || 1, 2);
  const levels = [top, Math.min(top, 1.5), 1, 0.85].filter((v, i, a) => a.indexOf(v) === i).map((dpr) => ({ name: `dpr${dpr}`, dpr }));
  const governor = createGovernor({ levels, start: profile.tier === 'low' ? levels.length - 2 : 0, persistKey: 'nadavai.work.snk', gpuKey: profile.renderer, apply: (l) => { renderer.setPixelRatio(l.dpr); if (L.W > 1) renderer.setSize(L.W, L.H, false); } });
  governor.init();
  const qv = new THREE.Quaternion(), ax = new THREE.Vector3();
  let wasRunning = false;
  const loop = createFrameLoop({
    mode: 'demand', observe: wrap, fps: 60, simStep: 1 / 240, maxSubSteps: 16,
    update: (dt) => step(dt),
    onFrame: (s) => governor.sample({ interval: s.interval, cpuMs: s.cpuMs, stall: s.stall }),
    render: ({ dt }) => {
      // the strike: the cue goes through the ball, then the ball goes
      if (strike) {
        strike.t += dt;
        const dx = Math.cos(strike.a), dz = Math.sin(strike.a), back = R + 0.02 + strike.p * 0.22, T = 0.07 + strike.p * 0.05;
        const u = Math.min(1, strike.t / T), b = back * (1 - u * u) + 0.004;
        cueG.visible = true; cueG.position.set(cue.x - dx * b, R + 0.012, cue.z - dz * b);
        if (u >= 1) { cue.vx = dx * strike.v; cue.vz = dz * strike.v; moving = true; strike.t2 = (strike.t2 || 0) + dt; if (strike.t2 > 0.18) { strike = null; cueG.visible = false; } }
      }
      for (const b of balls) {
        if (!b.m.visible) continue;
        if (b.sink) {
          const u = Math.min(1, b.sink.t / 0.22);
          b.m.position.set(b.sink.x0 + (b.sink.px - b.sink.x0) * u, R - u * 0.09, b.sink.z0 + (b.sink.pz - b.sink.z0) * u);
          continue;
        }
        const sp = Math.hypot(b.vx, b.vz);
        if (sp > 1e-4) { ax.set(b.vz, 0, -b.vx).divideScalar(sp); qv.setFromAxisAngle(ax, (sp * dt) / R); b.m.quaternion.premultiply(qv); }
        b.m.position.set(b.x, R, b.z);
      }
      if (halo.visible && cols[target]) halo.position.set(cols[target].x, 0.002, cols[target].z);
      if (!moving && !strike && (aim.on || drag) && !over) showGuide();
      if (running !== wasRunning) { wasRunning = running; clock(); }
      renderer.render(scene, camera);
      if (!moving) placeGrab();
      return moving || !!strike || !!drag;
    },
  });
  const ro = new ResizeObserver(() => layout()); ro.observe(wrap);
  rack(); layout(); loop.start();
  requestAnimationFrame(() => governor.markReady());

  function dispose() {
    loop.dispose(); ro.disconnect(); vio.disconnect(); clearInterval(clockT);
    scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((mm) => { mm.map?.dispose?.(); mm.dispose(); }); });
    envRT.dispose(); renderer.dispose(); renderer.forceContextLoss?.();
  }
  addEventListener('pagehide', dispose, { once: true });
  box.closest('[data-game]').__game = box.__game = {
    dispose, governor, rack,
    shoot(a, p) { shoot(a, p); },
    aimAt(k) { const b = k === 'target' ? cols[target] : balls.find((x) => x.k === k); return Math.atan2(b.z - cue.z, b.x - cue.x); },
    // test helper: the angle that pots a ball into a pocket (ghost-ball aim), or null when the line is blocked
    potAngle(k, pi) {
      const b = k === 'target' ? cols[target] : balls.find((x) => x.k === k), p = POCKETS[pi];
      const ux = p.x - b.x, uz = p.z - b.z, ul = Math.hypot(ux, uz), gx = b.x - (ux / ul) * 2 * R, gz = b.z - (uz / ul) * 2 * R;
      return Math.atan2(gz - cue.z, gx - cue.x);
    },
    screenOf(k) { const b = balls.find((x) => x.k === k); proj.set(b.x, R, b.z).project(camera); const r = canvas.getBoundingClientRect(); return { x: r.left + (proj.x * 0.5 + 0.5) * r.width, y: r.top + (-proj.y * 0.5 + 0.5) * r.height }; },
    worldToScreen(x, z) { proj.set(x, R, z).project(camera); const r = canvas.getBoundingClientRect(); return { x: r.left + (proj.x * 0.5 + 0.5) * r.width, y: r.top + (-proj.y * 0.5 + 0.5) * r.height }; },
    get cue() { return { x: cue.x, z: cue.z, on: cue.on }; },
    get balls() { return balls.map((b) => ({ k: b.k, x: +b.x.toFixed(3), z: +b.z.toFixed(3), on: b.on })); },
    get state() { return { score, target, timeLeft: +timeLeft.toFixed(1), running, over, moving, best }; },
    get loopState() { return loop.state; },
  };
}

/* ── the intro film on the phone ───────────────────────── */
function intro(el, { reduce }) {
  const v = el?.querySelector('video'); if (!v) return;
  const btn = el.querySelector('[data-act="film"]');
  if (reduce) { btn.hidden = false; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (reduce) return; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: 0.3 });
  io.observe(v);
  btn?.addEventListener('click', () => { if (v.paused) { v.play().catch(() => {}); btn.textContent = __t('greenroom.try.video.pause'); } else { v.pause(); btn.textContent = __t('greenroom.try.video.play'); } });
}
