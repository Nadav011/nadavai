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
import { useRef, useCallback, useState } from "react";
interface SpotlightProps {
  className?: string;
  fill?: string;
}
export function Spotlight({
  className = stryMutAct_9fa48("3399") ? "Stryker was here!" : (stryCov_9fa48("3399"), ""),
  fill = stryMutAct_9fa48("3400") ? "" : (stryCov_9fa48("3400"), "#06d6e0")
}: SpotlightProps) {
  if (stryMutAct_9fa48("3401")) {
    {}
  } else {
    stryCov_9fa48("3401");
    const containerRef = useRef<HTMLDivElement>(null);
    const gradientRef = useRef<HTMLDivElement>(null);
    const trailRef = useRef<HTMLDivElement>(null);
    const [isMobile] = useState(stryMutAct_9fa48("3402") ? () => undefined : (stryCov_9fa48("3402"), () => stryMutAct_9fa48("3405") ? typeof window !== 'undefined' || window.matchMedia("(max-width: 768px)").matches : stryMutAct_9fa48("3404") ? false : stryMutAct_9fa48("3403") ? true : (stryCov_9fa48("3403", "3404", "3405"), (stryMutAct_9fa48("3407") ? typeof window === 'undefined' : stryMutAct_9fa48("3406") ? true : (stryCov_9fa48("3406", "3407"), typeof window !== (stryMutAct_9fa48("3408") ? "" : (stryCov_9fa48("3408"), 'undefined')))) && window.matchMedia(stryMutAct_9fa48("3409") ? "" : (stryCov_9fa48("3409"), "(max-width: 768px)")).matches)));
    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
      if (stryMutAct_9fa48("3410")) {
        {}
      } else {
        stryCov_9fa48("3410");
        if (stryMutAct_9fa48("3413") ? (!containerRef.current || !gradientRef.current) && !trailRef.current : stryMutAct_9fa48("3412") ? false : stryMutAct_9fa48("3411") ? true : (stryCov_9fa48("3411", "3412", "3413"), (stryMutAct_9fa48("3415") ? !containerRef.current && !gradientRef.current : stryMutAct_9fa48("3414") ? false : (stryCov_9fa48("3414", "3415"), (stryMutAct_9fa48("3416") ? containerRef.current : (stryCov_9fa48("3416"), !containerRef.current)) || (stryMutAct_9fa48("3417") ? gradientRef.current : (stryCov_9fa48("3417"), !gradientRef.current)))) || (stryMutAct_9fa48("3418") ? trailRef.current : (stryCov_9fa48("3418"), !trailRef.current)))) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = stryMutAct_9fa48("3419") ? e.clientX + rect.left : (stryCov_9fa48("3419"), e.clientX - rect.left);
        const y = stryMutAct_9fa48("3420") ? e.clientY + rect.top : (stryCov_9fa48("3420"), e.clientY - rect.top);

        // Main spotlight - larger, multi-layered
        gradientRef.current.style.background = stryMutAct_9fa48("3421") ? `` : (stryCov_9fa48("3421"), `
      radial-gradient(800px circle at ${x}px ${y}px, ${fill}06, transparent 40%),
      radial-gradient(400px circle at ${x}px ${y}px, ${fill}0a, transparent 30%),
      radial-gradient(150px circle at ${x}px ${y}px, ${fill}10, transparent 20%)
    `);

        // Trail effect - softer, delayed
        trailRef.current.style.background = stryMutAct_9fa48("3422") ? `` : (stryCov_9fa48("3422"), `radial-gradient(600px circle at ${x}px ${y}px, ${fill}04, transparent 50%)`);
      }
    }, stryMutAct_9fa48("3423") ? [] : (stryCov_9fa48("3423"), [fill]));
    const handleMouseEnter = useCallback(() => {
      if (stryMutAct_9fa48("3424")) {
        {}
      } else {
        stryCov_9fa48("3424");
        if (stryMutAct_9fa48("3427") ? !gradientRef.current && !trailRef.current : stryMutAct_9fa48("3426") ? false : stryMutAct_9fa48("3425") ? true : (stryCov_9fa48("3425", "3426", "3427"), (stryMutAct_9fa48("3428") ? gradientRef.current : (stryCov_9fa48("3428"), !gradientRef.current)) || (stryMutAct_9fa48("3429") ? trailRef.current : (stryCov_9fa48("3429"), !trailRef.current)))) return;
        gradientRef.current.style.opacity = stryMutAct_9fa48("3430") ? "" : (stryCov_9fa48("3430"), "1");
        trailRef.current.style.opacity = stryMutAct_9fa48("3431") ? "" : (stryCov_9fa48("3431"), "1");
      }
    }, stryMutAct_9fa48("3432") ? ["Stryker was here"] : (stryCov_9fa48("3432"), []));
    const handleMouseLeave = useCallback(() => {
      if (stryMutAct_9fa48("3433")) {
        {}
      } else {
        stryCov_9fa48("3433");
        if (stryMutAct_9fa48("3436") ? !gradientRef.current && !trailRef.current : stryMutAct_9fa48("3435") ? false : stryMutAct_9fa48("3434") ? true : (stryCov_9fa48("3434", "3435", "3436"), (stryMutAct_9fa48("3437") ? gradientRef.current : (stryCov_9fa48("3437"), !gradientRef.current)) || (stryMutAct_9fa48("3438") ? trailRef.current : (stryCov_9fa48("3438"), !trailRef.current)))) return;
        gradientRef.current.style.opacity = stryMutAct_9fa48("3439") ? "" : (stryCov_9fa48("3439"), "0");
        trailRef.current.style.opacity = stryMutAct_9fa48("3440") ? "" : (stryCov_9fa48("3440"), "0");
      }
    }, stryMutAct_9fa48("3441") ? ["Stryker was here"] : (stryCov_9fa48("3441"), []));
    if (stryMutAct_9fa48("3443") ? false : stryMutAct_9fa48("3442") ? true : (stryCov_9fa48("3442", "3443"), isMobile)) return null;
    return <div ref={containerRef} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className={stryMutAct_9fa48("3444") ? `` : (stryCov_9fa48("3444"), `absolute inset-0 overflow-hidden ${className}`)}>
      {/* Trail layer - slower transition */}
      <div ref={trailRef} className="pointer-events-none absolute -inset-px" style={stryMutAct_9fa48("3445") ? {} : (stryCov_9fa48("3445"), {
        opacity: 0,
        transition: stryMutAct_9fa48("3446") ? "" : (stryCov_9fa48("3446"), "opacity 0.6s, background 0.3s ease-out")
      })} />
      {/* Main spotlight layer */}
      <div ref={gradientRef} className="pointer-events-none absolute -inset-px" style={stryMutAct_9fa48("3447") ? {} : (stryCov_9fa48("3447"), {
        opacity: 0,
        transition: stryMutAct_9fa48("3448") ? "" : (stryCov_9fa48("3448"), "opacity 0.4s, background 0.1s")
      })} />
    </div>;
  }
}