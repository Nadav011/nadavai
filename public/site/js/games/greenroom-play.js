// greenroom-play.js: the Green Room page's games. Nothing here touches the real app: no prizes, no payment.
//   wheel   a rebuilt prize wheel you drag to spin (or press the hub); it slows with friction, ticks past the
//           pegs and names where it stopped. Labels are snooker words, not prizes.
//   table   a top-down snooker table in canvas 2D: pull back from the cue ball to aim and set power, release
//           to strike. Pots score by ball value; a potted cue ball is re-spotted. Keyboard: arrows aim and
//           set power, Enter strikes; "break" plays the opening shot for you.
//   intro   the app's real intro film plays on the phone while it is on screen.
// Both canvases run on the kit's frame loop in demand mode: they draw only while something moves.

import { createFrameLoop } from '../../hero/kit/frame-loop.js';

const TAU = Math.PI * 2;
const SEGS = [
  { t: '147', c: '#0E3B24' }, { t: __t('greenroom.try.wheel.seg2'), c: '#101311' }, { t: __t('greenroom.try.wheel.seg3'), c: '#13472C' }, { t: __t('greenroom.try.wheel.seg4'), c: '#101311' },
  { t: 'עוד סיבוב', c: '#0E3B24' }, { t: __t('greenroom.try.wheel.seg6'), c: '#101311' }, { t: __t('greenroom.try.wheel.seg7'), c: '#13472C' }, { t: __t('greenroom.try.wheel.seg8'), c: '#101311' },
];

export function init(stage, { reduce }) {
  wheel(stage.querySelector('.wheel'), stage.querySelector('.wheel__res'), { reduce });
  table(stage.querySelector('.gr__wide'), { reduce });
  intro(stage.querySelector('.gr__intro'), { reduce });
}

