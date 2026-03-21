// @ts-nocheck
"use client";

function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { useEffect, useRef } from "react";
const VERT = stryMutAct_9fa48("3223") ? `` : (stryCov_9fa48("3223"), `#version 300 es
void main() {
  float x = float((gl_VertexID << 1) & 2);
  float y = float(gl_VertexID & 2);
  gl_Position = vec4(x * 2.0 - 1.0, y * 2.0 - 1.0, 0.0, 1.0);
}`);
const FRAG = stryMutAct_9fa48("3224") ? `` : (stryCov_9fa48("3224"), `#version 300 es
precision highp float;
uniform float u_time;
uniform vec2 u_resolution;
uniform vec2 u_mouse;
out vec4 fragColor;

// Simplex noise
vec3 mod289(vec3 x) { return x - floor(x / 289.0) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x / 289.0) * 289.0; }
vec3 permute(vec3 x) { return mod289((x * 34.0 + 10.0) * x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                      -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy),
                           dot(x12.zw, x12.zw)), 0.0);
  m = m * m; m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

float fbm(vec2 p, int octaves) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 7; i++) {
    if (i >= octaves) break;
    v += a * snoise(p);
    p = r * p * 2.0;
    a *= 0.5;
  }
  return v;
}

// Energy vein function - creates sharp flowing lines
float vein(vec2 uv, float t) {
  float n = fbm(uv * 3.0 + vec2(t * 0.3, -t * 0.15), 5);
  return pow(abs(sin(n * 3.14159 * 3.0)), 8.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 uvA = vec2(uv.x * aspect, uv.y);
  
  // Mouse influence - creates a reactive glow area
  vec2 mDiff = uv - u_mouse;
  float mDist = length(mDiff);
  float mInfluence = smoothstep(0.5, 0.0, mDist);
  
  // Subtle UV warp near mouse
  uv += mDiff * mInfluence * 0.02;
  
  float t = u_time * 0.035;
  
  // === Layer 1: Deep organic flow (base) ===
  vec2 w1 = uv + 0.3 * vec2(
    fbm(uv * 1.5 + vec2(t, 0.0), 5),
    fbm(uv * 1.5 + vec2(0.0, t * 0.7), 5)
  );
  float base = fbm(w1 * 2.0 + t * 0.15, 6);
  
  // === Layer 2: Fine detail noise ===
  float detail = fbm(uvA * 5.0 + vec2(t * 0.2, -t * 0.1) + base * 0.3, 5);
  
  // === Layer 3: Energy veins ===
  float v1 = vein(uvA + vec2(t * 0.1, 0.0), t);
  float v2 = vein(uvA * 1.3 + vec2(0.0, t * 0.15), t * 0.8);
  float veins = max(v1, v2 * 0.7);
  
  // === Layer 4: Aurora waves ===
  float wave1 = sin(uv.x * 4.0 + t * 0.5 + base * 2.0) * 0.5 + 0.5;
  float wave2 = sin(uv.x * 6.0 - t * 0.3 + detail * 3.0) * 0.5 + 0.5;
  float aurora = smoothstep(0.4, 0.6, uv.y + wave1 * 0.15 - 0.1) * 
                 smoothstep(0.8, 0.5, uv.y + wave2 * 0.1);
  aurora *= 0.4;
  
  // === Color palette: cyan ecosystem ===
  vec3 deepBlack  = vec3(0.020, 0.025, 0.050);
  vec3 deepNavy   = vec3(0.030, 0.040, 0.075);
  vec3 darkTeal   = vec3(0.010, 0.14, 0.18);
  vec3 midCyan    = vec3(0.020, 0.45, 0.50);
  vec3 brightCyan = vec3(0.024, 0.839, 0.878);
  vec3 whiteCyan  = vec3(0.6, 0.95, 1.0);
  
  // === Build final color ===
  vec3 c = deepBlack;
  
  // Base organic clouds
  c = mix(c, deepNavy, smoothstep(-0.5, 0.4, base) * 0.9);
  c = mix(c, darkTeal, smoothstep(-0.1, 0.5, base + detail * 0.3) * 0.7);
  
  // Mid-tone flowing wisps
  float wisps = smoothstep(0.15, 0.6, base * 0.6 + detail * 0.4);
  c = mix(c, midCyan, wisps * 0.25);
  
  // Energy veins - subtle flowing lines
  c += brightCyan * veins * 0.10;
  
  // Aurora bands - softer
  c = mix(c, darkTeal * 1.4, aurora * smoothstep(-0.2, 0.3, base) * 0.8);
  
  // Bright peaks where noise aligns
  float peak = smoothstep(0.45, 0.85, base * detail + veins * 0.4);
  c += brightCyan * peak * 0.07;
  
  // Rare ultra-bright sparks
  float spark = smoothstep(0.7, 0.95, base * detail * 1.5);
  c += whiteCyan * spark * 0.04;
  
  // Gentle breathing
  float breathe = 0.92 + 0.08 * sin(u_time * 0.3);
  
  // Mouse reactive glow - elegant
  c += brightCyan * mInfluence * 0.06;
  c += whiteCyan * smoothstep(0.15, 0.0, mDist) * 0.02;
  
  // Screen blend for luminosity
  c = 1.0 - (1.0 - c) * (1.0 - brightCyan * smoothstep(0.3, 0.85, base + detail * 0.4) * 0.04);
  
  // Soft vignette
  float vig = 1.0 - smoothstep(0.5, 1.6, length((uv - 0.5) * 1.5));
  c *= vig;
  
  // Edge fade
  c *= smoothstep(0.0, 0.2, uv.y * 0.5 + 0.1);
  
  // Overall intensity - elegant, not overwhelming
  c *= 0.35 * breathe;
  
  fragColor = vec4(c, 1.0);
}`);
function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  if (stryMutAct_9fa48("3225")) {
    {}
  } else {
    stryCov_9fa48("3225");
    const s = gl.createShader(type);
    if (stryMutAct_9fa48("3228") ? false : stryMutAct_9fa48("3227") ? true : stryMutAct_9fa48("3226") ? s : (stryCov_9fa48("3226", "3227", "3228"), !s)) return null;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (stryMutAct_9fa48("3231") ? false : stryMutAct_9fa48("3230") ? true : stryMutAct_9fa48("3229") ? gl.getShaderParameter(s, gl.COMPILE_STATUS) : (stryCov_9fa48("3229", "3230", "3231"), !gl.getShaderParameter(s, gl.COMPILE_STATUS))) {
      if (stryMutAct_9fa48("3232")) {
        {}
      } else {
        stryCov_9fa48("3232");
        gl.deleteShader(s);
        return null;
      }
    }
    return s;
  }
}
function linkProgram(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  if (stryMutAct_9fa48("3233")) {
    {}
  } else {
    stryCov_9fa48("3233");
    const p = gl.createProgram();
    if (stryMutAct_9fa48("3236") ? false : stryMutAct_9fa48("3235") ? true : stryMutAct_9fa48("3234") ? p : (stryCov_9fa48("3234", "3235", "3236"), !p)) return null;
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (stryMutAct_9fa48("3239") ? false : stryMutAct_9fa48("3238") ? true : stryMutAct_9fa48("3237") ? gl.getProgramParameter(p, gl.LINK_STATUS) : (stryCov_9fa48("3237", "3238", "3239"), !gl.getProgramParameter(p, gl.LINK_STATUS))) {
      if (stryMutAct_9fa48("3240")) {
        {}
      } else {
        stryCov_9fa48("3240");
        gl.deleteProgram(p);
        return null;
      }
    }
    return p;
  }
}
function applyFallback(el: HTMLDivElement, canvas?: HTMLCanvasElement) {
  if (stryMutAct_9fa48("3241")) {
    {}
  } else {
    stryCov_9fa48("3241");
    if (stryMutAct_9fa48("3244") ? canvas?.parentNode !== el : stryMutAct_9fa48("3243") ? false : stryMutAct_9fa48("3242") ? true : (stryCov_9fa48("3242", "3243", "3244"), (stryMutAct_9fa48("3245") ? canvas.parentNode : (stryCov_9fa48("3245"), canvas?.parentNode)) === el)) el.removeChild(canvas);
    el.classList.add(stryMutAct_9fa48("3246") ? "" : (stryCov_9fa48("3246"), "shader-fallback"));
    return () => {
      if (stryMutAct_9fa48("3247")) {
        {}
      } else {
        stryCov_9fa48("3247");
        el.classList.remove(stryMutAct_9fa48("3248") ? "" : (stryCov_9fa48("3248"), "shader-fallback"));
      }
    };
  }
}
export function ShaderBackground() {
  if (stryMutAct_9fa48("3249")) {
    {}
  } else {
    stryCov_9fa48("3249");
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("3250")) {
        {}
      } else {
        stryCov_9fa48("3250");
        const el = ref.current;
        if (stryMutAct_9fa48("3253") ? false : stryMutAct_9fa48("3252") ? true : stryMutAct_9fa48("3251") ? el : (stryCov_9fa48("3251", "3252", "3253"), !el)) return;

        // CSS fallback only on very small/old devices
        const mobile = window.matchMedia(stryMutAct_9fa48("3254") ? "" : (stryCov_9fa48("3254"), "(max-width: 768px)")).matches;
        if (stryMutAct_9fa48("3257") ? mobile || !window.WebGL2RenderingContext : stryMutAct_9fa48("3256") ? false : stryMutAct_9fa48("3255") ? true : (stryCov_9fa48("3255", "3256", "3257"), mobile && (stryMutAct_9fa48("3258") ? window.WebGL2RenderingContext : (stryCov_9fa48("3258"), !window.WebGL2RenderingContext)))) return applyFallback(el);
        const canvas = document.createElement(stryMutAct_9fa48("3259") ? "" : (stryCov_9fa48("3259"), "canvas"));
        canvas.style.cssText = stryMutAct_9fa48("3260") ? "" : (stryCov_9fa48("3260"), "width:100%;height:100%");
        el.appendChild(canvas);
        const ctx = canvas.getContext(stryMutAct_9fa48("3261") ? "" : (stryCov_9fa48("3261"), "webgl2"), stryMutAct_9fa48("3262") ? {} : (stryCov_9fa48("3262"), {
          antialias: stryMutAct_9fa48("3263") ? true : (stryCov_9fa48("3263"), false),
          alpha: stryMutAct_9fa48("3264") ? true : (stryCov_9fa48("3264"), false)
        }));
        if (stryMutAct_9fa48("3267") ? false : stryMutAct_9fa48("3266") ? true : stryMutAct_9fa48("3265") ? ctx : (stryCov_9fa48("3265", "3266", "3267"), !ctx)) return applyFallback(el, canvas);
        const gl = ctx;
        const vs = compileShader(gl, gl.VERTEX_SHADER, VERT);
        const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG);
        if (stryMutAct_9fa48("3270") ? !vs && !fs : stryMutAct_9fa48("3269") ? false : stryMutAct_9fa48("3268") ? true : (stryCov_9fa48("3268", "3269", "3270"), (stryMutAct_9fa48("3271") ? vs : (stryCov_9fa48("3271"), !vs)) || (stryMutAct_9fa48("3272") ? fs : (stryCov_9fa48("3272"), !fs)))) {
          if (stryMutAct_9fa48("3273")) {
            {}
          } else {
            stryCov_9fa48("3273");
            if (stryMutAct_9fa48("3275") ? false : stryMutAct_9fa48("3274") ? true : (stryCov_9fa48("3274", "3275"), vs)) gl.deleteShader(vs);
            if (stryMutAct_9fa48("3277") ? false : stryMutAct_9fa48("3276") ? true : (stryCov_9fa48("3276", "3277"), fs)) gl.deleteShader(fs);
            stryMutAct_9fa48("3278") ? gl.getExtension("WEBGL_lose_context").loseContext() : (stryCov_9fa48("3278"), gl.getExtension(stryMutAct_9fa48("3279") ? "" : (stryCov_9fa48("3279"), "WEBGL_lose_context"))?.loseContext());
            return applyFallback(el, canvas);
          }
        }
        const prog = linkProgram(gl, vs, fs);
        if (stryMutAct_9fa48("3282") ? false : stryMutAct_9fa48("3281") ? true : stryMutAct_9fa48("3280") ? prog : (stryCov_9fa48("3280", "3281", "3282"), !prog)) {
          if (stryMutAct_9fa48("3283")) {
            {}
          } else {
            stryCov_9fa48("3283");
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            stryMutAct_9fa48("3284") ? gl.getExtension("WEBGL_lose_context").loseContext() : (stryCov_9fa48("3284"), gl.getExtension(stryMutAct_9fa48("3285") ? "" : (stryCov_9fa48("3285"), "WEBGL_lose_context"))?.loseContext());
            return applyFallback(el, canvas);
          }
        }
        gl.useProgram(prog);
        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);
        const uTime = gl.getUniformLocation(prog, stryMutAct_9fa48("3286") ? "" : (stryCov_9fa48("3286"), "u_time"));
        const uRes = gl.getUniformLocation(prog, stryMutAct_9fa48("3287") ? "" : (stryCov_9fa48("3287"), "u_resolution"));
        const uMouse = gl.getUniformLocation(prog, stryMutAct_9fa48("3288") ? "" : (stryCov_9fa48("3288"), "u_mouse"));
        let rafId = 0,
          time = 0;
        let mx = 0.5,
          my = 0.5,
          tx = 0.5,
          ty = 0.5;
        function resize() {
          if (stryMutAct_9fa48("3289")) {
            {}
          } else {
            stryCov_9fa48("3289");
            const dpr = stryMutAct_9fa48("3290") ? Math.max(window.devicePixelRatio, mobile ? 1 : 1.5) : (stryCov_9fa48("3290"), Math.min(window.devicePixelRatio, mobile ? 1 : 1.5));
            canvas.width = stryMutAct_9fa48("3291") ? window.innerWidth / dpr : (stryCov_9fa48("3291"), window.innerWidth * dpr);
            canvas.height = stryMutAct_9fa48("3292") ? window.innerHeight / dpr : (stryCov_9fa48("3292"), window.innerHeight * dpr);
            gl.viewport(0, 0, canvas.width, canvas.height);
          }
        }
        resize();
        window.addEventListener(stryMutAct_9fa48("3293") ? "" : (stryCov_9fa48("3293"), "resize"), resize);
        function onPointer(e: PointerEvent) {
          if (stryMutAct_9fa48("3294")) {
            {}
          } else {
            stryCov_9fa48("3294");
            tx = stryMutAct_9fa48("3295") ? e.clientX * window.innerWidth : (stryCov_9fa48("3295"), e.clientX / window.innerWidth);
            ty = stryMutAct_9fa48("3296") ? 1.0 + e.clientY / window.innerHeight : (stryCov_9fa48("3296"), 1.0 - (stryMutAct_9fa48("3297") ? e.clientY * window.innerHeight : (stryCov_9fa48("3297"), e.clientY / window.innerHeight)));
          }
        }
        window.addEventListener(stryMutAct_9fa48("3298") ? "" : (stryCov_9fa48("3298"), "pointermove"), onPointer);
        function frame() {
          if (stryMutAct_9fa48("3299")) {
            {}
          } else {
            stryCov_9fa48("3299");
            if (stryMutAct_9fa48("3302") ? false : stryMutAct_9fa48("3301") ? true : stryMutAct_9fa48("3300") ? document.hidden : (stryCov_9fa48("3300", "3301", "3302"), !document.hidden)) {
              if (stryMutAct_9fa48("3303")) {
                {}
              } else {
                stryCov_9fa48("3303");
                stryMutAct_9fa48("3304") ? time -= 0.016 : (stryCov_9fa48("3304"), time += 0.016);
                stryMutAct_9fa48("3305") ? mx -= (tx - mx) * 0.02 : (stryCov_9fa48("3305"), mx += stryMutAct_9fa48("3306") ? (tx - mx) / 0.02 : (stryCov_9fa48("3306"), (stryMutAct_9fa48("3307") ? tx + mx : (stryCov_9fa48("3307"), tx - mx)) * 0.02));
                stryMutAct_9fa48("3308") ? my -= (ty - my) * 0.02 : (stryCov_9fa48("3308"), my += stryMutAct_9fa48("3309") ? (ty - my) / 0.02 : (stryCov_9fa48("3309"), (stryMutAct_9fa48("3310") ? ty + my : (stryCov_9fa48("3310"), ty - my)) * 0.02));
                gl.uniform1f(uTime, time);
                gl.uniform2f(uRes, canvas.width, canvas.height);
                gl.uniform2f(uMouse, mx, my);
                gl.drawArrays(gl.TRIANGLES, 0, 3);
              }
            }
            rafId = requestAnimationFrame(frame);
          }
        }
        rafId = requestAnimationFrame(frame);
        return () => {
          if (stryMutAct_9fa48("3311")) {
            {}
          } else {
            stryCov_9fa48("3311");
            cancelAnimationFrame(rafId);
            window.removeEventListener(stryMutAct_9fa48("3312") ? "" : (stryCov_9fa48("3312"), "resize"), resize);
            window.removeEventListener(stryMutAct_9fa48("3313") ? "" : (stryCov_9fa48("3313"), "pointermove"), onPointer);
            gl.deleteProgram(prog);
            gl.deleteShader(vs);
            gl.deleteShader(fs);
            if (stryMutAct_9fa48("3315") ? false : stryMutAct_9fa48("3314") ? true : (stryCov_9fa48("3314", "3315"), vao)) gl.deleteVertexArray(vao);
            stryMutAct_9fa48("3316") ? gl.getExtension("WEBGL_lose_context").loseContext() : (stryCov_9fa48("3316"), gl.getExtension(stryMutAct_9fa48("3317") ? "" : (stryCov_9fa48("3317"), "WEBGL_lose_context"))?.loseContext());
            el.removeChild(canvas);
          }
        };
      }
    }, stryMutAct_9fa48("3318") ? ["Stryker was here"] : (stryCov_9fa48("3318"), []));
    return <div ref={ref} className="fixed inset-0 pointer-events-none" style={stryMutAct_9fa48("3319") ? {} : (stryCov_9fa48("3319"), {
      zIndex: 0
    })} aria-hidden="true" />;
  }
}