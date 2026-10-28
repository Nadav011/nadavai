"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import copy from "@/messages/error.json"

// The root error boundary renders outside the locale layout, so it reads the locale from the path.
export default function GlobalError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = /^\/en(\/|$)/.test(usePathname() ?? "") ? "en" : "he" // the same value on the server and the client
  const t = copy[locale]

  useEffect(() => {
    console.error("Global error:", error)
  }, [error])

  return (
    <html lang={locale} dir={locale === "he" ? "rtl" : "ltr"}>
      <head>
        {/* eslint-disable-next-line @next/next/no-css-tags -- this boundary replaces the root layout, so it brings its own stylesheet */}
        <link rel="stylesheet" href="/site/css/site.css" />
      </head>
      <body>
        <main id="main" className="legal">
          <h1 className="sec__h">{t["error/h1"]}</h1>
          <p className="sec__lead">{t["error/body"]}</p>
          <button className="btn" type="button" onClick={reset}>{t["error/cta/retry"]}</button>{" "}
          <a href={`/${locale}`}>{t["error/cta/home"]}</a>
        </main>
      </body>
    </html>
  )
}
