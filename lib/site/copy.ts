import { cache, type ReactNode } from "react"
import { getTranslations } from "next-intl/server"
import { pathFor } from "./routes"

const WHATSAPP = "https://wa.me/972504401760?text="

// Deck ids (COPY-FULL.md) contain dots, which next-intl reads as nesting, so messages are stored with "/" instead.
export const messageKey = (id: string) => id.replaceAll(".", "/")

type Tags = Record<string, (chunks: ReactNode) => ReactNode>
type Values = Record<string, string | number>

/** The copy helpers every generated page component uses: plain string, rich string, page link, WhatsApp link. */
export const getSiteCopy = cache(async (locale: string) => {
  const t = await getTranslations({ locale })
  return {
    c: (id: string, values?: Values) => t(messageKey(id), values),
    r: (id: string, tags: Tags) => t.rich(messageKey(id), tags),
    href: (page: string, hash = "") => pathFor(locale, page) + hash,
    wa: (id: string, values?: Values) => WHATSAPP + encodeURIComponent(t(messageKey(id), values)),
  }
})
