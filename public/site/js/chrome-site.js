// chrome-site.js: the shared page frame for every page (header, phone menu, calm switch, current page,
// progress line, dock). No dependencies; GSAP and Lenis are optional. Markup: fragments/header.html,
// fragments/footer.html, fragments/dock.html. Usage: see fragments/CHROME.md.
//
//   import { initSiteChrome } from './js/chrome-site.js';
//   initSiteChrome({ lenis, dockAfter: 0.6 });   // dockAfter: px, or a fraction of the viewport, or a selector

// ── review looks: A "לילה" (the site as designed), B "יום" ──
// ?look=a|b (remembered in localStorage nadav-look), else the stored choice. Look A loads and sets nothing.
// B sets html[data-look] and loads css/looks.css; a two-dot switcher (hidden with ?looks=0) for live review.
// window.__look = { id, ready } and a 'look:change' event let canvas and WebGL code re-read the --lk-* colours.
const LOOK_SCOPES = { 'site.css': 'site', 'chrome.css': 'chrome', 'home.css': 'home', 'sales.css': 'sales', 'story.css': 'story',
  'work.css': 'work', 'offer.css': 'offer', 'bio.css': 'bio', 'avatar.css': 'avatar' };
// Nadav kept A (night) and B (day) on 2026-10-27; C (graphite) is retired, a stored 'c' falls back to A
const LOOK_META = { b: { scheme: 'light', theme: '#F3EFE7' } };
const LOOK_NAMES = { a: __t('global.theme.night'), b: __t('global.theme.day') };
function initLooks() {
  const root = document.documentElement;
  const q = new URLSearchParams(location.search);
  let id = (q.get('look') || '').toLowerCase();
  try {
    if (LOOK_NAMES[id]) localStorage.setItem('nadav-look', id);
    else id = localStorage.getItem('nadav-look') || 'a';
  } catch { /* storage blocked: this page only */ }
  if (!LOOK_NAMES[id]) id = 'a';
  const metaOf = (n) => document.querySelector(`meta[name="${n}"]`);
  // look A's values; the head script keeps them in data-a when it already applied B or C
  const meta0 = { scheme: metaOf('color-scheme')?.dataset.a || metaOf('color-scheme')?.content, theme: metaOf('theme-color')?.dataset.a || metaOf('theme-color')?.content };
  // The page head may have written looks.css already (before first paint); reuse it. Modules run only after
  // head stylesheets settle, so that link has loaded (or failed) by now.
  let link = document.querySelector('link[data-looks]'), ready = Promise.resolve();
  const load = () => {
    if (link) return ready;
    link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = new URL('../css/looks.css', import.meta.url).href; link.dataset.looks = '';
    ready = new Promise((res) => { link.onload = res; link.onerror = res; });
    document.head.appendChild(link);
    return ready;
  };
  const state = { id: 'a', ready };
  const apply = (next) => {
    state.id = next;
    const scopes = new Set();
    document.querySelectorAll('link[rel="stylesheet"]').forEach((l) => { const s = LOOK_SCOPES[(l.getAttribute('href') || '').split('/').pop()]; if (s) scopes.add(`lk-${s}`); });
    if (next === 'a') {
      root.removeAttribute('data-look');
      Object.values(LOOK_SCOPES).forEach((s) => root.classList.remove(`lk-${s}`));
      if (meta0.scheme && metaOf('color-scheme')) metaOf('color-scheme').content = meta0.scheme;
      if (meta0.theme && metaOf('theme-color')) metaOf('theme-color').content = meta0.theme;
      state.ready = Promise.resolve();
    } else {
      state.ready = load();
      root.classList.add(...scopes);
      root.dataset.look = next;
      if (metaOf('color-scheme')) metaOf('color-scheme').content = LOOK_META[next].scheme;
      if (metaOf('theme-color')) metaOf('theme-color').content = LOOK_META[next].theme;
    }
    state.ready.then(() => document.dispatchEvent(new CustomEvent('look:change', { detail: { look: next } })));
  };
  if (id !== 'a') apply(id);
  window.__look = state;
  // The switcher shows by default while the looks are under review (artifact links cannot carry a query); ?looks=0 hides it.
  if (q.get('looks') !== '0') {
    const mount = () => {
      const st = document.createElement('style');
      st.textContent = '.looks{display:flex;align-items:center}@media (max-width:900px){.nav > .looks{display:none}}.sheet .looks{margin-block-start:12px}'
        + '.looks button{display:grid;place-items:center;width:44px;height:44px;padding:0;border:0;border-radius:50%;background:none;cursor:pointer}'
        + '.looks i{width:14px;height:14px;border-radius:50%;box-shadow:0 0 0 1px rgba(128,128,128,.6);transition:scale .2s ease}'
        + '.looks button[aria-pressed="true"] i{scale:1.25;box-shadow:0 0 0 2px #fff,0 0 0 3.5px #111}.looks button:focus-visible{outline:2px solid #fff;outline-offset:1px;box-shadow:0 0 0 5px #111}';
      document.head.appendChild(st);
      const bar = document.createElement('div');
      bar.className = 'looks'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', __t('global.theme.label'));
      const dots = { a: 'linear-gradient(135deg,#0A0C0E 50%,#E8913C 50%)', b: 'linear-gradient(135deg,#F3EFE7 50%,#B23C0A 50%)' };
      Object.keys(LOOK_NAMES).forEach((k) => {
        const b = document.createElement('button');
        b.type = 'button'; b.dataset.look = k; b.title = LOOK_NAMES[k];
        b.setAttribute('aria-label', LOOK_NAMES[k]);
        b.setAttribute('aria-pressed', String(k === state.id));
        b.innerHTML = `<i style="background:${dots[k]}"></i>`;
        b.addEventListener('click', () => {
          apply(k);
          try { localStorage.setItem('nadav-look', k); } catch { /* this page only */ }
          document.querySelectorAll('.looks button').forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.look === k)));
          try { const u = new URL(location.href); u.searchParams.set('look', k); history.replaceState(history.state, '', u); } catch { /* opaque-origin frame */ }
        });
        bar.appendChild(b);
      });
      const nav = document.getElementById('nav'), sheet = document.querySelector('#navSheet nav');
      if (nav) nav.insertBefore(bar, document.getElementById('calm')); else document.body.appendChild(bar);
      if (sheet) {
        const copy = bar.cloneNode(true);
        copy.addEventListener('click', (e) => { const t = e.target.closest('button[data-look]'); if (t) bar.querySelector(`[data-look="${t.dataset.look}"]`).click(); });
        sheet.appendChild(copy);
      }
    };
    if (document.body) mount(); else addEventListener('DOMContentLoaded', mount, { once: true });
  }
  return state;
}
initLooks();

