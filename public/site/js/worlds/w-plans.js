// The plans world: an ascent from dusk to dawn. The page starts on a dark ridge under a violet dusk with stars; as
// you scroll down you climb: the ridges sink away, the cloud decks fall past, altitude lines and an altimeter rail
// at the inline-end margin tick by, the stars fade and the sky warms to gold from a sun that rises at the margin.
// The reading column keeps its own dark sky; the glow lives at the inline-end side and the bottom edge.
export default {
  base: '#08071A',
  accent: '#F2B36F',
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    float ts = u_rtl > .5 ? uv.x : 1. - uv.x;           // 0 = inline-end (the world), 1 = start of the reading column
    float narrow = 1. - smoothstep(.65, 1.1, asp);
    vec2 p = vec2(ts * asp, uv.y);
    float px = 1. / u_res.y;
    float s = u_scroll;
    float k = smoothstep(0., 1., s);                     // dusk (0) to dawn (1)
    float alt = s * 3.2;                                 // screen heights climbed
    float tm = mix(.2, 1., 1. - smoothstep(.2, .7, ts)) * mix(1., .5, narrow);

    // sky: a dark zenith, a horizon glow that warms from plum to gold
    float t = 1. - uv.y;
    vec3 zen = mix(vec3(.013, .012, .042), vec3(.026, .052, .105), k);
    vec3 hor = mix(vec3(.36, .12, .26), vec3(1., .62, .24), smoothstep(.12, .85, k));
    float glow = pow(t, mix(2.5, 1.6, k)) * mix(.5, 1., k);
    vec3 col = zen + (hor * glow) * tm;

    // the sun, rising at the inline-end margin
    vec2 S = vec2(asp * .11, mix(-.5, .0, k));
    float sd = length((p - S) * vec2(.8, 1.));
    float sun = exp(-sd * 2.6) * .4 + exp(-sd * 9.) * .45 + (1. - smoothstep(.06, .1, sd)) * .75;
    col += vec3(1., .66, .30) * sun * k * k * mix(.1, 1., 1. - smoothstep(.1, .8, ts)) * mix(1., .4, narrow);

    // cloud decks: soft, stretched, falling past as you climb; underlit by the dawn
    float cl = 0.;
    for (int i = 0; i < 2; i++) {
      float fi = float(i);
      float sc = 1.5 + fi * 1.4;
      vec2 q = vec2(p.x * sc * .5 + u_time * (.006 + fi * .004) + fi * 7., (p.y + alt * (.55 + fi * .5)) * sc * 1.5 + fi * 3.);
      q = mat2(.94, -.34, .34, .94) * q;               // turned off-axis, so the streaks never show the noise lattice
      cl += smoothstep(.44, .8, fbm(q)) * (.4 - fi * .12);
    }
    vec3 cc = mix(vec3(.05, .05, .11), vec3(.95, .55, .26), clamp(t * (.35 + .8 * k) + .1 * k, 0., 1.));
    col += cc * cl * (.22 + .3 * k) * tm;

    // stars over the dusk, gone by dawn
    vec2 sg = vec2(p.x, p.y + alt * .12) * 38.;
    vec2 sid = floor(sg);
    float sh = hash(sid);
    vec2 sf = fract(sg) - .5 - (vec2(hash(sid + 3.1), hash(sid + 7.7)) - .5) * .6;
    float star = step(.962, sh) * (1. - smoothstep(.0, .13, length(sf))) * (.6 + .4 * sin(u_time * (.5 + sh * 2.) + sh * 40.));
    col += vec3(.72, .76, 1.) * star * (1. - k) * (1. - k) * smoothstep(.3, .85, uv.y) * .75 * mix(.35, 1., tm);

    // altitude lines: faint, dashed, a stronger one every fourth; they sink as you rise
    float sp = .125;
    float ly = (p.y + alt) / sp;
    float lf = abs(fract(ly + .5) - .5) * sp;
    float major = mod(floor(ly + .5), 4.) < .5 ? 1. : 0.;
    float lm = 1. - smoothstep(px * .4, px * 1.7, lf);
    float dash = mix(step(.3, fract(p.x * 14.)), 1., major);
    float la = (.05 + .09 * major) * (1. - smoothstep(.05, .8, ts)) * mix(1., .6, narrow);
    vec3 gold = vec3(1., .74, .38);
    col += gold * lm * dash * la * (.55 + .6 * k);

    // the altimeter rail at the margin, with a fixed marker at mid-height
    float rx = mix(.03, .008, narrow);
    float tk = (p.y + alt) / (sp * .25);
    float tf = abs(fract(tk + .5) - .5) * sp * .25;
    float tmaj = mod(floor(tk + .5), 4.) < .5 ? 1. : 0.;
    float tlen = mix(.011, .028, tmaj) * mix(1., .55, narrow);
    float tick = (1. - smoothstep(px * .4, px * 1.5, tf)) * step(rx, p.x) * step(p.x, rx + tlen);
    float rail = 1. - smoothstep(px * .4, px * 1.3, abs(p.x - rx));
    float mark = (1. - smoothstep(px * .5, px * 1.8, abs(p.y - .5))) * step(p.x, rx + .05 * (1. - .5 * narrow)) * step(rx - .02, p.x);
    col += gold * (tick * .34 + rail * .12) * mix(.8, 1., k);
    col += vec3(1., .82, .5) * mark * .55;

    // the ridges you leave behind: two dark silhouettes that sink away over the first third of the climb
    float r1 = .17 + .08 * fbm(vec2(p.x * 1.7 + 3., .5)) - s * 1.9;
    float r2 = .27 + .07 * fbm(vec2(p.x * 1.2 + 9., 1.5)) - s * 1.3;
    float m2 = 1. - smoothstep(r2 - px * 1.5, r2 + px * 1.5, p.y);
    float m1 = 1. - smoothstep(r1 - px * 1.5, r1 + px * 1.5, p.y);
    // the last of the sunset, just above the far ridge (dusk only, inline-end side)
    col += vec3(.95, .38, .24) * exp(-max(p.y - r2, 0.) * 11.) * (1. - m2) * (1. - k) * (1. - k) * .26 * (1. - smoothstep(.15, .75, ts));
    col = mix(col, vec3(.050, .028, .085) + hor * .06 * (1. - k), m2 * .94);
    col = mix(col, vec3(.014, .010, .026), m1);

    col *= .84 + .16 * (1. - smoothstep(.3, 1.4, length(uv - .5) * 1.5));
    col += (hash(gl_FragCoord.xy) - .5) / 220.;          // a whisper of dither: no banding in the slow gradients
    gl_FragColor = vec4(col, 1.);
  `,
};
