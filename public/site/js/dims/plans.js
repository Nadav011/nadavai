// dims/plans.js: the plans page's dimension (2026-10-28). The page's idea was an ascent from dusk to dawn with an
// altimeter at the margin (js/worlds/w-plans.js); the full version is a place you climb: one tower of three tiers, the
// three plans, standing over a dark plain at dusk. Each tier is built as geometry (floor slabs, glass with lit windows,
// columns, a terrace ringed with its own light) and carries its plan's emblem (the page's own art) on its face. The
// scroll spirals the camera up the tower, through a deck of cloud, into the dawn; the sky warms with the climb.
//
//   hero     the plain at dusk, the tower ahead; the blocks lie in the plain as a small lit town
//   cards    the blocks rise into three halos, one around each tier, the three plans side by side
//   path     the halos become a stair of four landings up the tower's flank, the four steps to a plan
//   terms    six slabs stacked into a monolith on the second terrace: half a year, a month a slab
//   faq      above the clouds the blocks float as tiles in a slow ring around the top tier
//   end      the blocks crown the spire as a beacon, the sun clears the horizon
//
// The DOM stays the page; core.js runs the camera, the cards, the swarm, the cuts and every fallback.
import { startDim, TAU, lerp, sstep, rnd, aim, canvasTex, HASH } from './core.js';

const EMB = ['partner', 'team', 'care'].map((n) => `/site/sections/offer/assets/emblem-${n}.webp`);
const ACC = '#F2B36F';
// the tiers, bottom up: half width, base and top height, their light
const TIER = [
  { h: 22, y0: 0, y1: 20, col: [1.0, 0.55, 0.28] },     // care: the broad base
  { h: 15, y0: 20, y1: 46, col: [1.0, 0.62, 0.5] },     // team
  { h: 9, y0: 46, y1: 78, col: [1.0, 0.82, 0.5] },      // partner: the top
];
const SPIRE = 108;
const SUN = [-0.62, 0.0, -0.78];

