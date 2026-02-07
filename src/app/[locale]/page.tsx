import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CommandPalette } from "@/components/layout/command-palette";
import { JsonLd } from "@/components/layout/json-ld";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { Hero } from "@/components/sections/hero";
import { CompaniesMarquee } from "@/components/sections/companies-marquee";
import { Projects } from "@/components/sections/projects";
import { Services } from "@/components/sections/services";
import { Blog } from "@/components/sections/blog";
import { Guides } from "@/components/sections/guides";
import { Resources } from "@/components/sections/resources";
import { YouTube } from "@/components/sections/youtube";
import { News } from "@/components/sections/news";
import { Testimonials } from "@/components/sections/testimonials";
import { Contact } from "@/components/sections/contact";

export default function HomePage() {
  return (
    <>
      <JsonLd />
      <Navbar />
      <CommandPalette />
      <main>
        <Hero />
        <CompaniesMarquee />
        <Projects />
        <Blog />
        <Guides />
        <Resources />
        <Services />
        <YouTube />
        <News />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
    </>
  );
}
