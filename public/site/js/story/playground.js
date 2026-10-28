// playground.js (play.html): things to touch.
//   Neon Alley   three real frames cross-fade while the card is on screen; "coming soon to play"
//   balls        Matter.js 0.20.0 (cdnjs, pinned), loaded only when the arena gets close. Drag and throw with a
//                mouse, tap to flick on touch (the page still scrolls), Nadav kicks toward the goal, shake all.
//                Canvas 2D; the loop runs only while the arena is on screen. Calm mode: the balls rest.
//   avatar       every state on a button; tapping him does a trick; five taps in three seconds earn a line
//   pet          the desktop pet, as a labelled illustration: his avatar cycles relaxed / working / waiting

import { lazy } from '../story-pages.js';
import { createSprite } from './sprite.js';

const MATTER = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.20.0/matter.min.js';
const GLYPHS = ['AI', '{ }', '</>', 'א', '=>', '#', '&&', '( )', 'JS', 'ב', '★', '%'];
const COLORS = [['#E8913C', '#0A0C0E'], ['#EDE7DC', '#0A0C0E'], ['#6FE3A1', '#0A0C0E'], ['#1d2329', '#EDE7DC'], ['#F2B36F', '#0A0C0E'], ['#7FB3D5', '#0A0C0E']];

function loadMatter() {
  if (window.Matter) return Promise.resolve(window.Matter);
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = MATTER; s.async = true; s.crossOrigin = 'anonymous';
    s.onload = () => res(window.Matter); s.onerror = rej;
    document.head.appendChild(s);
  });
}

export function init({ gsap, reduce }) {
  /* ── Neon Alley frames ── */
  const frames = [...document.querySelectorAll('#neonMedia img')];
  if (!reduce) {
    let i = 0, t = null;
    new IntersectionObserver(([e]) => {
      clearInterval(t);
      if (e.isIntersecting) t = setInterval(() => { frames[i].classList.remove('is-on'); i = (i + 1) % frames.length; frames[i].classList.add('is-on'); }, 3800);
    }).observe(document.getElementById('neonMedia'));
  }

  /* ── avatar playground ── */
  const hit = document.getElementById('avpHit');
  const big = createSprite(hit, { reduce, start: 'idle' });
  const btns = [...document.querySelectorAll('.avp__btns button')];
  const LOOP = new Set(['laptop', 'sit', 'review']);
  const press = (pose) => btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.pose === pose)));
  btns.forEach((b) => b.addEventListener('click', () => {
    const pose = b.dataset.pose; press(pose);
    big.play(pose, { rest: LOOP.has(pose) ? pose : 'idle' }).then((ok) => { if (ok && !LOOP.has(pose)) press(''); });
  }));
  const taps = [];
  hit.addEventListener('click', () => {
    const now = performance.now(); taps.push(now); while (taps.length && now - taps[0] > 3000) taps.shift();
    if (taps.length >= 5) { taps.length = 0; big.play('failed'); big.say(__t('avatar.clickSpam')); return; }
    const tricks = ['kick', 'celebrate', 'thumbs-up', 'jumping', 'waving'];
    big.play(tricks[(Math.random() * tricks.length) | 0]); press('');
  });
  let greeted = false;
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !greeted) { greeted = true; big.play('celebrate'); big.say(__t('avatar.page.play')); }
  }, { threshold: 0.5 }).observe(hit);

  /* ── the pet ── */
  lazy(document.getElementById('petAv'), () => {
    const pet = createSprite(document.getElementById('petAv'), { reduce, start: 'working' });
    const bub = document.getElementById('petBub');
    const ST = [['working', __t('play.pet.state.working'), 'var(--live)'], ['waiting', __t('play.pet.state.waiting'), 'var(--accent)'], ['idle', __t('play.pet.state.idle'), 'var(--st-net)']];
    let k = 0;
    const set = () => { const [p, l, c] = ST[k % ST.length]; pet.play(p); bub.querySelector('span').textContent = l; bub.style.setProperty('--c', c); k++; };
    set();
    if (!reduce) setInterval(set, 3200);
  }, '300px');

  /* ── balls ── */
  const arena = document.getElementById('arena2');
  const kid = createSprite(document.getElementById('kid2'), { reduce, start: 'idle' });
  if (reduce) {
    document.getElementById('kickBtn').hidden = true;
    document.getElementById('shakeBtn').hidden = true;
    drawStill(arena);
    return;
  }
  lazy(arena, () => loadMatter().then((M) => physics(M, arena, kid)).catch(() => {
    arena.querySelector('.arena2__calm').textContent = __t('global.loading.noWebgl');
    arena.querySelector('.arena2__calm').style.display = 'grid';
    drawStill(arena);
  }), '500px');
}

