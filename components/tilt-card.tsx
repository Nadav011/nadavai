"use client"

import Tilt from "react-parallax-tilt"
import type { ReactNode } from "react"

interface TiltCardProps {
  children: ReactNode
  className?: string
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  return (
    <Tilt
      tiltMaxAngleX={8}
      tiltMaxAngleY={8}
      scale={1.01}
      transitionSpeed={400}
      tiltEnable={true}
      className={className}
    >
      {children}
    </Tilt>
  )
}
