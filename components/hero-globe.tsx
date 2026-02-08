"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseSize: number
  size: number
  opacity: number
  pulse: number
  pulseSpeed: number
}

export function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const frameRef = useRef(0)
  const particlesRef = useRef<Particle[]>([])
  const dimRef = useRef({ w: 0, h: 0 })

  const onMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current.x = e.clientX - rect.left
    mouseRef.current.y = e.clientY - rect.top
    mouseRef.current.active = true
  }, [])

  const onLeave = useCallback(() => {
    mouseRef.current.active = false
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const mobile = window.innerWidth < 768

    // Particle count - fewer on mobile
    const PARTICLE_COUNT = mobile ? 45 : 90
    const LINK_DISTANCE = mobile ? 120 : 160
    const MOUSE_RADIUS = mobile ? 100 : 180
    const BASE_SPEED = 0.3

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, mobile ? 1.5 : 2)
      const w = window.innerWidth
      const h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      dimRef.current = { w, h }
    }
    resize()

    // Initialize particles
    const { w, h } = dimRef.current
    const particles: Particle[] = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * BASE_SPEED,
        vy: (Math.random() - 0.5) * BASE_SPEED,
        baseSize: 1 + Math.random() * 1.5,
        size: 1 + Math.random() * 1.5,
        opacity: 0.2 + Math.random() * 0.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.01 + Math.random() * 0.02,
      })
    }
    particlesRef.current = particles

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)

    const onTouch = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const rect = canvas.getBoundingClientRect()
        mouseRef.current.x = e.touches[0].clientX - rect.left
        mouseRef.current.y = e.touches[0].clientY - rect.top
        mouseRef.current.active = true
      }
    }
    const onTouchEnd = () => { mouseRef.current.active = false }

    if (mobile) {
      window.addEventListener("touchmove", onTouch, { passive: true })
      window.addEventListener("touchend", onTouchEnd)
    }

    const animate = () => {
      if (document.hidden) {
        frameRef.current = requestAnimationFrame(animate)
        return
      }

      const { w: cw, h: ch } = dimRef.current
      ctx.clearRect(0, 0, cw, ch)

      const mouse = mouseRef.current

      // Update particles
      for (const p of particles) {
        p.pulse += p.pulseSpeed
        p.size = p.baseSize + Math.sin(p.pulse) * 0.4

        // Mouse interaction - gentle repulsion/attraction
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS && dist > 0) {
            const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS
            const angle = Math.atan2(dy, dx)
            // Gentle push away
            p.vx += Math.cos(angle) * force * 0.15
            p.vy += Math.sin(angle) * force * 0.15
          }
        }

        // Friction
        p.vx *= 0.99
        p.vy *= 0.99

        // Return to base speed if too slow
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (speed < BASE_SPEED * 0.3) {
          p.vx += (Math.random() - 0.5) * 0.05
          p.vy += (Math.random() - 0.5) * 0.05
        }

        // Clamp max speed
        if (speed > BASE_SPEED * 3) {
          p.vx *= 0.95
          p.vy *= 0.95
        }

        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -20) p.x = cw + 20
        if (p.x > cw + 20) p.x = -20
        if (p.y < -20) p.y = ch + 20
        if (p.y > ch + 20) p.y = -20
      }

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < LINK_DISTANCE) {
            const opacity = (1 - dist / LINK_DISTANCE) * 0.15

            // Brighter near mouse
            let mouseBright = 0
            if (mouse.active) {
              const mx1 = particles[i].x - mouse.x
              const my1 = particles[i].y - mouse.y
              const md1 = Math.sqrt(mx1 * mx1 + my1 * my1)
              const mx2 = particles[j].x - mouse.x
              const my2 = particles[j].y - mouse.y
              const md2 = Math.sqrt(mx2 * mx2 + my2 * my2)
              const minMd = Math.min(md1, md2)
              if (minMd < MOUSE_RADIUS * 1.5) {
                mouseBright = (1 - minMd / (MOUSE_RADIUS * 1.5)) * 0.25
              }
            }

            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.strokeStyle = `rgba(6, 214, 224, ${opacity + mouseBright})`
            ctx.lineWidth = 0.5
            ctx.stroke()
          }
        }
      }

      // Draw particles
      for (const p of particles) {
        // Mouse proximity glow
        let extraGlow = 0
        if (mouse.active) {
          const dx = p.x - mouse.x
          const dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_RADIUS) {
            extraGlow = (1 - dist / MOUSE_RADIUS) * 0.6
          }
        }

        const totalOpacity = Math.min(1, p.opacity + extraGlow)

        // Soft glow
        if (p.baseSize > 1.5 || extraGlow > 0.1) {
          const glowR = (p.size + extraGlow * 4) * 4
          const glow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, glowR)
          glow.addColorStop(0, `rgba(6, 214, 224, ${totalOpacity * 0.15})`)
          glow.addColorStop(1, "rgba(6, 214, 224, 0)")
          ctx.fillStyle = glow
          ctx.fillRect(p.x - glowR, p.y - glowR, glowR * 2, glowR * 2)
        }

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size + extraGlow * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 214, 224, ${totalOpacity})`
        ctx.fill()

        // White center for bigger particles
        if (p.baseSize > 1.8) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.4, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${totalOpacity * 0.6})`
          ctx.fill()
        }
      }

      // Central subtle glow - gives depth, like a light source in center
      const centerGlow = ctx.createRadialGradient(cw * 0.5, ch * 0.45, 0, cw * 0.5, ch * 0.45, cw * 0.35)
      centerGlow.addColorStop(0, "rgba(6, 214, 224, 0.015)")
      centerGlow.addColorStop(0.5, "rgba(6, 214, 224, 0.005)")
      centerGlow.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = centerGlow
      ctx.fillRect(0, 0, cw, ch)

      frameRef.current = requestAnimationFrame(animate)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
      if (mobile) {
        window.removeEventListener("touchmove", onTouch)
        window.removeEventListener("touchend", onTouchEnd)
      }
    }
  }, [onMove, onLeave])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  )
}
