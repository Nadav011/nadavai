// main.js: one clock (Lenis on the GSAP ticker), then every chapter in page order, then the cloud.
import { initHero } from './hero.js';
import { initMotion } from './motion.js';
import { initChrome } from './chrome.js';
import { initCompare } from './compare.js';
import { initPath } from './path.js';
import { initWork } from './work.js';
import { initDial } from './dial.js';
import { initCheck } from './check.js';
import { initFaq } from './faq.js';
import { initTransit } from './transit.js';
import { initOffer } from '../sections/offer/offer.js';

const root = document.documentElement;
const reduce = root.classList.contains('reduce');
const { gsap, ScrollTrigger, Lenis } = window;
const engine = !!(gsap && ScrollTrigger);
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
// a deep link (#plans) should land after the pins exist, not before
const hash = location.hash;
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

// the cloud of screens (three.js) starts loading now, in parallel with everything below; its boot waits for
// the wordmark geometry that initHero publishes (wm:geo), so the code and the screens build the name first
if (root.classList.contains('pfx')) import('../hero/hero-gl.js').catch(() => root.classList.remove('pfx'));
// html.gl-up follows the cloud itself (the text wordmark hides under it), independent of when transit starts
document.addEventListener('cloud:ready', () => root.classList.add('gl-up'));
document.addEventListener('cloud:fail', () => root.classList.remove('gl-up'));

const safe = (name, fn) => { try { return fn(); } catch (e) { console.warn(`[site] ${name} kept static`, e); return null; } };

const fonts = Promise.race([
  Promise.all([
    document.fonts.load('expanded 800 100px Archivo', 'NADAV AI'),
    document.fonts.load('800 100px Rubik', __t('home.hero.portrait.alt')),
    document.fonts.load('600 40px Rubik', 'אני'),
  ]),
  new Promise((r) => setTimeout(r, 2500)),
]).catch(() => {});

fonts.then(async () => {
  const env = { gsap, ScrollTrigger, lenis, reduce: reduce || !engine, mobile };
  const hero = safe('hero', () => initHero(env)) || {};
  // the chapters below build in page order, one per frame, so the hero paints and the cloud boots in between
  const frame = () => new Promise((r) => requestAnimationFrame(() => r()));
  const chapters = [['chrome', () => initChrome(env)], ['compare', () => initCompare(env)],
    ['offer', () => initOffer({ gsap, ScrollTrigger, lenis })], ['path', () => initPath(env)], ['work', () => initWork(env)],
    ['dial', () => initDial(env)], ['check', () => initCheck(env)], ['faq', () => initFaq(env)], ['motion', () => initMotion(env)]];
  // the cloud goes first: the chapters wait until it is up (or failed), 3 s at most, or the visitor starts to scroll
  if (root.classList.contains('pfx')) {
    await new Promise((res) => {
      const done = () => { clearTimeout(cap); ['cloud:ready', 'cloud:fail'].forEach((e) => document.removeEventListener(e, done));
        ['wheel', 'touchstart', 'keydown'].forEach((e) => removeEventListener(e, done)); res(); };
      const cap = setTimeout(done, 3000);
      if (window.__heroGL) return done();
      ['cloud:ready', 'cloud:fail'].forEach((e) => document.addEventListener(e, done));
      ['wheel', 'touchstart', 'keydown'].forEach((e) => addEventListener(e, done, { passive: true }));
    });
  }
  for (const [name, fn] of chapters) { await frame(); safe(name, fn); }
  if (engine) {
    safe('transit', () => initTransit({ ...env, heroST: hero.st }));
    ScrollTrigger.sort();
    ScrollTrigger.refresh();
  } else root.classList.add('past-hero');

  if (hash && hash.length > 1) {
    const t = document.querySelector(hash);
    if (t) requestAnimationFrame(() => (lenis ? lenis.scrollTo(t, { immediate: true }) : t.scrollIntoView()));
  }


  // the avatar guide: loaded on the first interaction or when the browser is idle (its sheets are heavy).
  // On phones it starts folded into the dock (its head sits in the dock's last slot).
  if (engine && !reduce) {
    let started = false;
    const load = () => {
      if (started) return; started = true;
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => removeEventListener(t, load));
      import('../sections/avatar/avatar.js').then(({ initAvatar, avatar, DEFAULT_CTA }) => {
        if (typeof initAvatar !== 'function') return;
        root.classList.add('has-avatar');
        window.__avatar = initAvatar({ gsap, ScrollTrigger, lenis, atlasUrl: '/site/assets/avatar/spritesheet.webp', extraUrl: '/site/assets/avatar/site-extra.webp',
          ctaSelector: `${DEFAULT_CTA || 'a[href], button'}, .dock, .hud, .ck__field, .ck__card, .chat, .pl, .phone, .cmp, .night__body, .dial, .lv3__card, .strip, .tr__count, main h2` });
        if (mobile) avatar?.minimize?.(true);
      }).catch(() => {});
    };
    ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => addEventListener(t, load, { passive: true, once: true }));
    (window.requestIdleCallback || ((f) => setTimeout(f, 2500)))(() => setTimeout(load, 3500), { timeout: 6000 });
  }
  window.__site = { lenis, ScrollTrigger };
});
