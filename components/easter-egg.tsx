"use client"

import { useEffect, useState, useMemo } from "react"

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

export function EasterEgg() {
  const [active, setActive] = useState(false)

  useEffect(() => {
    let buffer: string[] = []
    const onKey = (e: KeyboardEvent) => {
      buffer = [...buffer, e.key].slice(-KONAMI.length)
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        setActive(true)
        setTimeout(() => setActive(false), 5000)
        buffer = []
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const columns = useMemo(() =>
    Array.from({ length: 30 }).map((_, i) => ({
      left: `${(i / 30) * 100}%`,
      animation: `matrix-fall ${2 + seededRandom(i) * 3}s linear ${seededRandom(i + 100) * 2}s infinite`,
      fontSize: `${10 + seededRandom(i + 200) * 8}px`,
      chars: Array.from({ length: 20 }).map((_, j) =>
        String.fromCharCode(0x30A0 + Math.floor(seededRandom(i * 20 + j) * 96))
      ),
    })), [])

  if (!active) return null

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
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
      {columns.map((col, i) => (
        <div
          key={i}
          className="absolute top-0 text-[#06d6e0]/30 font-mono text-sm"
          style={{
            insetInlineStart: col.left,
            animation: col.animation,
            fontSize: col.fontSize,
          }}
        >
          {col.chars.map((char, j) => (
            <div key={j} className="opacity-70">
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
