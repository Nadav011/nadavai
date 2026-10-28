// sporchat-kick.js: the SporChat page's game, a 3D penalty shootout (2026-10-28 rebuild of the flick-a-ball toy).
//   pitch      the goal mouth in the page's night stadium: the canvas is transparent, so the stadium of js/dims/sporchat.js
//              (or the poster world under reduced motion) shows behind the goal, the grass fades into it
//   keeper     a faceless mannequin with a readable AI: he picks a side before every shot and his body gives it away
//              (he leans and opens the glove on that side) as soon as you start to aim. He adapts when you repeat a side.
//              Top corners are beyond his reach, a slow chip down the middle beats him only when he dives (a panenka).
//   shot       swipe from the ball toward the goal: the direction aims, the length is the power (too much flies over),
//              a bend in the swipe curls the ball. A dotted guide and a ring on the goal show where it goes.
//              Keyboard on the ball: arrows aim and set power, C cycles the curl, P a panenka, Space or Enter shoots.
//   chat       the app's real match-room screen on the phone; the group chat reacts to what happened (goal, top corner,
//              panenka, post, bar, save, wide, over), the board counts you against the keeper. All of it simulated.
// Five shots, a summary and "again". Reduced motion: the poster stays until "start", then no camera moves or shake.
// One frame loop in demand mode: it sleeps off-screen and when nothing moves; everything is disposed on pagehide.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createFrameLoop } from '../../hero/kit/frame-loop.js';
import { createGovernor } from '../../hero/kit/quality.js';
import { detectGpu } from '../../hero/kit/gpu-profile.js';

const G = 9.81, R = 0.11, GW = 3.66, GH = 2.44, PR = 0.06, NET_D = 1.9, SPOT = 11, KZ = 0.32, SHOTS = 5;
const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
const pick = (a, i) => a[i % a.length];

/* ── the match room on the phone (DOM over the real room screen) ─────────── */
const AMBIENT = [
  [__t('sporchat.chat.name.dana'), __t('sporchat.chat.pk.ambient1')],
  [__t('sporchat.chat.name.yossi'), __t('sporchat.chat.pk.ambient2')],
  [__t('sporchat.chat.name.maya'), __t('sporchat.chat.pk.ambient3')],
  [__t('sporchat.chat.name.noa'), __t('sporchat.chat.pk.ambient4')],
  [__t('sporchat.chat.name.omer'), __t('sporchat.chat.pk.ambient5')],
  [__t('sporchat.chat.name.commentator'), __t('sporchat.chat.pk.ambient6'), 'ai'],
];
const REACT = {
  start: [[[__t('sporchat.chat.name.roi'), __t('sporchat.chat.pk.start1')], [__t('sporchat.chat.name.commentator'), __t('sporchat.chat.pk.start2'), 'ai']]],
  goal: [[[__t('sporchat.chat.name.maya'), __t('sporchat.chat.pk.goal1')], [__t('sporchat.chat.name.omer'), __t('sporchat.chat.pk.goal2'), 'hot']], [[__t('sporchat.chat.name.roi'), __t('sporchat.chat.pk.goal3'), 'hot'], [__t('sporchat.chat.name.dana'), __t('sporchat.chat.pk.goal4')]], [[__t('sporchat.chat.name.noa'), __t('sporchat.chat.pk.goal5')], [__t('sporchat.chat.name.yossi'), __t('sporchat.chat.pk.goal6'), 'hot']]],
  top: [[[__t('sporchat.chat.name.roi'), __t('sporchat.chat.pk.top1'), 'hot'], [__t('sporchat.chat.name.commentator'), __t('sporchat.chat.pk.top2'), 'ai']], [[__t('sporchat.chat.name.maya'), __t('sporchat.chat.pk.top3'), 'hot'], [__t('sporchat.chat.name.omer'), __t('sporchat.chat.pk.top4')]]],
  panenka: [[[__t('sporchat.chat.name.omer'), __t('sporchat.chat.pk.panenka1'), 'hot'], [__t('sporchat.chat.name.noa'), __t('sporchat.chat.pk.panenka2')], [__t('sporchat.chat.name.commentator'), __t('sporchat.chat.pk.panenka3'), 'ai']]],
  postIn: [[[__t('sporchat.chat.name.roi'), __t('sporchat.chat.pk.postIn1'), 'hot'], [__t('sporchat.chat.name.dana'), __t('sporchat.chat.pk.postIn2')]]],
  post: [[[__t('sporchat.chat.name.dana'), __t('sporchat.chat.pk.post1')], [__t('sporchat.chat.name.yossi'), __t('sporchat.chat.pk.post2')]], [[__t('sporchat.chat.name.maya'), __t('sporchat.chat.pk.post3')], [__t('sporchat.chat.name.roi'), __t('sporchat.chat.pk.post4')]]],
  bar: [[[__t('sporchat.chat.name.yossi'), __t('sporchat.chat.pk.bar1')], [__t('sporchat.chat.name.noa'), __t('sporchat.chat.pk.bar2')]], [[__t('sporchat.chat.name.omer'), __t('sporchat.chat.pk.bar3')]]],
  save: [[[__t('sporchat.chat.name.yossi'), __t('sporchat.chat.pk.save1')], [__t('sporchat.chat.name.noa'), __t('sporchat.chat.pk.save2')], [__t('sporchat.chat.name.commentator'), __t('sporchat.chat.pk.save3'), 'ai']], [[__t('sporchat.chat.name.dana'), __t('sporchat.chat.pk.save4')], [__t('sporchat.chat.name.roi'), __t('sporchat.chat.pk.save5')]], [[__t('sporchat.chat.name.maya'), __t('sporchat.chat.pk.save6')], [__t('sporchat.chat.name.omer'), __t('sporchat.chat.pk.save7')]]],
  panenkaSaved: [[[__t('sporchat.chat.name.omer'), __t('sporchat.chat.pk.panenkaSaved1')], [__t('sporchat.chat.name.dana'), __t('sporchat.chat.pk.panenkaSaved2')]]],
  wide: [[[__t('sporchat.chat.name.dana'), __t('sporchat.chat.react.miss1')]], [[__t('sporchat.chat.name.maya'), __t('sporchat.chat.pk.wide2')]], [[__t('sporchat.chat.name.noa'), __t('sporchat.chat.react.miss2')]]],
  over: [[[__t('sporchat.chat.name.roi'), __t('sporchat.chat.pk.over1')]], [[__t('sporchat.chat.name.yossi'), __t('sporchat.chat.pk.over2')]]],
  end5: [[[__t('sporchat.chat.name.commentator'), __t('sporchat.chat.pk.end51'), 'ai'], [__t('sporchat.chat.name.maya'), __t('sporchat.chat.pk.end52'), 'hot']]],
  endGood: [[[__t('sporchat.chat.name.commentator'), __t('sporchat.chat.pk.endGood1'), 'ai'], [__t('sporchat.chat.name.roi'), __t('sporchat.chat.pk.endGood2')]]],
  endBad: [[[__t('sporchat.chat.name.commentator'), __t('sporchat.chat.pk.endBad1'), 'ai'], [__t('sporchat.chat.name.noa'), __t('sporchat.chat.pk.endBad2')]]],
};
const CALL = { goal: __t('sporchat.pk.call.goal'), top: __t('sporchat.pk.call.top'), panenka: __t('sporchat.pk.call.panenka'), postIn: __t('sporchat.pk.call.postIn'), post: __t('sporchat.pk.call.post'), bar: __t('sporchat.pk.call.bar'), save: __t('sporchat.pk.call.save'), panenkaSaved: __t('sporchat.pk.call.panenkaSaved'), wide: __t('sporchat.pk.call.wide'), over: __t('sporchat.pk.call.over') };
const SAY = { goal: __t('sporchat.pk.call.goal'), top: __t('sporchat.pk.say.top'), panenka: __t('sporchat.pk.say.panenka'), postIn: __t('sporchat.pk.say.postIn'), post: __t('sporchat.pk.say.post'), bar: __t('sporchat.pk.say.bar'), save: __t('sporchat.pk.say.save'), panenkaSaved: __t('sporchat.pk.say.panenkaSaved'), wide: __t('sporchat.pk.say.wide'), over: __t('sporchat.pk.say.over') };
const IS_GOAL = (k) => k === 'goal' || k === 'top' || k === 'panenka' || k === 'postIn';

