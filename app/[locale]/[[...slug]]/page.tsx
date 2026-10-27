import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { setRequestLocale } from "next-intl/server"
import { routing } from "@/i18n/routing"
import { getSiteCopy } from "@/lib/site/copy"
import { PAGE_ROUTES, pageForSlug, pathFor } from "@/lib/site/routes"
import meta from "@/components/site/generated/pages.json"
import { PageShell } from "@/components/site/page-shell"

type Params = Promise<{ locale: string; slug?: string[] }>
type Text = { id: string | null; text: string }
type PageMeta = { title: Text; description: Text; ogTitle: Text; ogDescription: Text; ogImage: string | null }

export const dynamicParams = false

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    Object.values(PAGE_ROUTES).map((route) => ({ locale, slug: route ? route.split("/") : [] })),
  )
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { locale, slug } = await params
  const page = pageForSlug(slug)
  if (!page) return {}
  const m = (meta as Record<string, PageMeta>)[page]!
  const { c } = await getSiteCopy(locale)
  const text = (t: Text, fallback = "") => (t.id ? c(t.id) : fallback)
  const plainTitle = m.title.text.replace(/\s*·\s*NadavAI$/, "")
  const title = page === "index" ? { absolute: text(m.ogTitle, m.title.text) } : text(m.title, text(m.ogTitle, plainTitle))
  const description = text(m.description) || c("home.meta.description")
  const url = `https://nadavc.ai${pathFor(locale, page)}`
  return {
    title,
    description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries([...routing.locales.map((l) => [l, `https://nadavc.ai${pathFor(l, page)}`]), ["x-default", `https://nadavc.ai${pathFor("he", page)}`]]),
    },
    openGraph: {
      type: "website",
      siteName: c("global.meta.siteName"),
      title: text(m.ogTitle, plainTitle),
      description: text(m.ogDescription, description),
      url,
      locale: locale === "he" ? "he_IL" : "en_US",
      images: m.ogImage ? [{ url: m.ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: { card: "summary_large_image" },
  }
}

export default async function SitePage({ params }: { params: Params }) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const page = pageForSlug(slug)
  if (!page) notFound()
  return <PageShell page={page} locale={locale} />
}