/* ── the wheel ─────────────────────────────────────────── */
function wheel(box, res, { reduce }) {
  const cv = box.querySelector('.wheel__cv'), hub = box.querySelector('.wheel__hub'), ptr = box.querySelector('.wheel__ptr');
  const ctx = cv.getContext('2d');
  const seg = TAU / SEGS.length;
  let th = -seg / 2, w = 0, size = 0, dragging = null, lastIdx = -1, spinning = false;
  const font = getComputedStyle(document.body).fontFamily;

  function resize() { const r = cv.getBoundingClientRect(); size = r.width; const d = Math.min(2, devicePixelRatio || 1); cv.width = cv.height = Math.round(size * d); ctx.setTransform(d, 0, 0, d, 0, 0); draw(); }
  function draw() {
    const c = size / 2, R = c - 6;
    ctx.clearRect(0, 0, size, size);
    // rim
    const rim = ctx.createRadialGradient(c, c, R * 0.86, c, c, R + 6);
    rim.addColorStop(0, '#6b5320'); rim.addColorStop(0.5, '#E4C57E'); rim.addColorStop(1, '#5a431a');
    ctx.beginPath(); ctx.arc(c, c, R + 4, 0, TAU); ctx.fillStyle = rim; ctx.fill();
    ctx.save(); ctx.translate(c, c); ctx.rotate(th);
    SEGS.forEach((s, i) => {
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, R * 0.95, i * seg, (i + 1) * seg); ctx.closePath();
      ctx.fillStyle = s.c; ctx.fill();
      ctx.strokeStyle = 'rgba(228,197,126,.55)'; ctx.lineWidth = 1.5; ctx.stroke();
      ctx.save(); ctx.rotate(i * seg + seg / 2);
      ctx.fillStyle = i % 2 ? '#EDE7DC' : '#E4C57E';
      ctx.font = `600 ${Math.round(size * 0.042)}px ${font}`;
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
      ctx.translate(R * 0.64, 0); ctx.rotate(Math.PI / 2);
      ctx.fillText(s.t, 0, 0);
      ctx.restore();
      // pegs
      ctx.save(); ctx.rotate(i * seg); ctx.beginPath(); ctx.arc(R * 0.93, 0, Math.max(2.5, size * 0.008), 0, TAU); ctx.fillStyle = '#F2DFA8'; ctx.fill(); ctx.restore();
    });
    // felt shine
    const sh = ctx.createLinearGradient(-R, -R, R, R); sh.addColorStop(0, 'rgba(255,255,255,.1)'); sh.addColorStop(0.5, 'rgba(255,255,255,0)'); sh.addColorStop(1, 'rgba(0,0,0,.25)');
    ctx.beginPath(); ctx.arc(0, 0, R * 0.95, 0, TAU); ctx.fillStyle = sh; ctx.fill();
    ctx.restore();
  }
  const idxAt = () => { let a = (-Math.PI / 2 - th) % TAU; if (a < 0) a += TAU; return Math.floor(a / seg) % SEGS.length; };
  const angleOf = (e) => { const r = cv.getBoundingClientRect(); return Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2); };
  function say(final) {
    const s = SEGS[idxAt()];
    res.innerHTML = final ? `נעצר על <b></b> · המחשה, בלי פרסים` : __t('greenroom.try.wheel.spinning');
    if (final) res.querySelector('b').textContent = s.t;
  }

  const loop = createFrameLoop({
    mode: 'demand', observe: box, fps: 60,
    render: ({ dt }) => {
      if (!dragging && Math.abs(w) > 0) {
        th += w * dt;
        w *= Math.exp(-0.75 * dt); w -= Math.sign(w) * 0.25 * dt;
        if (Math.abs(w) < 0.06) { w = 0; spinning = false; say(true); }
      }
      const i = idxAt();
      if (i !== lastIdx) { lastIdx = i; if (!reduce) ptr.animate([{ rotate: '0deg' }, { rotate: `${w > 0 ? -16 : 16}deg` }, { rotate: '0deg' }], { duration: 120 }); }
      draw();
      return dragging || Math.abs(w) > 0;
    },
  });
  function spin(omega) {
    if (reduce) {   // no long spin under reduced motion: land on a random segment, once
      th = -Math.PI / 2 - (Math.floor(Math.random() * SEGS.length) + 0.5) * seg; w = 0; draw(); say(true); return;
    }
    w = omega; spinning = true; say(false); loop.invalidate();
  }
  cv.addEventListener('pointerdown', (e) => {
    cv.setPointerCapture(e.pointerId); w = 0;
    dragging = { a: angleOf(e), t: performance.now(), v: 0 }; loop.invalidate();
  });
  cv.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const a = angleOf(e), now = performance.now();
    let d = a - dragging.a; if (d > Math.PI) d -= TAU; if (d < -Math.PI) d += TAU;
    th += d;
    const v = d / Math.max(0.008, (now - dragging.t) / 1000);
    dragging.v = dragging.v * 0.6 + v * 0.4; dragging.a = a; dragging.t = now; loop.invalidate();
  });
  const up = () => {
    if (!dragging) return;
    const v = dragging.v; dragging = null;
    if (Math.abs(v) > 1.2) spin(Math.sign(v) * Math.min(18, Math.max(6, Math.abs(v))));
    else loop.invalidate();
  };
  cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  hub.addEventListener('click', () => { if (!spinning) spin((Math.random() < 0.5 ? -1 : 1) * (10 + Math.random() * 5)); });
  new ResizeObserver(resize).observe(cv);
  resize(); loop.start();
}

/* ── the snooker table ─────────────────────────────────── */
const VAL = { red: 1, yellow: 2, green: 3, brown: 4, blue: 5, pink: 6, black: 7 };
const COL = { cue: ['#ffffff', '#d9d9d2'], red: ['#ff5a4f', '#9a0f12'], yellow: ['#ffe36b', '#b38a00'], green: ['#4fd27a', '#0b6b31'], brown: ['#c98a54', '#5b2f10'], blue: ['#6aa8ff', '#0f3c9c'], pink: ['#ffb3c9', '#c2477a'], black: ['#5a5f66', '#050608'] };

