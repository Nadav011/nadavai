"use client"

import { useEffect, useState } from "react"
import { ArrowDown, Play, Sparkles } from "lucide-react"
import { Magnetic } from "./magnetic"
import { AnimatedCounter } from "./animated-counter"

const roles = ["Full-Stack Developer", "AI Builder", "Prompt Engineer", "System Architect", "Tech Creator"]

export function Hero() {
  const [roleIndex, setRoleIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const current = roles[roleIndex]
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

  const stats = [
    { value: 50, suffix: "+", label: "פרויקטים" },
    { value: 100, suffix: "%", label: "AI Powered" },
    { value: 24, suffix: "/7", label: "זמינות" },
  ]

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background effects */}
      <div className="absolute inset-0">
        {/* Grid */}
        <div className="absolute inset-0 grid-bg opacity-40" />
        {/* Gradient orbs */}
        <div className="absolute w-[600px] h-[600px] bg-[#06d6e0]/8 rounded-full blur-[120px] animate-pulse-glow" style={{ top: "25%", insetInlineEnd: "25%" }} />
        <div className="absolute w-[500px] h-[500px] bg-[#e84393]/6 rounded-full blur-[120px] animate-pulse-glow" style={{ bottom: "25%", insetInlineStart: "25%", animationDelay: "2s" }} />
        <div className="absolute w-[400px] h-[400px] bg-[#4f46e5]/5 rounded-full blur-[100px] animate-pulse-glow" style={{ top: "50%", left: "50%", transform: "translate(-50%, -50%)", animationDelay: "4s" }} />
        {/* Scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-[1px] bg-gradient-to-l from-transparent via-[#06d6e0]/20 to-transparent" style={{ animation: "scan-line 8s linear infinite" }} />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col items-center text-center gap-8">
          {/* Status badge */}
          <div
            className={`inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#06d6e0]/20 bg-[#06d6e0]/5 transition-all duration-1000 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27ca40] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27ca40]" />
            </span>
            <span className="text-xs font-mono text-[#06d6e0] tracking-wider">{"זמין לפרויקטים חדשים"}</span>
          </div>

          {/* Main heading */}
          <div
            className={`transition-all duration-1000 delay-200 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-[hsl(210,40%,98%)]">
              {"אני בונה את "}
              <br className="hidden sm:block" />
              <span className="text-gradient-animated">{"העתיד"}</span>
              {" עם "}
              <span className="relative inline-block">
                AI
                <Sparkles className="absolute -top-3 -start-3 w-5 h-5 text-[#06d6e0] animate-pulse" />
              </span>
            </h1>
          </div>

          {/* Typing effect */}
          <div
            className={`transition-all duration-1000 delay-400 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] font-mono">
              <span className="text-[#06d6e0]">{">"}</span>
              <span className="text-[hsl(215,20%,65%)] text-sm md:text-base">
                {roles[roleIndex].slice(0, charIndex)}
              </span>
              <span className="w-[2px] h-5 bg-[#06d6e0]" style={{ animation: "typing-cursor 1s step-end infinite" }} />
            </div>
          </div>

          {/* Description */}
          <p
            className={`text-lg md:text-xl text-[hsl(215,20%,55%)] max-w-2xl leading-relaxed transition-all duration-1000 delay-500 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {"לא מתכנת בצורה המסורתית. משתמש ב-AI לבנות אפליקציות, מערכות ופתרונות טכנולוגיים ברמה הכי גבוהה - מהר, חכם, בלי פשרות."}
          </p>

          {/* CTAs */}
          <div
            className={`flex flex-col sm:flex-row items-center gap-4 transition-all duration-1000 delay-700 ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <Magnetic strength={0.2}>
              <a
                href="#projects"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-[hsl(222,47%,4%)] bg-gradient-to-l from-[#06d6e0] to-[#0abfca] hover:shadow-[0_0_40px_hsl(187,92%,55%,0.4)] transition-all duration-500"
              >
                {"תראה מה בניתי"}
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href="#services"
                className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium text-[hsl(210,40%,98%)] border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] hover:border-[#e84393]/40 hover:shadow-[0_0_30px_hsl(330,85%,60%,0.15)] transition-all duration-500"
              >
                <Play className="w-4 h-4 text-[#e84393]" />
                {"השירותים שלי"}
              </a>
            </Magnetic>
          </div>

          {/* Stats */}
          <div
            className={`flex items-center gap-8 md:gap-16 mt-8 transition-all duration-1000 delay-[900ms] ${
              mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl md:text-4xl font-bold text-[hsl(210,40%,98%)]">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-mono text-[hsl(215,20%,45%)] mt-1">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div
            className={`mt-12 transition-all duration-1000 delay-[1100ms] ${
              mounted ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="flex flex-col items-center gap-2 animate-float">
              <span className="text-[10px] font-mono text-[hsl(215,20%,40%)] tracking-widest uppercase">scroll</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#06d6e0] to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
