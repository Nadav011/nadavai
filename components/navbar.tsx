"use client"

import { useState, useEffect, useRef, useMemo } from "react"
import { Zap, ExternalLink } from "lucide-react"
import { Magnetic } from "./magnetic"
import { CommandPalette } from "./command-palette"
import { SoundToggle } from "./sound-toggle"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"

// Gradient constants — all decorative/symmetric, RTL-safe
const GRAD_CYAN_PINK = "linear-gradient(135deg, oklch(0.81 0.17 193), oklch(0.65 0.25 350))" // rtl-ok
const GRAD_TOP_GLOW = "linear-gradient(to right, transparent 0%, oklch(0.81 0.17 193 / 0.6) 30%, oklch(0.65 0.25 350 / 0.5) 70%, transparent 100%)" // rtl-ok: symmetric decoration
const GRAD_BORDER_SHIMMER = "linear-gradient(to right, transparent, oklch(0.81 0.17 193 / 0.4), oklch(0.65 0.25 350 / 0.35), oklch(0.81 0.17 193 / 0.4), transparent)" // rtl-ok: symmetric decoration
const GRAD_INDICATOR = "linear-gradient(to right, oklch(0.81 0.17 193), oklch(0.65 0.25 350))" // rtl-ok: decorative underline
const GRAD_CTA_MOBILE = "linear-gradient(135deg, oklch(0.81 0.17 193), oklch(0.50 0.22 200))" // rtl-ok: decorative button fill

