import type { MetadataRoute } from "next"
import { PAGE_ROUTES, pathFor } from "@/lib/site/routes"

const BASE = "https://nadavc.ai"
const LAST_MODIFIED = new Date("2026-10-27")

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.keys(PAGE_ROUTES).flatMap((page) =>
    (["he", "en"] as const).map((locale) => ({
      url: `${BASE}${pathFor(locale, page)}`,
      lastModified: LAST_MODIFIED,
      changeFrequency: "monthly" as const,
      priority: page === "index" ? 1 : 0.7,
      alternates: {
        languages: { he: `${BASE}${pathFor("he", page)}`, en: `${BASE}${pathFor("en", page)}`, "x-default": `${BASE}${pathFor("he", page)}` },
      },
    })),
  )
}
