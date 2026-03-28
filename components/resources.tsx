"use client"

import { useRef } from "react"
import { ExternalLink, FileCode2, Star, GitFork } from "lucide-react"
import { useTranslations } from "next-intl"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { SectionHeader } from "./section-header"
import { CodeCard } from "./code-card"

gsap.registerPlugin(ScrollTrigger)

// Language color dots — standard GitHub language colors
const langColors: Record<string, string> = {
  ts: "#3178c6",
  tsx: "#3178c6",
  py: "#3572A5",
  dart: "#00B4AB",
  js: "#f1e05a",
}

const repos = [
  {
    title: "Singularity Forge",
    filename: "skillbuilder",
    lang: "ts",
    description: "r1Desc",
    github: "https://github.com/Nadav011/skillbuilder",
    badge: "open source",
    badgeColor: "cyan" as const,
    stars: 48,
    forks: 7,
  },
  {
    title: "VibeCoder",
    filename: "vibecoder",
    lang: "tsx",
    description: "r2Desc",
    github: "https://github.com/Nadav011/vibecoder",
    badge: "open source",
    badgeColor: "green" as const,
    stars: 31,
    forks: 4,
  },
  {
    title: "80 Claude Code Skills",
    filename: "claude-skills",
    lang: "ts",
    description: "r3Desc",
    github: "https://github.com/Nadav011",
    badge: "ecosystem",
    badgeColor: "pink" as const,
    stars: 124,
    forks: 19,
  },
  {
    title: "AI Agent System",
    filename: "ai-agent-system",
    lang: "py",
    description: "r4Desc",
    github: "https://github.com/Nadav011",
    badge: "AI/AGI",
    badgeColor: "pink" as const,
    stars: 87,
    forks: 12,
  },
  {
    title: "APEX Engine",
    filename: "apex-engine",
    lang: "ts",
    description: "r5Desc",
    github: "https://github.com/Nadav011",
    badge: "engine",
    badgeColor: "yellow" as const,
    stars: 203,
    forks: 28,
  },
]

export function Resources() {
  const t = useTranslations("resources")
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      ScrollTrigger.batch(".resource-card", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.12 }
          ),
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="resources" aria-label={t("title")} className="relative py-16 md:py-32 bg-bg-deep">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {repos.map((repo, i) => (
            <div key={i} className="resource-card">
              <CodeCard
                title={repo.title}
                filename={repo.filename}
                lang={repo.lang}
                badge={repo.badge}
                badgeColor={repo.badgeColor}
                icon={<FileCode2 className="w-3.5 h-3.5 text-cyan" />}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-text-muted select-none leading-5">02</span>
                    <p className="text-sm text-text-secondary leading-relaxed">{t(repo.description)}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-text-muted select-none leading-5">03</span>
                    <div className="flex-1 px-3 py-2 rounded-md bg-bg-deep border border-border font-mono text-xs group/cmd hover:border-cyan/20 transition-colors duration-300">
                      <span className="text-pink">$</span>{" "}
                      <span className="text-text-muted">gh repo clone Nadav011/</span>
                      <span className="text-cyan group-hover/cmd:glow-text">{repo.filename}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    {/* Language color dot + star/fork counts */}
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: langColors[repo.lang] ?? "#888" }}
                        />
                        <span className="text-[10px] font-mono text-text-muted uppercase">{repo.lang}</span>
                      </div>
                      <div className="flex items-center gap-1 text-text-muted hover:text-amber-400 transition-colors cursor-default">
                        <Star className="w-3 h-3" />
                        <span className="text-[10px] font-mono tabular-nums" dir="ltr">{repo.stars}</span>
                      </div>
                      <div className="flex items-center gap-1 text-text-muted hover:text-text-secondary transition-colors cursor-default">
                        <GitFork className="w-3 h-3" />
                        <span className="text-[10px] font-mono tabular-nums" dir="ltr">{repo.forks}</span>
                      </div>
                    </div>
                    <a
                      href={repo.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan hover:text-pink hover:glow-text transition-all duration-300"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {">> github"}
                    </a>
                  </div>
                </div>
              </CodeCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
