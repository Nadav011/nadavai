// work-pages.js: the shared boot for work.html and the app pages.
//   one clock     Lenis on the GSAP ticker, the site's reveal/decode language (motion.js, read-only import)
//   hero          the app's world drifts, a 3D phone (games/phone3d.js) replaces the poster when WebGL2 is there
//   gallery       a small cloud of screens; a click opens the card (FLIP into the site's .zd dialog), with paging
//   games         each [data-game] loads its module only when it comes near the viewport
//   index         filters (work.html) and cards that open: app cards zoom into their page, the rest into a panel
//   avatar        Nadav, the site's guide, kicks and celebrates with the games
// Everything degrades to a readable static page: reduced motion, no WebGL, no CDN.

import { initMotion } from './motion.js';
import { initSiteChrome } from './chrome-site.js';

const root = document.documentElement;
const reduce = root.classList.contains('reduce');
const { gsap, ScrollTrigger, Lenis } = window;
const engine = !!(gsap && ScrollTrigger);
const page = document.body.dataset.work || '';
const safe = (name, fn) => { try { return fn(); } catch (e) { console.warn(`[work] ${name} kept static`, e); return null; } };

let lenis = null;
if (engine) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

/* the avatar is optional: a live handle that no-ops until the module is mounted */
const avatar = {
  ref: null,
  perform(p) { return this.ref?.perform?.(p); },
  say(t) { return this.ref?.say?.(t); },
  goTo(el, o) { return this.ref?.goTo?.(el, o); },
};

/* ── hero: the world drifts, the 3D phone takes over ─────────── */
function initHero() {
  const hero = document.querySelector('.wkh');
  if (!hero) return;
  const world = hero.querySelector('.wkh__world');
  if (engine && !reduce && world) {
    gsap.to(world, { yPercent: 10, scale: 1.06, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });
    gsap.from(hero.querySelectorAll('.wkh__copy > *'), { autoAlpha: 0, y: 26, duration: 1.1, stagger: 0.08, ease: 'expo.out', delay: 0.1 });
  }
  const stage = hero.querySelector('.wkh__stage');
  if (!stage || reduce) return;
  if (!document.createElement('canvas').getContext('webgl2')) return;
  const shots = (stage.dataset.shots || '').split(',').map((s) => s.trim()).filter(Boolean);
  const start = () => import('./games/phone3d.js')
    .then((m) => m.mountPhone(stage, { shots, video: stage.dataset.video || '', accent: getComputedStyle(document.body).getPropertyValue('--app').trim() || '#E8913C', hero }))
    .catch((e) => console.warn('[work] 3D phone unavailable, the poster stays', e?.message));
  ('requestIdleCallback' in window) ? requestIdleCallback(start, { timeout: 900 }) : setTimeout(start, 200);
}

/* ── gallery: cards that open ─────────────────────────────────── */
const ICON_PREV = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3l5 5-5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_NEXT = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M10 3L5 8l5 5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const ICON_X = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

