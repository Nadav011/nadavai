"use client"

import { useState } from "react"
import { Play, Clock, Eye, ExternalLink, ArrowLeft } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"

const categories = ["הכל", "AI", "פיתוח", "הדגמות", "טיפים"]

const videos = [
  {
    title: "איך בניתי אפליקציית Enterprise עם AI בשבוע",
    description: "הדגמה חיה של בניית Mexicani - מערכת ניהול זכיינות עם 149 עמודים ו-111 טבלאות. הכל עם Claude Code.",
    thumbnail: null,
    category: "הדגמות",
    duration: "18:42",
    views: "2.1K",
    date: "2026-01",
    color: "#06d6e0",
  },
  {
    title: "Claude Code - המדריך המלא למתחילים",
    description: "מהתקנה ועד production. איך משתמשים ב-Claude Code בצורה הכי יעילה, מה ה-Skills, ואיך לכתוב prompts שעובדים.",
    thumbnail: null,
    category: "AI",
    duration: "24:15",
    views: "5.3K",
    date: "2026-01",
    color: "#e84393",
  },
  {
    title: "Next.js 16 - מה חדש ולמה זה משנה",
    description: "Turbopack, React 19.2, View Transitions, Cache Components. ניתוח מעמיק של כל הפיצ'רים החדשים.",
    thumbnail: null,
    category: "פיתוח",
    duration: "15:30",
    views: "3.8K",
    date: "2025-12",
    color: "#4f46e5",
  },
  {
    title: "Supabase RLS - אבטחה נכונה ב-5 דקות",
    description: "Row Level Security הוא חובה. מראה בדיוק איך לכתוב policies שמגנות על הנתונים שלכם.",
    thumbnail: null,
    category: "טיפים",
    duration: "8:45",
    views: "1.7K",
    date: "2025-12",
    color: "#06d6e0",
  },
  {
    title: "APEX Engine - מנוע ביקורת קוד עם 579 Gates",
    description: "הדגמה של המערכת שבניתי לבדיקת קוד אוטומטית. TypeScript + Bun, מטריצה ויזואלית 10x7, auto-healing.",
    thumbnail: null,
    category: "הדגמות",
    duration: "22:10",
    views: "4.2K",
    date: "2025-11",
    color: "#e84393",
  },
  {
    title: "PWA Offline-First - איך בניתי אפליקציה שעובדת בלי אינטרנט",
    description: "Service Workers, IndexedDB, Background Sync - המדריך המלא לבניית אפליקציות שעובדות תמיד.",
    thumbnail: null,
    category: "פיתוח",
    duration: "19:55",
    views: "2.9K",
    date: "2025-11",
    color: "#4f46e5",
  },
]

export function YouTube() {
  const [activeCategory, setActiveCategory] = useState("הכל")

  const filtered = activeCategory === "הכל"
    ? videos
    : videos.filter((v) => v.category === activeCategory)

  return (
    <section id="youtube" aria-label="סרטוני YouTube" className="relative py-24 md:py-32 bg-[hsl(222,47%,3%)]">
      <div className="absolute inset-0 dot-grid-subtle opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="youtube"
          title="הערוץ"
          highlight="שלי"
          description="מדריכים, הדגמות, וטיפים בעברית - על פיתוח עם AI. הירשמו לערוץ."
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
                    ? "bg-[#e84393]/15 text-[#e84393] border border-[#e84393]/30"
                    : "bg-[hsl(222,47%,6%)] text-[hsl(215,20%,50%)] border border-[hsl(215,28%,16%)] hover:border-[hsl(215,28%,22%)] hover:text-[hsl(215,20%,65%)]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </ScrollReveal>

        {/* Videos grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((video, i) => (
            <ScrollReveal key={video.title} delay={i * 80} direction="up">
              <div className="group relative h-full rounded-2xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] overflow-hidden hover:border-opacity-50 transition-all duration-500">
                {/* Thumbnail placeholder */}
                <div className="relative aspect-video bg-[hsl(222,47%,7%)] overflow-hidden">
                  {/* Gradient placeholder */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{ background: `linear-gradient(135deg, ${video.color}30, transparent)` }}
                  />

                  {/* Grid pattern */}
                  <div className="absolute inset-0 grid-bg opacity-20" />

                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                      style={{
                        background: `${video.color}20`,
                        border: `2px solid ${video.color}40`,
                        boxShadow: `0 0 30px ${video.color}15`,
                      }}
                    >
                      <Play className="w-6 h-6 ms-0.5" style={{ color: video.color }} fill="currentColor" />
                    </div>
                  </div>

                  {/* Duration badge */}
                  <div className="absolute bottom-3 end-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
                    <span className="text-[11px] font-mono text-white" dir="ltr">{video.duration}</span>
                  </div>

                  {/* Category */}
                  <div className="absolute top-3 start-3">
                    <span
                      className="text-[10px] font-mono px-2 py-1 rounded-md tracking-wider uppercase backdrop-blur-sm"
                      style={{ background: `${video.color}25`, color: video.color }}
                    >
                      {video.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-sm font-bold text-[hsl(210,40%,98%)] mb-2 leading-snug group-hover:text-[hsl(210,40%,100%)] transition-colors line-clamp-2">
                    {video.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs text-[hsl(215,20%,50%)] leading-relaxed mb-4 line-clamp-2">
                    {video.description}
                  </p>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,12%)]">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-[hsl(215,20%,40%)]">
                        <Eye className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono" dir="ltr">{video.views}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[hsl(215,20%,40%)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-[11px] font-mono" dir="ltr">{video.date}</span>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-[hsl(215,20%,30%)] group-hover:text-[#e84393] transition-colors" />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Subscribe CTA */}
        <ScrollReveal delay={300}>
          <div className="flex justify-center mt-12">
            <a
              href="https://youtube.com/@nadavai"
              target="_blank"
              rel="noreferrer"
              className="group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-l from-[#FF0000] to-[#cc0000] text-white font-bold text-sm hover:shadow-[0_0_40px_rgba(255,0,0,0.3)] transition-all duration-500 min-h-11"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              {"הירשמו לערוץ"}
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
