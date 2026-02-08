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

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 r = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
  for (int i = 0; i < 5; i++) { v += a * snoise(p); p = r * p * 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  
  // Subtle mouse influence
  vec2 mOff = (u_mouse - 0.5) * 0.05;
  uv += mOff * smoothstep(1.0, 0.0, length(uv - u_mouse));
  
  float t = u_time * 0.04;
  
  // Layered warped noise for organic flow
  vec2 w = uv + 0.25 * vec2(
    fbm(uv * 1.8 + vec2(t, 0.0)),
    fbm(uv * 1.8 + vec2(0.0, t * 0.8))
  );
  
  float n1 = fbm(w * 2.5 + t * 0.2);
  float n2 = fbm(w * 3.0 + vec2(t * 0.3, -t * 0.15) + n1 * 0.4);
  float n3 = fbm(uv * 4.0 + vec2(-t * 0.15, t * 0.25));
  
  // Color palette: only cyan/teal tones + deep dark
  vec3 deepDark = vec3(0.030, 0.035, 0.065);       // Deep navy-black
  vec3 cyanDim  = vec3(0.012, 0.18, 0.22);          // Dark teal
  vec3 cyanMid  = vec3(0.024, 0.55, 0.58);          // Mid cyan
  vec3 cyanBri  = vec3(0.024, 0.839, 0.878);        // Bright cyan #06d6e0
  vec3 tealDeep = vec3(0.008, 0.12, 0.15);          // Very dark teal
  
  // Build color from noise layers
  vec3 c = deepDark;
  
  // First layer: soft teal clouds
  c = mix(c, tealDeep, smoothstep(-0.4, 0.3, n1) * 0.8);
  
  // Second layer: mid cyan wisps
  c = mix(c, cyanDim, smoothstep(0.0, 0.5, n2) * 0.6);
  
  // Third layer: bright cyan highlights (sparse)
  float highlight = smoothstep(0.35, 0.7, n1 + n2 * 0.4);
  c = mix(c, cyanMid, highlight * 0.25);
  
  // Subtle bright spots where noise peaks align
  float peak = smoothstep(0.5, 0.9, n1 * n2 + n3 * 0.3);
  c += cyanBri * peak * 0.08;
  
  // Screen blend for soft glow
  c = 1.0 - (1.0 - c) * (1.0 - cyanBri * smoothstep(0.4, 0.9, n1 + n2 * 0.5) * 0.06);
  
  // Vignette: darken edges
  float vignette = 1.0 - smoothstep(0.3, 1.3, length((uv - 0.5) * 2.0));
  c *= vignette;
  
  // Fade bottom edge
  c *= smoothstep(0.0, 0.25, uv.y * 0.5 + 0.12);
  
  // Overall intensity - keep it subtle and elegant
  c *= 0.30;
  
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

    // CSS fallback on mobile
    if (window.matchMedia("(max-width: 768px)").matches) return useFallback(el)

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
      const dpr = Math.min(window.devicePixelRatio, 1.5)
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
        mx += (tx - mx) * 0.015
        my += (ty - my) * 0.015
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
