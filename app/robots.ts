import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/_next/"],
      },
      // Allow AI search/retrieval bots (appear in AI answers)
      { userAgent: "ChatGPT-User", allow: "/" },
      { userAgent: "OAI-SearchBot", allow: "/" },
      { userAgent: "Claude-SearchBot", allow: "/" },
      { userAgent: "Claude-User", allow: "/" },
      { userAgent: "PerplexityBot", allow: "/" },
      { userAgent: "Perplexity-User", allow: "/" },
      { userAgent: "Google-Extended", allow: "/" },
      // Training crawlers (GPTBot, ClaudeBot, CCBot) are no longer disallowed: this is a
      // marketing site and the owner chose on 2026-11-10 to open it to them. They fall
      // under the "*" group above.
    ],
    sitemap: "https://nadavc.ai/sitemap.xml",
    host: "https://nadavc.ai",
  }
}
