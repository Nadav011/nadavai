"use client"

import { useEffect, useRef, useCallback } from "react"

interface Particle {
  x: number; y: number
  vx: number; vy: number
  baseSize: number; size: number
  z: number // depth 0=far 1=near
  hue: number // slight color variation
  opacity: number
  pulse: number; pulseSpeed: number
}

interface DataStream {
  fromIdx: number; toIdx: number
  progress: number; speed: number
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
    const COUNT = mobile ? 55 : 110
    const LINK_DIST = mobile ? 100 : 140
    const MOUSE_R = mobile ? 90 : 180
    const SPEED = 0.2
    const MAX_STREAMS = mobile ? 5 : 12

    let cw = 0, ch = 0

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, mobile ? 1.5 : 2)
      cw = window.innerWidth; ch = window.innerHeight
      canvas.width = cw * dpr; canvas.height = ch * dpr
      canvas.style.width = `${cw}px`; canvas.style.height = `${ch}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()

    // Particles with depth (z)
    const particles: Particle[] = Array.from({ length: COUNT }, () => {
      const z = Math.random() // 0=far, 1=near
      return {
        x: Math.random() * cw, y: Math.random() * ch,
        vx: (Math.random() - 0.5) * SPEED * (0.5 + z * 0.5),
        vy: (Math.random() - 0.5) * SPEED * (0.5 + z * 0.5),
        baseSize: 0.6 + z * 2.2, size: 1.5,
        z,
        hue: 180 + Math.random() * 12, // 180-192 range (cyan to teal)
        opacity: 0.12 + z * 0.55,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.006 + Math.random() * 0.018,
      }
    })

    const streams: DataStream[] = []
    const activeLinks: [number, number, number][] = []

    // Pulse wave
    let pulseR = 0, pulseA = 0, pulseT = 0
    const PULSE_INT = 5

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

      // Pulse wave
      pulseT += dt
      if (pulseT >= PULSE_INT) { pulseT = 0; pulseR = 0; pulseA = 0.4 }
      if (pulseA > 0) { pulseR += dt * (mobile ? 220 : 350); pulseA -= dt * 0.07 }

      // Sort by z for depth rendering (far first)
      particles.sort((a, b) => a.z - b.z)

      // Update particles
      for (const p of particles) {
        p.pulse += p.pulseSpeed
        p.size = p.baseSize + Math.sin(p.pulse) * 0.4 * p.z

        // Pulse wave interaction
        if (pulseA > 0) {
          const dc = Math.sqrt((p.x - cw * 0.5) ** 2 + (p.y - ch * 0.5) ** 2)
          const rd = Math.abs(dc - pulseR)
          if (rd < 50) {
            const boost = (1 - rd / 50) * pulseA
            p.size += boost * 2
            p.opacity = Math.min(1, p.opacity + boost * 0.3)
          }
        }

        // Mouse interaction (strength based on z depth)
        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MOUSE_R && dist > 0) {
            const force = (MOUSE_R - dist) / MOUSE_R * (0.5 + p.z * 0.5)
            p.vx += (dx / dist) * force * 0.1
            p.vy += (dy / dist) * force * 0.1
          }
        }

        p.vx *= 0.99; p.vy *= 0.99
        const spd = Math.sqrt(p.vx * p.vx + p.vy * p.vy)
        if (spd < SPEED * 0.2) { p.vx += (Math.random() - 0.5) * 0.03; p.vy += (Math.random() - 0.5) * 0.03 }
        if (spd > SPEED * 3) { p.vx *= 0.94; p.vy *= 0.94 }

        p.x += p.vx; p.y += p.vy
        if (p.x < -40) p.x = cw + 40; if (p.x > cw + 40) p.x = -40
        if (p.y < -40) p.y = ch + 40; if (p.y > ch + 40) p.y = -40

        // Restore opacity
        p.opacity += (0.12 + p.z * 0.55 - p.opacity) * 0.02
      }

      // Find active connections (only between particles of similar depth)
      activeLinks.length = 0
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i], b = particles[j]
          const zDiff = Math.abs(a.z - b.z)
          if (zDiff > 0.5) continue // don't connect far/near particles
          const dx = a.x - b.x, dy = a.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          const adjustedDist = LINK_DIST * (0.6 + (a.z + b.z) * 0.25)
          if (dist < adjustedDist) {
            activeLinks.push([i, j, (1 - dist / adjustedDist)])
          }
        }
      }

      // Spawn data streams
      if (streams.length < MAX_STREAMS && activeLinks.length > 0 && Math.random() < 0.025) {
        const [fi, fj] = activeLinks[Math.floor(Math.random() * activeLinks.length)]
        streams.push({ fromIdx: fi, toIdx: fj, progress: 0, speed: 0.5 + Math.random() * 1 })
      }

      // Draw pulse wave
      if (pulseA > 0.01) {
        ctx.beginPath()
        ctx.arc(cw * 0.5, ch * 0.5, pulseR, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(6, 214, 224, ${pulseA * 0.25})`
        ctx.lineWidth = 1.5
        ctx.stroke()
        const rg = ctx.createRadialGradient(cw * 0.5, ch * 0.5, Math.max(0, pulseR - 30), cw * 0.5, ch * 0.5, pulseR + 30)
        rg.addColorStop(0, "rgba(6, 214, 224, 0)")
        rg.addColorStop(0.5, `rgba(6, 214, 224, ${pulseA * 0.06})`)
        rg.addColorStop(1, "rgba(6, 214, 224, 0)")
        ctx.fillStyle = rg
        ctx.fillRect(0, 0, cw, ch)
      }

      // Draw connections -- color/width based on average z-depth
      for (const [i, j, rawOp] of activeLinks) {
        const a = particles[i], b = particles[j]
        const avgZ = (a.z + b.z) / 2
        let op = rawOp * (0.08 + avgZ * 0.22)

        // Mouse proximity boost
        if (mouse.active) {
          const mx = (a.x + b.x) / 2 - mouse.x, my = (a.y + b.y) / 2 - mouse.y
          const md = Math.sqrt(mx * mx + my * my)
          if (md < MOUSE_R * 1.3) op += (1 - md / (MOUSE_R * 1.3)) * 0.3 * avgZ
        }

        const lum = Math.round(55 + avgZ * 30) // 55-85% lightness
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.strokeStyle = `hsla(${Math.round((a.hue + b.hue) / 2)}, 90%, ${lum}%, ${Math.min(op, 0.5)})`
        ctx.lineWidth = 0.4 + avgZ * 0.6
        ctx.stroke()
      }

      // Draw data streams
      for (let s = streams.length - 1; s >= 0; s--) {
        const st = streams[s]
        st.progress += st.speed * dt
        if (st.progress >= 1) { streams.splice(s, 1); continue }

        const a = particles[st.fromIdx], b = particles[st.toIdx]
        const sx = a.x + (b.x - a.x) * st.progress
        const sy = a.y + (b.y - a.y) * st.progress
        const avgZ = (a.z + b.z) / 2
        const fadeIn = Math.min(st.progress * 5, 1)
        const fadeOut = Math.min((1 - st.progress) * 5, 1)
        const alpha = fadeIn * fadeOut

        // Bright glow
        const r = 2 + avgZ * 1.5
        const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 5)
        glow.addColorStop(0, `rgba(6, 214, 224, ${alpha * 0.35})`)
        glow.addColorStop(0.4, `rgba(6, 214, 224, ${alpha * 0.08})`)
        glow.addColorStop(1, "rgba(6, 214, 224, 0)")
        ctx.fillStyle = glow
        ctx.fillRect(sx - r * 5, sy - r * 5, r * 10, r * 10)

        // White-cyan core
        ctx.beginPath()
        ctx.arc(sx, sy, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(200, 255, 255, ${alpha * 0.85})`
        ctx.fill()

        // Trail
        for (let t = 1; t <= 4; t++) {
          const tp = st.progress - t * 0.018 * st.speed
          if (tp < 0) break
          const tx = a.x + (b.x - a.x) * tp
          const ty = a.y + (b.y - a.y) * tp
          ctx.beginPath()
          ctx.arc(tx, ty, r * (1 - t / 5), 0, Math.PI * 2)
          ctx.fillStyle = `rgba(6, 214, 224, ${alpha * (1 - t / 5) * 0.35})`
          ctx.fill()
        }
      }

      // Draw particles -- layered by depth
      for (const p of particles) {
        let extraGlow = 0
        if (mouse.active) {
          const dx = p.x - mouse.x, dy = p.y - mouse.y
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < MOUSE_R) extraGlow = (1 - d / MOUSE_R) * 0.5 * p.z
        }
        const totalOp = Math.min(1, p.opacity + extraGlow)
        const lum = 55 + p.z * 35 // far=55% near=90%
        const sat = 85 + p.z * 10

        // Bloom halo (only for near particles or mouse-boosted)
        if (p.z > 0.4 || extraGlow > 0.1) {
          const hr = (p.size + extraGlow * 3) * (3 + p.z * 4)
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, hr)
          g.addColorStop(0, `hsla(${Math.round(p.hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${totalOp * 0.1})`)
          g.addColorStop(1, `hsla(${Math.round(p.hue)}, 90%, 60%, 0)`)
          ctx.fillStyle = g
          ctx.fillRect(p.x - hr, p.y - hr, hr * 2, hr * 2)
        }

        // Core dot
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size + extraGlow, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${Math.round(p.hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%, ${totalOp})`
        ctx.fill()

        // Hot white center for near particles
        if (p.z > 0.65) {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size * 0.3, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(255, 255, 255, ${totalOp * 0.6 * p.z})`
          ctx.fill()
        }
      }

      // Center depth glow -- warm center
      const cg = ctx.createRadialGradient(cw * 0.5, ch * 0.45, 0, cw * 0.5, ch * 0.45, cw * 0.35)
      cg.addColorStop(0, "rgba(6, 214, 224, 0.035)")
      cg.addColorStop(0.3, "rgba(6, 214, 224, 0.012)")
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
