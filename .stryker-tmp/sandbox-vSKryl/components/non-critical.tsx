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
const Particles = dynamic(stryMutAct_9fa48("2588") ? () => undefined : (stryCov_9fa48("2588"), () => import("@/components/particles").then(stryMutAct_9fa48("2589") ? () => undefined : (stryCov_9fa48("2589"), mod => stryMutAct_9fa48("2590") ? {} : (stryCov_9fa48("2590"), {
  default: mod.Particles
})))), stryMutAct_9fa48("2591") ? {} : (stryCov_9fa48("2591"), {
  ssr: stryMutAct_9fa48("2592") ? true : (stryCov_9fa48("2592"), false)
}));
const CustomCursor = dynamic(stryMutAct_9fa48("2593") ? () => undefined : (stryCov_9fa48("2593"), () => import("@/components/custom-cursor").then(stryMutAct_9fa48("2594") ? () => undefined : (stryCov_9fa48("2594"), mod => stryMutAct_9fa48("2595") ? {} : (stryCov_9fa48("2595"), {
  default: mod.CustomCursor
})))), stryMutAct_9fa48("2596") ? {} : (stryCov_9fa48("2596"), {
  ssr: stryMutAct_9fa48("2597") ? true : (stryCov_9fa48("2597"), false)
}));
const WhatsAppButton = dynamic(stryMutAct_9fa48("2598") ? () => undefined : (stryCov_9fa48("2598"), () => import("@/components/whatsapp-button").then(stryMutAct_9fa48("2599") ? () => undefined : (stryCov_9fa48("2599"), mod => stryMutAct_9fa48("2600") ? {} : (stryCov_9fa48("2600"), {
  default: mod.WhatsAppButton
})))), stryMutAct_9fa48("2601") ? {} : (stryCov_9fa48("2601"), {
  ssr: stryMutAct_9fa48("2602") ? true : (stryCov_9fa48("2602"), false)
}));
const EasterEgg = dynamic(stryMutAct_9fa48("2603") ? () => undefined : (stryCov_9fa48("2603"), () => import("@/components/easter-egg").then(stryMutAct_9fa48("2604") ? () => undefined : (stryCov_9fa48("2604"), mod => stryMutAct_9fa48("2605") ? {} : (stryCov_9fa48("2605"), {
  default: mod.EasterEgg
})))), stryMutAct_9fa48("2606") ? {} : (stryCov_9fa48("2606"), {
  ssr: stryMutAct_9fa48("2607") ? true : (stryCov_9fa48("2607"), false)
}));
const AmbientOrbs = dynamic(stryMutAct_9fa48("2608") ? () => undefined : (stryCov_9fa48("2608"), () => import("@/components/ambient-orbs").then(stryMutAct_9fa48("2609") ? () => undefined : (stryCov_9fa48("2609"), mod => stryMutAct_9fa48("2610") ? {} : (stryCov_9fa48("2610"), {
  default: mod.AmbientOrbs
})))), stryMutAct_9fa48("2611") ? {} : (stryCov_9fa48("2611"), {
  ssr: stryMutAct_9fa48("2612") ? true : (stryCov_9fa48("2612"), false)
}));
const GlobalParticles = dynamic(stryMutAct_9fa48("2613") ? () => undefined : (stryCov_9fa48("2613"), () => import("@/components/global-particles").then(stryMutAct_9fa48("2614") ? () => undefined : (stryCov_9fa48("2614"), mod => stryMutAct_9fa48("2615") ? {} : (stryCov_9fa48("2615"), {
  default: mod.GlobalParticles
})))), stryMutAct_9fa48("2616") ? {} : (stryCov_9fa48("2616"), {
  ssr: stryMutAct_9fa48("2617") ? true : (stryCov_9fa48("2617"), false)
}));
export function NonCritical() {
  if (stryMutAct_9fa48("2618")) {
    {}
  } else {
    stryCov_9fa48("2618");
    return <>
      <Particles />
      <GlobalParticles />
      <AmbientOrbs />
      <CustomCursor />
      <WhatsAppButton />
      <EasterEgg />
    </>;
  }
}