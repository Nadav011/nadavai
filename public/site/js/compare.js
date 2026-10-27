// compare.js (S2): before/after sliders. The handle is a drag on the whole card (horizontal intent only,
// so vertical page scroll still works on touch) plus a native range input for keyboard and screen readers.
// --p is the share of the card that still shows the "before" mess, measured from the reading start.

export function initCompare({ gsap, ScrollTrigger, reduce }) {
  const cards = [...document.querySelectorAll('[data-cmp]')];
  cards.forEach((el, idx) => {
    const range = el.querySelector('.cmp__range');
    const rtl = getComputedStyle(el).direction === 'rtl';
    let p = +range.value, drag = null, tw = null;
    const set = (v, fromInput) => {
      p = Math.max(0, Math.min(100, v));
      el.style.setProperty('--p', p.toFixed(2));
      if (!fromInput) range.value = Math.round(p);
    };
    const fromX = (x) => { const r = el.getBoundingClientRect(); const f = (x - r.left) / r.width; return (rtl ? 1 - f : f) * 100; };

    range.addEventListener('input', () => { tw?.kill(); set(+range.value, true); });
    el.addEventListener('pointerdown', (e) => {
      if (e.button !== 0) return;
      drag = { x: e.clientX, y: e.clientY, id: e.pointerId, on: e.pointerType === 'mouse' };
      if (drag.on) { el.setPointerCapture(e.pointerId); el.classList.add('is-drag'); tw?.kill(); set(fromX(e.clientX)); }
    });
    el.addEventListener('pointermove', (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      if (!drag.on) {
        const dx = Math.abs(e.clientX - drag.x), dy = Math.abs(e.clientY - drag.y);
        if (dy > 8 && dy > dx) { drag = null; return; }        // a vertical swipe: the page scrolls
        if (dx > 6) { drag.on = true; el.setPointerCapture(e.pointerId); el.classList.add('is-drag'); tw?.kill(); }
        else return;
      }
      set(fromX(e.clientX));
    });
    const end = () => { drag = null; el.classList.remove('is-drag'); };
    el.addEventListener('pointerup', end);
    el.addEventListener('pointercancel', end);
    el.addEventListener('lostpointercapture', end);

    // the "aha": you see the mess first; once the card is in the reading zone the handle sweeps across
    // to the fixed screen and settles at 38 %, so the mess is still there to drag back.
    if (!reduce && gsap && ScrollTrigger) {
      set(100);
      let settled = false;
      const settle = () => {
        if (settled) return; settled = true;
        const o = { v: p };
        tw = gsap.timeline({ delay: idx * 0.1 })
          .to(o, { v: 0, duration: p > 1 ? 1.1 : 0.01, ease: 'expo.inOut', onUpdate: () => set(o.v) })
          .to(o, { v: 38, duration: 1.0, ease: 'expo.out', onUpdate: () => set(o.v) });
      };
      ScrollTrigger.create({
        trigger: el, start: 'top 62%',
        onEnter: settle,
        onRefresh: (self) => { if (self.progress > 0 && !settled) { settled = true; set(38); } },
      });
    }
  });
}
