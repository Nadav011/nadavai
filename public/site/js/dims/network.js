// dims/network.js: the Mexicani network's dimension (2026-10-28). The page's idea was a warm web of branch nodes joined
// by thin lines of light with pulses running along them (js/worlds/w-network.js). The full version is the network as a
// place: a dark map, its ground drawn in contour lines, the branches standing on it as small lit towers around one HQ
// tower, every branch joined to the HQ by an arc of light that carries pulses. The camera flies the map; the swarm is
// the network's information, re-formed per section:
//
//   hero    a small block tower on every branch           mess    the problem: messages tumbling, the links flicker red
//   built   six modules ringed around the HQ              result  one screen standing over the HQ, every link calm
//   origin  down at the first branch: the system's real screen, in a phone of blocks      end  the whole network lit
import { startDim, TAU, clamp, lerp, sstep, rnd, aim, FOG_ADD, HASH } from './core.js';
import { vox, formOf, at, sdBox, points, mixC, glowTex } from './story-kit.js';

const AMBER = [1, 0.55, 0.2], PALE = [1, 0.85, 0.6], RED = [1, 0.22, 0.2], BLUE = [0.5, 0.7, 0.85], GREEN = [0.35, 0.85, 0.5];
const HQ = [0, 0, -20];
const NODES = Array.from({ length: 18 }, (_, i) => {   // branches spread over a long country, none too near the HQ
  let x, z, k = 0;
  do { x = (rnd(i + k * 31, 1) - 0.5) * 70; z = 26 - rnd(i + k * 31, 2) * 120; k++; } while (Math.hypot(x - HQ[0], z - HQ[2]) < 10 && k < 20);
  return [x, 0, z];
});
const FIRST = 3;                                          // the first branch, where it started
const NB = NODES.length;

