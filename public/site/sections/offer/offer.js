/* ══ OFFER: skill tree (#services) + character select (#plans) ══════════════════
   initOffer({ gsap, ScrollTrigger, lenis }) wires both sections and returns cleanup().
   gsap / ScrollTrigger / lenis are the host page's instances; any of them may be missing,
   and then the sections fall back to their static, fully unlocked state.
   One clock: no own rAF loops or scroll listeners; ScrollTrigger reads the host's Lenis. */

const RM = '(prefers-reduced-motion: reduce)';
const TREE = '(min-width: 1100px) and (min-height: 620px)';
const LIST = '(max-width: 1099.98px), (max-height: 619.98px)'; // the complement: gsap.matchMedia only runs on a match
const HOVER = '(hover: hover) and (pointer: fine)';
const pad = (n) => String(n).padStart(2, '0');

export function initOffer({ gsap, ScrollTrigger, lenis } = {}) {
  const engine = !!(gsap && ScrollTrigger);
  if (engine) gsap.registerPlugin(ScrollTrigger);
  const env = { gsap, ScrollTrigger, lenis, engine };
  const cleanups = [];
  const svc = document.querySelector('#services.offer');
  const plans = document.querySelector('#plans.offer');
  if (svc) cleanups.push(initTree(svc, env));
  if (plans) cleanups.push(initPlans(plans, env));
  if (engine) ScrollTrigger.refresh();
  return () => { cleanups.splice(0).reverse().forEach((fn) => fn()); };
}

/* ── shared helpers ─────────────────────────────────────────────────── */
function listeners() {
  const off = [];
  return {
    on(el, type, fn, opt) { el.addEventListener(type, fn, opt); off.push(() => el.removeEventListener(type, fn, opt)); },
    clear() { off.splice(0).forEach((fn) => fn()); },
  };
}

