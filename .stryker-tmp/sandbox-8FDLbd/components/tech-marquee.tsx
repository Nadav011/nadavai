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
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
const row1Items = stryMutAct_9fa48("3449") ? [] : (stryCov_9fa48("3449"), [stryMutAct_9fa48("3450") ? "" : (stryCov_9fa48("3450"), "Claude Code"), stryMutAct_9fa48("3451") ? "" : (stryCov_9fa48("3451"), "GPT-4o"), stryMutAct_9fa48("3452") ? "" : (stryCov_9fa48("3452"), "Codex"), stryMutAct_9fa48("3453") ? "" : (stryCov_9fa48("3453"), "Cursor"), stryMutAct_9fa48("3454") ? "" : (stryCov_9fa48("3454"), "v0.dev"), stryMutAct_9fa48("3455") ? "" : (stryCov_9fa48("3455"), "Gemini Pro"), stryMutAct_9fa48("3456") ? "" : (stryCov_9fa48("3456"), "DeepSeek V3"), stryMutAct_9fa48("3457") ? "" : (stryCov_9fa48("3457"), "Qwen 2.5"), stryMutAct_9fa48("3458") ? "" : (stryCov_9fa48("3458"), "Mistral"), stryMutAct_9fa48("3459") ? "" : (stryCov_9fa48("3459"), "Llama 3"), stryMutAct_9fa48("3460") ? "" : (stryCov_9fa48("3460"), "Copilot"), stryMutAct_9fa48("3461") ? "" : (stryCov_9fa48("3461"), "Perplexity"), stryMutAct_9fa48("3462") ? "" : (stryCov_9fa48("3462"), "Grok"), stryMutAct_9fa48("3463") ? "" : (stryCov_9fa48("3463"), "Midjourney"), stryMutAct_9fa48("3464") ? "" : (stryCov_9fa48("3464"), "Stable Diffusion"), stryMutAct_9fa48("3465") ? "" : (stryCov_9fa48("3465"), "DALL-E 3"), stryMutAct_9fa48("3466") ? "" : (stryCov_9fa48("3466"), "Claude Opus"), stryMutAct_9fa48("3467") ? "" : (stryCov_9fa48("3467"), "GPT-5")]);
const row2Items = stryMutAct_9fa48("3468") ? [] : (stryCov_9fa48("3468"), [stryMutAct_9fa48("3469") ? "" : (stryCov_9fa48("3469"), "Next.js"), stryMutAct_9fa48("3470") ? "" : (stryCov_9fa48("3470"), "React"), stryMutAct_9fa48("3471") ? "" : (stryCov_9fa48("3471"), "TypeScript"), stryMutAct_9fa48("3472") ? "" : (stryCov_9fa48("3472"), "Supabase"), stryMutAct_9fa48("3473") ? "" : (stryCov_9fa48("3473"), "Tailwind"), stryMutAct_9fa48("3474") ? "" : (stryCov_9fa48("3474"), "Vercel"), stryMutAct_9fa48("3475") ? "" : (stryCov_9fa48("3475"), "Node.js"), stryMutAct_9fa48("3476") ? "" : (stryCov_9fa48("3476"), "Flutter"), stryMutAct_9fa48("3477") ? "" : (stryCov_9fa48("3477"), "Dart"), stryMutAct_9fa48("3478") ? "" : (stryCov_9fa48("3478"), "Firebase"), stryMutAct_9fa48("3479") ? "" : (stryCov_9fa48("3479"), "React Native"), stryMutAct_9fa48("3480") ? "" : (stryCov_9fa48("3480"), "Expo"), stryMutAct_9fa48("3481") ? "" : (stryCov_9fa48("3481"), "AI SDK"), stryMutAct_9fa48("3482") ? "" : (stryCov_9fa48("3482"), "Python"), stryMutAct_9fa48("3483") ? "" : (stryCov_9fa48("3483"), "CrewAI"), stryMutAct_9fa48("3484") ? "" : (stryCov_9fa48("3484"), "Docker"), stryMutAct_9fa48("3485") ? "" : (stryCov_9fa48("3485"), "Ollama"), stryMutAct_9fa48("3486") ? "" : (stryCov_9fa48("3486"), "ChromaDB"), stryMutAct_9fa48("3487") ? "" : (stryCov_9fa48("3487"), "Bun"), stryMutAct_9fa48("3488") ? "" : (stryCov_9fa48("3488"), "Prisma")]);

