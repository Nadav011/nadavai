import type { MetadataRoute } from "next";

const BASE_URL = "https://nadav.ai";
const LOCALES = ["he", "en"];

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/blog", "/projects", "/services"];

  return routes.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${BASE_URL}/${locale}${route}`,
      lastModified: new Date(),
      changeFrequency: route === "" ? ("weekly" as const) : ("monthly" as const),
      priority: route === "" ? 1 : 0.8,
    }))
  );
}
