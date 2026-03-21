// @ts-nocheck
"use client";

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
import { useRef } from "react";
import { Flame, Calendar, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "./section-header";
import { CodeCard } from "./code-card";
gsap.registerPlugin(ScrollTrigger);
const news = stryMutAct_9fa48("2546") ? [] : (stryCov_9fa48("2546"), [stryMutAct_9fa48("2547") ? {} : (stryCov_9fa48("2547"), {
  title: stryMutAct_9fa48("2548") ? "" : (stryCov_9fa48("2548"), "n1Title"),
  filename: stryMutAct_9fa48("2549") ? "" : (stryCov_9fa48("2549"), "skills-milestone"),
  lang: stryMutAct_9fa48("2550") ? "" : (stryCov_9fa48("2550"), "ts"),
  date: stryMutAct_9fa48("2551") ? "" : (stryCov_9fa48("2551"), "2026-02"),
  description: stryMutAct_9fa48("2552") ? "" : (stryCov_9fa48("2552"), "n1Desc"),
  trending: stryMutAct_9fa48("2553") ? false : (stryCov_9fa48("2553"), true),
  badge: stryMutAct_9fa48("2554") ? "" : (stryCov_9fa48("2554"), "milestone"),
  badgeColor: "pink" as const
}), stryMutAct_9fa48("2555") ? {} : (stryCov_9fa48("2555"), {
  title: stryMutAct_9fa48("2556") ? "" : (stryCov_9fa48("2556"), "n2Title"),
  filename: stryMutAct_9fa48("2557") ? "" : (stryCov_9fa48("2557"), "apex-engine"),
  lang: stryMutAct_9fa48("2558") ? "" : (stryCov_9fa48("2558"), "ts"),
  date: stryMutAct_9fa48("2559") ? "" : (stryCov_9fa48("2559"), "2026-01"),
  description: stryMutAct_9fa48("2560") ? "" : (stryCov_9fa48("2560"), "n2Desc"),
  trending: stryMutAct_9fa48("2561") ? false : (stryCov_9fa48("2561"), true),
  badge: stryMutAct_9fa48("2562") ? "" : (stryCov_9fa48("2562"), "engine"),
  badgeColor: "pink" as const
}), stryMutAct_9fa48("2563") ? {} : (stryCov_9fa48("2563"), {
  title: stryMutAct_9fa48("2564") ? "" : (stryCov_9fa48("2564"), "n3Title"),
  filename: stryMutAct_9fa48("2565") ? "" : (stryCov_9fa48("2565"), "singularity-forge"),
  lang: stryMutAct_9fa48("2566") ? "" : (stryCov_9fa48("2566"), "ts"),
  date: stryMutAct_9fa48("2567") ? "" : (stryCov_9fa48("2567"), "2026-01"),
  description: stryMutAct_9fa48("2568") ? "" : (stryCov_9fa48("2568"), "n3Desc"),
  trending: stryMutAct_9fa48("2569") ? true : (stryCov_9fa48("2569"), false),
  badge: stryMutAct_9fa48("2570") ? "" : (stryCov_9fa48("2570"), "open source"),
  badgeColor: "cyan" as const
})]);
export function News() {
  if (stryMutAct_9fa48("2571")) {
    {}
  } else {
    stryCov_9fa48("2571");
    const t = useTranslations(stryMutAct_9fa48("2572") ? "" : (stryCov_9fa48("2572"), "news"));
    const sectionRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      if (stryMutAct_9fa48("2573")) {
        {}
      } else {
        stryCov_9fa48("2573");
        ScrollTrigger.batch(stryMutAct_9fa48("2574") ? "" : (stryCov_9fa48("2574"), ".news-card"), stryMutAct_9fa48("2575") ? {} : (stryCov_9fa48("2575"), {
          onEnter: stryMutAct_9fa48("2576") ? () => undefined : (stryCov_9fa48("2576"), batch => gsap.fromTo(batch, stryMutAct_9fa48("2577") ? {} : (stryCov_9fa48("2577"), {
            opacity: 0,
            y: 30
          }), stryMutAct_9fa48("2578") ? {} : (stryCov_9fa48("2578"), {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: stryMutAct_9fa48("2579") ? "" : (stryCov_9fa48("2579"), "expo.out"),
            stagger: 0.12
          })))
        }));
      }
    }, stryMutAct_9fa48("2580") ? {} : (stryCov_9fa48("2580"), {
      scope: sectionRef
    }));
    return <section ref={sectionRef} id="news" aria-label={t(stryMutAct_9fa48("2581") ? "" : (stryCov_9fa48("2581"), "title"))} className="relative py-16 md:py-32">
      <div className="absolute inset-0 dot-grid-subtle opacity-[0.12] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader badge={t(stryMutAct_9fa48("2582") ? "" : (stryCov_9fa48("2582"), "badge"))} title={t(stryMutAct_9fa48("2583") ? "" : (stryCov_9fa48("2583"), "title"))} highlight={t(stryMutAct_9fa48("2584") ? "" : (stryCov_9fa48("2584"), "highlight"))} description={t(stryMutAct_9fa48("2585") ? "" : (stryCov_9fa48("2585"), "description"))} />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {news.map(stryMutAct_9fa48("2586") ? () => undefined : (stryCov_9fa48("2586"), (item, i) => <div key={i} className="news-card">
              <CodeCard title={t(item.title)} filename={item.filename} lang={item.lang} badge={item.badge} badgeColor={item.badgeColor} icon={item.trending ? <Flame className="w-3.5 h-3.5 text-[#e84393]" /> : undefined}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,45%)] select-none leading-5">02</span>
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{t(item.description)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,14%)]">
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                      <Calendar className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono">{item.date}</span>
                    </div>
                    <button aria-label={t(item.title)} className="inline-flex items-center gap-1.5 text-xs font-mono text-[#06d6e0] hover:text-[#e84393] transition-colors group/btn">
                      {stryMutAct_9fa48("2587") ? "" : (stryCov_9fa48("2587"), ">> read")}
                      <ArrowLeft className="w-3 h-3 group-hover/btn:-translate-x-0.5 transition-transform rtl:rotate-180" />
                    </button>
                  </div>
                </div>
              </CodeCard>
            </div>))}
        </div>
      </div>
    </section>;
  }
}