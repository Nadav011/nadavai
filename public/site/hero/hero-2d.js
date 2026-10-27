// hero-2d.js: the code hero without WebGL (Nadav, 2026-10-27: "on the site you don't see what's in the video").
// Browsers with no WebGL at all (some locked-down or GPU-less ones) used to get the plain text name. This draws the
// same glyph points (hero-a.js samplePoints) on a 2D canvas: the stream-in from the reading start, the cursor
// field, the head portrait on scroll with its light and shade, the split through the portal, the drifters. A stand-in
// for the card engine (spots inside the letters) lets zoom.js open the same screens from the name.
// Draw cost is one sprite per glyph, so it only redraws when something moves (intro, scroll, cursor), plus a slow
// re-roll at rest.

import { samplePoints, GLYPHS } from './hero-a.js';
import { createZoom } from './zoom.js';
import { CARDS } from './hero-cloud.js';

const root = document.documentElement;
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
const INK = [237, 231, 220], ACC = [232, 145, 60];

// one sprite sheet per colour: white glyphs tinted once, so a frame is only drawImage calls
function sheets(px) {
  const C = 8, Rw = Math.ceil(GLYPHS.length / C), S = Math.ceil(px);
  const make = ([r, g, b]) => {
    const c = document.createElement('canvas'); c.width = C * S; c.height = Rw * S;
    const x = c.getContext('2d');
    x.fillStyle = `rgb(${r},${g},${b})`; x.textAlign = 'center'; x.textBaseline = 'middle';
    GLYPHS.forEach((s, i) => {
      const he = /[א-ת]/.test(s);
      const f = he ? S * 0.7 : s.length > 1 ? S * (s.length > 2 ? 0.36 : 0.46) : S * 0.66;
      x.font = he ? `700 ${f}px Rubik, "Arial Hebrew", sans-serif` : `700 ${f}px ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace`;
      x.fillText(s, (i % C) * S + S / 2, Math.floor(i / C) * S + S / 2 + (he ? S * 0.03 : 0));
    });
    return c;
  };
  return { ink: make(INK), acc: make(ACC), S, C };
}

