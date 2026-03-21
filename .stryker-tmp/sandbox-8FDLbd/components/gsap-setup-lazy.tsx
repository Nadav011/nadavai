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
import dynamic from "next/dynamic";

// Client component wrapper — dynamic with ssr:false is only valid in Client Components
const GSAPSetupInner = dynamic(stryMutAct_9fa48("1621") ? () => undefined : (stryCov_9fa48("1621"), () => import("@/components/gsap-setup").then(stryMutAct_9fa48("1622") ? () => undefined : (stryCov_9fa48("1622"), m => stryMutAct_9fa48("1623") ? {} : (stryCov_9fa48("1623"), {
  default: m.GSAPSetup
})))), stryMutAct_9fa48("1624") ? {} : (stryCov_9fa48("1624"), {
  ssr: stryMutAct_9fa48("1625") ? true : (stryCov_9fa48("1625"), false)
}));
export function GSAPSetupLazy() {
  if (stryMutAct_9fa48("1626")) {
    {}
  } else {
    stryCov_9fa48("1626");
    return <GSAPSetupInner />;
  }
}