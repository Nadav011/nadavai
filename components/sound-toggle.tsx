"use client"

import { useCallback, useState } from "react"
import { Volume2, VolumeX } from "lucide-react"
import { toggleSound, isSoundEnabled } from "@/lib/sound"
import { cn } from "@/lib/utils"

export function SoundToggle({ className }: { className?: string }) {
  // Initialize from localStorage — safe because muted is the visual default
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === "undefined") return false
    return isSoundEnabled()
  })

  const handleToggle = useCallback(() => {
    const next = toggleSound()
    setEnabled(next)
  }, [])

  return (
    <button
      onClick={handleToggle}
      aria-label={enabled ? "Mute sounds" : "Enable sounds"}
      aria-pressed={enabled}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full",
        "border border-[var(--color-border)] bg-[var(--color-bg-surface)]/60 backdrop-blur-sm",
        "text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:border-[var(--color-border-glow)]",
        "transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--color-cyan)] outline-none",
        className
      )}
    >
      {enabled ? (
        <Volume2 className="w-3.5 h-3.5 text-[var(--color-cyan)]" aria-hidden="true" />
      ) : (
        <VolumeX className="w-3.5 h-3.5" aria-hidden="true" />
      )}
      <span className="text-xs font-mono">
        {enabled ? "SFX" : "MUTE"}
      </span>
    </button>
  )
}
