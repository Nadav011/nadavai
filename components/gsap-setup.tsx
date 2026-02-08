"use client"

import { useEffect } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export function GSAPSetup() {
  useEffect(() => {
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
    return () => mq.removeEventListener("change", handleChange)
  }, [])

  return null
}
