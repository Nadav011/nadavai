"use client"

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

export default function Page() {
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
          <div className="section-divider" />
          <TechMarquee />
          <div className="section-divider" />
          <Projects />
          <div className="section-divider" />
          <Services />
          <div className="section-divider" />
          <Process />
          <div className="section-divider" />
          <Testimonials />
          <div className="section-divider" />
          <Blog />
          <div className="section-divider" />
          <YouTube />
          <div className="section-divider" />
          <Guides />
          <div className="section-divider" />
          <Resources />
          <div className="section-divider" />
          <News />
          <div className="section-divider" />
          <Social />
          <div className="section-divider" />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
