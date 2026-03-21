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
import { useEffect, useRef, useState } from "react";
interface AnimatedCounterProps {
  end: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
}
export function AnimatedCounter({
  end,
  suffix = stryMutAct_9fa48("681") ? "Stryker was here!" : (stryCov_9fa48("681"), ""),
  prefix = stryMutAct_9fa48("682") ? "Stryker was here!" : (stryCov_9fa48("682"), ""),
  duration = 2000
}: AnimatedCounterProps) {
  if (stryMutAct_9fa48("683")) {
    {}
  } else {
    stryCov_9fa48("683");
    const [count, setCount] = useState(0);
    const ref = useRef<HTMLSpanElement>(null);
    const started = useRef(stryMutAct_9fa48("684") ? true : (stryCov_9fa48("684"), false));
    const rafRef = useRef<number>(0);
    useEffect(() => {
      if (stryMutAct_9fa48("685")) {
        {}
      } else {
        stryCov_9fa48("685");
        const observer = new IntersectionObserver(([entry]) => {
          if (stryMutAct_9fa48("686")) {
            {}
          } else {
            stryCov_9fa48("686");
            if (stryMutAct_9fa48("689") ? entry.isIntersecting || !started.current : stryMutAct_9fa48("688") ? false : stryMutAct_9fa48("687") ? true : (stryCov_9fa48("687", "688", "689"), entry.isIntersecting && (stryMutAct_9fa48("690") ? started.current : (stryCov_9fa48("690"), !started.current)))) {
              if (stryMutAct_9fa48("691")) {
                {}
              } else {
                stryCov_9fa48("691");
                started.current = stryMutAct_9fa48("692") ? false : (stryCov_9fa48("692"), true);
                const start = 0;
                const startTime = performance.now();
                const step = (currentTime: number) => {
                  if (stryMutAct_9fa48("693")) {
                    {}
                  } else {
                    stryCov_9fa48("693");
                    const elapsed = stryMutAct_9fa48("694") ? currentTime + startTime : (stryCov_9fa48("694"), currentTime - startTime);
                    const progress = stryMutAct_9fa48("695") ? Math.max(elapsed / duration, 1) : (stryCov_9fa48("695"), Math.min(stryMutAct_9fa48("696") ? elapsed * duration : (stryCov_9fa48("696"), elapsed / duration), 1));
                    const eased = stryMutAct_9fa48("697") ? 1 + Math.pow(1 - progress, 4) : (stryCov_9fa48("697"), 1 - Math.pow(stryMutAct_9fa48("698") ? 1 + progress : (stryCov_9fa48("698"), 1 - progress), 4));
                    setCount(Math.floor(stryMutAct_9fa48("699") ? start - (end - start) * eased : (stryCov_9fa48("699"), start + (stryMutAct_9fa48("700") ? (end - start) / eased : (stryCov_9fa48("700"), (stryMutAct_9fa48("701") ? end + start : (stryCov_9fa48("701"), end - start)) * eased)))));
                    if (stryMutAct_9fa48("705") ? progress >= 1 : stryMutAct_9fa48("704") ? progress <= 1 : stryMutAct_9fa48("703") ? false : stryMutAct_9fa48("702") ? true : (stryCov_9fa48("702", "703", "704", "705"), progress < 1)) {
                      if (stryMutAct_9fa48("706")) {
                        {}
                      } else {
                        stryCov_9fa48("706");
                        rafRef.current = requestAnimationFrame(step);
                      }
                    }
                  }
                };
                rafRef.current = requestAnimationFrame(step);
              }
            }
          }
        }, stryMutAct_9fa48("707") ? {} : (stryCov_9fa48("707"), {
          threshold: 0.5
        }));
        if (stryMutAct_9fa48("709") ? false : stryMutAct_9fa48("708") ? true : (stryCov_9fa48("708", "709"), ref.current)) observer.observe(ref.current);
        return () => {
          if (stryMutAct_9fa48("710")) {
            {}
          } else {
            stryCov_9fa48("710");
            observer.disconnect();
            cancelAnimationFrame(rafRef.current);
          }
        };
      }
    }, stryMutAct_9fa48("711") ? [] : (stryCov_9fa48("711"), [end, duration]));
    return <span ref={ref} className="tabular-nums">
      {prefix}{count}{suffix}
    </span>;
  }
}