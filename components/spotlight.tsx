"use client"

import { useRef, useState, useCallback } from "react"
import { motion } from "motion/react"

interface SpotlightProps {
  className?: string
  fill?: string
}

export function Spotlight({ className = "", fill = "#06d6e0" }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={`absolute inset-0 overflow-hidden ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px"
        animate={{ opacity }}
        transition={{ duration: 0.4 }}
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${fill}08, transparent 40%)`,
        }}
      />
    </div>
  )
}
