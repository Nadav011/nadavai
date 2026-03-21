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
import { useTranslations } from "next-intl";
import { Send, Mail, MessageSquare, Zap, Phone } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Magnetic } from "./magnetic";
gsap.registerPlugin(ScrollTrigger);
export function Contact() {
  if (stryMutAct_9fa48("1056")) {
    {}
  } else {
    stryCov_9fa48("1056");
    const t = useTranslations(stryMutAct_9fa48("1057") ? "" : (stryCov_9fa48("1057"), "contact"));
    const sectionRef = useRef<HTMLDivElement>(null);
    const badgeRef = useRef<HTMLDivElement>(null);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const descRef = useRef<HTMLParagraphElement>(null);
    const terminalRef = useRef<HTMLDivElement>(null);
    const calendlyRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    useGSAP(() => {
      if (stryMutAct_9fa48("1058")) {
        {}
      } else {
        stryCov_9fa48("1058");
        const tl = gsap.timeline(stryMutAct_9fa48("1059") ? {} : (stryCov_9fa48("1059"), {
          scrollTrigger: stryMutAct_9fa48("1060") ? {} : (stryCov_9fa48("1060"), {
            trigger: sectionRef.current,
            start: stryMutAct_9fa48("1061") ? "" : (stryCov_9fa48("1061"), "top 80%"),
            once: stryMutAct_9fa48("1062") ? false : (stryCov_9fa48("1062"), true)
          })
        }));
        tl.fromTo(badgeRef.current, stryMutAct_9fa48("1063") ? {} : (stryCov_9fa48("1063"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("1064") ? {} : (stryCov_9fa48("1064"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: stryMutAct_9fa48("1065") ? "" : (stryCov_9fa48("1065"), "expo.out")
        })).fromTo(headingRef.current, stryMutAct_9fa48("1066") ? {} : (stryCov_9fa48("1066"), {
          opacity: 0,
          y: 30
        }), stryMutAct_9fa48("1067") ? {} : (stryCov_9fa48("1067"), {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: stryMutAct_9fa48("1068") ? "" : (stryCov_9fa48("1068"), "expo.out")
        }), stryMutAct_9fa48("1069") ? "" : (stryCov_9fa48("1069"), "<0.15")).fromTo(descRef.current, stryMutAct_9fa48("1070") ? {} : (stryCov_9fa48("1070"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("1071") ? {} : (stryCov_9fa48("1071"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: stryMutAct_9fa48("1072") ? "" : (stryCov_9fa48("1072"), "expo.out")
        }), stryMutAct_9fa48("1073") ? "" : (stryCov_9fa48("1073"), "<0.15")).fromTo(terminalRef.current, stryMutAct_9fa48("1074") ? {} : (stryCov_9fa48("1074"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("1075") ? {} : (stryCov_9fa48("1075"), {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: stryMutAct_9fa48("1076") ? "" : (stryCov_9fa48("1076"), "expo.out")
        }), stryMutAct_9fa48("1077") ? "" : (stryCov_9fa48("1077"), "<0.2")).fromTo(calendlyRef.current, stryMutAct_9fa48("1078") ? {} : (stryCov_9fa48("1078"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("1079") ? {} : (stryCov_9fa48("1079"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: stryMutAct_9fa48("1080") ? "" : (stryCov_9fa48("1080"), "expo.out")
        }), stryMutAct_9fa48("1081") ? "" : (stryCov_9fa48("1081"), "<0.15")).fromTo(stryMutAct_9fa48("1084") ? ctaRef.current?.children && [] : stryMutAct_9fa48("1083") ? false : stryMutAct_9fa48("1082") ? true : (stryCov_9fa48("1082", "1083", "1084"), (stryMutAct_9fa48("1085") ? ctaRef.current.children : (stryCov_9fa48("1085"), ctaRef.current?.children)) || (stryMutAct_9fa48("1086") ? ["Stryker was here"] : (stryCov_9fa48("1086"), []))), stryMutAct_9fa48("1087") ? {} : (stryCov_9fa48("1087"), {
          opacity: 0,
          y: 20
        }), stryMutAct_9fa48("1088") ? {} : (stryCov_9fa48("1088"), {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: stryMutAct_9fa48("1089") ? "" : (stryCov_9fa48("1089"), "expo.out"),
          stagger: 0.1
        }), stryMutAct_9fa48("1090") ? "" : (stryCov_9fa48("1090"), "<0.15"));
      }
    }, stryMutAct_9fa48("1091") ? {} : (stryCov_9fa48("1091"), {
      scope: sectionRef
    }));
    return <section ref={sectionRef} id="contact" aria-label={t(stryMutAct_9fa48("1092") ? "" : (stryCov_9fa48("1092"), "title"))} className="relative py-16 md:py-32 overflow-hidden">
      <div className="absolute top-0 w-[800px] h-[400px] bg-[#06d6e0]/5 rounded-full blur-[120px]" style={stryMutAct_9fa48("1093") ? {} : (stryCov_9fa48("1093"), {
        left: stryMutAct_9fa48("1094") ? "" : (stryCov_9fa48("1094"), "50%"),
        transform: stryMutAct_9fa48("1095") ? "" : (stryCov_9fa48("1095"), "translateX(-50%)")
      })} />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
        <div ref={badgeRef} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e84393]/20 bg-[#e84393]/5 mb-6">
          <Zap className="w-3.5 h-3.5 text-[#e84393]" />
          <span className="text-xs font-mono text-[#e84393] tracking-wider uppercase">{t(stryMutAct_9fa48("1096") ? "" : (stryCov_9fa48("1096"), "badge"))}</span>
        </div>

        <h2 ref={headingRef} className="text-2xl md:text-6xl lg:text-7xl font-bold text-[hsl(210,40%,98%)] mb-4 md:mb-6 leading-[1.1]">
          {t(stryMutAct_9fa48("1097") ? "" : (stryCov_9fa48("1097"), "heading1"))}
          <br />
          <span className="text-gradient-animated">{t(stryMutAct_9fa48("1098") ? "" : (stryCov_9fa48("1098"), "heading2"))}</span>
        </h2>

        <p ref={descRef} className="text-base md:text-lg text-[hsl(215,20%,55%)] max-w-xl mx-auto mb-8 md:mb-10 leading-relaxed px-2 md:px-0">
          {t(stryMutAct_9fa48("1099") ? "" : (stryCov_9fa48("1099"), "description"))}
        </p>

        <div ref={terminalRef} className="relative mx-auto max-w-2xl rounded-xl overflow-hidden border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] group/terminal">
          {/* Terminal scan line */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl z-10">
            <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-[#06d6e0]/20 to-transparent" style={stryMutAct_9fa48("1100") ? {} : (stryCov_9fa48("1100"), {
              animation: stryMutAct_9fa48("1101") ? "" : (stryCov_9fa48("1101"), "scan-line 6s linear infinite")
            })} />
          </div>
          <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(215,28%,16%)] bg-[hsl(222,47%,6%)]">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
            </div>
            <span className="text-xs font-mono text-[hsl(215,20%,48%)]">contact.sh</span>
            <div className="w-12" />
          </div>

          <div className="p-4 md:p-8 space-y-3 md:space-y-4 text-end">
            <div className="flex items-center gap-3 font-mono text-sm">
              <span className="text-[#06d6e0]">$</span>
              <span className="text-[hsl(215,20%,60%)]">echo</span>
              <span className="text-[#e84393]">{stryMutAct_9fa48("1102") ? `` : (stryCov_9fa48("1102"), `"${t(stryMutAct_9fa48("1103") ? "" : (stryCov_9fa48("1103"), "terminalCmd"))}"`)}</span>
            </div>

            <div className="space-y-2 md:space-y-3 me-2 md:me-6">
              <a href="https://wa.me/972504401760" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-[#27ca40]/30 bg-[#27ca40]/5 hover:border-[#27ca40]/50 hover:bg-[#27ca40]/10 transition-all group">
                <Phone className="w-5 h-5 text-[#27ca40]" />
                <div className="text-end">
                  <div className="text-sm font-medium text-[hsl(210,40%,98%)]">{stryMutAct_9fa48("1104") ? "" : (stryCov_9fa48("1104"), "WhatsApp")}</div>
                  <div className="text-xs text-[#27ca40]">{t(stryMutAct_9fa48("1105") ? "" : (stryCov_9fa48("1105"), "waSubtitle"))}</div>
                </div>
              </a>

              <a href="mailto:hello@nadavc.ai" className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(215,28%,14%)] bg-[hsl(222,47%,4%)] hover:border-[#06d6e0]/30 transition-all group">
                <Mail className="w-5 h-5 text-[#06d6e0]" />
                <div className="text-end">
                  <div className="text-sm font-medium text-[hsl(210,40%,98%)]">hello@nadavc.ai</div>
                  <div className="text-xs text-[hsl(215,20%,45%)]">{t(stryMutAct_9fa48("1106") ? "" : (stryCov_9fa48("1106"), "emailSubtitle"))}</div>
                </div>
              </a>

              <a href="https://m.me/nadav.cohen.167" target="_blank" rel="noreferrer" className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(215,28%,14%)] bg-[hsl(222,47%,4%)] hover:border-[#e84393]/30 transition-all group">
                <MessageSquare className="w-5 h-5 text-[#e84393]" />
                <div className="text-end">
                  <div className="text-sm font-medium text-[hsl(210,40%,98%)]">{t(stryMutAct_9fa48("1107") ? "" : (stryCov_9fa48("1107"), "fbTitle"))}</div>
                  <div className="text-xs text-[hsl(215,20%,45%)]">{t(stryMutAct_9fa48("1108") ? "" : (stryCov_9fa48("1108"), "fbSubtitle"))}</div>
                </div>
              </a>
            </div>

            <div className="flex items-center gap-3 font-mono text-sm pt-2">
              <span className="text-[#27ca40]">{stryMutAct_9fa48("1109") ? "" : (stryCov_9fa48("1109"), ">")}</span>
              <span className="text-[hsl(215,20%,50%)]">{t(stryMutAct_9fa48("1110") ? "" : (stryCov_9fa48("1110"), "avgResponseLabel"))}</span>
              <span className="text-[#06d6e0]">{t(stryMutAct_9fa48("1111") ? "" : (stryCov_9fa48("1111"), "avgResponseValue"))}</span>
            </div>
          </div>
        </div>

        <div ref={calendlyRef} className="mt-8 mx-auto max-w-2xl">
          <a href="https://calendly.com/nadavcohen" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-3 p-4 rounded-xl border border-[#4f46e5]/30 bg-[#4f46e5]/5 hover:border-[#4f46e5]/50 hover:bg-[#4f46e5]/10 transition-all group">
            <svg className="w-5 h-5 text-[#4f46e5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
            <div className="text-end">
              <div className="text-sm font-medium text-[hsl(210,40%,98%)]">{t(stryMutAct_9fa48("1112") ? "" : (stryCov_9fa48("1112"), "calendlyTitle"))}</div>
              <div className="text-xs text-[#4f46e5]">{t(stryMutAct_9fa48("1113") ? "" : (stryCov_9fa48("1113"), "calendlySubtitle"))}</div>
            </div>
          </a>
        </div>

        <div ref={ctaRef} className="mt-8 md:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4">
          <Magnetic strength={0.2}>
            <a href="https://wa.me/972504401760" target="_blank" rel="noreferrer" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 md:px-10 md:py-5 rounded-xl text-base md:text-lg font-bold text-[hsl(222,47%,4%)] bg-gradient-to-l from-[#27ca40] to-[#22a838] hover:shadow-[0_0_50px_hsl(135,65%,45%,0.4)] transition-all duration-500 w-full sm:w-auto">
              <Phone className="w-5 h-5" />
              {t(stryMutAct_9fa48("1114") ? "" : (stryCov_9fa48("1114"), "ctaWhatsapp"))}
            </a>
          </Magnetic>
          <Magnetic strength={0.2}>
            <a href="mailto:hello@nadavc.ai" className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl text-base font-medium text-[hsl(210,40%,98%)] border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] hover:border-[#06d6e0]/40 transition-all duration-500 w-full sm:w-auto">
              <Send className="w-4 h-4 text-[#06d6e0]" />
              {t(stryMutAct_9fa48("1115") ? "" : (stryCov_9fa48("1115"), "ctaEmail"))}
            </a>
          </Magnetic>
        </div>
      </div>
    </section>;
  }
}