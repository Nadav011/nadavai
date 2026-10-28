// dims/contact.js: the contact page's dimension (2026-10-28). The page's idea was a warm dark room with WhatsApp-green
// ripples going out like messages (js/worlds/w-contact.js); the full version is a place to arrive at: a calm, warm
// evening plaza of dark stone, low amber lamps along a path, and one line of WhatsApp-green light running down the
// path to a doorway at its end, a tall frame open onto warm light. The swarm is the messages: soft bubbles that drift,
// fall into line along the light, build the arch of the door, and pass through it. Ripples of the green spread on the
// stone around the door, slow, like messages going out.
//
//   hero    the bubbles drift in the evening air, the door far down the path
//   grid    they fall into line over the green light and flow toward the door (WhatsApp first)
//   form    they settle into the arch around the doorway: the place your message arrives
//   end     the door: the bubbles pass through and rise beyond it as soft lights
//
// The DOM stays the page (the form and the WhatsApp links are untouched); core.js runs the camera, the swarm, the cuts
// and every fallback.
import { startDim, sstep, rnd, canvasTex, FOG_ADD, HASH } from './core.js';

const ACC = '#25D366';
const DOOR = { x: -7, z: -128, w: 7, h: 13 };
const LINE_X = -2.6;

const SKY_VS = /* glsl */`varying vec3 vD; void main(){ vD = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
const SKY_FS = /* glsl */`
varying vec3 vD;
void main(){
  float y = vD.y;
  vec3 col = mix(vec3(0.16, 0.075, 0.035), vec3(0.018, 0.012, 0.012), smoothstep(-0.02, 0.35, y));
  col += vec3(0.2, 0.09, 0.03) * exp(-abs(y) * 14.0) * 0.6;
  gl_FragColor = vec4(col, 1.0);
}`;
const STONE_VS = /* glsl */`varying vec3 vW; varying vec2 vUv;
#include <fog_pars_vertex>
void main(){ vUv = uv; vec4 wp = modelMatrix * vec4(position, 1.0); vW = wp.xyz; vec4 mvPosition = viewMatrix * wp; gl_Position = projectionMatrix * mvPosition;
  #include <fog_vertex>
}`;
const STONE_FS = /* glsl */`
uniform vec3 uAcc; uniform float uTime; uniform vec2 uDoor; uniform float uOpen;
varying vec3 vW; varying vec2 vUv;
#include <fog_pars_fragment>
${HASH}
void main(){
  // large stone slabs, a warm sheen toward the door
  vec2 g = vW.xz / vec2(3.2, 3.2); vec2 c = floor(g), f = fract(g);
  float seam = smoothstep(0.0, 0.03, f.x) * smoothstep(1.0, 0.97, f.x) * smoothstep(0.0, 0.03, f.y) * smoothstep(1.0, 0.97, f.y);
  float tone = 0.75 + 0.5 * h21(c);
  vec3 col = vec3(0.04, 0.03, 0.026) * tone * (0.55 + 0.45 * seam);
  float dd = length(vW.xz - uDoor);
  col += vec3(0.5, 0.26, 0.1) * exp(-dd * 0.05) * 0.09 * (0.6 + 0.4 * uOpen);       // the door's warm spill
  // the green ripples around the door, slow
  float r = dd * 0.22 - uTime * 0.18;
  float w = 0.5 + 0.5 * cos(6.2831853 * r); w = w * w * w * w * w;
  col += uAcc * w * exp(-dd * 0.045) * 0.16 * step(2.0, dd);
  gl_FragColor = vec4(col, 1.0);
  #include <fog_fragment>
}`;
const LINE_FS = /* glsl */`
uniform vec3 uAcc; uniform float uTime; uniform float uFlow; varying vec3 vW; varying vec2 vUv;
#include <fog_pars_fragment>
void main(){
  float across = exp(-(((vUv.x - 0.5) * 7.0) * ((vUv.x - 0.5) * 7.0)));
  float pulse = pow(0.5 + 0.5 * sin(vW.z * 0.35 + uTime * (2.0 + 4.0 * uFlow)), 8.0);
  gl_FragColor = vec4(uAcc * across * (0.7 + 1.6 * pulse), 1.0);
  ${FOG_ADD}
}`;
const DOOR_FS = /* glsl */`
uniform float uOpen; uniform vec3 uAcc; varying vec2 vUv; varying vec3 vW;
#include <fog_pars_fragment>
void main(){
  vec2 c = vUv - vec2(0.5, 0.35);
  float core = exp(-dot(c * vec2(1.6, 1.0), c * vec2(1.6, 1.0)) * 4.0);
  vec3 col = mix(vec3(1.0, 0.62, 0.3), vec3(1.0, 0.9, 0.75), core) * (0.5 + 0.9 * core);
  col += uAcc * 0.25 * smoothstep(0.42, 0.5, max(abs(vUv.x - 0.5), abs(vUv.y - 0.5) * 0.9));
  gl_FragColor = vec4(col * (0.38 + 0.4 * uOpen), 1.0);
}`;

function drawGlow(g, W, H) {
  const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W / 2);
  gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.2, 'rgba(255,200,140,.45)'); gr.addColorStop(1, 'rgba(255,150,80,0)');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
}

export function initDim(opts) {
  let N = 0;
  const P = {};
  const end = (vh, max) => { const f = document.querySelector('.foot'); return f ? Math.min(max, f.getBoundingClientRect().top + scrollY - vh * 0.7) : max; };
  const spec = {
    name: 'contact', base: '#0B0806', accent: ACC, ink: '#060403',
    fog: { color: 0x120a06, density: 0.0115 }, exposure: 1.0, bloom: { strength: 0.6, radius: 0.6, threshold: 0.82 },
    intro: [0, 0.6, 14], parallax: 0.7,
    swarm: {
      n: [520, 300], key: [0.2, 1, 0.6], keyCol: 0xffd0a0, amb: 0x3a2a22,
      geo: (THREE) => {   // a chat bubble with its tail, a little thick
        const s = new THREE.Shape(), w = 0.8, h = 0.5, r = 0.22;
        s.moveTo(-w + r, -h); s.lineTo(w - 0.3, -h); s.lineTo(w, -h - 0.22); s.lineTo(w - 0.02, -h + r * 0.4);
        s.quadraticCurveTo(w, -h, w, -h + r); s.lineTo(w, h - r); s.quadraticCurveTo(w, h, w - r, h); s.lineTo(-w + r, h);
        s.quadraticCurveTo(-w, h, -w, h - r); s.lineTo(-w, -h + r); s.quadraticCurveTo(-w, -h, -w + r, -h);
        const g = new THREE.ExtrudeGeometry(s, { depth: 0.16, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.04, bevelSegments: 2, curveSegments: 5 });
        g.center(); return g;
      },
    },
    chapters: [
      { at: 'top', cam: { pos: [3.2, 2.3, 34], tgt: [-1, 4.6, -40], fov: 50, pp: [1, 2.6, 40], tp: [-5, 5, -40] } },
      { at: '.ct__grid', cam: { pos: [2.2, 3.4, -6], tgt: [-5, 4.6, -80], fov: 50, pp: [0.5, 3.6, 2], tp: [-6, 5, -80] }, via: [[4, 4.5, 14], [-3, 4.6, -60]], cut: 'ink' },
      { at: '#form', cam: { pos: [3.5, 4.4, -84], tgt: [-1.5, 7, -128], fov: 52, pp: [0.5, 5, -76], tp: [-6, 7, -128] }, via: [[5, 6, -46], [-4, 6, -110]], cut: 'warp' },
      { at: end, cam: { pos: [-2, 5.2, -100], tgt: [1, 7.4, -150], fov: 54, pp: [-5, 5.6, -96], tp: [-7, 7.2, -150] }, via: [[-1, 5.5, -100], [-6, 7, -135]], cut: 'fold' },
    ],
    async build(ctx) {
      const { THREE, scene, time, acc, fogU, phone } = ctx;
      N = ctx.swarm.n;
      const sky = new THREE.Mesh(new THREE.SphereGeometry(800, 32, 16), new THREE.ShaderMaterial({ vertexShader: SKY_VS, fragmentShader: SKY_FS, side: THREE.BackSide, depthWrite: false, fog: false }));
      sky.renderOrder = -10; scene.add(sky);
      scene.add(new THREE.HemisphereLight(0x6a4a34, 0x0a0604, 0.55));
      const doorL = new THREE.PointLight(0xffa860, 900, 90, 1.5); doorL.position.set(DOOR.x, 6, DOOR.z + 5); scene.add(doorL);

      /* the plaza: stone, with the door's spill and the green ripples */
      const stoneU = { ...fogU(), uAcc: { value: acc }, uTime: time, uDoor: { value: new THREE.Vector2(DOOR.x, DOOR.z) }, uOpen: { value: 0 } };
      const ground = new THREE.Mesh(new THREE.PlaneGeometry(400, 400), new THREE.ShaderMaterial({ vertexShader: STONE_VS, fragmentShader: STONE_FS, uniforms: stoneU, fog: true }));
      ground.rotation.x = -Math.PI / 2; ground.position.z = -60; scene.add(ground);

      /* the line of light down the path to the door */
      const len = 40 - DOOR.z;
      const lineU = { ...fogU(), uAcc: { value: acc }, uTime: time, uFlow: { value: 0 } };
      const line = new THREE.Mesh(new THREE.PlaneGeometry(0.5, len), new THREE.ShaderMaterial({ vertexShader: STONE_VS, fragmentShader: LINE_FS, uniforms: lineU, fog: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
      line.rotation.x = -Math.PI / 2; line.position.set(LINE_X, 0.02, 40 - len / 2);
      scene.add(line);
      // the last stretch bends over to the doorway
      const turnLen = Math.hypot(DOOR.x - LINE_X, 8);
      const turn = new THREE.Mesh(new THREE.PlaneGeometry(0.5, turnLen), line.material);
      turn.rotation.x = -Math.PI / 2; turn.rotation.z = -Math.atan2(DOOR.x - LINE_X, 8); turn.position.set((LINE_X + DOOR.x) / 2, 0.025, DOOR.z + 4); scene.add(turn);

      /* low lamps along the path */
      const glowTex = canvasTex(THREE, 128, 128, drawGlow, { srgb: false });
      const postM = new THREE.MeshStandardMaterial({ color: 0x1c1410, roughness: 0.6, metalness: 0.5 });
      const lampM = new THREE.MeshBasicMaterial({ color: new THREE.Color(4, 2.4, 1.2) });
      for (let z = 26; z > DOOR.z + 10; z -= 13) for (const x of [-8.5, 5.5]) {
        const post = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 1.1, 8), postM); post.position.set(x, 0.55, z); scene.add(post);
        const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.18, 12), lampM); lamp.position.set(x, 1.15, z); scene.add(lamp);
        const gl = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffb070, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.55 }));
        gl.scale.set(3.4, 3.4, 1); gl.position.set(x, 1.15, z); scene.add(gl);
      }

      /* the door: a tall frame of dark stone on two steps, open onto warm light */
      const stoneM = new THREE.MeshStandardMaterial({ color: 0x241a14, roughness: 0.75, metalness: 0.1 });
      const door = new THREE.Group();
      const jambG = new THREE.BoxGeometry(1.4, DOOR.h + 1.4, 2.2);
      for (const sx of [-1, 1]) { const j = new THREE.Mesh(jambG, stoneM); j.position.set(sx * (DOOR.w / 2 + 0.7), (DOOR.h + 1.4) / 2, 0); door.add(j); }
      const lintel = new THREE.Mesh(new THREE.BoxGeometry(DOOR.w + 2.8, 1.4, 2.2), stoneM); lintel.position.y = DOOR.h + 0.7; door.add(lintel);
      for (let s = 0; s < 2; s++) { const st = new THREE.Mesh(new THREE.BoxGeometry(DOOR.w + 7 - s * 2.4, 0.35, 5 - s * 1.6), stoneM); st.position.set(0, 0.175 + s * 0.35, 1.2 - s * 0.4); door.add(st); }
      const doorU = { ...fogU(), uOpen: { value: 0 }, uAcc: { value: acc } };
      const light = new THREE.Mesh(new THREE.PlaneGeometry(DOOR.w, DOOR.h), new THREE.ShaderMaterial({ vertexShader: STONE_VS, fragmentShader: DOOR_FS, uniforms: doorU, fog: false }));
      light.position.set(0, DOOR.h / 2 + 0.7, -0.2); door.add(light);
      // the green rim around the opening
      const rimM = new THREE.MeshBasicMaterial({ color: acc.clone().multiplyScalar(2) });
      for (const [w, h, x, y] of [[0.08, DOOR.h, -DOOR.w / 2, DOOR.h / 2 + 0.7], [0.08, DOOR.h, DOOR.w / 2, DOOR.h / 2 + 0.7], [DOOR.w, 0.08, 0, DOOR.h + 0.7]]) {
        const r = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.08), rimM); r.position.set(x, y, 1.12); door.add(r);
      }
      const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0xffa060, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true, opacity: 0.4, fog: false }));
      halo.scale.set(26, 26, 1); halo.position.set(0, DOOR.h / 2 + 1, -1); door.add(halo);
      door.position.set(DOOR.x, 0, DOOR.z); scene.add(door);
      // low walls either side of the door, the plaza's end
      for (const sx of [-1, 1]) { const w = new THREE.Mesh(new THREE.BoxGeometry(60, 3.2, 1.4), stoneM); w.position.set(DOOR.x + sx * (DOOR.w / 2 + 31.4), 1.6, DOOR.z); scene.add(w); }
      // far hills, a dark silhouette against the last of the evening
      {
        const pos = [], idx = [], segs = 120;
        for (let i = 0; i <= segs; i++) { const x = -500 + (i / segs) * 1000, h = 30 + 26 * Math.abs(Math.sin(i * 0.21) * Math.sin(i * 0.07 + 1)); pos.push(x, -1, -460, x, h, -460); if (i < segs) { const b = i * 2; idx.push(b, b + 2, b + 1, b + 1, b + 2, b + 3); } }
        const g = new THREE.BufferGeometry(); g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3)); g.setIndex(idx);
        scene.add(new THREE.Mesh(g, new THREE.MeshBasicMaterial({ color: 0x0b0605, fog: false })));
      }
      Object.assign(P, { stoneU, lineU, doorU, doorL, phone });
      return {
        update(c) {
          const { k } = c.st;
          const open = sstep(1.6, 3, k);
          P.stoneU.uOpen.value = open; P.doorU.uOpen.value = open;
          P.lineU.uFlow.value = sstep(0.4, 1.2, k) * (1 - sstep(2.5, 3, k) * 0.5);
          P.doorL.intensity = 700 + 900 * open;
        },
      };
    },
  };

  /* the messages: four ways */
  const green = [0.08, 0.5, 0.25, 0.25], pale = [0.62, 0.58, 0.52, 0.05], gold = [1, 0.66, 0.36, 0.9];
  const form = (fn, lift = 2.5) => () => {
    const p = new Float32Array(N * 3), c = new Float32Array(N * 4), s = new Float32Array(N);
    for (let i = 0; i < N; i++) { const o = fn(i); p.set(o.p, i * 3); c.set(o.c || (rnd(i, 3) < 0.55 ? green : pale), i * 4); s[i] = o.s ?? 1; }
    return { p, c, s, lift };
  };
  const forms = [
    // hero: drifting in the evening air along the first stretch of the path
    form((i) => ({ p: [-4 - rnd(i, 1) * 24, 8 + rnd(i, 2) * 9, 2 - rnd(i, 4) * 70], s: 0.7 + rnd(i, 5) * 0.5 })),
    // grid: in line over the light, a stream toward the door
    form((i) => { const z = -16 - (i / N) * 106, w = Math.sin(i * 0.9) * 0.5; return { p: [LINE_X + w + (i % 2 ? 0.9 : -0.9), 1.2 + (i % 3) * 0.95 + Math.sin(z * 0.2) * 0.3, z], s: 0.62 }; }, 2),
    // form: the arch around the doorway, built of messages
    form((i) => {
      const a = (i / N) * Math.PI, R = DOOR.w / 2 + 3.2 + (i % 4) * 1.15;
      const x = DOOR.x - Math.cos(a) * R, y = DOOR.h * 0.62 + Math.sin(a) * (R + 1.6);
      const leg = i % 5 === 0;   // some stand as the jambs
      return leg ? { p: [DOOR.x + (i % 10 === 0 ? -1 : 1) * (DOOR.w / 2 + 2.8 + rnd(i, 6) * 2), rnd(i, 7) * DOOR.h * 0.62, DOOR.z + 2.4], s: 0.75 }
        : { p: [x, y, DOOR.z + 2.4 + (i % 4) * 0.2], s: 0.75, c: rnd(i, 8) < 0.12 ? gold : undefined };
    }, 4),
    // end: through the door, rising beyond as soft lights
    form((i) => ({ p: [DOOR.x + (rnd(i, 1) - 0.5) * 34, 4 + rnd(i, 2) * 24, DOOR.z - 14 - rnd(i, 3) * 60], s: 0.55, c: rnd(i, 9) < 0.5 ? gold : [0.2, 0.9, 0.45, 0.6] }), 6),
  ];
  spec.chapters.forEach((c, i) => { c.swarm = forms[i]; });
  return startDim(spec, opts);
}
