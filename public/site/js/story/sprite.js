// sprite.js: Nadav's avatar as an in-page actor (the guide in sections/avatar walks the viewport; this one
// stands inside a scene). Same atlases and per-row timings as the guide: the Codex pet layout played by
// claude-pet's sprite.ts (MIT, a fork of yBookoff/claude_pet). 8 columns of 384x416 cells at 2x.
//
//   const a = createSprite(host, { base: 'assets/avatar/' });
//   a.play('laptop')            loops a looping row; one-shot rows resolve when done, then rest on `rest`
//   a.play('kick', { once: true, rest: 'idle', onFrame(i) {} })  -> Promise
//   a.say('טקסט', 5000)         speech bubble, polite live region
// Runs on requestAnimationFrame only while the host is on screen. Reduced motion: one held frame per pose.

const rep = (ms, n, last) => [...Array(n - 1).fill(ms), last];
export const ROWS = {
  idle: { atlas: 'pet', row: 0, d: [280, 110, 110, 140, 140, 320] },
  'running-right': { atlas: 'pet', row: 1, d: rep(92, 8, 92) },
  'running-left': { atlas: 'pet', row: 2, d: rep(92, 8, 92) },
  waving: { atlas: 'pet', row: 3, d: rep(140, 4, 280) },
  jumping: { atlas: 'pet', row: 4, d: rep(110, 5, 160) },
  failed: { atlas: 'pet', row: 5, d: rep(140, 8, 240) },
  waiting: { atlas: 'pet', row: 6, d: rep(150, 6, 260) },
  working: { atlas: 'pet', row: 7, d: rep(120, 6, 220) },
  review: { atlas: 'pet', row: 8, d: rep(150, 6, 280) },
  point: { atlas: 'extra', row: 0, d: [120, 120, 160, 900] },
  kick: { atlas: 'extra', row: 1, d: [160, 140, 90, 110, 140, 300] },
  celebrate: { atlas: 'extra', row: 2, d: [120, 110, 160, 110, 160, 500] },
  sit: { atlas: 'extra', row: 3, d: [320, 260, 320, 260] },
  laptop: { atlas: 'extra', row: 4, d: [160, 140, 160, 140, 160, 420] },
  'thumbs-up': { atlas: 'extra', row: 5, d: [120, 120, 140, 700] },
};
const LOOPING = new Set(['idle', 'sit', 'laptop', 'working', 'waiting', 'review', 'running-right', 'running-left']);
const ATLAS = { pet: { file: 'spritesheet@2x.webp', rows: 9 }, extra: { file: 'site-extra@2x.webp', rows: 6 } };

export function createSprite(host, { base = '/site/assets/avatar/', start = 'idle', reduce = false, label = '', flip = false } = {}) {
  const el = document.createElement('div');
  el.className = 'spr' + (flip ? ' spr--flip' : '');
  if (label) { el.setAttribute('role', 'img'); el.setAttribute('aria-label', label); } else el.setAttribute('aria-hidden', 'true');
  el.innerHTML = '<span class="spr__shadow"></span><span class="spr__img"></span><span class="bub" role="status" aria-live="polite"></span>';
  host.appendChild(el);
  const img = el.querySelector('.spr__img'), bub = el.querySelector('.bub');
  // preload both atlases so the first pose change does not flash
  Object.values(ATLAS).forEach((a) => { const i = new Image(); i.src = base + a.file; });

  const S = { name: start, i: 0, t: 0, once: false, rest: 'idle', done: null, onFrame: null };
  let curAtlas = '';
  function draw() {
    const r = ROWS[S.name];
    const a = ATLAS[r.atlas];
    if (curAtlas !== r.atlas) {
      curAtlas = r.atlas;
      img.style.backgroundImage = `url(${base}${a.file})`;
      img.style.backgroundSize = `800% ${a.rows * 100}%`;
    }
    img.style.backgroundPosition = `${(S.i / 7) * 100}% ${(r.row / (a.rows - 1)) * 100}%`;
  }
  function play(name, { once, rest = 'idle', onFrame = null } = {}) {
    if (!ROWS[name]) name = 'idle';
    S.done?.(false);
    const r = ROWS[name];
    S.name = name; S.t = 0; S.rest = rest; S.onFrame = onFrame;
    S.once = once ?? !LOOPING.has(name);
    if (reduce) {
      S.i = LOOPING.has(name) && name !== 'laptop' ? 0 : r.d.length - 1;
      draw();
      onFrame?.(r.d.length - 1);
      S.done = null;
      return Promise.resolve(true);
    }
    S.i = 0; draw(); onFrame?.(0);
    return new Promise((res) => { S.done = res; if (!S.once) { S.done = null; res(true); } });
  }

  let raf = 0, last = 0, visible = false;
  function tick(now) {
    raf = 0;
    if (!visible || reduce) return;
    const dt = Math.min(100, now - (last || now)); last = now;
    const r = ROWS[S.name];
    S.t += dt;
    while (S.t >= r.d[S.i]) {
      S.t -= r.d[S.i];
      if (S.i < r.d.length - 1) { S.i++; S.onFrame?.(S.i); }
      else if (S.once) { const d = S.done; S.done = null; S.onFrame = null; play(S.rest); d?.(true); break; }
      else S.i = 0;
    }
    draw();
    raf = requestAnimationFrame(tick);
  }
  const io = new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible && !raf && !reduce) { last = 0; raf = requestAnimationFrame(tick); }
  }, { rootMargin: '120px' });
  io.observe(el);
  play(start);

  let bt = 0;
  function say(text, ms = 5000) {
    clearTimeout(bt);
    bub.textContent = text;
    bub.classList.add('is-on');
    bt = setTimeout(() => bub.classList.remove('is-on'), ms);
  }
  function setReduce(v) { reduce = v; play(S.name, { once: S.once, rest: S.rest }); }
  return { el, play, say, setReduce, get state() { return S.name; }, destroy() { io.disconnect(); cancelAnimationFrame(raf); el.remove(); } };
}
