// branch.js (my-branch.html): one scrolling day in the branch, 08:00 → 23:00.
// The sky behind the page turns from dawn to night with the clock (S6-02). A sticky board carries the
// clock, the branch hub and its five systems; each one lights at its hour and an animated beam runs from
// the hub to it, with a dashed link from the system before it (S6-04). Nadav walks the board with the day.
// Every card opens its screens: real screens where they exist, labelled HTML schematics where not.

import { openShots, lazy } from '../story-pages.js';
import { createSprite } from './sprite.js';

const T0 = 480, T1 = 1380, A0 = -150, A1 = 150, NS = 'http://www.w3.org/2000/svg';
const rad = (t) => ((A0 + ((t - T0) / (T1 - T0)) * (A1 - A0)) * Math.PI) / 180;
const pt = (a, r) => ({ x: r * Math.sin(a), y: -r * Math.cos(a) });
const pad = (n) => String(n).padStart(2, '0');
const SYS_T = { shifts: 480, stock: 630, cash: 750, repairs: 960, z: 1380 };
const NAME = { shifts: __t('branch.story.0800.title'), stock: __t('branch.story.1030.title'), cash: __t('branch.story.1230.title'), repairs: __t('branch.story.1600.title'), z: 'Z' };

// dawn, noon, afternoon, dusk, night: [top, bottom, glow rgba, glow y %, stars]
const SKY = [
  [480, [26, 35, 56], [10, 12, 14], [242, 179, 111, 0.3], 100, 0],
  [750, [27, 48, 68], [11, 14, 18], [170, 210, 240, 0.2], 0, 0],
  [960, [34, 40, 58], [10, 12, 14], [232, 145, 60, 0.2], 40, 0],
  [1170, [42, 26, 44], [10, 12, 14], [226, 96, 72, 0.32], 100, 0.25],
  [1380, [7, 9, 12], [5, 6, 8], [80, 110, 170, 0.12], 0, 1],
];
const lerp = (a, b, k) => a + (b - a) * k;
const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const rgb = (c) => `rgb(${c.slice(0, 3).map(Math.round).join(',')})`;
const rgba = (c) => `rgba(${c.slice(0, 3).map(Math.round).join(',')},${c[3].toFixed(3)})`;
const clamp01 = (v) => Math.max(0, Math.min(1, v));

const WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M8.6 8.4c.2-.5.5-.5.8-.5h.5c.2 0 .4 0 .6.5l.7 1.6c.1.2.1.4 0 .6l-.5.6c-.1.2-.1.3 0 .5.6 1 1.4 1.8 2.4 2.4.2.1.4.1.5 0l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.4.2.4.4.4.6v.5c0 .3 0 .6-.5.8-.5.3-1.4.6-2.6.2a9.3 9.3 0 0 1-4.9-4.9c-.4-1.2-.1-2.1.2-2.6z"/></svg>';
const MOCK_REPAIRS = `<div class="mk mk--light"><span class="st-ill">${__t('global.illustration')}</span>
  <div class="mk__bar"><span>${__t('branch.story.1600.title')}</span><span style="font-size:13px;font-weight:400;color:#6b7078">${__t('branch.mock.repairs.time', { time: '<bdi dir="ltr">16:02</bdi>' })}</span></div>
  <div class="mk__card">
    <div class="mk__photo"><span class="mk__temp" dir="ltr">9°C</span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"><rect x="6" y="2.5" width="12" height="19" rx="2"/><path d="M6 9h12M9 5.5v1.5M9 12v3"/></svg></div>
    <b style="font-size:13px">${__t('branch.mock.repairs.item')}</b>
    <div class="mk__chips"><span class="mk__chip mk__chip--ok">${__t('branch.mock.repairs.chip1')}</span><span class="mk__chip">${__t('branch.mock.repairs.chip2', { date: '<bdi dir="ltr">03/2027</bdi>' })}</span><span class="mk__chip mk__chip--acc">${__t('branch.mock.repairs.chip3')}</span></div>
  </div>
  <div class="mk__wa"><i>${WA_SVG}</i><div><b>${__t('branch.mock.repairs.wa.title')}</b><div style="color:#3b4a40">${__t('branch.mock.repairs.wa.body')}</div></div></div>
  <ol class="mk__steps"><li>${__t('branch.mock.repairs.step1')}</li><li>${__t('branch.mock.repairs.step2')}</li><li class="is-wait">${__t('branch.mock.repairs.step3')}</li></ol>
</div>`;
const MOCK_DRAWER = `<div class="mk mk--dark"><span class="st-ill">${__t('global.illustration')}</span>
  <div class="mk__bar"><span>${__t('branch.mock.drawer.title')}</span><span style="font-size:13px;font-weight:400;color:var(--mute)" lang="en" dir="ltr">23:04</span></div>
  <div class="mk__grid">
    <div class="mk__den"><b dir="ltr">₪200</b><span>${__t('branch.mock.drawer.notes', { n: "3" })}</span></div><div class="mk__den"><b dir="ltr">₪100</b><span>${__t('branch.mock.drawer.notes', { n: "5" })}</span></div>
    <div class="mk__den"><b dir="ltr">₪50</b><span>${__t('branch.mock.drawer.notes', { n: "4" })}</span></div><div class="mk__den"><b dir="ltr">₪20</b><span>${__t('branch.mock.drawer.notes', { n: "7" })}</span></div>
    <div class="mk__den"><b dir="ltr">₪10</b><span>${__t('branch.mock.drawer.coins', { n: "6" })}</span></div><div class="mk__den"><b dir="ltr">₪5</b><span>${__t('branch.mock.drawer.coins', { n: "4" })}</span></div>
  </div>
  <div class="mk__ok"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M3 8.5l3 3 7-7"/></svg>${__t('branch.mock.drawer.ok')}</div>
  <div class="mk__chips"><span class="mk__chip mk__chip--ok">${__t('branch.mock.drawer.chip1')}</span><span class="mk__chip">${__t('branch.mock.drawer.chip2')}</span></div>
</div>`;

