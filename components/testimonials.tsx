"use client"

import useEmblaCarousel from "embla-carousel-react"
import { Quote, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { SectionHeader } from "./section-header"

export function Testimonials() {
  const t = useTranslations("testimonials")
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" })

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
    <section id="testimonials" aria-label={t("title")} className="relative py-16 md:py-32 bg-bg-deep">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        {/* Embla carousel on mobile, grid on md+ */}
        <div className="hidden md:grid md:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <TestimonialCard key={i} item={item} />
          ))}
        </div>

        <div className="md:hidden overflow-hidden" ref={emblaRef}>
          <div className="flex gap-4">
            {testimonials.map((item, i) => (
              <div key={i} className="flex-[0_0_85%] min-w-0">
                <TestimonialCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

interface TestimonialItem {
  name: string
  role: string
  text: string
  rating: number
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div className="testimonial-card group relative h-full p-4 md:p-6 rounded-xl border border-border bg-bg-surface hover:border-cyan/20 transition-all duration-500">
      <Quote className="w-8 h-8 text-cyan/20 mb-4" />

      <div className="flex items-center gap-1 mb-4">
        {Array.from({ length: item.rating }).map((_, j) => (
          <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
        ))}
      </div>

      <p className="text-text-secondary text-sm leading-relaxed mb-6">
        {'"'}{item.text}{'"'}
      </p>

      <div className="flex items-center gap-3 pt-4 border-t border-border">
        {/* Avatar: radial gradient is non-directional — rtl-ok */}
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ background: "radial-gradient(circle at 30% 30%, oklch(0.81 0.17 193), oklch(0.65 0.26 350))" }}
        >
          <span className="text-sm font-bold text-bg-deep">{item.name.charAt(0)}</span>
        </div>
        <div>
          <div className="text-sm font-semibold text-text">{item.name}</div>
          <div className="text-xs font-mono text-text-muted">{item.role}</div>
        </div>
      </div>
    </div>
  )
}
