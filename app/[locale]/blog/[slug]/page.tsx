import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { MDXRemote } from "next-mdx-remote/rsc"
import { getPostBySlug, getAllSlugs } from "@/lib/blog"
import { getMDXComponents } from "@/components/mdx-components"
import { Link } from "@/i18n/routing"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Calendar, Clock, ArrowLeft, Tag } from "lucide-react"

export async function generateStaticParams() {
  const slugs = getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}): Promise<Metadata> {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)
  if (!post) return {}

  const isHe = locale === "he"
  const title = isHe ? post.title : (post.titleEn ?? post.title)
  const description = isHe
    ? post.description
    : (post.descriptionEn ?? post.description)

  return {
    title: `${title} | NADAV.AI`,
    description,
    alternates: {
      canonical: `https://nadavc.ai/${locale}/blog/${slug}`,
      languages: {
        he: `https://nadavc.ai/he/blog/${slug}`,
        en: `https://nadavc.ai/en/blog/${slug}`,
      },
    },
    openGraph: {
      title: `${title} | NADAV.AI`,
      description,
      url: `https://nadavc.ai/${locale}/blog/${slug}`,
      type: "article",
      publishedTime: post.date,
      tags: post.tags,
    },
  }
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(
    locale === "he" ? "he-IL" : "en-US",
    { day: "numeric", month: "long", year: "numeric" },
  )
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>
}) {
  const { locale, slug } = await params
  const post = getPostBySlug(slug)

  if (!post) notFound()

  const isHe = locale === "he"
  const title = isHe ? post.title : (post.titleEn ?? post.title)
  const description = isHe
    ? post.description
    : (post.descriptionEn ?? post.description)

  const components = getMDXComponents()

  // security-ok: JSON-LD structured data — values derived from static MDX frontmatter,
  // no raw user input. Strings are JSON-encoded; < is escaped to \u003c.
  const jsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: post.date,
    author: {
      "@type": "Person",
      name: "Nadav Cohen",
      url: "https://nadavc.ai",
    },
    url: `https://nadavc.ai/${locale}/blog/${slug}`,
    keywords: post.tags.join(", "),
    inLanguage: isHe ? "he-IL" : "en-US",
  }).replace(/</g, "\u003c")

  return (
    <>
      {/* security-ok: JSON-LD — static MDX frontmatter data, < escaped */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd }} // security-ok
      />

      <Navbar />

      <main
        id="main-content"
        className="min-h-screen pt-24 pb-20 px-4 md:px-8"
        dir={isHe ? "rtl" : "ltr"}
      >
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-cyan
                       transition-colors duration-200 mb-8 group"
          >
            <ArrowLeft
              className="w-4 h-4 group-hover:-translate-x-1 rtl:group-hover:translate-x-1
                         rtl:rotate-180 transition-transform duration-200"
              aria-hidden="true"
            />
            {isHe ? "חזרה לבלוג" : "Back to Blog"}
          </Link>

          {/* Article header */}
          <header className="mb-10">
            {/* Tags */}
            {post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="flex items-center gap-1 text-[10px] font-mono px-2.5 py-1 rounded-full
                               bg-cyan/10 text-cyan border border-cyan/20"
                  >
                    <Tag className="w-2.5 h-2.5" aria-hidden="true" />
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-text leading-tight mb-4">
              {title}
            </h1>

            {/* Description */}
            <p className="text-text-muted text-base md:text-lg leading-relaxed mb-6">
              {description}
            </p>

            {/* Meta row */}
            <div className="flex items-center gap-5 pb-6 border-b border-border/60">
              <div className="flex items-center gap-1.5 text-text-muted">
                <Calendar className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-mono" dir="ltr">
                  {formatDate(post.date, locale)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-text-muted">
                <Clock className="w-4 h-4" aria-hidden="true" />
                <span className="text-sm font-mono" dir="ltr">
                  {post.readingTime} min read
                </span>
              </div>
            </div>
          </header>

          {/* MDX content */}
          <article
            className="prose-nadav"
            lang={isHe ? "he" : "en"}
          >
            <MDXRemote source={post.content} components={components} />
          </article>

          {/* Footer nav */}
          <div className="mt-12 pt-8 border-t border-border/40">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border
                         bg-bg-elevated text-sm font-medium text-text-secondary
                         hover:text-cyan hover:border-cyan/30 transition-all duration-300 group"
            >
              <ArrowLeft
                className="w-4 h-4 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1
                           transition-transform duration-200"
                aria-hidden="true"
              />
              {isHe ? "כל המאמרים" : "All Posts"}
            </Link>
          </div>
        </div>

        {/* Dot grid bg */}
        <div className="fixed inset-0 dot-grid opacity-[0.07] pointer-events-none -z-10" aria-hidden="true" />
      </main>

      <Footer />
    </>
  )
}
