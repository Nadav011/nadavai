// sales-pages.js: the frame and the page logic of the sales and legal pages
// (services, plans, check, contact, accessibility, privacy). One clock (Lenis on the GSAP ticker),
// the shared frame (chrome-site.js: header, menu, calm switch, progress, dock), the site's motion language (motion.js), then the
// page's own part, chosen by <body data-page>. Calm mode / reduced motion: every part is a still.
// The business check is a front-end simulation with canned results. It makes no network call.

import { initMotion } from './motion.js';
import { initSiteChrome } from './chrome-site.js';
import { initOffer } from '../sections/offer/offer.js';
import { SAMPLES, FIELDS, detectField } from './check-samples.js';

const root = document.documentElement;
const { gsap, ScrollTrigger, Lenis } = window;
const engine = !!(gsap && ScrollTrigger);
if (!engine) root.classList.add('reduce');
const reduce = root.classList.contains('reduce');
const page = document.body.dataset.page;
const params = new URLSearchParams(location.search);
const DEV = /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname) || params.has('state');
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const X_ICON = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/></svg>';
const ARROW = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M13 8H3m4-4L3 8l4 4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
const NEW = '<span class="sr"> (נפתח בחלון חדש)</span>';
export const wa = (text) => `https://wa.me/972504401760?text=${encodeURIComponent(text)}`;

let lenis = null;
if (engine) {
  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });
  if (Lenis && !reduce) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}
const scrollToEl = (el, offset = -90) => {
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.1 });
  else el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
};

export function announce(text) {
  const n = document.getElementById('slLive');
  if (!n) return;
  n.textContent = '';
  requestAnimationFrame(() => { n.textContent = text; n.classList.add('is-on'); });
  clearTimeout(announce.t); announce.t = setTimeout(() => n.classList.remove('is-on'), 3200);
}

/* ── the guide avatar (sections/avatar): lazy, on the first interaction or when idle (fragments/CHROME.md §4).
   The module keeps to its own lane outside the content; a page only gives it a line to say. ── */
let avatarApi = null;
function mountGuide(line, pose = 'waving') {
  if (!engine || reduce) return;
  let started = false;
  const load = () => {
    if (started) return; started = true;
    import('../sections/avatar/avatar.js').then(({ initAvatar, avatar, DEFAULT_CTA }) => {
      if (typeof initAvatar !== 'function') return;
      root.classList.add('has-avatar');
      initAvatar({ gsap, ScrollTrigger, lenis, atlasUrl: '/site/assets/avatar/spritesheet.webp', extraUrl: '/site/assets/avatar/site-extra.webp',
        ctaSelector: `${DEFAULT_CTA}, .dock, main p, main h1, main h2, main h3` });
      avatarApi = avatar;
      // phones: his head waits in the dock's slot, like the home (main.js), so he never stands on a screen
      if (matchMedia('(max-width: 720px)').matches) avatar.minimize?.(true);
      else if (line) setTimeout(() => say(line, pose), 1200);
    }).catch(() => {});
  };
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach((t) => addEventListener(t, load, { once: true, passive: true }));
  // requestIdleCallback takes an options object (a bare number throws), and it must be called on window
  if ('requestIdleCallback' in window) window.requestIdleCallback(load, { timeout: 4000 }); else setTimeout(load, 4000);
}
const say = (line, pose) => { if (!avatarApi) return; try { if (pose) avatarApi.perform(pose); avatarApi.say(line); } catch { /* the guide is optional */ } };

/* ── chrome ── */
function initChrome() {
  initSiteChrome({ lenis, dockAfter: 0.6 });
  const closeSheet = () => { const m = document.querySelector('.nav__menu[aria-expanded="true"]'); if (m) m.click(); };

  // in-page anchors ride Lenis and land focus on the target (a skill card open over the page closes first)
  document.addEventListener('click', (e) => {
    const a = e.target.closest?.('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    const t = id.length > 1 && document.querySelector(id);
    if (!t) return;
    e.preventDefault(); closeSheet();
    const card = document.querySelector('#offer-card[open]');
    if (card) card.querySelector('.tc__x')?.click();
    const land = () => { if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); };
    history.replaceState(null, '', id);
    if (lenis) lenis.scrollTo(t, { offset: -70, duration: 1.2, onComplete: land });
    else { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); land(); }
  });

  // copy buttons: [data-copy] names the element whose value or text is copied
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    const src = $(b.dataset.copy);
    const text = (src.value ?? src.textContent).trim();
    let ok = false;
    try { await navigator.clipboard.writeText(text); ok = true; } catch {
      if (src.select) { src.select(); try { ok = document.execCommand('copy'); } catch { ok = false; } }
    }
    if (ok) {
      announce(b.dataset.done);
      b.classList.add('is-done'); clearTimeout(b._t); b._t = setTimeout(() => b.classList.remove('is-done'), 2200);
    } else if (src.select) src.select();
  }));
}

