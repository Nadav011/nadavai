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

// Simplex noise (Ashima Arts, MIT)
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
  mat2 rot = mat2(0.8776, 0.4794, -0.4794, 0.8776);
  for (int i = 0; i < 5; i++) {
    if (i >= octaves) break;
    v += a * snoise(p);
    p = rot * p * 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y) * 1.2;
  float t = u_time * 0.06;

  // Mouse — wide soft warp
  vec2 mp = vec2(u_mouse.x * aspect, u_mouse.y) * 1.2;
  float md = length(p - mp);
  p += (u_mouse - 0.5) * 0.08 * smoothstep(1.5, 0.0, md);

  // Double domain warp — organic liquid flow (Stripe technique)
  vec2 q = vec2(
    fbm(p + vec2(1.7, 9.2) + vec2(t, t * 0.7), 3),
    fbm(p + vec2(8.3, 2.8) + vec2(-t * 0.6, t * 0.8), 3)
  );
  vec2 r = vec2(
    fbm(p + 4.0 * q + vec2(1.7, 9.2) + vec2(t * 0.4, 0.0), 4),
    fbm(p + 4.0 * q + vec2(8.3, 2.8) + vec2(0.0, t * 0.5), 4)
  );
  float n1 = fbm(p + 4.0 * r, 4);

  // Secondary slow field
  vec2 s = vec2(
    fbm(p * 0.5 + vec2(3.1, 7.4) + vec2(t * 0.3, -t * 0.2), 3),
    fbm(p * 0.5 + vec2(5.8, 1.3) + vec2(-t * 0.25, t * 0.3), 3)
  );
  float n2 = fbm(p * 0.7 + 2.5 * s, 3);

  // Fine shimmer
  float n3 = fbm(p * 3.0 + vec2(t * 0.6, -t * 0.4) + n1 * 0.4, 3);

  // Color palette — vivid site tokens
  vec3 cyan   = vec3(0.024, 0.839, 0.878);
  vec3 pink   = vec3(0.910, 0.263, 0.576);
  vec3 indigo = vec3(0.310, 0.275, 0.898);
  vec3 deep   = vec3(0.030, 0.035, 0.080);

  // Color mapping — wide smooth blends, strong saturation
  float b1 = smoothstep(-0.4, 0.5, n1);
  float b2 = smoothstep(-0.3, 0.5, n2);
  float b3 = smoothstep(-0.1, 0.6, n3 * 0.6 + n1 * 0.4);

  vec3 c = mix(deep, cyan, b1 * 0.6);
  c = mix(c, pink, b2 * 0.45);
  c = mix(c, indigo, b3 * 0.5);

  // Additive glow — screen blend for luminous hot spots
  vec3 glow = cyan * smoothstep(0.1, 0.7, n1 + n2 * 0.4) * 0.2;
  glow += pink * smoothstep(0.3, 0.8, n2 + n3 * 0.3) * 0.1;
  c = 1.0 - (1.0 - c) * (1.0 - glow);

  // Mouse glow — visible soft light at cursor
  float mGlow = smoothstep(1.0, 0.0, md) * 0.15;
  c += mix(cyan, pink, sin(t * 2.0) * 0.5 + 0.5) * mGlow;

  // Vignette — gentle, wide
  float vig = 1.0 - smoothstep(0.5, 1.8, length((uv - 0.5) * vec2(1.6, 1.8)));
  c *= vig;

  // Top fade — narrow, for navbar only
  c *= smoothstep(0.0, 0.15, uv.y * 0.4 + 0.08);

  // Subtle grain
  float grain = (fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) - 0.5) * 0.012;
  c += grain;

  // Final brightness — rich and visible
  c = pow(max(c, 0.0), vec3(1.05)) * 0.65;

  fragColor = vec4(c, 1.0);
}`

function compileShader(gl: WebGL2RenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s)
    return null
  }
  return s
}

function linkProgram(gl: WebGL2RenderingContext, vs: WebGLShader, fs: WebGLShader) {
  const p = gl.createProgram()
  if (!p) return null
  gl.attachShader(p, vs)
  gl.attachShader(p, fs)
  gl.linkProgram(p)
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
    gl.deleteProgram(p)
    return null
  }
  return p
}

function activateFallback(el: HTMLDivElement, canvas?: HTMLCanvasElement) {
  if (canvas?.parentNode === el) el.removeChild(canvas)
  el.classList.add("shader-fallback")
  return () => { el.classList.remove("shader-fallback") }
}

export function ShaderBackground() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia("(max-width: 768px)").matches) return activateFallback(el)

    const canvas = document.createElement("canvas")
    canvas.style.cssText = "width:100%;height:100%"
    el.appendChild(canvas)

    const ctx = canvas.getContext("webgl2", { antialias: false, alpha: false })
    if (!ctx) return activateFallback(el, canvas)
    const gl = ctx

    const vs = compileShader(gl, gl.VERTEX_SHADER, VERT)
    const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      if (vs) gl.deleteShader(vs)
      if (fs) gl.deleteShader(fs)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      return activateFallback(el, canvas)
    }

    const prog = linkProgram(gl, vs, fs)
    if (!prog) {
      gl.deleteShader(vs)
      gl.deleteShader(fs)
      gl.getExtension("WEBGL_lose_context")?.loseContext()
      return activateFallback(el, canvas)
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
      const dpr = Math.min(window.devicePixelRatio, 2)
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
