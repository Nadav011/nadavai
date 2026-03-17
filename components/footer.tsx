"use client"

import { useTranslations } from "next-intl"
import { useState, useRef } from "react"
import { Zap, Send } from "lucide-react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

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
    <div className="newsletter-section py-8 border-t border-[hsl(215,28%,14%)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h4 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-1">
            {t("newsletterTitle")}
          </h4>
          <p className="text-xs text-[hsl(215,20%,45%)]">
            {t("newsletterDesc")}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <label htmlFor="newsletter-email" className="sr-only">{t("newsletterTitle")}</label>
            <input
              id="newsletter-email"
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle") }}
              placeholder={tCommon("emailPlaceholder")}
              className="w-full h-11 px-4 rounded-lg bg-[hsl(222,47%,6%)] border border-[hsl(215,28%,16%)] text-sm text-[hsl(210,40%,98%)] placeholder:text-[hsl(215,20%,45%)] focus:outline-none focus:border-[#06d6e0]/50 transition-colors"
              required
              aria-describedby={status === "success" ? "newsletter-success" : status === "error" ? "newsletter-error" : undefined}
            />
          </div>
          <button
            type="submit"
            className="h-11 px-5 rounded-lg bg-gradient-to-l from-[#06d6e0] to-[#0abfca] text-[hsl(222,47%,4%)] text-sm font-bold flex items-center gap-2 hover:shadow-[0_0_20px_hsl(187,92%,55%,0.3)] transition-shadow"
            aria-label={t("newsletterBtn")}
          >
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t("newsletterBtn")}</span>
          </button>
        </form>
      </div>
      {status === "success" && (
        <p id="newsletter-success" role="status" className="mt-3 text-xs text-[#06d6e0]">{t("newsletterSuccess")}</p>
      )}
      {status === "error" && (
        <p id="newsletter-error" role="alert" className="mt-3 text-xs text-[#e84393]">{t("newsletterError")}</p>
      )}
    </div>
  )
}

export function Footer() {
  const t = useTranslations("footer")
  const tCommon = useTranslations("common")
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
    {
      title: t("socialTitle"),
      links: [
        { label: "GitHub", href: "https://github.com/Nadav011" },
        { label: "Facebook", href: "https://www.facebook.com/nadav.cohen.167" },
      ],
    },
  ]

  useGSAP(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // Animate brand section
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

      // Batch animate footer link groups
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

      // Animate newsletter section
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

      // Animate bottom bar
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
    <footer ref={sectionRef} className="relative border-t border-[hsl(215,28%,16%)] bg-[hsl(222,47%,3%)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main footer */}
        <div className="py-8 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {/* Brand */}
          <div className="footer-brand col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#06d6e0] to-[#e84393] p-[1px]">
                <div className="flex items-center justify-center w-full h-full rounded-[6px] bg-[hsl(222,47%,3%)]">
                  <Zap className="w-4 h-4 text-[#06d6e0]" />
                </div>
              </div>
              <span className="text-lg font-bold text-[hsl(210,40%,98%)]">NADAV<span className="text-gradient">.AI</span></span>
            </a>
            <p className="text-sm text-[hsl(215,20%,45%)] leading-relaxed mb-4">
              {t("brand")}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#27ca40] animate-pulse" />
              <span className="text-xs font-mono text-[hsl(215,20%,48%)]">{t("available")}</span>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title} className="footer-link-group">
              <h4 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-4">{group.title}</h4>
              <div className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="text-sm text-[hsl(215,20%,50%)] hover:text-[#06d6e0] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <NewsletterForm />

        {/* Bottom bar */}
        <div className="footer-bottom py-6 border-t border-[hsl(215,28%,14%)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-mono text-xs text-[hsl(215,20%,45%)]">
            <span>{">"}</span>
            <span>NADAV.AI</span>
            <span className="text-[hsl(215,20%,25%)]">|</span>
            <span>2026</span>
            <span className="text-[hsl(215,20%,25%)]">|</span>
            <span>{"Built with AI"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[hsl(215,20%,45%)]">
            <span className="font-mono">{"powered by"}</span>
            <span className="text-gradient font-mono font-semibold">{"artificial intelligence"}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
