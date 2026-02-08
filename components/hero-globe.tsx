"use client"

import { useEffect, useRef, useCallback } from "react"

interface Point3D { x: number; y: number; z: number }
interface Projected { x: number; y: number; s: number; d: number }

function proj(p: Point3D, cx: number, cy: number, f: number): Projected {
  const s = f / (f + p.z)
  return { x: p.x * s + cx, y: p.y * s + cy, s, d: p.z }
}

function rX(p: Point3D, a: number): Point3D {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: p.x, y: p.y * c - p.z * s, z: p.y * s + p.z * c }
}

function rY(p: Point3D, a: number): Point3D {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: p.x * c + p.z * s, y: p.y, z: -p.x * s + p.z * c }
}

function rZ(p: Point3D, a: number): Point3D {
  const c = Math.cos(a), s = Math.sin(a)
  return { x: p.x * c - p.y * s, y: p.x * s + p.y * c, z: p.z }
}

function normalize(p: Point3D, r: number): Point3D {
  const l = Math.sqrt(p.x * p.x + p.y * p.y + p.z * p.z)
  return { x: (p.x / l) * r, y: (p.y / l) * r, z: (p.z / l) * r }
}

// Create geodesic sphere (subdivided icosahedron)
function createGeodesic(radius: number, detail: number): { verts: Point3D[]; edges: [number, number][] } {
  const t = (1 + Math.sqrt(5)) / 2
  const n = radius / Math.sqrt(1 + t * t)
  const verts: Point3D[] = [
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

  let currentFaces = faces
  for (let d = 0; d < detail; d++) {
    const newFaces: [number, number, number][] = []
    const midCache: Record<string, number> = {}
    const getMid = (a: number, b: number): number => {
      const key = `${Math.min(a, b)}-${Math.max(a, b)}`
      if (midCache[key] !== undefined) return midCache[key]
      const mid = normalize({
        x: (verts[a].x + verts[b].x) / 2,
        y: (verts[a].y + verts[b].y) / 2,
        z: (verts[a].z + verts[b].z) / 2,
      }, radius)
      verts.push(mid)
      midCache[key] = verts.length - 1
      return midCache[key]
    }
    for (const [a, b, c] of currentFaces) {
      const ab = getMid(a, b), bc = getMid(b, c), ca = getMid(c, a)
      newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca])
    }
    currentFaces = newFaces
  }

  const edgeSet = new Set<string>()
  const edges: [number, number][] = []
  for (const [a, b, c] of currentFaces) {
    for (const [i, j] of [[a, b], [b, c], [a, c]] as [number, number][]) {
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`
      if (!edgeSet.has(key)) { edgeSet.add(key); edges.push([i, j]) }
    }
  }
  return { verts, edges }
}

// Data stream particle traveling along sphere surface
interface DataStream {
  lat: number; lng: number; speed: number; trail: Point3D[]; maxTrail: number
  color: string; size: number; active: boolean; life: number
}

// Orbital ring point
function ringPoint(radius: number, angle: number, tiltX: number, tiltZ: number): Point3D {
  let p: Point3D = { x: Math.cos(angle) * radius, y: 0, z: Math.sin(angle) * radius }
  p = rX(p, tiltX)
  p = rZ(p, tiltZ)
  return p
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

    const mobile = window.innerWidth < 768
    let time = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, mobile ? 1.5 : 2)
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
    if (mobile) window.addEventListener("touchmove", onTouch, { passive: true })

    const w = window.innerWidth, h = window.innerHeight
    const cx = w * 0.5, cy = h * 0.47
    const fov = 800
    const R = Math.min(w, h) * (mobile ? 0.26 : 0.23)

    // Geodesic sphere - 1 subdivision for clean look
    const geo = createGeodesic(R, 1)

    // 3 orbital rings at different tilts
    const rings = [
      { tiltX: 0.3, tiltZ: 0.15, radius: R * 1.35, speed: 0.4, count: 100 },
      { tiltX: -0.5, tiltZ: 0.8, radius: R * 1.5, speed: -0.25, count: 80 },
      { tiltX: 1.2, tiltZ: 0.3, radius: R * 1.2, speed: 0.55, count: 60 },
    ]

    // Data streams flowing across sphere surface
    const streamCount = mobile ? 6 : 14
    const streams: DataStream[] = []
    const colors = ["#06d6e0", "#0ea5e9", "#06d6e0", "#22d3ee", "#06b6d4"]
    for (let i = 0; i < streamCount; i++) {
      streams.push({
        lat: (Math.random() - 0.5) * Math.PI,
        lng: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.015,
        trail: [],
        maxTrail: mobile ? 8 : 16,
        color: colors[i % colors.length],
        size: 1.5 + Math.random() * 1.5,
        active: true,
        life: Math.random() * 200 + 100,
      })
    }

    // Floating data nodes
    const nodeCount = mobile ? 8 : 18
    const nodes: { base: Point3D; orbitR: number; orbitSpeed: number; phase: number; size: number }[] = []
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = R * (1.15 + Math.random() * 0.5)
      nodes.push({
        base: { x: r * Math.sin(phi) * Math.cos(theta), y: r * Math.sin(phi) * Math.sin(theta), z: r * Math.cos(phi) },
        orbitR: 3 + Math.random() * 8,
        orbitSpeed: 0.3 + Math.random() * 0.6,
        phase: Math.random() * Math.PI * 2,
        size: 1 + Math.random() * 2,
      })
    }

    const animate = () => {
      if (document.hidden) { frameRef.current = requestAnimationFrame(animate); return }
      time += mobile ? 0.006 : 0.004
      ctx.clearRect(0, 0, w, h)

      const m = mouseRef.current
      m.x += (m.tx - m.x) * 0.04
      m.y += (m.ty - m.y) * 0.04

      const rotY = time * 0.3 + m.x * 0.2
      const rotXa = Math.sin(time * 0.15) * 0.12 + m.y * 0.12

      // --- Ambient glow ---
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, R * 2.2)
      g.addColorStop(0, "rgba(6, 214, 224, 0.05)")
      g.addColorStop(0.4, "rgba(6, 182, 212, 0.025)")
      g.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = g
      ctx.fillRect(0, 0, w, h)

      // --- Orbital rings (behind sphere) ---
      for (const ring of rings) {
        ctx.beginPath()
        const ringAngleOffset = time * ring.speed
        for (let i = 0; i <= ring.count; i++) {
          const angle = (i / ring.count) * Math.PI * 2 + ringAngleOffset
          let p = ringPoint(ring.radius, angle, ring.tiltX, ring.tiltZ)
          p = rY(p, rotY)
          p = rX(p, rotXa)
          const pr = proj(p, cx, cy, fov)
          if (i === 0) ctx.moveTo(pr.x, pr.y)
          else ctx.lineTo(pr.x, pr.y)
        }
        ctx.strokeStyle = "#06d6e0"
        ctx.globalAlpha = 0.06
        ctx.lineWidth = 0.6
        ctx.stroke()

        // Bright moving dot on ring
        const dotAngle = time * ring.speed * 3
        let dp = ringPoint(ring.radius, dotAngle, ring.tiltX, ring.tiltZ)
        dp = rY(dp, rotY); dp = rX(dp, rotXa)
        const dpr = proj(dp, cx, cy, fov)
        const dotGlow = ctx.createRadialGradient(dpr.x, dpr.y, 0, dpr.x, dpr.y, 8)
        dotGlow.addColorStop(0, "rgba(6, 214, 224, 0.6)")
        dotGlow.addColorStop(1, "rgba(6, 214, 224, 0)")
        ctx.globalAlpha = 1
        ctx.fillStyle = dotGlow
        ctx.fillRect(dpr.x - 8, dpr.y - 8, 16, 16)
        ctx.beginPath()
        ctx.arc(dpr.x, dpr.y, 1.5 * dpr.s, 0, Math.PI * 2)
        ctx.fillStyle = "#06d6e0"
        ctx.globalAlpha = 0.9
        ctx.fill()
      }

      // --- Sphere wireframe ---
      const pVerts: Projected[] = geo.verts.map(v => {
        let p = rY(v, rotY); p = rX(p, rotXa)
        return proj(p, cx, cy, fov)
      })

      // Draw edges with depth-based opacity
      for (const [a, b] of geo.edges) {
        const pa = pVerts[a], pb = pVerts[b]
        const avgD = (pa.d + pb.d) / 2
        const alpha = Math.max(0.015, Math.min(0.28, 0.24 - avgD / (R * 4)))

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = "#06d6e0"
        ctx.globalAlpha = alpha
        ctx.lineWidth = Math.max(0.3, 0.8 * pa.s)
        ctx.stroke()
      }

      // Vertex highlights (original 12 icosahedron vertices only)
      for (let i = 0; i < 12; i++) {
        const pv = pVerts[i]
        const da = Math.max(0.1, 0.55 - pv.d / (R * 2.5))
        const pulse = 2.2 + Math.sin(time * 2.5 + i * 0.7) * 0.8

        // Glow
        const vg = ctx.createRadialGradient(pv.x, pv.y, 0, pv.x, pv.y, pulse * 5)
        vg.addColorStop(0, `rgba(6, 214, 224, ${da * 0.3})`)
        vg.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.globalAlpha = 1
        ctx.fillStyle = vg
        ctx.fillRect(pv.x - pulse * 5, pv.y - pulse * 5, pulse * 10, pulse * 10)

        // Dot
        ctx.beginPath()
        ctx.arc(pv.x, pv.y, pulse * pv.s * 0.6, 0, Math.PI * 2)
        ctx.fillStyle = "#06d6e0"
        ctx.globalAlpha = da
        ctx.fill()
      }

      // --- Data streams on sphere surface ---
      for (const stream of streams) {
        stream.lng += stream.speed
        stream.lat += Math.sin(time * 2 + stream.lng) * 0.003
        stream.life--

        if (stream.life <= 0) {
          stream.lat = (Math.random() - 0.5) * Math.PI
          stream.lng = Math.random() * Math.PI * 2
          stream.life = Math.random() * 200 + 100
          stream.trail = []
        }

        const sp: Point3D = {
          x: R * Math.cos(stream.lat) * Math.cos(stream.lng),
          y: R * Math.sin(stream.lat),
          z: R * Math.cos(stream.lat) * Math.sin(stream.lng),
        }
        stream.trail.unshift(sp)
        if (stream.trail.length > stream.maxTrail) stream.trail.pop()

        // Draw trail
        if (stream.trail.length > 1) {
          for (let i = 0; i < stream.trail.length - 1; i++) {
            let pa3 = rY(stream.trail[i], rotY); pa3 = rX(pa3, rotXa)
            let pb3 = rY(stream.trail[i + 1], rotY); pb3 = rX(pb3, rotXa)
            const pa = proj(pa3, cx, cy, fov)
            const pb = proj(pb3, cx, cy, fov)

            // Only draw if front-facing
            if (pa.d > R * 0.3 && pb.d > R * 0.3) continue

            const trailAlpha = (1 - i / stream.trail.length) * 0.5
            const depthFade = Math.max(0, 1 - pa.d / (R * 1.5))

            ctx.beginPath()
            ctx.moveTo(pa.x, pa.y)
            ctx.lineTo(pb.x, pb.y)
            ctx.strokeStyle = stream.color
            ctx.globalAlpha = trailAlpha * depthFade
            ctx.lineWidth = stream.size * pa.s * (1 - i / stream.trail.length)
            ctx.stroke()
          }

          // Head glow
          let headP = rY(stream.trail[0], rotY); headP = rX(headP, rotXa)
          const hp = proj(headP, cx, cy, fov)
          if (hp.d < R * 0.3) {
            const hg = ctx.createRadialGradient(hp.x, hp.y, 0, hp.x, hp.y, 6)
            hg.addColorStop(0, stream.color.replace(")", ", 0.7)").replace("rgb", "rgba"))
            hg.addColorStop(1, "rgba(0,0,0,0)")
            ctx.globalAlpha = Math.max(0, 1 - hp.d / (R * 1.5))
            ctx.fillStyle = hg
            ctx.fillRect(hp.x - 6, hp.y - 6, 12, 12)

            ctx.beginPath()
            ctx.arc(hp.x, hp.y, stream.size * hp.s, 0, Math.PI * 2)
            ctx.fillStyle = "#fff"
            ctx.globalAlpha = Math.max(0, 0.8 - hp.d / R)
            ctx.fill()
          }
        }
      }

      // --- Floating data nodes with connections ---
      const nodeProj: Projected[] = []
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const wobble = time * n.orbitSpeed + n.phase
        let p: Point3D = {
          x: n.base.x + Math.sin(wobble) * n.orbitR,
          y: n.base.y + Math.cos(wobble * 1.3) * n.orbitR,
          z: n.base.z + Math.sin(wobble * 0.7) * n.orbitR,
        }
        p = rY(p, rotY * 0.5)
        p = rX(p, rotXa * 0.5)
        nodeProj.push(proj(p, cx, cy, fov))
      }

      // Node connections (nearest 2)
      for (let i = 0; i < nodeProj.length; i++) {
        const pi = nodeProj[i]
        const dists: { j: number; d: number }[] = []
        for (let j = 0; j < nodeProj.length; j++) {
          if (i === j) continue
          const dx = pi.x - nodeProj[j].x, dy = pi.y - nodeProj[j].y
          dists.push({ j, d: Math.sqrt(dx * dx + dy * dy) })
        }
        dists.sort((a, b) => a.d - b.d)
        for (let k = 0; k < Math.min(2, dists.length); k++) {
          const pj = nodeProj[dists[k].j]
          const maxDist = mobile ? 100 : 150
          if (dists[k].d > maxDist) continue

          const lineAlpha = (1 - dists[k].d / maxDist) * 0.08
          ctx.beginPath()
          ctx.moveTo(pi.x, pi.y)
          ctx.lineTo(pj.x, pj.y)
          ctx.strokeStyle = "#06d6e0"
          ctx.globalAlpha = lineAlpha
          ctx.lineWidth = 0.4
          ctx.setLineDash([2, 4])
          ctx.stroke()
          ctx.setLineDash([])

          // Traveling pulse dot
          const pulse = (time * 1.5 + i * 0.3 + k) % 1
          const px = pi.x + (pj.x - pi.x) * pulse
          const py = pi.y + (pj.y - pi.y) * pulse
          ctx.beginPath()
          ctx.arc(px, py, 1, 0, Math.PI * 2)
          ctx.fillStyle = "#06d6e0"
          ctx.globalAlpha = lineAlpha * 4
          ctx.fill()
        }
      }

      // Node dots
      for (let i = 0; i < nodeProj.length; i++) {
        const np = nodeProj[i]
        const da = Math.max(0.08, 0.4 - np.d / (R * 4))
        ctx.beginPath()
        ctx.arc(np.x, np.y, nodes[i].size * np.s, 0, Math.PI * 2)
        ctx.fillStyle = "#06d6e0"
        ctx.globalAlpha = da
        ctx.fill()

        // Soft glow
        const ng = ctx.createRadialGradient(np.x, np.y, 0, np.x, np.y, nodes[i].size * 5)
        ng.addColorStop(0, `rgba(6, 214, 224, ${da * 0.2})`)
        ng.addColorStop(1, "rgba(0,0,0,0)")
        ctx.globalAlpha = 1
        ctx.fillStyle = ng
        ctx.fillRect(np.x - nodes[i].size * 5, np.y - nodes[i].size * 5, nodes[i].size * 10, nodes[i].size * 10)
      }

      // --- Central AI core ---
      const coreBreath = 1 + Math.sin(time * 2) * 0.15
      const coreR = R * 0.12 * coreBreath

      // Outer haze
      const c1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR * 3)
      c1.addColorStop(0, "rgba(6, 214, 224, 0.08)")
      c1.addColorStop(0.5, "rgba(6, 182, 212, 0.03)")
      c1.addColorStop(1, "rgba(0,0,0,0)")
      ctx.globalAlpha = 1
      ctx.fillStyle = c1
      ctx.beginPath()
      ctx.arc(cx, cy, coreR * 3, 0, Math.PI * 2)
      ctx.fill()

      // Inner bright core
      const c2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR)
      c2.addColorStop(0, "rgba(6, 214, 224, 0.2)")
      c2.addColorStop(0.7, "rgba(6, 214, 224, 0.06)")
      c2.addColorStop(1, "rgba(0,0,0,0)")
      ctx.fillStyle = c2
      ctx.beginPath()
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2)
      ctx.fill()

      // Tiny bright center dot
      ctx.beginPath()
      ctx.arc(cx, cy, 2 * coreBreath, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fill()

      // --- Pulse wave (every ~4 seconds) ---
      const pulseCycle = (time * 0.7) % 3
      if (pulseCycle < 2) {
        const pulseR = pulseCycle * R * 0.9
        const pulseA = Math.max(0, 0.12 * (1 - pulseCycle / 2))
        ctx.beginPath()
        ctx.arc(cx, cy, pulseR, 0, Math.PI * 2)
        ctx.strokeStyle = "#06d6e0"
        ctx.globalAlpha = pulseA
        ctx.lineWidth = 1.5 * (1 - pulseCycle / 2)
        ctx.stroke()
      }

      ctx.globalAlpha = 1
      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      if (mobile) window.removeEventListener("touchmove", onTouch)
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
