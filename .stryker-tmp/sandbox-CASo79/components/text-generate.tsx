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
import { useEffect, useRef, useState } from "react";
interface TextGenerateProps {
  words: string;
  className?: string;
}
export function TextGenerate({
  words,
  className = stryMutAct_9fa48("3556") ? "Stryker was here!" : (stryCov_9fa48("3556"), "")
}: TextGenerateProps) {
  if (stryMutAct_9fa48("3557")) {
    {}
  } else {
    stryCov_9fa48("3557");
    const [visible, setVisible] = useState(stryMutAct_9fa48("3558") ? true : (stryCov_9fa48("3558"), false));
    const ref = useRef<HTMLSpanElement>(null);
    const wordArray = words.split(stryMutAct_9fa48("3559") ? "" : (stryCov_9fa48("3559"), " "));
    useEffect(() => {
      if (stryMutAct_9fa48("3560")) {
        {}
      } else {
        stryCov_9fa48("3560");
        const el = ref.current;
        if (stryMutAct_9fa48("3563") ? false : stryMutAct_9fa48("3562") ? true : stryMutAct_9fa48("3561") ? el : (stryCov_9fa48("3561", "3562", "3563"), !el)) return;
        const obs = new IntersectionObserver(([entry]) => {
          if (stryMutAct_9fa48("3564")) {
            {}
          } else {
            stryCov_9fa48("3564");
            if (stryMutAct_9fa48("3566") ? false : stryMutAct_9fa48("3565") ? true : (stryCov_9fa48("3565", "3566"), entry.isIntersecting)) {
              if (stryMutAct_9fa48("3567")) {
                {}
              } else {
                stryCov_9fa48("3567");
                setVisible(stryMutAct_9fa48("3568") ? false : (stryCov_9fa48("3568"), true));
                obs.disconnect();
              }
            }
          }
        }, stryMutAct_9fa48("3569") ? {} : (stryCov_9fa48("3569"), {
          threshold: 0.1
        }));
        obs.observe(el);
        return stryMutAct_9fa48("3570") ? () => undefined : (stryCov_9fa48("3570"), () => obs.disconnect());
      }
    }, stryMutAct_9fa48("3571") ? ["Stryker was here"] : (stryCov_9fa48("3571"), []));
    return <span ref={ref} className={className}>
      {wordArray.map(stryMutAct_9fa48("3572") ? () => undefined : (stryCov_9fa48("3572"), (word, i) => <span key={stryMutAct_9fa48("3573") ? `` : (stryCov_9fa48("3573"), `${word}-${i}`)} className="inline-block" style={stryMutAct_9fa48("3574") ? {} : (stryCov_9fa48("3574"), {
        opacity: visible ? 1 : 0,
        filter: visible ? stryMutAct_9fa48("3575") ? "" : (stryCov_9fa48("3575"), "blur(0px)") : stryMutAct_9fa48("3576") ? "" : (stryCov_9fa48("3576"), "blur(8px)"),
        transition: (stryMutAct_9fa48("3577") ? "" : (stryCov_9fa48("3577"), "opacity 0.4s ease-out ")) + String(stryMutAct_9fa48("3578") ? i / 0.08 : (stryCov_9fa48("3578"), i * 0.08)) + (stryMutAct_9fa48("3579") ? "" : (stryCov_9fa48("3579"), "s, filter 0.4s ease-out ")) + String(stryMutAct_9fa48("3580") ? i / 0.08 : (stryCov_9fa48("3580"), i * 0.08)) + (stryMutAct_9fa48("3581") ? "" : (stryCov_9fa48("3581"), "s"))
      })}>
          {word}&nbsp;
        </span>))}
    </span>;
  }
}