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
import { useEffect, useState, useMemo } from "react";
const KONAMI = stryMutAct_9fa48("1174") ? [] : (stryCov_9fa48("1174"), [stryMutAct_9fa48("1175") ? "" : (stryCov_9fa48("1175"), "ArrowUp"), stryMutAct_9fa48("1176") ? "" : (stryCov_9fa48("1176"), "ArrowUp"), stryMutAct_9fa48("1177") ? "" : (stryCov_9fa48("1177"), "ArrowDown"), stryMutAct_9fa48("1178") ? "" : (stryCov_9fa48("1178"), "ArrowDown"), stryMutAct_9fa48("1179") ? "" : (stryCov_9fa48("1179"), "ArrowLeft"), stryMutAct_9fa48("1180") ? "" : (stryCov_9fa48("1180"), "ArrowRight"), stryMutAct_9fa48("1181") ? "" : (stryCov_9fa48("1181"), "ArrowLeft"), stryMutAct_9fa48("1182") ? "" : (stryCov_9fa48("1182"), "ArrowRight"), stryMutAct_9fa48("1183") ? "" : (stryCov_9fa48("1183"), "b"), stryMutAct_9fa48("1184") ? "" : (stryCov_9fa48("1184"), "a")]);
function seededRandom(seed: number) {
  if (stryMutAct_9fa48("1185")) {
    {}
  } else {
    stryCov_9fa48("1185");
    const x = stryMutAct_9fa48("1186") ? Math.sin(seed + 1) / 10000 : (stryCov_9fa48("1186"), Math.sin(stryMutAct_9fa48("1187") ? seed - 1 : (stryCov_9fa48("1187"), seed + 1)) * 10000);
    return stryMutAct_9fa48("1188") ? x + Math.floor(x) : (stryCov_9fa48("1188"), x - Math.floor(x));
  }
}
export function EasterEgg() {
  if (stryMutAct_9fa48("1189")) {
    {}
  } else {
    stryCov_9fa48("1189");
    const [active, setActive] = useState(stryMutAct_9fa48("1190") ? true : (stryCov_9fa48("1190"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("1191")) {
        {}
      } else {
        stryCov_9fa48("1191");
        let buffer: string[] = stryMutAct_9fa48("1192") ? ["Stryker was here"] : (stryCov_9fa48("1192"), []);
        const onKey = (e: KeyboardEvent) => {
          if (stryMutAct_9fa48("1193")) {
            {}
          } else {
            stryCov_9fa48("1193");
            buffer = stryMutAct_9fa48("1194") ? [...buffer, e.key] : (stryCov_9fa48("1194"), (stryMutAct_9fa48("1195") ? [] : (stryCov_9fa48("1195"), [...buffer, e.key])).slice(stryMutAct_9fa48("1196") ? +KONAMI.length : (stryCov_9fa48("1196"), -KONAMI.length)));
            if (stryMutAct_9fa48("1199") ? buffer.length === KONAMI.length || buffer.every((k, i) => k === KONAMI[i]) : stryMutAct_9fa48("1198") ? false : stryMutAct_9fa48("1197") ? true : (stryCov_9fa48("1197", "1198", "1199"), (stryMutAct_9fa48("1201") ? buffer.length !== KONAMI.length : stryMutAct_9fa48("1200") ? true : (stryCov_9fa48("1200", "1201"), buffer.length === KONAMI.length)) && (stryMutAct_9fa48("1202") ? buffer.some((k, i) => k === KONAMI[i]) : (stryCov_9fa48("1202"), buffer.every(stryMutAct_9fa48("1203") ? () => undefined : (stryCov_9fa48("1203"), (k, i) => stryMutAct_9fa48("1206") ? k !== KONAMI[i] : stryMutAct_9fa48("1205") ? false : stryMutAct_9fa48("1204") ? true : (stryCov_9fa48("1204", "1205", "1206"), k === KONAMI[i]))))))) {
              if (stryMutAct_9fa48("1207")) {
                {}
              } else {
                stryCov_9fa48("1207");
                setActive(stryMutAct_9fa48("1208") ? false : (stryCov_9fa48("1208"), true));
                setTimeout(stryMutAct_9fa48("1209") ? () => undefined : (stryCov_9fa48("1209"), () => setActive(stryMutAct_9fa48("1210") ? true : (stryCov_9fa48("1210"), false))), 5000);
                buffer = stryMutAct_9fa48("1211") ? ["Stryker was here"] : (stryCov_9fa48("1211"), []);
              }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("1212") ? "" : (stryCov_9fa48("1212"), "keydown"), onKey);
        return stryMutAct_9fa48("1213") ? () => undefined : (stryCov_9fa48("1213"), () => window.removeEventListener(stryMutAct_9fa48("1214") ? "" : (stryCov_9fa48("1214"), "keydown"), onKey));
      }
    }, stryMutAct_9fa48("1215") ? ["Stryker was here"] : (stryCov_9fa48("1215"), []));
    const columns = useMemo(stryMutAct_9fa48("1216") ? () => undefined : (stryCov_9fa48("1216"), () => Array.from(stryMutAct_9fa48("1217") ? {} : (stryCov_9fa48("1217"), {
      length: 30
    })).map(stryMutAct_9fa48("1218") ? () => undefined : (stryCov_9fa48("1218"), (_, i) => stryMutAct_9fa48("1219") ? {} : (stryCov_9fa48("1219"), {
      left: stryMutAct_9fa48("1220") ? `` : (stryCov_9fa48("1220"), `${stryMutAct_9fa48("1221") ? i / 30 / 100 : (stryCov_9fa48("1221"), (stryMutAct_9fa48("1222") ? i * 30 : (stryCov_9fa48("1222"), i / 30)) * 100)}%`),
      animation: stryMutAct_9fa48("1223") ? `` : (stryCov_9fa48("1223"), `matrix-fall ${stryMutAct_9fa48("1224") ? 2 - seededRandom(i) * 3 : (stryCov_9fa48("1224"), 2 + (stryMutAct_9fa48("1225") ? seededRandom(i) / 3 : (stryCov_9fa48("1225"), seededRandom(i) * 3)))}s linear ${stryMutAct_9fa48("1226") ? seededRandom(i + 100) / 2 : (stryCov_9fa48("1226"), seededRandom(stryMutAct_9fa48("1227") ? i - 100 : (stryCov_9fa48("1227"), i + 100)) * 2)}s infinite`),
      fontSize: stryMutAct_9fa48("1228") ? `` : (stryCov_9fa48("1228"), `${stryMutAct_9fa48("1229") ? 10 - seededRandom(i + 200) * 8 : (stryCov_9fa48("1229"), 10 + (stryMutAct_9fa48("1230") ? seededRandom(i + 200) / 8 : (stryCov_9fa48("1230"), seededRandom(stryMutAct_9fa48("1231") ? i - 200 : (stryCov_9fa48("1231"), i + 200)) * 8)))}px`),
      chars: Array.from(stryMutAct_9fa48("1232") ? {} : (stryCov_9fa48("1232"), {
        length: 20
      })).map(stryMutAct_9fa48("1233") ? () => undefined : (stryCov_9fa48("1233"), (_, j) => String.fromCharCode(stryMutAct_9fa48("1234") ? 0x30A0 - Math.floor(seededRandom(i * 20 + j) * 96) : (stryCov_9fa48("1234"), 0x30A0 + Math.floor(stryMutAct_9fa48("1235") ? seededRandom(i * 20 + j) / 96 : (stryCov_9fa48("1235"), seededRandom(stryMutAct_9fa48("1236") ? i * 20 - j : (stryCov_9fa48("1236"), (stryMutAct_9fa48("1237") ? i / 20 : (stryCov_9fa48("1237"), i * 20)) + j)) * 96))))))
    })))), stryMutAct_9fa48("1238") ? ["Stryker was here"] : (stryCov_9fa48("1238"), []));
    if (stryMutAct_9fa48("1241") ? false : stryMutAct_9fa48("1240") ? true : stryMutAct_9fa48("1239") ? active : (stryCov_9fa48("1239", "1240", "1241"), !active)) return null;
    return <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden">
      <div className="absolute inset-0 bg-[hsl(222,47%,3%)/0.85]" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-up">
          <div className="text-6xl md:text-8xl font-bold text-gradient-animated">
            {stryMutAct_9fa48("1242") ? "" : (stryCov_9fa48("1242"), "🤖 AI MODE")}
          </div>
          <div className="font-mono text-[#06d6e0] text-lg">
            {stryMutAct_9fa48("1243") ? "" : (stryCov_9fa48("1243"), "> sudo nadav --unlock-potential")}
          </div>
          <div className="font-mono text-[#27ca40] text-sm animate-pulse">
            {stryMutAct_9fa48("1244") ? "" : (stryCov_9fa48("1244"), "[SYSTEM] All systems powered by artificial intelligence")}
          </div>
        </div>
      </div>
      {columns.map(stryMutAct_9fa48("1245") ? () => undefined : (stryCov_9fa48("1245"), (col, i) => <div key={i} className="absolute top-0 text-[#06d6e0]/30 font-mono text-sm" style={stryMutAct_9fa48("1246") ? {} : (stryCov_9fa48("1246"), {
        insetInlineStart: col.left,
        animation: col.animation,
        fontSize: col.fontSize
      })}>
          {col.chars.map(stryMutAct_9fa48("1247") ? () => undefined : (stryCov_9fa48("1247"), (char, j) => <div key={j} className="opacity-70">
              {char}
            </div>))}
        </div>))}
    </div>;
  }
}