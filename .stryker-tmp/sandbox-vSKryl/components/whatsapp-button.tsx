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
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { Phone, X } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
export function WhatsAppButton() {
  if (stryMutAct_9fa48("3682")) {
    {}
  } else {
    stryCov_9fa48("3682");
    const t = useTranslations(stryMutAct_9fa48("3683") ? "" : (stryCov_9fa48("3683"), "whatsapp"));
    const [tooltip, setTooltip] = useState(stryMutAct_9fa48("3684") ? false : (stryCov_9fa48("3684"), true));
    const buttonRef = useRef<HTMLAnchorElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      if (stryMutAct_9fa48("3685")) {
        {}
      } else {
        stryCov_9fa48("3685");
        const tl = gsap.timeline(stryMutAct_9fa48("3686") ? {} : (stryCov_9fa48("3686"), {
          delay: 2
        }));

        // Button entrance: slide up with bounce
        tl.fromTo(buttonRef.current, stryMutAct_9fa48("3687") ? {} : (stryCov_9fa48("3687"), {
          y: 100,
          opacity: 0,
          scale: 0.8
        }), stryMutAct_9fa48("3688") ? {} : (stryCov_9fa48("3688"), {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: stryMutAct_9fa48("3689") ? "" : (stryCov_9fa48("3689"), "back.out(1.7)")
        }));

        // Tooltip entrance: fade in with slight delay
        if (stryMutAct_9fa48("3691") ? false : stryMutAct_9fa48("3690") ? true : (stryCov_9fa48("3690", "3691"), tooltip)) {
          if (stryMutAct_9fa48("3692")) {
            {}
          } else {
            stryCov_9fa48("3692");
            tl.fromTo(tooltipRef.current, stryMutAct_9fa48("3693") ? {} : (stryCov_9fa48("3693"), {
              x: stryMutAct_9fa48("3694") ? +20 : (stryCov_9fa48("3694"), -20),
              opacity: 0
            }), stryMutAct_9fa48("3695") ? {} : (stryCov_9fa48("3695"), {
              x: 0,
              opacity: 1,
              duration: 0.5,
              ease: stryMutAct_9fa48("3696") ? "" : (stryCov_9fa48("3696"), "power2.out")
            }), stryMutAct_9fa48("3697") ? "" : (stryCov_9fa48("3697"), "-=0.3") // Start 0.3s before button animation ends
            );

            // Auto-hide tooltip after 8 seconds
            setTimeout(() => {
              if (stryMutAct_9fa48("3698")) {
                {}
              } else {
                stryCov_9fa48("3698");
                if (stryMutAct_9fa48("3700") ? false : stryMutAct_9fa48("3699") ? true : (stryCov_9fa48("3699", "3700"), tooltipRef.current)) {
                  if (stryMutAct_9fa48("3701")) {
                    {}
                  } else {
                    stryCov_9fa48("3701");
                    gsap.to(tooltipRef.current, stryMutAct_9fa48("3702") ? {} : (stryCov_9fa48("3702"), {
                      x: stryMutAct_9fa48("3703") ? +20 : (stryCov_9fa48("3703"), -20),
                      opacity: 0,
                      duration: 0.3,
                      ease: stryMutAct_9fa48("3704") ? "" : (stryCov_9fa48("3704"), "power2.in"),
                      onComplete: stryMutAct_9fa48("3705") ? () => undefined : (stryCov_9fa48("3705"), () => setTooltip(stryMutAct_9fa48("3706") ? true : (stryCov_9fa48("3706"), false)))
                    }));
                  }
                }
              }
            }, 8000);
          }
        }
      }
    }, stryMutAct_9fa48("3707") ? {} : (stryCov_9fa48("3707"), {
      scope: containerRef
    }));
    return <div ref={containerRef} className="fixed bottom-4 start-4 md:bottom-6 md:start-6 z-50 flex items-end gap-3">
      {/* Tooltip */}
      {stryMutAct_9fa48("3710") ? tooltip || <div ref={tooltipRef} className="relative opacity-0">
          <div className="relative flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-[hsl(222,47%,7%)] border border-[hsl(215,28%,16%)] shadow-lg max-w-[200px] md:max-w-none">
            <span className="text-xs md:text-sm text-[hsl(210,40%,98%)] leading-snug">{t("tooltip")}</span>
            <button onClick={() => {
            if (tooltipRef.current) {
              gsap.to(tooltipRef.current, {
                x: -20,
                opacity: 0,
                duration: 0.3,
                ease: "power2.in",
                onComplete: () => setTooltip(false)
              });
            }
          }} className="p-0.5 rounded hover:bg-[hsl(215,28%,14%)] transition-colors" aria-label={t("close")}>
              <X className="w-3 h-3 text-[hsl(215,20%,45%)]" />
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute bottom-2 -start-2 w-3 h-3 rotate-45 bg-[hsl(222,47%,7%)] border-b border-s border-[hsl(215,28%,16%)]" />
        </div> : stryMutAct_9fa48("3709") ? false : stryMutAct_9fa48("3708") ? true : (stryCov_9fa48("3708", "3709", "3710"), tooltip && <div ref={tooltipRef} className="relative opacity-0">
          <div className="relative flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl bg-[hsl(222,47%,7%)] border border-[hsl(215,28%,16%)] shadow-lg max-w-[200px] md:max-w-none">
            <span className="text-xs md:text-sm text-[hsl(210,40%,98%)] leading-snug">{t(stryMutAct_9fa48("3711") ? "" : (stryCov_9fa48("3711"), "tooltip"))}</span>
            <button onClick={() => {
            if (stryMutAct_9fa48("3712")) {
              {}
            } else {
              stryCov_9fa48("3712");
              if (stryMutAct_9fa48("3714") ? false : stryMutAct_9fa48("3713") ? true : (stryCov_9fa48("3713", "3714"), tooltipRef.current)) {
                if (stryMutAct_9fa48("3715")) {
                  {}
                } else {
                  stryCov_9fa48("3715");
                  gsap.to(tooltipRef.current, stryMutAct_9fa48("3716") ? {} : (stryCov_9fa48("3716"), {
                    x: stryMutAct_9fa48("3717") ? +20 : (stryCov_9fa48("3717"), -20),
                    opacity: 0,
                    duration: 0.3,
                    ease: stryMutAct_9fa48("3718") ? "" : (stryCov_9fa48("3718"), "power2.in"),
                    onComplete: stryMutAct_9fa48("3719") ? () => undefined : (stryCov_9fa48("3719"), () => setTooltip(stryMutAct_9fa48("3720") ? true : (stryCov_9fa48("3720"), false)))
                  }));
                }
              }
            }
          }} className="p-0.5 rounded hover:bg-[hsl(215,28%,14%)] transition-colors" aria-label={t(stryMutAct_9fa48("3721") ? "" : (stryCov_9fa48("3721"), "close"))}>
              <X className="w-3 h-3 text-[hsl(215,20%,45%)]" />
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute bottom-2 -start-2 w-3 h-3 rotate-45 bg-[hsl(222,47%,7%)] border-b border-s border-[hsl(215,28%,16%)]" />
        </div>)}

      {/* Button */}
      <a ref={buttonRef} href="https://wa.me/972504401760" target="_blank" rel="noreferrer" className="group relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300 opacity-0" aria-label={t(stryMutAct_9fa48("3722") ? "" : (stryCov_9fa48("3722"), "ariaLabel"))}>
        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <Phone className="w-6 h-6 text-white relative z-10" />
      </a>
    </div>;
  }
}