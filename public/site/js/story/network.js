// network.js (mexicani-network.html): the chain app, told apart from the branch. Everything shown is a
// labelled HTML schematic with invented data: no real chain data and no branch count.
//   hero      the HQ console: a map of abstract branch pins that pulse, three KPI bars
//   problem   scattered messages (group chats, mail, calls, spreadsheets) pull into one screen as you scroll
//   built     six module cards; the franchisee ticket moves across the board, the calendar fills, bars grow
//   AI        three sample questions; the assistant streams a canned answer (המחשה)

import { mountGuide } from '../story-pages.js';

const NS = 'http://www.w3.org/2000/svg';
const PINS = [[62, 48], [104, 120], [150, 70], [196, 136], [232, 54], [268, 104], [312, 66], [340, 140], [180, 30], [86, 160], [292, 160], [126, 30]];
const ANSWERS = [
  { q: __t('network.ai.q1'), a: __t('network.ai.a1.lead'), list: [__t('network.ai.a1.i1'), __t('network.ai.a1.i2'), __t('network.ai.a1.i3')] },
  { q: __t('network.ai.q2'), a: __t('network.ai.a2.lead'), list: [__t('network.ai.a2.i1'), __t('network.ai.a2.i2'), __t('network.ai.a2.i3')] },
  { q: __t('network.ai.q3'), a: __t('network.ai.a3.lead'), list: [__t('network.ai.a3.i1'), __t('network.ai.a3.i2'), __t('network.ai.a3.i3')] },
];

export function init({ gsap, ScrollTrigger, reduce, mobile }) {
  mountGuide(__t('avatar.page.network'), 'point');

  // HQ map: abstract pins, two flagged
  const map = document.getElementById('hqMap');
  PINS.forEach(([x, y], i) => {
    const warn = i === 3 || i === 9;
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x); c.setAttribute('cy', y); c.setAttribute('r', warn ? 4.5 : 3.6);
    c.setAttribute('class', warn ? 'hq__pin hq__pin--warn' : 'hq__pin');
    if (i % 3 === 0 || warn) {
      const p = document.createElementNS(NS, 'circle');
      p.setAttribute('cx', x); p.setAttribute('cy', y); p.setAttribute('r', 4);
      p.setAttribute('class', 'hq__pulse'); p.style.animationDelay = `${(i * 0.37) % 2.6}s`;
      if (warn) p.style.stroke = '#E8913C';
      map.appendChild(p);
    }
    map.appendChild(c);
  });
  // faint links between neighbouring pins: one network
  for (let i = 0; i < PINS.length - 1; i++) {
    const l = document.createElementNS(NS, 'line');
    const [a, b] = [PINS[i], PINS[(i + 2) % PINS.length]];
    l.setAttribute('x1', a[0]); l.setAttribute('y1', a[1]); l.setAttribute('x2', b[0]); l.setAttribute('y2', b[1]);
    l.setAttribute('stroke', 'rgba(127,179,213,.16)'); l.setAttribute('stroke-width', '1');
    map.insertBefore(l, map.firstChild);
  }

  // calendar: a month of small days with events
  const cal = document.getElementById('cal');
  for (let d = 1; d <= 28; d++) {
    const i = document.createElement('i');
    if ([3, 7, 8, 12, 16, 19, 23, 26].includes(d)) i.className = 'is-ev';
    if ([12, 23].includes(d)) i.className = 'is-ev is-acc';
    if (d === 15) i.className += ' is-today';
    cal.appendChild(i);
  }

  // the AI assistant: canned answers, streamed; every chip stays usable without motion
  const log = document.getElementById('aiLog');
  let typing = null;
  function ask(n) {
    const A = ANSWERS[n];
    document.querySelectorAll('.ai__chip').forEach((c) => c.setAttribute('aria-pressed', String(+c.dataset.q === n)));
    clearInterval(typing);
    log.innerHTML = '';
    const q = document.createElement('p'); q.className = 'ai__q'; q.textContent = A.q; log.appendChild(q);
    const a = document.createElement('div'); a.className = 'ai__a'; log.appendChild(a);
    const full = A.a;
    const finish = () => {
      a.textContent = full;
      const ul = document.createElement('ul');
      A.list.forEach((t) => { const li = document.createElement('li'); li.textContent = t; ul.appendChild(li); });
      a.appendChild(ul);
      if (gsap && !reduce) gsap.from(ul.children, { autoAlpha: 0, y: 8, stagger: 0.12, duration: 0.5, ease: 'expo.out' });
    };
    if (reduce) { finish(); return; }
    let k = 0; const cur = '<span class="ai__cur" aria-hidden="true"></span>';
    a.setAttribute('aria-busy', 'true');
    typing = setInterval(() => {
      k += 2; a.innerHTML = full.slice(0, k).replace(/</g, '&lt;') + cur;
      if (k >= full.length) { clearInterval(typing); a.removeAttribute('aria-busy'); finish(); }
    }, 28);
  }
  document.querySelectorAll('.ai__chip').forEach((c) => c.addEventListener('click', () => ask(+c.dataset.q)));
  ask(0);

  if (!gsap || !ScrollTrigger || reduce) return;

  // the problem: chaos pulls into one screen (pinned on desktop, a scrubbed pass on phones)
  const field = document.querySelector('.net-mess__field');
  const chips = [...field.querySelectorAll('.chaos')];
  const one = field.querySelector('.net-mess__one');
  chips.forEach((c, i) => gsap.to(c, { y: i % 2 ? 10 : -10, duration: 2.2 + i * 0.3, yoyo: true, repeat: -1, ease: 'sine.inOut' }));
  const tl = gsap.timeline({ scrollTrigger: { trigger: '#netMess', start: mobile ? 'top 40%' : 'top top', end: mobile ? 'bottom 60%' : '+=110%', scrub: 0.6, pin: !mobile } });
  tl.to(chips, { '--x': 50, '--y': 50, rotate: 0, scale: 0.4, autoAlpha: 0, duration: 1, stagger: 0.05, ease: 'power2.in' })
    .fromTo(one, { autoAlpha: 0, scale: 0.8 }, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'back.out(1.4)' }, '-=0.35');

  // module cards
  gsap.from('.ui-bars i', { scaleY: 0, duration: 1.2, stagger: 0.07, ease: 'expo.out', scrollTrigger: { trigger: '.ui-bars', start: 'top 85%', once: true } });
  gsap.from('#cal i', { autoAlpha: 0, scale: 0.6, duration: 0.5, stagger: 0.015, ease: 'expo.out', scrollTrigger: { trigger: '#cal', start: 'top 85%', once: true } });
  gsap.from('.ui-ring', { '--v': 0, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: '.ui-ring', start: 'top 85%', once: true } });
  // the franchisee ticket: open → in progress → closed, on a loop while visible
  const tk = document.querySelector('.ui-tk--move');
  const cols = [...document.querySelectorAll('#kan .ui-col')].filter((c) => getComputedStyle(c).display !== 'none');
  let step = 0, loop = null;
  const move = () => {
    step = (step + 1) % cols.length;
    const first = tk.getBoundingClientRect();
    cols[step].appendChild(tk);
    const last = tk.getBoundingClientRect();
    gsap.fromTo(tk, { x: first.left - last.left, y: first.top - last.top }, { x: 0, y: 0, duration: 0.8, ease: 'expo.inOut' });
  };
  ScrollTrigger.create({ trigger: '#kan', start: 'top bottom', end: 'bottom top', onToggle: (s) => { clearInterval(loop); if (s.isActive) loop = setInterval(move, 2200); } });
}
