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
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Briefcase, BookOpen, FolderGit2, Newspaper, Phone, Github, Facebook, Mail, Zap, Terminal, Cpu, PenLine, Play } from "lucide-react";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
export function CommandPalette() {
  if (stryMutAct_9fa48("892")) {
    {}
  } else {
    stryCov_9fa48("892");
    const t = useTranslations(stryMutAct_9fa48("893") ? "" : (stryCov_9fa48("893"), "commandPalette"));
    const locale = useLocale();
    const [isMac, setIsMac] = useState(stryMutAct_9fa48("894") ? false : (stryCov_9fa48("894"), true)); // Default true for SSR

    const sections = stryMutAct_9fa48("895") ? [] : (stryCov_9fa48("895"), [stryMutAct_9fa48("896") ? {} : (stryCov_9fa48("896"), {
      label: t(stryMutAct_9fa48("897") ? "" : (stryCov_9fa48("897"), "projects")),
      href: stryMutAct_9fa48("898") ? "" : (stryCov_9fa48("898"), "#projects"),
      icon: Briefcase,
      description: t(stryMutAct_9fa48("899") ? "" : (stryCov_9fa48("899"), "projectsDesc"))
    }), stryMutAct_9fa48("900") ? {} : (stryCov_9fa48("900"), {
      label: t(stryMutAct_9fa48("901") ? "" : (stryCov_9fa48("901"), "services")),
      href: stryMutAct_9fa48("902") ? "" : (stryCov_9fa48("902"), "#services"),
      icon: Zap,
      description: t(stryMutAct_9fa48("903") ? "" : (stryCov_9fa48("903"), "servicesDesc"))
    }), stryMutAct_9fa48("904") ? {} : (stryCov_9fa48("904"), {
      label: t(stryMutAct_9fa48("905") ? "" : (stryCov_9fa48("905"), "process")),
      href: stryMutAct_9fa48("906") ? "" : (stryCov_9fa48("906"), "#process"),
      icon: Cpu,
      description: t(stryMutAct_9fa48("907") ? "" : (stryCov_9fa48("907"), "processDesc"))
    }), stryMutAct_9fa48("908") ? {} : (stryCov_9fa48("908"), {
      label: t(stryMutAct_9fa48("909") ? "" : (stryCov_9fa48("909"), "blog")),
      href: stryMutAct_9fa48("910") ? "" : (stryCov_9fa48("910"), "#blog"),
      icon: PenLine,
      description: t(stryMutAct_9fa48("911") ? "" : (stryCov_9fa48("911"), "blogDesc"))
    }), stryMutAct_9fa48("912") ? {} : (stryCov_9fa48("912"), {
      label: t(stryMutAct_9fa48("913") ? "" : (stryCov_9fa48("913"), "youtube")),
      href: stryMutAct_9fa48("914") ? "" : (stryCov_9fa48("914"), "#youtube"),
      icon: Play,
      description: t(stryMutAct_9fa48("915") ? "" : (stryCov_9fa48("915"), "youtubeDesc"))
    }), stryMutAct_9fa48("916") ? {} : (stryCov_9fa48("916"), {
      label: t(stryMutAct_9fa48("917") ? "" : (stryCov_9fa48("917"), "guides")),
      href: stryMutAct_9fa48("918") ? "" : (stryCov_9fa48("918"), "#guides"),
      icon: BookOpen,
      description: t(stryMutAct_9fa48("919") ? "" : (stryCov_9fa48("919"), "guidesDesc"))
    }), stryMutAct_9fa48("920") ? {} : (stryCov_9fa48("920"), {
      label: t(stryMutAct_9fa48("921") ? "" : (stryCov_9fa48("921"), "resources")),
      href: stryMutAct_9fa48("922") ? "" : (stryCov_9fa48("922"), "#resources"),
      icon: FolderGit2,
      description: t(stryMutAct_9fa48("923") ? "" : (stryCov_9fa48("923"), "resourcesDesc"))
    }), stryMutAct_9fa48("924") ? {} : (stryCov_9fa48("924"), {
      label: t(stryMutAct_9fa48("925") ? "" : (stryCov_9fa48("925"), "news")),
      href: stryMutAct_9fa48("926") ? "" : (stryCov_9fa48("926"), "#news"),
      icon: Newspaper,
      description: t(stryMutAct_9fa48("927") ? "" : (stryCov_9fa48("927"), "newsDesc"))
    }), stryMutAct_9fa48("928") ? {} : (stryCov_9fa48("928"), {
      label: t(stryMutAct_9fa48("929") ? "" : (stryCov_9fa48("929"), "contact")),
      href: stryMutAct_9fa48("930") ? "" : (stryCov_9fa48("930"), "#contact"),
      icon: Phone,
      description: t(stryMutAct_9fa48("931") ? "" : (stryCov_9fa48("931"), "contactDesc"))
    })]);
    const links = stryMutAct_9fa48("932") ? [] : (stryCov_9fa48("932"), [stryMutAct_9fa48("933") ? {} : (stryCov_9fa48("933"), {
      label: stryMutAct_9fa48("934") ? "" : (stryCov_9fa48("934"), "GitHub"),
      href: stryMutAct_9fa48("935") ? "" : (stryCov_9fa48("935"), "https://github.com/Nadav011"),
      icon: Github,
      external: stryMutAct_9fa48("936") ? false : (stryCov_9fa48("936"), true)
    }), stryMutAct_9fa48("937") ? {} : (stryCov_9fa48("937"), {
      label: stryMutAct_9fa48("938") ? "" : (stryCov_9fa48("938"), "Facebook"),
      href: stryMutAct_9fa48("939") ? "" : (stryCov_9fa48("939"), "https://www.facebook.com/nadav.cohen.167"),
      icon: Facebook,
      external: stryMutAct_9fa48("940") ? false : (stryCov_9fa48("940"), true)
    }), stryMutAct_9fa48("941") ? {} : (stryCov_9fa48("941"), {
      label: stryMutAct_9fa48("942") ? "" : (stryCov_9fa48("942"), "WhatsApp"),
      href: stryMutAct_9fa48("943") ? "" : (stryCov_9fa48("943"), "https://wa.me/972504401760"),
      icon: Phone,
      external: stryMutAct_9fa48("944") ? false : (stryCov_9fa48("944"), true)
    }), stryMutAct_9fa48("945") ? {} : (stryCov_9fa48("945"), {
      label: t(stryMutAct_9fa48("946") ? "" : (stryCov_9fa48("946"), "email")),
      href: stryMutAct_9fa48("947") ? "" : (stryCov_9fa48("947"), "mailto:hello@nadavc.ai"),
      icon: Mail,
      external: stryMutAct_9fa48("948") ? false : (stryCov_9fa48("948"), true)
    })]);
    const [open, setOpen] = useState(stryMutAct_9fa48("949") ? true : (stryCov_9fa48("949"), false));
    useEffect(() => {
      if (stryMutAct_9fa48("950")) {
        {}
      } else {
        stryCov_9fa48("950");
        const down = (e: KeyboardEvent) => {
          if (stryMutAct_9fa48("951")) {
            {}
          } else {
            stryCov_9fa48("951");
            if (stryMutAct_9fa48("954") ? e.key === "k" || e.metaKey || e.ctrlKey : stryMutAct_9fa48("953") ? false : stryMutAct_9fa48("952") ? true : (stryCov_9fa48("952", "953", "954"), (stryMutAct_9fa48("956") ? e.key !== "k" : stryMutAct_9fa48("955") ? true : (stryCov_9fa48("955", "956"), e.key === (stryMutAct_9fa48("957") ? "" : (stryCov_9fa48("957"), "k")))) && (stryMutAct_9fa48("959") ? e.metaKey && e.ctrlKey : stryMutAct_9fa48("958") ? true : (stryCov_9fa48("958", "959"), e.metaKey || e.ctrlKey)))) {
              if (stryMutAct_9fa48("960")) {
                {}
              } else {
                stryCov_9fa48("960");
                e.preventDefault();
                setOpen(stryMutAct_9fa48("961") ? () => undefined : (stryCov_9fa48("961"), prev => stryMutAct_9fa48("962") ? prev : (stryCov_9fa48("962"), !prev)));
              }
            }
          }
        };
        document.addEventListener(stryMutAct_9fa48("963") ? "" : (stryCov_9fa48("963"), "keydown"), down);
        // Sync browser platform to React state on mount — legitimate external state sync
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsMac(stryMutAct_9fa48("964") ? navigator.platform?.toLowerCase().includes("mac") && /mac/i.test(navigator.userAgent) : (stryCov_9fa48("964"), (stryMutAct_9fa48("966") ? navigator.platform.toLowerCase().includes("mac") : stryMutAct_9fa48("965") ? navigator.platform?.toUpperCase().includes("mac") : (stryCov_9fa48("965", "966"), navigator.platform?.toLowerCase().includes(stryMutAct_9fa48("967") ? "" : (stryCov_9fa48("967"), "mac")))) ?? /mac/i.test(navigator.userAgent)));
        return stryMutAct_9fa48("968") ? () => undefined : (stryCov_9fa48("968"), () => document.removeEventListener(stryMutAct_9fa48("969") ? "" : (stryCov_9fa48("969"), "keydown"), down));
      }
    }, stryMutAct_9fa48("970") ? ["Stryker was here"] : (stryCov_9fa48("970"), []));
    const handleSelect = (value: string) => {
      if (stryMutAct_9fa48("971")) {
        {}
      } else {
        stryCov_9fa48("971");
        setOpen(stryMutAct_9fa48("972") ? true : (stryCov_9fa48("972"), false));

        // Check for external links
        const link = links.find(stryMutAct_9fa48("973") ? () => undefined : (stryCov_9fa48("973"), l => stryMutAct_9fa48("976") ? l.href !== value : stryMutAct_9fa48("975") ? false : stryMutAct_9fa48("974") ? true : (stryCov_9fa48("974", "975", "976"), l.href === value)));
        if (stryMutAct_9fa48("979") ? link.external : stryMutAct_9fa48("978") ? false : stryMutAct_9fa48("977") ? true : (stryCov_9fa48("977", "978", "979"), link?.external)) {
          if (stryMutAct_9fa48("980")) {
            {}
          } else {
            stryCov_9fa48("980");
            window.open(value, stryMutAct_9fa48("981") ? "" : (stryCov_9fa48("981"), "_blank"), stryMutAct_9fa48("982") ? "" : (stryCov_9fa48("982"), "noreferrer"));
            return;
          }
        }

        // Check for actions
        if (stryMutAct_9fa48("985") ? value !== "ai-status" : stryMutAct_9fa48("984") ? false : stryMutAct_9fa48("983") ? true : (stryCov_9fa48("983", "984", "985"), value === (stryMutAct_9fa48("986") ? "" : (stryCov_9fa48("986"), "ai-status")))) {
          if (stryMutAct_9fa48("987")) {
            {}
          } else {
            stryCov_9fa48("987");
            return;
          }
        }

        // Section navigation
        if (stryMutAct_9fa48("990") ? value.endsWith("#") : stryMutAct_9fa48("989") ? false : stryMutAct_9fa48("988") ? true : (stryCov_9fa48("988", "989", "990"), value.startsWith(stryMutAct_9fa48("991") ? "" : (stryCov_9fa48("991"), "#")))) {
          if (stryMutAct_9fa48("992")) {
            {}
          } else {
            stryCov_9fa48("992");
            const el = document.querySelector(value);
            if (stryMutAct_9fa48("994") ? false : stryMutAct_9fa48("993") ? true : (stryCov_9fa48("993", "994"), el)) {
              if (stryMutAct_9fa48("995")) {
                {}
              } else {
                stryCov_9fa48("995");
                el.scrollIntoView(stryMutAct_9fa48("996") ? {} : (stryCov_9fa48("996"), {
                  behavior: stryMutAct_9fa48("997") ? "" : (stryCov_9fa48("997"), "smooth")
                }));
              }
            }
          }
        }
      }
    };
    return <>
      {/* Keyboard hint in navbar */}
      <button onClick={stryMutAct_9fa48("998") ? () => undefined : (stryCov_9fa48("998"), () => setOpen(stryMutAct_9fa48("999") ? false : (stryCov_9fa48("999"), true)))} className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] text-[hsl(215,20%,45%)] hover:border-[#06d6e0]/30 hover:text-[hsl(215,20%,60%)] transition-all text-xs font-mono">
        <Terminal className="w-3 h-3" />
        <span className="hidden xl:inline">{t(stryMutAct_9fa48("1000") ? "" : (stryCov_9fa48("1000"), "search"))}</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[hsl(215,28%,12%)] border border-[hsl(215,28%,18%)] text-[10px] font-mono">
          {isMac ? stryMutAct_9fa48("1001") ? "" : (stryCov_9fa48("1001"), "⌘K") : stryMutAct_9fa48("1002") ? "" : (stryCov_9fa48("1002"), "Ctrl+K")}
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={t(stryMutAct_9fa48("1003") ? "" : (stryCov_9fa48("1003"), "placeholder"))} className={(stryMutAct_9fa48("1006") ? locale !== "he" : stryMutAct_9fa48("1005") ? false : stryMutAct_9fa48("1004") ? true : (stryCov_9fa48("1004", "1005", "1006"), locale === (stryMutAct_9fa48("1007") ? "" : (stryCov_9fa48("1007"), "he")))) ? stryMutAct_9fa48("1008") ? "" : (stryCov_9fa48("1008"), "text-end") : stryMutAct_9fa48("1009") ? "" : (stryCov_9fa48("1009"), "text-start")} dir={(stryMutAct_9fa48("1012") ? locale !== "he" : stryMutAct_9fa48("1011") ? false : stryMutAct_9fa48("1010") ? true : (stryCov_9fa48("1010", "1011", "1012"), locale === (stryMutAct_9fa48("1013") ? "" : (stryCov_9fa48("1013"), "he")))) ? stryMutAct_9fa48("1014") ? "" : (stryCov_9fa48("1014"), "rtl") : stryMutAct_9fa48("1015") ? "" : (stryCov_9fa48("1015"), "ltr")} />
        <CommandList dir={(stryMutAct_9fa48("1018") ? locale !== "he" : stryMutAct_9fa48("1017") ? false : stryMutAct_9fa48("1016") ? true : (stryCov_9fa48("1016", "1017", "1018"), locale === (stryMutAct_9fa48("1019") ? "" : (stryCov_9fa48("1019"), "he")))) ? stryMutAct_9fa48("1020") ? "" : (stryCov_9fa48("1020"), "rtl") : stryMutAct_9fa48("1021") ? "" : (stryCov_9fa48("1021"), "ltr")} className={(stryMutAct_9fa48("1024") ? locale !== "he" : stryMutAct_9fa48("1023") ? false : stryMutAct_9fa48("1022") ? true : (stryCov_9fa48("1022", "1023", "1024"), locale === (stryMutAct_9fa48("1025") ? "" : (stryCov_9fa48("1025"), "he")))) ? stryMutAct_9fa48("1026") ? "" : (stryCov_9fa48("1026"), "text-end") : stryMutAct_9fa48("1027") ? "" : (stryCov_9fa48("1027"), "text-start")}>
          <CommandEmpty>{t(stryMutAct_9fa48("1028") ? "" : (stryCov_9fa48("1028"), "empty"))}</CommandEmpty>

          <CommandGroup heading={t(stryMutAct_9fa48("1029") ? "" : (stryCov_9fa48("1029"), "navGroup"))}>
            {sections.map(stryMutAct_9fa48("1030") ? () => undefined : (stryCov_9fa48("1030"), item => <CommandItem key={item.href} value={item.label} onSelect={stryMutAct_9fa48("1031") ? () => undefined : (stryCov_9fa48("1031"), () => handleSelect(item.href))} className={stryMutAct_9fa48("1032") ? `` : (stryCov_9fa48("1032"), `flex items-center gap-3 ${(stryMutAct_9fa48("1035") ? locale !== "he" : stryMutAct_9fa48("1034") ? false : stryMutAct_9fa48("1033") ? true : (stryCov_9fa48("1033", "1034", "1035"), locale === (stryMutAct_9fa48("1036") ? "" : (stryCov_9fa48("1036"), "he")))) ? stryMutAct_9fa48("1037") ? "" : (stryCov_9fa48("1037"), "flex-row-reverse") : stryMutAct_9fa48("1038") ? "Stryker was here!" : (stryCov_9fa48("1038"), "")}`)}>
                <item.icon className="w-4 h-4 text-[#06d6e0]" />
                <div className={stryMutAct_9fa48("1039") ? `` : (stryCov_9fa48("1039"), `flex flex-col ${(stryMutAct_9fa48("1042") ? locale !== "he" : stryMutAct_9fa48("1041") ? false : stryMutAct_9fa48("1040") ? true : (stryCov_9fa48("1040", "1041", "1042"), locale === (stryMutAct_9fa48("1043") ? "" : (stryCov_9fa48("1043"), "he")))) ? stryMutAct_9fa48("1044") ? "" : (stryCov_9fa48("1044"), "items-end") : stryMutAct_9fa48("1045") ? "" : (stryCov_9fa48("1045"), "items-start")}`)}>
                  <span>{item.label}</span>
                  <span className="text-xs text-[hsl(215,20%,45%)]">{item.description}</span>
                </div>
              </CommandItem>))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading={t(stryMutAct_9fa48("1046") ? "" : (stryCov_9fa48("1046"), "linksGroup"))}>
            {links.map(stryMutAct_9fa48("1047") ? () => undefined : (stryCov_9fa48("1047"), item => <CommandItem key={item.href} value={item.label} onSelect={stryMutAct_9fa48("1048") ? () => undefined : (stryCov_9fa48("1048"), () => handleSelect(item.href))} className={stryMutAct_9fa48("1049") ? `` : (stryCov_9fa48("1049"), `flex items-center gap-3 ${(stryMutAct_9fa48("1052") ? locale !== "he" : stryMutAct_9fa48("1051") ? false : stryMutAct_9fa48("1050") ? true : (stryCov_9fa48("1050", "1051", "1052"), locale === (stryMutAct_9fa48("1053") ? "" : (stryCov_9fa48("1053"), "he")))) ? stryMutAct_9fa48("1054") ? "" : (stryCov_9fa48("1054"), "flex-row-reverse") : stryMutAct_9fa48("1055") ? "Stryker was here!" : (stryCov_9fa48("1055"), "")}`)}>
                <item.icon className="w-4 h-4 text-[#e84393]" />
                <span>{item.label}</span>
              </CommandItem>))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>;
  }
}