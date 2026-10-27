// check.js (S7): the business check on the home page. One field; on submit the typed text breaks into
// particles (canvas 2D), the progress lines run, and the sample report streams in, labelled
// "דוגמה · כך נראה דוח". No network call: the report is the deck's sample until the AI backend is
// approved. The visitor's text is never put into the WhatsApp message.

import { SAMPLES, FIELDS, detectField } from './check-samples.js';

const PROGRESS = [__t('check.progress.read'), __t('check.progress.field'), __t('check.progress.repeat'), __t('check.progress.first'), __t('check.progress.write')];
const WA = (field) => 'https://wa.me/972504401760?text=' + encodeURIComponent(__t('wa.checkResult', { field: field }));

export function initCheck({ gsap, lenis, reduce }) {
  const form = document.getElementById('ck');
  const input = document.getElementById('ckIn');
  const field = form.querySelector('.ck__field');
  const cv = form.querySelector('.ck__fx');
  const err = document.getElementById('ckErr');
  const prog = document.getElementById('ckProg');
  const out = document.getElementById('ckOut');
  const ans = out.querySelector('.ck__ans');
  const again = out.querySelector('.ck__again');
  const fieldEl = out.querySelector('.ck__field-tag');
  const waEl = out.querySelector('.ck__wa');
  let busy = false;

  const sync = () => field.classList.toggle('has-text', !!input.value || document.activeElement === input);
  input.addEventListener('input', () => { sync(); err.textContent = ''; });
  input.addEventListener('focus', sync);
  input.addEventListener('blur', sync);

  function vanish(text) {
    if (reduce || !gsap) { input.value = ''; return Promise.resolve(); }
    const dpr = Math.min(2, devicePixelRatio || 1);
    const fr = field.getBoundingClientRect(), ir = input.getBoundingClientRect();
    cv.width = Math.round(fr.width * dpr); cv.height = Math.round(fr.height * dpr);
    const g = cv.getContext('2d');
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(input);
    g.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const lk = getComputedStyle(document.documentElement), INK = lk.getPropertyValue('--lk-ink').trim() || '#EDE7DC', HOT = lk.getPropertyValue('--lk-acc-2').trim() || '#F2B36F'; // review looks (css/looks.css)
    const ltr = getComputedStyle(input).direction === 'ltr'; g.direction = ltr ? 'ltr' : 'rtl'; g.textAlign = ltr ? 'left' : 'right'; g.textBaseline = 'middle'; g.fillStyle = INK;
    g.fillText(text, ltr ? ir.left - fr.left + parseFloat(cs.paddingInlineStart || 0) : ir.right - fr.left - parseFloat(cs.paddingInlineStart || 0), ir.top - fr.top + ir.height / 2);
    const d = g.getImageData(0, 0, cv.width, cv.height).data;
    const P = [], step = Math.max(2, Math.round(2 * dpr));
    for (let y = 0; y < cv.height; y += step) for (let x = 0; x < cv.width; x += step) {
      const o = (y * cv.width + x) * 4;
      if (d[o + 3] > 120) P.push({ x: x / dpr, y: y / dpr, vx: -(0.6 + Math.random() * 2.6), vy: (Math.random() - 0.5) * 1.6, r: 0.6 + Math.random() * 1.1, hot: Math.random() < 0.25 });
    }
    input.value = '';
    return new Promise((res) => {
      const t0 = performance.now(), maxX = fr.width;
      const tick = () => {
        const k = (performance.now() - t0) / 1000;
        g.clearRect(0, 0, fr.width, fr.height);
        P.forEach((p) => {
          // the burn sweeps from the reading start (right) to the end; particles drift toward the end
          const lt = Math.max(0, k - (1 - p.x / maxX) * 0.45);
          const a = Math.max(0, 1 - lt / 0.75);
          if (a <= 0) return;
          g.globalAlpha = a; g.fillStyle = p.hot && lt > 0 ? HOT : INK;
          g.fillRect(p.x + p.vx * lt * 60, p.y + p.vy * lt * 40 - lt * lt * 18, p.r * 1.6, p.r * 1.6);
        });
        g.globalAlpha = 1;
        if (k < 1.3) requestAnimationFrame(tick); else { g.clearRect(0, 0, fr.width, fr.height); res(); }
      };
      requestAnimationFrame(tick);
    });
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  async function progress() {
    if (reduce) return;
    for (const line of PROGRESS) { prog.textContent = line; await wait(420); }
    prog.textContent = '';
  }

  // the sample for the field the visitor's text names (clinic, beauty, food, else a general one)
  function build(key) {
    const S = SAMPLES[key];
    const esc = (t) => t.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
    const sec = (h, inner) => `<section class="ck__sec"><h4>${h}</h4>${inner}</section>`;
    ans.innerHTML = sec(__t('check.result.saw.h'), `<p data-s="${esc(S.saw)}"></p>`)
      + sec(__t('check.result.automate.h'), `<ol>${S.automate.map((a, i) => `<li><b lang="en">0${i + 1}</b><span data-s="${esc(`${a.t} ${a.why}`)}"></span></li>`).join('')}</ol>`)
      + sec(__t('check.result.similar.h'), `<p data-s="${esc(S.similar)}"></p>`)
      + sec(__t('check.result.first.h'), `<p data-s="${esc(S.first)}"></p>`);
    fieldEl.textContent = FIELDS[key] || '';
    waEl.href = WA(FIELDS[key] || FIELDS.services);
    return [...ans.querySelectorAll('[data-s]')];
  }

  function stream(key) {
    out.hidden = false;
    const parts = build(key);
    ans.setAttribute('aria-busy', 'true');
    const show = () => { const r = out.getBoundingClientRect(); if (r.top > innerHeight * 0.6) { const y = (lenis ? lenis.scroll : scrollY) + r.top - innerHeight * 0.22; lenis && !reduce ? lenis.scrollTo(y, { duration: 1.1 }) : scrollTo(0, y); } };
    if (reduce || !gsap) { parts.forEach((el) => { el.textContent = el.dataset.s; }); ans.removeAttribute('aria-busy'); show(); return Promise.resolve(); }
    parts.forEach((el) => { el.textContent = ''; });
    gsap.fromTo(out, { autoAlpha: 0, y: 16 }, { autoAlpha: 1, y: 0, duration: 0.6, ease: 'expo.out' });
    show();
    const caret = document.createElement('i'); caret.className = 'ck__caret'; caret.setAttribute('aria-hidden', 'true');
    return new Promise((res) => {
      let pi = 0, ci = 0, acc = 0;
      const step = (time, dt) => {
        acc += dt;
        while (acc > 14 && pi < parts.length) {
          acc -= 14;
          const el = parts[pi], s = el.dataset.s;
          ci += 2;
          el.textContent = s.slice(0, ci); el.appendChild(caret);
          if (ci >= s.length) { el.textContent = s; pi++; ci = 0; acc -= 120; }
        }
        if (pi >= parts.length) { gsap.ticker.remove(step); caret.remove(); ans.removeAttribute('aria-busy'); res(); }
      };
      gsap.ticker.add(step);
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (busy) return;
    const text = input.value.trim();
    if (!text) { err.textContent = __t('check.error.empty'); input.focus(); return; }
    if (text.length < 20) { err.textContent = __t('check.error.short'); input.focus(); return; }
    busy = true;
    field.classList.add('is-done');
    await vanish(text);
    await progress();
    await stream(detectField(text));
    busy = false;
  });
  again.addEventListener('click', () => {
    out.hidden = true; field.classList.remove('is-done'); input.value = ''; sync(); input.focus();
  });
}
