"use client"

import { useRef, useCallback, type ReactNode } from "react"
import { TiltCard } from "./tilt-card"

interface CodeCardProps {
  title: string
  filename?: string
  lang?: string
  children: ReactNode
  className?: string
  badge?: string
  badgeColor?: "cyan" | "pink" | "green" | "yellow"
  icon?: ReactNode
}

const badgeColors = {
  cyan:   "bg-cyan/15 text-cyan border-cyan/30",
  pink:   "bg-pink/15 text-pink border-pink/30",
  green:  "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  yellow: "bg-amber-500/15 text-amber-400 border-amber-500/30",
}

export function CodeCard({
  title,
  filename,
  lang = "tsx",
  children,
  className = "",
  badge,
  badgeColor = "cyan",
  icon,
}: CodeCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    el.style.setProperty("--mouse-x", `${x}%`)
    el.style.setProperty("--mouse-y", `${y}%`)
  }, [])

  return (
    <TiltCard className={className}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        className="relative group rounded-xl overflow-hidden border border-border transition-all duration-500
          hover:border-cyan/25
          hover:shadow-[0_0_0_1px_oklch(0.81_0.17_193_/_0.12),0_8px_40px_oklch(0.085_0.025_245_/_0.6),0_0_60px_oklch(0.81_0.17_193_/_0.06)]"
        style={{
          /* Glassmorphism base */
          background: "oklch(0.12 0.02 243 / 0.85)",
          backdropFilter: "blur(24px) saturate(160%)",
          WebkitBackdropFilter: "blur(24px) saturate(160%)",
        }}
      >
        {/* Gradient border overlay on hover — rendered via box-shadow + pseudo-element via inline style */}
        <div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: "linear-gradient(135deg, oklch(0.81 0.17 193 / 0.08), oklch(0.65 0.25 350 / 0.05), transparent 60%)", // rtl-ok — decorative gradient
            zIndex: 0,
          }}
          aria-hidden="true"
        />

        {/* Terminal header */}
        <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-border"
          style={{
            background: "oklch(0.16 0.025 243 / 0.9)",
            backdropFilter: "blur(10px)",
          }}
        >
          <div className="flex items-center gap-3">
            {/* macOS traffic lights */}
            <div className="flex items-center gap-1.5" aria-hidden="true">
              <div className="w-3 h-3 rounded-full transition-all duration-200 group-hover:shadow-[0_0_6px_oklch(0.65_0.24_25)]"
                style={{ background: "oklch(0.65 0.24 25)" }} />
              <div className="w-3 h-3 rounded-full transition-all duration-200 group-hover:shadow-[0_0_6px_oklch(0.83 0.16 85)]"
                style={{ background: "oklch(0.83 0.16 85)" }} />
              <div className="w-3 h-3 rounded-full transition-all duration-200 group-hover:shadow-[0_0_6px_oklch(0.72_0.20_145)]"
                style={{ background: "oklch(0.72 0.20 145)" }} />
            </div>
            {/* File tab */}
            {filename && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-md border border-border/60"
                style={{ background: "oklch(0.20 0.03 243 / 0.7)" }}
              >
                {icon && <span className="text-sm">{icon}</span>}
                <span className="font-mono text-xs text-text-muted">{filename}</span>
                <span className="font-mono text-[10px] text-text-dim uppercase">.{lang}</span>
              </div>
            )}
          </div>
          {badge && (
            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeColors[badgeColor]}`}>
              {badge}
            </span>
          )}
        </div>

        {/* Content area */}
        <div className="relative z-10 p-5 font-mono">
          {/* Title with VS Code line-number gutter */}
          <div className="flex items-start gap-3 mb-4 select-none">
            <span className="text-xs font-mono text-text-dim leading-6 w-5 text-end shrink-0" aria-hidden="true">
              01
            </span>
            <h3 className="text-base font-semibold text-text leading-6 font-sans">{title}</h3>
          </div>
          {/* Body */}
          <div className="me-7">
            {children}
          </div>
        </div>

        {/* Status bar — VS Code style */}
        <div className="relative z-10 flex items-center justify-between px-4 py-2 border-t border-border/50"
          style={{ background: "oklch(0.10 0.02 243 / 0.9)" }}
        >
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "oklch(0.72 0.20 145)" }} aria-hidden="true" />
            <span className="text-[10px] font-mono text-text-muted">ready</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted">UTF-8</span>
        </div>

        {/* Mouse-tracking radial glow */}
        <div
          className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-xl"
          aria-hidden="true"
          style={{
            background: "radial-gradient(500px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), oklch(0.81 0.17 193 / 0.07), transparent 45%)",
            zIndex: 1,
          }}
        />
      </div>
    </TiltCard>
  )
}
