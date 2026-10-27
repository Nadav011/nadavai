// sporchat-kick.js: the SporChat page's game. A 3D football (three.js + cannon-es, pinned on jsDelivr)
// flies in and bounces off the phone, settles on the pitch, and you flick it at a small goal. The phone
// runs a simulated live match room on the real room screen: the clock and score tick, chat slides in,
// and the room reacts to your kicks. The avatar kicks and celebrates with you.
// The DOM phone is the source of truth for layout: the physics world is measured from it, so the ball
// hits exactly where the phone is drawn. Reduced motion: a still poster and a play button.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createFrameLoop } from '../../hero/kit/frame-loop.js';
import { createGovernor } from '../../hero/kit/quality.js';
import { detectGpu } from '../../hero/kit/gpu-profile.js';

const CANNON_URL = 'https://cdn.jsdelivr.net/npm/cannon-es@0.20.0/dist/cannon-es.js';
const G = 18;

/* ── the live match room (DOM, over the real room screen) ─────────── */
const CHAT = [
  [__t('sporchat.chat.name.dana'), __t('sporchat.chat.m01')],
  [__t('sporchat.chat.name.roi'), __t('sporchat.chat.m02')],
  [__t('sporchat.chat.name.commentator'), __t('sporchat.chat.m03'), 'ai'],
  [__t('sporchat.chat.name.yossi'), __t('sporchat.chat.m04')],
  [__t('sporchat.chat.name.maya'), __t('sporchat.chat.m05')],
  [__t('sporchat.chat.name.omer'), __t('sporchat.chat.m06')],
  [__t('sporchat.chat.name.commentator'), __t('sporchat.chat.m07'), 'ai'],
  [__t('sporchat.chat.name.noa'), __t('sporchat.chat.m08')],
  [__t('sporchat.chat.name.dana'), __t('sporchat.chat.m09')],
  [__t('sporchat.chat.name.roi'), __t('sporchat.chat.m10')],
];
const REACT = {
  bonk: [[__t('sporchat.chat.name.yossi'), __t('sporchat.chat.react.bonk')]],
  goal: [[__t('sporchat.chat.name.roi'), __t('sporchat.chat.react.goal1'), 'hot'], [__t('sporchat.chat.name.commentator'), __t('sporchat.chat.react.goal2'), 'ai'], [__t('sporchat.chat.name.maya'), __t('sporchat.chat.react.goal3')]],
  post: [[__t('sporchat.chat.name.omer'), __t('sporchat.chat.react.post')]],
  miss: [[__t('sporchat.chat.name.dana'), __t('sporchat.chat.react.miss1')], [__t('sporchat.chat.name.noa'), __t('sporchat.chat.react.miss2')], [__t('sporchat.chat.name.roi'), __t('sporchat.chat.react.miss3')]],
};

function liveRoom(el, { reduce }) {
  const chat = el.querySelector('.lr__chat');
  const sEl = [...el.querySelectorAll('.lr__score b')];
  const minEl = el.querySelector('.lr__min b');
  const live = document.getElementById('kickLive');
  let score = [1, 1], minute = 63, ci = 0, timer = 0, clock = 0, missI = 0;
  const now = () => `${String(20 + Math.floor((minute + 30) / 60)).padStart(2, '0')}:${String((minute + 30) % 60).padStart(2, '0')}`;
  function post([who, text, kind], animate = true) {
    const li = document.createElement('li');
    li.className = `lr__msg${kind ? ` lr__msg--${kind}` : ''}`;
    if (!animate) li.style.animation = 'none';
    li.innerHTML = `<span></span><p></p>`;
    li.querySelector('span').textContent = who; li.querySelector('p').textContent = text;
    chat.appendChild(li);
    while (chat.children.length > 5) chat.firstElementChild.remove();
  }
  const paint = () => { sEl[0].textContent = score[0]; sEl[1].textContent = score[1]; minEl.textContent = minute < 90 ? `${minute}′` : `90+${Math.min(6, minute - 89)}′`; };
  function tickScore(i) {
    score[i]++; paint();
    sEl[i].classList.remove('is-tick'); void sEl[i].offsetWidth; sEl[i].classList.add('is-tick');
  }
  // the opening state: a few lines already there
  CHAT.slice(0, 3).forEach((m) => post(m, false)); ci = 3; paint();
  function loop() {
    post(CHAT[ci++ % CHAT.length]);
    timer = setTimeout(loop, 2600 + Math.random() * 1800);
  }
  return {
    start() {
      if (timer) return;
      timer = setTimeout(loop, 1400);
      clock = setInterval(() => { minute = minute >= 95 ? 63 : minute + 1; paint(); }, 4000);
    },
    stop() { clearTimeout(timer); clearInterval(clock); timer = 0; clock = 0; },
    react(kind) {
      if (kind === 'goal') { tickScore(0); live.textContent = __t('sporchat.try.live.goal', { a: score[0], b: score[1] }); }
      const set = REACT[kind]; if (!set) return;
      if (kind === 'miss') { post(set[missI++ % set.length]); return; }
      set.forEach((m, i) => setTimeout(() => post(m, !reduce), i * 650));
    },
    get score() { return score; },
  };
}

