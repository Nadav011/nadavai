"use client"

import type { ReactNode } from "react"
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
  cyan: "bg-cyan/15 text-cyan border-cyan/30",
  pink: "bg-pink/15 text-pink border-pink/30",
  green: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
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
  return (
    <TiltCard className={className}>
      <div className="relative group rounded-xl overflow-hidden border border-border bg-bg-surface transition-all duration-500 hover:border-cyan/30 hover:shadow-[0_0_30px_oklch(0.81_0.17_193_/_0.08)]">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-elevated">
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40] opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* File tab */}
            {filename && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-border/50 border border-border">
                {icon && <span className="text-sm">{icon}</span>}
                <span className="text-xs font-mono text-text-muted">{filename}</span>
                <span className="text-[10px] font-mono text-text-muted uppercase">.{lang}</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {badge && (
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeColors[badgeColor]}`}>
                {badge}
              </span>
            )}
          </div>
        </div>

        {/* Content area */}
        <div className="p-5">
          {/* Title with line number styling */}
          <div className="flex items-start gap-3 mb-4">
            <span className="text-xs font-mono text-text-muted select-none leading-6">01</span>
            <h3 className="text-base font-semibold text-text leading-6">{title}</h3>
          </div>
          {/* Body content */}
          <div className="me-7">
            {children}
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-border bg-bg-surface">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#27ca40] animate-pulse" />
            <span className="text-[10px] font-mono text-text-muted">ready</span>
          </div>
          <span className="text-[10px] font-mono text-text-muted">UTF-8</span>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl"
          style={{
            background: "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), oklch(0.81 0.17 193 / 0.04), transparent 40%)",
          }}
        />
      </div>
    </TiltCard>
  )
}
