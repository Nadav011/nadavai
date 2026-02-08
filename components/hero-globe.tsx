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

function createIcosahedron(radius: number): { vertices: Point3D[]; edges: [number, number][] } {
  const t = (1 + Math.sqrt(5)) / 2
  const s = radius / Math.sqrt(1 + t * t)

  const vertices: Point3D[] = [
    { x: -s, y: t * s, z: 0 }, { x: s, y: t * s, z: 0 },
    { x: -s, y: -t * s, z: 0 }, { x: s, y: -t * s, z: 0 },
    { x: 0, y: -s, z: t * s }, { x: 0, y: s, z: t * s },
    { x: 0, y: -s, z: -t * s }, { x: 0, y: s, z: -t * s },
    { x: t * s, y: 0, z: -s }, { x: t * s, y: 0, z: s },
    { x: -t * s, y: 0, z: -s }, { x: -t * s, y: 0, z: s },
  ]

  const faces: [number, number, number][] = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ]

  const edgeSet = new Set<string>()
  const edges: [number, number][] = []
  for (const face of faces) {
    const pairs: [number, number][] = [[face[0], face[1]], [face[1], face[2]], [face[0], face[2]]]
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

function subdivide(vertices: Point3D[], edges: [number, number][], radius: number): { vertices: Point3D[]; edges: [number, number][] } {
  const newVerts = [...vertices]
  const newEdges: [number, number][] = []

  for (const [a, b] of edges) {
    const mid: Point3D = {
      x: (vertices[a].x + vertices[b].x) / 2,
      y: (vertices[a].y + vertices[b].y) / 2,
      z: (vertices[a].z + vertices[b].z) / 2,
    }
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

function createOrbitRing(radius: number, count: number, tilt: number): Point3D[] {
  const points: Point3D[] = []
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2
    let p: Point3D = { x: Math.cos(angle) * radius, y: 0, z: Math.sin(angle) * radius }
    p = rotateX(p, tilt)
    points.push(p)
  }
  return points
}

export function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 })

  const handleMouseMove = useCallback((e: MouseEvent) => {
    mouseRef.current.targetX = (e.clientX / window.innerWidth - 0.5) * 2
    mouseRef.current.targetY = (e.clientY / window.innerHeight - 0.5) * 2
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const isMobile = window.matchMedia("(max-width: 768px)").matches

    let animationId: number
    let time = 0

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
    window.addEventListener("mousemove", handleMouseMove)

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current.targetX = (e.touches[0].clientX / window.innerWidth - 0.5) * 2
        mouseRef.current.targetY = (e.touches[0].clientY / window.innerHeight - 0.5) * 2
      }
    }
    if (isMobile) {
      window.addEventListener("touchmove", onTouch, { passive: true })
    }

    const w = window.innerWidth
    const h = window.innerHeight
    const cx = w * 0.5
    const cy = h * 0.47
    const fov = 800
    const baseRadius = Math.min(w, h) * (isMobile ? 0.25 : 0.22)

    // Single elegant wireframe sphere
    const ico = createIcosahedron(baseRadius)
    const sphere = subdivide(ico.vertices, ico.edges, baseRadius)

    // One subtle orbit ring
    const ring = createOrbitRing(baseRadius * 1.4, 80, 0.4)

    // Floating neural nodes - fewer, cleaner
    const nodeCount = isMobile ? 12 : 25
    const nodes: { pos: Point3D; speed: number; offset: number; size: number; connections: number[] }[] = []
    for (let i = 0; i < nodeCount; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = baseRadius * (1.05 + Math.random() * 0.6)
      nodes.push({
        pos: {
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.sin(phi) * Math.sin(theta),
          z: r * Math.cos(phi),
        },
        speed: 0.15 + Math.random() * 0.3,
        offset: Math.random() * Math.PI * 2,
        size: 1 + Math.random() * 2,
        connections: [],
      })
    }
    // Nearest neighbor connections
    for (let i = 0; i < nodes.length; i++) {
      const distances: { idx: number; dist: number }[] = []
      for (let j = 0; j < nodes.length; j++) {
        if (i === j) continue
        const dx = nodes[i].pos.x - nodes[j].pos.x
        const dy = nodes[i].pos.y - nodes[j].pos.y
        const dz = nodes[i].pos.z - nodes[j].pos.z
        distances.push({ idx: j, dist: Math.sqrt(dx * dx + dy * dy + dz * dz) })
      }
      distances.sort((a, b) => a.dist - b.dist)
      nodes[i].connections = distances.slice(0, 2).map(d => d.idx)
    }

    // Single pulse wave
    let pulseTime = 0

    const animate = () => {
      if (document.hidden) {
        animationId = requestAnimationFrame(animate)
        return
      }

      time += isMobile ? 0.005 : 0.003
      ctx.clearRect(0, 0, w, h)

      const m = mouseRef.current
      m.x += (m.targetX - m.x) * 0.03
      m.y += (m.targetY - m.y) * 0.03

      const rotYAngle = time * 0.35 + m.x * 0.25
      const rotXAngle = Math.sin(time * 0.2) * 0.15 + m.y * 0.15

      // Subtle background glow
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 2)
      g1.addColorStop(0, "rgba(6, 214, 224, 0.06)")
      g1.addColorStop(0.5, "rgba(6, 214, 224, 0.02)")
      g1.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      // Single pulse wave (subtle)
      pulseTime += 0.008
      const pulseRadius = (pulseTime % 3) * baseRadius * 0.6
      const pulseAlpha = Math.max(0, 0.15 - (pulseTime % 3) * 0.06)
      if (pulseAlpha > 0) {
        ctx.beginPath()
        ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2)
        ctx.strokeStyle = "#06d6e0"
        ctx.globalAlpha = pulseAlpha
        ctx.lineWidth = 1
        ctx.stroke()
      }

      // Orbit ring
      ctx.beginPath()
      for (let i = 0; i < ring.length; i++) {
        let p = rotateY(ring[i], rotYAngle)
        p = rotateX(p, rotXAngle)
        const proj = project(p, cx, cy, fov)
        if (i === 0) ctx.moveTo(proj.x, proj.y)
        else ctx.lineTo(proj.x, proj.y)
      }
      ctx.closePath()
      ctx.strokeStyle = "#06d6e0"
      ctx.globalAlpha = 0.08
      ctx.lineWidth = 0.5
      ctx.stroke()

      // Main sphere wireframe
      const projected: ProjectedPoint[] = sphere.vertices.map(v => {
        let p = rotateY(v, rotYAngle)
        p = rotateX(p, rotXAngle)
        return project(p, cx, cy, fov)
      })

      for (const [a, b] of sphere.edges) {
        const pa = projected[a], pb = projected[b]
        const avgD = (pa.depth + pb.depth) / 2
        const dAlpha = Math.max(0.02, Math.min(0.35, 0.3 - avgD / (baseRadius * 4)))

        // Subtle color shift between cyan and white
        const colorMix = (Math.sin(time * 1.2 + a * 0.2) + 1) / 2
        const r = Math.round(6 + colorMix * 30)
        const g = Math.round(214 + colorMix * 20)
        const b2 = Math.round(224 + colorMix * 10)

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b2})`
        ctx.globalAlpha = dAlpha
        ctx.lineWidth = Math.max(0.3, pa.scale * 1.2)
        ctx.stroke()
      }

      // Vertex glow - only the 12 original icosahedron vertices
      for (let i = 0; i < 12; i++) {
        const pv = projected[i]
        const depthAlpha = Math.max(0.1, Math.min(0.7, 0.5 - pv.depth / (baseRadius * 3)))
        const pulseSize = 2 + Math.sin(time * 2 + i * 0.8) * 1

        const grad = ctx.createRadialGradient(pv.x, pv.y, 0, pv.x, pv.y, pulseSize * 4)
        grad.addColorStop(0, `rgba(6, 214, 224, ${depthAlpha * 0.4})`)
        grad.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.globalAlpha = 1
        ctx.fillStyle = grad
        ctx.fillRect(pv.x - pulseSize * 4, pv.y - pulseSize * 4, pulseSize * 8, pulseSize * 8)

        ctx.beginPath()
        ctx.arc(pv.x, pv.y, pulseSize * pv.scale, 0, Math.PI * 2)
        ctx.fillStyle = "#06d6e0"
        ctx.globalAlpha = depthAlpha
        ctx.fill()
      }

      // Neural node connections + nodes
      const projectedNodes: ProjectedPoint[] = nodes.map(n => {
        const angle = time * n.speed + n.offset
        let p = rotateY(n.pos, angle * 0.2)
        p = rotateY(p, rotYAngle * 0.4)
        p = rotateX(p, rotXAngle * 0.4)
        return project(p, cx, cy, fov)
      })

      // Connections
      for (let i = 0; i < nodes.length; i++) {
        const pa = projectedNodes[i]
        for (const j of nodes[i].connections) {
          const pb = projectedNodes[j]
          const avgD = (pa.depth + pb.depth) / 2
          const dAlpha = Math.max(0, 0.06 - avgD / (baseRadius * 8))
          if (dAlpha <= 0) continue

          ctx.beginPath()
          ctx.moveTo(pa.x, pa.y)
          ctx.lineTo(pb.x, pb.y)
          ctx.strokeStyle = "#06d6e0"
          ctx.globalAlpha = dAlpha
          ctx.lineWidth = 0.3
          ctx.stroke()

          // Data flow dot
          const flowPos = (time * 1.5 + i * 0.5) % 1
          const fx = pa.x + (pb.x - pa.x) * flowPos
          const fy = pa.y + (pb.y - pa.y) * flowPos
          ctx.beginPath()
          ctx.arc(fx, fy, 1, 0, Math.PI * 2)
          ctx.fillStyle = "#06d6e0"
          ctx.globalAlpha = dAlpha * 2.5
          ctx.fill()
        }
      }

      // Nodes
      for (let i = 0; i < nodes.length; i++) {
        const proj = projectedNodes[i]
        const depthAlpha = Math.max(0.05, 0.35 - proj.depth / (baseRadius * 5))
        ctx.beginPath()
        ctx.arc(proj.x, proj.y, nodes[i].size * proj.scale, 0, Math.PI * 2)
        ctx.fillStyle = "#06d6e0"
        ctx.globalAlpha = depthAlpha
        ctx.fill()
      }

      // Central energy core - subtle
      const coreSize = baseRadius * 0.08 + Math.sin(time * 2.5) * baseRadius * 0.02
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize)
      coreGrad.addColorStop(0, "rgba(6, 214, 224, 0.15)")
      coreGrad.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.globalAlpha = 1
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(cx, cy, coreSize, 0, Math.PI * 2)
      ctx.fill()

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      if (isMobile) {
        window.removeEventListener("touchmove", onTouch)
      }
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
