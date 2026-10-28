// dims/about.js: the about page's dimension (2026-10-28). The page's idea was the story's age (js/worlds/w-about.js):
// coarse Android-green pixels and falling data at fourteen, refining step by step into today's smooth amber light. The
// full version is a place you climb: a tower of eight levels, one hexagonal platform per stage of the story, spiralling
// up around an XP column that fills as you go. The scroll climbs the camera from platform to platform; on each one the
// swarm builds that stage's object, coarse and green at the bottom, finer and warmer with every level, while the data
// rain thins and soft orbs take over. The DOM (the portrait, the bio's own levels, cards and HUD) stays the page.
//
//   hero      the foot of the tower, pixels raining      lv1  the HTC phone and a screwdriver   lv2  a laptop and books
//   lv3       a Jerusalem wall and its gate              lv4  the first system's phone          lv5  a dive: a vortex
//   lv6       the AI engineer's badge                    lv7  today: a skyline of screens       lv8  the boss: 100M
//   outro     three promises, three pillars at the top   your turn: a play sign                 end  the whole tower
import { startDim, TAU, clamp, lerp, sstep, rnd, mid, aim, canvasTex, FOG_ADD, HASH } from './core.js';
import { vox, formOf, at, sdBox, seg, textMask, mixC, points } from './story-kit.js';

const NL = 8;
const RP = 13, DY = 8, A0 = -0.35, DA = 0.8;                  // platform j: radius, rise and turn per level
const ang = (j) => A0 + j * DA;
const PJ = (j) => [Math.cos(ang(j)) * RP, j * DY, Math.sin(ang(j)) * RP];
const TOP = NL * DY;                                          // the summit platform (promises, your turn)
const GREEN = [0.16, 0.78, 0.42], AMBER = [0.95, 0.52, 0.18], BOSS = [1, 0.3, 0.16];
const lvCol = (j) => (j >= 7 ? BOSS : mixC(GREEN, AMBER, Math.pow(j / 6, 1.1)));
const polar = (a, r, y) => [Math.cos(a) * r, y, Math.sin(a) * r];

/* where a level sits in the page: the bio pins its stage and swaps the levels over the pin's length */
const lvAt = (i) => (vh) => {
  const sp = document.querySelector('.bio .pin-spacer');
  if (!sp) return mid(`#bio-lv-${i + 1}`, vh);
  const top = sp.getBoundingClientRect().top + scrollY;
  const span = sp.offsetHeight - (sp.firstElementChild?.offsetHeight || vh);
  return top + ((i + 0.5) / NL) * span;
};

