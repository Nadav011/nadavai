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
import { useRef, useState, type ReactNode, type MouseEvent } from "react";
interface TiltCardProps {
  children: ReactNode;
  className?: string;
}
export function TiltCard({
  children,
  className = stryMutAct_9fa48("3582") ? "Stryker was here!" : (stryCov_9fa48("3582"), "")
}: TiltCardProps) {
  if (stryMutAct_9fa48("3583")) {
    {}
  } else {
    stryCov_9fa48("3583");
    const ref = useRef<HTMLDivElement>(null);
    const [isTouchDevice] = useState(stryMutAct_9fa48("3584") ? () => undefined : (stryCov_9fa48("3584"), () => stryMutAct_9fa48("3587") ? typeof window !== 'undefined' || "ontouchstart" in window || navigator.maxTouchPoints > 0 : stryMutAct_9fa48("3586") ? false : stryMutAct_9fa48("3585") ? true : (stryCov_9fa48("3585", "3586", "3587"), (stryMutAct_9fa48("3589") ? typeof window === 'undefined' : stryMutAct_9fa48("3588") ? true : (stryCov_9fa48("3588", "3589"), typeof window !== (stryMutAct_9fa48("3590") ? "" : (stryCov_9fa48("3590"), 'undefined')))) && (stryMutAct_9fa48("3592") ? "ontouchstart" in window && navigator.maxTouchPoints > 0 : stryMutAct_9fa48("3591") ? true : (stryCov_9fa48("3591", "3592"), (stryMutAct_9fa48("3593") ? "" : (stryCov_9fa48("3593"), "ontouchstart")) in window || (stryMutAct_9fa48("3596") ? navigator.maxTouchPoints <= 0 : stryMutAct_9fa48("3595") ? navigator.maxTouchPoints >= 0 : stryMutAct_9fa48("3594") ? false : (stryCov_9fa48("3594", "3595", "3596"), navigator.maxTouchPoints > 0)))))));
    const handleMove = (e: MouseEvent) => {
      if (stryMutAct_9fa48("3597")) {
        {}
      } else {
        stryCov_9fa48("3597");
        if (stryMutAct_9fa48("3600") ? isTouchDevice && !ref.current : stryMutAct_9fa48("3599") ? false : stryMutAct_9fa48("3598") ? true : (stryCov_9fa48("3598", "3599", "3600"), isTouchDevice || (stryMutAct_9fa48("3601") ? ref.current : (stryCov_9fa48("3601"), !ref.current)))) return;
        const rect = ref.current.getBoundingClientRect();
        const x = stryMutAct_9fa48("3602") ? ((e.clientX - rect.left) / rect.width - 0.5) / 8 : (stryCov_9fa48("3602"), (stryMutAct_9fa48("3603") ? (e.clientX - rect.left) / rect.width + 0.5 : (stryCov_9fa48("3603"), (stryMutAct_9fa48("3604") ? (e.clientX - rect.left) * rect.width : (stryCov_9fa48("3604"), (stryMutAct_9fa48("3605") ? e.clientX + rect.left : (stryCov_9fa48("3605"), e.clientX - rect.left)) / rect.width)) - 0.5)) * 8);
        const y = stryMutAct_9fa48("3606") ? ((e.clientY - rect.top) / rect.height - 0.5) / -8 : (stryCov_9fa48("3606"), (stryMutAct_9fa48("3607") ? (e.clientY - rect.top) / rect.height + 0.5 : (stryCov_9fa48("3607"), (stryMutAct_9fa48("3608") ? (e.clientY - rect.top) * rect.height : (stryCov_9fa48("3608"), (stryMutAct_9fa48("3609") ? e.clientY + rect.top : (stryCov_9fa48("3609"), e.clientY - rect.top)) / rect.height)) - 0.5)) * (stryMutAct_9fa48("3610") ? +8 : (stryCov_9fa48("3610"), -8)));
        ref.current.style.transform = stryMutAct_9fa48("3611") ? `` : (stryCov_9fa48("3611"), `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) scale3d(1.01, 1.01, 1.01)`);
      }
    };
    const handleLeave = () => {
      if (stryMutAct_9fa48("3612")) {
        {}
      } else {
        stryCov_9fa48("3612");
        if (stryMutAct_9fa48("3615") ? isTouchDevice && !ref.current : stryMutAct_9fa48("3614") ? false : stryMutAct_9fa48("3613") ? true : (stryCov_9fa48("3613", "3614", "3615"), isTouchDevice || (stryMutAct_9fa48("3616") ? ref.current : (stryCov_9fa48("3616"), !ref.current)))) return;
        ref.current.style.transform = stryMutAct_9fa48("3617") ? "" : (stryCov_9fa48("3617"), "perspective(800px) rotateX(0) rotateY(0) scale3d(1, 1, 1)");
      }
    };
    return <div ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave} style={stryMutAct_9fa48("3618") ? {} : (stryCov_9fa48("3618"), {
      transition: stryMutAct_9fa48("3619") ? "" : (stryCov_9fa48("3619"), "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)"),
      transformStyle: isTouchDevice ? undefined : stryMutAct_9fa48("3620") ? "" : (stryCov_9fa48("3620"), "preserve-3d")
    })}>
      {children}
    </div>;
  }
}