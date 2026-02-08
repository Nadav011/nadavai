import React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, JetBrains_Mono, Heebo } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
})

const heebo = Heebo({
  subsets: ["latin", "hebrew"],
  variable: "--font-heebo",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://nadavc.ai"),
  title: {
    default: "NADAV.AI | Full-Stack AI Developer",
    template: "%s | NADAV.AI",
  },
  description:
    "נדב כהן - מפתח Full-Stack שבונה הכל עם AI. אפליקציות web, מערכות enterprise, סוכני AI ואוטומציה. 8+ אפליקציות production, 80 AI Skills.",
  keywords: [
    "מפתח AI", "Full-Stack Developer", "בינה מלאכותית", "פיתוח אפליקציות",
    "React", "Next.js", "TypeScript", "Supabase", "AI Developer Israel",
    "נדב כהן", "פיתוח עם AI", "סוכני AI", "Claude Code", "Nadav Cohen",
  ],
  authors: [{ name: "Nadav Cohen", url: "https://nadavc.ai" }],
  creator: "Nadav Cohen",
  manifest: "/manifest.json",
  openGraph: {
    title: "NADAV.AI | Full-Stack AI Developer",
    description: "בונה הכל עם AI. 8+ אפליקציות production, 80 AI Skills, 38+ סוכנים.",
    url: "https://nadavc.ai",
    siteName: "NADAV.AI",
    locale: "he_IL",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "NADAV.AI - Full-Stack AI Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "NADAV.AI | Full-Stack AI Developer",
    description: "בונה הכל עם AI. 8+ אפליקציות production, 80 AI Skills.",
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
    canonical: "https://nadavc.ai",
  },
}

export const viewport: Viewport = {
  themeColor: "#06d6e0",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="he" dir="rtl" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} ${heebo.variable} font-sans antialiased overflow-x-hidden`}
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
              }),
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
            {"דלג לתוכן הראשי"}
          </a>
          {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
