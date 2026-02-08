"use client"

import { useRef } from "react"
import { Flame, Calendar, ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { SectionHeader } from "./section-header"
import { CodeCard } from "./code-card"

gsap.registerPlugin(ScrollTrigger)

const news = [
  {
    title: "n1Title",
    filename: "skills-milestone",
    lang: "ts",
    date: "2026-02",
    description: "n1Desc",
    trending: true,
    badge: "milestone",
    badgeColor: "pink" as const,
  },
  {
    title: "n2Title",
    filename: "apex-engine",
    lang: "ts",
    date: "2026-01",
    description: "n2Desc",
    trending: true,
    badge: "engine",
    badgeColor: "pink" as const,
  },
  {
    title: "n3Title",
    filename: "singularity-forge",
    lang: "ts",
    date: "2026-01",
    description: "n3Desc",
    trending: false,
    badge: "open source",
    badgeColor: "cyan" as const,
  },
]

export function News() {
  const t = useTranslations("news")
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      ScrollTrigger.batch(".news-card", {
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
    <section ref={sectionRef} id="news" aria-label={t("title")} className="relative py-24 md:py-32">
      <div className="absolute inset-0 dot-grid-subtle opacity-[0.12] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.map((item, i) => (
            <div key={i} className="news-card">
              <CodeCard
                title={t(item.title)}
                filename={item.filename}
                lang={item.lang}
                badge={item.badge}
                badgeColor={item.badgeColor}
                icon={item.trending ? <Flame className="w-3.5 h-3.5 text-[#e84393]" /> : undefined}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,45%)] select-none leading-5">02</span>
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{t(item.description)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,14%)]">
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono">{item.date}</span>
                    </div>
                    <button aria-label={t(item.title)} className="inline-flex items-center gap-1.5 text-xs font-mono text-[#06d6e0] hover:text-[#e84393] transition-colors group/btn">
                      {">> read"}
                      <ArrowLeft className="w-3 h-3 group-hover/btn:-translate-x-0.5 transition-transform rtl:rotate-180" />
                    </button>
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
