// Play's world: a neon arcade. A perspective grid floor in magenta (the lines that run to the vanishing point) and
// cyan (the cross lines) comes toward the visitor as they scroll, stars twinkle above it, and a striped sun sinks
// behind the horizon over the length of the page. Everything bright lives on the inline-end side and in the margins;
// the reading column (inline-start) gets the dim version of it.
export default {
  base: '#08040F',
  accent: '#FF3DCB',
  head: `
    // one layer of stars: a point in some cells, tinted cyan, magenta or white, twinkling slowly
    vec3 starLayer(vec2 uv, float asp, float cells, float dens, float t, float seed) {
      vec2 g = vec2(uv.x * asp, uv.y) * cells;
      vec2 id = floor(g), f = fract(g) - .5;
      float h = hash(id + seed);
      if (h < 1. - dens) return vec3(0.);
      vec2 o = (vec2(hash(id + seed + 3.7), hash(id + seed + 9.1)) - .5) * .6;
      float d = length(f - o);
      float tw = .62 + .38 * sin(t * (.7 + h * 2.) + h * 60.);
      float tint = hash(id + seed + 5.3);
      vec3 c = tint < .22 ? vec3(.45, .9, 1.) : (tint < .44 ? vec3(1., .5, .9) : vec3(.86, .88, 1.));
      return c * smoothstep(.1, .0, d) * tw * (.35 + .65 * hash(id + seed + 1.9));
    }
  `,
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    float hz = .44;                                           // the horizon
    float ts = u_rtl > .5 ? uv.x : 1. - uv.x;                 // 1 at the reading side
    float away = smoothstep(.95, .25, ts);                    // 1 on the inline-end side, ~0 under the text
    float side = .36 + .64 * away;
    float flare = 1. + abs(u_vel) * .5;

    // the sky: a purple haze at the horizon fading to indigo-black
    float sk = clamp((uv.y - hz) / (1. - hz), 0., 1.);
    vec3 col = mix(vec3(.078, .018, .105), vec3(.010, .007, .030), pow(sk, .45));

    // stars, drifting a little with the scroll (two depths)
    vec3 st = starLayer(uv + vec2(u_scroll * .05, 0.), asp, 44., .1, u_time, 1.)
            + starLayer(uv + vec2(u_scroll * .13, 0.), asp, 17., .06, u_time, 2.) * 1.5;
    col += st * smoothstep(hz + .02, hz + .32, uv.y) * .8;

    // the sun: striped, on the inline-end side, sinking behind the horizon as the page goes
    float R = .17;
    float sx = u_rtl > .5 ? .22 : .78;
    float sy = hz + R * (.62 - .95 * u_scroll);
    vec2 sp = vec2((uv.x - sx) * asp, uv.y - sy);
    float r = length(sp);
    float sv = clamp((sy + R - uv.y) / (2. * R), 0., 1.);     // 0 at the top of the sun, 1 at its foot
    float gap = step(fract(sv * 11.), sv * .62) * step(.42, sv);
    float disc = smoothstep(R, R - .006, r) * step(hz, uv.y) * (1. - gap);
    vec3 sunc = mix(vec3(1., .82, .28), vec3(1., .1, .66), smoothstep(0., .75, sv));
    float phone = smoothstep(1.1, .7, asp);                   // on a phone the text spans the screen: a dimmer sun
    col += sunc * disc * mix(.26, .15, phone) * (.5 + .5 * away);
    col += vec3(1., .16, .6) * exp(-r * 6.) * .06 * step(hz, uv.y) * (.4 + .6 * away);

    // the floor: a perspective grid that comes toward the visitor with the scroll
    if (uv.y < hz) {
      float d = hz - uv.y;
      float z = 3.4 / max(d, .0015);
      float x = (uv.x - .5) * asp * z;
      float zz = z * .55 + u_scroll * 30. + u_time * .45;
      float px = 1.5 / u_res.y;
      float lwx = z * px;
      float lwz = .55 * z * z * px / 3.4;
      float fx = abs(fract(x + .5) - .5);
      float fz = abs(fract(zz + .5) - .5);
      float lx = smoothstep(lwx * 1.4, 0., fx) + .3 * exp(-fx / (lwx * 6.));
      float lz = smoothstep(lwz * 1.4, 0., fz) + .3 * exp(-fz / (lwz * 6.));
      float fade = smoothstep(.05, .22, d);
      vec3 mag = vec3(1., .12, .72), cya = vec3(.1, .85, 1.);
      col = mix(vec3(.034, .008, .06), vec3(.012, .005, .03), smoothstep(0., .44, d));
      col += (mag * lx * .5 + cya * lz * .42) * fade * side * flare;
    }
    // the horizon: a thin neon line with a soft bloom
    float dh = abs(uv.y - hz);
    col += (vec3(1., .16, .62) * exp(-dh * 16.) * .1 + vec3(.5, .55, 1.) * exp(-dh * 140.) * .5) * (.5 + .5 * away);

    col *= .84 + .16 * smoothstep(1.3, .25, length(uv - .5) * 1.5);
    gl_FragColor = vec4(min(col, vec3(.7)), 1.);
  `,
};