function table(box, { reduce }) {
  const cv = box.querySelector('.table__cv'), ctx = cv.getContext('2d');
  const scoreEl = box.querySelector('[data-score]'), msg = box.querySelector('[data-msg]');
  const breakBtn = box.querySelector('[data-act="break"]'), resetBtn = box.querySelector('[data-act="reset"]');
  let W = 0, H = 0, r = 8, port = false, balls = [], pockets = [], score = 0, aim = null, kAim = { a: Math.PI, p: 0.75, on: false }, moving = false, cueGone = false;
  const M = () => r * 1.9;                                   // cushion inset

  // long-axis helpers: the table is landscape on desktop, portrait on a phone
  const P = (u, v) => (port ? { x: v * W, y: (1 - u) * H } : { x: u * W, y: v * H });
  function rack() {
    balls = []; cueGone = false;
    const add = (kind, p) => balls.push({ kind, x: p.x, y: p.y, vx: 0, vy: 0, in: false });
    add('cue', P(0.2, 0.56));
    add('yellow', P(0.22, 0.66)); add('green', P(0.22, 0.34)); add('brown', P(0.22, 0.5));
    add('blue', P(0.5, 0.5)); add('pink', P(0.69, 0.5)); add('black', P(0.9, 0.5));
    const L = port ? H : W, S = port ? W : H, d = (2 * r * 1.02) / L, e = (2 * r * 1.02) / S;
    const apex = 0.69 + d * 1.05;
    for (let row = 0; row < 4; row++) for (let k = 0; k <= row; k++) add('red', P(apex + row * d * 0.87, 0.5 + (k - row / 2) * e));
    score = 0; scoreEl.textContent = '0'; msg.textContent = __t('greenroom.try.table.hint');
  }
  function resize() {
    const rect = cv.getBoundingClientRect(), wasPort = port, oldW = W, oldH = H;
    W = rect.width; H = rect.height; port = H > W; r = Math.min(W, H) * (port ? 0.03 : 0.026);
    const d = Math.min(2, devicePixelRatio || 1); cv.width = Math.round(W * d); cv.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0);
    const m = M();
    pockets = port
      ? [[m, m], [W - m, m], [m - 2, H / 2], [W - m + 2, H / 2], [m, H - m], [W - m, H - m]]
      : [[m, m], [W / 2, m - 2], [W - m, m], [m, H - m], [W / 2, H - m + 2], [W - m, H - m]];
    if (!balls.length || wasPort !== port) rack();
    else if (oldW) balls.forEach((b) => { b.x *= W / oldW; b.y *= H / oldH; });
    loop.invalidate();
  }
  const cue = () => balls.find((b) => b.kind === 'cue' && !b.in);

  function step(dt) {
    const m = M(), pr = r * 1.7;
    for (const b of balls) {
      if (b.in) continue;
      b.x += b.vx * dt; b.y += b.vy * dt;
      const sp = Math.hypot(b.vx, b.vy);
      if (sp > 0) { const ns = Math.max(0, sp - (W * 0.11 + sp * 0.55) * dt); b.vx *= ns / sp; b.vy *= ns / sp; }
      for (const [px, py] of pockets) if (Math.hypot(b.x - px, b.y - py) < pr) { pot(b); break; }
      if (b.in) continue;
      if (b.x < m + r) { b.x = m + r; b.vx = Math.abs(b.vx) * 0.78; }
      if (b.x > W - m - r) { b.x = W - m - r; b.vx = -Math.abs(b.vx) * 0.78; }
      if (b.y < m + r) { b.y = m + r; b.vy = Math.abs(b.vy) * 0.78; }
      if (b.y > H - m - r) { b.y = H - m - r; b.vy = -Math.abs(b.vy) * 0.78; }
    }
    for (let i = 0; i < balls.length; i++) {
      const a = balls[i]; if (a.in) continue;
      for (let j = i + 1; j < balls.length; j++) {
        const b = balls[j]; if (b.in) continue;
        const dx = b.x - a.x, dy = b.y - a.y, d2 = dx * dx + dy * dy, min = 2 * r;
        if (d2 >= min * min || d2 === 0) continue;
        const d = Math.sqrt(d2), nx = dx / d, ny = dy / d, over = (min - d) / 2;
        a.x -= nx * over; a.y -= ny * over; b.x += nx * over; b.y += ny * over;
        const rel = (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;
        if (rel <= 0) continue;
        const j2 = rel * 0.97;
        a.vx -= j2 * nx; a.vy -= j2 * ny; b.vx += j2 * nx; b.vy += j2 * ny;
      }
    }
  }
  function pot(b) {
    b.in = true; b.vx = b.vy = 0;
    if (b.kind === 'cue') { cueGone = true; msg.textContent = __t('greenroom.try.table.msgCue'); return; }
    score += VAL[b.kind]; scoreEl.textContent = String(score);
    msg.textContent = b.kind === 'red' ? __t('greenroom.try.table.msgRed') : `צבעוני בפנים: ${VAL[b.kind]} נקודות`;
    if (!balls.some((x) => !x.in && x.kind !== 'cue')) { msg.textContent = `ניקיתם את השולחן: ${score} נקודות`; setTimeout(() => { rack(); loop.invalidate(); }, 1800); }
  }
  function shoot(a, power) {
    const c = cue(); if (!c || moving) return;
    const v = Math.min(W, H) * 5.2 * power;
    c.vx = Math.cos(a) * v; c.vy = Math.sin(a) * v; moving = true; loop.invalidate();
  }

  function ballPaint(b) {
    const [hi, lo] = COL[b.kind];
    ctx.beginPath(); ctx.ellipse(b.x + r * 0.25, b.y + r * 0.35, r * 1.02, r * 0.9, 0, 0, TAU); ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.fill();
    const g = ctx.createRadialGradient(b.x - r * 0.35, b.y - r * 0.4, r * 0.1, b.x, b.y, r);
    g.addColorStop(0, hi); g.addColorStop(1, lo);
    ctx.beginPath(); ctx.arc(b.x, b.y, r, 0, TAU); ctx.fillStyle = g; ctx.fill();
    ctx.beginPath(); ctx.arc(b.x - r * 0.35, b.y - r * 0.4, r * 0.28, 0, TAU); ctx.fillStyle = 'rgba(255,255,255,.55)'; ctx.fill();
  }
  function draw() {
    const m = M();
    ctx.clearRect(0, 0, W, H);
    const felt = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7);
    felt.addColorStop(0, '#16884a'); felt.addColorStop(1, '#0a4c29');
    ctx.fillStyle = '#0b3d22'; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = felt; ctx.fillRect(m * 0.55, m * 0.55, W - m * 1.1, H - m * 1.1);
    // cushions
    ctx.strokeStyle = 'rgba(0,0,0,.35)'; ctx.lineWidth = 2; ctx.strokeRect(m, m, W - 2 * m, H - 2 * m);
    // baulk line and the D
    ctx.strokeStyle = 'rgba(255,255,255,.28)'; ctx.lineWidth = 1.2;
    const b0 = P(0.22, 0), b1 = P(0.22, 1), dc = P(0.22, 0.5), rD = (port ? W : H) * 0.16;
    ctx.beginPath(); ctx.moveTo(b0.x, b0.y); ctx.lineTo(b1.x, b1.y); ctx.stroke();
    ctx.beginPath(); port ? ctx.arc(dc.x, dc.y, rD, 0, Math.PI) : ctx.arc(dc.x, dc.y, rD, Math.PI / 2, Math.PI * 1.5); ctx.stroke();
    // pockets
    for (const [px, py] of pockets) { ctx.beginPath(); ctx.arc(px, py, r * 1.45, 0, TAU); ctx.fillStyle = '#050505'; ctx.fill(); ctx.strokeStyle = 'rgba(228,197,126,.5)'; ctx.lineWidth = 1.5; ctx.stroke(); }
    // logo on the felt
    ctx.save(); ctx.globalAlpha = 0.09; ctx.fillStyle = '#E4C57E'; ctx.font = `800 ${Math.min(W, H) * 0.18}px Georgia, serif`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('GR', W / 2, H / 2); ctx.restore();
    // aim
    const c = cue();
    const a = aim || (kAim.on ? { a: kAim.a, p: kAim.p } : null);
    if (c && a && !moving) {
      const dx = Math.cos(a.a), dy = Math.sin(a.a);
      ctx.setLineDash([4, 6]); ctx.strokeStyle = 'rgba(255,255,255,.6)'; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(c.x + dx * r, c.y + dy * r); ctx.lineTo(c.x + dx * (r + Math.max(W, H) * 0.5), c.y + dy * (r + Math.max(W, H) * 0.5)); ctx.stroke(); ctx.setLineDash([]);
      const back = r * 1.6 + a.p * r * 7, len = Math.max(W, H) * 0.42;
      ctx.lineCap = 'round';
      ctx.strokeStyle = '#d8b46c'; ctx.lineWidth = r * 0.55;
      ctx.beginPath(); ctx.moveTo(c.x - dx * back, c.y - dy * back); ctx.lineTo(c.x - dx * (back + len), c.y - dy * (back + len)); ctx.stroke();
      ctx.strokeStyle = '#f2efe6'; ctx.lineWidth = r * 0.5;
      ctx.beginPath(); ctx.moveTo(c.x - dx * back, c.y - dy * back); ctx.lineTo(c.x - dx * (back + r * 0.8), c.y - dy * (back + r * 0.8)); ctx.stroke();
      ctx.strokeStyle = '#2a1a0c'; ctx.lineWidth = r * 0.7;
      ctx.beginPath(); ctx.moveTo(c.x - dx * (back + len * 0.7), c.y - dy * (back + len * 0.7)); ctx.lineTo(c.x - dx * (back + len), c.y - dy * (back + len)); ctx.stroke();
      // power
      ctx.fillStyle = 'rgba(0,0,0,.45)'; ctx.fillRect(m + 6, H - m - 12, (W - 2 * m) * 0.25, 5);
      ctx.fillStyle = '#E4C57E'; ctx.fillRect(m + 6, H - m - 12, (W - 2 * m) * 0.25 * a.p, 5);
    }
    balls.forEach((b) => { if (!b.in) ballPaint(b); });
  }

  const loop = createFrameLoop({
    mode: 'demand', observe: box, fps: 60, simStep: 1 / 120, maxSubSteps: 8,
    update: (dt) => { if (moving) step(dt); },
    render: () => {
      if (moving && balls.every((b) => b.in || Math.hypot(b.vx, b.vy) < 2)) {
        moving = false; balls.forEach((b) => { b.vx = b.vy = 0; });
        if (cueGone) { const c = balls.find((b) => b.kind === 'cue'); const p = P(0.2, 0.5); Object.assign(c, { in: false, x: p.x, y: p.y }); cueGone = false; }
      }
      draw();
      return moving || !!aim;
    },
  });

  const local = (e) => { const rc = cv.getBoundingClientRect(); return { x: e.clientX - rc.left, y: e.clientY - rc.top }; };
  cv.addEventListener('pointerdown', (e) => {
    const c = cue(); if (!c || moving) return;
    cv.setPointerCapture(e.pointerId);
    const p = local(e); aim = { a: Math.atan2(c.y - p.y, c.x - p.x), p: 0, from: p }; loop.invalidate();
  });
  cv.addEventListener('pointermove', (e) => {
    if (!aim) return; const c = cue(); const p = local(e);
    const d = Math.hypot(c.x - p.x, c.y - p.y);
    aim.a = Math.atan2(c.y - p.y, c.x - p.x);
    aim.p = Math.min(1, Math.max(0, (d - r * 1.5) / (Math.min(W, H) * 0.42)));
    loop.invalidate();
  });
  const release = () => { if (!aim) return; const a = aim; aim = null; if (a.p > 0.05) shoot(a.a, a.p); else loop.invalidate(); };
  cv.addEventListener('pointerup', release); cv.addEventListener('pointercancel', () => { aim = null; loop.invalidate(); });
  cv.addEventListener('focus', () => { kAim.on = true; loop.invalidate(); });
  cv.addEventListener('blur', () => { kAim.on = false; loop.invalidate(); });
  cv.addEventListener('keydown', (e) => {
    const k = e.key;
    if (k === 'ArrowLeft' || k === 'ArrowRight') { kAim.a += (k === 'ArrowLeft' ? -1 : 1) * 0.05; }
    else if (k === 'ArrowUp' || k === 'ArrowDown') { kAim.p = Math.min(1, Math.max(0.1, kAim.p + (k === 'ArrowUp' ? 0.1 : -0.1))); }
    else if (k === 'Enter' || k === ' ') shoot(kAim.a, kAim.p);
    else return;
    e.preventDefault(); loop.invalidate();
  });
  breakBtn.addEventListener('click', () => {
    const c = cue(); const apex = balls.filter((b) => b.kind === 'red' && !b.in).sort((p, q) => Math.hypot(p.x - c.x, p.y - c.y) - Math.hypot(q.x - c.x, q.y - c.y))[0] || balls.find((b) => !b.in && b.kind !== 'cue');
    if (!c || !apex) return;
    kAim.a = Math.atan2(apex.y - c.y, apex.x - c.x);
    shoot(kAim.a, reduce ? 0.7 : 0.95);
  });
  resetBtn.addEventListener('click', () => { rack(); moving = false; loop.invalidate(); });
  new ResizeObserver(resize).observe(cv);
  loop.start(); resize();
}

/* ── the intro film on the phone ───────────────────────── */
function intro(el, { reduce }) {
  const v = el?.querySelector('video'); if (!v) return;
  const btn = el.querySelector('[data-act="film"]');
  if (reduce) { btn.hidden = false; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (reduce) return; if (e.isIntersecting) v.play().catch(() => {}); else v.pause(); }), { threshold: 0.3 });
  io.observe(v);
  btn?.addEventListener('click', () => { if (v.paused) { v.play().catch(() => {}); btn.textContent = __t('greenroom.try.video.pause'); } else { v.pause(); btn.textContent = __t('greenroom.try.video.play'); } });
}
