// dims/play.js: the playground's dimension (2026-10-28). The page's idea was a neon arcade (js/worlds/w-play.js): a
// perspective grid in magenta and cyan, stars, a striped sun sinking over the page. The full version is that landscape
// as a place you fly over: the grid floor to the horizon, wireframe mountains on both sides, the striped sun going down
// behind them as the page goes, stars above. The swarm is a heap of neon blocks that builds each section's toy: a game
// controller, the alley of Neon Alley (its real screenshots hang on it as billboards), a goal and its balls, the pet's
// desk, and a trophy at the end. The arena, the avatar and every control on the page stay DOM and keep working; the
// arena's kick and shake buttons glitch the frame.
import { startDim, TAU, clamp, lerp, sstep, rnd, aim, FOG_ADD, HASH } from './core.js';
import { vox, vox3, formOf, at, sdBox, points, mixC } from './story-kit.js';

const SHOTS = ['/site/assets/story/pl-neon-hero.webp', '/site/assets/story/pl-neon-strip-1.webp', '/site/assets/story/pl-neon-close-contact.webp'];
const DZ = 60, ZC = (j) => -j * DZ;
const F = (j) => [-9, 0, ZC(j) - 28];
const MAG = [1, 0.18, 0.75], CYAN = [0.15, 0.85, 1], LIME = [0.45, 1, 0.35], SUN = [1, 0.75, 0.2], VIO = [0.5, 0.25, 1];
const NEON = [MAG, CYAN, LIME, SUN, VIO];

