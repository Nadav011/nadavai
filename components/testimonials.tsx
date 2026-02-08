"use client"

import { Quote, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"



export function Testimonials() {
  const t = useTranslations("testimonials")

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

  return (
    <section id="testimonials" aria-label="המלצות" className="relative py-24 md:py-32 bg-[hsl(222,47%,3%)]">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <ScrollReveal key={i} delay={i * 120} direction={i % 2 === 0 ? "left" : "right"}>
              <div className="group relative h-full p-6 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] hover:border-[#06d6e0]/20 transition-all duration-500">
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
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
