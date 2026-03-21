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
import { useState, useEffect, useRef, useMemo } from "react";
import { Zap, ExternalLink } from "lucide-react";
import { Magnetic } from "./magnetic";
import { CommandPalette } from "./command-palette";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
export function Navbar() {
  if (stryMutAct_9fa48("2344")) {
    {}
  } else {
    stryCov_9fa48("2344");
    const t = useTranslations(stryMutAct_9fa48("2345") ? "" : (stryCov_9fa48("2345"), "nav"));
    const tCommon = useTranslations(stryMutAct_9fa48("2346") ? "" : (stryCov_9fa48("2346"), "common"));
    const locale = useLocale();
    const [scrolled, setScrolled] = useState(stryMutAct_9fa48("2347") ? true : (stryCov_9fa48("2347"), false));
    const [mobileOpen, setMobileOpen] = useState(stryMutAct_9fa48("2348") ? true : (stryCov_9fa48("2348"), false));
    const [activeSection, setActiveSection] = useState(stryMutAct_9fa48("2349") ? "Stryker was here!" : (stryCov_9fa48("2349"), ""));
    const [indicatorStyle, setIndicatorStyle] = useState(stryMutAct_9fa48("2350") ? {} : (stryCov_9fa48("2350"), {
      width: 0,
      left: 0
    }));
    const navRef = useRef<HTMLDivElement>(null);
    const mobileMenuRef = useRef<HTMLDivElement>(null);
    const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
    const navLinks = useMemo(stryMutAct_9fa48("2351") ? () => undefined : (stryCov_9fa48("2351"), () => stryMutAct_9fa48("2352") ? [] : (stryCov_9fa48("2352"), [stryMutAct_9fa48("2353") ? {} : (stryCov_9fa48("2353"), {
      label: t(stryMutAct_9fa48("2354") ? "" : (stryCov_9fa48("2354"), "projects")),
      href: stryMutAct_9fa48("2355") ? "" : (stryCov_9fa48("2355"), "#projects"),
      badge: stryMutAct_9fa48("2356") ? "" : (stryCov_9fa48("2356"), "8")
    }), stryMutAct_9fa48("2357") ? {} : (stryCov_9fa48("2357"), {
      label: t(stryMutAct_9fa48("2358") ? "" : (stryCov_9fa48("2358"), "services")),
      href: stryMutAct_9fa48("2359") ? "" : (stryCov_9fa48("2359"), "#services"),
      hot: stryMutAct_9fa48("2360") ? false : (stryCov_9fa48("2360"), true)
    }), stryMutAct_9fa48("2361") ? {} : (stryCov_9fa48("2361"), {
      label: t(stryMutAct_9fa48("2362") ? "" : (stryCov_9fa48("2362"), "blog")),
      href: stryMutAct_9fa48("2363") ? "" : (stryCov_9fa48("2363"), "#blog")
    }), stryMutAct_9fa48("2364") ? {} : (stryCov_9fa48("2364"), {
      label: t(stryMutAct_9fa48("2365") ? "" : (stryCov_9fa48("2365"), "youtube")),
      href: stryMutAct_9fa48("2366") ? "" : (stryCov_9fa48("2366"), "#youtube")
    }), stryMutAct_9fa48("2367") ? {} : (stryCov_9fa48("2367"), {
      label: t(stryMutAct_9fa48("2368") ? "" : (stryCov_9fa48("2368"), "guides")),
      href: stryMutAct_9fa48("2369") ? "" : (stryCov_9fa48("2369"), "#guides")
    }), stryMutAct_9fa48("2370") ? {} : (stryCov_9fa48("2370"), {
      label: t(stryMutAct_9fa48("2371") ? "" : (stryCov_9fa48("2371"), "resources")),
      href: stryMutAct_9fa48("2372") ? "" : (stryCov_9fa48("2372"), "#resources"),
      badge: stryMutAct_9fa48("2373") ? "" : (stryCov_9fa48("2373"), "FREE")
    }), stryMutAct_9fa48("2374") ? {} : (stryCov_9fa48("2374"), {
      label: t(stryMutAct_9fa48("2375") ? "" : (stryCov_9fa48("2375"), "news")),
      href: stryMutAct_9fa48("2376") ? "" : (stryCov_9fa48("2376"), "#news")
    }), stryMutAct_9fa48("2377") ? {} : (stryCov_9fa48("2377"), {
      label: t(stryMutAct_9fa48("2378") ? "" : (stryCov_9fa48("2378"), "contact")),
      href: stryMutAct_9fa48("2379") ? "" : (stryCov_9fa48("2379"), "#contact")
    })])), stryMutAct_9fa48("2380") ? [] : (stryCov_9fa48("2380"), [t]));
    useEffect(() => {
      if (stryMutAct_9fa48("2381")) {
        {}
      } else {
        stryCov_9fa48("2381");
        const handleScroll = () => {
          if (stryMutAct_9fa48("2382")) {
            {}
          } else {
            stryCov_9fa48("2382");
            setScrolled(stryMutAct_9fa48("2386") ? window.scrollY <= 20 : stryMutAct_9fa48("2385") ? window.scrollY >= 20 : stryMutAct_9fa48("2384") ? false : stryMutAct_9fa48("2383") ? true : (stryCov_9fa48("2383", "2384", "2385", "2386"), window.scrollY > 20));
            const sections = navLinks.map(stryMutAct_9fa48("2387") ? () => undefined : (stryCov_9fa48("2387"), l => l.href.replace(stryMutAct_9fa48("2388") ? "" : (stryCov_9fa48("2388"), "#"), stryMutAct_9fa48("2389") ? "Stryker was here!" : (stryCov_9fa48("2389"), ""))));
            for (const section of stryMutAct_9fa48("2390") ? [...sections] : (stryCov_9fa48("2390"), (stryMutAct_9fa48("2391") ? [] : (stryCov_9fa48("2391"), [...sections])).reverse())) {
              if (stryMutAct_9fa48("2392")) {
                {}
              } else {
                stryCov_9fa48("2392");
                const el = document.getElementById(section);
                if (stryMutAct_9fa48("2395") ? el || window.scrollY >= el.offsetTop - 200 : stryMutAct_9fa48("2394") ? false : stryMutAct_9fa48("2393") ? true : (stryCov_9fa48("2393", "2394", "2395"), el && (stryMutAct_9fa48("2398") ? window.scrollY < el.offsetTop - 200 : stryMutAct_9fa48("2397") ? window.scrollY > el.offsetTop - 200 : stryMutAct_9fa48("2396") ? true : (stryCov_9fa48("2396", "2397", "2398"), window.scrollY >= (stryMutAct_9fa48("2399") ? el.offsetTop + 200 : (stryCov_9fa48("2399"), el.offsetTop - 200)))))) {
                  if (stryMutAct_9fa48("2400")) {
                    {}
                  } else {
                    stryCov_9fa48("2400");
                    setActiveSection(section);
                    break;
                  }
                }
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("2401") ? "" : (stryCov_9fa48("2401"), "scroll"), handleScroll, stryMutAct_9fa48("2402") ? {} : (stryCov_9fa48("2402"), {
          passive: stryMutAct_9fa48("2403") ? false : (stryCov_9fa48("2403"), true)
        }));
        return stryMutAct_9fa48("2404") ? () => undefined : (stryCov_9fa48("2404"), () => window.removeEventListener(stryMutAct_9fa48("2405") ? "" : (stryCov_9fa48("2405"), "scroll"), handleScroll));
      }
    }, stryMutAct_9fa48("2406") ? ["Stryker was here"] : (stryCov_9fa48("2406"), []));
    useEffect(() => {
      if (stryMutAct_9fa48("2407")) {
        {}
      } else {
        stryCov_9fa48("2407");
        if (stryMutAct_9fa48("2410") ? !navRef.current && !activeSection : stryMutAct_9fa48("2409") ? false : stryMutAct_9fa48("2408") ? true : (stryCov_9fa48("2408", "2409", "2410"), (stryMutAct_9fa48("2411") ? navRef.current : (stryCov_9fa48("2411"), !navRef.current)) || (stryMutAct_9fa48("2412") ? activeSection : (stryCov_9fa48("2412"), !activeSection)))) return;
        const activeEl = navRef.current.querySelector(`[data-section="${activeSection}"]`) as HTMLElement;
        if (stryMutAct_9fa48("2414") ? false : stryMutAct_9fa48("2413") ? true : (stryCov_9fa48("2413", "2414"), activeEl)) {
          if (stryMutAct_9fa48("2415")) {
            {}
          } else {
            stryCov_9fa48("2415");
            setIndicatorStyle(stryMutAct_9fa48("2416") ? {} : (stryCov_9fa48("2416"), {
              width: activeEl.offsetWidth,
              left: activeEl.offsetLeft
            }));
          }
        }
      }
    }, stryMutAct_9fa48("2417") ? [] : (stryCov_9fa48("2417"), [activeSection]));

    // Escape key handler for mobile menu
    useEffect(() => {
      if (stryMutAct_9fa48("2418")) {
        {}
      } else {
        stryCov_9fa48("2418");
        if (stryMutAct_9fa48("2421") ? false : stryMutAct_9fa48("2420") ? true : stryMutAct_9fa48("2419") ? mobileOpen : (stryCov_9fa48("2419", "2420", "2421"), !mobileOpen)) return;
        const onKey = (e: KeyboardEvent) => {
          if (stryMutAct_9fa48("2422")) {
            {}
          } else {
            stryCov_9fa48("2422");
            if (stryMutAct_9fa48("2425") ? e.key !== 'Escape' : stryMutAct_9fa48("2424") ? false : stryMutAct_9fa48("2423") ? true : (stryCov_9fa48("2423", "2424", "2425"), e.key === (stryMutAct_9fa48("2426") ? "" : (stryCov_9fa48("2426"), 'Escape')))) {
              if (stryMutAct_9fa48("2427")) {
                {}
              } else {
                stryCov_9fa48("2427");
                setMobileOpen(stryMutAct_9fa48("2428") ? true : (stryCov_9fa48("2428"), false));
                stryMutAct_9fa48("2429") ? hamburgerButtonRef.current.focus() : (stryCov_9fa48("2429"), hamburgerButtonRef.current?.focus());
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("2430") ? "" : (stryCov_9fa48("2430"), 'keydown'), onKey);
        return stryMutAct_9fa48("2431") ? () => undefined : (stryCov_9fa48("2431"), () => window.removeEventListener(stryMutAct_9fa48("2432") ? "" : (stryCov_9fa48("2432"), 'keydown'), onKey));
      }
    }, stryMutAct_9fa48("2433") ? [] : (stryCov_9fa48("2433"), [mobileOpen]));

    // Focus trap for mobile menu
    useEffect(() => {
      if (stryMutAct_9fa48("2434")) {
        {}
      } else {
        stryCov_9fa48("2434");
        if (stryMutAct_9fa48("2437") ? !mobileOpen && !mobileMenuRef.current : stryMutAct_9fa48("2436") ? false : stryMutAct_9fa48("2435") ? true : (stryCov_9fa48("2435", "2436", "2437"), (stryMutAct_9fa48("2438") ? mobileOpen : (stryCov_9fa48("2438"), !mobileOpen)) || (stryMutAct_9fa48("2439") ? mobileMenuRef.current : (stryCov_9fa48("2439"), !mobileMenuRef.current)))) return;
        const focusableElements = mobileMenuRef.current.querySelectorAll(stryMutAct_9fa48("2440") ? "" : (stryCov_9fa48("2440"), 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'));
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
        const handleTabKey = (e: KeyboardEvent) => {
          if (stryMutAct_9fa48("2441")) {
            {}
          } else {
            stryCov_9fa48("2441");
            if (stryMutAct_9fa48("2444") ? e.key === 'Tab' : stryMutAct_9fa48("2443") ? false : stryMutAct_9fa48("2442") ? true : (stryCov_9fa48("2442", "2443", "2444"), e.key !== (stryMutAct_9fa48("2445") ? "" : (stryCov_9fa48("2445"), 'Tab')))) return;
            if (stryMutAct_9fa48("2447") ? false : stryMutAct_9fa48("2446") ? true : (stryCov_9fa48("2446", "2447"), e.shiftKey)) {
              if (stryMutAct_9fa48("2448")) {
                {}
              } else {
                stryCov_9fa48("2448");
                if (stryMutAct_9fa48("2451") ? document.activeElement !== firstElement : stryMutAct_9fa48("2450") ? false : stryMutAct_9fa48("2449") ? true : (stryCov_9fa48("2449", "2450", "2451"), document.activeElement === firstElement)) {
                  if (stryMutAct_9fa48("2452")) {
                    {}
                  } else {
                    stryCov_9fa48("2452");
                    e.preventDefault();
                    stryMutAct_9fa48("2453") ? lastElement.focus() : (stryCov_9fa48("2453"), lastElement?.focus());
                  }
                }
              }
            } else {
              if (stryMutAct_9fa48("2454")) {
                {}
              } else {
                stryCov_9fa48("2454");
                if (stryMutAct_9fa48("2457") ? document.activeElement !== lastElement : stryMutAct_9fa48("2456") ? false : stryMutAct_9fa48("2455") ? true : (stryCov_9fa48("2455", "2456", "2457"), document.activeElement === lastElement)) {
                  if (stryMutAct_9fa48("2458")) {
                    {}
                  } else {
                    stryCov_9fa48("2458");
                    e.preventDefault();
                    stryMutAct_9fa48("2459") ? firstElement.focus() : (stryCov_9fa48("2459"), firstElement?.focus());
                  }
                }
              }
            }
          }
        };
        document.addEventListener(stryMutAct_9fa48("2460") ? "" : (stryCov_9fa48("2460"), 'keydown'), handleTabKey);
        stryMutAct_9fa48("2461") ? firstElement.focus() : (stryCov_9fa48("2461"), firstElement?.focus());
        return stryMutAct_9fa48("2462") ? () => undefined : (stryCov_9fa48("2462"), () => document.removeEventListener(stryMutAct_9fa48("2463") ? "" : (stryCov_9fa48("2463"), 'keydown'), handleTabKey));
      }
    }, stryMutAct_9fa48("2464") ? [] : (stryCov_9fa48("2464"), [mobileOpen]));
    return <>
      <nav className={stryMutAct_9fa48("2465") ? `` : (stryCov_9fa48("2465"), `fixed top-0 inset-x-0 z-50 transition-all duration-700 ${scrolled ? stryMutAct_9fa48("2466") ? "" : (stryCov_9fa48("2466"), "py-2") : stryMutAct_9fa48("2467") ? "" : (stryCov_9fa48("2467"), "py-4")}`)}>
        <div className={stryMutAct_9fa48("2468") ? `` : (stryCov_9fa48("2468"), `absolute inset-0 transition-all duration-700 ${scrolled ? stryMutAct_9fa48("2469") ? "" : (stryCov_9fa48("2469"), "bg-[hsl(222,47%,4%)/0.88] backdrop-blur-2xl shadow-[0_4px_40px_rgba(0,0,0,0.4)] border-b border-[hsl(215,28%,16%)/0.5]") : stryMutAct_9fa48("2470") ? "" : (stryCov_9fa48("2470"), "bg-transparent")}`)} />

        <div className="relative max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between">
          <a href="#" className="flex items-center gap-3 group relative">
            <div className="relative">
              <div className="absolute inset-0 bg-[#06d6e0]/20 rounded-xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#06d6e0] to-[#e84393] p-[1.5px] group-hover:shadow-[0_0_25px_hsl(187,92%,55%,0.3)] transition-shadow duration-500">
                <div className="flex items-center justify-center w-full h-full rounded-[9px] bg-[hsl(222,47%,4%)] group-hover:bg-[hsl(222,47%,5%)] transition-colors">
                  <Zap className="w-5 h-5 text-[#06d6e0] group-hover:text-[#e84393] transition-colors duration-500" />
                </div>
              </div>
              <div className="absolute -bottom-0.5 -end-0.5 w-3 h-3 rounded-full bg-[hsl(222,47%,4%)] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#27ca40] animate-pulse" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[hsl(210,40%,98%)] leading-none">
                NADAV<span className="text-gradient">.AI</span>
              </span>
              <span className="text-[9px] font-mono text-[hsl(215,20%,48%)] tracking-[0.25em] uppercase mt-0.5">
                {t(stryMutAct_9fa48("2471") ? "" : (stryCov_9fa48("2471"), "logoSubtitle"))}
              </span>
            </div>
          </a>

          <div ref={navRef} className="hidden lg:flex items-center gap-0.5 relative">
            <div className="absolute bottom-0 h-[2px] rounded-full bg-gradient-to-l from-[#06d6e0] to-[#e84393] transition-all duration-500 ease-out" style={stryMutAct_9fa48("2472") ? {} : (stryCov_9fa48("2472"), {
              width: stryMutAct_9fa48("2473") ? `` : (stryCov_9fa48("2473"), `${indicatorStyle.width}px`),
              left: stryMutAct_9fa48("2474") ? `` : (stryCov_9fa48("2474"), `${indicatorStyle.left}px`),
              opacity: activeSection ? 1 : 0
            })} />

            {navLinks.map(link => {
              if (stryMutAct_9fa48("2475")) {
                {}
              } else {
                stryCov_9fa48("2475");
                const section = link.href.replace(stryMutAct_9fa48("2476") ? "" : (stryCov_9fa48("2476"), "#"), stryMutAct_9fa48("2477") ? "Stryker was here!" : (stryCov_9fa48("2477"), ""));
                const isActive = stryMutAct_9fa48("2480") ? activeSection !== section : stryMutAct_9fa48("2479") ? false : stryMutAct_9fa48("2478") ? true : (stryCov_9fa48("2478", "2479", "2480"), activeSection === section);
                return <Magnetic key={link.href} strength={0.12}>
                  <a href={link.href} data-section={section} className={stryMutAct_9fa48("2481") ? `` : (stryCov_9fa48("2481"), `relative px-4 py-2.5 text-sm transition-all duration-300 group/link ${isActive ? stryMutAct_9fa48("2482") ? "" : (stryCov_9fa48("2482"), "text-[hsl(210,40%,98%)]") : stryMutAct_9fa48("2483") ? "" : (stryCov_9fa48("2483"), "text-[hsl(215,20%,55%)] hover:text-[hsl(210,40%,90%)]")}`)}>
                    <span className="relative">
                      {link.label}
                      {stryMutAct_9fa48("2486") ? link.badge || <span className="absolute -top-2.5 -start-3 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#06d6e0]/15 text-[#06d6e0] border border-[#06d6e0]/25 leading-none">
                          {link.badge}
                        </span> : stryMutAct_9fa48("2485") ? false : stryMutAct_9fa48("2484") ? true : (stryCov_9fa48("2484", "2485", "2486"), link.badge && <span className="absolute -top-2.5 -start-3 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-[#06d6e0]/15 text-[#06d6e0] border border-[#06d6e0]/25 leading-none">
                          {link.badge}
                        </span>)}
                      {stryMutAct_9fa48("2489") ? link.hot || <span className="absolute -top-1.5 -start-1.5 w-2 h-2 rounded-full bg-[#e84393] animate-pulse" /> : stryMutAct_9fa48("2488") ? false : stryMutAct_9fa48("2487") ? true : (stryCov_9fa48("2487", "2488", "2489"), link.hot && <span className="absolute -top-1.5 -start-1.5 w-2 h-2 rounded-full bg-[#e84393] animate-pulse" />)}
                    </span>
                  </a>
                </Magnetic>;
              }
            })}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <CommandPalette />
            {/* Language switcher */}
            <Link href="/" locale={(stryMutAct_9fa48("2492") ? locale !== "he" : stryMutAct_9fa48("2491") ? false : stryMutAct_9fa48("2490") ? true : (stryCov_9fa48("2490", "2491", "2492"), locale === (stryMutAct_9fa48("2493") ? "" : (stryCov_9fa48("2493"), "he")))) ? stryMutAct_9fa48("2494") ? "" : (stryCov_9fa48("2494"), "en") : stryMutAct_9fa48("2495") ? "" : (stryCov_9fa48("2495"), "he")} className="px-2.5 py-1.5 rounded-lg border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] text-[hsl(215,20%,50%)] hover:border-[#06d6e0]/30 hover:text-[hsl(210,40%,98%)] transition-all text-xs font-mono font-bold">
              {tCommon(stryMutAct_9fa48("2496") ? "" : (stryCov_9fa48("2496"), "langSwitch"))}
            </Link>
            <a href="https://github.com/Nadav011" target="_blank" rel="noreferrer" className="p-2.5 rounded-lg text-[hsl(215,20%,50%)] hover:text-[hsl(210,40%,98%)] hover:bg-[hsl(215,28%,12%)] transition-all" aria-label={tCommon(stryMutAct_9fa48("2497") ? "" : (stryCov_9fa48("2497"), "githubAriaLabel"))}>
              <ExternalLink className="w-4 h-4" />
            </a>
            <Magnetic strength={0.2}>
              <a href="#contact" className="relative group/cta inline-flex items-center gap-2.5 px-6 py-2.5 rounded-xl text-sm font-bold overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-[#06d6e0] to-[#0abfca] transition-all duration-500 group-hover/cta:shadow-[0_0_30px_hsl(187,92%,55%,0.4)]" />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-white/20 to-transparent -translate-x-full group-hover/cta:translate-x-full transition-transform duration-1000" />
                <span className="relative flex items-center gap-2.5 text-[hsl(222,47%,4%)]">
                  <span className="relative w-2 h-2">
                    <span className="absolute inset-0 rounded-full bg-[hsl(222,47%,4%)] animate-ping opacity-40" />
                    <span className="relative block w-2 h-2 rounded-full bg-[hsl(222,47%,4%)]" />
                  </span>
                  {t(stryMutAct_9fa48("2498") ? "" : (stryCov_9fa48("2498"), "cta"))}
                </span>
              </a>
            </Magnetic>
          </div>

          <button ref={hamburgerButtonRef} onClick={stryMutAct_9fa48("2499") ? () => undefined : (stryCov_9fa48("2499"), () => setMobileOpen(stryMutAct_9fa48("2500") ? mobileOpen : (stryCov_9fa48("2500"), !mobileOpen)))} className="lg:hidden relative p-2.5 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,6%)] text-[hsl(210,40%,98%)] hover:border-[#06d6e0]/30 transition-all" aria-label={mobileOpen ? t(stryMutAct_9fa48("2501") ? "" : (stryCov_9fa48("2501"), "closeMenu")) : t(stryMutAct_9fa48("2502") ? "" : (stryCov_9fa48("2502"), "toggleMenu"))} aria-expanded={mobileOpen} aria-controls="mobile-menu">
            <div className="relative w-5 h-5 flex items-center justify-center">
              <span className={stryMutAct_9fa48("2503") ? `` : (stryCov_9fa48("2503"), `absolute block w-5 h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? stryMutAct_9fa48("2504") ? "" : (stryCov_9fa48("2504"), "rotate-45") : stryMutAct_9fa48("2505") ? "" : (stryCov_9fa48("2505"), "-translate-y-1.5")}`)} />
              <span className={stryMutAct_9fa48("2506") ? `` : (stryCov_9fa48("2506"), `absolute block w-5 h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? stryMutAct_9fa48("2507") ? "" : (stryCov_9fa48("2507"), "opacity-0 scale-0") : stryMutAct_9fa48("2508") ? "" : (stryCov_9fa48("2508"), "opacity-100")}`)} />
              <span className={stryMutAct_9fa48("2509") ? `` : (stryCov_9fa48("2509"), `absolute block w-5 h-[1.5px] bg-current transition-all duration-300 ${mobileOpen ? stryMutAct_9fa48("2510") ? "" : (stryCov_9fa48("2510"), "-rotate-45") : stryMutAct_9fa48("2511") ? "" : (stryCov_9fa48("2511"), "translate-y-1.5")}`)} />
            </div>
          </button>
        </div>
      </nav>

      <div id="mobile-menu" ref={mobileMenuRef} role="dialog" aria-modal="true" aria-label={t(stryMutAct_9fa48("2512") ? "" : (stryCov_9fa48("2512"), "mobileNavigation"))} className={stryMutAct_9fa48("2513") ? `` : (stryCov_9fa48("2513"), `fixed inset-0 z-40 lg:hidden transition-all duration-500 ${mobileOpen ? stryMutAct_9fa48("2514") ? "" : (stryCov_9fa48("2514"), "opacity-100 pointer-events-auto") : stryMutAct_9fa48("2515") ? "" : (stryCov_9fa48("2515"), "opacity-0 pointer-events-none")}`)}>
        <div className="absolute inset-0 bg-[hsl(222,47%,3%)/0.98] backdrop-blur-2xl" />
        <div className="relative pt-24 px-6 h-full flex flex-col overflow-y-auto">
          <div className="flex flex-col gap-2 flex-1">
            {navLinks.map(stryMutAct_9fa48("2516") ? () => undefined : (stryCov_9fa48("2516"), (link, i) => <a key={link.href} href={link.href} onClick={stryMutAct_9fa48("2517") ? () => undefined : (stryCov_9fa48("2517"), () => setMobileOpen(stryMutAct_9fa48("2518") ? true : (stryCov_9fa48("2518"), false)))} className={stryMutAct_9fa48("2519") ? `` : (stryCov_9fa48("2519"), `flex items-center justify-between p-4 rounded-xl border border-[hsl(215,28%,14%)] bg-[hsl(222,47%,5%)] text-[hsl(210,40%,98%)] hover:border-[#06d6e0]/30 transition-all duration-300 ${mobileOpen ? stryMutAct_9fa48("2520") ? "" : (stryCov_9fa48("2520"), "translate-y-0 opacity-100") : stryMutAct_9fa48("2521") ? "" : (stryCov_9fa48("2521"), "translate-y-4 opacity-0")}`)} style={stryMutAct_9fa48("2522") ? {} : (stryCov_9fa48("2522"), {
              transitionDelay: mobileOpen ? stryMutAct_9fa48("2523") ? `` : (stryCov_9fa48("2523"), `${stryMutAct_9fa48("2524") ? i * 60 - 100 : (stryCov_9fa48("2524"), (stryMutAct_9fa48("2525") ? i / 60 : (stryCov_9fa48("2525"), i * 60)) + 100)}ms`) : stryMutAct_9fa48("2526") ? "" : (stryCov_9fa48("2526"), "0ms")
            })}>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-mono text-[#06d6e0] w-6">0{stryMutAct_9fa48("2527") ? i - 1 : (stryCov_9fa48("2527"), i + 1)}</span>
                  <span className="font-medium">{link.label}</span>
                </div>
                {stryMutAct_9fa48("2530") ? link.badge || <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#06d6e0]/10 text-[#06d6e0] border border-[#06d6e0]/20">{link.badge}</span> : stryMutAct_9fa48("2529") ? false : stryMutAct_9fa48("2528") ? true : (stryCov_9fa48("2528", "2529", "2530"), link.badge && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#06d6e0]/10 text-[#06d6e0] border border-[#06d6e0]/20">{link.badge}</span>)}
                {stryMutAct_9fa48("2533") ? link.hot || <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e84393]/10 text-[#e84393] border border-[#e84393]/20">HOT</span> : stryMutAct_9fa48("2532") ? false : stryMutAct_9fa48("2531") ? true : (stryCov_9fa48("2531", "2532", "2533"), link.hot && <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#e84393]/10 text-[#e84393] border border-[#e84393]/20">HOT</span>)}
              </a>))}
          </div>
          <div className="pb-8 space-y-3">
            {/* Language switcher mobile */}
            <Link href="/" locale={(stryMutAct_9fa48("2536") ? locale !== "he" : stryMutAct_9fa48("2535") ? false : stryMutAct_9fa48("2534") ? true : (stryCov_9fa48("2534", "2535", "2536"), locale === (stryMutAct_9fa48("2537") ? "" : (stryCov_9fa48("2537"), "he")))) ? stryMutAct_9fa48("2538") ? "" : (stryCov_9fa48("2538"), "en") : stryMutAct_9fa48("2539") ? "" : (stryCov_9fa48("2539"), "he")} onClick={stryMutAct_9fa48("2540") ? () => undefined : (stryCov_9fa48("2540"), () => setMobileOpen(stryMutAct_9fa48("2541") ? true : (stryCov_9fa48("2541"), false)))} className="flex items-center justify-center gap-2 w-full p-3 rounded-xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,6%)] text-sm font-mono font-bold text-[hsl(215,20%,60%)]">
              {tCommon(stryMutAct_9fa48("2542") ? "" : (stryCov_9fa48("2542"), "langSwitch"))}
            </Link>
            <a href="#contact" onClick={stryMutAct_9fa48("2543") ? () => undefined : (stryCov_9fa48("2543"), () => setMobileOpen(stryMutAct_9fa48("2544") ? true : (stryCov_9fa48("2544"), false)))} className="flex items-center justify-center gap-2.5 w-full p-4 rounded-xl bg-gradient-to-l from-[#06d6e0] to-[#0abfca] text-[hsl(222,47%,4%)] font-bold text-lg">
              <span className="w-2 h-2 rounded-full bg-[hsl(222,47%,4%)] animate-pulse" />
              {t(stryMutAct_9fa48("2545") ? "" : (stryCov_9fa48("2545"), "cta"))}
            </a>
          </div>
        </div>
      </div>
    </>;
  }
}