// transit.js: the connective tissue. After the hero, its cloud of screen cards leaves the hero stage
// for a fixed layer over the page and carries the story between chapters:
//   02  the cards fly back in from the split edges and build the three "after" screens
//   05  they rise from below and build the three phones (the hero cloud reassembles)
//   09  they build the first bio level card
//   10  they form a game controller, then burst into the playground
// Each scene plays once its centrepiece arrives (and rewinds above it); the real DOM screen fades in
// under the tiles and the tiles flip away. Nothing renders between scenes (the GL loop sleeps).

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function initTransit({ gsap, ScrollTrigger, heroST, mobile }) {
  const root = document.documentElement;
  const layer = document.getElementById('cloudLayer');
  const scenes = [];
  const S = window.__siteCloud = {
    on: false, dirty: 0,
    wants() { if (this.dirty > 0) { this.dirty--; return true; } return !!this.scene(); },
    scene() { for (const sc of scenes) if (sc.docks.some((d) => d.p > 0.0005 && d.p < 0.9995)) return sc; return null; },
  };
  const live = () => root.classList.contains('transit');
  const kick = () => { S.dirty = 2; window.__heroGL?.wake?.(); };

  function dockRect(d) {
    if (!d.el) return;
    const r = d.el.getBoundingClientRect();
    d.rect = { x: r.left, y: r.top, w: r.width, h: r.height };
  }
  // A scene plays on its own clock once its centrepiece arrives (and rewinds if the visitor scrolls
  // back above it). The build takes ~0.6 s and starts well below the fold (longer builds still covered the lead during a steady scroll) whatever the scroll speed, so tiles never rest over
  // text: when the visitor stops to read, the build has already finished and the tiles have left.
  function scene(name, docks, { trigger, start, dur = 0.6, section = null }) {
    const sc = { name, docks };
    scenes.push(sc);
    const state = { p: 0 };
    // the chapter's title waits for its centrepiece: it appears once the build reaches 90 % (motion.js)
    const sec = section || docks.find((d) => d.el)?.el.closest('section');
    if (sec) sec.dataset.scene = name;
    const built = () => { if (sec && !sec.dataset.built) { sec.dataset.built = '1'; sec.dispatchEvent(new CustomEvent('scene:built', { bubbles: true })); } };
    const apply = () => {
      if (state.p >= 0.9) built();
      docks.forEach((d) => {
        d.p = state.p;
        dockRect(d);
        if (d.el) d.el.style.setProperty('--dock', smooth(0.66, 0.9, state.p).toFixed(3));
      });
      kick();
    };
    let tw = null;
    const go = (to, t) => { tw?.kill(); tw = gsap.to(state, { p: to, duration: t * Math.abs(to - state.p), ease: to ? 'none' : 'power1.inOut', onUpdate: apply, onComplete: apply }); };
    sc.st = ScrollTrigger.create({
      trigger, start, end: 'max',
      onEnter: () => go(1, dur),
      onLeaveBack: () => go(0, dur * 0.6),
      onRefresh: (self) => { tw?.kill(); state.p = self.progress > 0 ? 1 : 0; apply(); },
    });
    return sc;
  }
  gsap.ticker.add(() => { const sc = S.on && S.scene(); if (sc) sc.docks.forEach(dockRect); });

  // Every chapter's centrepiece is built by the same tiles, and every scene ends before its
  // centrepiece settles in the reading zone (top edge at 72 % of the viewport, or the start of
  // its pin), so no tile ever rests over text or a screen.
  const dock = (el) => { if (el) el.setAttribute('data-dock', ''); return el; };
  const docks = (sel, from = 'below') => [...document.querySelectorAll(sel)].map((el) => ({ el: dock(el), from, p: 0 }));
  const heroEnd = () => (heroST ? heroST.end : 0);

  // 02: the hero's tiles come back from the split edges and build the three "after" screens
  const cmps = [...document.querySelectorAll('#value .cmp')];
  if (mobile) {
    cmps.forEach((c, i) => scene('value', [{ el: c.querySelector('[data-dock]'), from: 'off', direct: true, p: 0 }],
      { trigger: c, start: i ? 'top 96%' : () => heroEnd() + innerHeight * 0.4 }));
  } else {
    scene('value', cmps.map((c) => ({ el: c.querySelector('[data-dock]'), from: 'off', direct: true, p: 0 })),
      { trigger: '#value .ba', start: () => heroEnd() + innerHeight * 0.4 });
  }
  // 03: the skill tree board (desktop board only; the phone list is plain)
  if (!mobile) scene('tree', docks('#services .tr__tree'), { trigger: '#services .tr__tree', start: 'top 135%' });
  // 04: the five step cards
  if (!mobile) scene('process', docks('#process .night__body'), { trigger: '#process .nights', start: 'top 135%' });
  // 05: the three phones, finished as the stage pins
  scene('work', docks('#work .phone__screen'), { trigger: '#workStage', start: 'top 80%' });
  // 06: the dial, finished as the stage pins
  scene('branch', docks('#branch .dial'), { trigger: '#branchStage', start: 'top 80%' });
  // 07: the check field
  if (!mobile) scene('check', docks('#check .ck__field'), { trigger: '#check .ck', start: 'top 135%' });
  // 08: the three plan emblems
  scene('plans', docks('#plans .pl__art'), { trigger: '#plans .pl__grid', start: 'top 135%' });
  // 09: the three bio level cards
  scene('bio', docks('#bio .lv3__img'), { trigger: '#bio .lv3', start: 'top 135%' });
  // 10: the playground strip
  scene('play', docks('#play .strip__img'), { trigger: '#play .strip', start: 'top 135%' });

  // hand-over: the canvas leaves the hero when its pin ends, and comes back on the way up
  const opened = () => (window.__wmGeo?.b ?? 1) > 0.99;
  function setOn(on) {
    if (on && !opened()) { document.addEventListener('hero:open', () => setOn(past()), { once: true }); return; }
    S.on = on;
    root.classList.toggle('past-hero', on);
    window.__heroGL?.mount(on ? layer : null);
    kick();
  }
  const past = () => heroST && (window.__hero?.lenis?.scroll ?? scrollY) >= heroST.end - 1;
  if (heroST) {
    ScrollTrigger.create({
      trigger: '.hero', start: () => heroST.end, end: 'max',
      onEnter: () => setOn(true), onLeaveBack: () => setOn(false),
      onRefresh: () => setOn(past()),
    });
  } else setOn(true);

  // the DOM targets hide (and get built by the cards) only while the cloud is actually alive
  // both the GL context and the cards must be up before the DOM targets hide for the cards to build them
  const ready = () => {
    if (!window.__heroGL || !window.__cloudScreens) return;
    root.classList.remove('gl-fail'); root.classList.add('transit', 'gl-on'); setOn(S.on || past());
  };
  ready();
  document.addEventListener('cloud:ready', ready);
  document.addEventListener('cloud:screens', ready);
  document.addEventListener('cloud:fail', () => {
    root.classList.remove('transit', 'gl-on'); root.classList.add('gl-fail');
    document.querySelectorAll('section[data-scene]:not([data-built])').forEach((sec) => { sec.dataset.built = '1'; sec.dispatchEvent(new CustomEvent('scene:built', { bubbles: true })); });
  });
  return S;
}
