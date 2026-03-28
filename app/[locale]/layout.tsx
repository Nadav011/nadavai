import React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, JetBrains_Mono, Heebo } from "next/font/google"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
import { ViewTransitions } from "next-view-transitions"
import { routing } from "@/i18n/routing"
import "../globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
  preload: true,
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
  preload: false, // Only preload critical fonts
})

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  variable: "--font-heebo",
  display: "swap",
  preload: true, // Critical for Hebrew content
})

function getDirection(locale: string): "rtl" | "ltr" {
  return locale === "he" ? "rtl" : "ltr"
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: "layout" })

  return {
    metadataBase: new URL("https://nadavc.ai"),
    title: {
      default: t("title"),
      template: "%s | NADAV.AI",
    },
    description: t("description"),
    keywords: [
      "מפתח AI", "Full-Stack Developer", "בינה מלאכותית", "פיתוח אפליקציות",
      "React", "Next.js", "TypeScript", "Supabase", "AI Developer Israel",
      "נדב כהן", "פיתוח עם AI", "סוכני AI", "Claude Code", "Nadav Cohen",
    ],
    authors: [{ name: "Nadav Cohen", url: "https://nadavc.ai" }],
    creator: "Nadav Cohen",
    manifest: "/manifest.json",
    openGraph: {
      title: t("title"),
      description: t("ogDescription"),
      url: "https://nadavc.ai",
      siteName: "NADAV.AI",
      locale: locale === "he" ? "he_IL" : "en_US",
      type: "website",
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NADAV.AI - Full-Stack AI Developer" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("ogDescription"),
      images: ["/opengraph-image"],
      creator: "@nadavcohen",
      site: "@nadavcohen",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    alternates: {
      canonical: `https://nadavc.ai/${locale}`,
      languages: {
        he: "https://nadavc.ai/he",
        en: "https://nadavc.ai/en",
        "x-default": "https://nadavc.ai/he",
      },
      types: {
        "application/rss+xml": "https://nadavc.ai/feed.xml",
      },
    },
  }
}

