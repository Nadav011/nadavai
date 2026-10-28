// story-pages.js: the shared frame of the five story pages (my-branch, mexicani-network, social, about, play).
// One clock (Lenis on the GSAP ticker), the header (menu sheet, calm switch, progress), the dock, the
// site's motion language (motion.js: .rv reveals, decoded titles), the screens dialog and a lazy-init
// helper. Then the page's own module from js/story/, chosen by <body data-page>.

import { initMotion } from './motion.js';
import { initSiteChrome } from './chrome-site.js';

const root = document.documentElement;
const { gsap, ScrollTrigger, Lenis } = window;
const engine = !!(gsap && ScrollTrigger);
if (!engine) root.classList.add('reduce');      // no GSAP from the CDN: every scene shows as its still
const reduce = root.classList.contains('reduce');
const mobile = matchMedia('(max-width: 900px)').matches;

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

// the page's place behind it: a 3D dimension (js/dims, 2026-10-28); without one (reduced motion, calm mode, the light
// look, no WebGL2, software GL, three not loading, a lost context) its shader world (js/worlds), as before
const DIMS = { about: 'about', social: 'social', playground: 'play', branch: 'branch', network: 'network' };
const dimName = DIMS[document.body.dataset.page];
// once: a dimension that fails and also loses its context must not start a second world
let worldP = null;
const startWorld = () => (worldP ||= import('./worlds/world.js').then((m) => m.initWorld({ lenis, reduce })).catch((e) => console.info('[world] off', e)));
(dimName ? import(`./dims/${dimName}.js`).then((m) => m.initDim({ lenis, reduce, onLost: startWorld })).catch(() => false) : Promise.resolve(false))
  .then((dim) => { if (!dim) startWorld(); });

/* ── small helpers shared with the page modules ── */
export function lazy(el, fn, margin = '600px') {
  if (!el) return;
  const io = new IntersectionObserver((es) => {
    if (es.some((e) => e.isIntersecting)) { io.disconnect(); try { fn(); } catch (e) { console.warn('[story] lazy part kept static', e); } }
  }, { rootMargin: margin });
  io.observe(el);
}
export function announce(text) {
  const n = document.getElementById('calmLive');
  if (!n) return;
  n.textContent = text;
}
export const wa = (text) => `https://wa.me/972504401760?text=${encodeURIComponent(text)}`;

const X_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';

/* ── the screens dialog: a system card opens with its screens (native <dialog>: focus trap, Esc) ── */
export function openShots({ title, time = '', shots = [], from = null }) {
  const d = document.createElement('dialog');
  d.className = 'st-dlg';
  d.setAttribute('aria-labelledby', 'stDlgT');
  d.innerHTML = `<div class="st-dlg__head">${time ? `<span class="st-dlg__time" lang="en" dir="ltr">${time}</span>` : ''}<h2 class="st-dlg__t" id="stDlgT"></h2>
    <button type="button" class="st-dlg__x" aria-label="${__t('social.gallery.close')}">${X_ICON}</button></div><div class="st-dlg__body"></div>`;
  d.querySelector('.st-dlg__t').textContent = title;
  const body = d.querySelector('.st-dlg__body');
  shots.forEach((s) => {
    const f = document.createElement('figure');
    f.className = 'st-shot' + (s.kind === 'laptop' ? ' st-shot--laptop' : '');
    let frame;
    if (s.kind === 'laptop') frame = `<div class="st-laptop"><div class="st-laptop__in"><img src="${s.src}" alt="" decoding="async"></div></div>`;
    else if (s.html) frame = `<div class="st-phone"><div class="st-phone__in">${s.html}</div></div>`;
    else frame = `<div class="st-phone"><div class="st-phone__in"><img src="${s.src}" alt="" decoding="async"></div></div>`;
    f.innerHTML = `${frame}<figcaption><span></span>${s.ill ? '<span class="st-ill">' + __t('global.illustration') + '</span>' : ''}</figcaption>`;
    const im = f.querySelector('img'); if (im) im.alt = s.alt || '';
    f.querySelector('figcaption span').textContent = s.cap || '';
    body.appendChild(f);
  });
  document.body.appendChild(d);
  lenis?.stop();
  d.showModal();
  if (gsap && !reduce) {
    const r = from?.getBoundingClientRect();
    const dr = d.getBoundingClientRect();
    const fx = r ? (r.left + r.width / 2) - (dr.left + dr.width / 2) : 0;
    const fy = r ? (r.top + r.height / 2) - (dr.top + dr.height / 2) : 30;
    // WAAPI on the dialog itself: GSAP's first transform read re-parents a fixed element without an
    // offsetParent, which silently drops a modal <dialog> out of the top layer
    d.animate([{ transform: `translate(${fx * 0.6}px, ${fy * 0.6}px) scale(.86)`, opacity: 0 }, { transform: 'none', opacity: 1 }],
      { duration: 700, easing: 'cubic-bezier(.16,1,.3,1)' });
    gsap.from(body.children, { y: 26, opacity: 0, duration: 0.8, stagger: 0.07, ease: 'expo.out', delay: 0.12 });
  }
  const close = () => d.close();
  d.querySelector('.st-dlg__x').addEventListener('click', close);
  d.addEventListener('click', (e) => { if (e.target === d) close(); });
  d.addEventListener('close', () => { d.remove(); lenis?.start(); from?.focus?.({ preventScroll: true }); }, { once: true });
  return d;
}

