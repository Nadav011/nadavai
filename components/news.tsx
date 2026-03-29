"use client"

import { useRef } from "react"
import { Flame, Calendar, ArrowLeft, TrendingUp } from "lucide-react"
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
    <section ref={sectionRef} id="news" aria-label={t("title")} className="relative py-16 md:py-32">
      <div className="absolute inset-0 dot-grid-subtle opacity-[0.12] pointer-events-none" aria-hidden="true" />
      {/* Subtle pink glow at top for news/updates energy */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-3xl h-32 bg-pink/[0.03] rounded-full blur-[80px] pointer-events-none" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {news.map((item, i) => (
            <div key={i} className="news-card relative">
              {/* Animated timeline dot above card (visual only, decorative) */}
              <div className="absolute -top-2 start-6 z-10 flex items-center gap-2">
                <div
                  className="relative w-3.5 h-3.5 rounded-full flex items-center justify-center"
                  style={{
                    background: item.trending ? "oklch(0.65 0.25 350)" : "oklch(0.81 0.17 193)",
                    boxShadow: item.trending
                      ? "0 0 10px oklch(0.65 0.25 350 / 0.6)"
                      : "0 0 10px oklch(0.81 0.17 193 / 0.4)",
                  }}
                >
                  {item.trending && (
                    <span className="absolute inset-0 rounded-full animate-ping opacity-50"
                      style={{ background: "oklch(0.65 0.25 350 / 0.4)" }}
                    />
                  )}
                </div>
              </div>

              <CodeCard
                title={t(item.title)}
                filename={item.filename}
                lang={item.lang}
                badge={item.badge}
                badgeColor={item.badgeColor}
                icon={item.trending ? <Flame className="w-3.5 h-3.5 text-pink animate-pulse" /> : undefined}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-text-muted select-none leading-5">02</span>
                    <p className="text-sm text-text-secondary leading-relaxed">{t(item.description)}</p>
                  </div>

                  {/* Trending badge row */}
                  {item.trending && (
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono text-text-muted select-none leading-5">03</span>
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink/10 border border-pink/20">
                        <TrendingUp className="w-3 h-3 text-pink" />
                        <span className="text-[10px] font-mono text-pink uppercase tracking-wider font-semibold">trending</span>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-1.5">
                      {/* Gradient timeline dot */}
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{
                          background: item.trending ? "oklch(0.65 0.25 350)" : "oklch(0.81 0.17 193)",
                          boxShadow: item.trending ? "0 0 6px oklch(0.65 0.25 350 / 0.8)" : "0 0 6px oklch(0.81 0.17 193 / 0.6)",
                        }}
                      />
                      <Calendar className="w-3.5 h-3.5 text-text-muted" />
                      <span className="text-xs font-mono text-text-muted tabular-nums">{item.date}</span>
                    </div>
                    {/* aria-label starts with visible text to satisfy label-content-name rule */}
                    <button
                      aria-label={`>> read: ${t(item.title)}`}
                      className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan hover:text-pink transition-colors duration-300 group/btn"
                    >
                      {">> read"}
                      <ArrowLeft className="w-3 h-3 group-hover/btn:-translate-x-0.5 rtl:group-hover/btn:translate-x-0.5 transition-transform rtl:rotate-180" aria-hidden="true" />
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
