// hero-gl.js — the v3 hero particle moment (?v=a|b|c) on top of the approved hero.
//
// The DOM wordmark stays the layout source and the accessible name (its glyphs are transparent
// under html.pfx). index.html publishes window.__wmGeo: the rest rect, font and transform origin
// of each half, and per frame the same translate/scale it applies to the halves, plus the portal
// edges. Every particle belongs to one half and is moved by exactly that transform, so the
// particles ride the split the way the text did.
//
// Variants live in hero-a.js (code glyphs), hero-b.js (agent network), hero-c.js (app-screen tiles)
// and only the requested one loads. No WebGL2, reduced motion, a failed build or a lost context:
// html.pfx is removed and the approved text hero is back.

import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js';
import { detectGpu, shortGpuName } from './kit/gpu-profile.js';
import { createFrameLoop } from './kit/frame-loop.js';
import { createGovernor } from './kit/quality.js';
import { createGpuTimer } from './kit/gpu-timer.js';
import { handleContextLoss } from './kit/lifecycle.js';

const root = document.documentElement;
const q = new URLSearchParams(location.search);
const INTRO_S = 2.6; // the variants assemble inside this window (≈ 2.2–2.4 s)

export const HALF_GLSL = /* glsl */ `
uniform vec2 uRes;
uniform vec4 uHalf0, uHalf1;     // origin xy, translate x, scale
uniform vec2 uLeft;              // 1 when that half sits on the left of the seam
uniform vec2 uEdge;              // portal edges L, R (stage px)
uniform vec3 uPtr;               // pointer xy (stage px), strength 0..1
uniform float uIntro, uTime, uA, uB, uDpr, uGx, uMorph;
vec2 halfX(vec2 p, float h){ vec4 H = h < 0.5 ? uHalf0 : uHalf1; return H.xy + (p - H.xy) * H.w + vec2(H.z, 0.0); }
float leftOf(float h){ return h < 0.5 ? uLeft.x : uLeft.y; }
vec4 clipOf(vec2 p){ return vec4(p.x / uRes.x * 2.0 - 1.0, 1.0 - p.y / uRes.y * 2.0, 0.0, 1.0); }
float hash1(float n){ return fract(sin(n) * 43758.5453123); }
`;

function fail(canvas) {
  root.classList.remove('pfx');
  canvas?.remove();
  document.dispatchEvent(new CustomEvent('cloud:fail'));
}

function waitGeo() {
  return new Promise((res) => {
    if (window.__wmGeo?.words) return res(window.__wmGeo);
    document.addEventListener('wm:geo', () => res(window.__wmGeo), { once: true });
  });
}

const STRETCH = { '50%': 'ultra-condensed', '62.5%': 'extra-condensed', '75%': 'condensed', '87.5%': 'semi-condensed', '100%': 'normal', '112.5%': 'semi-expanded', '125%': 'expanded', '150%': 'extra-expanded', '200%': 'ultra-expanded' };
function setFont(g, f, k) {
  g.font = `${f.weight} ${f.size * k}px ${f.family}`;
  try { g.fontStretch = STRETCH[f.stretch] || (/^[a-z-]+$/.test(f.stretch) ? f.stretch : 'normal'); } catch { /* old canvas */ }
  try { g.letterSpacing = `${f.spacing * k}px`; } catch { /* old canvas */ }
}

/**
 * Rasterize the two words where the DOM put them. Returns a sampler over stage px:
 *   word(x, y) → 0 | 1 | -1, edge(x, y) → bool, letters[w] → [{x0, x1}] (stage px).
 */
