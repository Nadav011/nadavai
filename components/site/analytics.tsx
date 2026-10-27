"use client"

import { useEffect } from "react"

const KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY
const HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://eu.i.posthog.com"

// The three events that mean success for the site (ANSWERS #63): a WhatsApp click, a business-check submit and a
// contact-form submit. PostHog loads when the browser is idle, with every input and all text masked in replays.
// Without a key (local builds, previews) nothing loads.
export function SiteAnalytics() {
  useEffect(() => {
    if (!KEY) return
    let off = () => {}
    const start = async () => {
      const { default: posthog } = await import("posthog-js")
      posthog.init(KEY, {
        api_host: HOST,
        person_profiles: "identified_only",
        capture_exceptions: true,
        session_recording: { maskAllInputs: true, maskTextSelector: "*" },
      })
      const page = () => (window as unknown as { __page?: string }).__page ?? "index"
      const onClick = (e: MouseEvent) => {
        const a = (e.target as Element | null)?.closest?.('a[href^="https://wa.me/"]')
        if (a) posthog.capture("whatsapp_click", { page: page(), section: a.closest("[data-sec]")?.getAttribute("data-sec") ?? null })
      }
      const onSubmit = (e: SubmitEvent) => {
        const id = (e.target as HTMLFormElement | null)?.id
        if (id === "ck" || id === "ckx") posthog.capture("business_check_submit", { page: page() })
        else if (id === "ctf") posthog.capture("contact_form_submit", { page: page() })
      }
      document.addEventListener("click", onClick, true)
      document.addEventListener("submit", onSubmit, true)
      off = () => {
        document.removeEventListener("click", onClick, true)
        document.removeEventListener("submit", onSubmit, true)
      }
    }
    const idle = window.requestIdleCallback ?? ((f: () => void) => window.setTimeout(f, 2000))
    idle(() => void start())
    return () => off()
  }, [])
  return null
}