/* a scrubbed line that fills as its steps pass the reading line (services road, plans path) */
function fillLine(wrap) {
  if (!wrap || reduce || !engine) return;
  ScrollTrigger.create({
    trigger: wrap, start: 'top 75%', end: 'bottom 55%', scrub: 0.5,
    onUpdate: (st) => wrap.style.setProperty('--road', st.progress.toFixed(3)),
  });
}

/* ── the zoom: a screen thumbnail opens large, from where it sits (the hero cloud's "card opens") ── */
function openZoom(btn) {
  const img = btn.querySelector('img');
  const d = document.createElement('dialog');
  d.className = 'sl-dlg zoom';
  d.setAttribute('aria-label', img.alt);
  d.innerHTML = `<figure><img alt="" decoding="async"><figcaption></figcaption></figure><button type="button" class="zoom__x" aria-label=__t('social.gallery.close')>${X_ICON}</button>`;
  const big = d.querySelector('img'); big.src = img.currentSrc || img.src; big.alt = img.alt;
  d.querySelector('figcaption').textContent = img.alt;
  document.body.appendChild(d);
  lenis?.stop();
  d.showModal();
  if (!reduce) {
    const r = img.getBoundingClientRect(), br = big.getBoundingClientRect();
    if (br.width) {
      const sx = r.width / br.width, sy = r.height / br.height;
      const dx = (r.left + r.width / 2) - (br.left + br.width / 2), dy = (r.top + r.height / 2) - (br.top + br.height / 2);
      big.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, borderRadius: '40px' }, { transform: 'none' }],
        { duration: 650, easing: 'cubic-bezier(.16,1,.3,1)' });
      d.querySelector('figcaption').animate([{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 500, delay: 300, fill: 'backwards', easing: 'ease-out' });
    }
  }
  const close = () => d.close();
  d.querySelector('.zoom__x').addEventListener('click', close);
  d.addEventListener('click', (e) => { if (e.target === d || e.target.tagName === 'FIGURE') close(); });
  d.addEventListener('close', () => { d.remove(); lenis?.start(); btn.focus({ preventScroll: true }); }, { once: true });
}