function liveRoom(el, { reduce }) {
  const chat = el.querySelector('.lr__chat');
  const sEl = [...el.querySelectorAll('.lr__score b')];   // the score reads LTR: [left (the keeper), right (you)]
  const minEl = el.querySelector('.lr__min b');
  const vi = {};
  let ai = 0, timer = 0, queue = [];
  function post([who, text, kind], animate = true) {
    const li = document.createElement('li');
    li.className = `lr__msg${kind ? ` lr__msg--${kind}` : ''}`;
    if (!animate || reduce) li.style.animation = 'none';
    li.innerHTML = '<span></span><p></p>';
    li.querySelector('span').textContent = who; li.querySelector('p').textContent = text;
    chat.appendChild(li);
    while (chat.children.length > 5) chat.firstElementChild.remove();
  }
  const tick = (b) => { b.classList.remove('is-tick'); void b.offsetWidth; b.classList.add('is-tick'); };
  AMBIENT.slice(0, 2).forEach((m) => post(m, false)); ai = 2;
  if (minEl) minEl.textContent = __t('sporchat.pk.board.min');
  function loop() { post(AMBIENT[ai++ % AMBIENT.length]); timer = setTimeout(loop, 6500 + Math.random() * 3500); }
  return {
    start() { if (!timer) timer = setTimeout(loop, 4000); },
    stop() { clearTimeout(timer); timer = 0; queue.forEach(clearTimeout); queue = []; },
    score(you, keeper) {
      if (sEl[1].textContent !== String(you)) tick(sEl[1]);
      if (sEl[0].textContent !== String(keeper)) tick(sEl[0]);
      sEl[1].textContent = you; sEl[0].textContent = keeper;
    },
    react(kind) {
      const set = REACT[kind]; if (!set) return;
      const v = pick(set, vi[kind] = (vi[kind] ?? -1) + 1);
      // the room answers in a burst; a quiet beat for the ambient chatter after it
      clearTimeout(timer); timer = setTimeout(loop, 7000);
      v.forEach((m, i) => queue.push(setTimeout(() => post(m), reduce ? i * 250 : 250 + i * 700)));
    },
  };
}

/* ── textures ─────────────────────────────────────────────────── */
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
      const ph = (x + 0.5) / W * Math.PI * 2, vx = -Math.cos(ph) * st, vy = ct, vz = Math.sin(ph) * st;
      let b1 = -2, b2 = -2, bi = 0;
      for (let i = 0; i < pts.length; i++) { const q = pts[i]; const dd = vx * q[0] + vy * q[1] + vz * q[2]; if (dd > b1) { b2 = b1; b1 = dd; bi = i; } else if (dd > b2) b2 = dd; }
      let c = pent[bi] ? 26 : 240; if (b1 - b2 < 0.012) c = pent[bi] ? 60 : 150;
      const o = (y * W + x) * 4; d[o] = c; d[o + 1] = c + 2; d[o + 2] = c + 6; d[o + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

/* ── the keeper: a faceless mannequin, rigged from capsules ─────────── */
function buildKeeper(mats) {
  const root = new THREE.Group();
  const cap = (r, l, m) => new THREE.Mesh(new THREE.CapsuleGeometry(r, l, 4, 12), m);
  const legs = [-1, 1].map((s) => { const l = cap(0.085, 0.72, mats.sock); l.position.set(s * 0.11, 0.47, 0); root.add(l); return l; });
  const boots = [-1, 1].map((s) => { const b = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.07, 0.24), mats.boot); b.position.set(s * 0.11, 0.035, 0.04); root.add(b); return b; });
  const shorts = cap(0.17, 0.08, mats.shorts); shorts.scale.set(1.18, 1, 0.82); shorts.position.y = 0.93; root.add(shorts);
  const torso = cap(0.18, 0.36, mats.kit); torso.scale.set(1.24, 1, 0.78); torso.position.y = 1.27; root.add(torso);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.125, 20, 14), mats.head); head.position.y = 1.7; root.add(head);
  const arms = [-1, 1].map((s) => {
    const pivot = new THREE.Group(); pivot.position.set(s * 0.27, 1.47, 0);
    const arm = cap(0.058, 0.52, mats.kit); arm.position.y = -0.3; pivot.add(arm);
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.085, 14, 10), mats.glove); glove.scale.set(1, 1.25, 0.6); glove.position.y = -0.64; pivot.add(glove);
    root.add(pivot);
    return { pivot, glove, s };
  });
  root.traverse((o) => { if (o.isMesh) o.castShadow = true; });
  return { root, head, arms, legs, boots };
}

