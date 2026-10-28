// medizen-live.js: the MediZen page's live layer. The public demo (medizen-demo.nadavc.ai, which allows
// framing) runs inside the phone at a real 390 px phone width, scaled to the glass. A small coach mark
// says "try it" until the visitor touches it. If the demo has not loaded in 7 s (offline, blocked), the
// real screens take its place with a link out. Beside it a WhatsApp booking plays step by step, labelled
// as an illustration: the bot offers slots, books, and politely refuses a medical question.

const DEMO = 'https://medizen-demo.nadavc.ai/home';
const SCRIPT = [
  { k: 'in', t: __t('medizen.live.m1.patient'), at: '09:41' },
  { k: 'out', t: __t('medizen.live.m2.bot'), at: '09:41', typing: 1100 },
  { k: 'in', t: __t('medizen.live.m3.patient'), at: '09:42' },
  { k: 'out', t: __t('medizen.live.m4.bot'), at: '09:42', typing: 900 },
  { k: 'sys', t: __t('medizen.live.m4.sys') },
  { k: 'in', t: __t('medizen.live.m5.patient'), at: '09:43' },
  { k: 'out', t: __t('medizen.live.m6.bot'), at: '09:43', typing: 1200 },
  { k: 'sys', t: __t('medizen.live.m6.sys') },
];

export function init(stage, { reduce }) {
  initDemo(stage.querySelector('.mz'));
  initChat(stage.querySelector('.wab'), { reduce });
}

function initDemo(mz) {
  if (!mz) return;
  const screen = mz.querySelector('.wkp__screen');
  const frame = mz.querySelector('.mz__frame');
  const fallback = mz.querySelector('.mz__fallback');
  const shots = [...fallback.querySelectorAll('img')];
  let loaded = false, slide = 0, slideT = 0;

  const fit = () => { const w = screen.clientWidth, h = screen.clientHeight; if (!w || !h) return; const s = w / 390; frame.style.transform = `scale(${s})`; frame.querySelector('iframe').style.height = `${Math.round(h / s)}px`; };
  const ifr = document.createElement('iframe');
  ifr.title = __t('medizen.live.frame.title');
  ifr.src = DEMO;
  ifr.loading = 'eager';
  ifr.referrerPolicy = 'strict-origin-when-cross-origin';
  ifr.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox');
  ifr.addEventListener('load', () => { loaded = true; mz.classList.add('is-loaded'); setTimeout(() => mz.classList.add('is-touched'), 9000); });
  // the live demo is heavy: it loads only once the phone is really on screen (the fallback screens show until then)
  let started = false;
  const go = () => {
    if (started) return; started = true;
    frame.appendChild(ifr); fit(); new ResizeObserver(fit).observe(screen);
    setTimeout(fallbackIfSlow, 7000);
  };
  const seen = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { seen.disconnect(); go(); } }, { threshold: 0.3 });
  seen.observe(screen);

  // the coach mark leaves once the visitor reaches into the demo
  const touched = () => mz.classList.add('is-touched');
  screen.addEventListener('pointerenter', touched, { once: true });
  screen.addEventListener('pointerdown', touched, { once: true });
  addEventListener('blur', () => { if (document.activeElement === ifr) touched(); });
  // the demo itself takes touches and the scroll wheel only after a tap on it (or keyboard focus), so swiping or
  // scrolling over the phone moves the page until the visitor chooses to use the demo
  const live = () => mz.classList.add('is-live');
  screen.addEventListener('pointerdown', live, { once: true });
  addEventListener('blur', () => { if (document.activeElement === ifr) live(); });

  function fallbackIfSlow() {
    if (loaded) return;
    mz.classList.add('is-fallback', 'is-loaded', 'is-touched');
    ifr.remove();
    const show = () => { shots.forEach((s, i) => s.classList.toggle('is-on', i === slide)); slide = (slide + 1) % shots.length; };
    show(); slideT = setInterval(show, 2600);
  }
}

function initChat(wab, { reduce }) {
  if (!wab) return;
  const log = wab.querySelector('.wab__log');
  const btn = wab.querySelector('[data-act="replay"]');
  const status = wab.querySelector('.wab__who small');
  let run = 0;
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  function add(m, animate) {
    const li = document.createElement('li');
    li.className = `wab__m wab__m--${m.k}`;
    if (!animate) li.style.animation = 'none';
    li.textContent = m.t;
    if (m.at) { const t = document.createElement('time'); t.textContent = m.at; li.appendChild(t); }
    log.appendChild(li);
  }
  async function play(animate = true) {
    const id = ++run;
    log.innerHTML = '';
    for (const m of SCRIPT) {
      if (id !== run) return;
      if (m.typing && animate) {
        status.textContent = __t('medizen.live.typing');
        const ty = document.createElement('li'); ty.className = 'wab__typing'; ty.setAttribute('aria-hidden', 'true'); ty.innerHTML = '<i></i><i></i><i></i>';
        log.appendChild(ty); await wait(m.typing); ty.remove();
        status.textContent = __t('medizen.live.status');
        if (id !== run) return;
      }
      add(m, animate);
      await wait(animate ? (m.k === 'in' ? 1100 : 1500) : 450);
    }
  }
  btn?.addEventListener('click', () => play(!reduce));
  if (reduce) { SCRIPT.forEach((m) => add(m, false)); return; }
  const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); play(true); } }, { threshold: 0.35 });
  io.observe(wab);
}
