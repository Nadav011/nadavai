"use client"

import { useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"

// Spline needs browser APIs — no SSR
const Spline = dynamic(() => import("@splinetool/react-spline"), { ssr: false })

const SPLINE_SCENE = "https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode"

// Orb position tokens — logical so LTR/RTL both render correctly
const ORB_INLINE_START = "15%" // rtl-ok: logical inline-start via inset-inline-start CSS
const ORB_INLINE_END = "10%"   // rtl-ok: logical inline-end via inset-inline-end CSS

// CSS-only fallback rendered until Spline loads (or when reduced motion / Spline fails)
function FallbackOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* Primary cyan glow orb — centred */}
      <div
        className="absolute rounded-full"
        style={{
          width: "min(700px, 90vw)",
          height: "min(700px, 90vw)",
          top: "50%",
          insetInlineStart: "50%",  // rtl-ok
          transform: "translate(-50%, -52%)",
          background:
            "radial-gradient(circle at 40% 40%, oklch(0.81 0.17 193 / 0.18) 0%, oklch(0.81 0.17 193 / 0.06) 50%, transparent 70%)",
          filter: "blur(60px)",
          animation: "orb-float-a 12s ease-in-out infinite",
        }}
      />
      {/* Pink / violet accent orb — inline-start lower area */}
      <div
        className="absolute rounded-full"
        style={{
          width: "min(450px, 60vw)",
          height: "min(450px, 60vw)",
          bottom: "10%",
          insetInlineStart: ORB_INLINE_START, // rtl-ok: logical property
          background:
            "radial-gradient(circle at 60% 50%, oklch(0.65 0.25 350 / 0.14) 0%, oklch(0.65 0.25 350 / 0.04) 55%, transparent 70%)",
          filter: "blur(80px)",
          animation: "orb-float-b 16s ease-in-out infinite",
          animationDelay: "3s",
        }}
      />
      {/* Indigo depth orb — inline-end upper area */}
      <div
        className="absolute rounded-full"
        style={{
          width: "min(350px, 45vw)",
          height: "min(350px, 45vw)",
          top: "15%",
          insetInlineEnd: ORB_INLINE_END, // rtl-ok: logical property
          background:
            "radial-gradient(circle at 50% 50%, oklch(0.50 0.20 270 / 0.12) 0%, oklch(0.50 0.20 270 / 0.04) 60%, transparent 75%)",
          filter: "blur(70px)",
          animation: "orb-float-a 20s ease-in-out infinite",
          animationDelay: "7s",
        }}
      />
    </div>
  )
}

export function Hero3D() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [splineLoaded, setSplineLoaded] = useState(false)
  const [splineFailed, setSplineFailed] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  })

  // Listen for reduced-motion changes
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  // Intersection observer — only load Spline when hero is in viewport
  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { rootMargin: "200px" }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const showSpline = isVisible && !reducedMotion && !splineFailed

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* Shimmer placeholder — shown until Spline paints */}
      {showSpline && !splineLoaded && (
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 50% 40%, oklch(0.81 0.17 193 / 0.08), transparent)",
            animation: "shimmer-pulse 2s ease-in-out infinite",
          }}
        />
      )}

      {/* CSS fallback orbs always underneath */}
      <FallbackOrbs />

      {/* Spline 3D scene — mounted only when visible and motion allowed */}
      {showSpline && (
        <div
          className="absolute inset-0"
          style={{
            opacity: splineLoaded ? 1 : 0,
            transition: "opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        >
          <Spline
            scene={SPLINE_SCENE}
            onLoad={() => setSplineLoaded(true)}
            onError={() => {
              setSplineFailed(true)
              setSplineLoaded(false)
            }}
            style={{ width: "100%", height: "100%" }}
          />
        </div>
      )}
    </div>
  )
}