/* ══ SERVICES ══════════════════════════════════════════════════════════════ */
function initServices() {
  initOffer(engine && !reduce ? { gsap, ScrollTrigger, lenis } : {});
  $$('[data-zoom]').forEach((b) => b.addEventListener('click', () => openZoom(b)));
  fillLine($('.road__wrap'));

  // the jump bar follows the block you are reading
  const toc = $('.svc-toc ol');
  const links = new Map($$('a', toc).map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((es) => {
    es.forEach((e) => {
      if (!e.isIntersecting) return;
      links.forEach((a) => a.removeAttribute('aria-current'));
      const a = links.get(e.target.id);
      if (!a) return;
      a.setAttribute('aria-current', 'true');
      const tr = toc.getBoundingClientRect(), ar = a.getBoundingClientRect();
      if (ar.left < tr.left || ar.right > tr.right) toc.scrollBy({ left: ar.left - tr.left - (tr.width - ar.width) / 2, behavior: reduce ? 'auto' : 'smooth' });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('.svc').forEach((s) => io.observe(s));
  // past the last block, the bar lets go
  const end = $('#process');
  if (end) new IntersectionObserver((es) => { if (es[0].isIntersecting) links.forEach((a) => a.removeAttribute('aria-current')); }, { rootMargin: '-45% 0px -50% 0px' }).observe(end);

  // the guarantee: the words assemble as they arrive
  const vow = $('.vow__big span');
  if (engine && !reduce && vow) {
    gsap.from(vow, { yPercent: 40, opacity: 0, scale: 0.94, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: vow, start: 'top 85%', once: true } });
  }
  mountGuide(__t('avatar.page.services'));
}

/* ══ PLANS ═════════════════════════════════════════════════════════════════ */
function initPlans() {
  initOffer(engine && !reduce ? { gsap, ScrollTrigger, lenis } : {});
  fillLine($('.p4__wrap'));
  mountGuide(__t('avatar.page.plans'));
}

/* ══ CHECK (front-end simulation, canned report, no network) ═══════════════ */
const STEP = {
  verify: __t('check.progress.verify'), read: __t('check.progress.read'), site: __t('check.progress.site'), siteChecks: __t('check.progress.siteChecks'),
  field: __t('check.progress.field'), repeat: __t('check.progress.repeat'), first: __t('check.progress.first'), write: __t('check.progress.write'),
};
const SITE_FAILED = __t('check.progress.siteFailed');
// what the check reads on a website: the same canned result for every field
const SITE = {
  checks: [[__t('check.site.https'), 1], [__t('check.site.mobile'), 1], [__t('global.footer.accessibility'), 0], [__t('global.footer.privacy'), 0], [__t('check.site.whatsapp'), 1], [__t('check.site.booking'), 0]],
  fix: __t('check.result.fixes.a11yExample'),
};
const FAILS = {
  rate: [__t('check.state.rateLimited.h'), __t('check.state.rateLimited.body')],
  bot: [__t('check.state.bot.h'), __t('check.state.bot.body')],
  provider: [__t('check.state.provider.h'), __t('check.state.provider.body')],
  budget: [__t('check.state.budget.h'), __t('check.state.budget.body')],
  offline: [__t('check.state.offline.h'), __t('check.state.offline.body')],
  expired: [__t('check.saved.expired.h'), __t('check.saved.expired.body')],
};
const STATES = ['empty', 'short', 'long', 'url', 'personal', 'analyzing', 'slow', 'sitefail', 'result', 'result-beauty', 'result-clinic', 'result-general',
  'site', 'cut', 'saved', 'report', 'delete', 'deleted', 'rate', 'bot', 'provider', 'budget', 'offline', 'expired', 'sample'];
const STATE_FIELD = { 'result-beauty': 'beauty', 'result-clinic': 'clinic', 'result-general': 'services' };
const hoursOf = (t, m) => Math.max(0, Math.round((t * m * 52) / 12 / 60));
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const bidi = (s) => esc(s).replace(/\b(AI|HTTPS|VPN|Z)\b/g, '<bdi>$1</bdi>');

function initCheck() {
  const form = $('#ckx'), input = $('#ckxIn'), field = $('.ckx__field'), cv = $('.ck__fx', field);
  const err = $('#ckxErr'), warn = $('#ckxWarn'), count = $('#ckxCount'), url = $('#ckxUrl'), urlErr = $('#ckxUrlErr');
  const run = $('#ckxRun'), steps = $('#ckxSteps'), now = $('#ckxNow'), slow = $('#ckxSlow');
  const fail = $('#ckxFail'), out = $('#ckxOut'), card = $('.ckr', out), body = $('#ckrBody'), end = $('#ckrEnd'), cut = $('#ckrCut');
  let busy = false, urlWarned = false, token = 0;

  /* which sample answers: the field the visitor picked, else the one the text names */
  const picked = () => form.querySelector('input[name="field"]:checked')?.value || 'auto';
  const keyNow = () => (picked() !== 'auto' ? picked() : detectField(input.value));
  const pv = { field: $('#pvField'), how: $('#pvHow'), first: $('#pvFirst'), list: $('#pvList') };
  let pvKey = null;
  function preview() {
    const k = keyNow(), S = SAMPLES[k];
    pv.how.textContent = picked() !== 'auto' ? __t('check.preview.how.field') : input.value.trim().length >= 6 ? __t('check.preview.how.text') : 'דוגמה';
    if (k === pvKey) return;
    pvKey = k;
    pv.field.textContent = FIELDS[k];
    pv.first.textContent = S.first;
    pv.list.innerHTML = S.automate.map((a) => `<li>${bidi(a.t)}</li>`).join('');
  }
  input.addEventListener('input', preview);
  $$('input[name="field"]', form).forEach((r) => r.addEventListener('change', preview));
  preview();

  /* input states */
  const setErr = (msg, el = input, box = err) => {
    box.textContent = msg;
    el.setAttribute('aria-invalid', msg ? 'true' : 'false');
    if (el === input) field.classList.toggle('is-bad', !!msg);
  };
  const PERSONAL = /(\+?972|0)5\d[-\s]?\d{3}[-\s]?\d{4}|\b0\d{1,2}[-\s]?\d{7}\b|[^\s@]+@[^\s@]+\.[a-z]{2,}/i;
  const syncInput = () => {
    const n = input.value.length;
    count.hidden = n < 400;
    count.firstElementChild.textContent = `${n}/500`;
    count.classList.toggle('is-high', n >= 480);
    warn.textContent = PERSONAL.test(input.value) ? __t('check.error.personal') : '';
  };
  input.addEventListener('input', () => { if (err.textContent && input.value.trim().length >= 20) setErr(''); syncInput(); });
  input.addEventListener('paste', (e) => {
    const t = (e.clipboardData || window.clipboardData)?.getData('text') || '';
    const room = 500 - input.value.length + (input.selectionEnd - input.selectionStart);
    if (t.length > room) setTimeout(() => setErr(__t('check.error.long')), 0);
  });
  input.addEventListener('focus', () => { if (!input.value) say(__t('avatar.check.waiting'), 'sit'); });
  // one sentence: Enter sends, the way it does in the home's single-line field
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); form.requestSubmit(); } });
  url.addEventListener('input', () => { if (urlErr.textContent) { setErr('', url, urlErr); urlWarned = false; } });
  const urlOk = (v) => /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,}(\/\S*)?$/i.test(v.trim());

  /* the typed text breaks into particles (the home's vanish, same verb) */
  function vanish(text) {
    if (reduce || !text) { input.value = ''; return Promise.resolve(); }
    const dpr = Math.min(2, devicePixelRatio || 1);
    const fr = field.getBoundingClientRect(), ir = input.getBoundingClientRect();
    cv.width = Math.round(fr.width * dpr); cv.height = Math.round(fr.height * dpr);
    const g = cv.getContext('2d', { willReadFrequently: true });
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    const cs = getComputedStyle(input);
    g.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const lk = getComputedStyle(document.documentElement), INK = lk.getPropertyValue('--lk-ink').trim() || '#EDE7DC', HOT = lk.getPropertyValue('--lk-acc-2').trim() || '#F2B36F'; // review looks (css/looks.css)
    g.direction = 'rtl'; g.textAlign = 'right'; g.textBaseline = 'middle'; g.fillStyle = INK;
    // wrap the way the field shows it, then draw each line where it sat
    const maxW = ir.width - parseFloat(cs.paddingInlineStart || 0) - parseFloat(cs.paddingInlineEnd || 0);
    const lines = [];
    text.split(/\s+/).forEach((w) => {
      const l = lines.length ? `${lines[lines.length - 1]} ${w}` : w;
      if (lines.length && g.measureText(l).width <= maxW) lines[lines.length - 1] = l; else lines.push(w);
    });
    const lh = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.35;
    const top = ir.top - fr.top + parseFloat(cs.paddingTop || 0) - input.scrollTop + lh / 2;
    lines.forEach((l, i) => g.fillText(l, ir.right - fr.left - parseFloat(cs.paddingInlineStart || 0), top + i * lh));
    const d = g.getImageData(0, 0, cv.width, cv.height).data;
    const P = [], step = Math.max(2, Math.round(2 * dpr));
    for (let y = 0; y < cv.height; y += step) for (let x = 0; x < cv.width; x += step) {
      const o = (y * cv.width + x) * 4;
      if (d[o + 3] > 120) P.push({ x: x / dpr, y: y / dpr, vx: -(0.6 + Math.random() * 2.6), vy: (Math.random() - 0.5) * 1.6, r: 0.6 + Math.random() * 1.1, hot: Math.random() < 0.3 });
    }
    input.value = '';
    field.classList.add('is-burning');
    return new Promise((res) => {
      const t0 = performance.now(), maxX = fr.width;
      const tick = () => {
        const k = (performance.now() - t0) / 1000;
        g.clearRect(0, 0, fr.width, fr.height);
        P.forEach((p) => {
          const lt = Math.max(0, k - (1 - p.x / maxX) * 0.45);
          const a = Math.max(0, 1 - lt / 0.75);
          if (a <= 0) return;
          g.globalAlpha = a; g.fillStyle = p.hot && lt > 0 ? HOT : INK;
          g.fillRect(p.x + p.vx * lt * 60, p.y + p.vy * lt * 40 - lt * lt * 18, p.r * 1.6, p.r * 1.6);
        });
        g.globalAlpha = 1;
        if (k < 1.3) requestAnimationFrame(tick); else { g.clearRect(0, 0, fr.width, fr.height); field.classList.remove('is-burning'); res(); }
      };
      requestAnimationFrame(tick);
    });
  }

  /* panels */
  const showOnly = (which) => {
    run.hidden = which !== 'run'; fail.hidden = which !== 'fail';
    if (which !== 'out' && which !== 'failsample') out.hidden = true;
    if (which === 'failsample') { fail.hidden = false; }
  };
  function stepList(withSite, siteFail) {
    const keys = ['verify', 'read', ...(withSite ? ['site', 'siteChecks'] : []), 'field', 'repeat', 'first', 'write'];
    steps.innerHTML = keys.map((k) => `<li data-k="${k}"><i aria-hidden="true"></i><span>${bidi(STEP[k])}</span></li>`).join('');
    if (siteFail) {
      const li = $('[data-k="siteChecks"]', steps);
      li.outerHTML = `<li class="is-note" data-k="siteFailed"><i aria-hidden="true"></i><span>${bidi(SITE_FAILED)}</span></li>`;
    }
    return $$('li', steps);
  }
  async function analyze({ withSite, siteFail = false, freezeAt = -1, my }) {
    showOnly('run'); slow.hidden = true;
    const lis = stepList(withSite, siteFail);
    if (freezeAt < 0) scrollToEl(run, -140);
    say(__t('avatar.check.working'), 'laptop');
    for (let i = 0; i < lis.length; i++) {
      if (my !== token) return false;
      lis.forEach((l, j) => { l.classList.toggle('is-done', j < i); l.classList.toggle('is-now', j === i); });
      now.textContent = lis[i].textContent;
      if (i === freezeAt) return false;
      await wait(reduce ? 120 : (lis[i].classList.contains('is-note') ? 1100 : 620));
    }
    lis.forEach((l) => { l.classList.add('is-done'); l.classList.remove('is-now'); });
    return my === token;
  }

  /* the report: built hidden, then streamed in reading order */
  function buildReport({ withSite, key = keyNow() }) {
    const S = SAMPLES[key];
    const auto = S.automate.map((a, i) => `
      <li class="auto__i" data-gate>
        <span class="auto__n" lang="en" dir="ltr">0${i + 1}</span>
        <p class="auto__t" data-s="${esc(a.t)}"></p>
        <p class="auto__why"><b>למה זה</b><span data-s="${esc(a.why)}"></span></p>
        <details class="asm"><summary>ההנחות שלי</summary>
          <div class="asm__f">
            <label>כמה פעמים בשבוע<input type="number" inputmode="numeric" min="0" max="500" value="${a.times}" data-t></label>
            <label>כמה דקות בכל פעם<input type="number" inputmode="numeric" min="0" max="600" value="${a.min}" data-m></label>
            <p class="asm__out" aria-live="polite">זה בערך ${hoursOf(a.times, a.min)} שעות בחודש.</p>
          </div>
        </details>
      </li>`).join('');
    const site = withSite ? `
      <section class="ckr__sec" data-gate><h3>מה בדקתי באתר</h3>
        <ul class="sitec">${SITE.checks.map(([k, ok]) => `<li><span>${bidi(k)}</span><span class="st ${ok ? 'st--ok' : 'st--no'}">${ok ? __t('check.site.found') : __t('check.site.missing')}</span></li>`).join('')}</ul>
      </section>
      <section class="ckr__sec" data-gate><h3>תיקונים מהירים באתר</h3>
        <div class="fix"><p data-s="${esc(SITE.fix)}"></p>
          <a class="sl-link" href="https://www.w3.org/WAI/standards-guidelines/wcag/" target="_blank" rel="noopener">למה זה חשוב${NEW}${ARROW}</a></div>
      </section>` : '';
    body.innerHTML = `
      <section class="ckr__sec" data-gate><h3>מה הבנתי מהעסק</h3><p><span data-s="${esc(S.saw)}"></span><span class="src">מתוך מה שכתבתם</span></p></section>
      <section class="ckr__sec" data-gate><h3>מה הייתי הופך לאוטומטי קודם</h3><ol class="auto">${auto}</ol></section>
      ${site}
      <section class="ckr__sec" data-gate><h3>הכי דומה למה שבניתי</h3><p data-s="${esc(S.similar)}"></p>
        <a class="sl-link" href="${S.similarHref}">לפרויקט${ARROW}</a></section>
      <section class="ckr__sec" data-gate><h3>מה הייתי בונה ראשון</h3><p data-s="${esc(S.first)}"></p></section>`;
    $$('.asm', body).forEach((d) => {
      const t = $('[data-t]', d), m = $('[data-m]', d), o = $('.asm__out', d);
      const upd = () => { o.textContent = `זה בערך ${hoursOf(+t.value || 0, +m.value || 0)} שעות בחודש.`; };
      t.addEventListener('input', upd); m.addEventListener('input', upd);
    });
    $('#ckrField').textContent = FIELDS[key];
    $('#ckrWa').href = wa(`היי נדב, עשיתי באתר את הבדיקה לעסק, בתחום ${FIELDS[key]}. אשמח לדבר על מה בונים ראשון.`);
    end.hidden = true; cut.hidden = true;
    resetSave();
    return $$('[data-s]', body);
  }
  // opening a gate opens every gate before it too, so a section with nothing to stream (the site checks) shows in order
  const gateOpen = (el) => { const gs = $$('[data-gate]', body); const i = gs.indexOf(el.closest('[data-gate]')); gs.slice(0, i + 1).forEach((g) => { g.hidden = false; }); };
  let pending = [];
  function stream(parts, { stopAfter = Infinity, instant = false, fresh = true, my }) {
    out.hidden = false;
    card.setAttribute('aria-busy', 'true');
    if (instant || reduce) {
      $$('[data-gate]', body).forEach((g) => { g.hidden = false; });
      parts.forEach((el) => { el.textContent = el.dataset.s; });
      card.removeAttribute('aria-busy');
      return Promise.resolve(true);
    }
    if (fresh) { $$('[data-gate]', body).forEach((g) => { g.hidden = true; }); parts.forEach((el) => { el.textContent = ''; }); }
    const caret = document.createElement('i'); caret.className = 'ck__caret'; caret.setAttribute('aria-hidden', 'true');
    return new Promise((res) => {
      let pi = 0, ci = 0, last = performance.now(), acc = 0;
      const tick = (t) => {
        if (my !== token) { caret.remove(); return res(false); }
        acc += t - last; last = t;
        while (acc > 14 && pi < parts.length) {
          acc -= 14;
          const el = parts[pi], s = el.dataset.s;
          if (ci === 0) { gateOpen(el); }
          ci += 2;
          el.textContent = s.slice(0, ci); el.appendChild(caret);
          if (ci >= s.length) { el.textContent = s; pi++; ci = 0; acc -= 110; if (pi >= stopAfter) break; }
        }
        if (pi >= parts.length || pi >= stopAfter) {
          caret.remove(); card.removeAttribute('aria-busy');
          pending = parts.slice(pi);
          return res(pi >= parts.length);
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  }
  function finish() {
    end.hidden = false;
    $$('[data-gate]', body).forEach((g) => { g.hidden = false; });
    say(__t('avatar.check.done'), 'thumbs-up');
  }

  /* save, copy, report, delete */
  const saveBtn = $('#ckrSaveBtn'), saved = $('#ckrSaved'), deleted = $('#ckrDeleted');
  function resetSave() { saveBtn.hidden = false; saved.hidden = true; deleted.hidden = true; $('#ckrReportDone')?.remove(); }
  function doSave(focus = true) {
    saveBtn.hidden = true; saved.hidden = false;
    const dt = new Date(Date.now() + 30 * 864e5).toLocaleDateString('he-IL', { day: 'numeric', month: 'long', year: 'numeric' });
    $('#ckrExp').textContent = `הקישור יעבוד עד ${dt}.`;
    if (focus) saved.focus({ preventScroll: true });
  }
  saveBtn.addEventListener('click', () => doSave());
  const dlgR = $('#dlgReport'), dlgD = $('#dlgDelete');
  $('#ckrReport').addEventListener('click', () => { lenis?.stop(); dlgR.showModal(); });
  $('#ckrDelete').addEventListener('click', () => { lenis?.stop(); dlgD.showModal(); });
  dlgR.addEventListener('close', () => {
    lenis?.start();
    if (dlgR.returnValue === 'send') {
      if (!$('#ckrReportDone')) saved.insertAdjacentHTML('beforeend', '<p class="saved__ok" id="ckrReportDone">תודה. הדיווח הגיע אליי.</p>');
      announce(__t('check.report.done'));
    }
    $('#ckrReport').focus({ preventScroll: true });
  });
  dlgD.addEventListener('close', () => {
    lenis?.start();
    if (dlgD.returnValue === 'delete') { saved.hidden = true; deleted.hidden = false; deleted.focus({ preventScroll: true }); announce(__t('check.delete.done')); }
    else $('#ckrDelete').focus({ preventScroll: true });
  });

  /* the AI label's explanation opens on tap too (hover and focus already show it) */
  const aiBtn = $('.ckr__ai-btn');
  aiBtn.addEventListener('click', () => aiBtn.setAttribute('aria-expanded', String(aiBtn.getAttribute('aria-expanded') !== 'true')));
  aiBtn.addEventListener('blur', () => aiBtn.setAttribute('aria-expanded', 'false'));

  /* failures */
  let stateKey = 'food';
  function showFail(kind, { withSample = false } = {}) {
    const [h, b] = FAILS[kind];
    $('#ckxFailH').innerHTML = bidi(h); $('#ckxFailB').innerHTML = bidi(b);
    $('.fail', fail).classList.toggle('fail--offline', kind === 'offline');
    $('#ckxRetry').hidden = kind !== 'bot';
    $('#ckxNew').hidden = kind !== 'expired';
    $('.ckx__fallback', fail).hidden = kind === 'expired';
    showOnly(withSample ? 'failsample' : 'fail');
    say(__t('avatar.check.failed'));
    if (withSample) { buildReport({ withSite: false, key: stateKey }); stream($$('[data-s]', body), { instant: true }); end.hidden = false; $('.ckr__save', end).hidden = true; $('.ckr__cta', end).hidden = true; }
    else { $('.ckr__save', end).hidden = false; $('.ckr__cta', end).hidden = false; }
  }
  $('#ckxRetry').addEventListener('click', () => { fail.hidden = true; form.classList.remove('is-locked'); input.focus(); });

  /* the full run */
  async function check({ text, withSite }) {
    const my = ++token;
    const key = keyNow();                                   // read before the text breaks into particles
    busy = true; form.classList.add('is-locked');
    $('.ckr__save', end).hidden = false; $('.ckr__cta', end).hidden = false;
    await vanish(text);
    const done = await analyze({ withSite, my });
    if (!done) return;
    run.hidden = true;
    const parts = buildReport({ withSite, key });
    out.hidden = false;
    scrollToEl(out, -100);
    const all = await stream(parts, { my });
    if (my !== token) return;
    if (all) finish();
    form.classList.remove('is-locked'); busy = false;
    card.focus({ preventScroll: true });
  }
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (busy) return;
    const text = input.value.trim();
    if (!text) { setErr(__t('check.error.empty')); input.focus(); return; }
    if (text.length < 20) { setErr(__t('check.error.short')); input.focus(); return; }
    setErr('');
    const u = url.value.trim();
    if (u && !urlOk(u) && !urlWarned) { urlWarned = true; setErr(__t('check.error.url'), url, urlErr); url.focus({ preventScroll: true }); scrollToEl(url.closest('.ckx__url') || url, -120); return; } // the error under the field stays on screen
    check({ text, withSite: !!u && urlOk(u) });
  });
  $('#ckxSample').addEventListener('click', async () => {
    const my = ++token; fail.hidden = true; run.hidden = true;
    $('.ckr__save', end).hidden = false; $('.ckr__cta', end).hidden = false;
    const parts = buildReport({ withSite: false });
    out.hidden = false; scrollToEl(out, -100);
    if (await stream(parts, { my })) finish();
  });
  $('#ckrResume').addEventListener('click', async () => {
    cut.hidden = true;
    const my = ++token;
    if (await stream(pending, { fresh: false, my })) finish();
  });
  $('#ckrAgain').addEventListener('click', () => {
    token++; out.hidden = true; run.hidden = true; fail.hidden = true; busy = false;
    form.classList.remove('is-locked'); input.value = ''; syncInput(); setErr('');
    scrollToEl(form, -120); input.focus({ preventScroll: true });
  });

  /* ?state= renders any state directly, for review */
  const state = params.get('state');
  if (state) reviewStrip(state);
  stateKey = STATE_FIELD[state] || (SAMPLES[params.get('field')] ? params.get('field') : 'food');
  const fillSample = () => { input.value = SAMPLES[stateKey].input; syncInput(); preview(); };
  const render = async (s) => {
    const my = ++token;
    switch (s) {
      case 'empty': setErr(__t('check.error.empty')); break;
      case 'short': input.value = 'מספרה בנתיבות'; syncInput(); setErr(__t('check.error.short')); break;
      case 'long': input.value = (SAMPLES.food.input + ' ').repeat(8).slice(0, 500); syncInput(); setErr(__t('check.error.long')); break;
      case 'url': fillSample(); url.value = 'המסעדה-שלי'; setErr(__t('check.error.url'), url, urlErr); break;
      case 'personal': input.value = 'מספרה בנתיבות, 3 עובדות. תורים בוואטסאפ, 050-1234567'; syncInput(); break;
      case 'analyzing': fillSample(); form.classList.add('is-locked'); await analyze({ withSite: false, freezeAt: 3, my }); break;
      case 'sitefail': fillSample(); url.value = 'example.co.il'; form.classList.add('is-locked'); await analyze({ withSite: true, siteFail: true, freezeAt: 5, my }); break;
      case 'slow': fillSample(); form.classList.add('is-locked'); await analyze({ withSite: false, freezeAt: 5, my }); slow.hidden = false; break;
      case 'result': case 'result-beauty': case 'result-clinic': case 'result-general':
      case 'site': case 'saved': case 'report': case 'delete': case 'deleted': case 'sample': {
        if (s !== 'sample') fillSample();
        if (s === 'site') url.value = 'example.co.il';
        stream(buildReport({ withSite: s === 'site', key: s === 'sample' ? keyNow() : stateKey }), { instant: true }); finish();
        if (['saved', 'report', 'delete', 'deleted'].includes(s)) doSave(false);
        if (s === 'report') dlgR.showModal();
        if (s === 'delete') dlgD.showModal();
        if (s === 'deleted') { saved.hidden = true; deleted.hidden = false; }
        break;
      }
      case 'cut': fillSample(); await stream(buildReport({ withSite: false, key: stateKey }), { stopAfter: 3, my }); cut.hidden = false; break;
      case 'rate': case 'bot': case 'offline': case 'expired': if (s === 'offline') fillSample(); showFail(s); break;
      case 'provider': case 'budget': fillSample(); showFail(s, { withSample: true }); break;
      default: break;
    }
    const target = { empty: form, short: form, long: form, url: $('.ckx__url'), personal: form }[s] || (!run.hidden ? run : !fail.hidden ? fail : !out.hidden ? out : null);
    if (target && s !== 'report' && s !== 'delete') requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
  };
  if (state && STATES.includes(state)) render(state);
  mountGuide(null);
}

function reviewStrip(cur) {
  const nav = document.createElement('nav');
  nav.className = 'review'; nav.setAttribute('aria-label', 'מצבים');
  nav.innerHTML = `<details open><summary>?state=</summary><ul>${STATES.map((s) => `<li><a href="?state=${s}"${s === cur ? ' aria-current="true"' : ''} lang="en" dir="ltr">${s}</a></li>`).join('')}</ul></details>`;
  $('main').appendChild(nav);
}

/* ══ CONTACT ═══════════════════════════════════════════════════════════════ */
function initContact() {
  const form = $('#ctf'), ok = $('#ctfOk');
  if (DEV) { $('#ctfDemo').hidden = false; $('#ctfOkDemo').hidden = false; }
  const F = {
    name: { el: $('#ctfName'), err: $('#ctfNameErr'), check: (v) => (v.trim().length >= 2 ? '' : __t('contact.form.error.name')) },
    reach: { el: $('#ctfReach'), err: $('#ctfReachErr'), check: (v) => {
      const s = v.trim();
      if (!s) return __t('contact.form.error.reach');
      const mail = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s), phone = /^\+?[\d\s-]{9,16}$/.test(s) && s.replace(/\D/g, '').length >= 9;
      return mail || phone ? '' : __t('contact.form.error.reachInvalid');
    } },
    msg: { el: $('#ctfMsg'), err: $('#ctfMsgErr'), check: (v) => (v.trim().length >= 10 ? '' : __t('contact.form.error.msg')) },
  };
  let tried = false;
  const validate = (k) => { const f = F[k]; const m = f.check(f.el.value); f.err.textContent = m; f.el.setAttribute('aria-invalid', m ? 'true' : 'false'); return !m; };
  Object.keys(F).forEach((k) => F[k].el.addEventListener('blur', () => { if (tried) validate(k); }));
  Object.keys(F).forEach((k) => F[k].el.addEventListener('input', () => { if (tried && F[k].err.textContent) validate(k); }));
  const submit = () => {
    tried = true;
    const bad = Object.keys(F).filter((k) => !validate(k));
    if (bad.length) { const f = F[bad[0]].el; f.focus({ preventScroll: true }); scrollToEl(f.closest('.fld') || f, -120); return false; } // the label clears the header
    form.hidden = true; ok.hidden = false; ok.focus({ preventScroll: false });
    announce(__t('contact.form.ok.h'));
    return true;
  };
  form.addEventListener('submit', (e) => { e.preventDefault(); submit(); });
  const s = params.get('state');
  if (s === 'errors') { F.reach.el.value = '050'; submit(); requestAnimationFrame(() => $('#form').scrollIntoView()); }
  if (s === 'sent') { F.name.el.value = __t('sporchat.chat.name.dana'); F.reach.el.value = '050-1234567'; F.msg.el.value = 'מספרה בנתיבות, התורים בוואטסאפ.'; submit(); requestAnimationFrame(() => $('#form').scrollIntoView()); }
  mountGuide(__t('avatar.page.contact'));
}

