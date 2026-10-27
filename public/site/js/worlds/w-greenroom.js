// Green Room's world: a snooker hall at night. Green felt under one hanging lamp whose warm cone falls on the inline-end
// side; the lamp swings with the scroll (its speed, and the chapter in view), so the pool of light slides over the
// cloth; a few soft glowing balls roll across it as the page scrolls. Brand colour #E4C57E.
export default {
  base: '#050A07',
  accent: '#E4C57E',
  head: `
    float tri(float x) { return abs(fract(x) * 2. - 1.); }
    float segd(vec2 p, vec2 a, vec2 b) { vec2 pa = p - a, ba = b - a; return length(pa - ba * clamp(dot(pa, ba) / dot(ba, ba), 0., 1.)); }
  `,
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    float s = u_rtl > .5 ? -1. : 1.;
    vec2 q = vec2(s * (uv.x - .5) * asp, uv.y);          // q.x grows toward the inline-end margin
    float narrow = smoothstep(1.1, .6, asp);
    float hz = .44;                                       // the far cushion of the table
    // the lamp: a pendulum from beyond the top edge; it swings with the scroll's speed and with each chapter
    float ang = .03 * sin(u_time * .7) + .10 * sin(u_chap * 3.14159) + u_vel * .20;
    vec2 A = vec2(.27 * asp, 1.32);
    float L = .56;
    vec2 ax = vec2(sin(ang), -cos(ang));                  // along the cord, out of the shade
    vec2 B = A + ax * L;                                  // the shade's lower rim
    vec3 warm = vec3(1., .80, .50);
    vec3 col = mix(vec3(.010, .016, .011), vec3(.020, .030, .021), smoothstep(hz, 1., uv.y));
    // distant lamps over other tables: soft warm bokeh along the horizon
    float bgx = q.x * 4. + 3.7;
    float bh = hash(vec2(floor(bgx), 2.));
    float bd = length(vec2((fract(bgx) - .5) * .25, uv.y - (hz + .06 + .05 * hash(vec2(floor(bgx), 5.)))));
    col += warm * step(.5, bh) * smoothstep(.030, .0, bd) * .040;
    // the felt, in perspective
    float yt = .21;                                       // where the cone's axis meets the cloth
    float tt = (B.y - yt) / cos(ang);
    vec2 pc = vec2(B.x + sin(ang) * tt, yt);
    vec2 pr = vec2(.40, .125);
    float pool = exp(-dot((q - pc) / pr, (q - pc) / pr) * 1.7);
    float fe = smoothstep(hz + .0025, hz - .0025, uv.y);   // the cushion edge, antialiased
    if (fe > 0.) {
      float d = max(hz - uv.y, 0.);
      float cloth = .94 + .10 * fbm(vec2(uv.x * 3., d * 5.) + 4.1);   // a soft sheen on the cloth, never a texture
      vec3 felt = vec3(.016, .066, .036) * (1. - .35 * smoothstep(.1, .5, d / hz)) ;
      vec3 lit = vec3(.135, .32, .13) * pool;
      vec3 fcol = (felt + lit) * cloth;
      // the far cushion's lip catches the lamp
      float lip = smoothstep(.02, .0, d) * (.06 + .5 * exp(-pow((q.x - pc.x) / .55, 2.)) * smoothstep(.0, .5, 1. - abs(pc.y - yt) * 4.));
      fcol += vec3(.45, .34, .18) * lip * .5;
      fcol = mix(fcol, vec3(.014, .026, .018), exp(-d * 22.) * .55);
      col = mix(col, fcol, fe);
    }
    // the balls: they roll across the cloth with the scroll and drift with the clock
    for (int i = 0; i < 7; i++) {
      float fi = float(i);
      float h1 = hash(vec2(fi, 1.3)), h2 = hash(vec2(fi, 7.7)), h3 = hash(vec2(fi, 4.1));
      float tr = tri(u_scroll * (1.4 + 1.2 * h1) + u_time * .008 * (1. + h2) + h2 * 3.);
      float by = .075 + (hz - .13) * (.25 + .75 * h3) + .012 * sin(u_time * .3 + fi * 2.);
      float bx = mix(-.08 * asp, .50 * asp, tr);
      float r = .018 + (hz - by) * .085;
      vec2 l = (q - vec2(bx, by)) / r;
      float len = length(l);
      float lt = .30 + .70 * exp(-dot((vec2(bx, by) - pc) / pr, (vec2(bx, by) - pc) / pr) * 1.3);
      // contact shadow on the cloth
      vec2 sl = (q - vec2(bx + r * .45, by - r * .75)) / (r * vec2(1.35, .5));
      col *= 1. - .45 * exp(-dot(sl, sl) * 1.6) * step(uv.y, hz);
      vec3 bc = fi < 1. ? vec3(.92, .92, .86) : fi < 3. ? vec3(.80, .10, .08) : fi < 4. ? vec3(.92, .72, .12) : fi < 5. ? vec3(.10, .52, .24) : fi < 6. ? vec3(.12, .30, .78) : vec3(.90, .42, .55);
      vec3 n = vec3(l, sqrt(max(1. - dot(l, l), 0.)));
      vec3 Ld = normalize(vec3(-ang * 2. - .25, .75, .62));
      float dif = max(dot(n, Ld), 0.);
      float spec = pow(max(dot(reflect(-Ld, n), vec3(0., 0., 1.)), 0.), 26.);
      vec3 bcol = bc * (.22 + .95 * dif) * lt + warm * spec * .55 * lt;
      float disc = smoothstep(1., .94, len);
      col = mix(col, bcol, disc);
      col += bc * exp(-max(len - 1., 0.) * 1.8) * step(1., len) * .10 * lt;   // the soft glow around each ball
    }
    // the lamp: cord, shade, bulb glow, and the cone of light in the haze
    vec3 sh = vec3(0.);
    vec2 v = q - B;
    float dist = length(v);
    float c = dot(v / max(dist, .001), ax);
    float haze = .62 + .38 * fbm(q * 2.6 + vec2(u_time * .03, -u_time * .05));
    float cone = smoothstep(.76, .975, c) * (1. - smoothstep(.0, 1.0, dist)) / (1. + dist * 1.4);
    col += warm * cone * haze * .34 * (1. - .4 * narrow);
    // the shade (a dark enamel dome seen from the side) and its bright lower lip
    vec2 rp = v;
    rp = vec2(dot(rp, vec2(ax.y, -ax.x)), dot(rp, -ax));  // x across, y up the cord
    float hy = rp.y / .075;
    float hw = mix(.17, .06, clamp(hy, 0., 1.));
    float inShade = step(0., rp.y) * step(rp.y, .075) * smoothstep(hw, hw - .006, abs(rp.x));
    col = mix(col, vec3(.030, .026, .020) + warm * .05 * smoothstep(.3, -.4, rp.x * s), inShade);
    col += warm * smoothstep(.004, .0, abs(rp.y)) * smoothstep(.17, .1, abs(rp.x)) * .55;
    col += warm * .32 / (1. + 260. * dot(v + ax * .01, v + ax * .01));   // the bulb under the rim
    col += vec3(.7, .55, .3) * smoothstep(.0028, .0006, segd(q, A, B + ax * -.075)) * .22;
    // reading side (inline-start) stays dark; on a phone the whole width is the column
    float textSide = u_rtl > .5 ? uv.x : 1. - uv.x;
    col *= mix(1. - .65 * smoothstep(.36, .88, textSide), .62, narrow);
    col *= .80 + .20 * smoothstep(1.3, .2, length(uv - .5) * 1.6);
    gl_FragColor = vec4(col, 1.);
  `,
};
