"use client"

import { useEffect, useState, useRef } from "react"
import { ArrowDown, Play, Sparkles } from "lucide-react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"
import { Magnetic } from "./magnetic"
import { AnimatedCounter } from "./animated-counter"
import { Spotlight } from "./spotlight"
import { useTranslations } from "next-intl"
import { Hero3D } from "./hero-3d"

// ScrollTrigger is registered in page.tsx - no need to register again

const roles = ["Full-Stack Developer", "AI Builder", "Prompt Engineer", "System Architect", "Tech Creator"]

export function Hero() {
  const t = useTranslations("hero")
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  const badgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const descriptionRef = useRef<HTMLDivElement>(null)
  const buttonsRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const current = roles[roleIndex] ?? ""
    const timeout = setTimeout(
      () => {
        if (!isDeleting && charIndex < current.length) {
          setCharIndex((c) => c + 1)
        } else if (!isDeleting && charIndex === current.length) {
          setTimeout(() => setIsDeleting(true), 2000)
        } else if (isDeleting && charIndex > 0) {
          setCharIndex((c) => c - 1)
        } else if (isDeleting && charIndex === 0) {
          setIsDeleting(false)
          setRoleIndex((r) => (r + 1) % roles.length)
        }
      },
      isDeleting ? 40 : 80
    )
    return () => clearTimeout(timeout)
  }, [charIndex, isDeleting, roleIndex])

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "expo.out" } })

    tl.fromTo(
      badgeRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 }
    )
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 },
        "<0.15"
      )
      .fromTo(
        terminalRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "<0.2"
      )
      .fromTo(
        descriptionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        "<0.15"
      )
      .fromTo(
        buttonsRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "<0.15"
      )
      .fromTo(
        statsRef.current?.children || [],
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1 },
        "<0.2"
      )
      .fromTo(
        scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "<0.2"
      )

    // Parallax effect on scroll
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        y: -100,
        ease: "none",
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      })
    }
  })

  const stats = [
    { value: 10, suffix: "+", label: t("stat1") },
    { value: 86, suffix: "",  label: t("stat2") },
    { value: 52, suffix: "",  label: t("stat3") },
  ]

  return (
    <section id="hero" aria-labelledby="hero-heading" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Layered background: 3D scene (z-0) → dot grid → noise → spotlight */}
      <Hero3D />
      <div className="absolute inset-0 dot-grid opacity-[0.08]" style={{ zIndex: 1 }} aria-hidden="true" />
      <div className="absolute inset-0 noise-bg" style={{ zIndex: 2 }} aria-hidden="true" />
      <Spotlight />

      <div className="absolute inset-0" style={{ zIndex: 0 }}>
        <div className="absolute inset-0 grid-bg opacity-15" />
        {/* responsive-ok: decorative glow orbs, fixed size intentional */}
        <div className="absolute rounded-full blur-[180px] animate-pulse-glow" style={{ width: "min(800px, 90vw)", height: "min(800px, 90vw)", top: "30%", insetInlineStart: "50%", transform: "translate(-50%, -50%)", background: "oklch(0.81 0.17 193 / 0.04)" }} />
        <div className="absolute rounded-full blur-[150px] animate-pulse-glow" style={{ width: "min(500px, 70vw)", height: "min(500px, 70vw)", bottom: "20%", insetInlineStart: "30%", animationDelay: "2s", background: "oklch(0.81 0.17 193 / 0.03)" }} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-[1px] bg-gradient-to-l rtl:bg-gradient-to-r from-transparent via-cyan/15 to-transparent" style={{ animation: "scan-line 8s linear infinite" }} />
        </div>
      </div>

      <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col items-center text-center gap-5 md:gap-8">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-cyan/20 bg-cyan/5"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[oklch(0.72_0.20_145)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[oklch(0.72_0.20_145)]" />
            </span>
            <span className="text-xs font-mono text-cyan tracking-wider">{t("badge")}</span>
          </div>

          <div ref={headingRef}>
            <h1 id="hero-heading" className="text-[1.75rem] sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-text">
              {t("heading1")}
              <br className="hidden sm:block" />
              <span className="text-gradient-animated">{t("heading2")}</span>
              {t("heading3")}
              <span className="relative inline-block">
                <span className="relative z-10 animate-ai-glow">AI</span>
                <span className="absolute inset-0 -m-2 rounded-lg bg-cyan/10 blur-xl animate-pulse-glow" />
                <Sparkles className="absolute -top-3 -start-3 w-5 h-5 text-cyan animate-pulse" aria-hidden="true" />
                <Sparkles className="absolute -bottom-2 -end-3 w-4 h-4 text-cyan animate-pulse" style={{ animationDelay: "1s" }} aria-hidden="true" />
              </span>
            </h1>
          </div>

          <div ref={terminalRef}>
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl border border-border bg-bg-surface font-mono max-w-full overflow-hidden">
              <span className="text-cyan">{">"}</span>
              <span className="text-text-secondary text-sm md:text-base">
                {(roles[roleIndex] ?? "").slice(0, charIndex)}
              </span>
              <span className="w-[2px] h-5 bg-cyan" style={{ animation: "typing-cursor 1s step-end infinite" }} />
            </div>
          </div>

          <div
            ref={descriptionRef}
            className="text-base md:text-xl text-text-muted max-w-2xl leading-relaxed px-2 md:px-0"
          >
            {t("description")}
          </div>

          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0"
          >
            <Magnetic strength={0.2}>
              <a
                href="#projects"
                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-bg-deep bg-gradient-to-l rtl:bg-gradient-to-r from-cyan to-cyan-dim hover:shadow-[0_0_40px_oklch(0.81_0.17_193_/_0.4)] transition-all duration-500 w-full sm:w-auto"
              >
                {t("cta1")}
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href="#services"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-medium text-text border border-border/80 bg-bg-elevated hover:border-pink/40 hover:shadow-[0_0_30px_oklch(0.65_0.26_350_/_0.15)] transition-all duration-500 w-full sm:w-auto"
              >
                <Play className="w-4 h-4 text-pink" />
                {t("cta2")}
              </a>
            </Magnetic>
          </div>

          <div
            ref={statsRef}
            className="flex items-center gap-8 md:gap-16 mt-4 md:mt-8"
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-xl md:text-4xl font-bold text-text">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-mono text-text-muted mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          <div ref={scrollIndicatorRef} className="mt-8 md:mt-12 hidden md:block">
            <div className="flex flex-col items-center gap-2 animate-float">
              <span className="text-[10px] font-mono text-text-muted tracking-widest uppercase">scroll</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-cyan to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
