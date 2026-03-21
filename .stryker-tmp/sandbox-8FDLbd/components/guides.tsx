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
import { useRef } from "react";
import { BookOpen, Play, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "./section-header";
import { CodeCard } from "./code-card";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
const guides = stryMutAct_9fa48("1650") ? [] : (stryCov_9fa48("1650"), [stryMutAct_9fa48("1651") ? {} : (stryCov_9fa48("1651"), {
  title: stryMutAct_9fa48("1652") ? "" : (stryCov_9fa48("1652"), "g1Title"),
  filename: stryMutAct_9fa48("1653") ? "" : (stryCov_9fa48("1653"), "mexicani-case"),
  type: stryMutAct_9fa48("1654") ? "" : (stryCov_9fa48("1654"), "guide"),
  lang: stryMutAct_9fa48("1655") ? "" : (stryCov_9fa48("1655"), "tsx"),
  description: stryMutAct_9fa48("1656") ? "" : (stryCov_9fa48("1656"), "g1Desc"),
  readTime: stryMutAct_9fa48("1657") ? "" : (stryCov_9fa48("1657"), "comingSoon"),
  badge: stryMutAct_9fa48("1658") ? "" : (stryCov_9fa48("1658"), "case study"),
  badgeColor: "pink" as const
}), stryMutAct_9fa48("1659") ? {} : (stryCov_9fa48("1659"), {
  title: stryMutAct_9fa48("1660") ? "" : (stryCov_9fa48("1660"), "g2Title"),
  filename: stryMutAct_9fa48("1661") ? "" : (stryCov_9fa48("1661"), "pwa-offline"),
  type: stryMutAct_9fa48("1662") ? "" : (stryCov_9fa48("1662"), "guide"),
  lang: stryMutAct_9fa48("1663") ? "" : (stryCov_9fa48("1663"), "ts"),
  description: stryMutAct_9fa48("1664") ? "" : (stryCov_9fa48("1664"), "g2Desc"),
  readTime: stryMutAct_9fa48("1665") ? "" : (stryCov_9fa48("1665"), "comingSoon"),
  badge: stryMutAct_9fa48("1666") ? "" : (stryCov_9fa48("1666"), "technical"),
  badgeColor: "cyan" as const
}), stryMutAct_9fa48("1667") ? {} : (stryCov_9fa48("1667"), {
  title: stryMutAct_9fa48("1668") ? "" : (stryCov_9fa48("1668"), "g3Title"),
  filename: stryMutAct_9fa48("1669") ? "" : (stryCov_9fa48("1669"), "skills-guide"),
  type: stryMutAct_9fa48("1670") ? "" : (stryCov_9fa48("1670"), "guide"),
  lang: stryMutAct_9fa48("1671") ? "" : (stryCov_9fa48("1671"), "ts"),
  description: stryMutAct_9fa48("1672") ? "" : (stryCov_9fa48("1672"), "g3Desc"),
  readTime: stryMutAct_9fa48("1673") ? "" : (stryCov_9fa48("1673"), "comingSoon"),
  badge: stryMutAct_9fa48("1674") ? "" : (stryCov_9fa48("1674"), "ecosystem"),
  badgeColor: "green" as const
}), stryMutAct_9fa48("1675") ? {} : (stryCov_9fa48("1675"), {
  title: stryMutAct_9fa48("1676") ? "" : (stryCov_9fa48("1676"), "g4Title"),
  filename: stryMutAct_9fa48("1677") ? "" : (stryCov_9fa48("1677"), "flutter-prod"),
  type: stryMutAct_9fa48("1678") ? "" : (stryCov_9fa48("1678"), "guide"),
  lang: stryMutAct_9fa48("1679") ? "" : (stryCov_9fa48("1679"), "dart"),
  description: stryMutAct_9fa48("1680") ? "" : (stryCov_9fa48("1680"), "g4Desc"),
  readTime: stryMutAct_9fa48("1681") ? "" : (stryCov_9fa48("1681"), "comingSoon"),
  badge: stryMutAct_9fa48("1682") ? "" : (stryCov_9fa48("1682"), "mobile"),
  badgeColor: "yellow" as const
})]);
export function Guides() {
  if (stryMutAct_9fa48("1683")) {
    {}
  } else {
    stryCov_9fa48("1683");
    const t = useTranslations(stryMutAct_9fa48("1684") ? "" : (stryCov_9fa48("1684"), "guides"));
    const sectionRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      if (stryMutAct_9fa48("1685")) {
        {}
      } else {
        stryCov_9fa48("1685");
        ScrollTrigger.batch(stryMutAct_9fa48("1686") ? "" : (stryCov_9fa48("1686"), ".guide-card"), stryMutAct_9fa48("1687") ? {} : (stryCov_9fa48("1687"), {
          onEnter: stryMutAct_9fa48("1688") ? () => undefined : (stryCov_9fa48("1688"), batch => gsap.fromTo(batch, stryMutAct_9fa48("1689") ? {} : (stryCov_9fa48("1689"), {
            opacity: 0,
            y: 30
          }), stryMutAct_9fa48("1690") ? {} : (stryCov_9fa48("1690"), {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: stryMutAct_9fa48("1691") ? "" : (stryCov_9fa48("1691"), "expo.out"),
            stagger: 0.12
          }))),
          once: stryMutAct_9fa48("1692") ? false : (stryCov_9fa48("1692"), true)
        }));
      }
    }, stryMutAct_9fa48("1693") ? {} : (stryCov_9fa48("1693"), {
      scope: sectionRef
    }));
    return <section ref={sectionRef} id="guides" aria-label={t(stryMutAct_9fa48("1694") ? "" : (stryCov_9fa48("1694"), "title"))} className="relative py-16 md:py-32">
      <div className="absolute inset-0 grid-bg opacity-[0.15] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader badge={t(stryMutAct_9fa48("1695") ? "" : (stryCov_9fa48("1695"), "badge"))} title={t(stryMutAct_9fa48("1696") ? "" : (stryCov_9fa48("1696"), "title"))} highlight={t(stryMutAct_9fa48("1697") ? "" : (stryCov_9fa48("1697"), "highlight"))} description={t(stryMutAct_9fa48("1698") ? "" : (stryCov_9fa48("1698"), "description"))} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {guides.map(stryMutAct_9fa48("1699") ? () => undefined : (stryCov_9fa48("1699"), (guide, i) => <div key={i} className="guide-card">
              <CodeCard title={t(guide.title)} filename={guide.filename} lang={guide.lang} badge={guide.badge} badgeColor={guide.badgeColor} icon={(stryMutAct_9fa48("1702") ? guide.type !== "video" : stryMutAct_9fa48("1701") ? false : stryMutAct_9fa48("1700") ? true : (stryCov_9fa48("1700", "1701", "1702"), guide.type === (stryMutAct_9fa48("1703") ? "" : (stryCov_9fa48("1703"), "video")))) ? <Play className="w-3.5 h-3.5 text-emerald-400" /> : <BookOpen className="w-3.5 h-3.5 text-[#06d6e0]" />}>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-mono text-[hsl(215,20%,45%)] select-none leading-5">02</span>
                    <p className="text-sm text-[hsl(215,20%,60%)] leading-relaxed">{t(guide.description)}</p>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,14%)]">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-xs font-mono">{t(guide.readTime)}</span>
                      </div>
                    </div>
                    <button aria-label={t(guide.title)} className="text-xs font-mono text-[#06d6e0] hover:text-[#e84393] transition-colors">
                      {(stryMutAct_9fa48("1706") ? guide.type !== "video" : stryMutAct_9fa48("1705") ? false : stryMutAct_9fa48("1704") ? true : (stryCov_9fa48("1704", "1705", "1706"), guide.type === (stryMutAct_9fa48("1707") ? "" : (stryCov_9fa48("1707"), "video")))) ? stryMutAct_9fa48("1708") ? "" : (stryCov_9fa48("1708"), ">> play") : stryMutAct_9fa48("1709") ? "" : (stryCov_9fa48("1709"), ">> read")}
                    </button>
                  </div>
                </div>
              </CodeCard>
            </div>))}
        </div>
      </div>
    </section>;
  }
}