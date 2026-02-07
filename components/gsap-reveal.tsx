"use client"

import { useRef, type ReactNode } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

interface GsapRevealProps {
  children: ReactNode
  className?: string
  stagger?: number
  y?: number
  duration?: number
  start?: string
}

export function GsapReveal({
  children,
  className = "",
  stagger = 0.12,
  y = 60,
  duration = 0.8,
  start = "top 85%",
}: GsapRevealProps) {
  const container = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const items = container.current?.querySelectorAll(".gsap-item")
      if (!items?.length) return

      gsap.from(items, {
        y,
        opacity: 0,
        duration,
        stagger,
        ease: "power3.out",
        scrollTrigger: {
          trigger: container.current,
          start,
          toggleActions: "play none none none",
        },
      })
    },
    { scope: container }
  )

  return (
    <div ref={container} className={className}>
      {children}
    </div>
  )
}

interface GsapFadeProps {
  children: ReactNode
  className?: string
  direction?: "up" | "down" | "left" | "right"
  delay?: number
  duration?: number
}

export function GsapFade({
  children,
  className = "",
  direction = "up",
  delay = 0,
  duration = 0.7,
}: GsapFadeProps) {
  const ref = useRef<HTMLDivElement>(null)

  const directionMap = {
    up: { y: 50, x: 0 },
    down: { y: -50, x: 0 },
    left: { y: 0, x: 50 },
    right: { y: 0, x: -50 },
  }

  useGSAP(
    () => {
      if (!ref.current) return
      const { x, y } = directionMap[direction]

      gsap.from(ref.current, {
        x,
        y,
        opacity: 0,
        duration,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 88%",
          toggleActions: "play none none none",
        },
      })
    },
    { scope: ref }
  )

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}

interface GsapCounterProps {
  end: number
  suffix?: string
  duration?: number
  className?: string
}

export function GsapCounter({ end, suffix = "", duration = 2, className = "" }: GsapCounterProps) {
  const ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (!ref.current) return

    const obj = { value: 0 }
    gsap.to(obj, {
      value: end,
      duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 90%",
        toggleActions: "play none none none",
      },
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = Math.round(obj.value) + suffix
        }
      },
    })
  })

  return (
    <span ref={ref} className={className} dir="ltr">
      0{suffix}
    </span>
  )
}

interface GsapTextRevealProps {
  text: string
  className?: string
  tag?: "h1" | "h2" | "h3" | "p" | "span"
}

export function GsapTextReveal({ text, className = "", tag: Tag = "h2" }: GsapTextRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!ref.current) return

    gsap.from(ref.current, {
      clipPath: "inset(0 100% 0 0)",
      opacity: 0,
      duration: 1,
      ease: "power4.out",
      scrollTrigger: {
        trigger: ref.current,
        start: "top 85%",
        toggleActions: "play none none none",
      },
    })
  })

  return (
    // @ts-expect-error dynamic tag element
    <Tag ref={ref} className={className}>
      {text}
    </Tag>
  )
}

export function GsapParallax({
  children,
  className = "",
  speed = 0.3,
}: {
  children: ReactNode
  className?: string
  speed?: number
}) {
  const ref = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!ref.current) return

    gsap.to(ref.current, {
      y: () => -speed * 100,
      ease: "none",
      scrollTrigger: {
        trigger: ref.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
      },
    })
  })

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
