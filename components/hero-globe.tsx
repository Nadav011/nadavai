"use client"

import { useEffect, useRef, useCallback } from "react"

interface Point3D {
  x: number
  y: number
  z: number
}

interface ProjectedPoint {
  x: number
  y: number
  scale: number
  depth: number
}

function project(point: Point3D, cx: number, cy: number, fov: number): ProjectedPoint {
  const scale = fov / (fov + point.z)
  return {
    x: point.x * scale + cx,
    y: point.y * scale + cy,
    scale,
    depth: point.z,
  }
}

function rotateX(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return { x: p.x, y: p.y * cos - p.z * sin, z: p.y * sin + p.z * cos }
}

function rotateY(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return { x: p.x * cos + p.z * sin, y: p.y, z: -p.x * sin + p.z * cos }
}

function rotateZ(p: Point3D, angle: number): Point3D {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return { x: p.x * cos - p.y * sin, y: p.x * sin + p.y * cos, z: p.z }
}

// Generate icosahedron vertices
function createIcosahedron(radius: number): { vertices: Point3D[]; edges: [number, number][] } {
  const t = (1 + Math.sqrt(5)) / 2
  const s = radius / Math.sqrt(1 + t * t)

  const vertices: Point3D[] = [
    { x: -s, y: t * s, z: 0 },
    { x: s, y: t * s, z: 0 },
    { x: -s, y: -t * s, z: 0 },
    { x: s, y: -t * s, z: 0 },
    { x: 0, y: -s, z: t * s },
    { x: 0, y: s, z: t * s },
    { x: 0, y: -s, z: -t * s },
    { x: 0, y: s, z: -t * s },
    { x: t * s, y: 0, z: -s },
    { x: t * s, y: 0, z: s },
    { x: -t * s, y: 0, z: -s },
    { x: -t * s, y: 0, z: s },
  ]

  const faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ]

  const edgeSet = new Set<string>()
  const edges: [number, number][] = []
  for (const [a, b, c] of faces) {
    const pairs: [number, number][] = [[a, b], [b, c], [a, c]]
    for (const [i, j] of pairs) {
      const key = `${Math.min(i, j)}-${Math.max(i, j)}`
      if (!edgeSet.has(key)) {
        edgeSet.add(key)
        edges.push([i, j])
      }
    }
  }

  return { vertices, edges }
}

// Subdivide edges for denser wireframe
function subdivideEdges(vertices: Point3D[], edges: [number, number][], radius: number): { vertices: Point3D[]; edges: [number, number][] } {
  const newVerts = [...vertices]
  const newEdges: [number, number][] = []

  for (const [a, b] of edges) {
    const mid: Point3D = {
      x: (vertices[a].x + vertices[b].x) / 2,
      y: (vertices[a].y + vertices[b].y) / 2,
      z: (vertices[a].z + vertices[b].z) / 2,
    }
    // Project to sphere surface
    const len = Math.sqrt(mid.x * mid.x + mid.y * mid.y + mid.z * mid.z)
    mid.x = (mid.x / len) * radius
    mid.y = (mid.y / len) * radius
    mid.z = (mid.z / len) * radius

    const midIdx = newVerts.length
    newVerts.push(mid)
    newEdges.push([a, midIdx], [midIdx, b])
  }

  return { vertices: newVerts, edges: newEdges }
}

// Generate orbit ring points
function createOrbitRing(radius: number, count: number, tilt: number): Point3D[] {
  const points: Point3D[] = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    let p: Point3D = {
      x: Math.cos(angle) * radius,
      y: 0,
      z: Math.sin(angle) * radius,
    }
    p = rotateX(p, tilt)
    points.push(p)
  }
  return points
}