/* ── a football, drawn from the truncated icosahedron ─────────────── */
function ballTexture() {
  const W = 512, H = 256, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d'), img = ctx.createImageData(W, H), d = img.data;
  const p = (1 + Math.sqrt(5)) / 2, ip = 1 / p, pts = [], pent = [];
  const add = (x, y, z, isP) => { const l = Math.hypot(x, y, z); pts.push([x / l, y / l, z / l]); pent.push(isP); };
  for (const a of [-1, 1]) for (const b of [-1, 1]) { add(0, a, b * p, 1); add(a, b * p, 0, 1); add(a * p, 0, b, 1); }
  for (const a of [-1, 1]) for (const b of [-1, 1]) { for (const c of [-1, 1]) add(a, b, c, 0); add(0, a * ip, b * p, 0); add(a * ip, b * p, 0, 0); add(a * p, 0, b * ip, 0); }
  for (let y = 0; y < H; y++) {
    const th = (y + 0.5) / H * Math.PI, st = Math.sin(th), ct = Math.cos(th);
    for (let x = 0; x < W; x++) {
      const ph = (x + 0.5) / W * Math.PI * 2;
      const vx = -Math.cos(ph) * st, vy = ct, vz = Math.sin(ph) * st;
      let b1 = -2, b2 = -2, bi = 0;
      for (let i = 0; i < pts.length; i++) { const q = pts[i]; const dd = vx * q[0] + vy * q[1] + vz * q[2]; if (dd > b1) { b2 = b1; b1 = dd; bi = i; } else if (dd > b2) b2 = dd; }
      const seam = b1 - b2 < 0.012;
      let c = pent[bi] ? 26 : 240;
      if (seam) c = pent[bi] ? 60 : 150;
      const o = (y * W + x) * 4; d[o] = c; d[o + 1] = c + (pent[bi] ? 2 : 2); d[o + 2] = c + (pent[bi] ? 6 : 6); d[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

function blobTexture() {
  const c = document.createElement('canvas'); c.width = c.height = 128;
  const g = c.getContext('2d'), r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(0,0,0,.75)'); r.addColorStop(0.55, 'rgba(0,0,0,.35)'); r.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = r; g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

export async function init(stage, { reduce, avatar }) {
  const room = liveRoom(stage.querySelector('.lr'), { reduce });
  const playBtn = stage.querySelector('.wkx__play');
  const tools = document.querySelector('#kickTools');
  const kickBtn = tools?.querySelector('[data-act="kick"]');
  const resetBtn = tools?.querySelector('[data-act="reset"]');
  const tally = document.getElementById('kickGoals');
  const hasGL = !!document.createElement('canvas').getContext('webgl2');

  const visible = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && stage.classList.contains('is-live')) room.start(); else room.stop(); }));
  visible.observe(stage);

  let game = null;
  const begin = async () => {
    stage.classList.add('is-live');
    room.start();
    if (!hasGL) return;
    try { game = await start3D(); } catch (e) { console.warn('[kick] 3D unavailable', e?.message); stage.classList.remove('is-live'); }
  };
  if (reduce) {
    playBtn.hidden = false;
    playBtn.addEventListener('click', () => { playBtn.hidden = true; begin(); }, { once: true });
  } else { playBtn.hidden = true; begin(); }
  kickBtn?.addEventListener('click', () => { if (!game) { playBtn.hidden = true; begin().then(() => setTimeout(() => game?.autoKick(), 1600)); return; } game.autoKick(); });
  resetBtn?.addEventListener('click', () => game?.respawn(true));

  async function start3D() {
    const CANNON = await import(/* @vite-ignore */ CANNON_URL);
    const canvas = stage.querySelector('.kick__gl');
    const phoneEl = stage.querySelector('.kick__phone');
    const grab = stage.querySelector('.kick__grab');
    const coach = stage.querySelector('.kick__coach');
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.setClearColor(0, 0);
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture; pmrem.dispose();
    scene.environmentIntensity = 0.7;
    scene.add(new THREE.HemisphereLight(0xbfd8ff, 0x0b1a10, 0.9));
    const sun = new THREE.DirectionalLight(0xffffff, 2.0); sun.position.set(4, 8, 6); scene.add(sun);
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 80);
    const D = 12; camera.position.set(0, 0, D);

    /* physics */
    const world = new CANNON.World({ gravity: new CANNON.Vec3(0, -G, 0) });
    world.allowSleep = false;
    const mBall = new CANNON.Material('ball'), mFloor = new CANNON.Material('floor'), mPhone = new CANNON.Material('phone'), mNet = new CANNON.Material('net'), mPost = new CANNON.Material('post');
    world.addContactMaterial(new CANNON.ContactMaterial(mBall, mFloor, { friction: 0.35, restitution: 0.52 }));
    world.addContactMaterial(new CANNON.ContactMaterial(mBall, mPhone, { friction: 0.1, restitution: 0.62 }));
    world.addContactMaterial(new CANNON.ContactMaterial(mBall, mNet, { friction: 0.6, restitution: 0.08 }));
    world.addContactMaterial(new CANNON.ContactMaterial(mBall, mPost, { friction: 0.05, restitution: 0.85 }));
    const R = 0.32;
    const ball = new CANNON.Body({ mass: 1, material: mBall, shape: new CANNON.Sphere(R), linearDamping: 0.12, angularDamping: 0.25 });
    world.addBody(ball);
    let statics = [];
    const addStatic = (shape, pos, mat, quat) => { const b = new CANNON.Body({ mass: 0, material: mat, shape }); b.position.set(...pos); if (quat) b.quaternion.setFromEuler(...quat); world.addBody(b); statics.push(b); return b; };

    /* scene objects */
    const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(R, 48, 32), new THREE.MeshStandardMaterial({ map: ballTexture(), roughness: 0.42, metalness: 0 }));
    scene.add(ballMesh);
    const blob = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), new THREE.MeshBasicMaterial({ map: blobTexture(), transparent: true, depthWrite: false }));
    blob.rotation.x = -Math.PI / 2; scene.add(blob);
    const occl = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), new THREE.MeshBasicMaterial({ colorWrite: false }));
    occl.renderOrder = -1; scene.add(occl);
    const floorU = { uGoal: { value: new THREE.Vector4() }, uFade: { value: new THREE.Vector2(0, 0) } };
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 40), new THREE.ShaderMaterial({
      uniforms: floorU, transparent: true, depthWrite: false,
      vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: /* glsl */`
        precision highp float; varying vec3 vW; uniform vec4 uGoal; uniform vec2 uFade;
        float line(float d, float w){ return 1.0 - smoothstep(w*0.5, w*0.5 + fwidth(d)*1.5, abs(d)); }
        void main(){
          float band = step(0.5, fract(vW.z * 0.42));
          vec3 col = mix(vec3(0.05,0.19,0.10), vec3(0.07,0.25,0.13), band);
          // the goal box, painted on the grass
          vec2 g = vW.xz - uGoal.xy; float bw = uGoal.z * 0.5 + 0.9, bd = 1.5;
          float inX = step(abs(g.x), bw), inZ = step(0.0, g.y) * step(g.y, bd);
          float l = max(line(abs(g.x) - bw, 0.05) * inZ, line(g.y - bd, 0.05) * inX);
          l = max(l, line(g.y, 0.05) * step(abs(g.x), uGoal.z * 2.2));
          col = mix(col, vec3(0.9), l * 0.8);
          float r = length(vec2(vW.x - uFade.x, (vW.z + 1.5) * 1.35));
          float a = smoothstep(9.0, 2.5, r) * 0.92;
          gl_FragColor = vec4(col, a);
          #include <colorspace_fragment>
        }`,
    }));
    floor.rotation.x = -Math.PI / 2; scene.add(floor);
    const goal = new THREE.Group(); scene.add(goal);
    const postMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f0, roughness: 0.35, metalness: 0.1, emissive: 0x222222 });

    /* layout: measured from the DOM phone */
    const L = {};
    function layout() {
      const s = stage.getBoundingClientRect(), p = phoneEl.getBoundingClientRect();
      const W = s.width, H = s.height;
      renderer.setSize(W, H, false);
      camera.aspect = W / H; camera.updateProjectionMatrix();
      const Hv = 2 * D * Math.tan(THREE.MathUtils.degToRad(16)), k = Hv / H, Wv = Hv * camera.aspect;
      const toW = (x, y) => [(x - s.left - W / 2) * k, (H / 2 - (y - s.top)) * k];
      const [pcx, pcy] = toW(p.left + p.width / 2, p.top + p.height / 2);
      const pw = p.width * k, ph = p.height * k, floorY = pcy - ph / 2;
      const narrow = W < 720;
      const gz = narrow ? -3.4 : -4.2, depthK = (D - gz) / D;
      const gw = narrow ? 1.7 : 2.3, gh = narrow ? 0.95 : 1.2, gd = 0.8;
      const phoneEdgeL = pcx - pw / 2;                                            // the phone's left edge (world, z=0)
      const gx = Math.max(-Wv / 2 + gw * 0.95 / depthK, Math.min(phoneEdgeL - gw * 0.9, -Wv * 0.22)) * depthK;
      const restX = narrow ? (gx / depthK + phoneEdgeL) / 2 + 0.15 : pcx - pw * 0.95;
      Object.assign(L, { W, H, k, Wv, Hv, pcx, pcy, pw, ph, floorY, gx, gz, gw, gh, gd, narrow,
        rest: new THREE.Vector3(restX, floorY + R, narrow ? 2.5 : 2.6) });
      // rebuild statics
      statics.forEach((b) => world.removeBody(b)); statics = [];
      addStatic(new CANNON.Plane(), [0, floorY, 0], mFloor, [-Math.PI / 2, 0, 0]);
      addStatic(new CANNON.Box(new CANNON.Vec3(pw / 2, ph / 2, 0.18)), [pcx, pcy, -0.18], mPhone);
      const halfX = Wv / 2 * ((D + 6) / D);
      addStatic(new CANNON.Plane(), [-halfX, 0, 0], mFloor, [0, Math.PI / 2, 0]);
      addStatic(new CANNON.Plane(), [halfX, 0, 0], mFloor, [0, -Math.PI / 2, 0]);
      addStatic(new CANNON.Plane(), [0, 0, -9], mFloor);
      addStatic(new CANNON.Plane(), [0, 0, 8.5], mFloor, [0, Math.PI, 0]);   // behind the spawn point, never in front of it
      // the goal: posts, bar, and a net that swallows the ball
      const pr = 0.055;
      const postL = addStatic(new CANNON.Cylinder(pr, pr, gh, 12), [gx - gw / 2, floorY + gh / 2, gz], mPost);
      const postR = addStatic(new CANNON.Cylinder(pr, pr, gh, 12), [gx + gw / 2, floorY + gh / 2, gz], mPost);
      const bar = addStatic(new CANNON.Box(new CANNON.Vec3(gw / 2, pr, pr)), [gx, floorY + gh, gz], mPost);
      L.posts = [postL, postR, bar];
      addStatic(new CANNON.Box(new CANNON.Vec3(gw / 2, gh / 2, 0.05)), [gx, floorY + gh / 2, gz - gd], mNet);
      addStatic(new CANNON.Box(new CANNON.Vec3(gw / 2, 0.04, gd / 2)), [gx, floorY + gh + 0.04, gz - gd / 2], mNet);
      addStatic(new CANNON.Box(new CANNON.Vec3(0.04, gh / 2, gd / 2)), [gx - gw / 2 - 0.04, floorY + gh / 2, gz - gd / 2], mNet);
      addStatic(new CANNON.Box(new CANNON.Vec3(0.04, gh / 2, gd / 2)), [gx + gw / 2 + 0.04, floorY + gh / 2, gz - gd / 2], mNet);
      // visuals
      floor.position.y = floorY; floorU.uGoal.value.set(gx, gz, gw, gh); floorU.uFade.value.set((gx + pcx) / 2, 0);
      occl.scale.set(pw * 0.96, ph * 0.98, 0.3); occl.position.set(pcx, pcy, -0.16);
      goal.clear();
      const cyl = new THREE.CylinderGeometry(pr, pr, gh, 16);
      [gx - gw / 2, gx + gw / 2].forEach((x) => { const m = new THREE.Mesh(cyl, postMat); m.position.set(x, floorY + gh / 2, gz); goal.add(m); });
      const barM = new THREE.Mesh(new THREE.CylinderGeometry(pr, pr, gw + pr * 2, 16), postMat); barM.rotation.z = Math.PI / 2; barM.position.set(gx, floorY + gh, gz); goal.add(barM);
      const net = []; const step = 0.16;
      for (let x = -gw / 2; x <= gw / 2 + 1e-3; x += step) { net.push(gx + x, floorY, gz - gd, gx + x, floorY + gh, gz - gd); net.push(gx + x, floorY + gh, gz, gx + x, floorY + gh, gz - gd); }
      for (let y = 0; y <= gh + 1e-3; y += step) { net.push(gx - gw / 2, floorY + y, gz - gd, gx + gw / 2, floorY + y, gz - gd); [-1, 1].forEach((sd) => net.push(gx + sd * gw / 2, floorY + y, gz, gx + sd * gw / 2, floorY + y, gz - gd)); }
      for (let z = 0; z <= gd + 1e-3; z += step) { net.push(gx - gw / 2, floorY + gh, gz - z, gx + gw / 2, floorY + gh, gz - z); [-1, 1].forEach((sd) => net.push(gx + sd * gw / 2, floorY, gz - z, gx + sd * gw / 2, floorY + gh, gz - z)); }
      const ng = new THREE.BufferGeometry(); ng.setAttribute('position', new THREE.Float32BufferAttribute(net, 3));
      goal.add(new THREE.LineSegments(ng, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.32 })));
      const glow = new THREE.Mesh(new THREE.PlaneGeometry(gw, gh), new THREE.MeshBasicMaterial({ color: new THREE.Color(getComputedStyle(document.body).getPropertyValue('--app').trim() || '#8CC2FF'), transparent: true, opacity: 0.08, depthWrite: false }));
      glow.position.set(gx, floorY + gh / 2, gz - gd + 0.02); goal.add(glow); L.glow = glow;
    }

    /* state */
    let spawnT = 0, state = 'idle', restT = 0, kickT = 0, scored = false, posted = false, spawns = 0, goals = 0, hitPhone = false;
    const fireRoom = (k) => room.react(k);
    ball.addEventListener('collide', (e) => {
      const v = ball.velocity.length();
      if (e.body.material === mPhone && v > 2 && !hitPhone && state === 'flying') {
        hitPhone = true; fireRoom('bonk');
        phoneEl.classList.remove('is-bonk'); void phoneEl.offsetWidth; phoneEl.classList.add('is-bonk');
      }
      if (e.body.material === mPost && state === 'kicked' && !posted && v > 1.5) { posted = true; fireRoom('post'); }
    });
    function respawn(manual = false) {
      spawns++;
      const viaPhone = spawns === 1 || spawns % 3 === 0 || manual;
      state = 'flying'; restT = 0; scored = false; posted = false; hitPhone = false; spawnT = performance.now();
      stage.classList.remove('is-ready', 'is-goal');
      grab.hidden = true;
      ball.velocity.setZero(); ball.angularVelocity.set((Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12, (Math.random() - 0.5) * 12);
      let from, to, T;
      if (viaPhone) {
        from = new THREE.Vector3(L.pcx + L.pw * 1.6, L.floorY + L.ph * 1.25, 6.2);
        to = new THREE.Vector3(L.pcx - L.pw * 0.08, L.pcy + L.ph * 0.18, R + 0.02); T = 0.62;
      } else {
        from = new THREE.Vector3(L.rest.x + 1.5, L.floorY + L.ph * 1.4, L.rest.z + 1.2);
        to = L.rest.clone(); T = 0.9;
      }
      ball.position.set(from.x, from.y, from.z);
      ball.velocity.set((to.x - from.x) / T, (to.y - from.y) / T + 0.5 * G * T, (to.z - from.z) / T);
      if (!viaPhone) state = 'flying';
    }
    function kick(v) {
      if (state !== 'ready') return;
      state = 'kicked'; kickT = performance.now(); scored = false; posted = false;
      stage.classList.add('has-kicked'); stage.classList.remove('is-ready'); grab.hidden = true;
      ball.velocity.set(v.x, v.y, v.z);
      ball.angularVelocity.set(v.z * -2.2, (Math.random() - 0.5) * 6, v.x * 2.2);
      avatar?.perform?.('kick');
      loop.setFps(60);
    }
    function autoKick() {
      if (state !== 'ready') return;
      const T = 0.72, tx = L.gx + (Math.random() - 0.5) * L.gw * 0.55, ty = L.floorY + L.gh * (0.3 + Math.random() * 0.4), tz = L.gz - 0.35;
      const p = ball.position;
      kick({ x: (tx - p.x) / T, y: (ty - p.y) / T + 0.5 * G * T, z: (tz - p.z) / T });
    }

    /* the grab handle follows the ball on screen; touch-action:none only there, the page still scrolls */
    const proj = new THREE.Vector3();
    function placeGrab() {
      proj.set(ball.position.x, ball.position.y, ball.position.z).project(camera);
      const x = (proj.x * 0.5 + 0.5) * L.W, y = (-proj.y * 0.5 + 0.5) * L.H;
      // physical coordinates from the projection: the handle is placed by left/top, not by the reading side
      grab.style.transform = `translate(${x}px, ${y}px)`;
      const cw = coach.offsetWidth || 220;
      coach.style.left = `${Math.max(12, Math.min(L.W - cw - 12, x - cw / 2))}px`;
      coach.style.top = `${L.narrow ? Math.min(L.H - 64, y + 62) : Math.max(12, y - 112)}px`;
    }
    let drag = null;
    grab.addEventListener('pointerdown', (e) => {
      if (state !== 'ready') return;
      grab.setPointerCapture(e.pointerId);
      drag = { id: e.pointerId, pts: [{ x: e.clientX, y: e.clientY, t: performance.now() }] };
      loop.setFps(60);
    });
    grab.addEventListener('pointermove', (e) => { if (drag && e.pointerId === drag.id) { drag.pts.push({ x: e.clientX, y: e.clientY, t: performance.now() }); if (drag.pts.length > 24) drag.pts.shift(); } });
    const release = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const pts = drag.pts; drag = null;
      const last = pts[pts.length - 1], t1 = last.t;
      let first = pts[0]; for (const q of pts) if (t1 - q.t <= 120) { first = q; break; }
      const dt = Math.max(0.016, (t1 - first.t) / 1000);
      let vx = (last.x - first.x) / dt, vy = (last.y - first.y) / dt;
      const total = Math.hypot(last.x - pts[0].x, last.y - pts[0].y);
      if (Math.hypot(vx, vy) < 160 && total < 18) { autoKick(); return; }        // a tap kicks at the goal
      if (Math.hypot(vx, vy) < 160) { const T = Math.max(0.12, (t1 - pts[0].t) / 1000); vx = (last.x - pts[0].x) / T; vy = (last.y - pts[0].y) / T; }
      const sp = Math.hypot(vx, vy), ux = vx / sp, uy = -vy / sp;
      const P = Math.min(15, Math.max(5, sp * 0.0085 * (560 / L.H)));
      const v = { x: ux * P * 0.95, y: P * (0.3 + 0.28 * Math.max(0, uy)), z: -P * Math.max(0.25, uy) };
      // aim assist: a flick roughly at the goal is pulled onto it, and lofted to clear the grass but not the bar
      const p = ball.position, gxz = Math.atan2(L.gx - p.x, -(L.gz - p.z)), uxz = Math.atan2(v.x, -v.z), dA = gxz - uxz;
      if (Math.abs(dA) < 0.6 && v.z < 0) {
        const h = Math.hypot(v.x, v.z), a = uxz + dA * 0.7;
        v.x = Math.sin(a) * h; v.z = -Math.cos(a) * h;
        const t = Math.hypot(L.gx - p.x, L.gz - p.z) / h, ty = L.floorY + L.gh * 0.45;
        v.y = v.y * 0.35 + ((ty - p.y + 0.5 * G * t * t) / t) * 0.65;
      }
      kick(v);
    };
    grab.addEventListener('pointerup', release);
    grab.addEventListener('pointercancel', () => { drag = null; });
    grab.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); autoKick(); } });

    /* loop + governor */
    const profile = detectGpu();
    const top = Math.min(devicePixelRatio || 1, 2);
    const levels = [top, Math.min(top, 1.5), 1, 0.85].filter((v, i, a) => a.indexOf(v) === i).map((dpr) => ({ name: `dpr${dpr}`, dpr }));
    const governor = createGovernor({ levels, start: profile.tier === 'low' ? levels.length - 2 : 0, persistKey: 'nadavai.work.kick', gpuKey: profile.renderer, apply: (l) => { renderer.setPixelRatio(l.dpr); if (L.W) renderer.setSize(L.W, L.H, false); } });
    governor.init();
    layout();
    new ResizeObserver(() => { layout(); if (state === 'ready') { ball.position.set(L.rest.x, L.rest.y, L.rest.z); ball.velocity.setZero(); } }).observe(stage);

    const loop = createFrameLoop({
      observe: stage, fps: 60, simStep: 1 / 60,
      update: (dt) => world.step(1 / 60, dt, 3),
      onFrame: (s) => governor.sample({ interval: s.interval, cpuMs: s.cpuMs, stall: s.stall }),
      render: ({ now, dt }) => {
        const p = ball.position, v = ball.velocity.length();
        // goal?
        if (state === 'kicked' && !scored && p.z < L.gz - R * 0.4 && Math.abs(p.x - L.gx) < L.gw / 2 && p.y < L.floorY + L.gh) {
          scored = true; state = 'goal'; goals++;
          tally.textContent = goals; fireRoom('goal');
          stage.classList.remove('is-goal'); void stage.offsetWidth; stage.classList.add('is-goal');
          L.glow.material.opacity = 0.45;
          avatar?.perform?.('celebrate');
          setTimeout(() => respawn(), 2000);
        }
        if (L.glow && L.glow.material.opacity > 0.08) L.glow.material.opacity = Math.max(0.08, L.glow.material.opacity - dt * 0.4);
        // came to rest?
        const onFloor = p.y < L.floorY + R + 0.06;
        // after the bounce the ball is guided home, so every kick starts from the same spot
        if (state === 'flying' && onFloor && now - spawnT > 500) {
          const k = Math.min(1, dt * 3.2);
          ball.velocity.x += ((L.rest.x - p.x) * 2.2 - ball.velocity.x) * k;
          ball.velocity.z += ((L.rest.z - p.z) * 2.2 - ball.velocity.z) * k;
        }
        if ((state === 'flying') && v < 0.6 && onFloor && Math.hypot(p.x - L.rest.x, p.z - L.rest.z) < 0.5) { restT += dt; if (restT > 0.35) { state = 'ready'; stage.classList.add('is-ready'); grab.hidden = false; ball.angularVelocity.scale(0.2, ball.angularVelocity); } }
        if (state === 'kicked' && ((v < 0.35 && onFloor) || now - kickT > 4200)) { state = 'missed'; fireRoom('miss'); setTimeout(() => respawn(), 700); }
        if (state === 'ready') { ball.velocity.scale(0.9, ball.velocity); placeGrab(); }
        ballMesh.position.copy(p); ballMesh.quaternion.copy(ball.quaternion);
        const hgt = Math.max(0, p.y - L.floorY - R);
        blob.position.set(p.x, L.floorY + 0.004, p.z); blob.scale.setScalar(R * 2.6 * (1 + hgt * 0.35)); blob.material.opacity = Math.max(0.12, 0.85 - hgt * 0.3);
        renderer.render(scene, camera);
        if (state === 'ready' && !drag) loop.setFps(30);
      },
    });
    loop.start();
    requestAnimationFrame(() => governor.markReady());
    respawn();
    stage.dispatchEvent(new CustomEvent('kick:ready'));
    const api = { autoKick, respawn: () => { if (state !== 'flying') respawn(true); }, governor, get state() { return state; }, get ball() { return { p: ball.position.toArray?.() ?? [ball.position.x, ball.position.y, ball.position.z], v: ball.velocity.length(), L: { floorY: L.floorY, rest: L.rest.toArray(), gx: L.gx, gz: L.gz } }; } };
    stage.__game = api;
    return api;
  }
}
