"use client"

import { useEffect } from "react"
import { useTranslations } from "next-intl"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Link } from "@/i18n/routing"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("error")

  useEffect(() => {
    console.error("Page Error:", error) // DEBUG — error boundary logging
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-deep">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 dot-grid opacity-[0.04]" />
      </div>

      <div className="relative max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6">
          <div
            className="absolute inset-0 rounded-full blur-xl animate-pulse"
            style={{ background: "oklch(0.65 0.25 350 / 0.2)" }}
          />
          <div
            className="relative flex items-center justify-center w-20 h-20 rounded-full p-[2px]"
            style={{
              background: "linear-gradient(135deg, oklch(0.65 0.25 350), oklch(0.55 0.22 25))", // rtl-ok: diagonal
            }}
          >
            <div className="flex items-center justify-center w-full h-full rounded-full bg-bg-deep">
              <AlertTriangle className="w-10 h-10 text-pink" aria-hidden="true" />
            </div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-3xl md:text-4xl font-bold text-text mb-3">{t("title")}</h1>
        <p className="text-base text-text-muted mb-8 leading-relaxed">{t("description")}</p>

        {/* Error Details (only in development) */}
        {process.env.NODE_ENV === "development" && error.message && (
          <div className="mb-8 p-4 rounded-lg bg-bg-surface border border-border text-start">
            <p className="text-xs font-mono text-pink break-words">{error.message}</p>
            {error.digest && (
              <p className="text-[10px] font-mono text-text-dim mt-2">Digest: {error.digest}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={reset}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-bold text-bg-deep bg-gradient-to-l rtl:bg-gradient-to-r from-cyan to-cyan-dim hover:shadow-[0_0_30px_oklch(0.81_0.17_193_/_0.4)] transition-all duration-500"
          >
            <RefreshCw
              className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500"
              aria-hidden="true"
            />
            {t("retry")}
          </button>
          <Link
            href="/"
            className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl text-sm font-medium text-text border border-border bg-bg-elevated hover:border-cyan/40 transition-all duration-500"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            {t("home")}
          </Link>
        </div>

        {/* Footer hint */}
        <p className="mt-8 text-xs font-mono text-text-dim">{t("hint")}</p>
      </div>
    </div>
  )
}
