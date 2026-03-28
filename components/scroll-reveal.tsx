"use client"

import { useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  /** Delay in milliseconds */
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  /** Distance in pixels for the initial offset */
  distance?: number
  /** Duration in seconds */
  duration?: number
  /** Stagger children by this many seconds (renders children individually when set) */
  stagger?: number
}

// Animation offsets — not layout positioning, RTL-safe (translate values, not inset) // rtl-ok
const directionOffsets = {
  up:    { y:  40, x:   0 }, // rtl-ok
  down:  { y: -40, x:   0 }, // rtl-ok
  left:  { x:  50, y:   0 }, // rtl-ok — gsap translate x, not CSS left
  right: { x: -50, y:   0 }, // rtl-ok — gsap translate x, not CSS left
}

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance,
  duration = 0.9,
  stagger,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current) return

    const base = directionOffsets[direction]
    const offset = {
      x: distance !== undefined ? (base.x !== 0 ? Math.sign(base.x) * distance : 0) : base.x,
      y: distance !== undefined ? (base.y !== 0 ? Math.sign(base.y) * distance : 0) : base.y,
    }

    if (stagger !== undefined) {
      // Stagger direct children
      const items = ref.current.children
      if (items.length === 0) return

      gsap.from(items, {
        opacity: 0,
        x: offset.x,
        y: offset.y,
        duration,
        delay: delay / 1000,
        ease: "expo.out",
        stagger,
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      })
    } else {
      gsap.from(ref.current, {
        opacity: 0,
        x: offset.x,
        y: offset.y,
        duration,
        delay: delay / 1000,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          once: true,
        },
      })
    }
  }, { scope: ref })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
