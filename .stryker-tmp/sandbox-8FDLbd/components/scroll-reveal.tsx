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
import { useRef, type ReactNode } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}
const directionOffsets = stryMutAct_9fa48("2996") ? {} : (stryCov_9fa48("2996"), {
  up: stryMutAct_9fa48("2997") ? {} : (stryCov_9fa48("2997"), {
    y: 40,
    x: 0
  }),
  down: stryMutAct_9fa48("2998") ? {} : (stryCov_9fa48("2998"), {
    y: stryMutAct_9fa48("2999") ? +40 : (stryCov_9fa48("2999"), -40),
    x: 0
  }),
  left: stryMutAct_9fa48("3000") ? {} : (stryCov_9fa48("3000"), {
    x: 40,
    y: 0
  }),
  right: stryMutAct_9fa48("3001") ? {} : (stryCov_9fa48("3001"), {
    x: stryMutAct_9fa48("3002") ? +40 : (stryCov_9fa48("3002"), -40),
    y: 0
  })
});
export function ScrollReveal({
  children,
  className = stryMutAct_9fa48("3003") ? "Stryker was here!" : (stryCov_9fa48("3003"), ""),
  delay = 0,
  direction = stryMutAct_9fa48("3004") ? "" : (stryCov_9fa48("3004"), "up")
}: ScrollRevealProps) {
  if (stryMutAct_9fa48("3005")) {
    {}
  } else {
    stryCov_9fa48("3005");
    const ref = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      if (stryMutAct_9fa48("3006")) {
        {}
      } else {
        stryCov_9fa48("3006");
        if (stryMutAct_9fa48("3009") ? false : stryMutAct_9fa48("3008") ? true : stryMutAct_9fa48("3007") ? ref.current : (stryCov_9fa48("3007", "3008", "3009"), !ref.current)) return;
        const offset = directionOffsets[direction];
        gsap.from(ref.current, stryMutAct_9fa48("3010") ? {} : (stryCov_9fa48("3010"), {
          opacity: 0,
          x: offset.x,
          y: offset.y,
          duration: 0.8,
          delay: stryMutAct_9fa48("3011") ? delay * 1000 : (stryCov_9fa48("3011"), delay / 1000),
          ease: stryMutAct_9fa48("3012") ? "" : (stryCov_9fa48("3012"), "expo.out"),
          scrollTrigger: stryMutAct_9fa48("3013") ? {} : (stryCov_9fa48("3013"), {
            trigger: ref.current,
            start: stryMutAct_9fa48("3014") ? "" : (stryCov_9fa48("3014"), "top 85%"),
            once: stryMutAct_9fa48("3015") ? false : (stryCov_9fa48("3015"), true)
          })
        }));
      }
    }, stryMutAct_9fa48("3016") ? {} : (stryCov_9fa48("3016"), {
      scope: ref
    }));
    return <div ref={ref} className={className}>
      {children}
    </div>;
  }
}