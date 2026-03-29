"use client"

import { useTranslations } from "next-intl"
import { useState, useRef } from "react"
import { Zap, Send, Github, Facebook, ExternalLink } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

// Per-platform brand color config
const SOCIAL_PLATFORMS = [
  {
    label: "GitHub",
    href: "https://github.com/Nadav011",
    icon: Github,
    // slate/white brand
    color: "oklch(0.85 0.01 260)",
    borderIdle: "oklch(0.85 0.01 260 / 0.20)",
    borderHover: "oklch(0.85 0.01 260 / 0.55)",
    bgIdle: "oklch(0.85 0.01 260 / 0.04)",
    bgHover: "oklch(0.85 0.01 260 / 0.10)",
    glowHover: "0 0 20px oklch(0.85 0.01 260 / 0.25)",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/nadav.cohen.167",
    icon: Facebook,
    // Facebook blue
    color: "oklch(0.60 0.18 252)",
    borderIdle: "oklch(0.60 0.18 252 / 0.25)",
    borderHover: "oklch(0.60 0.18 252 / 0.60)",
    bgIdle: "oklch(0.60 0.18 252 / 0.05)",
    bgHover: "oklch(0.60 0.18 252 / 0.12)",
    glowHover: "0 0 20px oklch(0.60 0.18 252 / 0.30)",
  },
  {
    label: "Telegram",
    href: "https://t.me/NadavAGIbot",
    icon: null, // custom SVG
    // Telegram sky-blue
    color: "oklch(0.72 0.18 230)",
    borderIdle: "oklch(0.72 0.18 230 / 0.25)",
    borderHover: "oklch(0.72 0.18 230 / 0.60)",
    bgIdle: "oklch(0.72 0.18 230 / 0.05)",
    bgHover: "oklch(0.72 0.18 230 / 0.12)",
    glowHover: "0 0 20px oklch(0.72 0.18 230 / 0.30)",
  },
]

function TelegramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

function SocialLink({
  label,
  href,
  icon: Icon,
  color,
  borderIdle,
  borderHover,
  bgIdle,
  bgHover,
  glowHover,
}: (typeof SOCIAL_PLATFORMS)[number]) {
  const [hovered, setHovered] = useState(false)

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300"
      style={{
        border: `1px solid ${hovered ? borderHover : borderIdle}`,
        background: hovered ? bgHover : bgIdle,
        color,
        boxShadow: hovered ? glowHover : "none",
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {label === "Telegram" ? (
        <TelegramIcon className="w-4 h-4" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      <span>{label}</span>
      <ExternalLink
        className="w-3 h-3 opacity-0 group-hover:opacity-60 transition-opacity -ms-0.5"
        aria-hidden="true"
      />
    </a>
  )
}

function NewsletterForm() {
  const t = useTranslations("footer")
  const tCommon = useTranslations("common")
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="newsletter-section py-8 border-t border-border">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h3 className="text-sm font-semibold text-text mb-1">{t("newsletterTitle")}</h3>
          <p className="text-xs text-text-muted">{t("newsletterDesc")}</p>
        </div>

        {/* Glass form */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto"
        >
          <div
            className="relative flex-1 md:w-64 rounded-lg"
            style={{
              background: "oklch(0.12 0.02 243 / 0.7)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "1px solid oklch(0.22 0.02 260 / 0.5)",
            }}
          >
            <label htmlFor="newsletter-email" className="sr-only">
              {t("newsletterTitle")}
            </label>
            <input
              id="newsletter-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setStatus("idle")
              }}
              placeholder={tCommon("emailPlaceholder")}
              className="w-full h-11 px-4 rounded-lg bg-transparent text-sm text-text placeholder:text-text-muted focus:outline-none transition-colors border-0"
              required
              aria-describedby={
                status === "success"
                  ? "newsletter-success"
                  : status === "error"
                    ? "newsletter-error"
                    : undefined
              }
            />
          </div>

          {/* Gradient submit button */}
          <button
            type="submit"
            className="h-11 px-5 rounded-lg text-bg-deep text-sm font-bold flex items-center gap-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: "linear-gradient(135deg, oklch(0.81 0.17 193), oklch(0.65 0.20 230))",
              boxShadow: "0 0 20px oklch(0.81 0.17 193 / 0.30)",
            }}
            aria-label={t("newsletterBtn")}
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t("newsletterBtn")}</span>
          </button>
        </form>
      </div>

      {status === "success" && (
        <p id="newsletter-success" role="status" aria-live="polite" className="mt-3 text-xs text-cyan">
          {t("newsletterSuccess")}
        </p>
      )}
      {status === "error" && (
        <p id="newsletter-error" role="alert" aria-live="assertive" className="mt-3 text-xs text-pink">
          {t("newsletterError")}
        </p>
      )}
    </div>
  )
}

