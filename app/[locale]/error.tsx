"use client"

import { useEffect } from "react"
import copy from "@/messages/error.json"

const WHATSAPP = "https://wa.me/972504401760"

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const locale = typeof document !== "undefined" && document.documentElement.lang === "en" ? "en" : "he"
  const t = copy[locale]

  useEffect(() => {
    console.error("Page error:", error)
  }, [error])

  return (
    <main id="main" className="legal">
      <section className="sec">
        <h1 className="sec__h">{t["error/h1"]}</h1>
        <p className="sec__lead">{t["error/body"]}</p>
        <p className="strip__row">
          <button className="btn" type="button" onClick={reset}>{t["error/cta/retry"]}</button>{" "}
          <a className="btn btn--ghost" href={WHATSAPP} target="_blank" rel="noopener">{t["error/cta/whatsapp"]}</a>{" "}
          <a href={`/${locale}`}>{t["error/cta/home"]}</a>
        </p>
      </section>
    </main>
  )
}
