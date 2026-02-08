"use client"

import { useRef, useEffect, useState } from "react"
import { Phone, Brain, Zap, Rocket } from "lucide-react"
import { useTranslations } from "next-intl"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useGSAP } from "@gsap/react"

gsap.registerPlugin(ScrollTrigger)

export function Process() {
  const t = useTranslations("process")
  const sectionRef = useRef<HTMLElement>(null)
  const stepsContainerRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  const steps = [
    { icon: Phone, step: "01", title: t("step1Title"), description: t("step1Desc") },
    { icon: Brain, step: "02", title: t("step2Title"), description: t("step2Desc") },
    { icon: Zap, step: "03", title: t("step3Title"), description: t("step3Desc") },
    { icon: Rocket, step: "04", title: t("step4Title"), description: t("step4Desc") },
  ]

  // Detect mobile/desktop
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Desktop pinned scroll animation
  useGSAP(
    () => {
      if (isMobile || !sectionRef.current || !stepsContainerRef.current) return

      const stepElements = stepsContainerRef.current.querySelectorAll(".process-step")
      const progressDots = stepsContainerRef.current.querySelectorAll(".progress-dot")

      // Create timeline with ScrollTrigger
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=2500",
          pin: true,
          scrub: 1,
          anticipatePin: 1,
        },
      })

      // Animate each step
      stepElements.forEach((step, index) => {
        if (index === 0) {
          // First step starts visible
          gsap.set(step, { opacity: 1, scale: 1, y: 0 })
        } else {
          // Others start hidden
          gsap.set(step, { opacity: 0, scale: 0.8, y: 50 })
        }

        // Fade out previous step and fade in current step
        if (index > 0) {
          tl.to(
            stepElements[index - 1],
            {
              opacity: 0,
              scale: 0.8,
              y: -50,
              duration: 1,
            },
            index
          )
          tl.to(
            step,
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 1,
            },
            index
          )
        }

        // Update progress dots
        tl.call(
          () => {
            progressDots.forEach((dot, dotIndex) => {
              if (dotIndex === index) {
                dot.classList.add("active")
              } else {
                dot.classList.remove("active")
              }
            })
          },
          [],
          index + 0.5
        )
      })

      // Keep last step visible
      tl.to(stepElements[stepElements.length - 1], { opacity: 1, scale: 1, duration: 0.5 })
    },
    { dependencies: [isMobile], scope: sectionRef }
  )

  // Mobile simple fade-in animations
  useGSAP(
    () => {
      if (!isMobile || !stepsContainerRef.current) return

      const stepElements = stepsContainerRef.current.querySelectorAll(".process-step")

      stepElements.forEach((step, index) => {
        gsap.from(step, {
          opacity: 0,
          y: 50,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: step,
            start: "top 80%",
            end: "top 50%",
            toggleActions: "play none none reverse",
          },
        })
      })
    },
    { dependencies: [isMobile], scope: sectionRef }
  )

  return (
    <section
      id="process"
      ref={sectionRef}
      aria-label={t("badge")}
      className="relative py-24 md:py-32 overflow-hidden"
    >
      <div className="absolute inset-0 grid-3d pointer-events-none" aria-hidden="true" />

      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#06d6e0]/20 bg-[#06d6e0]/5 mb-6">
            <span className="text-sm font-medium text-[#06d6e0]">{t("badge")}</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[hsl(210,40%,98%)] mb-4">
            {t("title")} <span className="text-gradient-cyan-pink">{t("highlight")}</span>
          </h2>
          <p className="text-lg text-[hsl(215,20%,50%)] max-w-2xl mx-auto leading-relaxed">
            {t("description")}
          </p>
        </div>

        {/* Steps Container */}
        <div
          ref={stepsContainerRef}
          className={`relative ${isMobile ? "space-y-8" : "min-h-[600px]"}`}
        >
          {/* Progress Dots (Desktop Only) */}
          {!isMobile && (
            <div className="absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-3 z-20 pointer-events-none">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className="progress-dot w-2 h-2 rounded-full bg-[hsl(215,28%,16%)] transition-all duration-300"
                  style={{
                    backgroundColor: index === 0 ? "#06d6e0" : "hsl(215,28%,16%)",
                  }}
                />
              ))}
            </div>
          )}

          {/* Steps */}
          {steps.map((step, index) => (
            <div
              key={index}
              className={`process-step ${
                isMobile
                  ? "relative"
                  : "absolute top-1/2 start-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg"
              }`}
            >
              <div
                className="glass-card p-8 rounded-3xl border transition-all duration-500 group"
                style={{
                  borderColor: "hsl(215,28%,16%)",
                }}
              >
                {/* Step Number Badge */}
                <div className="flex items-center gap-4 mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center border-2 transition-all duration-500"
                    style={{
                      borderColor: "#06d6e0",
                      backgroundColor: "hsl(222,47%,5%)",
                      boxShadow: "0 0 30px rgba(6, 214, 224, 0.2)",
                    }}
                  >
                    <step.icon className="w-8 h-8 text-[#06d6e0]" />
                  </div>
                  <div
                    className="text-5xl font-bold font-mono tracking-tighter"
                    style={{ color: "#06d6e0" }}
                  >
                    {step.step}
                  </div>
                </div>

                {/* Step Content */}
                <h3 className="text-2xl md:text-3xl font-bold text-[hsl(210,40%,98%)] mb-4">
                  {step.title}
                </h3>
                <p className="text-base md:text-lg text-[hsl(215,20%,50%)] leading-relaxed">
                  {step.description}
                </p>

                {/* Decorative Gradient */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#06d6e0]/5 via-transparent to-[#e84393]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .glass-card {
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.03) 0%,
            rgba(255, 255, 255, 0.01) 100%
          );
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }

        .text-gradient-cyan-pink {
          background: linear-gradient(135deg, #06d6e0 0%, #e84393 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .progress-dot.active {
          background-color: #06d6e0 !important;
          box-shadow: 0 0 12px rgba(6, 214, 224, 0.6);
          width: 0.75rem;
          height: 0.75rem;
        }

        @media (min-width: 769px) {
          .process-step {
            will-change: opacity, transform;
          }
        }
      `}</style>
    </section>
  )
}
