import { useTranslations } from "next-intl"
import { Search, Home, ArrowRight } from "lucide-react"
import { Link } from "@/i18n/routing"

export default function NotFound() {
  const t = useTranslations("notFound")

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg-deep">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 dot-grid opacity-[0.06]" />
        <div
          className="absolute rounded-full blur-[150px] animate-pulse-glow"
          style={{
            width: "min(600px, 80vw)",
            height: "min(600px, 80vw)",
            top: "20%",
            left: "50%", // rtl-ok: physical left correct for symmetrical centering
            transform: "translateX(-50%)",
            background: "oklch(0.81 0.17 193 / 0.05)",
          }}
        />
      </div>

      <div className="relative max-w-2xl w-full text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center gap-3 mb-4">
            <span className="text-8xl md:text-9xl font-bold text-text tracking-tight">4</span>
            <div className="relative flex items-center justify-center w-20 h-20 md:w-24 md:h-24">
              <div
                className="absolute inset-0 rounded-full blur-xl animate-pulse"
                style={{ background: "oklch(0.81 0.17 193 / 0.2)" }}
              />
              <div
                className="relative flex items-center justify-center w-full h-full rounded-full p-[2px]"
                style={{
                  background: "linear-gradient(135deg, oklch(0.81 0.17 193), oklch(0.50 0.15 270))", // rtl-ok: diagonal
                }}
              >
                <div className="flex items-center justify-center w-full h-full rounded-full bg-bg-deep">
                  <Search className="w-10 h-10 md:w-12 md:h-12 text-cyan" aria-hidden="true" />
                </div>
              </div>
            </div>
            <span className="text-8xl md:text-9xl font-bold text-text tracking-tight">4</span>
          </div>
        </div>

        {/* Message */}
        <h1 className="text-3xl md:text-5xl font-bold text-text mb-4">{t("title")}</h1>
        <p className="text-base md:text-lg text-text-muted mb-10 leading-relaxed max-w-md mx-auto">
          {t("description")}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-bold text-bg-deep bg-gradient-to-l rtl:bg-gradient-to-r from-cyan to-cyan-dim hover:shadow-[0_0_40px_oklch(0.81_0.17_193_/_0.4)] transition-all duration-500"
          >
            <Home className="w-5 h-5" aria-hidden="true" />
            {t("home")}
          </Link>
          <Link
            href="/#contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl text-base font-medium text-text border border-border bg-bg-elevated hover:border-pink/40 transition-all duration-500"
          >
            {t("contact")}
            <ArrowRight className="w-4 h-4 rtl:rotate-180" aria-hidden="true" />
          </Link>
        </div>

        {/* Suggestions */}
        <div className="mt-12 p-6 rounded-xl border border-border glass">
          <h2 className="text-sm font-semibold text-text mb-3">{t("suggestionsTitle")}</h2>
          <nav aria-label={t("suggestionsTitle")}>
            <ul className="flex flex-wrap items-center justify-center gap-2 text-sm">
              <li>
                <Link href="/#projects" className="text-cyan hover:underline">
                  {t("projects")}
                </Link>
              </li>
              <li>
                <span className="text-text-dim">&bull;</span>
              </li>
              <li>
                <Link href="/#services" className="text-cyan hover:underline">
                  {t("services")}
                </Link>
              </li>
              <li>
                <span className="text-text-dim">&bull;</span>
              </li>
              <li>
                <Link href="/#blog" className="text-cyan hover:underline">
                  {t("blog")}
                </Link>
              </li>
              <li>
                <span className="text-text-dim">&bull;</span>
              </li>
              <li>
                <Link href="/#guides" className="text-cyan hover:underline">
                  {t("guides")}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
