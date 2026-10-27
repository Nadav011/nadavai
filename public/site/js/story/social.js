// social.js (social.html): "I run your social".
//   hero      Nadav at the laptop; real posts fly out of it on arcs while the desk is on screen
//   pipeline  makes → schedules → publishes: a draft fills, drops onto the month, goes live (a loop)
//   gallery   a 3D marquee of the real work (SOC-01); every tile opens large; pause button; hover/focus pauses
//   feed      a phone you can scroll, with stories (SOC-04); real work, the feed itself is a labelled illustration

import { lazy, openImage } from '../story-pages.js';
import { createSprite } from './sprite.js';

const P = (k) => `/site/assets/story/${k}.webp`;
const FLY = ['so-gr-offers-urgent-single', 'so-hm-ad', 'so-br-home', 'so-ab-neon', 'so-gr-game-coach-carousel', 'so-hm-offer', 'so-br-craft', 'so-gr-food-dish-spotlight'];
const WHO = {
  gr: { name: 'Green Room', av: P('so-gr-room-hero-single'), stories: ['so-gr-offers-urgent-single', 'so-gr-people-birthday-single'] },
  hm: { name: __t('social.feed.story.hashmalka'), av: P('so-hm-ad'), stories: ['so-hm-story'] },
  ab: { name: 'Asian Bar', av: P('so-ab-neon'), stories: ['so-ab-neon', 'so-ab-final'] },
  br: { name: __t('social.feed.story.breslev'), av: P('so-br-logo'), stories: ['so-br-home', 'so-br-craft'] },
};
const POSTS = [
  { who: 'gr', img: 'so-gr-game-coach-carousel', w: 560, h: 560, cap: __t('social.feed.post1.cap'), alt: __t('social.gallery.item17.alt') },
  { who: 'hm', img: 'so-hm-offer', w: 560, h: 700, cap: __t('social.feed.post2.cap'), alt: __t('social.feed.post2.alt') },
  { who: 'ab', img: 'so-ab-final', w: 560, h: 840, cap: __t('social.feed.post3.cap'), alt: __t('social.feed.post3.alt') },
  { who: 'br', img: 'so-br-finish', w: 560, h: 700, cap: __t('social.feed.post4.cap'), alt: __t('social.feed.post4.alt') },
  { who: 'gr', img: 'so-gr-food-dish-spotlight', w: 560, h: 560, cap: __t('social.feed.post5.cap'), alt: __t('social.feed.post5.alt') },
  { who: 'hm', img: 'so-hm-steps', w: 560, h: 560, cap: __t('social.feed.post6.cap'), alt: __t('social.feed.post6.alt') },
];
const HEART = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 7.5 2.8C19.5 15.4 12 20 12 20z"/></svg>';
const CHAT = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M20 11.5a8 8 0 0 1-11.8 7L4 20l1.4-4A8 8 0 1 1 20 11.5z"/></svg>';
const SEND = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M21 3 10 14M21 3l-7 18-4-7-7-4z"/></svg>';

