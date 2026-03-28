"use client"

import { useRef } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { Quote, Star } from "lucide-react"
import { useTranslations } from "next-intl"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"
import { SectionHeader } from "./section-header"

gsap.registerPlugin(ScrollTrigger)

export function Testimonials() {
  const t = useTranslations("testimonials")
  const [emblaRef] = useEmblaCarousel({ loop: true, align: "start" })
  const sectionRef = useRef<HTMLElement>(null)

  const testimonials = [
    {
      name: t("t1Name"),
      role: t("t1Role"),
      text: t("t1Text"),
      rating: 5,
      accentColor: "oklch(0.81 0.17 193)", // cyan
    },
    {
      name: t("t2Name"),
      role: t("t2Role"),
      text: t("t2Text"),
      rating: 5,
      accentColor: "oklch(0.65 0.25 350)", // pink
    },
    {
      name: t("t3Name"),
      role: t("t3Role"),
      text: t("t3Text"),
      rating: 5,
      accentColor: "oklch(0.81 0.17 193)", // cyan
    },
  ]

  useGSAP(
    () => {
      if (!sectionRef.current) return
      ScrollTrigger.batch(".testimonial-card", {
        onEnter: (batch) =>
          gsap.fromTo(
            batch,
            { opacity: 0, y: 35, scale: 0.96 },
            { opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "expo.out", stagger: 0.15 }
          ),
        start: "top 85%",
        once: true,
      })
    },
    { scope: sectionRef }
  )

  return (
    <section ref={sectionRef} id="testimonials" aria-label={t("title")} className="relative py-16 md:py-32 bg-bg-deep overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-15" />
      {/* Ambient glows */}
      <div className="absolute top-1/2 start-0 w-64 h-64 bg-cyan/[0.04] rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
      <div className="absolute top-1/2 end-0 w-64 h-64 bg-pink/[0.04] rounded-full blur-[100px] pointer-events-none -translate-y-1/2" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        {/* Grid on md+, Embla carousel on mobile */}
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
  accentColor: string
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <div
      className="testimonial-card group relative h-full p-5 md:p-7 rounded-2xl border border-border/60 overflow-hidden transition-all duration-500 hover:border-opacity-80"
      style={{ background: "oklch(0.12 0.02 243 / 0.85)" }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = `${item.accentColor.replace(")", " / 0.25)").replace("oklch(", "oklch(")}`
        ;(e.currentTarget as HTMLElement).style.boxShadow = `0 0 40px ${item.accentColor.replace(")", " / 0.06)").replace("oklch(", "oklch(")}, 0 20px 50px oklch(0 0 0 / 0.2)`
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.borderColor = ""
        ;(e.currentTarget as HTMLElement).style.boxShadow = ""
      }}
    >
      {/* Glassmorphism layer */}
      <div className="absolute inset-0 backdrop-blur-sm pointer-events-none" />
      {/* Ambient corner glow */}
      <div
        className="absolute -top-8 -start-8 w-24 h-24 rounded-full opacity-20 blur-2xl pointer-events-none transition-opacity duration-700 group-hover:opacity-40"
        style={{ background: item.accentColor }}
      />

      {/* Large decorative quote icon */}
      <div className="relative mb-4">
        <Quote
          className="w-10 h-10 transition-all duration-500 group-hover:scale-110"
          style={{ color: item.accentColor.replace(")", " / 0.35)").replace("oklch(", "oklch(") }}
        />
      </div>

      {/* Star rating */}
      <div className="flex items-center gap-0.5 mb-4">
        {Array.from({ length: item.rating }).map((_, j) => (
          <Star
            key={j}
            className="w-4 h-4 fill-amber-400 text-amber-400 transition-all duration-300"
            style={{ animationDelay: `${j * 80}ms` }}
          />
        ))}
      </div>

      <p className="relative text-text-secondary text-sm leading-relaxed mb-6 italic">
        {'\u201C'}{item.text}{'\u201D'}
      </p>

      <div className="relative flex items-center gap-3 pt-4 border-t border-border/40">
        {/* Avatar with gradient ring */}
        <div
          className="relative w-11 h-11 rounded-full flex-shrink-0 p-[2px] transition-all duration-500 group-hover:scale-105"
          style={{
            background: `linear-gradient(135deg, ${item.accentColor}, oklch(0.65 0.25 350))`, /* rtl-ok: cosmetic ring */
            boxShadow: `0 0 15px ${item.accentColor.replace(")", " / 0.3)").replace("oklch(", "oklch(")}`,
          }}
        >
          <div className="w-full h-full rounded-full bg-bg-deep flex items-center justify-center">
            <span className="text-sm font-bold" style={{ color: item.accentColor }}>{item.name.charAt(0)}</span>
          </div>
        </div>
        <div>
          <div className="text-sm font-semibold text-text">{item.name}</div>
          <div className="text-xs font-mono text-text-muted">{item.role}</div>
        </div>
      </div>
    </div>
  )
}
