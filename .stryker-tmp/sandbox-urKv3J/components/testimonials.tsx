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
import { Quote, Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "./section-header";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
export function Testimonials() {
  if (stryMutAct_9fa48("3508")) {
    {}
  } else {
    stryCov_9fa48("3508");
    const t = useTranslations(stryMutAct_9fa48("3509") ? "" : (stryCov_9fa48("3509"), "testimonials"));
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const testimonials = stryMutAct_9fa48("3510") ? [] : (stryCov_9fa48("3510"), [stryMutAct_9fa48("3511") ? {} : (stryCov_9fa48("3511"), {
      name: t(stryMutAct_9fa48("3512") ? "" : (stryCov_9fa48("3512"), "t1Name")),
      role: t(stryMutAct_9fa48("3513") ? "" : (stryCov_9fa48("3513"), "t1Role")),
      text: t(stryMutAct_9fa48("3514") ? "" : (stryCov_9fa48("3514"), "t1Text")),
      rating: 5
    }), stryMutAct_9fa48("3515") ? {} : (stryCov_9fa48("3515"), {
      name: t(stryMutAct_9fa48("3516") ? "" : (stryCov_9fa48("3516"), "t2Name")),
      role: t(stryMutAct_9fa48("3517") ? "" : (stryCov_9fa48("3517"), "t2Role")),
      text: t(stryMutAct_9fa48("3518") ? "" : (stryCov_9fa48("3518"), "t2Text")),
      rating: 5
    }), stryMutAct_9fa48("3519") ? {} : (stryCov_9fa48("3519"), {
      name: t(stryMutAct_9fa48("3520") ? "" : (stryCov_9fa48("3520"), "t3Name")),
      role: t(stryMutAct_9fa48("3521") ? "" : (stryCov_9fa48("3521"), "t3Role")),
      text: t(stryMutAct_9fa48("3522") ? "" : (stryCov_9fa48("3522"), "t3Text")),
      rating: 5
    })]);
    useGSAP(() => {
      if (stryMutAct_9fa48("3523")) {
        {}
      } else {
        stryCov_9fa48("3523");
        if (stryMutAct_9fa48("3526") ? false : stryMutAct_9fa48("3525") ? true : stryMutAct_9fa48("3524") ? sectionRef.current : (stryCov_9fa48("3524", "3525", "3526"), !sectionRef.current)) return;

        // Animate section header
        if (stryMutAct_9fa48("3528") ? false : stryMutAct_9fa48("3527") ? true : (stryCov_9fa48("3527", "3528"), headerRef.current)) {
          if (stryMutAct_9fa48("3529")) {
            {}
          } else {
            stryCov_9fa48("3529");
            gsap.fromTo(headerRef.current, stryMutAct_9fa48("3530") ? {} : (stryCov_9fa48("3530"), {
              opacity: 0,
              y: 20
            }), stryMutAct_9fa48("3531") ? {} : (stryCov_9fa48("3531"), {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: stryMutAct_9fa48("3532") ? "" : (stryCov_9fa48("3532"), "expo.out"),
              scrollTrigger: stryMutAct_9fa48("3533") ? {} : (stryCov_9fa48("3533"), {
                trigger: headerRef.current,
                start: stryMutAct_9fa48("3534") ? "" : (stryCov_9fa48("3534"), "top 85%"),
                once: stryMutAct_9fa48("3535") ? false : (stryCov_9fa48("3535"), true)
              })
            }));
          }
        }

        // Animate testimonial cards with batch
        ScrollTrigger.batch(stryMutAct_9fa48("3536") ? "" : (stryCov_9fa48("3536"), ".testimonial-card"), stryMutAct_9fa48("3537") ? {} : (stryCov_9fa48("3537"), {
          onEnter: elements => {
            if (stryMutAct_9fa48("3538")) {
              {}
            } else {
              stryCov_9fa48("3538");
              gsap.fromTo(elements, stryMutAct_9fa48("3539") ? {} : (stryCov_9fa48("3539"), {
                opacity: 0,
                y: 25
              }), stryMutAct_9fa48("3540") ? {} : (stryCov_9fa48("3540"), {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                ease: stryMutAct_9fa48("3541") ? "" : (stryCov_9fa48("3541"), "expo.out"),
                duration: 0.7
              }));
            }
          },
          start: stryMutAct_9fa48("3542") ? "" : (stryCov_9fa48("3542"), "top 85%"),
          once: stryMutAct_9fa48("3543") ? false : (stryCov_9fa48("3543"), true)
        }));
      }
    }, stryMutAct_9fa48("3544") ? {} : (stryCov_9fa48("3544"), {
      scope: sectionRef
    }));
    return <section ref={sectionRef} id="testimonials" aria-label={t(stryMutAct_9fa48("3545") ? "" : (stryCov_9fa48("3545"), "title"))} className="relative py-16 md:py-32 bg-[hsl(222,47%,3%)]">
      <div className="absolute inset-0 grid-bg opacity-15" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <div ref={headerRef}>
          <SectionHeader badge={t(stryMutAct_9fa48("3546") ? "" : (stryCov_9fa48("3546"), "badge"))} title={t(stryMutAct_9fa48("3547") ? "" : (stryCov_9fa48("3547"), "title"))} highlight={t(stryMutAct_9fa48("3548") ? "" : (stryCov_9fa48("3548"), "highlight"))} description={t(stryMutAct_9fa48("3549") ? "" : (stryCov_9fa48("3549"), "description"))} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6">
          {testimonials.map(stryMutAct_9fa48("3550") ? () => undefined : (stryCov_9fa48("3550"), (t, i) => <div key={i} className="testimonial-card group relative h-full p-4 md:p-6 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] hover:border-[#06d6e0]/20 transition-all duration-500">
              {/* Quote icon */}
              <Quote className="w-8 h-8 text-[#06d6e0]/20 mb-4" />

              {/* Stars */}
              <div className="flex items-center gap-1 mb-4">
                {Array.from(stryMutAct_9fa48("3551") ? {} : (stryCov_9fa48("3551"), {
                length: t.rating
              })).map(stryMutAct_9fa48("3552") ? () => undefined : (stryCov_9fa48("3552"), (_, j) => <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />))}
              </div>

              {/* Text */}
              <p className="text-[hsl(215,20%,65%)] text-sm leading-relaxed mb-6">
                {stryMutAct_9fa48("3553") ? "" : (stryCov_9fa48("3553"), '"')}{t.text}{stryMutAct_9fa48("3554") ? "" : (stryCov_9fa48("3554"), '"')}
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-[hsl(215,28%,14%)]">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#06d6e0] to-[#e84393] flex items-center justify-center">
                  <span className="text-sm font-bold text-[hsl(222,47%,4%)]">{stryMutAct_9fa48("3555") ? t.name : (stryCov_9fa48("3555"), t.name.charAt(0))}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[hsl(210,40%,98%)]">{t.name}</div>
                  <div className="text-xs font-mono text-[hsl(215,20%,45%)]">{t.role}</div>
                </div>
              </div>
            </div>))}
        </div>
      </div>
    </section>;
  }
}