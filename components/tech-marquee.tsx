"use client"

import { useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const row1Items = [
  "Claude Code", "GPT-4o", "Codex", "Cursor", "v0.dev", "Gemini Pro", "DeepSeek V3",
  "Qwen 2.5", "Mistral", "Llama 3", "Copilot", "Perplexity", "Grok", "Midjourney",
  "Stable Diffusion", "DALL-E 3", "Claude Opus", "GPT-5",
]

const row2Items = [
  "Next.js", "React", "TypeScript", "Supabase", "Tailwind", "Vercel", "Node.js",
  "Flutter", "Dart", "Firebase", "React Native", "Expo", "AI SDK", "Python",
  "CrewAI", "Docker", "Ollama", "ChromaDB", "Bun", "Prisma",
]

// Quadruple items to guarantee no gaps on any screen size
const row1Quad = [...row1Items, ...row1Items, ...row1Items, ...row1Items]
const row2Quad = [...row2Items, ...row2Items, ...row2Items, ...row2Items]

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
          {row1Quad.map((tech, i) => (
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
          {row2Quad.map((tech, i) => (
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
