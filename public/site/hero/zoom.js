// zoom.js — the "zoom-in" moments, as crisp DOM twins of the WebGL cards.
//
//  peek      in the hero, a few seconds after the wordmark forms, one curated card slides out of the
//            cloud, grows to a readable size in front of the wordmark with a one-line caption, holds,
//            and flies back into its slot. It cycles through the curated cards while the hero rests.
//  fly       as the portal opens, one card flies forward past the camera and hands over to the portrait
//            (scrubbed by the portal progress, so it runs backwards when you scroll back).
//  open      click/tap any card (or use the keyboard list) → an accessible dialog with the card large;
//            Esc, the close button or a click outside closes it and focus returns.
//  focusCard(id, {mode:'open'|'peek'}) is the same effect for later sections.

const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };

export function createZoom({ stage, eng, cards, U, fine, mobile }) {
  const gsap = window.gsap;
  const root = document.documentElement;
  const G = () => window.__wmGeo;
  const offs = [];
  const on = (t, e, f, o) => { t.addEventListener(e, f, o); offs.push(() => t.removeEventListener(e, f, o)); };

  // ---------- DOM ----------
  const layer = document.createElement('div');
  layer.className = 'zc-layer'; layer.setAttribute('aria-hidden', 'true');
  const mk = (cls) => {
    const f = document.createElement('figure'); f.className = `zc ${cls}`;
    f.innerHTML = '<div class="zc__glass"><img alt="" decoding="async"></div><figcaption class="zc__cap"><i aria-hidden="true"></i><span></span></figcaption>';
    layer.appendChild(f); return f;
  };
  const peekEl = mk('zc--peek'), flyEl = mk('zc--fly');
  stage.appendChild(layer);

  const dlg = document.createElement('div');
  dlg.className = 'zd'; dlg.hidden = true;
  dlg.setAttribute('role', 'dialog'); dlg.setAttribute('aria-modal', 'true'); dlg.setAttribute('aria-labelledby', 'zdCap');
  dlg.innerHTML = '<div class="zd__scrim"></div><figure class="zc zd__card"><div class="zc__glass"><img alt="" decoding="async"></div><figcaption class="zc__cap" id="zdCap"><i aria-hidden="true"></i><span></span></figcaption></figure><button type="button" class="zd__close" aria-label="' + __t('home.hero.dialog.close') + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg></button><a class="zd__go" href="' + __href('work') + '">' + __t('home.hero.peek.go') + '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3m4-4L3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></a>';
  document.body.appendChild(dlg);
  const dCard = dlg.querySelector('.zd__card'), dClose = dlg.querySelector('.zd__close'), dScrim = dlg.querySelector('.zd__scrim'), dGo = dlg.querySelector('.zd__go');

  // keyboard path into the cards: a short list, visible when focused
  const list = document.createElement('div');
  list.className = 'zc-keys';
  list.setAttribute('role', 'group'); list.setAttribute('aria-label', __t('home.hero.cloud.listLabel'));
  const curated = cards.map((c, i) => ({ c, i })).filter(({ c }) => c.cycle).sort((p, q) => p.c.cycle - q.c.cycle);
  // visible project chips under the name (Nadav, 2026-10-27): the product name on the chip, the full message for
  // assistive tech; the chip of the screen on show lights up, a click compiles it (Enter opens the full dialog)
  list.innerHTML = '<i class="zc-keys__mark" aria-hidden="true">&lt;/&gt;</i>' + curated.map(({ c, i }) => {
    const [, product] = c.caption.split(' · ');
    const [msg] = c.caption.split(' · ');
    return `<button type="button" data-card="${i}" data-id="${c.id}" aria-label="${product}: ${msg}" aria-haspopup="dialog"><i aria-hidden="true"></i>${product}</button>`;
  }).join('');
  stage.appendChild(list);

  const fill = (el, c) => {
    const img = el.querySelector('img');
    if (img.getAttribute('src') !== c.src) img.src = c.src;
    img.alt = el.closest('.zd') ? `${c.alt || c.caption}` : '';
    el.querySelector('.zc__cap span').textContent = c.caption;
  };
  // preload the curated twins so a peek never shows an empty frame
  curated.forEach(({ c }) => { const im = new Image(); im.src = c.src; });

  const geom = () => ({ W: stage.clientWidth, H: stage.clientHeight });
  function targetRect(scale = 1) {
    const { W, H } = geom(), g = G();
    // the peek sits above the promise line and the CTAs, which are on screen from first paint
    const h = Math.min(H * (mobile ? 0.3 : 0.5), 560, mobile ? W * 0.45 * (1170 / 540) : 9999) * scale, w = h * (540 / 1170);
    const cx = mobile ? W / 2 : (g?.gx ?? W / 2), cy = H * (mobile ? 0.29 : 0.4);
    return { x: cx - w / 2, y: cy - h / 2, w, h };
  }
  const place = (el, r) => Object.assign(el.style, { left: `${r.x}px`, top: `${r.y}px`, width: `${r.w}px`, height: `${r.h}px` });
  const fromVars = (src, dst) => ({ x: src.x - dst.x, y: src.y - dst.y, scale: src.w / dst.w });
  // fx (0..1) picks a slot that far across the wordmark, from its left edge; without it, the slot nearest the gap
  function bestSlot(cardIdx, fx) {
    const s = eng.slotsOf(cardIdx), g = G();
    if (!s.length) return -1;
    const cy = (g.words[0].t + g.words[0].b) / 2;
    const L = Math.min(...g.words.map((w) => w.l)), R = Math.max(...g.words.map((w) => w.r));
    const tx = fx == null ? g.gx : L + (R - L) * fx;
    let best = s[0], bd = Infinity;
    for (const i of s) { const r = eng.rectOf(i), d = Math.abs(r.x + r.w / 2 - tx) * 0.6 + Math.abs(r.y + r.h / 2 - cy); if (d < bd) { bd = d; best = i; } }
    return best;
  }
  // the peek frame (Nadav, 2026-10-27): the screen opens upward into the space above the wordmark and never covers it.
  // It sits over its own tile, shifted just enough for a one-line message beside it; a thin beam of light ties the two.
  const FRAME = 1.6; // frame height / width; the screens are 1170 / 540 ≈ 2.17, so about a quarter scrolls inside it
  const navH = () => parseFloat(getComputedStyle(root).getPropertyValue('--nav')) || 68;
  function screenRect(S) {
    const { W } = geom(), g = G();
    const top = navH() + 36; // clear of the meta line under the nav
    const bottom = Math.min(...g.words.map((w) => w.t)) - 12;
    const h = Math.min(bottom - top, 340);
    if (h < 140) return null; // no room above the name: no peek
    // on a phone the window is a little narrower (taller) so the message beside it gets room to breathe
    const w = h / (W < 600 ? 1.95 : FRAME), cx = S.x + S.w / 2, toRight = cx < W / 2;
    const capW = Math.min(260, W * 0.42), need = capW + 26;
    let x = cx - w / 2;
    x = toRight ? Math.min(x, W - need - w) : Math.max(x, need);
    x = Math.min(Math.max(x, cx - w + 18), cx - 18); // the beam still lands on the screen
    x = Math.min(Math.max(12, x), W - 12 - w);
    const capMax = Math.max(100, Math.min(capW, toRight ? W - (x + w) - 26 : x - 26));
    const ay = S.y + S.h * 0.35;
    return { x, y: bottom - h, w, h, cx, ay, beamTop: bottom, beamBottom: ay, toRight, capMax, dir: 'up' };
  }
  // ...and downward (Nadav, 2026-10-27: "up and down, something else each time"): under the name, wherever the
  // promise, the CTAs, the chips, the corners and the avatar leave a column free for the frame and its message.
  // Phones have no such column (the message sits above the frame there), so their "down" unrolls from above instead.
  const OBST = '#wmCap .cap__in, .zc-keys:not(.is-tight) button, #heroTitle, .st__cta a, .corner span, .nav-avatar__btn';
  function obstacles(pad = 14) {
    const sr = stage.getBoundingClientRect();
    return [...document.querySelectorAll(OBST)].flatMap((el) => {
      // the heading by its lines, not its box: a short last line leaves room the box would hide
      let rs = [el.getBoundingClientRect()];
      if (el.id === 'heroTitle') { const r = document.createRange(); r.selectNodeContents(el); rs = [...r.getClientRects()]; }
      return rs.filter((r) => r.width > 0 && r.height > 0)
        .map((r) => ({ l: r.left - sr.left - pad, t: r.top - sr.top - pad, r: r.right - sr.left + pad, b: r.bottom - sr.top + pad }));
    });
  }
  const hits = (o, x, y, w, h) => o.some((q) => x < q.r && x + w > q.l && y < q.b && y + h > q.t);
  // how far a frame may grow on hover (from the edge nearest the letter) without covering anything or leaving the window
  function growFor(T, hinge) {
    const { W, H } = geom(), o = obstacles(4), top = navH() + 2;
    for (const g of [1.14, 1.1, 1.06, 1.03]) {
      const w = T.w * g, h = T.h * g, x = T.x - (w - T.w) / 2, y = hinge === 'top' ? T.y : T.y + T.h - h;
      if (x < 4 || x + w > W - 4 || y < top || y + h > H - 6) continue;
      if (!hits(o, x, y, w, h)) return g;
    }
    return 1;
  }
  function downRect(cardIdx, { fx, slot } = {}) {
    const { W, H } = geom(), g = G();
    if (W <= 720) return null;
    const top = Math.max(...g.words.map((w) => w.b)) + 16;
    const L = Math.min(...g.words.map((q) => q.l)), R = Math.max(...g.words.map((q) => q.r));
    const tx = fx == null ? g.gx : L + (R - L) * fx;
    const o = obstacles(), capH = 120;
    // the largest frame that fits (the free column is often the strip beside the promise), then the nearest slot
    for (const k of [1, 0.88, 0.76, 0.66]) {
      const h = Math.min(H - 16 - top, 340) * k; if (h < 200) return null;
      const w = h / FRAME, capW = Math.min(240, W * 0.3);
      let best = null;
      // the screen may rise from any spot of the name (the tiles are hidden in the letters), its own spots first
      const own = new Set(eng.slotsOf(cardIdx));
      for (const i of slot != null ? [slot] : eng.blocks.map((_, k) => k)) {
        const S = eng.rectOf(i), cx = S.x + S.w / 2;
        for (let x = cx - w + 18; x <= cx - 18; x += 6) {
          if (x < 12 || x + w > W - 12 || hits(o, x, top, w, h)) continue;
          for (const toRight of [true, false]) {
            const capX = toRight ? x + w + 16 : x - 16 - capW;
            if (capX < 8 || capX + capW > W - 8 || hits(o, capX, top + 10, capW, capH)) continue;
            const d = Math.abs(cx - tx) * 0.5 + Math.abs(x + w / 2 - cx) + (toRight === cx < W / 2 ? 0 : 30) + (own.has(i) ? 0 : 60);
            if (!best || d < best.d) best = { d, i, x, cx, toRight, ay: S.y + S.h * 0.65, h, w, capW };
          }
        }
      }
      if (best) {
        const { i, x, cx, toRight, ay, h: bh, w: bw, capW: cw } = best;
        return { slot: i, x, y: top, w: bw, h: bh, cx, ay, beamTop: ay, beamBottom: top, toRight, capMax: cw, dir: 'down' };
      }
    }
    return null;
  }
  const beam = document.createElement('i');
  beam.className = 'zc-beam'; layer.appendChild(beam);
  // the peek "compiles" (Nadav, 2026-10-27): code rises out of the letter, the screen tilts up showing only code,
  // a scan line turns the code into the real screen, the message writes itself beside it; on the way out the screen
  // dissolves back into code and falls into the letter
  const rise = document.createElement('div');
  rise.className = 'zc-rise'; rise.setAttribute('aria-hidden', 'true'); layer.appendChild(rise);
  const TOK = ['{', '}', '<', '/>', ';', '=>', '()', '[]', '&&', '0', '1', '#', 'fn', 'if', 'ai', 'א', 'ב', 'ש', 'ת', 'נ', 'ד'];
  const pick = () => TOK[(Math.random() * TOK.length) | 0];
  const sparks = Array.from({ length: 18 }, () => { const s = document.createElement('i'); rise.appendChild(s); return s; });
  const TC = 5, TR = 8, SLATS = 7; // the tiles grid and the blinds
  {
    const glass = peekEl.querySelector('.zc__glass'), img = glass.querySelector('img');
    const scr = Object.assign(document.createElement('div'), { className: 'zc__scr' });
    glass.insertBefore(scr, img); scr.appendChild(img);
    glass.append(...['zc__code', 'zc__scan', 'zc__shine', 'zc__island'].map((k) => Object.assign(document.createElement('i'), { className: k })));
    const blinds = Object.assign(document.createElement('div'), { className: 'zc__blinds' });
    blinds.append(...Array.from({ length: SLATS }, () => document.createElement('i')));
    glass.appendChild(blinds);
    // the hover label: where a click goes
    glass.insertAdjacentHTML('beforeend', '<b class="zc__go"><span class="zc__go-l">' + __t('home.hero.peek.go') + '</span><span class="zc__go-s">' + __t('home.hero.peek.goShort') + '</span><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3m4-4L3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></b>');
    // the tiles sit on the figure, not inside the glass, so they can fly in from the letter outside the frame
    const tiles = Object.assign(document.createElement('div'), { className: 'zc__tiles' });
    tiles.append(...Array.from({ length: TC * TR }, (_, k) => { const e = document.createElement('i'); e.style.cssText = `left:${(k % TC) * 100 / TC}%;top:${Math.floor(k / TC) * 100 / TR}%;width:${100 / TC}%;height:${100 / TR}%`; return e; }));
    peekEl.appendChild(tiles);
    peekEl.appendChild(Object.assign(document.createElement('i'), { className: 'zc__floor' }));
  }
  // anticipation: two rings ripple out of the spot a screen is about to come from (and answer a click on a letter)
  const rings = [0, 1].map(() => { const r = document.createElement('i'); r.className = 'zc-pulse'; layer.appendChild(r); return r; });
  function pulseAt(x, y) {
    if (!gsap) return;
    rings.forEach((r, i) => gsap.fromTo(r, { left: x, top: y, scale: 0.2, autoAlpha: 0.95 },
      { scale: 3.4, autoAlpha: 0, duration: 0.85, ease: 'power2.out', delay: i * 0.16, overwrite: true }));
  }
  const codeText = (cols, rows) => Array.from({ length: rows }, () => {
    let s = ''; while (s.length < cols) s += pick() + ' '.repeat(1 + ((Math.random() * 3) | 0)); return s.slice(0, cols);
  }).join('\n');

  // ---------- the reveals ----------
  // Each peek shows its screen a different way (Nadav, 2026-10-27). in(tl, at) builds the screen from the dark glass;
  // out(tl) takes it back; both run inside the shared frame motion (the frame opens, the message writes, it closes).
  // E holds the peek's parts: scr (the real screen), img, code, scan, slats, tiles, T (the layout), down (the side
  // the letter is on: the top edge for a screen under the name).
  const EFFECTS = {
    // code glows in the glass and a scan line turns it into the screen, starting from the letter's side
    compile: {
      in(tl, E, at) {
        const sc = { p: 0 };
        const paint = () => {
          const p = sc.p * 100;
          if (E.down) { E.scr.style.clipPath = `inset(0 0 ${100 - p}% 0)`; E.code.style.clipPath = `inset(${p}% 0 0 0)`; E.scan.style.top = `${p}%`; }
          else { E.scr.style.clipPath = `inset(${100 - p}% 0 0 0)`; E.code.style.clipPath = `inset(0 0 ${p}% 0)`; E.scan.style.top = `${100 - p}%`; }
        };
        E.paint = paint; E.sc = sc;
        tl.call(() => { E.code.style.opacity = '1'; sc.p = 0; paint(); }, null, 0)
          .set(E.scan, { autoAlpha: 1 }, at)
          .to(sc, { p: 1, duration: 1.0, ease: 'power2.inOut', onUpdate: paint }, at)
          .to(E.scan, { autoAlpha: 0, duration: 0.25 }, '>-0.05');
      },
      out(tl, E) {
        tl.set(E.scan, { autoAlpha: 1 })
          .to(E.sc, { p: 0, duration: 0.6, ease: 'power2.in', onUpdate: E.paint })
          .to(E.img, { y: 0, duration: 0.6, ease: 'power2.in' }, '<')
          .set(E.scan, { autoAlpha: 0 });
      },
    },
    // the screen flies out of the letter in pieces and assembles in the frame
    tiles: {
      in(tl, E, at) {
        const { T } = E, tw = T.w / TC, th = T.h / TR;
        E.tiles.forEach((el, k) => {
          const c = k % TC, r = Math.floor(k / TC);
          Object.assign(el.style, { backgroundImage: `url("${E.src}")`, backgroundSize: `${T.w}px auto`, backgroundPosition: `${-c * tw}px ${-r * th}px` });
        });
        const from = (k) => { const c = k % TC, r = Math.floor(k / TC); return { x: T.cx - (T.x + (c + 0.5) * tw), y: T.ay - (T.y + (r + 0.5) * th) }; };
        tl.set(E.scr, { clipPath: 'inset(0 0 100% 0)' }, 0)
          .fromTo(E.tiles, { x: (k) => from(k).x, y: (k) => from(k).y, scale: 0.15, rotation: () => (Math.random() - 0.5) * 120, autoAlpha: 0 },
            { x: 0, y: 0, scale: 1, rotation: 0, autoAlpha: 1, duration: 0.75, ease: 'expo.out', stagger: { each: 0.012, from: E.down ? 'start' : 'end' } }, at - 0.25)
          .set(E.scr, { clipPath: 'none' })
          .set(E.tiles, { autoAlpha: 0 });
      },
      out(tl, E) {
        const { T } = E, tw = T.w / TC, th = T.h / TR;
        tl.to(E.img, { y: 0, duration: 0.45, ease: 'power2.inOut' })
          .set(E.tiles, { autoAlpha: 1 }).set(E.scr, { clipPath: 'inset(0 0 100% 0)' })
          .to(E.tiles, { x: (k) => T.cx - (T.x + ((k % TC) + 0.5) * tw), y: (k) => T.ay - (T.y + (Math.floor(k / TC) + 0.5) * th),
            scale: 0.1, rotation: () => (Math.random() - 0.5) * 140, autoAlpha: 0, duration: 0.6, ease: 'power3.in', stagger: { each: 0.008, from: 'random' } });
        E.exitAt = '-=0.5';
      },
    },
    // seven slats flip open one after another, from the letter's side
    blinds: {
      in(tl, E, at) {
        const o = E.down ? '50% 0%' : '50% 100%';
        tl.set(E.slats, { autoAlpha: 1, rotationX: 0, transformOrigin: o }, 0)
          .to(E.slats, { rotationX: E.down ? -92 : 92, duration: 0.55, ease: 'power3.inOut', stagger: { each: 0.07, from: E.down ? 'start' : 'end' } }, at)
          .set(E.slats, { autoAlpha: 0 });
      },
      out(tl, E) {
        tl.to(E.img, { y: 0, duration: 0.45, ease: 'power2.inOut' })
          .set(E.slats, { autoAlpha: 1 })
          .to(E.slats, { rotationX: 0, duration: 0.4, ease: 'power3.in', stagger: { each: 0.05, from: E.down ? 'end' : 'start' } });
      },
    },
    // a circle of light opens from where the beam lands
    iris: {
      in(tl, E, at) {
        const o = E.down ? '50% 0%' : '50% 100%', s = { r: 0 }, R = Math.hypot(E.T.w, E.T.h) / Math.SQRT2;
        E.ringEl.style.setProperty('--o', o);
        const paint = () => { E.scr.style.clipPath = `circle(${s.r}% at ${o})`; E.ringEl.style.setProperty('--rp', `${(s.r / 100 * R).toFixed(1)}px`); };
        E.irisS = s; E.irisPaint = paint; E.irisMax = 100 * Math.hypot(E.T.w / 2, E.T.h) / R + 4;
        tl.call(() => { s.r = 0; paint(); }, null, 0)
          .set(E.ringEl, { autoAlpha: 1 }, at)
          .to(s, { r: E.irisMax, duration: 0.95, ease: 'power3.inOut', onUpdate: paint }, at)
          .to(E.ringEl, { autoAlpha: 0, duration: 0.3 }, '>-0.3');
      },
      out(tl, E) {
        tl.to(E.img, { y: 0, duration: 0.45, ease: 'power2.inOut' })
          .set(E.ringEl, { autoAlpha: 1 })
          .to(E.irisS, { r: 0, duration: 0.55, ease: 'power3.in', onUpdate: E.irisPaint })
          .set(E.ringEl, { autoAlpha: 0 });
      },
    },
    // the signal locks on: slices of the screen jump into place with a split of color, then hold still
    glitch: {
      in(tl, E, at) {
        const steps = ['inset(62% 0 18% 0)', 'inset(8% 0 70% 0)', 'inset(30% 0 34% 0)', 'inset(0 0 52% 0)', 'inset(44% 0 0 0)', 'inset(0 0 12% 0)', 'none'];
        const xs = [-9, 7, -5, 4, -3, 2, 0];
        tl.set(E.scr, { clipPath: 'inset(0 0 100% 0)' }, 0)
          .set(E.code, { opacity: 1, clipPath: 'none' }, 0)
          .set(E.scr, { filter: 'drop-shadow(4px 0 rgba(255,40,90,.75)) drop-shadow(-4px 0 rgba(40,220,255,.75))' }, at);
        steps.forEach((s, k) => tl.set(E.scr, { clipPath: s, x: xs[k] }, at + k * 0.07));
        tl.set(E.code, { opacity: 0 }, at + 0.3)
          .to(E.scr, { filter: 'drop-shadow(0px 0 rgba(255,40,90,0)) drop-shadow(0px 0 rgba(40,220,255,0))', duration: 0.35 }, at + steps.length * 0.07)
          .set(E.scr, { clearProps: 'filter' });
      },
      out(tl, E) {
        const steps = ['inset(0 0 20% 0)', 'inset(36% 0 22% 0)', 'inset(10% 0 64% 0)', 'inset(70% 0 8% 0)', 'inset(0 0 100% 0)'];
        tl.to(E.img, { y: 0, duration: 0.45, ease: 'power2.inOut' })
          .set(E.scr, { filter: 'drop-shadow(4px 0 rgba(255,40,90,.75)) drop-shadow(-4px 0 rgba(40,220,255,.75))' });
        steps.forEach((s, k) => tl.set(E.scr, { clipPath: s, x: k % 2 ? 6 : -6 }, `+=${k ? 0.06 : 0}`));
        tl.set(E.scr, { x: 0, clearProps: 'filter' });
      },
    },
  };
  const ORDER = ['compile', 'tiles', 'blinds', 'iris', 'glitch'];
  {
    const ringEl = Object.assign(document.createElement('i'), { className: 'zc__iris' });
    peekEl.querySelector('.zc__glass').appendChild(ringEl);
  }

  // ---------- peek cycle ----------
  let leaving = false, manual = false, peekBusy = false, nextPeek = 0, cycleI = 0, fxI = 0, dirI = 0, peekE = null, peekTl = null, peekCard = -1, held = false, back = null;
  const qs = new URLSearchParams(location.search);
  const noAuto = qs.get('peeks') === '0'; // review stills: no automatic screens
  // review links: ?fx=tiles shows only that reveal, ?dir=up|down only that side (the morning choice page uses both)
  const onlyFx = qs.get('fx'), onlyDir = ['up', 'down'].includes(qs.get('dir')) ? qs.get('dir') : null;
  const canPeek = () => noAuto || !dlg.hidden ? false : (G()?.a ?? 1) < 0.01 && (G()?.m ?? 0) < 0.02 && !document.hidden && U.uIntro.value > 2.6;
  function peek(cardIdx, { hold = 2.6, fx, slot: at, dir, effect } = {}) {
    if (peekBusy || !gsap || !dlg.hidden) return Promise.resolve();
    dir ??= onlyDir ?? (dirI++ % 2 ? 'down' : 'up');
    let T = dir === 'down' ? downRect(cardIdx, { fx, slot: at }) : null, drop = false;
    if (!T) {
      const slot = at ?? bestSlot(cardIdx, fx); if (slot < 0) return Promise.resolve();
      T = screenRect(eng.rectOf(slot)); if (!T) return Promise.resolve();
      drop = dir === 'down'; // no room under the name: the screen unrolls downward from above it instead
    }
    const fxName = EFFECTS[effect] ? effect : EFFECTS[onlyFx] ? onlyFx : ORDER[fxI++ % ORDER.length];
    const FX = EFFECTS[fxName], down = T.dir === 'down';
    peekBusy = true; peekCard = cardIdx; held = false;
    const c = cards[cardIdx]; fill(peekEl, c); place(peekEl, T);
    peekEl.dataset.fx = fxName;
    peekEl.classList.toggle('is-down', down);
    peekEl.classList.remove('is-hover');
    peekEl.style.setProperty('--grow', growFor(T, down ? 'top' : 'bottom').toFixed(3));
    const rtl = getComputedStyle(stage).direction === 'rtl';
    peekEl.classList.toggle('cap-start', T.toRight === rtl);
    peekEl.classList.toggle('cap-end', T.toRight !== rtl);
    const cap = peekEl.querySelector('.zc__cap'); cap.style.maxWidth = `${T.capMax}px`;
    // the message word by word, the product under it: "what it does" first, then "where"
    const [msg, ...tag] = c.caption.split(' · ');
    const span = cap.querySelector('span'); span.textContent = '';
    const words = msg.split(' ').map((w, i, a) => { const e = document.createElement('span'); e.className = 'w'; e.textContent = w + (i < a.length - 1 ? ' ' : ''); span.appendChild(e); return e; });
    const tagEl = cap.querySelector('.zc__tag') || cap.appendChild(Object.assign(document.createElement('b'), { className: 'zc__tag' }));
    tagEl.innerHTML = '';
    tag.forEach((part, i) => { if (i) tagEl.append(Object.assign(document.createElement('span'), { className: 'sep', textContent: ' · ' })); tagEl.append(Object.assign(document.createElement('span'), { textContent: part })); });
    const glass = peekEl.querySelector('.zc__glass'), scr = glass.querySelector('.zc__scr'), img = scr.querySelector('img');
    const code = glass.querySelector('.zc__code'), scan = glass.querySelector('.zc__scan'), shine = glass.querySelector('.zc__shine'), go = glass.querySelector('.zc__go');
    const ringEl = glass.querySelector('.zc__iris');
    const E = { T, down, src: c.src, scr, img, code, scan, ringEl, slats: [...glass.querySelectorAll('.zc__blinds i')], tiles: [...peekEl.querySelectorAll('.zc__tiles i')] };
    peekE = E;
    code.textContent = codeText(Math.ceil(T.w / 5.6), Math.ceil(T.h / 10.5));
    beam.classList.toggle('is-down', down);
    Object.assign(beam.style, { left: `${T.cx}px`, top: `${Math.min(T.beamTop, T.beamBottom)}px`, height: `${Math.max(8, Math.abs(T.beamBottom - T.beamTop))}px` });
    const travel = () => -Math.max(0, img.offsetHeight - scr.clientHeight);
    // the sparks: from the letter into the near edge of the screen, and back at the end
    const ax = T.cx, ay = T.ay;
    sparks.forEach((s) => { s.textContent = pick(); });
    const land = () => ({ x: (Math.random() - 0.5) * T.w * 0.9, y: (down ? T.y + T.h * (0.05 + Math.random() * 0.25) : T.y + T.h * (0.7 + Math.random() * 0.25)) - ay });
    // the frame hinges on the edge nearest the letter (or, unrolling from above, on its top edge)
    const hinge = down || drop ? '50% 0%' : '50% 100%', tilt = down || drop ? -26 : 26, off = drop ? -34 : down ? -26 : 26;
    const reset = () => {
      gsap.set(img, { y: 0 }); gsap.set([beam, cap, scan, go, ringEl, ...sparks, ...E.slats, ...E.tiles], { autoAlpha: 0 });
      gsap.set(scr, { x: 0, clearProps: 'filter' });
      scr.style.clipPath = ''; code.style.clipPath = ''; code.style.opacity = '0';
    };
    return new Promise((res) => {
      pulseAt(ax, ay);
      reset();
      peekTl = gsap.timeline({
        delay: 0.3, // the rings first, then the code rises from the same spot
        onComplete: () => {
          peekEl.classList.remove('is-on', 'is-hover'); list.classList.remove('is-held'); reset();
          peekBusy = false; peekTl = null; held = false;
          window.dispatchEvent(new CustomEvent('cloud:peek', { detail: { id: c.id, phase: 'home' } })); res();
        },
      });
      peekEl.classList.add('is-on');
      gsap.set(sparks, { left: ax, top: ay, x: 0, y: 0, autoAlpha: 0, scale: 1 });
      peekTl.set(peekEl, { x: 0, y: off, scale: 0.94, rotationX: tilt, transformPerspective: 900, transformOrigin: hinge, autoAlpha: 0 })
        .set(cap, { autoAlpha: 0, y: 8 }).set(words, { autoAlpha: 0, y: 6, filter: 'blur(5px)' })
        .set(tagEl, { autoAlpha: 0 }).set(shine, { xPercent: -120 })
        .fromTo(beam, { autoAlpha: 0, scaleY: 0 }, { autoAlpha: 1, scaleY: 1, duration: 0.5, ease: 'power2.out' })
        .to(sparks, { keyframes: { autoAlpha: [0, 1, 1, 0] }, x: (i) => land().x, y: (i) => land().y,
          duration: 0.85, ease: 'power2.inOut', stagger: 0.025 }, 0.05)
        .to(peekEl, { y: 0, scale: 1, rotationX: 0, autoAlpha: 1, duration: 1.0, ease: 'expo.out' }, 0.35);
      FX.in(peekTl, E, 0.8);
      peekTl.to(shine, { xPercent: 120, duration: 0.9, ease: 'power2.inOut' }, 1.75)
        .to(cap, { autoAlpha: 1, y: 0, duration: 0.45, ease: 'power2.out' }, 1.55)
        .to(words, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.4, ease: 'power2.out', stagger: 0.045 }, 1.65)
        .to(tagEl, { autoAlpha: 1, duration: 0.35 }, '>-0.1')
        .to(go, { autoAlpha: 1, duration: 0.35 }, '<')
        .addLabel('shown', '>')
        // a pointer resting on the screen holds it here (see hover below)
        .call(() => { if (held) peekTl.pause(); }, null, 'shown')
        .to(img, { y: travel, duration: Math.max(1.8, hold), ease: 'sine.inOut' }, 'shown+=0.15')
        .to({}, { duration: 0.35 })
        .addLabel('leave')
        .to([cap, go], { autoAlpha: 0, duration: 0.3 });
      FX.out(peekTl, E);
      peekTl.to(peekEl, { y: off * 0.75, scale: 0.94, rotationX: tilt, autoAlpha: 0, duration: 0.5, ease: 'power2.in' }, E.exitAt || '>')
        .to(sparks, { keyframes: { autoAlpha: [0, 1, 0] }, x: 0, y: 0, duration: 0.6, ease: 'power2.in', stagger: 0.02 }, '<')
        .to(beam, { autoAlpha: 0, scaleY: 0, duration: 0.35, ease: 'power2.in' }, '>-0.2');
      // announced once the whole timeline is built, so listeners can read its duration (the chip bar)
      window.dispatchEvent(new CustomEvent('cloud:peek', { detail: { id: c.id, phase: 'out' } }));
    });
  }
  // the screen as it stands once built: a rewind ends here, whatever the reveal's steps left behind
  function shownState(E) {
    if (!E) return;
    gsap.set([E.scan, E.ringEl, ...E.slats, ...E.tiles], { autoAlpha: 0 });
    gsap.set(E.scr, { x: 0, clearProps: 'filter' });
    E.scr.style.clipPath = 'none'; E.code.style.opacity = '0';
    if (E.paint) { E.sc.p = 1; E.paint(); E.code.style.opacity = '1'; }
    if (E.irisPaint) { E.irisS.r = E.irisMax; E.irisPaint(); }
  }
  function abortPeek() { back?.kill(); back = null; held = false; if (peekTl) { peekTl.paused(false); peekTl.progress(1); } }
  // the chip's timer bar follows the screen: restarted at the timeline's own point after a hold or a rewind
  function syncBar() {
    const b = list.querySelector('button.is-live'); if (!b || !peekTl) return;
    const d = peekTl.duration() + 0.3;
    b.classList.remove('is-live'); void b.offsetWidth;
    b.style.setProperty('--run', `${d.toFixed(2)}s`);
    b.style.setProperty('--run-at', `${(-(peekTl.time() + 0.3)).toFixed(2)}s`);
    b.classList.add('is-live');
  }

  // hover: the screen leans toward the pointer (grows, glows, waits), and says a click opens its project page.
  // Arriving while it is still building lets it finish first; arriving while it closes plays it back open.
  if (fine) {
    on(peekEl, 'pointerenter', (e) => {
      if (e.pointerType === 'touch' || !peekTl) return;
      held = true; peekEl.classList.add('is-hover'); list.classList.add('is-held');
      const t = peekTl.time(), s = peekTl.labels.shown, l = peekTl.labels.leave;
      if (t >= l) { peekTl.pause(); back = peekTl.tweenTo('shown', { duration: Math.min(0.6, (t - s) * 0.6), ease: 'power2.out', onComplete: () => shownState(peekE) }); }
      else if (t >= s) peekTl.pause();
    });
    on(peekEl, 'pointerleave', () => {
      if (!held || leaving) return;
      held = false; peekEl.classList.remove('is-hover'); list.classList.remove('is-held');
      back?.kill(); back = null;
      if (peekTl) { peekTl.play(); syncBar(); }
    });
  }
  // click: the screen opens into its project's page
  function goTo(ci, e) {
    const c = cards[ci]; if (!c?.page) return;
    if (e && (e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1)) { window.open(c.page, '_blank', 'noopener'); return; }
    const glass = peekEl.querySelector('.zc__glass');
    if (!gsap || !peekEl.classList.contains('is-on')) { location.href = c.page; return; }
    leaving = true; back?.kill(); peekTl?.pause();
    const r = glass.getBoundingClientRect(), k = r.width / glass.offsetWidth;
    const z = document.createElement('div'); z.className = 'zc-go';
    z.innerHTML = `<img alt="" src="${c.src}">`;
    const im = peekEl.querySelector('.zc__scr img');
    Object.assign(z.style, { left: `${r.left}px`, top: `${r.top}px`, width: `${r.width}px`, height: `${r.height}px` });
    z.firstChild.style.transform = `translateY(${(gsap.getProperty(im, 'y') || 0) * k}px)`;
    document.body.appendChild(z); peekEl.style.visibility = 'hidden';
    let gone = false;
    const nav = () => { if (gone) return; gone = true; location.href = c.page; };
    gsap.timeline({ onComplete: nav })
      .to(z, { left: 0, top: 0, width: innerWidth, height: innerHeight, borderRadius: 0, duration: 0.7, ease: 'expo.inOut' })
      .to(z.firstChild, { autoAlpha: 0, scale: 1.08, duration: 0.45, ease: 'power2.in' }, 0.3);
    setTimeout(nav, 1300);
  }
  on(window, 'pageshow', (e) => {
    if (!e.persisted) return;
    document.querySelectorAll('.zc-go').forEach((z) => z.remove());
    leaving = false; peekEl.style.visibility = ''; abortPeek();
  });

  // ---------- fly-through on the portal ----------
  let flySlot = -1, flyFrom = null;
  const flyCard = Math.max(0, cards.findIndex((c) => c.fly));
  function updateFly() {
    const g = G(); if (!g) return;
    // with the head phase the portrait comes straight out of the head: no card flies through the opening
    const a = (g.m ?? 0) > 0.5 ? 0 : g.a;
    if (a < 0.02) {
      if (flySlot >= 0) { eng.show(flySlot); flySlot = -1; flyEl.classList.remove('is-on'); flyEl.style.opacity = '0'; }
      return;
    }
    if (a > 0.8) { flyEl.style.opacity = '0'; return; }
    if (flySlot < 0) {
      abortPeek();
      flySlot = bestSlot(flyCard); if (flySlot < 0) return;
      flyFrom = eng.rectOf(flySlot); eng.hide(flySlot);
      fill(flyEl, cards[flyCard]); flyEl.classList.add('is-on');
    }
    const { W, H } = geom();
    const u = smooth(0.02, 0.74, a), k = Math.pow(u, 1.6);
    const endH = H * 3.2, endW = endH * (540 / 1170);
    const cx0 = flyFrom.x + flyFrom.w / 2, cy0 = flyFrom.y + flyFrom.h / 2;
    const cx1 = (g.L + g.R) / 2, cy1 = H * 0.5;
    const w = flyFrom.w + (endW - flyFrom.w) * k, h = flyFrom.h + (endH - flyFrom.h) * k;
    const cx = cx0 + (cx1 - cx0) * smooth(0, 0.6, u), cy = cy0 + (cy1 - cy0) * smooth(0, 0.6, u);
    flyEl.style.transform = 'none';
    place(flyEl, { x: cx - w / 2, y: cy - h / 2, w, h });
    flyEl.style.opacity = String(1 - smooth(0.42, 0.72, a));
  }

  // ---------- dialog ----------
  let dlgFrom = null, dlgSlot = -1, lastFocus = null;
  function open(cardIdx, slot = -1) {
    if (!gsap || !dlg.hidden) return;
    abortPeek();
    const c = cards[cardIdx]; fill(dCard, c); dGo.href = c.page || __href('work');
    lastFocus = document.activeElement;
    dlg.hidden = false; root.classList.add('zd-open');
    const vw = innerWidth, vh = innerHeight;
    const h = Math.min(vh * 0.82, vh - 240, 760), w = h * (540 / 1170);
    const T = { x: (vw - w) / 2, y: (vh - h) / 2 - (mobile ? 18 : 10), w, h };
    place(dCard, T);
    dlgSlot = slot;
    if (slot >= 0) { const r = eng.rectOf(slot), sr = stage.getBoundingClientRect(); dlgFrom = { x: r.x + sr.left, y: r.y + sr.top, w: r.w, h: r.h }; eng.hide(slot); }
    else dlgFrom = { x: T.x + T.w * 0.1, y: T.y + T.h * 0.1, w: T.w * 0.8, h: T.h * 0.8 };
    gsap.fromTo(dScrim, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.out' });
    gsap.fromTo(dCard, { ...fromVars(dlgFrom, T), rotationY: slot >= 0 ? -14 : 0, autoAlpha: slot >= 0 ? 1 : 0 }, { x: 0, y: 0, scale: 1, rotationY: 0, autoAlpha: 1, duration: 0.85, ease: 'expo.out' });
    gsap.fromTo([dClose, dGo], { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.35 });
    dClose.focus({ preventScroll: true });
    window.__hero?.lenis?.stop();
  }
  function close() {
    if (dlg.hidden) return;
    const T = { x: parseFloat(dCard.style.left), y: parseFloat(dCard.style.top), w: parseFloat(dCard.style.width) };
    let to = dlgFrom;
    if (dlgSlot >= 0) { const r = eng.rectOf(dlgSlot), sr = stage.getBoundingClientRect(); to = { x: r.x + sr.left, y: r.y + sr.top, w: r.w, h: r.h }; }
    gsap.to(dScrim, { autoAlpha: 0, duration: 0.35 });
    gsap.to([dClose, dGo], { opacity: 0, duration: 0.2 });
    gsap.to(dCard, {
      ...fromVars(to, T), autoAlpha: dlgSlot >= 0 ? 1 : 0, duration: 0.6, ease: 'expo.inOut',
      onComplete: () => { if (dlgSlot >= 0) eng.show(dlgSlot); dlg.hidden = true; root.classList.remove('zd-open'); window.__hero?.lenis?.start(); lastFocus?.focus?.({ preventScroll: true }); },
    });
  }
  on(dScrim, 'click', close);
  on(dClose, 'click', close);
  on(document, 'keydown', (e) => {
    if (dlg.hidden) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); }
    else if (e.key === 'Tab') { e.preventDefault(); (document.activeElement === dClose ? dGo : dClose).focus(); } // two controls: focus stays inside the dialog
  });
  on(list, 'click', (e) => {
    const b = e.target.closest('button[data-card]'); if (!b) return;
    const ci = +b.dataset.card;
    if (e.detail === 0 || !gsap) { open(ci, bestSlot(ci)); return; } // keyboard: the accessible dialog
    if (peekBusy) abortPeek();
    manual = true;
    peek(ci, { slot: bestSlot(ci), hold: 3 }).then(() => { manual = false; nextPeek = performance.now() + 2500; });
  });
  // hovering a chip shows where that project lives in the name: its spot ripples
  let hoverCard = -1;
  if (fine) on(list, 'pointerover', (e) => {
    const b = e.target.closest('button[data-card]'); const ci = b ? +b.dataset.card : -1;
    if (ci === hoverCard) return; hoverCard = ci;
    if (ci < 0 || peekBusy || (G()?.a ?? 1) > 0.04) return;
    const s = bestSlot(ci); if (s < 0) return;
    const r = eng.rectOf(s); pulseAt(r.x + r.w / 2, r.y + r.h * 0.35);
  });
  if (fine) on(list, 'pointerleave', () => { hoverCard = -1; });
  const moreToScroll = () => list.classList.toggle('has-more', Math.ceil(Math.abs(list.scrollLeft) + list.clientWidth) < list.scrollWidth - 2);
  on(list, 'scroll', moreToScroll, { passive: true }); on(window, 'resize', moreToScroll); requestAnimationFrame(moreToScroll);
  on(peekEl, 'click', (e) => { e.stopPropagation(); if (peekCard >= 0) goTo(peekCard, e); });
  on(peekEl, 'auxclick', (e) => { if (e.button === 1 && peekCard >= 0) { e.preventDefault(); goTo(peekCard, e); } });
  const reveal = (b) => { if (b && list.scrollWidth > list.clientWidth) b.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' }); };
  on(list, 'focusin', (e) => reveal(e.target.closest('button')));
  on(window, 'cloud:peek', (e) => {
    list.querySelectorAll('button').forEach((b) => {
      const live = e.detail.phase === 'out' && b.dataset.id === e.detail.id;
      b.classList.toggle('is-live', live);
      if (live) { b.style.setProperty('--run', `${((peekTl?.duration() ?? 5.3) + 0.3).toFixed(2)}s`); b.style.setProperty('--run-at', '0s'); reveal(b); } // the bar ends with the screen
    });
  });

  // click/tap a card in the cloud
  const local = (e) => { const r = stage.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
  on(stage, 'click', (e) => {
    if ((G()?.a ?? 1) > 0.04 || (G()?.m ?? 0) > 0.04 || e.target.closest('a,button')) return;
    const i = eng.hit(...local(e)); if (i < 0) return;
    // a click on the name compiles the screen behind that spot (the keyboard list still opens the full dialog)
    if (peekBusy) abortPeek();
    manual = true;
    peek(eng.blocks[i].card, { slot: i, hold: 3 }).then(() => { manual = false; nextPeek = performance.now() + 2500; });
  });
  const ring = Object.assign(document.createElement('i'), { className: 'zc-cursor', innerHTML: '<b>&lt;/&gt;</b>' });
  ring.setAttribute('aria-hidden', 'true'); layer.appendChild(ring);
  if (fine) on(stage, 'pointermove', (e) => {
    const [x, y] = local(e), away = (G()?.a ?? 1) >= 0.04 || (G()?.m ?? 0) > 0.04, ui = !!e.target.closest('a,button,.zc--peek');
    const hov = !away && !ui && eng.hit(x, y) >= 0;
    stage.style.cursor = hov ? 'pointer' : '';
    ring.classList.toggle('is-on', !away && !ui);
    ring.classList.toggle('is-hot', hov);
    if (gsap) gsap.to(ring, { left: x, top: y, duration: 0.18, ease: 'power3.out', overwrite: 'auto' });
  }, { passive: true });
  if (fine) on(stage, 'pointerleave', () => ring.classList.remove('is-on', 'is-hot'));

  // ---------- per frame ----------
  // the chips sit under the name (under the caption line on narrow screens) and leave with the portal
  let keysGeo = '', keysV = -1, keysTick = 0;
  function placeKeys() {
    const g = G(); if (!g?.words) return;
    // the promise may still be settling after a geometry change: look again every 20 frames (one layout read)
    if (g.v !== keysV || ++keysTick % 20 === 0) {
      keysV = g.v;
      const headEl = stage.querySelector('#heroTitle'), key = g.v + ':' + Math.round(headEl?.getBoundingClientRect().top ?? 0);
      if (key !== keysGeo) {
        keysGeo = key;
        const sr = stage.getBoundingClientRect(), cap = stage.querySelector('#wmCap')?.getBoundingClientRect();
        const wb = Math.max(...g.words.map((w) => w.b));
        const capShown = cap && cap.height > 0; // the caption line is hidden on very short screens
        let top = geom().W < 900 && capShown ? cap.bottom - sr.top + 10 : wb + 16, tight = false;
        // short phones: no room between the name and the promise, so the chips go under the CTAs, or stay out
        const head = stage.querySelector('#heroTitle')?.getBoundingClientRect(), cta = stage.querySelector('.st__cta')?.getBoundingClientRect();
        // the row's shown height (44px chips, plus 6px padding each side where it scrolls); measuring it would read the
        // hidden (tight) row and flip-flop
        const kh = geom().W < 900 ? 56 : 44;
        if (head && top + kh > head.top - sr.top - 8) {
          const below = cta ? cta.bottom - sr.top + 12 : null;
          if (below != null && below + kh < geom().H - 44 && geom().W >= 600) top = below; else tight = true;
        }
        list.classList.toggle('is-tight', tight);
        stage.style.setProperty('--keys-top', `${Math.round(top)}px`);
        const wt = Math.min(...g.words.map((w) => w.t));
        stage.style.setProperty('--wm-top', `${Math.round(wt)}px`); stage.style.setProperty('--wm-h', `${Math.round(wb - wt)}px`);
      }
    }
    const away = (g.a ?? 0) > 0.02 || (g.m ?? 0) > 0.02 || U.uIntro.value < 2.4;
    if (away !== list.classList.contains('is-away')) { list.classList.toggle('is-away', away); list.inert = away; }
  }
  // the render loop sleeps when the hero is idle, so the settle checks also run on their own clock
  const settle = [1500, 3200].map((ms) => setTimeout(() => { keysGeo = ''; placeKeys(); }, ms));
  offs.push(() => settle.forEach(clearTimeout));
  function update() {
    placeKeys();
    updateFly();
    const now = performance.now();
    if (!peekBusy && !manual && canPeek()) {
      if (!nextPeek) nextPeek = now + 350;
      // each peek sits a step further across the wordmark, left to right, then the walk starts over
      if (now >= nextPeek && curated.length) {
        const k = cycleI % curated.length;
        peek(curated[k].i, { hold: 2.4, fx: (k + 0.5) / curated.length }).then(() => { if (!manual) nextPeek = performance.now() + 3200; }); cycleI++;
      }
    } else if (peekBusy && ((G()?.a ?? 0) > 0.01 || (G()?.m ?? 0) > 0.02)) abortPeek();
  }

  function focusCard(id, { mode = 'open', hold } = {}) {
    const i = typeof id === 'number' ? id : cards.findIndex((c) => c.id === id);
    if (i < 0) return Promise.resolve(false);
    if (mode === 'peek') return peek(i, { hold });
    open(i, bestSlot(i)); return Promise.resolve(true);
  }

  return {
    update, focusCard, peek, close,

    dispose() {
      if (!dlg.hidden) {
        window.__hero?.lenis?.start(); root.classList.remove('zd-open');
        const id = lastFocus?.dataset?.id; // the chip is about to be removed with this list: the next list's twin takes the focus
        if (id) requestAnimationFrame(() => (document.querySelector(`.zc-keys button[data-id="${id}"]`) || document.querySelector('.st__cta a'))?.focus({ preventScroll: true }));
        else lastFocus?.focus?.({ preventScroll: true });
      }
      offs.forEach((f) => f()); peekTl?.kill(); layer.remove(); list.remove(); dlg.remove(); root.classList.remove('zd-open'); stage.style.cursor = ''; },
  };
}