export async function boot2d({ geo0, head, wordMask, rng, stage, canvas, INTRO_S, mobile, fine }) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('no 2d canvas');
  const U = { uIntro: { value: 0 } }; // what zoom.js reads
  let P = null, mask = null, sh = null, eng = null, zoom = null;
  let W = 1, H = 1, dpr = 1, t0 = 0, introDone = (window.__wmGeo.a || 0) > 0.02, time = 0;

  function build(geo) {
    mask = wordMask(geo, 1);
    P = samplePoints({ geo, mobile, mask, faceMask: head ? wordMask(geo, 1, head) : null, rng });
    sh = sheets(64);
    eng = stubEngine(mask);
    if (!zoom) {
      zoom = createZoom({ stage, eng, cards: CARDS, U, fine, mobile });
      window.__cloud = { formShape() {}, focusCard: zoom.focusCard, peek: (id) => zoom.focusCard(id, { mode: 'peek' }), close: zoom.close, cards: CARDS.map((c) => c.id) };
    }
  }
  // the card engine's role for zoom.js: spots inside the letters, each standing for one screen
  function stubEngine(m) {
    const blocks = [];
    let k = 0;
    m.letters.forEach((ls) => ls.forEach((l) => {
      const w = l.x1 - l.x0, h = l.b - l.t, cols = 2, rows = 3, bw = w / cols, bh = h / rows;
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const x = l.x0 + c * bw, y = l.t + r * bh;
        if (m.word(x + bw / 2, y + bh / 2) < 0) continue; // only spots that sit on the letter's ink
        blocks.push({ x, y, w: bw, h: bh, card: k++ % CARDS.length });
      }
    }));
    return {
      blocks,
      rectOf: (i) => { const b = blocks[i]; return { x: b.x, y: b.y, w: b.w, h: b.h }; },
      slotsOf: (card) => blocks.map((b, i) => (b.card === card ? i : -1)).filter((i) => i >= 0),
      hit: (x, y) => (m.word(x, y) < 0 ? -1 : blocks.findIndex((b) => x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h)),
      hide() {}, show() {},
    };
  }
  build(geo0);

  function size() {
    W = stage.clientWidth; H = stage.clientHeight;
    dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = `${W}px`; canvas.style.height = `${H}px`;
  }
  size();

  // pointer, as the WebGL layer has it: a damped follow and an eased strength
  const ptr = { x: -9999, y: -9999, sx: -9999, sy: -9999, on: 0, s: 0 };
  let lastInput = performance.now(), dirty = true;
  const onMove = (e) => { const r = stage.getBoundingClientRect(); ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top; ptr.on = 1; if (ptr.sx < -999) { ptr.sx = ptr.x; ptr.sy = ptr.y; } lastInput = performance.now(); dirty = true; };
  if (fine) addEventListener('pointermove', onMove, { passive: true });
  const onScroll = () => { lastInput = performance.now(); dirty = true; };
  addEventListener('scroll', onScroll, { passive: true });

  let lastT = 0, lastDraw = 0, lastGeoT = -1, raf = 0, alive = true;
  function frame(now) {
    if (!alive) return;
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, lastT ? (now - lastT) / 1000 : 0.016); lastT = now;
    if (!t0) t0 = now;
    time += dt;
    U.uIntro.value = introDone ? 99 : (now - t0) / 1000;
    if (U.uIntro.value > INTRO_S + 0.4) { if (!introDone) dirty = true; introDone = true; }
    const G = window.__wmGeo;
    const k = 1 - Math.exp(-dt * 14);
    ptr.sx += (ptr.x - ptr.sx) * k; ptr.sy += (ptr.y - ptr.sy) * k;
    const target = ptr.on && G.a < 0.05 && now - lastInput < 4000 ? 1 : 0;
    const ps = ptr.s; ptr.s += (target - ptr.s) * (1 - Math.exp(-dt * 6));
    zoom?.update(dt);
    const moving = !introDone || G.t !== lastGeoT || Math.abs(ptr.s - ps) > 0.001 || (ptr.s > 0.01 && Math.abs(ptr.x - ptr.sx) + Math.abs(ptr.y - ptr.sy) > 0.5)
      || (G.a > 0.03 && G.b < 0.999) // the drifters keep falling while the portal is open
      || ((G.m || 0) > 0.8 && G.b < 0.999); // and the light keeps crossing the portrait
    // at rest a quiet re-roll every half second; the whole layer sleeps once the portrait fills the screen
    if (G.b >= 0.999 && lastDraw && !dirty && G.t === lastGeoT) return;
    if (!moving && !dirty && now - lastDraw < 500) return;
    lastGeoT = G.t; dirty = false; lastDraw = now;
    draw(G);
  }

  function draw(G) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    if (G.b >= 0.999) return;
    const { T, Hh, R, Gi, E, F, HF, FT, FG, n, cell, headK } = P;
    const w = G.words, intro = U.uIntro.value, m = G.m || 0;
    const half = [w[0], w[1]].map((x, i) => ({ ox: x.ox, oy: x.oy, tx: G.tx[i], g: G.grow, left: x.left }));
    const S = sh.S, C = sh.C, base = cell * 1.95;
    const epoch = Math.floor(time * 2);
    for (let i = 0; i < n; i++) {
      const rx = R[i * 4], ry = R[i * 4 + 1], rz = R[i * 4 + 2], rw = R[i * 4 + 3];
      const tx = T[i * 2], ty = T[i * 2 + 1];
      const delay = (1 - clamp(tx / W, 0, 1)) * 0.75 + rx * 0.45;
      const t = clamp((intro - delay) / 1.05, 0, 1), e = 1 - (1 - t) ** 4;
      let mk = clamp(m * 1.35 - ry * 0.35, 0, 1); mk = mk * mk * (3 - 2 * mk);
      const fly = Math.sin(Math.PI * mk);
      const gx = tx + (F[i * 2] - tx) * mk, gy = ty + (F[i * 2 + 1] - ty) * mk;
      const fx = W + 24 + ry * W * 0.3, fy = ty + (rz - 0.5) * 18;
      let px = fx + (gx - fx) * e, py = fy + (gy - fy) * e - fly * (18 + 40 * rz);
      const hh = mk > 0.5 ? HF[i] : Hh[i];
      // the cursor parts the glyphs, and the name shifts by depth under it
      const dx = px - ptr.sx, dy = py - ptr.sy, dl = Math.hypot(dx, dy);
      const f = ptr.s * smooth(140, 0, dl);
      if (f > 0) { px += dx / Math.max(dl, 1) * f * (10 + 10 * rz); py += dy / Math.max(dl, 1) * f * (10 + 10 * rz); }
      if (ptr.s > 0) { const s = ptr.s * t * (4 + 10 * rx); px += (ptr.sx / W - 0.5) * s; py += (ptr.sy / H - 0.5) * s * 0.6; }
      const hf = half[hh < 0.5 ? 0 : 1];
      let qx = hf.ox + (px - hf.ox) * hf.g + hf.tx, qy = hf.oy + (py - hf.oy) * hf.g;
      // drifters let go of the halves and fall down the portrait's edges
      const dr = rw < 0.05 ? smooth(0.03, 0.32, G.a) : 0;
      if (dr > 0) {
        const lf = hf.left, side = lf ? G.L : G.R, inward = lf ? 1 : -1;
        const yy = ((ty + time * (10 + ry * 22) + rz * H) % (H + 40)) - 20;
        qx += (side + inward * (-22 + rx * 40) + Math.sin(time * 0.7 + rz * 30) * 4 - qx) * dr; qy += (yy - qy) * dr;
      }
      if (qx < -20 || qx > W + 20 || qy < -20 || qy > H + 20) continue;
      // glyph: scrambles in flight and near the cursor, a quiet re-roll at rest
      let g = Gi[i];
      if ((1 - t) + f * 1.4 + fly * 1.2 > 0.04) g = Math.floor(((Math.sin(epoch * 9.1 + i * 3.7 + time * 11) + 1) * 0.5) * GLYPHS.length) % GLYPHS.length;
      else if (((i * 7 + epoch * 13) % 97) === 0) g = (g + 5) % GLYPHS.length;
      const land0 = smooth(0.82, 1, mk);
      if (land0 > 0.6 && f < 0.25) g = FG[i]; // the glyph whose ink matches the portrait's tone
      // colour and alpha, as the shader: ember while flying and near the cursor, ink at rest; the portrait's tone
      const land = smooth(0.82, 1, mk);
      const settled = smooth(0.55, 1, t), accent = ry >= 0.9;
      let warm = Math.max(1 - settled, f, fly * 0.7, accent ? 0.9 * settled : 0);
      let bright = (0.84 + 0.16 * E[i]);
      let a = smooth(0, 0.18, t) * (1 - smooth(0.85, 1, G.b)) * (1 - 0.3 * dr);
      if (land > 0) {
        const ft = FT[i];
        warm = warm * (1 - land) + land * 0.32 * smooth(0.28, 0.55, ft) * (1 - smooth(0.55, 0.85, ft));
        bright = bright * (1 - land) + land * (0.07 + 0.99 * ft);
        const sweep = Math.exp(-(((px * 0.8 + py * 0.45 - ((time * 150) % (W + H + 600)) + 300) / 55) ** 2));
        bright += sweep * land * 0.4 * (0.35 + 0.65 * ft);
        a *= 1 - land + land * (0.25 + 0.75 * smooth(0.02, 0.35, ft));
      }
      if (a < 0.02) continue;
      const sz = base * (1 + f * 0.35) * (1 - land + land * Math.min(1, headK * 1.2)); // 2D sprites are softer than the shader's, so a little larger
      const sx = (g % C) * S, sy = Math.floor(g / C) * S;
      ctx.globalAlpha = Math.min(1, a * Math.min(1, bright));
      ctx.drawImage(warm > 0.5 ? sh.acc : sh.ink, sx, sy, S, S, qx - sz / 2, qy - sz / 2, sz, sz);
    }
    ctx.globalAlpha = 1;
  }
  raf = requestAnimationFrame(frame);

  // geometry changes: new points, no second intro
  let rb = 0;
  const onGeo = () => { clearTimeout(rb); rb = setTimeout(() => { introDone = introDone || U.uIntro.value > 0.5; build(window.__wmGeo); size(); dirty = true; }, 120); };
  document.addEventListener('wm:geo', onGeo);
  addEventListener('resize', () => { size(); dirty = true; });

  root.classList.add('pfx-2d');
  window.__heroGL = {
    mode: '2d', canvas,
    mount() { dirty = true; }, // the 2D layer stays in the hero; the chapters' tile builds need WebGL
    wake() { dirty = true; },
    report: () => ({ variant: '2d', count: P?.n ?? 0 }),
    dispose() { alive = false; cancelAnimationFrame(raf); zoom?.dispose(); removeEventListener('pointermove', onMove); removeEventListener('scroll', onScroll); document.removeEventListener('wm:geo', onGeo); },
  };
  document.dispatchEvent(new CustomEvent('cloud:ready'));
}
