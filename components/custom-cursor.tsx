"use client"

import { useEffect, useState } from "react"

export function CustomCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window
    if (isTouchDevice) return

    const move = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY })
      setVisible(true)
    }
    const addHover = () => setHovering(true)
    const removeHover = () => setHovering(false)

    window.addEventListener("mousemove", move)
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
        className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block"
        style={{
          left: pos.x,
          top: pos.y,
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
        className="fixed pointer-events-none z-[9998] hidden md:block"
        style={{
          left: pos.x,
          top: pos.y,
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