export const viewport: Viewport = {
  themeColor: "#06d6e0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params

  if (!routing.locales.includes(locale as "he" | "en")) {
    notFound()
  }

  const messages = await getMessages()
  const t = await getTranslations({ locale, namespace: "layout" })
  const dir = getDirection(locale)

  return (
    <ViewTransitions>
    <html lang={locale} dir={dir} className="dark" style={{ backgroundColor: "oklch(0.085 0.025 245)", colorScheme: "dark" }}>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${heebo.variable} font-sans antialiased overflow-x-hidden`}
        style={{ backgroundColor: "oklch(0.085 0.025 245)", color: "oklch(0.95 0.01 260)" }}
      >
        {/* security-ok: JSON-LD structured data — hardcoded values, no user input */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ // security-ok
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfilePage",
              "@id": "https://nadavc.ai/#profilepage",
              url: `https://nadavc.ai/${locale}`,
              name: locale === "he" ? "נדב כהן — מפתח Full-Stack AI" : "Nadav Cohen — Full-Stack AI Developer",
              dateCreated: "2024-01-01",
              dateModified: "2026-03-29",
              inLanguage: locale === "he" ? "he-IL" : "en-US",
              mainEntity: {
                "@type": "Person",
                "@id": "https://nadavc.ai/#person",
                name: "Nadav Cohen",
                alternateName: "נדב כהן",
                givenName: "Nadav",
                familyName: "Cohen",
                disambiguatingDescription: "Israeli full-stack AI developer, creator of Mexicani franchise management system and APEX Engine. Not to be confused with Prof. Nadav Cohen, the deep learning researcher at Tel Aviv University.",
                url: "https://nadavc.ai",
                image: {
                  "@type": "ImageObject",
                  url: "https://nadavc.ai/opengraph-image",
                  width: 1200,
                  height: 630,
                },
                jobTitle: "Full-Stack AI Developer",
                description: "Full-Stack Developer who builds everything with AI. 10+ production apps, 86 AI Skills, 52 automation agents. Specializing in React 19, Next.js 16, TypeScript, Supabase, Flutter, Tailwind 4.2, and multi-agent AI orchestration with LangGraph.",
                knowsAbout: [
                  "Artificial Intelligence", "Full-Stack Development", "React", "Next.js",
                  "TypeScript", "Supabase", "Flutter", "Claude Code", "AI Agents",
                  "Multi-Agent Orchestration", "LangGraph", "Enterprise Software",
                  "Tailwind CSS 4.2", "GSAP", "Hydra v2", "OKLCH Color System",
                  "PWA Development", "CI/CD Automation", "Bento Grid Design",
                ],
                knowsLanguage: [
                  { "@type": "Language", name: "Hebrew", alternateName: "he" },
                  { "@type": "Language", name: "English", alternateName: "en" },
                ],
                nationality: { "@type": "Country", name: "Israel" },
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "IL",
                  addressRegion: "Israel",
                },
                email: "nadav@nadavc.ai",
                telephone: "+972-50-524-5677",
                sameAs: [
                  "https://github.com/Nadav011",
                  "https://www.facebook.com/nadav.cohen.167",
                  "https://www.linkedin.com/in/nadav-cohen-dev",
                ],
                mainEntityOfPage: "https://nadavc.ai",
              },
            }).replace(/</g, "\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": "https://nadavc.ai/#website",
              name: "NADAV.AI",
              alternateName: "נדב כהן - מפתח AI",
              url: "https://nadavc.ai",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://nadavc.ai/{locale}?search={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }).replace(/</g, "\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "@id": "https://nadavc.ai/#organization",
              name: "NADAV AI",
              alternateName: ["נדב AI", "NADAV.AI"],
              url: "https://nadavc.ai",
              logo: {
                "@type": "ImageObject",
                url: "https://nadavc.ai/opengraph-image",
                width: 1200,
                height: 630,
              },
              description: "AI Development Agency specializing in Full-Stack development, enterprise systems, AI agents, and automation solutions.",
              founder: {
                "@type": "Person",
                "@id": "https://nadavc.ai/#person",
                name: "Nadav Cohen",
              },
              foundingDate: "2024",
              foundingLocation: {
                "@type": "Place",
                address: {
                  "@type": "PostalAddress",
                  addressCountry: "IL",
                  addressRegion: "Israel",
                },
              },
              areaServed: ["IL", "US", "Worldwide"],
              sameAs: [
                "https://github.com/Nadav011",
                "https://www.facebook.com/nadav.cohen.167",
                "https://www.linkedin.com/in/nadav-cohen-dev",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+972-50-524-5677",
                contactType: "Customer Service",
                email: "nadav@nadavc.ai",
                availableLanguage: ["Hebrew", "English"],
                areaServed: "Worldwide",
              },
              knowsAbout: [
                "Artificial Intelligence",
                "Full-Stack Development",
                "React",
                "Next.js",
                "TypeScript",
                "Supabase",
                "Flutter",
                "AI Agents",
                "Enterprise Software",
                "Web Applications",
              ],
            }).replace(/</g, "\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ProfessionalService",
              "@id": "https://nadavc.ai/#professionalservice",
              name: "NADAV AI - AI Development Services",
              alternateName: "נדב AI - שירותי פיתוח AI",
              image: "https://nadavc.ai/opengraph-image",
              url: "https://nadavc.ai",
              telephone: "+972-50-524-5677",
              email: "nadav@nadavc.ai",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                addressCountry: "IL",
                addressRegion: "Israel",
              },
              geo: {
                "@type": "GeoCoordinates",
                addressCountry: "IL",
              },
              areaServed: ["IL", "US", "Worldwide"],
              availableLanguage: ["Hebrew", "English"],
              serviceType: [
                "Full-Stack Development",
                "AI Development",
                "Enterprise Software Development",
                "AI Agent Development",
                "Web Application Development",
                "Mobile App Development",
                "Automation Solutions",
              ],
              description: "Professional AI development services: Full-Stack web & mobile apps, enterprise systems, AI agents, automation. 10+ production applications, 86 AI skills, 52 automation agents.",
              slogan: "Building everything with AI",
              founder: {
                "@type": "Person",
                "@id": "https://nadavc.ai/#person",
                name: "Nadav Cohen",
              },
            }).replace(/</g, "\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: locale === "he" ? "דף הבית" : "Home",
                  item: `https://nadavc.ai/${locale}`,
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: locale === "he" ? "פרויקטים" : "Projects",
                  item: `https://nadavc.ai/${locale}#projects`,
                },
                {
                  "@type": "ListItem",
                  position: 3,
                  name: locale === "he" ? "שירותים" : "Services",
                  item: `https://nadavc.ai/${locale}#services`,
                },
                {
                  "@type": "ListItem",
                  position: 4,
                  name: locale === "he" ? "יצירת קשר" : "Contact",
                  item: `https://nadavc.ai/${locale}#contact`,
                },
              ],
            }).replace(/</g, "\u003c"),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Mexicani",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                description: "Enterprise franchise management system - 149 pages, 111 tables, 38 Edge Functions. Branch, order, inventory, and employee management.",
                author: { "@type": "Person", "@id": "https://nadavc.ai/#person", name: "Nadav Cohen" },
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Cash",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web, iOS, Android",
                description: "Delivery management PWA with full offline support, smart sync, IndexedDB, and operation queuing.",
                author: { "@type": "Person", "@id": "https://nadavc.ai/#person", name: "Nadav Cohen" },
                url: "https://github.com/Nadav011/cash",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Shifts",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                description: "Shift management system with Drag & Drop, Push notifications, and interactive scheduling. 154 components, 25 hooks.",
                author: { "@type": "Person", "@id": "https://nadavc.ai/#person", name: "Nadav Cohen" },
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "APEX Engine",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Cross-platform",
                description: "Code audit engine with 579 gates, auto-healing, automatic technology detection, and a 10x7 visual matrix.",
                author: { "@type": "Person", "@id": "https://nadavc.ai/#person", name: "Nadav Cohen" },
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "APEX Dashboard",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Web",
                description: "AI infrastructure command center — 32 pages, real-time monitoring, PWA, deployed on Cloudflare Pages.",
                author: { "@type": "Person", "@id": "https://nadavc.ai/#person", name: "Nadav Cohen" },
                url: "https://dashboard.nadavc.ai",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "APEX CLI",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Cross-platform",
                description: "AI-powered code quality CLI with 13 commands, skill system, and multi-agent orchestration.",
                author: { "@type": "Person", "@id": "https://nadavc.ai/#person", name: "Nadav Cohen" },
                url: "https://github.com/Nadav011/apex-cli",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "RTL Dev Kit",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Cross-platform",
                description: "Open-source RTL-first development toolkit for React and Tailwind CSS — automatic class conversion and validation.",
                author: { "@type": "Person", "@id": "https://nadavc.ai/#person", name: "Nadav Cohen" },
                url: "https://github.com/Nadav011/rtl-first-dev-kit",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ]).replace(/</g, "\u003c"),
          }}
        />
        {/* security-ok: FAQ JSON-LD — hardcoded, locale-switched */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ // security-ok
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: locale === "he" ? [
                {
                  "@type": "Question",
                  name: "מי זה נדב כהן?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "נדב כהן הוא מפתח Full-Stack ישראלי שבונה הכל עם AI. יוצר מערכת Mexicani לניהול זכיינות (149 עמודים, 111 טבלאות), מנוע APEX Engine לביקורת קוד, ועוד 8+ אפליקציות production.",
                  },
                },
                {
                  "@type": "Question",
                  name: "מה נדב כהן בונה?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "נדב כהן בונה אפליקציות Full-Stack עם AI — כולל אפליקציות web, מערכות enterprise, סוכני AI ואוטומציה. יותר מ-10 אפליקציות production פעילות, 86 כלי AI ו-52 סוכני אוטומציה.",
                  },
                },
                {
                  "@type": "Question",
                  name: "איזה טכנולוגיות נדב משתמש?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "React 19, Next.js 16, TypeScript, Supabase, Flutter, Claude Code, LangGraph ועוד. נדב מתמחה בשילוב בינה מלאכותית בכל שלב של הפיתוח — מתכנון ועד deployment.",
                  },
                },
                {
                  "@type": "Question",
                  name: "איך אפשר ליצור קשר עם נדב?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "דרך WhatsApp, אימייל nadav@nadavc.ai, או דרך טופס יצירת קשר באתר nadavc.ai. ניתן גם לעקוב בגיטהאב github.com/Nadav011.",
                  },
                },
              ] : [
                {
                  "@type": "Question",
                  name: "Who is Nadav Cohen?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Nadav Cohen is an Israeli full-stack AI developer who builds everything with AI. He created Mexicani (enterprise franchise management — 149 pages, 111 tables), APEX Engine (code audit with 579 gates), APEX Dashboard (32 pages, real-time AI monitoring), and 10+ production applications with 86 AI skills and 52 automation agents.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What does Nadav Cohen build?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Nadav Cohen builds full-stack web applications, enterprise systems, AI agents, and automation solutions using React, Next.js, TypeScript, Supabase, Flutter, and multi-agent AI orchestration with LangGraph and Claude Code.",
                  },
                },
                {
                  "@type": "Question",
                  name: "What technologies does Nadav Cohen use?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "React 19, Next.js 16, TypeScript 5.9, Supabase (PostgreSQL, RLS, Edge Functions), Flutter 3.41, Claude Code, LangGraph for multi-agent orchestration, Tailwind CSS 4, and Cloudflare Pages for deployment.",
                  },
                },
                {
                  "@type": "Question",
                  name: "How to contact Nadav Cohen?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "Contact Nadav via email at nadav@nadavc.ai, WhatsApp, or through the contact form at nadavc.ai. Follow his work on GitHub at github.com/Nadav011.",
                  },
                },
              ],
            }).replace(/</g, "\u003c"),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:start-4 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-cyan focus:text-bg-deep focus:font-bold focus:text-sm"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        {/* Cloudflare Web Analytics — cookie-free, no consent needed */}
        {process.env.NODE_ENV === "production" && (
          <script defer src="https://static.cloudflareinsights.com/beacon.min.js" data-cf-beacon='{"token":"nadavai"}' />
        )}
      </body>
    </html>
    </ViewTransitions>
  )
}
