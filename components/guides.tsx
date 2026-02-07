"use client"

import { BookOpen, Play, Clock, Eye } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"
import { CodeCard } from "./code-card"

const guides = [
  {
    title: "איך לבנות SaaS מלא עם AI",
    filename: "build-saas",
    type: "guide",
    lang: "md",
    description: "מדריך צעד-אחר-צעד: מרעיון ל-SaaS עובד עם AI - כולל auth, payments, ו-dashboard.",
    readTime: "25 דק'",
    views: "3.2K",
    badge: "popular",
    badgeColor: "pink" as const,
  },
  {
    title: "Prompt Engineering למתקדמים",
    filename: "prompt-eng",
    type: "guide",
    lang: "txt",
    description: "הסודות מאחורי prompts שעובדים. טכניקות chain-of-thought, few-shot, ו-system prompts.",
    readTime: "18 דק'",
    views: "5.1K",
    badge: "featured",
    badgeColor: "cyan" as const,
  },
  {
    title: "Next.js + AI SDK - המדריך המלא",
    filename: "nextjs-ai",
    type: "video",
    lang: "tsx",
    description: "סרטון מלא: בניית אפליקציית AI עם Next.js, AI SDK, streaming, ו-tool calling.",
    readTime: "45 דק'",
    views: "8.7K",
    badge: "video",
    badgeColor: "green" as const,
  },
  {
    title: "מ-0 ל-Deploy בשעה",
    filename: "zero-deploy",
    type: "guide",
    lang: "sh",
    description: "איך לקחת רעיון ולהפוך אותו לאפליקציה חיה תוך שעה אחת עם v0, Cursor, ו-Vercel.",
    readTime: "15 דק'",
    views: "4.5K",
    badge: "new",
    badgeColor: "yellow" as const,
  },
]

export function Guides() {
  return (
    <section id="guides" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="guides"
          title="מדריכים"
          highlight="ותוכן"
          description="מדריכים מעשיים, סרטונים, וטיפים - הכל חינם. כדי שגם אתה תוכל לבנות עם AI."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide, i) => (
            <ScrollReveal key={i} delay={i * 100}>
              <CodeCard
                title={guide.title}
                filename={guide.filename}
                lang={guide.lang}
                badge={guide.badge}
                badgeColor={guide.badgeColor}
                icon={guide.type === "video" ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <BookOpen className="w-3.5 h-3.5 text-[#06d6e0]" />}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,35%)] select-none leading-5">02</span>
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{guide.description}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,14%)]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono">{guide.readTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono">{guide.views}</span>
                      </div>
                    </div>
                    <button className="text-xs font-mono text-[#06d6e0] hover:text-[#e84393] transition-colors">
                      {guide.type === "video" ? ">> play" : ">> read"}
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
