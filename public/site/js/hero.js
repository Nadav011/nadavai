// hero.js: the approved hero v4 (portal + split wordmark), ported from its inline script to a module.
// Behaviour and look are unchanged; only the pin is shorter (length budget) and Lenis comes from the page.
// Publishes window.__wmGeo for hero-gl.js (the cloud of screens) and window.__hero for the page.

export function initHero({ gsap, ScrollTrigger, lenis, reduce }) {
  const root = document.documentElement;
  const engine = !!(gsap && ScrollTrigger);

  const lists = document.querySelectorAll('#ticker ul');
  if (lists.length === 2) lists[1].innerHTML = lists[0].innerHTML;

  const IW = 1024, IH = 1536, PW = 2800, PH = 1536;
  const PHOTO = { fx: 0.50, fy: 0.32 };
  const wideMQ = matchMedia('(min-aspect-ratio: 6/5)');

  const stage = document.getElementById('stage');
  const img = document.getElementById('plate');
  const panelA = document.getElementById('panelA');
  const panelB = document.getElementById('panelB');
  const veil = document.getElementById('veil');
  const seam = document.getElementById('seam');
  const wm = document.getElementById('wm');
  const cap = document.getElementById('wmCap');
  const statement = document.getElementById('statement');
  const stHead = statement.querySelector('.st__head'), stCta = statement.querySelector('.st__cta');
  const halves = [...wm.querySelectorAll('.wm__half')];
  const ins = [...wm.querySelectorAll('.wm__in')];

  const st = { a: 0, b: 0, m: 0 }; // m: the code leaves the letters and draws Nadav's head (before the portal)
  const smooth = (a, b, x) => { const u = clamp((x - a) / (b - a), 0, 1); return u * u * (3 - 2 * u); };
  let G = null;
  const lerp = (p, q, t) => p + (q - p) * t;
  const mix = (P, Q, t) => ({ s: lerp(P.s, Q.s, t), x: lerp(P.x, Q.x, t), y: lerp(P.y, Q.y, t) });
  const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

  // k < 1 shrinks the name when the promise and its CTAs would not fit under it (short or landscape screens)
  function fitWordmark(W, H, wide, k = 1) {
    wm.style.fontSize = '100px';
    const ws = ins.map((el) => el.getBoundingClientRect().width);
    const gut = clamp(W * 0.03, 16, 48);
    let size = wide ? (W - 2 * gut) / ((ws[0] + ws[1]) / 100 + 0.3) : (W - 2 * gut) / (Math.max(ws[0], ws[1]) / 100);
    size = Math.min(size, H * (wide ? 0.56 : 0.22)) * k;
    wm.style.fontSize = size.toFixed(2) + 'px';
    return size;
  }

  function measure(k = 1) {
    const W = stage.clientWidth, H = stage.clientHeight, wide = wideMQ.matches;
    const fxp = PHOTO.fx * IW, fyp = PHOTO.fy * IH;
    let S, A, E, apA;
    if (wide) {
      const sCol = (H + 1) / IH, colW = IW * sCol, colL = W / 2 - colW / 2;
      A = { s: sCol, x: colL, y: 0 };
      const sS = sCol * 1.28, faceX = colL + fxp * sCol, faceY = fyp * sCol;
      S = { s: sS, x: faceX - fxp * sS, y: faceY - fyp * sS };
      const sE = Math.max(sCol, (W + 2) / PW), hE = IH * sE;
      E = { s: sE, x: 0, y: hE > H ? -(hE - H) * 0.12 : 0 };
      apA = [colL, colL + colW];
    } else {
      const sC = Math.max((H + 1) / IH, (W + 1) / IW);
      const place = (s) => ({ s, x: clamp(W / 2 - fxp * s, W - PW * s, 0), y: clamp(fyp * sC - fyp * s, H - PH * s, 0) });
      S = place(sC * 1.3); A = place(sC * 1.12); E = place(sC);
      apA = [W / 2 - W * 0.33, W / 2 + W * 0.33];
    }
    const sMax = Math.max(S.s, A.s, E.s);
    img.style.width = (PW * sMax).toFixed(1) + 'px';
    img.style.height = (PH * sMax).toFixed(1) + 'px';
    const size = fitWordmark(W, H, wide, k);

    halves.forEach((h) => { h.style.transform = ''; });
    ins.forEach((el) => { el.style.transform = ''; });
    const sr = stage.getBoundingClientRect();
    const rects = ins.map((el) => { const r = el.getBoundingClientRect(); return { l: r.left - sr.left, r: r.right - sr.left, t: r.top - sr.top, b: r.bottom - sr.top }; });
    const dirSign = wm.getAttribute('dir') === 'rtl' ? 1 : -1;
    const lo = rects[0].l < rects[1].l ? rects[0] : rects[1], hi = lo === rects[0] ? rects[1] : rects[0];
    const gx = wide ? (lo.r + hi.l) / 2 : W / 2;
    seam.style.insetInlineStart = gx.toFixed(1) + 'px';
    const H2 = halves.map((h, i) => {
      const r = rects[i];
      const leftSide = wide ? (r.l + r.r) / 2 < gx : (i === 0 ? dirSign < 0 : dirSign > 0);
      h.style.transformOrigin = (leftSide ? '100%' : '0%') + ' 60%';
      return { el: h, left: leftSide, off: leftSide ? -(r.r + 12) : (W - r.l + 12) };
    });
    const wmBottom = Math.max(rects[0].b, rects[1].b);
    cap.style.insetBlockStart = (wmBottom + Math.max(14, size * 0.12)).toFixed(1) + 'px';
    if (wide) {
      const startEdge = Math.max(rects[0].r, rects[1].r);
      cap.style.insetInlineStart = Math.max(16, W - startEdge).toFixed(1) + 'px';
      cap.style.insetInlineEnd = 'auto'; cap.style.textAlign = 'start';
    } else {
      cap.style.insetInlineStart = '0px'; cap.style.insetInlineEnd = '0px'; cap.style.textAlign = 'center';
    }
    // the promise and both CTAs sit under the wordmark from first paint (A) and glide to the
    // statement position over the full-bleed portrait (B) as the portal opens
    statement.style.translate = '';
    const sbr = statement.getBoundingClientRect(), hr0 = stHead.getBoundingClientRect(), cr0 = stCta.getBoundingClientRect();
    // on very short screens the caption line is hidden (CSS), so the promise starts under the name itself
    const capHidden = getComputedStyle(cap).display === 'none';
    const capB = capHidden ? wmBottom + 10 : cap.getBoundingClientRect().bottom - sr.top;
    const copyA = wide
      ? { x: W / 2 - (sbr.left - sr.left + sbr.width / 2), y: capB + Math.max(22, H * 0.035) - (hr0.top - sr.top) }
      : { x: 0, y: Math.max(0, sbr.bottom - cr0.bottom) };
    // everything has to fit the first screen: shrink the name (and so everything under it) until it does
    // what shows under the name at rest is the promise and its CTAs (the rest of the statement comes with the portal)
    const stTopA = hr0.top - sr.top + copyA.y, stBottomA = cr0.bottom - sr.top + copyA.y;
    const overflow = wide ? stBottomA > H - 24 : stTopA < capB + 12;
    // narrow screens stop at 0.7 (the CSS hides the caption line on short ones instead); wide ones may go further
    if (overflow && k > (wide ? 0.3 : 0.7)) return measure(k * 0.88);
    G = { W, H, wide, gx, S, A, E, apA, sMax, halves: H2, copyA };
    const WG = window.__wmGeo = window.__wmGeo || { v: 0 };
    WG.v++; WG.W = W; WG.H = H; WG.wide = wide; WG.gx = gx; WG.size = size;
    WG.words = ins.map((el, i) => {
      const cs = getComputedStyle(el), r = rects[i], hr = halves[i].getBoundingClientRect();
      return { text: el.textContent, l: r.l, r: r.r, t: r.t, b: r.b,
        font: { family: cs.fontFamily, weight: cs.fontWeight, stretch: cs.fontStretch, size: parseFloat(cs.fontSize),
          spacing: parseFloat(cs.letterSpacing) || 0, lh: parseFloat(getComputedStyle(wm).lineHeight) || parseFloat(cs.fontSize) * 0.84 },
        left: H2[i].left, ox: (H2[i].left ? hr.right : hr.left) - sr.left, oy: hr.top - sr.top + hr.height * 0.6 };
    });
    WG.tx = [0, 0]; WG.grow = 1; WG.a = 0; WG.b = 0; WG.L = gx; WG.R = gx;
    document.dispatchEvent(new CustomEvent('wm:geo'));
    render();
  }

  function render() {
    if (!G) return;
    const { a, b } = st, W = G.W;
    const P = b > 0 ? mix(G.A, G.E, b) : mix(G.S, G.A, a);
    img.style.transform = `translate3d(${P.x.toFixed(2)}px,${P.y.toFixed(2)}px,0) scale(${(P.s / G.sMax).toFixed(5)})`;
    let L, R;
    if (b > 0) { L = lerp(G.apA[0], 0, b); R = lerp(G.apA[1], W, b); }
    // the opening starts at the gap between the words, or, once the code has become the head, at the head's centre
    // (the photo column's centre), so the portrait comes out of the head
    const c0 = (st.m || 0) > 0.5 ? (G.apA[0] + G.apA[1]) / 2 : G.gx;
    if (b <= 0) { const c = lerp(c0, (G.apA[0] + G.apA[1]) / 2, a), hw = (G.apA[1] - G.apA[0]) / 2 * a; L = c - hw; R = c + hw; }
    // the closed panels overlap by a pixel: meeting edge to edge they leave a sub-pixel hairline of the photo behind them
    panelA.style.transform = `translate3d(${(L - W + 1).toFixed(2)}px,0,0)`;
    panelB.style.transform = `translate3d(${(R - 1).toFixed(2)}px,0,0)`;
    veil.style.opacity = (0.55 * (1 - a)).toFixed(3);
    // the seam between the words steps back while the head forms, so it never runs through the avatar's face
    seam.style.opacity = ((1 - Math.min(1, a * 8)) * (1 - smooth(0.25, 0.6, st.m || 0))).toFixed(3);
    // so do the portal's two edge lines, which meet at the head's centre until the portal starts to open
    stage.style.setProperty('--edge', Math.max(1 - smooth(0.25, 0.6, st.m || 0), smooth(0, 0.08, a)).toFixed(3));
    const grow = 1 + 0.07 * a, WG = window.__wmGeo;
    G.halves.forEach((h, i) => {
      const x = G.wide ? (h.left ? L - c0 : R - c0) : h.off * Math.min(1, a / 0.92);
      h.el.style.transform = `translate3d(${x.toFixed(2)}px,0,0) scale(${grow.toFixed(4)})`;
      if (WG) WG.tx[i] = x;
    });
    // the corner guide steps aside while the code portrait is on stage
    root.classList.toggle('hero-av', (st.m || 0) > 0.5 && b < 0.5);
    if (WG) { WG.grow = grow; WG.a = a; WG.b = b; WG.m = st.m; WG.L = L; WG.R = R; WG.t = performance.now(); }
    const k = 1 - (b < 0.5 ? 4 * b * b * b : 1 - Math.pow(-2 * b + 2, 3) / 2);
    statement.style.translate = `${(G.copyA.x * k).toFixed(1)}px ${(G.copyA.y * k).toFixed(1)}px`;
    // the flying card passes through the copy's place while the portal opens: the copy steps aside
    // (0.05 < a < 0.72) and comes back once the card has gone
    const f = a <= 0.05 || a >= 0.72 ? 1 : a < 0.14 ? 1 - (a - 0.05) / 0.09 : a > 0.62 ? (a - 0.62) / 0.1 : 0;
    stHead.style.opacity = stCta.style.opacity = f.toFixed(3);
    stCta.style.pointerEvents = f < 0.5 ? 'none' : '';
  }

  if (reduce || !engine) {
    root.classList.add('static', 'ready');
    st.a = 1; st.b = 1;
    measure();
    addEventListener('resize', () => measure());
    window.__hero = { lenis, state: st };
    return { st: null };
  }

  measure();
  const hero = document.querySelector('.hero');
  const items = gsap.utils.toArray('.st__item');
  // the approved portal: it opens AS the visitor scrolls (a scrubbed pin of about 1,200 px). The promise
  // and both CTAs are under the wordmark from first paint, so the hero sells before any scroll.
  let opened = false;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    onUpdate: () => {
      render();
      if (!opened && st.b > 0.99) { opened = true; root.classList.add('hero-open'); document.dispatchEvent(new CustomEvent('hero:open')); }
    },
    scrollTrigger: {
      id: 'hero', trigger: hero, start: 'top top',
      end: () => '+=' + Math.round(Math.min(1900, innerHeight * 2.2)), // the head phase adds about a screen
      pin: true, scrub: 0.6, invalidateOnRefresh: true,
    },
  });
  // (Nadav, 2026-10-27) the code letters first redraw themselves as his head, and the portal then opens
  // through the head: his photo comes out of it. With no WebGL the head phase is an empty beat of scroll.
  const HEAD = window.__heroHead === false ? 0 : 2.6;
  tl.to(st, { m: 1, duration: HEAD, ease: 'power2.inOut' }, 0)
    .to(st, { a: 1, duration: 4.4, ease: 'power2.inOut' }, HEAD)
    .fromTo(cap, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -12, duration: 1.3, ease: 'power1.in' }, 0.15)
    .fromTo('#cornerBS', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.9 }, 0.2)
    .to(st, { b: 1, duration: 3.2, ease: 'power3.inOut' }, HEAD + 4.7)
    .fromTo('#scrimText', { autoAlpha: 0 }, { autoAlpha: 1, duration: 1.8, ease: 'power1.inOut' }, HEAD + 6.3)
    .fromTo('#ticker', { autoAlpha: 0, yPercent: 100 }, { autoAlpha: 1, yPercent: 0, duration: 1.4, ease: 'power3.out' }, HEAD + 6.6)
    .fromTo(items, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 1.1, stagger: 0.2, ease: 'power3.out' }, HEAD + 6.7)
    .to({}, { duration: 0.4 });

  ScrollTrigger.addEventListener('refreshInit', () => { G = null; });
  ScrollTrigger.addEventListener('refresh', () => { measure(); });

  initPointerCraft();

  root.classList.add('ready');
  if ((lenis ? lenis.scroll : scrollY) < 4) {
    gsap.timeline()
      .from(ins, { yPercent: 112, duration: 1.35, ease: 'expo.out', stagger: 0.08 }, 0.05)
      .from(seam, { scaleY: 0, duration: 1.4, ease: 'expo.inOut' }, 0)
      .from(['.cap__in', '.corner > span', '.nav > *'], { autoAlpha: 0, y: 8, duration: 0.7, stagger: 0.03, ease: 'power2.out', clearProps: 'opacity,visibility,transform' }, 0.2)
      .from(['.st__head', '.st__cta'], { autoAlpha: 0, y: 10, duration: 0.5, stagger: 0.06, ease: 'power2.out', clearProps: 'opacity,visibility,transform' }, 0.1);
  }
  const heroST = ScrollTrigger.getById('hero');
  window.__hero = { lenis, st: heroST, tl, state: st };
  return { st: heroST };

  function initPointerCraft() {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    gsap.utils.toArray('[data-magnetic]').forEach((el) => {
      const k = parseFloat(el.dataset.magnetic) || 0.3;
      const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => { const r = el.getBoundingClientRect(); xTo((e.clientX - (r.left + r.width / 2)) * k); yTo((e.clientY - (r.top + r.height / 2)) * k * 1.4); });
      el.addEventListener('pointerleave', () => gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' }));
    });
    const par = document.getElementById('par'), stp = document.getElementById('stPar');
    let tx = 0, ty = 0, cx = 0, cy = 0, live = false;
    addEventListener('pointermove', (e) => { tx = (e.clientX / innerWidth) * 2 - 1; ty = (e.clientY / innerHeight) * 2 - 1; }, { passive: true });
    gsap.ticker.add((time, dt) => {
      const s = ScrollTrigger.getById('hero'), b = st.b;
      const on = b > 0.001 && s && (lenis ? lenis.scroll : scrollY) < s.end + innerHeight;
      if (!on) { if (live) { par.style.transform = ''; stp.style.transform = ''; live = false; } return; }
      live = true;
      const f = 1 - Math.pow(0.0025, (dt || 16) / 1000);
      cx += (tx - cx) * f; cy += (ty - cy) * f;
      const e = b * b;
      par.style.transform = `translate3d(${(-cx * 14 * e).toFixed(2)}px,${(-cy * 9 * e).toFixed(2)}px,0) scale(${(1 + 0.03 * e).toFixed(4)})`;
      stp.style.transform = `translate3d(${(cx * 6 * e).toFixed(2)}px,${(cy * 4 * e).toFixed(2)}px,0)`;
    });
  }
}
