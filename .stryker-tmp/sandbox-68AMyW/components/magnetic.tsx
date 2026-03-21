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
import { useRef, type ReactNode, type MouseEvent } from "react";
interface MagneticProps {
  children: ReactNode;
  className?: string;
  strength?: number;
}
export function Magnetic({
  children,
  className = stryMutAct_9fa48("2322") ? "Stryker was here!" : (stryCov_9fa48("2322"), ""),
  strength = 0.3
}: MagneticProps) {
  if (stryMutAct_9fa48("2323")) {
    {}
  } else {
    stryCov_9fa48("2323");
    const ref = useRef<HTMLDivElement>(null);
    const handleMove = (e: MouseEvent) => {
      if (stryMutAct_9fa48("2324")) {
        {}
      } else {
        stryCov_9fa48("2324");
        if (stryMutAct_9fa48("2327") ? false : stryMutAct_9fa48("2326") ? true : stryMutAct_9fa48("2325") ? ref.current : (stryCov_9fa48("2325", "2326", "2327"), !ref.current)) return;
        const rect = ref.current.getBoundingClientRect();
        const x = stryMutAct_9fa48("2328") ? (e.clientX - rect.left - rect.width / 2) / strength : (stryCov_9fa48("2328"), (stryMutAct_9fa48("2329") ? e.clientX - rect.left + rect.width / 2 : (stryCov_9fa48("2329"), (stryMutAct_9fa48("2330") ? e.clientX + rect.left : (stryCov_9fa48("2330"), e.clientX - rect.left)) - (stryMutAct_9fa48("2331") ? rect.width * 2 : (stryCov_9fa48("2331"), rect.width / 2)))) * strength);
        const y = stryMutAct_9fa48("2332") ? (e.clientY - rect.top - rect.height / 2) / strength : (stryCov_9fa48("2332"), (stryMutAct_9fa48("2333") ? e.clientY - rect.top + rect.height / 2 : (stryCov_9fa48("2333"), (stryMutAct_9fa48("2334") ? e.clientY + rect.top : (stryCov_9fa48("2334"), e.clientY - rect.top)) - (stryMutAct_9fa48("2335") ? rect.height * 2 : (stryCov_9fa48("2335"), rect.height / 2)))) * strength);
        ref.current.style.transform = stryMutAct_9fa48("2336") ? `` : (stryCov_9fa48("2336"), `translate(${x}px, ${y}px)`);
      }
    };
    const handleLeave = () => {
      if (stryMutAct_9fa48("2337")) {
        {}
      } else {
        stryCov_9fa48("2337");
        if (stryMutAct_9fa48("2340") ? false : stryMutAct_9fa48("2339") ? true : stryMutAct_9fa48("2338") ? ref.current : (stryCov_9fa48("2338", "2339", "2340"), !ref.current)) return;
        ref.current.style.transform = stryMutAct_9fa48("2341") ? "" : (stryCov_9fa48("2341"), "translate(0, 0)");
      }
    };
    return <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave} style={stryMutAct_9fa48("2342") ? {} : (stryCov_9fa48("2342"), {
      transition: stryMutAct_9fa48("2343") ? "" : (stryCov_9fa48("2343"), "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)")
    })}>
      {children}
    </div>;
  }
}