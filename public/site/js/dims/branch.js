// dims/branch.js: my-branch's dimension (2026-10-28). The page's idea was the day's sky over a small town, always the
// same hour as the page's clock (js/worlds/w-branch.js reads the colours js/story/branch.js sets on #sky). The full
// version is the place itself: the branch, a storefront with its awning, a lit sign and its own screens in the window,
// on a small square ringed by low buildings and street lamps, under a sky dome that reads the same #sky colours every
// frame. The camera walks around the square with the sun; the windows of the town and the lamps come on as the evening
// does. At each hour the swarm builds that hour's work in front of the branch, and its real screens step out of the
// window to stand beside it:
//
//   hero  a clock over the roof at eight      08:00 the week's shifts board     10:30 crates and buckets on a pallet
//   12:30 stacks of the day's cash            16:00 the fridge and a wrench     19:30 the same cash system, again
//   23:00 Z, and its receipt                  outro the storefront: my first client was me   end  the night's stars
import { startDim, TAU, clamp, lerp, sstep, rnd, aim, canvasTex, HASH } from './core.js';
import { vox, vox3, formOf, at, sdBox, seg, textMask, mixC, points, glowTex } from './story-kit.js';

const SHOTS = ['br-shifts', 'br-stock', 'br-stock-branch', 'br-cash-day', 'br-cash-history', 'br-cash-collect', 'br-cash-auto', 'br-z'].map((s) => `/site/assets/story/${s}.webp`);
const OWN = [[], [0], [1, 2], [3, 4], [], [5, 6], [7], [], []];       // each chapter's own screens
const TH = [-1.05, -0.78, -0.5, -0.22, 0.06, 0.34, 0.62, 0.9, 1.15]; // the camera's angle around the square, with the sun
const RC = 30;
const OBJ = (j) => { const a = TH[j] - 0.42; return [Math.sin(a) * 12, 0, Math.cos(a) * 12 + 2]; };   // the hour's work on the square
const GOLD = [1, 0.72, 0.3], AMBER = [0.95, 0.55, 0.2], WARM = [1, 0.85, 0.6], STEEL = [0.2, 0.21, 0.23];
const num = (s) => (s || '').match(/-?\d*\.?\d+/g)?.map(Number) || [];

