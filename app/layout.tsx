import React from "react"
import type { Metadata, Viewport } from "next"
import { Space_Grotesk, JetBrains_Mono } from "next/font/google"
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

export const metadata: Metadata = {
  metadataBase: new URL("https://nadavc.ai"),
  title: "NADAV.AI | Full-Stack AI Developer",
  description:
    "בונה הכל עם AI. אפליקציות, מדריכים, כלים ושירותים - הכל מונע בינה מלאכותית.",
  openGraph: {
    title: "NADAV.AI | Full-Stack AI Developer",
    description: "בונה הכל עם AI. אפליקציות, מדריכים, כלים ושירותים.",
    url: "https://nadavc.ai",
    siteName: "NADAV.AI",
    locale: "he_IL",
    type: "website",
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
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} font-sans antialiased overflow-x-hidden`}
      >
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
