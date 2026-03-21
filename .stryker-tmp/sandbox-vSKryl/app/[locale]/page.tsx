// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import dynamic from "next/dynamic";
import { Navbar } from "@/components/navbar";
import { Hero } from "@/components/hero";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { SmoothScroll } from "@/components/smooth-scroll";
import { GSAPSetup } from "@/components/gsap-setup";
import { NonCritical } from "@/components/non-critical";

// Lazy load below-the-fold sections (code splitting)
const TechMarquee = dynamic(stryMutAct_9fa48("403") ? () => undefined : (stryCov_9fa48("403"), () => import("@/components/tech-marquee").then(stryMutAct_9fa48("404") ? () => undefined : (stryCov_9fa48("404"), mod => stryMutAct_9fa48("405") ? {} : (stryCov_9fa48("405"), {
  default: mod.TechMarquee
})))));
const Projects = dynamic(stryMutAct_9fa48("406") ? () => undefined : (stryCov_9fa48("406"), () => import("@/components/projects").then(stryMutAct_9fa48("407") ? () => undefined : (stryCov_9fa48("407"), mod => stryMutAct_9fa48("408") ? {} : (stryCov_9fa48("408"), {
  default: mod.Projects
})))));
const Services = dynamic(stryMutAct_9fa48("409") ? () => undefined : (stryCov_9fa48("409"), () => import("@/components/services").then(stryMutAct_9fa48("410") ? () => undefined : (stryCov_9fa48("410"), mod => stryMutAct_9fa48("411") ? {} : (stryCov_9fa48("411"), {
  default: mod.Services
})))));
const Process = dynamic(stryMutAct_9fa48("412") ? () => undefined : (stryCov_9fa48("412"), () => import("@/components/process").then(stryMutAct_9fa48("413") ? () => undefined : (stryCov_9fa48("413"), mod => stryMutAct_9fa48("414") ? {} : (stryCov_9fa48("414"), {
  default: mod.Process
})))));
const Testimonials = dynamic(stryMutAct_9fa48("415") ? () => undefined : (stryCov_9fa48("415"), () => import("@/components/testimonials").then(stryMutAct_9fa48("416") ? () => undefined : (stryCov_9fa48("416"), mod => stryMutAct_9fa48("417") ? {} : (stryCov_9fa48("417"), {
  default: mod.Testimonials
})))));
const Blog = dynamic(stryMutAct_9fa48("418") ? () => undefined : (stryCov_9fa48("418"), () => import("@/components/blog").then(stryMutAct_9fa48("419") ? () => undefined : (stryCov_9fa48("419"), mod => stryMutAct_9fa48("420") ? {} : (stryCov_9fa48("420"), {
  default: mod.Blog
})))));
const YouTube = dynamic(stryMutAct_9fa48("421") ? () => undefined : (stryCov_9fa48("421"), () => import("@/components/youtube").then(stryMutAct_9fa48("422") ? () => undefined : (stryCov_9fa48("422"), mod => stryMutAct_9fa48("423") ? {} : (stryCov_9fa48("423"), {
  default: mod.YouTube
})))));
const Guides = dynamic(stryMutAct_9fa48("424") ? () => undefined : (stryCov_9fa48("424"), () => import("@/components/guides").then(stryMutAct_9fa48("425") ? () => undefined : (stryCov_9fa48("425"), mod => stryMutAct_9fa48("426") ? {} : (stryCov_9fa48("426"), {
  default: mod.Guides
})))));
const Resources = dynamic(stryMutAct_9fa48("427") ? () => undefined : (stryCov_9fa48("427"), () => import("@/components/resources").then(stryMutAct_9fa48("428") ? () => undefined : (stryCov_9fa48("428"), mod => stryMutAct_9fa48("429") ? {} : (stryCov_9fa48("429"), {
  default: mod.Resources
})))));
const News = dynamic(stryMutAct_9fa48("430") ? () => undefined : (stryCov_9fa48("430"), () => import("@/components/news").then(stryMutAct_9fa48("431") ? () => undefined : (stryCov_9fa48("431"), mod => stryMutAct_9fa48("432") ? {} : (stryCov_9fa48("432"), {
  default: mod.News
})))));
const Social = dynamic(stryMutAct_9fa48("433") ? () => undefined : (stryCov_9fa48("433"), () => import("@/components/social").then(stryMutAct_9fa48("434") ? () => undefined : (stryCov_9fa48("434"), mod => stryMutAct_9fa48("435") ? {} : (stryCov_9fa48("435"), {
  default: mod.Social
})))));
const Contact = dynamic(stryMutAct_9fa48("436") ? () => undefined : (stryCov_9fa48("436"), () => import("@/components/contact").then(stryMutAct_9fa48("437") ? () => undefined : (stryCov_9fa48("437"), mod => stryMutAct_9fa48("438") ? {} : (stryCov_9fa48("438"), {
  default: mod.Contact
})))));
export default function Page() {
  if (stryMutAct_9fa48("439")) {
    {}
  } else {
    stryCov_9fa48("439");
    return <SmoothScroll>
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
          <div className="section-glow-cyan section-glow-top">
            <Projects />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-cyan section-glow-bottom">
            <Services />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-top">
            <Process />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-cyan">
            <Testimonials />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-top">
            <Blog />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-cyan section-glow-bottom">
            <YouTube />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-top">
            <Guides />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-cyan">
            <Resources />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-top">
            <News />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-cyan section-glow-bottom">
            <Social />
          </div>
          <div className="section-divider-animated" />
          <div className="section-glow-cyan section-glow-top">
            <Contact />
          </div>
        </main>
        <Footer />
      </div>
    </SmoothScroll>;
  }
}