/* ── shaders ── */
const SKY_VS = /* glsl */`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FS = /* glsl */`
uniform vec3 uTop, uBot, uGl, uSun; uniform float uGa, uSt, uTime;
varying vec3 vD;
${HASH}
void main(){
  vec3 d = normalize(vD);
  float h = clamp(d.y, 0.0, 1.0);
  vec3 col = mix(uBot, uTop, sqrt(h));
  float sd = max(dot(d, normalize(uSun)), 0.0);
  col += uGl * uGa * (exp(-h * 5.0) * 0.9 + sd * sd * sd * sd * 0.7);              // the low glow, toward the sun
  vec2 g = vec2(atan(d.z, d.x) * 120.0, d.y * 150.0), id = floor(g);
  float s = step(0.985, h21(id)) * smoothstep(0.08, 0.3, h) * (0.6 + 0.4 * sin(uTime * (1.0 + h21(id + 3.0) * 3.0) + h21(id) * 50.0));
  float sz = 1.0 - smoothstep(0.08, 0.32, length(fract(g) - 0.5));
  col += vec3(0.9, 0.92, 1.0) * s * sz * uSt;
  gl_FragColor = vec4(col, 1.0);
}`;
const TOWN_VS = /* glsl */`varying vec3 vW, vN, vL; attribute float aSeed; varying float vSeed;
#include <fog_pars_vertex>
void main(){ vec4 wp = modelMatrix * instanceMatrix * vec4(position, 1.0); vW = wp.xyz; vL = position; vSeed = aSeed;
  vN = normalize(mat3(modelMatrix) * mat3(instanceMatrix) * normal); vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const TOWN_FS = /* glsl */`
uniform float uNight, uDay; uniform vec3 uSunDir, uSunCol, uAmb;
varying vec3 vW, vN, vL; varying float vSeed;
#include <fog_pars_fragment>
${HASH}
void main(){
  vec3 N = normalize(vN);
  vec3 base = vec3(0.13, 0.12, 0.115) * (0.8 + vSeed * 0.4);
  vec3 col = base * (uAmb + uSunCol * max(dot(N, normalize(uSunDir)), 0.0) * uDay);
  if (abs(N.y) < 0.5) {                                                     // the walls: a grid of windows
    float u = abs(N.x) > 0.5 ? vW.z : vW.x;
    vec2 g = vec2(u / 2.2, (vW.y - 0.6) / 2.6), id = floor(g), f = fract(g);
    float win = step(0.25, f.x) * step(f.x, 0.75) * step(0.3, f.y) * step(f.y, 0.8) * step(0.6, vW.y);
    float on = step(1.0 - uNight * 0.5, h21(id + vSeed * 31.0));
    vec3 wc = mix(vec3(1.0, 0.72, 0.38), vec3(0.75, 0.85, 1.0), step(0.85, h21(id + 7.0)));
    col = mix(col, vec3(0.02, 0.025, 0.03) + uSunCol * 0.04 * uDay, win * (1.0 - on));
    col += wc * win * on * 0.85;
  }
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;

export function initDim(opts) {
  let N = 0;
  const P = {};
  const camAt = (j, r = RC, y = 6) => [Math.sin(TH[j]) * r, y, Math.cos(TH[j]) * r];
  const hourCam = (j) => { const pos = camAt(j, RC - (j % 2) * 3, 5 + (j % 3) * 1.4), o = OBJ(j);
    return { pos, tgt: aim(pos, [o[0], 7.2, o[2]], -1.5, 0), fov: 50, roll: j % 2 ? 0.02 : -0.02, pp: camAt(j, RC + 8, 7), tp: [o[0] * 0.6, 5, o[2] * 0.6] }; };
  const via = (j) => { const a = (TH[j] + TH[j + 1]) / 2; return [[Math.sin(a) * (RC + 10), 11 + (j % 2) * 4, Math.cos(a) * (RC + 10)], [0, 4, 0]]; };
  const CUTS = [null, 'scan', 'fold', 'glitch', 'warp', 'scan', 'glitch', 'ink', 'fold'];
  const SEL = ['top', ...Array.from({ length: 6 }, (_, i) => `#brHours > li:nth-child(${i + 1})`), '#br-outro', 'end'];
  const spec = {
    name: 'branch', base: '#0A0C0E', accent: '#F2B36F', ink: '#040506',
    fog: { color: 0x0c0f14, density: 0.009 }, exposure: 1.0, bloom: { strength: 0.6, radius: 0.55, threshold: 0.85 },
    intro: [0, 6, 16], parallax: 0.7,
    card: { shots: SHOTS, w: 2.2, h: 4.77, r: 0.28, n: [8, 8] },
    swarm: { n: [1200, 660], key: [0.3, 1, 0.5], keyCol: 0xfff0dc, amb: 0x2c3036 },
    chapters: SEL.map((at, j) => {
      if (j === 0) { const pos = camAt(0, 38, 9); return { at, cam: { pos, tgt: aim(pos, [0, 9, 0], 13, -1), fov: 52, pp: camAt(0, 46, 10), tp: [0, 9, 0] }, via: via(0) }; }
      if (j === 8) { const pos = camAt(8, 44, 14); return { at, cam: { pos, tgt: [-6, 22, -10], fov: 58, roll: 0.03, pp: camAt(8, 50, 12), tp: [0, 24, -10] }, cut: CUTS[j] }; }
      return { at, cam: hourCam(j), via: j < 8 ? via(j) : undefined, cut: CUTS[j] };
    }),
    async build(ctx) {
      const { THREE, scene, time, phone, aniso, fogU } = ctx;
      N = ctx.swarm.n;
      const sky = document.getElementById('sky');
      const hemi = new THREE.HemisphereLight(0x8090a8, 0x140f0a, 0.5); scene.add(hemi);
      const sunL = new THREE.DirectionalLight(0xffe0b0, 2.2); scene.add(sunL); scene.add(sunL.target);
      const shopL = new THREE.PointLight(0xffb060, 120, 26, 1.6); shopL.position.set(0, 3, 7); scene.add(shopL);

      /* the sky dome: the page clock's colours, a glow toward the sun, stars at night */
      const skyU = { uTop: { value: new THREE.Color(0x141c2c) }, uBot: { value: new THREE.Color(0x0a0c0e) }, uGl: { value: new THREE.Color(0xf2b36f) }, uGa: { value: 0.3 }, uSt: { value: 0 }, uSun: { value: new THREE.Vector3(0, 1, 0) }, uTime: time };
      const dome = new THREE.Mesh(new THREE.SphereGeometry(700, 48, 24), new THREE.ShaderMaterial({ vertexShader: SKY_VS, fragmentShader: SKY_FS, uniforms: skyU, side: THREE.BackSide, depthWrite: false, fog: false }));
      dome.renderOrder = -2; scene.add(dome);
      const sunBall = new THREE.Mesh(new THREE.SphereGeometry(14, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }));
      const moon = new THREE.Mesh(new THREE.SphereGeometry(9, 24, 16), new THREE.MeshBasicMaterial({ color: 0xffffff, fog: false }));
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex(THREE), blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, fog: false }));
      halo.scale.set(160, 160, 1); scene.add(sunBall, moon, halo);

      /* the ground: asphalt, the square's paving, a kerb ring */
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(900, 900), new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.9, metalness: 0.05 }));
      ground.rotation.x = -Math.PI / 2; scene.add(ground);
      const pave = canvasTex(THREE, 1024, 1024, (g, W) => { g.fillStyle = '#2a2724'; g.fillRect(0, 0, W, W); for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const l = 36 + rnd(x, y) * 14; g.fillStyle = `rgb(${l},${l - 3},${l - 6})`; g.fillRect(x * 64 + 2, y * 64 + 2, 60, 60); } }, { aniso, repeat: true });
      pave.repeat.set(5, 5);
      const square = new THREE.Mesh(new THREE.CircleGeometry(22, 64), new THREE.MeshStandardMaterial({ map: pave, roughness: 0.8 }));
      square.rotation.x = -Math.PI / 2; square.position.y = 0.02; scene.add(square);
      const kerb = new THREE.Mesh(new THREE.TorusGeometry(22, 0.18, 6, 96), new THREE.MeshStandardMaterial({ color: 0x3a3836, roughness: 0.7 }));
      kerb.rotation.x = Math.PI / 2; kerb.position.y = 0.05; scene.add(kerb);

      /* the branch: a storefront with a lit window, an awning and its sign, the door; its screens stand in the window */
      const shop = new THREE.Group();
      const wallM = new THREE.MeshStandardMaterial({ color: 0x2b2622, roughness: 0.75 });
      const body = new THREE.Mesh(new THREE.BoxGeometry(14, 7, 9), wallM); body.position.set(0, 3.5, -4.5); shop.add(body);
      const roof = new THREE.Mesh(new THREE.BoxGeometry(14.6, 0.5, 9.6), new THREE.MeshStandardMaterial({ color: 0x18181a, roughness: 0.6 })); roof.position.set(0, 7.2, -4.5); shop.add(roof);
      const winM = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.9, 0.62, 0.32) });
      const win = new THREE.Mesh(new THREE.PlaneGeometry(10, 3.4), winM); win.position.set(-1, 2.3, 0.02); shop.add(win);
      const door = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 3.4), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.5, 0.33, 0.18) })); door.position.set(5.3, 1.7, 0.02); shop.add(door);
      const stripes = canvasTex(THREE, 256, 64, (g, W, H) => { for (let i = 0; i < 16; i++) { g.fillStyle = i % 2 ? '#e8913c' : '#1b1712'; g.fillRect((i * W) / 16, 0, W / 16 + 1, H); } }, { aniso });
      const awn = new THREE.Mesh(new THREE.BoxGeometry(13, 0.12, 2.6), new THREE.MeshStandardMaterial({ map: stripes, roughness: 0.6 })); awn.position.set(0, 4.5, 1.1); awn.rotation.x = 0.28; shop.add(awn);
      const signTex = canvasTex(THREE, 512, 128, (g, W, H) => { g.fillStyle = '#120e0a'; g.fillRect(0, 0, W, H); g.direction = 'rtl'; g.font = '700 74px Rubik, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = '#ffd39a'; g.fillText(__t('branch.hub.title'), W / 2, H / 2 + 4); }, { aniso });
      const signM = new THREE.MeshBasicMaterial({ map: signTex, color: new THREE.Color(1, 1, 1) });
      const sign = new THREE.Mesh(new THREE.PlaneGeometry(6, 1.5), signM); sign.position.set(0, 5.9, 0.03); shop.add(sign);
      for (const x of [-3, 0.5, 3.5]) { // tables on the terrace
        const tb = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.6, 0.06, 20), new THREE.MeshStandardMaterial({ color: 0x3a3430 })); tb.position.set(x, 1.05, 3.4); shop.add(tb);
        const lg = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 1.05, 6), tb.material); lg.position.set(x, 0.52, 3.4); shop.add(lg);
      }
      scene.add(shop);

      /* the town around: low buildings, windows that switch on with the evening */
      const nb = phone ? 46 : 80;
      const bg = new THREE.BoxGeometry(1, 1, 1); bg.translate(0, 0.5, 0);
      const seeds = new Float32Array(nb);
      const townU = { ...fogU(), uNight: { value: 0 }, uDay: { value: 1 }, uSunDir: { value: new THREE.Vector3(0, 1, 0) }, uSunCol: { value: new THREE.Color(1, 0.9, 0.8) }, uAmb: { value: new THREE.Color(0.3, 0.32, 0.36) } };
      const town = new THREE.InstancedMesh(bg, new THREE.ShaderMaterial({ vertexShader: TOWN_VS, fragmentShader: TOWN_FS, uniforms: townU, fog: true }), nb);
      const m = new THREE.Matrix4(), q = new THREE.Quaternion(), up = new THREE.Vector3(0, 1, 0);
      for (let i = 0; i < nb; i++) {
        const ring = i < nb * 0.55 ? 0 : 1, a = (i / (nb * (ring ? 0.45 : 0.55))) * TAU + rnd(i, 1) * 0.08 + ring * 0.2;
        const r = (ring ? 62 : 36) + rnd(i, 2) * 9;
        const w = 7 + rnd(i, 3) * 6, h = 6 + rnd(i, 4) * (ring ? 22 : 12), d = 7 + rnd(i, 5) * 5;
        q.setFromAxisAngle(up, a + Math.PI / 2);
        town.setMatrixAt(i, m.compose(new THREE.Vector3(Math.cos(a) * r, 0, Math.sin(a) * r), q, new THREE.Vector3(w, h, d)));
        seeds[i] = rnd(i, 6);
      }
      bg.setAttribute('aSeed', new THREE.InstancedBufferAttribute(seeds, 1));
      scene.add(town);

      /* street lamps around the square */
      const lampMats = [];
      const poleM = new THREE.MeshStandardMaterial({ color: 0x222428, metalness: 0.6, roughness: 0.4 });
      const gt = glowTex(THREE);
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * TAU + 0.26, x = Math.cos(a) * 19, z = Math.sin(a) * 19;
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.12, 5, 8), poleM); pole.position.set(x, 2.5, z); scene.add(pole);
        const bulbM = new THREE.MeshBasicMaterial({ color: new THREE.Color(0.2, 0.18, 0.15) });
        const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.28, 12, 8), bulbM); bulb.position.set(x, 5.1, z); scene.add(bulb);
        const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: gt, color: 0xffc070, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0 }));
        gl.scale.set(3.4, 3.4, 1); gl.position.set(x, 5.1, z); scene.add(gl);
        lampMats.push({ bulbM, gl });
      }
      const fireflies = points(ctx, phone ? 120 : 260, (i) => { const a = rnd(i, 7) * TAU, r = 4 + rnd(i, 8) * 24; return [Math.cos(a) * r, 0.5 + rnd(i, 9) * 9, Math.sin(a) * r]; },
        () => [1, 0.75, 0.4], { size: 0.14, rise: 0.15, span: 10, tw: 0.8, i: 0 });
      scene.add(fireflies.mesh);

      const col = (s) => { const n = num(s); return n.length >= 3 ? new THREE.Color(n[0] / 255, n[1] / 255, n[2] / 255) : null; };
      Object.assign(P, { sky, skyU, townU, sunL, hemi, shopL, sunBall, moon, halo, winM, signM, lampMats, fireflies, dir: new THREE.Vector3(), c: new THREE.Color() });
      return {
        update(c) {
          const { k, t } = c.st;
          const s = P.sky?.style;
          let night = clamp((k - 4.3) / 2.2), ps = clamp((k - 0.3) / 6.4), gA = 0.3, st = night, sunO = 1 - night, moonO = night;
          if (s && s.getPropertyValue('--sa')) {   // the page's clock is the truth: read its sky
            const a = col(s.getPropertyValue('--sa')), b = col(s.getPropertyValue('--sb')), gl = num(s.getPropertyValue('--gl'));
            if (a) P.skyU.uTop.value.copy(a).convertSRGBToLinear(); if (b) P.skyU.uBot.value.copy(b).convertSRGBToLinear().multiplyScalar(1.4);
            if (gl.length >= 4) { P.skyU.uGl.value.setRGB(gl[0] / 255, gl[1] / 255, gl[2] / 255).convertSRGBToLinear(); gA = gl[3] * 2.2; }
            st = +s.getPropertyValue('--st') || 0; sunO = +(s.getPropertyValue('--sunO') || 1); moonO = +(s.getPropertyValue('--moonO') || 0);
            ps = clamp((num(s.getPropertyValue('--sx'))[0] - 8) / 84);
            night = clamp(Math.max(st, moonO));
          }
          P.skyU.uGa.value = gA; P.skyU.uSt.value = st;
          // the sun crosses the sky from the east (behind the camera's start) to the west, its colour from the glow
          const az = lerp(-1.6, 1.7, ps), el = Math.sin(Math.PI * ps) * 0.85 + 0.03;
          P.dir.set(Math.sin(az) * Math.cos(el), Math.sin(el), -Math.cos(az) * Math.cos(el) * 0.6 - 0.4).normalize();
          P.skyU.uSun.value.copy(P.dir);
          P.sunBall.position.copy(P.dir).multiplyScalar(520); P.halo.position.copy(P.sunBall.position);
          P.c.copy(P.skyU.uGl.value).lerp(new THREE.Color(1, 0.95, 0.85), 0.5);
          P.sunBall.material.color.copy(P.c).multiplyScalar(2.4 * sunO); P.halo.material.color.copy(P.c).multiplyScalar(sunO * 0.9);
          P.moon.position.set(-260, 260, -380); P.moon.material.color.setRGB(1.5, 1.55, 1.7).multiplyScalar(moonO);
          P.sunL.position.copy(P.dir).multiplyScalar(80); P.sunL.color.copy(P.c); P.sunL.intensity = 2.4 * sunO * clamp(P.dir.y * 3) + 0.4 * moonO;
          P.hemi.intensity = lerp(0.65, 0.22, night);
          P.townU.uNight.value = night; P.townU.uDay.value = sunO * clamp(P.dir.y * 3);
          P.townU.uSunDir.value.copy(P.dir); P.townU.uSunCol.value.copy(P.c); P.townU.uAmb.value.setRGB(...mixC([0.34, 0.35, 0.38], [0.08, 0.09, 0.13], night));
          c.scene.background.copy(P.skyU.uBot.value); c.scene.fog.color.copy(P.skyU.uBot.value).multiplyScalar(0.7);
          P.winM.color.setRGB(...mixC([0.55, 0.42, 0.3], [1.6, 1.05, 0.55], night));
          P.signM.color.setRGB(...mixC([0.9, 0.9, 0.9], [1.9, 1.7, 1.5], night));
          P.shopL.intensity = 40 + 140 * night;
          for (const l of P.lampMats) { l.bulbM.color.setRGB(...mixC([0.2, 0.18, 0.15], [1.5, 1.05, 0.6], night)); l.gl.material.opacity = night * 0.3; }
          P.fireflies.u.uI.value = night * 0.9;
          c.renderer.toneMappingExposure = lerp(1.0, 1.15, night) * lerp(1, 0.72, sstep(6.4, 7, k) * (1 - sstep(7.4, 8, k)));   // the outro's centred words
        },
      };
    },
  };

  /* the swarm: each hour's work on the square */
  const S = (c, g = 0) => [c[0], c[1], c[2], g];
  const faceTo = (from, cam) => Math.atan2(cam[0] - from[0], cam[2] - from[2]);
  const camOf = (j) => spec.chapters[j].cam.pos;
  const spare = (j) => (i) => { const o = OBJ(j), a = rnd(i, 51) * TAU, r = 2 + rnd(i, 52) * 5;   // loose blocks lie on the paving around it
    return { p: [o[0] + Math.cos(a) * r, 0.12, o[2] + Math.sin(a) * r], s: 0.1 + rnd(i, 53) * 0.08, c: rnd(i, 54) < 0.06 ? S(GOLD, 0.5) : S(STEEL) }; };
  const flat = (j, mask, asp, H, D, col, dy = 0) => { const v = vox(mask, N, H * asp, H, D), o = OBJ(j), half = H / 2;
    return formOf(N, v.pts, v.s, { place: at(o[0], half + 0.4 + dy, o[2], faceTo(o, camOf(j)) - 0.2), col: (i, q) => col(q[0] / half, q[1] / half, i), spare: spare(j), lift: 5 }); };
  const solid = (j, pts, s, col) => { const o = OBJ(j), yaw = faceTo(o, camOf(j)) - 0.2;
    return formOf(N, pts, s, { place: at(o[0], 0, o[2], yaw), col, spare: spare(j), lift: 5 }); };
  const coinStacks = (j, cols, ring) => { const pts = [], per = Math.floor(N / cols.length);
    cols.forEach(([x, z, h], ci) => { for (let i = 0; i < per; i++) { const lay = Math.floor(i / 12), a = ((i % 12) / 12) * TAU; if (lay * 0.32 > h) break; pts.push([x + Math.cos(a) * 0.62, 0.2 + lay * 0.32, z + Math.sin(a) * 0.62, ci]); } });
    return solid(j, pts, 0.36, (i, q) => (rnd(i, 61) < 0.3 ? S(GOLD, 1.1) : S(mixC(GOLD, AMBER, 0.4), 0.15))); };
  const ZM = { m: null };
  const forms = [
    // hero: a clock face over the roof, at eight
    () => { const v = vox((u, w) => { const r = Math.hypot(u, w), a = Math.atan2(w, u); const tick = r > 0.78 && r < 0.9 && Math.abs(((a / TAU) * 12 + 12.5) % 1 - 0.5) < 0.12;
        return (r > 0.92 && r < 1) || tick || seg(u, w, 0, 0, 0, 0.62) < 0.06 || seg(u, w, 0, 0, -0.42 * 0.866, -0.42 * 0.5) < 0.07 || r < 0.08; }, N, 9, 9, 0.8);
      return formOf(N, v.pts, v.s, { place: at(0, 13.5, -1, faceTo([0, 0, 0], camOf(0))), col: (i, q) => (Math.hypot(q[0], q[1]) > 4.1 ? S(WARM, 1.3) : S(GOLD, 1.0)), lift: 5, spare: spare(0) }); },
    // 08:00 the week's shifts: a board of seven days, the shifts as bars
    () => flat(1, (u, v) => { const b = sdBox(u, v, 1.5, 0.95, 0.05); if (b > 0) return false; if (b > -0.06 || v > 0.7) return true;
        const col = Math.floor((u + 1.44) / (2.88 / 7)), fx = ((u + 1.44) / (2.88 / 7)) % 1; if (fx < 0.08) return true;
        const row = Math.floor((0.7 - v) / 0.32), fy = ((0.7 - v) / 0.32) % 1; return fy > 0.25 && fy < 0.75 && rnd(col, row + 20) > 0.35 && fx > 0.15 && fx < 0.9; },
      1.6, 6.2, 0.6, (u, v, i) => { const b = sdBox(u, v, 1.5, 0.95, 0.05); return b > -0.06 || v > 0.7 ? S(STEEL, 0.05) : sdBox(u, v, 1.4, 0.9) < 0 && ((u + 1.44) / (2.88 / 7)) % 1 > 0.12 ? S(rnd(Math.floor((u + 1.44) / 0.41), 3) < 0.5 ? GOLD : [0.4, 0.75, 0.55], 1.1) : S(STEEL); }),
    // 10:30 stock: crates on a pallet, buckets beside it
    () => { const v = vox3((x, y, z) => { const crate = (cx, cy, cz) => Math.abs(x - cx) < 0.3 && Math.abs(y - cy) < 0.3 && Math.abs(z - cz) < 0.3;
        const bucket = (cx, cz) => Math.hypot((x - cx) / 0.16, (z - cz) / 0.2) < 1 && y < -0.35;
        return y < -0.85 || crate(-0.55, -0.5, -0.3) || crate(0.1, -0.5, -0.3) || crate(-0.25, 0.15, -0.3) || crate(-0.55, -0.5, 0.35) || crate(0.75, -0.5, 0.4) || bucket(0.6, -0.5) || bucket(0.88, -0.1); }, N, 7, 5.5, 5);
      return solid(2, v.pts.map((q) => [q[0], q[1] + 2.75, q[2]]), v.s, (i, q) => (q[1] < 0.6 ? S([0.35, 0.25, 0.15]) : rnd(i, 71) < 0.08 ? S(GOLD, 1) : S([0.42, 0.3, 0.18], 0.05))); },
    // 12:30 cash: the day's stacks, rising like a chart
    () => coinStacks(3, [[-3, 0, 1.5], [-1.8, -0.4, 2.4], [-0.6, 0.1, 3.2], [0.6, -0.3, 2.8], [1.8, 0.2, 4], [3, -0.2, 5]]),
    // 16:00 repairs: the fridge (its door, its handle) and a wrench
    () => flat(4, (u, v) => { const fr = sdBox(u + 0.35, v, 0.48, 0.98, 0.06) < 0 && !(Math.abs(v - 0.3) < 0.025);
        const wr = seg(u, v, 0.45, -0.75, 0.95, 0.35) < 0.07 || (Math.hypot(u - 0.97, v - 0.45) < 0.17 && Math.hypot(u - 1.05, v - 0.55) > 0.09); return fr || wr; },
      1.15, 7.6, 1.6, (u, v, i) => { if (Math.abs(u + 0.02) < 0.05 && v > -0.25 && v < 0.2) return S(WARM, 1.2); if (u > 0.3) return S([0.6, 0.62, 0.66], 0.15);
        return rnd(i, 81) < 0.05 ? S([0.9, 0.3, 0.2], 1.4) : S([0.55, 0.57, 0.6]); }),
    // 19:30 cash again: the same system, the stacks in a ring now
    () => coinStacks(5, Array.from({ length: 8 }, (_, n) => [Math.cos((n / 8) * TAU) * 2.6, Math.sin((n / 8) * TAU) * 2.6, 2.5 + (n % 3) * 1.2])),
    // 23:00 Z: the letter, and the receipt running out of it
    () => { ZM.m ||= textMask('Z', { w: 256, h: 256, font: '800 230px Archivo, sans-serif' });
      return flat(6, (u, v) => (u < 0.2 && ZM.m.mask((u + 0.45) * 1.15, v * 1.05)) || (u > 0.55 && u < 1.05 && v < 0.9 && v > -1 && (((v + 1) * 8) % 1 < 0.6 || u < 0.62 || u > 0.98)),
        1.1, 8, 1.0, (u, v, i) => (u > 0.5 ? S([0.85, 0.85, 0.8], 0.25) : S(GOLD, 1.2))); },
    // outro: the storefront, as a sign: my first client was me
    () => flat(7, (u, v) => { const roof = v > 0.45 && v < 0.62 && Math.abs(u) < 1.15; const aw = v > 0.2 && v <= 0.45 && Math.abs(u) < 1.1 && ((u + 1.1) * 5) % 1 < 0.5;
        const wall = v <= 0.2 && v > -0.95 && Math.abs(u) < 1.0 && !(sdBox(u + 0.25, v + 0.3, 0.5, 0.35) < 0) && !(sdBox(u - 0.62, v + 0.5, 0.18, 0.45) < 0); return roof || aw || wall || v <= -0.95; },
      1.15, 7, 1.0, (u, v, i) => (v > 0.2 && v <= 0.45 ? S(AMBER, 1.1) : S([0.3, 0.27, 0.24], rnd(i, 91) < 0.05 ? 0.8 : 0))),
    // the end: the blocks rise into the night as stars
    () => formOf(N, [], 0, { spare: (i) => { const a = rnd(i, 95) * TAU, r = 20 + rnd(i, 96) * 60, e = 14 + rnd(i, 97) * 40;
      return { p: [Math.cos(a) * r, e, Math.sin(a) * r - 20], s: 0.12 + rnd(i, 98) * 0.14, c: S([0.85, 0.88, 1], rnd(i, 99) < 0.6 ? 1.6 : 0.4) }; }, lift: 10 }),
  ];
  spec.chapters.forEach((c, i) => { c.swarm = forms[i]; });

  /* the cards: the branch's real screens live in its window; at their hour they step out beside the work */
  const inWindow = (i, o) => { o.p.set(-5.2 + i * 1.25, 2.35, 0.25); o.q.identity(); o.s = 0.42; o.f = 1; o.lift = 1; o.focus = 0.15; };
  const cards = Array.from({ length: 9 }, (_, j) => (i, t, o, ctx) => {
    inWindow(i, o);
    const own = OWN[j].indexOf(i);
    if (own < 0) { if (j === 8) { o.f = 0.6; } return; }
    const ob = OBJ(j), cam = ctx.camPos[j], d = [cam.x - ob[0], cam.z - ob[2]], l = Math.hypot(d[0], d[1]) || 1;
    const side = [-d[1] / l, d[0] / l];   // beside the work, toward the reading side's far edge
    o.p.set(ob[0] - side[0] * (4.2 + own * 2.6) + (d[0] / l) * 1.5, 3 + Math.sin(t * 0.8 + i) * 0.08, ob[2] - side[1] * (4.2 + own * 2.6) + (d[1] / l) * 1.5);
    ctx.face(o, cam); o.s = 0.85; o.focus = 1; o.lift = 2.5;
  });
  spec.chapters.forEach((c, i) => { c.cards = cards[i]; });
  return startDim(spec, opts);
}
