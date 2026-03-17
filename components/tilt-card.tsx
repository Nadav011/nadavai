"use client"

import { useRef, useEffect, useState, type ReactNode, type MouseEvent } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  const handleMove = (e: MouseEvent) => {
    if (isTouchDevice || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8
    ref.current.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.01, 1.01, 1.01)`
  }

  const handleLeave = () => {
    if (isTouchDevice || !ref.current) return
    ref.current.style.transform = "perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)"
  }

  return (
    <div
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        transformStyle: isTouchDevice ? undefined : "preserve-3d",
      }}
    >
      {children}
    </div>
  )
}