export function initSiteChrome({ lenis = null, dockAfter = 0.6 } = {}) {
  const root = document.documentElement;
  const nav = document.getElementById('nav');
  if (!nav || nav.dataset.chrome) return;
  nav.dataset.chrome = '1';
  const reduce = root.classList.contains('reduce');
  const scrollY0 = () => (lenis ? lenis.scroll : window.scrollY);

  // the current page: aria-current + a hidden "(העמוד הנוכחי)" for screen readers
  const here = window.__page;
  const alias = { 'work-sporchat': 'work', 'work-medizen': 'work', 'work-green-room': 'work', 'mexicani-network': 'work' };
  document.querySelectorAll('#nav .nav__links a, #navSheet a, .site-foot .foot__col a').forEach((a) => {
    const t = window.__pageOf(a.getAttribute('href') || '') || '';
    if (t && (t === here || t === alias[here])) {
      a.setAttribute('aria-current', 'page');
      if (!a.querySelector('.sr')) a.insertAdjacentHTML('beforeend', '<span class="sr"> ' + __t('global.nav.current') + '</span>');
    }
  });
  document.querySelectorAll('[data-year]').forEach((y) => { y.textContent = String(new Date().getFullYear()); });

  // calm mode: one switch, remembered; the page reloads into the chosen mode
  const calmBtn = document.getElementById('calm');
  if (calmBtn) {
    calmBtn.setAttribute('aria-checked', String(reduce));
    if (root.classList.contains('calm-auto')) calmBtn.title = __t('global.calm.auto');
  }
  const live = document.getElementById('calmLive');
  try {
    const said = sessionStorage.getItem('nadavai.calm.say');
    if (said !== null && live) { sessionStorage.removeItem('nadavai.calm.say'); setTimeout(() => { live.textContent = said === '1' ? __t('global.calm.on') : __t('global.calm.off'); }, 400); }
  } catch { /* storage blocked */ }
  document.querySelectorAll('#calm, [data-calm]').forEach((b) => b.addEventListener('click', () => {
    try { localStorage.setItem('nadavai.calm', reduce ? '0' : '1'); sessionStorage.setItem('nadavai.calm.say', reduce ? '0' : '1'); } catch { /* this visit only */ }
    location.reload();
  }));

  // phone menu sheet
  const menuBtn = nav.querySelector('.nav__menu');
  const sheet = document.getElementById('navSheet');
  const setMenu = (open) => {
    if (!menuBtn || !sheet) return;
    sheet.hidden = !open;
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? (menuBtn.dataset.labelClose || __t('global.nav.menu.close')) : (menuBtn.dataset.labelOpen || __t('global.nav.menu.open')));
    // everything behind the sheet leaves the tab order while it is open, and the guide steps out of it
    document.querySelectorAll('main, footer, .site-foot, #dock, .nav-avatar').forEach((el) => { el.inert = open; });
    document.documentElement.classList.toggle('menu-open', open);
    if (open) { lenis?.stop(); sheet.querySelector('a')?.focus(); } else lenis?.start();
  };
  menuBtn?.addEventListener('click', () => setMenu(sheet.hidden));
  sheet?.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && sheet && !sheet.hidden) { setMenu(false); menuBtn.focus(); } });
  // while the sheet is open, Tab cycles between the menu button and the sheet's links
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Tab' || !sheet || sheet.hidden) return;
    const ring = [menuBtn, ...sheet.querySelectorAll('a,button')].filter((el) => el && el.offsetParent !== null);
    const i = ring.indexOf(document.activeElement);
    if (i < 0 || (e.shiftKey && i === 0) || (!e.shiftKey && i === ring.length - 1)) {
      e.preventDefault();
      ring[e.shiftKey ? (i <= 0 ? ring.length - 1 : i - 1) : (i < 0 || i === ring.length - 1 ? 0 : i + 1)].focus();
    }
  });

  // solid header once scrolled, the progress line, and the dock after the page's opening screen
  const bar = document.getElementById('progress');
  const dockAt = () => {
    if (typeof dockAfter === 'string') { const el = document.querySelector(dockAfter); return el ? el.getBoundingClientRect().bottom + scrollY0() - innerHeight * 0.4 : innerHeight * 0.6; }
    return dockAfter < 5 ? innerHeight * dockAfter : dockAfter;
  };
  let at = dockAt();
  addEventListener('resize', () => { at = dockAt(); }, { passive: true });
  const onScroll = () => {
    const y = scrollY0(), max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, y / max)) : 0})`;
    root.classList.toggle('scrolled', y > 40);
    if (dockAfter !== false) root.classList.toggle('past-hero', y > at);
  };
  if (lenis) lenis.on('scroll', onScroll); else addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  return { setMenu };
}
