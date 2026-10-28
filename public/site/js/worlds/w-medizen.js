// Medizen's world: a clinical, calm field of teal cells (voronoi) seen through a microscope. Two layers drift at
// different depths as the scroll descends through the tissue; a slow resting heartbeat (lub-dub) breathes through the
// membranes and sends one soft ring outward from the inline-end margin on every beat. Brand colour #6BD6A6.
export default {
  base: '#040E0D',
  accent: '#6BD6A6',
  head: `
    vec2 vp2(vec2 c, float t) {            // a cell's wandering point inside its lattice square
      vec2 o = vec2(hash(c), hash(c + vec2(31., 17.)));
      return .5 + .42 * sin(t + 6.2831 * o);
    }
    // exact distance to the nearest cell wall (cell units), the distance to the nearest point, and that cell's hash
    vec3 vor(vec2 x, float t) {
      vec2 n = floor(x), f = fract(x);
      vec2 mg = vec2(0.), mr = vec2(0.);
      float md = 9.;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 g = vec2(float(i), float(j));
          vec2 r = g + vp2(n + g, t) - f;
          float d = dot(r, r);
          if (d < md) { md = d; mr = r; mg = g; }
        }
      }
      float wall = 9.;
      for (int j = -1; j <= 1; j++) {
        for (int i = -1; i <= 1; i++) {
          vec2 g = mg + vec2(float(i), float(j));
          vec2 r = g + vp2(n + g, t) - f;
          if (dot(mr - r, mr - r) > .00001) wall = min(wall, dot(.5 * (mr + r), normalize(r - mr)));
        }
      }
      return vec3(wall, sqrt(md), hash(n + mg + 5.3));
    }
  `,
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    float s = u_rtl > .5 ? -1. : 1.;
    vec2 q = vec2(s * (uv.x - .5) * asp, uv.y - .5);    // q.x grows toward the inline-end margin
    float narrow = smoothstep(1.1, .6, asp);
    // a resting heartbeat, about 43 per minute: a strong beat, then a softer one
    float bt = fract(u_time / 1.4);
    float pulse = exp(-(((bt - .06) / .06)*((bt - .06) / .06))) + .55 * exp(-(((bt - .27) / .07)*((bt - .27) / .07)));
    vec2 org = vec2(.46 * asp, .08);
    float ring = exp(-(((length(q - org) - bt * 1.7) / .17)*((length(q - org) - bt * 1.7) / .17))) * smoothstep(1., .25, bt);
    vec3 teal = vec3(.42, .84, .65);
    vec3 col = mix(vec3(.010, .030, .029), vec3(.016, .050, .046), uv.y);
    col += teal * .030 / (1. + 5. * length(q - org));
    float breathe = 1. + .006 * pulse;
    // far layer: small cells, slow, dim
    vec3 vf = vor(q * 9. * breathe + vec2(u_time * .020, u_scroll * 9. + 3.1), u_time * .18);
    float wf = smoothstep(.030, .004, vf.x);
    col += teal * (wf * (.060 + .075 * ring + .02 * pulse) + exp(-vf.x * 9.) * .012 + (.006 + .014 * vf.z) * smoothstep(.55, .0, vf.y));
    // near layer: bigger cells, each with a soft nucleus, more parallax
    vec3 vn = vor(q * 4.2 * breathe + vec2(-u_time * .016, u_scroll * 16. - 2.4), u_time * .14 + 7.);
    float wn = smoothstep(.032, .006, vn.x);
    float inner = exp(-vn.x * 6.) * (.030 + .035 * ring + .012 * pulse);   // the membrane's soft inner glow
    float nuc = exp(-vn.y * vn.y * 50.) * (.050 + .055 * vn.z) * (1. + .5 * pulse);
    float fillc = (.010 + .022 * vn.z) * smoothstep(0., .22, vn.x);        // zero at the wall, so cells never step
    col += teal * (wn * (.11 + .15 * ring + .04 * pulse) + inner + nuc + fillc);
    // a faint wash that follows each beat
    col *= 1. + .10 * pulse * smoothstep(1.4, .0, length(q - org));
    // reading side (inline-start) stays dark; on a phone the whole width is the column
    float textSide = u_rtl > .5 ? uv.x : 1. - uv.x;
    col *= mix(1. - .72 * smoothstep(.32, .86, textSide), .72, narrow);
    col *= .78 + .22 * smoothstep(1.3, .2, length(uv - .5) * 1.5);
    gl_FragColor = vec4(col, 1.);
  `,
};
