"use client"

import { ReactLenis, useLenis } from "lenis/react"
import type { ReactNode } from "react"
import { ScrollTrigger } from "gsap/ScrollTrigger"

// ScrollTrigger is registered in page.tsx - no need to register again
function LenisGSAPSync() {
  useLenis(() => {
    ScrollTrigger.update()
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
