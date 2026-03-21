// @ts-nocheck
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
import { ImageResponse } from "next/og";
export const runtime = stryMutAct_9fa48("538") ? "" : (stryCov_9fa48("538"), "edge");
export const alt = stryMutAct_9fa48("539") ? "" : (stryCov_9fa48("539"), "NADAV.AI - Full-Stack AI Developer");
export const size = stryMutAct_9fa48("540") ? {} : (stryCov_9fa48("540"), {
  width: 1200,
  height: 630
});
export const contentType = stryMutAct_9fa48("541") ? "" : (stryCov_9fa48("541"), "image/png");
export default async function Image() {
  if (stryMutAct_9fa48("542")) {
    {}
  } else {
    stryCov_9fa48("542");
    return new ImageResponse(<div style={stryMutAct_9fa48("543") ? {} : (stryCov_9fa48("543"), {
      width: stryMutAct_9fa48("544") ? "" : (stryCov_9fa48("544"), "100%"),
      height: stryMutAct_9fa48("545") ? "" : (stryCov_9fa48("545"), "100%"),
      display: stryMutAct_9fa48("546") ? "" : (stryCov_9fa48("546"), "flex"),
      flexDirection: stryMutAct_9fa48("547") ? "" : (stryCov_9fa48("547"), "column"),
      alignItems: stryMutAct_9fa48("548") ? "" : (stryCov_9fa48("548"), "center"),
      justifyContent: stryMutAct_9fa48("549") ? "" : (stryCov_9fa48("549"), "center"),
      background: stryMutAct_9fa48("550") ? "" : (stryCov_9fa48("550"), "linear-gradient(135deg, #070714 0%, #0a0a1a 50%, #0d0d20 100%)"),
      fontFamily: stryMutAct_9fa48("551") ? "" : (stryCov_9fa48("551"), "system-ui, sans-serif")
    })}>
        {/* Grid background */}
        <div style={stryMutAct_9fa48("552") ? {} : (stryCov_9fa48("552"), {
        position: stryMutAct_9fa48("553") ? "" : (stryCov_9fa48("553"), "absolute"),
        inset: 0,
        backgroundImage: stryMutAct_9fa48("554") ? "" : (stryCov_9fa48("554"), "linear-gradient(rgba(6,214,224,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(6,214,224,0.05) 1px, transparent 1px)"),
        backgroundSize: stryMutAct_9fa48("555") ? "" : (stryCov_9fa48("555"), "60px 60px")
      })} />

        {/* Glow effects */}
        <div style={stryMutAct_9fa48("556") ? {} : (stryCov_9fa48("556"), {
        position: stryMutAct_9fa48("557") ? "" : (stryCov_9fa48("557"), "absolute"),
        top: stryMutAct_9fa48("558") ? +100 : (stryCov_9fa48("558"), -100),
        left: 200,
        width: 400,
        height: 400,
        borderRadius: stryMutAct_9fa48("559") ? "" : (stryCov_9fa48("559"), "50%"),
        background: stryMutAct_9fa48("560") ? "" : (stryCov_9fa48("560"), "radial-gradient(circle, rgba(6,214,224,0.15), transparent 70%)")
      })} />
        <div style={stryMutAct_9fa48("561") ? {} : (stryCov_9fa48("561"), {
        position: stryMutAct_9fa48("562") ? "" : (stryCov_9fa48("562"), "absolute"),
        bottom: stryMutAct_9fa48("563") ? +100 : (stryCov_9fa48("563"), -100),
        right: 200,
        width: 400,
        height: 400,
        borderRadius: stryMutAct_9fa48("564") ? "" : (stryCov_9fa48("564"), "50%"),
        background: stryMutAct_9fa48("565") ? "" : (stryCov_9fa48("565"), "radial-gradient(circle, rgba(232,67,147,0.12), transparent 70%)")
      })} />

        {/* Logo icon */}
        <div style={stryMutAct_9fa48("566") ? {} : (stryCov_9fa48("566"), {
        display: stryMutAct_9fa48("567") ? "" : (stryCov_9fa48("567"), "flex"),
        alignItems: stryMutAct_9fa48("568") ? "" : (stryCov_9fa48("568"), "center"),
        justifyContent: stryMutAct_9fa48("569") ? "" : (stryCov_9fa48("569"), "center"),
        width: 80,
        height: 80,
        borderRadius: 20,
        background: stryMutAct_9fa48("570") ? "" : (stryCov_9fa48("570"), "linear-gradient(135deg, #06d6e0, #e84393)"),
        marginBottom: 32
      })}>
          <div style={stryMutAct_9fa48("571") ? {} : (stryCov_9fa48("571"), {
          display: stryMutAct_9fa48("572") ? "" : (stryCov_9fa48("572"), "flex"),
          alignItems: stryMutAct_9fa48("573") ? "" : (stryCov_9fa48("573"), "center"),
          justifyContent: stryMutAct_9fa48("574") ? "" : (stryCov_9fa48("574"), "center"),
          width: 74,
          height: 74,
          borderRadius: 17,
          background: stryMutAct_9fa48("575") ? "" : (stryCov_9fa48("575"), "#070714"),
          fontSize: 36,
          color: stryMutAct_9fa48("576") ? "" : (stryCov_9fa48("576"), "#06d6e0")
        })}>
            ⚡
          </div>
        </div>

        {/* Title */}
        <div style={stryMutAct_9fa48("577") ? {} : (stryCov_9fa48("577"), {
        display: stryMutAct_9fa48("578") ? "" : (stryCov_9fa48("578"), "flex"),
        alignItems: stryMutAct_9fa48("579") ? "" : (stryCov_9fa48("579"), "baseline"),
        gap: 4,
        marginBottom: 16
      })}>
          <span style={stryMutAct_9fa48("580") ? {} : (stryCov_9fa48("580"), {
          fontSize: 72,
          fontWeight: 800,
          color: stryMutAct_9fa48("581") ? "" : (stryCov_9fa48("581"), "#e8e8ed"),
          letterSpacing: stryMutAct_9fa48("582") ? +2 : (stryCov_9fa48("582"), -2)
        })}>
            NADAV
          </span>
          <span style={stryMutAct_9fa48("583") ? {} : (stryCov_9fa48("583"), {
          fontSize: 72,
          fontWeight: 800,
          letterSpacing: stryMutAct_9fa48("584") ? +2 : (stryCov_9fa48("584"), -2),
          background: stryMutAct_9fa48("585") ? "" : (stryCov_9fa48("585"), "linear-gradient(135deg, #06d6e0, #e84393)"),
          backgroundClip: stryMutAct_9fa48("586") ? "" : (stryCov_9fa48("586"), "text"),
          color: stryMutAct_9fa48("587") ? "" : (stryCov_9fa48("587"), "transparent")
        })}>
            .AI
          </span>
        </div>

        {/* Subtitle */}
        <div style={stryMutAct_9fa48("588") ? {} : (stryCov_9fa48("588"), {
        fontSize: 28,
        color: stryMutAct_9fa48("589") ? "" : (stryCov_9fa48("589"), "#8b8b9e"),
        marginBottom: 40,
        fontWeight: 500
      })}>
          Full-Stack AI Developer
        </div>

        {/* Stats row */}
        <div style={stryMutAct_9fa48("590") ? {} : (stryCov_9fa48("590"), {
        display: stryMutAct_9fa48("591") ? "" : (stryCov_9fa48("591"), "flex"),
        gap: 48
      })}>
          {(stryMutAct_9fa48("592") ? [] : (stryCov_9fa48("592"), [stryMutAct_9fa48("593") ? {} : (stryCov_9fa48("593"), {
          value: stryMutAct_9fa48("594") ? "" : (stryCov_9fa48("594"), "8+"),
          label: stryMutAct_9fa48("595") ? "" : (stryCov_9fa48("595"), "Production Apps")
        }), stryMutAct_9fa48("596") ? {} : (stryCov_9fa48("596"), {
          value: stryMutAct_9fa48("597") ? "" : (stryCov_9fa48("597"), "80"),
          label: stryMutAct_9fa48("598") ? "" : (stryCov_9fa48("598"), "AI Skills")
        }), stryMutAct_9fa48("599") ? {} : (stryCov_9fa48("599"), {
          value: stryMutAct_9fa48("600") ? "" : (stryCov_9fa48("600"), "38+"),
          label: stryMutAct_9fa48("601") ? "" : (stryCov_9fa48("601"), "AI Agents")
        })])).map(stryMutAct_9fa48("602") ? () => undefined : (stryCov_9fa48("602"), stat => <div key={stat.label} style={stryMutAct_9fa48("603") ? {} : (stryCov_9fa48("603"), {
          display: stryMutAct_9fa48("604") ? "" : (stryCov_9fa48("604"), "flex"),
          flexDirection: stryMutAct_9fa48("605") ? "" : (stryCov_9fa48("605"), "column"),
          alignItems: stryMutAct_9fa48("606") ? "" : (stryCov_9fa48("606"), "center")
        })}>
              <span style={stryMutAct_9fa48("607") ? {} : (stryCov_9fa48("607"), {
            fontSize: 36,
            fontWeight: 800,
            color: stryMutAct_9fa48("608") ? "" : (stryCov_9fa48("608"), "#06d6e0")
          })}>{stat.value}</span>
              <span style={stryMutAct_9fa48("609") ? {} : (stryCov_9fa48("609"), {
            fontSize: 14,
            color: stryMutAct_9fa48("610") ? "" : (stryCov_9fa48("610"), "#8b8b9e"),
            letterSpacing: 1,
            textTransform: stryMutAct_9fa48("611") ? "" : (stryCov_9fa48("611"), "uppercase")
          })}>
                {stat.label}
              </span>
            </div>))}
        </div>

        {/* Bottom URL */}
        <div style={stryMutAct_9fa48("612") ? {} : (stryCov_9fa48("612"), {
        position: stryMutAct_9fa48("613") ? "" : (stryCov_9fa48("613"), "absolute"),
        bottom: 32,
        display: stryMutAct_9fa48("614") ? "" : (stryCov_9fa48("614"), "flex"),
        alignItems: stryMutAct_9fa48("615") ? "" : (stryCov_9fa48("615"), "center"),
        gap: 8,
        color: stryMutAct_9fa48("616") ? "" : (stryCov_9fa48("616"), "#4a4a5e"),
        fontSize: 16
      })}>
          <span style={stryMutAct_9fa48("617") ? {} : (stryCov_9fa48("617"), {
          fontFamily: stryMutAct_9fa48("618") ? "" : (stryCov_9fa48("618"), "monospace")
        })}>nadavc.ai</span>
          <span>•</span>
          <span>Everything with AI</span>
        </div>
      </div>, stryMutAct_9fa48("619") ? {} : (stryCov_9fa48("619"), {
      ...size
    }));
  }
}