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
import React from "react";
import type { Metadata, Viewport } from "next";
import { Space_Grotesk, JetBrains_Mono, Heebo } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import "../globals.css";
const spaceGrotesk = Space_Grotesk(stryMutAct_9fa48("21") ? {} : (stryCov_9fa48("21"), {
  subsets: stryMutAct_9fa48("22") ? [] : (stryCov_9fa48("22"), [stryMutAct_9fa48("23") ? "" : (stryCov_9fa48("23"), "latin")]),
  variable: stryMutAct_9fa48("24") ? "" : (stryCov_9fa48("24"), "--font-space-grotesk"),
  display: stryMutAct_9fa48("25") ? "" : (stryCov_9fa48("25"), "swap"),
  preload: stryMutAct_9fa48("26") ? false : (stryCov_9fa48("26"), true)
}));
const jetbrainsMono = JetBrains_Mono(stryMutAct_9fa48("27") ? {} : (stryCov_9fa48("27"), {
  subsets: stryMutAct_9fa48("28") ? [] : (stryCov_9fa48("28"), [stryMutAct_9fa48("29") ? "" : (stryCov_9fa48("29"), "latin")]),
  variable: stryMutAct_9fa48("30") ? "" : (stryCov_9fa48("30"), "--font-jetbrains"),
  display: stryMutAct_9fa48("31") ? "" : (stryCov_9fa48("31"), "swap"),
  preload: stryMutAct_9fa48("32") ? true : (stryCov_9fa48("32"), false) // Only preload critical fonts
}));
const heebo = Heebo(stryMutAct_9fa48("33") ? {} : (stryCov_9fa48("33"), {
  subsets: stryMutAct_9fa48("34") ? [] : (stryCov_9fa48("34"), [stryMutAct_9fa48("35") ? "" : (stryCov_9fa48("35"), "latin"), stryMutAct_9fa48("36") ? "" : (stryCov_9fa48("36"), "hebrew")]),
  variable: stryMutAct_9fa48("37") ? "" : (stryCov_9fa48("37"), "--font-heebo"),
  display: stryMutAct_9fa48("38") ? "" : (stryCov_9fa48("38"), "swap"),
  preload: stryMutAct_9fa48("39") ? false : (stryCov_9fa48("39"), true) // Critical for Hebrew content
}));
function getDirection(locale: string): "rtl" | "ltr" {
  if (stryMutAct_9fa48("40")) {
    {}
  } else {
    stryCov_9fa48("40");
    return (stryMutAct_9fa48("43") ? locale !== "he" : stryMutAct_9fa48("42") ? false : stryMutAct_9fa48("41") ? true : (stryCov_9fa48("41", "42", "43"), locale === (stryMutAct_9fa48("44") ? "" : (stryCov_9fa48("44"), "he")))) ? stryMutAct_9fa48("45") ? "" : (stryCov_9fa48("45"), "rtl") : stryMutAct_9fa48("46") ? "" : (stryCov_9fa48("46"), "ltr");
  }
}
export async function generateMetadata({
  params
}: {
  params: Promise<{
    locale: string;
  }>;
}): Promise<Metadata> {
  if (stryMutAct_9fa48("47")) {
    {}
  } else {
    stryCov_9fa48("47");
    const {
      locale
    } = await params;
    const t = await getTranslations(stryMutAct_9fa48("48") ? {} : (stryCov_9fa48("48"), {
      locale,
      namespace: stryMutAct_9fa48("49") ? "" : (stryCov_9fa48("49"), "layout")
    }));
    return stryMutAct_9fa48("50") ? {} : (stryCov_9fa48("50"), {
      metadataBase: new URL(stryMutAct_9fa48("51") ? "" : (stryCov_9fa48("51"), "https://nadavc.ai")),
      title: stryMutAct_9fa48("52") ? {} : (stryCov_9fa48("52"), {
        default: t(stryMutAct_9fa48("53") ? "" : (stryCov_9fa48("53"), "title")),
        template: stryMutAct_9fa48("54") ? "" : (stryCov_9fa48("54"), "%s | NADAV.AI")
      }),
      description: t(stryMutAct_9fa48("55") ? "" : (stryCov_9fa48("55"), "description")),
      keywords: stryMutAct_9fa48("56") ? [] : (stryCov_9fa48("56"), [stryMutAct_9fa48("57") ? "" : (stryCov_9fa48("57"), "מפתח AI"), stryMutAct_9fa48("58") ? "" : (stryCov_9fa48("58"), "Full-Stack Developer"), stryMutAct_9fa48("59") ? "" : (stryCov_9fa48("59"), "בינה מלאכותית"), stryMutAct_9fa48("60") ? "" : (stryCov_9fa48("60"), "פיתוח אפליקציות"), stryMutAct_9fa48("61") ? "" : (stryCov_9fa48("61"), "React"), stryMutAct_9fa48("62") ? "" : (stryCov_9fa48("62"), "Next.js"), stryMutAct_9fa48("63") ? "" : (stryCov_9fa48("63"), "TypeScript"), stryMutAct_9fa48("64") ? "" : (stryCov_9fa48("64"), "Supabase"), stryMutAct_9fa48("65") ? "" : (stryCov_9fa48("65"), "AI Developer Israel"), stryMutAct_9fa48("66") ? "" : (stryCov_9fa48("66"), "נדב כהן"), stryMutAct_9fa48("67") ? "" : (stryCov_9fa48("67"), "פיתוח עם AI"), stryMutAct_9fa48("68") ? "" : (stryCov_9fa48("68"), "סוכני AI"), stryMutAct_9fa48("69") ? "" : (stryCov_9fa48("69"), "Claude Code"), stryMutAct_9fa48("70") ? "" : (stryCov_9fa48("70"), "Nadav Cohen")]),
      authors: stryMutAct_9fa48("71") ? [] : (stryCov_9fa48("71"), [stryMutAct_9fa48("72") ? {} : (stryCov_9fa48("72"), {
        name: stryMutAct_9fa48("73") ? "" : (stryCov_9fa48("73"), "Nadav Cohen"),
        url: stryMutAct_9fa48("74") ? "" : (stryCov_9fa48("74"), "https://nadavc.ai")
      })]),
      creator: stryMutAct_9fa48("75") ? "" : (stryCov_9fa48("75"), "Nadav Cohen"),
      manifest: stryMutAct_9fa48("76") ? "" : (stryCov_9fa48("76"), "/manifest.json"),
      openGraph: stryMutAct_9fa48("77") ? {} : (stryCov_9fa48("77"), {
        title: t(stryMutAct_9fa48("78") ? "" : (stryCov_9fa48("78"), "title")),
        description: t(stryMutAct_9fa48("79") ? "" : (stryCov_9fa48("79"), "ogDescription")),
        url: stryMutAct_9fa48("80") ? "" : (stryCov_9fa48("80"), "https://nadavc.ai"),
        siteName: stryMutAct_9fa48("81") ? "" : (stryCov_9fa48("81"), "NADAV.AI"),
        locale: (stryMutAct_9fa48("84") ? locale !== "he" : stryMutAct_9fa48("83") ? false : stryMutAct_9fa48("82") ? true : (stryCov_9fa48("82", "83", "84"), locale === (stryMutAct_9fa48("85") ? "" : (stryCov_9fa48("85"), "he")))) ? stryMutAct_9fa48("86") ? "" : (stryCov_9fa48("86"), "he_IL") : stryMutAct_9fa48("87") ? "" : (stryCov_9fa48("87"), "en_US"),
        type: stryMutAct_9fa48("88") ? "" : (stryCov_9fa48("88"), "website"),
        images: stryMutAct_9fa48("89") ? [] : (stryCov_9fa48("89"), [stryMutAct_9fa48("90") ? {} : (stryCov_9fa48("90"), {
          url: stryMutAct_9fa48("91") ? "" : (stryCov_9fa48("91"), "/opengraph-image"),
          width: 1200,
          height: 630,
          alt: stryMutAct_9fa48("92") ? "" : (stryCov_9fa48("92"), "NADAV.AI - Full-Stack AI Developer")
        })])
      }),
      twitter: stryMutAct_9fa48("93") ? {} : (stryCov_9fa48("93"), {
        card: stryMutAct_9fa48("94") ? "" : (stryCov_9fa48("94"), "summary_large_image"),
        title: t(stryMutAct_9fa48("95") ? "" : (stryCov_9fa48("95"), "title")),
        description: t(stryMutAct_9fa48("96") ? "" : (stryCov_9fa48("96"), "ogDescription")),
        images: stryMutAct_9fa48("97") ? [] : (stryCov_9fa48("97"), [stryMutAct_9fa48("98") ? "" : (stryCov_9fa48("98"), "/opengraph-image")]),
        creator: stryMutAct_9fa48("99") ? "" : (stryCov_9fa48("99"), "@nadavcohen"),
        site: stryMutAct_9fa48("100") ? "" : (stryCov_9fa48("100"), "@nadavcohen")
      }),
      robots: stryMutAct_9fa48("101") ? {} : (stryCov_9fa48("101"), {
        index: stryMutAct_9fa48("102") ? false : (stryCov_9fa48("102"), true),
        follow: stryMutAct_9fa48("103") ? false : (stryCov_9fa48("103"), true),
        googleBot: stryMutAct_9fa48("104") ? {} : (stryCov_9fa48("104"), {
          index: stryMutAct_9fa48("105") ? false : (stryCov_9fa48("105"), true),
          follow: stryMutAct_9fa48("106") ? false : (stryCov_9fa48("106"), true),
          "max-video-preview": stryMutAct_9fa48("107") ? +1 : (stryCov_9fa48("107"), -1),
          "max-image-preview": stryMutAct_9fa48("108") ? "" : (stryCov_9fa48("108"), "large"),
          "max-snippet": stryMutAct_9fa48("109") ? +1 : (stryCov_9fa48("109"), -1)
        })
      }),
      alternates: stryMutAct_9fa48("110") ? {} : (stryCov_9fa48("110"), {
        canonical: stryMutAct_9fa48("111") ? `` : (stryCov_9fa48("111"), `https://nadavc.ai/${locale}`),
        languages: stryMutAct_9fa48("112") ? {} : (stryCov_9fa48("112"), {
          he: stryMutAct_9fa48("113") ? "" : (stryCov_9fa48("113"), "https://nadavc.ai/he"),
          en: stryMutAct_9fa48("114") ? "" : (stryCov_9fa48("114"), "https://nadavc.ai/en"),
          "x-default": stryMutAct_9fa48("115") ? "" : (stryCov_9fa48("115"), "https://nadavc.ai/he")
        })
      })
    });
  }
}
export const viewport: Viewport = stryMutAct_9fa48("116") ? {} : (stryCov_9fa48("116"), {
  themeColor: stryMutAct_9fa48("117") ? "" : (stryCov_9fa48("117"), "#06d6e0"),
  width: stryMutAct_9fa48("118") ? "" : (stryCov_9fa48("118"), "device-width"),
  initialScale: 1,
  maximumScale: 1,
  userScalable: stryMutAct_9fa48("119") ? true : (stryCov_9fa48("119"), false)
});
export function generateStaticParams() {
  if (stryMutAct_9fa48("120")) {
    {}
  } else {
    stryCov_9fa48("120");
    return routing.locales.map(stryMutAct_9fa48("121") ? () => undefined : (stryCov_9fa48("121"), locale => stryMutAct_9fa48("122") ? {} : (stryCov_9fa48("122"), {
      locale
    })));
  }
}
export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>) {
  if (stryMutAct_9fa48("123")) {
    {}
  } else {
    stryCov_9fa48("123");
    const {
      locale
    } = await params;
    if (stryMutAct_9fa48("126") ? false : stryMutAct_9fa48("125") ? true : stryMutAct_9fa48("124") ? routing.locales.includes(locale as "he" | "en") : (stryCov_9fa48("124", "125", "126"), !routing.locales.includes(locale as "he" | "en"))) {
      if (stryMutAct_9fa48("127")) {
        {}
      } else {
        stryCov_9fa48("127");
        notFound();
      }
    }
    const messages = await getMessages();
    const t = await getTranslations(stryMutAct_9fa48("128") ? {} : (stryCov_9fa48("128"), {
      locale,
      namespace: stryMutAct_9fa48("129") ? "" : (stryCov_9fa48("129"), "layout")
    }));
    const dir = getDirection(locale);
    return <html lang={locale} dir={dir} className="dark" style={stryMutAct_9fa48("130") ? {} : (stryCov_9fa48("130"), {
      backgroundColor: stryMutAct_9fa48("131") ? "" : (stryCov_9fa48("131"), "#070a13"),
      colorScheme: stryMutAct_9fa48("132") ? "" : (stryCov_9fa48("132"), "dark")
    })}>
      <body className={stryMutAct_9fa48("133") ? `` : (stryCov_9fa48("133"), `${spaceGrotesk.variable} ${jetbrainsMono.variable} ${heebo.variable} font-sans antialiased overflow-x-hidden`)} style={stryMutAct_9fa48("134") ? {} : (stryCov_9fa48("134"), {
        backgroundColor: stryMutAct_9fa48("135") ? "" : (stryCov_9fa48("135"), "#070a13"),
        color: stryMutAct_9fa48("136") ? "" : (stryCov_9fa48("136"), "#f8fafc")
      })}>
        <script type="application/ld+json" dangerouslySetInnerHTML={stryMutAct_9fa48("137") ? {} : (stryCov_9fa48("137"), {
          __html: JSON.stringify(stryMutAct_9fa48("138") ? {} : (stryCov_9fa48("138"), {
            "@context": stryMutAct_9fa48("139") ? "" : (stryCov_9fa48("139"), "https://schema.org"),
            "@type": stryMutAct_9fa48("140") ? "" : (stryCov_9fa48("140"), "Person"),
            name: stryMutAct_9fa48("141") ? "" : (stryCov_9fa48("141"), "Nadav Cohen"),
            alternateName: stryMutAct_9fa48("142") ? "" : (stryCov_9fa48("142"), "נדב כהן"),
            url: stryMutAct_9fa48("143") ? "" : (stryCov_9fa48("143"), "https://nadavc.ai"),
            jobTitle: stryMutAct_9fa48("144") ? "" : (stryCov_9fa48("144"), "Full-Stack AI Developer"),
            description: stryMutAct_9fa48("145") ? "" : (stryCov_9fa48("145"), "Full-Stack Developer who builds everything with AI. 8+ production apps, 80 AI Skills, 38+ agents."),
            knowsAbout: stryMutAct_9fa48("146") ? [] : (stryCov_9fa48("146"), [stryMutAct_9fa48("147") ? "" : (stryCov_9fa48("147"), "Artificial Intelligence"), stryMutAct_9fa48("148") ? "" : (stryCov_9fa48("148"), "Full-Stack Development"), stryMutAct_9fa48("149") ? "" : (stryCov_9fa48("149"), "React"), stryMutAct_9fa48("150") ? "" : (stryCov_9fa48("150"), "Next.js"), stryMutAct_9fa48("151") ? "" : (stryCov_9fa48("151"), "TypeScript"), stryMutAct_9fa48("152") ? "" : (stryCov_9fa48("152"), "Supabase"), stryMutAct_9fa48("153") ? "" : (stryCov_9fa48("153"), "Flutter"), stryMutAct_9fa48("154") ? "" : (stryCov_9fa48("154"), "Claude Code"), stryMutAct_9fa48("155") ? "" : (stryCov_9fa48("155"), "AI Agents")]),
            sameAs: stryMutAct_9fa48("156") ? [] : (stryCov_9fa48("156"), [stryMutAct_9fa48("157") ? "" : (stryCov_9fa48("157"), "https://github.com/Nadav011"), stryMutAct_9fa48("158") ? "" : (stryCov_9fa48("158"), "https://www.facebook.com/nadav.cohen.167")])
          }))
        })} />
        <script type="application/ld+json" dangerouslySetInnerHTML={stryMutAct_9fa48("159") ? {} : (stryCov_9fa48("159"), {
          __html: JSON.stringify(stryMutAct_9fa48("160") ? {} : (stryCov_9fa48("160"), {
            "@context": stryMutAct_9fa48("161") ? "" : (stryCov_9fa48("161"), "https://schema.org"),
            "@type": stryMutAct_9fa48("162") ? "" : (stryCov_9fa48("162"), "WebSite"),
            name: stryMutAct_9fa48("163") ? "" : (stryCov_9fa48("163"), "NADAV.AI"),
            alternateName: stryMutAct_9fa48("164") ? "" : (stryCov_9fa48("164"), "נדב כהן - מפתח AI"),
            url: stryMutAct_9fa48("165") ? "" : (stryCov_9fa48("165"), "https://nadavc.ai"),
            potentialAction: stryMutAct_9fa48("166") ? {} : (stryCov_9fa48("166"), {
              "@type": stryMutAct_9fa48("167") ? "" : (stryCov_9fa48("167"), "SearchAction"),
              target: stryMutAct_9fa48("168") ? {} : (stryCov_9fa48("168"), {
                "@type": stryMutAct_9fa48("169") ? "" : (stryCov_9fa48("169"), "EntryPoint"),
                urlTemplate: stryMutAct_9fa48("170") ? "" : (stryCov_9fa48("170"), "https://nadavc.ai/{locale}?search={search_term_string}")
              }),
              "query-input": stryMutAct_9fa48("171") ? "" : (stryCov_9fa48("171"), "required name=search_term_string")
            })
          }))
        })} />
        <script type="application/ld+json" dangerouslySetInnerHTML={stryMutAct_9fa48("172") ? {} : (stryCov_9fa48("172"), {
          __html: JSON.stringify(stryMutAct_9fa48("173") ? {} : (stryCov_9fa48("173"), {
            "@context": stryMutAct_9fa48("174") ? "" : (stryCov_9fa48("174"), "https://schema.org"),
            "@type": stryMutAct_9fa48("175") ? "" : (stryCov_9fa48("175"), "Organization"),
            "@id": stryMutAct_9fa48("176") ? "" : (stryCov_9fa48("176"), "https://nadavc.ai/#organization"),
            name: stryMutAct_9fa48("177") ? "" : (stryCov_9fa48("177"), "NADAV AI"),
            alternateName: stryMutAct_9fa48("178") ? [] : (stryCov_9fa48("178"), [stryMutAct_9fa48("179") ? "" : (stryCov_9fa48("179"), "נדב AI"), stryMutAct_9fa48("180") ? "" : (stryCov_9fa48("180"), "NADAV.AI")]),
            url: stryMutAct_9fa48("181") ? "" : (stryCov_9fa48("181"), "https://nadavc.ai"),
            logo: stryMutAct_9fa48("182") ? {} : (stryCov_9fa48("182"), {
              "@type": stryMutAct_9fa48("183") ? "" : (stryCov_9fa48("183"), "ImageObject"),
              url: stryMutAct_9fa48("184") ? "" : (stryCov_9fa48("184"), "https://nadavc.ai/opengraph-image"),
              width: 1200,
              height: 630
            }),
            description: stryMutAct_9fa48("185") ? "" : (stryCov_9fa48("185"), "AI Development Agency specializing in Full-Stack development, enterprise systems, AI agents, and automation solutions."),
            founder: stryMutAct_9fa48("186") ? {} : (stryCov_9fa48("186"), {
              "@type": stryMutAct_9fa48("187") ? "" : (stryCov_9fa48("187"), "Person"),
              name: stryMutAct_9fa48("188") ? "" : (stryCov_9fa48("188"), "Nadav Cohen"),
              alternateName: stryMutAct_9fa48("189") ? "" : (stryCov_9fa48("189"), "נדב כהן")
            }),
            foundingDate: stryMutAct_9fa48("190") ? "" : (stryCov_9fa48("190"), "2024"),
            foundingLocation: stryMutAct_9fa48("191") ? {} : (stryCov_9fa48("191"), {
              "@type": stryMutAct_9fa48("192") ? "" : (stryCov_9fa48("192"), "Place"),
              address: stryMutAct_9fa48("193") ? {} : (stryCov_9fa48("193"), {
                "@type": stryMutAct_9fa48("194") ? "" : (stryCov_9fa48("194"), "PostalAddress"),
                addressCountry: stryMutAct_9fa48("195") ? "" : (stryCov_9fa48("195"), "IL"),
                addressRegion: stryMutAct_9fa48("196") ? "" : (stryCov_9fa48("196"), "Israel")
              })
            }),
            areaServed: stryMutAct_9fa48("197") ? [] : (stryCov_9fa48("197"), [stryMutAct_9fa48("198") ? "" : (stryCov_9fa48("198"), "IL"), stryMutAct_9fa48("199") ? "" : (stryCov_9fa48("199"), "US"), stryMutAct_9fa48("200") ? "" : (stryCov_9fa48("200"), "Worldwide")]),
            sameAs: stryMutAct_9fa48("201") ? [] : (stryCov_9fa48("201"), [stryMutAct_9fa48("202") ? "" : (stryCov_9fa48("202"), "https://github.com/Nadav011"), stryMutAct_9fa48("203") ? "" : (stryCov_9fa48("203"), "https://www.facebook.com/nadav.cohen.167")]),
            contactPoint: stryMutAct_9fa48("204") ? {} : (stryCov_9fa48("204"), {
              "@type": stryMutAct_9fa48("205") ? "" : (stryCov_9fa48("205"), "ContactPoint"),
              telephone: stryMutAct_9fa48("206") ? "" : (stryCov_9fa48("206"), "+972-50-524-5677"),
              contactType: stryMutAct_9fa48("207") ? "" : (stryCov_9fa48("207"), "Customer Service"),
              email: stryMutAct_9fa48("208") ? "" : (stryCov_9fa48("208"), "nadav@nadavc.ai"),
              availableLanguage: stryMutAct_9fa48("209") ? [] : (stryCov_9fa48("209"), [stryMutAct_9fa48("210") ? "" : (stryCov_9fa48("210"), "Hebrew"), stryMutAct_9fa48("211") ? "" : (stryCov_9fa48("211"), "English")]),
              areaServed: stryMutAct_9fa48("212") ? "" : (stryCov_9fa48("212"), "Worldwide")
            }),
            knowsAbout: stryMutAct_9fa48("213") ? [] : (stryCov_9fa48("213"), [stryMutAct_9fa48("214") ? "" : (stryCov_9fa48("214"), "Artificial Intelligence"), stryMutAct_9fa48("215") ? "" : (stryCov_9fa48("215"), "Full-Stack Development"), stryMutAct_9fa48("216") ? "" : (stryCov_9fa48("216"), "React"), stryMutAct_9fa48("217") ? "" : (stryCov_9fa48("217"), "Next.js"), stryMutAct_9fa48("218") ? "" : (stryCov_9fa48("218"), "TypeScript"), stryMutAct_9fa48("219") ? "" : (stryCov_9fa48("219"), "Supabase"), stryMutAct_9fa48("220") ? "" : (stryCov_9fa48("220"), "Flutter"), stryMutAct_9fa48("221") ? "" : (stryCov_9fa48("221"), "AI Agents"), stryMutAct_9fa48("222") ? "" : (stryCov_9fa48("222"), "Enterprise Software"), stryMutAct_9fa48("223") ? "" : (stryCov_9fa48("223"), "Web Applications")])
          }))
        })} />
        <script type="application/ld+json" dangerouslySetInnerHTML={stryMutAct_9fa48("224") ? {} : (stryCov_9fa48("224"), {
          __html: JSON.stringify(stryMutAct_9fa48("225") ? {} : (stryCov_9fa48("225"), {
            "@context": stryMutAct_9fa48("226") ? "" : (stryCov_9fa48("226"), "https://schema.org"),
            "@type": stryMutAct_9fa48("227") ? "" : (stryCov_9fa48("227"), "ProfessionalService"),
            "@id": stryMutAct_9fa48("228") ? "" : (stryCov_9fa48("228"), "https://nadavc.ai/#professionalservice"),
            name: stryMutAct_9fa48("229") ? "" : (stryCov_9fa48("229"), "NADAV AI - AI Development Services"),
            alternateName: stryMutAct_9fa48("230") ? "" : (stryCov_9fa48("230"), "נדב AI - שירותי פיתוח AI"),
            image: stryMutAct_9fa48("231") ? "" : (stryCov_9fa48("231"), "https://nadavc.ai/opengraph-image"),
            url: stryMutAct_9fa48("232") ? "" : (stryCov_9fa48("232"), "https://nadavc.ai"),
            telephone: stryMutAct_9fa48("233") ? "" : (stryCov_9fa48("233"), "+972-50-524-5677"),
            email: stryMutAct_9fa48("234") ? "" : (stryCov_9fa48("234"), "nadav@nadavc.ai"),
            priceRange: stryMutAct_9fa48("235") ? "" : (stryCov_9fa48("235"), "$$"),
            address: stryMutAct_9fa48("236") ? {} : (stryCov_9fa48("236"), {
              "@type": stryMutAct_9fa48("237") ? "" : (stryCov_9fa48("237"), "PostalAddress"),
              addressCountry: stryMutAct_9fa48("238") ? "" : (stryCov_9fa48("238"), "IL"),
              addressRegion: stryMutAct_9fa48("239") ? "" : (stryCov_9fa48("239"), "Israel")
            }),
            geo: stryMutAct_9fa48("240") ? {} : (stryCov_9fa48("240"), {
              "@type": stryMutAct_9fa48("241") ? "" : (stryCov_9fa48("241"), "GeoCoordinates"),
              addressCountry: stryMutAct_9fa48("242") ? "" : (stryCov_9fa48("242"), "IL")
            }),
            areaServed: stryMutAct_9fa48("243") ? [] : (stryCov_9fa48("243"), [stryMutAct_9fa48("244") ? "" : (stryCov_9fa48("244"), "IL"), stryMutAct_9fa48("245") ? "" : (stryCov_9fa48("245"), "US"), stryMutAct_9fa48("246") ? "" : (stryCov_9fa48("246"), "Worldwide")]),
            availableLanguage: stryMutAct_9fa48("247") ? [] : (stryCov_9fa48("247"), [stryMutAct_9fa48("248") ? "" : (stryCov_9fa48("248"), "Hebrew"), stryMutAct_9fa48("249") ? "" : (stryCov_9fa48("249"), "English")]),
            serviceType: stryMutAct_9fa48("250") ? [] : (stryCov_9fa48("250"), [stryMutAct_9fa48("251") ? "" : (stryCov_9fa48("251"), "Full-Stack Development"), stryMutAct_9fa48("252") ? "" : (stryCov_9fa48("252"), "AI Development"), stryMutAct_9fa48("253") ? "" : (stryCov_9fa48("253"), "Enterprise Software Development"), stryMutAct_9fa48("254") ? "" : (stryCov_9fa48("254"), "AI Agent Development"), stryMutAct_9fa48("255") ? "" : (stryCov_9fa48("255"), "Web Application Development"), stryMutAct_9fa48("256") ? "" : (stryCov_9fa48("256"), "Mobile App Development"), stryMutAct_9fa48("257") ? "" : (stryCov_9fa48("257"), "Automation Solutions")]),
            description: stryMutAct_9fa48("258") ? "" : (stryCov_9fa48("258"), "Professional AI development services: Full-Stack web & mobile apps, enterprise systems, AI agents, automation. 8+ production applications, 80+ AI skills."),
            slogan: stryMutAct_9fa48("259") ? "" : (stryCov_9fa48("259"), "Building everything with AI"),
            founder: stryMutAct_9fa48("260") ? {} : (stryCov_9fa48("260"), {
              "@type": stryMutAct_9fa48("261") ? "" : (stryCov_9fa48("261"), "Person"),
              name: stryMutAct_9fa48("262") ? "" : (stryCov_9fa48("262"), "Nadav Cohen")
            })
          }))
        })} />
        <script type="application/ld+json" dangerouslySetInnerHTML={stryMutAct_9fa48("263") ? {} : (stryCov_9fa48("263"), {
          __html: JSON.stringify(stryMutAct_9fa48("264") ? {} : (stryCov_9fa48("264"), {
            "@context": stryMutAct_9fa48("265") ? "" : (stryCov_9fa48("265"), "https://schema.org"),
            "@type": stryMutAct_9fa48("266") ? "" : (stryCov_9fa48("266"), "BreadcrumbList"),
            itemListElement: stryMutAct_9fa48("267") ? [] : (stryCov_9fa48("267"), [stryMutAct_9fa48("268") ? {} : (stryCov_9fa48("268"), {
              "@type": stryMutAct_9fa48("269") ? "" : (stryCov_9fa48("269"), "ListItem"),
              position: 1,
              name: stryMutAct_9fa48("270") ? "" : (stryCov_9fa48("270"), "Home"),
              item: stryMutAct_9fa48("271") ? `` : (stryCov_9fa48("271"), `https://nadavc.ai/${locale}`)
            }), stryMutAct_9fa48("272") ? {} : (stryCov_9fa48("272"), {
              "@type": stryMutAct_9fa48("273") ? "" : (stryCov_9fa48("273"), "ListItem"),
              position: 2,
              name: (stryMutAct_9fa48("276") ? locale !== "he" : stryMutAct_9fa48("275") ? false : stryMutAct_9fa48("274") ? true : (stryCov_9fa48("274", "275", "276"), locale === (stryMutAct_9fa48("277") ? "" : (stryCov_9fa48("277"), "he")))) ? stryMutAct_9fa48("278") ? "" : (stryCov_9fa48("278"), "פרויקטים") : stryMutAct_9fa48("279") ? "" : (stryCov_9fa48("279"), "Projects"),
              item: stryMutAct_9fa48("280") ? `` : (stryCov_9fa48("280"), `https://nadavc.ai/${locale}#projects`)
            }), stryMutAct_9fa48("281") ? {} : (stryCov_9fa48("281"), {
              "@type": stryMutAct_9fa48("282") ? "" : (stryCov_9fa48("282"), "ListItem"),
              position: 3,
              name: (stryMutAct_9fa48("285") ? locale !== "he" : stryMutAct_9fa48("284") ? false : stryMutAct_9fa48("283") ? true : (stryCov_9fa48("283", "284", "285"), locale === (stryMutAct_9fa48("286") ? "" : (stryCov_9fa48("286"), "he")))) ? stryMutAct_9fa48("287") ? "" : (stryCov_9fa48("287"), "שירותים") : stryMutAct_9fa48("288") ? "" : (stryCov_9fa48("288"), "Services"),
              item: stryMutAct_9fa48("289") ? `` : (stryCov_9fa48("289"), `https://nadavc.ai/${locale}#services`)
            }), stryMutAct_9fa48("290") ? {} : (stryCov_9fa48("290"), {
              "@type": stryMutAct_9fa48("291") ? "" : (stryCov_9fa48("291"), "ListItem"),
              position: 4,
              name: (stryMutAct_9fa48("294") ? locale !== "he" : stryMutAct_9fa48("293") ? false : stryMutAct_9fa48("292") ? true : (stryCov_9fa48("292", "293", "294"), locale === (stryMutAct_9fa48("295") ? "" : (stryCov_9fa48("295"), "he")))) ? stryMutAct_9fa48("296") ? "" : (stryCov_9fa48("296"), "יצירת קשר") : stryMutAct_9fa48("297") ? "" : (stryCov_9fa48("297"), "Contact"),
              item: stryMutAct_9fa48("298") ? `` : (stryCov_9fa48("298"), `https://nadavc.ai/${locale}#contact`)
            })])
          }))
        })} />
        <script type="application/ld+json" dangerouslySetInnerHTML={stryMutAct_9fa48("299") ? {} : (stryCov_9fa48("299"), {
          __html: JSON.stringify(stryMutAct_9fa48("300") ? [] : (stryCov_9fa48("300"), [stryMutAct_9fa48("301") ? {} : (stryCov_9fa48("301"), {
            "@context": stryMutAct_9fa48("302") ? "" : (stryCov_9fa48("302"), "https://schema.org"),
            "@type": stryMutAct_9fa48("303") ? "" : (stryCov_9fa48("303"), "SoftwareApplication"),
            name: stryMutAct_9fa48("304") ? "" : (stryCov_9fa48("304"), "Mexicani"),
            applicationCategory: stryMutAct_9fa48("305") ? "" : (stryCov_9fa48("305"), "BusinessApplication"),
            operatingSystem: stryMutAct_9fa48("306") ? "" : (stryCov_9fa48("306"), "Web"),
            description: stryMutAct_9fa48("307") ? "" : (stryCov_9fa48("307"), "Enterprise franchise management system - 149 pages, 111 tables, 38 Edge Functions. Branch, order, inventory, and employee management."),
            author: stryMutAct_9fa48("308") ? {} : (stryCov_9fa48("308"), {
              "@type": stryMutAct_9fa48("309") ? "" : (stryCov_9fa48("309"), "Person"),
              name: stryMutAct_9fa48("310") ? "" : (stryCov_9fa48("310"), "Nadav Cohen")
            }),
            offers: stryMutAct_9fa48("311") ? {} : (stryCov_9fa48("311"), {
              "@type": stryMutAct_9fa48("312") ? "" : (stryCov_9fa48("312"), "Offer"),
              price: stryMutAct_9fa48("313") ? "" : (stryCov_9fa48("313"), "0"),
              priceCurrency: stryMutAct_9fa48("314") ? "" : (stryCov_9fa48("314"), "USD")
            })
          }), stryMutAct_9fa48("315") ? {} : (stryCov_9fa48("315"), {
            "@context": stryMutAct_9fa48("316") ? "" : (stryCov_9fa48("316"), "https://schema.org"),
            "@type": stryMutAct_9fa48("317") ? "" : (stryCov_9fa48("317"), "SoftwareApplication"),
            name: stryMutAct_9fa48("318") ? "" : (stryCov_9fa48("318"), "Cash"),
            applicationCategory: stryMutAct_9fa48("319") ? "" : (stryCov_9fa48("319"), "BusinessApplication"),
            operatingSystem: stryMutAct_9fa48("320") ? "" : (stryCov_9fa48("320"), "Web, iOS, Android"),
            description: stryMutAct_9fa48("321") ? "" : (stryCov_9fa48("321"), "Delivery management PWA with full offline support, smart sync, IndexedDB, and operation queuing."),
            author: stryMutAct_9fa48("322") ? {} : (stryCov_9fa48("322"), {
              "@type": stryMutAct_9fa48("323") ? "" : (stryCov_9fa48("323"), "Person"),
              name: stryMutAct_9fa48("324") ? "" : (stryCov_9fa48("324"), "Nadav Cohen")
            }),
            url: stryMutAct_9fa48("325") ? "" : (stryCov_9fa48("325"), "https://cash-ashy-zeta.vercel.app"),
            offers: stryMutAct_9fa48("326") ? {} : (stryCov_9fa48("326"), {
              "@type": stryMutAct_9fa48("327") ? "" : (stryCov_9fa48("327"), "Offer"),
              price: stryMutAct_9fa48("328") ? "" : (stryCov_9fa48("328"), "0"),
              priceCurrency: stryMutAct_9fa48("329") ? "" : (stryCov_9fa48("329"), "USD")
            })
          }), stryMutAct_9fa48("330") ? {} : (stryCov_9fa48("330"), {
            "@context": stryMutAct_9fa48("331") ? "" : (stryCov_9fa48("331"), "https://schema.org"),
            "@type": stryMutAct_9fa48("332") ? "" : (stryCov_9fa48("332"), "SoftwareApplication"),
            name: stryMutAct_9fa48("333") ? "" : (stryCov_9fa48("333"), "Shifts"),
            applicationCategory: stryMutAct_9fa48("334") ? "" : (stryCov_9fa48("334"), "BusinessApplication"),
            operatingSystem: stryMutAct_9fa48("335") ? "" : (stryCov_9fa48("335"), "Web"),
            description: stryMutAct_9fa48("336") ? "" : (stryCov_9fa48("336"), "Shift management system with Drag & Drop, Push notifications, and interactive scheduling. 154 components, 25 hooks."),
            author: stryMutAct_9fa48("337") ? {} : (stryCov_9fa48("337"), {
              "@type": stryMutAct_9fa48("338") ? "" : (stryCov_9fa48("338"), "Person"),
              name: stryMutAct_9fa48("339") ? "" : (stryCov_9fa48("339"), "Nadav Cohen")
            }),
            offers: stryMutAct_9fa48("340") ? {} : (stryCov_9fa48("340"), {
              "@type": stryMutAct_9fa48("341") ? "" : (stryCov_9fa48("341"), "Offer"),
              price: stryMutAct_9fa48("342") ? "" : (stryCov_9fa48("342"), "0"),
              priceCurrency: stryMutAct_9fa48("343") ? "" : (stryCov_9fa48("343"), "USD")
            })
          }), stryMutAct_9fa48("344") ? {} : (stryCov_9fa48("344"), {
            "@context": stryMutAct_9fa48("345") ? "" : (stryCov_9fa48("345"), "https://schema.org"),
            "@type": stryMutAct_9fa48("346") ? "" : (stryCov_9fa48("346"), "SoftwareApplication"),
            name: stryMutAct_9fa48("347") ? "" : (stryCov_9fa48("347"), "APEX Engine"),
            applicationCategory: stryMutAct_9fa48("348") ? "" : (stryCov_9fa48("348"), "DeveloperApplication"),
            operatingSystem: stryMutAct_9fa48("349") ? "" : (stryCov_9fa48("349"), "Cross-platform"),
            description: stryMutAct_9fa48("350") ? "" : (stryCov_9fa48("350"), "Code audit engine with 579 gates, auto-healing, automatic technology detection, and a 10x7 visual matrix."),
            author: stryMutAct_9fa48("351") ? {} : (stryCov_9fa48("351"), {
              "@type": stryMutAct_9fa48("352") ? "" : (stryCov_9fa48("352"), "Person"),
              name: stryMutAct_9fa48("353") ? "" : (stryCov_9fa48("353"), "Nadav Cohen")
            }),
            offers: stryMutAct_9fa48("354") ? {} : (stryCov_9fa48("354"), {
              "@type": stryMutAct_9fa48("355") ? "" : (stryCov_9fa48("355"), "Offer"),
              price: stryMutAct_9fa48("356") ? "" : (stryCov_9fa48("356"), "0"),
              priceCurrency: stryMutAct_9fa48("357") ? "" : (stryCov_9fa48("357"), "USD")
            })
          })]))
        })} />
        <script type="application/ld+json" dangerouslySetInnerHTML={stryMutAct_9fa48("358") ? {} : (stryCov_9fa48("358"), {
          __html: JSON.stringify(stryMutAct_9fa48("359") ? {} : (stryCov_9fa48("359"), {
            "@context": stryMutAct_9fa48("360") ? "" : (stryCov_9fa48("360"), "https://schema.org"),
            "@type": stryMutAct_9fa48("361") ? "" : (stryCov_9fa48("361"), "FAQPage"),
            mainEntity: stryMutAct_9fa48("362") ? [] : (stryCov_9fa48("362"), [stryMutAct_9fa48("363") ? {} : (stryCov_9fa48("363"), {
              "@type": stryMutAct_9fa48("364") ? "" : (stryCov_9fa48("364"), "Question"),
              name: stryMutAct_9fa48("365") ? "" : (stryCov_9fa48("365"), "מה נדב כהן בונה?"),
              acceptedAnswer: stryMutAct_9fa48("366") ? {} : (stryCov_9fa48("366"), {
                "@type": stryMutAct_9fa48("367") ? "" : (stryCov_9fa48("367"), "Answer"),
                text: stryMutAct_9fa48("368") ? "" : (stryCov_9fa48("368"), "נדב כהן בונה אפליקציות Full-Stack עם AI - כולל אפליקציות web, מערכות enterprise, סוכני AI ואוטומציה. יותר מ-8 אפליקציות production פעילות.")
              })
            }), stryMutAct_9fa48("369") ? {} : (stryCov_9fa48("369"), {
              "@type": stryMutAct_9fa48("370") ? "" : (stryCov_9fa48("370"), "Question"),
              name: stryMutAct_9fa48("371") ? "" : (stryCov_9fa48("371"), "איזה טכנולוגיות נדב משתמש?"),
              acceptedAnswer: stryMutAct_9fa48("372") ? {} : (stryCov_9fa48("372"), {
                "@type": stryMutAct_9fa48("373") ? "" : (stryCov_9fa48("373"), "Answer"),
                text: stryMutAct_9fa48("374") ? "" : (stryCov_9fa48("374"), "React, Next.js, TypeScript, Supabase, Flutter, Claude Code, ועוד. נדב מתמחה בשילוב בינה מלאכותית בכל שלב של הפיתוח.")
              })
            }), stryMutAct_9fa48("375") ? {} : (stryCov_9fa48("375"), {
              "@type": stryMutAct_9fa48("376") ? "" : (stryCov_9fa48("376"), "Question"),
              name: stryMutAct_9fa48("377") ? "" : (stryCov_9fa48("377"), "איך אפשר ליצור קשר עם נדב?"),
              acceptedAnswer: stryMutAct_9fa48("378") ? {} : (stryCov_9fa48("378"), {
                "@type": stryMutAct_9fa48("379") ? "" : (stryCov_9fa48("379"), "Answer"),
                text: stryMutAct_9fa48("380") ? "" : (stryCov_9fa48("380"), "דרך WhatsApp, אימייל nadav@nadavc.ai, או דרך טופס יצירת קשר באתר. ניתן גם לעקוב בפייסבוק ובגיטהאב.")
              })
            })])
          }))
        })} />
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:top-4 focus:start-4 focus:px-4 focus:py-2 focus:rounded-lg focus:bg-[#06d6e0] focus:text-[hsl(222,47%,4%)] focus:font-bold focus:text-sm">
          {t(stryMutAct_9fa48("381") ? "" : (stryCov_9fa48("381"), "skipToContent"))}
        </a>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>;
  }
}