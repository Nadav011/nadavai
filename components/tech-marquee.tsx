"use client"

import Marquee from "react-fast-marquee"

const row1Items = [
  "Claude Code", "GPT-4o", "Codex", "Cursor", "v0.dev", "Gemini Pro", "DeepSeek V3",
  "Qwen 2.5", "Mistral", "Llama 3", "Copilot", "Perplexity", "Grok", "Midjourney",
  "Stable Diffusion", "DALL-E 3", "Claude Opus", "GPT-5",
]

const row2Items = [
  "Next.js", "React", "TypeScript", "Supabase", "Tailwind", "Cloudflare", "Node.js",
  "Flutter", "Dart", "Firebase", "React Native", "Expo", "AI SDK", "Python",
  "CrewAI", "Docker", "Ollama", "ChromaDB", "Bun", "Prisma",
]

function TechItem({ tech }: { tech: string }) {
  return (
    <div className="flex items-center gap-4 md:gap-8 mx-4 md:mx-8">
      <span className="tech-item text-xs md:text-sm font-mono text-text-secondary hover:text-cyan transition-all duration-300 cursor-default">
        {tech}
      </span>
      <span className="w-1 h-1 rounded-full bg-border flex-shrink-0" />
    </div>
  )
}

export function TechMarquee() {
  return (
    <section
      id="tech-marquee"
      aria-label="Tech stack and tools"
      className="relative py-8 md:py-12 border-y border-border overflow-hidden bg-bg-deep"
    >
      {/* Fade edges — ltr: left fade / rtl: right fade, handled with logical inset */}
      {/* rtl-ok: marquee direction is visual-only, fades intentionally mirror */}
      <div className="absolute inset-s-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-bg-deep to-transparent rtl:bg-gradient-to-l" />
      <div className="absolute inset-e-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-bg-deep to-transparent rtl:bg-gradient-to-r" />

      <div className="flex flex-col gap-4 md:gap-6">
        <Marquee speed={40} gradient={false} pauseOnHover>
          {row1Items.map((tech, i) => (
            <TechItem key={`r1-${i}`} tech={tech} />
          ))}
        </Marquee>

        <Marquee speed={40} gradient={false} pauseOnHover direction="right">
          {row2Items.map((tech, i) => (
            <TechItem key={`r2-${i}`} tech={tech} />
          ))}
        </Marquee>
      </div>

      <style jsx>{`
        .tech-item:hover {
          text-shadow: 0 0 20px oklch(0.81 0.17 193 / 0.6), 0 0 30px oklch(0.81 0.17 193 / 0.4);
        }
      `}</style>
    </section>
  )
}
