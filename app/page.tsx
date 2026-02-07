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
          <TechMarquee />
          <Projects />
          <Services />
          <Process />
          <Testimonials />
          <Blog />
          <YouTube />
          <Guides />
          <Resources />
          <News />
          <Social />
          <Contact />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  )
}
