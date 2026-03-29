"use client"

// Howler is loaded lazily — only when the user actually enables sounds.
// This keeps it out of the initial JS bundle entirely (sounds are muted by default).

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
  window.matchMedia("(prefers-reduced-motion: reduce)").addEventListener("change", (e) => {
    reducedMotion = e.matches
  })
}

// Lazy-loaded Howl instances — only created after howler module loads
type HowlInstance = { play: () => number }
const sounds: Partial<Record<SoundType, HowlInstance>> = {}
let HowlClass: (typeof import("howler"))["Howl"] | null = null

async function loadHowler() {
  if (HowlClass) return HowlClass
  try {
    const mod = await import("howler")
    HowlClass = mod.Howl
    return HowlClass
  } catch {
    return null
  }
}

async function getOrCreateSound(type: SoundType): Promise<HowlInstance | null> {
  if (sounds[type]) return sounds[type]!
  const Howl = await loadHowler()
  if (!Howl) return null
  try {
    const howl = new Howl({
      src: [SOUND_FILES[type]],
      volume: type === "hover" ? 0.25 : type === "whoosh" ? 0.35 : 0.5,
      preload: false,
      onloaderror: () => {
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
    // Pre-warm howler when user enables sound for the first time
    if (next) {
      void loadHowler()
    }
    return next
  } catch {
    return false
  }
}

export function playSound(type: SoundType): void {
  // Never play if reduced motion or sounds disabled
  if (reducedMotion) return
  if (!getSoundEnabled()) return

  // Fire-and-forget — async but we don't need to await in the event path
  void getOrCreateSound(type).then((howl) => {
    if (!howl) return
    try {
      howl.play()
    } catch {
      // Graceful failure — audio context blocked, file missing, etc.
    }
  })
}
