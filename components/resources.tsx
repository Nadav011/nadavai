"use client"

import { GitFork, Download, Star, FileCode2 } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"
import { CodeCard } from "./code-card"

const repos = [
  {
    title: "AI Starter Kit",
    filename: "ai-starter-kit",
    lang: "tsx",
    description: "Template מלא לפרויקט AI: Next.js, AI SDK, auth, database. רק clone ותתחיל.",
    stars: 450,
    forks: 120,
    downloads: "2.1K",
    badge: "template",
    badgeColor: "cyan" as const,
  },
  {
    title: "Prompt Library",
    filename: "prompt-library",
    lang: "json",
    description: "ספריית prompts מוכנים לכל use-case: coding, writing, analysis, agents.",
    stars: 680,
    forks: 200,
    downloads: "4.5K",
    badge: "free",
    badgeColor: "green" as const,
  },
  {
    title: "AI Agent Framework",
    filename: "agent-framework",
    lang: "ts",
    description: "Framework לבניית סוכני AI עם tool-calling, memory, ו-multi-step reasoning.",
    stars: 320,
    forks: 85,
    downloads: "1.8K",
    badge: "beta",
    badgeColor: "yellow" as const,
  },
  {
    title: "Dark UI Components",
    filename: "dark-ui-kit",
    lang: "tsx",
    description: "ספריית קומפוננטות dark-mode מוכנות. גלאסמורפיזם, אנימציות, ו-accessibility.",
    stars: 890,
    forks: 310,
    downloads: "6.2K",
    badge: "popular",
    badgeColor: "pink" as const,
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
            <ScrollReveal key={i} delay={i * 100}>
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

                  {/* Terminal-style install command */}
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,35%)] select-none leading-5">03</span>
                    <div className="flex-1 px-3 py-2 rounded-md bg-[hsl(222,47%,4%)] border border-[hsl(215,28%,14%)] font-mono text-xs">
                      <span className="text-[#e84393]">$</span>{" "}
                      <span className="text-[hsl(215,20%,50%)]">npx create-nadav-app</span>{" "}
                      <span className="text-[#06d6e0]">{repo.filename}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,14%)]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                        <Star className="w-3.5 h-3.5 text-amber-400" />
                        <span className="text-xs font-mono">{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                        <GitFork className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono">{repo.forks}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                        <Download className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono">{repo.downloads}</span>
                      </div>
                    </div>
                    <button className="text-xs font-mono text-[#06d6e0] hover:text-[#e84393] transition-colors">
                      {">> clone"}
                    </button>
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
