"use client"

import { useRef } from "react"
import { useTranslations } from "next-intl"
import { Send, Mail, MessageSquare, Zap, Phone } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { Magnetic } from "./magnetic"

gsap.registerPlugin(ScrollTrigger)

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
    <section ref={sectionRef} id="contact" aria-label={t("title")} className="relative py-16 md:py-32 overflow-hidden">
      <div className="absolute top-0 w-[800px] h-[400px] bg-[#06d6e0]/5 rounded-full blur-[120px]" style={{ left: "50%", transform: "translateX(-50%)" }} />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e84393]/20 bg-[#e84393]/5 mb-6">
          <Zap className="w-3.5 h-3.5 text-[#e84393]" />
          <span className="text-xs font-mono text-[#e84393] tracking-wider uppercase">{t("badge")}</span>
        </div>

        <h2 ref={headingRef} className="text-3xl md:text-6xl lg:text-7xl font-bold text-[hsl(210,40%,98%)] mb-6 leading-[1.1]">
          {t("heading1")}
          <br />
          <span className="text-gradient-animated">{t("heading2")}</span>
        </h2>

        <p ref={descRef} className="text-lg text-[hsl(215,20%,55%)] max-w-xl mx-auto mb-10 leading-relaxed">
          {t("description")}
        </p>

        <div ref={terminalRef} className="relative mx-auto max-w-2xl rounded-xl overflow-hidden border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] group/terminal">
          {/* Terminal scan line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#06d6e0]/20 to-transparent" style={{ animation: "scan-line 6s linear infinite" }} />
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(215,28%,16%)] bg-[hsl(222,47%,6%)]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
            </div>
            <span className="text-xs font-mono text-[hsl(215,20%,48%)]">contact.sh</span>
            <div className="w-12" />
          </div>

          <div className="p-4 md:p-8 space-y-3 md:space-y-4 text-end">
            <div className="flex items-center gap-3 font-mono text-sm">
              <span className="text-[#06d6e0]">$</span>
              <span className="text-[hsl(215,20%,60%)]">echo</span>
              <span className="text-[#e84393]">{`"${t("terminalCmd")}"`}</span>
            </div>

            <div className="space-y-2 md:space-y-3 me-2 md:me-6">
              <a
                href="https://wa.me/972504401760"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-[#27ca40]/30 bg-[#27ca40]/5 hover:border-[#27ca40]/50 hover:bg-[#27ca40]/10 transition-all group"
              >
                <Phone className="w-5 h-5 text-[#27ca40]" />
                <div className="text-end">
                  <div className="text-sm font-medium text-[hsl(210,40%,98%)]">{"WhatsApp"}</div>
                  <div className="text-xs text-[#27ca40]">{t("waSubtitle")}</div>
                </div>
              </a>

              <a
                href="mailto:hello@nadavc.ai"
                className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(215,28%,14%)] bg-[hsl(222,47%,4%)] hover:border-[#06d6e0]/30 transition-all group"
              >
                <Mail className="w-5 h-5 text-[#06d6e0]" />
                <div className="text-end">
                  <div className="text-sm font-medium text-[hsl(210,40%,98%)]">hello@nadavc.ai</div>
                  <div className="text-xs text-[hsl(215,20%,45%)]">{t("emailSubtitle")}</div>
                </div>
              </a>

              <a
                href="https://m.me/nadav.cohen.167"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(215,28%,14%)] bg-[hsl(222,47%,4%)] hover:border-[#e84393]/30 transition-all group"
              >
                <MessageSquare className="w-5 h-5 text-[#e84393]" />
                <div className="text-end">
                  <div className="text-sm font-medium text-[hsl(210,40%,98%)]">{t("fbTitle")}</div>
                  <div className="text-xs text-[hsl(215,20%,45%)]">{t("fbSubtitle")}</div>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-3 font-mono text-sm pt-2">
              <span className="text-[#27ca40]">{">"}</span>
              <span className="text-[hsl(215,20%,50%)]">{t("avgResponseLabel")}</span>
              <span className="text-[#06d6e0]">{t("avgResponseValue")}</span>
            </div>
          </div>
        </div>

        <div ref={calendlyRef} className="mt-8 mx-auto max-w-2xl">
          <a
            href="https://calendly.com/nadavcohen"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-3 p-4 rounded-xl border border-[#4f46e5]/30 bg-[#4f46e5]/5 hover:border-[#4f46e5]/50 hover:bg-[#4f46e5]/10 transition-all group"
          >
            <svg className="w-5 h-5 text-[#4f46e5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <div className="text-end">
              <div className="text-sm font-medium text-[hsl(210,40%,98%)]">{t("calendlyTitle")}</div>
              <div className="text-xs text-[#4f46e5]">{t("calendlySubtitle")}</div>
            </div>
          </a>
        </div>

        <div ref={ctaRef} className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Magnetic strength={0.2}>
            <a
              href="https://wa.me/972504401760"
              target="_blank"
              rel="noreferrer"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-xl text-base md:text-lg font-bold text-[hsl(222,47%,4%)] bg-gradient-to-l from-[#27ca40] to-[#22a838] hover:shadow-[0_0_50px_hsl(135,65%,45%,0.4)] transition-all duration-500 w-full sm:w-auto"
            >
              <Phone className="w-5 h-5" />
              {t("ctaWhatsapp")}
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a
              href="mailto:hello@nadavc.ai"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-medium text-[hsl(210,40%,98%)] border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] hover:border-[#06d6e0]/40 transition-all duration-500 w-full sm:w-auto"
            >
              <Send className="w-4 h-4 text-[#06d6e0]" />
              {t("ctaEmail")}
            </a>
          </Magnetic>
        </div>
      </div>
    </section>
  )
}
