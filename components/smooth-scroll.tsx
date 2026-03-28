"use client"

import type { ReactNode } from "react"

// SmoothScroll is now a pass-through wrapper.
// Lenis is initialised in GSAPSetup (which handles the GSAP ticker sync).
// This component exists so page.tsx keeps its wrapping structure unchanged.
export function SmoothScroll({ children }: { children: ReactNode }) {
  return <>{children}</>
}
