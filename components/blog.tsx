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
      color: "#06d6e0",
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
      color: "#e84393",
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
      color: "#4f46e5",
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
      color: "#06d6e0",
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
      color: "#e84393",
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
      color: "#4f46e5",
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
                  ? "bg-[#06d6e0]/15 text-[#06d6e0] border border-[#06d6e0]/30"
                  : "bg-[hsl(222,47%,6%)] text-[hsl(215,20%,50%)] border border-[hsl(215,28%,16%)] hover:border-[hsl(215,28%,22%)] hover:text-[hsl(215,20%,65%)]"
              }`}
            >
              {cat.display}
            </button>
          ))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map((post, i) => (
            <a
              key={post.title}
              href={post.href}
              target="_blank"
              rel="noreferrer"
              className="blog-card group relative block h-full rounded-2xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] overflow-hidden hover:border-opacity-50 transition-all duration-500"
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${post.color}30` }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "" }}
            >
              {/* Top accent */}
              <div
                className="h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{ background: `linear-gradient(to right, transparent, ${post.color}, transparent)` }}
              />

              <div className="p-6">
                {/* Meta row */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="text-[10px] font-mono px-2.5 py-1 rounded-full tracking-wider uppercase"
                    style={{ background: `${post.color}12`, color: post.color, border: `1px solid ${post.color}25` }}
                  >
                    {tCat(post.category)}
                  </span>
                  <div className="flex items-center gap-1.5 text-[hsl(215,20%,48%)]">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[11px] font-mono" dir="ltr">{formatDate(post.date)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[hsl(210,40%,98%)] mb-3 leading-snug group-hover:text-[hsl(210,40%,100%)] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-[hsl(215,20%,55%)] leading-relaxed mb-5 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[hsl(215,28%,12%)]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono" dir="ltr">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono" dir="ltr">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono" dir="ltr">{post.readTime} min</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[hsl(215,20%,45%)] group-hover:text-[#06d6e0] transition-colors" />
                </div>
              </div>

              {/* Background hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at top, ${post.color}06, transparent 70%)` }}
              />
            </a>
          ))}
        </div>

        {/* View all CTA */}
        <div ref={ctaRef} className="flex justify-center mt-12">
          <a
            href="https://www.facebook.com/nadav.cohen.167"
            target="_blank"
            rel="noreferrer"
            className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,6%)] text-sm font-medium text-[hsl(215,20%,65%)] hover:text-[#06d6e0] hover:border-[#06d6e0]/30 transition-all duration-500 min-h-11"
          >
            {t("allPosts")}
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>
  )
}
