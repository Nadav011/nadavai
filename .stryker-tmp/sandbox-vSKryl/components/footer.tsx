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
import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { Zap, Send } from "lucide-react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);
function NewsletterForm() {
  if (stryMutAct_9fa48("1248")) {
    {}
  } else {
    stryCov_9fa48("1248");
    const t = useTranslations(stryMutAct_9fa48("1249") ? "" : (stryCov_9fa48("1249"), "footer"));
    const tCommon = useTranslations(stryMutAct_9fa48("1250") ? "" : (stryCov_9fa48("1250"), "common"));
    const [email, setEmail] = useState(stryMutAct_9fa48("1251") ? "Stryker was here!" : (stryCov_9fa48("1251"), ""));
    const [status, setStatus] = useState<"idle" | "success" | "error">(stryMutAct_9fa48("1252") ? "" : (stryCov_9fa48("1252"), "idle"));
    const handleSubmit = async (e: React.FormEvent) => {
      if (stryMutAct_9fa48("1253")) {
        {}
      } else {
        stryCov_9fa48("1253");
        e.preventDefault();
        if (stryMutAct_9fa48("1256") ? false : stryMutAct_9fa48("1255") ? true : stryMutAct_9fa48("1254") ? email : (stryCov_9fa48("1254", "1255", "1256"), !email)) return;
        try {
          if (stryMutAct_9fa48("1257")) {
            {}
          } else {
            stryCov_9fa48("1257");
            const res = await fetch(stryMutAct_9fa48("1258") ? "" : (stryCov_9fa48("1258"), "/api/newsletter"), stryMutAct_9fa48("1259") ? {} : (stryCov_9fa48("1259"), {
              method: stryMutAct_9fa48("1260") ? "" : (stryCov_9fa48("1260"), "POST"),
              headers: stryMutAct_9fa48("1261") ? {} : (stryCov_9fa48("1261"), {
                "Content-Type": stryMutAct_9fa48("1262") ? "" : (stryCov_9fa48("1262"), "application/json")
              }),
              body: JSON.stringify(stryMutAct_9fa48("1263") ? {} : (stryCov_9fa48("1263"), {
                email
              }))
            }));
            if (stryMutAct_9fa48("1265") ? false : stryMutAct_9fa48("1264") ? true : (stryCov_9fa48("1264", "1265"), res.ok)) {
              if (stryMutAct_9fa48("1266")) {
                {}
              } else {
                stryCov_9fa48("1266");
                setStatus(stryMutAct_9fa48("1267") ? "" : (stryCov_9fa48("1267"), "success"));
                setEmail(stryMutAct_9fa48("1268") ? "Stryker was here!" : (stryCov_9fa48("1268"), ""));
              }
            } else {
              if (stryMutAct_9fa48("1269")) {
                {}
              } else {
                stryCov_9fa48("1269");
                setStatus(stryMutAct_9fa48("1270") ? "" : (stryCov_9fa48("1270"), "error"));
              }
            }
          }
        } catch {
          if (stryMutAct_9fa48("1271")) {
            {}
          } else {
            stryCov_9fa48("1271");
            setStatus(stryMutAct_9fa48("1272") ? "" : (stryCov_9fa48("1272"), "error"));
          }
        }
      }
    };
    return <div className="newsletter-section py-8 border-t border-[hsl(215,28%,14%)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h4 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-1">
            {t(stryMutAct_9fa48("1273") ? "" : (stryCov_9fa48("1273"), "newsletterTitle"))}
          </h4>
          <p className="text-xs text-[hsl(215,20%,45%)]">
            {t(stryMutAct_9fa48("1274") ? "" : (stryCov_9fa48("1274"), "newsletterDesc"))}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <label htmlFor="newsletter-email" className="sr-only">{t(stryMutAct_9fa48("1275") ? "" : (stryCov_9fa48("1275"), "newsletterTitle"))}</label>
            <input id="newsletter-email" type="email" dir="ltr" value={email} onChange={e => {
              if (stryMutAct_9fa48("1276")) {
                {}
              } else {
                stryCov_9fa48("1276");
                setEmail(e.target.value);
                setStatus(stryMutAct_9fa48("1277") ? "" : (stryCov_9fa48("1277"), "idle"));
              }
            }} placeholder={tCommon(stryMutAct_9fa48("1278") ? "" : (stryCov_9fa48("1278"), "emailPlaceholder"))} className="w-full h-11 px-4 rounded-lg bg-[hsl(222,47%,6%)] border border-[hsl(215,28%,16%)] text-sm text-[hsl(210,40%,98%)] placeholder:text-[hsl(215,20%,45%)] focus:outline-none focus:border-[#06d6e0]/50 transition-colors" required aria-describedby={(stryMutAct_9fa48("1281") ? status !== "success" : stryMutAct_9fa48("1280") ? false : stryMutAct_9fa48("1279") ? true : (stryCov_9fa48("1279", "1280", "1281"), status === (stryMutAct_9fa48("1282") ? "" : (stryCov_9fa48("1282"), "success")))) ? stryMutAct_9fa48("1283") ? "" : (stryCov_9fa48("1283"), "newsletter-success") : (stryMutAct_9fa48("1286") ? status !== "error" : stryMutAct_9fa48("1285") ? false : stryMutAct_9fa48("1284") ? true : (stryCov_9fa48("1284", "1285", "1286"), status === (stryMutAct_9fa48("1287") ? "" : (stryCov_9fa48("1287"), "error")))) ? stryMutAct_9fa48("1288") ? "" : (stryCov_9fa48("1288"), "newsletter-error") : undefined} />
          </div>
          <button type="submit" className="h-11 px-5 rounded-lg bg-gradient-to-l from-[#06d6e0] to-[#0abfca] text-[hsl(222,47%,4%)] text-sm font-bold flex items-center gap-2 hover:shadow-[0_0_20px_hsl(187,92%,55%,0.3)] transition-shadow" aria-label={t(stryMutAct_9fa48("1289") ? "" : (stryCov_9fa48("1289"), "newsletterBtn"))}>
            <Send className="w-3.5 h-3.5" aria-hidden="true" />
            <span>{t(stryMutAct_9fa48("1290") ? "" : (stryCov_9fa48("1290"), "newsletterBtn"))}</span>
          </button>
        </form>
      </div>
      {stryMutAct_9fa48("1293") ? status === "success" || <p id="newsletter-success" role="status" className="mt-3 text-xs text-[#06d6e0]">{t("newsletterSuccess")}</p> : stryMutAct_9fa48("1292") ? false : stryMutAct_9fa48("1291") ? true : (stryCov_9fa48("1291", "1292", "1293"), (stryMutAct_9fa48("1295") ? status !== "success" : stryMutAct_9fa48("1294") ? true : (stryCov_9fa48("1294", "1295"), status === (stryMutAct_9fa48("1296") ? "" : (stryCov_9fa48("1296"), "success")))) && <p id="newsletter-success" role="status" className="mt-3 text-xs text-[#06d6e0]">{t(stryMutAct_9fa48("1297") ? "" : (stryCov_9fa48("1297"), "newsletterSuccess"))}</p>)}
      {stryMutAct_9fa48("1300") ? status === "error" || <p id="newsletter-error" role="alert" className="mt-3 text-xs text-[#e84393]">{t("newsletterError")}</p> : stryMutAct_9fa48("1299") ? false : stryMutAct_9fa48("1298") ? true : (stryCov_9fa48("1298", "1299", "1300"), (stryMutAct_9fa48("1302") ? status !== "error" : stryMutAct_9fa48("1301") ? true : (stryCov_9fa48("1301", "1302"), status === (stryMutAct_9fa48("1303") ? "" : (stryCov_9fa48("1303"), "error")))) && <p id="newsletter-error" role="alert" className="mt-3 text-xs text-[#e84393]">{t(stryMutAct_9fa48("1304") ? "" : (stryCov_9fa48("1304"), "newsletterError"))}</p>)}
    </div>;
  }
}
export function Footer() {
  if (stryMutAct_9fa48("1305")) {
    {}
  } else {
    stryCov_9fa48("1305");
    const t = useTranslations(stryMutAct_9fa48("1306") ? "" : (stryCov_9fa48("1306"), "footer"));
    const sectionRef = useRef<HTMLElement>(null);
    const footerLinks = stryMutAct_9fa48("1307") ? [] : (stryCov_9fa48("1307"), [stryMutAct_9fa48("1308") ? {} : (stryCov_9fa48("1308"), {
      title: t(stryMutAct_9fa48("1309") ? "" : (stryCov_9fa48("1309"), "navTitle")),
      links: stryMutAct_9fa48("1310") ? [] : (stryCov_9fa48("1310"), [stryMutAct_9fa48("1311") ? {} : (stryCov_9fa48("1311"), {
        label: t(stryMutAct_9fa48("1312") ? "" : (stryCov_9fa48("1312"), "navProjects")),
        href: stryMutAct_9fa48("1313") ? "" : (stryCov_9fa48("1313"), "#projects")
      }), stryMutAct_9fa48("1314") ? {} : (stryCov_9fa48("1314"), {
        label: t(stryMutAct_9fa48("1315") ? "" : (stryCov_9fa48("1315"), "navServices")),
        href: stryMutAct_9fa48("1316") ? "" : (stryCov_9fa48("1316"), "#services")
      }), stryMutAct_9fa48("1317") ? {} : (stryCov_9fa48("1317"), {
        label: t(stryMutAct_9fa48("1318") ? "" : (stryCov_9fa48("1318"), "navGuides")),
        href: stryMutAct_9fa48("1319") ? "" : (stryCov_9fa48("1319"), "#guides")
      }), stryMutAct_9fa48("1320") ? {} : (stryCov_9fa48("1320"), {
        label: t(stryMutAct_9fa48("1321") ? "" : (stryCov_9fa48("1321"), "navResources")),
        href: stryMutAct_9fa48("1322") ? "" : (stryCov_9fa48("1322"), "#resources")
      })])
    }), stryMutAct_9fa48("1323") ? {} : (stryCov_9fa48("1323"), {
      title: t(stryMutAct_9fa48("1324") ? "" : (stryCov_9fa48("1324"), "contentTitle")),
      links: stryMutAct_9fa48("1325") ? [] : (stryCov_9fa48("1325"), [stryMutAct_9fa48("1326") ? {} : (stryCov_9fa48("1326"), {
        label: t(stryMutAct_9fa48("1327") ? "" : (stryCov_9fa48("1327"), "contentNews")),
        href: stryMutAct_9fa48("1328") ? "" : (stryCov_9fa48("1328"), "#news")
      }), stryMutAct_9fa48("1329") ? {} : (stryCov_9fa48("1329"), {
        label: t(stryMutAct_9fa48("1330") ? "" : (stryCov_9fa48("1330"), "contentVideos")),
        href: stryMutAct_9fa48("1331") ? "" : (stryCov_9fa48("1331"), "#guides")
      }), stryMutAct_9fa48("1332") ? {} : (stryCov_9fa48("1332"), {
        label: t(stryMutAct_9fa48("1333") ? "" : (stryCov_9fa48("1333"), "contentRepos")),
        href: stryMutAct_9fa48("1334") ? "" : (stryCov_9fa48("1334"), "#resources")
      }), stryMutAct_9fa48("1335") ? {} : (stryCov_9fa48("1335"), {
        label: t(stryMutAct_9fa48("1336") ? "" : (stryCov_9fa48("1336"), "contentContact")),
        href: stryMutAct_9fa48("1337") ? "" : (stryCov_9fa48("1337"), "#contact")
      })])
    }), stryMutAct_9fa48("1338") ? {} : (stryCov_9fa48("1338"), {
      title: t(stryMutAct_9fa48("1339") ? "" : (stryCov_9fa48("1339"), "socialTitle")),
      links: stryMutAct_9fa48("1340") ? [] : (stryCov_9fa48("1340"), [stryMutAct_9fa48("1341") ? {} : (stryCov_9fa48("1341"), {
        label: stryMutAct_9fa48("1342") ? "" : (stryCov_9fa48("1342"), "GitHub"),
        href: stryMutAct_9fa48("1343") ? "" : (stryCov_9fa48("1343"), "https://github.com/Nadav011")
      }), stryMutAct_9fa48("1344") ? {} : (stryCov_9fa48("1344"), {
        label: stryMutAct_9fa48("1345") ? "" : (stryCov_9fa48("1345"), "Facebook"),
        href: stryMutAct_9fa48("1346") ? "" : (stryCov_9fa48("1346"), "https://www.facebook.com/nadav.cohen.167")
      })])
    })]);
    useGSAP(() => {
      if (stryMutAct_9fa48("1347")) {
        {}
      } else {
        stryCov_9fa48("1347");
        if (stryMutAct_9fa48("1350") ? false : stryMutAct_9fa48("1349") ? true : stryMutAct_9fa48("1348") ? sectionRef.current : (stryCov_9fa48("1348", "1349", "1350"), !sectionRef.current)) return;
        const ctx = gsap.context(() => {
          if (stryMutAct_9fa48("1351")) {
            {}
          } else {
            stryCov_9fa48("1351");
            // Animate brand section
            gsap.from(stryMutAct_9fa48("1352") ? "" : (stryCov_9fa48("1352"), ".footer-brand"), stryMutAct_9fa48("1353") ? {} : (stryCov_9fa48("1353"), {
              opacity: 0,
              y: 20,
              duration: 0.8,
              ease: stryMutAct_9fa48("1354") ? "" : (stryCov_9fa48("1354"), "expo.out"),
              scrollTrigger: stryMutAct_9fa48("1355") ? {} : (stryCov_9fa48("1355"), {
                trigger: sectionRef.current,
                start: stryMutAct_9fa48("1356") ? "" : (stryCov_9fa48("1356"), "top 85%"),
                once: stryMutAct_9fa48("1357") ? false : (stryCov_9fa48("1357"), true)
              })
            }));

            // Batch animate footer link groups
            gsap.from(stryMutAct_9fa48("1358") ? "" : (stryCov_9fa48("1358"), ".footer-link-group"), stryMutAct_9fa48("1359") ? {} : (stryCov_9fa48("1359"), {
              opacity: 0,
              y: 20,
              duration: 0.8,
              ease: stryMutAct_9fa48("1360") ? "" : (stryCov_9fa48("1360"), "expo.out"),
              stagger: 0.1,
              scrollTrigger: stryMutAct_9fa48("1361") ? {} : (stryCov_9fa48("1361"), {
                trigger: sectionRef.current,
                start: stryMutAct_9fa48("1362") ? "" : (stryCov_9fa48("1362"), "top 85%"),
                once: stryMutAct_9fa48("1363") ? false : (stryCov_9fa48("1363"), true)
              })
            }));

            // Animate newsletter section
            gsap.from(stryMutAct_9fa48("1364") ? "" : (stryCov_9fa48("1364"), ".newsletter-section"), stryMutAct_9fa48("1365") ? {} : (stryCov_9fa48("1365"), {
              opacity: 0,
              y: 20,
              duration: 0.8,
              ease: stryMutAct_9fa48("1366") ? "" : (stryCov_9fa48("1366"), "expo.out"),
              scrollTrigger: stryMutAct_9fa48("1367") ? {} : (stryCov_9fa48("1367"), {
                trigger: stryMutAct_9fa48("1368") ? "" : (stryCov_9fa48("1368"), ".newsletter-section"),
                start: stryMutAct_9fa48("1369") ? "" : (stryCov_9fa48("1369"), "top 85%"),
                once: stryMutAct_9fa48("1370") ? false : (stryCov_9fa48("1370"), true)
              })
            }));

            // Animate bottom bar
            gsap.from(stryMutAct_9fa48("1371") ? "" : (stryCov_9fa48("1371"), ".footer-bottom"), stryMutAct_9fa48("1372") ? {} : (stryCov_9fa48("1372"), {
              opacity: 0,
              duration: 0.8,
              ease: stryMutAct_9fa48("1373") ? "" : (stryCov_9fa48("1373"), "expo.out"),
              scrollTrigger: stryMutAct_9fa48("1374") ? {} : (stryCov_9fa48("1374"), {
                trigger: stryMutAct_9fa48("1375") ? "" : (stryCov_9fa48("1375"), ".footer-bottom"),
                start: stryMutAct_9fa48("1376") ? "" : (stryCov_9fa48("1376"), "top 85%"),
                once: stryMutAct_9fa48("1377") ? false : (stryCov_9fa48("1377"), true)
              })
            }));
          }
        }, sectionRef);
        return stryMutAct_9fa48("1378") ? () => undefined : (stryCov_9fa48("1378"), () => ctx.revert());
      }
    }, stryMutAct_9fa48("1379") ? ["Stryker was here"] : (stryCov_9fa48("1379"), []));
    return <footer ref={sectionRef} className="relative border-t border-[hsl(215,28%,16%)] bg-[hsl(222,47%,3%)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main footer */}
        <div className="py-8 md:py-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          {/* Brand */}
          <div className="footer-brand col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#06d6e0] to-[#e84393] p-[1px]">
                <div className="flex items-center justify-center w-full h-full rounded-[6px] bg-[hsl(222,47%,3%)]">
                  <Zap className="w-4 h-4 text-[#06d6e0]" />
                </div>
              </div>
              <span className="text-lg font-bold text-[hsl(210,40%,98%)]">NADAV<span className="text-gradient">.AI</span></span>
            </a>
            <p className="text-sm text-[hsl(215,20%,45%)] leading-relaxed mb-4">
              {t(stryMutAct_9fa48("1380") ? "" : (stryCov_9fa48("1380"), "brand"))}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#27ca40] animate-pulse" />
              <span className="text-xs font-mono text-[hsl(215,20%,48%)]">{t(stryMutAct_9fa48("1381") ? "" : (stryCov_9fa48("1381"), "available"))}</span>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map(stryMutAct_9fa48("1382") ? () => undefined : (stryCov_9fa48("1382"), group => <div key={group.title} className="footer-link-group">
              <h4 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-4">{group.title}</h4>
              <div className="flex flex-col gap-2.5">
                {group.links.map(stryMutAct_9fa48("1383") ? () => undefined : (stryCov_9fa48("1383"), link => <a key={link.label} href={link.href} {...(stryMutAct_9fa48("1384") ? link.href.endsWith("http") : (stryCov_9fa48("1384"), link.href.startsWith(stryMutAct_9fa48("1385") ? "" : (stryCov_9fa48("1385"), "http")))) ? stryMutAct_9fa48("1386") ? {} : (stryCov_9fa48("1386"), {
                target: stryMutAct_9fa48("1387") ? "" : (stryCov_9fa48("1387"), "_blank"),
                rel: stryMutAct_9fa48("1388") ? "" : (stryCov_9fa48("1388"), "noreferrer")
              }) : {}} className="text-sm text-[hsl(215,20%,50%)] hover:text-[#06d6e0] transition-colors">
                    {link.label}
                  </a>))}
              </div>
            </div>))}
        </div>

        {/* Newsletter */}
        <NewsletterForm />

        {/* Bottom bar */}
        <div className="footer-bottom py-6 border-t border-[hsl(215,28%,14%)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-mono text-xs text-[hsl(215,20%,45%)]">
            <span>{stryMutAct_9fa48("1389") ? "" : (stryCov_9fa48("1389"), ">")}</span>
            <span>NADAV.AI</span>
            <span className="text-[hsl(215,20%,25%)]">|</span>
            <span>2026</span>
            <span className="text-[hsl(215,20%,25%)]">|</span>
            <span>{stryMutAct_9fa48("1390") ? "" : (stryCov_9fa48("1390"), "Built with AI")}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[hsl(215,20%,45%)]">
            <span className="font-mono">{stryMutAct_9fa48("1391") ? "" : (stryCov_9fa48("1391"), "powered by")}</span>
            <span className="text-gradient font-mono font-semibold">{stryMutAct_9fa48("1392") ? "" : (stryCov_9fa48("1392"), "artificial intelligence")}</span>
          </div>
        </div>
      </div>
    </footer>;
  }
}