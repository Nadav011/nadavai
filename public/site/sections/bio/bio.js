/* BIO: the game-progression biography.
 *
 *   import { initBio } from './sections/bio/bio.js';
 *   const destroyBio = initBio({ gsap, ScrollTrigger, lenis });   // lenis is optional
 *   destroyBio();                                                  // reverts everything
 *
 * Motion mode (prefers-reduced-motion: no-preference): the stage pins and the 8 levels swap one at a time;
 * the XP bar follows scroll continuously; each forward step plays a short LEVEL UP moment.
 * Reduced motion: no pin, no smooth jumps, every level is listed and unlocked.
 * Everything runs on GSAP's ticker; no scroll listeners or rAF loops of our own.
 */

// review looks (css/looks.css): --lk-* colours; unset in look A, so the literals below are used
const lookVar = (n, fb) => getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb;

const HEB = 'אבגדהוזחטיכלמנסעפצקרשת';
const LAT = 'ABCDEFGHJKLMNPRSTUVXYZ0123456789';
const pad = (n) => String(n).padStart(2, '0');

export function initBio({ gsap, ScrollTrigger, lenis = null } = {}, root = document.getElementById('bio')) {
  if (!root || !gsap || !ScrollTrigger) return () => {};
  gsap.registerPlugin(ScrollTrigger);

  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => Array.from(el.querySelectorAll(s));

  const stage = $('.bio__stage');
  const levels = $$('.bio__lv');
  const N = levels.length;
  const hudTitle = $('.bio__hud-title');
  const ctrIn = $('.bio__ctr-in');
  const ofEl = $('.bio__lvl-of');
  const fill = $('.bio__xp-fill');
  const ticks = $$('.bio__xp-tick');
  const selBtn = $('.bio__sel-btn');
  const menu = $('.bio__menu');
  const items = $$('.bio__menu a');
  const sndBtn = $('.bio__snd');
  const fx = $('.bio__fx');
  const ring = $('.bio__burst-ring');
  const ring2 = $('.bio__burst-ring2');
  const raysG = $('.bio__burst-rays');
  const lvup = $('.bio__lvup');

  const off = [];
  const on = (el, ev, fn, opt) => { el.addEventListener(ev, fn, opt); off.push(() => el.removeEventListener(ev, fn, opt)); };

  // site-v1: a short version can list a few highlight levels (data-n = the real level number,
  // data-of on the section = the full count), so the HUD and the XP bar speak in real levels.
  const TOTAL = +root.dataset.of || N;
  const nums = levels.map((lv, i) => +lv.dataset.n || i + 1);
  const lvLabel = (i) => pad(nums[i]);
  const xpAt = (p) => { const f = Math.min(N - 1, p * N), i = Math.floor(f); const a = nums[i], b = nums[Math.min(N - 1, i + 1)]; return (a + (b - a) * Math.max(0, f - i - 0.5) * 2 * (i < N - 1 ? 1 : 0)) / TOTAL; };
  if (ofEl) ofEl.textContent = '/ ' + pad(TOTAL);

  /* ── burst rays (built once) ─────────────────────────── */
  const RAYS = 14, R0 = 52, RL = 30;
  const NS = 'http://www.w3.org/2000/svg';
  for (let k = 0; k < RAYS; k++) {
    const a = (k / RAYS) * Math.PI * 2 + (k % 2 ? 0.11 : 0);
    const r1 = R0 + (k % 2 ? 8 : 0), r2 = r1 + RL - (k % 2 ? 12 : 0);
    const l = document.createElementNS(NS, 'line');
    l.setAttribute('x1', (Math.cos(a) * r1).toFixed(2)); l.setAttribute('y1', (Math.sin(a) * r1).toFixed(2));
    l.setAttribute('x2', (Math.cos(a) * r2).toFixed(2)); l.setAttribute('y2', (Math.sin(a) * r2).toFixed(2));
    const len = r2 - r1;
    l.style.strokeDasharray = `${len} ${len}`; l.style.strokeDashoffset = len; l.dataset.len = len;
    raysG.appendChild(l);
  }
  const rays = Array.from(raysG.children);

  /* ── decode: scramble text nodes in place, so <bdi> and screen-reader text survive ── */
  const originals = new WeakMap();
  const decodeTweens = new WeakMap();
  function textNodes(el) {
    const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const out = []; let n;
    while ((n = w.nextNode())) out.push(n);
    return out;
  }
  function decode(el, duration = 0.6) {
    decodeTweens.get(el)?.progress(1).kill();
    const nodes = textNodes(el);
    nodes.forEach((n) => { if (!originals.has(n)) originals.set(n, n.nodeValue); });
    const src = nodes.map((n) => originals.get(n));
    const total = src.reduce((s, t) => s + t.length, 0);
    let frame = 0;
    const st = { p: 0 };
    const render = () => {
      const reveal = st.p * total;
      let gi = 0;
      nodes.forEach((n, ni) => {
        const s = src[ni]; let o = '';
        for (let i = 0; i < s.length; i++, gi++) {
          const ch = s[i];
          if (gi < reveal || ch === ' ' || /[^\wא-ת]/.test(ch)) { o += ch; continue; }
          const pool = /[א-ת]/.test(ch) ? HEB : LAT;
          o += pool[(Math.random() * pool.length) | 0];
        }
        n.nodeValue = o;
      });
    };
    const tw = gsap.to(st, {
      p: 1, duration, ease: 'power1.in',
      onUpdate: () => { if (frame++ % 2 === 0) render(); },
      onComplete: () => nodes.forEach((n, i) => { n.nodeValue = src[i]; }),
      onInterrupt: () => nodes.forEach((n, i) => { n.nodeValue = src[i]; }),
    });
    render();
    decodeTweens.set(el, tw);
    return tw;
  }

  /* ── 8-bit sound, muted by default ───────────────────── */
  let ac = null, soundOn = false;
  function blip(freqs, { type = 'square', step = 0.065, gain = 0.03 } = {}) {
    if (!soundOn || !ac) return;
    const t0 = ac.currentTime + 0.01;
    freqs.forEach((f, k) => {
      const t = t0 + k * step;
      const o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(gain, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + step * 1.7);
      o.connect(g).connect(ac.destination);
      o.start(t); o.stop(t + step * 1.9);
    });
  }
  on(sndBtn, 'click', () => {
    soundOn = !soundOn;
    sndBtn.setAttribute('aria-pressed', String(soundOn));
    if (soundOn) {
      try {
        ac = ac || new (window.AudioContext || window.webkitAudioContext)();
        ac.resume();
        blip([1047], { step: 0.05 });
      } catch (e) { soundOn = false; sndBtn.setAttribute('aria-pressed', 'false'); }
    }
  });

  /* ── HUD state shared by both modes ──────────────────── */
  let cur = 0, reached = 0;
  function setHud(i, animate) {
    const lv = levels[i];
    const t = $('.bio__t', lv);
    const dir = i >= (setHud.last ?? 0) ? 1 : -1;
    setHud.last = i;
    hudTitle.innerHTML = t.innerHTML;
    if (animate) {
      gsap.timeline()
        .to(ctrIn, { yPercent: -100 * dir, duration: 0.14, ease: 'power2.in' })
        .add(() => { ctrIn.textContent = lvLabel(i); })
        .fromTo(ctrIn, { yPercent: 100 * dir }, { yPercent: 0, duration: 0.34, ease: 'expo.out' });
      decode(hudTitle, 0.45);
    } else {
      ctrIn.textContent = lvLabel(i);
    }
    reached = Math.max(reached, i);
    items.forEach((a, k) => {
      if (k === i) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
      a.classList.toggle('is-locked', k > reached);
    });
    if (i === N - 1 && TOTAL === N) root.setAttribute('data-boss', ''); else root.removeAttribute('data-boss');
  }

  /* ── level select popover ────────────────────────────── */
  let jumpTo = () => {};
  const isOpen = () => selBtn.getAttribute('aria-expanded') === 'true';
  function openMenu() {
    selBtn.setAttribute('aria-expanded', 'true'); menu.hidden = false;
    (items[cur] || items[0]).focus({ preventScroll: true });
  }
  function closeMenu(focusBtn) {
    if (!isOpen()) return;
    selBtn.setAttribute('aria-expanded', 'false'); menu.hidden = true;
    if (focusBtn) selBtn.focus({ preventScroll: true });
  }
  on(selBtn, 'click', () => (isOpen() ? closeMenu(false) : openMenu()));
  on(menu, 'keydown', (e) => {
    const k = items.indexOf(document.activeElement);
    if (e.key === 'Escape') { e.preventDefault(); closeMenu(true); }
    else if (e.key === 'ArrowDown') { e.preventDefault(); items[(k + 1) % N].focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); items[(k - 1 + N) % N].focus(); }
    else if (e.key === 'Home') { e.preventDefault(); items[0].focus(); }
    else if (e.key === 'End') { e.preventDefault(); items[N - 1].focus(); }
    else if (e.key === 'Tab') closeMenu(false);
  });
  on(document, 'pointerdown', (e) => { if (isOpen() && !e.target.closest('.bio__sel')) closeMenu(false); });
  items.forEach((a, k) => on(a, 'click', (e) => { e.preventDefault(); closeMenu(false); jumpTo(k); }));

  /* ── hover tilt with a pointer glare (fine pointers only) ── */
  const tiltOff = [];
  function setupTilt() {
    $$('.bio__vis, .bio__player').forEach((host) => {
      const card = $('.bio__card', host);
      if (!card) return;
      const rx = gsap.quickTo(card, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(card, 'rotationY', { duration: 0.6, ease: 'power3' });
      const move = (e) => {
        const r = host.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        rx((0.5 - py) * 9); ry((px - 0.5) * 11);
        card.style.setProperty('--gx', (px * 100).toFixed(1) + '%');
        card.style.setProperty('--gy', (py * 100).toFixed(1) + '%');
        card.style.setProperty('--go', '1');
      };
      const leave = () => { rx(0); ry(0); card.style.setProperty('--go', '0'); };
      host.addEventListener('pointermove', move); host.addEventListener('pointerleave', leave);
      tiltOff.push(() => {
        host.removeEventListener('pointermove', move); host.removeEventListener('pointerleave', leave);
        gsap.set(card, { clearProps: 'transform' }); ['--gx', '--gy', '--go'].forEach((p) => card.style.removeProperty(p));
      });
    });
  }

  /* ── modes ───────────────────────────────────────────── */
  const mm = gsap.matchMedia();

  mm.add('(prefers-reduced-motion: no-preference)', () => {
    root.classList.add('is-game');
    let jumping = false, swapTl = null, fxTl = null, celebrated = false;

    // warm the level images before the stage arrives, so a swap never shows an empty card
    const warm = ScrollTrigger.create({
      trigger: root, start: 'top bottom+=100%', once: true,
      onEnter: () => $$('img', stage).forEach((img) => { img.loading = 'eager'; }),
    });

    const parts = levels.map((lv) => ({
      lv,
      no: $('.bio__no-n', lv),
      k: $('.bio__no-k', lv),
      t: $('.bio__t', lv),
      p: $$('.bio__p, .bio__next, .bio__no-boss', lv),
      card: $('.bio__card', lv),
      img: $('.bio__card > img', lv) || $$('.bio__phone', lv),
      extra: $$('.bio__chip', lv),
      badge: $('.bio__badge', lv),
      badgeCap: $('.bio__badge-cap', lv),
      shine: $('.bio__badge-shine', lv),
      hp: $('.bio__hp-fill', lv),
      hpEdge: $('.bio__hp-edge', lv),
    }));

    gsap.set(levels, { autoAlpha: 0 });
    gsap.set(levels[0], { autoAlpha: 1 });
    levels[0].classList.add('is-active');
    setHud(0, false);
    const R = () => getComputedStyle(root).getPropertyValue('--bio-r').trim() || '16px';

    function go(i) {
      if (i === cur) return;
      const dir = i > cur ? 1 : -1;
      const prev = parts[cur], next = parts[i];
      cur = i;
      swapTl?.kill();
      fxTl?.progress(1);
      levels.forEach((lv, k) => lv.classList.toggle('is-active', k === i));
      gsap.set(levels.filter((_, k) => k !== i && k !== levels.indexOf(prev.lv)), { autoAlpha: 0 });
      setHud(i, true);

      const r = R();
      swapTl = gsap.timeline({ defaults: { overwrite: 'auto' } })
        .to(prev.lv, { autoAlpha: 0, y: -14 * dir, duration: 0.22, ease: 'power2.out' }, 0)
        .set(next.lv, { autoAlpha: 1, y: 0 }, 0.12)
        .fromTo(next.no, { yPercent: 60 * dir, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' }, 0.12)
        .fromTo(next.k, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 0.2)
        .fromTo(next.t, { autoAlpha: 0, y: 10 * dir }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0.16)
        .add(() => decode(next.t, 0.55), 0.16)
        .fromTo(next.p, { autoAlpha: 0, y: 16 * dir }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.06 }, 0.26)
        .fromTo(next.card,
          { clipPath: dir > 0 ? `inset(100% 0% 0% 0% round ${r})` : `inset(0% 0% 100% 0% round ${r})` },
          { clipPath: `inset(0% 0% 0% 0% round ${r})`, duration: 0.85, ease: 'expo.out' }, 0.12)
        .fromTo(next.img, { scale: 1.14 }, { scale: 1, duration: 1.2, ease: 'expo.out' }, 0.12);
      if (next.extra.length) {
        swapTl.fromTo(next.extra, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.08 }, 0.45);
      }
      if (next.badge) gsap.set([next.badge, next.badgeCap], { autoAlpha: 1, scale: 1, rotation: 0, y: 0 });
      if (next.hp) gsap.set(next.hp.parentNode, { '--hp': '5%' });

      if (dir > 0 && !jumping) gsap.delayedCall(0.14, () => cur === i && celebrate(i));
    }

    function celebrate(i) {
      const P = parts[i];
      fxTl?.kill();
      const sr = stage.getBoundingClientRect();
      const nr = P.no.getBoundingClientRect();
      const ny = gsap.getProperty(P.no, 'y') || 0;
      const cx = nr.left + nr.width / 2 - sr.left;
      const cy = nr.top - ny + nr.height / 2 - sr.top;
      const boss = i === N - 1 && TOTAL === N;
      gsap.set(fx, { x: cx, y: cy, autoAlpha: 1 });
      gsap.set(lvup, { xPercent: -50, x: 0, y: -(nr.height / 2) - 74 });
      lvup.textContent = boss ? (root.dataset.boss || 'BOSS LEVEL') : (root.dataset.lvup || 'LEVEL UP'); // site-v1: localised by data attributes

      fxTl = gsap.timeline({ onComplete: () => gsap.set(fx, { autoAlpha: 0 }) })
        .fromTo(ring, { scale: 0.3, opacity: 1, strokeWidth: 2.5 }, { scale: boss ? 3.2 : 2.5, opacity: 0, strokeWidth: 0.5, duration: 0.95, ease: 'expo.out' }, 0)
        .fromTo(ring2, { scale: 0.3, opacity: 0.8 }, { scale: boss ? 4.2 : 3.3, opacity: 0, duration: 1.25, ease: 'expo.out' }, 0.07)
        .fromTo(rays, { strokeDashoffset: (k, el) => +el.dataset.len }, { strokeDashoffset: (k, el) => -el.dataset.len, duration: 0.75, ease: 'power3.out', stagger: { each: 0.008, from: 'random' } }, 0.02)
        .fromTo(lvup, { autoAlpha: 0, y: '+=10', scale: 0.92 }, { autoAlpha: 1, y: '-=10', scale: 1, duration: 0.4, ease: 'expo.out' }, 0.05)
        .to(lvup, { autoAlpha: 0, y: '-=8', duration: 0.3, ease: 'power2.out' }, 1.15)
        .fromTo(P.no, { color: lookVar('--lk-acc-2', '#F2B36F'), textShadow: '0 0 28px rgba(232,145,60,.75)' }, { color: lookVar('--lk-ink', '#EDE7DC'), textShadow: '0 0 0 rgba(232,145,60,0)', duration: 1.1, ease: 'power2.out' }, 0.02)
        .fromTo(fill, { filter: 'brightness(1.8)' }, { filter: 'brightness(1)', duration: 0.8, ease: 'power2.out' }, 0);

      if (P.badge) {
        fxTl
          .fromTo(P.badge, { autoAlpha: 0, scale: 1.7, rotation: -16 }, { autoAlpha: 1, scale: 1, rotation: 0, duration: 0.6, ease: 'expo.out' }, 0.35)
          .fromTo(P.shine, { opacity: 1, backgroundPosition: '120% 0' }, { backgroundPosition: '-30% 0', duration: 0.9, ease: 'power2.inOut' }, 0.75)
          .set(P.shine, { opacity: 0 })
          .fromTo(P.badgeCap, { autoAlpha: 0, y: 12 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: 'expo.out' }, 0.7);
        blip([659, 784, 1047, 1319, 1568], { step: 0.06 });
      } else if (boss) {
        fxTl.fromTo(P.hp.parentNode, { '--hp': '0%' }, { '--hp': '5%', duration: 1.4, ease: 'power3.out' }, 0.5);
        blip([196, 247, 294, 392, 294], { step: 0.085, gain: 0.04 });
      } else {
        blip([659, 784, 1047], { step: 0.06 });
      }
    }

    const st = ScrollTrigger.create({
      trigger: stage,
      start: 'top top',
      end: () => '+=' + Math.round(window.innerHeight * (+root.dataset.step || 0.85) * N),
      pin: true,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      onEnter: () => { if (!celebrated) { celebrated = true; gsap.delayedCall(0.1, () => celebrate(0)); } },
      onUpdate: (self) => {
        const p = self.progress;
        const v = TOTAL === N ? p : xpAt(p);
        xp(v);
        ticks.forEach((t, k) => t.classList.toggle('is-on', v >= (k + 1) / TOTAL - 0.0001));
        go(Math.min(N - 1, Math.floor(p * N)));
      },
    });
    const xp = gsap.quickTo(fill, 'scaleX', { duration: 0.35, ease: 'power3' });

    jumpTo = (i) => {
      const y = st.start + ((i + 0.5) / N) * (st.end - st.start);
      const arrive = () => {
        jumping = false;
        if (cur === i) celebrate(i);
        $('.bio__t', levels[i]).focus({ preventScroll: true });
      };
      jumping = Math.abs(i - cur) > 0;
      if (!jumping) { arrive(); return; }
      if (lenis) {
        lenis.scrollTo(y, { duration: Math.min(1.8, 0.7 + Math.abs(i - cur) * 0.14), easing: (t) => 1 - Math.pow(1 - t, 4), onComplete: arrive });
      } else {
        window.scrollTo({ top: y, behavior: 'smooth' });
        let done = false;
        const fin = () => { if (!done) { done = true; arrive(); } };
        window.addEventListener('scrollend', fin, { once: true });
        gsap.delayedCall(1.4, fin);
      }
    };

    if (matchMedia('(hover: hover) and (pointer: fine)').matches) setupTilt();

    return () => {
      st.kill(); warm.kill(); swapTl?.kill(); fxTl?.kill();
      tiltOff.splice(0).forEach((f) => f());
      gsap.set([...levels, fx, ...parts.flatMap((p) => [p.no, p.k, p.t, ...p.p, p.card, ...[].concat(p.img), ...p.extra, p.badge, p.badgeCap, p.shine].filter(Boolean))], { clearProps: 'all' });
      gsap.set(fill, { clearProps: 'all' });
      levels.forEach((lv) => lv.classList.remove('is-active'));
      root.classList.remove('is-game');
      jumpTo = () => {};
    };
  });

  mm.add('(prefers-reduced-motion: reduce)', () => {
    // every level is unlocked; the sticky HUD names the level in view, the XP bar is full
    reached = N - 1;
    setHud(0, false);
    ticks.forEach((t) => t.classList.add('is-on'));
    const sts = levels.map((lv, i) => ScrollTrigger.create({
      trigger: lv, start: 'top 45%', end: 'bottom 45%',
      onToggle: (self) => { if (self.isActive) { cur = i; setHud(i, false); } },
    }));
    jumpTo = (i) => {
      levels[i].scrollIntoView({ behavior: 'auto', block: 'start' });
      $('.bio__t', levels[i]).focus({ preventScroll: true });
    };
    return () => { sts.forEach((s) => s.kill()); ticks.forEach((t) => t.classList.remove('is-on')); jumpTo = () => {}; };
  });

  // fonts change line heights; recompute pin distances once they land
  let alive = true;
  document.fonts?.ready.then(() => { if (alive) ScrollTrigger.refresh(); });

  return function destroyBio() {
    alive = false;
    mm.revert();
    off.splice(0).forEach((f) => f());
    closeMenu(false);
    root.removeAttribute('data-boss');
    if (ac) { ac.close().catch(() => {}); ac = null; }
  };
}