// Quadruple items to guarantee no gaps on any screen size
const row1Quad = stryMutAct_9fa48("3489") ? [] : (stryCov_9fa48("3489"), [...row1Items, ...row1Items, ...row1Items, ...row1Items]);
const row2Quad = stryMutAct_9fa48("3490") ? [] : (stryCov_9fa48("3490"), [...row2Items, ...row2Items, ...row2Items, ...row2Items]);
export function TechMarquee() {
  if (stryMutAct_9fa48("3491")) {
    {}
  } else {
    stryCov_9fa48("3491");
    const sectionRef = useRef<HTMLElement>(null);
    useGSAP(() => {
      if (stryMutAct_9fa48("3492")) {
        {}
      } else {
        stryCov_9fa48("3492");
        if (stryMutAct_9fa48("3495") ? false : stryMutAct_9fa48("3494") ? true : stryMutAct_9fa48("3493") ? sectionRef.current : (stryCov_9fa48("3493", "3494", "3495"), !sectionRef.current)) return;
        gsap.fromTo(sectionRef.current, stryMutAct_9fa48("3496") ? {} : (stryCov_9fa48("3496"), {
          opacity: 0,
          y: 15
        }), stryMutAct_9fa48("3497") ? {} : (stryCov_9fa48("3497"), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: stryMutAct_9fa48("3498") ? "" : (stryCov_9fa48("3498"), "power2.out"),
          scrollTrigger: stryMutAct_9fa48("3499") ? {} : (stryCov_9fa48("3499"), {
            trigger: sectionRef.current,
            start: stryMutAct_9fa48("3500") ? "" : (stryCov_9fa48("3500"), "top 85%"),
            toggleActions: stryMutAct_9fa48("3501") ? "" : (stryCov_9fa48("3501"), "play none none none")
          })
        }));
      }
    }, stryMutAct_9fa48("3502") ? ["Stryker was here"] : (stryCov_9fa48("3502"), []));
    return <section ref={sectionRef} className="relative py-8 md:py-12 border-y border-[hsl(215,28%,16%)] overflow-hidden bg-[hsl(222,47%,4%)]">
      {/* Fade edges */}
      <div className="absolute start-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-l from-transparent to-[hsl(222,47%,4%)]" />
      <div className="absolute end-0 top-0 bottom-0 w-16 md:w-32 z-10 bg-gradient-to-r from-transparent to-[hsl(222,47%,4%)]" />

      <div className="flex flex-col gap-4 md:gap-6">
        {/* Row 1 */}
        <div className="flex animate-marquee whitespace-nowrap">
          {row1Quad.map(stryMutAct_9fa48("3503") ? () => undefined : (stryCov_9fa48("3503"), (tech, i) => <div key={stryMutAct_9fa48("3504") ? `` : (stryCov_9fa48("3504"), `r1-${i}`)} className="flex items-center gap-4 md:gap-8 mx-4 md:mx-8">
              <span className="tech-item text-xs md:text-sm font-mono text-[hsl(215,20%,45%)] hover:text-[#06d6e0] transition-all duration-300 cursor-default">
                {tech}
              </span>
              <span className="w-1 h-1 rounded-full bg-[hsl(215,28%,25%)] flex-shrink-0" />
            </div>))}
        </div>

        {/* Row 2 - reverse */}
        <div className="flex animate-marquee-reverse whitespace-nowrap">
          {row2Quad.map(stryMutAct_9fa48("3505") ? () => undefined : (stryCov_9fa48("3505"), (tech, i) => <div key={stryMutAct_9fa48("3506") ? `` : (stryCov_9fa48("3506"), `r2-${i}`)} className="flex items-center gap-4 md:gap-8 mx-4 md:mx-8">
              <span className="tech-item text-xs md:text-sm font-mono text-[hsl(215,20%,45%)] hover:text-[#06d6e0] transition-all duration-300 cursor-default">
                {tech}
              </span>
              <span className="w-1 h-1 rounded-full bg-[hsl(215,28%,25%)] flex-shrink-0" />
            </div>))}
        </div>
      </div>

      <style jsx>{stryMutAct_9fa48("3507") ? `` : (stryCov_9fa48("3507"), `
        .tech-item:hover {
          text-shadow: 0 0 20px hsl(187 92% 55% / 0.6), 0 0 30px hsl(187 92% 55% / 0.4);
        }
      `)}</style>
    </section>;
  }
}