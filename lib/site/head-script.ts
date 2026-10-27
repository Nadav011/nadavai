import { PAGE_ROUTES } from "./routes"

// The prototype's two head scripts, run before first paint, in the same order:
// 1. motion flags: html.js, html.reduce (calm mode, stored or asked for by the device), html.calm-auto, and on the home
//    page html.pfx (motion on: the code hero runs, on WebGL2 or a 2D canvas) with the WebGL hero modules preloaded;
// 2. the review looks (A night, B day): B sets html[data-look], the lk-* scopes and a render-blocking looks.css.
// Plus three helpers the ported modules use instead of static .html pages: __href, __page / __pageOf, and __t (the deck).
const motion = `(function () {
  var d = document.documentElement, q = new URLSearchParams(location.search), calm = null, loc = d.lang;
  var path = location.pathname.replace(/\\/+$/, ''), home = path === '' || path === '/' + loc;
  try { calm = localStorage.getItem('nadavai.calm'); } catch (e) {}
  d.classList.add('js');
  var device = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (calm === '1' || (calm !== '0' && device) || q.get('motion') === '0') d.classList.add('reduce');
  if (device && calm !== '0') d.classList.add('calm-auto');
  if (home) {
    setTimeout(function () { if (!d.classList.contains('gl-up')) d.classList.add('gl-late'); }, 9000);
    d.dataset.photo = '0'; d.dataset.wm = 'en'; d.dataset.v = 'cloud';
    if (!d.classList.contains('reduce') && q.get('gl') !== '0') {
      // the code hero runs with motion on: WebGL2 where there is one, a 2D canvas where there is none (hero-2d.js)
      d.classList.add('pfx');
      try { var c = document.createElement('canvas'), g = c.getContext('webgl2');
        if (g) { var x = g.getExtension('WEBGL_lose_context'); if (x) x.loseContext();
          ['https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js', '/site/hero/hero-gl.js', '/site/hero/hero-cloud.js', '/site/hero/hero-a.js', '/site/hero/cloud.js', '/site/hero/zoom.js']
            .forEach(function (u) { var l = document.createElement('link'); l.rel = 'modulepreload'; l.href = u; document.head.appendChild(l); }); } } catch (e) {}
    }
  }
  var R = ${JSON.stringify(PAGE_ROUTES)};
  var rest = function (p) { return p.replace(/^https?:\\/\\/[^/]+/, '').replace(/[?#].*$/, '').replace(/\\/+$/, '').replace(new RegExp('^/(he|en)(?=/|$)'), '').replace(/^\\//, ''); };
  var pageOf = function (p) { var r = rest(p); for (var k in R) if (R[k] === r) return k; return null; };
  window.__href = function (p) { var i = p.indexOf('#'), h = i < 0 ? '' : p.slice(i), n = i < 0 ? p : p.slice(0, i), r = R[n];
    return '/' + loc + (r ? '/' + r : '') + h; };
  window.__page = pageOf(location.pathname) || 'index';
  window.__pageOf = pageOf;
  var copy = null;
  window.__t = function (id) {
    if (!copy) { try { copy = JSON.parse(document.getElementById('__copy').textContent); } catch (e) { copy = {}; } }
    return copy[id] != null ? copy[id] : id;
  };
})();`

const looks = `(function () {
  var d = document.documentElement, id = (new URLSearchParams(location.search).get('look') || '').toLowerCase();
  try { if (!/^[ab]$/.test(id)) id = localStorage.getItem('nadav-look') || 'a'; } catch (e) {}
  if (id !== 'b') return;
  var S = { 'site.css': 'site', 'chrome.css': 'chrome', 'home.css': 'home', 'sales.css': 'sales', 'story.css': 'story', 'work.css': 'work', 'offer.css': 'offer', 'bio.css': 'bio', 'avatar.css': 'avatar' };
  [].forEach.call(document.querySelectorAll('link[rel="stylesheet"]'), function (l) { var s = S[(l.getAttribute('href') || '').split('/').pop()]; if (s) d.classList.add('lk-' + s); });
  d.setAttribute('data-look', id);
  var tc = document.querySelector('meta[name="theme-color"]'), cs = document.querySelector('meta[name="color-scheme"]');
  if (tc) { tc.setAttribute('data-a', tc.content); tc.content = id === 'b' ? '#F3EFE7' : '#0C0F11'; }
  if (cs) { cs.setAttribute('data-a', cs.content); cs.content = id === 'b' ? 'light' : 'dark'; }
  document.write('<link rel="stylesheet" href="/site/css/looks.css" data-looks>');
})();`

export const HEAD_MOTION = motion
export const HEAD_LOOKS = looks
