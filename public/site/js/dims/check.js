// dims/check.js: the business check's dimension (2026-10-28). The page's idea was a radar scope finding more of the
// business as you scroll (js/worlds/w-check.js); the full version is a place: a round scanner room. On a bed in the
// middle stands a model of a business, five layers of it (the customers, the messages, the calendar, the money, the
// stock), each a small city of blocks. A sheet of teal light sweeps the model layer by layer, a gantry ring riding with
// it, and what it finds lights up amber: three findings, each with a beam and a ping, the three things the report
// would automate first. The room listens to the check itself: the analysis speeds the scan up, the report lights the
// findings.
//
//   hero      the model whole on its bed, a slow scan passing up and down
//   describe  the layers lift apart as you write: an exploded model, the sheet passing through each
//   preview   the layers fan out like maps on a table; the three findings come up
//   end       the camera over the room: the layers laid side by side as one map, the scan now sweeping across
//
// The DOM stays the page (the form and its whole flow are untouched); core.js runs the camera, the swarm, the cuts and
// every fallback.
import { startDim, TAU, clamp, lerp, sstep, damp, rnd, aim, canvasTex, FOG_ADD, HASH } from './core.js';

const ACC = '#4FD1D9';
const AMBER = [1, 0.62, 0.22];
const LAYERS = 5, G = 9;                      // five layers, each a 9 × 9 lot of blocks
const FIND = [[1, 2, 6], [3, 6, 3], [4, 3, 2]]; // the findings: [layer, lot x, lot z]

const SHEET_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; uniform float uTime; varying vec2 vUv;
${HASH}
void main(){
  vec2 c = vUv - 0.5; float r = length(c) * 2.0;
  float edge = smoothstep(1.0, 0.92, r);
  float rim = exp(-(((r - 0.93) * 30.0) * ((r - 0.93) * 30.0)));
  float lines = 0.5 + 0.5 * sin((c.x + c.y) * 120.0 + uTime * 4.0);
  float a = (0.05 + 0.04 * lines) * edge + rim * 0.9;
  gl_FragColor = vec4(uCol * a * uI, 1.0);
}`;
const SHEET_VS = /* glsl */`varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const BEAM_VS = /* glsl */`varying vec2 vUv; varying vec3 vN, vV;
#include <fog_pars_vertex>
void main(){ vUv = uv; vec4 mvPosition = modelViewMatrix * vec4(position, 1.0); vN = normalize(normalMatrix * normal); vV = -mvPosition.xyz;
  gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const BEAM_FS = /* glsl */`
