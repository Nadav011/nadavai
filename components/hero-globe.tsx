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

function subdivideEdges(vertices: Point3D[], edges: [number, number][], radius: number): { vertices: Point3D[]; edges: [number, number][] } {
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

// Hex grid on sphere
function createHexGrid(radius: number, density: number): { vertices: Point3D[]; edges: [number, number][] } {
  const vertices: Point3D[] = []
  const edges: [number, number][] = []

  for (let lat = -density; lat <= density; lat++) {
    const theta = (lat / density) * (Math.PI * 0.8)
    const ringRadius = Math.cos(theta) * radius
    const y = Math.sin(theta) * radius
    const count = Math.max(6, Math.round(Math.abs(Math.cos(theta)) * density * 2))

    const startIdx = vertices.length
    for (let i = 0; i < count; i++) {
      const phi = (i / count) * Math.PI * 2 + (lat % 2 === 0 ? 0 : Math.PI / count)
      vertices.push({
        x: Math.cos(phi) * ringRadius,
        y,
        z: Math.sin(phi) * ringRadius,
      })
      if (i > 0) edges.push([startIdx + i - 1, startIdx + i])
    }
    if (count > 2) edges.push([startIdx + count - 1, startIdx])
  }

  return { vertices, edges }
}

const CODE_CHARS = "01アイウエオカキクケコAI{}[]<>=;:.fnletconsttypeasyncawait"

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

    let animationId: number
    let time = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2)
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", handleMouseMove)

    const w = window.innerWidth
    const h = window.innerHeight
    const cx = w * 0.5
    const cy = h * 0.47
    const fov = 800
    const baseRadius = Math.min(w, h) * 0.26

    // === Create 3 nested spheres ===
    const sphere1Ico = createIcosahedron(baseRadius)
    const sphere1 = subdivideEdges(sphere1Ico.vertices, sphere1Ico.edges, baseRadius)
    const sphere2Ico = createIcosahedron(baseRadius * 0.65)
    const sphere2 = subdivideEdges(sphere2Ico.vertices, sphere2Ico.edges, baseRadius * 0.65)
    const sphere3Ico = createIcosahedron(baseRadius * 1.35)
    const sphere3 = subdivideEdges(sphere3Ico.vertices, sphere3Ico.edges, baseRadius * 1.35)

    // Hex grid shell
    const hexGrid = createHexGrid(baseRadius * 1.15, 8)

    // Orbit rings
    const rings = [
      createOrbitRing(baseRadius * 1.5, 80, 0.3),
      createOrbitRing(baseRadius * 1.7, 100, -0.6),
      createOrbitRing(baseRadius * 1.3, 60, 1.1),
      createOrbitRing(baseRadius * 1.9, 120, 0.8),
    ]

    // Floating neural nodes
    const neuralNodes: { pos: Point3D; speed: number; offset: number; size: number; connections: number[] }[] = []
    for (let i = 0; i < 60; i++) {
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = baseRadius * (1.1 + Math.random() * 1.2)
      neuralNodes.push({
        pos: {
          x: r * Math.sin(phi) * Math.cos(theta),
          y: r * Math.sin(phi) * Math.sin(theta),
          z: r * Math.cos(phi),
        },
        speed: 0.2 + Math.random() * 0.5,
        offset: Math.random() * Math.PI * 2,
        size: 1 + Math.random() * 3,
        connections: [],
      })
    }
    // Pre-compute neural connections (nearest neighbors)
    for (let i = 0; i < neuralNodes.length; i++) {
      const distances: { idx: number; dist: number }[] = []
      for (let j = 0; j < neuralNodes.length; j++) {
        if (i === j) continue
        const dx = neuralNodes[i].pos.x - neuralNodes[j].pos.x
        const dy = neuralNodes[i].pos.y - neuralNodes[j].pos.y
        const dz = neuralNodes[i].pos.z - neuralNodes[j].pos.z
        distances.push({ idx: j, dist: Math.sqrt(dx * dx + dy * dy + dz * dz) })
      }
      distances.sort((a, b) => a.dist - b.dist)
      neuralNodes[i].connections = distances.slice(0, 3).map(d => d.idx)
    }

    // Energy pulse waves
    const pulses: { startTime: number; speed: number; color: string }[] = []
    let lastPulse = 0

    // Code stream particles
    const codeParticles: { char: string; angle: number; height: number; speed: number; radius: number; opacity: number }[] = []
    for (let i = 0; i < 80; i++) {
      codeParticles.push({
        char: CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)],
        angle: Math.random() * Math.PI * 2,
        height: (Math.random() - 0.5) * baseRadius * 2,
        speed: 0.3 + Math.random() * 0.8,
        radius: baseRadius * (1.05 + Math.random() * 0.6),
        opacity: 0.1 + Math.random() * 0.3,
      })
    }

    const animate = () => {
      time += 0.004
      ctx.clearRect(0, 0, w, h)

      const m = mouseRef.current
      m.x += (m.targetX - m.x) * 0.03
      m.y += (m.targetY - m.y) * 0.03

      const rotYAngle = time * 0.4 + m.x * 0.3
      const rotXAngle = Math.sin(time * 0.25) * 0.2 + m.y * 0.2

      // === Background glow ===
      const g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, baseRadius * 2.5)
      g1.addColorStop(0, "rgba(6, 214, 224, 0.08)")
      g1.addColorStop(0.3, "rgba(232, 67, 147, 0.04)")
      g1.addColorStop(0.6, "rgba(79, 70, 229, 0.02)")
      g1.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = g1
      ctx.fillRect(0, 0, w, h)

      // === Energy pulse waves ===
      if (time - lastPulse > 1.5) {
        pulses.push({
          startTime: time,
          speed: 1.5,
          color: ["#06d6e0", "#e84393", "#4f46e5"][pulses.length % 3],
        })
        lastPulse = time
        if (pulses.length > 6) pulses.shift()
      }

      for (const pulse of pulses) {
        const age = (time - pulse.startTime) * pulse.speed
        const pulseRadius = age * baseRadius * 0.8
        const alpha = Math.max(0, 0.3 - age * 0.12)
        if (alpha <= 0) continue

        ctx.beginPath()
        ctx.arc(cx, cy, pulseRadius, 0, Math.PI * 2)
        ctx.strokeStyle = pulse.color
        ctx.globalAlpha = alpha
        ctx.lineWidth = 2 - age * 0.4
        ctx.stroke()

        // Second ring
        ctx.beginPath()
        ctx.arc(cx, cy, pulseRadius * 0.7, 0, Math.PI * 2)
        ctx.globalAlpha = alpha * 0.4
        ctx.lineWidth = 0.5
        ctx.stroke()
      }

      // === Orbit rings (4 rings now) ===
      const ringColors = ["#06d6e0", "#e84393", "#4f46e5", "#06d6e0"]
      const ringAlphas = [0.15, 0.1, 0.12, 0.06]
      rings.forEach((ring, ri) => {
        ctx.beginPath()
        for (let i = 0; i < ring.length; i++) {
          let p = rotateY(ring[i], rotYAngle + ri * 0.4)
          p = rotateX(p, rotXAngle)
          const proj = project(p, cx, cy, fov)
          if (i === 0) ctx.moveTo(proj.x, proj.y)
          else ctx.lineTo(proj.x, proj.y)
        }
        ctx.closePath()
        ctx.strokeStyle = ringColors[ri]
        ctx.globalAlpha = ringAlphas[ri]
        ctx.lineWidth = ri === 3 ? 0.3 : 0.6
        ctx.stroke()
      })

      // === Hex grid shell ===
      const hexAlpha = 0.04 + Math.sin(time * 0.5) * 0.02
      for (const [a, b] of hexGrid.edges) {
        let pa3d = rotateY(hexGrid.vertices[a], rotYAngle * 0.7 + 0.5)
        pa3d = rotateX(pa3d, rotXAngle * 0.7)
        pa3d = rotateZ(pa3d, time * 0.1)
        let pb3d = rotateY(hexGrid.vertices[b], rotYAngle * 0.7 + 0.5)
        pb3d = rotateX(pb3d, rotXAngle * 0.7)
        pb3d = rotateZ(pb3d, time * 0.1)

        const pa = project(pa3d, cx, cy, fov)
        const pb = project(pb3d, cx, cy, fov)

        const avgD = (pa.depth + pb.depth) / 2
        const dAlpha = Math.max(0, hexAlpha - avgD / (baseRadius * 6))
        if (dAlpha <= 0) continue

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = "#4f46e5"
        ctx.globalAlpha = dAlpha
        ctx.lineWidth = 0.3
        ctx.stroke()
      }

      // === Outer sphere (sphere3) - very faint ===
      const projS3: ProjectedPoint[] = sphere3.vertices.map(v => {
        let p = rotateY(v, rotYAngle * 0.6 - 0.3)
        p = rotateX(p, rotXAngle * 0.6)
        p = rotateZ(p, time * 0.08)
        return project(p, cx, cy, fov)
      })
      for (const [a, b] of sphere3.edges) {
        const pa = projS3[a], pb = projS3[b]
        const avgD = (pa.depth + pb.depth) / 2
        const dAlpha = Math.max(0, 0.07 - avgD / (baseRadius * 8))
        if (dAlpha <= 0) continue

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = "#e84393"
        ctx.globalAlpha = dAlpha
        ctx.lineWidth = 0.3
        ctx.stroke()
      }

      // === Main sphere (sphere1) ===
      const projS1: ProjectedPoint[] = sphere1.vertices.map(v => {
        let p = rotateY(v, rotYAngle)
        p = rotateX(p, rotXAngle)
        return project(p, cx, cy, fov)
      })

      for (const [a, b] of sphere1.edges) {
        const pa = projS1[a], pb = projS1[b]
        const avgD = (pa.depth + pb.depth) / 2
        const dAlpha = Math.max(0.03, Math.min(0.55, 0.4 - avgD / (baseRadius * 4)))

        const colorMix = (Math.sin(time * 1.5 + a * 0.15) + 1) / 2
        const r = Math.round(6 + colorMix * 226)
        const g = Math.round(214 - colorMix * 147)
        const b2 = Math.round(224 - colorMix * 77)

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = `rgb(${r}, ${g}, ${b2})`
        ctx.globalAlpha = dAlpha
        ctx.lineWidth = Math.max(0.4, pa.scale * 1.5)
        ctx.stroke()
      }

      // === Inner sphere (sphere2) - rotating opposite ===
      const projS2: ProjectedPoint[] = sphere2.vertices.map(v => {
        let p = rotateY(v, -rotYAngle * 1.3)
        p = rotateX(p, -rotXAngle * 0.8)
        p = rotateZ(p, time * 0.3)
        return project(p, cx, cy, fov)
      })

      for (const [a, b] of sphere2.edges) {
        const pa = projS2[a], pb = projS2[b]
        const avgD = (pa.depth + pb.depth) / 2
        const dAlpha = Math.max(0, 0.25 - avgD / (baseRadius * 5))
        if (dAlpha <= 0) continue

        ctx.beginPath()
        ctx.moveTo(pa.x, pa.y)
        ctx.lineTo(pb.x, pb.y)
        ctx.strokeStyle = "#4f46e5"
        ctx.globalAlpha = dAlpha
        ctx.lineWidth = 0.8
        ctx.stroke()
      }

      // === Vertex glow (main sphere only) ===
      const icoVerts = 12 // original icosahedron vertices
      for (let i = 0; i < icoVerts; i++) {
        const pv = projS1[i]
        const depthAlpha = Math.max(0.1, Math.min(0.9, 0.7 - pv.depth / (baseRadius * 3)))
        const pulseSize = 2.5 + Math.sin(time * 2.5 + i * 0.7) * 1.5

        const grad = ctx.createRadialGradient(pv.x, pv.y, 0, pv.x, pv.y, pulseSize * 5)
        grad.addColorStop(0, `rgba(6, 214, 224, ${depthAlpha * 0.5})`)
        grad.addColorStop(0.5, `rgba(232, 67, 147, ${depthAlpha * 0.15})`)
        grad.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.globalAlpha = 1
        ctx.fillStyle = grad
        ctx.fillRect(pv.x - pulseSize * 5, pv.y - pulseSize * 5, pulseSize * 10, pulseSize * 10)

        ctx.beginPath()
        ctx.arc(pv.x, pv.y, pulseSize * pv.scale, 0, Math.PI * 2)
        ctx.fillStyle = "#06d6e0"
        ctx.globalAlpha = depthAlpha
        ctx.fill()
      }

      // === Neural network connections + nodes ===
      const projectedNodes: ProjectedPoint[] = neuralNodes.map(n => {
        const angle = time * n.speed + n.offset
        let p = rotateY(n.pos, angle * 0.3)
        p = rotateY(p, rotYAngle * 0.5)
        p = rotateX(p, rotXAngle * 0.5)
        return project(p, cx, cy, fov)
      })

      // Draw connections first
      for (let i = 0; i < neuralNodes.length; i++) {
        const pa = projectedNodes[i]
        for (const j of neuralNodes[i].connections) {
          const pb = projectedNodes[j]
          const avgD = (pa.depth + pb.depth) / 2
          const dAlpha = Math.max(0, 0.08 - avgD / (baseRadius * 8))
          if (dAlpha <= 0) continue

          // Animated data flow along connection
          const flowPos = (time * 2 + i * 0.5) % 1
          const fx = pa.x + (pb.x - pa.x) * flowPos
          const fy = pa.y + (pb.y - pa.y) * flowPos

          ctx.beginPath()
          ctx.moveTo(pa.x, pa.y)
          ctx.lineTo(pb.x, pb.y)
          ctx.strokeStyle = "#06d6e0"
          ctx.globalAlpha = dAlpha
          ctx.lineWidth = 0.3
          ctx.stroke()

          // Flow dot
          ctx.beginPath()
          ctx.arc(fx, fy, 1.2, 0, Math.PI * 2)
          ctx.fillStyle = "#06d6e0"
          ctx.globalAlpha = dAlpha * 3
          ctx.fill()
        }
      }

      // Draw nodes
      for (let i = 0; i < neuralNodes.length; i++) {
        const proj = projectedNodes[i]
        const depthAlpha = Math.max(0.05, 0.45 - proj.depth / (baseRadius * 5))
        const color = neuralNodes[i].offset > Math.PI ? "#e84393" : "#06d6e0"

        ctx.beginPath()
        ctx.arc(proj.x, proj.y, neuralNodes[i].size * proj.scale, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.globalAlpha = depthAlpha
        ctx.fill()
      }

      // === Code stream particles ===
      ctx.font = "10px monospace"
      for (const cp of codeParticles) {
        cp.angle += time * cp.speed * 0.01
        const x3d = Math.cos(cp.angle + time * cp.speed) * cp.radius
        const z3d = Math.sin(cp.angle + time * cp.speed) * cp.radius
        let p: Point3D = { x: x3d, y: cp.height + Math.sin(time * cp.speed + cp.angle) * 20, z: z3d }
        p = rotateY(p, rotYAngle * 0.3)
        p = rotateX(p, rotXAngle * 0.3)
        const proj = project(p, cx, cy, fov)

        const dAlpha = Math.max(0, cp.opacity - proj.depth / (baseRadius * 6))
        if (dAlpha <= 0) continue

        // Change char periodically
        if (Math.random() < 0.003) {
          cp.char = CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]
        }

        ctx.globalAlpha = dAlpha
        ctx.fillStyle = proj.depth < 0 ? "#06d6e0" : "#e84393"
        ctx.fillText(cp.char, proj.x, proj.y)
      }

      // === Orbiting accent dots (5 now) ===
      const orbitColors = ["#06d6e0", "#e84393", "#4f46e5", "#06d6e0", "#e84393"]
      for (let i = 0; i < 5; i++) {
        const orbitAngle = time * (1.2 + i * 0.25) + i * 1.3
        const orbitR = baseRadius * (1.25 + i * 0.12)
        const tilt = [0.3, -0.5, 1.2, -0.8, 0.6][i]
        let dp: Point3D = { x: Math.cos(orbitAngle) * orbitR, y: 0, z: Math.sin(orbitAngle) * orbitR }
        dp = rotateX(dp, tilt)
        dp = rotateY(dp, rotYAngle)
        dp = rotateX(dp, rotXAngle)
        const proj = project(dp, cx, cy, fov)

        // Trail
        const trailGrad = ctx.createRadialGradient(proj.x, proj.y, 0, proj.x, proj.y, 25)
        trailGrad.addColorStop(0, `${orbitColors[i]}90`)
        trailGrad.addColorStop(1, `${orbitColors[i]}00`)
        ctx.globalAlpha = 0.7
        ctx.fillStyle = trailGrad
        ctx.fillRect(proj.x - 25, proj.y - 25, 50, 50)

        ctx.beginPath()
        ctx.arc(proj.x, proj.y, 3.5 * proj.scale, 0, Math.PI * 2)
        ctx.fillStyle = orbitColors[i]
        ctx.globalAlpha = 0.9
        ctx.fill()
      }

      // === Central energy core ===
      const coreSize = baseRadius * 0.12 + Math.sin(time * 3) * baseRadius * 0.03
      const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreSize)
      coreGrad.addColorStop(0, "rgba(6, 214, 224, 0.25)")
      coreGrad.addColorStop(0.4, "rgba(232, 67, 147, 0.1)")
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
