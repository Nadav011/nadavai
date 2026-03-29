"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { SplitText } from "gsap/SplitText"
import Lenis from "lenis"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText)
}

let lenisInstance: Lenis | null = null

export function getLenis() {
  return lenisInstance
}

export function GSAPSetup() {
  useEffect(() => {
    // Lenis smooth scroll init
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    })
    lenisInstance = lenis

    // 3 required Lenis <-> GSAP/ScrollTrigger sync lines
    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add((t) => lenis.raf(t * 1000))
    gsap.ticker.lagSmoothing(0)

    // Reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (mq.matches) {
      gsap.globalTimeline.timeScale(20)
      gsap.defaults({ duration: 0 })
    }

    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        gsap.globalTimeline.timeScale(20)
        gsap.defaults({ duration: 0 })
      } else {
        gsap.globalTimeline.timeScale(1)
        gsap.defaults({ duration: 1 })
      }
    }

    mq.addEventListener("change", handleChange)

    return () => {
      mq.removeEventListener("change", handleChange)
      lenis.destroy()
      lenisInstance = null
    }
  }, [])

  return null
}
