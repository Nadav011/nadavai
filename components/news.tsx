"use client"

import { Flame, Calendar, ArrowLeft } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"
import { CodeCard } from "./code-card"

const news = [
  {
    title: "80 Skills ל-Claude Code",
    filename: "skills-milestone",
    lang: "ts",
    date: "2026-02",
    description: "הגענו ל-80 סקילים מותאמים אישית ל-Claude Code: 20 APEX (Web), 25 Flutter (Mobile), 10 Utility, 5 Agent Skills, ועוד.",
    trending: true,
    badge: "milestone",
    badgeColor: "pink" as const,
  },
  {
    title: "APEX Engine - 579 Gates",
    filename: "apex-engine",
    lang: "ts",
    date: "2026-01",
    description: "מנוע ביקורת קוד עם 579 gates ומטריצה ויזואלית 10x7. Auto-healing, זיהוי טכנולוגיה אוטומטי, ודוחות מפורטים.",
    trending: true,
    badge: "engine",
    badgeColor: "pink" as const,
  },
  {
    title: "Singularity Forge - Open Source",
    filename: "singularity-forge",
    lang: "ts",
    date: "2026-01",
    description: "שחררתי את Singularity Forge - מנוע לבניית skills עם 70-Gate Matrix, auto-heal, ו-research workflows. פתוח לכולם.",
    trending: false,
    badge: "open source",
    badgeColor: "cyan" as const,
  },
]

export function News() {
  return (
    <section id="news" aria-label="חדשות טכנולוגיה" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="news"
          title="חדשות"
          highlight="ועדכונים"
          description="מה חדש בעולם ה-AI, כלים חדשים, עדכונים חשובים, ובמה אני משתמש עכשיו."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <ScrollReveal key={i} delay={i * 100} direction={i === 1 ? "up" : i === 0 ? "right" : "left"}>
              <CodeCard
                title={item.title}
                filename={item.filename}
                lang={item.lang}
                badge={item.badge}
                badgeColor={item.badgeColor}
                icon={item.trending ? <Flame className="w-3.5 h-3.5 text-[#e84393]" /> : undefined}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,35%)] select-none leading-5">02</span>
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{item.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,14%)]">
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono">{item.date}</span>
                    </div>
                    <button className="inline-flex items-center gap-1.5 text-xs font-mono text-[#06d6e0] hover:text-[#e84393] transition-colors group/btn">
                      {">> read"}
                      <ArrowLeft className="w-3 h-3 group-hover/btn:-translate-x-0.5 transition-transform" />
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