export async function init(stage, { reduce, avatar }) {
  const room = liveRoom(stage.querySelector('.lr'), { reduce });
  const playBtn = stage.querySelector('.wkx__play');
  const tools = document.querySelector('#kickTools');
  const hasGL = !!document.createElement('canvas').getContext('webgl2');
  const vis = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting && stage.classList.contains('is-live')) room.start(); else room.stop(); }));
  vis.observe(stage);

  let game = null, starting = null;
  const begin = () => {
    if (starting) return starting;
    stage.classList.add('is-live');
    room.start();
    if (!hasGL) return (starting = Promise.resolve(null));
    starting = Promise.resolve().then(() => start3D()).then((g) => (game = g)).catch((e) => { console.warn('[kick] 3D unavailable', e?.message); stage.classList.remove('is-live'); return null; });
    return starting;
  };
  if (reduce) { playBtn.hidden = false; playBtn.addEventListener('click', () => { playBtn.hidden = true; begin().then((g) => g?.focus()); }, { once: true }); }
  else { playBtn.hidden = true; begin(); }
  tools?.querySelector('[data-act="kick"]')?.addEventListener('click', () => { playBtn.hidden = true; begin().then((g) => g?.autoShot()); });
  tools?.querySelector('[data-act="reset"]')?.addEventListener('click', () => game?.newSeries());
  addEventListener('pagehide', () => { game?.dispose(); game = null; starting = null; room.stop(); });
  addEventListener('pageshow', (e) => { if (e.persisted && !game && stage.classList.contains('is-live')) { stage.classList.remove('is-live'); begin(); } });

  function start3D() {
    const canvas = stage.querySelector('.kick__gl');
    const phoneEl = stage.querySelector('.kick__phone');
    const grab = stage.querySelector('.kick__grab');
    const coach = stage.querySelector('.kick__coach');
    const callEl = stage.querySelector('.pk__call');
    const endEl = stage.querySelector('.pk__end');
    const shotEl = stage.querySelector('[data-pk="shot"]');
    const goalsEl = stage.querySelector('[data-pk="goals"]');
    const dots = [...stage.querySelectorAll('.pk__dots li')];
    const live = document.getElementById('kickLive');
    const appCol = new THREE.Color(getComputedStyle(document.body).getPropertyValue('--app').trim() || '#8CC2FF');

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.setClearColor(0, 0);
    renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04); pmrem.dispose();
    scene.environment = envRT.texture; scene.environmentIntensity = 0.4;
    scene.add(new THREE.HemisphereLight(0xa9c6ff, 0x0b1a10, 0.75));
    const flood = new THREE.DirectionalLight(0xe6eeff, 2.3);
    flood.position.set(7, 15, 19); flood.target.position.set(0, 0, 3);
    flood.castShadow = true; flood.shadow.mapSize.set(1024, 1024); flood.shadow.bias = -0.0004; flood.shadow.normalBias = 0.02;
    Object.assign(flood.shadow.camera, { left: -7, right: 7, top: 9, bottom: -9, near: 5, far: 45 });
    scene.add(flood, flood.target);
    const fill = new THREE.DirectionalLight(0xbfd2ff, 0.7); fill.position.set(-9, 8, 10); scene.add(fill);
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 200);

    /* the pitch around the goal mouth: lines on the grass, fading into the stadium behind */
    const pitch = new THREE.Mesh(new THREE.PlaneGeometry(64, 46), new THREE.ShaderMaterial({
      transparent: true, depthWrite: false,
      vertexShader: 'varying vec3 vW; void main(){ vec4 w = modelMatrix * vec4(position,1.0); vW = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }',
      fragmentShader: /* glsl */`
        precision highp float; varying vec3 vW;
        float ln(float d, float w){ return 1.0 - smoothstep(w * 0.5, w * 0.5 + fwidth(d) * 1.5, abs(d)); }
        float box(vec2 p, float hx, float d, float w){ float inX = step(abs(p.x), hx), inZ = step(0.0, p.y) * step(p.y, d);
          return max(ln(abs(p.x) - hx, w) * inZ, ln(p.y - d, w) * inX); }
        void main(){
          vec2 p = vW.xz;
          float band = step(0.5, fract(p.y / 5.5 + 0.02));
          vec3 col = mix(vec3(0.035, 0.125, 0.07), vec3(0.047, 0.16, 0.09), band);
          float l = ln(p.y, 0.12) * step(abs(p.x), 30.0);
          l = max(l, box(p, 9.16, 5.5, 0.12));
          l = max(l, box(p, 20.16, 16.5, 0.12));
          l = max(l, 1.0 - smoothstep(0.11, 0.11 + fwidth(length(p - vec2(0.0, 11.0))) * 1.5, length(p - vec2(0.0, 11.0))));
          float arc = length(p - vec2(0.0, 11.0)); l = max(l, ln(arc - 9.15, 0.12) * step(16.5, p.y));
          col = mix(col, vec3(0.86, 0.9, 0.88), l * 0.85);
          float r = length(vec2(p.x * 0.55, (p.y - 6.0) * 0.8));
          gl_FragColor = vec4(col, smoothstep(17.0, 5.5, r) * 0.9);
          #include <colorspace_fragment>
        }`,
    }));
    pitch.rotation.x = -Math.PI / 2; scene.add(pitch);
    const shadowCatch = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), new THREE.ShadowMaterial({ opacity: 0.45 }));
    shadowCatch.rotation.x = -Math.PI / 2; shadowCatch.position.set(0, 0.002, 4); shadowCatch.receiveShadow = true; scene.add(shadowCatch);

    /* the goal: posts, bar and a net that ripples where the ball lands */
    const goal = new THREE.Group(); scene.add(goal);
    const white = new THREE.MeshStandardMaterial({ color: 0xf3f5f7, roughness: 0.35, emissive: 0x8d99ab, emissiveIntensity: 0.25 });
    const postG = new THREE.CylinderGeometry(PR, PR, GH + PR, 14);
    for (const x of [-GW, GW]) { const m = new THREE.Mesh(postG, white); m.position.set(x, (GH + PR) / 2, 0); m.castShadow = true; goal.add(m); }
    const bar = new THREE.Mesh(new THREE.CylinderGeometry(PR, PR, GW * 2 + PR * 2, 14), white); bar.rotation.z = Math.PI / 2; bar.position.set(0, GH, 0); bar.castShadow = true; goal.add(bar);
    const backG = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
    for (const x of [-GW, GW]) { const m = new THREE.Mesh(backG, white); m.scale.y = 2.2; m.position.set(x, 1.1, -NET_D); goal.add(m); }
    const netU = { uHit: { value: new THREE.Vector3(0, 1, 0) }, uAmp: { value: 0 }, uCol: { value: new THREE.Color(0xe4ebf5) } };
    const net = [];
    const S = 0.16, NX = Math.round(GW * 2 / S), NY = Math.round(2.2 / S), NZ = Math.round(NET_D / S);
    const backPt = (i, j) => [-GW + (GW * 2 * i) / NX, (2.2 * j) / NY, -NET_D];
    const roofPt = (i, k) => [-GW + (GW * 2 * i) / NX, lerp(GH, 2.2, k / NZ), -(NET_D * k) / NZ];
    for (let i = 0; i <= NX; i++) for (let j = 0; j < NY; j++) net.push(...backPt(i, j), ...backPt(i, j + 1));
    for (let j = 0; j <= NY; j++) for (let i = 0; i < NX; i++) net.push(...backPt(i, j), ...backPt(i + 1, j));
    for (let i = 0; i <= NX; i++) for (let k = 0; k < NZ; k++) net.push(...roofPt(i, k), ...roofPt(i, k + 1));
    for (let k = 0; k <= NZ; k++) for (let i = 0; i < NX; i++) net.push(...roofPt(i, k), ...roofPt(i + 1, k));
    for (const x of [-GW, GW]) {
      for (let k = 0; k <= NZ; k++) { const z = -(NET_D * k) / NZ; net.push(x, 0, z, x, lerp(GH, 2.2, k / NZ), z); }
      for (let j = 0; j <= NY; j++) { const y = (2.2 * j) / NY; net.push(x, y, 0, x, y, -NET_D); }
    }
    const netG = new THREE.BufferGeometry(); netG.setAttribute('position', new THREE.Float32BufferAttribute(net, 3));
    goal.add(new THREE.LineSegments(netG, new THREE.ShaderMaterial({
      uniforms: netU, transparent: true, depthWrite: false,
      vertexShader: /* glsl */`uniform vec3 uHit; uniform float uAmp; varying float vA;
        void main(){ vec3 p = position; float d = length(p.xy - uHit.xy);
          float bulge = uAmp * exp(-d * d / 0.55) * smoothstep(-0.2, -1.2, p.z + 0.0);
          p.z -= bulge; p.y -= bulge * 0.2; vA = 0.36 + abs(bulge) * 0.5;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
      fragmentShader: 'uniform vec3 uCol; varying float vA;\nvoid main(){ gl_FragColor = vec4(uCol, vA);\n#include <colorspace_fragment>\n}',
    })));
    // a soft glow on the net, the app's light, that flares on a goal
    const glow = new THREE.Mesh(new THREE.PlaneGeometry(GW * 2, 2.2), new THREE.MeshBasicMaterial({ color: appCol, transparent: true, opacity: 0.05, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.position.set(0, 1.1, -NET_D + 0.02); goal.add(glow);

    /* keeper, ball, guide */
    const mats = {
      kit: new THREE.MeshStandardMaterial({ color: 0xf0c02c, roughness: 0.62 }),
      sock: new THREE.MeshStandardMaterial({ color: 0xe7b625, roughness: 0.7 }),
      shorts: new THREE.MeshStandardMaterial({ color: 0x1b1f26, roughness: 0.7 }),
      head: new THREE.MeshStandardMaterial({ color: 0x2c3138, roughness: 0.5, metalness: 0.1 }),
      glove: new THREE.MeshStandardMaterial({ color: 0xf4f4f2, roughness: 0.55 }),
      boot: new THREE.MeshStandardMaterial({ color: 0x0d0f12, roughness: 0.5 }),
    };
    const K = buildKeeper(mats); K.root.position.set(0, 0, KZ); scene.add(K.root);
    const ballMesh = new THREE.Mesh(new THREE.SphereGeometry(R, 40, 28), new THREE.MeshStandardMaterial({ map: ballTexture(), roughness: 0.42 }));
    ballMesh.castShadow = true; scene.add(ballMesh);
    const DOTS = 26;
    const dotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.85, depthWrite: false });
    const guide = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 10, 8), dotMat, DOTS); guide.visible = false; guide.frustumCulled = false; scene.add(guide);
    const ringMat = new THREE.MeshBasicMaterial({ color: appCol, transparent: true, opacity: 0.95, depthWrite: false, side: THREE.DoubleSide });
    const ring = new THREE.Mesh(new THREE.RingGeometry(0.2, 0.27, 40), ringMat); ring.visible = false; scene.add(ring);
    const ringDot = new THREE.Mesh(new THREE.CircleGeometry(0.06, 20), ringMat); ring.add(ringDot);

    /* layout: the free side of the stage (the phone takes the reading side on desktop), the camera framed to it */
    const L = { W: 1, H: 1, cx: 0.5, narrow: false };
    const camBase = new THREE.Vector3(), camLook = new THREE.Vector3();
    function layout() {
      const s = stage.getBoundingClientRect(), p = phoneEl.getBoundingClientRect();
      const W = Math.max(1, s.width), H = Math.max(1, s.height), narrow = W < 720;
      let x0 = 0, x1 = W;
      if (!narrow && p.width) { const pl = p.left - s.left, pr = p.right - s.left; if (pl > W / 2) x1 = pl - 18; else x0 = pr + 18; }
      Object.assign(L, { W, H, narrow, cx: (x0 + x1) / 2, fw: x1 - x0 });
      renderer.setSize(W, H, false);
      // a long lens from behind the spot, like the broadcast camera: the goal stays big, the ball still in frame
      camBase.set(0, narrow ? 2.3 : 2.0, narrow ? 19 : 19.5);
      const aTop = Math.atan2(GH + 0.45 - camBase.y, camBase.z), aBall = Math.atan2(-camBase.y, camBase.z - SPOT), aMid = (aTop + aBall) / 2;
      camLook.set(0, camBase.y + Math.tan(aMid) * camBase.z, 0);
      camera.position.copy(camBase); camera.up.set(0, 1, 0); camera.lookAt(camLook);
      camera.updateMatrixWorld();
      // the smallest field of view that keeps the frame, the keeper and the ball inside the free side
      const pts = [[-GW - 0.6, GH + 0.45, 0], [GW + 0.6, GH + 0.45, 0], [-GW - 0.6, 0, 0], [GW + 0.6, 0, 0], [0, -0.05, SPOT + 0.3]].map((q) => new THREE.Vector3(...q).applyMatrix4(camera.matrixWorldInverse));
      const fits = (fov) => {
        const f = (H / 2) / Math.tan(THREE.MathUtils.degToRad(fov) / 2);
        return pts.every((q, i) => {
          const sx = (q.x / -q.z) * f, sy = H / 2 - (q.y / -q.z) * f;
          if (Math.abs(sx) > L.fw / 2 - 14) return false;
          if (i < 2) return sy > H * (narrow ? 0.15 : 0.11);
          if (i === 4) return sy < H * (narrow ? 0.8 : 0.88);
          return true;
        });
      };
      let lo = 14, hi = 80; for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (fits(m)) hi = m; else lo = m; }
      camera.fov = hi;
      // centre the projection on the free side: a full frame wider than the canvas, the canvas a window into it
      const sft = L.cx - W / 2, fullW = W + 2 * Math.abs(sft);
      camera.aspect = fullW / H;
      camera.setViewOffset(fullW, H, sft > 0 ? 0 : 2 * Math.abs(sft), 0, W, H);
      camera.updateProjectionMatrix();
      stage.style.setProperty('--pk-cx', `${L.cx}px`);
      placeGrab();
      loop?.invalidate();
    }

    /* the shot model: a target on the goal line, a flight time, and a curl (a constant sideways pull) */
    const ball = { p: new THREE.Vector3(0, R, SPOT), v: new THREE.Vector3(), ax: 0, spin: new THREE.Vector3() };
    function makeShot({ tx, p, curve = 0, panenka = false }) {
      if (panenka) return { tx: clamp(tx, -1.2, 1.2) * 0.5, ty: 1.3, T: 1.25, bulge: 0, panenka: true, p };
      const pc = Math.min(p, 1);
      const ty = p > 1 ? 2.3 + (p - 1) * 7 : 0.22 + 2.08 * Math.pow(pc, 1.25);
      return { tx, ty, T: lerp(1.0, 0.52, pc), bulge: clamp(curve, -1, 1) * 1.7, panenka: false, p };
    }
    function launch(s) {
      const p0 = new THREE.Vector3(0, R, SPOT), T = s.T, ax = -8 * s.bulge / (T * T);
      return { p0, ax, v: new THREE.Vector3((s.tx - 0.5 * ax * T * T) / T, (s.ty - R + 0.5 * G * T * T) / T, -SPOT / T) };
    }
    function shotFromSwipe(pts) {
      const a = pts[0], b = pts[pts.length - 1];
      const dx = b.x - a.x, dy = b.y - a.y, len = Math.hypot(dx, dy);
      if (len < 18 || dy > -10) return null;
      const n = len / L.H, p = clamp((n - 0.04) / (L.narrow ? 0.34 : 0.4), 0, 1.15);
      const tx = Math.tan(clamp(Math.atan2(dx, -dy), -1.1, 1.1)) * (L.narrow ? 6.4 : 7.6);
      const nx = -dy / len, ny = dx / len; let dev = 0;
      for (const q of pts) { const d = (q.x - a.x) * nx + (q.y - a.y) * ny; if (Math.abs(d) > Math.abs(dev)) dev = d; }
      const c = Math.abs(dev / len) < 0.06 ? 0 : clamp(dev / len / 0.35, -1, 1);
      return makeShot({ tx, p, curve: c, panenka: p < 0.2 && Math.abs(tx) < 1.6 });
    }

    /* keeper AI: a side per shot, chosen before the shot and shown by his body; he learns from repeats */
    const KS = { side: 0, decided: false, tell: 0, idleT: 0, dive: null, x0: 0, fall: 0, pref: 1.0, phi: 0, x: 0, y: 0, armL: -0.55, armR: 0.55, forced: null };
    const hist = [];
    function decide() {
      if (KS.decided) return; KS.decided = true;
      let wl = 0.4, wr = 0.4, wc = 0.2;
      const h = hist.slice(-2);
      if (h.length === 2 && h[0] === h[1]) { if (h[0] < 0) wl += 0.35; else if (h[0] > 0) wr += 0.35; else wc += 0.3; }
      const r = Math.random() * (wl + wr + wc);
      KS.side = KS.forced ?? (r < wl ? -1 : r < wl + wr ? 1 : 0);
      KS.pref = 0.55 + Math.random() * 1.1;
      wake(1500);
    }
    function dive(s) {
      const sd = KS.side, LB = 2.2;
      let side = sd, hx, hy, reach = 0.95, react = 0.08, star = false;
      if (sd === 0) { side = Math.sign(s.tx) || 1; hx = clamp(s.tx, -1.25, 1.25); hy = clamp(s.ty, 0.4, 2.3); reach = 0.45; react = 0.18; star = true; }
      else if (s.panenka) { hx = sd * 2.6; hy = 1.0; }
      else if (Math.sign(s.tx) === sd || Math.abs(s.tx) < 0.9) { hx = s.tx; hy = clamp(s.ty, 0.25, 2.5); }
      else { hx = sd * 2.6; hy = KS.pref; }
      const fy = star ? clamp(hy - 1.9, 0.05, 0.4) : clamp(hy - 1.05, 0, 0.35);
      const lo = side > 0 ? KS.x - 0.3 : KS.x - reach, hi = side > 0 ? KS.x + reach : KS.x + 0.3;
      const fx = clamp(hx - side * Math.sqrt(Math.max(0, LB * LB - (hy - fy) * (hy - fy))), lo, hi);
      let phi = Math.atan2(hx - fx, Math.max(0.05, hy - fy));
      if (star) phi = clamp(phi, -0.45, 0.45);
      // he times the dive to meet the ball (a guess is a guess: on the wrong side he still goes at that moment)
      const arrive = s.T * (SPOT - KZ) / SPOT, dur = 0.46;
      KS.dive = { t: -Math.max(react, arrive - dur + 0.02), dur, from: { x: KS.x, y: KS.y, phi: KS.phi, aL: KS.armL, aR: KS.armR }, fx, fy, phi, side, star };
    }
    function keeperStep(dt) {
      const d = KS.dive;
      if (d) {
        d.t += dt;
        if (d.t > 0) {
          const u = d.t / d.dur, e = easeOut(u);
          if (u <= 1) {
            KS.x = lerp(d.from.x, d.fx, e); KS.phi = lerp(d.from.phi, d.phi, e);
            KS.y = lerp(d.from.y, d.fy, e) + (d.star ? 0.12 : 0.22) * Math.sin(Math.PI * e);
            const ea = easeOut(u * 1.7);
            KS.armR = lerp(d.from.aR, d.star ? 2.6 : Math.PI - 0.1, ea); KS.armL = lerp(d.from.aL, d.star ? -2.6 : -(Math.PI - 0.1), ea);
          } else if (!d.star && u > 1.5) {   // he lands: the body tips over onto the grass
            const f = easeOut((u - 1.5) * 1.6);
            KS.phi = lerp(d.phi, d.side * 1.5, f); KS.y = lerp(d.fy, 0.16, f);
          } else if (d.star && u > 1.15) { const f = easeOut((u - 1.15) * 2.5); KS.y = lerp(d.fy, 0, f); }
        }
      } else {
        // ready stance: a light bounce; once a side is chosen he leans into it and opens that glove (the tell)
        KS.idleT += dt;
        const target = KS.decided ? 1 : 0;
        KS.tell += (target - KS.tell) * Math.min(1, dt * 7);
        const t = KS.tell, sd = KS.side;
        KS.x = KS.x0 + Math.sin(KS.idleT * 2.1) * 0.06 * (1 - t) + sd * 0.2 * t;
        KS.y = Math.abs(Math.sin(KS.idleT * 4.2)) * 0.025 * (1 - t);
        KS.phi = sd * 0.11 * t;
        const open = (s) => (sd === s ? 1.25 : sd === 0 ? 0.95 : 0.45);
        KS.armR = lerp(0.55, open(1), t); KS.armL = -lerp(0.55, open(-1), t);
      }
      K.root.position.set(KS.x, KS.y, KZ); K.root.rotation.z = -KS.phi;
      K.arms[1].pivot.rotation.z = KS.armR; K.arms[0].pivot.rotation.z = KS.armL;
    }
    function resetKeeper() {
      Object.assign(KS, { dive: null, decided: false, tell: 0, side: 0, x: 0, y: 0, phi: 0, armL: -0.55, armR: 0.55, x0: 0 });
      keeperStep(0);
    }
    // the keeper's body as capsules: feet to head, shoulder to glove (world space)
    const segA = [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()];
    const tmp = new THREE.Vector3(), tmp2 = new THREE.Vector3();
    function keeperHit() {
      K.root.updateMatrixWorld(true);
      segA[0].set(0, 0.1, 0).applyMatrix4(K.root.matrixWorld); K.head.getWorldPosition(segA[1]);
      K.arms[0].pivot.getWorldPosition(segA[2]); K.arms[0].glove.getWorldPosition(segA[3]);
      K.arms[1].pivot.getWorldPosition(segA[4]); K.arms[1].glove.getWorldPosition(segA[5]);
      const caps = [[0, 1, 0.2], [2, 3, 0.11], [4, 5, 0.11], [1, 3, 0.09], [1, 5, 0.09], [3, 5, 0.1]];
      for (const [i, j, r] of caps) {
        const a = segA[i], b = segA[j];
        tmp.subVectors(b, a); const l2 = tmp.lengthSq();
        const t = l2 ? clamp(tmp2.subVectors(ball.p, a).dot(tmp) / l2, 0, 1) : 0;
        const c = tmp.multiplyScalar(t).add(a), d = ball.p.distanceTo(c);
        if (d < r + R) return { n: tmp2.subVectors(ball.p, c).normalize(), depth: r + R - d };
      }
      return null;
    }

    /* the series */
    let state = 'intro', shotN = 0, goals = 0, results = [], shot = null, F = null, simT = 0, resT = 0, drag = null, aim = { x: 0, p: 0.62, curve: 0, panenka: false, on: false };
    let cam = { push: 0, shake: 0, follow: 0 }, netAmp = { a: 0, t: 0 }, glowA = 0;
    function paintHud() {
      shotEl.textContent = String(Math.min(SHOTS, shotN + 1)); goalsEl.textContent = String(goals);
      dots.forEach((d, i) => { const r = results[i]; d.className = r ? (IS_GOAL(r) ? 'is-goal' : 'is-miss') : i === shotN && state !== 'end' ? 'is-now' : ''; });
      room.score(goals, results.length - goals);
    }
    function setBall(drop) {
      ball.p.set(0, drop && !reduce ? 0.9 : R, SPOT); ball.v.set(0, 0, 0); ball.ax = 0; ball.spin.set(0, 0, 0);
    }
    function ready() {
      state = 'ready'; shot = null; F = null; resetKeeper(); setBall(true);
      stage.classList.add('is-ready'); stage.classList.remove('is-aiming', 'is-call');
      paintHud(); placeGrab(); wake(1600);
    }
    function newSeries() {
      shotN = 0; goals = 0; results = []; hist.length = 0; endEl.hidden = true; stage.classList.remove('is-end');
      ready(); room.react('start');
    }
    function kick(s) {
      if (state !== 'ready' || !s) return;
      decide(); dive(s); shot = s;
      const L0 = launch(s);
      ball.p.copy(L0.p0); ball.v.copy(L0.v); ball.ax = L0.ax;
      ball.spin.set(0, s.bulge * 6, 0);
      F = { cross: null, keeper: false, post: false, bar: false, net: false, t: 0, out: null };
      state = 'flight'; simT = 0; drag = null; aim.on = false;
      stage.classList.remove('is-ready', 'is-aiming'); stage.classList.add('has-kicked');
      guide.visible = ring.visible = false;
      avatar?.perform?.('kick');
      wake(4000);
    }
    function resolve(kind) {
      if (state !== 'flight') return;
      state = 'result'; resT = 0;
      results.push(kind); hist.push(Math.abs(shot.tx) < 1.0 ? 0 : Math.sign(shot.tx));
      if (IS_GOAL(kind)) { goals++; glowA = 1; avatar?.perform?.('celebrate'); }
      shotN++;
      paintHud(); room.react(kind);
      callEl.textContent = CALL[kind];
      callEl.dataset.kind = IS_GOAL(kind) ? 'goal' : 'miss';
      stage.classList.remove('is-call'); void stage.offsetWidth; stage.classList.add('is-call');
      live.textContent = __t('sporchat.pk.live.shot.proto', { shot: shotN, result: SAY[kind], goals: goals, total: shotN });
      wake(3000);
    }
    function finish() {
      state = 'end'; setBall(false); stage.classList.add('is-end'); stage.classList.remove('is-call', 'is-ready');
      const k = goals === 5 ? 'end5' : goals >= 3 ? 'endGood' : 'endBad';
      room.react(k);
      endEl.querySelector('.pk__end-h').textContent = __t('sporchat.pk.end.h', { goals: goals });
      endEl.querySelector('.pk__end-p').textContent = goals === 5 ? __t('sporchat.pk.end.p5') : goals === 4 ? __t('sporchat.pk.end.p4') : goals === 3 ? __t('sporchat.pk.end.p3') : goals === 2 ? __t('sporchat.pk.end.p2') : __t('sporchat.pk.end.p01');
      endEl.querySelector('.pk__end-list').innerHTML = results.map((r) => `<li class="${IS_GOAL(r) ? 'is-goal' : 'is-miss'}"></li>`).join('');
      [...endEl.querySelectorAll('.pk__end-list li')].forEach((li, i) => { li.textContent = CALL[results[i]]; });
      endEl.hidden = false; paintHud();
      live.textContent = __t('sporchat.pk.live.end', { goals: goals });
      if (stage.contains(document.activeElement)) endEl.querySelector('button').focus({ preventScroll: true });
      wake(1200);
    }

    /* physics: fixed 240 Hz steps for the ball and the keeper */
    function step(dt) {
      if (state === 'ready' || state === 'intro') {
        keeperStep(dt);
        if (ball.p.y > R) { ball.v.y -= G * dt; ball.p.y += ball.v.y * dt; if (ball.p.y < R) { ball.p.y = R; ball.v.y = Math.abs(ball.v.y) > 0.6 ? -ball.v.y * 0.45 : 0; } }
        return;
      }
      keeperStep(dt);
      if (state !== 'flight' && state !== 'result') return;
      simT += dt;
      const p = ball.p, v = ball.v;
      v.x += ball.ax * dt; v.y -= G * dt;
      const prevZ = p.z;
      p.addScaledVector(v, dt);
      if (F && !F.cross && prevZ > 0 && p.z <= 0) { const k = prevZ / (prevZ - p.z); F.cross = { x: p.x - v.x * dt * (1 - k), y: p.y - v.y * dt * (1 - k) }; }
      // ground
      if (p.y < R) { p.y = R; if (v.y < 0) v.y = Math.abs(v.y) > 0.8 ? -v.y * 0.5 : 0; v.x *= 1 - 1.2 * dt; v.z *= 1 - 1.2 * dt; ball.ax = 0; }
      // keeper
      if (state === 'flight' && Math.abs(p.z - KZ) < 0.6) {
        const h = keeperHit();
        if (!F.atKeeper && p.z < KZ) F.atKeeper = { ball: p.toArray().map((x) => +x.toFixed(2)), body: segA.map((q) => q.toArray().map((x) => +x.toFixed(2))), t: +simT.toFixed(3) };
        if (h) {
          const vn = v.dot(h.n);
          if (vn < 0) { v.addScaledVector(h.n, -1.35 * vn); v.multiplyScalar(0.5); if (v.z < 1) v.z = 1 + Math.random() * 1.5; if (v.length() > 6) v.setLength(6); }
          p.addScaledVector(h.n, h.depth); ball.ax = 0; F.keeper = true;
        }
      }
      // posts and bar
      for (const sx of [-GW, GW]) {
        const dx = p.x - sx, dz = p.z, d = Math.hypot(dx, dz);
        if (d < R + PR && p.y < GH + PR) {
          const nx = dx / d, nz = dz / d, vn = v.x * nx + v.z * nz;
          if (vn < 0) { v.x -= 1.65 * vn * nx; v.z -= 1.65 * vn * nz; if (!F.post) { F.post = true; cam.shake = reduce ? 0 : 1; } }
          p.x = sx + nx * (R + PR); p.z = nz * (R + PR); ball.ax = 0;
        }
      }
      if (Math.abs(p.x) < GW) {
        const dy = p.y - GH, dz = p.z, d = Math.hypot(dy, dz);
        if (d < R + PR) {
          const ny = dy / d, nz = dz / d, vn = v.y * ny + v.z * nz;
          if (vn < 0) { v.y -= 1.65 * vn * ny; v.z -= 1.65 * vn * nz; if (!F.bar) { F.bar = true; cam.shake = reduce ? 0 : 1; } }
          p.y = GH + ny * (R + PR); p.z = nz * (R + PR); ball.ax = 0;
        }
      }
      // inside the goal: the net swallows it
      if (p.z < -R && Math.abs(p.x) < GW && p.y < GH) {
        if (state === 'flight') {
          const kind = (F.post || F.bar) ? 'postIn' : shot.panenka ? 'panenka' : (F.cross && Math.abs(F.cross.x) > 2.45 && F.cross.y > 1.45) ? 'top' : 'goal';
          resolve(kind);
        }
        if (p.z < -NET_D + R) { p.z = -NET_D + R; if (!F.net) { F.net = true; netAmp.a = reduce ? 0.12 : 0.55; netAmp.t = 0; netU.uHit.value.set(p.x, p.y, 0); } v.z = Math.abs(v.z) * 0.12; v.x *= 0.3; v.y *= 0.4; }
        const roof = lerp(GH, 2.2, clamp(-p.z / NET_D, 0, 1)) - R;
        if (p.y > roof) { p.y = roof; v.y = -Math.abs(v.y) * 0.3; }
        if (Math.abs(p.x) > GW - R - PR) { p.x = Math.sign(p.x) * (GW - R - PR); v.x *= -0.2; }
      }
      ball.spin.multiplyScalar(1 - 0.6 * dt);
      // decided?
      if (state === 'flight') {
        const gone = simT > shot.T + 1.7 || (p.z < -0.6 && !(Math.abs(p.x) < GW && p.y < GH)) || (F.keeper && (p.z > 2.2 || v.length() < 1.2)) || (simT > shot.T + 0.4 && v.length() < 0.5);
        if (gone) {
          if (F.keeper) resolve(shot.panenka ? 'panenkaSaved' : 'save');
          else if (F.post) resolve('post');
          else if (F.bar) resolve('bar');
          else resolve(F.cross && F.cross.y > GH ? 'over' : 'wide');
        }
      }
    }

    /* the guide: dots along the predicted flight and a ring where it meets the goal */
    const m4 = new THREE.Matrix4(), q0 = new THREE.Quaternion(), sc = new THREE.Vector3();
    function showGuide(s) {
      if (!s) { guide.visible = ring.visible = false; return; }
      const L0 = launch(s);
      for (let i = 0; i < DOTS; i++) {
        const t = ((i + 1) / DOTS) * s.T;
        tmp.set(L0.p0.x + L0.v.x * t + 0.5 * L0.ax * t * t, L0.p0.y + L0.v.y * t - 0.5 * G * t * t, L0.p0.z + L0.v.z * t);
        const k = 1 - i / DOTS * 0.55; sc.setScalar(k);
        m4.compose(tmp, q0, sc); guide.setMatrixAt(i, m4);
      }
      guide.instanceMatrix.needsUpdate = true; guide.visible = true;
      const inside = Math.abs(s.tx) < GW - R - PR && s.ty < GH - R - PR;
      ring.position.set(s.tx, clamp(s.ty, 0.12, 3.6), 0.05); ring.visible = true;
      ringMat.color.set(inside ? appCol : 0xff7a59);
      stage.dataset.aim = inside ? 'in' : 'out';
    }
    const keyShot = () => makeShot({ tx: aim.x * 4.3, p: aim.p, curve: aim.curve, panenka: aim.panenka });

    /* input: the swipe starts on the ball (a handle that follows it on screen; touch-action only there, the page scrolls) */
    const proj = new THREE.Vector3();
    function placeGrab() {
      proj.set(0, R, SPOT).project(camera);
      const x = (proj.x * 0.5 + 0.5) * L.W, y = (-proj.y * 0.5 + 0.5) * L.H;
      // physical coordinates from the projection: the handle is placed by left/top, not by the reading side
      grab.style.transform = `translate(${x}px, ${y}px)`;
      const cw = coach.offsetWidth || 220;
      coach.style.left = `${clamp(x - cw / 2, 12, L.W - cw - 12)}px`;
      coach.style.top = `${clamp(y - 112, 12, L.H - 60)}px`;
    }
    grab.hidden = false;
    grab.addEventListener('pointerdown', (e) => {
      if (state !== 'ready') return;
      e.preventDefault();
      grab.setPointerCapture(e.pointerId);
      drag = { id: e.pointerId, pts: [{ x: e.clientX, y: e.clientY }] };
      decide(); stage.classList.add('is-aiming'); wake(800);
    });
    grab.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag.pts.push({ x: e.clientX, y: e.clientY }); if (drag.pts.length > 90) drag.pts.splice(1, 1);
      showGuide(shotFromSwipe(drag.pts)); wake(600);
    });
    grab.addEventListener('pointerup', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const s = shotFromSwipe(drag.pts); drag = null;
      if (s) kick(s); else { stage.classList.remove('is-aiming'); showGuide(null); coach.classList.remove('is-nudge'); void coach.offsetWidth; coach.classList.add('is-nudge'); wake(400); }
    });
    grab.addEventListener('pointercancel', () => { drag = null; showGuide(null); stage.classList.remove('is-aiming'); });
    grab.addEventListener('keydown', (e) => {
      if (state !== 'ready') return;
      const c = e.code, k = e.key;
      if (k === 'ArrowLeft' || k === 'ArrowRight') aim.x = clamp(aim.x + (k === 'ArrowRight' ? 0.06 : -0.06), -1.1, 1.1);
      else if (k === 'ArrowUp' || k === 'ArrowDown') aim.p = clamp(aim.p + (k === 'ArrowUp' ? 0.05 : -0.05), 0.1, 1.1);
      else if (c === 'KeyC') aim.curve = aim.curve === 0 ? -1 : aim.curve < 0 ? 1 : 0;
      else if (c === 'KeyP') aim.panenka = !aim.panenka;
      else if (k === 'Enter' || k === ' ') { e.preventDefault(); kick(keyShot()); return; }
      else return;
      e.preventDefault(); aim.on = true; decide(); stage.classList.add('is-aiming');
      showGuide(keyShot()); wake(800);
    });
    grab.addEventListener('click', (e) => e.preventDefault());
    endEl.querySelector('button').addEventListener('click', () => { newSeries(); grab.focus({ preventScroll: true }); });
    function autoShot() {
      if (state === 'end') newSeries();
      if (state !== 'ready') return;
      decide();
      const side = Math.random() < 0.5 ? -1 : 1, s = makeShot({ tx: side * (1.4 + Math.random() * 1.9), p: 0.55 + Math.random() * 0.4, curve: (Math.random() - 0.5) * 0.8 });
      showGuide(s); stage.classList.add('is-aiming');
      setTimeout(() => kick(s), reduce ? 350 : 750);
    }

    /* loop + governor */
    let loop = null;
    let wakeUntil = 0;
    function wake(ms) { wakeUntil = Math.max(wakeUntil, performance.now() + ms); loop?.wake(ms); }
    const profile = detectGpu();
    const top = Math.min(devicePixelRatio || 1, 2);
    const levels = [top, Math.min(top, 1.5), 1, 0.85].filter((v, i, a) => a.indexOf(v) === i).map((dpr) => ({ name: `dpr${dpr}`, dpr }));
    const governor = createGovernor({ levels, start: profile.tier === 'low' ? levels.length - 2 : 0, persistKey: 'nadavai.work.pk', gpuKey: profile.renderer, apply: (l) => { renderer.setPixelRatio(l.dpr); if (L.W > 1) renderer.setSize(L.W, L.H, false); } });
    governor.init();
    const qv = new THREE.Quaternion(), ax3 = new THREE.Vector3(), UP = new THREE.Vector3(0, 1, 0);
    loop = createFrameLoop({
      mode: 'demand', observe: stage, fps: 60, simStep: 1 / 240, maxSubSteps: 16,
      update: (dt) => step(dt),
      onFrame: (s) => governor.sample({ interval: s.interval, cpuMs: s.cpuMs, stall: s.stall }),
      render: ({ dt, now }) => {
        if (state === 'result') {
          resT += dt;
          if (resT > (reduce ? 1.4 : 2.1)) { if (shotN >= SHOTS) finish(); else ready(); }
        }
        // the ball rolls
        const sp = ball.v.length();
        if (sp > 0.05 && (state === 'flight' || state === 'result')) {
          ax3.set(ball.v.z, 0, -ball.v.x); const l = ax3.length();
          if (l > 1e-4) { qv.setFromAxisAngle(ax3.divideScalar(l), sp / R * 0.5 * dt); ballMesh.quaternion.premultiply(qv); }
          if (ball.spin.y) { qv.setFromAxisAngle(UP, ball.spin.y * dt); ballMesh.quaternion.premultiply(qv); }
        }
        ballMesh.position.copy(ball.p);
        // the net ripple and the goal glow
        if (netAmp.a > 0) { netAmp.t += dt; const a = netAmp.a * Math.exp(-netAmp.t * 3.2) * Math.cos(netAmp.t * 15); netU.uAmp.value = a; if (netAmp.t > 1.6) { netAmp.a = 0; netU.uAmp.value = 0; } }
        glowA = Math.max(0, glowA - dt * 0.7); glow.material.opacity = 0.05 + glowA * 0.32;
        // camera: a slow push toward the goal after the kick, a short shake on the woodwork (never under reduced motion)
        if (!reduce) {
          const want = state === 'flight' || state === 'result' ? 1 : 0;
          cam.push += (want - cam.push) * Math.min(1, dt * (want ? 1.6 : 3));
          cam.follow += ((state === 'flight' || state === 'result' ? clamp(ball.p.x, -3, 3) : 0) - cam.follow) * Math.min(1, dt * 2);
          cam.shake = Math.max(0, cam.shake - dt * 3.5);
          const sh = cam.shake * cam.shake * 0.05;
          camera.position.set(camBase.x + cam.follow * 0.12 + Math.sin(now * 0.09) * sh, camBase.y + Math.cos(now * 0.11) * sh, camBase.z - cam.push * 1.8);
          camera.lookAt(camLook.x + cam.follow * 0.2, camLook.y, camLook.z);
        }
        renderer.render(scene, camera);
        if (state === 'ready') placeGrab();
        return state === 'flight' || state === 'result' || drag != null || performance.now() < wakeUntil || ball.p.y > R + 0.001 || cam.push > 0.01 || cam.shake > 0;
      },
    });
    const ro = new ResizeObserver(() => layout()); ro.observe(stage);
    layout();
    resetKeeper(); setBall(false);
    loop.start();
    requestAnimationFrame(() => governor.markReady());
    newSeries();
    stage.dispatchEvent(new CustomEvent('kick:ready'));

    function dispose() {
      loop.dispose(); ro.disconnect();
      scene.traverse((o) => { o.geometry?.dispose?.(); const m = o.material; (Array.isArray(m) ? m : m ? [m] : []).forEach((mm) => { mm.map?.dispose?.(); mm.dispose(); }); });
      envRT.dispose(); renderer.dispose(); renderer.forceContextLoss?.();
      stage.classList.remove('is-ready', 'is-aiming', 'is-call', 'is-end');
      delete stage.__game;
    }
    const api = {
      autoShot, newSeries, dispose, governor,
      focus: () => grab.focus({ preventScroll: true }),
      forceKeeper(side) { KS.forced = side; },
      shoot(o) { if (state !== 'ready') return false; kick(makeShot(o)); return true; },
      get state() { return state; }, get goals() { return goals; }, get shots() { return shotN; }, get results() { return [...results]; },
      get keeper() { return { side: KS.side, decided: KS.decided, x: KS.x, phi: KS.phi, dive: KS.dive && { fx: KS.dive.fx, fy: KS.dive.fy, phi: KS.dive.phi } }; },
      get flight() { return F && { ...F }; }, get shot() { return shot && { ...shot }; },
      get loopState() { return loop.state; },
      grabPoint() { const r = grab.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; },
    };
    stage.__game = api;
    return api;
  }
}
