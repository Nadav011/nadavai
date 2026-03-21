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
import { useRef, useState } from "react";
import { Calendar, Clock, ArrowLeft, MessageSquare, ThumbsUp, ExternalLink } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { SectionHeader } from "./section-header";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
export function Blog() {
  if (stryMutAct_9fa48("712")) {
    {}
  } else {
    stryCov_9fa48("712");
    const t = useTranslations(stryMutAct_9fa48("713") ? "" : (stryCov_9fa48("713"), "blog"));
    const tCat = useTranslations(stryMutAct_9fa48("714") ? "" : (stryCov_9fa48("714"), "categories"));
    const locale = useLocale();
    const [activeCategory, setActiveCategory] = useState(stryMutAct_9fa48("715") ? "" : (stryCov_9fa48("715"), "all"));
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const ctaRef = useRef<HTMLDivElement>(null);
    const categories = stryMutAct_9fa48("716") ? [] : (stryCov_9fa48("716"), [stryMutAct_9fa48("717") ? {} : (stryCov_9fa48("717"), {
      key: stryMutAct_9fa48("718") ? "" : (stryCov_9fa48("718"), "all"),
      display: t(stryMutAct_9fa48("719") ? "" : (stryCov_9fa48("719"), "catAll"))
    }), stryMutAct_9fa48("720") ? {} : (stryCov_9fa48("720"), {
      key: stryMutAct_9fa48("721") ? "" : (stryCov_9fa48("721"), "AI"),
      display: t(stryMutAct_9fa48("722") ? "" : (stryCov_9fa48("722"), "catAI"))
    }), stryMutAct_9fa48("723") ? {} : (stryCov_9fa48("723"), {
      key: stryMutAct_9fa48("724") ? "" : (stryCov_9fa48("724"), "dev"),
      display: t(stryMutAct_9fa48("725") ? "" : (stryCov_9fa48("725"), "catDev"))
    }), stryMutAct_9fa48("726") ? {} : (stryCov_9fa48("726"), {
      key: stryMutAct_9fa48("727") ? "" : (stryCov_9fa48("727"), "tips"),
      display: t(stryMutAct_9fa48("728") ? "" : (stryCov_9fa48("728"), "catTips"))
    }), stryMutAct_9fa48("729") ? {} : (stryCov_9fa48("729"), {
      key: stryMutAct_9fa48("730") ? "" : (stryCov_9fa48("730"), "career"),
      display: t(stryMutAct_9fa48("731") ? "" : (stryCov_9fa48("731"), "catCareer"))
    })]);
    const posts = stryMutAct_9fa48("732") ? [] : (stryCov_9fa48("732"), [stryMutAct_9fa48("733") ? {} : (stryCov_9fa48("733"), {
      title: t(stryMutAct_9fa48("734") ? "" : (stryCov_9fa48("734"), "b1Title")),
      excerpt: t(stryMutAct_9fa48("735") ? "" : (stryCov_9fa48("735"), "b1Excerpt")),
      category: stryMutAct_9fa48("736") ? "" : (stryCov_9fa48("736"), "AI"),
      date: stryMutAct_9fa48("737") ? "" : (stryCov_9fa48("737"), "2026-02-01"),
      readTime: 4,
      likes: 47,
      comments: 12,
      platform: stryMutAct_9fa48("738") ? "" : (stryCov_9fa48("738"), "Facebook"),
      href: stryMutAct_9fa48("739") ? "" : (stryCov_9fa48("739"), "https://www.facebook.com/nadav.cohen.167"),
      color: stryMutAct_9fa48("740") ? "" : (stryCov_9fa48("740"), "#06d6e0")
    }), stryMutAct_9fa48("741") ? {} : (stryCov_9fa48("741"), {
      title: t(stryMutAct_9fa48("742") ? "" : (stryCov_9fa48("742"), "b2Title")),
      excerpt: t(stryMutAct_9fa48("743") ? "" : (stryCov_9fa48("743"), "b2Excerpt")),
      category: stryMutAct_9fa48("744") ? "" : (stryCov_9fa48("744"), "dev"),
      date: stryMutAct_9fa48("745") ? "" : (stryCov_9fa48("745"), "2026-01-15"),
      readTime: 6,
      likes: 83,
      comments: 24,
      platform: stryMutAct_9fa48("746") ? "" : (stryCov_9fa48("746"), "Facebook"),
      href: stryMutAct_9fa48("747") ? "" : (stryCov_9fa48("747"), "https://www.facebook.com/nadav.cohen.167"),
      color: stryMutAct_9fa48("748") ? "" : (stryCov_9fa48("748"), "#e84393")
    }), stryMutAct_9fa48("749") ? {} : (stryCov_9fa48("749"), {
      title: t(stryMutAct_9fa48("750") ? "" : (stryCov_9fa48("750"), "b3Title")),
      excerpt: t(stryMutAct_9fa48("751") ? "" : (stryCov_9fa48("751"), "b3Excerpt")),
      category: stryMutAct_9fa48("752") ? "" : (stryCov_9fa48("752"), "AI"),
      date: stryMutAct_9fa48("753") ? "" : (stryCov_9fa48("753"), "2026-01-05"),
      readTime: 8,
      likes: 156,
      comments: 42,
      platform: stryMutAct_9fa48("754") ? "" : (stryCov_9fa48("754"), "Facebook"),
      href: stryMutAct_9fa48("755") ? "" : (stryCov_9fa48("755"), "https://www.facebook.com/nadav.cohen.167"),
      color: stryMutAct_9fa48("756") ? "" : (stryCov_9fa48("756"), "#4f46e5")
    }), stryMutAct_9fa48("757") ? {} : (stryCov_9fa48("757"), {
      title: t(stryMutAct_9fa48("758") ? "" : (stryCov_9fa48("758"), "b4Title")),
      excerpt: t(stryMutAct_9fa48("759") ? "" : (stryCov_9fa48("759"), "b4Excerpt")),
      category: stryMutAct_9fa48("760") ? "" : (stryCov_9fa48("760"), "tips"),
      date: stryMutAct_9fa48("761") ? "" : (stryCov_9fa48("761"), "2025-12-20"),
      readTime: 5,
      likes: 92,
      comments: 18,
      platform: stryMutAct_9fa48("762") ? "" : (stryCov_9fa48("762"), "Facebook"),
      href: stryMutAct_9fa48("763") ? "" : (stryCov_9fa48("763"), "https://www.facebook.com/nadav.cohen.167"),
      color: stryMutAct_9fa48("764") ? "" : (stryCov_9fa48("764"), "#06d6e0")
    }), stryMutAct_9fa48("765") ? {} : (stryCov_9fa48("765"), {
      title: t(stryMutAct_9fa48("766") ? "" : (stryCov_9fa48("766"), "b5Title")),
      excerpt: t(stryMutAct_9fa48("767") ? "" : (stryCov_9fa48("767"), "b5Excerpt")),
      category: stryMutAct_9fa48("768") ? "" : (stryCov_9fa48("768"), "career"),
      date: stryMutAct_9fa48("769") ? "" : (stryCov_9fa48("769"), "2025-12-10"),
      readTime: 10,
      likes: 210,
      comments: 56,
      platform: stryMutAct_9fa48("770") ? "" : (stryCov_9fa48("770"), "Facebook"),
      href: stryMutAct_9fa48("771") ? "" : (stryCov_9fa48("771"), "https://www.facebook.com/nadav.cohen.167"),
      color: stryMutAct_9fa48("772") ? "" : (stryCov_9fa48("772"), "#e84393")
    }), stryMutAct_9fa48("773") ? {} : (stryCov_9fa48("773"), {
      title: t(stryMutAct_9fa48("774") ? "" : (stryCov_9fa48("774"), "b6Title")),
      excerpt: t(stryMutAct_9fa48("775") ? "" : (stryCov_9fa48("775"), "b6Excerpt")),
      category: stryMutAct_9fa48("776") ? "" : (stryCov_9fa48("776"), "dev"),
      date: stryMutAct_9fa48("777") ? "" : (stryCov_9fa48("777"), "2025-11-28"),
      readTime: 7,
      likes: 134,
      comments: 31,
      platform: stryMutAct_9fa48("778") ? "" : (stryCov_9fa48("778"), "Facebook"),
      href: stryMutAct_9fa48("779") ? "" : (stryCov_9fa48("779"), "https://www.facebook.com/nadav.cohen.167"),
      color: stryMutAct_9fa48("780") ? "" : (stryCov_9fa48("780"), "#4f46e5")
    })]);
    function formatDate(dateStr: string) {
      if (stryMutAct_9fa48("781")) {
        {}
      } else {
        stryCov_9fa48("781");
        const date = new Date(dateStr);
        return date.toLocaleDateString((stryMutAct_9fa48("784") ? locale !== "he" : stryMutAct_9fa48("783") ? false : stryMutAct_9fa48("782") ? true : (stryCov_9fa48("782", "783", "784"), locale === (stryMutAct_9fa48("785") ? "" : (stryCov_9fa48("785"), "he")))) ? stryMutAct_9fa48("786") ? "" : (stryCov_9fa48("786"), "he-IL") : stryMutAct_9fa48("787") ? "" : (stryCov_9fa48("787"), "en-US"), stryMutAct_9fa48("788") ? {} : (stryCov_9fa48("788"), {
          day: stryMutAct_9fa48("789") ? "" : (stryCov_9fa48("789"), "numeric"),
          month: stryMutAct_9fa48("790") ? "" : (stryCov_9fa48("790"), "short"),
          year: stryMutAct_9fa48("791") ? "" : (stryCov_9fa48("791"), "numeric")
        }));
      }
    }
    const filtered = (stryMutAct_9fa48("794") ? activeCategory !== "all" : stryMutAct_9fa48("793") ? false : stryMutAct_9fa48("792") ? true : (stryCov_9fa48("792", "793", "794"), activeCategory === (stryMutAct_9fa48("795") ? "" : (stryCov_9fa48("795"), "all")))) ? posts : stryMutAct_9fa48("796") ? posts : (stryCov_9fa48("796"), posts.filter(stryMutAct_9fa48("797") ? () => undefined : (stryCov_9fa48("797"), p => stryMutAct_9fa48("800") ? p.category !== activeCategory : stryMutAct_9fa48("799") ? false : stryMutAct_9fa48("798") ? true : (stryCov_9fa48("798", "799", "800"), p.category === activeCategory))));
    useGSAP(() => {
      if (stryMutAct_9fa48("801")) {
        {}
      } else {
        stryCov_9fa48("801");
        if (stryMutAct_9fa48("804") ? false : stryMutAct_9fa48("803") ? true : stryMutAct_9fa48("802") ? sectionRef.current : (stryCov_9fa48("802", "803", "804"), !sectionRef.current)) return;

        // Animate section header
        if (stryMutAct_9fa48("806") ? false : stryMutAct_9fa48("805") ? true : (stryCov_9fa48("805", "806"), headerRef.current)) {
          if (stryMutAct_9fa48("807")) {
            {}
          } else {
            stryCov_9fa48("807");
            gsap.fromTo(headerRef.current, stryMutAct_9fa48("808") ? {} : (stryCov_9fa48("808"), {
              opacity: 0,
              y: 20
            }), stryMutAct_9fa48("809") ? {} : (stryCov_9fa48("809"), {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: stryMutAct_9fa48("810") ? "" : (stryCov_9fa48("810"), "expo.out"),
              scrollTrigger: stryMutAct_9fa48("811") ? {} : (stryCov_9fa48("811"), {
                trigger: headerRef.current,
                start: stryMutAct_9fa48("812") ? "" : (stryCov_9fa48("812"), "top 85%"),
                once: stryMutAct_9fa48("813") ? false : (stryCov_9fa48("813"), true)
              })
            }));
          }
        }

        // Animate category filters
        if (stryMutAct_9fa48("815") ? false : stryMutAct_9fa48("814") ? true : (stryCov_9fa48("814", "815"), categoryRef.current)) {
          if (stryMutAct_9fa48("816")) {
            {}
          } else {
            stryCov_9fa48("816");
            gsap.fromTo(categoryRef.current, stryMutAct_9fa48("817") ? {} : (stryCov_9fa48("817"), {
              opacity: 0,
              y: 20
            }), stryMutAct_9fa48("818") ? {} : (stryCov_9fa48("818"), {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: stryMutAct_9fa48("819") ? "" : (stryCov_9fa48("819"), "expo.out"),
              scrollTrigger: stryMutAct_9fa48("820") ? {} : (stryCov_9fa48("820"), {
                trigger: categoryRef.current,
                start: stryMutAct_9fa48("821") ? "" : (stryCov_9fa48("821"), "top 85%"),
                once: stryMutAct_9fa48("822") ? false : (stryCov_9fa48("822"), true)
              })
            }));
          }
        }

        // Animate blog post cards with batch
        ScrollTrigger.batch(stryMutAct_9fa48("823") ? "" : (stryCov_9fa48("823"), ".blog-card"), stryMutAct_9fa48("824") ? {} : (stryCov_9fa48("824"), {
          onEnter: elements => {
            if (stryMutAct_9fa48("825")) {
              {}
            } else {
              stryCov_9fa48("825");
              gsap.fromTo(elements, stryMutAct_9fa48("826") ? {} : (stryCov_9fa48("826"), {
                opacity: 0,
                y: 25
              }), stryMutAct_9fa48("827") ? {} : (stryCov_9fa48("827"), {
                opacity: 1,
                y: 0,
                stagger: 0.1,
                ease: stryMutAct_9fa48("828") ? "" : (stryCov_9fa48("828"), "expo.out"),
                duration: 0.7
              }));
            }
          },
          start: stryMutAct_9fa48("829") ? "" : (stryCov_9fa48("829"), "top 85%"),
          once: stryMutAct_9fa48("830") ? false : (stryCov_9fa48("830"), true)
        }));

        // Animate CTA button
        if (stryMutAct_9fa48("832") ? false : stryMutAct_9fa48("831") ? true : (stryCov_9fa48("831", "832"), ctaRef.current)) {
          if (stryMutAct_9fa48("833")) {
            {}
          } else {
            stryCov_9fa48("833");
            gsap.fromTo(ctaRef.current, stryMutAct_9fa48("834") ? {} : (stryCov_9fa48("834"), {
              opacity: 0,
              y: 20
            }), stryMutAct_9fa48("835") ? {} : (stryCov_9fa48("835"), {
              opacity: 1,
              y: 0,
              duration: 0.7,
              ease: stryMutAct_9fa48("836") ? "" : (stryCov_9fa48("836"), "expo.out"),
              scrollTrigger: stryMutAct_9fa48("837") ? {} : (stryCov_9fa48("837"), {
                trigger: ctaRef.current,
                start: stryMutAct_9fa48("838") ? "" : (stryCov_9fa48("838"), "top 85%"),
                once: stryMutAct_9fa48("839") ? false : (stryCov_9fa48("839"), true)
              })
            }));
          }
        }
      }
    }, stryMutAct_9fa48("840") ? {} : (stryCov_9fa48("840"), {
      scope: sectionRef,
      dependencies: stryMutAct_9fa48("841") ? [] : (stryCov_9fa48("841"), [filtered])
    }));
    return <section ref={sectionRef} id="blog" aria-label={t(stryMutAct_9fa48("842") ? "" : (stryCov_9fa48("842"), "title"))} className="relative py-16 md:py-32">
      <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div ref={headerRef}>
          <SectionHeader badge={t(stryMutAct_9fa48("843") ? "" : (stryCov_9fa48("843"), "badge"))} title={t(stryMutAct_9fa48("844") ? "" : (stryCov_9fa48("844"), "title"))} highlight={t(stryMutAct_9fa48("845") ? "" : (stryCov_9fa48("845"), "highlight"))} description={t(stryMutAct_9fa48("846") ? "" : (stryCov_9fa48("846"), "description"))} />
        </div>

        {/* Category filter */}
        <div ref={categoryRef} className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-2 mb-8 md:mb-12 overflow-x-auto px-1 pb-2 scrollbar-hide">
          {categories.map(stryMutAct_9fa48("847") ? () => undefined : (stryCov_9fa48("847"), cat => <button key={cat.key} onClick={stryMutAct_9fa48("848") ? () => undefined : (stryCov_9fa48("848"), () => setActiveCategory(cat.key))} aria-pressed={stryMutAct_9fa48("851") ? activeCategory !== cat.key : stryMutAct_9fa48("850") ? false : stryMutAct_9fa48("849") ? true : (stryCov_9fa48("849", "850", "851"), activeCategory === cat.key)} className={stryMutAct_9fa48("852") ? `` : (stryCov_9fa48("852"), `px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 min-h-11 ${(stryMutAct_9fa48("855") ? activeCategory !== cat.key : stryMutAct_9fa48("854") ? false : stryMutAct_9fa48("853") ? true : (stryCov_9fa48("853", "854", "855"), activeCategory === cat.key)) ? stryMutAct_9fa48("856") ? "" : (stryCov_9fa48("856"), "bg-[#06d6e0]/15 text-[#06d6e0] border border-[#06d6e0]/30") : stryMutAct_9fa48("857") ? "" : (stryCov_9fa48("857"), "bg-[hsl(222,47%,6%)] text-[hsl(215,20%,50%)] border border-[hsl(215,28%,16%)] hover:border-[hsl(215,28%,22%)] hover:text-[hsl(215,20%,65%)]")}`)}>
              {cat.display}
            </button>))}
        </div>

        {/* Posts grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map(stryMutAct_9fa48("858") ? () => undefined : (stryCov_9fa48("858"), post => <a key={post.title} href={post.href} target="_blank" rel="noreferrer" className="blog-card group relative block h-full rounded-2xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] overflow-hidden hover:border-opacity-50 transition-all duration-500" onMouseEnter={e => {
            if (stryMutAct_9fa48("859")) {
              {}
            } else {
              stryCov_9fa48("859");
              e.currentTarget.style.borderColor = stryMutAct_9fa48("860") ? `` : (stryCov_9fa48("860"), `${post.color}30`);
            }
          }} onMouseLeave={e => {
            if (stryMutAct_9fa48("861")) {
              {}
            } else {
              stryCov_9fa48("861");
              e.currentTarget.style.borderColor = stryMutAct_9fa48("862") ? "Stryker was here!" : (stryCov_9fa48("862"), "");
            }
          }}>
              {/* Top accent */}
              <div className="h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={stryMutAct_9fa48("863") ? {} : (stryCov_9fa48("863"), {
              background: stryMutAct_9fa48("864") ? `` : (stryCov_9fa48("864"), `linear-gradient(to right, transparent, ${post.color}, transparent)`)
            })} />

              <div className="p-4 md:p-6">
                {/* Meta row */}
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full tracking-wider uppercase" style={stryMutAct_9fa48("865") ? {} : (stryCov_9fa48("865"), {
                  background: stryMutAct_9fa48("866") ? `` : (stryCov_9fa48("866"), `${post.color}12`),
                  color: post.color,
                  border: stryMutAct_9fa48("867") ? `` : (stryCov_9fa48("867"), `1px solid ${post.color}25`)
                })}>
                    {tCat(post.category)}
                  </span>
                  <div className="flex items-center gap-1.5 text-[hsl(215,20%,48%)]">
                    <Calendar className="w-3 h-3" />
                    <span className="text-[11px] font-mono" dir="ltr">{formatDate(post.date)}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[hsl(210,40%,98%)] mb-3 leading-snug group-hover:text-[hsl(210,40%,100%)] transition-colors line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-sm text-[hsl(215,20%,55%)] leading-relaxed mb-5 line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[hsl(215,28%,12%)]">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono" dir="ltr">{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono" dir="ltr">{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[hsl(215,20%,45%)]">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-xs font-mono" dir="ltr">{post.readTime} min</span>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-[hsl(215,20%,45%)] group-hover:text-[#06d6e0] transition-colors" />
                </div>
              </div>

              {/* Background hover glow */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" style={stryMutAct_9fa48("868") ? {} : (stryCov_9fa48("868"), {
              background: stryMutAct_9fa48("869") ? `` : (stryCov_9fa48("869"), `radial-gradient(ellipse at top, ${post.color}06, transparent 70%)`)
            })} />
            </a>))}
        </div>

        {/* View all CTA */}
        <div ref={ctaRef} className="flex justify-center mt-8 md:mt-12">
          <a href="https://www.facebook.com/nadav.cohen.167" target="_blank" rel="noreferrer" className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,6%)] text-sm font-medium text-[hsl(215,20%,65%)] hover:text-[#06d6e0] hover:border-[#06d6e0]/30 transition-all duration-500 min-h-11">
            {t(stryMutAct_9fa48("870") ? "" : (stryCov_9fa48("870"), "allPosts"))}
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>;
  }
}