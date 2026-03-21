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
import { useState } from "react";
interface Orb {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  duration: number;
  delay: number;
}
export function AmbientOrbs() {
  if (stryMutAct_9fa48("644")) {
    {}
  } else {
    stryCov_9fa48("644");
    const [orbs] = useState<Orb[]>(() => {
      if (stryMutAct_9fa48("645")) {
        {}
      } else {
        stryCov_9fa48("645");
        if (stryMutAct_9fa48("648") ? typeof window !== 'undefined' : stryMutAct_9fa48("647") ? false : stryMutAct_9fa48("646") ? true : (stryCov_9fa48("646", "647", "648"), typeof window === (stryMutAct_9fa48("649") ? "" : (stryCov_9fa48("649"), 'undefined')))) return stryMutAct_9fa48("650") ? ["Stryker was here"] : (stryCov_9fa48("650"), []);
        const isMobile = window.matchMedia(stryMutAct_9fa48("651") ? "" : (stryCov_9fa48("651"), "(max-width: 768px)")).matches;
        const count = isMobile ? 4 : 8;
        return Array.from(stryMutAct_9fa48("652") ? {} : (stryCov_9fa48("652"), {
          length: count
        }), stryMutAct_9fa48("653") ? () => undefined : (stryCov_9fa48("653"), (_, i) => stryMutAct_9fa48("654") ? {} : (stryCov_9fa48("654"), {
          id: i,
          x: stryMutAct_9fa48("655") ? Math.random() / 100 : (stryCov_9fa48("655"), Math.random() * 100),
          y: stryMutAct_9fa48("656") ? Math.random() / 100 : (stryCov_9fa48("656"), Math.random() * 100),
          size: isMobile ? stryMutAct_9fa48("657") ? 180 - Math.random() * 250 : (stryCov_9fa48("657"), 180 + (stryMutAct_9fa48("658") ? Math.random() / 250 : (stryCov_9fa48("658"), Math.random() * 250))) : stryMutAct_9fa48("659") ? 250 - Math.random() * 450 : (stryCov_9fa48("659"), 250 + (stryMutAct_9fa48("660") ? Math.random() / 450 : (stryCov_9fa48("660"), Math.random() * 450))),
          opacity: stryMutAct_9fa48("661") ? 0.025 - Math.random() * 0.04 : (stryCov_9fa48("661"), 0.025 + (stryMutAct_9fa48("662") ? Math.random() / 0.04 : (stryCov_9fa48("662"), Math.random() * 0.04))),
          duration: stryMutAct_9fa48("663") ? 12 - Math.random() * 20 : (stryCov_9fa48("663"), 12 + (stryMutAct_9fa48("664") ? Math.random() / 20 : (stryCov_9fa48("664"), Math.random() * 20))),
          delay: stryMutAct_9fa48("665") ? Math.random() / -15 : (stryCov_9fa48("665"), Math.random() * (stryMutAct_9fa48("666") ? +15 : (stryCov_9fa48("666"), -15)))
        })));
      }
    });
    if (stryMutAct_9fa48("669") ? orbs.length !== 0 : stryMutAct_9fa48("668") ? false : stryMutAct_9fa48("667") ? true : (stryCov_9fa48("667", "668", "669"), orbs.length === 0)) return null;
    return <div className="fixed inset-0 pointer-events-none overflow-hidden" style={stryMutAct_9fa48("670") ? {} : (stryCov_9fa48("670"), {
      zIndex: 1
    })} aria-hidden="true">
      {orbs.map(stryMutAct_9fa48("671") ? () => undefined : (stryCov_9fa48("671"), orb => <div key={orb.id} className="absolute rounded-full" style={stryMutAct_9fa48("672") ? {} : (stryCov_9fa48("672"), {
        left: stryMutAct_9fa48("673") ? `` : (stryCov_9fa48("673"), `${orb.x}%`),
        top: stryMutAct_9fa48("674") ? `` : (stryCov_9fa48("674"), `${orb.y}%`),
        width: orb.size,
        height: orb.size,
        background: stryMutAct_9fa48("675") ? `` : (stryCov_9fa48("675"), `radial-gradient(circle, hsl(187 92% 55% / ${orb.opacity}), transparent 70%)`),
        animation: stryMutAct_9fa48("676") ? `` : (stryCov_9fa48("676"), `ambient-drift-${stryMutAct_9fa48("677") ? orb.id * 3 : (stryCov_9fa48("677"), orb.id % 3)} ${orb.duration}s ease-in-out infinite`),
        animationDelay: stryMutAct_9fa48("678") ? `` : (stryCov_9fa48("678"), `${orb.delay}s`),
        transform: stryMutAct_9fa48("679") ? "" : (stryCov_9fa48("679"), "translate(-50%, -50%)")
      })} />))}
      <style jsx>{stryMutAct_9fa48("680") ? `` : (stryCov_9fa48("680"), `
        @keyframes ambient-drift-0 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          25% { transform: translate(-50%, -50%) translate(30px, -40px); }
          50% { transform: translate(-50%, -50%) translate(-20px, 20px); }
          75% { transform: translate(-50%, -50%) translate(15px, 35px); }
        }
        @keyframes ambient-drift-1 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          33% { transform: translate(-50%, -50%) translate(-35px, 25px); }
          66% { transform: translate(-50%, -50%) translate(25px, -30px); }
        }
        @keyframes ambient-drift-2 {
          0%, 100% { transform: translate(-50%, -50%) translate(0px, 0px); }
          20% { transform: translate(-50%, -50%) translate(20px, 30px); }
          40% { transform: translate(-50%, -50%) translate(-30px, -15px); }
          60% { transform: translate(-50%, -50%) translate(10px, -35px); }
          80% { transform: translate(-50%, -50%) translate(-15px, 20px); }
        }
      `)}</style>
    </div>;
  }
}