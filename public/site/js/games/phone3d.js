// phone3d.js: the hero's 3D phone, the same build as hero-v2/journey.js (extruded body, glass, camera
// bump, the app's real screens on the glass with the RTL push between them). It rises in, floats, leans
// toward the pointer, turns a little as the hero scrolls away, and a tap pushes the next screen.
// The optimize-three kit runs it: one capped loop that sleeps off-screen and a governor on pixel ratio.

import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createFrameLoop } from '../../hero/kit/frame-loop.js';
import { createGovernor } from '../../hero/kit/quality.js';
import { detectGpu } from '../../hero/kit/gpu-profile.js';
import { handleContextLoss } from '../../hero/kit/lifecycle.js';

const ease = (t) => 1 - Math.pow(1 - t, 4);
const damp = (a, b, l, dt) => a + (b - a) * (1 - Math.exp(-l * dt));

export async function mountPhone(stage, { shots, video, accent, hero }) {
  const canvas = document.createElement('canvas');
  canvas.className = 'wkh__gl'; canvas.setAttribute('aria-hidden', 'true');
  stage.prepend(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  pmrem.dispose();
  const rim = new THREE.DirectionalLight(new THREE.Color(accent), 2.2); rim.position.set(-3, 2, -2); scene.add(rim);
  const key = new THREE.DirectionalLight(0xffffff, 0.9); key.position.set(2, 3, 4); scene.add(key);

  const camera = new THREE.PerspectiveCamera(24, 1, 0.1, 40);
  camera.position.set(0, 0, 4.9);

  /* textures */
  const loader = new THREE.TextureLoader();
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const load = (url) => new Promise((res, rej) => loader.load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = aniso; res(t); }, undefined, rej));
  const ar = (t) => { const im = t?.image; const w = im?.videoWidth || im?.width, h = im?.videoHeight || im?.height; return w && h ? w / h : 0.46; };
  const tex = await Promise.all(shots.slice(0, 1).map(load));
  const later = shots.slice(1).map((s, i) => load(s).then((t) => { tex[i + 1] = t; renderer.initTexture(t); }).catch(() => {}));

  let vid = null;
  if (video) {
    vid = document.createElement('video');
    Object.assign(vid, { muted: true, playsInline: true, loop: true, preload: 'auto', crossOrigin: 'anonymous' });
    vid.setAttribute('muted', ''); vid.setAttribute('playsinline', '');
    vid.src = video;
    vid.addEventListener('loadeddata', () => {
      const vt = new THREE.VideoTexture(vid); vt.colorSpace = THREE.SRGBColorSpace; vt.generateMipmaps = false; vt.minFilter = THREE.LinearFilter;
      tex.unshift(vt); later.length = 0; show(0, true);
    }, { once: true });
    vid.play().catch(() => {});
  }

  /* the phone (journey.js proportions) */
  const PW = 0.74, PH = 1.52, PD = 0.082, PR = 0.118, BV = 0.02;
  const SW = PW - 0.05, SH = PH - 0.05, SR = PR - 0.026;
  const rr = (w, h, r) => {
    const s = new THREE.Shape(), x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y); s.lineTo(x + w - r, y); s.absarc(x + w - r, y + r, r, -Math.PI / 2, 0, false);
    s.lineTo(x + w, y + h - r); s.absarc(x + w - r, y + h - r, r, 0, Math.PI / 2, false);
    s.lineTo(x + r, y + h); s.absarc(x + r, y + h - r, r, Math.PI / 2, Math.PI, false);
    s.lineTo(x, y + r); s.absarc(x + r, y + r, r, Math.PI, Math.PI * 1.5, false);
    return s;
  };
  const flatUv = (g, w, h) => { const p = g.attributes.position, uv = g.attributes.uv; for (let i = 0; i < p.count; i++) uv.setXY(i, p.getX(i) / w + 0.5, p.getY(i) / h + 0.5); uv.needsUpdate = true; return g; };
  const frameMat = new THREE.MeshPhysicalMaterial({ color: 0x7b7f86, metalness: 1, roughness: 0.3, clearcoat: 0.5, clearcoatRoughness: 0.18 });
  const glassMat = new THREE.MeshPhysicalMaterial({ color: 0x050506, metalness: 0, roughness: 0.06, clearcoat: 1, clearcoatRoughness: 0.03 });
  const backMat = new THREE.MeshPhysicalMaterial({ color: 0x1d2025, metalness: 0.55, roughness: 0.2, clearcoat: 1, clearcoatRoughness: 0.06 });
  backMat.color.lerp(new THREE.Color(accent), 0.08);
  const lensMat = new THREE.MeshPhysicalMaterial({ color: 0x07080b, metalness: 0.2, roughness: 0.04, clearcoat: 1 });
  const bodyGeo = new THREE.ExtrudeGeometry(rr(PW - 2 * BV, PH - 2 * BV, PR - BV), { depth: PD - 2 * BV, bevelEnabled: true, bevelThickness: BV, bevelSize: BV, bevelSegments: 8, curveSegments: 40 });
  bodyGeo.translate(0, 0, -(PD - 2 * BV) / 2);
  const body = new THREE.Mesh(bodyGeo, frameMat);
  const front = new THREE.Mesh(new THREE.ShapeGeometry(rr(PW - 0.014, PH - 0.014, PR - 0.007), 40), glassMat); front.position.z = PD / 2 + 0.0008;
  const back = new THREE.Mesh(new THREE.ShapeGeometry(rr(PW - 0.014, PH - 0.014, PR - 0.007), 40), backMat); back.rotation.y = Math.PI; back.position.z = -PD / 2 - 0.0008;

  const U = {
    tA: { value: tex[0] }, tB: { value: tex[0] }, aA: { value: ar(tex[0]) }, aB: { value: ar(tex[0]) },
    uMix: { value: 0 }, uGlare: { value: 0 }, uSA: { value: SW / SH }, uSize: { value: new THREE.Vector2(SW, SH) },
  };
  const screenMat = new THREE.ShaderMaterial({
    uniforms: U,
    vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
    fragmentShader: /* glsl */`
      precision highp float;
      uniform sampler2D tA, tB; uniform float aA, aB, uMix, uGlare, uSA; uniform vec2 uSize;
      varying vec2 vUv;
      vec2 cover(vec2 uv, float ta){ if (ta > uSA) uv.x = 0.5 + (uv.x-0.5)*uSA/ta; else uv.y = 1.0 - (1.0-uv.y)*ta/uSA; return uv; }
      float box(vec2 p, vec2 b, float r){ vec2 q = abs(p)-b+r; return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r; }
      void main(){
        vec2 uv = vUv; float t = uMix; vec3 col;
        if (uv.x < t) col = texture2D(tB, cover(vec2(uv.x + 1.0 - t, uv.y), aB)).rgb;
        else { col = texture2D(tA, cover(vec2(uv.x - t*0.3, uv.y), aA)).rgb * (1.0 - 0.45*t); col *= 1.0 - 0.5*exp(-(uv.x - t)*40.0)*step(0.001, t); }
        vec2 pw = (uv - 0.5)*uSize;
        float isl = box(pw - vec2(0.0, uSize.y*0.5 - 0.042), vec2(0.088, 0.023), 0.023);
        col = mix(vec3(0.0), col, smoothstep(0.0, 0.003, isl));
        float band = exp(-pow((uv.x*0.7 + uv.y*0.55 - 0.66 - uGlare)*4.2, 2.0));
        col += vec3(0.85, 0.92, 1.0) * band * 0.03;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
  });
  const screen = new THREE.Mesh(flatUv(new THREE.ShapeGeometry(rr(SW, SH, SR), 40), SW, SH), screenMat); screen.position.z = PD / 2 + 0.0016;
  const cam = new THREE.Group();
  cam.add(new THREE.Mesh(new THREE.ExtrudeGeometry(rr(0.29, 0.29, 0.075), { depth: 0.008, bevelEnabled: true, bevelThickness: 0.005, bevelSize: 0.005, bevelSegments: 4, curveSegments: 20 }), backMat));
  const lensGeo = new THREE.CylinderGeometry(0.052, 0.052, 0.02, 48); lensGeo.rotateX(Math.PI / 2);
  const ringGeo = new THREE.TorusGeometry(0.056, 0.007, 12, 48);
  [[-0.062, 0.062], [-0.062, -0.062], [0.064, 0]].forEach(([x, y]) => {
    const l = new THREE.Mesh(lensGeo, lensMat); l.position.set(x, y, 0.018); cam.add(l);
    const r = new THREE.Mesh(ringGeo, frameMat); r.position.set(x, y, 0.024); cam.add(r);
  });
  cam.rotation.y = Math.PI; cam.position.set(PW / 2 - 0.195, PH / 2 - 0.195, -PD / 2 - 0.004);
  const btnGeo = new THREE.BoxGeometry(0.012, 1, 0.026);
  const buttons = [[-1, 0.36, 0.11], [-1, 0.2, 0.11], [1, 0.26, 0.2]].map(([s, y, len]) => { const b = new THREE.Mesh(btnGeo, frameMat); b.scale.y = len; b.position.set(s * (PW / 2 + 0.003), y, 0); return b; });
  const model = new THREE.Group(); model.add(body, front, back, screen, cam, ...buttons);
  const rig = new THREE.Group(); rig.add(model); scene.add(rig);

  /* screens: push the next one every few seconds, or on tap */
  let shown = 0, mix = -1, nextAt = 0;
  function show(i, instant = false) {
    const t = tex[i]; if (!t) return false;
    if (instant) { U.tA.value = t; U.aA.value = ar(t); U.uMix.value = 0; mix = -1; shown = i; return true; }
    U.tB.value = t; U.aB.value = ar(t); mix = 0; shown = i; return true;
  }
  const advance = () => { if (mix >= 0 || tex.length < 2) return; const n = (shown + 1) % tex.length; if (!show(n)) return; };

  /* size + governor (pixel ratio only: the ladder changes cost, never the look) */
  const profile = detectGpu();
  const top = Math.min(devicePixelRatio || 1, 2);
  const levels = [top, Math.min(top, 1.5), Math.min(top, 1.25), 1, 0.85].filter((v, i, a) => a.indexOf(v) === i).map((dpr) => ({ name: `dpr${dpr}`, dpr }));
  let W = 1, H = 1, dpr = levels[0].dpr;
  const resize = () => {
    const r = canvas.getBoundingClientRect(); W = Math.max(1, r.width); H = Math.max(1, r.height);
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // keep the phone the same height in every layout; pull back on narrow stages so it never clips
    const fitH = PH / 0.78, fitW = PW / 0.5 / camera.aspect;
    camera.position.z = Math.max(fitH, fitW) / (2 * Math.tan(THREE.MathUtils.degToRad(12)));
    camera.updateProjectionMatrix();
  };
  const governor = createGovernor({
    levels, start: profile.tier === 'low' ? Math.min(levels.length - 1, 2) : 0, targetFps: 60, persistKey: 'nadavai.work.phone', gpuKey: profile.renderer,
    apply: (l) => { dpr = l.dpr; resize(); },
  });
  governor.init();
  new ResizeObserver(resize).observe(canvas);

  /* motion */
  const ptr = { x: 0, y: 0, tx: 0, ty: 0 };
  const fine = matchMedia('(hover: hover)').matches;
  const onMove = (e) => { const r = hero.getBoundingClientRect(); ptr.tx = (e.clientX - r.left) / r.width * 2 - 1; ptr.ty = (e.clientY - r.top) / r.height * 2 - 1; loop.setFps(60); idleAt = performance.now() + 3000; };
  if (fine) hero.addEventListener('pointermove', onMove, { passive: true });
  canvas.addEventListener('click', () => { advance(); nextAt = performance.now() + 5200; });
  let scrollP = 0;
  const onScroll = () => { const r = hero.getBoundingClientRect(); scrollP = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height))); };
  addEventListener('scroll', onScroll, { passive: true });

  const t0 = performance.now();
  let idleAt = t0 + 4000, spinY = 0;
  const REST_Y = getComputedStyle(document.documentElement).direction === 'rtl' ? 0.32 : -0.32;
  let ready = false;
  const loop = createFrameLoop({
    observe: stage, fps: 60,
    onFrame: (s) => governor.sample({ interval: s.interval, cpuMs: s.cpuMs, stall: s.stall }),
    render: ({ now, dt }) => {
      const t = (now - t0) / 1000;
      const intro = ease(Math.min(1, t / 1.8));
      ptr.x = damp(ptr.x, ptr.tx, 4, dt); ptr.y = damp(ptr.y, ptr.ty, 4, dt);
      if (!nextAt) nextAt = now + 3400;
      if (now > nextAt && mix < 0) { advance(); nextAt = now + 3400; }
      if (mix >= 0) { mix = Math.min(1, mix + dt / 0.75); U.uMix.value = ease(mix); if (mix >= 1) { U.tA.value = U.tB.value; U.aA.value = U.aB.value; U.uMix.value = 0; mix = -1; } }
      spinY = (1 - intro) * -2.4;                                   // it turns in from its back
      rig.rotation.set(
        (1 - intro) * 0.35 + ptr.y * 0.12 + scrollP * 0.25,
        REST_Y + spinY + ptr.x * 0.28 + scrollP * 0.5,
        (1 - intro) * 0.12 + Math.sin(t * 0.6) * 0.02,
      );
      rig.position.y = (1 - intro) * -0.5 + Math.sin(t * 0.9) * 0.025 + scrollP * 0.35;
      U.uGlare.value = -0.25 + ptr.x * 0.18 + Math.sin(t * 0.4) * 0.08 + rig.rotation.y * 0.2;
      renderer.render(scene, camera);
      if (!ready) { ready = true; stage.classList.add('is-gl'); requestAnimationFrame(() => governor.markReady()); }
      if (now > idleAt && intro >= 1 && mix < 0) loop.setFps(30);
    },
  });
  const unLoss = handleContextLoss(renderer, { loop, onLost: () => stage.classList.remove('is-gl'), onRestored: () => loop.invalidate() });
  resize(); show(0, true); loop.start();
  await Promise.all(later);
  return { governor, loop, dispose() { loop.dispose(); unLoss?.(); renderer.dispose(); canvas.remove(); vid?.pause(); } };
}
