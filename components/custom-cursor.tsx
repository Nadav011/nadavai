"use client"

import { useEffect, useRef, useState } from "react"

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window
    if (isTouchDevice) return

    const move = (e: MouseEvent) => {
      // Update DOM directly via refs - no React re-render
      if (dotRef.current) {
        dotRef.current.style.left = `${e.clientX}px`
        dotRef.current.style.top = `${e.clientY}px`
      }
      if (glowRef.current) {
        glowRef.current.style.left = `${e.clientX}px`
        glowRef.current.style.top = `${e.clientY}px`
      }
      setVisible(true)
    }
    
    const addHover = () => setHovering(true)
    const removeHover = () => setHovering(false)

    window.addEventListener("mousemove", move, { passive: true })
    document.addEventListener("mouseleave", () => setVisible(false))
    document.addEventListener("mouseenter", () => setVisible(true))

    const interactiveElements = document.querySelectorAll("a, button, [role='button'], input, textarea, select")
    interactiveElements.forEach((el) => {
      el.addEventListener("mouseenter", addHover)
      el.addEventListener("mouseleave", removeHover)
    })

    return () => {
      window.removeEventListener("mousemove", move)
      interactiveElements.forEach((el) => {
        el.removeEventListener("mouseenter", addHover)
        el.removeEventListener("mouseleave", removeHover)
      })
    }
  }, [])

  if (!visible) return null

  return (
    <>
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: 0,
          top: 0,
          width: hovering ? 48 : 12,
          height: hovering ? 48 : 12,
          borderRadius: "50%",
          background: hovering ? "transparent" : "#06d6e0",
          border: hovering ? "2px solid #06d6e0" : "none",
          transform: "translate(-50%, -50%)",
          transition: "width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease",
        }}
        aria-hidden="true"
      />
      <div
        ref={glowRef}
        className="fixed pointer-events-none z-[9998] hidden md:block"
        style={{
          left: 0,
          top: 0,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "radial-gradient(circle, hsl(187 92% 55% / 0.06), transparent 70%)",
          transform: "translate(-50%, -50%)",
          transition: "left 0.15s ease-out, top 0.15s ease-out",
        }}
        aria-hidden="true"
      />
    </>
  )
}
