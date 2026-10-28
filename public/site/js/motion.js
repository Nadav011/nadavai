// motion.js: the page's one motion language.
//   decode(el)  section titles resolve from scrambled glyphs (Hebrew + Latin), the same verb as the bio
//   reveals     .rv elements rise with expo.out, 1.1 s, 0.08 s stagger (the hero's easing)
//   eyebrows    their hairline draws from the reading start
// Everything runs on GSAP's ticker; nothing runs under reduced motion.

const HEB = 'אבגדהוזחטיכלמנסעפצקרשת';
const LAT = 'ABCDEFGHJKLMNPRSTUVXYZ0123456789';
export const EASE = 'expo.out';

export function decode(gsap, el, duration = 0.7) {
  const w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes = []; let n;
  while ((n = w.nextNode())) nodes.push(n);
  const src = nodes.map((x) => x.nodeValue);
  const total = src.reduce((s, t) => s + t.length, 0);
  if (!el.hasAttribute('aria-label')) { el.setAttribute('aria-label', el.textContent.trim()); el.dataset.decLabel = '1'; }
  const st = { p: 0 };
  let frame = 0;
  const render = () => {
    const reveal = st.p * total; let gi = 0;
    nodes.forEach((x, ni) => {
      const s = src[ni]; let o = '';
      for (let i = 0; i < s.length; i++, gi++) {
        const ch = s[i];
        if (gi < reveal || ch === ' ' || /[^\wא-ת]/.test(ch)) { o += ch; continue; }
        const pool = /[א-ת]/.test(ch) ? HEB : LAT;
        o += pool[(Math.random() * pool.length) | 0];
      }
      x.nodeValue = o;
    });
  };
  const done = () => { nodes.forEach((x, i) => { x.nodeValue = src[i]; }); if (el.dataset.decLabel) { el.removeAttribute('aria-label'); delete el.dataset.decLabel; } };
  render();
  return gsap.to(st, { p: 1, duration, ease: 'power1.in', onUpdate: () => { if (frame++ % 2 === 0) render(); }, onComplete: done, onInterrupt: done });
}

export function initMotion({ gsap, ScrollTrigger, reduce }) {
  const root = document.documentElement;
  const rv = gsap.utils.toArray('.rv');
  if (reduce) { gsap.set(rv, { clearProps: 'all' }); return; }
  // opacity, not visibility: a block still waiting for its reveal stays in the tab order, and shows as soon as
  // something inside it takes focus (a keyboard visitor reached 24 hidden controls on /services otherwise)
  gsap.set(rv, { opacity: 0, y: 22 });
  ScrollTrigger.batch(rv, {
    start: 'top 88%', once: true,
    onEnter: (els) => gsap.to(els, { opacity: 1, y: 0, duration: 1.1, stagger: 0.08, ease: EASE, overwrite: true }),
  });
  document.addEventListener('focusin', (e) => {
    const r = e.target.closest?.('.rv');
    if (r && +getComputedStyle(r).opacity < 1) gsap.to(r, { opacity: 1, y: 0, duration: 0.3, ease: EASE, overwrite: true });
  });

  // chapter titles never scramble: each one rises in plainly, and where tiles build the chapter's
  // centrepiece it waits until that build is 90 % done (transit.js marks the section data-built).
  // Only the eyebrow's label decodes.
  const live = () => root.classList.contains('transit');
  const heads = gsap.utils.toArray('.sec__h, .offer .tr__h, .offer .pl__h');
  heads.forEach((h) => {
    gsap.set(h, { autoAlpha: 0, y: 14 });
    const sec = h.closest('section');
    const show = () => gsap.to(h, { autoAlpha: 1, y: 0, duration: 0.7, ease: EASE, overwrite: true });
    ScrollTrigger.create({
      trigger: h, start: 'top 90%', once: true,
      onEnter: () => {
        if (live() && sec?.dataset.scene && !sec.dataset.built) sec.addEventListener('scene:built', show, { once: true });
        else show();
      },
    });
  });
  gsap.utils.toArray('.eyebrow span, .of__tag span').forEach((el) => {
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => decode(gsap, el, 0.5) });
  });

  // eyebrow hairlines draw from the reading start
  gsap.utils.toArray('.eyebrow i, .of__tag i').forEach((i) => {
    gsap.fromTo(i, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: 'expo.inOut', scrollTrigger: { trigger: i, start: 'top 90%', once: true } });
  });
}
