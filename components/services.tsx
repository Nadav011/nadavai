"use client"

import React, { useState } from "react"
import {
  Code2, Bot, Palette, Rocket, GraduationCap, Wrench,
  Check, ArrowLeft, Crown, Sparkles, Clock, Users, Shield, Zap
} from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"
import { Magnetic } from "./magnetic"
import { useTranslations } from "next-intl"

export function Services() {
  const t = useTranslations("services")
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  const services = [
    {
      icon: Code2,
      title: t("s1Title"),
      subtitle: t("s1Subtitle"),
      description: t("s1Description"),
      features: [t("s1f1"), t("s1f2"), t("s1f3"), t("s1f4"), t("s1f5"), t("s1f6")],
      popular: false,
      color: "#06d6e0",
      gradient: "from-[#06d6e0] to-[#0abfca]",
    },
    {
      icon: Bot,
      title: t("s2Title"),
      subtitle: t("s2Subtitle"),
      description: t("s2Description"),
      features: [t("s2f1"), t("s2f2"), t("s2f3"), t("s2f4"), t("s2f5"), t("s2f6")],
      popular: true,
      color: "#e84393",
      gradient: "from-[#e84393] to-[#d63384]",
    },
    {
      icon: Rocket,
      title: t("s3Title"),
      subtitle: t("s3Subtitle"),
      description: t("s3Description"),
      features: [t("s3f1"), t("s3f2"), t("s3f3"), t("s3f4"), t("s3f5"), t("s3f6")],
      popular: false,
      color: "#4f46e5",
      gradient: "from-[#4f46e5] to-[#6366f1]",
    },
  ]

  const additionalServices = [
    { icon: Palette, title: t("addTitle1"), description: t("addDesc1") },
    { icon: GraduationCap, title: t("addTitle2"), description: t("addDesc2") },
    { icon: Wrench, title: t("addTitle3"), description: t("addDesc3") },
  ]

  const trustSignals = [
    { icon: Clock, text: t("trust1") },
    { icon: Users, text: t("trust2") },
    { icon: Shield, text: t("trust3") },
  ]

  return (
    <section id="services" aria-label={t("badge")} className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(222,47%,3%)]" />
      <div className="absolute w-[1000px] h-[600px] bg-[#e84393]/4 rounded-full blur-[150px]" style={{ top: 0, left: "50%", transform: "translateX(-50%)" }} />
      <div className="absolute bottom-0 end-0 w-[600px] h-[400px] bg-[#06d6e0]/3 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 mb-16">
            {trustSignals.map((signal, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[hsl(215,20%,50%)]">
                <signal.icon className="w-4 h-4 text-[#06d6e0]" />
                <span className="text-sm font-mono">{signal.text}</span>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, i) => (
            <ScrollReveal key={i} delay={i * 120} direction={i === 1 ? "up" : i === 0 ? "right" : "left"}>
              <div
                className="relative h-full"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {service.popular && (
                  <div className="absolute -top-3 z-20" style={{ left: "50%", transform: "translateX(-50%)" }}>
                    <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-l ${service.gradient} text-[11px] font-bold text-[hsl(222,47%,4%)] tracking-wide uppercase shadow-[0_0_30px_hsl(330,85%,60%,0.3)]`}>
                      <Crown className="w-3.5 h-3.5" />
                      {t("popular")}
                    </div>
                  </div>
                )}

                <div
                  className={`relative h-full rounded-2xl p-[1px] transition-all duration-700 ${
                    service.popular
                      ? `bg-gradient-to-b ${service.gradient} shadow-[0_0_40px_hsl(330,85%,60%,0.15)]`
                      : hoveredIdx === i
                        ? "bg-gradient-to-b from-[hsl(215,28%,25%)] to-[hsl(215,28%,16%)]"
                        : "bg-[hsl(215,28%,16%)]"
                  }`}
                >
                  <div className={`relative h-full rounded-[15px] p-7 ${
                    service.popular ? "bg-[hsl(222,47%,4%)]" : "bg-[hsl(222,47%,5%)]"
                  }`}>
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500"
                        style={{
                          background: `linear-gradient(135deg, ${service.color}15, ${service.color}05)`,
                          border: `1px solid ${service.color}25`,
                          boxShadow: hoveredIdx === i ? `0 0 25px ${service.color}15` : "none",
                        }}
                      >
                        <service.icon className="w-7 h-7" style={{ color: service.color }} />
                      </div>
                      {service.popular && (
                        <Sparkles className="w-5 h-5 text-[#e84393] animate-pulse" />
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-[hsl(210,40%,98%)] mb-1">{service.title}</h3>
                    <span className="text-xs font-mono tracking-wider uppercase mb-4 block" style={{ color: service.color }}>
                      {service.subtitle}
                    </span>

                    <p className="text-sm text-[hsl(215,20%,55%)] leading-relaxed mb-6">{service.description}</p>

                    <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[hsl(215,28%,20%)] to-transparent mb-6" />

                    <div className="space-y-3 mb-8">
                      {service.features.map((f) => (
                        <div key={f} className="flex items-center gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: `${service.color}15` }}>
                            <Check className="w-3 h-3" style={{ color: service.color }} />
                          </div>
                          <span className="text-sm text-[hsl(215,20%,60%)]">{f}</span>
                        </div>
                      ))}
                    </div>

                    <Magnetic strength={0.15}>
                      <a
                        href="#contact"
                        className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-500 ${
                          service.popular
                            ? `bg-gradient-to-l ${service.gradient} text-[hsl(222,47%,4%)] hover:shadow-[0_0_35px_${service.color}40]`
                            : "border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] text-[hsl(210,40%,98%)] hover:border-opacity-60"
                        }`}
                        style={!service.popular ? { ["--hover-border" as string]: service.color } : {}}
                        onMouseEnter={(e) => { if (!service.popular) e.currentTarget.style.borderColor = `${service.color}60` }}
                        onMouseLeave={(e) => { if (!service.popular) e.currentTarget.style.borderColor = "" }}
                      >
                        {service.popular ? (
                          <>
                            <Zap className="w-4 h-4" />
                            {t("ctaPopular")}
                          </>
                        ) : (
                          <>
                            {t("ctaDefault")}
                            <ArrowLeft className="w-4 h-4" />
                          </>
                        )}
                      </a>
                    </Magnetic>

                    {service.popular && (
                      <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[11px] font-mono text-amber-400/80">{t("urgency")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={200} direction="left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {additionalServices.map((service, i) => (
              <a
                key={i}
                href="#contact"
                className="group flex items-center gap-4 p-5 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] hover:border-[#06d6e0]/20 hover:bg-[hsl(222,47%,6%)] transition-all duration-500"
              >
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[hsl(215,28%,12%)] border border-[hsl(215,28%,18%)] group-hover:border-[#06d6e0]/20 transition-colors">
                  <service.icon className="w-5 h-5 text-[hsl(215,20%,55%)] group-hover:text-[#06d6e0] transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-0.5">{service.title}</h4>
                  <p className="text-xs text-[hsl(215,20%,45%)]">{service.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-[hsl(215,20%,35%)] group-hover:text-[#06d6e0] me-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
              </a>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
