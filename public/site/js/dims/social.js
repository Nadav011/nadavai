// dims/social.js: the social page's dimension (2026-10-28). The page's idea was a feed seen through frosted glass
// (js/worlds/w-social.js): columns of post-shaped tiles sliding up, reactions drifting. The full version is a place: a
// tall shaft of a feed that the scroll descends. Its walls are frosted panes, each the ghost of a post (an avatar, two
// lines, a picture, a heart), hanging at many depths; hearts rise through it. The cards are the page's real client work
// (the same posts the gallery shows); the swarm is the light of the feed, re-formed per section:
//
//   hero     a phone, a post's frame, the work orbiting it      what   the four services as four icons
//   system   a month's calendar, the posts dropping into days   gallery a carousel of the work around the camera
//   feed     the feed column scrolling, a heart the size of a room   how  five steps   end  a heart and its ring of stories
import { startDim, TAU, clamp, lerp, sstep, rnd, aim, FOG_ADD, HASH } from './core.js';
import { vox, formOf, at, sdBox, seg, points, mixC } from './story-kit.js';

const SHOTS = ['so-gr-game-tip-single', 'so-br-logo', 'so-ab-neon', 'so-hm-ad', 'so-gr-room-hero-single', 'so-br-pro',
  'so-hm-offer', 'so-gr-offers-urgent-single', 'so-br-home', 'so-ab-final', 'so-br-finish', 'so-br-craft'].map((s) => `/site/assets/story/${s}.webp`);
const CW = 2.4, CH = 3.0;                    // a post card, 4:5
const DY = 30, YC = (j) => -j * DY;          // section j's level down the shaft
const F = (j) => [-6.5, YC(j), -11];         // where the swarm builds at section j (inline-end side of the frame)
const PINK = [1, 0.32, 0.42], CORAL = [1, 0.48, 0.3], VIOLET = [0.55, 0.38, 1], TEAL = [0.25, 0.8, 0.78], GOLD = [1, 0.75, 0.3];
const TINTS = [PINK, CORAL, VIOLET, TEAL, GOLD];
const heart = (x, y) => { const a = x * x + y * y - 1; return a * a * a - x * x * y * y * y <= 0; };   // the classic heart curve

/* ── shaders ── */
const PANE_VS = /* glsl */`
attribute float aSeed; attribute vec3 aTint; uniform float uTime;
varying vec2 vUv; varying float vSeed; varying vec3 vTint, vW;
#include <fog_pars_vertex>
void main(){
  vUv = uv; vSeed = aSeed; vTint = aTint;
  vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0);
  wp.y += uTime * (0.25 + aSeed * 0.35);                         // the feed slides up, each column at its speed
  wp.y = wp.y - 260.0 * floor((wp.y + 210.0) / 260.0);           // and wraps down the shaft
  vW = wp.xyz;
  vec4 mvPosition = viewMatrix * wp;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const PANE_FS = /* glsl */`