function initGallery() {
  const cloud = document.querySelector('.wkg__cloud');
  if (!cloud) return;
  const cards = [...cloud.querySelectorAll('.wkg__card')];
  const items = cards.map((b) => ({ src: b.querySelector('img').currentSrc || b.querySelector('img').src, cap: b.dataset.cap || '', alt: b.querySelector('img').alt, ar: parseFloat(b.dataset.ar || 540 / 1170) }));

  const dlg = document.createElement('div');
  dlg.className = 'zd zd--paged'; dlg.hidden = true;
  dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-labelledby', 'wkgCap');
  dlg.innerHTML = `<div class="zd__scrim"></div><figure class="zc zd__card"><div class="zc__glass"><img alt="" decoding="async"></div><figcaption class="zc__cap" id="wkgCap"><i aria-hidden="true"></i><span></span></figcaption></figure>
    <button type="button" class="zd__close" aria-label=__t('home.hero.dialog.close')>${ICON_X}</button>
    <div class="zd__nav"><button type="button" data-d="-1" aria-label=__t('sporchat.screens.prev')>${ICON_PREV}</button><span class="zd__count" dir="ltr" aria-live="polite"></span><button type="button" data-d="1" aria-label=__t('sporchat.screens.next')>${ICON_NEXT}</button></div>`;
  document.body.appendChild(dlg);
  const card = dlg.querySelector('.zd__card'), img = card.querySelector('img'), cap = card.querySelector('.zc__cap span');
  const scrim = dlg.querySelector('.zd__scrim'), close = dlg.querySelector('.zd__close'), count = dlg.querySelector('.zd__count');
  const btns = [close, ...dlg.querySelectorAll('.zd__nav button')];
  let cur = -1, last = null;

  const target = (ar) => {
    const vw = innerWidth, vh = innerHeight, mob = vw < 721;
    let h = Math.min(vh * (mob ? 0.72 : 0.7), 740), w = h * ar;
    if (w > vw * 0.88) { w = vw * 0.88; h = w / ar; }
    return { x: (vw - w) / 2, y: (vh - h) / 2 - (mob ? 26 : 42), w, h };
  };
  const place = (r) => Object.assign(card.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
  const rectOf = (i) => { const r = cards[i].getBoundingClientRect(); return { x: r.left, y: r.top, w: r.width, h: r.height }; };
  const from = (s, d) => ({ x: s.x - d.x, y: s.y - d.y, scale: s.w / d.w });
  const fill = (i) => { cur = i; const it = items[i]; img.src = it.src; img.alt = it.alt; cap.textContent = it.cap; count.textContent = `${i + 1} / ${items.length}`; };

  function open(i) {
    last = document.activeElement; fill(i);
    const T = target(items[i].ar); place(T);
    dlg.hidden = false; lenis?.stop();
    if (engine && !reduce) {
      gsap.fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
      gsap.fromTo(card, { ...from(rectOf(i), T), rotationY: -14 }, { x: 0, y: 0, scale: 1, rotationY: 0, duration: 0.85, ease: 'expo.out' });
    }
    close.focus({ preventScroll: true });
  }
  function shut() {
    if (dlg.hidden) return;
    const done = () => { dlg.hidden = true; lenis?.start(); gsap?.set?.(card, { clearProps: 'transform' }); (last || cards[cur])?.focus?.({ preventScroll: true }); };
    if (engine && !reduce) {
      const T = { x: parseFloat(card.style.left), y: parseFloat(card.style.top), w: parseFloat(card.style.width) };
      gsap.to(scrim, { autoAlpha: 0, duration: 0.3 });
      gsap.to(card, { ...from(rectOf(cur), T), rotationY: 10, duration: 0.55, ease: 'expo.inOut', onComplete: done });
    } else done();
  }
  function step(d) {
    const i = (cur + d + items.length) % items.length;
    fill(i); place(target(items[i].ar));
    if (engine && !reduce) gsap.fromTo(card, { x: d * -40, autoAlpha: 0.2, rotationY: d * 8 }, { x: 0, autoAlpha: 1, rotationY: 0, duration: 0.5, ease: 'expo.out' });
  }
  cards.forEach((b, i) => b.addEventListener('click', () => open(i)));
  scrim.addEventListener('click', shut);
  close.addEventListener('click', shut);
  dlg.querySelectorAll('.zd__nav button').forEach((b) => b.addEventListener('click', () => step(+b.dataset.d)));
  document.addEventListener('keydown', (e) => {
    if (dlg.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); shut(); }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); step(1); }     // RTL: left is "next"
    else if (e.key === 'ArrowRight') { e.preventDefault(); step(-1); }
    else if (e.key === 'Tab') {
      e.preventDefault();
      const k = btns.indexOf(document.activeElement);
      btns[(k + (e.shiftKey ? -1 : 1) + btns.length) % btns.length].focus();
    }
  });
  addEventListener('resize', () => { if (!dlg.hidden) place(target(items[cur].ar)); });

  // the cloud breathes and leans toward the pointer (desktop only)
  if (engine && !reduce && matchMedia('(hover: hover) and (min-width: 901px)').matches) {
    cards.forEach((c, i) => gsap.to(c, { y: i % 2 ? 8 : -8, duration: 2.6 + (i % 3) * 0.4, ease: 'sine.inOut', yoyo: true, repeat: -1, delay: i * 0.2 }));
    const qx = cards.map((c) => gsap.quickTo(c, 'rotationY', { duration: 0.8, ease: 'power3.out' }));
    cloud.addEventListener('pointermove', (e) => {
      const r = cloud.getBoundingClientRect(), nx = (e.clientX - r.left) / r.width - 0.5;
      cards.forEach((c, i) => qx[i]((i / (cards.length - 1) - 0.5) * -18 + nx * 10));
    });
    cloud.addEventListener('pointerleave', () => qx.forEach((q) => q(0)));
    gsap.from(cards, { autoAlpha: 0, y: 60, rotationY: -25, z: -200, duration: 1.2, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: cloud, start: 'top 82%', once: true } });
  }
}

