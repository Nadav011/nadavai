"use client"

import { useRef, useCallback, useEffect, useState } from "react"

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className = "", fill = "#06d6e0" }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)
  const trailRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(window.matchMedia("(max-width: 768px)").matches)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !gradientRef.current || !trailRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Main spotlight - larger, multi-layered
    gradientRef.current.style.background = `
      radial-gradient(800px circle at ${x}px ${y}px, ${fill}06, transparent 40%),
      radial-gradient(400px circle at ${x}px ${y}px, ${fill}0a, transparent 30%),
      radial-gradient(150px circle at ${x}px ${y}px, ${fill}10, transparent 20%)
    `

    // Trail effect - softer, delayed
    trailRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill}04, transparent 50%)`
  }, [fill])

  const handleMouseEnter = useCallback(() => {
    if (!gradientRef.current || !trailRef.current) return
    gradientRef.current.style.opacity = "1"
    trailRef.current.style.opacity = "1"
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!gradientRef.current || !trailRef.current) return
    gradientRef.current.style.opacity = "0"
    trailRef.current.style.opacity = "0"
  }, [])

  if (isMobile) return null

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      {/* Trail layer - slower transition */}
      <div
        ref={trailRef}
        className="pointer-events-none absolute -inset-px"
        style={{
          opacity: 0,
          transition: "opacity 0.6s, background 0.3s ease-out",
        }}
      />
      {/* Main spotlight layer */}
      <div
        ref={gradientRef}
        className="pointer-events-none absolute -inset-px"
        style={{
          opacity: 0,
          transition: "opacity 0.4s, background 0.1s",
        }}
      />
    </div>
  )
}