uniform float uTime, uI;
varying vec2 vUv; varying float vSeed; varying vec3 vTint, vW;
#include <fog_pars_fragment>
${HASH}
float box(vec2 p, vec2 c, vec2 h, float e){ vec2 d = abs(p - c) - h; return smoothstep(e, -e, max(d.x, d.y)); }
void main(){
  vec2 p = vUv;
  vec2 q = abs(p - 0.5) - vec2(0.47, 0.47);
  float frame = smoothstep(0.012, 0.0, abs(max(q.x, q.y)));
  float frost = n2(p * vec2(18.0, 28.0) + vSeed * 40.0) * 0.5 + n2(p * 60.0 + vSeed * 9.0) * 0.5;
  float av = smoothstep(0.075, 0.06, length((p - vec2(0.84, 0.9)) * vec2(1.0, 1.25)));
  float lines = box(p, vec2(0.52, 0.91), vec2(0.22, 0.012), 0.008) + box(p, vec2(0.58, 0.865), vec2(0.16, 0.01), 0.008);
  float pic = box(p, vec2(0.5, 0.48), vec2(0.42, 0.3), 0.01);
  vec2 hp = (p - vec2(0.12, 0.09)) * 22.0; hp.y += 0.25;
  float hv = hp.x * hp.x + hp.y * hp.y - 1.0;
  float hrt = smoothstep(0.1, -0.1, hv * hv * hv - hp.x * hp.x * hp.y * hp.y * hp.y);
  float glow = 0.35 + 0.65 * smoothstep(0.0, 1.0, p.y);
  vec3 col = vec3(0.025, 0.024, 0.03) + vTint * (0.05 * glow + 0.03 * frost);
  col += vTint * pic * (0.07 + 0.05 * sin(uTime * 0.6 + vSeed * 20.0));
  col += vec3(0.6, 0.6, 0.65) * (av * 0.18 + lines * 0.12);
  col += vTint * hrt * 0.6 + vTint * frame * 0.35;
  float a = (0.42 + 0.25 * frame + pic * 0.1) * uI;
  gl_FragColor = vec4(col, a);
  #include <fog_fragment>
}`;
const HEART_VS = /* glsl */`
attribute vec4 aP; attribute vec3 aTint; uniform float uTime, uSpan, uTop;
varying vec3 vTint, vN; varying float vA;
#include <fog_pars_vertex>
void main(){
  float y = uTop - mod(uTop - aP.y - uTime * aP.w, uSpan);       // rising, wrapping from the bottom of the shaft
  float a = sin(uTime * 0.9 + aP.x) * 0.5;
  mat3 R = mat3(cos(a), 0.0, -sin(a), 0.0, 1.0, 0.0, sin(a), 0.0, cos(a));
  vec3 p = vec3(aP.x + sin(uTime * 0.7 + aP.z) * 0.6, y, aP.z) + R * (position * (0.5 + fract(aP.w * 3.7) * 0.6));
  vTint = aTint; vN = normalize(mat3(modelViewMatrix) * (R * normal));
  vA = smoothstep(0.0, 10.0, uSpan - (uTop - y));
  vec4 mvPosition = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const HEART_FS = /* glsl */`
uniform float uI; varying vec3 vTint, vN; varying float vA;
#include <fog_pars_fragment>
void main(){ float l = 0.55 + 0.45 * abs(vN.z);
  gl_FragColor = vec4(vTint * l * 1.3 * uI * vA, 1.0);
  ${FOG_ADD}
}`;

export function initDim(opts) {
  let N = 0;
  const P = {};
  const spec = {
    name: 'social', base: '#0B0C0F', accent: '#FF7A8A', ink: '#050407',
    fog: { color: 0x0a090e, density: 0.017 }, exposure: 1.05, bloom: { strength: 0.6, radius: 0.55, threshold: 0.84 },
    intro: [0, 8, 10], parallax: 0.9,
    card: { shots: SHOTS, w: CW, h: CH, r: 0.16, n: [24, 14] },
    swarm: { n: [1200, 640], key: [0.4, 1, 0.8], keyCol: 0xffe4ea, amb: 0x2c2832 },
    chapters: [
      { at: 'top', cam: { pos: [5, 5, 17], tgt: aim([5, 5, 17], [-7.5, 1.5, -10], 8.5, 0), fov: 50, pp: [-2, 6, 24], tp: [-6, 3, -10] },
        via: [[12, -10, 10], [-4, -16, -14]] },
      { at: '[aria-labelledby="soWhat"]', cam: { pos: [7, YC(1) - 5, 13], tgt: aim([7, YC(1) - 5, 13], [-6.5, YC(1) + 1, -11], 2, 0), fov: 48, roll: -0.03, pp: [-1, YC(1) - 3, 22], tp: [-6, YC(1) + 1, -11] },
        via: [[-2, YC(1) - 16, 18], [-6, YC(2) + 8, -14]], cut: 'scan' },
      { at: '#soSystem', cam: { pos: [3, YC(2) + 1.5, 10], tgt: aim([3, YC(2) + 1.5, 10], [-7, YC(2), -12], 6.5, 0), fov: 50, pp: [-3, YC(2) + 2, 18], tp: [-6, YC(2) + 1, -12] },
        via: [[10, YC(2) - 14, 4], [0, YC(3) + 6, -6]], cut: 'fold' },
      { at: '#soGallery', cam: { pos: [0, YC(3) + 0.6, 0], tgt: [-3, YC(3) + 0.2, -10], fov: 62, roll: 0.04, pp: [0, YC(3), 1], tp: [-1.5, YC(3), -10] },
        via: [[-6, YC(3) - 16, 8], [-6, YC(4) + 5, -12]], cut: 'warp' },
      { at: '#soFeed', cam: { pos: [6, YC(4) + 3.5, 9], tgt: aim([6, YC(4) + 3.5, 9], [-6, YC(4), -11], 6.5, 0), fov: 50, roll: -0.025, pp: [-1, YC(4) + 3, 19], tp: [-5, YC(4) + 1, -11] },
        via: [[14, YC(4) - 12, 10], [-2, YC(5) + 2, -10]], cut: 'glitch' },
      { at: '[aria-labelledby="soHow"]', cam: { pos: [11, YC(5) + 8, 15], tgt: aim([11, YC(5) + 8, 15], [-4, YC(5) - 1, -12], 3, 0), fov: 50, pp: [4, YC(5) + 9, 24], tp: [-3, YC(5) + 1, -12] },
        via: [[2, YC(5) - 12, 18], [-4, YC(6) + 6, -8]], cut: 'scan' },
      { at: 'end', cam: { pos: [0, YC(6) + 2, 19], tgt: aim([0, YC(6) + 2, 19], [-5, YC(6) + 1, -7], 2.5, 0), fov: 52, pp: [-3, YC(6) + 3, 27], tp: [-4, YC(6) + 2, -7] }, cut: 'ink' },
    ],
    async build(ctx) {
      const { THREE, scene, time, phone, fogU } = ctx;
      N = ctx.swarm.n;
      scene.add(new THREE.HemisphereLight(0x7a6a80, 0x0c0a10, 0.75));
      const key = new THREE.PointLight(0xff9aa8, 260, 50, 1.5); scene.add(key);

      /* the frosted panes: ghosts of posts at many depths, all down the shaft, sliding up like a feed */
      const np = phone ? 60 : 120;
      const pg = new THREE.PlaneGeometry(4.2, 5.25);
      const seed = new Float32Array(np), tint = new Float32Array(np * 3);
      const panes = new THREE.InstancedMesh(pg, new THREE.ShaderMaterial({ vertexShader: PANE_VS, fragmentShader: PANE_FS, fog: true, transparent: true, depthWrite: false, side: THREE.DoubleSide,
        uniforms: { ...fogU(), uTime: time, uI: { value: 1 } } }), np);
      const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler();
      for (let i = 0; i < np; i++) {
        const col = i % 9, x = -26 + col * 6.5 + (rnd(i, 2) - 0.5) * 1.5, z = -18 - rnd(i, 3) * 26 - (Math.abs(x) < 8 ? 6 : 0);
        const y = 30 - rnd(i, 4) * 260;
        e.set(0, (rnd(i, 5) - 0.5) * 0.5 - x * 0.012, 0); q.setFromEuler(e);
        const s = 0.9 + rnd(i, 6) * 0.7;
        panes.setMatrixAt(i, m.compose(new THREE.Vector3(x, y, z), q, new THREE.Vector3(s, s, 1)));
        seed[i] = rnd(i, 7); tint.set(TINTS[Math.floor(rnd(i, 8) * 5)], i * 3);
      }
      pg.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seed, 1)); pg.setAttribute('aTint', new THREE.InstancedBufferAttribute(tint, 3));
      panes.frustumCulled = false; panes.renderOrder = 0; scene.add(panes);
      /* hearts rising through the shaft */
      const hs = new THREE.Shape(); hs.moveTo(0, -0.5); hs.bezierCurveTo(-0.15, -0.35, -0.6, -0.1, -0.6, 0.18); hs.bezierCurveTo(-0.6, 0.48, -0.25, 0.6, 0, 0.32);
      hs.bezierCurveTo(0.25, 0.6, 0.6, 0.48, 0.6, 0.18); hs.bezierCurveTo(0.6, -0.1, 0.15, -0.35, 0, -0.5);
      const hg0 = new THREE.ExtrudeGeometry(hs, { depth: 0.18, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.05, bevelSegments: 2, curveSegments: 10 }); hg0.center();
      const nh = phone ? 70 : 160;
      const hg = new THREE.InstancedBufferGeometry().copy(hg0); hg.instanceCount = nh;
      const aP = new Float32Array(nh * 4), aT = new Float32Array(nh * 3);
      for (let i = 0; i < nh; i++) { const x = -30 + rnd(i, 11) * 52, z = -6 - rnd(i, 12) * 34; aP.set([x, 30 - rnd(i, 13) * 230, z, 1.2 + rnd(i, 14) * 2.2], i * 4); aT.set(rnd(i, 15) < 0.7 ? PINK : TINTS[Math.floor(rnd(i, 16) * 5)], i * 3); }
      hg.setAttribute('aP', new THREE.InstancedBufferAttribute(aP, 4)); hg.setAttribute('aTint', new THREE.InstancedBufferAttribute(aT, 3));
      const heartU = { ...fogU(), uTime: time, uSpan: { value: 240 }, uTop: { value: 32 }, uI: { value: 1 } };
      const hearts = new THREE.Mesh(hg, new THREE.ShaderMaterial({ vertexShader: HEART_VS, fragmentShader: HEART_FS, uniforms: heartU, fog: true }));
      hearts.frustumCulled = false; scene.add(hearts);

      /* bokeh: soft dots of the feed's colours */
      const bokeh = points(ctx, phone ? 260 : 600, (i) => [-34 + rnd(i, 21) * 64, 30 - rnd(i, 22) * 230, -4 - rnd(i, 23) * 44], (i) => TINTS[Math.floor(rnd(i, 24) * 5)].map((x) => x * 0.8), { size: 0.35, rise: 0.4, span: 240, tw: 0.5, i: 0.9 });
      scene.add(bokeh.mesh);
      /* the bottom of the shaft: a ring of light, the publish button pressed */
      const disc = new THREE.Mesh(new THREE.TorusGeometry(9, 0.08, 6, 120), new THREE.MeshBasicMaterial({ color: new THREE.Color(...PINK).multiplyScalar(1.6) }));
      disc.rotation.x = Math.PI / 2; disc.position.set(-5, YC(6) - 7, -7); scene.add(disc);

      // a page event cuts the frame: opening a story or a post in the lightbox
      const onOpen = (ev) => { if (ev.target.closest?.('.feed__st, .mq__t')) ctx.kick('glitch'); };
      document.addEventListener('click', onOpen);
      Object.assign(P, { key, heartU, bokeh });
      return {
        update(c) {
          const { k, t } = c.st;
          const y = lerp(YC(Math.floor(k)), YC(Math.min(6, Math.floor(k) + 1)), k - Math.floor(k));
          P.key.position.set(-3, y + 8, -2);
          P.key.color.setRGB(...mixC(PINK, VIOLET, 0.5 + 0.5 * Math.sin(k * 1.3)));
          P.key.intensity = 260 * (0.9 + 0.1 * Math.sin(t * 2.1));
        },
        dispose() { document.removeEventListener('click', onOpen); },
      };
    },
  };

  /* the swarm's shapes */
  const glowC = (c, l = 1, g = 1.2) => [c[0] * l, c[1] * l, c[2] * l, g];
  const dimC = (c, l = 1) => [0.12 + c[0] * 0.12 * l, 0.11 + c[1] * 0.1 * l, 0.14 + c[2] * 0.12 * l, 0];
  const faceTo = (from, cam) => Math.atan2(cam[0] - from[0], cam[2] - from[2]);
  const dust = (j, r0 = 6, r1 = 16) => (i) => { const f = F(j), a = rnd(i, 61) * TAU, r = r0 + rnd(i, 62) * (r1 - r0);
    return { p: [f[0] + Math.cos(a) * r, f[1] - 6 + rnd(i, 63) * 14, f[2] + Math.sin(a) * r * 0.6 - 4], s: 0.1 + rnd(i, 64) * 0.08, c: rnd(i, 65) < 0.3 ? glowC(TINTS[i % 5], 1, 1) : dimC(PINK) }; };
  const shape = (j, mask, asp, H, D, col, { lift = 4, dy = 0, cam = spec.chapters[j].cam.pos } = {}) => {
    const v = vox(mask, N, H * asp, H, D), f = F(j), half = H / 2;
    return formOf(N, v.pts, v.s, { place: at(f[0], f[1] + dy, f[2], faceTo(f, cam) - 0.25), col: (i, q) => col(q[0] / half, q[1] / half, i), spare: dust(j), lift });
  };
  const forms = [
    // hero: a phone standing on the far side, the frame of a post, a heart badge on its corner
    () => shape(0, (u, v) => { const fr = sdBox(u, v, 0.52, 0.98, 0.16); if (fr > 0) return heart((u - 0.52) / 0.2, (v - 0.9) / 0.2 + 0.2);
      if (fr > -0.07) return !(Math.abs(u) < 0.14 && v > 0.9); const pic = sdBox(u, v - 0.05, 0.4, 0.42); return (pic < 0 && pic > -0.04) || Math.hypot(u + 0.32, v - 0.68) < 0.07 || (Math.abs(v - 0.68) < 0.025 && u > -0.2 && u < 0.3) || heart((u + 0.33) / 0.08, (v + 0.66) / 0.08 + 0.2); },
    0.62, 9.5, 0.8, (u, v, i) => (u > 0.36 && v > 0.72) || (u < -0.2 && v < -0.5) ? glowC(PINK, 1, 1.6) : sdBox(u, v, 0.52, 0.98, 0.16) > -0.07 ? glowC(VIOLET, 0.6, 0.5) : dimC(PINK, 2)),
    // what: the four services, four icons: a post, a mark, a calendar, a megaphone
    () => shape(1, (u, v) => {
      const cells = [[-0.62, 0.5], [0.62, 0.5], [-0.62, -0.5], [0.62, -0.5]];
      return cells.some(([cx, cy], n) => { const x = (u - cx) / 0.42, y = (v - cy) / 0.42;
        if (n === 0) { const b = sdBox(x, y, 0.9, 0.9, 0.18); return (b < 0 && b > -0.16) || (y < -0.2 && y > -0.6 && Math.abs(x) < 0.5 - (y + 0.6) * 0.6) || Math.hypot(x - 0.35, y - 0.35) < 0.14; }
        if (n === 1) { const r = Math.hypot(x, y); return (r < 0.92 && r > 0.76) || (Math.abs(x) < 0.08 && r < 0.8) || (Math.abs(y) < 0.08 && r < 0.8); }
        if (n === 2) { const b = sdBox(x, y + 0.08, 0.85, 0.78, 0.1); return (b < 0 && b > -0.14) || (y > 0.35 && y < 0.6 && Math.abs(x) < 0.85) || (b < -0.2 && ((x + 1) * 2.4) % 1 < 0.55 && ((y + 1) * 2.4) % 1 < 0.55); }
        return (x > -0.75 && x < -0.25 && Math.abs(y) < 0.28) || (x >= -0.25 && x < 0.65 && Math.abs(y) < 0.28 + (x + 0.25) * 0.6) || (x > -0.6 && x < -0.35 && y < -0.2 && y > -0.75); });
    }, 1.15, 9, 0.9, (u, v, i) => { const n = (u > 0 ? 1 : 0) + (v < 0 ? 2 : 0); return rnd(i, 71) < 0.55 ? glowC(TINTS[n], 0.9, 1.1) : glowC(TINTS[n], 0.5, 0.2); }),
    // system: a month's calendar standing in the shaft, the scheduled days lit
    () => shape(2, (u, v) => { const b = sdBox(u, v, 1.38, 0.98, 0.06); if (b > 0) return false; if (b > -0.05 || v > 0.72) return true;
      const gx = (u + 1.33) / 2.66, gy = (v + 0.93) / 1.6; const fx = (gx * 7) % 1, fy = (gy * 5) % 1; return fx < 0.1 || fy < 0.1 || (rnd(Math.floor(gx * 7), Math.floor(gy * 5) + 90) > 0.62 && fx > 0.25 && fx < 0.85 && fy > 0.25 && fy < 0.85); },
    1.4, 9.5, 0.5, (u, v, i) => { const b = sdBox(u, v, 1.38, 0.98, 0.06); if (b > -0.05 || v > 0.72) return glowC(CORAL, 0.8, v > 0.72 ? 0.9 : 0.3);
      const gx = (u + 1.33) / 2.66, gy = (v + 0.93) / 1.6, fx = (gx * 7) % 1, fy = (gy * 5) % 1; return fx > 0.2 && fy > 0.2 ? glowC(TINTS[Math.floor(gx * 7) % 5], 1, 1.5) : dimC(PINK, 1.5); }),
    // gallery: a ring of light under the carousel, and a second, thinner one above
    () => { const f = [0, YC(3), 0]; return formOf(N, [], 0, { spare: (i) => { const a = (i / N) * TAU * 3 + rnd(i, 81) * 0.05, up = i % 3 === 0, r = up ? 11 : 10 + (rnd(i, 82) - 0.5) * 1.2;
      return { p: [f[0] + Math.cos(a) * r, f[1] + (up ? 7 : -5.5 + (rnd(i, 83) - 0.5) * 0.6), f[2] + Math.sin(a) * r], s: up ? 0.12 : 0.28, c: rnd(i, 84) < 0.25 ? glowC(TINTS[i % 5], 0.9, 0.8) : glowC(PINK, 0.3, 0.04) }; }, lift: 6 }); },
    // feed: a heart the size of a room behind the feed column: the double tap
    () => shape(4, (u, v) => heart(u * 1.25, v * 1.2 + 0.12), 1.15, 11, 1.4, (u, v, i) => { const e = Math.abs(u * 1.25 * u * 1.25 + (v * 1.2 + 0.12) * (v * 1.2 + 0.12) - 1); return e < 0.25 || rnd(i, 91) < 0.12 ? glowC(PINK, 1, 1.3) : glowC(PINK, 0.3, 0.06); }, { dy: 0.5 }),
    // how: five steps rising across the shaft, one platform each
    () => { const f = F(5), pts = [], per = Math.floor(N / 5);
      for (let s = 0; s < 5; s++) { const v = Array.from({ length: per }, (_, i) => [((i % 8) - 3.5) * 0.42, -Math.floor(i / 64) * 0.42, ((Math.floor(i / 8) % 8) - 3.5) * 0.42]).filter((q) => q[1] > -1.7);
        v.forEach((q) => pts.push([q[0] + (s - 2) * 4.6, q[1] + s * 1.8 - 4, q[2] - s * 1.6, s])); }
      return formOf(N, pts, 0.42, { place: (q) => [f[0] + 2 + q[0], f[1] + q[1], f[2] + q[2]], col: (i, q) => (q[1] > -0.45 - 4 + q[3] * 1.8 ? glowC(TINTS[q[3]], 0.9, 1.2) : glowC(TINTS[q[3]], 0.3, 0.05)), spare: dust(5), lift: 5 }); },
    // end: a heart outline, its glow bursting out in rays
    () => { const f = F(6); const v = vox((u, w) => { const x = u * 1.25, y = w * 1.2 + 0.12; return heart(x, y) && !heart(x * 1.22, y * 1.22 - 0.02); }, Math.round(N * 0.7), 10.5, 9, 1.0);
      return formOf(N, v.pts, v.s, { place: at(f[0] + 1.5, f[1] + 1, f[2], 0.2), col: (i) => glowC(rnd(i, 95) < 0.8 ? PINK : CORAL, 1, 1.4), lift: 5,
        spare: (i) => { const a = rnd(i, 96) * TAU, r = 6 + rnd(i, 97) * 9; return { p: [f[0] + 1.5 + Math.cos(a) * r, f[1] + 1 + Math.sin(a) * r * 0.85, f[2] - 1 - rnd(i, 98) * 3], s: 0.12, c: glowC(TINTS[i % 5], 1, 1.2) }; } }); },
  ];
  spec.chapters.forEach((c, i) => { c.swarm = forms[i]; });

  /* the cards: the real posts */
  const camOf = (j) => spec.chapters[j].cam.pos;
  const cards = [
    (i, t, o, ctx) => { const n = ctx.cards.N, a = (i / n) * TAU + t * 0.08, f = F(0);       // orbiting the phone
      o.p.set(f[0] + Math.cos(a) * 8.5, f[1] + Math.sin(a) * 5.5 + 0.5, f[2] + Math.sin(a + 1) * 3 - 1.5); ctx.face(o, ctx.camPos[0], 0, 0, Math.sin(t * 0.6 + i) * 0.08);
      o.s = 0.8; o.f = 0.95; o.focus = Math.cos(a) > 0.6 ? 0.6 : 0; },
    (i, t, o, ctx) => { const r = ctx.R[i], f = F(1);                                         // a loose cloud around the icons
      o.p.set(f[0] + (r[0] - 0.5) * 26, f[1] + (r[1] - 0.5) * 16, f[2] - 6 - r[2] * 10); ctx.face(o, ctx.camPos[1], 0, (r[3] - 0.5) * 0.6, (r[4] - 0.5) * 0.3); o.s = 0.6; o.f = 0.6; },
    (i, t, o, ctx) => { const f = F(2), cx = i % 7, cy = Math.floor(i / 7) % 4;                // dropped into the month's days
      const yaw = faceTo(f, camOf(2)) - 0.25, x = (cx - 3) * 1.88, y = 2.4 - cy * 1.62;
      o.p.set(f[0] + x * Math.cos(yaw) + 0.6 * Math.sin(yaw), f[1] + y - 1, f[2] - x * Math.sin(yaw) + 0.6 * Math.cos(yaw)); ctx.yaw(o, yaw); o.s = 0.42; o.f = 1; o.lift = 3;
      if (i >= 28) { o.s = 0; o.f = 0; } },
    (i, t, o, ctx) => { const n = ctx.cards.N, row = i % 2, a = (Math.floor(i / 2) / (n / 2)) * TAU + t * 0.07 + row * 0.25;   // the carousel
      o.p.set(Math.cos(a) * 9, YC(3) + (row ? -2.2 : 2.0), Math.sin(a) * 9); ctx.face(o, ctx.V3([0, YC(3) + (row ? -2.2 : 2.0), 0]));
      o.s = 1.05; o.f = 1; o.focus = Math.sin(a) < -0.7 ? 1 : 0.2; o.lift = 2; },
    (i, t, o, ctx) => { const n = ctx.cards.N, f = F(4), sp = 3.7;                            // the feed column, scrolling
      const y = ((i * sp + t * 0.9) % (n * sp)) - n * sp * 0.5; o.p.set(f[0] + 1.5, f[1] - y * 0.9, f[2] + 3.5); ctx.face(o, ctx.camPos[4]);
      o.s = 1.05; o.f = clamp(1 - Math.abs(y) / 15); o.focus = Math.abs(y) < 2 ? 1 : 0; },
    (i, t, o, ctx) => { const f = F(5); if (i < 5) { o.p.set(f[0] + 2 + (i - 2) * 4.6, f[1] + i * 1.8 - 4 + 2.4 + Math.sin(t + i) * 0.15, f[2] - i * 1.6); ctx.face(o, ctx.camPos[5]); o.s = 0.8; o.focus = 1; return; }
      const r = ctx.R[i]; o.p.set(f[0] + (r[0] - 0.5) * 30, f[1] + (r[1] - 0.5) * 18, f[2] - 10 - r[2] * 10); ctx.face(o, ctx.camPos[5]); o.s = 0.55; o.f = 0.5; },
    (i, t, o, ctx) => { const n = ctx.cards.N, a = (i / n) * TAU + t * 0.12, f = F(6);       // a ring of stories around the heart
      o.p.set(f[0] + 1.5 + Math.cos(a) * 9.5, f[1] + 1 + Math.sin(a) * 7.5, f[2] - 2); ctx.face(o, ctx.camPos[6]); o.s = 0.6; o.f = 0.95; },
  ];
  spec.chapters.forEach((c, i) => { c.cards = cards[i]; });
  return startDim(spec, opts);
}