/* ── shaders ── */
const GROUND_VS = /* glsl */`varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const GROUND_FS = /* glsl */`
uniform float uTime, uChaos; uniform vec3 uAcc;
varying vec3 vW;
#include <fog_pars_fragment>
${HASH}
float fbm(vec2 p){ return n2(p) * 0.55 + n2(p * 2.1 + 3.7) * 0.3 + n2(p * 4.3 + 8.1) * 0.15; }
void main(){
  vec2 p = vW.xz;
  float h = fbm(p * 0.018) * 10.0;                                   // contour lines of a land that is not there
  float d = abs(fract(h) - 0.5); float w = fwidth(h);
  float iso = 1.0 - smoothstep(0.0, w * 1.4, d - 0.0);
  float major = 1.0 - smoothstep(0.0, w * 1.6, abs(fract(h * 0.2) - 0.5));
  vec2 g = abs(fract(p / 10.0) - 0.5); float gw = fwidth(p.x / 10.0);
  float grid = (1.0 - smoothstep(0.0, gw * 1.2, 0.5 - max(g.x, g.y))) * 0.5;
  float hqr = length(p - vec2(${HQ[0].toFixed(1)}, ${HQ[2].toFixed(1)}));
  float ring = exp(-(((fract(hqr * 0.02 - uTime * 0.05) - 0.5) * 14.0) * ((fract(hqr * 0.02 - uTime * 0.05) - 0.5) * 14.0)));   // signal rings from the HQ
  vec3 col = vec3(0.014, 0.016, 0.02) + vec3(0.32, 0.4, 0.48) * (iso * 0.05 + major * 0.08 + grid * 0.025);
  col += uAcc * ring * 0.05 * (1.0 - uChaos) * exp(-hqr * 0.012);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;
const LINK_VS = /* glsl */`attribute float aT; attribute float aId;
varying float vT, vId;
#include <fog_pars_vertex>
void main(){ vT = aT; vId = aId; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const LINK_FS = /* glsl */`
uniform float uTime, uChaos, uCalm, uDir; uniform vec3 uAcc, uRed;
varying float vT, vId;
#include <fog_pars_fragment>
${HASH}
void main(){
  float ph = fract(vT * 1.5 - uTime * (0.22 + h21(vec2(vId, 2.0)) * 0.2) * uDir + h21(vec2(vId, 1.0)));
  float pulse = exp(-((ph - 0.5) * 22.0) * ((ph - 0.5) * 22.0));
  float flick = step(0.45, h21(vec2(vId, floor(uTime * 9.0))));        // the mess: links that cut in and out
  float broken = step(0.5, fract(vT * 9.0 + h21(vec2(vId, 5.0)))) ;
  vec3 calm = uAcc * (0.22 + 0.15 * uCalm + pulse * (1.6 + uCalm));
  vec3 mess = uRed * (0.12 + 0.5 * flick) * broken;
  gl_FragColor = vec4(mix(calm, mess, uChaos), 1.0);
  ${FOG_ADD}
}`;

export function initDim(opts) {
  let N = 0;
  const P = {};
  const nodeTop = (n) => [NODES[n][0], 2.6 + rnd(n, 9) * 1.4, NODES[n][2]];
  const F0 = NODES[FIRST];
  const spec = {
    name: 'network', base: '#0B0C0E', accent: '#E8913C', ink: '#040405',
    fog: { color: 0x0a0b0d, density: 0.0095 }, exposure: 1.05, bloom: { strength: 0.7, radius: 0.55, threshold: 0.8 },
    intro: [0, 18, 20], parallax: 0.8,
    card: { shots: ['/site/sections/bio/assets/scr-cash.webp'], w: 2.2, h: 4.77, r: 0.28, n: [1, 1] },
    swarm: { n: [1200, 660], key: [0.3, 1, 0.5], keyCol: 0xffe8cc, amb: 0x2a2c30 },
    chapters: [
      { at: 'top', cam: { pos: [30, 21, 24], tgt: aim([30, 21, 24], [-4, 0, -22], 11, 2), fov: 50, pp: [20, 60, 48], tp: [0, 0, -24] }, via: [[34, 18, 10], [-4, 4, -26]] },
      { at: '#netMess', cam: { pos: [16, 9, 2], tgt: [-6, 4, -26], fov: 56, roll: 0.05, pp: [10, 12, 10], tp: [-4, 5, -26] }, via: [[-12, 20, 8], [0, 2, -20]], cut: 'glitch' },
      { at: '#netBuilt', cam: { pos: [28, 18, -2], tgt: aim([28, 18, -2], [0, 2, -20], 10, 0), fov: 50, roll: -0.025, pp: [16, 26, 12], tp: [0, 3, -20] }, via: [[30, 30, -40], [0, 6, -22]], cut: 'fold' },
      { at: '.net-result', cam: { pos: [6, 11, 16], tgt: aim([6, 11, 16], [0, 11, -20], 13, 0), fov: 52, pp: [0, 14, 26], tp: [0, 14, -20] }, via: [[-26, 14, 4], [F0[0] + 2, 3, F0[2] - 4]], cut: 'warp' },
      { at: '[aria-labelledby="netO"]', cam: { pos: [F0[0] + 13, 5, F0[2] + 17], tgt: aim([F0[0] + 13, 5, F0[2] + 17], [F0[0], 3.4, F0[2]], 7.5, 3.2), fov: 46, roll: 0.02, pp: [F0[0] + 6, 6, F0[2] + 16], tp: [F0[0], 5, F0[2]] },
        via: [[F0[0] + 30, 30, F0[2] + 20], [0, 0, -24]], cut: 'ink' },
      { at: 'end', cam: { pos: [0, 92, 46], tgt: [-6, 0, -26], fov: 50, pp: [0, 120, 40], tp: [0, 0, -28] }, cut: 'scan' },
    ],
    async build(ctx) {
      const { THREE, scene, time, phone, fogU, acc } = ctx;
      N = ctx.swarm.n;
      scene.add(new THREE.HemisphereLight(0x8090a0, 0x0a0806, 0.6));
      const key = new THREE.PointLight(0xffb070, 240, 60, 1.5); key.position.set(0, 16, -14); scene.add(key);

      /* the map: contour lines, a faint survey grid, the HQ's signal rings */
      const groundU = { ...fogU(), uTime: time, uChaos: { value: 0 }, uAcc: { value: acc } };
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(700, 700), new THREE.ShaderMaterial({ vertexShader: GROUND_VS, fragmentShader: GROUND_FS, uniforms: groundU, fog: true }));
      ground.rotation.x = -Math.PI / 2; ground.position.z = -40; scene.add(ground);

      /* the branches: small towers with a ring of the light on top; the HQ, tall, with its beacon */
      const towerM = new THREE.MeshStandardMaterial({ color: 0x1b1d21, metalness: 0.5, roughness: 0.45 });
      const gt = glowTex(THREE);
      P.rings = [];
      NODES.forEach((n, i) => {
        const h = nodeTop(i)[1];
        const t = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.7, h, 6), towerM); t.position.set(n[0], h / 2, n[2]); scene.add(t);
        const rm = new THREE.MeshBasicMaterial({ color: new THREE.Color(...AMBER).multiplyScalar(1.6) });
        const r = new THREE.Mesh(new THREE.TorusGeometry(0.75, 0.06, 4, 24), rm); r.rotation.x = Math.PI / 2; r.position.set(n[0], h + 0.05, n[2]); scene.add(r);
        const base = new THREE.Mesh(new THREE.RingGeometry(1.4, 1.55, 32), new THREE.MeshBasicMaterial({ color: new THREE.Color(...AMBER).multiplyScalar(0.7), side: THREE.DoubleSide }));
        base.rotation.x = -Math.PI / 2; base.position.set(n[0], 0.03, n[2]); scene.add(base);
        const g = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, color: 0xffa860, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.6 }));
        g.scale.set(3.2, 3.2, 1); g.position.set(n[0], h + 0.2, n[2]); scene.add(g);
        P.rings.push({ rm, base: base.material, g, i });
      });
      const hq = new THREE.Group();
      const hqB = new THREE.Mesh(new THREE.BoxGeometry(4, 15, 4), towerM); hqB.position.y = 7.5; hq.add(hqB);
      const bands = canvasStripes(THREE);
      const hqG = new THREE.Mesh(new THREE.BoxGeometry(4.05, 15, 4.05), new THREE.MeshBasicMaterial({ map: bands, transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, color: new THREE.Color(...AMBER) }));
      hqG.position.y = 7.5; hq.add(hqG);
      const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 12), new THREE.MeshBasicMaterial({ color: new THREE.Color(3, 1.8, 0.8) })); beacon.position.y = 16; hq.add(beacon);
      const bg = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, color: 0xffb070, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.9 })); bg.scale.set(9, 9, 1); bg.position.y = 16; hq.add(bg);
      hq.position.set(...HQ); scene.add(hq);

      /* the links: an arc from the HQ to every branch, and a few between neighbours; pulses run along them */
      const pos = [], tt = [], ids = [];
      const arc = (a, b, id, lift) => { const S = 40; for (let s = 0; s < S; s++) { for (const u of [s / S, (s + 1) / S]) {
        pos.push(a[0] + (b[0] - a[0]) * u, a[1] + (b[1] - a[1]) * u + Math.sin(Math.PI * u) * lift, a[2] + (b[2] - a[2]) * u); tt.push(u); ids.push(id); } } };
      const hqTop = [HQ[0], 14, HQ[2]];
      NODES.forEach((n, i) => { const t = nodeTop(i); arc(hqTop, t, i, 3 + Math.hypot(n[0] - HQ[0], n[2] - HQ[2]) * 0.12); });
      NODES.forEach((n, i) => { let best = -1, bd = 1e9; NODES.forEach((m, j) => { if (j <= i) return; const d = Math.hypot(n[0] - m[0], n[2] - m[2]); if (d < bd) { bd = d; best = j; } });
        if (best >= 0 && bd < 26) arc(nodeTop(i), nodeTop(best), 100 + i, 1.5 + bd * 0.08); });
      const lg = new THREE.BufferGeometry();
      lg.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); lg.setAttribute('aT', new THREE.Float32BufferAttribute(tt, 1)); lg.setAttribute('aId', new THREE.Float32BufferAttribute(ids, 1));
      const linkU = { ...fogU(), uTime: time, uChaos: { value: 0 }, uCalm: { value: 0 }, uDir: { value: 1 }, uAcc: { value: acc }, uRed: { value: new THREE.Color(...RED) } };
      const links = new THREE.LineSegments(lg, new THREE.ShaderMaterial({ vertexShader: LINK_VS, fragmentShader: LINK_FS, uniforms: linkU, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      links.renderOrder = 4; scene.add(links);
      const motes = points(ctx, phone ? 200 : 480, (i) => [(rnd(i, 21) - 0.5) * 120, rnd(i, 22) * 24, 30 - rnd(i, 23) * 140], () => [1, 0.7, 0.4], { size: 0.16, rise: 0.25, span: 24, tw: 0.7, i: 0.7 });
      scene.add(motes.mesh);

      Object.assign(P, { key, groundU, linkU, hqG, beacon, lastY: 0 });
      return {
        update(c) {
          const { k, t } = c.st;
          const chaos = sstep(0.5, 1, k) * (1 - sstep(1.4, 1.9, k));
          P.groundU.uChaos.value = chaos; P.linkU.uChaos.value = chaos;
          P.linkU.uCalm.value = sstep(2.5, 3, k) * (1 - sstep(3.5, 4, k)) + sstep(4.5, 5, k);
          const y = c.st.k; P.linkU.uDir.value = y >= P.lastY - 1e-4 ? 1 : -1; P.lastY = y;   // the pulses run the way the page goes
          P.rings.forEach((r) => { const on = r.i === FIRST && k > 3.5 && k < 4.6 ? 2.6 + Math.sin(t * 4) * 0.4 : chaos > 0.3 && rnd(r.i, Math.floor(t * 6)) > 0.6 ? 0.2 : 1.4;
            r.rm.color.setRGB(...(chaos > 0.3 ? mixC(AMBER, RED, chaos * rnd(r.i, 3)) : AMBER)).multiplyScalar(on); r.g.material.opacity = 0.25 + 0.4 * on / 2; });
          P.hqG.material.opacity = 0.18 + 0.32 * (1 - chaos);
          P.beacon.material.color.setRGB(3, 1.8, 0.8).multiplyScalar((0.7 + 0.3 * Math.sin(t * 2.4)) * (1 - chaos * 0.7));
          P.key.intensity = 240 * (1 - chaos * 0.4);
        },
      };
    },
  };

  /* the swarm: the network's information */
  const S = (c, g = 0) => [c[0], c[1], c[2], g];
  const forms = [
    // hero: a small block tower on every branch
    () => { const pts = [], per = Math.floor(N / NB);
      NODES.forEach((n, ni) => { for (let i = 0; i < per; i++) { const lay = Math.floor(i / 4); pts.push([n[0] + 1.6 + ((i % 2) - 0.5) * 0.5, 0.25 + lay * 0.5, n[2] + 1.2 + (((i >> 1) % 2) - 0.5) * 0.5, ni, lay]); } });
      return formOf(N, pts, 0.5, { col: (i, q) => (rnd(i, 31) < 0.25 ? S(AMBER, 1.1) : S([0.24, 0.26, 0.3], 0.02)), lift: 4 }); },
    // mess: messages tumbling around the HQ, the colours of chats, mail and sheets
    () => formOf(N, [], 0, { spare: (i) => { const a = rnd(i, 41) * TAU, r = 3 + Math.pow(rnd(i, 42), 0.6) * 22, c = [GREEN, RED, BLUE, PALE][i % 4];
      return { p: [HQ[0] + Math.cos(a) * r, 1 + rnd(i, 43) * 14, HQ[2] + Math.sin(a) * r], s: 0.22 + rnd(i, 44) * 0.3, c: rnd(i, 45) < 0.18 ? S(c, 0.9) : S(mixC([0.2, 0.2, 0.22], c, 0.3)) }; }, lift: 3 }),
    // built: six modules ringed around the HQ, hexagonal platforms of blocks
    () => { const pts = [], per = Math.floor(N / 6);
      for (let m = 0; m < 6; m++) { const a = (m / 6) * TAU + 0.3, cx = HQ[0] + Math.cos(a) * 9, cz = HQ[2] + Math.sin(a) * 9; let c = 0;
        for (let gx = -6; gx <= 6 && c < per; gx++) for (let gz = -6; gz <= 6 && c < per; gz++) for (let gy = 0; gy < 3 && c < per; gy++) { const x = gx * 0.42, z = gz * 0.42;
          if (Math.abs(z) > 2.3 || Math.abs(x) * 0.866 + Math.abs(z) * 0.5 > 2.3 * 0.866 * 1.15) continue; pts.push([cx + x, 1.2 + m * 0.35 + gy * 0.42, cz + z, m, gy]); c++; } }
      return formOf(N, pts, 0.42, { col: (i, q) => (q[4] === 2 || rnd(i, 51) < 0.08 ? S(mixC(AMBER, PALE, q[3] / 6), 1.2) : S([0.2, 0.2, 0.22], 0.02)), lift: 6 }); },
    // result: one screen standing over the HQ: a frame, three rows, a dot on each
    () => { const v = vox((u, w) => { const b = sdBox(u, w, 1.5, 0.98, 0.06); if (b > 0) return false; if (b > -0.07) return true;
        if (w > 0.62) return Math.abs(w - 0.78) < 0.08 && u > -0.4 && u < 1.3; return [0.25, -0.2, -0.65].some((y) => Math.abs(w - y) < 0.13 && ((u > -1.3 && u < 0.9) || Math.hypot(u - 1.2, w - y) < 0.12)); }, N, 16, 10.5, 0.8);
      return formOf(N, v.pts, v.s, { place: at(HQ[0], 22, HQ[2], 0.05), col: (i, q) => { const u = q[0] / 5.25, w = q[1] / 5.25; if (Math.abs(u) > 1.4 || Math.abs(w) > 0.9) return S(PALE, 0.6);
        if (u > 1.0) return S([GREEN, AMBER, BLUE][Math.floor((0.5 - w) / 0.45) % 3] || AMBER, 1.6); return S([0.5, 0.45, 0.4], 0.25); }, lift: 8 }); },
    // origin: at the first branch, a phone of blocks around the system's real screen
    () => { const v = vox((u, w) => { const b = sdBox(u, w, 0.48, 0.98, 0.14); return b < 0 && b > -0.07; }, Math.round(N * 0.6), 3.2, 6.4, 0.5);
      const yaw = Math.atan2(13, 17);
      return formOf(N, v.pts, v.s, { place: at(F0[0] - 1.5, 3.6, F0[2] + 0.5, yaw), col: (i) => (rnd(i, 61) < 0.3 ? S(AMBER, 1.3) : S([0.3, 0.3, 0.33], 0.05)), lift: 6,
        spare: (i) => { const a = rnd(i, 62) * TAU, r = 2.5 + rnd(i, 63) * 6; return { p: [F0[0] + Math.cos(a) * r, 0.15, F0[2] + Math.sin(a) * r], s: 0.16, c: rnd(i, 64) < 0.2 ? S(AMBER, 0.9) : S([0.2, 0.2, 0.22]) }; } }); },
    // end: a halo of light over the whole network
    () => formOf(N, [], 0, { spare: (i) => { const a = (i / N) * TAU * 2, r = 46 + Math.sin(i * 0.37) * 3;
      return { p: [HQ[0] + Math.cos(a) * r, 2 + Math.sin(a * 5) * 1.5, HQ[2] + Math.sin(a) * r * 1.2], s: 0.45, c: rnd(i, 71) < 0.5 ? S(AMBER, 1.3) : S(PALE, 0.5) }; }, lift: 10 }),
  ];
  spec.chapters.forEach((c, i) => { c.swarm = forms[i]; });
  /* the one card: the system's real screen, only at the origin; elsewhere it waits inside the first branch */
  spec.chapters.forEach((c, j) => { c.cards = (i, t, o, ctx) => {
    if (j !== 4) { o.p.set(F0[0], 1.5, F0[2]); o.q.identity(); o.s = 0.001; o.f = 0; return; }
    o.p.set(F0[0] - 1.5, 3.6 + Math.sin(t * 0.8) * 0.06, F0[2] + 0.5); ctx.yaw(o, Math.atan2(13, 17)); o.s = 1.22; o.f = 1; o.focus = 1; o.lift = 0; }; });
  return startDim(spec, opts);
}

/* the HQ's glass bands: horizontal lines of light up its faces */
function canvasStripes(THREE) {
  const c = document.createElement('canvas'); c.width = 64; c.height = 256;
  const g = c.getContext('2d'); g.clearRect(0, 0, 64, 256);
  for (let y = 6; y < 256; y += 14) { g.fillStyle = `rgba(255,255,255,${0.25 + ((y * 7) % 5) / 10})`; g.fillRect(6, y, 52, 3); }
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
