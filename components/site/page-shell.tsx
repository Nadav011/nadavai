import { preload } from "react-dom"
import { PAGES } from "./generated"
import meta from "./generated/pages.json"
import { SiteEngine } from "./engine"
import type { PageName } from "@/lib/site/routes"

type PageMeta = {
  css: string[]
  preload: Record<string, string>[]
  bodyClass: string
  bodyData: Record<string, string>
  htmlData: Record<string, string>
  module: string | null
}

// One prototype page: its stylesheets (hoisted into <head> in prototype order, so looks.css still overrides them),
// its <body> class and data (and the <html> data, such as the page's world), the generated markup, and its page module.
export async function PageShell({ page, locale }: { page: PageName; locale: string }) {
  const m = (meta as Record<string, PageMeta>)[page]!
  const Page = PAGES[page]
  for (const p of m.preload) {
    if (p.href) preload(p.href, { as: (p.as ?? "image") as "image", fetchPriority: p.fetchpriority as "high" | undefined, media: p.media })
  }
  const data = (el: string, d: Record<string, string>) =>
    Object.entries(d).map(([k, v]) => `${el}.dataset[${JSON.stringify(k.replace(/-(\w)/g, (_, c: string) => c.toUpperCase()))}]=${JSON.stringify(v)};`).join("")
  const body = `document.body.className=${JSON.stringify(m.bodyClass)};` + data("document.body", m.bodyData) + data("document.documentElement", m.htmlData)
  return (
    <>
      {m.css.map((href) => <link key={href} rel="stylesheet" href={href} precedence="site" />)}
      {/* before the markup paints: the prototype page's <body> class and data attributes */}
      <script dangerouslySetInnerHTML={{ __html: body }} />
      <Page locale={locale} />
      <SiteEngine module={m.module} />
    </>
  )
}
