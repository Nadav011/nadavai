// SporChat's world: a stadium at night. Two floodlights sweep from beyond the top corners (they swing at each new
// chapter and flare with the scroll's speed), camera flashes go off in the stands, and the pitch's chalk lines run
// toward the visitor as they scroll: the page is the walk down the tunnel onto the pitch.
export default {
  base: '#05080D',
  accent: '#8CC2FF',
  frag: `
    vec2 uv = gl_FragCoord.xy / u_res;
    float asp = u_res.x / u_res.y;
    vec2 p = vec2((uv.x - .5) * asp, uv.y);
    vec3 col = mix(vec3(.010, .016, .028), vec3(.028, .045, .075), smoothstep(.25, .95, uv.y));
    float hz = .40;
    // the pitch: perspective stripes and chalk lines that come toward the visitor with the scroll
    if (uv.y < hz) {
      float d = hz - uv.y;
      float z = .11 / max(d, .002);
      float x = (uv.x - .5) * asp * z;
      float zz = z + u_scroll * 26. + u_time * .12;
      float stripe = step(.5, fract(zz * .22));
      vec3 grass = mix(vec3(.02, .07, .04), vec3(.03, .095, .052), stripe);
      float lw = .035 * z;
      float side = smoothstep(lw * 2., 0., abs(abs(x) - 5.5));
      float dz = min(fract(zz / 11.), 1. - fract(zz / 11.)) * 11.;
      float across = smoothstep(lw * 2.4, 0., dz) * step(abs(x), 5.5);
      float near = smoothstep(0., .1, d);
      col = grass * (.6 + .4 * near) + vec3(.7, .78, .86) * (side + across) * .5 * near;
      col = mix(col, vec3(.04, .06, .09), exp(-d * 18.) * .8); // haze on the horizon
    }
    // the stands: a band of crowd above the pitch, with camera flashes
    float band = smoothstep(hz, hz + .015, uv.y) * smoothstep(hz + .24, hz + .1, uv.y);
    vec2 g = vec2(p.x * 70., uv.y * 70.);
    vec2 id = floor(g);
    float h = hash(id);
    float flash = step(.992, hash(id + floor(u_time * 4.)));
    float dotv = smoothstep(.5, .0, length(fract(g) - .5)) * (h * .22 + flash * 2.2);
    col += vec3(.55, .66, .82) * dotv * band * .16;
    // floodlights beyond the top corners: they sway, swing at each chapter and flare with the speed
    float swing = sin(u_chap * 3.14159) * .18;
    for (int i = 0; i < 2; i++) {
      float s = i == 0 ? -1. : 1.;
      vec2 src = vec2(s * asp * .62, 1.32);
      float ang = s * (.55 + swing) + .1 * sin(u_time * .27 + s * 1.7) + u_vel * .35 * s;
      vec2 dir = normalize(vec2(-sin(ang), -cos(ang)));
      vec2 v = p - src;
      float c = dot(normalize(v), dir);
      // a narrow, soft beam: a shaft of light in the haze, never a blotch over the text
      float beam = smoothstep(.978, .998, c) / (1. + length(v) * 1.1);
      float haze = .45 + .55 * fbm(p * 2.4 + vec2(u_time * .04, -u_time * .06));
      col += vec3(.5, .68, 1.) * beam * haze * (.2 + abs(u_vel) * .45);
      col += vec3(.6, .78, 1.) * .09 / (1. + 45. * length(p - vec2(s * asp * .5, 1.02)));
    }
    // reading side (inline-start) stays dark, and a soft vignette
    float textSide = u_rtl > .5 ? uv.x : 1. - uv.x;
    col *= 1. - .38 * smoothstep(.42, .92, textSide);
    col *= .82 + .18 * smoothstep(1.3, .2, length(uv - .5) * 1.6);
    gl_FragColor = vec4(col, 1.);
  `,
};
