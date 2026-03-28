import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://nadavc.ai"
  const lastModified = new Date("2026-03-28")

  return [
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
}