/* ── games: load each one when it comes near ───────────────── */
function initGames() {
  const els = [...document.querySelectorAll('[data-game]')];
  if (!els.length) return;
  const env = { gsap: engine ? gsap : null, reduce, avatar, lenis };
  const load = (el) => {
    if (el.dataset.loaded) return; el.dataset.loaded = '1';
    import(`./games/${el.dataset.game}.js`).then((m) => m.init(el, env)).catch((e) => { console.warn(`[work] game ${el.dataset.game} kept static`, e?.message); el.classList.add('is-static'); });
  };
  if (!('IntersectionObserver' in window)) { els.forEach(load); return; }
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { io.unobserve(e.target); load(e.target); } }), { rootMargin: '50% 0px' });
  els.forEach((el) => io.observe(el));
}

/* ── index: filters + cards that open ─────────────────────── */
function initIndex() {
  const bar = document.querySelector('.wf');
  if (!bar) return;
  const btns = [...bar.querySelectorAll('.wf__b')];
  const cards = [...document.querySelectorAll('.wc, .wl__i')];
  const secs = [...document.querySelectorAll('.wi-sec')];
  const n = bar.querySelector('.wf__n');
  const empty = document.querySelector('.wi-empty');
  btns.forEach((b) => { const f = b.dataset.f; const c = f === 'all' ? cards.length : cards.filter((x) => x.dataset.cat.split(' ').includes(f)).length; b.querySelector('small').textContent = c; });

  function apply(f, animate = true) {
    const run = () => {
      btns.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.f === f)));
      let shown = 0;
      cards.forEach((c) => { const on = f === 'all' || c.dataset.cat.split(' ').includes(f); c.classList.toggle('is-out', !on); if (on) shown++; });
      secs.forEach((s) => { s.hidden = !s.querySelector('.wc:not(.is-out), .wl__i:not(.is-out)'); });
      n.textContent = `${shown} עבודות`;
      if (empty) empty.hidden = shown > 0;
      ScrollTrigger?.refresh?.();
      // a filter shows its result at once: cards still waiting for their scroll reveal come in now
      if (engine && !reduce) { const wait = cards.filter((c) => !c.classList.contains('is-out') && +getComputedStyle(c).opacity < 0.5); if (wait.length) gsap.to(wait, { autoAlpha: 1, y: 0, duration: 0.7, stagger: 0.04, ease: 'expo.out', overwrite: true, clearProps: 'transform' }); }
    };
    if (animate && !reduce && document.startViewTransition) document.startViewTransition(run); else run();
    const url = new URL(location.href); if (f === 'all') url.searchParams.delete('f'); else url.searchParams.set('f', f);
    history.replaceState(null, '', url);
  }
  btns.forEach((b) => b.addEventListener('click', () => apply(b.dataset.f)));
  const q = new URLSearchParams(location.search).get('f');
  apply(btns.some((b) => b.dataset.f === q) ? q : 'all', false);
  cards.forEach((c, i) => { c.style.viewTransitionName = `wc-${i}`; });

  if (engine && !reduce) {
    gsap.set(cards, { autoAlpha: 0, y: 30 });
    ScrollTrigger.batch(cards, { start: 'top 92%', once: true, onEnter: (els) => gsap.to(els, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06, ease: 'expo.out', clearProps: 'transform' }) });
  }

  // app cards: zoom into the page on the way in
  document.querySelectorAll('a.wc').forEach((a) => a.addEventListener('click', (e) => {
    if (reduce || !engine || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    const media = a.querySelector('.wc__media');
    const src = a.dataset.world || media.querySelector('img')?.src;
    if (!src) return;
    e.preventDefault();
    const r = media.getBoundingClientRect();
    const z = document.createElement('div'); z.className = 'wzoom';
    z.innerHTML = `<img alt="" src="${src}">`;
    Object.assign(z.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    document.body.appendChild(z);
    const go = () => { location.href = a.href; };
    gsap.to(z, { left: 0, top: 0, width: innerWidth, height: innerHeight, borderRadius: 0, duration: 0.7, ease: 'expo.inOut', onComplete: go });
    setTimeout(go, 1200);
  }));
  addEventListener('pageshow', (e) => { if (e.persisted) document.querySelectorAll('.wzoom').forEach((z) => z.remove()); });

  // other work: the card opens into a panel
  const dlg = document.querySelector('.wz');
  if (!dlg) return;
  const panel = dlg.querySelector('.wz__panel'), scrim = dlg.querySelector('.wz__scrim'), x = dlg.querySelector('.wz__close');
  const mEl = dlg.querySelector('.wz__media'), kEl = dlg.querySelector('.wz__k'), hEl = dlg.querySelector('.wz__h'), pEl = dlg.querySelector('.wz__p'), noteEl = dlg.querySelector('.wz__note'), acts = dlg.querySelector('.wz__acts');
  let from = null, opener = null;
  const tgt = () => {
    const vw = innerWidth, vh = innerHeight, mob = vw < 721;
    const w = Math.min(vw - (mob ? 24 : 96), 1040), h = Math.min(vh - (mob ? 110 : 160), mob ? 680 : 600);
    return { x: (vw - w) / 2, y: Math.max(mob ? 74 : 90, (vh - h) / 2 + 10), w, h };
  };
  const place = (r) => Object.assign(panel.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
  function open(c) {
    opener = c;
    const media = c.querySelector('.wc__media');
    mEl.innerHTML = media.innerHTML; mEl.classList.toggle('is-contain', c.dataset.fit === 'contain');
    kEl.textContent = c.dataset.k || '';
    hEl.textContent = c.querySelector('.wc__name').textContent;
    hEl.toggleAttribute('lang', false); if (c.querySelector('.wc__name').getAttribute('lang') === 'en') hEl.setAttribute('lang', 'en');
    pEl.textContent = c.dataset.long || c.querySelector('.wc__line').textContent;
    noteEl.textContent = c.dataset.note || ''; noteEl.hidden = !c.dataset.note;
    acts.innerHTML = '';
    if (c.dataset.href) { const a = document.createElement('a'); a.className = 'btn btn--sm'; a.href = c.dataset.href; a.target = '_blank'; a.rel = 'noopener'; a.textContent = c.dataset.hrefLabel || 'לפתוח'; acts.appendChild(a); }
    const wa = document.createElement('a'); wa.className = 'btn btn--sm btn--ghost'; wa.target = '_blank'; wa.rel = 'noopener';
    wa.href = 'https://wa.me/972504401760?text=' + encodeURIComponent(`היי נדב, ראיתי באתר את ${hEl.textContent} ואני רוצה לשמוע עוד`);
    wa.textContent = __t('services.block.cta'); acts.appendChild(wa);
    const T = tgt(); place(T);
    const r = c.getBoundingClientRect(); from = { x: r.left, y: r.top, w: r.width, h: r.height };
    dlg.hidden = false; lenis?.stop();
    if (engine && !reduce) {
      gsap.fromTo(scrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.4 });
      gsap.fromTo(panel, { x: from.x - T.x, y: from.y - T.y, scaleX: from.w / T.w, scaleY: from.h / T.h }, { x: 0, y: 0, scaleX: 1, scaleY: 1, duration: 0.8, ease: 'expo.out' });
      gsap.fromTo(dlg.querySelectorAll('.wz__body > *'), { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.6, stagger: 0.05, delay: 0.25, ease: 'expo.out' });
    }
    x.focus({ preventScroll: true });
  }
  function shut() {
    if (dlg.hidden) return;
    const done = () => { dlg.hidden = true; lenis?.start(); gsap?.set?.(panel, { clearProps: 'transform' }); opener?.focus({ preventScroll: true }); };
    if (engine && !reduce) {
      const T = tgt(); const r = opener.getBoundingClientRect();
      gsap.to(scrim, { autoAlpha: 0, duration: 0.3 });
      gsap.to(panel, { x: r.left - T.x, y: r.top - T.y, scaleX: r.width / T.w, scaleY: r.height / T.h, duration: 0.55, ease: 'expo.inOut', onComplete: done });
    } else done();
  }
  document.querySelectorAll('button.wc').forEach((c) => c.addEventListener('click', () => open(c)));
  scrim.addEventListener('click', shut); x.addEventListener('click', shut);
  document.addEventListener('keydown', (e) => {
    if (dlg.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); shut(); return; }
    if (e.key === 'Tab') {   // keep focus inside the panel
      const f = [...dlg.querySelectorAll('button, a[href]')];
      const i = f.indexOf(document.activeElement);
      e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
    }
  });
  addEventListener('resize', () => { if (!dlg.hidden) place(tgt()); });
}

