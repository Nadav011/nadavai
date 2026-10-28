// about.js (about.html): the approved bio levels module (sections/bio, 8 levels verbatim) under the
// portrait hero. The guide avatar greets, and celebrates each forward Level Up by watching the module's
// own level counter (the module itself stays untouched).

import { mountGuide } from '../story-pages.js';
import { initBio } from '../../sections/bio/bio.js';

export function init({ gsap, ScrollTrigger, lenis, reduce }) {
  if (gsap && ScrollTrigger) initBio({ gsap, ScrollTrigger, lenis });
  if (gsap && !reduce) {
    gsap.fromTo('.ab-hero__plate img', { scale: 1.08 }, { scale: 1, duration: 2.2, ease: 'expo.out' });
    gsap.to('.ab-hero__plate img', { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.ab-hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
  mountGuide(__t('avatar.page.about'), 'waving');
  const ctr = document.querySelector('.bio__ctr-in');
  if (!ctr || reduce) return;
  let last = parseInt(ctr.textContent, 10) || 1;
  let t = 0;   // the counter decodes through random glyphs; read it once it settles
  new MutationObserver(() => {
    clearTimeout(t);
    t = setTimeout(() => {
      const n = parseInt(ctr.textContent, 10);
      if (n > last) import('../../sections/avatar/avatar.js').then(({ avatar }) => avatar.perform('celebrate')).catch(() => {});
      if (!Number.isNaN(n)) last = n;
    }, 700);
  }).observe(ctr, { childList: true, characterData: true, subtree: true });
}
