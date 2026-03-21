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
import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
if (stryMutAct_9fa48("1629") ? typeof window === "undefined" : stryMutAct_9fa48("1628") ? false : stryMutAct_9fa48("1627") ? true : (stryCov_9fa48("1627", "1628", "1629"), typeof window !== (stryMutAct_9fa48("1630") ? "" : (stryCov_9fa48("1630"), "undefined")))) {
  if (stryMutAct_9fa48("1631")) {
    {}
  } else {
    stryCov_9fa48("1631");
    gsap.registerPlugin(ScrollTrigger);
  }
}
export function GSAPSetup() {
  if (stryMutAct_9fa48("1632")) {
    {}
  } else {
    stryCov_9fa48("1632");
    useEffect(() => {
      if (stryMutAct_9fa48("1633")) {
        {}
      } else {
        stryCov_9fa48("1633");
        const mq = window.matchMedia(stryMutAct_9fa48("1634") ? "" : (stryCov_9fa48("1634"), "(prefers-reduced-motion: reduce)"));
        if (stryMutAct_9fa48("1636") ? false : stryMutAct_9fa48("1635") ? true : (stryCov_9fa48("1635", "1636"), mq.matches)) {
          if (stryMutAct_9fa48("1637")) {
            {}
          } else {
            stryCov_9fa48("1637");
            gsap.globalTimeline.timeScale(20);
            gsap.defaults(stryMutAct_9fa48("1638") ? {} : (stryCov_9fa48("1638"), {
              duration: 0
            }));
          }
        }
        const handleChange = (e: MediaQueryListEvent) => {
          if (stryMutAct_9fa48("1639")) {
            {}
          } else {
            stryCov_9fa48("1639");
            if (stryMutAct_9fa48("1641") ? false : stryMutAct_9fa48("1640") ? true : (stryCov_9fa48("1640", "1641"), e.matches)) {
              if (stryMutAct_9fa48("1642")) {
                {}
              } else {
                stryCov_9fa48("1642");
                gsap.globalTimeline.timeScale(20);
                gsap.defaults(stryMutAct_9fa48("1643") ? {} : (stryCov_9fa48("1643"), {
                  duration: 0
                }));
              }
            } else {
              if (stryMutAct_9fa48("1644")) {
                {}
              } else {
                stryCov_9fa48("1644");
                gsap.globalTimeline.timeScale(1);
                gsap.defaults(stryMutAct_9fa48("1645") ? {} : (stryCov_9fa48("1645"), {
                  duration: 1
                }));
              }
            }
          }
        };
        mq.addEventListener(stryMutAct_9fa48("1646") ? "" : (stryCov_9fa48("1646"), "change"), handleChange);
        return stryMutAct_9fa48("1647") ? () => undefined : (stryCov_9fa48("1647"), () => mq.removeEventListener(stryMutAct_9fa48("1648") ? "" : (stryCov_9fa48("1648"), "change"), handleChange));
      }
    }, stryMutAct_9fa48("1649") ? ["Stryker was here"] : (stryCov_9fa48("1649"), []));
    return null;
  }
}