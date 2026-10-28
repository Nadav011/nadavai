/* AVATAR: Nadav walks the site as a guide.
 *
 *   import { initAvatar, avatar } from './sections/avatar/avatar.js';
 *   const destroy = initAvatar({ gsap, ScrollTrigger, lenis, atlasUrl, extraUrl });
 *   avatar.goTo(el, { pose: 'point' | 'sit' | 'kick' | ..., say: 'טקסט' });   // -> Promise
 *   avatar.perform('kick' | 'celebrate' | 'laptop' | 'thumbs-up' | ...);      // -> Promise
 *   avatar.say('טקסט');
 *   destroy();                                                                 // removes everything
 *
 * The same methods also hang off the returned cleanup function (destroy.goTo, ...).
 * Atlases: assets/avatar/v2/spritesheet@2x.webp (Codex pet layout, 8x9 cells of 384x416) and
 * assets/avatar/v2/site-extra@2x.webp (row map in site-extra.json). The atlas layout and the per-row
 * timings follow the Codex pet format played by claude-pet's sprite.ts (MIT, a fork of yBookoff/claude_pet).
 * Motion runs on GSAP's ticker only; no rAF loops or scroll listeners of our own when ScrollTrigger is present.
 * Reduced motion: a still idle frame, no running or tweening, poses shown as a single held frame; the menu works.
 * Phones (coarse pointer or <= 900px, ANSWERS #68): he waits in the dock as his head and comes out only on a tap,
 * with the menu open. Any scroll, or the end of a guided stop, folds him back into the dock, so he never walks over
 * text, chips or cards on a phone. Parking there is not saved (the stored minimise is the visitor's own choice).
 */

const CELL_W = 384, CELL_H = 416, COLS = 8;
const BASE_Y = 404;             // feet line inside a cell
const SEAT_Y = 296;             // underside of the thighs in the `sit` row (site-extra.json seatY)
const HIT = { x: 107, y: 30, w: 170, h: 374 };   // the figure's hit box inside a cell (physical px of the 2x cell)
const FIG_H = 370;              // standing figure height in the cell
const HEAD = { x: 122, y: 32, s: 140 };          // head crop for the minimised button (idle frame 0)

