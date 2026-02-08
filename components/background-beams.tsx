"use client"

import { useMemo } from "react"
import { motion } from "motion/react"

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

interface BackgroundBeamsProps {
  className?: string
  beamCount?: number
}

export function BackgroundBeams({ className = "", beamCount = 6 }: BackgroundBeamsProps) {
  const beams = useMemo(
    () =>
      Array.from({ length: beamCount }).map((_, i) => ({
        x: seededRandom(i * 3) * 100,
        delay: seededRandom(i * 7) * 4,
        duration: 6 + seededRandom(i * 11) * 8,
        width: 1 + seededRandom(i * 13) * 2,
        opacity: 0.03 + seededRandom(i * 17) * 0.06,
      })),
    [beamCount]
  )

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {beams.map((beam, i) => (
        <motion.div
          key={i}
          className="absolute top-0 h-full"
          style={{
            insetInlineStart: `${beam.x}%`,
            width: `${beam.width}px`,
            background: `linear-gradient(to bottom, transparent, #06d6e0, transparent)`,
            opacity: beam.opacity,
          }}
          initial={{ translateY: "-100%" }}
          animate={{ translateY: "100%" }}
          transition={{
            duration: beam.duration,
            delay: beam.delay,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </div>
  )
}
