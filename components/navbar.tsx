"use client"

import { useState, useEffect, useRef } from "react"
import { Zap, ExternalLink } from "lucide-react"
import { Magnetic } from "./magnetic"
import { CommandPalette } from "./command-palette"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/routing"

export function Navbar() {
  const t = useTranslations("nav")
  const tCommon = useTranslations("common")
  const locale = useLocale()
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const [indicatorStyle, setIndicatorStyle] = useState({ width: 0, left: 0 })
  const navRef = useRef<HTMLDivElement>(null)
  const mobileMenuRef = useRef<HTMLDivElement>(null)
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null)

  const navLinks = [
    { label: t("projects"), href: "#projects", badge: "8" },
    { label: t("services"), href: "#services", hot: true },
    { label: t("blog"), href: "#blog" },
    { label: t("youtube"), href: "#youtube" },
    { label: t("guides"), href: "#guides" },
    { label: t("resources"), href: "#resources", badge: "FREE" },
    { label: t("news"), href: "#news" },
    { label: t("contact"), href: "#contact" },
  ]

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
  }, [])

  useEffect(() => {
    if (!navRef.current || !activeSection) return
    const activeEl = navRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement
    if (activeEl) {
      setIndicatorStyle({
        width: activeEl.offsetWidth,
        left: activeEl.offsetLeft,
      })
    }
  }, [activeSection])

  // Escape key handler for mobile menu
  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false)
        hamburgerButtonRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
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
      if (e.key !== 'Tab') return

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

    document.addEventListener('keydown', handleTabKey)
    firstElement?.focus()

    return () => document.removeEventListener('keydown', handleTabKey)
  }, [mobileOpen])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ${
          scrolled ? "py-2" : "py-4"
        }`}
      >
        <div className={`absolute inset-0 transition-all duration-700 ${
          scrolled
            ? "bg-[hsl(222,47%,4%)/0.88] backdrop-blur-2xl shadow-[0_4px_40px_rgba(0,0,0,0.4)] border-b border-[hsl(215,28%,16%)/0.5]"
            : "bg-transparent"
        }`} />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-[#06d6e0]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#06d6e0] to-[#e84393] p-[1.5px] group-hover:shadow-[0_0_25px_hsl(187,92%,55%,0.3)] transition-shadow duration-500">
                <div className="flex items-center justify-center w-full h-full rounded-[9px] bg-[hsl(222,47%,4%)] group-hover:bg-[hsl(222,47%,5%)] transition-colors">
                  <Zap className="w-5 h-5 text-[#06d6e0] group-hover:text-[#e84393] transition-colors duration-500" />
                </div>
              </div>
              <div className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-[hsl(222,47%,4%)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#27ca40] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[hsl(210,40%,98%)] leading-none">
                NADAV<span className="text-gradient">.AI</span>
              </span>
              <span className="text-[9px] font-mono text-[hsl(215,20%,48%)] tracking-[0.25em] uppercase mt-0.5">
                {t("logoSubtitle")}
              </span>
            </div>
          </a>

          <div ref={navRef} className="hidden lg:flex items-center gap-0.5 relative">
            <div
              className="absolute bottom-0 h-[2px] rounded-full bg-gradient-to-l from-[#06d6e0] to-[#e84393] transition-all duration-500 ease-out"
              style={{
                width: `${indicatorStyle.width}px`,
                left: `${indicatorStyle.left}px`,
                opacity: activeSection ? 1 : 0,
              }}
            />

            {navLinks.map((link) => {
              const section = link.href.replace("#", "")
              const isActive = activeSection === section
              return (
                <Magnetic key={link.href} strength={0.12}>
                  <a
                    href={link.href}
                    data-section={section}
                    className={`relative px-4 py-2.5 text-sm transition-all duration-300 group/link ${
                      isActive
                        ? "text-[hsl(210,40%,98%)]"
                        : "text-[hsl(215,20%,55%)] hover:text-[hsl(210,40%,90%)]"
                    }`}
                  >
                    <span className="relative">
                      {link.label}
                      {link.badge && (
                        <span className="absolute -top-2.5 -start-3 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#06d6e0]/15 text-[#06d6e0] border border-[#06d6e0]/25 leading-none">
                          {link.badge}
                        </span>
                      )}
                      {link.hot && (
                        <span className="absolute -top-1.5 -start-1.5 w-2 h-2 rounded-full bg-[#e84393] animate-pulse" />
                      )}
                    </span>
                  </a>
                </Magnetic>
              )
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <CommandPalette />
            {/* Language switcher */}
            <Link
              href="/"
              locale={locale === "he" ? "en" : "he"}
              className="px-2.5 py-1.5 rounded-lg border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] text-[hsl(215,20%,50%)] hover:border-[#06d6e0]/30 hover:text-[hsl(210,40%,98%)] transition-all text-xs font-mono font-bold"
            >
              {tCommon("langSwitch")}
            </Link>
            <a href="https://github.com/Nadav011" target="_blank" rel="noreferrer" className="p-2.5 rounded-lg text-[hsl(215,20%,50%)] hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(215,28%,12%)] transition-all" aria-label={tCommon("githubAriaLabel")}>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Magnetic strength={0.2}>
              <a
                href="#contact"
                className="relative group/cta inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-l from-[#06d6e0] to-[#0abfca] transition-all duration-500 group-hover/cta:shadow-[0_0_30px_hsl(187,92%,55%,0.4)]" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center gap-2.5 text-[hsl(222,47%,4%)]">
                  <span className="relative w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-[hsl(222,47%,4%)] animate-ping opacity-40" />
                    <span className="relative block w-2 h-2 rounded-full bg-[hsl(222,47%,4%)]" />
                  </span>
                  {t("cta")}
                </span>
              </a>
            </Magnetic>
          </div>

          <button
            ref={hamburgerButtonRef}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden relative p-2.5 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,6%)] text-[hsl(210,40%,98%)] hover:border-[#06d6e0]/30 transition-all"
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

      <div 
        id="mobile-menu"
        ref={mobileMenuRef}
        role="dialog"
        aria-modal="true"
        aria-label={t("mobileNavigation")}
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      >
        <div className="absolute inset-0 bg-[hsl(222,47%,3%)/0.98] backdrop-blur-2xl" />
        <div className="relative pt-24 px-6 h-full flex flex-col">
          <div className="flex flex-col gap-2 flex-1">
            {navLinks.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center justify-between p-4 rounded-xl border border-[hsl(215,28%,14%)] bg-[hsl(222,47%,5%)] text-[hsl(210,40%,98%)] hover:border-[#06d6e0]/30 transition-all duration-300 ${
                  mobileOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
                }`}
                style={{ transitionDelay: mobileOpen ? `${i * 60 + 100}ms` : "0ms" }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-[#06d6e0] w-6">0{i + 1}</span>
                  <span className="font-medium">{link.label}</span>
                </div>
                {link.badge && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#06d6e0]/10 text-[#06d6e0] border border-[#06d6e0]/20">{link.badge}</span>
                )}
                {link.hot && (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e84393]/10 text-[#e84393] border border-[#e84393]/20">HOT</span>
                )}
              </a>
            ))}
          </div>
          <div className="pb-8 space-y-3">
            {/* Language switcher mobile */}
            <Link
              href="/"
              locale={locale === "he" ? "en" : "he"}
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,6%)] text-sm font-mono font-bold text-[hsl(215,20%,60%)]"
            >
              {tCommon("langSwitch")}
            </Link>
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center gap-2.5 w-full p-4 rounded-xl bg-gradient-to-l from-[#06d6e0] to-[#0abfca] text-[hsl(222,47%,4%)] font-bold text-lg"
            >
              <span className="w-2 h-2 rounded-full bg-[hsl(222,47%,4%)] animate-pulse" />
              {t("cta")}
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
