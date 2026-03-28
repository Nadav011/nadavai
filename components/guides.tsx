"use client"

import { useRef } from "react"
import { BookOpen, Play, Radio } from "lucide-react"
import { useTranslations } from "next-intl"
import { SectionHeader } from "./section-header"
import { CodeCard } from "./code-card"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

const guides = [
  {
    title: "g1Title",
    filename: "mexicani-case",
    type: "guide",
    lang: "tsx",
    description: "g1Desc",
    readTime: "comingSoon",
    badge: "case study",
    badgeColor: "pink" as const,
  },
  {
    title: "g2Title",
    filename: "pwa-offline",
    type: "guide",
    lang: "ts",
    description: "g2Desc",
    readTime: "comingSoon",
    badge: "technical",
    badgeColor: "cyan" as const,
  },
  {
    title: "g3Title",
    filename: "skills-guide",
    type: "guide",
    lang: "ts",
    description: "g3Desc",
    readTime: "comingSoon",
    badge: "ecosystem",
    badgeColor: "green" as const,
  },
  {
    title: "g4Title",
    filename: "flutter-prod",
    type: "guide",
    lang: "dart",
    description: "g4Desc",
    readTime: "comingSoon",
    badge: "mobile",
    badgeColor: "yellow" as const,
  },
]

export function Guides() {
  const t = useTranslations("guides")
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      ScrollTrigger.batch(".guide-card", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.12 }
          ),
        once: true,
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="guides" aria-label={t("title")} className="relative py-16 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-[0.15] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {guides.map((guide, i) => (
            <div key={i} className="guide-card">
              <CodeCard
                title={t(guide.title)}
                filename={guide.filename}
                lang={guide.lang}
                badge={guide.badge}
                badgeColor={guide.badgeColor}
                icon={guide.type === "video" ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <BookOpen className="w-3.5 h-3.5 text-cyan" />}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-text-muted select-none leading-5">02</span>
                    <p className="text-sm text-text-secondary leading-relaxed">{t(guide.description)}</p>
                  </div>

                  {/* Premium progress bar — gradient fill */}
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-text-muted select-none leading-5">03</span>
                    <div className="flex-1 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-text-muted uppercase tracking-wider">progress</span>
                        <span className="text-[10px] font-mono text-text-muted tabular-nums">0%</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-border/60 overflow-hidden">
                        <div
                          className="h-full w-0 rounded-full transition-all duration-1000"
                          style={{
                            background: guide.badgeColor === "pink"
                              ? "linear-gradient(90deg, oklch(0.65 0.25 350), oklch(0.72 0.27 350))" /* rtl-ok: cosmetic direction */
                              : guide.badgeColor === "cyan"
                                ? "linear-gradient(90deg, oklch(0.81 0.17 193), oklch(0.87 0.19 193))" /* rtl-ok */
                                : guide.badgeColor === "green"
                                  ? "linear-gradient(90deg, oklch(0.70 0.18 152), oklch(0.78 0.20 152))" /* rtl-ok */
                                  : "linear-gradient(90deg, oklch(0.75 0.18 65), oklch(0.82 0.20 65))", /* rtl-ok */
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="flex items-center gap-3">
                      {/* "Live" / Coming Soon badge with pulse dot */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">{t(guide.readTime)}</span>
                      </div>
                      <div className="flex items-center gap-1 text-text-muted">
                        <Radio className="w-3 h-3" />
                        <span className="text-[10px] font-mono">soon</span>
                      </div>
                    </div>
                    <button aria-label={t(guide.title)} className="text-xs font-mono text-cyan hover:text-pink transition-colors duration-300">
                      {guide.type === "video" ? ">> play" : ">> read"}
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
