"use client"

import { useEffect, useRef } from "react"

const VERT = `#version 300 es
void main() {
  float x = float((gl_VertexID << 1) & 2);
  float y = float(gl_VertexID & 2);
  gl_Position = vec4(x * 2.0 - 1.0, y * 2.0 - 1.0, 0.0, 1.0);
}`

const FRAG = `#version 300 es
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
}`

function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { gl.deleteShader(s); return null }
  return s
}

function linkProgram(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const p = gl.createProgram()
  if (!p) return null
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { gl.deleteProgram(p); return null }
  return p
}

function useFallback(el: HTMLDivElement, canvas?: HTMLCanvasElement) {
  if (canvas?.parentNode === el) el.removeChild(canvas)
  el.classList.add("shader-fallback")
  return () => { el.classList.remove("shader-fallback") }
}

export function ShaderBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // CSS fallback only on very small/old devices
    const mobile = window.matchMedia("(max-width: 768px)").matches
    if (mobile && !window.WebGL2RenderingContext) return useFallback(el)

    const canvas = document.createElement("canvas")
    canvas.style.cssText = "width:100%;height:100%"
    el.appendChild(canvas)

    const ctx = canvas.getContext("webgl2", { antialias: false, alpha: false })
    if (!ctx) return useFallback(el, canvas)
    const gl = ctx

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs)
      if (fs) gl.deleteShader(fs)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      return useFallback(el, canvas)
    }

    const prog = linkProgram(gl, vs, fs)
    if (!prog) {
      gl.deleteShader(vs); gl.deleteShader(fs)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      return useFallback(el, canvas)
    }

    gl.useProgram(prog)
    const vao = gl.createVertexArray()
    gl.bindVertexArray(vao)

    const uTime = gl.getUniformLocation(prog, "u_time")
    const uRes = gl.getUniformLocation(prog, "u_resolution")
    const uMouse = gl.getUniformLocation(prog, "u_mouse")

    let rafId = 0, time = 0
    let mx = 0.5, my = 0.5, tx = 0.5, ty = 0.5

    function resize() {
      const dpr = Math.min(window.devicePixelRatio, mobile ? 1 : 1.5)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      gl.viewport(0, 0, canvas.width, canvas.height)
    }
    resize()
    window.addEventListener("resize", resize)

    function onPointer(e: PointerEvent) {
      tx = e.clientX / window.innerWidth
      ty = 1.0 - e.clientY / window.innerHeight
    }
    window.addEventListener("pointermove", onPointer)

    function frame() {
      if (!document.hidden) {
        time += 0.016
        mx += (tx - mx) * 0.02
        my += (ty - my) * 0.02
        gl.uniform1f(uTime, time)
        gl.uniform2f(uRes, canvas.width, canvas.height)
        gl.uniform2f(uMouse, mx, my)
        gl.drawArrays(gl.TRIANGLES, 0, 3)
      }
      rafId = requestAnimationFrame(frame)
    }
    rafId = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointer)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      if (vao) gl.deleteVertexArray(vao)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      el.removeChild(canvas)
    }
  }, [])

  return (
    <div
      ref={ref}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    />
  )
}
