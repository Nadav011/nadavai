"use client"

import { useEffect } from "react"
import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { SmoothScroll } from "@/components/smooth-scroll"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

// Lazy load below-the-fold sections (code splitting)
const TechMarquee = dynamic(() => import("@/components/tech-marquee").then(mod => ({ default: mod.TechMarquee })), { ssr: true })
const Projects = dynamic(() => import("@/components/projects").then(mod => ({ default: mod.Projects })), { ssr: true })
const Services = dynamic(() => import("@/components/services").then(mod => ({ default: mod.Services })), { ssr: true })
const Process = dynamic(() => import("@/components/process").then(mod => ({ default: mod.Process })), { ssr: true })
const Testimonials = dynamic(() => import("@/components/testimonials").then(mod => ({ default: mod.Testimonials })), { ssr: true })
const Blog = dynamic(() => import("@/components/blog").then(mod => ({ default: mod.Blog })), { ssr: true })
const YouTube = dynamic(() => import("@/components/youtube").then(mod => ({ default: mod.YouTube })), { ssr: true })
const Guides = dynamic(() => import("@/components/guides").then(mod => ({ default: mod.Guides })), { ssr: true })
const Resources = dynamic(() => import("@/components/resources").then(mod => ({ default: mod.Resources })), { ssr: true })
const News = dynamic(() => import("@/components/news").then(mod => ({ default: mod.News })), { ssr: true })
const Social = dynamic(() => import("@/components/social").then(mod => ({ default: mod.Social })), { ssr: true })
const Contact = dynamic(() => import("@/components/contact").then(mod => ({ default: mod.Contact })), { ssr: true })

// Lazy load non-critical client components (no SSR needed)
const Particles = dynamic(() => import("@/components/particles").then(mod => ({ default: mod.Particles })), { ssr: false })
const CustomCursor = dynamic(() => import("@/components/custom-cursor").then(mod => ({ default: mod.CustomCursor })), { ssr: false })
const WhatsAppButton = dynamic(() => import("@/components/whatsapp-button").then(mod => ({ default: mod.WhatsAppButton })), { ssr: false })
const EasterEgg = dynamic(() => import("@/components/easter-egg").then(mod => ({ default: mod.EasterEgg })), { ssr: false })

// Register GSAP plugins (consolidated)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

export default function Page() {
  // Handle prefers-reduced-motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    
    if (mq.matches) {
      // Make all GSAP animations essentially instant
      gsap.globalTimeline.timeScale(20)
      gsap.defaults({ duration: 0 })
    }

    // Listen for changes in motion preference
    const handleChange = (e: MediaQueryListEvent) => {
      if (e.matches) {
        gsap.globalTimeline.timeScale(20)
        gsap.defaults({ duration: 0 })
      } else {
        gsap.globalTimeline.timeScale(1)
        gsap.defaults({ duration: 1 })
      }
    }

    mq.addEventListener("change", handleChange)
    return () => mq.removeEventListener("change", handleChange)
  }, [])

  return (
    <SmoothScroll>
      <ScrollProgress />
      <CustomCursor />
      <Particles />
      <WhatsAppButton />
      <EasterEgg />
      <div className="relative z-10">
        <Navbar />
        <main id="main-content">
          <Hero />
          <div className="section-divider-animated" />
          <TechMarquee />
          <div className="section-divider-animated" />
          <div className="section-glow-cyan">
            <Projects />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-pink">
            <Services />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-indigo">
            <Process />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-cyan">
            <Testimonials />
          </div>
          <div className="section-divider-animated" />
          <Blog />
          <div className="section-divider-animated" />
          <div className="section-glow-pink">
            <YouTube />
          </div>
          <div className="section-divider-animated" />
          <Guides />
          <div className="section-divider-animated" />
          <div className="section-glow-indigo">
            <Resources />
          </div>
          <div className="section-divider-animated" />
          <News />
          <div className="section-divider-animated" />
          <div className="section-glow-cyan">
            <Social />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-pink">
            <Contact />
          </div>
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