export function Footer() {
  const t = useTranslations("footer")
  const sectionRef = useRef<HTMLElement>(null)

  const footerLinks = [
    {
      title: t("navTitle"),
      links: [
        { label: t("navProjects"), href: "#projects" },
        { label: t("navServices"), href: "#services" },
        { label: t("navGuides"), href: "#guides" },
        { label: t("navResources"), href: "#resources" },
      ],
    },
    {
      title: t("contentTitle"),
      links: [
        { label: t("contentNews"), href: "#news" },
        { label: t("contentVideos"), href: "#guides" },
        { label: t("contentRepos"), href: "#resources" },
        { label: t("contentContact"), href: "#contact" },
      ],
    },
  ]

  useGSAP(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      gsap.from(".footer-brand", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      })

      gsap.from(".footer-link-group", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "expo.out",
        stagger: 0.1,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
          once: true,
        },
      })

      gsap.from(".newsletter-section", {
        opacity: 0,
        y: 20,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".newsletter-section",
          start: "top 85%",
          once: true,
        },
      })

      gsap.from(".footer-bottom", {
        opacity: 0,
        duration: 0.8,
        ease: "expo.out",
        scrollTrigger: {
          trigger: ".footer-bottom",
          start: "top 85%",
          once: true,
        },
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <footer
      id="footer"
      ref={sectionRef}
      className="relative border-t border-border bg-bg-deep section-glow-top"
    >
      {/* Subtle mesh in footer */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 70% 40% at 50% 0%, oklch(0.81 0.17 193 / 0.04), transparent 60%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        {/* Glassmorphism card wrapping main content */}
        <div
          className="my-8 md:my-12 rounded-2xl overflow-hidden"
          style={{
            background: "oklch(0.12 0.02 243 / 0.55)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid oklch(0.22 0.02 260 / 0.45)",
            boxShadow:
              "0 4px 40px oklch(0.085 0.025 245 / 0.6), inset 0 1px 0 oklch(0.95 0.01 260 / 0.04)",
          }}
        >
          {/* Main footer grid */}
          <div className="p-6 md:p-10 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {/* Brand */}
            <div className="footer-brand col-span-2 md:col-span-1">
              <a
                href="#"
                className="flex items-center gap-2.5 mb-4"
                aria-label="NADAV.AI — Back to top"
              >
                <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br rtl:bg-gradient-to-bl from-cyan to-pink p-[1px]">
                  <div className="flex items-center justify-center w-full h-full rounded-[6px] bg-bg-deep">
                    <Zap className="w-4 h-4 text-cyan" />
                  </div>
                </div>
                <span className="text-lg font-bold text-text">
                  NADAV<span className="text-gradient">.AI</span>
                </span>
              </a>

              <p className="text-sm text-text-muted leading-relaxed mb-4">{t("brand")}</p>

              <div className="flex items-center gap-2 mb-5">
                <div className="w-1.5 h-1.5 rounded-full bg-[oklch(0.72_0.20_145)] animate-pulse" />
                <span className="text-xs font-mono text-text-muted">{t("available")}</span>
              </div>

              {/* Social links — per-brand colors */}
              <div className="flex flex-col gap-2">
                {SOCIAL_PLATFORMS.map((platform) => (
                  <SocialLink key={platform.label} {...platform} />
                ))}
              </div>
            </div>

            {/* Nav link groups */}
            {footerLinks.map((group) => (
              <div key={group.title} className="footer-link-group">
                <h3 className="text-sm font-semibold text-text mb-4">{group.title}</h3>
                <div className="flex flex-col gap-2.5">
                  {group.links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noreferrer" }
                        : {})}
                      className="text-sm text-text-secondary hover:text-cyan transition-colors"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            ))}

            {/* "Built with AI" badge column */}
            <div className="footer-link-group flex flex-col gap-4">
              <h3 className="text-sm font-semibold text-text">{t("socialTitle")}</h3>

              {/* Animated gradient "Built with AI" badge */}
              <div
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold self-start"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.81 0.17 193 / 0.12), oklch(0.65 0.25 350 / 0.12), oklch(0.65 0.20 230 / 0.12))",
                  backgroundSize: "300% 300%",
                  animation: "gradient-shift 5s ease infinite",
                  border: "1px solid oklch(0.81 0.17 193 / 0.25)",
                }}
              >
                <span
                  style={{
                    background:
                      "linear-gradient(135deg, oklch(0.81 0.17 193), oklch(0.65 0.25 350), oklch(0.75 0.20 230))",
                    backgroundSize: "300% 300%",
                    animation: "gradient-shift 5s ease infinite",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  ⚡ Built with AI
                </span>
              </div>

              <p className="text-xs text-text-muted leading-relaxed">
                Next.js · React · GSAP · Tailwind · OKLCH
              </p>
            </div>
          </div>

          {/* Newsletter inside glass card */}
          <div className="px-6 md:px-10">
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom bar — outside glass card, full-width */}
        <div className="footer-bottom py-5 border-t border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 font-mono text-xs text-text-muted flex-wrap justify-center md:justify-start">
            <span className="text-text-dim">{">"}</span>
            <span>NADAV.AI</span>
            <span className="text-border" aria-hidden="true">|</span>
            <span>© 2026</span>
            <span className="text-border" aria-hidden="true">|</span>
            <span>Next.js · GSAP · OKLCH</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Animated gradient "Built with AI" badge — bottom bar variant */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs"
              style={{
                border: "1px solid oklch(0.81 0.17 193 / 0.20)",
                background: "oklch(0.81 0.17 193 / 0.05)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "oklch(0.81 0.17 193)",
                  boxShadow: "0 0 6px oklch(0.81 0.17 193 / 0.8)",
                  animation: "breathe 2s ease-in-out infinite",
                }}
                aria-hidden="true"
              />
              <span
                className="font-mono"
                style={{
                  background:
                    "linear-gradient(135deg, oklch(0.81 0.17 193), oklch(0.65 0.25 350))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                AI-powered
              </span>
            </div>

            <span className="text-xs text-text-dim font-mono">
              {t("available")}
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
