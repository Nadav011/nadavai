"use client"

import { MessageSquare, Brain, Code2, Rocket } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"
import { useTranslations } from "next-intl"

export function Process() {
  const t = useTranslations("process")

  const steps = [
    { icon: MessageSquare, step: "01", title: t("step1Title"), description: t("step1Desc"), color: "#06d6e0" },
    { icon: Brain, step: "02", title: t("step2Title"), description: t("step2Desc"), color: "#e84393" },
    { icon: Code2, step: "03", title: t("step3Title"), description: t("step3Desc"), color: "#4f46e5" },
    { icon: Rocket, step: "04", title: t("step4Title"), description: t("step4Desc"), color: "#06d6e0" },
  ]

  return (
    <section id="process" aria-label={t("badge")} className="relative py-24 md:py-32">
      <div className="absolute inset-0 grid-3d pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block absolute top-24 inset-x-[12.5%] h-[1px] bg-gradient-to-l from-[#06d6e0]/30 via-[#e84393]/30 to-[#4f46e5]/30" />

          {steps.map((step, i) => (
            <ScrollReveal key={i} delay={i * 150}>
              <div className="relative text-center group">
                <div className="relative mx-auto mb-6 w-20 h-20 rounded-2xl flex items-center justify-center border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] group-hover:border-opacity-50 transition-all duration-500"
                  style={{ boxShadow: `0 0 0 0 ${step.color}00` }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 0 30px ${step.color}20` }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = `0 0 0 0 ${step.color}00` }}
                >
                  <step.icon className="w-8 h-8" style={{ color: step.color }} />
                  <div
                    className="absolute -top-2 -end-2 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold"
                    style={{ background: step.color, color: "hsl(222,47%,4%)" }}
                  >
                    {step.step}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-[hsl(210,40%,98%)] mb-2">{step.title}</h3>
                <p className="text-sm text-[hsl(215,20%,50%)] leading-relaxed max-w-[200px] mx-auto">{step.description}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