export function wordMask(geo, k = 1, face = null) {
  const W = Math.ceil(geo.W * k), H = Math.ceil(geo.H * k);
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const g = c.getContext('2d', { willReadFrequently: true });
  const letters = [];
  let toneData = null;
  // face: draw this stencil instead of the words, centred and split down the middle (the head target of the scroll)
  if (face) {
    const t = Math.min(...geo.words.map((w) => w.t)), b = Math.max(...geo.words.map((w) => w.b));
    const fh = (b - t) * 1.55, fw = fh * (face.width / face.height);
    const cx = geo.W / 2, fx = cx - fw / 2, fy = b - fh; // centred on the screen, split down its middle
    g.drawImage(face, fx * k, fy * k, fw * k, fh * k);
    if (face.tone) { // the tone map at the same place, read by tone(x, y)
      const tc = document.createElement('canvas'); tc.width = W; tc.height = H;
      tc.getContext('2d').drawImage(face.tone, fx * k, fy * k, fw * k, fh * k);
      toneData = tc.getContext('2d').getImageData(0, 0, W, H).data;
    }
    // colour the stencil by half: left of the gap is word 0, right of it word 1
    g.globalCompositeOperation = 'source-atop'; // paint on the stencil only, keep the other half
    g.fillStyle = '#f00'; g.fillRect(0, 0, cx * k, H);
    g.fillStyle = '#0f0'; g.fillRect(cx * k, 0, W - cx * k, H);
    g.globalCompositeOperation = 'source-over';
    // the glyphs are placed inside these boxes: each half of the head is one box
    letters.push([{ x0: fx, x1: cx, t: fy, b: fy + fh }], [{ x0: cx, x1: fx + fw, t: fy, b: fy + fh }]);
  }
  geo.words.forEach((w, i) => {
    if (face) return;
    setFont(g, w.font, k);
    g.fillStyle = i === 0 ? '#f00' : '#0f0';
    g.textBaseline = 'alphabetic'; g.textAlign = 'left';
    const m = g.measureText(w.text);
    const asc = m.fontBoundingBoxAscent ?? m.actualBoundingBoxAscent, desc = m.fontBoundingBoxDescent ?? m.actualBoundingBoxDescent;
    const h = (w.b - w.t) * k;
    const base = w.t * k + (h - (asc + desc)) / 2 + asc;
    g.fillText(w.text, w.l * k, base);
    const ls = [];
    const chars = [...w.text];
    for (let j = 0; j < chars.length; j++) {
      const a = g.measureText(chars.slice(0, j).join('')).width, b = g.measureText(chars.slice(0, j + 1).join('')).width;
      ls.push({ x0: w.l + a / k, x1: w.l + (b - w.font.spacing * k) / k, t: w.t, b: w.b });
    }
    letters.push(ls);
  });
  const d = g.getImageData(0, 0, W, H).data;
  const word = (x, y) => {
    const X = Math.floor(x * k), Y = Math.floor(y * k);
    if (X < 0 || Y < 0 || X >= W || Y >= H) return -1;
    const o = (Y * W + X) * 4;
    return d[o] > 127 ? 0 : d[o + 1] > 127 ? 1 : -1;
  };
  const e = 1.6;
  const edge = (x, y) => word(x, y) >= 0 && (word(x + e, y) < 0 || word(x - e, y) < 0 || word(x, y + e) < 0 || word(x, y - e) < 0);
  // bounding box of the ink, for samplers
  let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
  geo.words.forEach((w) => { x0 = Math.min(x0, w.l); x1 = Math.max(x1, w.r); y0 = Math.min(y0, w.t); y1 = Math.max(y1, w.b); });
  if (face) letters.flat().forEach((r) => { x0 = Math.min(x0, r.x0); x1 = Math.max(x1, r.x1); y0 = Math.min(y0, r.t); y1 = Math.max(y1, r.b); });
  const tone = (x, y) => {
    if (!toneData) return 1;
    const X = Math.floor(x * k), Y = Math.floor(y * k);
    return X < 0 || Y < 0 || X >= W || Y >= H ? 0 : toneData[(Y * W + X) * 4] / 255;
  };
  return { word, edge, tone, letters, canvas: c, box: { x0: x0 - 4, x1: x1 + 4, y0: y0 - 4, y1: y1 + 4 } };
}

