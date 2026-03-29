"use client"

import { useState, useRef } from "react"
import { Play, Clock, Eye, ExternalLink, ArrowLeft } from "lucide-react"
import { useTranslations } from "next-intl"
import { SectionHeader } from "./section-header"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export function YouTube() {
  const t = useTranslations("youtube")
  const tCat = useTranslations("categories")
  const [activeCategory, setActiveCategory] = useState("all")
  const sectionRef = useRef<HTMLDivElement>(null)

  const categories = [
    { key: "all", display: t("catAll") },
    { key: "AI", display: t("catAI") },
    { key: "dev", display: t("catDev") },
    { key: "demos", display: t("catDemos") },
    { key: "tips", display: t("catTips") },
  ]

  const videos = [
    {
      title: t("v1Title"),
      description: t("v1Desc"),
      thumbnail: null,
      category: "demos",
      duration: "18:42",
      views: "2.1K",
      date: "2026-01",
      color: "oklch(0.81 0.17 193)",
    },
    {
      title: t("v2Title"),
      description: t("v2Desc"),
      thumbnail: null,
      category: "AI",
      duration: "24:15",
      views: "5.3K",
      date: "2026-01",
      color: "oklch(0.65 0.25 350)",
    },
    {
      title: t("v3Title"),
      description: t("v3Desc"),
      thumbnail: null,
      category: "dev",
      duration: "15:30",
      views: "3.8K",
      date: "2025-12",
      color: "oklch(0.50 0.15 270)",
    },
    {
      title: t("v4Title"),
      description: t("v4Desc"),
      thumbnail: null,
      category: "tips",
      duration: "8:45",
      views: "1.7K",
      date: "2025-12",
      color: "oklch(0.81 0.17 193)",
    },
    {
      title: t("v5Title"),
      description: t("v5Desc"),
      thumbnail: null,
      category: "demos",
      duration: "22:10",
      views: "4.2K",
      date: "2025-11",
      color: "oklch(0.65 0.25 350)",
    },
    {
      title: t("v6Title"),
      description: t("v6Desc"),
      thumbnail: null,
      category: "dev",
      duration: "19:55",
      views: "2.9K",
      date: "2025-11",
      color: "oklch(0.50 0.15 270)",
    },
  ]

  const filtered = activeCategory === "all"
    ? videos
    : videos.filter((v) => v.category === activeCategory)

  useGSAP(
    () => {
      ScrollTrigger.batch(".yt-category-btn", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.08 }
          ),
        once: true,
      })

      ScrollTrigger.batch(".video-card", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.12 }
          ),
        once: true,
      })

      ScrollTrigger.batch(".yt-cta", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" }
          ),
        once: true,
      })
    },
    { scope: sectionRef, dependencies: [filtered] }
  )

  return (
    <section ref={sectionRef} id="youtube" aria-label={t("title")} className="relative py-16 md:py-32 bg-bg-deep">
      <div className="absolute inset-0 dot-grid-subtle opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-2 mb-8 md:mb-12 overflow-x-auto px-1 pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              aria-pressed={activeCategory === cat.key}
              className={`yt-category-btn px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 min-h-11 ${
                activeCategory === cat.key
                  ? "bg-pink/15 text-pink border border-pink/30"
                  : "bg-bg-elevated text-text-secondary border border-border hover:border-border/60 hover:text-text-secondary"
              }`}
            >
              {cat.display}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((video) => (
            <div
              key={video.title}
              className="video-card group relative h-full rounded-2xl border border-border bg-bg-surface overflow-hidden transition-all duration-500"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${video.color}35`
                e.currentTarget.style.boxShadow = `0 0 40px ${video.color}10, 0 20px 50px oklch(0 0 0 / 0.25)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ""
                e.currentTarget.style.boxShadow = ""
              }}
            >
              {/* Thumbnail area — vivid mesh-gradient background */}
              <div className="relative aspect-video overflow-hidden">
                {/* Multi-layer vivid bg */}
                <div className="absolute inset-0 bg-bg-elevated" />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `
                      radial-gradient(ellipse 70% 60% at 20% 40%, ${video.color}25, transparent 60%),
                      radial-gradient(ellipse 50% 70% at 80% 20%, ${video.color}12, transparent 50%),
                      radial-gradient(ellipse 80% 40% at 50% 90%, ${video.color}08, transparent 60%)
                    `,
                  }}
                />
                <div className="absolute inset-0 grid-bg opacity-30" />
                {/* Scanline shimmer on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{
                    background: `linear-gradient(180deg, transparent 0%, ${video.color}06 50%, transparent 100%)`, /* rtl-ok: vertical */
                  }}
                />

                {/* Play button with pulse rings */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Pulse rings */}
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 animate-ping"
                      style={{ background: `${video.color}20`, transform: "scale(1.5)" }}
                    />
                    <div
                      className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-60 animate-ping [animation-delay:0.3s]"
                      style={{ background: `${video.color}15`, transform: "scale(2)" }}
                    />
                    {/* Core button */}
                    <div
                      className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                      style={{
                        background: `linear-gradient(135deg, ${video.color}30, ${video.color}15)`,
                        border: `2px solid ${video.color}50`,
                        boxShadow: `0 0 30px ${video.color}20, inset 0 1px 0 ${video.color}30`,
                      }}
                    >
                      <Play className="w-6 h-6 ms-0.5" style={{ color: video.color, filter: `drop-shadow(0 0 6px ${video.color}80)` }} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Duration badge */}
                <div className="absolute bottom-3 end-3 px-2 py-1 rounded-md bg-black/75 backdrop-blur-sm border border-white/10">
                  <span className="text-[11px] font-mono text-white tabular-nums" dir="ltr">{video.duration}</span>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 start-3">
                  <span
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full tracking-wider uppercase backdrop-blur-sm font-semibold"
                    style={{ background: `${video.color}25`, color: video.color, border: `1px solid ${video.color}30` }}
                  >
                    {tCat(video.category)}
                  </span>
                </div>

                {/* Bottom fade into card */}
                <div className="absolute bottom-0 start-0 end-0 h-8 bg-gradient-to-t from-bg-surface to-transparent" /* rtl-ok: vertical */ />
              </div>

              <div className="p-5">
                <h3
                  className="text-sm font-bold text-text mb-2 leading-snug line-clamp-2 transition-colors duration-300"
                  style={{ color: "var(--color-text)" }}
                >
                  {video.title}
                </h3>

                <p className="text-xs text-text-muted leading-relaxed mb-4 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-border/40">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-text-muted group-hover:text-text-secondary transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-mono tabular-nums" dir="ltr">{video.views}</span>
                    </div>
                    <div className="flex items-center gap-1 text-text-muted">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-mono tabular-nums" dir="ltr">{video.date}</span>
                    </div>
                  </div>
                  <ExternalLink
                    className="w-3.5 h-3.5 text-text-muted group-hover:text-pink group-hover:scale-110 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Full card background glow on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 60% 30% at 50% 0%, ${video.color}06, transparent)` }}
              />
            </div>
          ))}
        </div>

        <div className="flex justify-center mt-8 md:mt-12">
          <a
            href="https://youtube.com/@nadavai"
            target="_blank"
            rel="noreferrer"
            className="yt-cta group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-l rtl:bg-gradient-to-r from-[oklch(0.55_0.26_27)] to-[oklch(0.45_0.22_27)] text-white font-bold text-sm hover:shadow-[0_0_40px_oklch(0.55_0.26_27_/_0.3)] transition-all duration-500 min-h-11"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            {t("subscribe")}
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  )
}
