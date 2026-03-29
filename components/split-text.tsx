"use client"

import { useRef, type ReactNode } from "react"
import { gsap } from "gsap"
import { SplitText as GSAPSplitText } from "gsap/SplitText"
import type { ScrollTrigger as _ST } from "gsap/ScrollTrigger" // type-only — registered in gsap-setup
import { useGSAP } from "@gsap/react"

// Plugins registered globally in gsap-setup.tsx — no re-registration needed

export type SplitMode = "chars" | "words" | "lines" | "chars,words" | "words,lines"

interface SplitTextProps {
  /** The text content to split and animate */
  children: ReactNode
  /** Split mode — chars, words, or lines */
  mode?: SplitMode
  /** CSS class applied to the outer wrapper element */
  className?: string
  /** Animation delay before the timeline starts (seconds) */
  delay?: number
  /** stagger between each split unit (seconds) */
  stagger?: number
  /** Duration per unit (seconds) */
  duration?: number
  /** GSAP ease string */
  ease?: string
  /** If true, animate on scroll via ScrollTrigger instead of immediately */
  scrollTrigger?: boolean
  /** From-y offset in px */
  fromY?: number
  /** Optional id for the outer element */
  id?: string
}

/**
 * SplitTextReveal — GSAP SplitText wrapper for React 19.
 *
 * Uses useGSAP for automatic context-based cleanup.
 * Respects `prefers-reduced-motion`: disables split animation entirely.
 */
export function SplitTextReveal({
  children,
  mode = "chars",
  className = "",
  delay = 0,
  stagger = 0.03,
  duration = 0.7,
  ease = "expo.out",
  scrollTrigger: useScrollTrigger = false,
  fromY = 40,
  id,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      // Respect prefers-reduced-motion
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
      if (reducedMotion) return

      const split = new GSAPSplitText(containerRef.current, {
        type: mode,
        linesClass: "split-line",
        wordsClass: "split-word",
        charsClass: "split-char",
      })

      // Determine which elements to animate based on primary mode
      const primaryMode = mode.split(",")[0] as "chars" | "words" | "lines"
      let targets: Element[]
      if (primaryMode === "chars") targets = split.chars
      else if (primaryMode === "words") targets = split.words
      else targets = split.lines

      // Clip-path reveal per unit
      gsap.set(targets, { opacity: 0, y: fromY })

      const animConfig: gsap.TweenVars = {
        opacity: 1,
        y: 0,
        duration,
        ease,
        stagger,
        delay,
        onComplete: () => {
          // Revert split so DOM is clean (no extra wrappers) after animation
          split.revert()
        },
      }

      if (useScrollTrigger && containerRef.current) {
        animConfig.scrollTrigger = {
          trigger: containerRef.current,
          start: "top 85%",
          once: true,
        }
      }

      gsap.to(targets, animConfig)

      // Cleanup is handled by useGSAP context
    },
    { scope: containerRef },
  )

  return (
    <div ref={containerRef} id={id} className={className}>
      {children}
    </div>
  )
}
