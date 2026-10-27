import { getLocale } from "next-intl/server"
import { getSiteCopy } from "@/lib/site/copy"
import { SiteHeader } from "@/components/site/generated/chrome-header"
import { SiteFooter } from "@/components/site/generated/chrome-footer"

// Plain stylesheet links (no precedence): React would otherwise preload them on every page, where this boundary waits.
export default async function NotFound() {
  const locale = await getLocale()
  const { c, href, wa } = await getSiteCopy(locale)
  return (
    <>
      {["/site/css/site.css", "/site/css/chrome.css"].map((h) => <link key={h} rel="stylesheet" href={h} />)}
      <SiteHeader locale={locale} />
      <main id="main" className="legal">
        <section className="sec">
          <h1 className="sec__h">{c("404.h1")}</h1>
          <p className="sec__lead">{c("404.body")}</p>
          <p className="strip__row">
            <a className="btn" href={href("index")}>{c("404.cta.home")}</a>{" "}
            <a className="btn btn--ghost" href={wa("wa.general")} target="_blank" rel="noopener">{c("404.cta.whatsapp")}</a>{" "}
            <a href={href("work")}>{c("404.cta.work")}</a>
          </p>
        </section>
        <SiteFooter locale={locale} />
      </main>
    </>
  )
}
