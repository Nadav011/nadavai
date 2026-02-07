"use client"

import { ScrollReveal } from "./scroll-reveal"

interface SectionHeaderProps {
  badge: string
  title: string
  highlight?: string
  description?: string
}

export function SectionHeader({ badge, title, highlight, description }: SectionHeaderProps) {
  return (
    <ScrollReveal className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06d6e0]/20 bg-[#06d6e0]/5 mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#06d6e0] animate-pulse" />
        <span className="text-xs font-mono text-[#06d6e0] tracking-wider uppercase">{badge}</span>
      </div>
      <h2 className="text-3xl md:text-5xl font-bold text-[hsl(210,40%,98%)] mb-4 text-balance">
        {title}{" "}
        {highlight && <span className="text-gradient-animated">{highlight}</span>}
      </h2>
      {description && (
        <p className="text-[hsl(215,20%,55%)] max-w-2xl mx-auto text-lg leading-relaxed">{description}</p>
      )}
    </ScrollReveal>
  )
}