const SHOTS = {
  shifts: { title: __t('branch.story.0800.title'), time: '08:00', shots: [
    { src: '/site/assets/story/br-shifts.webp', alt: __t('branch.shots.shifts.alt'), cap: __t('branch.shots.shifts.cap') }] },
  stock: { title: __t('branch.story.1030.title'), time: '10:30', shots: [
    { src: '/site/assets/story/br-stock-branch.webp', alt: __t('branch.shots.stock1.alt'), cap: __t('branch.shots.stock1.cap') },
    { src: '/site/assets/story/br-stock.webp', alt: __t('branch.shots.stock2.alt'), cap: __t('branch.shots.stock2.cap') }] },
  cash1: { title: __t('branch.story.1230.title'), time: '12:30', shots: [
    { src: '/site/assets/story/br-cash-collect-light.webp', alt: __t('branch.shots.cash1a.alt'), cap: __t('branch.shots.cash1a.cap') },
    { src: '/site/assets/story/br-cash-history.webp', alt: __t('branch.shots.cash1b.alt'), cap: __t('branch.shots.cash1b.cap') }] },
  repairs: { title: __t('branch.story.1600.title'), time: '16:00', shots: [
    { html: MOCK_REPAIRS, ill: true, cap: __t('branch.shots.repairs.cap') }] },
  cash2: { title: __t('branch.story.1230.title'), time: '19:30', shots: [
    { src: '/site/assets/story/br-cash-collect.webp', alt: __t('branch.shots.cash2a.alt'), cap: __t('branch.shots.cash2a.cap') },
    { src: '/site/assets/story/br-cash-auto.webp', alt: __t('branch.shots.cash2b.alt'), cap: __t('branch.shots.cash2b.cap') }] },
  z: { title: 'Z', time: '23:00', shots: [
    { src: '/site/assets/story/br-z.webp', kind: 'laptop', alt: __t('branch.shots.z1.alt'), cap: __t('branch.shots.z1.cap') },
    { html: MOCK_DRAWER, ill: true, cap: __t('branch.shots.z2.cap') }] },
};

