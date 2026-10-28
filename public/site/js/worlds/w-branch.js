// My-branch's world: the day's sky, dawn to night, over a small town. The page already runs a clock (js/story/branch.js)
// and sets the colours of the sky on #sky as CSS variables; this world reads those every frame, so it is always the
// same hour as the clock, and paints on top of them what a flat gradient cannot: clouds that slide with the scroll and
// catch the sun's colour, a halo and slow rays around the DOM sun (and a cold one around the moon), twinkling stars with
// a faint Milky Way at night, and a low skyline whose windows switch on as the evening comes (two layers that slide at
// different speeds as you scroll, one roof with a glowing sign). The sun, moon and star dots of the page stay as they are.
// The page's own .sky gradient steps aside (html.world-on .sky) because it would cover the canvas.
const num = (s) => (s || '').match(/-?\d*\.?\d+/g)?.map(Number) || [];
let sky = null, rtl = null;

export default {
  base: '#0A0C0E',
  accent: '#F2B36F',
  extra: ['u_sa', 'u_sb', 'u_gl', 'u_sky', 'u_sun'],
  head: `
    uniform vec3 u_sa, u_sb;
    uniform vec4 u_gl, u_sun;
    uniform vec2 u_sky;                                       // x: glow height (0 top .. 1 bottom up), y: stars/night
    // a sine-free hash and value noise: the shared hash() loses precision on some GPUs and the noise shows hard cell edges
    float hs(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
    float vn(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      f = f * f * (3. - 2. * f);
      return mix(mix(hs(i), hs(i + vec2(1., 0.)), f.x), mix(hs(i + vec2(0., 1.)), hs(i + vec2(1., 1.)), f.x), f.y);
    }
    float vf(vec2 p) {
      float v = 0., a = .5;
      for (int i = 0; i < 4; i++) { v += a * vn(p); p = p * 2.03 + vec2(17.1, 5.3); a *= .5; }
      return v;
    }
    float starsAt(vec2 uv, float asp, float cells, float dens, float t, float seed) {
      vec2 g = vec2(uv.x * asp, uv.y) * cells;
      vec2 id = floor(g), f = fract(g) - .5;
      float h = hash(id + seed);
      if (h < 1. - dens) return 0.;
      vec2 o = (vec2(hash(id + seed + 3.7), hash(id + seed + 9.1)) - .5) * .6;
      float tw = .62 + .38 * sin(t * (.6 + h * 1.6) + h * 50.);
      return smoothstep(.11, .0, length(f - o)) * tw * (.4 + .6 * hash(id + seed + 1.9));
    }
    // a row of low buildings: x = silhouette, y = lit windows, z = a glowing sign
    vec3 skyline(vec2 uv, float asp, float shift, float cells, float base, float hmax, float seed, float lit) {
      float x = uv.x * asp * cells + shift;
      float i = floor(x), fx = fract(x);
      float h = hash(vec2(i, seed));
      float gap = step(.86, hash(vec2(i, seed + 5.)));
      float bh = hmax * (.35 + .65 * h) * (1. - gap * .7);
      float bw0 = .04 + .1 * hash(vec2(i, seed + 2.));
      float inX = step(bw0, fx) * step(fx, 1. - bw0);
      float top = base + bh;
      float tank = step(.62, hash(vec2(i, seed + 8.))) * step(.3, fx) * step(fx, .5);   // a water tank on the roof
      top += tank * hmax * .1;
      float body = inX * step(uv.y, top);
      float ux = (fx - bw0) / max(1. - 2. * bw0, .01) * 4.;
      float uy = (uv.y - base) / (hmax * .1);
      vec2 wid = floor(vec2(ux, uy)), wf = fract(vec2(ux, uy));
      float wmask = step(.2, wf.x) * step(wf.x, .8) * step(.22, wf.y) * step(wf.y, .74);
      float on = step(hash(wid + i * 7.31 + seed), lit);
      float win = wmask * on * body * step(uv.y, base + bh - hmax * .05) * step(base + hmax * .04, uv.y);
      float sg = step(.88, hash(vec2(i, seed + 11.))) * step(.22, fx) * step(fx, .78)
               * step(base + bh - hmax * .24, uv.y) * step(uv.y, base + bh - hmax * .15);
      return vec3(body, win, sg * body);
    }
  `,
  uniforms(gl, U) {
    sky = sky || document.getElementById('sky');
    if (rtl === null) rtl = getComputedStyle(document.documentElement).direction === 'rtl';
    const v = (k) => (sky ? sky.style.getPropertyValue(k) : '');
    const sa = num(v('--sa')), sb = num(v('--sb')), g = num(v('--gl'));
    const d = (a, i, f) => (a[i] ?? f);
    gl.uniform3f(U.u_sa, d(sa, 0, 26) / 255, d(sa, 1, 35) / 255, d(sa, 2, 56) / 255);
    gl.uniform3f(U.u_sb, d(sb, 0, 10) / 255, d(sb, 1, 12) / 255, d(sb, 2, 14) / 255);
    gl.uniform4f(U.u_gl, d(g, 0, 242) / 255, d(g, 1, 179) / 255, d(g, 2, 111) / 255, d(g, 3, 0.3));
    gl.uniform2f(U.u_sky, 1 - d(num(v('--gy')), 0, 100) / 100, d(num(v('--st')), 0, 0));
    const sx = d(num(v('--sx')), 0, 8) / 100, sy = d(num(v('--sy')), 0, 70) / 100;
    gl.uniform4f(U.u_sun, rtl ? 1 - sx : sx, 1 - sy, d(num(v('--sunO')), 0, 1), d(num(v('--moonO')), 0, 0));
  },
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    vec2 p = vec2(uv.x * asp, uv.y);
    float night = u_sky.y;
    float ts = u_rtl > .5 ? uv.x : 1. - uv.x;

    // the page's own sky: the same gradient and horizon glow branch.js sets, so the hour matches the clock
    vec3 col = mix(u_sa, u_sb, clamp((1. - uv.y) / .78, 0., 1.));
    float q = length((uv - vec2(.5, u_sky.x)) / vec2(1.2, .7));
    col = mix(col, u_gl.rgb, u_gl.a * (1. - clamp(q / .7, 0., 1.)));

    vec2 S = u_sun.xy;
    vec2 dv = (uv - S) * vec2(asp, 1.);
    float ds = length(dv);
    vec3 warm = vec3(1., .72, .38);

    // clouds: thin, soft bands that slide with the scroll and take the sun's colour near it
    float drift = u_time * .007 + u_scroll * 1.5 + u_vel * .05;
    vec2 cq = vec2(p.x * 1.05 - drift, uv.y * 3.2);
    float c1 = vf(cq * vec2(1., 1.8) + vec2(0., 4.));
    float c2 = vf(cq * vec2(1.9, 2.8) + vec2(7.3 - drift * .5, 1.));
    float cm = smoothstep(.46, .86, c1 * .62 + c2 * .42);
    float band = smoothstep(.28, .55, uv.y) * smoothstep(1.04, .78, uv.y);
    float lit = exp(-ds * 1.5);
    vec3 cc = mix(u_sa * 2.4 + .02, warm * .8, lit * u_sun.z);
    col += cc * cm * band * .17 * (1. - night * .86);

    // the sun: a halo, and a few slow rays that flare a little when the scroll is fast
    float ang = atan(dv.y, dv.x);
    float rays = pow(.5 + .5 * sin(ang * 8. + u_time * .04 + sin(ang * 3.) * 2.), 3.);
    col += warm * (exp(-ds * 5.5) * .085 + exp(-ds * 18.) * .05) * u_sun.z;
    col += warm * rays * exp(-ds * 2.4) * .032 * u_sun.z * (1. + abs(u_vel) * .8);
    // the moon: a cold halo
    col += vec3(.55, .66, .95) * (exp(-ds * 7.) * .08 + exp(-ds * 24.) * .05) * u_sun.w;

    // stars, a faint Milky Way across them
    float skyMask = smoothstep(.1, .5, uv.y);
    vec2 pn = normalize(vec2(.62, -.78));
    float dd = dot(p - vec2(asp * .5, .62), pn);
    float mw = exp(-dd * dd * 12.);
    float stv = starsAt(uv, asp, 38., .09, u_time, 1.) + starsAt(uv, asp, 15., .06, u_time, 2.) * 1.5
              + starsAt(uv, asp, 95., .3, u_time, 3.) * mw * .8;
    col += vec3(.8, .86, 1.) * stv * night * skyMask * .75;
    col += vec3(.18, .2, .32) * mw * night * skyMask * .05;

    // the town: far and near rows that slide past at different speeds, windows lighting up with the evening
    float lw = .03 + .48 * night;
    vec3 fr = skyline(uv, asp, u_scroll * 3. + 11., 7., .07, .15, 1., lw);
    vec3 farc = mix(u_sb, u_gl.rgb, .08) * .55 + .004;
    col = mix(col, farc, fr.x * .92);
    col += vec3(1., .78, .46) * fr.y * (.1 + .13 * night);
    vec3 nr = skyline(uv, asp, u_scroll * 6. + 3., 11., .035, .15, 9., lw);
    col = mix(col, vec3(.004, .006, .009), nr.x);
    col += vec3(1., .8, .48) * nr.y * (.16 + .16 * night);
    col += vec3(1., .42, .12) * nr.z * (.1 + .32 * night);

    // the reading side (inline-start) stays dark, and a soft vignette
    col *= 1. - .3 * smoothstep(.5, .95, ts);
    col *= .84 + .16 * smoothstep(1.3, .25, length(uv - .5) * 1.5);
    gl_FragColor = vec4(min(col, vec3(.6)), 1.);
  `,
};
