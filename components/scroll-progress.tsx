"use client"

import { useEffect, useState } from "react"

export function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const winHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrolled = window.scrollY / winHeight
      setProgress(Math.min(scrolled, 1))
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="fixed top-0 inset-x-0 z-[60] h-[2px]">
      <div
        className="h-full bg-gradient-to-l from-[#06d6e0] to-[#e84393] transition-all duration-150 ease-out"
        style={{
          width: `${progress * 100}%`,
          boxShadow: "0 0 10px hsl(187 92% 55% / 0.5), 0 0 20px hsl(187 92% 55% / 0.2)",
        }}
      />
    </div>
  )
}