/* ══ LEGAL: the table of contents follows the section you read ═══════════ */
function initLegal() {
  const links = new Map($$('.legal__toc a').map((a) => [a.getAttribute('href').slice(1), a]));
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    links.forEach((a) => a.removeAttribute('aria-current'));
    links.get(e.target.id)?.setAttribute('aria-current', 'true');
  }), { rootMargin: '-30% 0px -60% 0px' });
  $$('.legal__sec').forEach((s) => io.observe(s));
}

const safe = (name, fn) => { try { return fn(); } catch (e) { console.warn(`[sales] ${name} kept static`, e); return null; } };
const fonts = Promise.race([
  Promise.all([document.fonts.load('600 40px Rubik', 'אני'), document.fonts.load('expanded 800 40px Archivo', 'NADAV')]),
  new Promise((r) => setTimeout(r, 2000)),
]).catch(() => {});

fonts.then(() => {
  safe('chrome', initChrome);
  // motion.js hands gsap.set() its .rv list as is; the legal pages have none, and GSAP logs an empty target
  if (engine && document.querySelector('.rv')) safe('motion', () => initMotion({ gsap, ScrollTrigger, reduce }));
  const PAGES = { services: initServices, plans: initPlans, check: initCheck, contact: initContact, accessibility: initLegal, privacy: initLegal };
  if (PAGES[page]) safe(page, PAGES[page]);
  if (engine) { ScrollTrigger.sort(); ScrollTrigger.refresh(); }
  if (location.hash.length > 1 && !params.has('state')) {
    const t = document.querySelector(location.hash);
    if (t) requestAnimationFrame(() => (lenis ? lenis.scrollTo(t, { immediate: true, offset: -70 }) : t.scrollIntoView()));
  }
  window.__sales = { lenis, ScrollTrigger };
});
