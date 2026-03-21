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
import { useState, useRef } from "react";
import { Code2, Bot, Palette, Rocket, GraduationCap, Wrench, Check, ArrowLeft, Crown, Sparkles, Clock, Users, Shield, Zap } from "lucide-react";
import { ScrollReveal } from "./scroll-reveal";
import { SectionHeader } from "./section-header";
import { Magnetic } from "./magnetic";
import { useTranslations } from "next-intl";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
export function Services() {
  if (stryMutAct_9fa48("3025")) {
    {}
  } else {
    stryCov_9fa48("3025");
    const t = useTranslations(stryMutAct_9fa48("3026") ? "" : (stryCov_9fa48("3026"), "services"));
    const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    useGSAP(() => {
      if (stryMutAct_9fa48("3027")) {
        {}
      } else {
        stryCov_9fa48("3027");
        if (stryMutAct_9fa48("3030") ? false : stryMutAct_9fa48("3029") ? true : stryMutAct_9fa48("3028") ? sectionRef.current : (stryCov_9fa48("3028", "3029", "3030"), !sectionRef.current)) return;

        // Animate trust indicators with stagger
        const trustIndicators = sectionRef.current.querySelectorAll(stryMutAct_9fa48("3031") ? "" : (stryCov_9fa48("3031"), ".trust-indicator"));
        if (stryMutAct_9fa48("3035") ? trustIndicators.length <= 0 : stryMutAct_9fa48("3034") ? trustIndicators.length >= 0 : stryMutAct_9fa48("3033") ? false : stryMutAct_9fa48("3032") ? true : (stryCov_9fa48("3032", "3033", "3034", "3035"), trustIndicators.length > 0)) {
          if (stryMutAct_9fa48("3036")) {
            {}
          } else {
            stryCov_9fa48("3036");
            gsap.set(trustIndicators, stryMutAct_9fa48("3037") ? {} : (stryCov_9fa48("3037"), {
              opacity: 0,
              y: 20
            }));
            gsap.to(trustIndicators, stryMutAct_9fa48("3038") ? {} : (stryCov_9fa48("3038"), {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.15,
              ease: stryMutAct_9fa48("3039") ? "" : (stryCov_9fa48("3039"), "power3.out"),
              scrollTrigger: stryMutAct_9fa48("3040") ? {} : (stryCov_9fa48("3040"), {
                trigger: trustIndicators[0],
                start: stryMutAct_9fa48("3041") ? "" : (stryCov_9fa48("3041"), "top 85%"),
                once: stryMutAct_9fa48("3042") ? false : (stryCov_9fa48("3042"), true)
              })
            }));
          }
        }

        // Animate service cards with batch
        const serviceCards = sectionRef.current.querySelectorAll(stryMutAct_9fa48("3043") ? "" : (stryCov_9fa48("3043"), ".service-card"));
        if (stryMutAct_9fa48("3047") ? serviceCards.length <= 0 : stryMutAct_9fa48("3046") ? serviceCards.length >= 0 : stryMutAct_9fa48("3045") ? false : stryMutAct_9fa48("3044") ? true : (stryCov_9fa48("3044", "3045", "3046", "3047"), serviceCards.length > 0)) {
          if (stryMutAct_9fa48("3048")) {
            {}
          } else {
            stryCov_9fa48("3048");
            gsap.set(serviceCards, stryMutAct_9fa48("3049") ? {} : (stryCov_9fa48("3049"), {
              opacity: 0,
              y: 40
            }));
            ScrollTrigger.batch(serviceCards, stryMutAct_9fa48("3050") ? {} : (stryCov_9fa48("3050"), {
              onEnter: batch => {
                if (stryMutAct_9fa48("3051")) {
                  {}
                } else {
                  stryCov_9fa48("3051");
                  gsap.to(batch, stryMutAct_9fa48("3052") ? {} : (stryCov_9fa48("3052"), {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.15,
                    ease: stryMutAct_9fa48("3053") ? "" : (stryCov_9fa48("3053"), "expo.out")
                  }));
                }
              },
              start: stryMutAct_9fa48("3054") ? "" : (stryCov_9fa48("3054"), "top 80%"),
              once: stryMutAct_9fa48("3055") ? false : (stryCov_9fa48("3055"), true)
            }));
          }
        }

        // Animate feature lists inside cards
        const featureLists = sectionRef.current.querySelectorAll(stryMutAct_9fa48("3056") ? "" : (stryCov_9fa48("3056"), ".service-feature"));
        if (stryMutAct_9fa48("3060") ? featureLists.length <= 0 : stryMutAct_9fa48("3059") ? featureLists.length >= 0 : stryMutAct_9fa48("3058") ? false : stryMutAct_9fa48("3057") ? true : (stryCov_9fa48("3057", "3058", "3059", "3060"), featureLists.length > 0)) {
          if (stryMutAct_9fa48("3061")) {
            {}
          } else {
            stryCov_9fa48("3061");
            gsap.set(featureLists, stryMutAct_9fa48("3062") ? {} : (stryCov_9fa48("3062"), {
              opacity: 0,
              x: stryMutAct_9fa48("3063") ? +10 : (stryCov_9fa48("3063"), -10)
            }));
            ScrollTrigger.batch(featureLists, stryMutAct_9fa48("3064") ? {} : (stryCov_9fa48("3064"), {
              onEnter: batch => {
                if (stryMutAct_9fa48("3065")) {
                  {}
                } else {
                  stryCov_9fa48("3065");
                  gsap.to(batch, stryMutAct_9fa48("3066") ? {} : (stryCov_9fa48("3066"), {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.08,
                    ease: stryMutAct_9fa48("3067") ? "" : (stryCov_9fa48("3067"), "power2.out")
                  }));
                }
              },
              start: stryMutAct_9fa48("3068") ? "" : (stryCov_9fa48("3068"), "top 75%"),
              once: stryMutAct_9fa48("3069") ? false : (stryCov_9fa48("3069"), true)
            }));
          }
        }

        // Animate additional services
        const additionalServices = sectionRef.current.querySelectorAll(stryMutAct_9fa48("3070") ? "" : (stryCov_9fa48("3070"), ".additional-service"));
        if (stryMutAct_9fa48("3074") ? additionalServices.length <= 0 : stryMutAct_9fa48("3073") ? additionalServices.length >= 0 : stryMutAct_9fa48("3072") ? false : stryMutAct_9fa48("3071") ? true : (stryCov_9fa48("3071", "3072", "3073", "3074"), additionalServices.length > 0)) {
          if (stryMutAct_9fa48("3075")) {
            {}
          } else {
            stryCov_9fa48("3075");
            gsap.set(additionalServices, stryMutAct_9fa48("3076") ? {} : (stryCov_9fa48("3076"), {
              opacity: 0,
              y: 20
            }));
            ScrollTrigger.batch(additionalServices, stryMutAct_9fa48("3077") ? {} : (stryCov_9fa48("3077"), {
              onEnter: batch => {
                if (stryMutAct_9fa48("3078")) {
                  {}
                } else {
                  stryCov_9fa48("3078");
                  gsap.to(batch, stryMutAct_9fa48("3079") ? {} : (stryCov_9fa48("3079"), {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.1,
                    ease: stryMutAct_9fa48("3080") ? "" : (stryCov_9fa48("3080"), "power3.out")
                  }));
                }
              },
              start: stryMutAct_9fa48("3081") ? "" : (stryCov_9fa48("3081"), "top 85%"),
              once: stryMutAct_9fa48("3082") ? false : (stryCov_9fa48("3082"), true)
            }));
          }
        }
      }
    }, stryMutAct_9fa48("3083") ? {} : (stryCov_9fa48("3083"), {
      scope: sectionRef
    }));
    const services = stryMutAct_9fa48("3084") ? [] : (stryCov_9fa48("3084"), [stryMutAct_9fa48("3085") ? {} : (stryCov_9fa48("3085"), {
      icon: Code2,
      title: t(stryMutAct_9fa48("3086") ? "" : (stryCov_9fa48("3086"), "s1Title")),
      subtitle: t(stryMutAct_9fa48("3087") ? "" : (stryCov_9fa48("3087"), "s1Subtitle")),
      description: t(stryMutAct_9fa48("3088") ? "" : (stryCov_9fa48("3088"), "s1Description")),
      features: stryMutAct_9fa48("3089") ? [] : (stryCov_9fa48("3089"), [t(stryMutAct_9fa48("3090") ? "" : (stryCov_9fa48("3090"), "s1f1")), t(stryMutAct_9fa48("3091") ? "" : (stryCov_9fa48("3091"), "s1f2")), t(stryMutAct_9fa48("3092") ? "" : (stryCov_9fa48("3092"), "s1f3")), t(stryMutAct_9fa48("3093") ? "" : (stryCov_9fa48("3093"), "s1f4")), t(stryMutAct_9fa48("3094") ? "" : (stryCov_9fa48("3094"), "s1f5")), t(stryMutAct_9fa48("3095") ? "" : (stryCov_9fa48("3095"), "s1f6"))]),
      popular: stryMutAct_9fa48("3096") ? true : (stryCov_9fa48("3096"), false),
      color: stryMutAct_9fa48("3097") ? "" : (stryCov_9fa48("3097"), "#06d6e0"),
      gradient: stryMutAct_9fa48("3098") ? "" : (stryCov_9fa48("3098"), "from-[#06d6e0] to-[#0abfca]")
    }), stryMutAct_9fa48("3099") ? {} : (stryCov_9fa48("3099"), {
      icon: Bot,
      title: t(stryMutAct_9fa48("3100") ? "" : (stryCov_9fa48("3100"), "s2Title")),
      subtitle: t(stryMutAct_9fa48("3101") ? "" : (stryCov_9fa48("3101"), "s2Subtitle")),
      description: t(stryMutAct_9fa48("3102") ? "" : (stryCov_9fa48("3102"), "s2Description")),
      features: stryMutAct_9fa48("3103") ? [] : (stryCov_9fa48("3103"), [t(stryMutAct_9fa48("3104") ? "" : (stryCov_9fa48("3104"), "s2f1")), t(stryMutAct_9fa48("3105") ? "" : (stryCov_9fa48("3105"), "s2f2")), t(stryMutAct_9fa48("3106") ? "" : (stryCov_9fa48("3106"), "s2f3")), t(stryMutAct_9fa48("3107") ? "" : (stryCov_9fa48("3107"), "s2f4")), t(stryMutAct_9fa48("3108") ? "" : (stryCov_9fa48("3108"), "s2f5")), t(stryMutAct_9fa48("3109") ? "" : (stryCov_9fa48("3109"), "s2f6"))]),
      popular: stryMutAct_9fa48("3110") ? false : (stryCov_9fa48("3110"), true),
      color: stryMutAct_9fa48("3111") ? "" : (stryCov_9fa48("3111"), "#e84393"),
      gradient: stryMutAct_9fa48("3112") ? "" : (stryCov_9fa48("3112"), "from-[#e84393] to-[#d63384]")
    }), stryMutAct_9fa48("3113") ? {} : (stryCov_9fa48("3113"), {
      icon: Rocket,
      title: t(stryMutAct_9fa48("3114") ? "" : (stryCov_9fa48("3114"), "s3Title")),
      subtitle: t(stryMutAct_9fa48("3115") ? "" : (stryCov_9fa48("3115"), "s3Subtitle")),
      description: t(stryMutAct_9fa48("3116") ? "" : (stryCov_9fa48("3116"), "s3Description")),
      features: stryMutAct_9fa48("3117") ? [] : (stryCov_9fa48("3117"), [t(stryMutAct_9fa48("3118") ? "" : (stryCov_9fa48("3118"), "s3f1")), t(stryMutAct_9fa48("3119") ? "" : (stryCov_9fa48("3119"), "s3f2")), t(stryMutAct_9fa48("3120") ? "" : (stryCov_9fa48("3120"), "s3f3")), t(stryMutAct_9fa48("3121") ? "" : (stryCov_9fa48("3121"), "s3f4")), t(stryMutAct_9fa48("3122") ? "" : (stryCov_9fa48("3122"), "s3f5")), t(stryMutAct_9fa48("3123") ? "" : (stryCov_9fa48("3123"), "s3f6"))]),
      popular: stryMutAct_9fa48("3124") ? true : (stryCov_9fa48("3124"), false),
      color: stryMutAct_9fa48("3125") ? "" : (stryCov_9fa48("3125"), "#4f46e5"),
      gradient: stryMutAct_9fa48("3126") ? "" : (stryCov_9fa48("3126"), "from-[#4f46e5] to-[#6366f1]")
    })]);
    const additionalServices = stryMutAct_9fa48("3127") ? [] : (stryCov_9fa48("3127"), [stryMutAct_9fa48("3128") ? {} : (stryCov_9fa48("3128"), {
      icon: Palette,
      title: t(stryMutAct_9fa48("3129") ? "" : (stryCov_9fa48("3129"), "addTitle1")),
      description: t(stryMutAct_9fa48("3130") ? "" : (stryCov_9fa48("3130"), "addDesc1"))
    }), stryMutAct_9fa48("3131") ? {} : (stryCov_9fa48("3131"), {
      icon: GraduationCap,
      title: t(stryMutAct_9fa48("3132") ? "" : (stryCov_9fa48("3132"), "addTitle2")),
      description: t(stryMutAct_9fa48("3133") ? "" : (stryCov_9fa48("3133"), "addDesc2"))
    }), stryMutAct_9fa48("3134") ? {} : (stryCov_9fa48("3134"), {
      icon: Wrench,
      title: t(stryMutAct_9fa48("3135") ? "" : (stryCov_9fa48("3135"), "addTitle3")),
      description: t(stryMutAct_9fa48("3136") ? "" : (stryCov_9fa48("3136"), "addDesc3"))
    })]);
    const trustSignals = stryMutAct_9fa48("3137") ? [] : (stryCov_9fa48("3137"), [stryMutAct_9fa48("3138") ? {} : (stryCov_9fa48("3138"), {
      icon: Clock,
      text: t(stryMutAct_9fa48("3139") ? "" : (stryCov_9fa48("3139"), "trust1"))
    }), stryMutAct_9fa48("3140") ? {} : (stryCov_9fa48("3140"), {
      icon: Users,
      text: t(stryMutAct_9fa48("3141") ? "" : (stryCov_9fa48("3141"), "trust2"))
    }), stryMutAct_9fa48("3142") ? {} : (stryCov_9fa48("3142"), {
      icon: Shield,
      text: t(stryMutAct_9fa48("3143") ? "" : (stryCov_9fa48("3143"), "trust3"))
    })]);
    return <section ref={sectionRef} id="services" aria-label={t(stryMutAct_9fa48("3144") ? "" : (stryCov_9fa48("3144"), "badge"))} className="relative py-16 md:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(222,47%,3%)]" />
      <div className="absolute w-[1000px] h-[600px] bg-[#06d6e0]/3 rounded-full blur-[150px]" style={stryMutAct_9fa48("3145") ? {} : (stryCov_9fa48("3145"), {
        top: 0,
        left: stryMutAct_9fa48("3146") ? "" : (stryCov_9fa48("3146"), "50%"),
        transform: stryMutAct_9fa48("3147") ? "" : (stryCov_9fa48("3147"), "translateX(-50%)")
      })} />
      <div className="absolute bottom-0 end-0 w-[600px] h-[400px] bg-[#06d6e0]/3 rounded-full blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader badge={t(stryMutAct_9fa48("3148") ? "" : (stryCov_9fa48("3148"), "badge"))} title={t(stryMutAct_9fa48("3149") ? "" : (stryCov_9fa48("3149"), "title"))} highlight={t(stryMutAct_9fa48("3150") ? "" : (stryCov_9fa48("3150"), "highlight"))} description={t(stryMutAct_9fa48("3151") ? "" : (stryCov_9fa48("3151"), "description"))} />

        <ScrollReveal>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-10 mb-10 md:mb-16">
            {trustSignals.map(stryMutAct_9fa48("3152") ? () => undefined : (stryCov_9fa48("3152"), (signal, i) => <div key={i} className="trust-indicator flex items-center gap-2.5 text-[hsl(215,20%,50%)]">
                <signal.icon className="w-4 h-4 text-[#06d6e0]" />
                <span className="text-sm font-mono">{signal.text}</span>
              </div>))}
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-16">
          {services.map(stryMutAct_9fa48("3153") ? () => undefined : (stryCov_9fa48("3153"), (service, i) => <ScrollReveal key={i} delay={stryMutAct_9fa48("3154") ? i / 120 : (stryCov_9fa48("3154"), i * 120)} direction={(stryMutAct_9fa48("3157") ? i !== 1 : stryMutAct_9fa48("3156") ? false : stryMutAct_9fa48("3155") ? true : (stryCov_9fa48("3155", "3156", "3157"), i === 1)) ? stryMutAct_9fa48("3158") ? "" : (stryCov_9fa48("3158"), "up") : (stryMutAct_9fa48("3161") ? i !== 0 : stryMutAct_9fa48("3160") ? false : stryMutAct_9fa48("3159") ? true : (stryCov_9fa48("3159", "3160", "3161"), i === 0)) ? stryMutAct_9fa48("3162") ? "" : (stryCov_9fa48("3162"), "right") : stryMutAct_9fa48("3163") ? "" : (stryCov_9fa48("3163"), "left")}>
              <div className="service-card relative h-full" onMouseEnter={stryMutAct_9fa48("3164") ? () => undefined : (stryCov_9fa48("3164"), () => setHoveredIdx(i))} onMouseLeave={stryMutAct_9fa48("3165") ? () => undefined : (stryCov_9fa48("3165"), () => setHoveredIdx(null))}>
                {stryMutAct_9fa48("3168") ? service.popular || <div className="absolute -top-3 z-20" style={{
                left: "50%",
                transform: "translateX(-50%)"
              }}>
                    <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-l ${service.gradient} text-[11px] font-bold text-[hsl(222,47%,4%)] tracking-wide uppercase shadow-[0_0_30px_hsl(330,85%,60%,0.3)]`}>
                      <Crown className="w-3.5 h-3.5" />
                      {t("popular")}
                    </div>
                  </div> : stryMutAct_9fa48("3167") ? false : stryMutAct_9fa48("3166") ? true : (stryCov_9fa48("3166", "3167", "3168"), service.popular && <div className="absolute -top-3 z-20" style={stryMutAct_9fa48("3169") ? {} : (stryCov_9fa48("3169"), {
                left: stryMutAct_9fa48("3170") ? "" : (stryCov_9fa48("3170"), "50%"),
                transform: stryMutAct_9fa48("3171") ? "" : (stryCov_9fa48("3171"), "translateX(-50%)")
              })}>
                    <div className={stryMutAct_9fa48("3172") ? `` : (stryCov_9fa48("3172"), `flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-l ${service.gradient} text-[11px] font-bold text-[hsl(222,47%,4%)] tracking-wide uppercase shadow-[0_0_30px_hsl(330,85%,60%,0.3)]`)}>
                      <Crown className="w-3.5 h-3.5" />
                      {t(stryMutAct_9fa48("3173") ? "" : (stryCov_9fa48("3173"), "popular"))}
                    </div>
                  </div>)}

                <div className={stryMutAct_9fa48("3174") ? `` : (stryCov_9fa48("3174"), `relative h-full rounded-2xl p-[1px] transition-all duration-700 ${service.popular ? stryMutAct_9fa48("3175") ? `` : (stryCov_9fa48("3175"), `bg-gradient-to-b ${service.gradient} shadow-[0_0_40px_hsl(330,85%,60%,0.15)]`) : (stryMutAct_9fa48("3178") ? hoveredIdx !== i : stryMutAct_9fa48("3177") ? false : stryMutAct_9fa48("3176") ? true : (stryCov_9fa48("3176", "3177", "3178"), hoveredIdx === i)) ? stryMutAct_9fa48("3179") ? "" : (stryCov_9fa48("3179"), "bg-gradient-to-b from-[hsl(215,28%,25%)] to-[hsl(215,28%,16%)]") : stryMutAct_9fa48("3180") ? "" : (stryCov_9fa48("3180"), "bg-[hsl(215,28%,16%)]")}`)}>
                  <div className={stryMutAct_9fa48("3181") ? `` : (stryCov_9fa48("3181"), `relative h-full rounded-[15px] p-5 md:p-7 ${service.popular ? stryMutAct_9fa48("3182") ? "" : (stryCov_9fa48("3182"), "bg-[hsl(222,47%,4%)]") : stryMutAct_9fa48("3183") ? "" : (stryCov_9fa48("3183"), "bg-[hsl(222,47%,5%)]")}`)}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500" style={stryMutAct_9fa48("3184") ? {} : (stryCov_9fa48("3184"), {
                      background: stryMutAct_9fa48("3185") ? `` : (stryCov_9fa48("3185"), `linear-gradient(135deg, ${service.color}15, ${service.color}05)`),
                      border: stryMutAct_9fa48("3186") ? `` : (stryCov_9fa48("3186"), `1px solid ${service.color}25`),
                      boxShadow: (stryMutAct_9fa48("3189") ? hoveredIdx !== i : stryMutAct_9fa48("3188") ? false : stryMutAct_9fa48("3187") ? true : (stryCov_9fa48("3187", "3188", "3189"), hoveredIdx === i)) ? stryMutAct_9fa48("3190") ? `` : (stryCov_9fa48("3190"), `0 0 25px ${service.color}15`) : stryMutAct_9fa48("3191") ? "" : (stryCov_9fa48("3191"), "none")
                    })}>
                        <service.icon className="w-7 h-7" style={stryMutAct_9fa48("3192") ? {} : (stryCov_9fa48("3192"), {
                        color: service.color
                      })} />
                      </div>
                      {stryMutAct_9fa48("3195") ? service.popular || <Sparkles className="w-5 h-5 text-[#e84393] animate-pulse" /> : stryMutAct_9fa48("3194") ? false : stryMutAct_9fa48("3193") ? true : (stryCov_9fa48("3193", "3194", "3195"), service.popular && <Sparkles className="w-5 h-5 text-[#e84393] animate-pulse" />)}
                    </div>

                    <h3 className="text-xl font-bold text-[hsl(210,40%,98%)] mb-1">{service.title}</h3>
                    <span className="text-xs font-mono tracking-wider uppercase mb-4 block" style={stryMutAct_9fa48("3196") ? {} : (stryCov_9fa48("3196"), {
                    color: service.color
                  })}>
                      {service.subtitle}
                    </span>

                    <p className="text-sm text-[hsl(215,20%,55%)] leading-relaxed mb-6">{service.description}</p>

                    <div className="h-[1px] w-full bg-gradient-to-l from-transparent via-[hsl(215,28%,20%)] to-transparent mb-6" />

                    <div className="space-y-3 mb-8">
                      {service.features.map(stryMutAct_9fa48("3197") ? () => undefined : (stryCov_9fa48("3197"), f => <div key={f} className="service-feature flex items-center gap-3">
                          <div className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={stryMutAct_9fa48("3198") ? {} : (stryCov_9fa48("3198"), {
                        background: stryMutAct_9fa48("3199") ? `` : (stryCov_9fa48("3199"), `${service.color}15`)
                      })}>
                            <Check className="w-3 h-3" style={stryMutAct_9fa48("3200") ? {} : (stryCov_9fa48("3200"), {
                          color: service.color
                        })} />
                          </div>
                          <span className="text-sm text-[hsl(215,20%,60%)]">{f}</span>
                        </div>))}
                    </div>

                    <Magnetic strength={0.15}>
                      <a href="#contact" className={stryMutAct_9fa48("3201") ? `` : (stryCov_9fa48("3201"), `flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold transition-all duration-500 ${service.popular ? stryMutAct_9fa48("3202") ? `` : (stryCov_9fa48("3202"), `bg-gradient-to-l ${service.gradient} text-[hsl(222,47%,4%)] hover:shadow-[0_0_35px_${service.color}40]`) : stryMutAct_9fa48("3203") ? "" : (stryCov_9fa48("3203"), "border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] text-[hsl(210,40%,98%)] hover:border-opacity-60")}`)} style={(stryMutAct_9fa48("3204") ? service.popular : (stryCov_9fa48("3204"), !service.popular)) ? stryMutAct_9fa48("3205") ? {} : (stryCov_9fa48("3205"), {
                      ["--hover-border" as string]: service.color
                    }) : {}} onMouseEnter={e => {
                      if (stryMutAct_9fa48("3206")) {
                        {}
                      } else {
                        stryCov_9fa48("3206");
                        if (stryMutAct_9fa48("3209") ? false : stryMutAct_9fa48("3208") ? true : stryMutAct_9fa48("3207") ? service.popular : (stryCov_9fa48("3207", "3208", "3209"), !service.popular)) e.currentTarget.style.borderColor = stryMutAct_9fa48("3210") ? `` : (stryCov_9fa48("3210"), `${service.color}60`);
                      }
                    }} onMouseLeave={e => {
                      if (stryMutAct_9fa48("3211")) {
                        {}
                      } else {
                        stryCov_9fa48("3211");
                        if (stryMutAct_9fa48("3214") ? false : stryMutAct_9fa48("3213") ? true : stryMutAct_9fa48("3212") ? service.popular : (stryCov_9fa48("3212", "3213", "3214"), !service.popular)) e.currentTarget.style.borderColor = stryMutAct_9fa48("3215") ? "Stryker was here!" : (stryCov_9fa48("3215"), "");
                      }
                    }}>
                        {service.popular ? <>
                            <Zap className="w-4 h-4" />
                            {t(stryMutAct_9fa48("3216") ? "" : (stryCov_9fa48("3216"), "ctaPopular"))}
                          </> : <>
                            {t(stryMutAct_9fa48("3217") ? "" : (stryCov_9fa48("3217"), "ctaDefault"))}
                            <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
                          </>}
                      </a>
                    </Magnetic>

                    {stryMutAct_9fa48("3220") ? service.popular || <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[11px] font-mono text-amber-400/80">{t("urgency")}</span>
                      </div> : stryMutAct_9fa48("3219") ? false : stryMutAct_9fa48("3218") ? true : (stryCov_9fa48("3218", "3219", "3220"), service.popular && <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                        <span className="text-[11px] font-mono text-amber-400/80">{t(stryMutAct_9fa48("3221") ? "" : (stryCov_9fa48("3221"), "urgency"))}</span>
                      </div>)}
                  </div>
                </div>
              </div>
            </ScrollReveal>))}
        </div>

        <ScrollReveal delay={200} direction="left">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {additionalServices.map(stryMutAct_9fa48("3222") ? () => undefined : (stryCov_9fa48("3222"), (service, i) => <a key={i} href="#contact" className="additional-service group flex items-center gap-4 p-5 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] hover:border-[#06d6e0]/20 hover:bg-[hsl(222,47%,6%)] transition-all duration-500">
                <div className="flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center bg-[hsl(215,28%,12%)] border border-[hsl(215,28%,18%)] group-hover:border-[#06d6e0]/20 transition-colors">
                  <service.icon className="w-5 h-5 text-[hsl(215,20%,55%)] group-hover:text-[#06d6e0] transition-colors" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-0.5">{service.title}</h4>
                  <p className="text-xs text-[hsl(215,20%,45%)]">{service.description}</p>
                </div>
                <ArrowLeft className="w-4 h-4 text-[hsl(215,20%,45%)] group-hover:text-[#06d6e0] me-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all rtl:rotate-180" />
              </a>))}
          </div>
        </ScrollReveal>
      </div>
    </section>;
  }
}