/* the levels' objects: 2D masks in u ∈ [-asp, asp], v ∈ [-1, 1]; hot(u, v) marks the lit part (a screen, a band) */
const inHex = (u, v, r) => Math.abs(v) <= r * 0.866 && Math.abs(u) * 0.866 + Math.abs(v) * 0.5 <= r * 0.866;
let AI = null, M100 = null;   // drawn when the shapes are built, so the page's fonts have had their chance to land
const texts = () => { AI ||= textMask('AI', { w: 256, h: 256, font: '800 150px Archivo, sans-serif' }); M100 ||= textMask('100M', { w: 600, h: 200, font: '800 168px Archivo, sans-serif' }); };
const LEVELS = [
  { asp: 1.05, H: 6, D: 1.2, // the HTC: a phone with its back off, and a screwdriver
    mask: (u, v) => (sdBox(u + 0.3, v, 0.5, 0.95, 0.14) < 0) || seg(u, v, 0.55, -0.95, 0.68, -0.35) < 0.13 || seg(u, v, 0.68, -0.35, 0.9, 0.7) < 0.05,
    hot: (u, v) => sdBox(u + 0.3, v + 0.05, 0.38, 0.72, 0.04) < 0 },
  { asp: 1.6, H: 5, D: 1.4, // a laptop open on the desk, a stack of books beside it
    mask: (u, v) => { const scr = sdBox(u + 0.45, v - 0.15, 0.7, 0.55, 0.05) < 0; const base = v < -0.48 && v > -0.62 && u > -1.35 && u < 0.45;
      const books = [[0.95, -0.82, 0.48, 0.12], [1.0, -0.56, 0.42, 0.12], [0.92, -0.3, 0.44, 0.12]].some(([x, y, w, h]) => sdBox(u - x, v - y, w, h) < 0);
      return scr || base || books || (v < -0.94); },
    hot: (u, v) => sdBox(u + 0.45, v - 0.15, 0.58, 0.44, 0.02) < 0 },
  { asp: 1.7, H: 5.2, D: 1.6, // Jerusalem: a stone wall with its battlements and an arched gate, a lamp lit in it
    mask: (u, v) => { if (Math.abs(u) > 1.65) return false; const crown = v > 0.45 && v < 0.78 && ((u + 1.65) * 2.6) % 1 < 0.58;
      const wall = v <= 0.45; const gate = (Math.abs(u) < 0.42 && v < -0.05) || Math.hypot(u, v + 0.05) < 0.42;
      const slit = [-1.05, 1.05].some((x) => Math.abs(u - x) < 0.06 && v > -0.2 && v < 0.2);
      return (wall && !gate && !slit) || crown || Math.hypot(u, v + 0.62) < 0.07; },
    hot: (u, v) => Math.hypot(u, v + 0.62) < 0.1 || v > 0.6 },
  { asp: 0.62, H: 7, D: 1.0, // the first system: a phone, its ring of the day's cash and two rows
    mask: (u, v) => { const f = sdBox(u, v, 0.56, 0.98, 0.14); if (f > 0) return false; if (f > -0.08) return true;
      const r = Math.hypot(u, v - 0.3); return (r > 0.26 && r < 0.38) || (Math.abs(v + 0.32) < 0.06 && Math.abs(u) < 0.38) || (Math.abs(v + 0.55) < 0.06 && Math.abs(u) < 0.38) || (v > 0.82 && Math.abs(u) < 0.3); },
    hot: (u, v) => { const r = Math.hypot(u, v - 0.3); return r > 0.26 && r < 0.38; } },
  null, // the dive: a vortex, built in 3D below
  { asp: 1, H: 6.2, D: 1.2, // the AI engineer's badge: a hexagon, its band and the letters
    mask: (u, v) => inHex(u, v, 0.98) && (!inHex(u, v, 0.82) || (inHex(u, v, 0.72) && AI.mask(u * 1.25, v * 1.25))),
    hot: (u, v) => !inHex(u, v, 0.82) },
  { asp: 2.3, H: 4.6, D: 1.0, // today: a skyline of screens, the systems in production
    mask: (u, v) => { if (v < -0.9) return Math.abs(u) < 2.25; return SKY.some(([x, w, h]) => { const d = sdBox(u - x, v + 0.9 - h, w, h, 0.05); return d < 0 && (d > -0.07 || (v + 0.9 - h) > h * 0.4 || ((v * 6) % 1 + 1) % 1 < 0.45); }); },
    hot: (u, v) => SKY.some(([x, w, h]) => sdBox(u - x, v + 0.9 - h, w - 0.07, h - 0.07) < 0) },
  { asp: 2.4, H: 5.4, D: 1.3, // the boss: 100M, and its health bar barely started
    mask: (u, v) => (v > -0.42 && M100.mask(u * 1.03, (v - 0.22) * 1.35)) || (v < -0.62 && v > -0.95 && Math.abs(u) < 2.2 && (Math.abs(u) > 2.1 || v > -0.68 || v < -0.89 || u < -1.98)),
    hot: (u, v) => v < -0.62 && u < -1.98 },
];
const SKY = [[-1.85, 0.2, 0.42], [-1.35, 0.26, 0.7], [-0.68, 0.42, 0.36], [-0.05, 0.2, 0.62], [0.42, 0.22, 0.48], [0.95, 0.3, 0.78], [1.55, 0.2, 0.4], [1.98, 0.24, 0.58]];

