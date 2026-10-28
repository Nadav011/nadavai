// medizen-desk.js: "the receptionist's day", a small game beside MediZen's live demo (2026-10-28). Illustrative only:
// fictional patients, a fictional week, nothing from the real app or any real clinic.
//   inbox     patient requests drop in as WhatsApp-style bubbles, each with a patience bar
//   week      five days by five times; some slots are taken when the day starts
//   play      drag a request into a free slot that fits what was asked (a day, the morning, the afternoon, an exact
//             time, or the first free one). A medical question goes to the "forward to Yael" tray, politely, never into
//             the calendar. A taken slot, a slot that does not fit, or a question in the calendar cost points.
//   the bot   when a bubble's patience runs out, MediZen's bot answers it and books it itself; it gets faster all day.
//   keys      1-4 pick a request, arrows move in the week, Enter books, R forwards to Yael, Esc lets go.
// 60 seconds, a score, the best in this browser (localStorage, guarded), and "again". DOM only: a 100 ms tick that
// runs only while a day is on and the game is on screen; nothing runs when idle or hidden.

const DAYS = [__t('medizen.desk.day.sun'), __t('medizen.desk.day.mon'), __t('medizen.desk.day.tue'), __t('medizen.desk.day.wed'), __t('medizen.desk.day.thu')];
const TIMES = ['09:00', '10:30', '12:00', '14:00', '16:00'];
const NAMES = [__t('sporchat.chat.name.noa'), __t('medizen.desk.name.itay'), __t('medizen.desk.name.shira'), __t('medizen.desk.name.daniel'), __t('medizen.desk.name.michal'), __t('sporchat.chat.name.omer'), __t('medizen.desk.name.tamar'), __t('medizen.desk.name.yonatan'), __t('medizen.desk.name.roni'), __t('medizen.desk.name.lior'), __t('medizen.desk.name.hadar'), __t('medizen.desk.name.ori')];
const MED = [
  __t('medizen.desk.med.1'),
  __t('medizen.desk.med.2'),
  __t('medizen.desk.med.3'),
  __t('medizen.desk.med.4'),
];
const DAY_MS = 60, BEST_KEY = 'nadavai.mz.best';
// a signed number that keeps its sign in front inside a Hebrew sentence (an isolated LTR run)
const num = (n) => `\u2066${n > 0 ? '+' : '−'}${Math.abs(n)}\u2069`;
const fits = (r, d, h) => r.k === 'any' || (r.k === 'day' && d === r.d) || (r.k === 'am' && h <= 2) || (r.k === 'pm' && h >= 3) || (r.k === 'exact' && d === r.d && h === r.h);

