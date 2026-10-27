// The network's world: a warm web of glowing branch nodes joined by thin lines of light. Two layers of it hang at
// different depths and slide past as the visitor scrolls (the near one faster), and small pulses of light run along
// the links with the scroll: down the page they travel one way, back up they travel the other. At every new chapter a
// slow ring of signal passes through the net and brightens it. The net is dim under the reading column (inline-start).
export default {
  base: '#0B0C0E',
  accent: '#E8913C',
  head: `
    float hs(vec2 p) { vec3 q = fract(vec3(p.xyx) * .1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }  // sine-free: both ends of a link must agree on a node
    vec2 nodePos(vec2 id, float t) {
      float a = hs(id + 7.3) * 6.2831, b = hs(id + 1.7) * 6.2831;
      return .5 + .3 * vec2(sin(t * .21 + a), cos(t * .17 + b));
    }
    float seg(vec2 p, vec2 a, vec2 b, out float h) {
      vec2 pa = p - a, ba = b - a;
      h = clamp(dot(pa, ba) / dot(ba, ba), 0., 1.);
      return length(pa - ba * h);
    }
    // one layer of the net: q is in cells, phase moves the pulses along the links, pf switches the pulses on.
    // Links run right, up and up-right from a node, so only the four cells below-left of a pixel can own one of its lines.
    vec3 netLayer(vec2 q, float t, float phase, float lw, float pf) {
      vec2 id0 = floor(q);
      vec3 acc = vec3(0.);
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 id = id0 + vec2(float(i), float(j));
          vec2 a = id + nodePos(id, t);
          float hn = hash(id + 3.1);
          // the node: a warm point of light, a few of them larger and paler (hubs)
          float da = length(q - a);
          float hub = step(.86, hn);
          float k = mix(.0022, .0055, hub);
          vec3 nc = mix(vec3(1., .58, .2), vec3(1., .86, .6), hub);
          float g = k / (da * da + k);
          float core = smoothstep(mix(.04, .07, hub), 0., da);
          acc += nc * (core * .45 + g * sqrt(g) * mix(.22, .36, hub));
          if (i <= 0 && j <= 0) {
            for (int n = 0; n < 3; n++) {
              vec2 dv = n == 0 ? vec2(1., 0.) : (n == 1 ? vec2(0., 1.) : vec2(1., 1.));
              float hl = hash(id + float(n) * 13.7 + 5.5);
              if (hl > .45) {
                vec2 b = id + dv + nodePos(id + dv, t);
                float h;
                float dist = seg(q, a, b, h);
                float wire = smoothstep(lw, 0., dist) * .2 / (.9 + length(b - a) * .6);
                float pulse = 0.;
                if (pf > .5) {
                  // a pulse runs along the link; the scroll moves it, so it goes where the visitor goes
                  float pp = fract(phase * (.55 + hl * .9) + hash(id + float(n) + 2.2));
                  float pe = (h - pp) * 15.;
                  pulse = exp(-pe * pe) * sin(3.14159 * pp) * smoothstep(lw * 2.2, 0., dist) * .6;
                }
                acc += mix(vec3(1., .55, .2), vec3(1., .8, .5), hl) * (wire + pulse);
              }
            }
          }
        }
      }
      return acc;
    }
  `,
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    vec2 p = vec2((uv.x - .5) * asp, uv.y - .5);              // centred, the screen is 1 high
    float ts = u_rtl > .5 ? uv.x : 1. - uv.x;
    float away = smoothstep(.95, .2, ts);                     // 1 on the inline-end side, ~0 under the text
    float m = .34 + .66 * away;

    vec3 col = mix(vec3(.026, .021, .018), vec3(.012, .012, .016), uv.y);
    col += vec3(.07, .035, .01) * exp(-length(p - vec2(u_rtl > .5 ? -.35 * asp : .35 * asp, .1)) * 2.2) * .5;

    float t = u_time;
    float sc = u_scroll;
    // the near net slides up past the visitor with the scroll, the far one more slowly
    vec3 near = netLayer(p * 5.4 + vec2(3.1, sc * 12.), t, sc * 9. + t * .03, .006, 1.);
    vec3 far = netLayer(p * 9.5 + vec2(17.4, sc * 6.5), t * .8, sc * 5. - t * .02 + .37, .01, 0.);
    float flare = 1. + abs(u_vel) * .6;

    // a ring of signal at each new chapter
    float f = fract(u_chap);
    vec2 c = vec2(u_rtl > .5 ? -.4 * asp : .4 * asp, 0.);
    float re = (length(p - c) - f * 1.5) * 4.5;
    float ring = exp(-re * re) * (1. - f);
    float lift = 1. + ring * 1.6;

    col += (near * .72 + far * .36) * m * lift * flare;
    col *= .84 + .16 * smoothstep(1.3, .25, length(uv - .5) * 1.5);
    gl_FragColor = vec4(min(col, vec3(.6)), 1.);
  `,
};