export function Navbar() {
  const t = useTranslations("nav")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, inlineStart: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null)

  const navLinks = useMemo(() => [
    { label: t("projects"), href: "#projects", badge: "8" },
    { label: t("services"), href: "#services", hot: true },
    { label: t("blog"), href: "#blog" },
    { label: t("youtube"), href: "#youtube" },
    { label: t("guides"), href: "#guides" },
    { label: t("resources"), href: "#resources", badge: "FREE" },
    { label: t("news"), href: "#news" },
    { label: t("contact"), href: "#contact" },
  ], [t])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
      const sections = navLinks.map(l => l.href.replace("#", ""))
      for (const section of [...sections].reverse()) {
        const el = document.getElementById(section)
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(section)
          break
        }
      }
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [navLinks])

  useEffect(() => {
    if (!navRef.current || !activeSection) return
    const activeEl = navRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement
    if (activeEl) {
      setIndicatorStyle({
        width: activeEl.offsetWidth,
        inlineStart: activeEl.offsetLeft,
      })
    }
  }, [activeSection])

  // Escape key handler for mobile menu
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false)
        hamburgerButtonRef.current?.focus()
      }
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [mobileOpen])

  // Focus trap for mobile menu
  useEffect(() => {
    if (!mobileOpen || !mobileMenuRef.current) return

    const focusableElements = mobileMenuRef.current.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault()
          lastElement?.focus()
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault()
          firstElement?.focus()
        }
      }
    }

    document.addEventListener("keydown", handleTabKey)
    firstElement?.focus()
    return () => document.removeEventListener("keydown", handleTabKey)
  }, [mobileOpen])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        {/* Scrolled background */}
        <div className={`absolute inset-0 transition-all duration-700 ${
          scrolled
            ? "bg-[oklch(0.085_0.025_245/0.88)] backdrop-blur-2xl shadow-[0_4px_40px_rgba(0,0,0,0.4)] border-b border-[oklch(0.22_0.02_260/0.5)]"
            : "bg-transparent"
        }`} />

        {/* section-glow-top: glowing beam along top edge when scrolled */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-[1px] transition-all duration-700 pointer-events-none"
          style={{
            opacity: scrolled ? 1 : 0,
            background: GRAD_TOP_GLOW,
            boxShadow: scrolled ? "0 0 20px 2px oklch(0.81 0.17 193 / 0.2)" : "none",
          }}
        />

        {/* Animated gradient border shift along bottom when scrolled */}
        {scrolled && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-[1px] overflow-hidden pointer-events-none"
          >
            <div
              className="absolute inset-0"
              style={{
                background: GRAD_BORDER_SHIMMER,
                backgroundSize: "200% 100%",
                animation: "gradient-shift 6s ease infinite",
              }}
            />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group relative" aria-label="NADAV.AI">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {/* bg-gradient-to-br rtl:bg-gradient-to-bl — paired RTL variant */}
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br rtl:bg-gradient-to-bl from-cyan to-pink p-[1.5px] group-hover:shadow-[0_0_25px_oklch(0.81_0.17_193_/_0.3)] transition-shadow duration-500">
                <div className="flex items-center justify-center w-full h-full rounded-[9px] bg-bg-deep group-hover:bg-bg-surface transition-colors">
                  <Zap className="w-5 h-5 text-cyan group-hover:text-pink transition-colors duration-500" />
                </div>
              </div>
              <div className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-bg-deep flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#27ca40] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight leading-none">
                <span className="text-text">NADAV</span>
                <span
                  className="inline-block"
                  style={{
                    background: GRAD_CYAN_PINK,
                    WebkitBackgroundClip: "text",
                    backgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundSize: "200% 100%",
                  }}
                >.AI</span>
              </span>
              <span className="text-[9px] font-mono text-text-muted tracking-[0.25em] uppercase mt-0.5">
                {t("logoSubtitle")}
              </span>
            </div>
          </a>

          {/* Desktop nav links */}
          <div ref={navRef} className="hidden lg:flex items-center gap-0.5 relative">
            {/* Active section indicator: gradient underline with glow diffusion */}
            <div
              className="absolute bottom-0 transition-all duration-500 ease-out pointer-events-none"
              style={{
                width: `${indicatorStyle.width}px`,
                insetInlineStart: `${indicatorStyle.inlineStart}px`,
                opacity: activeSection ? 1 : 0,
              }}
            >
              <div
                className="h-[2px] rounded-full"
                style={{
                  background: GRAD_INDICATOR,
                  boxShadow: "0 0 8px oklch(0.81 0.17 193 / 0.6), 0 0 20px oklch(0.81 0.17 193 / 0.25)",
                }}
              />
              {/* Diffusion glow below bar */}
              <div
                className="h-[6px] rounded-full -mt-[6px] blur-md opacity-50"
                style={{ background: GRAD_INDICATOR }}
              />
            </div>

            {navLinks.map((link) => {
              const section = link.href.replace("#", "")
              const isActive = activeSection === section
              return (
                <Magnetic key={link.href} strength={0.12}>
                  <a
                    href={link.href}
                    data-section={section}
                    className={`relative px-4 py-2.5 text-sm transition-all duration-300 group/link ${
                      isActive ? "text-text" : "text-text-muted hover:text-text"
                    }`}
                  >
                    <span className="relative">
                      {link.label}
                      {link.badge && (
                        <span className="absolute -top-2.5 -start-3 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-cyan/15 text-cyan border border-cyan/25 leading-none">
                          {link.badge}
                        </span>
                      )}
                      {link.hot && (
                        <span className="absolute -top-1.5 -start-1.5 w-2 h-2 rounded-full bg-pink animate-pulse" />
                      )}
                    </span>
                    {/* Per-link radial glow on hover */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 opacity-0 group-hover/link:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none"
                      style={{
                        background: "radial-gradient(ellipse 80% 50% at 50% 100%, oklch(0.81 0.17 193 / 0.08), transparent)",
                      }}
                    />
                  </a>
                </Magnetic>
              )
            })}
          </div>

          {/* Desktop right controls */}
          <div className="hidden lg:flex items-center gap-2.5">
            <CommandPalette />
            <SoundToggle />
            <Link
              href="/"
              locale={locale === "he" ? "en" : "he"}
              className="px-2.5 py-1.5 rounded-lg border border-border bg-bg-surface text-text-secondary hover:border-cyan/30 hover:text-text transition-all text-xs font-mono font-bold"
            >
              {tCommon("langSwitch")}
            </Link>
            <a
              href="https://github.com/Nadav011"
              target="_blank"
              rel="noreferrer"
              className="p-2.5 rounded-lg text-text-secondary hover:text-text hover:bg-border transition-all"
              aria-label={tCommon("githubAriaLabel")}
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <Magnetic strength={0.2}>
              <a
                href="#contact"
                className="relative group/cta inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold overflow-hidden"
              >
                {/* bg-gradient-to-l rtl:bg-gradient-to-r — paired RTL variant */}
                <div className="absolute inset-0 bg-gradient-to-l rtl:bg-gradient-to-r from-cyan to-[#0abfca] transition-all duration-500 group-hover/cta:shadow-[0_0_30px_oklch(0.81_0.17_193_/_0.4)]" />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000 pointer-events-none"
                  style={{
                    background: "radial-gradient(ellipse 60% 100% at 50% 50%, oklch(0.95 0.01 260 / 0.18), transparent)",
                  }}
                />
                <span className="relative flex items-center gap-2.5 text-bg-deep">
                  <span className="relative w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-bg-deep animate-ping opacity-40" />
                    <span className="relative block w-2 h-2 rounded-full bg-bg-deep" />
                  </span>
                  {t("cta")}
                </span>
              </a>
            </Magnetic>
          </div>

          {/* Mobile hamburger */}
          <button
            ref={hamburgerButtonRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative p-2.5 rounded-xl border border-border bg-bg-elevated text-text hover:border-cyan/30 transition-all"
            aria-label={mobileOpen ? t("closeMenu") : t("toggleMenu")}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
          >
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className={`absolute block w-5 h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? "rotate-45" : "-translate-y-1.5"}`} />
              <span className={`absolute block w-5 h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? "opacity-0 scale-0" : "opacity-100"}`} />
              <span className={`absolute block w-5 h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? "-rotate-45" : "translate-y-1.5"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu — glassmorphism cards with staggered reveal */}
      <div
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("mobileNavigation")}
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute inset-0 bg-[oklch(0.065_0.02_245/0.96)] backdrop-blur-2xl" />

        {/* Ambient glow orbs — radial, RTL-safe */}
        <div
          aria-hidden="true"
          className="absolute top-1/4 -start-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.81 0.17 193 / 0.08), transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          aria-hidden="true"
          className="absolute bottom-1/4 -end-1/4 w-80 h-80 rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, oklch(0.65 0.25 350 / 0.06), transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative pt-24 px-5 h-full flex flex-col overflow-y-auto">
          <div className="flex flex-col gap-2.5 flex-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`group/item relative flex items-center justify-between p-4 rounded-2xl overflow-hidden transition-all duration-500 ${
                  mobileOpen ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
                }`}
                style={{
                  transitionDelay: mobileOpen ? `${i * 55 + 80}ms` : "0ms",
                  background: "oklch(0.14 0.022 243 / 0.7)",
                  backdropFilter: "blur(20px) saturate(160%)",
                  WebkitBackdropFilter: "blur(20px) saturate(160%)",
                  border: "1px solid oklch(0.22 0.02 260 / 0.5)",
                }}
              >
                {/* Card hover shimmer — radial, RTL-safe */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover/item:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                  style={{
                    background: "radial-gradient(ellipse 120% 80% at 10% 50%, oklch(0.81 0.17 193 / 0.06), transparent 60%)",
                  }}
                />
                {/* Inline-start border accent on hover — vertical gradient, RTL-safe */}
                <div
                  aria-hidden="true"
                  className="absolute start-0 top-0 bottom-0 w-[2px] rounded-s-2xl opacity-0 group-hover/item:opacity-100 transition-opacity duration-300"
                  style={{
                    background: "linear-gradient(to bottom, oklch(0.81 0.17 193), oklch(0.65 0.25 350))", // rtl-ok: vertical, non-directional
                  }}
                />
                <div className="relative flex items-center gap-4">
                  <span
                    className="text-xs font-mono w-6 shrink-0"
                    style={{
                      background: GRAD_CYAN_PINK,
                      WebkitBackgroundClip: "text",
                      backgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    0{i + 1}
                  </span>
                  <span className="font-medium text-text">{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan/10 text-cyan border border-cyan/20">
                    {link.badge}
                  </span>
                )}
                {link.hot && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink/10 text-pink border border-pink/20">
                    HOT
                  </span>
                )}
              </a>
            ))}
          </div>

          {/* Mobile bottom controls */}
          <div className="pb-8 pt-4 space-y-3">
            <div className="flex items-center gap-3">
              <SoundToggle className="flex-1 justify-center" />
              <Link
                href="/"
                locale={locale === "he" ? "en" : "he"}
                onClick={() => setMobileOpen(false)}
                className="flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border border-border bg-bg-elevated text-sm font-mono font-bold text-text-secondary"
              >
                {tCommon("langSwitch")}
              </Link>
            </div>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="relative flex items-center justify-center gap-2.5 w-full p-4 rounded-xl overflow-hidden text-bg-deep font-bold text-lg"
              style={{
                background: GRAD_CTA_MOBILE,
                boxShadow: "0 0 30px oklch(0.81 0.17 193 / 0.3)",
              }}
            >
              <span className="w-2 h-2 rounded-full bg-bg-deep animate-pulse" />
              {t("cta")}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
