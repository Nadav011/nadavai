"use client"

import { useRef } from "react"
import { Phone, Brain, Zap, Rocket } from "lucide-react"
import { useTranslations } from "next-intl"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export function Process() {
  const t = useTranslations("process")
  const sectionRef = useRef<HTMLElement>(null)

  const steps = [
    { icon: Phone, step: "01", title: t("step1Title"), description: t("step1Desc"), color: "#06d6e0" },
    { icon: Brain, step: "02", title: t("step2Title"), description: t("step2Desc"), color: "#e84393" },
    { icon: Zap, step: "03", title: t("step3Title"), description: t("step3Desc"), color: "#06d6e0" },
    { icon: Rocket, step: "04", title: t("step4Title"), description: t("step4Desc"), color: "#e84393" },
  ]

  useGSAP(
    () => {
      if (!sectionRef.current) return

      // Animate each step card on scroll
      const stepElements = sectionRef.current.querySelectorAll(".process-step")
      if (stepElements.length > 0) {
        gsap.set(stepElements, { opacity: 0, y: 40 })
        ScrollTrigger.batch(stepElements, {
          onEnter: (batch) => {
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.15,
              ease: "expo.out",
            })
          },
          start: "top 85%",
          once: true,
        })
      }

      // Animate the connecting lines
      const lines = sectionRef.current.querySelectorAll(".process-line")
      if (lines.length > 0) {
        gsap.set(lines, { scaleY: 0, transformOrigin: "top center" })
        ScrollTrigger.batch(lines, {
          onEnter: (batch) => {
            gsap.to(batch, {
              scaleY: 1,
              duration: 0.6,
              stagger: 0.15,
              ease: "power2.out",
              delay: 0.3,
            })
          },
          start: "top 85%",
          once: true,
        })
      }
    },
    { scope: sectionRef }
  )

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-label={t("badge")}
      className="relative py-16 md:py-32 overflow-hidden"
    >
      {/* Subtle dot-grid texture */}
      <div className="absolute inset-0 dot-grid opacity-[0.07] pointer-events-none" aria-hidden="true" />
      {/* Decorative ambient glow behind the timeline — uses inset positioning, not fixed height */}
      <div className="absolute inset-y-0 start-1/2 -translate-x-1/2 w-96 bg-cyan/[0.025] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan/20 bg-cyan/5 mb-6">
            <span className="text-sm font-medium text-cyan">{t("badge")}</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-text mb-3 md:mb-4 text-balance">
            {t("title")} <span className="text-gradient-animated">{t("highlight")}</span>
          </h2>
          <p className="text-base md:text-lg text-text-muted max-w-2xl mx-auto leading-relaxed px-2 md:px-0">
            {t("description")}
          </p>
        </div>

        {/* Steps — vertical timeline layout, mobile-first */}
        <div className="relative max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="process-step relative flex gap-4 md:gap-8 pb-10 md:pb-12 last:pb-0">
              {/* Timeline column */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Step icon circle with gradient background */}
                <div
                  className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 transition-all duration-500"
                  style={{
                    background: `linear-gradient(135deg, ${step.color}25, ${step.color}10)`,
                    border: `2px solid ${step.color}50`,
                    boxShadow: `0 0 25px ${step.color}20, inset 0 1px 0 ${step.color}20`,
                  }}
                >
                  {/* Step number badge — top-start corner */}
                  <span
                    className="absolute -top-2 -start-2 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono font-bold text-bg-deep"
                    style={{ background: step.color, boxShadow: `0 0 10px ${step.color}60` }}
                  >
                    {step.step}
                  </span>
                  <step.icon
                    className="w-6 h-6 md:w-7 md:h-7"
                    style={{ color: step.color, filter: `drop-shadow(0 0 6px ${step.color}60)` }}
                  />
                </div>
                {/* Connecting line — gradient with glow */}
                {index < steps.length - 1 && (
                  <div
                    className="process-line w-[2px] flex-1 mt-3 rounded-full"
                    style={{
                      background: `linear-gradient(to bottom, ${step.color}60, ${steps[index + 1]?.color ?? step.color}30)`, /* rtl-ok: vertical gradient */
                      boxShadow: `0 0 8px ${step.color}20`,
                    }}
                  />
                )}
              </div>

              {/* Content area — subtle hover tint */}
              <div
                className="flex-1 pt-1 pb-4 ps-4 md:ps-6 rounded-xl transition-colors duration-500 group/step"
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = `${step.color}04`
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLElement).style.background = ""
                }}
              >
                {/* Step number — large display */}
                <span
                  className="block text-4xl md:text-5xl font-bold font-mono tracking-tighter tabular-nums leading-none mb-2 transition-all duration-300"
                  style={{ color: step.color, textShadow: `0 0 30px ${step.color}30` }}
                >
                  {step.step}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-text mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