export function init({ gsap, ScrollTrigger, reduce }) {
  /* ── hero: the social manager at work ── */
  const av = createSprite(document.getElementById('soAv'), { reduce, start: 'laptop', label: __t('social.avatar.alt') });
  setTimeout(() => av.say(__t('avatar.page.social')), 900);
  const fly = document.getElementById('soFly');
  const mkPost = (k) => { const d = document.createElement('div'); d.className = 'so-post'; d.innerHTML = `<img src="${P(k)}" alt="" decoding="async">`; fly.appendChild(d); return d; };
  if (reduce || !gsap) {
    [['8%', '6%', '-8deg'], ['36%', '0%', '3deg'], ['64%', '8%', '9deg']].forEach(([l, t, r], i) => {
      const d = mkPost(FLY[i]); d.classList.add('so-post--still'); d.style.setProperty('--l', l); d.style.setProperty('--t', t); d.style.setProperty('--r', r);
    });
  } else {
    let n = 0, timer = null;
    const launch = () => {
      const d = mkPost(FLY[n++ % FLY.length]);
      const side = n % 2 ? 1 : -1;
      const dx = side * (90 + Math.random() * 150), dy = -(220 + Math.random() * 120);
      gsap.timeline({ onComplete: () => d.remove() })
        .fromTo(d, { xPercent: 50, x: 0, y: 0, scale: 0.2, rotate: 0, autoAlpha: 0 }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: 'power2.out' })
        .to(d, { x: dx, duration: 2.4, ease: 'power1.out' }, 0)
        .to(d, { y: dy, duration: 2.4, ease: 'power2.out' }, 0)
        .to(d, { rotate: side * (8 + Math.random() * 14), duration: 2.4, ease: 'none' }, 0)
        .to(d, { autoAlpha: 0, scale: 0.85, duration: 0.5, ease: 'power1.in' }, 1.9);
    };
    const desk = document.getElementById('soDesk');
    new IntersectionObserver(([e]) => {
      clearInterval(timer);
      if (e.isIntersecting) { launch(); timer = setInterval(launch, 900); }
    }).observe(desk);
  }

  /* ── pipeline: make → schedule → publish ── */
  const cal = document.getElementById('pCal');
  const days = [];
  for (let i = 0; i < 28; i++) { const d = document.createElement('span'); d.className = 'cal__d'; cal.appendChild(d); days.push(d); }
  const preset = { 2: 'so-gr-food-dish-spotlight', 5: 'so-hm-ad', 9: 'so-br-home', 13: 'so-gr-people-birthday-single', 17: 'so-ab-neon', 22: 'so-gr-room-hero-single' };
  const setDay = (i, k) => { days[i].innerHTML = `<img src="${P(k)}" alt="" loading="lazy" decoding="async">`; };
  Object.entries(preset).forEach(([i, k]) => setDay(+i, k));
  if (!reduce && gsap) {
    const steps = [...document.querySelectorAll('.pipe__st')];
    const draft = document.getElementById('pDraft'), pub = document.getElementById('pPub');
    const queue = ['so-gr-game-tip-single', 'so-hm-matan', 'so-br-pro', 'so-gr-offers-urgent-single', 'so-ab-final', 'so-hm-steps'];
    const slots = [7, 11, 15, 19, 24, 26];
    let k = 0, loop = null;
    const cycle = () => {
      const img = queue[k % queue.length], slot = slots[k % slots.length]; k++;
      const on = (i) => steps.forEach((s, j) => s.classList.toggle('is-on', j === i));
      gsap.timeline()
        .call(() => { on(0); draft.style.backgroundImage = `url(${P(img)})`; })
        .fromTo(draft.parentElement, { y: 14, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, ease: 'expo.out' })
        .call(() => { on(1); setDay(slot, img); gsap.fromTo(days[slot], { scale: 0.3 }, { scale: 1, duration: 0.6, ease: 'back.out(2)' }); }, null, 1.4)
        .call(() => { on(2); pub.src = P(img); }, null, 2.8)
        .fromTo(pub, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.7, ease: 'expo.out', immediateRender: false }, 2.8);
    };
    ScrollTrigger.create({ trigger: '#pipe', start: 'top 85%', end: 'bottom 10%', onToggle: (s) => { clearInterval(loop); if (s.isActive) { cycle(); loop = setInterval(cycle, 4200); } } });
  }

  /* ── marquee: clone each column for a seamless loop; tiles open the lightbox ── */
  const mq = document.getElementById('mq');
  // tiles sit on a 3D plane, where native lazy loading misjudges what is visible: load them as the section nears
  lazy(mq, () => mq.querySelectorAll('img').forEach((i) => { i.loading = 'eager'; }), '900px');
  mq.querySelectorAll('.mq__col').forEach((c) => {
    [...c.children].forEach((t) => { const cl = t.cloneNode(true); cl.setAttribute('aria-hidden', 'true'); cl.tabIndex = -1; c.appendChild(cl); });
  });
  mq.addEventListener('focusin', () => mq.classList.add('is-focus'));
  mq.addEventListener('focusout', (e) => { if (!mq.contains(e.relatedTarget)) mq.classList.remove('is-focus'); });
  mq.addEventListener('click', (e) => {
    const t = e.target.closest('.mq__t'); if (!t) return;
    const im = t.querySelector('img');
    openImage({ src: im.currentSrc || im.src, alt: im.alt, cap: t.dataset.cap, from: t.getAttribute('aria-hidden') ? null : t });
  });
  const pause = mq.querySelector('.mq__pause');
  pause.addEventListener('click', () => {
    const p = !mq.classList.contains('is-paused');
    mq.classList.toggle('is-paused', p);
    pause.setAttribute('aria-pressed', String(p));
    pause.querySelector('span').textContent = p ? __t('social.gallery.play') : __t('social.gallery.pause');
  });
  if (reduce) pause.hidden = true;
  // the marquee only runs while it is on screen
  new IntersectionObserver(([e]) => mq.classList.toggle('is-off', !e.isIntersecting)).observe(mq);

  /* ── the phone feed ── */
  lazy(document.getElementById('feed'), () => buildFeed({ gsap, reduce }), '400px');
}

