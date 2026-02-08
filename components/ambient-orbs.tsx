"use client"

import { useEffect, useState } from "react"

interface Orb {
  id: number
  x: number
  y: number
  size: number
  opacity: number
  duration: number
  delay: number
}

export function AmbientOrbs() {
  const [orbs, setOrbs] = useState<Orb[]>([])

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches
    const count = isMobile ? 4 : 8

    const generated: Orb[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: isMobile ? 180 + Math.random() * 250 : 250 + Math.random() * 450,
      opacity: 0.025 + Math.random() * 0.04,
      duration: 12 + Math.random() * 20,
      delay: Math.random() * -15,
    }))
    setOrbs(generated)
  }, [])

  if (orbs.length === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 1 }} aria-hidden="true">
      {orbs.map((orb) => (
        <div
          key={orb.id}
          className="absolute rounded-full"
          style={{
            left: `${orb.x}%`,
            top: `${orb.y}%`,
            width: orb.size,
            height: orb.size,
            background: `radial-gradient(circle, hsl(187 92% 55% / ${orb.opacity}), transparent 70%)`,
            animation: `ambient-drift-${orb.id % 3} ${orb.duration}s ease-in-out infinite`,
            animationDelay: `${orb.delay}s`,
            transform: "translate(-50%, -50%)",
          }}
        />
      ))}
      <style jsx>{`
        @keyframes ambient-drift-0 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          25% { transform: translate(-50%, -50%) translate(30px, -40px); }
          50% { transform: translate(-50%, -50%) translate(-20px, 20px); }
          75% { transform: translate(-50%, -50%) translate(15px, 35px); }
        }
        @keyframes ambient-drift-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          33% { transform: translate(-50%, -50%) translate(-35px, 25px); }
          66% { transform: translate(-50%, -50%) translate(25px, -30px); }
        }
        @keyframes ambient-drift-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          20% { transform: translate(-50%, -50%) translate(20px, 30px); }
          40% { transform: translate(-50%, -50%) translate(-30px, -15px); }
          60% { transform: translate(-50%, -50%) translate(10px, -35px); }
          80% { transform: translate(-50%, -50%) translate(-15px, 20px); }
        }
      `}</style>
    </div>
  )
}
