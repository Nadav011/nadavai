"use client"

import { useEffect, useRef, useCallback } from "react"

interface P3 { x: number; y: number; z: number }
interface P2 { x: number; y: number; s: number; depth: number }

function project(p: P3, cx: number, cy: number, fov: number): P2 {
  const s = fov / (fov + p.z)
  return { x: p.x * s + cx, y: p.y * s + cy, s, depth: p.z }
}

function rotateY(p: P3, a: number): P3 {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }
}

function rotateX(p: P3, a: number): P3 {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
}

function norm(p: P3, r: number): P3 {
  const l = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z)
  return { x: (p.x / l) * r, y: (p.y / l) * r, z: (p.z / l) * r }
}

function buildSphere(radius: number): { verts: P3[]; edges: [number, number][] } {
  const t = (1 + Math.sqrt(5)) / 2
  const n = radius / Math.sqrt(1 + t * t)
  const verts: P3[] = [
    { x: -n, y: t * n, z: 0 }, { x: n, y: t * n, z: 0 },
    { x: -n, y: -t * n, z: 0 }, { x: n, y: -t * n, z: 0 },
    { x: 0, y: -n, z: t * n }, { x: 0, y: n, z: t * n },
    { x: 0, y: -n, z: -t * n }, { x: 0, y: n, z: -t * n },
    { x: t * n, y: 0, z: -n }, { x: t * n, y: 0, z: n },
    { x: -t * n, y: 0, z: -n }, { x: -t * n, y: 0, z: n },
  ]
  const faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ]
  // 1 subdivision
  const mid: Record<string, number> = {}
  const getMid = (a: number, b: number): number => {
    const key = `${Math.min(a, b)}-${Math.max(a, b)}`
    if (mid[key] !== undefined) return mid[key]
    const m = norm({
      x: (verts[a].x + verts[b].x) / 2,
      y: (verts[a].y + verts[b].y) / 2,
      z: (verts[a].z + verts[b].z) / 2,
    }, radius)
    verts.push(m)
    mid[key] = verts.length - 1
    return mid[key]
  }
  const newFaces: [number, number, number][] = []
  for (const [a, b, c] of faces) {
    const ab = getMid(a, b), bc = getMid(b, c), ca = getMid(c, a)
    newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca])
  }

  const edgeSet = new Set<string>()
  const edges: [number, number][] = []
  for (const [a, b, c] of newFaces) {
    for (const [i, j] of [[a, b], [b, c], [a, c]] as [number, number][]) {
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`
      if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([i, j]) }
    }
  }
  return { verts, edges }
}

// Data pulse traveling along an edge
interface EdgePulse {
  edgeIdx: number
  progress: number
  speed: number
  life: number
  maxLife: number
}

export function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, tx: 0, ty: 0 })
  const frameRef = useRef(0)

  const onMove = useCallback((e: MouseEvent) => {
    mouseRef.current.tx = (e.clientX / window.innerWidth - 0.5) * 2
    mouseRef.current.ty = (e.clientY / window.innerHeight - 0.5) * 2
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const isMobile = window.innerWidth < 768
    let t = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.tx = (e.touches[0].clientX / window.innerWidth - 0.5) * 2
        mouseRef.current.ty = (e.touches[0].clientY / window.innerHeight - 0.5) * 2
      }
    }
    if (isMobile) window.addEventListener("touchmove", onTouch, { passive: true })

    const w = window.innerWidth
    const h = window.innerHeight
    const cx = w * 0.5
    const cy = h * (isMobile ? 0.44 : 0.47)
    const fov = 900
    const R = Math.min(w, h) * (isMobile ? 0.28 : 0.24)

    const sphere = buildSphere(R)
    const VERT_COUNT_BASE = 12 // original icosahedron verts

    // Edge pulses - data flowing through the network
    const pulseCount = isMobile ? 5 : 10
    const pulses: EdgePulse[] = []
    for (let i = 0; i < pulseCount; i++) {
      pulses.push({
        edgeIdx: Math.floor(Math.random() * sphere.edges.length),
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.008,
        life: Math.random() * 300 + 100,
        maxLife: 300,
      })
    }

    // Single orbit ring
    const ringSegments = isMobile ? 80 : 120

    const animate = () => {
      if (document.hidden) { frameRef.current = requestAnimationFrame(animate); return }
      t += 0.003
      ctx.clearRect(0, 0, w, h)

      const m = mouseRef.current
      m.x += (m.tx - m.x) * 0.03
      m.y += (m.ty - m.y) * 0.03

      const ry = t * 0.25 + m.x * 0.15
      const rx = Math.sin(t * 0.12) * 0.1 + m.y * 0.1

      // === Soft ambient glow ===
      const ambG = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2)
      ambG.addColorStop(0, "rgba(6,214,224,0.035)")
      ambG.addColorStop(0.5, "rgba(6,182,212,0.015)")
      ambG.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = ambG
      ctx.fillRect(0, 0, w, h)

      // === Project all vertices ===
      const projected: P2[] = sphere.verts.map(v => {
        let p = rotateY(v, ry)
        p = rotateX(p, rx)
        return project(p, cx, cy, fov)
      })

      // === Draw edges with depth-based opacity ===
      ctx.lineCap = "round"
      for (const [a, b] of sphere.edges) {
        const pa = projected[a], pb = projected[b]
        const avgDepth = (pa.depth + pb.depth) / 2
        // Front faces brighter, back faces dimmer
        const alpha = Math.max(0.02, 0.18 - avgDepth / (R * 3))

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `rgba(6,214,224,${alpha})`
        ctx.lineWidth = Math.max(0.3, 0.7 * ((pa.s + pb.s) / 2))
        ctx.stroke()
      }

      // === Vertex nodes (only the 12 base vertices for clean look) ===
      for (let i = 0; i < VERT_COUNT_BASE; i++) {
        const pv = projected[i]
        const depthAlpha = Math.max(0.08, 0.6 - pv.depth / (R * 2))
        const breathe = 1 + Math.sin(t * 2 + i * 0.5) * 0.3

        // Soft glow halo
        const ng = ctx.createRadialGradient(pv.x, pv.y, 0, pv.x, pv.y, 8 * breathe)
        ng.addColorStop(0, `rgba(6,214,224,${depthAlpha * 0.25})`)
        ng.addColorStop(1, "rgba(0,0,0,0)")
        ctx.fillStyle = ng
        ctx.fillRect(pv.x - 8 * breathe, pv.y - 8 * breathe, 16 * breathe, 16 * breathe)

        // Bright dot
        ctx.beginPath()
        ctx.arc(pv.x, pv.y, (1.5 + breathe * 0.4) * pv.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6,214,224,${depthAlpha})`
        ctx.fill()

        // Tiny white center
        ctx.beginPath()
        ctx.arc(pv.x, pv.y, 0.6 * pv.s, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${depthAlpha * 0.5})`
        ctx.fill()
      }

      // === Edge pulses - data flowing through the wireframe ===
      for (const pulse of pulses) {
        pulse.progress += pulse.speed
        pulse.life--

        if (pulse.progress >= 1 || pulse.life <= 0) {
          // Jump to a connected edge for continuous flow
          const currentEdge = sphere.edges[pulse.edgeIdx]
          const endVert = pulse.progress >= 1 ? currentEdge[1] : currentEdge[0]
          const connected = sphere.edges
            .map((e, idx) => ({ e, idx }))
            .filter(({ e, idx }) => idx !== pulse.edgeIdx && (e[0] === endVert || e[1] === endVert))
          if (connected.length > 0) {
            const next = connected[Math.floor(Math.random() * connected.length)]
            pulse.edgeIdx = next.idx
            // Start from the correct end
            pulse.progress = next.e[0] === endVert ? 0 : 1
            pulse.speed = next.e[0] === endVert ? Math.abs(pulse.speed) : -Math.abs(pulse.speed)
          } else {
            pulse.edgeIdx = Math.floor(Math.random() * sphere.edges.length)
            pulse.progress = 0
            pulse.speed = Math.abs(pulse.speed)
          }
          pulse.life = pulse.maxLife
        }

        const [a, b] = sphere.edges[pulse.edgeIdx]
        const pa = projected[a], pb = projected[b]
        const prog = Math.abs(pulse.progress)
        const px = pa.x + (pb.x - pa.x) * prog
        const py = pa.y + (pb.y - pa.y) * prog
        const avgD = pa.depth + (pb.depth - pa.depth) * prog
        const depthAlpha = Math.max(0, 0.9 - avgD / (R * 2))

        if (depthAlpha > 0.05) {
          // Glow trail
          const tg = ctx.createRadialGradient(px, py, 0, px, py, 12)
          tg.addColorStop(0, `rgba(6,214,224,${depthAlpha * 0.4})`)
          tg.addColorStop(0.5, `rgba(6,214,224,${depthAlpha * 0.1})`)
          tg.addColorStop(1, "rgba(0,0,0,0)")
          ctx.fillStyle = tg
          ctx.fillRect(px - 12, py - 12, 24, 24)

          // Bright core
          ctx.beginPath()
          ctx.arc(px, py, 2, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255,255,255,${depthAlpha * 0.9})`
          ctx.fill()
        }
      }

      // === Single elegant orbit ring ===
      const ringTiltX = 0.35
      const ringTiltZ = 0.2
      const ringR = R * 1.3
      ctx.beginPath()
      for (let i = 0; i <= ringSegments; i++) {
        const angle = (i / ringSegments) * Math.PI * 2
        let p: P3 = {
          x: Math.cos(angle) * ringR,
          y: 0,
          z: Math.sin(angle) * ringR,
        }
        // Apply ring tilt
        const cRx = Math.cos(ringTiltX), sRx = Math.sin(ringTiltX)
        p = { x: p.x, y: p.y * cRx - p.z * sRx, z: p.y * sRx + p.z * cRx }
        const cRz = Math.cos(ringTiltZ), sRz = Math.sin(ringTiltZ)
        p = { x: p.x * cRz - p.y * sRz, y: p.x * sRz + p.y * cRz, z: p.z }
        // Apply scene rotation
        p = rotateY(p, ry)
        p = rotateX(p, rx)
        const pr = project(p, cx, cy, fov)
        if (i === 0) ctx.moveTo(pr.x, pr.y)
        else ctx.lineTo(pr.x, pr.y)
      }
      ctx.strokeStyle = "rgba(6,214,224,0.07)"
      ctx.lineWidth = 0.8
      ctx.stroke()

      // Ring traveling dot
      const dotAngle = t * 1.2
      let dp: P3 = { x: Math.cos(dotAngle) * ringR, y: 0, z: Math.sin(dotAngle) * ringR }
      const cRx2 = Math.cos(ringTiltX), sRx2 = Math.sin(ringTiltX)
      dp = { x: dp.x, y: dp.y * cRx2 - dp.z * sRx2, z: dp.y * sRx2 + dp.z * cRx2 }
      const cRz2 = Math.cos(ringTiltZ), sRz2 = Math.sin(ringTiltZ)
      dp = { x: dp.x * cRz2 - dp.y * sRz2, y: dp.x * sRz2 + dp.y * cRz2, z: dp.z }
      dp = rotateY(dp, ry)
      dp = rotateX(dp, rx)
      const dpr = project(dp, cx, cy, fov)

      const dotGlow = ctx.createRadialGradient(dpr.x, dpr.y, 0, dpr.x, dpr.y, 14)
      dotGlow.addColorStop(0, "rgba(6,214,224,0.5)")
      dotGlow.addColorStop(0.4, "rgba(6,214,224,0.15)")
      dotGlow.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = dotGlow
      ctx.fillRect(dpr.x - 14, dpr.y - 14, 28, 28)
      ctx.beginPath()
      ctx.arc(dpr.x, dpr.y, 2 * dpr.s, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.8)"
      ctx.fill()

      // === Inner core - subtle breathing glow ===
      const breath = 1 + Math.sin(t * 1.5) * 0.12
      const coreR = R * 0.08 * breath

      const c1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 4)
      c1.addColorStop(0, "rgba(6,214,224,0.06)")
      c1.addColorStop(0.5, "rgba(6,214,224,0.02)")
      c1.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = c1
      ctx.beginPath()
      ctx.arc(cx, cy, coreR * 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
      const c2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
      c2.addColorStop(0, "rgba(6,214,224,0.15)")
      c2.addColorStop(1, "rgba(6,214,224,0.03)")
      ctx.fillStyle = c2
      ctx.fill()

      // Tiny white center
      ctx.beginPath()
      ctx.arc(cx, cy, 1.2 * breath, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255,255,255,0.2)"
      ctx.fill()

      // === Periodic soft pulse wave ===
      const pulseCycle = (t * 0.5) % 4
      if (pulseCycle < 2.5) {
        const pulseR = (pulseCycle / 2.5) * R * 1.1
        const pulseA = 0.06 * (1 - pulseCycle / 2.5)
        ctx.beginPath()
        ctx.arc(cx, cy, pulseR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(6,214,224,${pulseA})`
        ctx.lineWidth = 1 * (1 - pulseCycle / 2.5)
        ctx.stroke()
      }

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      if (isMobile) window.removeEventListener("touchmove", onTouch)
    }
  }, [onMove])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
