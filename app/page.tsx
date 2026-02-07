"use client"

import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { TechMarquee } from "@/components/tech-marquee"
import { Projects } from "@/components/projects"
import { Services } from "@/components/services"
import { Process } from "@/components/process"
import { Testimonials } from "@/components/testimonials"
import { Guides } from "@/components/guides"
import { Resources } from "@/components/resources"
import { News } from "@/components/news"
import { Social } from "@/components/social"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { Particles } from "@/components/particles"
import { CustomCursor } from "@/components/custom-cursor"
import { ScrollProgress } from "@/components/scroll-progress"

export default function Page() {
  return (
    <>
      <ScrollProgress />
      <CustomCursor />
      <Particles />
      <div className="relative z-10">
        <Navbar />
        <main>
          <Hero />
          <TechMarquee />
          <Projects />
          <Services />
          <Process />
          <Testimonials />
          <Guides />
          <Resources />
          <News />
          <Social />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  )
}
