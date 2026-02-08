"use client"

import { useTranslations } from "next-intl"
import { useState, useRef } from "react"
import { Phone, X } from "lucide-react"
import { gsap } from "gsap"
import { useGSAP } from "@gsap/react"

export function WhatsAppButton() {
  const t = useTranslations("whatsapp")
  const [tooltip, setTooltip] = useState(true)
  const buttonRef = useRef<HTMLAnchorElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    const tl = gsap.timeline({ delay: 2 })

    // Button entrance: slide up with bounce
    tl.fromTo(
      buttonRef.current,
      {
        y: 100,
        opacity: 0,
        scale: 0.8,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
      }
    )

    // Tooltip entrance: fade in with slight delay
    if (tooltip) {
      tl.fromTo(
        tooltipRef.current,
        {
          x: -20,
          opacity: 0,
        },
        {
          x: 0,
          opacity: 1,
          duration: 0.5,
          ease: "power2.out",
        },
        "-=0.3" // Start 0.3s before button animation ends
      )

      // Auto-hide tooltip after 8 seconds
      setTimeout(() => {
        if (tooltipRef.current) {
          gsap.to(tooltipRef.current, {
            x: -20,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => setTooltip(false),
          })
        }
      }, 8000)
    }
  }, { scope: containerRef })

  return (
    <div ref={containerRef} className="fixed bottom-4 start-4 md:bottom-6 md:start-6 z-50 flex items-end gap-3">
      {/* Tooltip */}
      {tooltip && (
        <div ref={tooltipRef} className="relative opacity-0">
          <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(222,47%,7%)] border border-[hsl(215,28%,16%)] shadow-lg">
            <span className="text-sm text-[hsl(210,40%,98%)]">{t("tooltip")}</span>
            <button
              onClick={() => {
                if (tooltipRef.current) {
                  gsap.to(tooltipRef.current, {
                    x: -20,
                    opacity: 0,
                    duration: 0.3,
                    ease: "power2.in",
                    onComplete: () => setTooltip(false),
                  })
                }
              }}
              className="p-0.5 rounded hover:bg-[hsl(215,28%,14%)] transition-colors"
              aria-label={t("close")}
            >
              <X className="w-3 h-3 text-[hsl(215,20%,45%)]" />
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute bottom-2 -start-2 w-3 h-3 rotate-45 bg-[hsl(222,47%,7%)] border-b border-s border-[hsl(215,28%,16%)]" />
        </div>
      )}

      {/* Button */}
      <a
        ref={buttonRef}
        href="https://wa.me/972504401760"
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300 opacity-0"
        aria-label={t("ariaLabel")}
      >
        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <Phone className="w-6 h-6 text-white relative z-10" />
      </a>
    </div>
  )
}