export function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })
  const frameRef = useRef(0)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2
    mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number
    let time = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.scale(dpr, dpr)
    }
    resize()

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)

    // Create geometry
    const baseRadius = Math.min(window.innerWidth, window.innerHeight) * 0.28
    const ico = createIcosahedron(baseRadius)
    const subdivided = subdivideEdges(ico.vertices, ico.edges, baseRadius)

    // Orbit rings
    const ring1 = createOrbitRing(baseRadius * 1.4, 60, 0.3)
    const ring2 = createOrbitRing(baseRadius * 1.6, 80, -0.5)
    const ring3 = createOrbitRing(baseRadius * 1.2, 40, 1.2)

    // Floating particles around globe
    const floatingParticles: { pos: Point3D; speed: number; offset: number; size: number }[] = []
    for (let i = 0; i < 40; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.random() * Math.PI
      const r = baseRadius * (1.3 + Math.random() * 0.8)
      floatingParticles.push({
        pos: {
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.sin(phi) * Math.sin(theta),
          z: r * Math.cos(phi),
        },
        speed: 0.3 + Math.random() * 0.7,
        offset: Math.random() * Math.PI * 2,
        size: 1 + Math.random() * 2.5,
      })
    }

    const w = window.innerWidth
    const h = window.innerHeight
    const cx = w * 0.5
    const cy = h * 0.48
    const fov = 800

    const animate = () => {
      time += 0.004
      ctx.clearRect(0, 0, w, h)

      // Smooth mouse
      const m = mouseRef.current
      m.x += (m.targetX - m.x) * 0.03
      m.y += (m.targetY - m.y) * 0.03

      const rotYAngle = time * 0.5 + m.x * 0.3
      const rotXAngle = Math.sin(time * 0.3) * 0.15 + m.y * 0.2

      // === Draw outer glow ===
      const glowGrad = ctx.createRadialGradient(cx, cy, baseRadius * 0.3, cx, cy, baseRadius * 2)
      glowGrad.addColorStop(0, "rgba(6, 214, 224, 0.06)")
      glowGrad.addColorStop(0.4, "rgba(232, 67, 147, 0.03)")
      glowGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = glowGrad
      ctx.fillRect(0, 0, w, h)

      // === Draw orbit rings ===
      const drawRing = (ring: Point3D[], color: string, alpha: number, rotOffset: number) => {
        ctx.beginPath()
        for (let i = 0; i < ring.length; i++) {
          let p = ring[i]
          p = rotateY(p, rotYAngle + rotOffset)
          p = rotateX(p, rotXAngle)
          const proj = project(p, cx, cy, fov)
          if (i === 0) ctx.moveTo(proj.x, proj.y)
          else ctx.lineTo(proj.x, proj.y)
        }
        ctx.closePath()
        ctx.strokeStyle = color
        ctx.globalAlpha = alpha
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      drawRing(ring1, "#06d6e0", 0.12, 0)
      drawRing(ring2, "#e84393", 0.08, 0.5)
      drawRing(ring3, "#4f46e5", 0.1, -0.3)

      // === Draw icosahedron edges ===
      const projectedVerts: ProjectedPoint[] = subdivided.vertices.map((v) => {
        let p = rotateY(v, rotYAngle)
        p = rotateX(p, rotXAngle)
        return project(p, cx, cy, fov)
      })

      for (const [a, b] of subdivided.edges) {
        const pa = projectedVerts[a]
        const pb = projectedVerts[b]
        const avgDepth = (pa.depth + pb.depth) / 2
        const depthAlpha = Math.max(0.04, Math.min(0.5, 0.35 - avgDepth / (baseRadius * 4)))

        // Color based on position + time
        const colorMix = (Math.sin(time + a * 0.1) + 1) / 2
        const r = Math.round(6 + colorMix * 226)
        const g = Math.round(214 - colorMix * 147)
        const b2 = Math.round(224 - colorMix * 77)

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b2})`
        ctx.globalAlpha = depthAlpha
        ctx.lineWidth = Math.max(0.3, pa.scale * 1.2)
        ctx.stroke()
      }

      // === Draw vertices with glow ===
      for (let i = 0; i < ico.vertices.length; i++) {
        const pv = projectedVerts[i]
        const depthAlpha = Math.max(0.1, Math.min(0.9, 0.7 - pv.depth / (baseRadius * 3)))
        const pulseSize = 2 + Math.sin(time * 2 + i) * 1

        // Outer glow
        const grad = ctx.createRadialGradient(pv.x, pv.y, 0, pv.x, pv.y, pulseSize * 4)
        grad.addColorStop(0, `rgba(6, 214, 224, ${depthAlpha * 0.4})`)
        grad.addColorStop(1, "rgba(6, 214, 224, 0)")
        ctx.globalAlpha = 1
        ctx.fillStyle = grad
        ctx.fillRect(pv.x - pulseSize * 4, pv.y - pulseSize * 4, pulseSize * 8, pulseSize * 8)

        // Core dot
        ctx.beginPath()
        ctx.arc(pv.x, pv.y, pulseSize * pv.scale, 0, Math.PI * 2)
        ctx.fillStyle = "#06d6e0"
        ctx.globalAlpha = depthAlpha
        ctx.fill()
      }

      // === Floating particles ===
      for (const fp of floatingParticles) {
        const angle = time * fp.speed + fp.offset
        let p = rotateY(fp.pos, angle)
        p = rotateY(p, rotYAngle * 0.5)
        p = rotateX(p, rotXAngle * 0.5)
        const proj = project(p, cx, cy, fov)
        const depthAlpha = Math.max(0.05, 0.4 - proj.depth / (baseRadius * 5))

        ctx.beginPath()
        ctx.arc(proj.x, proj.y, fp.size * proj.scale, 0, Math.PI * 2)
        const color = fp.offset > Math.PI ? "#e84393" : "#06d6e0"
        ctx.fillStyle = color
        ctx.globalAlpha = depthAlpha
        ctx.fill()
      }

      // === Orbiting accent dots on rings ===
      for (let i = 0; i < 3; i++) {
        const orbitAngle = time * (1.5 + i * 0.3) + i * 2.1
        const orbitR = baseRadius * (1.3 + i * 0.15)
        const tilt = [0.3, -0.5, 1.2][i]
        let dp: Point3D = {
          x: Math.cos(orbitAngle) * orbitR,
          y: 0,
          z: Math.sin(orbitAngle) * orbitR,
        }
        dp = rotateX(dp, tilt)
        dp = rotateY(dp, rotYAngle)
        dp = rotateX(dp, rotXAngle)
        const proj = project(dp, cx, cy, fov)

        // Trail glow
        const colors = ["#06d6e0", "#e84393", "#4f46e5"]
        const trailGrad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 20)
        trailGrad.addColorStop(0, `${colors[i]}80`)
        trailGrad.addColorStop(1, `${colors[i]}00`)
        ctx.globalAlpha = 0.6
        ctx.fillStyle = trailGrad
        ctx.fillRect(proj.x - 20, proj.y - 20, 40, 40)

        // Dot
        ctx.beginPath()
        ctx.arc(proj.x, proj.y, 3 * proj.scale, 0, Math.PI * 2)
        ctx.fillStyle = colors[i]
        ctx.globalAlpha = 0.9
        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [handleMouseMove])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
