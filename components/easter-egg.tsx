"use client"

import { useEffect, useState, useMemo } from "react"

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"]

function seededRandom(seed: number) {
  const x = Math.sin(seed + 1) * 10000
  return x - Math.floor(x)
}

// OKLCH cyan palette for matrix rain — varied lightness for depth
const MATRIX_COLORS = [
  "oklch(0.87 0.19 193)", // cyan-bright — leading char
  "oklch(0.81 0.17 193)", // cyan base
  "oklch(0.65 0.14 193)", // cyan-dim
  "oklch(0.50 0.12 193)", // darker cyan
  "oklch(0.35 0.08 193)", // near-fade
]

export function EasterEgg() {
  const [active, setActive] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let buffer: string[] = []
    const onKey = (e: KeyboardEvent) => {
      buffer = [...buffer, e.key].slice(-KONAMI.length)
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        setActive(true)
        setVisible(true)
        // Fade out at 4.5s, unmount at 5.5s
        setTimeout(() => setVisible(false), 4500)
        setTimeout(() => setActive(false), 5500)
        buffer = []
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [])

  const columns = useMemo(() =>
    Array.from({ length: 36 }).map((_, i) => ({
      left: `${(i / 36) * 100}%`, // rtl-ok — visual position only, decorative
      // Varied speed: fast cols near center, slower at edges
      duration: 1.8 + seededRandom(i) * 2.8,
      delay: seededRandom(i + 100) * 3.0,
      fontSize: 10 + seededRandom(i + 200) * 7,
      chars: Array.from({ length: 22 }).map((_, j) =>
        String.fromCharCode(0x30A0 + Math.floor(seededRandom(i * 22 + j) * 96))
      ),
      // Each column has a dominant color for visual variance
      colorIndex: Math.floor(seededRandom(i + 300) * (MATRIX_COLORS.length - 1)) + 1,
    })), [])

  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden"
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease-out",
      }}
      aria-hidden="true"
    >
      {/* Glass dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "oklch(0.085 0.025 245 / 0.88)",
          backdropFilter: "blur(2px) saturate(120%)",
          WebkitBackdropFilter: "blur(2px) saturate(120%)",
        }}
      />

      {/* Radial cyan bloom at center */}
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 50% 50%, oklch(0.81 0.17 193 / 0.06), transparent 70%)", // rtl-ok
          pointerEvents: "none",
        }}
      />

      {/* Central message */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="text-center space-y-4 animate-fade-up"
          style={{
            /* Glass card behind text */
            background: "oklch(0.12 0.02 243 / 0.75)",
            backdropFilter: "blur(24px) saturate(160%)",
            WebkitBackdropFilter: "blur(24px) saturate(160%)",
            border: "1px solid oklch(0.81 0.17 193 / 0.25)",
            borderRadius: "1.25rem",
            padding: "2.5rem 3.5rem",
            boxShadow: "0 0 60px oklch(0.81 0.17 193 / 0.15), 0 0 120px oklch(0.81 0.17 193 / 0.06)",
          }}
        >
          <div className="text-5xl md:text-7xl font-bold text-gradient-animated">
            {"🤖 AI MODE"}
          </div>
          <div
            className="font-mono text-lg"
            style={{ color: "oklch(0.87 0.19 193)" }}
          >
            {"> sudo nadav --unlock-potential"}
          </div>
          <div
            className="font-mono text-sm animate-pulse"
            style={{ color: "oklch(0.75 0.16 145)" }}
          >
            {"[SYSTEM] All systems powered by artificial intelligence"}
          </div>
        </div>
      </div>

      {/* Matrix rain columns */}
      {columns.map((col, i) => (
        <div
          key={i}
          className="absolute top-0 font-mono"
          style={{
            insetInlineStart: col.left,
            animation: `matrix-fall ${col.duration}s linear ${col.delay}s infinite`,
            fontSize: col.fontSize,
            willChange: "transform",
          }}
        >
          {col.chars.map((char, j) => (
            <div
              key={j}
              style={{
                // Leading char is bright cyan, rest fade by depth
                color: j === 0
                  ? MATRIX_COLORS[0]
                  : MATRIX_COLORS[Math.min(j < 3 ? 1 : Math.floor(j / 4) + 1, MATRIX_COLORS.length - 1)],
                opacity: j === 0 ? 1 : Math.max(0.15, 0.8 - j * 0.035),
                textShadow: j === 0 ? "0 0 8px oklch(0.87 0.19 193 / 0.9)" : "none",
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
