// dial.js (S6): a day in my branch, 08:00 to 23:00. The stage pins and scroll turns the clock; the knob
// can also be dragged, and the hidden range input drives it from the keyboard. Each system lights up at
// its hour and a beam of light runs from the branch (the hub) to it.

const T0 = 480, T1 = 1380, A0 = -150, A1 = 150, R = 150, NS = 'http://www.w3.org/2000/svg';
const ang = (t) => (A0 + ((t - T0) / (T1 - T0)) * (A1 - A0)) * Math.PI / 180;
const pt = (a, r) => ({ x: r * Math.sin(a), y: -r * Math.cos(a) });
const pad = (n) => String(n).padStart(2, '0');

export function initDial({ gsap, ScrollTrigger, reduce }) {
  const stage = document.getElementById('branchStage');
  const dial = document.getElementById('dial');
  const svg = dial.querySelector('.dial__svg');
  const arc = svg.querySelector('.dial__arc');
  const hand = svg.querySelector('.dial__hand');
  const ticks = svg.querySelector('.dial__ticks');
  const beamsG = svg.querySelector('.dial__beams');
  const hh = dial.querySelector('.dial__hh'), mm = dial.querySelector('.dial__mm');
  const sysEl = dial.querySelector('.dial__sys'), lineEl = dial.querySelector('.dial__line');
  const range = dial.querySelector('.dial__range');
  const nodes = [...dial.querySelectorAll('.dn')].map((li) => ({ li, t: +li.dataset.t, name: li.dataset.name, line: li.dataset.line }));
  const mk = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };

  // ticks every hour, labels every few hours
  for (let h = 8; h <= 23; h++) {
    const a = ang(h * 60), major = h % 4 === 0 || h === 23 || h === 8;
    const p1 = pt(a, R + 6), p2 = pt(a, R + (major ? 16 : 11));
    mk('line', { x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, class: major ? 'is-major' : '' }, ticks);
    if (major) { const p3 = pt(a, R - 16); const t = mk('text', { x: p3.x, y: p3.y + 3.5, 'text-anchor': 'middle' }, ticks); t.textContent = pad(h); }
  }
  // nodes on an outer ring, beams from the hub
  nodes.forEach((n) => {
    const a = ang(n.t), p = pt(a, 186);
    n.li.style.setProperty('--x', (p.x / 4).toFixed(2));
    n.li.style.setProperty('--y', (p.y / 4).toFixed(2));
    const s = pt(a, 100), e = pt(a, 166), c = pt(a + 0.22, 136);
    const d = `M ${s.x} ${s.y} Q ${c.x} ${c.y} ${e.x} ${e.y}`;
    mk('path', { d }, beamsG);
    n.flow = mk('path', { d, class: 'beam__flow', stroke: '#F2B36F' }, beamsG);
  });

  let t = T0, manualUntil = 0, onNode = null;
  function set(v) {
    t = Math.max(T0, Math.min(T1, v));
    const a = ang(t), p0 = pt(ang(T0), R), p1 = pt(a, R);
    const large = (a - ang(T0)) > Math.PI ? 1 : 0;
    arc.setAttribute('d', t <= T0 + 0.5 ? '' : `M ${p0.x} ${p0.y} A ${R} ${R} 0 ${large} 1 ${p1.x} ${p1.y}`);
    hand.setAttribute('transform', `rotate(${(a * 180 / Math.PI).toFixed(2)})`);
    const q = Math.round(t / 15) * 15;
    hh.textContent = pad(Math.floor(q / 60)); mm.textContent = pad(q % 60);
    let cur = null;
    nodes.forEach((n) => { if (n.t <= t + 0.5) cur = n; });
    nodes.forEach((n) => {
      n.li.classList.toggle('is-on', n === cur);
      n.li.classList.toggle('is-past', n.t <= t && n !== cur);
      n.flow.classList.toggle('is-on', n === cur);
    });
    if (cur !== onNode) {
      onNode = cur;
      sysEl.textContent = cur.name;
      lineEl.textContent = cur.line;
      if (gsap && !reduce) gsap.fromTo([sysEl, lineEl], { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.45, stagger: 0.05, ease: 'expo.out', overwrite: true });
    }
    range.value = Math.round(t / 15) * 15;
    range.setAttribute('aria-valuetext', `${hh.textContent}:${mm.textContent}, ${sysEl.textContent}`);
    if (grab) placeGrab();
  }

  // drag the knob
  const grab = document.createElement('span');
  grab.className = 'dial__grab'; grab.setAttribute('aria-hidden', 'true');
  dial.appendChild(grab);
  function placeGrab() {
    const p = pt(ang(t), R), k = dial.clientWidth / 400;
    grab.style.left = (dial.clientWidth / 2 + p.x * k) + 'px';
    grab.style.top = (dial.clientHeight / 2 + p.y * k) + 'px';
  }
  const fromPointer = (e) => {
    const r = dial.getBoundingClientRect();
    let a = Math.atan2(e.clientX - (r.left + r.width / 2), -(e.clientY - (r.top + r.height / 2))) * 180 / Math.PI;
    a = Math.max(A0, Math.min(A1, a));
    return T0 + ((a - A0) / (A1 - A0)) * (T1 - T0);
  };
  let dragging = false;
  grab.addEventListener('pointerdown', (e) => { dragging = true; grab.setPointerCapture(e.pointerId); manualUntil = Infinity; set(fromPointer(e)); });
  grab.addEventListener('pointermove', (e) => { if (dragging) set(fromPointer(e)); });
  const end = () => { dragging = false; manualUntil = performance.now() + 600; };
  grab.addEventListener('pointerup', end); grab.addEventListener('pointercancel', end);
  range.addEventListener('input', () => { manualUntil = performance.now() + 600; set(+range.value); });
  // time runs clockwise: ArrowRight / ArrowUp move it forward on every page direction (a native range
  // under dir=rtl would flip ArrowRight), PageUp/PageDown jump an hour, Home/End go to the day's edges
  range.setAttribute('dir', 'ltr');
  range.addEventListener('keydown', (e) => {
    const step = { ArrowRight: 15, ArrowUp: 15, ArrowLeft: -15, ArrowDown: -15, PageUp: 60, PageDown: -60 }[e.key];
    const to = e.key === 'Home' ? T0 : e.key === 'End' ? T1 : step != null ? t + step : null;
    if (to == null) return;
    e.preventDefault(); manualUntil = performance.now() + 1500; set(to);
  });
  addEventListener('resize', placeGrab);

  set(reduce ? 720 : T0);
  if (reduce || !gsap || !ScrollTrigger) return;
  const st = { v: T0 };
  const tween = gsap.quickTo(st, 'v', { duration: 0.6, ease: 'power3.out', onUpdate: () => { if (performance.now() > manualUntil) set(st.v); } });
  ScrollTrigger.create({
    id: 'branch', trigger: stage, start: 'top top', end: () => '+=' + Math.round(Math.min(400, innerHeight * 0.45)),
    pin: true, anticipatePin: 1, invalidateOnRefresh: true,
    onUpdate: (self) => { if (!dragging) { manualUntil = 0; tween(T0 + Math.min(1, self.progress / 0.92) * (T1 - T0)); } },
  });
}
