"use client"

import { useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { TechMarquee } from "@/components/tech-marquee"
import { Projects } from "@/components/projects"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { Testimonials } from "@/components/testimonials"
import { Blog } from "@/components/blog"
import { YouTube } from "@/components/youtube"
import { Guides } from "@/components/guides"
import { Resources } from "@/components/resources"
import { News } from "@/components/news"
import { Social } from "@/components/social"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Particles } from "@/components/particles"
import { CustomCursor } from "@/components/custom-cursor"
import { ScrollProgress } from "@/components/scroll-progress"
import { WhatsAppButton } from "@/components/whatsapp-button"
import { SmoothScroll } from "@/components/smooth-scroll"
import { EasterEgg } from "@/components/easter-egg"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"

// Register GSAP plugins
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