const GRID_VS = /* glsl */`varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const GRID_FS = /* glsl */`
uniform float uTime; uniform vec3 uA, uB; uniform float uPulse;
varying vec3 vW;
#include <fog_pars_fragment>
float line(float x, float w){ float g = abs(fract(x) - 0.5); float d = fwidth(x); return 1.0 - smoothstep(w, w + d * 1.5, g); }   // 1 on the line at x = n + 0.5
void main(){
  float zz = vW.z - uTime * 6.0;                                   // the cross lines run toward the visitor
  float lx = line(vW.x / 4.0 + 0.5, 0.025), lz = line(zz / 4.0 + 0.5, 0.025);
  float far = exp(-abs(vW.x) * 0.006);
  float wave = exp(-(((fract(zz * 0.004 - uTime * 0.05) - 0.5) * 9.0) * ((fract(zz * 0.004 - uTime * 0.05) - 0.5) * 9.0)));
  vec3 col = vec3(0.012, 0.004, 0.022) + uA * lx * 1.25 * far + uB * lz * (0.9 + wave * uPulse) * far;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;
const SUN_VS = /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SUN_FS = /* glsl */`
uniform float uTime, uSink; varying vec2 vUv;
void main(){
  vec2 p = vUv * 2.0 - 1.0; float r = length(p);
  float disc = smoothstep(1.0, 0.985, r);
  float y = p.y;
  float gap = step(y, 0.15) * step(0.5, fract((y + uTime * 0.03) * (7.0 + (0.15 - y) * 9.0)));  // the stripes widen toward the foot
  vec3 c = mix(vec3(1.0, 0.18, 0.62), vec3(1.0, 0.86, 0.3), smoothstep(-0.9, 0.85, y));
  float halo = exp(-max(r - 1.0, 0.0) * 5.0) * (1.0 - disc) * 0.45;
  vec3 col = c * disc * (1.0 - gap) * 1.15 + vec3(1.0, 0.3, 0.7) * halo * 0.6;
  gl_FragColor = vec4(col, 1.0);
}`;
const MTN_FS = /* glsl */`uniform vec3 uCol; varying vec3 vW;
#include <fog_pars_fragment>
void main(){ gl_FragColor = vec4(uCol * (0.35 + smoothstep(0.0, 26.0, vW.y) * 1.1), 1.0);
  ${FOG_ADD}
}`;

export function initDim(opts) {
  let N = 0;
  const P = {};
  const spec = {
    name: 'play', base: '#08040F', accent: '#FF3DCB', ink: '#040108',
    fog: { color: 0x0d0418, density: 0.0072 }, exposure: 1.05, bloom: { strength: 0.75, radius: 0.6, threshold: 0.8 },
    intro: [0, 3, 18], parallax: 1,
    card: { shots: SHOTS, w: 6.4, h: 3.6, r: 0.22, n: [6, 6] },
    swarm: { n: [1300, 700], key: [0.3, 1, 0.6], keyCol: 0xffd6f4, amb: 0x2a2038 },
    chapters: [
      { at: 'top', cam: { pos: [7, 4.5, 16], tgt: aim([7, 4.5, 16], [-9, 7, -30], 7, 0), fov: 52, pp: [0, 5, 22], tp: [-8, 8, -30] }, via: [[12, 9, -20], [-4, 7, -78]] },
      { at: '.pl-neon', cam: { pos: [1.5, 4.5, ZC(1) - 2], tgt: [-3, 6.5, ZC(1) - 52], fov: 56, roll: 0.03, pp: [0, 5, ZC(1) + 4], tp: [-2, 7, ZC(1) - 50] }, via: [[-14, 14, ZC(1) - 52], [-10, 4, ZC(2) - 30]], cut: 'warp' },
      { at: '.pl-grid', cam: { pos: [8, 7, ZC(2) - 10], tgt: aim([8, 7, ZC(2) - 10], [-9, 4, ZC(2) - 28], 6, 0), fov: 50, roll: -0.03, pp: [2, 8, ZC(2) - 4], tp: [-8, 5, ZC(2) - 28] }, via: [[16, 5, ZC(2) - 40], [0, 6, ZC(3) - 30]], cut: 'glitch' },
      { at: '.pet', cam: { pos: [6, 5, ZC(3) - 14], tgt: aim([6, 5, ZC(3) - 14], [-9, 6, ZC(3) - 28], 6, 0), fov: 48, pp: [0, 6, ZC(3) - 6], tp: [-8, 7, ZC(3) - 28] }, via: [[-6, 14, ZC(3) - 34], [-6, 10, ZC(4) - 30]], cut: 'scan' },
      { at: 'end', cam: { pos: [3, 7, ZC(4) - 4], tgt: aim([3, 7, ZC(4) - 4], [-9, 9, ZC(4) - 28], 10, 0), fov: 54, pp: [-2, 8, ZC(4) + 4], tp: [-8, 10, ZC(4) - 28] }, cut: 'ink' },
    ],
    async build(ctx) {
      const { THREE, scene, time, phone, fogU } = ctx;
      N = ctx.swarm.n;
      scene.add(new THREE.HemisphereLight(0x8a5ab0, 0x10041a, 0.8));
      const key = new THREE.PointLight(0xff6ad8, 300, 60, 1.5); scene.add(key);

      /* the grid floor to the horizon */
      const gridU = { ...fogU(), uTime: time, uA: { value: new THREE.Color(...MAG) }, uB: { value: new THREE.Color(...CYAN) }, uPulse: { value: 0.6 } };
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(900, 1100), new THREE.ShaderMaterial({ vertexShader: GRID_VS, fragmentShader: GRID_FS, uniforms: gridU, fog: true }));
      floor.rotation.x = -Math.PI / 2; floor.position.z = -350; scene.add(floor);

      /* the mountains: two wireframe ridges, solid and dark under their lines */
      const mtnU = { ...fogU(), uCol: { value: new THREE.Color(...MAG) } };
      for (const side of [-1, 1]) {
        const g = new THREE.PlaneGeometry(160, 700, phone ? 24 : 40, phone ? 70 : 110); g.rotateX(-Math.PI / 2);
        const pa = g.attributes.position;
        for (let i = 0; i < pa.count; i++) {
          const x = pa.getX(i), z = pa.getZ(i), d = Math.max(0, (x * side + 80) / 160);   // 0 at the valley edge, 1 far out
          const n = Math.sin(z * 0.045 + side) * 0.5 + Math.sin(z * 0.11 + x * 0.07) * 0.3 + Math.sin(z * 0.23 - x * 0.13) * 0.2;
          pa.setY(i, Math.max(0, d * d * (22 + n * 16) + d * 4 * n));
        }
        g.computeVertexNormals();
        const solid = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x07020d }));
        solid.position.set(side * 115, -0.05, -330); scene.add(solid);
        const wire = new THREE.LineSegments(new THREE.WireframeGeometry(g), new THREE.ShaderMaterial({ vertexShader: GRID_VS, fragmentShader: MTN_FS, uniforms: mtnU, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
        wire.position.copy(solid.position); wire.position.y += 0.03; scene.add(wire);
      }

      /* the striped sun far out, sinking with the page */
      const sunU = { uTime: time, uSink: { value: 0 } };
      const sun = new THREE.Mesh(new THREE.PlaneGeometry(260, 260), new THREE.ShaderMaterial({ vertexShader: SUN_VS, fragmentShader: SUN_FS, uniforms: sunU, fog: false, depthWrite: false }));
      sun.position.set(-150, 60, -760); sun.renderOrder = -1; scene.add(sun);
      const stars = points(ctx, phone ? 500 : 1200, (i) => { const a = rnd(i, 1) * Math.PI - Math.PI, e = 0.05 + Math.pow(rnd(i, 2), 1.6) * 1.2; const r = 600; return [Math.cos(a) * Math.cos(e) * r, 10 + Math.sin(e) * r * 0.7, -200 + Math.sin(a) * Math.cos(e) * r]; },
        (i) => NEON[i % 5].map((x) => 0.5 + x * 0.5), { size: 1.6, tw: 0.7, i: 1, fog: false });
      scene.add(stars.mesh);
      const sparks = points(ctx, phone ? 200 : 500, (i) => [-60 + rnd(i, 11) * 120, rnd(i, 12) * 30, 20 - rnd(i, 13) * 320], (i) => NEON[i % 5], { size: 0.25, rise: 0.6, span: 30, tw: 0.5, i: 0.9 });
      scene.add(sparks.mesh);

      // the arena's buttons cut the frame
      const onBtn = (ev) => { if (ev.target.closest?.('#kickBtn, #shakeBtn')) ctx.kick(ev.target.closest('#shakeBtn') ? 'glitch' : 'scan'); };
      document.addEventListener('click', onBtn);
      Object.assign(P, { key, sun, sunU, gridU });
      return {
        update(c) {
          const { k, t } = c.st;
          P.sun.position.y = lerp(70, -150, sstep(0, 3.4, k));                     // the sun goes down over the page
          P.sun.position.z = -760 + c.camera.position.z * 0.6;                   // and stays on the horizon as the camera flies
          const f = F(Math.round(k));
          P.key.position.set(f[0] + 4, 10, f[2] + 8);
          P.key.color.setRGB(...mixC(MAG, CYAN, 0.5 + 0.5 * Math.sin(t * 0.7)));
          P.gridU.uPulse.value = 0.4 + c.st.vel * 2;
        },
        dispose() { document.removeEventListener('click', onBtn); },
      };
    },
  };

  /* the swarm's toys */
  const neonC = (c, g = 1.4) => [c[0], c[1], c[2], g];
  const bodyC = [0.16, 0.1, 0.22, 0];
  const faceTo = (from, cam) => Math.atan2(cam[0] - from[0], cam[2] - from[2]);
  const grid = (j) => (i) => { const f = F(j); const x = Math.round((rnd(i, 71) - 0.5) * 16) * 4, z = Math.round(rnd(i, 72) * 12) * 4;   // spare blocks lie on the grid's crossings
    return { p: [f[0] + x, 0.25, f[2] + 20 - z], s: 0.22, c: rnd(i, 73) < 0.4 ? neonC(NEON[i % 5], 1.2) : [0.2, 0.1, 0.3, 0] }; };
  const flat = (j, mask, asp, H, D, col, dy = 0) => { const v = vox(mask, N, H * asp, H, D), f = F(j), half = H / 2;
    return formOf(N, v.pts, v.s, { place: at(f[0], f[1] + half + 0.8 + dy, f[2], faceTo(f, spec.chapters[j].cam.pos) - 0.3), col: (i, q) => col(q[0] / half, q[1] / half, i), spare: grid(j), lift: 6 }); };
  const forms = [
    // a game controller standing on the grid
    () => flat(0, (u, v) => { const body = sdBox(u, v - 0.1, 1.15, 0.5, 0.42) < 0 || Math.hypot(u + 0.9, v + 0.35) < 0.55 || Math.hypot(u - 0.9, v + 0.35) < 0.55; return body && !(Math.abs(u) < 0.22 && v > 0.15 && v < 0.35); },
      2.1, 7, 1.6, (u, v, i) => { const dpad = (Math.abs(u + 0.85) < 0.28 && Math.abs(v - 0.05) < 0.09) || (Math.abs(u + 0.85) < 0.09 && Math.abs(v - 0.05) < 0.28);
        const btn = [[0.68, 0.05], [0.95, 0.25], [1.22, 0.05], [0.95, -0.15]].findIndex(([x, y]) => Math.hypot(u - x, v - y) < 0.12);
        if (dpad) return neonC(CYAN, 1.6); if (btn >= 0) return neonC(NEON[[0, 2, 3, 4][btn]], 1.8);
        const edge = sdBox(u, v - 0.1, 1.15, 0.5, 0.42) > -0.08 && Math.abs(v) > 0.2; return edge ? neonC(MAG, 1.1) : bodyC; }),
    // Neon Alley: an alley of towers on both sides of the street, their windows in neon
    () => { const f = [-3, 0, ZC(1) - 40], pts = [], B = [];
      for (let s = -1; s <= 1; s += 2) for (let b = 0; b < 6; b++) B.push({ x: s * (7 + rnd(b + s * 9, 1) * 2), z: -b * 9 + 14, w: 3.4 + rnd(b, s + 3) * 1.4, d: 7, h: 8 + rnd(b, s + 5) * 12, s });
      const per = Math.floor(N / B.length), sz = 0.62;
      B.forEach((bd, bi) => { for (let i = 0; i < per; i++) { const face = i % 2; const along = (i >> 1) % Math.max(1, Math.floor(bd.d / sz)), up = Math.floor((i >> 1) / Math.max(1, Math.floor(bd.d / sz)));
        const y = up * sz + 0.3; if (y > bd.h) break;
        pts.push(face ? [bd.x - bd.s * bd.w * 0.5, y, bd.z - along * sz, bi, 0] : [bd.x - bd.s * bd.w * 0.5 + bd.s * (along % Math.floor(bd.w / sz)) * sz, y, bd.z + 0.4, bi, 1]); } });
      return formOf(N, pts, sz, { place: (q) => [f[0] + q[0], q[1], f[2] + q[2]], col: (i, q) => (rnd(i, 81) < 0.32 && (Math.floor(q[1] / 0.62) % 3) ? neonC(NEON[(q[3] + Math.floor(q[1] / 3)) % 5], 1.5) : [0.11, 0.06, 0.16, 0]), spare: grid(1), lift: 8 }); },
    // the arena: a goal and its net, and balls lying in front of it
    () => { const f = F(2), pts = [];
      const goal = vox3((x, y, z) => { const post = (Math.abs(Math.abs(x) - 0.96) < 0.04 && z > 0.7) || (y > 0.92 && z > 0.7); const net = z < 0.7 && (Math.abs(Math.abs(x) - 0.96) < 0.04 || y > 0.92 || z < -0.92) && ((x * 9 + 9) % 1 < 0.3 || (y * 5 + 5) % 1 < 0.3);
        return post || net; }, Math.round(N * 0.55), 13, 5, 4);
      goal.pts.forEach((q) => pts.push([q[0], q[1] + 2.5, q[2] - 2, 0]));
      const balls = [[-6, 1.4, 6, 1.5], [3.5, 1.1, 7, 1.15], [8, 1.3, 2, 1.35], [-1, 0.9, 10, 0.95], [-9, 1, 1, 1.05]];
      let bi = 0; while (pts.length < N && bi < 400) { for (const [x, y, z, r] of balls) { const k = pts.length; const a = rnd(k, 3) * TAU, e = Math.acos(rnd(k, 4) * 2 - 1); pts.push([x + Math.sin(e) * Math.cos(a) * r, y + Math.cos(e) * r, z + Math.sin(e) * Math.sin(a) * r, 1 + balls.findIndex((b) => b[0] === x)]); } bi++; }
      return formOf(N, pts.slice(0, N), goal.s, { place: (q) => [f[0] + q[0], f[1] + q[1], f[2] + q[2]], col: (i, q) => (q[3] === 0 ? neonC(rnd(i, 91) < 0.5 ? [0.85, 0.85, 1] : CYAN, 1.1) : neonC(NEON[q[3] % 5], rnd(i, 92) < 0.3 ? 1.6 : 0.4)), lift: 6 }); },
    // the pet's desk: a monitor of code, the pet sitting on it
    () => flat(3, (u, v) => { const mon = sdBox(u, v + 0.05, 1.05, 0.62, 0.06) < 0; const stand = Math.abs(u) < 0.12 && v < -0.65 && v > -0.9; const foot = Math.abs(u) < 0.45 && v < -0.88;
        const pet = Math.hypot((u - 0.6) / 0.28, (v - 0.78) / 0.2) < 1 || Math.hypot(u - 0.45, v - 0.98) < 0.06 || Math.hypot(u - 0.75, v - 0.98) < 0.06;
        return mon || stand || foot || pet; },
      1.6, 8, 1.2, (u, v, i) => { if (v > 0.6) return neonC(SUN, 1.3); if (sdBox(u, v + 0.05, 1.05, 0.62, 0.06) > -0.08) return neonC(VIO, 0.9);
        const row = Math.floor((v + 0.6) * 7), len = [0.7, 0.5, 0.85, 0.4, 0.65, 0.3, 0.75, 0.55, 0.6][row % 9];
        return (u + 0.95) / 1.9 < len && ((v + 0.6) * 7) % 1 < 0.55 ? neonC(row % 3 ? LIME : CYAN, 1.3) : [0.05, 0.03, 0.08, 0]; }),
    // the end: a trophy
    () => flat(4, (u, v) => { const cup = v > -0.1 && v < 0.9 && Math.abs(u) < 0.55 - (0.9 - v) * 0.0 - Math.max(0, 0.2 - v) * 1.2; const handles = Math.abs(Math.hypot(Math.abs(u) - 0.62, v - 0.55) - 0.2) < 0.06 && Math.abs(u) > 0.62;
        const stem = Math.abs(u) < 0.08 && v < -0.05 && v > -0.6; const base = Math.abs(u) < 0.42 && v < -0.6 && v > -0.85; const plinth = Math.abs(u) < 0.55 && v <= -0.85; return cup || handles || stem || base || plinth; },
      0.9, 10, 1.6, (u, v, i) => (v > 0.78 ? neonC(CYAN, 0.5) : v < -0.6 ? neonC(MAG, 0.35) : rnd(i, 95) < 0.1 ? neonC(SUN, 0.5) : [0.3, 0.2, 0.08, 0]), 0.4),
  ];
  spec.chapters.forEach((c, i) => { c.swarm = forms[i]; });

  /* the cards: Neon Alley's real screenshots, as billboards */
  const cards = [
    (i, t, o, ctx) => { const a = (i / 6) * TAU + t * 0.1; o.p.set(-9 + Math.cos(a) * 14, 9 + Math.sin(a * 2) * 2, -32 + Math.sin(a) * 8); ctx.face(o, ctx.camPos[0]); o.s = 0.7; o.f = 0.85; },
    (i, t, o, ctx) => { const s = i % 2 ? 1 : -1, b = Math.floor(i / 2); const f = [-3, 0, ZC(1) - 40];   // on the towers' faces, angled to the street
      o.p.set(f[0] + s * 5.6, 7 + b * 2.6 + Math.sin(t + i) * 0.1, f[2] + 10 - b * 13); ctx.yaw(o, -s * 1.05); o.s = 0.85; o.f = 1; o.focus = b === 0 ? 1 : 0.5; },
    (i, t, o, ctx) => { const f = F(2); o.p.set(f[0] - 14 + i * 5.6, 12 + (i % 2) * 1.2, f[2] - 12); ctx.face(o, ctx.camPos[2]); o.s = 0.6; o.f = 0.7; },
    (i, t, o, ctx) => { const f = F(3), a = (i / 6) * Math.PI - Math.PI / 2; o.p.set(f[0] + Math.sin(a) * 11, 5 + i * 0.4, f[2] - 4 - Math.cos(a) * 6); ctx.face(o, ctx.camPos[3]); o.s = 0.55; o.f = 0.75; },
    (i, t, o, ctx) => { const f = F(4), a = (i / 6) * TAU + t * 0.15; o.p.set(f[0] - 4 + Math.cos(a) * 10, 9 + Math.sin(a) * 6, f[2] - 8); ctx.face(o, ctx.camPos[4]); o.s = 0.42; o.f = 0.6; },
  ];
  spec.chapters.forEach((c, i) => { c.cards = cards[i]; });
  return startDim(spec, opts);
}
