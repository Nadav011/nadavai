"use client"

import { useRef, useState } from "react"
import { Calendar, Clock, ArrowLeft, MessageSquare, ThumbsUp, ExternalLink } from "lucide-react"
import { useTranslations, useLocale } from "next-intl"
import { SectionHeader } from "./section-header"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export function Blog() {
  const t = useTranslations("blog")
  const tCat = useTranslations("categories")
  const locale = useLocale()
  const [activeCategory, setActiveCategory] = useState("all")
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const categoryRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  const categories = [
    { key: "all", display: t("catAll") },
    { key: "AI", display: t("catAI") },
    { key: "dev", display: t("catDev") },
    { key: "tips", display: t("catTips") },
    { key: "career", display: t("catCareer") },
  ]

  const posts = [
    {
      title: t("b1Title"),
      excerpt: t("b1Excerpt"),
      category: "AI",
      date: "2026-02-01",
      readTime: 4,
      likes: 47,
      comments: 12,
      platform: "Facebook",
      href: "https://www.facebook.com/nadav.cohen.167",
      color: "oklch(0.81 0.17 193)",
    },
    {
      title: t("b2Title"),
      excerpt: t("b2Excerpt"),
      category: "dev",
      date: "2026-01-15",
      readTime: 6,
      likes: 83,
      comments: 24,
      platform: "Facebook",
      href: "https://www.facebook.com/nadav.cohen.167",
      color: "oklch(0.65 0.25 350)",
    },
    {
      title: t("b3Title"),
      excerpt: t("b3Excerpt"),
      category: "AI",
      date: "2026-01-05",
      readTime: 8,
      likes: 156,
      comments: 42,
      platform: "Facebook",
      href: "https://www.facebook.com/nadav.cohen.167",
      color: "oklch(0.50 0.15 270)",
    },
    {
      title: t("b4Title"),
      excerpt: t("b4Excerpt"),
      category: "tips",
      date: "2025-12-20",
      readTime: 5,
      likes: 92,
      comments: 18,
      platform: "Facebook",
      href: "https://www.facebook.com/nadav.cohen.167",
      color: "oklch(0.81 0.17 193)",
    },
    {
      title: t("b5Title"),
      excerpt: t("b5Excerpt"),
      category: "career",
      date: "2025-12-10",
      readTime: 10,
      likes: 210,
      comments: 56,
      platform: "Facebook",
      href: "https://www.facebook.com/nadav.cohen.167",
      color: "oklch(0.65 0.25 350)",
    },
    {
      title: t("b6Title"),
      excerpt: t("b6Excerpt"),
      category: "dev",
      date: "2025-11-28",
      readTime: 7,
      likes: 134,
      comments: 31,
      platform: "Facebook",
      href: "https://www.facebook.com/nadav.cohen.167",
      color: "oklch(0.50 0.15 270)",
    },
  ]

  function formatDate(dateStr: string) {
    const date = new Date(dateStr)
    return date.toLocaleDateString(locale === "he" ? "he-IL" : "en-US", { day: "numeric", month: "short", year: "numeric" })
  }

  const filtered = activeCategory === "all"
    ? posts
    : posts.filter((p) => p.category === activeCategory)

  useGSAP(() => {
    if (!sectionRef.current) return

    // Animate section header
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      )
    }

    // Animate category filters
    if (categoryRef.current) {
      gsap.fromTo(
        categoryRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: categoryRef.current,
            start: "top 85%",
            once: true,
          },
        }
      )
    }

    // Animate blog post cards with batch
    ScrollTrigger.batch(".blog-card", {
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "expo.out",
            duration: 0.7,
          }
        )
      },
      start: "top 85%",
      once: true,
    })

    // Animate CTA button
    if (ctaRef.current) {
      gsap.fromTo(
        ctaRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: ctaRef.current,
            start: "top 85%",
            once: true,
          },
        }
      )
    }
  }, { scope: sectionRef, dependencies: [filtered] })

  return (
    <section ref={sectionRef} id="blog" aria-label={t("title")} className="relative py-16 md:py-32">
      <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div ref={headerRef}>
          <SectionHeader
            badge={t("badge")}
            title={t("title")}
            highlight={t("highlight")}
            description={t("description")}
          />
        </div>

        {/* Category filter */}
        <div ref={categoryRef} className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-2 mb-8 md:mb-12 overflow-x-auto px-1 pb-2 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              aria-pressed={activeCategory === cat.key}
              className={`px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 min-h-11 ${
                activeCategory === cat.key
                  ? "bg-cyan/15 text-cyan border border-cyan/30"
                  : "bg-bg-elevated text-text-secondary border border-border hover:border-border/60 hover:text-text-secondary"
              }`}
            >
              {cat.display}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((post) => (
            <a
              key={post.title}
              href={post.href}
              target="_blank"
              rel="noreferrer"
              className="blog-card group relative block h-full rounded-2xl border border-border bg-bg-surface overflow-hidden hover:shadow-[0_0_30px_oklch(0_0_0_/_0.3)] transition-all duration-500"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${post.color}40`
                e.currentTarget.style.boxShadow = `0 0 35px ${post.color}10, 0 20px 40px oklch(0 0 0 / 0.2)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ""
                e.currentTarget.style.boxShadow = ""
              }}
            >
              {/* Top accent — always faintly visible, bright on hover */}
              <div
                className="h-[2px] opacity-30 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to right, transparent, ${post.color}, transparent)` /* rtl-ok: symmetric center-fade */ }}
              />

              <div className="p-4 md:p-6">
                {/* Meta row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full tracking-wider uppercase font-semibold"
                    style={{ background: `${post.color}15`, color: post.color, border: `1px solid ${post.color}30` }}
                  >
                    {tCat(post.category)}
                  </span>
                  {/* Reading time chip — prominent */}
                  <div
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold"
                    style={{ background: `${post.color}10`, color: post.color, border: `1px solid ${post.color}20` }}
                  >
                    <Clock className="w-3 h-3" />
                    <span dir="ltr">{post.readTime} min</span>
                  </div>
                </div>

                {/* Title */}
                <h3
                  className="text-base font-bold mb-3 leading-snug line-clamp-2 transition-colors duration-300"
                  style={{ color: "var(--color-text)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = post.color }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "" }}
                >
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-text-muted leading-relaxed mb-5 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-text-muted group-hover:text-text-secondary transition-colors">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono tabular-nums" dir="ltr">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted group-hover:text-text-secondary transition-colors">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono tabular-nums" dir="ltr">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-text-muted">
                      <Calendar className="w-3 h-3" />
                      <span className="text-[10px] font-mono" dir="ltr">{formatDate(post.date)}</span>
                    </div>
                  </div>
                  <ExternalLink
                    className="w-4 h-4 text-text-muted transition-all duration-300 group-hover:scale-110"
                    style={{ color: undefined }}
                    onMouseEnter={(e) => { (e.currentTarget as SVGElement).style.color = post.color }}
                    onMouseLeave={(e) => { (e.currentTarget as SVGElement).style.color = "" }}
                  />
                </div>
              </div>

              {/* Background hover glow — stronger */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 80% 50% at 50% 0%, ${post.color}08, transparent 70%)` }}
              />
            </a>
          ))}
        </div>

        {/* View all CTA */}
        <div ref={ctaRef} className="flex justify-center mt-8 md:mt-12">
          <a
            href="https://www.facebook.com/nadav.cohen.167"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-border/80 bg-bg-elevated text-sm font-medium text-text-secondary hover:text-cyan hover:border-cyan/30 transition-all duration-500 min-h-11"
          >
            {t("allPosts")}
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  )
}