/* ── the shared frame (header, menu, calm switch, dock) is chrome-site.js; here only in-page anchors ── */
function initChrome() {
  initSiteChrome({ lenis, dockAfter: 0.6 });
  // in-page anchors ride Lenis
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || a.getAttribute('href') === '#') return;
    const t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault();
    const land = () => { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); };
    if (lenis) lenis.scrollTo(t, { offset: -70, duration: 1.2, onComplete: land }); else { t.scrollIntoView(); land(); }
  });
}

const fonts = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 2000))]);
fonts.then(() => {
  safe('chrome', initChrome);
  if (engine) safe('motion', () => initMotion({ gsap, ScrollTrigger, reduce }));
  safe('hero', initHero);
  safe('gallery', initGallery);
  safe('index', initIndex);
  safe('games', initGames);
  if (engine) ScrollTrigger.refresh();
  // the avatar loads lazily (first interaction or idle), with the 1x atlases
  if (engine && !reduce && page !== 'index') {
    let asked = false;
    const loadAvatar = () => {
      if (asked) return; asked = true;
      import('../sections/avatar/avatar.js').then(({ initAvatar, DEFAULT_CTA }) => {
        if (typeof initAvatar !== 'function') return;
        root.classList.add('has-avatar');
        avatar.ref = initAvatar({
          gsap, ScrollTrigger, lenis, atlasUrl: '/site/assets/avatar/spritesheet.webp', extraUrl: '/site/assets/avatar/site-extra.webp',
          targets: {
            services: { href: __href('services') },
            work: { sel: '[data-game]', pose: 'point', say: __t('avatar.point.workGame') },
            check: { href: __href('check') },
          },
          ctaSelector: `${DEFAULT_CTA || 'a[href*="wa.me"], .btn'}, .dock, main p, main h1, main h2, main h3, .tbtn, .wkc, .kick__grab, .wheel, .table`,
        });
      }).catch(() => {});
    };
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => addEventListener(t, loadAvatar, { once: true, passive: true }));
    if (window.requestIdleCallback) requestIdleCallback(loadAvatar, { timeout: 4000 }); else setTimeout(loadAvatar, 4000);
  }
  window.__work = { lenis, avatar };
});