export function init(stage, { reduce }) {
  const $ = (s) => stage.querySelector(s);
  const inbox = $('.rcp__inbox'), week = $('.rcp__week'), tray = $('.rcp__tray'), startBtn = $('.rcp__start'), endEl = $('.rcp__end');
  const timeEl = $('[data-rcp="time"]'), scoreEl = $('[data-rcp="score"]'), botEl = $('[data-rcp="bot"]'), bestEl = $('[data-rcp="best"]'), speedEl = $('.rcp__speed i');
  const live = $('[data-rcp="live"]'), note = $('[data-rcp="note"]');
  let best = 0; try { best = +(localStorage.getItem(BEST_KEY) || 0) || 0; } catch { best = 0; }
  bestEl.textContent = best ? String(best) : '0';

  /* the week grid: buttons, so a pointer, a tap or the keyboard can book */
  const slots = [];
  week.innerHTML = '';
  const corner = document.createElement('span'); corner.className = 'rcp__h'; week.appendChild(corner);
  DAYS.forEach((d) => { const h = document.createElement('span'); h.className = 'rcp__h'; h.textContent = d; week.appendChild(h); });
  TIMES.forEach((t, h) => {
    const th = document.createElement('span'); th.className = 'rcp__t'; th.textContent = t; week.appendChild(th);
    DAYS.forEach((d, di) => {
      const b = document.createElement('button'); b.type = 'button'; b.className = 'rcp__slot'; b.tabIndex = -1;
      b.dataset.d = di; b.dataset.h = h; b.innerHTML = '<span></span>';
      week.appendChild(b); slots.push({ el: b, d: di, h, who: 'free', name: '' });
    });
  });
  slots[0].el.tabIndex = 0;
  const slotAt = (d, h) => slots[h * DAYS.length + d];
  function paintSlot(s) {
    s.el.dataset.who = s.who;
    s.el.querySelector('span').textContent = s.who === 'taken' ? __t('medizen.desk.slot.taken') : s.who === 'you' ? s.name : s.who === 'bot' ? __t('medizen.desk.slot.bot', { name: s.name }) : '';
    s.el.setAttribute('aria-label', `${DAYS[s.d]} ${TIMES[s.h]}, ${s.who === 'free' ? __t('medizen.desk.slot.free') : s.who === 'taken' ? __t('medizen.desk.slot.taken') : __t('medizen.desk.slot.booked', { name: s.name })}`);
  }

  /* state */
  let on = false, t = 0, score = 0, mine = 0, bots = 0, reqs = [], nextSpawn = 0, sel = null, tickT = 0, visible = false, seq = 0, nameI = 0, medI = 0;
  const speed = () => 1 + (t / DAY_MS) * 1.6;                        // the bot: x1 at nine, x2.6 by the end of the day
  const patience = () => 9.5 / speed();
  function paint() {
    const left = Math.max(0, Math.ceil(DAY_MS - t));
    timeEl.textContent = `0:${String(left).padStart(2, '0')}`;
    scoreEl.textContent = String(score); botEl.textContent = String(bots);
    speedEl.style.setProperty('--s', ((speed() - 1) / 1.6).toFixed(3));
    stage.classList.toggle('is-late', on && left <= 10);
  }
  function say(text, good) {
    note.textContent = text; note.dataset.kind = good ? 'good' : 'bad';
    note.classList.remove('is-new'); void note.offsetWidth; note.classList.add('is-new');
    live.textContent = text;
  }
  function pop(el, text, good) {
    if (!el) return;
    const r = el.getBoundingClientRect(), s = stage.getBoundingClientRect();
    const f = document.createElement('span'); f.className = `rcp__pop${good ? '' : ' is-bad'}`; f.textContent = text; f.setAttribute('aria-hidden', 'true');
    // placed from the element's box: physical left/top inside the stage
    f.style.left = `${r.left - s.left + r.width / 2}px`; f.style.top = `${r.top - s.top}px`;
    stage.appendChild(f); setTimeout(() => f.remove(), reduce ? 700 : 1100);
  }

  /* requests */
  function makeReq() {
    const name = NAMES[nameI++ % NAMES.length];
    const free = slots.filter((s) => s.who === 'free');
    const roll = Math.random();
    let r;
    if (roll < 0.24) r = { k: 'med', text: MED[medI++ % MED.length] };
    else if (roll < 0.44 && free.length) { const s = free[Math.floor(Math.random() * free.length)]; r = { k: 'exact', d: s.d, h: s.h, text: __t('medizen.desk.req.exact', { day: DAYS[s.d], time: TIMES[s.h] }) }; }
    else if (roll < 0.62) { const d = Math.floor(Math.random() * DAYS.length); r = { k: 'day', d, text: __t('medizen.desk.req.day', { day: DAYS[d] }) }; }
    else if (roll < 0.76) r = { k: 'am', text: __t('medizen.desk.req.am') };
    else if (roll < 0.88) r = { k: 'pm', text: __t('medizen.desk.req.pm') };
    else r = { k: 'any', text: __t('medizen.desk.req.any') };
    return Object.assign(r, { id: ++seq, name, life: patience(), max: patience() });
  }
  function bubble(r) {
    const li = document.createElement('li'); li.className = 'rcp__req'; li.dataset.id = r.id;
    const b = document.createElement('button'); b.type = 'button'; b.className = 'rcp__b';
    b.innerHTML = '<span class="rcp__n"></span><span class="rcp__x"></span><span class="rcp__bar" aria-hidden="true"><i></i></span><kbd aria-hidden="true"></kbd>';
    b.querySelector('.rcp__n').textContent = r.name; b.querySelector('.rcp__x').textContent = r.text;
    b.setAttribute('aria-label', `${r.name}: ${r.text}`);
    li.appendChild(b); r.el = li; r.btn = b;
    if (reduce) li.style.animation = 'none';
    inbox.appendChild(li);
    b.addEventListener('pointerdown', (e) => startDrag(e, r));
    b.addEventListener('click', () => { if (!dragMoved) select(sel === r ? null : r); });
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(r, true); } });
    renumber();
  }
  function renumber() { reqs.forEach((r, i) => { r.btn.querySelector('kbd').textContent = String(i + 1); }); }
  function removeReq(r, how) {
    const hadFocus = r.el.contains(document.activeElement);
    reqs = reqs.filter((x) => x !== r);
    if (hadFocus) (reqs[0]?.btn || startBtn.closest('.rcp').querySelector('.rcp__tray')).focus({ preventScroll: true });
    if (sel === r) select(null);
    r.el.classList.add(how === 'bot' ? 'is-bot' : 'is-done');
    setTimeout(() => r.el.remove(), reduce ? 0 : 380);
    renumber();
  }
  function select(r, toWeek = false) {
    sel = r;
    reqs.forEach((x) => { x.el.classList.toggle('is-sel', x === r); x.btn.setAttribute('aria-pressed', String(x === r)); });
    stage.classList.toggle('has-sel', !!r);
    if (r && toWeek) { const f = slots.find((s) => s.el.tabIndex === 0) || slots[0]; f.el.focus({ preventScroll: true }); }
  }

  /* placing */
  function place(r, target) {
    if (!on || !r || !reqs.includes(r)) return;
    if (target === 'tray') {
      if (r.k === 'med') { score += 6; mine++; say(__t('medizen.desk.msg.tray.ok', { name: r.name, delta: num(6) }), true); pop(tray, '+6', true); removeReq(r, 'you'); }
      else { score -= 3; say(__t('medizen.desk.msg.tray.wrong', { delta: num(-3) }), false); pop(tray, '−3', false); }
      paint(); return;
    }
    const s = target;
    if (r.k === 'med') { score -= 8; say(__t('medizen.desk.msg.med.calendar', { delta: num(-8) }), false); pop(s.el, '−8', false); paint(); return; }
    if (s.who !== 'free') { score -= 5; say(__t('medizen.desk.msg.taken', { delta: num(-5) }), false); pop(s.el, '−5', false); shake(s.el); paint(); return; }
    if (!fits(r, s.d, s.h)) { score -= 3; say(__t('medizen.desk.msg.nofit', { text: r.text, delta: num(-3) }), false); pop(s.el, '−3', false); shake(s.el); paint(); return; }
    const bonus = Math.round((r.life / r.max) * 5), pts = 10 + bonus;
    score += pts; mine++;
    s.who = 'you'; s.name = r.name; paintSlot(s);
    s.el.classList.remove('is-in'); void s.el.offsetWidth; s.el.classList.add('is-in');
    say(`${r.name}: ${DAYS[s.d]} ${TIMES[s.h]}. ${num(pts)}`, true); pop(s.el, `+${pts}`, true);
    removeReq(r, 'you'); paint();
  }
  const shake = (el) => { if (reduce) return; el.classList.remove('is-no'); void el.offsetWidth; el.classList.add('is-no'); };
  function botTakes(r) {
    if (r.k === 'med') { say(__t('medizen.desk.msg.bot.med', { name: r.name }), false); pop(tray, __t('medizen.desk.pop.bot'), false); }
    else {
      const ok = slots.filter((s) => s.who === 'free' && fits(r, s.d, s.h));
      const s = ok[0];
      if (s) { s.who = 'bot'; s.name = r.name; paintSlot(s); s.el.classList.remove('is-in'); void s.el.offsetWidth; s.el.classList.add('is-in'); pop(s.el, __t('medizen.desk.pop.bot'), false); }
      say(s ? __t('medizen.desk.msg.bot.book', { name: r.name, day: DAYS[s.d], time: TIMES[s.h] }) : __t('medizen.desk.msg.bot.wait', { name: r.name }), false);
    }
    bots++; removeReq(r, 'bot'); paint();
  }

  /* drag: a ghost follows the pointer; the slot under it gets the request */
  let drag = null, dragMoved = false;
  function startDrag(e, r) {
    if (!on || e.button > 0) return;
    dragMoved = false;
    drag = { r, id: e.pointerId, x0: e.clientX, y0: e.clientY, ghost: null, over: null };
    r.btn.setPointerCapture(e.pointerId);
  }
  function targetAt(x, y) {
    const el = document.elementFromPoint(x, y);
    const slot = el?.closest?.('.rcp__slot'); if (slot && stage.contains(slot)) return slots[[...week.querySelectorAll('.rcp__slot')].indexOf(slot)];
    if (el?.closest?.('.rcp__tray') && stage.contains(el)) return 'tray';
    return null;
  }
  function hover(t) {
    if (drag.over === t) return;
    if (drag.over) (drag.over === 'tray' ? tray : drag.over.el).classList.remove('is-over');
    drag.over = t;
    if (t) (t === 'tray' ? tray : t.el).classList.add('is-over');
  }
  stage.addEventListener('pointermove', (e) => {
    if (!drag || e.pointerId !== drag.id) return;
    const dx = e.clientX - drag.x0, dy = e.clientY - drag.y0;
    if (!drag.ghost && Math.hypot(dx, dy) > 6) {
      dragMoved = true; select(drag.r);
      const g = drag.r.btn.cloneNode(true); g.className = 'rcp__b rcp__ghost'; g.removeAttribute('aria-label'); g.setAttribute('aria-hidden', 'true');
      g.style.width = `${drag.r.btn.offsetWidth}px`; document.body.appendChild(g); drag.ghost = g;
      drag.r.el.classList.add('is-lifted'); stage.classList.add('is-dragging');
    }
    if (drag.ghost) {
      // the ghost is fixed to the viewport and follows the pointer: physical coordinates
      drag.ghost.style.transform = `translate(${e.clientX - drag.ghost.offsetWidth / 2}px, ${e.clientY - 26}px)`;
      hover(targetAt(e.clientX, e.clientY));
    }
  });
  const endDrag = (e, cancel) => {
    if (!drag || e.pointerId !== drag.id) return;
    const { r, ghost, over } = drag; drag = null;
    if (ghost) { ghost.remove(); r.el.classList.remove('is-lifted'); stage.classList.remove('is-dragging'); }
    (over === 'tray' ? tray : over?.el)?.classList.remove('is-over');
    if (!cancel && ghost && over) place(r, over);
    setTimeout(() => { dragMoved = false; }, 0);
  };
  stage.addEventListener('pointerup', (e) => endDrag(e, false));
  stage.addEventListener('pointercancel', (e) => endDrag(e, true));

  /* taps and keys on the week */
  slots.forEach((s) => s.el.addEventListener('click', () => { if (sel) place(sel, s); }));
  tray.addEventListener('click', () => { if (sel) place(sel, 'tray'); });
  week.addEventListener('keydown', (e) => {
    const i = slots.findIndex((s) => s.el === document.activeElement); if (i < 0) return;
    let d = slots[i].d, h = slots[i].h;
    // arrows move in the week as it is drawn: in RTL the next day is to the left
    const rtl = getComputedStyle(week).direction === 'rtl';
    if (e.key === 'ArrowLeft') d += rtl ? 1 : -1; else if (e.key === 'ArrowRight') d += rtl ? -1 : 1;
    else if (e.key === 'ArrowUp') h--; else if (e.key === 'ArrowDown') h++;
    else return;
    e.preventDefault();
    d = Math.max(0, Math.min(DAYS.length - 1, d)); h = Math.max(0, Math.min(TIMES.length - 1, h));
    slots.forEach((s) => { s.el.tabIndex = -1; }); const n = slotAt(d, h); n.el.tabIndex = 0; n.el.focus({ preventScroll: true });
  });
  stage.addEventListener('keydown', (e) => {
    if (!on) return;
    if (/^[1-4]$/.test(e.key) && reqs[+e.key - 1]) { e.preventDefault(); select(reqs[+e.key - 1], true); }
    else if ((e.code === 'KeyR') && sel) { e.preventDefault(); place(sel, 'tray'); }
    else if (e.key === 'Escape' && sel) { e.preventDefault(); const r = sel; select(null); r.btn.focus({ preventScroll: true }); }
  });

  /* the day */
  function reset() {
    reqs.forEach((r) => r.el.remove()); reqs = []; sel = null;
    slots.forEach((s) => { s.who = 'free'; s.name = ''; });
    const pool = [...slots].sort(() => Math.random() - 0.5); pool.slice(0, 8).forEach((s) => { s.who = 'taken'; });
    slots.forEach(paintSlot);
    t = 0; score = 0; mine = 0; bots = 0; nextSpawn = 0.6;
    stage.classList.remove('is-end', 'is-late', 'has-sel');
    endEl.hidden = true; paint();
  }
  function start() {
    reset(); on = true; stage.classList.add('is-on');
    say(__t('medizen.desk.msg.start'), true);
    run();
    const f = slots.find((s) => s.who === 'free'); slots.forEach((s) => { s.el.tabIndex = -1; }); f.el.tabIndex = 0;
  }
  function finish() {
    on = false; run(); stage.classList.remove('is-on', 'has-sel'); stage.classList.add('is-end');
    reqs.forEach((r) => r.el.remove()); reqs = []; sel = null;
    const isBest = score > best;
    if (isBest) { best = score; try { localStorage.setItem(BEST_KEY, String(best)); } catch { /* private mode: the best lives for this visit */ } }
    bestEl.textContent = best ? String(best) : '0';
    endEl.querySelector('.rcp__end-h').textContent = __t('medizen.desk.end.h', { n: score });
    endEl.querySelector('.rcp__end-p').textContent = __t('medizen.desk.end.p.proto', { mine: mine, bots: bots, best: isBest ? ' ' + __t('medizen.desk.end.best.new') : '' });
    endEl.hidden = false;
    live.textContent = __t('medizen.desk.live.end', { n: score, mine: mine, bots: bots });
    if (stage.contains(document.activeElement)) endEl.querySelector('button').focus({ preventScroll: true });
    paint();
  }
  function tick() {
    const dt = 0.1;
    t += dt;
    nextSpawn -= dt;
    if (nextSpawn <= 0) {
      if (reqs.length >= 4) botTakes(reqs[0]);
      const r = makeReq(); reqs.push(r); bubble(r);
      nextSpawn = Math.max(1.9, 4.2 - (t / DAY_MS) * 2.4);
    }
    for (const r of [...reqs]) {
      if (drag?.r === r) continue;                              // the one in your hand waits for you
      r.life -= dt;
      r.btn.querySelector('.rcp__bar i').style.transform = `scaleX(${Math.max(0, r.life / r.max).toFixed(3)})`;
      r.el.classList.toggle('is-hurry', r.life < 2);
      if (r.life <= 0) botTakes(r);
    }
    if (t >= DAY_MS) finish(); else paint();
  }
  // the tick runs only while a day is on and the game is on screen
  function run() {
    clearInterval(tickT); tickT = 0;
    if (on && visible) tickT = setInterval(tick, 100);
    stage.classList.toggle('is-paused', on && !visible);
  }
  new IntersectionObserver((es) => { visible = es[es.length - 1].isIntersecting; run(); }, { threshold: 0.25 }).observe(stage);
  startBtn.addEventListener('click', start);
  endEl.querySelector('button').addEventListener('click', () => { start(); });
  addEventListener('pagehide', () => { on = false; clearInterval(tickT); });
  reset();

  stage.__game = {
    start, place: (i, d, h) => place(reqs[i], d === 'tray' ? 'tray' : slotAt(d, h)),
    get reqs() { return reqs.map((r) => ({ k: r.k, d: r.d, h: r.h, name: r.name, life: +r.life.toFixed(1) })); },
    get slots() { return slots.map((s) => s.who); },
    validFor(i) { const r = reqs[i]; if (!r) return null; if (r.k === 'med') return 'tray'; const s = slots.find((x) => x.who === 'free' && fits(r, x.d, x.h)); return s ? [s.d, s.h] : null; },
    slotEl(d, h) { return slotAt(d, h).el; },
    get state() { return { on, t: +t.toFixed(1), score, mine, bots, best, speed: +speed().toFixed(2), running: !!tickT }; },
  };
}
