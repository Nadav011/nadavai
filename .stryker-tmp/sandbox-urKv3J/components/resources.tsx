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
import { ExternalLink, FileCode2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { SectionHeader } from "./section-header";
import { CodeCard } from "./code-card";
gsap.registerPlugin(ScrollTrigger);
const repos = stryMutAct_9fa48("2941") ? [] : (stryCov_9fa48("2941"), [stryMutAct_9fa48("2942") ? {} : (stryCov_9fa48("2942"), {
  title: stryMutAct_9fa48("2943") ? "" : (stryCov_9fa48("2943"), "Singularity Forge"),
  filename: stryMutAct_9fa48("2944") ? "" : (stryCov_9fa48("2944"), "skillbuilder"),
  lang: stryMutAct_9fa48("2945") ? "" : (stryCov_9fa48("2945"), "ts"),
  description: stryMutAct_9fa48("2946") ? "" : (stryCov_9fa48("2946"), "r1Desc"),
  github: stryMutAct_9fa48("2947") ? "" : (stryCov_9fa48("2947"), "https://github.com/Nadav011/skillbuilder"),
  badge: stryMutAct_9fa48("2948") ? "" : (stryCov_9fa48("2948"), "open source"),
  badgeColor: "cyan" as const
}), stryMutAct_9fa48("2949") ? {} : (stryCov_9fa48("2949"), {
  title: stryMutAct_9fa48("2950") ? "" : (stryCov_9fa48("2950"), "VibeCoder"),
  filename: stryMutAct_9fa48("2951") ? "" : (stryCov_9fa48("2951"), "vibecoder"),
  lang: stryMutAct_9fa48("2952") ? "" : (stryCov_9fa48("2952"), "tsx"),
  description: stryMutAct_9fa48("2953") ? "" : (stryCov_9fa48("2953"), "r2Desc"),
  github: stryMutAct_9fa48("2954") ? "" : (stryCov_9fa48("2954"), "https://github.com/Nadav011/vibecoder"),
  badge: stryMutAct_9fa48("2955") ? "" : (stryCov_9fa48("2955"), "open source"),
  badgeColor: "green" as const
}), stryMutAct_9fa48("2956") ? {} : (stryCov_9fa48("2956"), {
  title: stryMutAct_9fa48("2957") ? "" : (stryCov_9fa48("2957"), "80 Claude Code Skills"),
  filename: stryMutAct_9fa48("2958") ? "" : (stryCov_9fa48("2958"), "claude-skills"),
  lang: stryMutAct_9fa48("2959") ? "" : (stryCov_9fa48("2959"), "ts"),
  description: stryMutAct_9fa48("2960") ? "" : (stryCov_9fa48("2960"), "r3Desc"),
  github: stryMutAct_9fa48("2961") ? "" : (stryCov_9fa48("2961"), "https://github.com/Nadav011"),
  badge: stryMutAct_9fa48("2962") ? "" : (stryCov_9fa48("2962"), "ecosystem"),
  badgeColor: "pink" as const
}), stryMutAct_9fa48("2963") ? {} : (stryCov_9fa48("2963"), {
  title: stryMutAct_9fa48("2964") ? "" : (stryCov_9fa48("2964"), "AI Agent System"),
  filename: stryMutAct_9fa48("2965") ? "" : (stryCov_9fa48("2965"), "ai-agent-system"),
  lang: stryMutAct_9fa48("2966") ? "" : (stryCov_9fa48("2966"), "py"),
  description: stryMutAct_9fa48("2967") ? "" : (stryCov_9fa48("2967"), "r4Desc"),
  github: stryMutAct_9fa48("2968") ? "" : (stryCov_9fa48("2968"), "https://github.com/Nadav011"),
  badge: stryMutAct_9fa48("2969") ? "" : (stryCov_9fa48("2969"), "AI/AGI"),
  badgeColor: "pink" as const
}), stryMutAct_9fa48("2970") ? {} : (stryCov_9fa48("2970"), {
  title: stryMutAct_9fa48("2971") ? "" : (stryCov_9fa48("2971"), "APEX Engine"),
  filename: stryMutAct_9fa48("2972") ? "" : (stryCov_9fa48("2972"), "apex-engine"),
  lang: stryMutAct_9fa48("2973") ? "" : (stryCov_9fa48("2973"), "ts"),
  description: stryMutAct_9fa48("2974") ? "" : (stryCov_9fa48("2974"), "r5Desc"),
  github: stryMutAct_9fa48("2975") ? "" : (stryCov_9fa48("2975"), "https://github.com/Nadav011"),
  badge: stryMutAct_9fa48("2976") ? "" : (stryCov_9fa48("2976"), "engine"),
  badgeColor: "yellow" as const
})]);
export function Resources() {
  if (stryMutAct_9fa48("2977")) {
    {}
  } else {
    stryCov_9fa48("2977");
    const t = useTranslations(stryMutAct_9fa48("2978") ? "" : (stryCov_9fa48("2978"), "resources"));
    const sectionRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      if (stryMutAct_9fa48("2979")) {
        {}
      } else {
        stryCov_9fa48("2979");
        ScrollTrigger.batch(stryMutAct_9fa48("2980") ? "" : (stryCov_9fa48("2980"), ".resource-card"), stryMutAct_9fa48("2981") ? {} : (stryCov_9fa48("2981"), {
          onEnter: stryMutAct_9fa48("2982") ? () => undefined : (stryCov_9fa48("2982"), batch => gsap.fromTo(batch, stryMutAct_9fa48("2983") ? {} : (stryCov_9fa48("2983"), {
            opacity: 0,
            y: 30
          }), stryMutAct_9fa48("2984") ? {} : (stryCov_9fa48("2984"), {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: stryMutAct_9fa48("2985") ? "" : (stryCov_9fa48("2985"), "expo.out"),
            stagger: 0.12
          })))
        }));
      }
    }, stryMutAct_9fa48("2986") ? {} : (stryCov_9fa48("2986"), {
      scope: sectionRef
    }));
    return <section ref={sectionRef} id="resources" aria-label={t(stryMutAct_9fa48("2987") ? "" : (stryCov_9fa48("2987"), "title"))} className="relative py-16 md:py-32 bg-[hsl(222,47%,3%)]">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader badge={t(stryMutAct_9fa48("2988") ? "" : (stryCov_9fa48("2988"), "badge"))} title={t(stryMutAct_9fa48("2989") ? "" : (stryCov_9fa48("2989"), "title"))} highlight={t(stryMutAct_9fa48("2990") ? "" : (stryCov_9fa48("2990"), "highlight"))} description={t(stryMutAct_9fa48("2991") ? "" : (stryCov_9fa48("2991"), "description"))} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {repos.map(stryMutAct_9fa48("2992") ? () => undefined : (stryCov_9fa48("2992"), (repo, i) => <div key={i} className="resource-card">
              <CodeCard title={repo.title} filename={repo.filename} lang={repo.lang} badge={repo.badge} badgeColor={repo.badgeColor} icon={<FileCode2 className="w-3.5 h-3.5 text-[#06d6e0]" />}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,45%)] select-none leading-5">02</span>
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{t(repo.description)}</p>
                  </div>

                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,45%)] select-none leading-5">03</span>
                    <div className="flex-1 px-3 py-2 rounded-md bg-[hsl(222,47%,4%)] border border-[hsl(215,28%,14%)] font-mono text-xs">
                      <span className="text-[#e84393]">$</span>{stryMutAct_9fa48("2993") ? "" : (stryCov_9fa48("2993"), " ")}
                      <span className="text-[hsl(215,20%,50%)]">gh repo clone Nadav011/</span>
                      <span className="text-[#06d6e0]">{repo.filename}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end pt-3 border-t border-[hsl(215,28%,14%)]">
                    <a href={repo.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono text-[#06d6e0] hover:text-[#e84393] transition-colors">
                      <ExternalLink className="w-3 h-3" />
                      {stryMutAct_9fa48("2994") ? "" : (stryCov_9fa48("2994"), ">> github")}
                    </a>
                  </div>
                </div>
              </CodeCard>
            </div>))}
        </div>
      </div>
    </section>;
  }
}