"use client"

import { useEffect, useState, useCallback } from "react"

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

export function EasterEgg() {
  const [sequence, setSequence] = useState<string[]>([])
  const [active, setActive] = useState(false)

  const handleKey = useCallback((e: KeyboardEvent) => {
    setSequence((prev) => {
      const next = [...prev, e.key].slice(-KONAMI.length)
      if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
        setActive(true)
        setTimeout(() => setActive(false), 5000)
        return []
      }
      return next
    })
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [handleKey])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      {/* Matrix-style rain */}
      <div className="absolute inset-0 bg-[hsl(222,47%,3%)/0.85]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-up">
          <div className="text-6xl md:text-8xl font-bold text-gradient-animated">
            {"🤖 AI MODE"}
          </div>
          <div className="font-mono text-[#06d6e0] text-lg">
            {"> sudo nadav --unlock-potential"}
          </div>
          <div className="font-mono text-[#27ca40] text-sm animate-pulse">
            {"[SYSTEM] All systems powered by artificial intelligence"}
          </div>
        </div>
      </div>
      {/* Falling characters */}
      {Array.from({ length: 30 }).map((_, i) => (
        <div
          key={i}
          className="absolute top-0 text-[#06d6e0]/30 font-mono text-sm"
          style={{
            insetInlineStart: `${(i / 30) * 100}%`,
            animation: `matrix-fall ${2 + Math.random() * 3}s linear ${Math.random() * 2}s infinite`,
            fontSize: `${10 + Math.random() * 8}px`,
          }}
        >
          {Array.from({ length: 20 }).map((_, j) => (
            <div key={j} className="opacity-70">
              {String.fromCharCode(0x30A0 + Math.floor(Math.random() * 96))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
