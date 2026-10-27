// About's world: the story's age. The page starts at fourteen, flashing ROMs onto a hacked phone: the world is coarse
// blocks of Android-green light on a pixel grid, ordered-dithered to a handful of tones, with columns of data falling
// through it. As the visitor scrolls toward today the pixels shrink step by step, the dither and the grid fade, the
// palette warms to the site's amber, and the rain gives way to smooth, soft orbs of light: crisp at the end.
// Light lives on the inline-end side and in the margins; the reading column (inline-start) stays dark.
export default {
  base: '#0B0D0C',
  accent: '#E8913C',
  head: `
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
    float b2(vec2 i) { return mod(2. * i.x + 3. * i.y, 4.); }
    float bayer4(vec2 c) {                                    // 4x4 ordered-dither threshold, 0..15/16
      vec2 a = mod(c, 2.), b = mod(floor(c * .5), 2.);
      return (4. * b2(a) + b2(b)) / 16.;
    }
    vec3 ramp(float v, vec3 a, vec3 b, vec3 c) {
      return v < .5 ? mix(a, b, v * 2.) : mix(b, c, v * 2. - 1.);
    }
    // the world as one number per point, 0..1: a soft glow, a slow haze, data rain (young) and orbs (today)
    float field(vec2 uv, float asp, float t, float sc, float age, float rtl) {
      vec2 p = vec2(uv.x * asp, uv.y);
      float xe = rtl > .5 ? 0. : asp;                         // the inline-end edge of the screen
      float sg = rtl > .5 ? 1. : -1.;
      // a screen-glow low on the inline-end side that rises as the page goes
      vec2 c1 = vec2(xe + sg * asp * .2, .62 - sc * .5);
      float g1 = exp(-length((p - c1) * vec2(1., 1.5)) * 2.4);
      float n = vf(p * vec2(1.5, 2.1) + vec2(t * .02, -sc * .7 + 3.));
      float v = g1 * .8 + n * .22;
      // data rain: columns of falling light, only for the young story
      float cols = 46.;
      float col = floor(uv.x * cols);
      float h = hash(vec2(col, 1.7));
      float on = step(.46, h);
      float head = fract(hash(vec2(col, 4.1)) - t * (.03 + .05 * hash(vec2(col, 8.3))) - sc * (.5 + h * .8));
      float dd = fract(uv.y - head);
      float tail = pow(max(1. - dd / .3, 0.), 2.);
      float rain = on * tail * (1. - smoothstep(.3, .7, sc));
      v += rain * .5;
      // orbs: smooth, soft, slow lights that only the crisp end of the page can show
      for (int i = 0; i < 4; i++) {
        float fi = float(i);
        float a = .1 + .1 * fi + .03 * sin(t * .1 + fi * 2.);
        float x = (rtl > .5 ? a : 1. - a) * asp;
        float y = -.15 + 1.3 * fract(.2 + .27 * fi + t * .004 * (1. + fi * .3) - sc * (.35 + .1 * fi));
        float r = .09 + .03 * fi;
        v += smoothstep(r, r * .1, length(p - vec2(x, y))) * .5 * smoothstep(.45, .85, sc);
      }
      return clamp(v, 0., .8);
    }
  `,
  frag: `
    float asp = u_res.x / u_res.y;
    float sc = u_scroll;
    // the pixel size: coarse blocks at the start, a pixel per pixel by the end (whole pixels, so it steps like a retro screen)
    float rows = 44. * exp(3.9 * sc);
    float cp = max(1., floor(u_res.y / rows + .5));
    vec2 cell = floor(gl_FragCoord.xy / cp);
    vec2 uv = (cell + .5) * cp / u_res;
    vec2 uv0 = gl_FragCoord.xy / u_res;

    float age = smoothstep(.22, .7, sc);
    float ts = u_rtl > .5 ? uv0.x : 1. - uv0.x;
    float away = smoothstep(.95, .2, ts);
    float m = .42 + .58 * away;

    float v = field(uv, asp, u_time, sc, age, u_rtl) * m;

    // a handful of tones with ordered dither at the start; the levels climb and the dither fades toward today
    float L = mix(3., 255., pow(smoothstep(0., .78, sc), 1.4));
    float dm = 1. - smoothstep(.35, .8, sc);
    float vq = floor(v * L + .5 + (bayer4(cell) - .5) * dm) / L;

    vec3 young = ramp(vq, vec3(.008, .016, .013), vec3(.03, .14, .07), vec3(.18, .62, .32));
    vec3 today = ramp(vq, vec3(.012, .016, .024), vec3(.13, .09, .08), vec3(.46, .28, .14));
    vec3 col = mix(young, today, age);

    // the pixel grid: dark seams between the blocks while they are big
    float gk = clamp((cp - 4.) / 8., 0., 1.);
    vec2 cf = fract(gl_FragCoord.xy / cp);
    float seam = step(1. - 1.2 / cp, max(cf.x, cf.y));
    col *= 1. - .4 * gk * seam;

    col *= .85 + .15 * smoothstep(1.3, .25, length(uv0 - .5) * 1.5);
    gl_FragColor = vec4(col, 1.);
  `,
};
