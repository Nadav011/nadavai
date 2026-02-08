"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const techs = [
  "Claude Code", "GPT", "Codex", "Cursor", "v0.dev", "Gemini", "Deepseek", "Qwen",
  "Next.js", "React", "TypeScript", "Supabase", "Tailwind", "Vercel", "Node.js",
  "Flutter", "Dart", "Firebase", "React Native", "Expo", "Capacitor", "AI SDK",
  "Python", "CrewAI", "Docker", "Ollama", "ChromaDB", "Bun",
]

const row1 = techs.slice(0, Math.ceil(techs.length / 2))
const row2 = techs.slice(Math.ceil(techs.length / 2))

// Triple the items to ensure there are never gaps on any screen size
const row1Triple = [...row1, ...row1, ...row1]
const row2Triple = [...row2, ...row2, ...row2]

export function TechMarquee() {
  const sectionRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    if (!sectionRef.current) return

    gsap.fromTo(
      sectionRef.current,
      { opacity: 0, y: 15 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    )
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative py-8 md:py-12 border-y border-[hsl(215,28%,16%)] overflow-hidden bg-[hsl(222,47%,4%)]"
    >
      {/* Fade edges */}
      <div className="absolute start-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-transparent to-[hsl(222,47%,4%)]" />
      <div className="absolute end-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-transparent to-[hsl(222,47%,4%)]" />

      <div className="flex flex-col gap-4 md:gap-6">
        {/* Row 1 */}
        <div className="flex animate-marquee whitespace-nowrap">
          {row1Triple.map((tech, i) => (
            <div key={`r1-${i}`} className="flex items-center gap-4 md:gap-8 mx-4 md:mx-8">
              <span className="tech-item text-xs md:text-sm font-mono text-[hsl(215,20%,45%)] hover:text-[#06d6e0] transition-all duration-300 cursor-default">
                {tech}
              </span>
              <span className="w-1 h-1 rounded-full bg-[hsl(215,28%,25%)] flex-shrink-0" />
            </div>
          ))}
        </div>

        {/* Row 2 - reverse */}
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {row2Triple.map((tech, i) => (
            <div key={`r2-${i}`} className="flex items-center gap-4 md:gap-8 mx-4 md:mx-8">
              <span className="tech-item text-xs md:text-sm font-mono text-[hsl(215,20%,45%)] hover:text-[#06d6e0] transition-all duration-300 cursor-default">
                {tech}
              </span>
              <span className="w-1 h-1 rounded-full bg-[hsl(215,28%,25%)] flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .tech-item:hover {
          text-shadow: 0 0 20px hsl(187 92% 55% / 0.6), 0 0 30px hsl(187 92% 55% / 0.4);
        }
      `}</style>
    </section>
  )
}
