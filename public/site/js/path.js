// path.js (S4): the night path. A glowing line winds through the five steps ("nights"); scroll draws it,
// a comet rides its head, and each night's numeral lights up as the head passes it. The HUD in the corner
// counts STEP 01/05 like a tape counter. The path is rebuilt from the real positions of the numerals, so it
// works at every width (zigzag on desktop, a straight run along the reading start on phones).

export function initPath({ gsap, ScrollTrigger, reduce }) {
  const sec = document.getElementById('process');
  const wrap = document.getElementById('path');
  const svg = wrap.querySelector('.path__svg');
  const [base, glow, lit] = ['.path__base', '.path__glow', '.path__lit'].map((s) => svg.querySelector(s));
  const head = svg.querySelector('.path__head');
  const nights = [...wrap.querySelectorAll('.night')];
  const cur = wrap.querySelector('.path__cur');
  const pad = (n) => String(n).padStart(2, '0');
  let len = 1, stops = [];

  function build() {
    const W = wrap.clientWidth, H = wrap.clientHeight, wr = wrap.getBoundingClientRect();
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const pts = nights.map((n) => {
      const r = n.querySelector('.night__n').getBoundingClientRect();
      return { x: r.left + r.width / 2 - wr.left, y: r.top + r.height / 2 - wr.top };
    });
    const narrow = W < 700;
    const row = !narrow && Math.abs(pts[0].y - pts[pts.length - 1].y) < H * 0.4;
    let d, all;
    if (row) {
      // desktop: one glowing wave through the five numerals, from the reading start (right) to the end
      all = pts;
      const rtl = pts[0].x > pts[pts.length - 1].x, s0 = { x: rtl ? W : 0, y: pts[0].y }, e0 = { x: rtl ? 0 : W, y: pts[pts.length - 1].y };
      d = `M ${s0.x} ${s0.y}`;
      let prev = s0;
      [...all, e0].forEach((p) => { const mx = (prev.x + p.x) / 2; d += ` C ${mx} ${prev.y}, ${mx} ${p.y}, ${p.x} ${p.y}`; prev = p; });
    } else {
      const startX = narrow ? W - 14 : W / 2;
      d = `M ${startX} 0`;
      let prev = { x: startX, y: 0 };
      all = narrow ? pts.map((p) => ({ x: W - 14, y: p.y })) : pts;
      all.forEach((p) => { const my = (prev.y + p.y) / 2; d += ` C ${prev.x} ${my}, ${p.x} ${my}, ${p.x} ${p.y}`; prev = p; });
      d += ` C ${prev.x} ${(prev.y + H) / 2}, ${prev.x} ${(prev.y + H) / 2}, ${prev.x} ${H}`;
    }
    [base, glow, lit].forEach((p) => p.setAttribute('d', d));
    len = lit.getTotalLength();
    // where along the path each night sits (sampled, cheap enough on resize)
    stops = all.map((p) => {
      let best = 0, bd = Infinity;
      for (let s = 0; s <= len; s += 6) { const q = lit.getPointAtLength(s); const dd = row ? Math.abs(q.x - p.x) + Math.abs(q.y - p.y) * 0.2 : Math.abs(q.y - p.y) + Math.abs(q.x - p.x) * 0.2; if (dd < bd) { bd = dd; best = s; } }
      return best / len;
    });
    [glow, lit].forEach((p) => { p.style.strokeDasharray = `${len} ${len}`; });
    draw(state.p);
  }

  const state = { p: 0 };
  let lastN = -1;
  function draw(p) {
    state.p = p;
    const off = len * (1 - p);
    glow.style.strokeDashoffset = off; lit.style.strokeDashoffset = off;
    const q = lit.getPointAtLength(Math.max(0.01, len * p));
    head.setAttribute('cx', q.x); head.setAttribute('cy', q.y);
    head.style.opacity = p > 0.001 && p < 0.999 ? 1 : 0;
    const n = stops.filter((s) => p >= s - 0.004).length;
    if (n !== lastN) {
      nights.forEach((el, i) => el.classList.toggle('is-lit', i < n));
      cur.textContent = pad(Math.max(1, n)); // "step 00" read as broken before the first step lights
      lastN = n;
    }
  }

  if (reduce || !gsap || !ScrollTrigger) {
    nights.forEach((el) => el.classList.add('is-lit'));
    cur.textContent = '05';
    addEventListener('resize', () => { build(); draw(1); });
    requestAnimationFrame(() => { build(); draw(1); });
    return;
  }
  const to = gsap.quickTo(state, 'p', { duration: 0.5, ease: 'power3.out', onUpdate: () => draw(state.p) });
  ScrollTrigger.create({
    trigger: wrap, start: 'top 62%', end: 'bottom 70%',
    onUpdate: (self) => to(self.progress),
    onRefresh: (self) => { build(); draw(self.progress); },
  });
  build();
}
