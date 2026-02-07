"use client"

import { useState } from "react"
import { Calendar, Clock, ArrowLeft, MessageSquare, ThumbsUp, ExternalLink } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"

const categories = ["הכל", "AI", "פיתוח", "טיפים", "קריירה"]

const posts = [
  {
    title: "למה AI משנה את כללי המשחק לפרילנסרים",
    excerpt: "לפני שנה בניתי אפליקציות ב-3 חודשים. היום? אותה רמת איכות ב-3 ימים. ככה AI שינה לי את החיים כמפתח.",
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
    title: "8 אפליקציות production בשנה אחת - איך עשיתי את זה",
    excerpt: "הסוד? לא קוד מסורתי. שימוש ב-80 AI Skills, סוכנים חכמים, ומנוע APEX עם 579 gates שמוודא שהכל ברמה הכי גבוהה.",
    category: "פיתוח",
    date: "2026-01-15",
    readTime: 6,
    likes: 83,
    comments: 24,
    platform: "Facebook",
    href: "https://www.facebook.com/nadav.cohen.167",
    color: "#e84393",
  },
  {
    title: "Claude Code vs Cursor - מה באמת עדיף למפתחים?",
    excerpt: "ניסיתי את שניהם לעומק. הנה ההבדלים האמיתיים, מה עובד יותר טוב, ואיפה כל אחד מנצח.",
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
    title: "5 טעויות שכל מתחיל עם AI עושה",
    excerpt: "טעות #1: לחשוב ש-AI מחליף אותך. הוא לא. הוא מגביר אותך פי 10. הנה איך להשתמש בזה נכון.",
    category: "טיפים",
    date: "2025-12-20",
    readTime: 5,
    likes: 92,
    comments: 18,
    platform: "Facebook",
    href: "https://www.facebook.com/nadav.cohen.167",
    color: "#06d6e0",
  },
  {
    title: "הדרך מאפס לפרילנסר AI ב-2026",
    excerpt: "תוכנית פעולה מפורטת: מה ללמוד, איזה כלים להכיר, ואיך לבנות פורטפוליו שמשכנע - גם בלי ניסיון קודם.",
    category: "קריירה",
    date: "2025-12-10",
    readTime: 10,
    likes: 210,
    comments: 56,
    platform: "Facebook",
    href: "https://www.facebook.com/nadav.cohen.167",
    color: "#e84393",
  },
  {
    title: "Supabase + Next.js - הסטאק המושלם ל-2026",
    excerpt: "למה אני בוחר Supabase על Firebase, איך לעבוד עם RLS בצורה נכונה, וטיפים לביצועים ברמת Enterprise.",
    category: "פיתוח",
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
  return date.toLocaleDateString("he-IL", { day: "numeric", month: "short", year: "numeric" })
}

export function Blog() {
  const [activeCategory, setActiveCategory] = useState("הכל")

  const filtered = activeCategory === "הכל"
    ? posts
    : posts.filter((p) => p.category === activeCategory)

  return (
    <section id="blog" aria-label="בלוג" className="relative py-24 md:py-32">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="blog"
          title="מה אני"
          highlight="כותב"
          description="תובנות, טיפים, וניתוחים מהשטח - על AI, פיתוח, והעתיד של הטכנולוגיה."
        />

        {/* Category filter */}
        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 min-h-11 ${
                  activeCategory === cat
                    ? "bg-[#06d6e0]/15 text-[#06d6e0] border border-[#06d6e0]/30"
                    : "bg-[hsl(222,47%,6%)] text-[hsl(215,20%,50%)] border border-[hsl(215,28%,16%)] hover:border-[hsl(215,28%,22%)] hover:text-[hsl(215,20%,65%)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((post, i) => (
            <ScrollReveal key={post.title} delay={i * 80} direction={i % 2 === 0 ? "right" : "left"}>
              <a
                href={post.href}
                target="_blank"
                rel="noreferrer"
                className="group relative block h-full rounded-2xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] overflow-hidden hover:border-opacity-50 transition-all duration-500"
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
                      {post.category}
                    </span>
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,40%)]">
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
                    <ExternalLink className="w-4 h-4 text-[hsl(215,20%,35%)] group-hover:text-[#06d6e0] transition-colors" />
                  </div>
                </div>

                {/* Background hover glow */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top, ${post.color}06, transparent 70%)` }}
                />
              </a>
            </ScrollReveal>
          ))}
        </div>

        {/* View all CTA */}
        <ScrollReveal delay={300}>
          <div className="flex justify-center mt-12">
            <a
              href="https://www.facebook.com/nadav.cohen.167"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,6%)] text-sm font-medium text-[hsl(215,20%,65%)] hover:text-[#06d6e0] hover:border-[#06d6e0]/30 transition-all duration-500 min-h-11"
            >
              {"כל הפוסטים ב-Facebook"}
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