function buildFeed({ gsap, reduce }) {
  const list = document.getElementById('feedList');
  list.innerHTML = POSTS.map((p, i) => {
    const w = WHO[p.who];
    return `<article class="fp" aria-label="${__t('social.feed.post.aria', { name: w.name })}">
      <header class="fp__h"><img src="${w.av}" alt="" width="30" height="30" loading="lazy"><div><b>${w.name}</b><small>${i % 2 ? __t('social.feed.status.auto') : __t('social.feed.status.morning')}</small></div><span class="fp__sch">מתוזמן</span></header>
      <div class="fp__img"><img src="${P(p.img)}" width="${p.w}" height="${p.h}" alt="${p.alt}" loading="lazy" decoding="async"><span class="fp__heart">${HEART}</span></div>
      <div class="fp__act"><button type="button" aria-pressed="false" aria-label=__t('play.avatar.like')>${HEART}</button><button type="button" aria-label=__t('social.feed.comment.aria') tabindex="-1">${CHAT}</button><button type="button" aria-label=__t('social.feed.share.aria') tabindex="-1">${SEND}</button></div>
      <p class="fp__cap"><b>${w.name}</b> ${p.cap}</p>
    </article>`;
  }).join('');
  const like = (art, on = true) => {
    const b = art.querySelector('.fp__act button');
    b.setAttribute('aria-pressed', String(on));
    if (on && !reduce) { const h = art.querySelector('.fp__heart'); h.classList.remove('is-pop'); void h.offsetWidth; h.classList.add('is-pop'); }
  };
  list.addEventListener('click', (e) => {
    const b = e.target.closest('.fp__act button'); if (b && b === b.parentElement.firstElementChild) like(b.closest('.fp'), b.getAttribute('aria-pressed') !== 'true');
  });
  list.addEventListener('dblclick', (e) => { const a = e.target.closest('.fp__img'); if (a) like(a.closest('.fp')); });

  // stories
  const v = document.getElementById('storyV');
  const bars = v.querySelector('.story-v__bars'), img = v.querySelector('.story-v__img'), who = v.querySelector('.story-v__who');
  let seq = [], idx = 0, tween = null, opener = null;
  function show(i) {
    idx = i;
    if (idx < 0) idx = 0;
    if (idx >= seq.length) { close(); return; }
    const s = seq[idx];
    img.src = P(s.img); img.alt = __t('social.feed.story.alt', { name: s.name });
    who.querySelector('img').src = s.av; who.querySelector('span').textContent = s.name;
    [...bars.children].forEach((b, j) => { b.firstChild.style.width = j < idx ? '100%' : '0%'; });
    tween?.kill();
    const fill = bars.children[idx].firstChild;
    if (reduce || !gsap) { fill.style.width = '100%'; return; }
    tween = gsap.fromTo(fill, { width: '0%' }, { width: '100%', duration: 4, ease: 'none', onComplete: () => show(idx + 1) });
  }
  function open(key, btn) {
    const keys = Object.keys(WHO), start = keys.indexOf(key);
    seq = keys.slice(start).concat(keys.slice(0, start)).flatMap((k) => WHO[k].stories.map((s) => ({ img: s, name: WHO[k].name, av: WHO[k].av })));
    bars.innerHTML = seq.map(() => '<i><b></b></i>').join('');
    opener = btn; v.hidden = false; v.querySelector('.story-v__x').focus();
    show(0);
  }
  function close() { tween?.kill(); v.hidden = true; opener?.focus(); }
  document.querySelectorAll('.feed__st').forEach((b) => b.addEventListener('click', () => open(b.dataset.story, b)));
  v.querySelector('.story-v__x').addEventListener('click', close);
  v.querySelector('.story-v__nav--next').addEventListener('click', () => show(idx + 1));   // RTL: the reading-end side moves forward
  v.querySelector('.story-v__nav--prev').addEventListener('click', () => show(idx - 1));
  v.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { e.stopPropagation(); close(); }
    if (e.key === 'ArrowLeft') show(idx + 1);
    if (e.key === 'ArrowRight') show(idx - 1);
  });
}
