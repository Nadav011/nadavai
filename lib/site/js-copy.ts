import jsIds from "@/messages/js-ids.json"
import { messageKey } from "./copy"

// The strings the ported JS modules read through window.__t(id): plain text, with the ICU tags and escapes removed.
export async function jsCopy(locale: string): Promise<Record<string, string>> {
  const messages = (await import(`@/messages/${locale}.json`)).default as Record<string, string>
  const out: Record<string, string> = {}
  for (const id of jsIds as string[]) {
    const m = messages[messageKey(id)]
    if (m != null) out[id] = m.replace(/<\/?t\d+>/g, "").replace(/'([{}<>#|])'/g, "$1").replace(/''/g, "'")
  }
  return out
}
