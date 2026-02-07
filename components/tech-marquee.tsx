"use client"

const techs = [
  "Claude Code", "GPT-4", "Cursor", "v0.dev", "Next.js", "React", "TypeScript",
  "Supabase", "Tailwind", "Vercel", "Node.js", "Flutter", "Dart",
  "Firebase", "React Native", "Expo", "Capacitor", "AI SDK",
  "Python", "CrewAI", "Docker", "Ollama",
]

export function TechMarquee() {
  return (
    <section className="relative py-12 border-y border-[hsl(215,28%,16%)] overflow-hidden bg-[hsl(222,47%,4%)]">
      {/* Fade edges */}
      <div className="absolute start-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-l from-transparent to-[hsl(222,47%,4%)]" />
      <div className="absolute end-0 top-0 bottom-0 w-32 z-10 bg-gradient-to-r from-transparent to-[hsl(222,47%,4%)]" />

      <div className="flex animate-marquee whitespace-nowrap">
        {[...techs, ...techs].map((tech, i) => (
          <div key={i} className="flex items-center gap-8 mx-8">
            <span className="text-sm font-mono text-[hsl(215,20%,35%)] hover:text-[#06d6e0] transition-colors duration-300 cursor-default">
              {tech}
            </span>
            <span className="w-1 h-1 rounded-full bg-[hsl(215,28%,25%)]" />
          </div>
        ))}
      </div>
    </section>
  )
}
