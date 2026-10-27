// The contact world: a warm dark room, and soft WhatsApp-green ripples that spread from beyond the inline-end edge,
// like messages going out. Two sources slide along that edge in opposite directions as you scroll, so the rings
// cross and interfere; scrolling also pushes the rings outward, and a fast scroll brightens them a little. Slow and
// calm: no sharp rings, a low amber lamp-glow in the corner, and the reading column stays plain warm dark.
export default {
  base: '#0B0806',
  accent: '#25D366',
  head: `
    float ripple(vec2 q, vec2 S, float k, float ph0) {
      float d = length(q - S);
      float w = .5 + .5 * cos(6.2831853 * (d * k - ph0));
      float w2 = w * w;
      return w2 * w2 * w * exp(-d * 1.25);
    }
  `,
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    float ts = u_rtl > .5 ? uv.x : 1. - uv.x;           // 0 = inline-end (the world), 1 = start of the reading column
    float narrow = 1. - smoothstep(.65, 1.1, asp);
    vec2 p = vec2(ts * asp, uv.y);
    float s = u_scroll;
    float tm = mix(.2, 1., 1. - smoothstep(.12, .62, ts)) * mix(1., .55, narrow);

    // the room: warm dark, with a low amber glow in the inline-end corner
    vec3 col = vec3(.048, .032, .021);
    col += vec3(.52, .24, .07) * .26 * exp(-length((p - vec2(0., .06)) * vec2(.85, 1.)) * 2.1) * mix(.45, 1., tm);
    col += vec3(.30, .13, .05) * .05 * (1. - uv.y);

    // the ripples
    float t = u_time * .14 + s * 2.2;
    vec2 A = vec2(-.03, .76 - .5 * s);
    vec2 B = vec2(-.03, .16 + .42 * s);
    float amp = 1. + abs(u_vel) * .9;
    float rp = ripple(p, A, 5.2, t) + .8 * ripple(p, B, 6.4, t * .85 + .3);
    vec3 wa = vec3(.145, .827, .40);
    col += wa * rp * .21 * amp * tm;
    col += wa * .22 * (exp(-length(p - A) * 13.) + exp(-length(p - B) * 13.)) * tm;

    col *= .85 + .15 * (1. - smoothstep(.3, 1.4, length(uv - .5) * 1.5));
    col += (hash(gl_FragCoord.xy) - .5) / 230.;
    gl_FragColor = vec4(col, 1.);
  `,
};
