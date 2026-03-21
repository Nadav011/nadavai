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
import { ExternalLink, Github, Star, ArrowDown, Globe, Cpu, Layers, Clock, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { ScrollReveal } from "./scroll-reveal";
import { SectionHeader } from "./section-header";
import { TiltCard } from "./tilt-card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
export function Projects() {
  if (stryMutAct_9fa48("2695")) {
    {}
  } else {
    stryCov_9fa48("2695");
    const t = useTranslations(stryMutAct_9fa48("2696") ? "" : (stryCov_9fa48("2696"), "projects"));
    const tCommon = useTranslations(stryMutAct_9fa48("2697") ? "" : (stryCov_9fa48("2697"), "common"));
    const [activeProject, setActiveProject] = useState<number | null>(null);
    const sectionRef = useRef<HTMLElement>(null);
    useGSAP(() => {
      if (stryMutAct_9fa48("2698")) {
        {}
      } else {
        stryCov_9fa48("2698");
        if (stryMutAct_9fa48("2701") ? false : stryMutAct_9fa48("2700") ? true : stryMutAct_9fa48("2699") ? sectionRef.current : (stryCov_9fa48("2699", "2700", "2701"), !sectionRef.current)) return;

        // Animate project cards with batch
        const cards = sectionRef.current.querySelectorAll(stryMutAct_9fa48("2702") ? "" : (stryCov_9fa48("2702"), ".project-card"));
        if (stryMutAct_9fa48("2706") ? cards.length <= 0 : stryMutAct_9fa48("2705") ? cards.length >= 0 : stryMutAct_9fa48("2704") ? false : stryMutAct_9fa48("2703") ? true : (stryCov_9fa48("2703", "2704", "2705", "2706"), cards.length > 0)) {
          if (stryMutAct_9fa48("2707")) {
            {}
          } else {
            stryCov_9fa48("2707");
            gsap.set(cards, stryMutAct_9fa48("2708") ? {} : (stryCov_9fa48("2708"), {
              opacity: 0,
              y: 30
            }));
            ScrollTrigger.batch(cards, stryMutAct_9fa48("2709") ? {} : (stryCov_9fa48("2709"), {
              onEnter: batch => {
                if (stryMutAct_9fa48("2710")) {
                  {}
                } else {
                  stryCov_9fa48("2710");
                  gsap.to(batch, stryMutAct_9fa48("2711") ? {} : (stryCov_9fa48("2711"), {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.12,
                    ease: stryMutAct_9fa48("2712") ? "" : (stryCov_9fa48("2712"), "expo.out")
                  }));
                }
              },
              start: stryMutAct_9fa48("2713") ? "" : (stryCov_9fa48("2713"), "top 85%"),
              once: stryMutAct_9fa48("2714") ? false : (stryCov_9fa48("2714"), true)
            }));
          }
        }

        // Animate section header title words
        const titleWords = sectionRef.current.querySelectorAll(stryMutAct_9fa48("2715") ? "" : (stryCov_9fa48("2715"), ".section-title-word"));
        if (stryMutAct_9fa48("2719") ? titleWords.length <= 0 : stryMutAct_9fa48("2718") ? titleWords.length >= 0 : stryMutAct_9fa48("2717") ? false : stryMutAct_9fa48("2716") ? true : (stryCov_9fa48("2716", "2717", "2718", "2719"), titleWords.length > 0)) {
          if (stryMutAct_9fa48("2720")) {
            {}
          } else {
            stryCov_9fa48("2720");
            gsap.set(titleWords, stryMutAct_9fa48("2721") ? {} : (stryCov_9fa48("2721"), {
              opacity: 0,
              y: 20
            }));
            gsap.to(titleWords, stryMutAct_9fa48("2722") ? {} : (stryCov_9fa48("2722"), {
              opacity: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: stryMutAct_9fa48("2723") ? "" : (stryCov_9fa48("2723"), "power3.out"),
              scrollTrigger: stryMutAct_9fa48("2724") ? {} : (stryCov_9fa48("2724"), {
                trigger: sectionRef.current,
                start: stryMutAct_9fa48("2725") ? "" : (stryCov_9fa48("2725"), "top 80%"),
                once: stryMutAct_9fa48("2726") ? false : (stryCov_9fa48("2726"), true)
              })
            }));
          }
        }
      }
    }, stryMutAct_9fa48("2727") ? {} : (stryCov_9fa48("2727"), {
      scope: sectionRef
    }));
    const projects = stryMutAct_9fa48("2728") ? [] : (stryCov_9fa48("2728"), [stryMutAct_9fa48("2729") ? {} : (stryCov_9fa48("2729"), {
      title: stryMutAct_9fa48("2730") ? "" : (stryCov_9fa48("2730"), "Mexicani"),
      description: t(stryMutAct_9fa48("2731") ? "" : (stryCov_9fa48("2731"), "p1")),
      tech: stryMutAct_9fa48("2732") ? [] : (stryCov_9fa48("2732"), [stryMutAct_9fa48("2733") ? "" : (stryCov_9fa48("2733"), "React"), stryMutAct_9fa48("2734") ? "" : (stryCov_9fa48("2734"), "TypeScript"), stryMutAct_9fa48("2735") ? "" : (stryCov_9fa48("2735"), "Supabase"), stryMutAct_9fa48("2736") ? "" : (stryCov_9fa48("2736"), "TanStack Query"), stryMutAct_9fa48("2737") ? "" : (stryCov_9fa48("2737"), "Tailwind")]),
      category: stryMutAct_9fa48("2738") ? "" : (stryCov_9fa48("2738"), "Enterprise"),
      icon: Layers,
      status: stryMutAct_9fa48("2739") ? "" : (stryCov_9fa48("2739"), "production"),
      statusColor: stryMutAct_9fa48("2740") ? "" : (stryCov_9fa48("2740"), "#27ca40"),
      stars: 0,
      featured: stryMutAct_9fa48("2741") ? false : (stryCov_9fa48("2741"), true),
      color: stryMutAct_9fa48("2742") ? "" : (stryCov_9fa48("2742"), "#06d6e0"),
      metrics: stryMutAct_9fa48("2743") ? {} : (stryCov_9fa48("2743"), {
        pages: stryMutAct_9fa48("2744") ? "" : (stryCov_9fa48("2744"), "149"),
        tables: stryMutAct_9fa48("2745") ? "" : (stryCov_9fa48("2745"), "111")
      }),
      github: stryMutAct_9fa48("2746") ? "" : (stryCov_9fa48("2746"), "https://github.com/Nadav011/Mexicani"),
      demo: stryMutAct_9fa48("2747") ? "Stryker was here!" : (stryCov_9fa48("2747"), "")
    }), stryMutAct_9fa48("2748") ? {} : (stryCov_9fa48("2748"), {
      title: stryMutAct_9fa48("2749") ? "" : (stryCov_9fa48("2749"), "Cash"),
      description: t(stryMutAct_9fa48("2750") ? "" : (stryCov_9fa48("2750"), "p2")),
      tech: stryMutAct_9fa48("2751") ? [] : (stryCov_9fa48("2751"), [stryMutAct_9fa48("2752") ? "" : (stryCov_9fa48("2752"), "React"), stryMutAct_9fa48("2753") ? "" : (stryCov_9fa48("2753"), "TypeScript"), stryMutAct_9fa48("2754") ? "" : (stryCov_9fa48("2754"), "Supabase"), stryMutAct_9fa48("2755") ? "" : (stryCov_9fa48("2755"), "PWA"), stryMutAct_9fa48("2756") ? "" : (stryCov_9fa48("2756"), "Capacitor")]),
      category: stryMutAct_9fa48("2757") ? "" : (stryCov_9fa48("2757"), "PWA"),
      icon: Globe,
      status: stryMutAct_9fa48("2758") ? "" : (stryCov_9fa48("2758"), "production"),
      statusColor: stryMutAct_9fa48("2759") ? "" : (stryCov_9fa48("2759"), "#27ca40"),
      stars: 0,
      featured: stryMutAct_9fa48("2760") ? false : (stryCov_9fa48("2760"), true),
      color: stryMutAct_9fa48("2761") ? "" : (stryCov_9fa48("2761"), "#e84393"),
      metrics: stryMutAct_9fa48("2762") ? {} : (stryCov_9fa48("2762"), {
        offline: stryMutAct_9fa48("2763") ? "" : (stryCov_9fa48("2763"), "100%"),
        sync: stryMutAct_9fa48("2764") ? "" : (stryCov_9fa48("2764"), "Real-time")
      }),
      github: stryMutAct_9fa48("2765") ? "" : (stryCov_9fa48("2765"), "https://github.com/Nadav011/cash"),
      demo: stryMutAct_9fa48("2766") ? "" : (stryCov_9fa48("2766"), "https://cash-ashy-zeta.vercel.app")
    }), stryMutAct_9fa48("2767") ? {} : (stryCov_9fa48("2767"), {
      title: stryMutAct_9fa48("2768") ? "" : (stryCov_9fa48("2768"), "Shifts"),
      description: t(stryMutAct_9fa48("2769") ? "" : (stryCov_9fa48("2769"), "p3")),
      tech: stryMutAct_9fa48("2770") ? [] : (stryCov_9fa48("2770"), [stryMutAct_9fa48("2771") ? "" : (stryCov_9fa48("2771"), "React"), stryMutAct_9fa48("2772") ? "" : (stryCov_9fa48("2772"), "TypeScript"), stryMutAct_9fa48("2773") ? "" : (stryCov_9fa48("2773"), "Supabase"), stryMutAct_9fa48("2774") ? "" : (stryCov_9fa48("2774"), "DnD Kit"), stryMutAct_9fa48("2775") ? "" : (stryCov_9fa48("2775"), "Framer Motion")]),
      category: stryMutAct_9fa48("2776") ? "" : (stryCov_9fa48("2776"), "SaaS"),
      icon: Clock,
      status: stryMutAct_9fa48("2777") ? "" : (stryCov_9fa48("2777"), "beta"),
      statusColor: stryMutAct_9fa48("2778") ? "" : (stryCov_9fa48("2778"), "#ffbd2e"),
      stars: 0,
      featured: stryMutAct_9fa48("2779") ? true : (stryCov_9fa48("2779"), false),
      color: stryMutAct_9fa48("2780") ? "" : (stryCov_9fa48("2780"), "#4f46e5"),
      metrics: stryMutAct_9fa48("2781") ? {} : (stryCov_9fa48("2781"), {
        components: stryMutAct_9fa48("2782") ? "" : (stryCov_9fa48("2782"), "154"),
        hooks: stryMutAct_9fa48("2783") ? "" : (stryCov_9fa48("2783"), "25")
      }),
      github: stryMutAct_9fa48("2784") ? "" : (stryCov_9fa48("2784"), "https://github.com/Nadav011/mexicani-shifts"),
      demo: stryMutAct_9fa48("2785") ? "Stryker was here!" : (stryCov_9fa48("2785"), "")
    }), stryMutAct_9fa48("2786") ? {} : (stryCov_9fa48("2786"), {
      title: stryMutAct_9fa48("2787") ? "" : (stryCov_9fa48("2787"), "hatumdigital"),
      description: t(stryMutAct_9fa48("2788") ? "" : (stryCov_9fa48("2788"), "p4")),
      tech: stryMutAct_9fa48("2789") ? [] : (stryCov_9fa48("2789"), [stryMutAct_9fa48("2790") ? "" : (stryCov_9fa48("2790"), "React"), stryMutAct_9fa48("2791") ? "" : (stryCov_9fa48("2791"), "TypeScript"), stryMutAct_9fa48("2792") ? "" : (stryCov_9fa48("2792"), "Supabase"), stryMutAct_9fa48("2793") ? "" : (stryCov_9fa48("2793"), "Capacitor"), stryMutAct_9fa48("2794") ? "" : (stryCov_9fa48("2794"), "Zod")]),
      category: stryMutAct_9fa48("2795") ? "" : (stryCov_9fa48("2795"), "Mobile App"),
      icon: Cpu,
      status: stryMutAct_9fa48("2796") ? "" : (stryCov_9fa48("2796"), "production"),
      statusColor: stryMutAct_9fa48("2797") ? "" : (stryCov_9fa48("2797"), "#27ca40"),
      stars: 0,
      featured: stryMutAct_9fa48("2798") ? true : (stryCov_9fa48("2798"), false),
      color: stryMutAct_9fa48("2799") ? "" : (stryCov_9fa48("2799"), "#06d6e0"),
      metrics: stryMutAct_9fa48("2800") ? {} : (stryCov_9fa48("2800"), {
        platform: stryMutAct_9fa48("2801") ? "" : (stryCov_9fa48("2801"), "iOS"),
        patterns: stryMutAct_9fa48("2802") ? "" : (stryCov_9fa48("2802"), "Clean")
      }),
      github: stryMutAct_9fa48("2803") ? "" : (stryCov_9fa48("2803"), "https://github.com/Nadav011/hatumdigital"),
      demo: stryMutAct_9fa48("2804") ? "Stryker was here!" : (stryCov_9fa48("2804"), "")
    }), stryMutAct_9fa48("2805") ? {} : (stryCov_9fa48("2805"), {
      title: stryMutAct_9fa48("2806") ? "" : (stryCov_9fa48("2806"), "Z"),
      description: t(stryMutAct_9fa48("2807") ? "" : (stryCov_9fa48("2807"), "p5")),
      tech: stryMutAct_9fa48("2808") ? [] : (stryCov_9fa48("2808"), [stryMutAct_9fa48("2809") ? "" : (stryCov_9fa48("2809"), "React"), stryMutAct_9fa48("2810") ? "" : (stryCov_9fa48("2810"), "TypeScript"), stryMutAct_9fa48("2811") ? "" : (stryCov_9fa48("2811"), "Supabase"), stryMutAct_9fa48("2812") ? "" : (stryCov_9fa48("2812"), "PWA"), stryMutAct_9fa48("2813") ? "" : (stryCov_9fa48("2813"), "Workbox")]),
      category: stryMutAct_9fa48("2814") ? "" : (stryCov_9fa48("2814"), "PWA"),
      icon: Cpu,
      status: stryMutAct_9fa48("2815") ? "" : (stryCov_9fa48("2815"), "production"),
      statusColor: stryMutAct_9fa48("2816") ? "" : (stryCov_9fa48("2816"), "#27ca40"),
      stars: 0,
      featured: stryMutAct_9fa48("2817") ? true : (stryCov_9fa48("2817"), false),
      color: stryMutAct_9fa48("2818") ? "" : (stryCov_9fa48("2818"), "#e84393"),
      metrics: stryMutAct_9fa48("2819") ? {} : (stryCov_9fa48("2819"), {
        offline: stryMutAct_9fa48("2820") ? "" : (stryCov_9fa48("2820"), "100%"),
        currency: stryMutAct_9fa48("2821") ? "" : (stryCov_9fa48("2821"), "ILS")
      }),
      github: stryMutAct_9fa48("2822") ? "" : (stryCov_9fa48("2822"), "https://github.com/Nadav011/Z"),
      demo: stryMutAct_9fa48("2823") ? "Stryker was here!" : (stryCov_9fa48("2823"), "")
    }), stryMutAct_9fa48("2824") ? {} : (stryCov_9fa48("2824"), {
      title: stryMutAct_9fa48("2825") ? "" : (stryCov_9fa48("2825"), "SportChat"),
      description: t(stryMutAct_9fa48("2826") ? "" : (stryCov_9fa48("2826"), "p6")),
      tech: stryMutAct_9fa48("2827") ? [] : (stryCov_9fa48("2827"), [stryMutAct_9fa48("2828") ? "" : (stryCov_9fa48("2828"), "Flutter"), stryMutAct_9fa48("2829") ? "" : (stryCov_9fa48("2829"), "Dart"), stryMutAct_9fa48("2830") ? "" : (stryCov_9fa48("2830"), "Supabase"), stryMutAct_9fa48("2831") ? "" : (stryCov_9fa48("2831"), "Riverpod")]),
      category: stryMutAct_9fa48("2832") ? "" : (stryCov_9fa48("2832"), "Mobile"),
      icon: Globe,
      status: stryMutAct_9fa48("2833") ? "" : (stryCov_9fa48("2833"), "beta"),
      statusColor: stryMutAct_9fa48("2834") ? "" : (stryCov_9fa48("2834"), "#ffbd2e"),
      stars: 0,
      featured: stryMutAct_9fa48("2835") ? true : (stryCov_9fa48("2835"), false),
      color: stryMutAct_9fa48("2836") ? "" : (stryCov_9fa48("2836"), "#4f46e5"),
      metrics: stryMutAct_9fa48("2837") ? {} : (stryCov_9fa48("2837"), {
        modules: stryMutAct_9fa48("2838") ? "" : (stryCov_9fa48("2838"), "28"),
        arch: stryMutAct_9fa48("2839") ? "" : (stryCov_9fa48("2839"), "Clean")
      }),
      github: stryMutAct_9fa48("2840") ? "Stryker was here!" : (stryCov_9fa48("2840"), ""),
      demo: stryMutAct_9fa48("2841") ? "Stryker was here!" : (stryCov_9fa48("2841"), "")
    }), stryMutAct_9fa48("2842") ? {} : (stryCov_9fa48("2842"), {
      title: stryMutAct_9fa48("2843") ? "" : (stryCov_9fa48("2843"), "APEX Engine"),
      description: t(stryMutAct_9fa48("2844") ? "" : (stryCov_9fa48("2844"), "p7")),
      tech: stryMutAct_9fa48("2845") ? [] : (stryCov_9fa48("2845"), [stryMutAct_9fa48("2846") ? "" : (stryCov_9fa48("2846"), "TypeScript"), stryMutAct_9fa48("2847") ? "" : (stryCov_9fa48("2847"), "Bun"), stryMutAct_9fa48("2848") ? "" : (stryCov_9fa48("2848"), "Claude Code"), stryMutAct_9fa48("2849") ? "" : (stryCov_9fa48("2849"), "AST")]),
      category: stryMutAct_9fa48("2850") ? "" : (stryCov_9fa48("2850"), "Dev Tool"),
      icon: Shield,
      status: stryMutAct_9fa48("2851") ? "" : (stryCov_9fa48("2851"), "production"),
      statusColor: stryMutAct_9fa48("2852") ? "" : (stryCov_9fa48("2852"), "#27ca40"),
      stars: 0,
      featured: stryMutAct_9fa48("2853") ? false : (stryCov_9fa48("2853"), true),
      color: stryMutAct_9fa48("2854") ? "" : (stryCov_9fa48("2854"), "#4f46e5"),
      metrics: stryMutAct_9fa48("2855") ? {} : (stryCov_9fa48("2855"), {
        gates: stryMutAct_9fa48("2856") ? "" : (stryCov_9fa48("2856"), "579"),
        matrix: stryMutAct_9fa48("2857") ? "" : (stryCov_9fa48("2857"), "10x7")
      }),
      github: stryMutAct_9fa48("2858") ? "" : (stryCov_9fa48("2858"), "https://github.com/Nadav011"),
      demo: stryMutAct_9fa48("2859") ? "Stryker was here!" : (stryCov_9fa48("2859"), "")
    }), stryMutAct_9fa48("2860") ? {} : (stryCov_9fa48("2860"), {
      title: stryMutAct_9fa48("2861") ? "" : (stryCov_9fa48("2861"), "FinanceApp"),
      description: t(stryMutAct_9fa48("2862") ? "" : (stryCov_9fa48("2862"), "p8")),
      tech: stryMutAct_9fa48("2863") ? [] : (stryCov_9fa48("2863"), [stryMutAct_9fa48("2864") ? "" : (stryCov_9fa48("2864"), "React Native"), stryMutAct_9fa48("2865") ? "" : (stryCov_9fa48("2865"), "Expo"), stryMutAct_9fa48("2866") ? "" : (stryCov_9fa48("2866"), "TypeScript"), stryMutAct_9fa48("2867") ? "" : (stryCov_9fa48("2867"), "Tamagui")]),
      category: stryMutAct_9fa48("2868") ? "" : (stryCov_9fa48("2868"), "Finance"),
      icon: Cpu,
      status: stryMutAct_9fa48("2869") ? "" : (stryCov_9fa48("2869"), "beta"),
      statusColor: stryMutAct_9fa48("2870") ? "" : (stryCov_9fa48("2870"), "#ffbd2e"),
      stars: 0,
      featured: stryMutAct_9fa48("2871") ? true : (stryCov_9fa48("2871"), false),
      color: stryMutAct_9fa48("2872") ? "" : (stryCov_9fa48("2872"), "#06d6e0"),
      metrics: stryMutAct_9fa48("2873") ? {} : (stryCov_9fa48("2873"), {
        platform: stryMutAct_9fa48("2874") ? "" : (stryCov_9fa48("2874"), "iOS/Android"),
        lang: stryMutAct_9fa48("2875") ? "" : (stryCov_9fa48("2875"), "Hebrew")
      }),
      github: stryMutAct_9fa48("2876") ? "" : (stryCov_9fa48("2876"), "https://github.com/Nadav011/israeli-finance-app"),
      demo: stryMutAct_9fa48("2877") ? "Stryker was here!" : (stryCov_9fa48("2877"), "")
    })]);
    const statusLabels: Record<string, string> = stryMutAct_9fa48("2878") ? {} : (stryCov_9fa48("2878"), {
      production: stryMutAct_9fa48("2879") ? "" : (stryCov_9fa48("2879"), "PRODUCTION"),
      live: stryMutAct_9fa48("2880") ? "" : (stryCov_9fa48("2880"), "LIVE"),
      featured: stryMutAct_9fa48("2881") ? "" : (stryCov_9fa48("2881"), "FEATURED"),
      stable: stryMutAct_9fa48("2882") ? "" : (stryCov_9fa48("2882"), "STABLE"),
      beta: stryMutAct_9fa48("2883") ? "" : (stryCov_9fa48("2883"), "BETA"),
      popular: stryMutAct_9fa48("2884") ? "" : (stryCov_9fa48("2884"), "POPULAR")
    });
    return <section ref={sectionRef} id="projects" aria-label={t(stryMutAct_9fa48("2885") ? "" : (stryCov_9fa48("2885"), "title"))} className="relative py-16 md:py-32">
      <div className="absolute inset-0 dot-grid-subtle opacity-[0.15] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader badge={t(stryMutAct_9fa48("2886") ? "" : (stryCov_9fa48("2886"), "badge"))} title={t(stryMutAct_9fa48("2887") ? "" : (stryCov_9fa48("2887"), "title"))} highlight={t(stryMutAct_9fa48("2888") ? "" : (stryCov_9fa48("2888"), "highlight"))} description={t(stryMutAct_9fa48("2889") ? "" : (stryCov_9fa48("2889"), "description"))} />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {projects.map(stryMutAct_9fa48("2890") ? () => undefined : (stryCov_9fa48("2890"), (project, i) => <ScrollReveal key={i} delay={stryMutAct_9fa48("2891") ? i / 80 : (stryCov_9fa48("2891"), i * 80)} direction={(stryMutAct_9fa48("2894") ? i % 2 !== 0 : stryMutAct_9fa48("2893") ? false : stryMutAct_9fa48("2892") ? true : (stryCov_9fa48("2892", "2893", "2894"), (stryMutAct_9fa48("2895") ? i * 2 : (stryCov_9fa48("2895"), i % 2)) === 0)) ? stryMutAct_9fa48("2896") ? "" : (stryCov_9fa48("2896"), "right") : stryMutAct_9fa48("2897") ? "" : (stryCov_9fa48("2897"), "left")}>
              <TiltCard className={project.featured ? stryMutAct_9fa48("2898") ? "" : (stryCov_9fa48("2898"), "md:row-span-1") : stryMutAct_9fa48("2899") ? "Stryker was here!" : (stryCov_9fa48("2899"), "")}>
                <div className="project-card group relative h-full rounded-2xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] overflow-hidden transition-all duration-700 hover:border-opacity-50" onMouseEnter={stryMutAct_9fa48("2900") ? () => undefined : (stryCov_9fa48("2900"), () => setActiveProject(i))} onMouseLeave={stryMutAct_9fa48("2901") ? () => undefined : (stryCov_9fa48("2901"), () => setActiveProject(null))} style={stryMutAct_9fa48("2902") ? {} : (stryCov_9fa48("2902"), {
                borderColor: (stryMutAct_9fa48("2905") ? activeProject !== i : stryMutAct_9fa48("2904") ? false : stryMutAct_9fa48("2903") ? true : (stryCov_9fa48("2903", "2904", "2905"), activeProject === i)) ? stryMutAct_9fa48("2906") ? `` : (stryCov_9fa48("2906"), `${project.color}30`) : undefined,
                boxShadow: (stryMutAct_9fa48("2909") ? activeProject !== i : stryMutAct_9fa48("2908") ? false : stryMutAct_9fa48("2907") ? true : (stryCov_9fa48("2907", "2908", "2909"), activeProject === i)) ? stryMutAct_9fa48("2910") ? `` : (stryCov_9fa48("2910"), `0 0 40px ${project.color}08`) : undefined
              })}>
                  {/* Top accent line */}
                  <div className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={stryMutAct_9fa48("2911") ? {} : (stryCov_9fa48("2911"), {
                  background: stryMutAct_9fa48("2912") ? `` : (stryCov_9fa48("2912"), `linear-gradient(to right, transparent, ${project.color}, transparent)`)
                })} />

                  <div className="p-4 md:p-6">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110" style={stryMutAct_9fa48("2913") ? {} : (stryCov_9fa48("2913"), {
                        background: stryMutAct_9fa48("2914") ? `` : (stryCov_9fa48("2914"), `${project.color}10`),
                        border: stryMutAct_9fa48("2915") ? `` : (stryCov_9fa48("2915"), `1px solid ${project.color}20`)
                      })}>
                          <project.icon className="w-5 h-5" style={stryMutAct_9fa48("2916") ? {} : (stryCov_9fa48("2916"), {
                          color: project.color
                        })} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono tracking-wider uppercase text-[hsl(215,20%,45%)]">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={stryMutAct_9fa48("2917") ? {} : (stryCov_9fa48("2917"), {
                      background: stryMutAct_9fa48("2918") ? `` : (stryCov_9fa48("2918"), `${project.statusColor}12`),
                      border: stryMutAct_9fa48("2919") ? `` : (stryCov_9fa48("2919"), `1px solid ${project.statusColor}25`)
                    })}>
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={stryMutAct_9fa48("2920") ? {} : (stryCov_9fa48("2920"), {
                        background: project.statusColor
                      })} />
                        <span className="text-[10px] font-mono font-semibold" style={stryMutAct_9fa48("2921") ? {} : (stryCov_9fa48("2921"), {
                        color: project.statusColor
                      })}>
                          {statusLabels[project.status]}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[hsl(210,40%,98%)] mb-2 group-hover:text-[hsl(210,40%,100%)] transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[hsl(215,20%,55%)] leading-relaxed mb-5">{project.description}</p>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 mb-5">
                      {Object.entries(project.metrics).map(stryMutAct_9fa48("2922") ? () => undefined : (stryCov_9fa48("2922"), ([key, val]) => <div key={key} className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[hsl(210,40%,98%)]">{val}</span>
                          <span className="text-[10px] font-mono text-[hsl(215,20%,48%)] uppercase">{key}</span>
                        </div>))}
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech.map(stryMutAct_9fa48("2923") ? () => undefined : (stryCov_9fa48("2923"), t => <span key={t} className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[hsl(215,28%,10%)] text-[hsl(215,20%,55%)] border border-[hsl(215,28%,16%)] group-hover:border-[hsl(215,28%,20%)] transition-colors">
                          {t}
                        </span>))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[hsl(215,28%,12%)]">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-mono font-semibold text-[hsl(210,40%,98%)]">AI Built</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {stryMutAct_9fa48("2926") ? project.github || <a href={project.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-[hsl(215,28%,12%)] text-[hsl(215,20%,45%)] hover:text-[hsl(210,40%,98%)] transition-all" aria-label={tCommon("githubAriaLabel")}>
                            <Github className="w-4 h-4" />
                          </a> : stryMutAct_9fa48("2925") ? false : stryMutAct_9fa48("2924") ? true : (stryCov_9fa48("2924", "2925", "2926"), project.github && <a href={project.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-[hsl(215,28%,12%)] text-[hsl(215,20%,45%)] hover:text-[hsl(210,40%,98%)] transition-all" aria-label={tCommon(stryMutAct_9fa48("2927") ? "" : (stryCov_9fa48("2927"), "githubAriaLabel"))}>
                            <Github className="w-4 h-4" />
                          </a>)}
                        {stryMutAct_9fa48("2930") ? project.demo || <a href={project.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300" style={{
                        background: `${project.color}10`,
                        color: project.color,
                        border: `1px solid ${project.color}20`
                      }} onMouseEnter={e => {
                        e.currentTarget.style.background = `${project.color}20`;
                      }} onMouseLeave={e => {
                        e.currentTarget.style.background = `${project.color}10`;
                      }}>
                            <ExternalLink className="w-3.5 h-3.5" />
                            Demo
                          </a> : stryMutAct_9fa48("2929") ? false : stryMutAct_9fa48("2928") ? true : (stryCov_9fa48("2928", "2929", "2930"), project.demo && <a href={project.demo} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300" style={stryMutAct_9fa48("2931") ? {} : (stryCov_9fa48("2931"), {
                        background: stryMutAct_9fa48("2932") ? `` : (stryCov_9fa48("2932"), `${project.color}10`),
                        color: project.color,
                        border: stryMutAct_9fa48("2933") ? `` : (stryCov_9fa48("2933"), `1px solid ${project.color}20`)
                      })} onMouseEnter={e => {
                        if (stryMutAct_9fa48("2934")) {
                          {}
                        } else {
                          stryCov_9fa48("2934");
                          e.currentTarget.style.background = stryMutAct_9fa48("2935") ? `` : (stryCov_9fa48("2935"), `${project.color}20`);
                        }
                      }} onMouseLeave={e => {
                        if (stryMutAct_9fa48("2936")) {
                          {}
                        } else {
                          stryCov_9fa48("2936");
                          e.currentTarget.style.background = stryMutAct_9fa48("2937") ? `` : (stryCov_9fa48("2937"), `${project.color}10`);
                        }
                      }}>
                            <ExternalLink className="w-3.5 h-3.5" />
                            Demo
                          </a>)}
                      </div>
                    </div>
                  </div>

                  {/* Background hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" style={stryMutAct_9fa48("2938") ? {} : (stryCov_9fa48("2938"), {
                  background: stryMutAct_9fa48("2939") ? `` : (stryCov_9fa48("2939"), `radial-gradient(ellipse at top, ${project.color}06, transparent 70%)`)
                })} />
                </div>
              </TiltCard>
            </ScrollReveal>))}
        </div>

        {/* View more CTA */}
        <ScrollReveal delay={300}>
          <div className="flex justify-center mt-8 md:mt-12">
            <a href="https://github.com/Nadav011" target="_blank" rel="noreferrer" className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,6%)] text-sm font-medium text-[hsl(215,20%,65%)] hover:text-[#06d6e0] hover:border-[#06d6e0]/30 transition-all duration-500">
              {t(stryMutAct_9fa48("2940") ? "" : (stryCov_9fa48("2940"), "viewMore"))}
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>;
  }
}