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
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#06d6e0]/20 bg-[#06d6e0]/5 mb-6">
            <span className="text-sm font-medium text-[#06d6e0]">{t("badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(210,40%,98%)] mb-4 text-balance">
            {t("title")} <span className="text-gradient">{t("highlight")}</span>
          </h2>
          <p className="text-lg text-[hsl(215,20%,50%)] max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Steps - vertical timeline layout, mobile-first */}
        <div className="relative max-w-2xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="process-step relative flex gap-4 md:gap-8 pb-10 md:pb-12 last:pb-0">
              {/* Timeline column */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Step number circle */}
                <div
                  className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border-2 transition-all duration-500 flex-shrink-0"
                  style={{
                    borderColor: step.color,
                    backgroundColor: "hsl(222,47%,5%)",
                    boxShadow: `0 0 20px ${step.color}20`,
                  }}
                >
                  <step.icon className="w-6 h-6 md:w-7 md:h-7" style={{ color: step.color }} />
                </div>
                {/* Connecting line */}
                {index < steps.length - 1 && (
                  <div
                    className="process-line w-[2px] flex-1 mt-3"
                    style={{
                      background: `linear-gradient(to bottom, ${step.color}40, ${steps[index + 1].color}40)`,
                    }}
                  />
                )}
              </div>

              {/* Content column */}
              <div className="flex-1 pt-1 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className="text-3xl md:text-4xl font-bold font-mono tracking-tighter"
                    style={{ color: step.color }}
                  >
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[hsl(210,40%,98%)] mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-[hsl(215,20%,50%)] leading-relaxed">
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
