import React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, JetBrains_Mono, Heebo } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { NextIntlClientProvider } from "next-intl"
import { getMessages, getTranslations } from "next-intl/server"
import { notFound } from "next/navigation"
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
    },
  }
}

export const viewport: Viewport = {
  themeColor: "#06d6e0",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
    <html lang={locale} dir={dir} className="dark" style={{ backgroundColor: "#070a13", colorScheme: "dark" }}>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${heebo.variable} font-sans antialiased overflow-x-hidden`}
        style={{ backgroundColor: "#070a13", color: "#f8fafc" }}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Nadav Cohen",
              alternateName: "נדב כהן",
              url: "https://nadavc.ai",
              jobTitle: "Full-Stack AI Developer",
              description: "Full-Stack Developer who builds everything with AI. 8+ production apps, 80 AI Skills, 38+ agents.",
              knowsAbout: [
                "Artificial Intelligence", "Full-Stack Development", "React", "Next.js",
                "TypeScript", "Supabase", "Flutter", "Claude Code", "AI Agents",
              ],
              sameAs: [
                "https://github.com/Nadav011",
                "https://www.facebook.com/nadav.cohen.167",
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
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
            }),
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
                name: "Nadav Cohen",
                alternateName: "נדב כהן",
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
            }),
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
              description: "Professional AI development services: Full-Stack web & mobile apps, enterprise systems, AI agents, automation. 8+ production applications, 80+ AI skills.",
              slogan: "Building everything with AI",
              founder: {
                "@type": "Person",
                name: "Nadav Cohen",
              },
            }),
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
                  name: "Home",
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
            }),
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
                author: { "@type": "Person", name: "Nadav Cohen" },
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Cash",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web, iOS, Android",
                description: "Delivery management PWA with full offline support, smart sync, IndexedDB, and operation queuing.",
                author: { "@type": "Person", name: "Nadav Cohen" },
                url: "https://cash-ashy-zeta.vercel.app",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "Shifts",
                applicationCategory: "BusinessApplication",
                operatingSystem: "Web",
                description: "Shift management system with Drag & Drop, Push notifications, and interactive scheduling. 154 components, 25 hooks.",
                author: { "@type": "Person", name: "Nadav Cohen" },
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
              {
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: "APEX Engine",
                applicationCategory: "DeveloperApplication",
                operatingSystem: "Cross-platform",
                description: "Code audit engine with 579 gates, auto-healing, automatic technology detection, and a 10x7 visual matrix.",
                author: { "@type": "Person", name: "Nadav Cohen" },
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              },
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: [
                {
                  "@type": "Question",
                  name: "מה נדב כהן בונה?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "נדב כהן בונה אפליקציות Full-Stack עם AI - כולל אפליקציות web, מערכות enterprise, סוכני AI ואוטומציה. יותר מ-8 אפליקציות production פעילות.",
                  },
                },
                {
                  "@type": "Question",
                  name: "איזה טכנולוגיות נדב משתמש?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "React, Next.js, TypeScript, Supabase, Flutter, Claude Code, ועוד. נדב מתמחה בשילוב בינה מלאכותית בכל שלב של הפיתוח.",
                  },
                },
                {
                  "@type": "Question",
                  name: "איך אפשר ליצור קשר עם נדב?",
                  acceptedAnswer: {
                    "@type": "Answer",
                    text: "דרך WhatsApp, אימייל nadav@nadavc.ai, או דרך טופס יצירת קשר באתר. ניתן גם לעקוב בפייסבוק ובגיטהאב.",
                  },
                },
              ],
            }),
          }}
        />
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:start-4 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#06d6e0] focus:text-[hsl(222,47%,4%)] focus:font-bold focus:text-sm"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
