// world.js: each page lives in a world of its own (Nadav, 2026-10-27, after igloo.inc and grail-app.com: "a dimension
// for every page, with scrolls like these"). One fixed canvas behind the page, one fragment shader per page
// (js/worlds/w-<name>.js), driven by the scroll: its progress, its speed and the chapter in view. The text stays DOM
// over calm parts of the world; the shaders keep the light low behind the reading column.
//
// A world module exports { frag, base, accent, uniforms?(state) }:
//   frag     GLSL ES 1.0 fragment body that writes gl_FragColor; it gets the uniforms below
//   base     the page colour under the world (also the static fallback and the colour before the first frame)
//   accent   the world's light, for the static fallback's glow
// Uniforms: u_res (px), u_time (s), u_scroll (0..1 of the page), u_vel (smoothed scroll speed, -1..1), u_chap
// (chapter in view: index + fraction), u_nchap, u_ptr (x, y in 0..1, strength 0..1), u_rtl (1 in RTL).
//
// Phones get a smaller buffer at DPR 1; software GL, no WebGL or reduced motion get one still frame or the static
// gradient; a hidden tab pauses; an idle page drops to 30 fps.

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const HEAD = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 u_res;uniform float u_time,u_scroll,u_vel,u_chap,u_nchap,u_rtl,u_cut;uniform vec3 u_ptr,u_acc;
float hash(vec2 p){vec3 q=fract(vec3(p.xyx)*.1031);q+=dot(q,q.yzx+33.33);return fract((q.x+q.y)*q.z);} // no sin(): it loses precision on some GPUs and shows blocks
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}
`;

export async function initWorld({ lenis, reduce } = {}) {
  const root = document.documentElement;
  const name = root.dataset.world;
  if (!name) return null;
  let W;
  try { W = (await import(`./w-${name}.js`)).default; } catch (e) { console.info('[world] no world', name, e); return null; }
  root.style.setProperty('--world-base', W.base);
  root.style.setProperty('--world-accent', W.accent);
  root.classList.add('has-world');

  const coarse = matchMedia('(pointer: coarse)').matches || Math.min(innerWidth, innerHeight) < 820;
  const canvas = document.createElement('canvas');
  canvas.className = 'world-cv'; canvas.setAttribute('aria-hidden', 'true');
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power', preserveDrawingBuffer: false });
  // software GL (no GPU) would make the page crawl: the static world instead
  const soft = (() => { try { const d = gl?.getExtension('WEBGL_debug_renderer_info'); return d && /swiftshader|llvmpipe|software|basic render/i.test(gl.getParameter(d.UNMASKED_RENDERER_WEBGL)); } catch { return false; } })();
  if (!gl || soft) { root.classList.add('world-static'); return null; }

  const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
  const prog = gl.createProgram();
  try {
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    // every world gets the crossing: when a new chapter arrives, a band of its light sweeps the screen (u_cut 0..1 while it runs)
    const CUT = 'if(u_cut>=0.&&u_cut<=1.){vec2 q_=gl_FragCoord.xy/u_res;float y_=u_cut*1.3-.15;float b_=exp(-(((q_.y-y_)*7.)*((q_.y-y_)*7.)))*(1.-u_cut);'
      + 'float g_=.6+.4*hash(floor(gl_FragCoord.xy*.5)+u_cut*90.);gl_FragColor.rgb+=u_acc*b_*.32*g_+vec3(b_*.04);gl_FragColor.rgb*=1.+.18*(1.-u_cut)*exp(-u_cut*6.);}';
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, HEAD + (W.head || '') + 'void main(){' + W.frag + CUT + '}'));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
  } catch (e) { console.info('[world] shader', name, e); root.classList.add('world-static'); return null; }
  gl.useProgram(prog);
  const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = {};
  for (const n of ['u_res', 'u_time', 'u_scroll', 'u_vel', 'u_chap', 'u_nchap', 'u_ptr', 'u_rtl', 'u_cut', 'u_acc', ...(W.extra || [])]) U[n] = gl.getUniformLocation(prog, n);
  const acc = (W.accent.match(/[0-9a-f]{2}/gi) || ['ff', 'ff', 'ff']).map((h) => parseInt(h, 16) / 255);
  document.body.prepend(canvas);

  // size: a smaller buffer on phones, DPR capped everywhere (the world is soft by nature)
  function size() {
    const dpr = coarse ? 1 : Math.min(devicePixelRatio || 1, 1.25), k = coarse ? 0.75 : 1;
    canvas.width = Math.round(innerWidth * dpr * k); canvas.height = Math.round(innerHeight * dpr * k);
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
  size();

  // chapters: the page's sections; u_chap is the one crossing the middle of the screen, with its fraction
  const chapters = [...document.querySelectorAll('main section, main > header, [data-chapter]')].filter((el, i, a) => !a.some((o) => o !== el && o.contains(el)));
  const st = { scroll: 0, vel: 0, chap: 0, px: 0.5, py: 0.5, pz: 0, last: 0, y: scrollY, ci: -1, cutT: -1e9, cutDir: 1 };
  function measure(now) {
    const max = Math.max(1, document.documentElement.scrollHeight - innerHeight);
    const y = lenis ? lenis.scroll : scrollY;
    const dy = y - st.y; st.y = y;
    st.vel += (Math.max(-1, Math.min(1, dy / 60)) - st.vel) * 0.12;
    st.scroll = Math.min(1, Math.max(0, y / max));
    let c = 0; const mid = innerHeight * 0.5;
    for (let i = 0; i < chapters.length; i++) {
      const r = chapters[i].getBoundingClientRect();
      if (r.top <= mid) c = i + Math.min(0.999, Math.max(0, (mid - r.top) / Math.max(1, r.height)));
    }
    st.chap = c;
    // a new chapter: the crossing starts, a band sweeping up the screen
    const ci = Math.floor(c);
    if (st.ci >= 0 && ci !== st.ci) { st.cutT = now; st.cutDir = ci > st.ci ? 1 : -1; }
    st.ci = ci;
    if (Math.abs(dy) > 0.5) st.last = now;
  }
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) addEventListener('pointermove', (e) => { st.px = e.clientX / innerWidth; st.py = 1 - e.clientY / innerHeight; st.last = performance.now(); }, { passive: true });

  const rtl = getComputedStyle(root).direction === 'rtl' ? 1 : 0;
  const t0 = performance.now();
  function draw(now) {
    measure(now);
    st.pz += ((fine && now - st.last < 3000 ? 1 : 0) - st.pz) * 0.05;
    gl.uniform2f(U.u_res, canvas.width, canvas.height);
    gl.uniform1f(U.u_time, reduce ? 0 : (now - t0) / 1000);
    gl.uniform1f(U.u_scroll, st.scroll); gl.uniform1f(U.u_vel, st.vel);
    gl.uniform1f(U.u_chap, st.chap); gl.uniform1f(U.u_nchap, Math.max(1, chapters.length));
    gl.uniform3f(U.u_ptr, st.px, st.py, st.pz); gl.uniform1f(U.u_rtl, rtl);
    const k = (now - st.cutT) / 900;
    gl.uniform1f(U.u_cut, reduce || k > 1 ? -1 : k); gl.uniform3f(U.u_acc, acc[0], acc[1], acc[2]);
    W.uniforms?.(gl, U, st);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  }

  let raf = 0, lastFrame = 0, alive = true;
  function loop(now) {
    if (!alive) return;
    raf = requestAnimationFrame(loop);
    if (document.hidden) return;
    const idle = now - st.last > 2500 && now - st.cutT > 1000;
    if (idle && now - lastFrame < 33) return; // 30 fps while nothing moves
    lastFrame = now; draw(now);
  }
  addEventListener('resize', () => { size(); if (reduce) draw(performance.now()); });
  canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); alive = false; root.classList.add('world-static'); canvas.remove(); });
  if (reduce) { draw(performance.now()); addEventListener('scroll', () => draw(performance.now()), { passive: true }); }
  else raf = requestAnimationFrame(loop);
  root.classList.add('world-on');
  return { name, canvas, dispose() { alive = false; cancelAnimationFrame(raf); canvas.remove(); root.classList.remove('world-on', 'has-world'); } };
}
