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
import { useState, useRef } from "react";
import { Play, Clock, Eye, ExternalLink, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "./section-header";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
gsap.registerPlugin(ScrollTrigger);
export function YouTube() {
  if (stryMutAct_9fa48("3723")) {
    {}
  } else {
    stryCov_9fa48("3723");
    const t = useTranslations(stryMutAct_9fa48("3724") ? "" : (stryCov_9fa48("3724"), "youtube"));
    const tCat = useTranslations(stryMutAct_9fa48("3725") ? "" : (stryCov_9fa48("3725"), "categories"));
    const [activeCategory, setActiveCategory] = useState(stryMutAct_9fa48("3726") ? "" : (stryCov_9fa48("3726"), "all"));
    const sectionRef = useRef<HTMLDivElement>(null);
    const categories = stryMutAct_9fa48("3727") ? [] : (stryCov_9fa48("3727"), [stryMutAct_9fa48("3728") ? {} : (stryCov_9fa48("3728"), {
      key: stryMutAct_9fa48("3729") ? "" : (stryCov_9fa48("3729"), "all"),
      display: t(stryMutAct_9fa48("3730") ? "" : (stryCov_9fa48("3730"), "catAll"))
    }), stryMutAct_9fa48("3731") ? {} : (stryCov_9fa48("3731"), {
      key: stryMutAct_9fa48("3732") ? "" : (stryCov_9fa48("3732"), "AI"),
      display: t(stryMutAct_9fa48("3733") ? "" : (stryCov_9fa48("3733"), "catAI"))
    }), stryMutAct_9fa48("3734") ? {} : (stryCov_9fa48("3734"), {
      key: stryMutAct_9fa48("3735") ? "" : (stryCov_9fa48("3735"), "dev"),
      display: t(stryMutAct_9fa48("3736") ? "" : (stryCov_9fa48("3736"), "catDev"))
    }), stryMutAct_9fa48("3737") ? {} : (stryCov_9fa48("3737"), {
      key: stryMutAct_9fa48("3738") ? "" : (stryCov_9fa48("3738"), "demos"),
      display: t(stryMutAct_9fa48("3739") ? "" : (stryCov_9fa48("3739"), "catDemos"))
    }), stryMutAct_9fa48("3740") ? {} : (stryCov_9fa48("3740"), {
      key: stryMutAct_9fa48("3741") ? "" : (stryCov_9fa48("3741"), "tips"),
      display: t(stryMutAct_9fa48("3742") ? "" : (stryCov_9fa48("3742"), "catTips"))
    })]);
    const videos = stryMutAct_9fa48("3743") ? [] : (stryCov_9fa48("3743"), [stryMutAct_9fa48("3744") ? {} : (stryCov_9fa48("3744"), {
      title: t(stryMutAct_9fa48("3745") ? "" : (stryCov_9fa48("3745"), "v1Title")),
      description: t(stryMutAct_9fa48("3746") ? "" : (stryCov_9fa48("3746"), "v1Desc")),
      thumbnail: null,
      category: stryMutAct_9fa48("3747") ? "" : (stryCov_9fa48("3747"), "demos"),
      duration: stryMutAct_9fa48("3748") ? "" : (stryCov_9fa48("3748"), "18:42"),
      views: stryMutAct_9fa48("3749") ? "" : (stryCov_9fa48("3749"), "2.1K"),
      date: stryMutAct_9fa48("3750") ? "" : (stryCov_9fa48("3750"), "2026-01"),
      color: stryMutAct_9fa48("3751") ? "" : (stryCov_9fa48("3751"), "#06d6e0")
    }), stryMutAct_9fa48("3752") ? {} : (stryCov_9fa48("3752"), {
      title: t(stryMutAct_9fa48("3753") ? "" : (stryCov_9fa48("3753"), "v2Title")),
      description: t(stryMutAct_9fa48("3754") ? "" : (stryCov_9fa48("3754"), "v2Desc")),
      thumbnail: null,
      category: stryMutAct_9fa48("3755") ? "" : (stryCov_9fa48("3755"), "AI"),
      duration: stryMutAct_9fa48("3756") ? "" : (stryCov_9fa48("3756"), "24:15"),
      views: stryMutAct_9fa48("3757") ? "" : (stryCov_9fa48("3757"), "5.3K"),
      date: stryMutAct_9fa48("3758") ? "" : (stryCov_9fa48("3758"), "2026-01"),
      color: stryMutAct_9fa48("3759") ? "" : (stryCov_9fa48("3759"), "#e84393")
    }), stryMutAct_9fa48("3760") ? {} : (stryCov_9fa48("3760"), {
      title: t(stryMutAct_9fa48("3761") ? "" : (stryCov_9fa48("3761"), "v3Title")),
      description: t(stryMutAct_9fa48("3762") ? "" : (stryCov_9fa48("3762"), "v3Desc")),
      thumbnail: null,
      category: stryMutAct_9fa48("3763") ? "" : (stryCov_9fa48("3763"), "dev"),
      duration: stryMutAct_9fa48("3764") ? "" : (stryCov_9fa48("3764"), "15:30"),
      views: stryMutAct_9fa48("3765") ? "" : (stryCov_9fa48("3765"), "3.8K"),
      date: stryMutAct_9fa48("3766") ? "" : (stryCov_9fa48("3766"), "2025-12"),
      color: stryMutAct_9fa48("3767") ? "" : (stryCov_9fa48("3767"), "#4f46e5")
    }), stryMutAct_9fa48("3768") ? {} : (stryCov_9fa48("3768"), {
      title: t(stryMutAct_9fa48("3769") ? "" : (stryCov_9fa48("3769"), "v4Title")),
      description: t(stryMutAct_9fa48("3770") ? "" : (stryCov_9fa48("3770"), "v4Desc")),
      thumbnail: null,
      category: stryMutAct_9fa48("3771") ? "" : (stryCov_9fa48("3771"), "tips"),
      duration: stryMutAct_9fa48("3772") ? "" : (stryCov_9fa48("3772"), "8:45"),
      views: stryMutAct_9fa48("3773") ? "" : (stryCov_9fa48("3773"), "1.7K"),
      date: stryMutAct_9fa48("3774") ? "" : (stryCov_9fa48("3774"), "2025-12"),
      color: stryMutAct_9fa48("3775") ? "" : (stryCov_9fa48("3775"), "#06d6e0")
    }), stryMutAct_9fa48("3776") ? {} : (stryCov_9fa48("3776"), {
      title: t(stryMutAct_9fa48("3777") ? "" : (stryCov_9fa48("3777"), "v5Title")),
      description: t(stryMutAct_9fa48("3778") ? "" : (stryCov_9fa48("3778"), "v5Desc")),
      thumbnail: null,
      category: stryMutAct_9fa48("3779") ? "" : (stryCov_9fa48("3779"), "demos"),
      duration: stryMutAct_9fa48("3780") ? "" : (stryCov_9fa48("3780"), "22:10"),
      views: stryMutAct_9fa48("3781") ? "" : (stryCov_9fa48("3781"), "4.2K"),
      date: stryMutAct_9fa48("3782") ? "" : (stryCov_9fa48("3782"), "2025-11"),
      color: stryMutAct_9fa48("3783") ? "" : (stryCov_9fa48("3783"), "#e84393")
    }), stryMutAct_9fa48("3784") ? {} : (stryCov_9fa48("3784"), {
      title: t(stryMutAct_9fa48("3785") ? "" : (stryCov_9fa48("3785"), "v6Title")),
      description: t(stryMutAct_9fa48("3786") ? "" : (stryCov_9fa48("3786"), "v6Desc")),
      thumbnail: null,
      category: stryMutAct_9fa48("3787") ? "" : (stryCov_9fa48("3787"), "dev"),
      duration: stryMutAct_9fa48("3788") ? "" : (stryCov_9fa48("3788"), "19:55"),
      views: stryMutAct_9fa48("3789") ? "" : (stryCov_9fa48("3789"), "2.9K"),
      date: stryMutAct_9fa48("3790") ? "" : (stryCov_9fa48("3790"), "2025-11"),
      color: stryMutAct_9fa48("3791") ? "" : (stryCov_9fa48("3791"), "#4f46e5")
    })]);
    const filtered = (stryMutAct_9fa48("3794") ? activeCategory !== "all" : stryMutAct_9fa48("3793") ? false : stryMutAct_9fa48("3792") ? true : (stryCov_9fa48("3792", "3793", "3794"), activeCategory === (stryMutAct_9fa48("3795") ? "" : (stryCov_9fa48("3795"), "all")))) ? videos : stryMutAct_9fa48("3796") ? videos : (stryCov_9fa48("3796"), videos.filter(stryMutAct_9fa48("3797") ? () => undefined : (stryCov_9fa48("3797"), v => stryMutAct_9fa48("3800") ? v.category !== activeCategory : stryMutAct_9fa48("3799") ? false : stryMutAct_9fa48("3798") ? true : (stryCov_9fa48("3798", "3799", "3800"), v.category === activeCategory))));
    useGSAP(() => {
      if (stryMutAct_9fa48("3801")) {
        {}
      } else {
        stryCov_9fa48("3801");
        ScrollTrigger.batch(stryMutAct_9fa48("3802") ? "" : (stryCov_9fa48("3802"), ".yt-category-btn"), stryMutAct_9fa48("3803") ? {} : (stryCov_9fa48("3803"), {
          onEnter: stryMutAct_9fa48("3804") ? () => undefined : (stryCov_9fa48("3804"), batch => gsap.fromTo(batch, stryMutAct_9fa48("3805") ? {} : (stryCov_9fa48("3805"), {
            opacity: 0,
            y: 15
          }), stryMutAct_9fa48("3806") ? {} : (stryCov_9fa48("3806"), {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: stryMutAct_9fa48("3807") ? "" : (stryCov_9fa48("3807"), "expo.out"),
            stagger: 0.08
          }))),
          once: stryMutAct_9fa48("3808") ? false : (stryCov_9fa48("3808"), true)
        }));
        ScrollTrigger.batch(stryMutAct_9fa48("3809") ? "" : (stryCov_9fa48("3809"), ".video-card"), stryMutAct_9fa48("3810") ? {} : (stryCov_9fa48("3810"), {
          onEnter: stryMutAct_9fa48("3811") ? () => undefined : (stryCov_9fa48("3811"), batch => gsap.fromTo(batch, stryMutAct_9fa48("3812") ? {} : (stryCov_9fa48("3812"), {
            opacity: 0,
            y: 30
          }), stryMutAct_9fa48("3813") ? {} : (stryCov_9fa48("3813"), {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: stryMutAct_9fa48("3814") ? "" : (stryCov_9fa48("3814"), "expo.out"),
            stagger: 0.12
          }))),
          once: stryMutAct_9fa48("3815") ? false : (stryCov_9fa48("3815"), true)
        }));
        ScrollTrigger.batch(stryMutAct_9fa48("3816") ? "" : (stryCov_9fa48("3816"), ".yt-cta"), stryMutAct_9fa48("3817") ? {} : (stryCov_9fa48("3817"), {
          onEnter: stryMutAct_9fa48("3818") ? () => undefined : (stryCov_9fa48("3818"), batch => gsap.fromTo(batch, stryMutAct_9fa48("3819") ? {} : (stryCov_9fa48("3819"), {
            opacity: 0,
            y: 20
          }), stryMutAct_9fa48("3820") ? {} : (stryCov_9fa48("3820"), {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: stryMutAct_9fa48("3821") ? "" : (stryCov_9fa48("3821"), "expo.out")
          }))),
          once: stryMutAct_9fa48("3822") ? false : (stryCov_9fa48("3822"), true)
        }));
      }
    }, stryMutAct_9fa48("3823") ? {} : (stryCov_9fa48("3823"), {
      scope: sectionRef,
      dependencies: stryMutAct_9fa48("3824") ? [] : (stryCov_9fa48("3824"), [filtered])
    }));
    return <section ref={sectionRef} id="youtube" aria-label={t(stryMutAct_9fa48("3825") ? "" : (stryCov_9fa48("3825"), "title"))} className="relative py-16 md:py-32 bg-[hsl(222,47%,3%)]">
      <div className="absolute inset-0 dot-grid-subtle opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader badge={t(stryMutAct_9fa48("3826") ? "" : (stryCov_9fa48("3826"), "badge"))} title={t(stryMutAct_9fa48("3827") ? "" : (stryCov_9fa48("3827"), "title"))} highlight={t(stryMutAct_9fa48("3828") ? "" : (stryCov_9fa48("3828"), "highlight"))} description={t(stryMutAct_9fa48("3829") ? "" : (stryCov_9fa48("3829"), "description"))} />

        <div className="flex flex-nowrap md:flex-wrap items-center md:justify-center gap-2 mb-8 md:mb-12 overflow-x-auto px-1 pb-2 scrollbar-hide">
          {categories.map(stryMutAct_9fa48("3830") ? () => undefined : (stryCov_9fa48("3830"), cat => <button key={cat.key} onClick={stryMutAct_9fa48("3831") ? () => undefined : (stryCov_9fa48("3831"), () => setActiveCategory(cat.key))} aria-pressed={stryMutAct_9fa48("3834") ? activeCategory !== cat.key : stryMutAct_9fa48("3833") ? false : stryMutAct_9fa48("3832") ? true : (stryCov_9fa48("3832", "3833", "3834"), activeCategory === cat.key)} className={stryMutAct_9fa48("3835") ? `` : (stryCov_9fa48("3835"), `yt-category-btn px-4 py-2 rounded-lg text-sm font-mono transition-all duration-300 min-h-11 ${(stryMutAct_9fa48("3838") ? activeCategory !== cat.key : stryMutAct_9fa48("3837") ? false : stryMutAct_9fa48("3836") ? true : (stryCov_9fa48("3836", "3837", "3838"), activeCategory === cat.key)) ? stryMutAct_9fa48("3839") ? "" : (stryCov_9fa48("3839"), "bg-[#e84393]/15 text-[#e84393] border border-[#e84393]/30") : stryMutAct_9fa48("3840") ? "" : (stryCov_9fa48("3840"), "bg-[hsl(222,47%,6%)] text-[hsl(215,20%,50%)] border border-[hsl(215,28%,16%)] hover:border-[hsl(215,28%,22%)] hover:text-[hsl(215,20%,65%)]")}`)}>
              {cat.display}
            </button>))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {filtered.map(stryMutAct_9fa48("3841") ? () => undefined : (stryCov_9fa48("3841"), video => <div key={video.title} className="video-card group relative h-full rounded-2xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] overflow-hidden hover:border-opacity-50 transition-all duration-500">
              <div className="relative aspect-video bg-[hsl(222,47%,7%)] overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={stryMutAct_9fa48("3842") ? {} : (stryCov_9fa48("3842"), {
                background: stryMutAct_9fa48("3843") ? `` : (stryCov_9fa48("3843"), `linear-gradient(135deg, ${video.color}30, transparent)`)
              })} />

                <div className="absolute inset-0 grid-bg opacity-20" />

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110" style={stryMutAct_9fa48("3844") ? {} : (stryCov_9fa48("3844"), {
                  background: stryMutAct_9fa48("3845") ? `` : (stryCov_9fa48("3845"), `${video.color}20`),
                  border: stryMutAct_9fa48("3846") ? `` : (stryCov_9fa48("3846"), `2px solid ${video.color}40`),
                  boxShadow: stryMutAct_9fa48("3847") ? `` : (stryCov_9fa48("3847"), `0 0 30px ${video.color}15`)
                })}>
                    <Play className="w-6 h-6 ms-0.5" style={stryMutAct_9fa48("3848") ? {} : (stryCov_9fa48("3848"), {
                    color: video.color
                  })} fill="currentColor" />
                  </div>
                </div>

                <div className="absolute bottom-3 end-3 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm">
                  <span className="text-[11px] font-mono text-white" dir="ltr">{video.duration}</span>
                </div>

                <div className="absolute top-3 start-3">
                  <span className="text-[10px] font-mono px-2 py-1 rounded-md tracking-wider uppercase backdrop-blur-sm" style={stryMutAct_9fa48("3849") ? {} : (stryCov_9fa48("3849"), {
                  background: stryMutAct_9fa48("3850") ? `` : (stryCov_9fa48("3850"), `${video.color}25`),
                  color: video.color
                })}>
                    {tCat(video.category)}
                  </span>
                </div>
              </div>

              <div className="p-5">
                <h3 className="text-sm font-bold text-[hsl(210,40%,98%)] mb-2 leading-snug group-hover:text-[hsl(210,40%,100%)] transition-colors line-clamp-2">
                  {video.title}
                </h3>

                <p className="text-xs text-[hsl(215,20%,50%)] leading-relaxed mb-4 line-clamp-2">
                  {video.description}
                </p>

                <div className="flex items-center justify-between pt-3 border-t border-[hsl(215,28%,12%)]">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[hsl(215,20%,48%)]">
                      <Eye className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-mono" dir="ltr">{video.views}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[hsl(215,20%,48%)]">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="text-[11px] font-mono" dir="ltr">{video.date}</span>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-[hsl(215,20%,45%)] group-hover:text-[#e84393] transition-colors" />
                </div>
              </div>
            </div>))}
        </div>

        <div className="flex justify-center mt-8 md:mt-12">
          <a href="https://youtube.com/@nadavai" target="_blank" rel="noreferrer" className="yt-cta group flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-l from-[#FF0000] to-[#cc0000] text-white font-bold text-sm hover:shadow-[0_0_40px_rgba(255,0,0,0.3)] transition-all duration-500 min-h-11">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            {t(stryMutAct_9fa48("3851") ? "" : (stryCov_9fa48("3851"), "subscribe"))}
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform rtl:rotate-180" />
          </a>
        </div>
      </div>
    </section>;
  }
}