export function rng(seed) {
  let s = seed | 0;
  return () => { s = (s + 0x6d2b79f5) | 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

// the head target of the scroll (Nadav, 2026-10-27: "the man from the letters, improved"): the code that wrote
// NADAV AI redraws the avatar's head and shoulders as a portrait in glyphs. The stencil is the whole figure;
// alongside it a tone map, so each glyph takes the brightness of its spot: a light face and shirt, dark aviators,
// hair and beard, and a bright outline that holds the shape.
async function faceStencil() {
  const img = new Image(); img.src = new URL('../assets/avatar/spritesheet@2x.webp', import.meta.url).href;
  await img.decode();
  const CW = 384, CH = 416, cell = document.createElement('canvas'); cell.width = CW; cell.height = CH;
  const cg = cell.getContext('2d', { willReadFrequently: true }); cg.drawImage(img, 0, 0, CW, CH, 0, 0, CW, CH);
  const d = cg.getImageData(0, 0, CW, CH).data;
  let x0 = CW, x1 = 0, y0 = CH, y1 = 0;
  for (let y = 0; y < CH; y++) for (let x = 0; x < CW; x++) if (d[(y * CW + x) * 4 + 3] > 40) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
  const hh = Math.round((y1 - y0) * 0.44); // the head, the shoulders and the top of the shirt
  // the full width of the figure: the avatar's head is as wide as its shoulders
  const hx0 = Math.max(0, x0 - 4), hw = Math.min(CW - hx0, x1 - x0 + 9);
  const out = document.createElement('canvas'); out.width = hw; out.height = hh;
  const tone = document.createElement('canvas'); tone.width = hw; tone.height = hh;
  const id = out.getContext('2d').createImageData(hw, hh), td = tone.getContext('2d').createImageData(hw, hh);
  const A = (x, y) => (x < 0 || y < 0 || x >= CW || y >= CH ? 0 : d[(y * CW + x) * 4 + 3]);
  for (let y = 0; y < hh; y++) for (let x = 0; x < hw; x++) {
    const sx = hx0 + x, sy = y0 + y, o = (sy * CW + sx) * 4, a = d[o + 3];
    if (a < 40) continue;
    const l = (0.299 * d[o] + 0.587 * d[o + 1] + 0.114 * d[o + 2]) / 255;
    const edge = [[-4, 0], [4, 0], [0, -4], [0, 4]].some(([dx, dy]) => A(sx + dx, sy + dy) < 40);
    // contrast: the aviators sink, the hair and the beard keep a texture, the face and the shirt come up; the outline is bright
    const v = edge ? 0.95 : Math.min(1, Math.max(0, (l - 0.07) / 0.66)) ** 0.75; // hair keeps a texture, the aviators stay darkest
    const p = (y * hw + x) * 4;
    id.data[p] = id.data[p + 1] = id.data[p + 2] = 255; id.data[p + 3] = 255;
    td.data[p] = td.data[p + 1] = td.data[p + 2] = Math.round(v * 255); td.data[p + 3] = 255;
  }
  out.getContext('2d').putImageData(id, 0, 0); tone.getContext('2d').putImageData(td, 0, 0);
  out.tone = tone;
  return out;
}

async function boot() {
  const geo0 = await waitGeo();
  let head = null; try { head = await faceStencil(); } catch { /* no head: the letters stay through the scroll */ }
  const v = root.dataset.v || 'a';
  const stage = document.getElementById('stage');
  const canvas = document.createElement('canvas');
  canvas.className = 'pfx-canvas'; canvas.setAttribute('aria-hidden', 'true');
  stage.querySelector('.wm-wrap').before(canvas);

  let renderer;
  try {
    if (q.get('gl') === '2d') throw new Error('2d requested'); // review link: the fallback below, on a WebGL machine
    // ask quietly first: three.js logs console errors when it fails to make a context
    if (!document.createElement('canvas').getContext('webgl2')) throw new Error('no WebGL2');
    const solid = v === 'c' || v === 'd' || v === 'cloud'; // 3D blocks need depth and edge AA
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, premultipliedAlpha: true, antialias: solid, depth: solid, stencil: false, powerPreference: 'high-performance' });
  } catch {
    // no WebGL here: the same code hero on a 2D canvas (hero-2d.js) instead of the plain text name
    const c2 = document.createElement('canvas'); c2.className = 'pfx-canvas'; c2.setAttribute('aria-hidden', 'true');
    canvas.replaceWith(c2);
    try {
      const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
      const { boot2d } = await import('./hero-2d.js');
      await boot2d({ geo0, head, wordMask, rng, stage, canvas: c2, INTRO_S, fine, mobile: !fine && Math.min(innerWidth, innerHeight) < 820 });
    } catch (e) { console.info('[hero-gl] 2d fallback unavailable, text hero kept', e); fail(c2); }
    return;
  }
  renderer.setClearColor(0x000000, 0);
  renderer.debug.checkShaderErrors = /^(localhost|127\.0\.0\.1)$/.test(location.hostname);
  const scene = new THREE.Scene(), cam = new THREE.Camera();

  const profile = detectGpu();
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const mobile = profile.mobile || (!fine && Math.min(innerWidth, innerHeight) < 820);

  const U = {
    uRes: { value: new THREE.Vector2(1, 1) }, uHalf0: { value: new THREE.Vector4() }, uHalf1: { value: new THREE.Vector4() },
    uLeft: { value: new THREE.Vector2() }, uEdge: { value: new THREE.Vector2() }, uPtr: { value: new THREE.Vector3() },
    uIntro: { value: 0 }, uTime: { value: 0 }, uA: { value: 0 }, uB: { value: 0 }, uMorph: { value: 0 }, uDpr: { value: 1 }, uGx: { value: 0 },
    uInk: { value: new THREE.Color('#EDE7DC') }, uAcc: { value: new THREE.Color('#E8913C') },
  };
  // authored as sRGB triplets, output untouched (no colorspace chunk), like the DOM colours
  U.uInk.value.setRGB(0xED / 255, 0xE7 / 255, 0xDC / 255);
  U.uAcc.value.setRGB(0xE8 / 255, 0x91 / 255, 0x3C / 255);
  // review looks (css/looks.css): --lk-ink / --lk-acc retint the code glyphs; unset (look A) keeps the triplets above
  const lookTint = () => {
    const cs = getComputedStyle(root), hex = (n) => /^#[0-9a-f]{6}$/i.test(cs.getPropertyValue(n).trim()) ? cs.getPropertyValue(n).trim() : null;
    const set = (c, h, d) => (h ? c.setRGB(parseInt(h.slice(1, 3), 16) / 255, parseInt(h.slice(3, 5), 16) / 255, parseInt(h.slice(5, 7), 16) / 255) : c.setRGB(...d));
    set(U.uInk.value, hex('--lk-ink'), [0xED / 255, 0xE7 / 255, 0xDC / 255]);
    set(U.uAcc.value, hex('--lk-acc'), [0xE8 / 255, 0x91 / 255, 0x3C / 255]);
  };
  if (window.__look && window.__look.id !== 'a') { lookTint(); window.__look.ready.then(lookTint); }
  document.addEventListener('look:change', () => { lookTint(); try { loop?.invalidate(); } catch { /* not started yet */ } });

  const mod = await import(`./hero-${v}.js`);
  let inst = null, t0 = 0, introDone = (window.__wmGeo.a || 0) > 0.02;

  async function build(geo) {
    const old = inst;
    const next = await mod.create({ THREE, renderer, scene, U, geo, mobile, fine, profile, mask: wordMask(geo, 1), faceMask: head ? wordMask(geo, 1, head) : null, HALF_GLSL, rng, stage });
    old?.objects.forEach((o) => scene.remove(o)); old?.dispose();
    inst = next;
    inst.objects.forEach((o) => { o.frustumCulled = false; scene.add(o); });
  }
  try { await build(geo0); } catch (e) { console.info('[hero-gl] build failed, text hero kept', e); fail(canvas); renderer.dispose(); return; }

  // ---------- size, quality ----------
  let W = 1, H = 1, dpr = 1, levelFps = 60, idle = false;
  function size() {
    W = stage.clientWidth; H = stage.clientHeight;
    renderer.setPixelRatio(dpr); renderer.setSize(W, H, false);
    U.uRes.value.set(W, H); U.uDpr.value = dpr;
  }
  const dev = Math.min(devicePixelRatio || 1, 2);
  const levels = [];
  for (const d of [dev, Math.min(dev, 1.5), Math.min(dev, 1.25), 1]) if (!levels.some((l) => l.dpr === d)) levels.push({ name: `dpr ${d}`, dpr: d, cost: d * d });
  levels.push({ ...levels[levels.length - 1], name: 'dpr 1 @30', fps: 30 });
  let loop = null;
  const governor = createGovernor({
    levels, start: profile.tier === 'low' ? levels.length - 2 : 0, targetFps: 60, persistKey: 'nadavai.hero3.quality', gpuKey: profile.renderer,
    locked: !!(profile.overrides.tier || profile.overrides.dpr),
    apply: (l) => { dpr = l.dpr; levelFps = l.fps || 60; size(); loop?.setFps(idle ? Math.min(30, levelFps) : levelFps); loop?.invalidate(); },
  });

  // ---------- pointer ----------
  const ptr = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: 0, s: 0 };
  let lastInput = performance.now();
  const onMove = (e) => {
    const r = stage.getBoundingClientRect();
    ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.on = 1;
    if (ptr.sx < -999) { ptr.sx = ptr.x; ptr.sy = ptr.y; }
    lastInput = performance.now(); wake();
  };
  const onLeave = () => { ptr.on = 0; };
  if (fine) { addEventListener('pointermove', onMove, { passive: true }); root.addEventListener('pointerleave', onLeave); }
  const onScroll = () => { lastInput = performance.now(); wake(); };
  addEventListener('scroll', onScroll, { passive: true });

  // ---------- frame ----------
  const stats = { n: 0, sum: 0, long: 0, all: [] };
  function frame({ dt }) {
    const G = window.__wmGeo;
    const now = performance.now();
    if (!t0) t0 = now;
    U.uTime.value += dt;
    U.uIntro.value = introDone ? 99 : (now - t0) / 1000;
    if (U.uIntro.value > INTRO_S + 0.4) introDone = true;
    const w = G.words;
    U.uHalf0.value.set(w[0].ox, w[0].oy, G.tx[0], G.grow);
    U.uHalf1.value.set(w[1].ox, w[1].oy, G.tx[1], G.grow);
    U.uLeft.value.set(w[0].left ? 1 : 0, w[1].left ? 1 : 0);
    U.uEdge.value.set(G.L, G.R); U.uGx.value = G.gx;
    U.uA.value = G.a; U.uB.value = G.b; U.uMorph.value = G.m || 0;
    // pointer: damped follow + eased strength (no field once the portal opens)
    const k = 1 - Math.exp(-dt * 14);
    ptr.sx += (ptr.x - ptr.sx) * k; ptr.sy += (ptr.y - ptr.sy) * k;
    const target = ptr.on && G.a < 0.05 && now - lastInput < 4000 ? 1 : 0;
    ptr.s += (target - ptr.s) * (1 - Math.exp(-dt * 6));
    U.uPtr.value.set(ptr.sx, ptr.sy, ptr.s);
    inst.update?.(dt, U, ptr);
    renderer.render(scene, inst.camera || cam);
    const SC = window.__siteCloud;
    const gone = G.b > 0.999 && !(SC && SC.wants());
    const isIdle = introDone && now - lastInput > 3500;
    if (isIdle !== idle) { idle = isIdle; loop.setFps(idle ? Math.min(30, levelFps) : levelFps); }
    return !gone; // demand loop: sleeps at full bleed, scroll wakes it
  }

  const timer = createGpuTimer(renderer);
  let hud = null, hudT = 0;
  if (q.has('debug')) {
    hud = document.createElement('pre');
    hud.setAttribute('aria-hidden', 'true');
    hud.style.cssText = 'position:fixed;inset-inline-start:8px;bottom:56px;z-index:200;margin:0;padding:6px 9px;border-radius:6px;background:rgba(8,10,12,.82);color:#EDE7DC;font:11px/1.45 ui-monospace,Menlo,monospace;pointer-events:none;white-space:pre;direction:ltr';
    document.body.appendChild(hud);
  }
  loop = createFrameLoop({
    fps: 60, mode: 'demand', observe: canvas,
    render(f) { timer.poll(); timer.begin(); let again; try { again = frame(f); } finally { timer.end(); } return again; },
    onFrame(s) {
      if (s.interval && !s.stall && !idle) {
        stats.n++; stats.sum += s.interval; if (s.interval > 25) stats.long++; if (stats.all.length < 20000) stats.all.push(s.interval);
        governor.sample({ interval: s.interval, cpuMs: s.cpuMs, gpuMs: timer.ms, stall: s.stall });
      }
      if (hud && s.now - hudT > 300) { hudT = s.now; const r = report(); hud.textContent = `v${v} ${r.fps} fps  p95 ${r.p95ms} ms  gpu ${r.gpuMs ?? '–'} ms\n${r.count} particles  ${governor.level.name}  tier ${profile.tier}${mobile ? ' (mobile)' : ''}\n${shortGpuName(profile.renderer)}`; }
    },
  });
  function wake() { if (idle) { idle = false; loop.setFps(levelFps); } loop.invalidate(); }

  function report() {
    const a = stats.all, srt = [...a].sort((x, y) => x - y);
    return {
      variant: v, fps: stats.n ? Math.round(10000 * stats.n / stats.sum) / 10 : 0, frames: stats.n, over25ms: stats.long,
      p95ms: srt.length ? Math.round(srt[Math.floor(srt.length * 0.95)] * 10) / 10 : 0, gpuMs: timer.ms != null ? Math.round(timer.ms * 100) / 100 : null,
      count: inst?.count ?? 0, level: governor.level.name, dpr, tier: profile.tier, mobile, gpu: profile.renderer,
    };
  }

  const unLoss = handleContextLoss(renderer, {
    loop,
    onLost: () => { root.classList.remove('pfx'); document.dispatchEvent(new CustomEvent('cloud:fail')); },
    onRestored: () => { root.classList.add('pfx'); inst?.restore?.(); loop.invalidate(); document.dispatchEvent(new CustomEvent('cloud:ready')); },
  });

  // geometry changes (resize, ScrollTrigger refresh): rebuild targets, no second intro
  let rb = 0;
  const geoKey = (G) => [G.W, G.H, ...G.words.flatMap((w) => [w.l, w.t, w.r, w.b, w.font.size])].map((v) => Math.round(v)).join(',');
  let lastGeo = geoKey(geo0);
  document.addEventListener('wm:geo', () => {
    const k = geoKey(window.__wmGeo); if (k === lastGeo) return; // a refresh with nothing moved: keep the build (and its loading cards)
    lastGeo = k;
    clearTimeout(rb);
    rb = setTimeout(async () => { introDone = introDone || U.uIntro.value > 0.5; try { await build(window.__wmGeo); size(); wake(); } catch { fail(canvas); } }, 120);
  });

  governor.init();
  size();
  renderer.compile(scene, inst.camera || cam);
  loop.start();
  requestAnimationFrame(() => governor.markReady());

  // site-v1: the canvas can leave the hero for the page's cloud layer (and come back), same context
  const home = () => stage.querySelector('.wm-wrap');
  function mount(target) {
    if (target && canvas.parentNode !== target) target.appendChild(canvas);
    else if (!target && canvas.parentNode !== stage) stage.insertBefore(canvas, home());
    wake();
  }
  window.__heroGL = {
    mount, wake,
    report, resetStats() { stats.n = stats.sum = stats.long = 0; stats.all.length = 0; }, governor, canvas,
    dispose() {
      loop.dispose(); unLoss(); timer.dispose?.(); hud?.remove();
      removeEventListener('pointermove', onMove); root.removeEventListener('pointerleave', onLeave); removeEventListener('scroll', onScroll);
      inst?.dispose(); renderer.dispose(); renderer.forceContextLoss?.(); fail(canvas);
    },
  };
  document.dispatchEvent(new CustomEvent('cloud:ready')); // after __heroGL is set
}

if (root.classList.contains('pfx')) {
  if (q.has('align')) { const s = document.createElement('style'); s.textContent = 'html.pfx .wm{color:rgba(255,40,40,.55)!important;-webkit-text-fill-color:rgba(255,40,40,.55)!important}'; document.head.appendChild(s); }
  boot().catch((e) => { console.info('[hero-gl] text hero kept', e); fail(document.querySelector('.pfx-canvas')); });
}
