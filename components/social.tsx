"use client"

import React from "react"

import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"
import { CodeCard } from "./code-card"
import { ExternalLink, Heart, MessageCircle, Share2, ThumbsUp, Users } from "lucide-react"

const facebookPosts = [
  {
    title: "5 כלי AI שישנו לכם את 2026",
    filename: "ai-tools-2026",
    lang: "post",
    preview: "סיכמתי את 5 הכלים שהכי שינו לי את העבודה השנה. כולם חינמיים או עם free tier מטורף...",
    likes: 342,
    comments: 89,
    shares: 156,
    badge: "viral",
    badgeColor: "pink" as const,
  },
  {
    title: "בניתי אפליקציה ב-3 שעות",
    filename: "3hr-app",
    lang: "post",
    preview: "אתמול קיבלתי רעיון, היום יש לי אפליקציה עובדת עם 200 משתמשים. ככה עשיתי את זה...",
    likes: 567,
    comments: 134,
    shares: 210,
    badge: "popular",
    badgeColor: "cyan" as const,
  },
]

const youtubeVideos = [
  {
    title: "Live Coding: בונים דשבורד עם AI",
    filename: "live-dashboard",
    lang: "stream",
    preview: "סשן live שלם - מאפס ל-dashboard מלא עם גרפים, טבלאות, ו-real-time data.",
    views: "12K",
    duration: "1:45:00",
    badge: "live",
    badgeColor: "green" as const,
  },
  {
    title: "Cursor Tips & Tricks",
    filename: "cursor-tips",
    lang: "tutorial",
    preview: "25 טיפים ל-Cursor שרוב האנשים לא מכירים. קיצורי דרך, prompts, ו-workflows.",
    views: "8.5K",
    duration: "32:15",
    badge: "tutorial",
    badgeColor: "yellow" as const,
  },
]

export function Social() {
  return (
    <section className="relative py-24 md:py-32 bg-[hsl(222,47%,3%)]">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge="social"
          title="עקבו"
          highlight="אחריי"
          description="תוכן שווה כל יום - טיפים, מדריכים, live coding, ועדכונים מהעולם של AI."
        />

        {/* Facebook */}
        <div className="mb-12">
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#1877F2]/15 border border-[#1877F2]/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="text-sm font-mono text-[hsl(215,20%,55%)]">facebook.posts</span>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {facebookPosts.map((post, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <CodeCard
                  title={post.title}
                  filename={post.filename}
                  lang={post.lang}
                  badge={post.badge}
                  badgeColor={post.badgeColor}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono text-[hsl(215,20%,35%)] select-none leading-5">02</span>
                      <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{post.preview}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,14%)]">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                          <ThumbsUp className="w-3.5 h-3.5 text-[#1877F2]" />
                          <span className="text-xs font-mono">{post.likes}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span className="text-xs font-mono">{post.comments}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                          <Share2 className="w-3.5 h-3.5" />
                          <span className="text-xs font-mono">{post.shares}</span>
                        </div>
                      </div>
                      <button className="text-xs font-mono text-[#1877F2] hover:text-[#06d6e0] transition-colors">
                        {">> view"}
                      </button>
                    </div>
                  </div>
                </CodeCard>
              </ScrollReveal>
            ))}
          </div>
        </div>

        {/* YouTube */}
        <div>
          <ScrollReveal>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-[#FF0000]/15 border border-[#FF0000]/30 flex items-center justify-center">
                <svg className="w-4 h-4 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </div>
              <span className="text-sm font-mono text-[hsl(215,20%,55%)]">youtube.videos</span>
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {youtubeVideos.map((video, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <CodeCard
                  title={video.title}
                  filename={video.filename}
                  lang={video.lang}
                  badge={video.badge}
                  badgeColor={video.badgeColor}
                >
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="text-xs font-mono text-[hsl(215,20%,35%)] select-none leading-5">02</span>
                      <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{video.preview}</p>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,14%)]">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                          <Eye className="w-3.5 h-3.5 text-[#FF0000]" />
                          <span className="text-xs font-mono">{video.views}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs font-mono">{video.duration}</span>
                        </div>
                      </div>
                      <button className="text-xs font-mono text-[#FF0000] hover:text-[#06d6e0] transition-colors">
                        {">> watch"}
                      </button>
                    </div>
                  </div>
                </CodeCard>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function Eye(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/></svg>
  )
}

function Clock(props: React.SVGProps<SVGSVGElement> & { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
  )
}
