"use client";

import { useEffect, useState, useCallback } from "react";
import { Command } from "cmdk";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("CommandPalette");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runAction = useCallback(
    (action: string) => {
      setOpen(false);
      switch (action) {
        case "theme":
          setTheme(theme === "dark" ? "light" : "dark");
          break;
        case "language": {
          const newLocale = locale === "he" ? "en" : "he";
          router.push(pathname.replace(`/${locale}`, `/${newLocale}`));
          break;
        }
        case "top":
          window.scrollTo({ top: 0, behavior: "smooth" });
          break;
        default:
          if (action.startsWith("#")) {
            document.querySelector(action)?.scrollIntoView({ behavior: "smooth" });
          }
      }
    },
    [setTheme, theme, locale, router, pathname]
  );

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label={t("placeholder")} onClick={() => setOpen(false)}>
      <div className="fixed inset-0 bg-background/80 backdrop-blur-sm" />
      <div className="fixed inset-x-0 top-[20%] mx-auto max-w-lg px-4">
        <Command
          className="rounded-xl border border-border bg-surface shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <Command.Input
            placeholder={t("placeholder")}
            className="w-full border-b border-border bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted"
          />
          <Command.List className="max-h-72 overflow-y-auto p-2">
            <Command.Empty className="px-4 py-6 text-center text-sm text-muted">
              {t("noResults")}
            </Command.Empty>

            <Command.Group
              heading={t("groups.pages")}
              className="px-2 py-1.5 text-xs font-semibold text-muted"
            >
              {(["about", "projects", "blog", "services", "contact"] as const).map(
                (key) => (
                  <Command.Item
                    key={key}
                    value={tNav(key)}
                    onSelect={() => runAction(`#${key}`)}
                    className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground aria-selected:bg-primary/10"
                  >
                    {tNav(key)}
                  </Command.Item>
                )
              )}
            </Command.Group>

            <Command.Group
              heading={t("groups.actions")}
              className="px-2 py-1.5 text-xs font-semibold text-muted"
            >
              <Command.Item
                value={t("actions.toggleTheme")}
                onSelect={() => runAction("theme")}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground aria-selected:bg-primary/10"
              >
                {t("actions.toggleTheme")}
              </Command.Item>
              <Command.Item
                value={t("actions.switchLanguage")}
                onSelect={() => runAction("language")}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground aria-selected:bg-primary/10"
              >
                {t("actions.switchLanguage")}
              </Command.Item>
              <Command.Item
                value={t("actions.goToTop")}
                onSelect={() => runAction("top")}
                className="cursor-pointer rounded-lg px-3 py-2 text-sm text-foreground aria-selected:bg-primary/10"
              >
                {t("actions.goToTop")}
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
