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
export function CustomCursor() {
  if (stryMutAct_9fa48("1116")) {
    {}
  } else {
    stryCov_9fa48("1116");
    const dotRef = useRef<HTMLDivElement>(null);
    const glowRef = useRef<HTMLDivElement>(null);
    const [hovering, setHovering] = useState(stryMutAct_9fa48("1117") ? true : (stryCov_9fa48("1117"), false));
    const [visible, setVisible] = useState(stryMutAct_9fa48("1118") ? true : (stryCov_9fa48("1118"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("1119")) {
        {}
      } else {
        stryCov_9fa48("1119");
        const isTouchDevice = (stryMutAct_9fa48("1120") ? "" : (stryCov_9fa48("1120"), "ontouchstart")) in window;
        if (stryMutAct_9fa48("1122") ? false : stryMutAct_9fa48("1121") ? true : (stryCov_9fa48("1121", "1122"), isTouchDevice)) return;
        const move = (e: MouseEvent) => {
          if (stryMutAct_9fa48("1123")) {
            {}
          } else {
            stryCov_9fa48("1123");
            // Update DOM directly via refs - no React re-render
            if (stryMutAct_9fa48("1125") ? false : stryMutAct_9fa48("1124") ? true : (stryCov_9fa48("1124", "1125"), dotRef.current)) {
              if (stryMutAct_9fa48("1126")) {
                {}
              } else {
                stryCov_9fa48("1126");
                dotRef.current.style.left = stryMutAct_9fa48("1127") ? `` : (stryCov_9fa48("1127"), `${e.clientX}px`);
                dotRef.current.style.top = stryMutAct_9fa48("1128") ? `` : (stryCov_9fa48("1128"), `${e.clientY}px`);
              }
            }
            if (stryMutAct_9fa48("1130") ? false : stryMutAct_9fa48("1129") ? true : (stryCov_9fa48("1129", "1130"), glowRef.current)) {
              if (stryMutAct_9fa48("1131")) {
                {}
              } else {
                stryCov_9fa48("1131");
                glowRef.current.style.left = stryMutAct_9fa48("1132") ? `` : (stryCov_9fa48("1132"), `${e.clientX}px`);
                glowRef.current.style.top = stryMutAct_9fa48("1133") ? `` : (stryCov_9fa48("1133"), `${e.clientY}px`);
              }
            }
            setVisible(stryMutAct_9fa48("1134") ? false : (stryCov_9fa48("1134"), true));
          }
        };
        const addHover = stryMutAct_9fa48("1135") ? () => undefined : (stryCov_9fa48("1135"), (() => {
          const addHover = () => setHovering(stryMutAct_9fa48("1136") ? false : (stryCov_9fa48("1136"), true));
          return addHover;
        })());
        const removeHover = stryMutAct_9fa48("1137") ? () => undefined : (stryCov_9fa48("1137"), (() => {
          const removeHover = () => setHovering(stryMutAct_9fa48("1138") ? true : (stryCov_9fa48("1138"), false));
          return removeHover;
        })());
        window.addEventListener(stryMutAct_9fa48("1139") ? "" : (stryCov_9fa48("1139"), "mousemove"), move, stryMutAct_9fa48("1140") ? {} : (stryCov_9fa48("1140"), {
          passive: stryMutAct_9fa48("1141") ? false : (stryCov_9fa48("1141"), true)
        }));
        document.addEventListener(stryMutAct_9fa48("1142") ? "" : (stryCov_9fa48("1142"), "mouseleave"), stryMutAct_9fa48("1143") ? () => undefined : (stryCov_9fa48("1143"), () => setVisible(stryMutAct_9fa48("1144") ? true : (stryCov_9fa48("1144"), false))));
        document.addEventListener(stryMutAct_9fa48("1145") ? "" : (stryCov_9fa48("1145"), "mouseenter"), stryMutAct_9fa48("1146") ? () => undefined : (stryCov_9fa48("1146"), () => setVisible(stryMutAct_9fa48("1147") ? false : (stryCov_9fa48("1147"), true))));
        const interactiveElements = document.querySelectorAll(stryMutAct_9fa48("1148") ? "" : (stryCov_9fa48("1148"), "a, button, [role='button'], input, textarea, select"));
        interactiveElements.forEach(el => {
          if (stryMutAct_9fa48("1149")) {
            {}
          } else {
            stryCov_9fa48("1149");
            el.addEventListener(stryMutAct_9fa48("1150") ? "" : (stryCov_9fa48("1150"), "mouseenter"), addHover);
            el.addEventListener(stryMutAct_9fa48("1151") ? "" : (stryCov_9fa48("1151"), "mouseleave"), removeHover);
          }
        });
        return () => {
          if (stryMutAct_9fa48("1152")) {
            {}
          } else {
            stryCov_9fa48("1152");
            window.removeEventListener(stryMutAct_9fa48("1153") ? "" : (stryCov_9fa48("1153"), "mousemove"), move);
            interactiveElements.forEach(el => {
              if (stryMutAct_9fa48("1154")) {
                {}
              } else {
                stryCov_9fa48("1154");
                el.removeEventListener(stryMutAct_9fa48("1155") ? "" : (stryCov_9fa48("1155"), "mouseenter"), addHover);
                el.removeEventListener(stryMutAct_9fa48("1156") ? "" : (stryCov_9fa48("1156"), "mouseleave"), removeHover);
              }
            });
          }
        };
      }
    }, stryMutAct_9fa48("1157") ? ["Stryker was here"] : (stryCov_9fa48("1157"), []));
    if (stryMutAct_9fa48("1160") ? false : stryMutAct_9fa48("1159") ? true : stryMutAct_9fa48("1158") ? visible : (stryCov_9fa48("1158", "1159", "1160"), !visible)) return null;
    return <>
      <div ref={dotRef} className="fixed pointer-events-none z-[9999] mix-blend-difference hidden md:block" style={stryMutAct_9fa48("1161") ? {} : (stryCov_9fa48("1161"), {
        left: 0,
        top: 0,
        width: hovering ? 48 : 12,
        height: hovering ? 48 : 12,
        borderRadius: stryMutAct_9fa48("1162") ? "" : (stryCov_9fa48("1162"), "50%"),
        background: hovering ? stryMutAct_9fa48("1163") ? "" : (stryCov_9fa48("1163"), "transparent") : stryMutAct_9fa48("1164") ? "" : (stryCov_9fa48("1164"), "#06d6e0"),
        border: hovering ? stryMutAct_9fa48("1165") ? "" : (stryCov_9fa48("1165"), "2px solid #06d6e0") : stryMutAct_9fa48("1166") ? "" : (stryCov_9fa48("1166"), "none"),
        transform: stryMutAct_9fa48("1167") ? "" : (stryCov_9fa48("1167"), "translate(-50%, -50%)"),
        transition: stryMutAct_9fa48("1168") ? "" : (stryCov_9fa48("1168"), "width 0.2s ease, height 0.2s ease, background 0.2s ease, border 0.2s ease")
      })} aria-hidden="true" />
      <div ref={glowRef} className="fixed pointer-events-none z-[9998] hidden md:block" style={stryMutAct_9fa48("1169") ? {} : (stryCov_9fa48("1169"), {
        left: 0,
        top: 0,
        width: 200,
        height: 200,
        borderRadius: stryMutAct_9fa48("1170") ? "" : (stryCov_9fa48("1170"), "50%"),
        background: stryMutAct_9fa48("1171") ? "" : (stryCov_9fa48("1171"), "radial-gradient(circle, hsl(187 92% 55% / 0.06), transparent 70%)"),
        transform: stryMutAct_9fa48("1172") ? "" : (stryCov_9fa48("1172"), "translate(-50%, -50%)"),
        transition: stryMutAct_9fa48("1173") ? "" : (stryCov_9fa48("1173"), "left 0.15s ease-out, top 0.15s ease-out")
      })} aria-hidden="true" />
    </>;
  }
}