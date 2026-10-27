// work.js (S5): three products in parallel. The stage pins; the cloud builds the three phones (transit.js),
// then scroll walks the focus across them (the others blur and recede, the focused app's world fades in
// behind). Hover, keyboard focus or a tap take over the focus; on touch the first tap focuses and the
// second opens the project page.

const APPS = {
  sporchat: { name: 'SporChat', role: 'CTO', line: __t('home.live.sporchat.line'), live: __t('home.live.sporchat.status'), href: __href('work-sporchat') },
  medizen: { name: 'MediZen', role: 'Co-Founder & CTO', line: __t('home.live.medizen.line'), live: __t('home.live.medizen.status'), href: __href('work-medizen') },
  greenroom: { name: 'Green Room', role: __t('home.live.greenroom.role'), line: __t('home.live.greenroom.line'), live: __t('home.live.sporchat.status'), href: __href('work-green-room') },
};
const ORDER = ['sporchat', 'medizen', 'greenroom'];

export function initWork({ gsap, ScrollTrigger, reduce }) {
  const stage = document.getElementById('workStage');
  const list = document.getElementById('phones');
  const phones = [...list.querySelectorAll('.phone')];
  const worlds = [...stage.querySelectorAll('.world')];
  const cap = document.getElementById('workCap');
  const el = (s) => cap.querySelector(s);
  const touch = matchMedia('(hover: none)').matches;
  let scrollFocus = null, manual = null, shown;

  // the worlds load only when the stage is close, and each one the first time its app is focused
  const load = (pic) => { if (!pic || pic.dataset.loaded) return; pic.dataset.loaded = '1';
    pic.querySelectorAll('[data-srcset]').forEach((s) => { s.srcset = s.dataset.srcset; });
    const img = pic.querySelector('img[data-src]'); if (img) img.src = img.dataset.src; };
  let near = false;
  new IntersectionObserver((es, io) => { if (es[0].isIntersecting) { near = true; io.disconnect(); load(worlds.find((w) => w.dataset.app === (shown || 'medizen'))); } }, { rootMargin: '60% 0px' }).observe(stage);
  function show(app) {
    if (app === shown) return;
    shown = app;
    if (near || reduce) load(worlds.find((w) => w.dataset.app === app));
    phones.forEach((p) => p.classList.toggle('is-focus', p.dataset.app === app));
    list.classList.toggle('has-focus', !!app);
    worlds.forEach((w) => w.classList.toggle('is-on', w.dataset.app === app));
    const A = APPS[app]; if (!A) return;
    el('.wc__app').textContent = A.name;
    el('.wc__role').textContent = A.role;
    el('.wc__line').textContent = A.line;
    el('.wc__live').textContent = A.live;
    el('.wc__go').href = A.href;
    if (gsap && !reduce) gsap.fromTo(cap.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.05, ease: 'expo.out', overwrite: true });
  }
  const sync = () => show(manual || scrollFocus);

  phones.forEach((p) => {
    const a = p.querySelector('.phone__a');
    p.addEventListener('pointerenter', (e) => { if (e.pointerType === 'mouse') { manual = p.dataset.app; sync(); } });
    a.addEventListener('focus', () => { manual = p.dataset.app; sync(); });
    // touch: the first tap focuses the phone, the second opens its page
    // (pointerdown runs before focus, so it records whether this phone was already the focused one)
    let ptr = '', was = false;
    a.addEventListener('pointerdown', (e) => { ptr = e.pointerType; was = shown === p.dataset.app; });
    a.addEventListener('click', (e) => {
      const tap = touch || (ptr && ptr !== 'mouse');
      if (tap && !was) { e.preventDefault(); manual = p.dataset.app; sync(); }
      ptr = ''; was = false;
    });
  });
  list.addEventListener('pointerleave', (e) => { if (e.pointerType === 'mouse') { manual = null; sync(); } });
  list.addEventListener('focusout', (e) => { if (!list.contains(e.relatedTarget)) { manual = null; sync(); } });

  if (reduce || !gsap || !ScrollTrigger) { show('medizen'); return; }
  show(null);
  // the pin: ~0.25 screen for the phones to be built, then one beat per app
  ScrollTrigger.create({
    id: 'work', trigger: stage, start: 'top top', end: () => '+=' + Math.round(Math.min(440, innerHeight * 0.5)),
    pin: true, anticipatePin: 1, invalidateOnRefresh: true,
    onUpdate: (self) => {
      const p = self.progress;
      const next = ORDER[Math.min(2, Math.floor(p * 3))];
      if (next !== scrollFocus) { scrollFocus = next; if (touch) manual = null; sync(); }
    },
  });
}