export function init({ gsap, ScrollTrigger, reduce, mobile }) {
  const sky = document.getElementById('sky');
  const board = document.getElementById('brBoard');
  const map = document.getElementById('brMap');
  const svg = map.querySelector('svg');
  const arc = svg.querySelector('.br-arc');
  const hh = board.querySelector('.br-hh'), mm = board.querySelector('.br-mm'), sysEl = board.querySelector('.br-clock__s');
  const nodes = Object.fromEntries([...map.querySelectorAll('.br-node')].map((n) => [n.dataset.sys, { el: n }]));
  const hours = [...document.querySelectorAll('.br-hour')].map((li) => ({ li, t: +li.dataset.t, sys: li.dataset.sys, pose: li.dataset.pose, say: li.dataset.say }));
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };

  // mocks inside the card thumbnails, scaled to the phone
  document.querySelectorAll('[data-mock="repairs"]').forEach((m) => { m.innerHTML = MOCK_REPAIRS; });
  const fitMocks = () => document.querySelectorAll('.br-open .st-phone__in .mk').forEach((m) => {
    const w = m.parentElement.clientWidth; Object.assign(m.style, { position: 'absolute', insetBlockStart: '0', insetInlineStart: '0', width: '280px', height: `${(m.parentElement.clientHeight / w) * 280}px`, transformOrigin: '100% 0', scale: String(w / 280) });
  });
  fitMocks(); addEventListener('resize', fitMocks);

  // geometry: five systems on the outer ring, beams from the hub, links system → next system
  const beamsG = svg.querySelector('.br-beams'), linksG = svg.querySelector('.br-links');
  for (const [k, n] of Object.entries(nodes)) {
    const a = rad(SYS_T[k]), p = pt(a, 160);
    n.p = p;
    // inline-start runs from the right in RTL, the SVG from the left: mirror x for the HTML nodes
    n.el.style.setProperty('--x', (-p.x / 4).toFixed(2)); n.el.style.setProperty('--y', (p.y / 4).toFixed(2));
    const s = pt(a, 52), e = pt(a, 132), c = pt(a + 0.28, 92);
    const d = `M ${s.x.toFixed(1)} ${s.y.toFixed(1)} Q ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${e.x.toFixed(1)} ${e.y.toFixed(1)}`;
    mk('path', { d, class: 'br-beam' }, beamsG);
    n.flow = mk('path', { d, class: 'br-flow', pathLength: '426' }, beamsG);
  }
  const links = hours.slice(1).map((h, i) => {
    const a = nodes[hours[i].sys].p, b = nodes[h.sys].p;
    if (hours[i].sys === h.sys) return null;
    const am = (rad(SYS_T[hours[i].sys]) + rad(SYS_T[h.sys])) / 2, c = pt(am, 215);
    return mk('path', { d: `M ${a.x.toFixed(1)} ${a.y.toFixed(1)} Q ${c.x.toFixed(1)} ${c.y.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`, class: 'br-link' }, linksG);
  });

  // the walker (on phones he stands beside the compact board, not on the tiny dial)
  if (mobile) board.appendChild(document.getElementById('brAv'));
  document.getElementById('brAv').style.setProperty('--ax', '0');
  document.getElementById('brAv').style.setProperty('--ay', '0');
  const av = createSprite(document.getElementById('brAv'), { reduce, start: 'idle' });
  lazy(document.getElementById('brOutAv'), () => {
    const o = createSprite(document.getElementById('brOutAv'), { reduce, start: 'sit', label: __t('branch.outro.avatar.label') });
    o.play('sit');
  }, '200px');

  // clock + sky, from minutes
  const sunX = (t) => lerp(8, 92, clamp01((t - T0) / (1230 - T0)));
  function setTime(t, shown = t) {
    const q = Math.round(shown / 5) * 5;
    hh.textContent = pad(Math.floor(q / 60)); mm.textContent = pad(q % 60);
    const a = rad(t), R = 112, p0 = pt(rad(T0), R), p1 = pt(a, R);
    arc.setAttribute('d', t <= T0 + 1 ? '' : `M ${p0.x} ${p0.y} A ${R} ${R} 0 ${a - rad(T0) > Math.PI ? 1 : 0} 1 ${p1.x} ${p1.y}`);
    let i = 0; while (i < SKY.length - 2 && t > SKY[i + 1][0]) i++;
    const A = SKY[i], B = SKY[i + 1], k = clamp01((t - A[0]) / (B[0] - A[0]));
    const s = sky.style;
    s.setProperty('--sa', rgb(mix(A[1], B[1], k)));
    s.setProperty('--sb', rgb(mix(A[2], B[2], k)));
    s.setProperty('--gl', rgba(mix(A[3], B[3], k)));
    s.setProperty('--gy', `${lerp(A[4], B[4], k)}%`);
    s.setProperty('--st', lerp(A[5], B[5], k).toFixed(3));
    const ps = clamp01((t - T0) / (1230 - T0));
    s.setProperty('--sx', `${sunX(t)}%`);
    s.setProperty('--sy', `${70 - Math.sin(Math.PI * ps) * 54}%`);
    s.setProperty('--sunO', clamp01(1 - (t - 1140) / 90).toFixed(3));
    s.setProperty('--moonO', clamp01((t - 1200) / 100).toFixed(3));
  }

  let cur = -1;
  const said = new Set();
  function setActive(i) {
    if (i === cur) return;
    cur = i;
    const h = hours[i];
    sysEl.textContent = NAME[h.sys];
    hours.forEach((x, j) => x.li.classList.toggle('is-on', j === i));
    const seen = new Set(hours.slice(0, i + 1).map((x) => x.sys));
    for (const [k, n] of Object.entries(nodes)) {
      n.el.classList.toggle('is-lit', seen.has(k));
      n.el.classList.toggle('is-on', k === h.sys);
      n.flow.classList.toggle('is-on', k === h.sys);
    }
    links.forEach((l, j) => l && l.classList.toggle('is-on', j === i - 1));
    // Nadav walks toward the active system
    const p = nodes[h.sys].p, tx = (-p.x * 0.6) / 4, ty = (p.y * 0.6) / 4;
    const el = document.getElementById('brAv');
    if (!mobile && gsap && !reduce) {
      const fromX = parseFloat(el.style.getPropertyValue('--ax') || 0);
      av.play(tx > fromX ? 'running-left' : 'running-right');   // RTL: a larger inline offset sits further to the left
      gsap.to(el, { '--ax': tx, '--ay': ty, duration: 0.9, ease: 'power2.inOut', overwrite: true, onComplete: () => pose(h) });
    } else { el.style.setProperty('--ax', tx); el.style.setProperty('--ay', ty); pose(h); }
  }
  function pose(h) {
    if (h.sys === 'z') {
      av.play('laptop');
      if (h.say && !said.has(h.t)) { said.add(h.t); av.say(h.say, 3000); }
      setTimeout(() => { if (hours[cur] === h) av.play('celebrate', { rest: 'thumbs-up' }); }, reduce ? 0 : 1700);
      return;
    }
    av.play(h.pose, { rest: h.pose === 'laptop' || h.pose === 'review' ? h.pose : 'idle' });
    if (h.say && !said.has(h.t)) { said.add(h.t); av.say(h.say); }
  }

  // card buttons and the thumbnails open the screens dialog
  document.querySelectorAll('[data-open]').forEach((b) => b.addEventListener('click', () => {
    const s = SHOTS[b.dataset.open]; if (s) openShots({ ...s, from: b });
  }));

  setTime(T0);
  if (!ScrollTrigger) { Object.values(nodes).forEach((n) => n.el.classList.add('is-lit')); setActive(hours.length - 1); return; }

  hours.forEach((h, i) => {
    const next = hours[i + 1] ? hours[i + 1].t : h.t;
    ScrollTrigger.create({
      trigger: h.li, start: 'top 62%', end: 'bottom 62%',
      onUpdate: (st) => setTime(h.t + st.progress * (next - h.t), h.t), // the digits match the card's label
      onToggle: (st) => { if (st.isActive) setActive(i); },
    });
  });
  // before the first hour: the clock waits at 08:00; after the last: the night holds
  ScrollTrigger.create({ trigger: '#day', start: 'top bottom', end: 'bottom top', onLeave: () => setTime(T1), onEnterBack: () => {} });
  if (gsap && !reduce) {
    gsap.from(map.querySelectorAll('.br-node'), { scale: 0.4, autoAlpha: 0, duration: 0.9, ease: 'back.out(1.6)', stagger: 0.08, scrollTrigger: { trigger: board, start: 'top 80%', once: true } });
  }
}
