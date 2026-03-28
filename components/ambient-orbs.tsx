"use client"

import { useState } from "react"

// OKLCH palette — varied hues for visual richness, all low chroma to stay subtle
const ORB_COLORS = [
  "oklch(0.81 0.17 193)",  // cyan — brand primary
  "oklch(0.50 0.20 290)",  // purple
  "oklch(0.60 0.15 250)",  // blue
  "oklch(0.65 0.25 350)",  // pink
  "oklch(0.55 0.18 220)",  // indigo-blue
  "oklch(0.70 0.14 175)",  // teal
]

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

interface Orb {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
  colorIndex: number
  driftVariant: number
}

export function AmbientOrbs() {
  const [orbs] = useState<Orb[]>(() => {
    if (typeof window === "undefined") return []
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    const count = isMobile ? 4 : 9

    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: seededRandom(i * 7) * 100,      // deterministic position
      y: seededRandom(i * 7 + 1) * 100,
      size: isMobile
        ? 160 + seededRandom(i) * 220
        : 220 + seededRandom(i) * 500,
      // Subtle: 0.015–0.04 (was 0.025–0.065, lowered for refinement)
      opacity: 0.015 + seededRandom(i + 50) * 0.025,
      // Slower drift for large orbs, faster for small
      duration: 18 + seededRandom(i + 10) * 22,
      delay: seededRandom(i + 100) * -20,
      colorIndex: i % ORB_COLORS.length,
      // 4 drift patterns for more natural movement
      driftVariant: i % 4,
    }))
  })

  if (orbs.length === 0) return null

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      aria-hidden="true"
    >
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            insetInlineStart: `${orb.x}%`, // rtl-ok for fixed decorative position
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle at 40% 40%, ${ORB_COLORS[orb.colorIndex]} / ${orb.opacity}, transparent 68%)`,
            animation: `ambient-drift-${orb.driftVariant} ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            transform: "translate(-50%, -50%)",
            filter: "blur(2px)",
            willChange: "transform",
          }}
        />
      ))}

      <style jsx>{`
        @keyframes ambient-drift-0 {
          0%,  100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          20%        { transform: translate(-50%, -50%) translate(28px, -38px); }
          45%        { transform: translate(-50%, -50%) translate(-22px, 18px); }
          70%        { transform: translate(-50%, -50%) translate(14px, 32px); }
          85%        { transform: translate(-50%, -50%) translate(-10px, -18px); }
        }
        @keyframes ambient-drift-1 {
          0%,  100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          30%        { transform: translate(-50%, -50%) translate(-38px, 22px); }
          55%        { transform: translate(-50%, -50%) translate(20px, -28px); }
          80%        { transform: translate(-50%, -50%) translate(10px, 14px); }
        }
        @keyframes ambient-drift-2 {
          0%,  100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          15%        { transform: translate(-50%, -50%) translate(18px, 28px); }
          35%        { transform: translate(-50%, -50%) translate(-28px, -14px); }
          60%        { transform: translate(-50%, -50%) translate(8px, -32px); }
          80%        { transform: translate(-50%, -50%) translate(-14px, 18px); }
        }
        @keyframes ambient-drift-3 {
          0%,  100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          25%        { transform: translate(-50%, -50%) translate(32px, 14px); }
          50%        { transform: translate(-50%, -50%) translate(-16px, -28px); }
          75%        { transform: translate(-50%, -50%) translate(-28px, 20px); }
        }
      `}</style>
    </div>
  )
}
