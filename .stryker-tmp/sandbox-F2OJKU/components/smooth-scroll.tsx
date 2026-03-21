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
import type { ReactNode } from "react";
import { useEffect, useState } from "react";

// Native CSS-only smooth scroll using scroll-behavior
function SmoothScrollCSS({
  children
}: {
  children: ReactNode;
}) {
  if (stryMutAct_9fa48("3320")) {
    {}
  } else {
    stryCov_9fa48("3320");
    useEffect(() => {
      if (stryMutAct_9fa48("3321")) {
        {}
      } else {
        stryCov_9fa48("3321");
        // Enable native smooth scrolling
        document.documentElement.style.scrollBehavior = stryMutAct_9fa48("3322") ? "" : (stryCov_9fa48("3322"), "smooth");
        return () => {
          if (stryMutAct_9fa48("3323")) {
            {}
          } else {
            stryCov_9fa48("3323");
            document.documentElement.style.scrollBehavior = stryMutAct_9fa48("3324") ? "" : (stryCov_9fa48("3324"), "auto");
          }
        };
      }
    }, stryMutAct_9fa48("3325") ? ["Stryker was here"] : (stryCov_9fa48("3325"), []));
    return <>{children}</>;
  }
}

// Check for reduced motion preference — lazy initializer avoids synchronous setState in effect
function usePrefersReducedMotion() {
  if (stryMutAct_9fa48("3326")) {
    {}
  } else {
    stryCov_9fa48("3326");
    const [reduced, setReduced] = useState(stryMutAct_9fa48("3327") ? () => undefined : (stryCov_9fa48("3327"), () => stryMutAct_9fa48("3330") ? typeof window !== "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches : stryMutAct_9fa48("3329") ? false : stryMutAct_9fa48("3328") ? true : (stryCov_9fa48("3328", "3329", "3330"), (stryMutAct_9fa48("3332") ? typeof window === "undefined" : stryMutAct_9fa48("3331") ? true : (stryCov_9fa48("3331", "3332"), typeof window !== (stryMutAct_9fa48("3333") ? "" : (stryCov_9fa48("3333"), "undefined")))) && window.matchMedia(stryMutAct_9fa48("3334") ? "" : (stryCov_9fa48("3334"), "(prefers-reduced-motion: reduce)")).matches)));
    useEffect(() => {
      if (stryMutAct_9fa48("3335")) {
        {}
      } else {
        stryCov_9fa48("3335");
        const mq = window.matchMedia(stryMutAct_9fa48("3336") ? "" : (stryCov_9fa48("3336"), "(prefers-reduced-motion: reduce)"));
        const handler = stryMutAct_9fa48("3337") ? () => undefined : (stryCov_9fa48("3337"), (() => {
          const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
          return handler;
        })());
        mq.addEventListener(stryMutAct_9fa48("3338") ? "" : (stryCov_9fa48("3338"), "change"), handler);
        return stryMutAct_9fa48("3339") ? () => undefined : (stryCov_9fa48("3339"), () => mq.removeEventListener(stryMutAct_9fa48("3340") ? "" : (stryCov_9fa48("3340"), "change"), handler));
      }
    }, stryMutAct_9fa48("3341") ? ["Stryker was here"] : (stryCov_9fa48("3341"), []));
    return reduced;
  }
}
export function SmoothScroll({
  children
}: {
  children: ReactNode;
}) {
  if (stryMutAct_9fa48("3342")) {
    {}
  } else {
    stryCov_9fa48("3342");
    const reducedMotion = usePrefersReducedMotion();
    if (stryMutAct_9fa48("3344") ? false : stryMutAct_9fa48("3343") ? true : (stryCov_9fa48("3343", "3344"), reducedMotion)) {
      if (stryMutAct_9fa48("3345")) {
        {}
      } else {
        stryCov_9fa48("3345");
        return <>{children}</>;
      }
    }
    return <SmoothScrollCSS>{children}</SmoothScrollCSS>;
  }
}