function sizeCanvas(arena) {
  const cv = arena.querySelector('canvas'), dpr = Math.min(2, devicePixelRatio || 1);
  const W = arena.clientWidth, H = arena.clientHeight;
  cv.width = W * dpr; cv.height = H * dpr;
  const ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { cv, ctx, W, H };
}
function drawBall(ctx, x, y, r, a, i) {
  const [bg, fg] = COLORS[i % COLORS.length];
  ctx.save(); ctx.translate(x, y); ctx.rotate(a);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2); ctx.fillStyle = bg; ctx.fill();
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,255,255,.18)'; ctx.stroke();
  ctx.fillStyle = fg; ctx.font = `800 ${Math.round(r * 0.72)}px Archivo, Rubik, sans-serif`;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(GLYPHS[i % GLYPHS.length], 0, 1);
  ctx.restore();
}
function drawStill(arena) {
  const { ctx, W, H } = sizeCanvas(arena);
  const r = Math.max(18, Math.min(30, W / 22));
  let x = W * 0.25;
  for (let i = 0; i < 9 && x < W - 140; i++) { drawBall(ctx, x, H - r - 2, r, 0, i); x += r * 2.1; }
}

function physics(M, arena, kid) {
  const { Engine, Bodies, Body, Composite, Mouse, MouseConstraint, Query } = M;
  let { cv, ctx, W, H } = sizeCanvas(arena);
  const engine = Engine.create(); engine.gravity.y = 1;
  const r0 = Math.max(16, Math.min(30, W / 24));
  const wall = (x, y, w, h) => Bodies.rectangle(x, y, w, h, { isStatic: true, render: { visible: false } });
  let walls = [];
  const goal = () => ({ x0: 0, x1: 16, y0: H * 0.58 });
  function buildWalls() {
    Composite.remove(engine.world, walls);
    walls = [wall(W / 2, H + 30, W * 2, 60), wall(W / 2, -30, W * 2, 60), wall(-30, H / 2, 60, H * 2), wall(W + 30, H / 2, 60, H * 2),
      wall(9, H * 0.58 - 4, 24, 8)];      // the goal's crossbar
    Composite.add(engine.world, walls);
  }
  buildWalls();
  const N = W < 500 ? 9 : 13;
  const balls = Array.from({ length: N }, (_, i) => {
    const r = r0 * (0.8 + ((i * 37) % 10) / 22);
    const b = Bodies.circle(W * 0.38 + ((i * 53) % Math.max(60, W * 0.42)), 30 + (i % 4) * 40, r, { restitution: 0.72, friction: 0.02, frictionAir: 0.006, density: 0.0016 });
    b.plugin = { i, r, scored: 0 };
    return b;
  });
  Composite.add(engine.world, balls);

  // mouse: drag and throw (fine pointers only, and never the page's wheel)
  if (matchMedia('(pointer: fine)').matches) {
    const mouse = Mouse.create(cv);
    ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach((ev) => cv.removeEventListener(ev, mouse.mousewheel));
    const mc = MouseConstraint.create(engine, { mouse, constraint: { stiffness: 0.2, render: { visible: false } } });
    Composite.add(engine.world, mc);
    cv.style.cursor = 'grab';
  }
  // touch: tap a ball to send it flying; the page keeps scrolling (touch-action: pan-y)
  cv.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse') return;
    const rc = cv.getBoundingClientRect(), p = { x: e.clientX - rc.left, y: e.clientY - rc.top };
    const hitB = Query.point(balls, p)[0] || balls.reduce((a, b) => (dist(b.position, p) < dist(a.position, p) ? b : a));
    if (dist(hitB.position, p) < hitB.plugin.r * 2.2) Body.setVelocity(hitB, { x: (Math.random() - 0.5) * 18, y: -16 - Math.random() * 6 });
  });
  const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

  // goals
  let goals = 0, armed = false;   // goals count only after someone plays
  ['pointerdown', 'keydown'].forEach((ev) => arena.parentElement.addEventListener(ev, () => { armed = true; }, { once: true }));
  const score = document.getElementById('goals2'), gtxt = arena.querySelector('.arena2__goaltxt');
  function checkGoals() {
    const g = goal();
    balls.forEach((b) => {
      if (armed && b.position.x < g.x1 + b.plugin.r * 0.4 && b.position.y > g.y0 && performance.now() - b.plugin.scored > 2000) {
        b.plugin.scored = performance.now(); goals++;
        score.hidden = false; score.textContent = __t('home.play.goals', { n: goals });
        gtxt.classList.remove('is-on'); void gtxt.offsetWidth; gtxt.classList.add('is-on');
        kid.play('celebrate');
        setTimeout(() => { Body.setPosition(b, { x: W * 0.55, y: 40 }); Body.setVelocity(b, { x: 0, y: 0 }); }, 700);
      }
    });
  }

  document.getElementById('kickBtn').addEventListener('click', () => {
    kid.play('kick', { onFrame: (f) => {
      if (f !== 3) return;
      const foot = { x: W - 70, y: H - 20 };
      const b = balls.reduce((a, c) => (dist(c.position, foot) < dist(a.position, foot) ? c : a));
      Body.setPosition(b, { x: W - 90 - b.plugin.r, y: H - b.plugin.r - 4 });
      Body.setVelocity(b, { x: -(W / 46 + Math.random() * 4), y: -(H / 46 + Math.random() * 4) });
      wake();
    } });
  });
  document.getElementById('shakeBtn').addEventListener('click', () => {
    balls.forEach((b) => Body.setVelocity(b, { x: (Math.random() - 0.5) * 22, y: -8 - Math.random() * 14 }));
    wake();
  });

  // loop: only while on screen
  let raf = 0, on = false;
  const wake = () => { if (on && !raf) raf = requestAnimationFrame(step); };
  function step() {
    raf = 0;
    Engine.update(engine, 1000 / 60);
    checkGoals();
    ctx.clearRect(0, 0, W, H);
    balls.forEach((b) => {
      ctx.fillStyle = 'rgba(0,0,0,.28)';
      ctx.beginPath(); ctx.ellipse(b.position.x, H - 3, b.plugin.r * 0.8, 3, 0, 0, Math.PI * 2); ctx.fill();
      drawBall(ctx, b.position.x, b.position.y, b.plugin.r, b.angle, b.plugin.i);
    });
    if (on) raf = requestAnimationFrame(step);
  }
  new IntersectionObserver(([e]) => { on = e.isIntersecting; if (on) wake(); else { cancelAnimationFrame(raf); raf = 0; } }).observe(arena);
  let rt = 0;
  addEventListener('resize', () => {
    clearTimeout(rt);
    rt = setTimeout(() => { ({ cv, ctx, W, H } = sizeCanvas(arena)); buildWalls(); balls.forEach((b) => { if (b.position.x > W - 20) Body.setPosition(b, { x: W * 0.5, y: 40 }); }); }, 200);
  });
}
