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
  for (int i = 0; i < 4; i++) { v += a * snoise(p); p = r * p * 2.0; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  vec2 mOff = (u_mouse - 0.5) * 0.08;
  uv += mOff * smoothstep(1.0, 0.0, length(uv - u_mouse));
  float t = u_time * 0.05;
  vec2 w = uv + 0.3 * vec2(fbm(uv * 1.5 + vec2(t, 0.0)),
                            fbm(uv * 1.5 + vec2(0.0, t * 1.2)));
  float n1 = fbm(w * 2.0 + t * 0.3);
  float n2 = fbm(w * 3.5 + vec2(t * 0.4, -t * 0.2) + n1 * 0.5);
  float n3 = fbm(uv * 5.0 + vec2(-t * 0.2, t * 0.3));
  vec3 cy = vec3(0.024, 0.839, 0.878);
  vec3 pk = vec3(0.910, 0.263, 0.576);
  vec3 ind = vec3(0.310, 0.275, 0.898);
  vec3 dp = vec3(0.050, 0.055, 0.120);
  vec3 c = mix(dp, cy, smoothstep(-0.3, 0.2, n1) * 0.6);
  c = mix(c, pk, smoothstep(0.1, 0.6, n2) * 0.4);
  c = mix(c, ind, smoothstep(0.3, 0.8, n3) * 0.5);
  c = 1.0 - (1.0 - c) * (1.0 - cy * smoothstep(0.3, 0.8, n1 + n2 * 0.5) * 0.15);
  c *= 1.0 - smoothstep(0.4, 1.4, length((uv - 0.5) * 2.0));
  c *= smoothstep(0.0, 0.3, uv.y * 0.5 + 0.15);
  c *= 0.35;
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