/* ── the lightbox (social gallery) ── */
export function openImage({ src, alt, cap, from }) {
  const d = document.createElement('dialog');
  d.className = 'st-dlg st-lb';
  d.setAttribute('aria-label', cap || alt || '');
  d.innerHTML = `<figure><img alt="" decoding="async"><figcaption></figcaption></figure><button type="button" class="st-dlg__x" aria-label="${__t('social.gallery.close')}">${X_ICON}</button>`;
  const im = d.querySelector('img'); im.src = src; im.alt = alt || '';
  d.querySelector('figcaption').textContent = cap || '';
  document.body.appendChild(d);
  lenis?.stop();
  d.showModal();
  if (gsap && !reduce) gsap.from(d.querySelector('figure'), { scale: 0.88, opacity: 0, duration: 0.6, ease: 'expo.out' });
  d.querySelector('.st-dlg__x').addEventListener('click', () => d.close());
  d.addEventListener('click', (e) => { if (e.target === d || e.target.tagName === 'FIGURE') d.close(); });
  d.addEventListener('close', () => { d.remove(); lenis?.start(); from?.focus?.({ preventScroll: true }); }, { once: true });
}

/* ── the guide avatar (sections/avatar), for pages without an in-scene actor ── */
export function mountGuide(line, pose = 'waving') {
  if (!engine || reduce) return;
  let done = false;
  const load = () => {
    if (done) return; done = true;
    import('../sections/avatar/avatar.js').then(({ initAvatar, avatar, DEFAULT_CTA }) => {
      if (typeof initAvatar !== 'function') return;
      root.classList.add('has-avatar');
      initAvatar({ gsap, ScrollTrigger, lenis, atlasUrl: '/site/assets/avatar/spritesheet.webp', extraUrl: '/site/assets/avatar/site-extra.webp',
        ctaSelector: `${DEFAULT_CTA}, .dock, main p, main h1, main h2, main h3` });
      if (line) setTimeout(() => { avatar.perform(pose); avatar.say(line); }, 900);
    }).catch(() => {});
  };
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => addEventListener(t, load, { once: true, passive: true }));
  if (window.requestIdleCallback) requestIdleCallback(load, { timeout: 4000 }); else setTimeout(load, 4000);
}

/* ── in-page anchors (skip links, "מה יצא"): ride Lenis and land focus on the target. The header, menu,
   calm switch, progress line and dock are the shared chrome (js/chrome-site.js). ── */
function initAnchors() {
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a || e.defaultPrevented) return; // the level jump on /about handles its own links
    const id = a.getAttribute('href');
    const t = id.length > 1 && document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    const land = () => { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); };
    if (lenis) lenis.scrollTo(t, { offset: -70, duration: 1.2, onComplete: land }); else { t.scrollIntoView(); land(); }
  });
}

const safe = (name, fn) => { try { return fn(); } catch (e) { console.warn(`[story] ${name} kept static`, e); return null; } };

const fonts = Promise.race([
  Promise.all([document.fonts.load('600 40px Rubik', 'אני'), document.fonts.load('expanded 800 40px Archivo', 'NADAV')]),
  new Promise((r) => setTimeout(r, 2000)),
]).catch(() => {});

fonts.then(async () => {
  safe('chrome', () => initSiteChrome({ lenis, dockAfter: '[data-hero]' }));
  safe('anchors', initAnchors);
  const env = { gsap, ScrollTrigger, lenis, reduce, mobile, engine };
  if (engine) safe('motion', () => initMotion(env));
  const page = document.body.dataset.page;
  try {
    const mod = await import(`./story/${page}.js`);
    await mod.init(env);
  } catch (e) { console.warn('[story] page module kept static', e); }
  if (engine) { ScrollTrigger.sort(); ScrollTrigger.refresh(); }
  if (location.hash.length > 1) {
    const t = document.querySelector(location.hash);
    if (t) requestAnimationFrame(() => (lenis ? lenis.scrollTo(t, { immediate: true, offset: -70 }) : t.scrollIntoView()));
  }
  window.__story = { lenis, ScrollTrigger };
});
