import type { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { Link } from "@/i18n/routing"
import { getAllPosts } from "@/lib/blog"
import type { BlogPostMeta } from "@/lib/blog"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isHe = locale === "he"

  return {
    title: isHe ? "בלוג | NADAV.AI" : "Blog | NADAV.AI",
    description: isHe
      ? "מאמרים על AI, פיתוח Full-Stack, אוטומציה ועוד"
      : "Articles about AI, Full-Stack development, automation and more",
    alternates: {
      canonical: `https://nadavc.ai/${locale}/blog`,
      languages: {
        he: "https://nadavc.ai/he/blog",
        en: "https://nadavc.ai/en/blog",
      },
    },
    openGraph: {
      title: isHe ? "בלוג | NADAV.AI" : "Blog | NADAV.AI",
      description: isHe
        ? "מאמרים על AI, פיתוח Full-Stack, אוטומציה ועוד"
        : "Articles about AI, Full-Stack development, automation and more",
      url: `https://nadavc.ai/${locale}/blog`,
    },
  }
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === "he" ? "he-IL" : "en-US",
    { day: "numeric", month: "long", year: "numeric" },
  )
}

function PostCard({
  post,
  locale,
}: {
  post: BlogPostMeta
  locale: string
}) {
  const isHe = locale === "he"
  const title = isHe ? post.title : (post.titleEn ?? post.title)
  const description = isHe
    ? post.description
    : (post.descriptionEn ?? post.description)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative block rounded-2xl border border-border bg-bg-surface overflow-hidden
                 hover:border-cyan/30 hover:shadow-[0_0_40px_oklch(0.81_0.17_193_/_0.08)] transition-all duration-500"
    >
      {/* top accent */}
      <div className="h-[2px] opacity-30 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-cyan to-transparent rtl:bg-gradient-to-l" />

      <div className="p-5 md:p-6">
        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full
                           bg-cyan/10 text-cyan border border-cyan/20"
              >
                <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Title */}
        <h2 className="text-lg md:text-xl font-bold text-text mb-2 leading-snug line-clamp-2
                       group-hover:text-cyan transition-colors duration-300">
          {title}
        </h2>

        {/* Description */}
        <p className="text-sm text-text-muted leading-relaxed mb-5 line-clamp-3">
          {description}
        </p>

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-4 border-t border-border/40">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 text-text-muted">
              <Calendar className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-xs font-mono" dir="ltr">
                {formatDate(post.date, locale)}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-text-muted">
              <Clock className="w-3.5 h-3.5" aria-hidden="true" />
              <span className="text-xs font-mono" dir="ltr">
                {post.readingTime} min
              </span>
            </div>
          </div>
          <ArrowLeft
            className="w-4 h-4 text-text-muted group-hover:text-cyan
                       group-hover:-translate-x-1 rtl:group-hover:translate-x-1
                       rtl:rotate-180 transition-all duration-300"
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Background hover glow */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
           style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.81 0.17 193 / 0.05), transparent 70%)" }} />
    </Link>
  )
}

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const isHe = locale === "he"
  await getTranslations({ locale, namespace: "layout" })
  const posts = getAllPosts()

  return (
    <>
      <Navbar />
      <main
        id="main-content"
        className="min-h-screen pt-24 pb-20 px-4 md:px-8"
        dir={isHe ? "rtl" : "ltr"}
      >
        <div className="max-w-4xl mx-auto">
          {/* Page header */}
          <div className="mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-cyan/30
                           bg-cyan/5 text-cyan text-xs font-mono mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan animate-pulse" />
              {isHe ? "בלוג" : "Blog"}
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-text mb-4 leading-tight">
              {isHe ? (
                <>
                  <span className="text-gradient-cyan">מאמרים</span>
                  {" "}על AI ופיתוח
                </>
              ) : (
                <>
                  <span className="text-gradient-cyan">Articles</span>
                  {" "}on AI & Dev
                </>
              )}
            </h1>
            <p className="text-text-muted text-base md:text-lg max-w-2xl leading-relaxed">
              {isHe
                ? "מחשבות, ניסיון ולמידות מבניית מערכות AI ב-production"
                : "Thoughts, experience, and learnings from building production AI systems"}
            </p>
          </div>

          {/* Posts grid */}
          {posts.length === 0 ? (
            <div className="text-center py-24 text-text-muted">
              {isHe ? "אין מאמרים עדיין" : "No posts yet"}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} locale={locale} />
              ))}
            </div>
          )}
        </div>

        {/* Dot grid bg */}
        <div className="fixed inset-0 dot-grid opacity-[0.07] pointer-events-none -z-10" aria-hidden="true" />
      </main>
      <Footer />
    </>
  )
}
