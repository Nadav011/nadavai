import React from "react"
import type { Metadata, Viewport } from "next"
import { notFound } from "next/navigation"
import { routing } from "@/i18n/routing"
import { getSiteCopy } from "@/lib/site/copy"
import { HEAD_LOOKS, HEAD_MOTION } from "@/lib/site/head-script"
import { jsCopy } from "@/lib/site/js-copy"

// The prototype's favicon: a dark tile with the orange cursor bar.
const ICON = "data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22%3E%3Crect width=%2232%22 height=%2232%22 rx=%227%22 fill=%22%230A0C0E%22/%3E%3Crect x=%2215%22 y=%226%22 width=%222%22 height=%2220%22 fill=%22%23E8913C%22/%3E%3C/svg%3E"

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  const { c } = await getSiteCopy(locale)
  return {
    metadataBase: new URL("https://nadavc.ai"),
    title: { default: c("home.meta.title"), template: `%s · ${c("global.meta.siteName")}` },
    description: c("home.meta.description"),
    applicationName: c("global.meta.siteName"),
    authors: [{ name: "Nadav Cohen", url: "https://nadavc.ai" }],
    icons: { icon: ICON },
    manifest: "/manifest.json",
    robots: { index: true, follow: true },
  }
}

export const viewport: Viewport = {
  themeColor: "#0A0C0E",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

const IMPORT_MAP = JSON.stringify({
  imports: {
    three: "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
    "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.170.0/examples/jsm/",
  },
})

// Structured data. The disambiguation line stays through every rewrite: search engines and AI answers otherwise
// merge Nadav with Prof. Nadav Cohen of Tel Aviv University.
function jsonLd(locale: string, description: string) {
  const person = {
    "@type": "Person",
    "@id": "https://nadavc.ai/#person",
    name: "Nadav Cohen",
    alternateName: "נדב כהן",
    givenName: "Nadav",
    familyName: "Cohen",
    disambiguatingDescription:
      "Israeli software developer and founder of the NadavAI software house in Netivot. Not to be confused with Prof. Nadav Cohen, the deep learning researcher at Tel Aviv University.",
    jobTitle: "Founder, NadavAI",
    url: "https://nadavc.ai",
    telephone: "+972-50-440-1760",
    address: { "@type": "PostalAddress", addressLocality: "Netivot", addressCountry: "IL" },
    knowsLanguage: ["he", "en"],
    sameAs: ["https://github.com/Nadav011"],
  }
  return [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "@id": "https://nadavc.ai/#organization",
      name: "NadavAI",
      url: `https://nadavc.ai/${locale}`,
      description,
      telephone: "+972-50-440-1760",
      areaServed: "IL",
      availableLanguage: ["Hebrew", "English"],
      founder: { "@id": "https://nadavc.ai/#person" },
    },
    { "@context": "https://schema.org", ...person },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "@id": "https://nadavc.ai/#website",
      name: "NadavAI",
      url: "https://nadavc.ai",
      inLanguage: locale === "he" ? "he-IL" : "en-US",
      publisher: { "@id": "https://nadavc.ai/#organization" },
    },
  ]
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode; params: Promise<{ locale: string }> }>) {
  const { locale } = await params
  if (!routing.locales.includes(locale as "he" | "en")) notFound()
  const { c } = await getSiteCopy(locale)

  return (
    <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"} suppressHydrationWarning>
      <head>
        <script type="importmap" dangerouslySetInnerHTML={{ __html: IMPORT_MAP }} />
        <script dangerouslySetInnerHTML={{ __html: HEAD_MOTION }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- the prototype's own font request, kept as is */}
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wdth,wght@125,800&family=Rubik:wght@400;500;600;800&display=swap" />
        <script dangerouslySetInnerHTML={{ __html: HEAD_LOOKS }} />
      </head>
      <body suppressHydrationWarning>
        {children}
        <script id="__copy" type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(await jsCopy(locale)).replace(/</g, "\\u003c") }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd(locale, c("home.meta.description"))).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  )
}