const rep = (ms, n, last) => [...Array(n - 1).fill(ms), last];
const ROWS = {
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
ROWS.running = ROWS.working;          // Codex name for the same row
const LOOPING = new Set(['idle', 'sit', 'laptop', 'working', 'running']);
const BESIDE = new Set(['point', 'waving', 'idle', 'review', 'waiting']);   // stand next to the target, not on it
const NO_SHADOW = new Set(['jumping', 'celebrate', 'sit']);

const STORE_KEY = 'nadavai.avatar.minimized';
const readMin = () => { try { return localStorage.getItem(STORE_KEY) === '1'; } catch { return false; } };
const writeMin = (v) => { try { v ? localStorage.setItem(STORE_KEY, '1') : localStorage.removeItem(STORE_KEY); } catch { /* storage blocked */ } };

const DEFAULT_TARGETS = {
  services: { sel: '#services', href: __href('services'), pose: 'point', say: __t('avatar.point.services') },
  work: { sel: '#work', href: __href('work'), pose: 'point', say: __t('avatar.point.live') },
  check: { sel: '#check', href: __href('check'), pose: 'thumbs-up', say: __t('avatar.point.check') },
  whatsapp: { href: 'https://wa.me/972504401760?text=' + encodeURIComponent(__t('wa.general')) },
};
/** Things he never stands over: CTAs and anything clickable or typeable. Extend it with `${DEFAULT_CTA}, .my-dock`. */
export const DEFAULT_CTA = 'a[href*="wa.me"], [data-cta], .cta, .btn, .button, [class*="__cta"], [class*="-cta"], '
  + 'button, [role="button"], a[href], input, select, textarea, summary';

const noop = () => {};
let current = null;
/** Live handle for sections: forwards to the mounted avatar, no-ops when none is mounted. */
export const avatar = {
  goTo: (...a) => (current ? current.goTo(...a) : Promise.resolve()),
  perform: (...a) => (current ? current.perform(...a) : Promise.resolve()),
  say: (...a) => current?.say(...a),
  home: (...a) => (current ? current.home(...a) : Promise.resolve()),
  minimize: (...a) => current?.minimize(...a),
  get state() { return current?.state ?? null; },
};

export function initAvatar({
  gsap, ScrollTrigger = null, lenis = null, atlasUrl, extraUrl,
  targets = {}, ctaSelector = DEFAULT_CTA, navOffset = 76, root = document.body,
} = {}) {
  if (!gsap || !atlasUrl || !root) return noop;
  // the layer's own styles travel with the module: a page that only imports avatar.js gets them too,
  // so the layer is always fixed, clipped and contained (no horizontal overflow, in RTL or LTR)
  if (!document.querySelector('link[href$="avatar.css"]')) {
    const css = document.createElement('link');
    css.rel = 'stylesheet'; css.href = new URL('./avatar.css', import.meta.url).href;
    document.head.appendChild(css);
  }
  current?.destroy();

  const T = { ...DEFAULT_TARGETS, ...targets };
  const rtl = (document.documentElement.dir || getComputedStyle(document.documentElement).direction) === 'rtl';
  const mqReduce = matchMedia('(prefers-reduced-motion: reduce)');
  let reduce = mqReduce.matches;
  const mqPhone = matchMedia('(pointer: coarse), (max-width: 900px)');
  let phone = mqPhone.matches;

  /* ── DOM ─────────────────────────────────────────────── */
  const el = document.createElement('div');
  el.className = 'nav-avatar';
  el.dir = rtl ? 'rtl' : 'ltr';
  el.innerHTML = `
    <div class="nav-avatar__actor">
      <div class="nav-avatar__say" role="status" aria-live="polite"><p class="nav-avatar__say-t"></p></div>
      <div class="nav-avatar__bubble" hidden>
        <p class="nav-avatar__hi" id="nav-avatar-hi">${__t('avatar.menu.title')}</p>
        <div class="nav-avatar__menu" id="nav-avatar-menu" role="menu" aria-labelledby="nav-avatar-hi">
          <button type="button" role="menuitem" class="nav-avatar__item" data-go="services"><span>${__t('avatar.menu.services')}</span><i aria-hidden="true"></i></button>
          <button type="button" role="menuitem" class="nav-avatar__item" data-go="work"><span>${__t('avatar.menu.work')}</span><i aria-hidden="true"></i></button>
          <button type="button" role="menuitem" class="nav-avatar__item" data-go="check"><span>${__t('avatar.menu.check')}</span><i aria-hidden="true"></i></button>
          <a role="menuitem" class="nav-avatar__item nav-avatar__item--wa" href="${T.whatsapp.href}" target="_blank" rel="noopener"><span>${__t('avatar.menu.whatsapp')}</span><i aria-hidden="true"></i><span class="nav-avatar__sr">${__t('global.newWindow')}</span></a>
          <button type="button" role="menuitem" class="nav-avatar__item nav-avatar__item--quiet" data-act="min"><span>${__t('avatar.menu.hide')}</span></button>
        </div>
      </div>
      <button type="button" class="nav-avatar__btn" aria-label="${__t('avatar.aria')}" aria-haspopup="menu" aria-expanded="false" aria-controls="nav-avatar-menu">
        <span class="nav-avatar__sprite" aria-hidden="true"><span class="nav-avatar__glint nav-avatar__glint--a"></span><span class="nav-avatar__glint nav-avatar__glint--b"></span></span>
      </button>
      <button type="button" class="nav-avatar__x" aria-label="${__t('avatar.minimize.aria')}"><svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6h7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button>
    </div>
    <button type="button" class="nav-avatar__head" aria-label="${__t('avatar.show')}" hidden><span class="nav-avatar__face" aria-hidden="true"></span></button>`;
  root.appendChild(el);

  const $ = (s) => el.querySelector(s);
  const actor = $('.nav-avatar__actor');
  const btn = $('.nav-avatar__btn');
  const sprite = $('.nav-avatar__sprite');
  const bubble = $('.nav-avatar__bubble');
  const menu = $('.nav-avatar__menu');
  const items = Array.from(el.querySelectorAll('.nav-avatar__item'));
  const sayBox = $('.nav-avatar__say');
  const sayText = $('.nav-avatar__say-t');
  const xBtn = $('.nav-avatar__x');
  const head = $('.nav-avatar__head');
  const face = $('.nav-avatar__face');

  const off = [];
  const on = (t, ev, fn, opt) => { t.addEventListener(ev, fn, opt); off.push(() => t.removeEventListener(ev, fn, opt)); };
  // ship 1x atlases; on dense screens ask for the @2x twin (same cell geometry, the CSS sizes are in px)
  const dense = (window.devicePixelRatio || 1) >= 1.5;
  const res = (u) => (u && dense && /\.webp$/.test(u) && !/@2x\.webp$/.test(u) ? u.replace(/\.webp$/, '@2x.webp') : u);
  const urls = { pet: res(atlasUrl), extra: res(extraUrl || atlasUrl) };
  const atlasRows = { pet: 9, extra: 6 };

  /* ── geometry ────────────────────────────────────────── */
  let k = 1, vw = 0, vh = 0, margin = 16, bottom = 14;
  const box = { w: 0, h: 0 };      // hit box (the figure) in px
  const measure = () => {
    vw = document.documentElement.clientWidth;
    vh = window.innerHeight;
    const h = parseFloat(getComputedStyle(el).getPropertyValue('--av-h')) || 144;
    k = h / CELL_H;
    box.w = HIT.w * k; box.h = HIT.h * k;
    margin = vw < 761 ? 12 : 20;
    const safe = parseFloat(getComputedStyle(el).getPropertyValue('--av-safe')) || 0;
    bottom = (vw < 761 ? 10 : 16) + safe;
    sprite.style.left = `${-HIT.x * k}px`;
    sprite.style.top = `${-HIT.y * k}px`;
    const fs = 56 / HEAD.s;
    face.style.backgroundImage = `url("${urls.pet}")`;
    face.style.backgroundSize = `${COLS * CELL_W * fs}px ${atlasRows.pet * CELL_H * fs}px`;
    face.style.backgroundPosition = `${-HEAD.x * fs}px ${-HEAD.y * fs}px`;
    draw(true);
  };
  const homeX = () => (rtl ? vw - margin - box.w / 2 : margin + box.w / 2);
  const homeY = () => vh - bottom;
  const trackLen = () => Math.max(0, Math.min(vw - 2 * margin - box.w, vw < 761 ? vw * 0.6 : 560));
  const trackMin = () => (rtl ? homeX() - trackLen() : homeX());
  const trackMax = () => (rtl ? homeX() : homeX() + trackLen());
  const clampX = (x) => Math.min(vw - margin - box.w / 2, Math.max(margin + box.w / 2, x));
  const clampY = (y) => Math.min(homeY(), Math.max(navOffset + FIG_H * k + 8, y));
  const boxAt = (x, y) => ({ left: x - box.w / 2, right: x + box.w / 2, top: y - box.h, bottom: y });
  /** The whole rendered sprite cell (wider than the hit box: arms, kicks, the ball) plus a margin. Every
   *  "is he over content?" test uses this, so a pose never pokes onto text or a control. */
  const fullAt = (x, y, m = 10) => {
    const l = x - box.w / 2 - HIT.x * k, t = y - box.h - HIT.y * k;
    return { left: l - m, right: l + CELL_W * k + m, top: t - m, bottom: t + CELL_H * k + m };
  };

  /* ── sprite player ───────────────────────────────────── */
  const P = { name: 'idle', i: 0, t: 0, mode: 'loop', done: null, hold: 0 };
  let drawn = { atlas: '', name: '', i: -1, k: 0 };
  function draw(force) {
    const r = ROWS[P.name];
    if (!force && drawn.name === P.name && drawn.i === P.i && drawn.k === k) return;
    if (force || drawn.atlas !== r.atlas || drawn.k !== k) {
      sprite.style.backgroundImage = `url("${urls[r.atlas]}")`;
      sprite.style.backgroundSize = `${COLS * CELL_W * k}px ${atlasRows[r.atlas] * CELL_H * k}px`;
    }
    sprite.style.backgroundPosition = `${-P.i * CELL_W * k}px ${-r.row * CELL_H * k}px`;
    el.dataset.row = P.name;
    drawn = { atlas: r.atlas, name: P.name, i: P.i, k };
  }
  /** Play a row. loop: forever; once: through, then resolve; hold: through, keep the last frame for `hold` ms. */
  function play(name, mode = 'loop', hold = 0) {
    if (!ROWS[name]) name = 'idle';
    if (P.name === name && P.mode === mode && mode === 'loop') return Promise.resolve();
    P.done?.(false);
    return new Promise((resolve) => {
      Object.assign(P, { name, mode, i: 0, t: 0, hold, done: resolve });
      const n = ROWS[name].d.length;
      if (reduce) {                       // still frame: the pose's last frame, idle's first
        P.i = mode === 'loop' ? 0 : n - 1;
        draw();
        if (mode !== 'loop') P.t = -Math.max(900, hold);   // keep the still pose briefly, then resolve
        else resolve(true);
        return;
      }
      draw();
    });
  }
  function stepSprite(dt) {
    const d = ROWS[P.name].d;
    if (reduce) {
      if (P.mode !== 'loop' && P.t < 0 && (P.t += dt) >= 0) finish();
      return;
    }
    P.t += dt;
    while (P.t >= (P.i === d.length - 1 && P.mode === 'hold' ? d[P.i] + P.hold : d[P.i])) {
      P.t -= P.i === d.length - 1 && P.mode === 'hold' ? d[P.i] + P.hold : d[P.i];
      if (P.i < d.length - 1) P.i++;
      else if (P.mode === 'loop') { P.i = 0; if (P.done) { const f = P.done; P.done = null; f(true); } }
      else { finish(); return; }
    }
    draw();
  }
  const restRow = () => (mode === 'anchored' && anchor?.pose === 'sit' ? 'sit' : 'idle');
  function finish() {
    const f = P.done; P.done = null;
    Object.assign(P, { name: restRow(), mode: 'loop', i: 0, t: 0 });
    draw();
    f?.(true);
  }

  /* ── position ────────────────────────────────────────── */
  const pos = { x: 0, y: 0 };
  let mode = 'home';                  // home | guided | anchored
  let anchor = null;                  // { target, pose }
  let tween = null;
  const apply = () => {
    actor.style.transform = `translate3d(${(pos.x - box.w / 2).toFixed(1)}px, ${(pos.y - box.h).toFixed(1)}px, 0)`;
  };
  const kill = () => { tween?.kill(); tween = null; };

  function travel(to, { run = true } = {}) {
    kill();
    if (reduce) { pos.x = to.x; pos.y = to.y; apply(); return Promise.resolve(); }
    return new Promise((resolve) => {
      const tl = gsap.timeline({ onUpdate: apply, onComplete: () => { tween = null; resolve(); }, onInterrupt: resolve });
      const dx = to.x - pos.x, dy = to.y - pos.y;
      const speed = vw < 761 ? 300 : 440;
      if (Math.abs(dx) > 2) {
        const dur = Math.min(1.5, Math.max(0.25, Math.abs(dx) / speed));
        tl.call(() => { if (run) play(dx < 0 ? 'running-left' : 'running-right'); });
        tl.to(pos, { x: to.x, duration: dur, ease: 'none' });
      }
      if (Math.abs(dy) > 6) {       // hop up onto a card, or drop down to the floor
        const peak = Math.min(pos.y, to.y) - 36 * (k / 0.346);
        tl.call(() => play('jumping', 'once'));
        tl.to(pos, { y: peak, duration: 0.22, ease: 'power2.out' });
        tl.to(pos, { y: to.y, duration: 0.26, ease: 'power2.in' });
      }
      tl.call(() => { if (P.name.startsWith('running')) play('idle'); });
      tween = tl;
    });
  }

  /* ── CTA avoidance ───────────────────────────────────── */
  const hits = (b) => {
    for (const c of document.querySelectorAll(ctaSelector)) {
      if (el.contains(c)) continue;
      const r = c.getBoundingClientRect();
      if (!r.width || !r.height || r.bottom < 0 || r.top > vh) continue;
      if (b.left < r.right + 8 && b.right > r.left - 8 && b.top < r.bottom + 8 && b.bottom > r.top - 8) return true;
    }
    return false;
  };
  /** Nearest x on the same line whose box passes `ok` (default: covers no CTA), or null. */
  function freeX(x, y, lo = margin + box.w / 2, hi = vw - margin - box.w / 2, ok = (b) => !hits(b)) {
    if (x >= lo && x <= hi && ok(boxAt(x, y))) return x;
    const step = Math.max(16, box.w / 3);
    for (let s = step; s < vw; s += step) {
      for (const c of [x - s, x + s]) if (c >= lo && c <= hi && ok(boxAt(c, y))) return c;
    }
    return null;
  }
  let ducked = false;
  /** After a stop on the floor: off CTAs and text on his own track, then anywhere on the floor, else step aside. */
  function settle() {
    if (mode !== 'home' || minimized) return;
    const tLo = Math.min(trackMin(), trackMax()), tHi = Math.max(trackMin(), trackMax());
    const clean = (b) => { const f = fullAt((b.left + b.right) / 2, b.bottom); return !hits(f) && !coversText(f); };
    // his lane is the track along the reading-start edge; never a spot over a control or text
    const fx = freeX(pos.x, pos.y, tLo, tHi, clean) ?? freeX(pos.x, pos.y, undefined, undefined, clean);
    if (fx === null) { duck(true); return; }
    duck(false);
    if (Math.abs(fx - pos.x) > 1) travel({ x: fx, y: pos.y });
  }
  function duck(v) {        // nowhere free on the floor: step aside, leave the head button
    if (ducked === v) return;
    ducked = v;
    el.toggleAttribute('data-ducked', v);
    // phones: the head waits in the dock while he steps aside; desktop: he simply steps out of view
    head.hidden = !(minimized || (v && vw < 761));
  }

  /* ── targets ─────────────────────────────────────────── */
  const anchorOf = (t) => (t.matches?.('section, [data-avatar-section]') ? t.querySelector('[data-avatar-anchor], h2, h1') || t : t);
  const ARM = 70;                               // how far the pointing hand reaches past the hit box (cell px)
  /** Candidate spots around a target, best first: beside it for `point`-like poses, otherwise along its top edge. */
  function candidates(target, pose) {
    const r = target.getBoundingClientRect();
    const out = [];
    if (BESIDE.has(pose)) {                     // to its right: `point` aims at the viewer's left
      const x = r.right + box.w / 2 + 10 + (pose === 'point' ? ARM * k : 0);
      if (x + box.w / 2 + margin <= vw) out.push({ x, y: Math.min(r.bottom, r.top + FIG_H * k) });
    }
    const y = pose === 'sit' ? r.top + (BASE_Y - SEAT_Y) * k : r.top + 2;
    const lo = r.left + box.w * 0.6 + 12, hi = r.right - box.w * 0.6 - 12;
    for (let x = hi; x >= lo; x -= box.w / 2) out.push({ x, y });
    if (!out.length) out.push({ x: (r.left + r.right) / 2, y });
    return out.map((c) => ({ x: clampX(c.x), y: clampY(c.y) }));
  }
  /** Does a box cover visible text (glyph rects, not element boxes) outside the avatar? */
  function coversText(b) {
    const walk = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode: (n) => (n.nodeValue.trim() && !el.contains(n.parentNode) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT),
    });
    const range = document.createRange();
    for (let n = walk.nextNode(); n; n = walk.nextNode()) {
      const pr = n.parentNode.getBoundingClientRect?.();
      if (pr && (pr.bottom < b.top || pr.top > b.bottom || pr.right < b.left || pr.left > b.right)) continue;
      range.selectNodeContents(n);
      for (const q of range.getClientRects()) {
        if (b.left < q.right && b.right > q.left && b.top < q.bottom && b.bottom > q.top) return true;
      }
    }
    return false;
  }
  const figBox = (c) => boxAt(c.x, c.y);
  function chooseSpot(target, pose) {
    const list = candidates(target, pose);
    return list.find((c) => !hits(figBox(c)) && !coversText(figBox(c)))
      || list.find((c) => !hits(figBox(c))) || list[0];
  }
  function scrollTo(target) {
    const r = target.getBoundingClientRect();
    const want = vh * 0.3;
    if (r.top > navOffset && r.top < vh * 0.55) return Promise.resolve();
    const top = window.scrollY + r.top - want;
    return new Promise((resolve) => {
      const done = () => { clearTimeout(tm); resolve(); };
      const tm = setTimeout(done, reduce ? 50 : 2200);
      if (lenis && !reduce) lenis.scrollTo(top, { duration: 1.1, onComplete: done });
      else {
        window.scrollTo({ top, behavior: reduce ? 'instant' : 'smooth' });
        if (reduce) done(); else on(window, 'scrollend', done, { once: true });
      }
    });
  }

  /* ── public actions ──────────────────────────────────── */
  let seq = 0;
  async function goTo(target, { pose = 'point', say: text = '', scroll = true } = {}) {
    if (typeof target === 'string') target = document.querySelector(target);
    if (!target || minimized) return;
    const my = ++seq;
    closeMenu(false);
    kill();
    mode = 'guided'; anchor = null; duck(false);
    const a = anchorOf(target);
    if (scroll) {
      if (!reduce) play(window.scrollY + a.getBoundingClientRect().top - vh * 0.3 > window.scrollY ? (rtl ? 'running-left' : 'running-right') : (rtl ? 'running-right' : 'running-left'));
      await scrollTo(a);
    }
    if (my !== seq) return;
    const spot = chooseSpot(a, pose);
    await travel(spot);
    if (my !== seq) return;
    const r = a.getBoundingClientRect();
    mode = 'anchored'; outAt = performance.now();
    anchor = { target: a, pose, ox: spot.x - r.left, oy: spot.y - r.top };   // rides along with the target
    if (text) say(text);
    await perform(pose);
  }
  function perform(name = 'waving') {
    if (!ROWS[name]) return Promise.resolve();
    if (LOOPING.has(name)) return play(name, 'loop');
    return play(name, name === 'point' ? 'hold' : 'once', name === 'point' ? 1400 : 0);
  }
  let sayTimer = 0;
  function say(text, ms) {
    clearTimeout(sayTimer);
    if (!text) { sayBox.classList.remove('is-on'); return; }
    if (menuOpen) closeMenu(false);
    sayText.textContent = text;
    sayBox.classList.add('is-on');
    fit(sayBox);
    sayTimer = setTimeout(() => sayBox.classList.remove('is-on'), ms || Math.max(2600, text.length * 75));
  }
  function home() {
    if (phone) { park(); return Promise.resolve(); }
    seq++; mode = 'home'; anchor = null;
    return travel({ x: homeX(), y: homeY() }).then(settle);
  }
  function release() {      // the anchored target left the screen: drop back to the floor
    if (phone) { park(); return; }
    mode = 'home'; anchor = null;
    pos.x = Math.min(Math.max(pos.x, Math.min(trackMin(), trackMax())), Math.max(trackMin(), trackMax()));
    if (pos.y < 0 || pos.y - box.h > vh) pos.y = pos.y < 0 ? -box.h : vh + box.h;
    travel({ x: pos.x, y: homeY() }, { run: false }).then(settle);
  }

  /* ── menu ────────────────────────────────────────────── */
  let menuOpen = false;
  function fit(node) {    // keep a bubble inside the viewport (measured at full size, before its pop-in)
    node.style.translate = '0 0';
    node.classList.remove('is-side');
    node.classList.add('is-measuring');
    const r = node.getBoundingClientRect();
    if (r.top < navOffset) node.classList.add('is-side');
    const r2 = node.getBoundingClientRect();
    const dx = r2.left < 8 ? 8 - r2.left : r2.right > vw - 8 ? vw - 8 - r2.right : 0;
    const dy = r2.bottom > vh - 8 ? vh - 8 - r2.bottom : 0;
    node.style.translate = `${dx}px ${dy}px`;
    node.classList.remove('is-measuring');
  }
  function openMenu() {
    if (menuOpen) return;
    menuOpen = true;
    say('');
    bubble.hidden = false;
    btn.setAttribute('aria-expanded', 'true');
    fit(bubble);
    requestAnimationFrame(() => bubble.classList.add('is-on'));
    items[0].focus();
    if (!reduce && !P.done && restRow() === 'idle') play('waving', 'once');
  }
  function closeMenu(refocus = true) {
    if (!menuOpen) return;
    menuOpen = false;
    bubble.classList.remove('is-on');
    bubble.hidden = true;
    btn.setAttribute('aria-expanded', 'false');
    if (refocus) {
      btn.focus();
      // phones: the guide may tuck himself back into the dock as the menu closes; the focus follows him there
      requestAnimationFrame(() => { if (document.activeElement !== btn || !btn.offsetWidth) head?.focus?.(); });
    }
  }
  on(btn, 'click', () => (menuOpen ? closeMenu() : openMenu()));
  on(menu, 'keydown', (e) => {
    const i = items.indexOf(document.activeElement);
    const go = (j) => { e.preventDefault(); items[(j + items.length) % items.length].focus(); };
    if (e.key === 'ArrowDown') go(i + 1);
    else if (e.key === 'ArrowUp') go(i - 1);
    else if (e.key === 'Home') go(0);
    else if (e.key === 'End') go(items.length - 1);
    else if (e.key === 'Escape') { e.preventDefault(); closeMenu(); }
    else if (e.key === 'Tab') closeMenu(false);
  });
  on(btn, 'keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
  on(document, 'pointerdown', (e) => { if (menuOpen && !actor.contains(e.target)) closeMenu(false); });
  on(menu, 'click', (e) => {
    const it = e.target.closest('.nav-avatar__item');
    if (!it) return;
    if (it.dataset.act === 'min') { closeMenu(false); minimize(true, !phone); head.focus(); return; }
    if (it.classList.contains('nav-avatar__item--wa')) { closeMenu(false); perform('thumbs-up'); return; }
    const t = T[it.dataset.go];
    if (!t) return;
    const target = t.sel && document.querySelector(t.sel);
    closeMenu(false);
    if (target) { btn.focus({ preventScroll: true }); goTo(target, { pose: t.pose, say: t.say }); }
    else if (t.href) location.href = t.href;
  });

  /* ── hover, minimise ─────────────────────────────────── */
  on(btn, 'pointerenter', (e) => {
    if (e.pointerType === 'mouse' && !reduce && !tween && mode !== 'guided' && (P.name === 'idle' || P.name === 'review')) play('waving', 'loop');
  });
  on(btn, 'pointerleave', () => { if (P.name === 'waving' && P.mode === 'loop') play(anchor?.pose === 'sit' ? 'sit' : 'idle'); });
  let minimized = false;
  function minimize(v = true, persist = true) {
    minimized = !!v;
    if (persist) writeMin(minimized);
    closeMenu(false); say('');
    el.toggleAttribute('data-min', minimized);
    if (minimized) { seq++; kill(); mode = 'home'; anchor = null; }
    actor.hidden = minimized;
    head.hidden = !(minimized || ducked);
    if (!minimized) { mode = 'home'; anchor = null; kill(); pos.x = homeX(); pos.y = homeY(); apply(); play('waving', 'once'); }
  }
  on(xBtn, 'click', () => { minimize(true, !phone); head.focus(); });
  on(head, 'click', () => {
    if (ducked && !minimized) { duck(false); openMenu(); return; }
    if (phone) { minimize(false, false); outAt = performance.now(); openMenu(); return; }   // out of the dock, menu open
    minimize(false); btn.focus();
  });
  /** Phones: back into the dock, without saving it; the focus follows him if it was on him. */
  let outAt = 0;
  function park() {
    if (minimized) return;
    const had = el.contains(document.activeElement) && document.activeElement !== head;
    minimize(true, false);
    if (had) head.focus({ preventScroll: true });
  }

  /* ── scroll: run in the scroll direction, stop and look around ── */
  let lastScroll = -1e9, scrollDir = 1, scrolling = false, overAt = 0, restAt = 0;
  const onScroll = (dir) => { lastScroll = performance.now(); if (dir) scrollDir = dir; };
  let st = null, lastY = window.scrollY;
  if (ScrollTrigger) st = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: (s) => onScroll(s.direction) });
  else on(window, 'scroll', () => { const y = window.scrollY; onScroll(y > lastY ? 1 : -1); lastY = y; }, { passive: true });

  let glintAt = performance.now() + 3000;
  function tick(_t, dtMs) {
    const dt = Math.min(dtMs || 16, 100);
    const now = performance.now();
    if (phone && !minimized && mode !== 'guided' && now - lastScroll < 170 && lastScroll > outAt + 450) { park(); stepSprite(dt); return; }
    if (mode === 'anchored' && anchor) {
      if (!anchor.target.isConnected) release();
      else {
        const r = anchor.target.getBoundingClientRect();
        pos.x = r.left + anchor.ox; pos.y = r.top + anchor.oy;
        if (pos.y < navOffset * 0.5 || pos.y - box.h > vh) release();
        apply();
      }
    } else if (mode === 'home' && !minimized && !reduce && !menuOpen) {
      const active = now - lastScroll < 170;
      if (active) {
        if (!scrolling) { scrolling = true; kill(); duck(false); }
        const move = (rtl ? -1 : 1) * scrollDir;
        const speed = (vw < 761 ? 170 : 240) / 1000;
        const lo = Math.min(trackMin(), trackMax(), pos.x), hi = Math.max(trackMin(), trackMax(), pos.x);   // never snap
        pos.x = Math.min(Math.max(pos.x + move * speed * dt, lo), hi);
        pos.y = homeY();
        play(move < 0 ? 'running-left' : 'running-right');
        apply();
        if (now - overAt > 220) { overAt = now; const b = fullAt(pos.x, pos.y); el.toggleAttribute('data-over', hits(b) || coversText(b)); }
      } else if (scrolling) {
        scrolling = false; el.removeAttribute('data-over');
        settle();                                   // off text and controls right away, the glance follows
        play('review', 'once');
        restAt = now;
      } else if (now - restAt > 1200) {             // at rest: the page under him changes (reveals, builds)
        restAt = now;
        const b = fullAt(pos.x, pos.y);
        if (ducked || hits(b) || coversText(b)) settle();
      }
    }
    stepSprite(dt);
    if (!reduce && P.name === 'idle' && now > glintAt) {
      el.classList.remove('is-glint'); void sprite.offsetWidth; el.classList.add('is-glint');
      glintAt = now + 4200 + Math.random() * 3000;
    }
  }
  gsap.ticker.add(tick);

  const onReduce = () => { reduce = mqReduce.matches; kill(); P.done?.(false); P.done = null; Object.assign(P, { name: 'idle', mode: 'loop', i: 0, t: 0 }); draw(); };
  on(mqReduce, 'change', onReduce);
  on(mqPhone, 'change', () => {
    phone = mqPhone.matches;
    if (phone) park();
    else if (minimized && !readMin()) minimize(false, false);   // parked only because of the phone: out again on desktop
  });
  const onResize = () => {
    measure();
    if (mode === 'home') { kill(); pos.x = Math.min(Math.max(pos.x, Math.min(trackMin(), trackMax())), Math.max(trackMin(), trackMax())); pos.y = homeY(); }
    apply();
    if (menuOpen) fit(bubble);
  };
  on(window, 'resize', onResize);

  // first paint: at home, idle; preload the extra atlas so the first pose does not flash
  measure();
  pos.x = homeX(); pos.y = homeY(); apply();
  (window.requestIdleCallback || ((f) => setTimeout(f, 1500)))(() => { const pre = new Image(); pre.src = urls.extra; });
  if (readMin() || phone) minimize(true, false);
  requestAnimationFrame(() => el.classList.add('is-ready'));

  const api = {
    goTo, perform, say, home, minimize,
    get state() { return { mode, row: P.name, frame: P.i, minimized, ducked, menuOpen, x: Math.round(pos.x), y: Math.round(pos.y), reduce }; },
    destroy,
  };
  function destroy() {
    gsap.ticker.remove(tick);
    kill(); st?.kill(); clearTimeout(sayTimer);
    off.forEach((f) => f());
    el.remove();
    if (current === api) current = null;
  }
  current = api;
  const handle = () => destroy();
  Object.assign(handle, { goTo, perform, say, home, minimize, destroy });
  Object.defineProperty(handle, 'state', { get: () => api.state });
  return handle;
}