uniform vec3 uCol; uniform float uI; uniform float uTime; varying vec2 vUv; varying vec3 vN, vV;
#include <fog_pars_fragment>
void main(){
  float core = ((abs(dot(normalize(vN), normalize(vV)))) * (abs(dot(normalize(vN), normalize(vV)))));
  float up = pow(max(1.0 - vUv.y, 0.0), 1.5);
  float flow = 0.7 + 0.3 * sin(vUv.y * 40.0 - uTime * 6.0);
  gl_FragColor = vec4(uCol * core * up * flow * uI, 1.0);
  ${FOG_ADD}
}`;
const FLOOR_FS = /* glsl */`
uniform vec3 uAcc; uniform float uTime; uniform float uScan; varying vec3 vW;
#include <fog_pars_fragment>
${HASH}
void main(){
  float r = length(vW.xz), a = atan(vW.z, vW.x);
  float rings = exp(-((fract(r / 3.0) - 0.5) * (fract(r / 3.0) - 0.5)) * 1800.0) * 0.5 + exp(-((fract(r / 12.0) - 0.5) * (fract(r / 12.0) - 0.5)) * 9000.0);
  float spokes = exp(-((fract(a / 6.2831853 * 48.0) - 0.5) * (fract(a / 6.2831853 * 48.0) - 0.5)) * 2400.0) * step(10.0, r) * 0.4;
  float sweep = exp(-pow(mod(a - uTime * 0.5, 6.2831853) * 1.5, 1.0)) * smoothstep(38.0, 10.0, r);
  vec3 col = vec3(0.012, 0.022, 0.026) + uAcc * (rings + spokes) * 0.13 * smoothstep(42.0, 6.0, r) + uAcc * sweep * 0.06;
  col += uAcc * exp(-((r - 9.5) * (r - 9.5)) * 4.0) * (0.25 + 0.3 * uScan);   // the bed's lit rim
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;
const FLOOR_VS = /* glsl */`varying vec3 vW;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const WALL_FS = /* glsl */`
uniform vec3 uAcc; uniform float uTime; uniform float uBusy; varying vec3 vW;
#include <fog_pars_fragment>
${HASH}
void main(){
  float a = atan(vW.z, vW.x) / 6.2831853 * 64.0, y = vW.y;
  float panel = step(0.06, fract(a)) * step(fract(a), 0.94);
  float col0 = floor(a);
  // the readouts: thin bars that rise and fall, faster while the check runs
  float rate = mix(0.25, 2.2, uBusy);
  float lev = 3.0 + 9.0 * (0.5 + 0.5 * sin(uTime * rate + h21(vec2(col0, 1.0)) * 40.0));
  float bars = step(0.35, fract(a * 3.0)) * step(fract(a * 3.0), 0.7) * step(2.0, y) * step(y, lev) * step(0.3, fract(y * 1.6));
  vec3 col = vec3(0.016, 0.022, 0.026) * panel + uAcc * bars * 0.22 * step(0.55, h21(vec2(col0, 7.0)));
  col += uAcc * exp(-((y - 18.5) * (y - 18.5)) * 8.0) * 0.5;
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;

function drawPing(g, W, H) {
  g.strokeStyle = 'rgba(255,255,255,1)'; g.lineWidth = W * 0.02;
  g.beginPath(); g.arc(W / 2, H / 2, W * 0.45, 0, TAU); g.stroke();
}

// the camera: pos, the model framed on the inline-end side
const S = [
  { pos: [2, 8.5, 31], focus: [0, 6, 0], side: 9, fov: 44, pp: [0, 10, 44], tp: [0, 7, 0] },
  { pos: [20, 13, 22], focus: [0, 10, 0], side: 9, fov: 48, pp: [26, 15, 34], tp: [0, 10, 0] },
  { pos: [-18, 17, 24], focus: [0, 5, 0], side: 10, fov: 50, pp: [-24, 20, 34], tp: [0, 5, 0] },
  { pos: [6, 40, 12], focus: [0, 0, -2], side: 9, fov: 52, pp: [4, 52, 14], tp: [0, 0, -2] },
];
const cam = (s) => ({ pos: s.pos, tgt: aim(s.pos, s.focus, s.side), fov: s.fov, pp: s.pp, tp: s.tp });

export function initDim(opts) {
  let N = 0;
  const P = {};
  const spec = {
    name: 'check', base: '#04090B', accent: ACC, ink: '#020506',
    fog: { color: 0x050b0d, density: 0.016 }, exposure: 1.0, bloom: { strength: 0.7, radius: 0.5, threshold: 0.8 },
    intro: [0, 4, 16], parallax: 0.8,
    swarm: { n: [1000, 600], key: [0.3, 1, 0.4], keyCol: 0x9fdfe6, amb: 0x1c2a30,
      uniforms: { uScanN: { value: null }, uScanD: { value: 0 }, uScanI: { value: 1 }, uFind: { value: 0 } },
      head: 'uniform vec3 uScanN; uniform float uScanD, uScanI, uFind;',
      glsl: /* glsl */`
        float sd = dot(vW, uScanN) - uScanD;
        float band = exp(-sd * sd * 5.0), edge = exp(-sd * sd * 120.0);
        col += vec3(0.25, 0.85, 0.92) * (band * 0.55 + edge * 1.6) * uScanI;
        col += vCol * vGlow * uFind * 1.4;                           // the report is in: the findings burn`,
    },
    chapters: [
      { at: 'top', cam: cam(S[0]) },
      { at: (vh) => { const el = document.querySelector('.ckx__field') || document.querySelector('.ckp__stage'); const r = el.getBoundingClientRect(); return r.top + scrollY - vh * 0.42; }, cam: cam(S[1]), cut: 'scan' },
      { at: (vh) => { const el = document.querySelector('#ckxPv:not([hidden])') || document.querySelector('.ckp__stage'); const r = el.getBoundingClientRect(); return r.top + scrollY + r.height / 2 - vh / 2; }, cam: cam(S[2]), via: [[2, 22, 34], [0, 7, 0]], cut: 'fold' },
      { at: (vh, max) => { const f = document.querySelector('.foot'); return f ? Math.min(max, f.getBoundingClientRect().top + scrollY - vh * 0.72) : max; }, cam: cam(S[3]), via: [[-12, 30, 22], [0, 2, 0]], cut: 'warp' },
    ],
    async build(ctx) {
      const { THREE, scene, time, acc, fogU } = ctx;
      N = ctx.swarm.n;
      scene.add(new THREE.HemisphereLight(0x4a7a86, 0x05090a, 0.6));
      const key = new THREE.PointLight(0x7fe6ee, 120, 40, 1.4); key.position.set(0, 20, 6); scene.add(key);

      /* the room: a ruled floor, a wall of readout panels, a ceiling ring */
      const floorU = { ...fogU(), uAcc: { value: acc }, uTime: time, uScan: { value: 0 } };
      const floor = new THREE.Mesh(new THREE.CircleGeometry(60, 96), new THREE.ShaderMaterial({ vertexShader: FLOOR_VS, fragmentShader: FLOOR_FS, uniforms: floorU, fog: true }));
      floor.rotation.x = -Math.PI / 2; scene.add(floor);
      const wallU = { ...fogU(), uAcc: { value: acc }, uTime: time, uBusy: { value: 0 } };
      const wall = new THREE.Mesh(new THREE.CylinderGeometry(44, 44, 26, 96, 1, true), new THREE.ShaderMaterial({ vertexShader: FLOOR_VS, fragmentShader: WALL_FS, uniforms: wallU, fog: true, side: THREE.BackSide }));
      wall.position.y = 13; scene.add(wall);
      const ceil = new THREE.Mesh(new THREE.TorusGeometry(30, 0.12, 6, 128), new THREE.MeshBasicMaterial({ color: acc.clone().multiplyScalar(1.4) }));
      ceil.rotation.x = Math.PI / 2; ceil.position.y = 25; scene.add(ceil);

      /* the bed: a round plinth under the model */
      const metal = new THREE.MeshStandardMaterial({ color: 0x141b1f, metalness: 0.8, roughness: 0.35 });
      const bed = new THREE.Mesh(new THREE.CylinderGeometry(9, 9.6, 1, 64), metal); bed.position.y = 0.5; scene.add(bed);
      const bedTop = new THREE.Mesh(new THREE.CircleGeometry(8.6, 64), new THREE.MeshStandardMaterial({ color: 0x0b1316, metalness: 0.4, roughness: 0.2, emissive: acc.clone().multiplyScalar(0.05) }));
      bedTop.rotation.x = -Math.PI / 2; bedTop.position.y = 1.01; scene.add(bedTop);

      /* the gantry: a ring that rides with the sheet, emitters on it */
      const gantry = new THREE.Group();
      const gr = new THREE.Mesh(new THREE.TorusGeometry(12.5, 0.32, 10, 128), metal); gr.rotation.x = Math.PI / 2; gantry.add(gr);
      const glow = new THREE.Mesh(new THREE.TorusGeometry(12.5, 0.06, 6, 128), new THREE.MeshBasicMaterial({ color: acc.clone().multiplyScalar(2.6) }));
      glow.rotation.x = Math.PI / 2; glow.position.y = -0.34; gantry.add(glow);
      const emG = new THREE.BoxGeometry(0.9, 0.6, 1.6), emM = new THREE.MeshBasicMaterial({ color: acc.clone().multiplyScalar(3) });
      for (let i = 0; i < 6; i++) { const e = new THREE.Mesh(emG, emM); const a = (i / 6) * TAU; e.position.set(Math.cos(a) * 12.5, 0, Math.sin(a) * 12.5); e.rotation.y = -a; gantry.add(e); }
      scene.add(gantry);
      // two rails it rides on
      for (const a of [0.4, 0.4 + Math.PI]) { const r = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 24, 8), metal); r.position.set(Math.cos(a) * 12.5, 12, Math.sin(a) * 12.5); scene.add(r); }

      /* the sheet of light */
      const sheetU = { uCol: { value: acc.clone() }, uI: { value: 1 }, uTime: time };
      const sheet = new THREE.Mesh(new THREE.PlaneGeometry(25, 25), new THREE.ShaderMaterial({ vertexShader: SHEET_VS, fragmentShader: SHEET_FS, uniforms: sheetU,
        transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide }));
      sheet.renderOrder = 6; scene.add(sheet);

      /* the findings: a beam each, and a ping ring at its foot */
      const beamU = { ...fogU(), uCol: { value: new THREE.Color(...AMBER) }, uI: { value: 0 }, uTime: time };
      const beamM = new THREE.ShaderMaterial({ vertexShader: BEAM_VS, fragmentShader: BEAM_FS, uniforms: beamU, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide });
      const beamG = new THREE.CylinderGeometry(0.45, 0.9, 30, 16, 1, true); beamG.translate(0, 15, 0);
      const pingTex = canvasTex(THREE, 128, 128, drawPing, { srgb: false });
      const beams = FIND.map(() => {
        const b = new THREE.Mesh(beamG, beamM); b.renderOrder = 7; scene.add(b);
        const pm = new THREE.MeshBasicMaterial({ map: pingTex, color: new THREE.Color(...AMBER).multiplyScalar(2), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide });
        const p = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), pm); p.rotation.x = -Math.PI / 2; p.renderOrder = 8; scene.add(p);
        return { b, p, pm };
      });

      // the page's own state: the analysis running, the report shown
      const run = document.getElementById('ckxRun'), out = document.getElementById('ckxOut');
      let busy = 0, done = 0, wasRun = false, wasOut = false, poll = 0;
      Object.assign(P, { gantry, sheet, sheetU, beams, beamU, floorU, wallU, n: new THREE.Vector3() });
      ctx.swarm.u.uScanN.value = P.n;
      return {
        update(c) {
          const { k, t, dt } = c.st;
          if (++poll % 8 === 0) {
            const r = !!run && !run.hidden, o = !!out && !out.hidden;
            if (r && !wasRun) c.kick('scan');
            if (o && !wasOut) c.kick('warp');
            wasRun = r; wasOut = o;
          }
          busy = damp(busy, wasRun ? 1 : 0, 3, dt); done = damp(done, wasOut ? 1 : 0, 2, dt);
          // the sheet: vertical sweeps through the model, then (over the map) a sweep across it
          const across = sstep(2.3, 3, k);
          const speed = lerp(0.14, 0.7, busy) * (1 - done * 0.6);
          P.phase = (P.phase || 0) + dt * speed;
          const ph = 0.5 - 0.5 * Math.cos(P.phase * TAU);
          const top = lerp(lerp(7.5, 18, sstep(0.3, 1, k)), 14, sstep(1.4, 2.2, k));
          const y = lerp(1.2, top, ph);
          const x = lerp(-15, 15, ph);
          P.n.set(across, 1 - across, 0).normalize();
          c.swarm.u.uScanD.value = across > 0.5 ? x : y;
          c.swarm.u.uScanI.value = 0.8 + busy * 0.6;
          c.swarm.u.uFind.value = Math.max(done, sstep(1.5, 2.2, k) * 0.35);
          P.gantry.position.y = lerp(y, 0.6, across); P.gantry.rotation.y = t * lerp(0.05, 1.6, busy);
          P.gantry.scale.setScalar(lerp(1, 1.35, across));
          P.sheet.position.set(across > 0.5 ? x : 0, across > 0.5 ? 6 : y, across > 0.5 ? -2 : 0);
          P.sheet.rotation.set(across > 0.5 ? 0 : -Math.PI / 2, across > 0.5 ? Math.PI / 2 : 0, 0);
          P.sheet.scale.setScalar(across > 0.5 ? 1.4 : lerp(1, 1.1, sstep(0.3, 1, k)));
          P.sheetU.uI.value = (0.7 + busy * 0.8) * (1 - sstep(0.3, 0.5, across) * (1 - sstep(0.5, 0.7, across)) * 2);   // dark while it turns
          P.floorU.uScan.value = busy; P.wallU.uBusy.value = busy;
          // the findings follow the blocks they sit on (the formation's own spots)
          const f = c.st.f, cc = c.st.c, A = P.spots[cc], B = P.spots[Math.min(cc + 1, P.spots.length - 1)];
          const on = Math.max(sstep(1.4, 2.1, k), done);
          P.beamU.uI.value = on * (0.55 + 0.45 * done);
          P.beams.forEach((bm, i) => {
            const b = clamp((f - 0.2) / 0.6);
            bm.b.position.set(lerp(A[i][0], B[i][0], b), lerp(A[i][1], B[i][1], b), lerp(A[i][2], B[i][2], b));
            bm.b.scale.set(1, Math.max(on, 0.01), 1); bm.b.visible = bm.p.visible = on > 0.01;   // never a zero scale: its normals would be NaN, and bloom spreads NaN
            const ping = (t * 0.6 + i * 0.33) % 1;
            bm.p.position.copy(bm.b.position).setY(bm.b.position.y + 0.05);
            bm.p.scale.setScalar(1 + ping * 7); bm.pm.opacity = (1 - ping) * on;
          });
        },
      };
    },
  };

  /* the swarm: five layers of blocks, placed four ways */
  const lots = [];   // per block: layer, lot x, lot z, stack height
  const T = (r, g, b, w = 0) => [r, g, b, w];
  const steel = T(0.2, 0.3, 0.33), pale = T(0.32, 0.44, 0.48);
  const pos = (L, x, z, h, place) => place(L, (x - (G - 1) / 2) * 1.25, (z - (G - 1) / 2) * 1.25, h);
  const isFind = (L, x, z) => FIND.some(([fl, fx, fz]) => fl === L && Math.abs(fx - x) <= 0 && Math.abs(fz - z) <= 0);
  const PLACE = [
    (L, x, z, h) => [x * 0.75, 1.5 + L * 1.25 + h * 0.36, z * 0.75],                                       // hero: one model
    (L, x, z, h) => { const a = L * 0.18 - 0.36; return [x * Math.cos(a) - z * Math.sin(a), 2 + L * 3.3 + h * 0.5, x * Math.sin(a) + z * Math.cos(a)]; }, // describe: exploded
    (L, x, z, h) => { const a = (L - 2) * 0.5; return [Math.sin(a) * 15 + x * 0.8, 1.6 + Math.abs(L - 2) * 1.6 + h * 0.4, -Math.cos(a) * 9 + 8 + z * 0.8]; }, // preview: fanned maps
    (L, x, z, h) => { const a = (L - 2) * 0.62 - Math.PI / 2; return [Math.cos(a) * 17 + x * 0.95, 0.4 + h * 0.6, Math.sin(a) * 17 + 13 + z * 0.95]; },      // end: one map
  ];
  const SIZE = [0.84, 1.15, 0.92, 1.1];
  const forms = PLACE.map((place, ci) => () => {
    if (!lots.length) {
      const per = Math.floor(N / LAYERS);
      for (let L = 0; L < LAYERS; L++) for (let i = 0; i < per; i++) {
        // fill a layer's lots from the middle out, stacks taller in a few districts
        const lot = i % (G * G), x = lot % G, z = Math.floor(lot / G), lvl = Math.floor(i / (G * G));
        const dist = Math.hypot(x - 4 + (rnd(L, 1) - 0.5) * 3, z - 4 + (rnd(L, 2) - 0.5) * 3);
        const tall = Math.floor(1 + 2.5 * Math.exp(-dist * 0.35) + rnd(L * 100 + lot, 3) * 1.2);
        lots.push(lvl < tall ? [L, x, z, lvl] : null);
      }
      while (lots.length < N) lots.push(null);
    }
    const p = new Float32Array(N * 3), c = new Float32Array(N * 4), s = new Float32Array(N);
    lots.forEach((o, i) => {
      if (!o) { p.set([0, 1, 0], i * 3); return; }
      const [L, x, z, h] = o;
      p.set(pos(L, x, z, h, place), i * 3);
      const f = isFind(L, x, z);
      c.set(f ? T(...AMBER, ci >= 2 ? 1.1 : 0.25) : (h > 0 && rnd(i, 4) < 0.25 ? pale : steel), i * 4);
      s[i] = SIZE[ci] * (0.92 + rnd(i, 5) * 0.08);
    });
    return { p, c, s, lift: ci === 3 ? 7 : 3 };
  });
  spec.chapters.forEach((c, i) => { c.swarm = forms[i]; });
  // where the findings stand in each formation (for their beams and pings)
  P.spots = PLACE.map((place) => FIND.map(([L, x, z]) => { const q = pos(L, x, z, 0, place); return [q[0], q[1] + 0.3, q[2]]; }));
  return startDim(spec, opts);
}
