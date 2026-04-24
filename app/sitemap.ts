import type { MetadataRoute } from "next"
import { getAllSlugs } from "@/lib/blog"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nadavc.ai"
  const lastModified = new Date("2026-04-24")

  const locales = ["he", "en"] as const

  // Homepage routes
  const pages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/he`,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          he: `${baseUrl}/he`,
          en: `${baseUrl}/en`,
          "x-default": `${baseUrl}/he`,
        },
      },
    },
    {
      url: `${baseUrl}/en`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          he: `${baseUrl}/he`,
          en: `${baseUrl}/en`,
          "x-default": `${baseUrl}/he`,
        },
      },
    },
  ]

  // Blog listing pages
  for (const locale of locales) {
    pages.push({
      url: `${baseUrl}/${locale}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          he: `${baseUrl}/he/blog`,
          en: `${baseUrl}/en/blog`,
        },
      },
    })
  }

  // Blog post pages
  const slugs = getAllSlugs()
  for (const slug of slugs) {
    for (const locale of locales) {
      pages.push({
        url: `${baseUrl}/${locale}/blog/${slug}`,
        lastModified,
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: {
            he: `${baseUrl}/he/blog/${slug}`,
            en: `${baseUrl}/en/blog/${slug}`,
          },
        },
      })
    }
  }

  return pages
}