const SKY_VS = /* glsl */`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FS = /* glsl */`
uniform float uDawn; uniform vec3 uSun; varying vec3 vD;
${HASH}
void main(){
  float y = vD.y, k = uDawn;
  vec3 zen = mix(vec3(0.010, 0.010, 0.036), vec3(0.025, 0.045, 0.1), k);
  vec3 hor = mix(vec3(0.24, 0.08, 0.18), vec3(0.62, 0.34, 0.15), smoothstep(0.1, 0.9, k));
  float sd = max(dot(vD, normalize(uSun)), 0.0);
  vec3 col = mix(hor, zen, smoothstep(-0.02, 0.45, y));
  col += hor * pow(sd, 6.0) * (0.25 + 0.7 * k) * smoothstep(-0.1, 0.2, y + 0.1);
  col += vec3(1.0, 0.8, 0.5) * pow(sd, 1400.0) * 3.0 * k * k;                  // the sun disc
  col *= mix(0.55, 1.0, smoothstep(-0.3, 0.0, y));
  vec2 g = vD.xz / (1.0 + max(y, 0.0)) * 260.0; vec2 i = floor(g);
  float star = step(0.9965, h21(i)) * smoothstep(0.5, 0.0, length(fract(g) - 0.5)) * smoothstep(0.1, 0.4, y);
  col += vec3(0.85, 0.9, 1.0) * star * (1.0 - k) * (1.0 - k) * (0.6 + 1.4 * h21(i + 7.0));
  gl_FragColor = vec4(col, 1.0);
}`;
const GLASS_VS = /* glsl */`
varying vec3 vW, vN;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vN = normalize(mat3(modelMatrix) * normal);
  vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const GLASS_FS = /* glsl */`
uniform vec3 uTint; uniform float uDawn; uniform float uSeed; uniform float uOn;
varying vec3 vW, vN;
#include <fog_pars_fragment>
${HASH}
void main(){
  vec3 N = normalize(vN);
  if (N.y > 0.5) { gl_FragColor = vec4(vec3(0.03, 0.028, 0.04), 1.0);
    #include <fog_fragment>
    return; }
  vec2 g = abs(N.x) > 0.5 ? vW.zy : vW.xy;
  vec2 q = g / vec2(2.4, 3.4); vec2 cell = floor(q), f = fract(q);
  float win = step(0.1, f.x) * step(f.x, 0.9) * step(0.16, f.y) * step(f.y, 0.86);
  float h = h21(cell + uSeed + (abs(N.x) > 0.5 ? 31.0 : 0.0));
  float lit = step(0.42, h) * uOn;
  vec3 V = normalize(cameraPosition - vW);
  float fres = pow(1.0 - min(abs(dot(N, V)), 1.0), 3.0);
  vec3 sky = mix(vec3(0.05, 0.03, 0.08), vec3(0.3, 0.2, 0.16), uDawn);
  vec3 col = vec3(0.012, 0.012, 0.02) + sky * (0.08 + 0.5 * fres);
  col += win * lit * uTint * (0.12 + 0.42 * h21(cell + 3.3)) * (1.0 - 0.5 * uDawn);
  col *= 1.0 - 0.6 * (1.0 - win) * step(0.0, f.y);           // mullions and slab edges stay dark
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;
const RIDGE_FS = /* glsl */`
uniform float uDawn; varying vec3 vW, vN;
#include <fog_pars_fragment>
void main(){ vec3 c = mix(vec3(0.02, 0.015, 0.035), vec3(0.09, 0.06, 0.08), uDawn) * (0.6 + 0.4 * smoothstep(0.0, 40.0, vW.y));
  gl_FragColor = vec4(c, 1.0);
  #include <fog_fragment>
}`;

function drawCloud(g, W, H) {
  for (let i = 0; i < 14; i++) {
    const x = W * (0.2 + Math.random() * 0.6), y = H * (0.4 + Math.random() * 0.25), r = W * (0.12 + Math.random() * 0.2);
    const gr = g.createRadialGradient(x, y, 0, x, y, r);
    gr.addColorStop(0, 'rgba(255,255,255,.5)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = gr; g.fillRect(0, 0, W, H);
  }
}

// the camera's stops: pos, a focus to frame on the inline-end side, and how far off-centre
const STOP = [
  { pos: [36, 3.5, 92], focus: [0, 34, 0], side: 26, fov: 50, pp: [20, 6, 128], tp: [0, 40, 0] },
  { pos: [30, 14, 64], focus: [0, 40, 0], side: 20, fov: 54, pp: [16, 16, 100], tp: [0, 46, 0] },
  { pos: [70, 30, 34], focus: [0, 38, 0], side: 26, fov: 48, pp: [76, 34, 46], tp: [0, 40, 0] },
  { pos: [-22, 54, 58], focus: [0, 56, 0], side: 34, fov: 50, pp: [-24, 56, 72], tp: [0, 56, 0] },
  { pos: [-36, 74, -12], focus: [0, 72, 0], side: 12, fov: 54, pp: [-50, 76, -16], tp: [0, 74, 0] },
  { pos: [24, 122, 30], focus: [0, 104, -10], side: 10, fov: 56, pp: [30, 126, 44], tp: [0, 104, -10] },
];
const cam = (s) => ({ pos: s.pos, tgt: aim(s.pos, s.focus, s.side), fov: s.fov, pp: s.pp, tp: s.tp });

export function initDim(opts) {
  let N = 0;
  const P = {};
  const spec = {
    name: 'plans', base: '#08071A', accent: ACC, ink: '#05040e',
    fog: { color: 0x0b0918, density: 0.0062 }, exposure: 1.0, bloom: { strength: 0.65, radius: 0.6, threshold: 0.8 },
    intro: [0, -2, 26], parallax: 1.4,
    card: { shots: EMB, w: 7, h: 7, r: 0.9, n: [3, 3] },
    swarm: { n: [960, 520], key: [-0.6, 0.35, -0.75], keyCol: 0xffc890, amb: 0x2a2440,
      uniforms: { uDawn: { value: 0 } }, head: 'uniform float uDawn;',
      glsl: 'col = mix(col, col * vec3(1.15, 1.0, 0.85) + vec3(0.04, 0.025, 0.01), uDawn);' },
    chapters: [
      { at: 'top', cam: cam(STOP[0]) },
      { at: '.pl__grid', cam: cam(STOP[1]), cut: 'warp' },
      { at: '#path', cam: cam(STOP[2]), via: [[56, 20, 60], [10, 32, 0]], cut: 'fold' },
      { at: '#terms', cam: cam(STOP[3]), via: [[30, 44, 66], [6, 46, 0]], cut: 'glitch' },
      { at: '#faq', cam: cam(STOP[4]), via: [[-34, 62, 22], [0, 62, 0]], cut: 'ink' },
      { at: 'end', cam: cam(STOP[5]), via: [[-14, 100, -40], [0, 96, 0]], cut: 'warp' },
    ],
    async build(ctx) {
      const { THREE, scene, fogU, phone } = ctx;
      N = ctx.swarm.n;
      const sun = new THREE.Vector3(...SUN).normalize();
      const skyU = { uDawn: { value: 0 }, uSun: { value: sun.clone() } };
      const sky = new THREE.Mesh(new THREE.SphereGeometry(1200, 32, 16), new THREE.ShaderMaterial({ vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false, fog: false, uniforms: skyU }));
      sky.renderOrder = -10; scene.add(sky);
      scene.background = null;
      const hemi = new THREE.HemisphereLight(0x5a4a80, 0x120a10, 0.7); scene.add(hemi);
      const sunL = new THREE.DirectionalLight(0xffb070, 0.6); sunL.position.copy(sun).multiplyScalar(100).setY(30); scene.add(sunL);

      /* the plain and the ridges around it */
      const ground = new THREE.Mesh(new THREE.CircleGeometry(900, 64), new THREE.MeshStandardMaterial({ color: 0x0b0912, roughness: 0.95 }));
      ground.rotation.x = -Math.PI / 2; scene.add(ground);
      const ridgeU = { ...fogU(), uDawn: skyU.uDawn };
      for (let layer = 0; layer < 2; layer++) {
        const R0 = 360 + layer * 200, segs = 220, pos = [], idx = [];
        for (let i = 0; i <= segs; i++) {
          const a = (i / segs) * TAU, h = 18 + layer * 26 + 40 * Math.pow(Math.abs(Math.sin(a * 3 + layer) * Math.sin(a * 7.3 + 1.7 * layer)), 1.3) + 10 * Math.sin(a * 23 + layer);
          pos.push(Math.cos(a) * R0, -2, Math.sin(a) * R0, Math.cos(a) * R0, h, Math.sin(a) * R0);
          if (i < segs) { const b = i * 2; idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); }
        }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx); g.computeVertexNormals();
        scene.add(new THREE.Mesh(g, new THREE.ShaderMaterial({ vertexShader: GLASS_VS, fragmentShader: RIDGE_FS, uniforms: ridgeU, fog: true, side: THREE.DoubleSide })));
      }

      /* the tower: per tier a glass body with lit windows, floor slabs, corner columns and a lit terrace edge */
      const slabMat = new THREE.MeshStandardMaterial({ color: 0x1a1724, roughness: 0.55, metalness: 0.5 });
      const glassMats = [], edgeMats = [];
      TIER.forEach((T, ti) => {
        const H = T.y1 - T.y0, w = T.h * 2 - 3;
        const gm = new THREE.ShaderMaterial({ vertexShader: GLASS_VS, fragmentShader: GLASS_FS, fog: true,
          uniforms: { ...fogU(), uTint: { value: new THREE.Color(...T.col) }, uDawn: skyU.uDawn, uSeed: { value: ti * 17.0 }, uOn: { value: 1 } } });
        glassMats.push(gm);
        const body = new THREE.Mesh(new THREE.BoxGeometry(w, H, w), gm); body.position.y = T.y0 + H / 2; scene.add(body);
        const floors = Math.round(H / 3.4);
        const slabs = new THREE.InstancedMesh(new THREE.BoxGeometry(w + 1.2, 0.45, w + 1.2), slabMat, floors);
        const m = new THREE.Matrix4();
        for (let f = 0; f < floors; f++) slabs.setMatrixAt(f, m.makeTranslation(0, T.y0 + f * 3.4 + 0.2, 0));
        scene.add(slabs);
        const colG = new THREE.BoxGeometry(1.1, H, 1.1), cols = new THREE.InstancedMesh(colG, slabMat, 4);
        [[1, 1], [1, -1], [-1, 1], [-1, -1]].forEach(([sx, sz], k) => cols.setMatrixAt(k, m.makeTranslation(sx * (w / 2 + 0.6), T.y0 + H / 2, sz * (w / 2 + 0.6))));
        scene.add(cols);
        // the terrace on top of the tier: a deck and a ring of its light
        const deck = new THREE.Mesh(new THREE.BoxGeometry(T.h * 2 + 2, 0.8, T.h * 2 + 2), slabMat); deck.position.y = T.y1 + 0.4; scene.add(deck);
        const em = new THREE.MeshBasicMaterial({ color: new THREE.Color(...T.col).multiplyScalar(2.4) }); edgeMats.push({ m: em, base: new THREE.Color(...T.col) });
        for (const [sx, sz, lx, lz] of [[0, 1, 1, 0], [0, -1, 1, 0], [1, 0, 0, 1], [-1, 0, 0, 1]]) {
          const e = new THREE.Mesh(new THREE.BoxGeometry(lx ? T.h * 2 + 2.1 : 0.14, 0.14, lz ? T.h * 2 + 2.1 : 0.14), em);
          e.position.set(sx * (T.h + 1), T.y1 + 0.85, sz * (T.h + 1)); scene.add(e);
        }
      });
      // the spire
      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 2.6, SPIRE - 78, 8), slabMat); spire.position.y = 78 + (SPIRE - 78) / 2; scene.add(spire);
      const tip = new THREE.Mesh(new THREE.SphereGeometry(0.9, 16, 10), new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 3, 1.8) })); tip.position.y = SPIRE; scene.add(tip);

      /* the cloud deck the climb passes through */
      const cloudTex = canvasTex(THREE, 256, 256, drawCloud, { srgb: false });
      const clouds = [];
      for (let i = 0; i < (phone ? 26 : 48); i++) {
        const mt = new THREE.SpriteMaterial({ map: cloudTex, color: 0x6a5a8a, transparent: true, opacity: 0.3, depthWrite: false, fog: true });
        const s = new THREE.Sprite(mt);
        const a = rnd(i, 1) * TAU, r = 26 + rnd(i, 2) * 200;
        s.position.set(Math.cos(a) * r, 58 + rnd(i, 3) * 7, Math.sin(a) * r);
        const sc = 60 + rnd(i, 4) * 70; s.scale.set(sc, sc * 0.32, 1);
        s.userData = { a, r, sp: (rnd(i, 5) - 0.5) * 0.01 };
        clouds.push(s); scene.add(s);
      }
      Object.assign(P, { skyU, clouds, edgeMats, glassMats, sunL, hemi, fogCol: scene.fog.color, sun });
      ctx.swarm.u.uDawn = skyU.uDawn;
      return {
        update(c) {
          const { k, t } = c.st;
          const dawn = sstep(0.4, 5, k);
          P.skyU.uDawn.value = dawn;
          P.skyU.uSun.value.set(SUN[0], lerp(-0.06, 0.16, dawn), SUN[2]).normalize();
          P.fogCol.setRGB(lerp(0.043, 0.15, dawn * dawn), lerp(0.035, 0.095, dawn * dawn), lerp(0.094, 0.1, dawn * dawn));
          c.scene.fog.density = lerp(0.0062, 0.0042, dawn);
          P.sunL.intensity = 0.3 + dawn * 1.0;
          for (const s of P.clouds) { const d = s.userData, a = d.a + t * d.sp; s.position.x = Math.cos(a) * d.r; s.position.z = Math.sin(a) * d.r; s.material.color.setRGB(lerp(0.4, 0.62, dawn), lerp(0.33, 0.44, dawn), lerp(0.52, 0.4, dawn)); }
          // the tier the camera is at glows brighter
          const at = k < 2.5 ? 0 : k < 3.6 ? 1 : 2;
          P.edgeMats.forEach((e, i) => e.m.color.copy(e.base).multiplyScalar((i === at ? 3.2 : 1.6) * (1 - dawn * 0.35)));
        },
      };
    },
  };

  /* the swarm's shapes */
  const C = (r, g, b, glow = 0) => [r, g, b, glow];
  const stone = C(0.32, 0.27, 0.3), lit = C(1, 0.66, 0.34, 1.3);
  const form = (fn, lift = 6) => {
    const p = new Float32Array(N * 3), c = new Float32Array(N * 4), s = new Float32Array(N);
    for (let i = 0; i < N; i++) {
      const o = fn(i);
      p.set(o.p, i * 3); c.set(o.c || stone, i * 4); s[i] = o.s ?? 0.9;
    }
    return { p, c, s, lift };
  };
  const forms = [
    // hero: a small lit town of block houses in the plain around the tower's foot
    () => form((i) => {
      const lot = Math.floor(i / 6), h = i % 6, a = rnd(lot, 1) * TAU, r = 34 + rnd(lot, 2) * 70;
      const tall = 1 + Math.floor(rnd(lot, 3) * 6);
      if (h >= tall) return { p: [Math.cos(a) * r, 0, Math.sin(a) * r], s: 0 };
      return { p: [Math.cos(a) * r + (h % 2) * 0.01, 0.6 + h * 1.25, Math.sin(a) * r], s: 1.2, c: rnd(i, 4) < 0.18 ? C(1, 0.62, 0.3, 0.9) : stone };
    }, 8),
    // cards: three halos, one around each tier
    () => form((i) => {
      const t = i % 3, T = TIER[t], m = Math.floor(i / 3), cnt = Math.ceil(N / 3), a = (m / cnt) * TAU;
      const r = T.h * 1.55 + 4, y = T.y1 - 2 + Math.sin(a * 5) * 0.8;
      return { p: [Math.cos(a) * r, y, Math.sin(a) * r], s: 0.75, c: rnd(i, 5) < 0.35 ? C(...T.col, 1.2) : stone };
    }, 10),
    // path: four landings stepping up the tower's flank, each a slab of blocks
    () => form((i) => {
      const L = i % 4, m = Math.floor(i / 4), per = Math.ceil(N / 4);
      const gx = m % 10, gz = Math.floor(m / 10) % 6, gy = Math.floor(m / 60);
      if (gy > 3) return { p: [30, 20, 30], s: 0 };
      const a = 0.25 + L * 0.42, r = 27, y = 22 + L * 6.2;
      const cx = Math.cos(a) * r, cz = Math.sin(a) * r;
      const lx = (gx - 4.5) * 0.9, lz = (gz - 2.5) * 0.9;
      return { p: [cx + lx * Math.cos(a + Math.PI / 2) + lz * Math.cos(a), y - gy * 0.9, cz + lx * Math.sin(a + Math.PI / 2) + lz * Math.sin(a)], s: 0.85,
        c: gy === 0 && (gx === 0 || gx === 9) ? C(1, 0.7, 0.4, 1.6) : stone };
    }, 8),
    // terms: six slabs stacked on the second terrace, a month a slab
    () => form((i) => {
      const per = Math.floor(N / 6), sl = Math.min(5, Math.floor(i / per)), m = i % per;
      const gx = m % 13, gz = Math.floor(m / 13) % 6, gy = Math.floor(m / 78);
      if (gy > 0 || i >= per * 6) return { p: [0, 47, 18], s: 0 };
      return { p: [(gx - 6) * 0.9, 48.2 + sl * 2.2, 18 + (gz - 2.5) * 0.9], s: 0.86, c: gx === 0 || gx === 12 ? C(1, 0.72, 0.42, 1.4) : C(0.34, 0.3, 0.34) };
    }, 7),
    // faq: tiles floating in a slow ring around the top tier, above the clouds
    () => form((i) => {
      const a = (i / N) * TAU * 3 + rnd(i, 6) * 0.2, r = 18 + (i % 3) * 5 + rnd(i, 7) * 3;
      return { p: [Math.cos(a) * r, 64 + Math.sin(a * 2 + i) * 3 + (i % 3) * 2, Math.sin(a) * r], s: 0.55, c: rnd(i, 8) < 0.12 ? C(1, 0.8, 0.5, 0.7) : C(0.36, 0.3, 0.34) };
    }, 6),
    // end: a crown of blocks on the spire, a beacon at dawn
    () => form((i) => {
      const a = (i / N) * TAU * 9, y = 82 + (i / N) * 24, r = 2.2 + Math.max(0, 6 - (y - 82) * 0.25) * (0.6 + 0.4 * Math.sin(a * 0.5));
      return { p: [Math.cos(a) * r, y, Math.sin(a) * r], s: 0.55, c: rnd(i, 9) < 0.5 ? C(1, 0.78, 0.45, 1.4) : C(0.5, 0.42, 0.38) };
    }, 12),
  ];
  spec.chapters.forEach((c, i) => { c.swarm = forms[i]; });

  /* the cards: each plan's emblem on the face of its tier, turning to meet the camera */
  const plaque = (i, t, o, ctx, out = 0) => {
    const T = TIER[2 - i], y = (T.y0 + T.y1) / 2 + 2;
    const cp = ctx.camera.position, a = Math.atan2(cp.z, cp.x);
    o.p.set(Math.cos(a) * (T.h + 4 + out), y + Math.sin(t * 0.6 + i) * 0.3, Math.sin(a) * (T.h + 4 + out));
    o.q.copy(ctx.camera.quaternion);
    o.s = i === 0 ? 1.3 : 1; o.focus = 0.4; o.lift = 2;
  };
  // from the terms on the plaques step back into their tiers, so nothing stands behind the text up there
  const away = (i, t, o, ctx) => { plaque(i, t, o, ctx, -6); o.s = 0.01; o.f = 0; };
  const cards = [(i, t, o, ctx) => plaque(i, t, o, ctx), (i, t, o, ctx) => plaque(i, t, o, ctx, 4), (i, t, o, ctx) => { plaque(i, t, o, ctx, -2); o.s *= 0.7; }, away, away, away];
  spec.chapters.forEach((c, i) => { c.cards = cards[i]; });
  return startDim(spec, opts);
}
