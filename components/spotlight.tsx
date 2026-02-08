"use client"

import { useRef, useCallback } from "react"

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className = "", fill = "#06d6e0" }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const gradientRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current || !gradientRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    gradientRef.current.style.background = `radial-gradient(600px circle at ${x}px ${y}px, ${fill}08, transparent 40%)`
  }, [fill])

  const handleMouseEnter = useCallback(() => {
    if (!gradientRef.current) return
    gradientRef.current.style.opacity = "1"
  }, [])

  const handleMouseLeave = useCallback(() => {
    if (!gradientRef.current) return
    gradientRef.current.style.opacity = "0"
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <div
        ref={gradientRef}
        className="pointer-events-none absolute -inset-px"
        style={{
          opacity: 0,
          transition: "opacity 0.4s",
        }}
      />
    </div>
  )
}
