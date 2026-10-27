// chrome.js: the home page's frame. The shared chrome (header, menu, calm switch, current page, progress,
// dock) comes from chrome-site.js; the home adds smooth in-page anchors on Lenis and the chapter HUD.
// The dock appears once the hero is passed (transit.js sets html.past-hero).

import { initSiteChrome } from './chrome-site.js';
import { decode } from './motion.js';

export function initChrome({ gsap, ScrollTrigger, lenis, reduce }) {
  const chrome = initSiteChrome({ lenis, dockAfter: ScrollTrigger ? false : 0.6 });

  // in-page anchors: smooth on Lenis, focus lands on the chapter for keyboard and screen-reader users
  document.addEventListener('click', (e) => {
    const a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id === '#' || id === '#main') return;
    const t = id === '#top' ? document.body : document.querySelector(id);
    if (!t) return;
    e.preventDefault();
    chrome?.setMenu(false);
    const land = () => { if (t !== document.body) { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); } };
    if (lenis && !reduce) lenis.scrollTo(id === '#top' ? 0 : t, { duration: 1.4, onComplete: land });
    else { if (id === '#top') window.scrollTo(0, 0); else t.scrollIntoView(); land(); }
    history.replaceState(null, '', id === '#top' ? location.pathname : id);
  });

  // the corner HUD: which chapter you are in (its name decodes when it changes)
  const hud = document.getElementById('hud');
  if (!hud || !ScrollTrigger) return;
  const secs = [...document.querySelectorAll('main > section[data-sec]')];
  const nameEl = hud.querySelector('.hud__name'), numEl = hud.querySelector('.hud__n');
  let cur = null;
  const setCur = (sec) => {
    if (sec === cur) return;
    cur = sec;
    numEl.textContent = sec.dataset.sec; nameEl.textContent = sec.dataset.name;
    if (gsap && !reduce) decode(gsap, nameEl, 0.45);
  };
  let rest = 0;
  const wake = () => { hud.classList.add('is-live'); clearTimeout(rest); rest = setTimeout(() => hud.classList.remove('is-live'), 900); };
  if (lenis) lenis.on('scroll', wake); else addEventListener('scroll', wake, { passive: true });
  secs.forEach((sec) => ScrollTrigger.create({ trigger: sec, start: 'top 55%', end: 'bottom 55%', onToggle: (self) => { if (self.isActive) setCur(sec); } }));
}
