"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number; y: number
  vx: number; vy: number
  size: number
  z: number
  hue: number
  opacity: number
  pulse: number; pulseSpeed: number
}

export function GlobalParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999 })
  const frameRef = useRef(0)
  const scrollRef = useRef(0)

  const onMove = useCallback((e: MouseEvent) => {
    mouseRef.current = { x: e.clientX, y: e.clientY }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const mobile = window.innerWidth < 768
    const COUNT = mobile ? 35 : 70
    const LINK_DIST = mobile ? 110 : 160
    const MOUSE_R = mobile ? 80 : 150
    const SPEED = 0.15

    let cw = 0, ch = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, mobile ? 1 : 1.5)
      cw = window.innerWidth
      ch = window.innerHeight
      canvas.width = cw * dpr
      canvas.height = ch * dpr
      canvas.style.width = `${cw}px`
      canvas.style.height = `${ch}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Create particles spread across the viewport
    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const z = Math.random()
      return {
        x: Math.random() * cw,
        y: Math.random() * ch,
        vx: (Math.random() - 0.5) * SPEED * (0.4 + z * 0.6),
        vy: (Math.random() - 0.5) * SPEED * (0.4 + z * 0.6),
        size: 0.4 + z * 1.6,
        z,
        hue: 180 + Math.random() * 12,
        opacity: 0.08 + z * 0.35,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.004 + Math.random() * 0.012,
      }
    })

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)

    const onScroll = () => { scrollRef.current = window.scrollY }
    window.addEventListener("scroll", onScroll, { passive: true })

    let lastTime = performance.now()

    const animate = (now: number) => {
      frameRef.current = requestAnimationFrame(animate)
      if (document.hidden) return

      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      ctx.clearRect(0, 0, cw, ch)

      const mouse = mouseRef.current

      // Update particles
      for (const p of particles) {
        p.pulse += p.pulseSpeed
        const sizeMod = Math.sin(p.pulse) * 0.25 * p.z

        // Mouse repulsion
        const dx = p.x - mouse.x
        const dy = p.y - mouse.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < MOUSE_R && dist > 0) {
          const force = (MOUSE_R - dist) / MOUSE_R * (0.3 + p.z * 0.4)
          p.vx += (dx / dist) * force * 0.05
          p.vy += (dy / dist) * force * 0.05
        }

        // Damping and drift
        p.vx *= 0.995
        p.vy *= 0.995
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd < SPEED * 0.15) {
          p.vx += (Math.random() - 0.5) * 0.02
          p.vy += (Math.random() - 0.5) * 0.02
        }

        p.x += p.vx
        p.y += p.vy

        // Wrap around viewport
        if (p.x < -20) p.x = cw + 20
        if (p.x > cw + 20) p.x = -20
        if (p.y < -20) p.y = ch + 20
        if (p.y > ch + 20) p.y = -20

        // Draw connections to nearby particles
        for (const q of particles) {
          if (q === p) continue
          const zDiff = Math.abs(p.z - q.z)
          if (zDiff > 0.45) continue
          const cdx = p.x - q.x
          const cdy = p.y - q.y
          const cdist = Math.sqrt(cdx * cdx + cdy * cdy)
          const adjustedDist = LINK_DIST * (0.5 + (p.z + q.z) * 0.3)
          if (cdist < adjustedDist && cdist > 0) {
            const avgZ = (p.z + q.z) / 2
            let op = (1 - cdist / adjustedDist) * (0.04 + avgZ * 0.12)

            // Mouse proximity brightens connections
            if (dist < MOUSE_R * 1.5) {
              op += (1 - dist / (MOUSE_R * 1.5)) * 0.08 * avgZ
            }

            const lum = Math.round(50 + avgZ * 30)
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `hsla(${Math.round((p.hue + q.hue) / 2)}, 85%, ${lum}%, ${Math.min(op, 0.3)})`
            ctx.lineWidth = 0.3 + avgZ * 0.4
            ctx.stroke()
          }
        }

        // Draw particle
        const totalSize = p.size + sizeMod
        const lum = 50 + p.z * 35
        const sat = 80 + p.z * 15

        // Bloom halo for near particles
        if (p.z > 0.5) {
          const hr = totalSize * (2 + p.z * 3)
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, hr)
          g.addColorStop(0, `hsla(${Math.round(p.hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${p.opacity * 0.06})`)
          g.addColorStop(1, `hsla(${Math.round(p.hue)}, 85%, 55%, 0)`)
          ctx.fillStyle = g
          ctx.fillRect(p.x - hr, p.y - hr, hr * 2, hr * 2)
        }

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, totalSize, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${Math.round(p.hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${p.opacity})`
        ctx.fill()

        // White center for near particles
        if (p.z > 0.7) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, totalSize * 0.25, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(220, 255, 255, ${p.opacity * 0.4})`
          ctx.fill()
        }
      }
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("scroll", onScroll)
    }
  }, [onMove])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
