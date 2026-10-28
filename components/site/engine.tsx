"use client"

import { useEffect } from "react"

// GSAP, ScrollTrigger and Lenis load as classic scripts from the same pinned CDNs as the prototype; the page module
// (/site/js/main.js and friends) runs after hydration, so it only ever touches markup React has already adopted.
const CLASSIC = [
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js",
  "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js",
  "https://unpkg.com/lenis@1.1.20/dist/lenis.min.js",
]

let started = false

function classic(src: string) {
  return new Promise<void>((resolve) => {
    const s = document.createElement("script")
    s.src = src
    s.onload = () => resolve()
    s.onerror = () => resolve() // the page module keeps its markup static when an engine is missing
    document.body.appendChild(s)
  })
}

export function SiteEngine({ module }: { module: string | null }) {
  useEffect(() => {
    if (started || !module) return
    started = true
    ;(async () => {
      for (const src of CLASSIC) await classic(src)
      const s = document.createElement("script")
      s.type = "module"
      s.src = module
      document.body.appendChild(s)
    })()
  }, [module])
  return null
}
