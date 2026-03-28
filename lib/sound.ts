"use client"

import { Howl } from "howler"

export type SoundType = "hover" | "click" | "whoosh" | "success"

const SOUND_FILES: Record<SoundType, string> = {
  hover: "/sounds/hover.mp3",
  click: "/sounds/click.mp3",
  whoosh: "/sounds/whoosh.mp3",
  success: "/sounds/success.mp3",
}

const STORAGE_KEY = "nadavai-sound-enabled"

// Check prefers-reduced-motion once on init
let reducedMotion = false
if (typeof window !== "undefined") {
  reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
  // Listen for changes
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
    reducedMotion = e.matches
  })
}

// Sound instances — lazily created
const sounds: Partial<Record<SoundType, Howl>> = {}

function getOrCreateSound(type: SoundType): Howl | null {
  if (sounds[type]) return sounds[type]!
  try {
    const howl = new Howl({
      src: [SOUND_FILES[type]],
      volume: type === "hover" ? 0.25 : type === "whoosh" ? 0.35 : 0.5,
      preload: false,
      onloaderror: () => {
        // File missing — remove from cache silently
        delete sounds[type]
      },
    })
    sounds[type] = howl
    return howl
  } catch {
    return null
  }
}

function getSoundEnabled(): boolean {
  if (typeof window === "undefined") return false
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    // Default: muted
    return stored === "true"
  } catch {
    return false
  }
}

export function isSoundEnabled(): boolean {
  return getSoundEnabled()
}

export function toggleSound(): boolean {
  if (typeof window === "undefined") return false
  try {
    const next = !getSoundEnabled()
    localStorage.setItem(STORAGE_KEY, String(next))
    return next
  } catch {
    return false
  }
}

export function playSound(type: SoundType): void {
  // Never play if reduced motion or sounds disabled
  if (reducedMotion) return
  if (!getSoundEnabled()) return

  try {
    const howl = getOrCreateSound(type)
    if (!howl) return
    howl.play()
  } catch {
    // Graceful failure — audio context blocked, file missing, etc.
  }
}
