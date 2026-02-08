import dynamic from "next/dynamic"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { Footer } from "@/components/footer"
import { ScrollProgress } from "@/components/scroll-progress"
import { SmoothScroll } from "@/components/smooth-scroll"
import { GSAPSetup } from "@/components/gsap-setup"
import { NonCritical } from "@/components/non-critical"

// Lazy load below-the-fold sections (code splitting)
const TechMarquee = dynamic(() => import("@/components/tech-marquee").then(mod => ({ default: mod.TechMarquee })))
const Projects = dynamic(() => import("@/components/projects").then(mod => ({ default: mod.Projects })))
const Services = dynamic(() => import("@/components/services").then(mod => ({ default: mod.Services })))
const Process = dynamic(() => import("@/components/process").then(mod => ({ default: mod.Process })))
const Testimonials = dynamic(() => import("@/components/testimonials").then(mod => ({ default: mod.Testimonials })))
const Blog = dynamic(() => import("@/components/blog").then(mod => ({ default: mod.Blog })))
const YouTube = dynamic(() => import("@/components/youtube").then(mod => ({ default: mod.YouTube })))
const Guides = dynamic(() => import("@/components/guides").then(mod => ({ default: mod.Guides })))
const Resources = dynamic(() => import("@/components/resources").then(mod => ({ default: mod.Resources })))
const News = dynamic(() => import("@/components/news").then(mod => ({ default: mod.News })))
const Social = dynamic(() => import("@/components/social").then(mod => ({ default: mod.Social })))
const Contact = dynamic(() => import("@/components/contact").then(mod => ({ default: mod.Contact })))

export default function Page() {
  return (
    <SmoothScroll>
      <GSAPSetup />
      <ScrollProgress />
      <NonCritical />
      <Navbar />
      <div className="relative z-10">
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
