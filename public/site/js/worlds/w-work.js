// The work index's world: a gallery of screens. Soft glowing phone-shaped tiles hang in the dark at five depths and
// the scroll flies the visitor through them: each layer grows toward the viewer as the page scrolls and fades out as it
// passes. The tiles stream out of a vanishing point in the inline-end margin, so the reading side stays calm and dark.
export default {
  base: '#07090C',
  accent: '#E8913C',
  head: `
    float sdRB(vec2 p, vec2 b, float r) { vec2 d = abs(p) - b + r; return length(max(d, 0.)) + min(max(d.x, d.y), 0.) - r; }
    vec3 tint(float h) {
      // the apps' own lights: amber (the site), SporChat blue, Medizen teal, Green Room gold
      if (h < .25) return vec3(.91, .57, .24);
      if (h < .5) return vec3(.55, .76, 1.);
      if (h < .75) return vec3(.42, .84, .65);
      return vec3(.89, .77, .49);
    }
  `,
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    float s = u_rtl > .5 ? -1. : 1.;
    vec2 q = vec2(s * (uv.x - .5) * asp, uv.y - .5);   // q.x grows toward the inline-end margin
    float narrow = smoothstep(1.1, .6, asp);
    vec2 vp = vec2(.30 * asp, .06);                      // where the tiles stream out of
    float px = 1. / u_res.y;
    vec3 col = mix(vec3(.010, .013, .018), vec3(.020, .026, .036), uv.y);
    col += vec3(.91, .57, .24) * .035 / (1. + 7. * length(q - vp));
    float fly = u_scroll * 3.2 + u_time * .010 + u_vel * .05;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float ph = fi * .2 + fly;
      float cyc = floor(ph);
      float t = fract(ph);
      float sc = .34 * exp(t * 1.85);                    // .34 far .. 2.2 near
      float env = smoothstep(0., .25, t) * smoothstep(1., .55, t);
      vec2 w = (q - vp) / sc;
      w += vec2(fi * .37 + cyc * .61, fi * .23 + cyc * .29 + u_time * .006 * (1. + fi * .35));
      vec2 cell = vec2(.27, .56);
      vec2 g = w / cell;
      vec2 id = floor(g);
      float hv = hash(id + fi * 17.3 + cyc * 5.1);
      float has = step(.50, hv);
      float k = .78 + .40 * hash(id + 2.2 + fi);           // tiles differ in size
      vec2 hs = vec2(.056, .125) * k;
      vec2 jit = (vec2(hash(id + 3.1 + cyc), hash(id + 8.7 + fi)) - .5) * (cell - 2. * hs) * .96;
      vec2 lw = (fract(g) - .5) * cell - jit;
      float dS = sdRB(lw, hs, .022 * k) * sc;           // distance to the tile edge, in screen units
      float ly = lw.y / hs.y;
      float bars = smoothstep(.0, .12, .5 - abs(fract(ly * 3.1 + hv * 9.) - .5));
      float fill = mix(.35, 1., smoothstep(-1., 1., ly)) * (.62 + .38 * bars);
      float notch = smoothstep(.02 * sc, 0., length(lw - vec2(0., hs.y * .86)) - .008 * k) * .5;
      float body = smoothstep(px * 1.5, -px * 1.5, dS) * (fill * .115 + notch * .12);
      float soft = 2.2 + 5. * t * t;                       // near tiles go soft, like depth of field
      float rim = smoothstep(px * soft, 0., abs(dS)) * .30 * 2.2 / soft;
      float glow = exp(-max(dS, 0.) / (.008 + .008 * sc)) * .075;
      vec3 tc = tint(hash(id + 9.4 + fi));
      float lift = (.55 + .45 * smoothstep(.0, .45, t)) * (1. - .55 * smoothstep(.5, .95, t));   // brightest mid-flight
      col += tc * (body + rim + glow) * env * has * lift * (.85 + abs(u_vel) * .5);
    }
    // reading side (inline-start) stays dark; on a phone the whole width is the column
    float textSide = u_rtl > .5 ? uv.x : 1. - uv.x;
    col *= mix(1. - .70 * smoothstep(.34, .86, textSide), .55, narrow);
    col *= .80 + .20 * smoothstep(1.3, .2, length(uv - .5) * 1.5);
    gl_FragColor = vec4(col, 1.);
  `,
};
