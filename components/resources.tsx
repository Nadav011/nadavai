"use client"

import { ExternalLink, FileCode2 } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"
import { CodeCard } from "./code-card"

const repos = [
  {
    title: "Singularity Forge",
    filename: "skillbuilder",
    lang: "ts",
    description: "מנוע לבניית skills ל-Claude Code עם מטריצת 70-Gate, auto-heal, ו-research-first workflows. Web + Mobile.",
    github: "https://github.com/Nadav011/skillbuilder",
    badge: "open source",
    badgeColor: "cyan" as const,
  },
  {
    title: "VibeCoder",
    filename: "vibecoder",
    lang: "tsx",
    description: "אפליקציית ניהול פרויקטים ל-vibe coders. React Native, Expo, 14 OMEGA Skills, Glassmorphism UI.",
    github: "https://github.com/Nadav011/vibecoder",
    badge: "open source",
    badgeColor: "green" as const,
  },
  {
    title: "80 Claude Code Skills",
    filename: "claude-skills",
    lang: "ts",
    description: "מערכת של 80 סקילים: 20 APEX (Web), 25 Flutter (Mobile), 10 Utility, 5 Agent Skills. אוטומציה מלאה לפיתוח.",
    github: "https://github.com/Nadav011",
    badge: "ecosystem",
    badgeColor: "pink" as const,
  },
  {
    title: "AI Agent System",
    filename: "ai-agent-system",
    lang: "py",
    description: "מערכת סוכני AI עם CrewAI, Ollama (מודלים לוקליים), ChromaDB לזיכרון, ו-Docker. AGI מקומי על המחשב שלך.",
    github: "https://github.com/Nadav011",
    badge: "AI/AGI",
    badgeColor: "pink" as const,
  },
  {
    title: "APEX Engine",
    filename: "apex-engine",
    lang: "ts",
    description: "מנוע ביקורת קוד עם 579 gates, auto-healing, זיהוי טכנולוגיה אוטומטי, ומטריצה ויזואלית 10x7.",
    github: "https://github.com/Nadav011",
    badge: "engine",
    badgeColor: "yellow" as const,
  },
]

export function Resources() {
  return (
    <section id="resources" className="relative py-24 md:py-32 bg-[hsl(222,47%,3%)]">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="open source"
          title="משאבים"
          highlight="חינמיים"
          description="ריפוזיטוריז, templates, וכלים שאני נותן במתנה. קח, השתמש, תהנה."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {repos.map((repo, i) => (
            <ScrollReveal key={i} delay={i * 100} direction={i % 2 === 0 ? "left" : "right"}>
              <CodeCard
                title={repo.title}
                filename={repo.filename}
                lang={repo.lang}
                badge={repo.badge}
                badgeColor={repo.badgeColor}
                icon={<FileCode2 className="w-3.5 h-3.5 text-[#06d6e0]" />}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,35%)] select-none leading-5">02</span>
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{repo.description}</p>
                  </div>

                  {/* Terminal-style filename */}
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,35%)] select-none leading-5">03</span>
                    <div className="flex-1 px-3 py-2 rounded-md bg-[hsl(222,47%,4%)] border border-[hsl(215,28%,14%)] font-mono text-xs">
                      <span className="text-[#e84393]">$</span>{" "}
                      <span className="text-[hsl(215,20%,50%)]">gh repo clone Nadav011/</span>
                      <span className="text-[#06d6e0]">{repo.filename}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-3 border-t border-[hsl(215,28%,14%)]">
                    <a href={repo.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#06d6e0] hover:text-[#e84393] transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      {">> github"}
                    </a>
                  </div>
                </div>
              </CodeCard>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
