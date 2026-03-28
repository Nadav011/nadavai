"use client"

import { useRef } from "react"
import { useTranslations } from "next-intl"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

import { SectionHeader } from "./section-header"
import { ExternalLink, Github, Users } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const socialLinks = [
  {
    platform: "Facebook",
    icon: (
      <svg className="w-5 h-5 text-[#1877F2]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
      </svg>
    ),
    descKey: "fbDesc",
    href: "https://www.facebook.com/nadav.cohen.167",
    color: "#1877F2",
    labelKey: "fbLabel",
  },
  {
    platform: "Full Stack Developers Israel",
    icon: <Users className="w-5 h-5 text-[#1877F2]" />,
    descKey: "fsdiDesc",
    href: "https://www.facebook.com/groups/1684554685829832",
    color: "#1877F2",
    labelKey: "fsdiLabel",
  },
  {
    platform: "GitHub",
    icon: <Github className="w-5 h-5 text-text" />,
    descKey: "ghDesc",
    href: "https://github.com/Nadav011",
    color: "#f0f6fc",
    labelKey: "ghLabel",
  },
  {
    platform: "WhatsApp",
    icon: (
      <svg className="w-5 h-5 text-[#27ca40]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
      </svg>
    ),
    descKey: "waDesc",
    href: "https://wa.me/972505245677",
    color: "#27ca40",
    labelKey: "waLabel",
  },
  {
    platform: "Telegram",
    icon: (
      <svg className="w-5 h-5 text-[#2AABEE]" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.96 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
    descKey: "tgDesc",
    href: "https://t.me/NadavAGIbot",
    color: "#2AABEE",
    labelKey: "tgLabel",
  },
]

export function Social() {
  const t = useTranslations("social")
  const sectionRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      ScrollTrigger.batch(".social-card", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, ease: "expo.out", stagger: 0.12 }
          ),
        start: "top 80%",
        once: true,
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="social" aria-label={t("title")} className="relative py-16 md:py-32 bg-bg-deep">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {socialLinks.map((link, i) => (
            <a
              key={i}
              href={link.href}
              target="_blank"
              rel="noreferrer"
              className="social-card group relative block h-full p-4 md:p-6 rounded-xl border border-border bg-bg-surface overflow-hidden transition-all duration-500"
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = `${link.color}40`
                e.currentTarget.style.boxShadow = `0 0 35px ${link.color}10, 0 15px 40px oklch(0 0 0 / 0.2)`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = ""
                e.currentTarget.style.boxShadow = ""
              }}
            >
              {/* Brand-colored radial background sweep on hover */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: `radial-gradient(ellipse 80% 60% at 0% 50%, ${link.color}06, transparent 60%)` }}
              />
              {/* Top accent bar */}
              <div
                className="absolute top-0 start-0 end-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `linear-gradient(to right, ${link.color}80, ${link.color}30, transparent)` /* rtl-ok: brand accent from start */ }}
              />

              <div className="relative flex items-center gap-3 mb-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-105"
                  style={{ background: `${link.color}12`, border: `1px solid ${link.color}25` }}
                  onMouseEnter={(e) => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 20px ${link.color}30`
                    ;(e.currentTarget as HTMLElement).style.background = `${link.color}20`
                  }}
                  onMouseLeave={(e) => {
                    ;(e.currentTarget as HTMLElement).style.boxShadow = ""
                    ;(e.currentTarget as HTMLElement).style.background = `${link.color}12`
                  }}
                >
                  {link.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-text">{link.platform}</div>
                  <div className="text-[10px] font-mono" style={{ color: link.color }}>{t(link.labelKey)}</div>
                </div>
                {/* Arrow fades in on hover */}
                <ExternalLink
                  className="w-4 h-4 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 rtl:translate-x-2 rtl:group-hover:translate-x-0 transition-all duration-300"
                  style={{ color: link.color }}
                />
              </div>

              <p className="relative text-sm text-text-secondary leading-relaxed mb-4">{t(link.descKey)}</p>

              <div className="relative flex items-center justify-between pt-3 border-t border-border/40">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: link.color }} />
                  <span className="text-[10px] font-mono text-text-muted">active</span>
                </div>
                <span
                  className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold transition-all duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                  style={{ color: link.color }}
                >
                  <ExternalLink className="w-3 h-3" />
                  {">> open"}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
