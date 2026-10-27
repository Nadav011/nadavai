// The services world: a blueprint circuit board. Copper traces run on a right-angle grid over a faint blueprint
// sheet; the board scrolls slowly under the page, and one "service in view" node (a target reticle that wanders
// down the inline-end margin with the chapter) pulls the light: traces near it burn amber, far ones stay dim
// copper, and every pulse on the board runs toward it. The scroll drives the pulses, so reading down the page is
// routing power through the board.
export default {
  base: '#050810',
  accent: '#E8913C',
  head: `
    float eE(vec2 c){ return step(.5, hash(c + vec2(3.1, 7.7))); }   // is there a trace from cell c to its east neighbour
    float eN(vec2 c){ return step(.5, hash(c + vec2(11.3, 1.9))); }  // ... to its north neighbour
    float segd(vec2 f, vec2 dir){ float t = clamp(dot(f, dir), 0., .5); return length(f - dir * t); }
  `,
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    float ts = u_rtl > .5 ? uv.x : 1. - uv.x;           // 0 = inline-end (the world), 1 = start of the reading column
    float narrow = 1. - smoothstep(.65, 1.1, asp);
    vec2 p = vec2(ts * asp, uv.y);

    float cs = mix(.075, .092, narrow);                  // cell size, in screen heights
    float shift = u_scroll * 1.9;                        // the board slides up under the page
    vec2 F = vec2(asp * (.15 + .05 * sin(u_chap * .9 + 1.)), .5 + .2 * sin(u_chap * 1.25 + .6)); // the service in view
    vec2 g = vec2(p.x, p.y - shift) / cs;
    vec2 Fg = vec2(F.x, F.y - shift) / cs;
    vec2 id = floor(g);
    vec2 f = fract(g) - .5;
    float px = 1. / (cs * u_res.y);                      // one pixel, in cell units

    // how close this part of the board is to the service in view (Manhattan: a diamond of light, like routing)
    vec2 gc = id + .5;
    float lit = exp(-(abs(gc.x - Fg.x) + abs(gc.y - Fg.y)) * .15);

    float dt = u_scroll * 22. + u_time * .35;
    float d = 9., pl = 0., cnt = 0.;
    for (int i = 0; i < 4; i++) {
      vec2 dir = i == 0 ? vec2(1., 0.) : (i == 1 ? vec2(-1., 0.) : (i == 2 ? vec2(0., 1.) : vec2(0., -1.)));
      bool pos = (i == 0 || i == 2);
      bool hor = i < 2;
      vec2 o = pos ? id : id + dir;                      // the cell the edge starts from (east / north neighbour link)
      float ex = hor ? eE(o) : eN(o);
      if (ex > .5) {
        cnt += 1.;
        d = min(d, segd(f, dir));
        float t = pos ? dot(f, dir) : 1. - dot(f, dir);  // 0..1 along the whole edge, from its first node
        float oa = hor ? o.x : o.y;
        float fa = hor ? Fg.x : Fg.y;
        if (fa < oa + 1.) t = 1. - t;                    // every pulse runs toward the service in view
        float eh = hash(o + (hor ? vec2(5.5, 2.2) : vec2(1.7, 9.1)));
        float q = mod(eh * 5. + dt - t, 5.);
        float live = step(.42, hash(o + vec2(8.3, 4.1)));
        pl = max(pl, live * exp(-q * 3.6) * (1. - smoothstep(4.9, 5., q)));
      }
    }
    float hw = max(.013, px * 1.0);
    float line = 1. - smoothstep(hw - px * .7, hw + px * .7, d);
    float dn = length(f);
    float hn = hash(id + vec2(2.9, 6.3));
    float pad = 0.;
    if (cnt > 2.5) pad = 1. - smoothstep(.075 - px, .075 + px, dn);                         // junction: solid via
    else if (cnt < 1.5 && (cnt > .5 || hn > .95)) pad = 1. - smoothstep(.02 - px, .02 + px, abs(dn - .105)); // endpoint: ring pad
    if (cnt < .5) pad *= .6;

    // blueprint sheet: fine grid on the cell edges, a plus at every fourth corner
    vec2 ed = .5 - abs(f);
    float grid = 1. - smoothstep(0., px * 1.4, min(ed.x, ed.y));
    vec2 cr = abs(f) - .5;
    float plus = (1. - smoothstep(0., px * 1.2, abs(cr.x))) * step(abs(cr.y), .09) + (1. - smoothstep(0., px * 1.2, abs(cr.y))) * step(abs(cr.x), .09);
    float quad = mod(id.x, 4.) < 1. && mod(id.y, 4.) < 1. ? 1. : 0.;

    vec3 copper = vec3(.64, .34, .18);
    vec3 amber = vec3(1., .66, .25);
    vec3 tc = mix(copper * .42, amber, clamp(lit * 1.7, 0., 1.));
    vec3 trace = tc * (line + pad) * (.30 + .66 * lit);
    vec3 pulse = vec3(1., .9, .66) * pl * (line * 1.1 + .35 * exp(-d * 20.)) * (.08 + 1.05 * lit);

    // the reticle on the service in view
    float S = cs * (1.05 + .05 * sin(u_time * .9));
    vec2 a = abs(p - F);
    float lw = 1.1 / u_res.y;
    float br = (1. - smoothstep(0., lw * 1.4, abs(a.x - S))) * step(a.y, S + lw) * step(S * .45, a.y)
             + (1. - smoothstep(0., lw * 1.4, abs(a.y - S))) * step(a.x, S + lw) * step(S * .45, a.x);
    vec3 ret = amber * br * .7 + amber * .10 * exp(-length(p - F) * 11.);

    float tm = mix(.2, 1., 1. - smoothstep(.2, .6, ts)) * mix(1., .55, narrow);
    vec3 col = vec3(.016, .024, .040) + vec3(.012, .03, .06) * exp(-length(p - F) * 2.2);
    col += vec3(.20, .36, .62) * (grid * .05 + plus * quad * .16) * tm;
    // the first chapter holds the skill tree over the board: the traces step back there so its labels read clearly
    float calm = mix(.38, 1., smoothstep(.75, 1.25, u_chap));
    col += (trace * calm + pulse * calm + ret) * tm;
    col *= .84 + .16 * (1. - smoothstep(.3, 1.4, length(uv - .5) * 1.5));
    gl_FragColor = vec4(col, 1.);
  `,
};