/* ══ SKILL TREE ═════════════════════════════════════════════════════════════ */
function initTree(svc, { gsap, lenis, engine }) {
  const L = listeners();
  const reduceMQ = matchMedia(RM);
  const treeMQ = matchMedia(TREE);
  const stage = svc.querySelector('.tr__stage');
  const side = svc.querySelector('.tr__side');
  const geo = svc.querySelector('.tr__geo');
  const nodes = [...svc.querySelectorAll('.tr__skills .sk')];
  const quests = [...svc.querySelectorAll('.qs')];
  const edges = [...svc.querySelectorAll('.ed')];
  const vfill = svc.querySelector('.tr__vfill');
  const cur = svc.querySelector('.tr__cur');
  const card = svc.querySelector('.tr__card');
  const inner = card.querySelector('.tc__in');
  const body = card.querySelector('.tc__body');
  const num = card.querySelector('.tc__n');
  const closeBtn = card.querySelector('.tc__x');

  svc.classList.add('is-ready');

  /* lit state: the n first skills and the q first quest steps */
  let litN = -1, litQ = -1;
  function setLit(n, q, pop = true) {
    if (n !== litN) {
      nodes.forEach((li, i) => {
        const on = i < n, was = li.classList.contains('is-lit');
        li.classList.toggle('is-lit', on);
        if (on && !was && pop) { li.classList.remove('is-pop'); void li.offsetWidth; li.classList.add('is-pop'); }
      });
      edges.forEach((ed) => {
        const to = ed.dataset.to;
        ed.classList.toggle('is-on', to === 'q' ? q > 0 : Number(to) <= n);
      });
      cur.textContent = pad(n);
      litN = n;
    }
    if (q !== litQ) {
      quests.forEach((el, i) => el.classList.toggle('is-lit', i < q));
      edges.forEach((ed) => { if (ed.dataset.to === 'q') ed.classList.toggle('is-on', q > 0); });
      litQ = q;
    }
  }
  const litAll = () => setLit(nodes.length, quests.length, false);

  /* ── card: a side panel on the board, a bottom sheet in the list layout ── */
  let active = null;
  let sheetTween = null;
  const motionOK = () => engine && !reduceMQ.matches;
  const isModal = () => !svc.classList.contains('is-tree');

  function markActive(li) {
    nodes.forEach((n) => {
      const on = n === li;
      n.classList.toggle('is-active', on);
      n.querySelector('.sk__btn').setAttribute('aria-expanded', String(on));
    });
  }

  function fill(li) {
    body.innerHTML = li.querySelector('.sk__detail').innerHTML;
    const h = body.querySelector('.tc__h');
    if (h) h.id = 'offer-card-title';
    num.textContent = pad(li.dataset.i);
    body.querySelectorAll('img').forEach((img) => { img.loading = 'eager'; });
  }

  function openCard(li) {
    const wasOpen = card.open;
    fill(li);
    markActive(li);
    active = li;
    if (!wasOpen) {
      if (isModal()) {
        card.showModal();
        if (lenis) lenis.stop();
        if (motionOK()) {
          sheetTween?.kill();
          sheetTween = gsap.fromTo(inner, { yPercent: 100 }, { yPercent: 0, y: 0, duration: 0.5, ease: 'expo.out' });
        }
      } else {
        card.show();
        side.classList.add('has-card');
        if (motionOK()) {
          gsap.fromTo(inner, { opacity: 0, x: -28, filter: 'blur(6px)' },
            { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.45, ease: 'power3.out', clearProps: 'filter' });
        }
      }
      closeBtn.focus({ preventScroll: true });
    } else if (motionOK()) {
      gsap.fromTo(body, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power3.out' });
      inner.scrollTop = 0;
    }
  }

  function closeCard({ instant = false, focus = true } = {}) {
    if (!card.open) return;
    const li = active;
    const finish = () => {
      card.close();
      side.classList.remove('has-card');
      markActive(null);
      active = null;
      gsap?.set(inner, { clearProps: 'all' });
      if (lenis) lenis.start();
      if (focus && li) li.querySelector('.sk__btn').focus({ preventScroll: true });
    };
    if (instant || !motionOK()) return finish();
    if (card.matches(':modal')) {
      sheetTween?.kill();
      sheetTween = gsap.to(inner, { yPercent: 100, duration: 0.26, ease: 'power2.inOut', onComplete: finish });
    } else {
      gsap.to(inner, { opacity: 0, x: -16, duration: 0.18, ease: 'power2.out', onComplete: finish });
    }
  }

  nodes.forEach((li) => {
    L.on(li.querySelector('.sk__btn'), 'click', () => {
      if (card.open && active === li) closeCard(); else openCard(li);
    });
  });
  L.on(closeBtn, 'click', () => closeCard());
  L.on(card, 'cancel', (e) => { e.preventDefault(); closeCard(); });
  L.on(card, 'keydown', (e) => { if (e.key === 'Escape' && !card.matches(':modal')) { e.preventDefault(); closeCard(); } });
  // a click on the backdrop lands on the <dialog> itself
  L.on(card, 'click', (e) => { if (e.target === card && card.matches(':modal')) closeCard(); });

  /* drag the sheet down to dismiss it */
  let drag = null;
  const grabZones = [card.querySelector('.tc__grab'), card.querySelector('.tc__top')];
  grabZones.forEach((zone) => {
    L.on(zone, 'pointerdown', (e) => {
      if (!card.matches(':modal') || e.target.closest('.tc__x') || !e.isPrimary) return;
      drag = { y0: e.clientY, t0: performance.now(), dy: 0, id: e.pointerId };
      zone.setPointerCapture(e.pointerId);
      sheetTween?.kill();
    });
    L.on(zone, 'pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      drag.dy = Math.max(0, e.clientY - drag.y0);
      inner.style.transform = `translateY(${drag.dy}px)`;
    });
    const end = (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const v = drag.dy / Math.max(1, performance.now() - drag.t0);
      const dy = drag.dy;
      drag = null;
      if (dy > 110 || v > 0.6) {
        if (motionOK()) {
          sheetTween = gsap.to(inner, { y: inner.offsetHeight, duration: 0.22, ease: 'power2.out', onComplete: () => closeCard({ instant: true }) });
        } else closeCard({ instant: true });
      } else if (motionOK()) {
        sheetTween = gsap.to(inner, { y: 0, duration: 0.35, ease: 'expo.out', clearProps: 'transform' });
      } else inner.style.transform = '';
    };
    L.on(zone, 'pointerup', end);
    L.on(zone, 'pointercancel', end);
  });

  /* ── layouts and motion ─────────────────────────────────────────────── */
  if (!engine) {
    const apply = () => { closeCard({ instant: true, focus: false }); svc.classList.toggle('is-tree', treeMQ.matches); };
    apply();
    svc.classList.add('is-static');
    litAll();
    L.on(treeMQ, 'change', apply);
    return () => { L.clear(); closeCard({ instant: true, focus: false }); svc.classList.remove('is-ready', 'is-tree', 'is-static'); };
  }

  const mm = gsap.matchMedia();
  mm.add({ tree: TREE, list: LIST, reduce: RM }, (ctx) => {
    const { tree, reduce } = ctx.conditions;
    closeCard({ instant: true, focus: false });
    svc.classList.toggle('is-tree', tree);
    svc.classList.toggle('is-static', reduce);
    litN = litQ = -1;

    if (reduce) { litAll(); return; }

    if (tree) {
      /* the board: pinned, scroll draws each path and unlocks its skill, then the quest */
      const draw = (sel) => [...svc.querySelectorAll(sel)].flatMap((ed) => [...ed.querySelectorAll('.ed__lit,.ed__glow')]);
      draw('.ed').forEach((p) => {
        const len = Math.ceil(p.getTotalLength()) + 2;
        gsap.set(p, { strokeDasharray: `${len} ${len}`, strokeDashoffset: len });
      });
      setLit(0, 0, false);

      const marks = [];
      const qmarks = [];
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        // the playhead keeps moving after the scroll stops (scrub), so the unlocks follow the timeline itself
        onUpdate: () => {
          const t = tl.time() + 1e-4;
          setLit(marks.filter((m) => t >= m).length, qmarks.filter((m) => t >= m).length);
        },
        scrollTrigger: {
          id: 'offer-tree',
          trigger: stage,
          start: 'top top',
          end: () => '+=' + Math.round(innerHeight * (+svc.dataset.pin || 2.4)),
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
      tl.to({}, { duration: 0.25 });
      for (let i = 1; i <= nodes.length; i++) {
        tl.to(draw(`.ed[data-to="${i}"]`), { strokeDashoffset: 0, duration: 0.9 });
        marks.push(tl.duration());
        tl.to({}, { duration: 0.3 });
      }
      /* quest path: 265 units down and around the corner, then 840 across; steps sit at x = --x * 10 */
      const qStart = tl.duration(), qDur = 3.2, total = 265 + 840;
      tl.to(draw('.ed--quest'), { strokeDashoffset: 0, duration: qDur });
      quests.forEach((el) => {
        const x = parseFloat(el.style.getPropertyValue('--x')) * 10;
        qmarks.push(qStart + qDur * Math.min(1, (265 + 910 - x) / total));
      });
      tl.to({}, { duration: 0.6 });
      return () => { gsap.set(draw('.ed'), { clearProps: 'strokeDasharray,strokeDashoffset' }); };
    }

    /* the list: a single vertical path, each node unlocks as it reaches the reading line */
    setLit(0, 0, false);
    gsap.fromTo(vfill, { scaleY: 0 }, {
      scaleY: 1, ease: 'none',
      scrollTrigger: { trigger: geo, start: 'top 62%', end: 'bottom 62%', scrub: 0.4 },
    });
    const count = () => setLit(nodes.filter((n) => n.dataset.seen).length, quests.filter((q) => q.dataset.seen).length);
    [...nodes, ...quests].forEach((el) => {
      ScrollTrigger.create({
        trigger: el, start: 'top 62%',
        onEnter: () => { el.dataset.seen = '1'; count(); },
        onLeaveBack: () => { delete el.dataset.seen; count(); },
      });
    });
    return () => { [...nodes, ...quests].forEach((el) => delete el.dataset.seen); };
  });

  return () => {
    L.clear();
    mm.revert();
    closeCard({ instant: true, focus: false });
    svc.classList.remove('is-ready', 'is-tree', 'is-static');
    nodes.forEach((n) => n.classList.remove('is-lit', 'is-pop', 'is-active'));
    quests.forEach((q) => q.classList.remove('is-lit'));
    edges.forEach((e) => e.classList.remove('is-on'));
  };
}

/* ══ CHARACTER SELECT ══════════════════════════════════════════════════════ */
function initPlans(sec, { gsap, ScrollTrigger, engine }) {
  const L = listeners();
  const reduceMQ = matchMedia(RM);
  const hoverMQ = matchMedia(HOVER);
  const grid = sec.querySelector('.pl__grid');
  const cards = [...sec.querySelectorAll('.pl')];
  const cursor = sec.querySelector('.pl__cursor');
  const motionOK = () => engine && !reduceMQ.matches;
  let selected = null;
  let previewed = cards[0];
  let pending = null;

  sec.classList.add('is-ready');
  cards.forEach((c) => c.classList.remove('is-cursor'));

  /* the cursor sits on the reading-start corner of the grid; offsets are measured physically */
  function place(card, instant) {
    if (!grid.classList.contains('has-cursor') || !card) return;
    const g = grid.getBoundingClientRect(), c = card.getBoundingClientRect();
    const rtl = getComputedStyle(grid).direction === 'rtl';
    const to = { x: rtl ? c.right - g.right : c.left - g.left, y: c.top - g.top, width: c.width, height: c.height };
    if (instant || !motionOK()) gsap ? gsap.set(cursor, to) : Object.assign(cursor.style, { width: to.width + 'px', height: to.height + 'px', transform: `translate(${to.x}px,${to.y}px)` });
    else gsap.to(cursor, { ...to, duration: 0.42, ease: 'power3.out', overwrite: 'auto' });
  }

  function preview(card, instant) {
    previewed = card;
    cards.forEach((c) => c.classList.toggle('is-cursor', c === card));
    place(card, instant);
  }

  /* pointer + wide grid: one gliding cursor previews a plan at a time.
     touch or narrow: no hover, so each card fills its stat bars once it scrolls into view */
  let seen = [];
  function useCursor() {
    const on = hoverMQ.matches && grid.offsetWidth >= 700;
    grid.classList.toggle('has-cursor', on);
    if (on) {
      seen.forEach((t) => t.kill()); seen = [];
      // reduced motion: every bar shows its final value; otherwise only the previewed plan lights up
      cards.forEach((c) => c.classList.toggle('is-seen', !motionOK()));
      place(previewed, true);
      return;
    }
    if (!motionOK()) { cards.forEach((c) => c.classList.add('is-seen')); return; }
    if (!seen.length) {
      seen = cards.map((c) => ScrollTrigger.create({ trigger: c.querySelector('.pl__stats'), start: 'top 88%', once: true,
        onEnter: () => c.classList.add('is-seen') }));
    }
  }

  cards.forEach((card) => {
    L.on(card, 'pointerenter', (e) => { if (e.pointerType === 'mouse' && hoverMQ.matches) preview(card); });
    L.on(card, 'focusin', () => preview(card));
    L.on(card.querySelector('.pl__go'), 'click', (e) => select(card, e));
  });
  L.on(grid, 'pointerleave', (e) => { if (e.pointerType === 'mouse') preview(selected || cards[0]); });
  L.on(grid, 'focusout', (e) => { if (!grid.contains(e.relatedTarget)) preview(selected || cards[0]); });

  function openWa(href) {
    const w = window.open(href, '_blank');
    if (w) { try { w.opener = null; } catch (_) { /* cross-origin already */ } } else location.href = href;
  }

  function select(card, e) {
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return; // let the browser handle it
    selected = card;
    cards.forEach((c) => c.classList.toggle('is-selected', c === card));
    preview(card);
    if (!motionOK()) return; // the link opens WhatsApp in a new tab right away
    e.preventDefault();
    const href = card.querySelector('.pl__go').href;
    playSelect(card);
    pending?.kill();
    pending = gsap.delayedCall(0.5, () => openWa(href));
  }

  function playSelect(card) {
    const tl = gsap.timeline({ defaults: { overwrite: 'auto' } });
    const rtl = getComputedStyle(card).direction === 'rtl';
    tl.fromTo(card, { scale: 0.97 }, { scale: 1, duration: 0.55, ease: 'back.out(3)', clearProps: 'scale' }, 0)
      .fromTo(card.querySelector('.pl__flash'), { opacity: 1, xPercent: rtl ? 100 : -100 },
        { xPercent: rtl ? -100 : 100, duration: 0.6, ease: 'power2.out' }, 0)
      .to(card.querySelector('.pl__flash'), { opacity: 0, duration: 0.15 }, 0.45)
      .fromTo(card.querySelector('.pl__stamp'), { opacity: 0, scale: 1.9, rotate: -16 },
        { opacity: 1, scale: 1, rotate: -6, duration: 0.4, ease: 'back.out(2.4)' }, 0.06)
      .fromTo(card.querySelector('.pl__art img'), { scale: 1 }, { scale: 1.14, duration: 0.14, ease: 'power2.out', yoyo: true, repeat: 1 }, 0);
    if (grid.classList.contains('has-cursor')) {
      tl.fromTo(cursor, { scale: 1.08 }, { scale: 1, duration: 0.45, ease: 'back.out(3)' }, 0);
    }
  }

  /* entrance: the roster slides in once, then the cursor lands on the first plan */
  const ro = new ResizeObserver(() => { useCursor(); if (engine) ScrollTrigger.refresh(); });
  let st = null;
  useCursor();
  if (motionOK()) {
    gsap.set(cursor, { opacity: 0 });
    const tl = gsap.timeline({ paused: true })
      .from(cards, { y: 56, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1, clearProps: 'transform,opacity' })
      .from(sec.querySelectorAll('.pl__art'), { scale: 0.86, duration: 1, ease: 'power3.out', stagger: 0.1, clearProps: 'scale' }, 0)
      .add(() => { preview(cards[0], true); useCursor(); }, 0.55)
      .to(cursor, { opacity: 1, duration: 0.3 }, 0.6);
    st = ScrollTrigger.create({ trigger: grid, start: 'top 82%', once: true, onEnter: () => tl.play() });
  } else {
    preview(cards[0], true);
    cursor.style.opacity = '1';
  }
  requestAnimationFrame(() => ro.observe(grid));

  return () => {
    L.clear();
    ro.disconnect();
    st?.kill();
    seen.forEach((t) => t.kill());
    pending?.kill();
    gsap?.killTweensOf([cursor, ...cards]);
    sec.classList.remove('is-ready');
    grid.classList.remove('has-cursor');
    cards.forEach((c) => c.classList.remove('is-cursor', 'is-selected', 'is-seen'));
    cards[0].classList.add('is-cursor');
  };
}
