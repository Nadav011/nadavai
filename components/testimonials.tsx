"use client"

import { useRef } from "react"
import { Quote, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { SectionHeader } from "./section-header"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export function Testimonials() {
  const t = useTranslations("testimonials")
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)

  const testimonials = [
    {
      name: t("t1Name"),
      role: t("t1Role"),
      text: t("t1Text"),
      rating: 5,
    },
    {
      name: t("t2Name"),
      role: t("t2Role"),
      text: t("t2Text"),
      rating: 5,
    },
    {
      name: t("t3Name"),
      role: t("t3Role"),
      text: t("t3Text"),
      rating: 5,
    },
  ]

  useGSAP(() => {
    if (!sectionRef.current) return

    // Animate section header
    if (headerRef.current) {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: "expo.out",
          scrollTrigger: {
            trigger: headerRef.current,
            start: "top 85%",
            once: true,
          },
        }
      )
    }

    // Animate testimonial cards with batch
    ScrollTrigger.batch(".testimonial-card", {
      onEnter: (elements) => {
        gsap.fromTo(
          elements,
          { opacity: 0, y: 25 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            ease: "expo.out",
            duration: 0.7,
          }
        )
      },
      start: "top 85%",
      once: true,
    })
  }, { scope: sectionRef })

  return (
    <section ref={sectionRef} id="testimonials" aria-label={t("title")} className="relative py-16 md:py-32 bg-[hsl(222,47%,3%)]">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div ref={headerRef}>
          <SectionHeader
            badge={t("badge")}
            title={t("title")}
            highlight={t("highlight")}
            description={t("description")}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="testimonial-card group relative h-full p-4 md:p-6 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] hover:border-[#06d6e0]/20 transition-all duration-500">
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-[#06d6e0]/20 mb-4" />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Text */}
              <p className="text-[hsl(215,20%,65%)] text-sm leading-relaxed mb-6">
                {'"'}{t.text}{'"'}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[hsl(215,28%,14%)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06d6e0] to-[#e84393] flex items-center justify-center">
                  <span className="text-sm font-bold text-[hsl(222,47%,4%)]">{t.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[hsl(210,40%,98%)]">{t.name}</div>
                  <div className="text-xs font-mono text-[hsl(215,20%,45%)]">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
