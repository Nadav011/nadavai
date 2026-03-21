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
import { Phone, Brain, Zap, Rocket } from "lucide-react";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
export function Process() {
  if (stryMutAct_9fa48("2619")) {
    {}
  } else {
    stryCov_9fa48("2619");
    const t = useTranslations(stryMutAct_9fa48("2620") ? "" : (stryCov_9fa48("2620"), "process"));
    const sectionRef = useRef<HTMLElement>(null);
    const steps = stryMutAct_9fa48("2621") ? [] : (stryCov_9fa48("2621"), [stryMutAct_9fa48("2622") ? {} : (stryCov_9fa48("2622"), {
      icon: Phone,
      step: stryMutAct_9fa48("2623") ? "" : (stryCov_9fa48("2623"), "01"),
      title: t(stryMutAct_9fa48("2624") ? "" : (stryCov_9fa48("2624"), "step1Title")),
      description: t(stryMutAct_9fa48("2625") ? "" : (stryCov_9fa48("2625"), "step1Desc")),
      color: stryMutAct_9fa48("2626") ? "" : (stryCov_9fa48("2626"), "#06d6e0")
    }), stryMutAct_9fa48("2627") ? {} : (stryCov_9fa48("2627"), {
      icon: Brain,
      step: stryMutAct_9fa48("2628") ? "" : (stryCov_9fa48("2628"), "02"),
      title: t(stryMutAct_9fa48("2629") ? "" : (stryCov_9fa48("2629"), "step2Title")),
      description: t(stryMutAct_9fa48("2630") ? "" : (stryCov_9fa48("2630"), "step2Desc")),
      color: stryMutAct_9fa48("2631") ? "" : (stryCov_9fa48("2631"), "#e84393")
    }), stryMutAct_9fa48("2632") ? {} : (stryCov_9fa48("2632"), {
      icon: Zap,
      step: stryMutAct_9fa48("2633") ? "" : (stryCov_9fa48("2633"), "03"),
      title: t(stryMutAct_9fa48("2634") ? "" : (stryCov_9fa48("2634"), "step3Title")),
      description: t(stryMutAct_9fa48("2635") ? "" : (stryCov_9fa48("2635"), "step3Desc")),
      color: stryMutAct_9fa48("2636") ? "" : (stryCov_9fa48("2636"), "#06d6e0")
    }), stryMutAct_9fa48("2637") ? {} : (stryCov_9fa48("2637"), {
      icon: Rocket,
      step: stryMutAct_9fa48("2638") ? "" : (stryCov_9fa48("2638"), "04"),
      title: t(stryMutAct_9fa48("2639") ? "" : (stryCov_9fa48("2639"), "step4Title")),
      description: t(stryMutAct_9fa48("2640") ? "" : (stryCov_9fa48("2640"), "step4Desc")),
      color: stryMutAct_9fa48("2641") ? "" : (stryCov_9fa48("2641"), "#e84393")
    })]);
    useGSAP(() => {
      if (stryMutAct_9fa48("2642")) {
        {}
      } else {
        stryCov_9fa48("2642");
        if (stryMutAct_9fa48("2645") ? false : stryMutAct_9fa48("2644") ? true : stryMutAct_9fa48("2643") ? sectionRef.current : (stryCov_9fa48("2643", "2644", "2645"), !sectionRef.current)) return;

        // Animate each step card on scroll
        const stepElements = sectionRef.current.querySelectorAll(stryMutAct_9fa48("2646") ? "" : (stryCov_9fa48("2646"), ".process-step"));
        if (stryMutAct_9fa48("2650") ? stepElements.length <= 0 : stryMutAct_9fa48("2649") ? stepElements.length >= 0 : stryMutAct_9fa48("2648") ? false : stryMutAct_9fa48("2647") ? true : (stryCov_9fa48("2647", "2648", "2649", "2650"), stepElements.length > 0)) {
          if (stryMutAct_9fa48("2651")) {
            {}
          } else {
            stryCov_9fa48("2651");
            gsap.set(stepElements, stryMutAct_9fa48("2652") ? {} : (stryCov_9fa48("2652"), {
              opacity: 0,
              y: 40
            }));
            ScrollTrigger.batch(stepElements, stryMutAct_9fa48("2653") ? {} : (stryCov_9fa48("2653"), {
              onEnter: batch => {
                if (stryMutAct_9fa48("2654")) {
                  {}
                } else {
                  stryCov_9fa48("2654");
                  gsap.to(batch, stryMutAct_9fa48("2655") ? {} : (stryCov_9fa48("2655"), {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.15,
                    ease: stryMutAct_9fa48("2656") ? "" : (stryCov_9fa48("2656"), "expo.out")
                  }));
                }
              },
              start: stryMutAct_9fa48("2657") ? "" : (stryCov_9fa48("2657"), "top 85%"),
              once: stryMutAct_9fa48("2658") ? false : (stryCov_9fa48("2658"), true)
            }));
          }
        }

        // Animate the connecting lines
        const lines = sectionRef.current.querySelectorAll(stryMutAct_9fa48("2659") ? "" : (stryCov_9fa48("2659"), ".process-line"));
        if (stryMutAct_9fa48("2663") ? lines.length <= 0 : stryMutAct_9fa48("2662") ? lines.length >= 0 : stryMutAct_9fa48("2661") ? false : stryMutAct_9fa48("2660") ? true : (stryCov_9fa48("2660", "2661", "2662", "2663"), lines.length > 0)) {
          if (stryMutAct_9fa48("2664")) {
            {}
          } else {
            stryCov_9fa48("2664");
            gsap.set(lines, stryMutAct_9fa48("2665") ? {} : (stryCov_9fa48("2665"), {
              scaleY: 0,
              transformOrigin: stryMutAct_9fa48("2666") ? "" : (stryCov_9fa48("2666"), "top center")
            }));
            ScrollTrigger.batch(lines, stryMutAct_9fa48("2667") ? {} : (stryCov_9fa48("2667"), {
              onEnter: batch => {
                if (stryMutAct_9fa48("2668")) {
                  {}
                } else {
                  stryCov_9fa48("2668");
                  gsap.to(batch, stryMutAct_9fa48("2669") ? {} : (stryCov_9fa48("2669"), {
                    scaleY: 1,
                    duration: 0.6,
                    stagger: 0.15,
                    ease: stryMutAct_9fa48("2670") ? "" : (stryCov_9fa48("2670"), "power2.out"),
                    delay: 0.3
                  }));
                }
              },
              start: stryMutAct_9fa48("2671") ? "" : (stryCov_9fa48("2671"), "top 85%"),
              once: stryMutAct_9fa48("2672") ? false : (stryCov_9fa48("2672"), true)
            }));
          }
        }
      }
    }, stryMutAct_9fa48("2673") ? {} : (stryCov_9fa48("2673"), {
      scope: sectionRef
    }));
    return <section id="process" ref={sectionRef} aria-label={t(stryMutAct_9fa48("2674") ? "" : (stryCov_9fa48("2674"), "badge"))} className="relative py-16 md:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-10 md:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#06d6e0]/20 bg-[#06d6e0]/5 mb-6">
            <span className="text-sm font-medium text-[#06d6e0]">{t(stryMutAct_9fa48("2675") ? "" : (stryCov_9fa48("2675"), "badge"))}</span>
          </div>
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold text-[hsl(210,40%,98%)] mb-3 md:mb-4 text-balance">
            {t(stryMutAct_9fa48("2676") ? "" : (stryCov_9fa48("2676"), "title"))} <span className="text-gradient">{t(stryMutAct_9fa48("2677") ? "" : (stryCov_9fa48("2677"), "highlight"))}</span>
          </h2>
          <p className="text-base md:text-lg text-[hsl(215,20%,50%)] max-w-2xl mx-auto leading-relaxed px-2 md:px-0">
            {t(stryMutAct_9fa48("2678") ? "" : (stryCov_9fa48("2678"), "description"))}
          </p>
        </div>

        {/* Steps - vertical timeline layout, mobile-first */}
        <div className="relative max-w-2xl mx-auto">
          {steps.map(stryMutAct_9fa48("2679") ? () => undefined : (stryCov_9fa48("2679"), (step, index) => <div key={index} className="process-step relative flex gap-4 md:gap-8 pb-10 md:pb-12 last:pb-0">
              {/* Timeline column */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Step number circle */}
                <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl flex items-center justify-center border-2 transition-all duration-500 flex-shrink-0" style={stryMutAct_9fa48("2680") ? {} : (stryCov_9fa48("2680"), {
                borderColor: step.color,
                backgroundColor: stryMutAct_9fa48("2681") ? "" : (stryCov_9fa48("2681"), "hsl(222,47%,5%)"),
                boxShadow: stryMutAct_9fa48("2682") ? `` : (stryCov_9fa48("2682"), `0 0 20px ${step.color}20`)
              })}>
                  <step.icon className="w-6 h-6 md:w-7 md:h-7" style={stryMutAct_9fa48("2683") ? {} : (stryCov_9fa48("2683"), {
                  color: step.color
                })} />
                </div>
                {/* Connecting line */}
                {stryMutAct_9fa48("2686") ? index < steps.length - 1 || <div className="process-line w-[2px] flex-1 mt-3" style={{
                background: `linear-gradient(to bottom, ${step.color}40, ${steps[index + 1].color}40)`
              }} /> : stryMutAct_9fa48("2685") ? false : stryMutAct_9fa48("2684") ? true : (stryCov_9fa48("2684", "2685", "2686"), (stryMutAct_9fa48("2689") ? index >= steps.length - 1 : stryMutAct_9fa48("2688") ? index <= steps.length - 1 : stryMutAct_9fa48("2687") ? true : (stryCov_9fa48("2687", "2688", "2689"), index < (stryMutAct_9fa48("2690") ? steps.length + 1 : (stryCov_9fa48("2690"), steps.length - 1)))) && <div className="process-line w-[2px] flex-1 mt-3" style={stryMutAct_9fa48("2691") ? {} : (stryCov_9fa48("2691"), {
                background: stryMutAct_9fa48("2692") ? `` : (stryCov_9fa48("2692"), `linear-gradient(to bottom, ${step.color}40, ${steps[stryMutAct_9fa48("2693") ? index - 1 : (stryCov_9fa48("2693"), index + 1)].color}40)`)
              })} />)}
              </div>

              {/* Content column */}
              <div className="flex-1 pt-1 pb-4">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl md:text-4xl font-bold font-mono tracking-tighter" style={stryMutAct_9fa48("2694") ? {} : (stryCov_9fa48("2694"), {
                  color: step.color
                })}>
                    {step.step}
                  </span>
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-[hsl(210,40%,98%)] mb-3">
                  {step.title}
                </h3>
                <p className="text-base text-[hsl(215,20%,50%)] leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>))}
        </div>
      </div>
    </section>;
  }
}