/* ── shaders ── */
const FLOOR_VS = /* glsl */`varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const FLOOR_FS = /* glsl */`
uniform float uAge, uTime; uniform vec3 uA, uB;
varying vec3 vW;
#include <fog_pars_fragment>
${HASH}
void main(){
  float cell = mix(3.2, 0.7, uAge);                       // the pixels shrink as the story grows up
  vec2 g = vW.xz / cell, id = floor(g), f = fract(g);
  float h = h21(id), lit = step(0.9, h) * (0.55 + 0.45 * sin(uTime * (0.6 + h * 2.0) + h * 40.0));
  float line = 1.0 - smoothstep(0.0, 0.06, min(min(f.x, f.y), min(1.0 - f.x, 1.0 - f.y)));
  float r = length(vW.xz);
  float near = exp(-r * 0.03);
  vec3 c = mix(uA, uB, uAge);
  vec3 col = c * (lit * 0.55 * near + line * 0.12 * near) + c * 0.05 * exp(-r * 0.05);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;
const RAIN_VS = /* glsl */`
attribute vec4 aP; uniform float uTime, uSpan, uY0;
varying float vA, vY;
#include <fog_pars_vertex>
void main(){
  float y = uY0 + mod(aP.y - uTime * aP.w, uSpan);
  vec3 p = vec3(aP.x, y, aP.z) + position;
  vY = position.y; vA = smoothstep(0.0, 8.0, y - uY0) * smoothstep(0.0, 10.0, uSpan - (y - uY0));
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const RAIN_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; varying float vA, vY;
#include <fog_pars_fragment>
void main(){ float head = smoothstep(-0.9, 0.9, vY);      // a bright head, a fading tail
  gl_FragColor = vec4(uCol * (0.25 + head * head * 1.6) * vA * uI, 1.0);
  ${FOG_ADD}
}`;
const XP_VS = /* glsl */`varying vec3 vW, vN;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const XP_FS = /* glsl */`
uniform float uFill, uTime; uniform vec3 uA, uB;
varying vec3 vW, vN;
#include <fog_pars_fragment>
void main(){
  float on = step(vW.y, uFill);
  float t = clamp(vW.y / ${TOP.toFixed(1)}, 0.0, 1.0);
  vec3 c = mix(uA, uB, t);
  float side = 1.0 - abs(vN.y);
  float edge = exp(-abs(vW.y - uFill) * 1.6);
  vec3 col = mix(vec3(0.03, 0.035, 0.035) + c * 0.05 * side, c * (0.5 + 0.2 * side), on) + vec3(1.0, 0.95, 0.85) * edge * 0.7;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;

export function initDim(opts) {
  let N = 0;
  const P = {};
  const lvCam = (j) => {
    const f = PJ(j); const focus = [f[0], f[1] + 4.6, f[2]];
    const pos = polar(ang(j) + 0.3, 31, f[1] + 7 + (j % 2) * 1.5);
    const pp = polar(ang(j) + 0.12, 31, f[1] + 9);
    return { pos, tgt: aim(pos, focus, 0.6, -0.6), fov: 46 + (j % 3), roll: j % 2 ? 0.025 : -0.02, pp, tp: [focus[0], focus[1] + 1.6, focus[2]] };
  };
  const lvVia = (j) => { const a = ang(j) + DA * 0.5 + 0.3; return [polar(a, 46, j * DY + DY * 0.5 + 9), polar(a - 0.4, 6, j * DY + DY * 0.5 + 4)]; };
  const CUT = ['glitch', 'scan', 'fold', 'glitch', 'ink', 'warp', 'scan', 'glitch'];
  const spec = {
    name: 'about', base: '#0B0D0C', accent: '#E8913C', ink: '#030504',
    fog: { color: 0x07100b, density: 0.0115 }, exposure: 1.05, bloom: { strength: 0.55, radius: 0.5, threshold: 0.86 },
    intro: [0, -6, 14], parallax: 0.8,
    swarm: { n: [1500, 760], key: [0.5, 1, 0.3], keyCol: 0xfff0dc, amb: 0x2a302c },
    chapters: [
      { at: 'top', cam: { pos: [30, -4, 26], tgt: aim([30, -4, 26], [0, 18, 0], 7, 0), fov: 56, pp: [24, -2, 34], tp: [0, 16, 0] },
        via: [[38, 2, 0], [4, 6, -2]] },
      ...Array.from({ length: NL }, (_, j) => ({ at: lvAt(j), cam: lvCam(j), cut: CUT[j], via: j < NL - 1 ? lvVia(j) : [polar(ang(8) - 0.2, 48, TOP + 4), polar(ang(8), 6, TOP + 3)] })),
      { at: '.bio__outro', cam: (() => { const f = PJ(8), pos = polar(ang(8) + 0.42, 30, TOP + 9); return { pos, tgt: aim(pos, [f[0], TOP + 4, f[2]], 6, 0), fov: 48, pp: polar(ang(8) + 0.2, 30, TOP + 11), tp: [f[0], TOP + 5, f[2]] }; })(), cut: 'fold' },
      { at: '#abOutro', cam: (() => { const f = PJ(8), pos = polar(ang(8) - 0.05, 30, TOP + 4); return { pos, tgt: aim(pos, [f[0] * 0.8, TOP + 9, f[2] * 0.8], 9, -2), fov: 50, roll: 0.03, pp: polar(ang(8), 34, TOP + 2), tp: [f[0] * 0.8, TOP + 13, f[2] * 0.8] }; })(), cut: 'warp' },
      { at: 'end', cam: { pos: [62, TOP + 26, 58], tgt: aim([62, TOP + 26, 58], [0, TOP * 0.45, 0], 26, 0), fov: 52, pp: [70, TOP + 30, 74] }, cut: 'ink' },
    ],
    async build(ctx) {
      const { THREE, scene, time, phone, aniso, fogU } = ctx;
      N = ctx.swarm.n;
      scene.add(new THREE.HemisphereLight(0x6a7a70, 0x0c0a08, 0.7));
      const key = new THREE.PointLight(0xffe0b0, 220, 46, 1.5); scene.add(key);
      const gA = new THREE.Color(...GREEN), gB = new THREE.Color(...AMBER);

      /* the ground far below: a pixel field whose cells shrink with the story */
      const floorU = { ...fogU(), uAge: { value: 0 }, uTime: time, uA: { value: gA }, uB: { value: gB } };
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(600, 600), new THREE.ShaderMaterial({ vertexShader: FLOOR_VS, fragmentShader: FLOOR_FS, uniforms: floorU, fog: true }));
      floor.rotation.x = -Math.PI / 2; floor.position.y = -14; scene.add(floor);

      /* the XP column at the heart of the tower: stacked discs that fill with the light up to the level reached */
      const nd = Math.round((TOP + 10) / 1.1);
      const xpU = { ...fogU(), uFill: { value: -2 }, uTime: time, uA: { value: gA }, uB: { value: new THREE.Color(...AMBER) } };
      const discs = new THREE.InstancedMesh(new THREE.CylinderGeometry(2.1, 2.1, 0.62, 6), new THREE.ShaderMaterial({ vertexShader: XP_VS, fragmentShader: XP_FS, uniforms: xpU, fog: true }), nd);
      const m = new THREE.Matrix4();
      for (let i = 0; i < nd; i++) discs.setMatrixAt(i, m.makeTranslation(0, -10 + i * 1.1, 0));
      scene.add(discs);
      const core = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, TOP + 30, 8), new THREE.MeshBasicMaterial({ color: 0x0a0d0b }));
      core.position.y = TOP / 2; scene.add(core);

      /* the platforms: hexagonal slabs with a ring of the level's light, their number, and stepping stones between them */
      const slab = new THREE.MeshStandardMaterial({ color: 0x151917, metalness: 0.6, roughness: 0.42 });
      const slabGeo = new THREE.CylinderGeometry(5.4, 5.0, 0.9, 6), rimGeo = new THREE.TorusGeometry(5.42, 0.07, 4, 6);
      P.rims = [];
      for (let j = 0; j <= NL; j++) {
        const [x, y, z] = PJ(j);
        const s = new THREE.Mesh(slabGeo, slab); s.position.set(x, y, z); s.rotation.y = -ang(j); scene.add(s);
        const rm = new THREE.MeshBasicMaterial({ color: new THREE.Color(...(j === NL ? AMBER : lvCol(j))) });
        const r = new THREE.Mesh(rimGeo, rm); r.rotation.set(Math.PI / 2, 0, ang(j) + Math.PI / 6); r.position.set(x, y + 0.46, z); scene.add(r);
        P.rims.push({ m: rm, c: rm.color.clone() });
        if (j < NL) {
          const num = canvasTex(THREE, 256, 128, (g, W, H) => { g.clearRect(0, 0, W, H); g.font = '800 104px Archivo, Rubik, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#fff'; g.fillText('0' + (j + 1), W / 2, H / 2 + 6); }, { aniso });
          const nm = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.3), new THREE.MeshBasicMaterial({ map: num, transparent: true, depthWrite: false, color: new THREE.Color(...lvCol(j)).multiplyScalar(1.4) }));
          const out = [Math.cos(ang(j)), Math.sin(ang(j))];
          nm.position.set(x + out[0] * 3.4, y + 0.47, z + out[1] * 3.4); nm.rotation.set(-Math.PI / 2, 0, -ang(j) - Math.PI / 2); scene.add(nm);
        }
      }
      const stones = new THREE.InstancedMesh(new THREE.BoxGeometry(1.3, 0.35, 1.3), slab, NL * 6);
      let si = 0;
      for (let j = 0; j < NL; j++) for (let s = 1; s <= 6; s++) {
        const t = s / 7, a = ang(j) + DA * t, r = RP + 1.5 * Math.sin(Math.PI * t);
        stones.setMatrixAt(si++, m.compose(new THREE.Vector3(Math.cos(a) * r, j * DY + DY * t, Math.sin(a) * r), new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), -a), new THREE.Vector3(1, 1, 1)));
      }
      scene.add(stones);

      /* the data rain of the young story: thin falling columns of green light */
      const nr = phone ? 260 : 640;
      const rg = new THREE.InstancedBufferGeometry().copy(new THREE.BoxGeometry(0.1, 1.8, 0.1)); rg.instanceCount = nr;
      const ap = new Float32Array(nr * 4);
      for (let i = 0; i < nr; i++) { const a = rnd(i, 1) * TAU, r = 7 + Math.pow(rnd(i, 2), 0.7) * 48; ap.set([Math.cos(a) * r, rnd(i, 3) * 110, Math.sin(a) * r, 3 + rnd(i, 4) * 7], i * 4); }
      rg.setAttribute('aP', new THREE.InstancedBufferAttribute(ap, 4));
      const rainU = { ...fogU(), uTime: time, uSpan: { value: 110 }, uY0: { value: -14 }, uCol: { value: new THREE.Color(0.25, 1, 0.5) }, uI: { value: 1 } };
      const rain = new THREE.Mesh(rg, new THREE.ShaderMaterial({ vertexShader: RAIN_VS, fragmentShader: RAIN_FS, uniforms: rainU, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      rain.frustumCulled = false; rain.renderOrder = 5; scene.add(rain);

      /* the orbs of today: soft warm lights that take over as the rain thins */
      const orbs = points(ctx, phone ? 120 : 260, (i) => { const a = rnd(i, 5) * TAU, r = 8 + rnd(i, 6) * 40; return [Math.cos(a) * r, -6 + rnd(i, 7) * (TOP + 30), Math.sin(a) * r]; },
        (i) => mixC([1, 0.62, 0.28], [1, 0.85, 0.6], rnd(i, 8)), { size: 1.1, rise: 0.25, span: TOP + 36, tw: 0.4, i: 0 });
      scene.add(orbs.mesh);
      const dust = points(ctx, phone ? 300 : 700, (i) => { const a = rnd(i, 15) * TAU, r = 4 + rnd(i, 16) * 60; return [Math.cos(a) * r, -12 + rnd(i, 17) * (TOP + 40), Math.sin(a) * r]; },
        () => [0.5, 0.9, 0.6], { size: 0.12, tw: 0.8, i: 0.8 });
      scene.add(dust.mesh);

      /* the summit: the promises' pillars stand here, and a beacon above the column */
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(1.2, 20, 14), new THREE.MeshBasicMaterial({ color: new THREE.Color(0, 0, 0) }));
      beacon.position.set(0, TOP + 12, 0); scene.add(beacon);

      Object.assign(P, { key, floorU, xpU, rainU, orbs, dust, beacon, bg: new THREE.Color(), cA: new THREE.Color(0x07100b), cB: new THREE.Color(0x0e0a07), cBoss: new THREE.Color(0x120706) });
      return {
        update(c) {
          const { k, t } = c.st;
          const lv = clamp(k - 1, 0, 7);
          const age = sstep(0, 1, lv / 7);
          P.floorU.uAge.value = age;
          P.xpU.uFill.value = k < 0.5 ? -4 : Math.min(TOP + 2, (k - 1) * DY + 2.5 + (k > 9 ? 6 : 0));
          P.rainU.uI.value = lerp(1, 0.04, sstep(0.5, 5.5, k));
          P.rainU.uCol.value.setRGB(...mixC([0.25, 1, 0.5], [1, 0.6, 0.25], age));
          P.orbs.u.uI.value = sstep(3.5, 7, k) * 0.9;
          P.dust.u.uI.value = lerp(0.8, 0.3, age);
          const boss = sstep(7.4, 8, k) * (1 - sstep(8.4, 9, k));
          P.bg.copy(P.cA).lerp(P.cB, age).lerp(P.cBoss, boss);
          c.scene.background.copy(P.bg); c.scene.fog.color.copy(P.bg);
          const j = Math.round(lv), f = PJ(Math.min(j, NL));
          P.key.position.set(f[0] * 1.1, f[1] + 9, f[2] * 1.1);
          P.key.color.setRGB(...mixC([0.6, 1, 0.7], [1, 0.82, 0.6], age));
          P.rims.forEach((r, i) => r.m.color.copy(r.c).multiplyScalar(i === j && k > 0.6 && k < 9.5 ? 2.4 + Math.sin(t * 4) * 0.5 : i < j || k > 9.5 ? 1.0 : 0.35));
          P.beacon.material.color.setRGB(1.6, 1.0, 0.5).multiplyScalar(sstep(9, 10, k) * (0.9 + 0.1 * Math.sin(t * 3)));
        },
      };
    },
  };

  /* the swarm's shapes, one per chapter */
  const faceCam = (j) => { const f = PJ(j), c = polar(ang(j) + 0.3, 33, 0); return Math.atan2(c[0] - f[0], c[2] - f[2]) - 0.25; };
  const rainSpare = (j, col) => (i) => { const f = PJ(j), a = rnd(i, 31) * TAU, r = 6 + rnd(i, 32) * 6;
    const hot = rnd(i, 35) < 0.18;   // the spare blocks are loose pixels on the platform and in the air behind it, few of them lit
    return { p: [f[0] + Math.cos(a) * r * 0.8 - Math.cos(ang(j)) * 3, f[1] + 0.6 + Math.pow(rnd(i, 33), 2) * 12, f[2] + Math.sin(a) * r * 0.8 - Math.sin(ang(j)) * 3], s: 0.1 + rnd(i, 34) * 0.1, c: hot ? [...col, 0.9] : [0.12, 0.14, 0.13, 0] }; };
  const level = (j) => () => {
    texts();
    const L = LEVELS[j], col = lvCol(j), steel = mixC([0.1, 0.16, 0.12], [0.2, 0.17, 0.14], j / 7);
    const n = Math.round(N * (0.42 + 0.58 * Math.pow(j / 7, 1.2)));            // fewer, bigger cells while the story is young
    if (!L) {   // the dive: a vortex funnelling down into the platform
      const pts = []; const m = Math.min(N, n);
      for (let i = 0; i < m; i++) { const t = i / m, a = t * TAU * 6 + rnd(i, 9) * 0.3, r = 0.6 + 4.6 * t; pts.push([Math.cos(a) * r, -3.2 + 7.4 * t, Math.sin(a) * r]); }
      const f = PJ(j);
      return formOf(N, pts, 0.42, { place: (q) => [f[0] + q[0], f[1] + 4 + q[1], f[2] + q[2]], col: (i, q) => [...mixC([0.1, 0.5, 0.45], col, (q[1] + 3.2) / 7.4), (q[1] + 3.2) / 7.4 > 0.8 ? 1.2 : 0.15], spare: rainSpare(j, col), lift: 5 });
    }
    const H = L.H * 1.35, v = vox(L.mask, n, H * L.asp, H, L.D * 1.2);
    const f = PJ(j), half = H / 2;
    return formOf(N, v.pts, v.s, { place: at(f[0], f[1] + 0.9 + half, f[2], faceCam(j)),
      col: (i, q) => { const hot = L.hot(q[0] / half, q[1] / half); const l = 0.8 + rnd(i, 22) * 0.35; return hot ? [col[0] * l, col[1] * l, col[2] * l, 1.6] : [steel[0] * l + col[0] * 0.12, steel[1] * l + col[1] * 0.12, steel[2] * l + col[2] * 0.12, rnd(i, 23) < 0.04 ? 0.8 : 0]; },
      spare: rainSpare(j, col), lift: 5 });
  };
  const forms = [
    // hero: the tower's foot, coarse pixels raining around it
    () => formOf(N, [], 0, { spare: (i) => { const a = rnd(i, 1) * TAU, r = 5 + Math.pow(rnd(i, 2), 0.6) * 26;
      return { p: [Math.cos(a) * r, -12 + rnd(i, 3) * 30, Math.sin(a) * r], s: 0.3 + rnd(i, 4) * 0.4, c: [...mixC([0.06, 0.2, 0.1], GREEN, rnd(i, 5) * 0.7), rnd(i, 6) < 0.08 ? 0.9 : 0] }; }, lift: 3 }),
    ...Array.from({ length: NL }, (_, j) => level(j)),
    // the three promises: three pillars at the summit, warm and finished
    () => { const f = PJ(8), pts = [], per = Math.floor(N / 3);
      for (let p = 0; p < 3; p++) { const h = [5, 7, 9][p]; const v = Array.from({ length: per }, (_, i) => [((i % 4) - 1.5) * 0.42, Math.floor(i / 16) * 0.42, ((Math.floor(i / 4) % 4) - 1.5) * 0.42]).filter((q) => q[1] < h);
        const a = ang(8) + Math.PI + (p - 1) * 0.5; v.forEach((q) => pts.push([Math.cos(a) * 2.6 + q[0], q[1], Math.sin(a) * 2.6 + q[2]])); }
      return formOf(N, pts, 0.42, { place: (q) => [f[0] + q[0], TOP + 0.6 + q[1], f[2] + q[2]], col: (i, q) => [...mixC([0.3, 0.22, 0.14], AMBER, q[1] / 9), q[1] > 6 ? 1.2 : 0.1], lift: 6,
        spare: (i) => { const a = rnd(i, 41) * TAU, r = 7 + rnd(i, 42) * 4; return { p: [f[0] + Math.cos(a) * r, TOP + 1 + rnd(i, 43) * 10, f[2] + Math.sin(a) * r], s: 0.12, c: [1, 0.7, 0.4, 1.6] }; } }); },
    // your turn: a play sign over the summit
    () => { const f = PJ(8); const v = vox((u, w) => { const tri = u > -0.55 && u < 0.75 && Math.abs(w) < (0.75 - u) * 0.72; const r = Math.hypot(u, w); return tri || (r > 0.9 && r < 1); }, N, 9, 9, 1.0);
      return formOf(N, v.pts, v.s, { place: at(f[0] * 0.8, TOP + 7.5, f[2] * 0.8, Math.atan2(Math.cos(ang(8)), Math.sin(ang(8)))), col: (i, q) => { const r = Math.hypot(q[0], q[1]) / 4.5; return r > 0.86 ? [1, 0.55, 0.2, 1.1] : [0.32, 0.24, 0.16, rnd(i, 51) < 0.06 ? 0.8 : 0]; }, lift: 6 }); },
    // the end: the blocks spiral around the whole tower, every level lit
    () => formOf(N, [], 0, { spare: (i) => { const t = i / N, a = t * TAU * 9, r = 19 + Math.sin(t * 40) * 1.5; return { p: [Math.cos(a) * r, -4 + t * (TOP + 14), Math.sin(a) * r], s: 0.32, c: rnd(i, 55) < 0.2 ? [...mixC(GREEN, AMBER, t), 0.7] : [...mixC([0.08, 0.2, 0.12], [0.3, 0.2, 0.1], t), 0] }; }, lift: 4 }),
  ];
  spec.chapters.forEach((c, i) => { c.swarm = forms[i]; });
  return startDim(spec, opts);
}
