"use client"

import { useRef } from "react"
import { useTranslations } from "next-intl"
import { Send, Mail, MessageSquare, Zap, Phone } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Magnetic } from "./magnetic"

gsap.registerPlugin(ScrollTrigger)

async function fireConfetti() {
  try {
    const confetti = (await import("canvas-confetti")).default
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["oklch(0.81 0.17 193)", "oklch(0.65 0.25 350)", "#27ca40"],
    })
  } catch {}
}

export function Contact() {
  const t = useTranslations("contact")
  const sectionRef = useRef<HTMLDivElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)
  const calendlyRef = useRef<HTMLDivElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 80%",
          once: true,
        },
      })

      tl.fromTo(
        badgeRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" }
      )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "expo.out" },
          "<0.15"
        )
        .fromTo(
          descRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
          "<0.15"
        )
        .fromTo(
          terminalRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.7, ease: "expo.out" },
          "<0.2"
        )
        .fromTo(
          calendlyRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "expo.out" },
          "<0.15"
        )
        .fromTo(
          ctaRef.current?.children || [],
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, ease: "expo.out", stagger: 0.1 },
          "<0.15"
        )
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="contact"
      aria-label={t("title")}
      className="relative py-16 md:py-32 overflow-hidden"
    >
      {/* Mesh gradient + dot grid background */}
      <div className="absolute inset-0 mesh-gradient opacity-80 pointer-events-none" />
      <div className="absolute inset-0 dot-grid-subtle pointer-events-none" />

      {/* Central ambient bloom */}
      <div className="absolute top-0 start-1/2 -translate-x-1/2 w-full max-w-3xl aspect-[2/1] bg-cyan/5 rounded-full blur-[120px] pointer-events-none" />
      <div
        className="absolute top-1/3 start-1/2 -translate-x-1/2 w-full max-w-2xl h-72 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.81 0.17 193 / 0.07) 0%, oklch(0.65 0.25 350 / 0.04) 50%, transparent 70%)",
          filter: "blur(40px)",
        }}
      />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-pink/20 bg-pink/5 mb-6"
        >
          <Zap className="w-3.5 h-3.5 text-pink" />
          <span className="text-xs font-mono text-pink tracking-wider uppercase">
            {t("badge")}
          </span>
        </div>

        <h2
          ref={headingRef}
          className="text-2xl md:text-6xl lg:text-7xl font-bold text-text mb-4 md:mb-6 leading-[1.1]"
        >
          {t("heading1")}
          <br />
          <span className="text-gradient-animated">{t("heading2")}</span>
        </h2>

        <p
          ref={descRef}
          className="text-base md:text-lg text-text-muted max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed px-2 md:px-0"
        >
          {t("description")}
        </p>

        {/* Terminal card */}
        <div
          ref={terminalRef}
          className="relative mx-auto max-w-2xl rounded-xl overflow-hidden border border-border bg-bg-surface group/terminal"
          style={{
            boxShadow:
              "0 0 0 1px oklch(0.22 0.02 260 / 0.8), 0 20px 60px oklch(0.085 0.025 245 / 0.8), 0 0 80px oklch(0.81 0.17 193 / 0.04)",
          }}
        >
          {/* Dramatic scan line — dual pass for more intensity */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
            <div
              className="w-full h-[2px]"
              style={{
                background:
                  "linear-gradient(to left, transparent, oklch(0.81 0.17 193 / 0.5), oklch(0.87 0.19 193 / 0.9), oklch(0.81 0.17 193 / 0.5), transparent)",
                animation: "scan-line 4s linear infinite",
                filter: "blur(0.5px)",
              }}
            />
            <div
              className="w-full h-[8px]"
              style={{
                background:
                  "linear-gradient(to left, transparent, oklch(0.81 0.17 193 / 0.08), oklch(0.81 0.17 193 / 0.15), oklch(0.81 0.17 193 / 0.08), transparent)",
                animation: "scan-line 4s linear infinite",
                marginTop: "-8px",
                filter: "blur(3px)",
              }}
            />
          </div>

          {/* Terminal title bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-elevated relative">
            {/* Dot glow halo */}
            <div
              className="absolute start-3 top-1/2 -translate-y-1/2 w-16 h-8 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at 30% 50%, #ff5f56 0%, transparent 45%), radial-gradient(ellipse at 50% 50%, #ffbd2e 0%, transparent 40%), radial-gradient(ellipse at 70% 50%, #27ca40 0%, transparent 45%)",
                filter: "blur(6px)",
                opacity: 0.6,
              }}
              aria-hidden="true"
            />
            <div className="flex items-center gap-1.5 relative z-10">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] shadow-[0_0_6px_#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] shadow-[0_0_6px_#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40] shadow-[0_0_6px_#27ca40]" />
            </div>
            <span className="text-xs font-mono text-text-muted">contact.sh</span>
            <div className="w-12" />
          </div>

          <div className="p-4 md:p-8 space-y-3 md:space-y-4 text-end">
            <div className="flex items-center gap-3 font-mono text-sm">
              <span className="text-cyan">$</span>
              <span className="text-text-secondary">echo</span>
              <span className="text-pink">{`"${t("terminalCmd")}"`}</span>
            </div>

            <div className="space-y-2 md:space-y-3 me-2 md:me-6">
              {/* WhatsApp */}
              <a
                href="https://wa.me/972505245677"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-[#27ca40]/30 bg-[#27ca40]/5 hover:border-[#27ca40]/60 hover:bg-[#27ca40]/10 transition-all group"
                style={{ transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                <Phone className="w-5 h-5 text-[#27ca40] group-hover:scale-110 transition-transform" />
                <div className="text-end">
                  <div className="text-sm font-medium text-text">WhatsApp</div>
                  <div className="text-xs text-[#27ca40]">{t("waSubtitle")}</div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:nadav@nadavc.ai"
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg-deep hover:border-cyan/40 hover:bg-cyan/5 transition-all group"
                style={{ transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                <Mail className="w-5 h-5 text-cyan group-hover:scale-110 transition-transform" />
                <div className="text-end">
                  <div className="text-sm font-medium text-text">nadav@nadavc.ai</div>
                  <div className="text-xs text-text-muted">{t("emailSubtitle")}</div>
                </div>
              </a>

              {/* Telegram — blue gradient (oklch 230 hue) */}
              <a
                href="https://t.me/NadavAGIbot"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg transition-all group"
                style={{
                  border: "1px solid oklch(0.65 0.20 230 / 0.35)",
                  background: "oklch(0.65 0.20 230 / 0.06)",
                  transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.65 0.20 230 / 0.6)"
                  e.currentTarget.style.background = "oklch(0.65 0.20 230 / 0.12)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "oklch(0.65 0.20 230 / 0.35)"
                  e.currentTarget.style.background = "oklch(0.65 0.20 230 / 0.06)"
                }}
              >
                {/* Telegram plane icon */}
                <svg
                  className="w-5 h-5 group-hover:scale-110 transition-transform"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  style={{ color: "oklch(0.75 0.20 230)" }}
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
                <div className="text-end">
                  <div
                    className="text-sm font-medium"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.80 0.18 230), oklch(0.65 0.22 220))",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    Telegram
                  </div>
                  <div className="text-xs" style={{ color: "oklch(0.60 0.16 230)" }}>
                    {t("waSubtitle")}
                  </div>
                </div>
              </a>

              {/* Facebook Messenger */}
              <a
                href="https://m.me/nadav.cohen.167"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-bg-deep hover:border-pink/30 hover:bg-pink/5 transition-all group"
                style={{ transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)" }}
              >
                <MessageSquare className="w-5 h-5 text-pink group-hover:scale-110 transition-transform" />
                <div className="text-end">
                  <div className="text-sm font-medium text-text">{t("fbTitle")}</div>
                  <div className="text-xs text-text-muted">{t("fbSubtitle")}</div>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-3 font-mono text-sm pt-2">
              <span className="text-[#27ca40]">{">"}</span>
              <span className="text-text-secondary">{t("avgResponseLabel")}</span>
              <span className="text-cyan">{t("avgResponseValue")}</span>
            </div>
          </div>
        </div>

        {/* Calendly */}
        <div ref={calendlyRef} className="mt-8 mx-auto max-w-2xl">
          <a
            href="https://calendly.com/nadavcohen"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 p-4 rounded-xl border border-[#4f46e5]/30 bg-[#4f46e5]/5 hover:border-[#4f46e5]/50 hover:bg-[#4f46e5]/10 transition-all group"
          >
            <svg
              className="w-5 h-5 text-[#4f46e5]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <div className="text-end">
              <div className="text-sm font-medium text-text">{t("calendlyTitle")}</div>
              <div className="text-xs text-[#4f46e5]">{t("calendlySubtitle")}</div>
            </div>
          </a>
        </div>

        {/* CTA buttons */}
        <div
          ref={ctaRef}
          className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4"
        >
          <Magnetic strength={0.2}>
            <a
              href="https://wa.me/972505245677"
              target="_blank"
              rel="noreferrer"
              onClick={fireConfetti}
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-xl text-base md:text-lg font-bold text-bg-deep bg-gradient-to-l rtl:bg-gradient-to-r from-[#27ca40] to-[#22a838] hover:shadow-[0_0_50px_oklch(0.65_0.22_145_/_0.5),0_0_90px_oklch(0.65_0.22_145_/_0.2)] transition-all duration-500 w-full sm:w-auto overflow-hidden"
            >
              {/* Inner shimmer sweep */}
              <span
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{
                  background:
                    "linear-gradient(105deg, transparent 40%, oklch(1 0 0 / 0.15) 50%, transparent 60%)",
                  backgroundSize: "200% 100%",
                  animation: "shimmer 1.5s ease-in-out infinite",
                }}
                aria-hidden="true"
              />
              <Phone className="w-5 h-5 relative z-10" />
              <span className="relative z-10">{t("ctaWhatsapp")}</span>
            </a>
          </Magnetic>

          <Magnetic strength={0.2}>
            <a
              href="mailto:nadav@nadavc.ai"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-medium text-text border border-border/80 bg-bg-surface hover:border-cyan/40 hover:bg-cyan/5 hover:shadow-[0_0_30px_oklch(0.81_0.17_193_/_0.15)] transition-all duration-500 w-full sm:w-auto"
            >
              <Send className="w-4 h-4 text-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              {t("ctaEmail")}
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
