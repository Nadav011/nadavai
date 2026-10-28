// Social's world: a feed seen through frosted glass. Columns of soft post-shaped tiles (an avatar and two lines
// of text at the top, a picture, a heart at the foot) slide up past the visitor as they scroll, each column at its
// own speed so the feed has depth, and a few reactions (small hearts and dots of light) drift upward on their own.
// The tiles are dim and a little blurred; they stay quieter under the reading column (inline-start).
export default {
  base: '#0B0C0F',
  accent: '#FF7A8A',
  head: `
    float dot2(vec2 v) { return dot(v, v); }
    float sdRound(vec2 p, vec2 b, float r) {
      vec2 q = abs(p) - b + r;
      return length(max(q, 0.)) + min(max(q.x, q.y), 0.) - r;
    }
    // iq's heart: the tip at the origin, the lobes above it
    float sdHeart(vec2 p) {
      p.x = abs(p.x);
      if (p.y + p.x > 1.) return sqrt(dot2(p - vec2(.25, .75))) - sqrt(2.) / 4.;
      return sqrt(min(dot2(p - vec2(0., 1.)), dot2(p - .5 * max(p.x + p.y, 0.)))) * sign(p.x - p.y);
    }
    float bar(vec2 p, vec2 c, vec2 hs, float e) {
      vec2 d = abs(p - c) - hs;
      return smoothstep(e, -e, max(d.x, d.y));
    }
    vec3 tint(float h) {
      return h < .2 ? vec3(1., .62, .24) : (h < .4 ? vec3(1., .4, .5) : (h < .6 ? vec3(.3, .8, .8) : (h < .8 ? vec3(.62, .5, 1.) : vec3(1., .78, .35))));
    }
  `,
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    float ts = u_rtl > .5 ? uv.x : 1. - uv.x;
    float away = smoothstep(.95, .2, ts);                     // 1 on the inline-end side, ~0 under the text
    float m = .4 + .6 * away;
    float side = u_rtl > .5 ? 1. : -1.;                       // the inline-start side of a tile

    vec3 col = mix(vec3(.022, .02, .024), vec3(.012, .012, .016), uv.y);

    // ── the feed: columns of tiles, each column at its own speed ──
    float n = asp > 1.25 ? 6. : 4.;
    float cw = asp / n;
    vec2 q = vec2(uv.x * asp, uv.y);
    float ci = floor(q.x / cw);
    float spd = .5 + .75 * fract(ci * .618 + .2);
    float pitch = cw * (1.36 + .26 * hash(vec2(ci, 7.1)));
    float yy = uv.y + u_scroll * spd * 2.8 + u_time * .004 * spd + hash(vec2(ci, 3.3)) * pitch * 5.;
    float ri = floor(yy / pitch);
    float fy = yy / pitch - ri;
    float lx = q.x - (ci + .5) * cw;
    float ly = (fy - .5) * pitch;
    float hx = cw * .41, hy = pitch * .43;
    float ew = cw * (.004 + .016 * (spd - .5));               // the faster (nearer) columns are softer
    float rad = cw * .07;

    float th = hash(vec2(ci * 3.1, ri + 11.));
    vec3 tc = tint(th);
    float d = sdRound(vec2(lx, ly), vec2(hx, hy), rad);
    float body = smoothstep(ew, -ew, d);
    float rim = smoothstep(ew * 2.5, 0., abs(d)) * .5;

    vec3 tile = tc * (.034 + .03 * (ly / hy * .5 + .5)) * body;
    // the picture
    float img = smoothstep(ew, -ew, sdRound(vec2(lx, ly - hy * .02), vec2(hx * .88, hy * .5), rad * .6));
    vec2 bp = vec2((hash(vec2(ci, ri + 4.)) - .5) * hx, (hash(vec2(ci, ri + 8.)) - .5) * hy * .5);
    tile += tc * img * (.045 + .075 * exp(-length(vec2(lx, ly) - bp) / (cw * .26)));
    // the header: an avatar and two lines of text, at the inline-start corner
    float cr = cw * .1;
    vec2 ac = vec2(side * (hx - cr * 1.6), hy - cr * 1.7);
    float av = smoothstep(ew, -ew, length(vec2(lx, ly) - ac) - cr);
    float t1 = bar(vec2(lx, ly), vec2(side * (hx - cr * 3.6 - cw * .12), hy - cr * 1.3), vec2(cw * .12, cr * .16), ew);
    float t2 = bar(vec2(lx, ly), vec2(side * (hx - cr * 3.6 - cw * .08), hy - cr * 2.1), vec2(cw * .08, cr * .14), ew);
    tile += (tc * .5 + .5) * (av * .1 + (t1 + t2) * .06);
    // the foot: a heart and two small marks
    vec2 hp = (vec2(lx, ly) - vec2(side * (hx - cr * 1.7), -hy + cr * 1.5)) / (cr * .85) + vec2(0., .55);
    float ht = smoothstep(.1, -.05, sdHeart(hp));
    float f1 = bar(vec2(lx, ly), vec2(side * (hx - cr * 4.4), -hy + cr * 1.5), vec2(cw * .05, cr * .16), ew);
    tile += (vec3(1., .45, .55) * ht * .13 + vec3(.85) * f1 * .05);
    tile += tc * rim * .05;

    float depth = .6 + .4 * spd / 1.25;
    col += tile * depth * m * 1.25;

    // ── reactions: small hearts and dots of light drifting up, two depths ──
    for (int L = 0; L < 2; L++) {
      float fl = float(L);
      float sc = mix(4.2, 7.5, fl);
      vec2 g = vec2(uv.x * asp, uv.y) * sc - vec2(0., u_time * mix(.16, .1, fl) + u_scroll * mix(5., 3., fl));
      vec2 id = floor(g);
      vec2 lp = fract(g) - .5;
      float h = hash(id + fl * 31.);
      if (h > .68) {
        float h2 = hash(id + 17.3 + fl);
        lp -= vec2((hash(id + 5.1) - .5) * .4 + .14 * sin(u_time * .6 + h * 40.), (hash(id + 9.3) - .5) * .4);
        float life = smoothstep(.04, .22, uv.y) * smoothstep(.98, .7, uv.y);
        float tw = .75 + .25 * sin(u_time * 1.1 + h * 70.);
        vec3 rc;
        float a;
        if (h2 < .5) {
          float s = (.11 + .06 * h2) * mix(1., .6, fl);
          float dh = sdHeart(lp / s + vec2(0., .55)) * s;
          a = smoothstep(.012, -.006, dh) + exp(-max(dh, 0.) * 16.) * .22;
          rc = vec3(1., .36, .46);
        } else {
          float dd = length(lp);
          a = smoothstep(.05, .0, dd) + exp(-dd * 10.) * .2;
          rc = h2 < .8 ? vec3(1., .72, .32) : vec3(1., .9, .75);
        }
        col += rc * a * life * tw * mix(.26, .18, fl) * (.4 + .6 * away);
      }
    }

    col *= smoothstep(0., .06, uv.y) * .15 + .85;
    col *= .85 + .15 * smoothstep(1.3, .25, length(uv - .5) * 1.5);
    gl_FragColor = vec4(min(col, vec3(.6)), 1.);
  `,
};
