// play.js (S10): a light physics playground. Matter.js (cdnjs, pinned) loads only when the section gets
// close. Balls you can drag and throw (mouse) or tap to flick (touch); Nadav's avatar stands on the
// reading-start side and kicks the nearest ball toward the goal on the far side. Canvas 2D, one loop that
// runs only while the arena is on screen and something is still moving.

const MATTER = 'https://cdnjs.cloudflare.com/ajax/libs/matter-js/0.20.0/matter.min.js';
const GLYPHS = ['{ }', '</>', 'AI', '=>', '#', 'א', '( )', '&&'];
const KICK = { row: 1, frames: 6, dur: [160, 140, 90, 110, 140, 300], hit: 3 };

function loadMatter() {
  if (window.Matter) return Promise.resolve(window.Matter);
  return new Promise((res, rej) => {
    const s = document.createElement('script');
    s.src = MATTER; s.async = true; s.crossOrigin = 'anonymous';
    s.onload = () => res(window.Matter); s.onerror = rej;
    document.head.appendChild(s);
  });
}

export function initPlay({ reduce }) {
  const arena = document.getElementById('arena');
  const cv = arena.querySelector('.arena__cv');
  const kid = document.getElementById('kid');
  const sprite = kid.querySelector('.kid__sprite');
  const goalsEl = document.getElementById('goals');
  let started = false;

  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting) && !started) {
      started = true;
      loadMatter().then(start).catch(() => { arena.classList.add('is-static'); });
    }
  }, { rootMargin: '60% 0px' });
  io.observe(arena);

  function start(M) {
    const { Engine, Bodies, Body, Composite, Sleeping } = M;
    const engine = Engine.create({ enableSleeping: true });
    engine.gravity.y = 1.1;
    const world = engine.world;
    const g = cv.getContext('2d');
    let W = 0, H = 0, dpr = 1, walls = [], balls = [], kidBody = null, goals = 0, visible = false, raf = 0, last = 0, acc = 0;
    const rtl = getComputedStyle(arena).direction === 'rtl';

    function layout() {
      const r = arena.getBoundingClientRect();
      W = r.width; H = r.height; dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      walls.forEach((w) => Composite.remove(world, w));
      const T = 80;
      walls = [
        Bodies.rectangle(W / 2, H + T / 2 - 2, W * 3, T, { isStatic: true, friction: 0.6 }),
        Bodies.rectangle(-T / 2, H / 2 - H, T, H * 4, { isStatic: true }),
        Bodies.rectangle(W + T / 2, H / 2 - H, T, H * 4, { isStatic: true }),
        Bodies.rectangle(W / 2, -H * 1.2, W * 3, T, { isStatic: true }),
      ];
      Composite.add(world, walls);
      if (kidBody) Composite.remove(world, kidBody);
      const kr = kid.getBoundingClientRect();
      kidBody = Bodies.circle(kr.left - r.left + kr.width / 2, kr.top - r.top + kr.height * 0.42, kr.width * 0.24, { isStatic: true, restitution: 0.6 });
      Composite.add(world, kidBody);
      wake();
    }

    const scale = () => Math.max(0.7, Math.min(1.15, W / 900));
    function addBalls() {
      const s = scale();
      const list = [...GLYPHS.map((t) => ({ t })), { ball: true }, { t: 'NadavAI', big: true }];
      list.forEach((o, i) => {
        const r = (o.ball ? 30 : o.big ? 46 : 22 + (i % 3) * 7) * s;
        const x = W * (0.15 + 0.62 * ((i * 0.37) % 1));
        const y = reduce ? H - r - 2 - (i % 2) * r * 2 : -r * 2 - i * 60;
        const b = Bodies.circle(x, y, r, { restitution: o.ball ? 0.78 : 0.62, friction: 0.02, frictionAir: 0.006, density: o.ball ? 0.0016 : 0.0012 });
        b.plugin.d = { ...o, r };
        balls.push(b);
      });
      Composite.add(world, balls);
    }

    // ---------- input: drag + throw (mouse), tap to flick (touch/pen). Calm mode: the balls rest ----------
    let drag = null;
    const local = (e) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    const hit = (p) => balls.find((b) => Math.hypot(b.position.x - p.x, b.position.y - p.y) < b.plugin.d.r + 6);
    cv.addEventListener('pointerdown', (e) => {
      const p = local(e), b = hit(p);
      if (!b) return;
      Sleeping.set(b, false);
      if (e.pointerType === 'mouse') {
        drag = { b, p, t: performance.now(), v: { x: 0, y: 0 } };
        cv.setPointerCapture(e.pointerId); cv.style.cursor = 'grabbing';
      } else {
        const dx = b.position.x - p.x, dy = b.position.y - p.y, d = Math.hypot(dx, dy) || 1;
        Body.setVelocity(b, { x: (dx / d) * 9 + (Math.random() - 0.5) * 4, y: -14 - Math.random() * 6 });
      }
      wake();
    });
    cv.addEventListener('pointermove', (e) => {
      const p = local(e);
      if (drag) {
        const now = performance.now(), dt = Math.max(8, now - drag.t);
        drag.v = { x: ((p.x - drag.p.x) / dt) * 16, y: ((p.y - drag.p.y) / dt) * 16 };
        drag.p = p; drag.t = now;
        Body.setPosition(drag.b, p); Body.setVelocity(drag.b, drag.v);
        wake();
      } else if (e.pointerType === 'mouse') cv.style.cursor = hit(p) ? 'grab' : '';
    });
    const drop = () => { if (!drag) return; Body.setVelocity(drag.b, { x: drag.v.x * 1.4, y: drag.v.y * 1.4 }); drag = null; cv.style.cursor = ''; wake(); };
    cv.addEventListener('pointerup', drop); cv.addEventListener('pointercancel', drop);

    // ---------- the kick ----------
    let kicking = false;
    function frame(i) { sprite.style.backgroundPosition = `${(i / 7) * 100}% ${(KICK.row / 5) * 100}%`; }
    function kick() {
      if (kicking) return;
      kicking = true;
      let i = 0;
      const step = () => {
        frame(i);
        if (i === KICK.hit) {
          const foot = { x: kidBody.position.x + (rtl ? -1 : 1) * 46 * scale(), y: H - 20 };
          let best = null, bd = Infinity;
          balls.forEach((b) => { const d = Math.hypot(b.position.x - foot.x, b.position.y - foot.y); if (d < bd) { bd = d; best = b; } });
          if (best) {
            if (bd > W * 0.3) Body.setPosition(best, { x: foot.x + (rtl ? -1 : 1) * 20, y: H - best.plugin.d.r - 4 });
            Sleeping.set(best, false);
            Body.setVelocity(best, { x: (rtl ? -1 : 1) * (16 + Math.random() * 6) * scale(), y: -(13 + Math.random() * 6) });
            Body.setAngularVelocity(best, -0.3);
          }
          wake();
        }
        if (++i < KICK.frames) setTimeout(step, KICK.dur[i - 1]);
        else setTimeout(() => { frame(0); kicking = false; }, KICK.dur[KICK.frames - 1]);
      };
      step();
    }
    kid.addEventListener('click', kick);
    document.getElementById('kick').addEventListener('click', kick);
    document.getElementById('shake').addEventListener('click', () => {
      balls.forEach((b) => { Sleeping.set(b, false); Body.setVelocity(b, { x: (Math.random() - 0.5) * 18, y: -10 - Math.random() * 14 }); });
      wake();
    });

    // ---------- goal on the far (inline-end) side ----------
    const goal = () => ({ x: rtl ? 0 : W - 14, y: H - H * 0.42, w: 14, h: H * 0.42 });
    const scored = new WeakSet();
    function checkGoal() {
      const G = goal();
      balls.forEach((b) => {
        const inside = (rtl ? b.position.x - b.plugin.d.r < G.x + 18 : b.position.x + b.plugin.d.r > G.x) && b.position.y > G.y;
        if (inside && !scored.has(b) && Math.abs(b.velocity.x) > 2) { scored.add(b); goals++; goalsEl.textContent = goals; goalsEl.parentNode.hidden = false; arena.classList.remove('is-goal'); void arena.offsetWidth; arena.classList.add('is-goal'); }
        if (!inside) scored.delete(b);
      });
    }

    // ---------- draw ----------
    function draw() {
      g.clearRect(0, 0, W, H);
      const G = goal();
      g.strokeStyle = 'rgba(232,145,60,.55)'; g.lineWidth = 2;
      g.beginPath(); g.moveTo(rtl ? 2 : W - 2, H); g.lineTo(rtl ? 2 : W - 2, G.y); g.lineTo(rtl ? 30 : W - 30, G.y); g.stroke();
      g.fillStyle = 'rgba(232,145,60,.06)'; g.fillRect(rtl ? 0 : W - 30, G.y, 30, G.h);
      balls.forEach((b) => {
        const { r, t, ball, big } = b.plugin.d, { x, y } = b.position;
        g.save(); g.translate(x, y);
        g.fillStyle = 'rgba(0,0,0,.35)'; g.beginPath(); g.ellipse(0, Math.min(H - y, 300) - 2, r * 0.9, r * 0.18, 0, 0, Math.PI * 2); g.globalAlpha = Math.max(0, 1 - (H - y) / 260); g.fill(); g.globalAlpha = 1;
        g.rotate(b.angle);
        if (ball) {
          const grd = g.createRadialGradient(-r * 0.35, -r * 0.35, r * 0.1, 0, 0, r);
          grd.addColorStop(0, '#FFFFFF'); grd.addColorStop(1, '#C9C4BA');
          g.fillStyle = grd; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
          g.fillStyle = '#15191E';
          const pent = (cx, cy, s) => { g.beginPath(); for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5; g.lineTo(cx + Math.cos(a) * s, cy + Math.sin(a) * s); } g.closePath(); g.fill(); };
          pent(0, 0, r * 0.32);
          for (let k = 0; k < 5; k++) { const a = -Math.PI / 2 + (k * 2 * Math.PI) / 5; pent(Math.cos(a) * r * 0.82, Math.sin(a) * r * 0.82, r * 0.2); }
        } else {
          const grd = g.createRadialGradient(-r * 0.4, -r * 0.4, r * 0.1, 0, 0, r);
          grd.addColorStop(0, big ? '#F2B36F' : '#2A3038'); grd.addColorStop(1, big ? '#B8621E' : '#111418');
          g.fillStyle = grd; g.beginPath(); g.arc(0, 0, r, 0, Math.PI * 2); g.fill();
          g.strokeStyle = big ? 'rgba(255,231,204,.6)' : 'rgba(232,145,60,.55)'; g.lineWidth = 1.5; g.stroke();
          g.fillStyle = big ? '#0A0C0E' : '#EDE7DC';
          g.font = `800 ${Math.round(r * (big ? 0.34 : t.length > 2 ? 0.5 : 0.7))}px Archivo, Rubik, sans-serif`;
          g.textAlign = 'center'; g.textBaseline = 'middle';
          g.fillText(t, 0, 1);
        }
        g.restore();
      });
    }

    // ---------- loop: fixed 60 Hz steps, only on screen and only while awake ----------
    function wake() { if (visible && !raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }
    function tick(now) {
      raf = 0;
      acc += Math.min(100, now - last); last = now;
      while (acc >= 1000 / 60) { Engine.update(engine, 1000 / 60); acc -= 1000 / 60; }
      checkGoal(); draw();
      const awake = drag || kicking || balls.some((b) => !b.isSleeping);
      if (visible && awake) raf = requestAnimationFrame(tick);
    }
    new IntersectionObserver((es) => { visible = es[0].isIntersecting; if (visible) wake(); }, { threshold: 0.05 }).observe(arena);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
    addEventListener('resize', () => { layout(); draw(); });

    frame(0);
    layout();
    addBalls();
    draw();
    // the avatar joins in once on arrival
    if (!reduce) {
      const once = new IntersectionObserver((es) => { if (es[0].isIntersecting) { once.disconnect(); setTimeout(kick, 1500); } }, { threshold: 0.6 });
      once.observe(arena);
    }
    window.__play = { kick, balls, engine };
  }
}
