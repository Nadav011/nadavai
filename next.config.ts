import type { NextConfig } from "next"
import createNextIntlPlugin from "next-intl/plugin"

const withNextIntl = createNextIntlPlugin("./i18n/request.ts")

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-XSS-Protection", value: "0" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Permitted-Cross-Domain-Policies", value: "none" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  { key: "Cross-Origin-Embedder-Policy", value: "credentialless" },
  { key: "Cross-Origin-Resource-Policy", value: "same-origin" },
  { key: "Permissions-Policy", value: "accelerometer=(), autoplay=(self), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), picture-in-picture=(), usb=(), interest-cohort=()" },
  // The prototype's engines load from pinned CDNs (GSAP and ScrollTrigger from cdnjs, Lenis from unpkg, three.js through
  // the import map from jsDelivr), PostHog (EU) receives the analytics, and the MediZen page frames the public MediZen demo.
  { key: "Content-Security-Policy", value: `default-src 'self'; script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""} https://static.cloudflareinsights.com https://cdnjs.cloudflare.com https://unpkg.com https://cdn.jsdelivr.net https://eu-assets.i.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob:; connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://cdn.jsdelivr.net https://cloudflareinsights.com https://eu.i.posthog.com https://eu-assets.i.posthog.com; media-src 'self' blob:; worker-src blob:; frame-src https://medizen-demo.nadavc.ai; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; script-src-attr 'none'; upgrade-insecure-requests` },
]

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  reactStrictMode: true,
  // The blog left the site (ANSWERS #63); its addresses keep working, each sent to the closest page.
  async redirects() {
    return [
      { source: "/:locale(he|en)/blog/mexicani-case-study", destination: "/:locale/work/my-branch", permanent: true },
      { source: "/:locale(he|en)/blog/:slug(ai-developer-tools-2026|multi-agent-ai-systems)", destination: "/:locale/services", permanent: true },
      { source: "/:locale(he|en)/blog/:slug*", destination: "/:locale", permanent: true },
      { source: "/blog/:slug*", destination: "/he", permanent: true },
      { source: "/feed.xml", destination: "/he", permanent: true },
      { source: "/:locale(he|en)/work/greenroom", destination: "/:locale/work/green-room", permanent: true },
    ]
  },
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }]
  },
}

export default withNextIntl(nextConfig)
