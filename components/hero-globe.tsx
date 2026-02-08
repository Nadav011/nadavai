"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number; y: number
  vx: number; vy: number
  baseSize: number; size: number
  opacity: number
  pulse: number; pulseSpeed: number
}

interface DataStream {
  fromIdx: number; toIdx: number
  progress: number; speed: number
  life: number
}

export function HeroGlobe() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const frameRef = useRef(0)

  const onMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top, active: true }
  }, [])

  const onLeave = useCallback(() => { mouseRef.current.active = false }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const mobile = window.innerWidth < 768
    const COUNT = mobile ? 50 : 100
    const LINK_DIST = mobile ? 110 : 150
    const MOUSE_R = mobile ? 100 : 200
    const SPEED = 0.25

    let cw = 0, ch = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, mobile ? 1.5 : 2)
      cw = window.innerWidth; ch = window.innerHeight
      canvas.width = cw * dpr; canvas.height = ch * dpr
      canvas.style.width = `${cw}px`; canvas.style.height = `${ch}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Initialize particles
    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * cw, y: Math.random() * ch,
      vx: (Math.random() - 0.5) * SPEED, vy: (Math.random() - 0.5) * SPEED,
      baseSize: 1 + Math.random() * 1.8, size: 1.5,
      opacity: 0.2 + Math.random() * 0.5,
      pulse: Math.random() * Math.PI * 2, pulseSpeed: 0.008 + Math.random() * 0.02,
    }))

    // Data streams -- small bright dots that travel along connections
    const streams: DataStream[] = []
    const MAX_STREAMS = mobile ? 6 : 14

    // Pulse waves that ripple from center
    let pulseWaveRadius = 0
    let pulseWaveAlpha = 0
    let pulseTimer = 0
    const PULSE_INTERVAL = 4 // seconds between pulses

    // Pair cache for active connections
    const activeLinks: [number, number, number][] = [] // [i, j, opacity]

    window.addEventListener("resize", resize)
    window.addEventListener("mousemove", onMove)
    window.addEventListener("mouseleave", onLeave)

    const onTouch = (e: TouchEvent) => {
      if (!e.touches.length) return
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top, active: true }
    }
    const onTouchEnd = () => { mouseRef.current.active = false }
    if (mobile) {
      window.addEventListener("touchmove", onTouch, { passive: true })
      window.addEventListener("touchend", onTouchEnd)
    }

    let lastTime = performance.now()

    const animate = (now: number) => {
      frameRef.current = requestAnimationFrame(animate)
      if (document.hidden) return

      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now
      ctx.clearRect(0, 0, cw, ch)
      const mouse = mouseRef.current

      // -- Update pulse wave --
      pulseTimer += dt
      if (pulseTimer >= PULSE_INTERVAL) {
        pulseTimer = 0
        pulseWaveRadius = 0
        pulseWaveAlpha = 0.35
      }
      if (pulseWaveAlpha > 0) {
        pulseWaveRadius += dt * (mobile ? 250 : 400)
        pulseWaveAlpha -= dt * 0.08
      }

      // -- Update particles --
      for (const p of particles) {
        p.pulse += p.pulseSpeed
        p.size = p.baseSize + Math.sin(p.pulse) * 0.5

        // Pulse wave boost: particles near the ring get brighter momentarily
        if (pulseWaveAlpha > 0) {
          const distToCenter = Math.sqrt((p.x - cw * 0.5) ** 2 + (p.y - ch * 0.5) ** 2)
          const ringDist = Math.abs(distToCenter - pulseWaveRadius)
          if (ringDist < 40) {
            p.size += (1 - ringDist / 40) * 1.5 * pulseWaveAlpha
          }
        }

        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_R && dist > 0) {
            const force = (MOUSE_R - dist) / MOUSE_R
            p.vx += (dx / dist) * force * 0.12
            p.vy += (dy / dist) * force * 0.12
          }
        }

        p.vx *= 0.99; p.vy *= 0.99
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd < SPEED * 0.3) { p.vx += (Math.random() - 0.5) * 0.04; p.vy += (Math.random() - 0.5) * 0.04 }
        if (spd > SPEED * 3) { p.vx *= 0.95; p.vy *= 0.95 }

        p.x += p.vx; p.y += p.vy
        if (p.x < -30) p.x = cw + 30; if (p.x > cw + 30) p.x = -30
        if (p.y < -30) p.y = ch + 30; if (p.y > ch + 30) p.y = -30
      }

      // -- Find active connections --
      activeLinks.length = 0
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < LINK_DIST) {
            activeLinks.push([i, j, (1 - dist / LINK_DIST)])
          }
        }
      }

      // -- Spawn data streams on random active links --
      if (streams.length < MAX_STREAMS && activeLinks.length > 0 && Math.random() < 0.03) {
        const [fi, fj] = activeLinks[Math.floor(Math.random() * activeLinks.length)]
        streams.push({ fromIdx: fi, toIdx: fj, progress: 0, speed: 0.6 + Math.random() * 1.2, life: 1 })
      }

      // -- Draw pulse wave ring --
      if (pulseWaveAlpha > 0.01) {
        ctx.beginPath()
        ctx.arc(cw * 0.5, ch * 0.5, pulseWaveRadius, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(6, 214, 224, ${pulseWaveAlpha * 0.3})`
        ctx.lineWidth = 2
        ctx.stroke()
        // Soft glow ring
        const rGlow = ctx.createRadialGradient(cw * 0.5, ch * 0.5, Math.max(0, pulseWaveRadius - 20), cw * 0.5, ch * 0.5, pulseWaveRadius + 20)
        rGlow.addColorStop(0, `rgba(6, 214, 224, 0)`)
        rGlow.addColorStop(0.5, `rgba(6, 214, 224, ${pulseWaveAlpha * 0.08})`)
        rGlow.addColorStop(1, `rgba(6, 214, 224, 0)`)
        ctx.fillStyle = rGlow
        ctx.fillRect(0, 0, cw, ch)
      }

      // -- Draw connections --
      for (const [i, j, rawOp] of activeLinks) {
        const a = particles[i], b = particles[j]
        let op = rawOp * 0.22

        // Mouse proximity boost
        if (mouse.active) {
          const mx = (a.x + b.x) / 2 - mouse.x, my = (a.y + b.y) / 2 - mouse.y
          const md = Math.sqrt(mx * mx + my * my)
          if (md < MOUSE_R * 1.5) op += (1 - md / (MOUSE_R * 1.5)) * 0.35
        }

        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `rgba(6, 214, 224, ${Math.min(op, 0.6)})`
        ctx.lineWidth = 0.7
        ctx.stroke()
      }

      // -- Draw & update data streams --
      for (let s = streams.length - 1; s >= 0; s--) {
        const st = streams[s]
        st.progress += st.speed * dt
        if (st.progress >= 1) { streams.splice(s, 1); continue }

        const a = particles[st.fromIdx], b = particles[st.toIdx]
        const sx = a.x + (b.x - a.x) * st.progress
        const sy = a.y + (b.y - a.y) * st.progress
        const fadeIn = Math.min(st.progress * 4, 1)
        const fadeOut = Math.min((1 - st.progress) * 4, 1)
        const alpha = fadeIn * fadeOut

        // Bright dot
        const r = 2.5
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 6)
        glow.addColorStop(0, `rgba(6, 214, 224, ${alpha * 0.5})`)
        glow.addColorStop(0.3, `rgba(6, 214, 224, ${alpha * 0.15})`)
        glow.addColorStop(1, "rgba(6, 214, 224, 0)")
        ctx.fillStyle = glow
        ctx.fillRect(sx - r * 6, sy - r * 6, r * 12, r * 12)

        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(180, 255, 255, ${alpha * 0.9})`
        ctx.fill()

        // Trail
        const trailLen = 5
        for (let t = 1; t <= trailLen; t++) {
          const tp = st.progress - t * 0.02 * st.speed
          if (tp < 0) break
          const tx = a.x + (b.x - a.x) * tp
          const ty = a.y + (b.y - a.y) * tp
          const ta = alpha * (1 - t / trailLen) * 0.4
          ctx.beginPath()
          ctx.arc(tx, ty, r * (1 - t / trailLen * 0.6), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(6, 214, 224, ${ta})`
          ctx.fill()
        }
      }

      // -- Draw particles --
      for (const p of particles) {
        let extraGlow = 0
        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MOUSE_R) extraGlow = (1 - d / MOUSE_R) * 0.6
        }
        const totalOp = Math.min(1, p.opacity + extraGlow)

        // Glow halo for larger particles or near mouse
        if (p.baseSize > 1.4 || extraGlow > 0.1) {
          const gr = (p.size + extraGlow * 4) * 5
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, gr)
          g.addColorStop(0, `rgba(6, 214, 224, ${totalOp * 0.12})`)
          g.addColorStop(1, "rgba(6, 214, 224, 0)")
          ctx.fillStyle = g
          ctx.fillRect(p.x - gr, p.y - gr, gr * 2, gr * 2)
        }

        // Core
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size + extraGlow * 1.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(6, 214, 224, ${totalOp})`
        ctx.fill()

        // White center for big particles
        if (p.baseSize > 1.6) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.35, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${totalOp * 0.7})`
          ctx.fill()
        }
      }

      // -- Center glow --
      const cg = ctx.createRadialGradient(cw * 0.5, ch * 0.45, 0, cw * 0.5, ch * 0.45, cw * 0.4)
      cg.addColorStop(0, "rgba(6, 214, 224, 0.04)")
      cg.addColorStop(0.4, "rgba(6, 214, 224, 0.012)")
      cg.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = cg
      ctx.fillRect(0, 0, cw, ch)
    }

    frameRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(frameRef.current)
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", onMove)
      window.removeEventListener("mouseleave", onLeave)
      if (mobile) { window.removeEventListener("touchmove", onTouch); window.removeEventListener("touchend", onTouchEnd) }
    }
  }, [onMove, onLeave])

  return (
    <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ zIndex: 1 }} aria-hidden="true" />
  )
}
