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
import { useEffect, useState, useRef } from "react";
import { ArrowDown, Play, Sparkles } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { Magnetic } from "./magnetic";
import { AnimatedCounter } from "./animated-counter";
import { HeroGlobe } from "./hero-globe";
import { Spotlight } from "./spotlight";
import { TextGenerate } from "./text-generate";
import { useTranslations } from "next-intl";

// ScrollTrigger is registered in page.tsx - no need to register again

const roles = stryMutAct_9fa48("2192") ? [] : (stryCov_9fa48("2192"), [stryMutAct_9fa48("2193") ? "" : (stryCov_9fa48("2193"), "Full-Stack Developer"), stryMutAct_9fa48("2194") ? "" : (stryCov_9fa48("2194"), "AI Builder"), stryMutAct_9fa48("2195") ? "" : (stryCov_9fa48("2195"), "Prompt Engineer"), stryMutAct_9fa48("2196") ? "" : (stryCov_9fa48("2196"), "System Architect"), stryMutAct_9fa48("2197") ? "" : (stryCov_9fa48("2197"), "Tech Creator")]);
export function Hero() {
  if (stryMutAct_9fa48("2198")) {
    {}
  } else {
    stryCov_9fa48("2198");
    const t = useTranslations(stryMutAct_9fa48("2199") ? "" : (stryCov_9fa48("2199"), "hero"));
    const [roleIndex, setRoleIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(stryMutAct_9fa48("2200") ? true : (stryCov_9fa48("2200"), false));
    const badgeRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLDivElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const descriptionRef = useRef<HTMLDivElement>(null);
    const buttonsRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const scrollIndicatorRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
      if (stryMutAct_9fa48("2201")) {
        {}
      } else {
        stryCov_9fa48("2201");
        const current = roles[roleIndex];
        const timeout = setTimeout(() => {
          if (stryMutAct_9fa48("2202")) {
            {}
          } else {
            stryCov_9fa48("2202");
            if (stryMutAct_9fa48("2205") ? !isDeleting || charIndex < current.length : stryMutAct_9fa48("2204") ? false : stryMutAct_9fa48("2203") ? true : (stryCov_9fa48("2203", "2204", "2205"), (stryMutAct_9fa48("2206") ? isDeleting : (stryCov_9fa48("2206"), !isDeleting)) && (stryMutAct_9fa48("2209") ? charIndex >= current.length : stryMutAct_9fa48("2208") ? charIndex <= current.length : stryMutAct_9fa48("2207") ? true : (stryCov_9fa48("2207", "2208", "2209"), charIndex < current.length)))) {
              if (stryMutAct_9fa48("2210")) {
                {}
              } else {
                stryCov_9fa48("2210");
                setCharIndex(stryMutAct_9fa48("2211") ? () => undefined : (stryCov_9fa48("2211"), c => stryMutAct_9fa48("2212") ? c - 1 : (stryCov_9fa48("2212"), c + 1)));
              }
            } else if (stryMutAct_9fa48("2215") ? !isDeleting || charIndex === current.length : stryMutAct_9fa48("2214") ? false : stryMutAct_9fa48("2213") ? true : (stryCov_9fa48("2213", "2214", "2215"), (stryMutAct_9fa48("2216") ? isDeleting : (stryCov_9fa48("2216"), !isDeleting)) && (stryMutAct_9fa48("2218") ? charIndex !== current.length : stryMutAct_9fa48("2217") ? true : (stryCov_9fa48("2217", "2218"), charIndex === current.length)))) {
              if (stryMutAct_9fa48("2219")) {
                {}
              } else {
                stryCov_9fa48("2219");
                setTimeout(stryMutAct_9fa48("2220") ? () => undefined : (stryCov_9fa48("2220"), () => setIsDeleting(stryMutAct_9fa48("2221") ? false : (stryCov_9fa48("2221"), true))), 2000);
              }
            } else if (stryMutAct_9fa48("2224") ? isDeleting || charIndex > 0 : stryMutAct_9fa48("2223") ? false : stryMutAct_9fa48("2222") ? true : (stryCov_9fa48("2222", "2223", "2224"), isDeleting && (stryMutAct_9fa48("2227") ? charIndex <= 0 : stryMutAct_9fa48("2226") ? charIndex >= 0 : stryMutAct_9fa48("2225") ? true : (stryCov_9fa48("2225", "2226", "2227"), charIndex > 0)))) {
              if (stryMutAct_9fa48("2228")) {
                {}
              } else {
                stryCov_9fa48("2228");
                setCharIndex(stryMutAct_9fa48("2229") ? () => undefined : (stryCov_9fa48("2229"), c => stryMutAct_9fa48("2230") ? c + 1 : (stryCov_9fa48("2230"), c - 1)));
              }
            } else if (stryMutAct_9fa48("2233") ? isDeleting || charIndex === 0 : stryMutAct_9fa48("2232") ? false : stryMutAct_9fa48("2231") ? true : (stryCov_9fa48("2231", "2232", "2233"), isDeleting && (stryMutAct_9fa48("2235") ? charIndex !== 0 : stryMutAct_9fa48("2234") ? true : (stryCov_9fa48("2234", "2235"), charIndex === 0)))) {
              if (stryMutAct_9fa48("2236")) {
                {}
              } else {
                stryCov_9fa48("2236");
                setIsDeleting(stryMutAct_9fa48("2237") ? true : (stryCov_9fa48("2237"), false));
                setRoleIndex(stryMutAct_9fa48("2238") ? () => undefined : (stryCov_9fa48("2238"), r => stryMutAct_9fa48("2239") ? (r + 1) * roles.length : (stryCov_9fa48("2239"), (stryMutAct_9fa48("2240") ? r - 1 : (stryCov_9fa48("2240"), r + 1)) % roles.length)));
              }
            }
          }
        }, isDeleting ? 40 : 80);
        return stryMutAct_9fa48("2241") ? () => undefined : (stryCov_9fa48("2241"), () => clearTimeout(timeout));
      }
    }, stryMutAct_9fa48("2242") ? [] : (stryCov_9fa48("2242"), [charIndex, isDeleting, roleIndex]));
    useGSAP(() => {
      if (stryMutAct_9fa48("2243")) {
        {}
      } else {
        stryCov_9fa48("2243");
        const tl = gsap.timeline(stryMutAct_9fa48("2244") ? {} : (stryCov_9fa48("2244"), {
          defaults: stryMutAct_9fa48("2245") ? {} : (stryCov_9fa48("2245"), {
            ease: stryMutAct_9fa48("2246") ? "" : (stryCov_9fa48("2246"), "expo.out")
          })
        }));
        tl.fromTo(badgeRef.current, stryMutAct_9fa48("2247") ? {} : (stryCov_9fa48("2247"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("2248") ? {} : (stryCov_9fa48("2248"), {
          opacity: 1,
          y: 0,
          duration: 0.6
        })).fromTo(headingRef.current, stryMutAct_9fa48("2249") ? {} : (stryCov_9fa48("2249"), {
          opacity: 0,
          y: 30
        }), stryMutAct_9fa48("2250") ? {} : (stryCov_9fa48("2250"), {
          opacity: 1,
          y: 0,
          duration: 0.8
        }), stryMutAct_9fa48("2251") ? "" : (stryCov_9fa48("2251"), "<0.15")).fromTo(terminalRef.current, stryMutAct_9fa48("2252") ? {} : (stryCov_9fa48("2252"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("2253") ? {} : (stryCov_9fa48("2253"), {
          opacity: 1,
          y: 0,
          duration: 0.6
        }), stryMutAct_9fa48("2254") ? "" : (stryCov_9fa48("2254"), "<0.2")).fromTo(descriptionRef.current, stryMutAct_9fa48("2255") ? {} : (stryCov_9fa48("2255"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("2256") ? {} : (stryCov_9fa48("2256"), {
          opacity: 1,
          y: 0,
          duration: 0.6
        }), stryMutAct_9fa48("2257") ? "" : (stryCov_9fa48("2257"), "<0.15")).fromTo(stryMutAct_9fa48("2260") ? buttonsRef.current?.children && [] : stryMutAct_9fa48("2259") ? false : stryMutAct_9fa48("2258") ? true : (stryCov_9fa48("2258", "2259", "2260"), (stryMutAct_9fa48("2261") ? buttonsRef.current.children : (stryCov_9fa48("2261"), buttonsRef.current?.children)) || (stryMutAct_9fa48("2262") ? ["Stryker was here"] : (stryCov_9fa48("2262"), []))), stryMutAct_9fa48("2263") ? {} : (stryCov_9fa48("2263"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("2264") ? {} : (stryCov_9fa48("2264"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1
        }), stryMutAct_9fa48("2265") ? "" : (stryCov_9fa48("2265"), "<0.15")).fromTo(stryMutAct_9fa48("2268") ? statsRef.current?.children && [] : stryMutAct_9fa48("2267") ? false : stryMutAct_9fa48("2266") ? true : (stryCov_9fa48("2266", "2267", "2268"), (stryMutAct_9fa48("2269") ? statsRef.current.children : (stryCov_9fa48("2269"), statsRef.current?.children)) || (stryMutAct_9fa48("2270") ? ["Stryker was here"] : (stryCov_9fa48("2270"), []))), stryMutAct_9fa48("2271") ? {} : (stryCov_9fa48("2271"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("2272") ? {} : (stryCov_9fa48("2272"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1
        }), stryMutAct_9fa48("2273") ? "" : (stryCov_9fa48("2273"), "<0.2")).fromTo(scrollIndicatorRef.current, stryMutAct_9fa48("2274") ? {} : (stryCov_9fa48("2274"), {
          opacity: 0
        }), stryMutAct_9fa48("2275") ? {} : (stryCov_9fa48("2275"), {
          opacity: 1,
          duration: 0.5
        }), stryMutAct_9fa48("2276") ? "" : (stryCov_9fa48("2276"), "<0.2"));

        // Parallax effect on scroll
        if (stryMutAct_9fa48("2278") ? false : stryMutAct_9fa48("2277") ? true : (stryCov_9fa48("2277", "2278"), contentRef.current)) {
          if (stryMutAct_9fa48("2279")) {
            {}
          } else {
            stryCov_9fa48("2279");
            gsap.to(contentRef.current, stryMutAct_9fa48("2280") ? {} : (stryCov_9fa48("2280"), {
              y: stryMutAct_9fa48("2281") ? +100 : (stryCov_9fa48("2281"), -100),
              ease: stryMutAct_9fa48("2282") ? "" : (stryCov_9fa48("2282"), "none"),
              scrollTrigger: stryMutAct_9fa48("2283") ? {} : (stryCov_9fa48("2283"), {
                trigger: contentRef.current,
                start: stryMutAct_9fa48("2284") ? "" : (stryCov_9fa48("2284"), "top top"),
                end: stryMutAct_9fa48("2285") ? "" : (stryCov_9fa48("2285"), "bottom top"),
                scrub: stryMutAct_9fa48("2286") ? false : (stryCov_9fa48("2286"), true)
              })
            }));
          }
        }
      }
    });
    const stats = stryMutAct_9fa48("2287") ? [] : (stryCov_9fa48("2287"), [stryMutAct_9fa48("2288") ? {} : (stryCov_9fa48("2288"), {
      value: 8,
      suffix: stryMutAct_9fa48("2289") ? "" : (stryCov_9fa48("2289"), "+"),
      label: t(stryMutAct_9fa48("2290") ? "" : (stryCov_9fa48("2290"), "stat1"))
    }), stryMutAct_9fa48("2291") ? {} : (stryCov_9fa48("2291"), {
      value: 80,
      suffix: stryMutAct_9fa48("2292") ? "Stryker was here!" : (stryCov_9fa48("2292"), ""),
      label: t(stryMutAct_9fa48("2293") ? "" : (stryCov_9fa48("2293"), "stat2"))
    }), stryMutAct_9fa48("2294") ? {} : (stryCov_9fa48("2294"), {
      value: 38,
      suffix: stryMutAct_9fa48("2295") ? "" : (stryCov_9fa48("2295"), "+"),
      label: t(stryMutAct_9fa48("2296") ? "" : (stryCov_9fa48("2296"), "stat3"))
    })]);
    return <section aria-labelledby="hero-heading" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <HeroGlobe />
      <Spotlight />

      <div className="absolute inset-0" style={stryMutAct_9fa48("2297") ? {} : (stryCov_9fa48("2297"), {
        zIndex: 0
      })}>
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute w-[800px] h-[800px] bg-[#06d6e0]/4 rounded-full blur-[180px] animate-pulse-glow" style={stryMutAct_9fa48("2298") ? {} : (stryCov_9fa48("2298"), {
          top: stryMutAct_9fa48("2299") ? "" : (stryCov_9fa48("2299"), "30%"),
          left: stryMutAct_9fa48("2300") ? "" : (stryCov_9fa48("2300"), "50%"),
          transform: stryMutAct_9fa48("2301") ? "" : (stryCov_9fa48("2301"), "translate(-50%, -50%)")
        })} />
        <div className="absolute w-[500px] h-[500px] bg-[#06d6e0]/3 rounded-full blur-[150px] animate-pulse-glow" style={stryMutAct_9fa48("2302") ? {} : (stryCov_9fa48("2302"), {
          bottom: stryMutAct_9fa48("2303") ? "" : (stryCov_9fa48("2303"), "20%"),
          insetInlineStart: stryMutAct_9fa48("2304") ? "" : (stryCov_9fa48("2304"), "30%"),
          animationDelay: stryMutAct_9fa48("2305") ? "" : (stryCov_9fa48("2305"), "2s")
        })} />
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="w-full h-[1px] bg-gradient-to-l from-transparent via-[#06d6e0]/15 to-transparent" style={stryMutAct_9fa48("2306") ? {} : (stryCov_9fa48("2306"), {
            animation: stryMutAct_9fa48("2307") ? "" : (stryCov_9fa48("2307"), "scan-line 8s linear infinite")
          })} />
        </div>
      </div>

      <div ref={contentRef} className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        <div className="flex flex-col items-center text-center gap-5 md:gap-8">
          <div ref={badgeRef} className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#06d6e0]/20 bg-[#06d6e0]/5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#27ca40] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#27ca40]" />
            </span>
            <span className="text-xs font-mono text-[#06d6e0] tracking-wider">{t(stryMutAct_9fa48("2308") ? "" : (stryCov_9fa48("2308"), "badge"))}</span>
          </div>

          <div ref={headingRef}>
            <h1 id="hero-heading" className="text-[1.75rem] sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.1] tracking-tight text-[hsl(210,40%,98%)]">
              {t(stryMutAct_9fa48("2309") ? "" : (stryCov_9fa48("2309"), "heading1"))}
              <br className="hidden sm:block" />
              <span className="text-gradient-animated">{t(stryMutAct_9fa48("2310") ? "" : (stryCov_9fa48("2310"), "heading2"))}</span>
              {t(stryMutAct_9fa48("2311") ? "" : (stryCov_9fa48("2311"), "heading3"))}
              <span className="relative inline-block">
                <span className="relative z-10 animate-ai-glow">AI</span>
                <span className="absolute inset-0 -m-2 rounded-lg bg-[#06d6e0]/10 blur-xl animate-pulse-glow" />
                <Sparkles className="absolute -top-3 -start-3 w-5 h-5 text-[#06d6e0] animate-pulse" aria-hidden="true" />
                <Sparkles className="absolute -bottom-2 -end-3 w-4 h-4 text-[#0ea5e9] animate-pulse" style={stryMutAct_9fa48("2312") ? {} : (stryCov_9fa48("2312"), {
                  animationDelay: stryMutAct_9fa48("2313") ? "" : (stryCov_9fa48("2313"), "1s")
                })} aria-hidden="true" />
              </span>
            </h1>
          </div>

          <div ref={terminalRef}>
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2.5 md:py-3 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] font-mono max-w-full overflow-hidden">
              <span className="text-[#06d6e0]">{stryMutAct_9fa48("2314") ? "" : (stryCov_9fa48("2314"), ">")}</span>
              <span className="text-[hsl(215,20%,65%)] text-sm md:text-base">
                {stryMutAct_9fa48("2315") ? roles[roleIndex] : (stryCov_9fa48("2315"), roles[roleIndex].slice(0, charIndex))}
              </span>
              <span className="w-[2px] h-5 bg-[#06d6e0]" style={stryMutAct_9fa48("2316") ? {} : (stryCov_9fa48("2316"), {
                animation: stryMutAct_9fa48("2317") ? "" : (stryCov_9fa48("2317"), "typing-cursor 1s step-end infinite")
              })} />
            </div>
          </div>

          <div ref={descriptionRef} className="text-base md:text-xl text-[hsl(215,20%,55%)] max-w-2xl leading-relaxed px-2 md:px-0">
            <TextGenerate words={t(stryMutAct_9fa48("2318") ? "" : (stryCov_9fa48("2318"), "description"))} />
          </div>

          <div ref={buttonsRef} className="flex flex-col sm:flex-row items-center gap-3 md:gap-4 w-full sm:w-auto px-4 sm:px-0">
            <Magnetic strength={0.2}>
              <a href="#projects" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-bold text-[hsl(222,47%,4%)] bg-gradient-to-l from-[#06d6e0] to-[#0abfca] hover:shadow-[0_0_40px_hsl(187,92%,55%,0.4)] transition-all duration-500 w-full sm:w-auto">
                {t(stryMutAct_9fa48("2319") ? "" : (stryCov_9fa48("2319"), "cta1"))}
                <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a href="#services" className="group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-medium text-[hsl(210,40%,98%)] border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] hover:border-[#e84393]/40 hover:shadow-[0_0_30px_hsl(330,85%,60%,0.15)] transition-all duration-500 w-full sm:w-auto">
                <Play className="w-4 h-4 text-[#e84393]" />
                {t(stryMutAct_9fa48("2320") ? "" : (stryCov_9fa48("2320"), "cta2"))}
              </a>
            </Magnetic>
          </div>

          <div ref={statsRef} className="flex items-center gap-8 md:gap-16 mt-4 md:mt-8">
            {stats.map(stryMutAct_9fa48("2321") ? () => undefined : (stryCov_9fa48("2321"), (stat, i) => <div key={i} className="text-center">
                <div className="text-xl md:text-4xl font-bold text-[hsl(210,40%,98%)]">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs font-mono text-[hsl(215,20%,45%)] mt-1">{stat.label}</div>
              </div>))}
          </div>

          <div ref={scrollIndicatorRef} className="mt-8 md:mt-12 hidden md:block">
            <div className="flex flex-col items-center gap-2 animate-float">
              <span className="text-[10px] font-mono text-[hsl(215,20%,48%)] tracking-widest uppercase">scroll</span>
              <div className="w-[1px] h-12 bg-gradient-to-b from-[#06d6e0] to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>;
  }
}