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
import { TiltCard } from "./tilt-card";
interface CodeCardProps {
  title: string;
  filename?: string;
  lang?: string;
  children: ReactNode;
  className?: string;
  badge?: string;
  badgeColor?: "cyan" | "pink" | "green" | "yellow";
  icon?: ReactNode;
}
const badgeColors = stryMutAct_9fa48("871") ? {} : (stryCov_9fa48("871"), {
  cyan: stryMutAct_9fa48("872") ? "" : (stryCov_9fa48("872"), "bg-[#06d6e0]/15 text-[#06d6e0] border-[#06d6e0]/30"),
  pink: stryMutAct_9fa48("873") ? "" : (stryCov_9fa48("873"), "bg-[#e84393]/15 text-[#e84393] border-[#e84393]/30"),
  green: stryMutAct_9fa48("874") ? "" : (stryCov_9fa48("874"), "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"),
  yellow: stryMutAct_9fa48("875") ? "" : (stryCov_9fa48("875"), "bg-amber-500/15 text-amber-400 border-amber-500/30")
});
export function CodeCard({
  title,
  filename,
  lang = stryMutAct_9fa48("876") ? "" : (stryCov_9fa48("876"), "tsx"),
  children,
  className = stryMutAct_9fa48("877") ? "Stryker was here!" : (stryCov_9fa48("877"), ""),
  badge,
  badgeColor = stryMutAct_9fa48("878") ? "" : (stryCov_9fa48("878"), "cyan"),
  icon
}: CodeCardProps) {
  if (stryMutAct_9fa48("879")) {
    {}
  } else {
    stryCov_9fa48("879");
    return <TiltCard className={className}>
      <div className="relative group rounded-xl overflow-hidden border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] transition-all duration-500 hover:border-[#06d6e0]/30 hover:shadow-[0_0_30px_hsl(187,92%,55%,0.08)]">
        {/* Terminal header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(215,28%,16%)] bg-[hsl(222,47%,6%)]">
          <div className="flex items-center gap-3">
            {/* Traffic lights */}
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e] opacity-80 group-hover:opacity-100 transition-opacity" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40] opacity-80 group-hover:opacity-100 transition-opacity" />
            </div>
            {/* File tab */}
            {stryMutAct_9fa48("882") ? filename || <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[hsl(215,28%,12%)] border border-[hsl(215,28%,18%)]">
                {icon && <span className="text-sm">{icon}</span>}
                <span className="text-xs font-mono text-[hsl(215,20%,55%)]">{filename}</span>
                <span className="text-[10px] font-mono text-[hsl(215,20%,48%)] uppercase">.{lang}</span>
              </div> : stryMutAct_9fa48("881") ? false : stryMutAct_9fa48("880") ? true : (stryCov_9fa48("880", "881", "882"), filename && <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-[hsl(215,28%,12%)] border border-[hsl(215,28%,18%)]">
                {stryMutAct_9fa48("885") ? icon || <span className="text-sm">{icon}</span> : stryMutAct_9fa48("884") ? false : stryMutAct_9fa48("883") ? true : (stryCov_9fa48("883", "884", "885"), icon && <span className="text-sm">{icon}</span>)}
                <span className="text-xs font-mono text-[hsl(215,20%,55%)]">{filename}</span>
                <span className="text-[10px] font-mono text-[hsl(215,20%,48%)] uppercase">.{lang}</span>
              </div>)}
          </div>
          <div className="flex items-center gap-2">
            {stryMutAct_9fa48("888") ? badge || <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeColors[badgeColor]}`}>
                {badge}
              </span> : stryMutAct_9fa48("887") ? false : stryMutAct_9fa48("886") ? true : (stryCov_9fa48("886", "887", "888"), badge && <span className={stryMutAct_9fa48("889") ? `` : (stryCov_9fa48("889"), `text-[10px] font-mono px-2 py-0.5 rounded-full border ${badgeColors[badgeColor]}`)}>
                {badge}
              </span>)}
          </div>
        </div>

        {/* Content area */}
        <div className="p-5">
          {/* Title with line number styling */}
          <div className="flex items-start gap-3 mb-4">
            <span className="text-xs font-mono text-[hsl(215,20%,45%)] select-none leading-6">01</span>
            <h3 className="text-base font-semibold text-[hsl(210,40%,96%)] leading-6">{title}</h3>
          </div>
          {/* Body content */}
          <div className="me-7">
            {children}
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#27ca40] animate-pulse" />
            <span className="text-[10px] font-mono text-[hsl(215,20%,48%)]">ready</span>
          </div>
          <span className="text-[10px] font-mono text-[hsl(215,20%,45%)]">UTF-8</span>
        </div>

        {/* Hover glow effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-xl" style={stryMutAct_9fa48("890") ? {} : (stryCov_9fa48("890"), {
          background: stryMutAct_9fa48("891") ? "" : (stryCov_9fa48("891"), "radial-gradient(600px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), hsl(187 92% 55% / 0.04), transparent 40%)")
        })} />
      </div>
    </TiltCard>;
  }
}