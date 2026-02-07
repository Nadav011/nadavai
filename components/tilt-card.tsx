"use client"

import { useRef, type ReactNode, type MouseEvent } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const handleMove = (e: MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10
    ref.current.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.02, 1.02, 1.02)`
  }

  const handleLeave = () => {
    if (!ref.current) return
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
        transformStyle: "preserve-3d",
      }}
    >
      {children}
    </div>
  )
}
