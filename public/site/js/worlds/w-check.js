// The check world: a radar scope over a field of dots. The scope sits at the inline-end side, the sweep arm turns
// with time and leaves a fading wedge, and every dot it crosses flashes. The field is a map of the business: at the
// top of the page almost nothing is found, and as you scroll down more dots are claimed (they turn amber and stay
// lit, pinging again on each pass). The field also drifts up slowly with the scroll, under the scope.
export default {
  base: '#04090B',
  accent: '#4FD1D9',
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    float ts = u_rtl > .5 ? uv.x : 1. - uv.x;           // 0 = inline-end (the world), 1 = start of the reading column
    float narrow = 1. - smoothstep(.65, 1.1, asp);
    vec2 p = vec2(ts * asp, uv.y);
    float px = 1. / u_res.y;
    float s = u_scroll;
    float tm = mix(.22, 1., 1. - smoothstep(.2, .66, ts)) * mix(1., .5, narrow);

    vec2 C = vec2(asp * mix(.24, .42, narrow), mix(.52, .6, narrow));   // the scope
    vec2 rp = p - C;
    float r = length(rp);
    float theta = u_time * .62;                          // the sweep arm turns with time (a still frame when motion is reduced)
    float TAU = 6.2831853;
    float radFade = 1. - smoothstep(.25, 1.2, r);

    // the dot field, drifting up under the scope as the page scrolls
    float ds = mix(.036, .042, narrow);
    float shift = s * 1.1;
    vec2 pg = vec2(p.x, p.y - shift) / ds;
    vec2 id = floor(pg);
    vec2 f = fract(pg) - .5;
    vec2 cp = (id + .5) * ds + vec2(0., shift);
    vec2 rel = cp - C;
    float rr = length(rel);
    float behind = mod(theta - atan(rel.y, rel.x), TAU); // 0 at the arm, growing behind it
    float trail = exp(-behind * 1.1);

    float h = hash(id + 3.7);
    float prog = .06 + .9 * s;                           // how much of the map has been found
    float found = 1. - smoothstep(prog - .05, prog, h * .78 + rr * .2);
    float pxd = 1. / (ds * u_res.y);
    float dd = length(f);
    float b = mix(.14 + trail * .55, .34 + trail * 1.15, found);
    float rad = .11 + .12 * b;
    float dotm = 1. - smoothstep(rad - pxd, rad + pxd, dd);
    float fade = exp(-rr * .85) * .9 + .1;
    vec3 teal = vec3(.30, .80, .86);
    vec3 amber = vec3(1., .70, .30);
    vec3 dc = mix(teal, amber, found * .9);
    vec3 dots = dc * (dotm * b + found * trail * .28 * exp(-dd * 5.5)) * fade;
    // a small ping ring around a found dot, just after the arm passes
    float ring = (1. - smoothstep(0., .08, abs(dd - behind * .11))) * exp(-behind * 1.5) * step(behind, 3.) * step(dd, .46);
    dots += amber * ring * found * .5 * fade;

    // the scope: range rings, axes, the sweep wedge and the arm
    float rl = abs(fract(r / .2 + .5) - .5) * .2;
    float rings = (1. - smoothstep(px * .5, px * 1.5, rl)) * (.07 + .1 * step(abs(r - .8), px * 2.));
    float axes = (1. - smoothstep(px * .4, px * 1.3, min(abs(rp.x), abs(rp.y)))) * .06;
    float bh = mod(theta - atan(rp.y, rp.x), TAU);
    float armw = px * 1.4 / max(r, .03);
    float dm = min(bh, TAU - bh);
    float arm = (1. - smoothstep(armw * .3, armw * 1.4, dm));
    float wedge = exp(-bh * 1.5);
    vec3 scope = teal * ((rings + axes) * radFade * .9 + wedge * .1 * radFade + arm * .42 * radFade);
    scope += teal * .5 * (1. - smoothstep(.0, .008, r));

    vec3 col = vec3(.012, .026, .030) + vec3(.012, .04, .046) * exp(-r * 1.9);
    col += (scope + dots) * tm;
    col *= .85 + .15 * (1. - smoothstep(.3, 1.4, length(uv - .5) * 1.5));
    col += (hash(gl_FragCoord.xy) - .5) / 230.;
    gl_FragColor = vec4(col, 1.);
  `,
};
