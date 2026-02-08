"use client"

import { useRef } from "react"
import { BookOpen, Play, Clock } from "lucide-react"
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
    <section ref={sectionRef} id="guides" aria-label={t("title")} className="relative py-24 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-[0.15] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {guides.map((guide, i) => (
            <div key={i} className="guide-card">
              <CodeCard
                title={t(guide.title)}
                filename={guide.filename}
                lang={guide.lang}
                badge={guide.badge}
                badgeColor={guide.badgeColor}
                icon={guide.type === "video" ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <BookOpen className="w-3.5 h-3.5 text-[#06d6e0]" />}
              >
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,45%)] select-none leading-5">02</span>
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{t(guide.description)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,14%)]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono">{t(guide.readTime)}</span>
                      </div>
                    </div>
                    <button aria-label={t(guide.title)} className="text-xs font-mono text-[#06d6e0] hover:text-[#e84393] transition-colors">
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
