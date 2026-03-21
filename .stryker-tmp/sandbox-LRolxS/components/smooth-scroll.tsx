// @ts-nocheck
"use client"

import type { ReactNode } from "react"
import { useEffect, useState } from "react"

// Native CSS-only smooth scroll using scroll-behavior
function SmoothScrollCSS({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Enable native smooth scrolling
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])
  return <>{children}</>
}

// Check for reduced motion preference — lazy initializer avoids synchronous setState in effect
function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  )
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])
  return reduced
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  const reducedMotion = usePrefersReducedMotion()
  
  if (reducedMotion) {
    return <>{children}</>
  }
  
  return <SmoothScrollCSS>{children}</SmoothScrollCSS>
}
