"use client"

import { ReactLenis, useLenis } from "lenis/react"
import type { ReactNode } from "react"
import { useEffect, useRef } from "react"

// Lazily sync Lenis with ScrollTrigger — avoids pulling gsap/ScrollTrigger into the initial bundle
function LenisGSAPSync() {
  const stRef = useRef<{ update: () => void } | null>(null)

  useEffect(() => {
    // Dynamically import ScrollTrigger so it's deferred from the critical bundle
    import("gsap/ScrollTrigger").then(({ ScrollTrigger }) => {
      stRef.current = ScrollTrigger
    })
  }, [])

  useLenis(() => {
    stRef.current?.update()
  })
  return null
}

export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.1,
        duration: 1.2,
        smoothWheel: true,
      }}
    >
      <LenisGSAPSync />
      {children}
    </ReactLenis>
  )
}
