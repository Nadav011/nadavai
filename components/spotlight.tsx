"use client"

import { useRef, useCallback, useState, useEffect } from "react"

interface SpotlightProps {
  className?: string
  /** OKLCH color string, e.g. "oklch(0.81 0.17 193)" */
  fill?: string
}

export function Spotlight({
  className = "",
  fill = "oklch(0.81 0.17 193)",
}: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const inViewport = useRef(false)

  const [isMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  )

  // Only animate when element is visible — saves GPU on sections scrolled past
  useEffect(() => {
    const el = containerRef.current
    if (!el || isMobile) return

    const observer = new IntersectionObserver(
      (entries) => { inViewport.current = entries[0]?.isIntersecting ?? false },
      { threshold: 0.01 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [isMobile])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!inViewport.current) return
    const el = containerRef.current
    const grad = gradientRef.current
    const trail = trailRef.current
    if (!el || !grad || !trail) return

    const rect = el.getBoundingClientRect()
    const x = e.clientX - rect.left // rtl-ok — pixel coordinate within element bounds
    const y = e.clientY - rect.top  // rtl-ok

    // Three-layer spotlight: tight core (OKLCH), mid ring, soft bloom
    grad.style.background = `
      radial-gradient(180px circle at ${x}px ${y}px, ${fill} / 0.10, transparent 100%),
      radial-gradient(420px circle at ${x}px ${y}px, ${fill} / 0.06, transparent 60%),
      radial-gradient(800px circle at ${x}px ${y}px, ${fill} / 0.03, transparent 50%)
    `

    // Trail is the desaturated bloom — moves at CSS transition speed (~200ms lag)
    trail.style.background = `radial-gradient(650px circle at ${x}px ${y}px, ${fill} / 0.025, transparent 55%)`
  }, [fill])

  const handleMouseEnter = useCallback(() => {
    const grad = gradientRef.current
    const trail = trailRef.current
    if (!grad || !trail) return
    grad.style.opacity = "1"
    trail.style.opacity = "1"
  }, [])

  const handleMouseLeave = useCallback(() => {
    const grad = gradientRef.current
    const trail = trailRef.current
    if (!grad || !trail) return
    grad.style.opacity = "0"
    trail.style.opacity = "0"
  }, [])

  if (isMobile) return null

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-0 overflow-hidden ${className}`}
      aria-hidden="true"
    >
      {/* Trail layer — delayed via CSS transition */}
      <div
        ref={trailRef}
        className="pointer-events-none absolute -inset-px"
        style={{
          opacity: 0,
          transition: "opacity 0.6s ease-out, background 0.25s ease-out",
          willChange: "background",
        }}
      />
      {/* Main spotlight — snappy */}
      <div
        ref={gradientRef}
        className="pointer-events-none absolute -inset-px"
        style={{
          opacity: 0,
          transition: "opacity 0.4s ease-out, background 0.08s linear",
          willChange: "background",
        }}
      />
    </div>
  )
}
