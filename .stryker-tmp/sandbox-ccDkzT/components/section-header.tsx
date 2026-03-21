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
import { ScrollReveal } from "./scroll-reveal";
interface SectionHeaderProps {
  badge: string;
  title: string;
  highlight?: string;
  description?: string;
}
export function SectionHeader({
  badge,
  title,
  highlight,
  description
}: SectionHeaderProps) {
  if (stryMutAct_9fa48("3017")) {
    {}
  } else {
    stryCov_9fa48("3017");
    return <ScrollReveal className="text-center mb-10 md:mb-16">
      <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#06d6e0]/20 bg-[#06d6e0]/5 mb-4 md:mb-6">
        <div className="w-1.5 h-1.5 rounded-full bg-[#06d6e0] animate-pulse" />
        <span className="text-xs font-mono text-[#06d6e0] tracking-wider uppercase">{badge}</span>
      </div>
      <h2 className="text-2xl md:text-5xl font-bold text-[hsl(210,40%,98%)] mb-3 md:mb-4 text-balance">
        {title}{stryMutAct_9fa48("3018") ? "" : (stryCov_9fa48("3018"), " ")}
        {stryMutAct_9fa48("3021") ? highlight || <span className="text-gradient-animated">{highlight}</span> : stryMutAct_9fa48("3020") ? false : stryMutAct_9fa48("3019") ? true : (stryCov_9fa48("3019", "3020", "3021"), highlight && <span className="text-gradient-animated">{highlight}</span>)}
      </h2>
      {stryMutAct_9fa48("3024") ? description || <p className="text-[hsl(215,20%,55%)] max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-2 md:px-0">{description}</p> : stryMutAct_9fa48("3023") ? false : stryMutAct_9fa48("3022") ? true : (stryCov_9fa48("3022", "3023", "3024"), description && <p className="text-[hsl(215,20%,55%)] max-w-2xl mx-auto text-base md:text-lg leading-relaxed px-2 md:px-0">{description}</p>)}
    </ScrollReveal>;
  }
}