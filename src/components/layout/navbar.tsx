"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useTheme } from "next-themes";
import { useRouter, usePathname } from "next/navigation";
import { Sun, Moon, Menu, X, Command } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { key: "about", href: "#about" },
  { key: "projects", href: "#projects" },
  { key: "blog", href: "#blog" },
  { key: "services", href: "#services" },
  { key: "contact", href: "#contact" },
] as const;

export function Navbar() {
  const t = useTranslations("Nav");
  const locale = useLocale();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const switchLocale = () => {
    const newLocale = locale === "he" ? "en" : "he";
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  return (
    <header
      className={cn(
        "fixed top-4 inset-x-0 z-50 mx-auto max-w-5xl transition-all duration-300",
        "rounded-2xl border border-border/50 px-6 py-3",
        scrolled
          ? "bg-background/80 shadow-lg shadow-primary/5 backdrop-blur-xl"
          : "bg-background/40 backdrop-blur-md"
      )}
    >
      <nav className="flex items-center justify-between" aria-label={t("navigation")}>
        <a href={`/${locale}`} className="flex min-h-11 items-center gap-1 text-lg font-bold">
          <span className="text-foreground">NADAV</span>
          <span className="text-primary">AI</span>
        </a>

        <ul className="hidden items-center gap-6 md:flex">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                className="min-h-11 inline-flex items-center text-sm text-muted transition-colors hover:text-foreground"
              >
                {t(item.key)}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              document.dispatchEvent(
                new KeyboardEvent("keydown", { key: "k", metaKey: true })
              );
            }}
            className="hidden min-h-11 items-center gap-1.5 rounded-lg border border-border/50 px-2.5 text-xs text-muted transition-colors hover:text-foreground md:flex"
            aria-label="Search"
          >
            <Command className="h-3 w-3" />
            <span>K</span>
          </button>

          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground"
            aria-label={t("toggleTheme")}
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={switchLocale}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg px-2 text-sm font-medium text-muted transition-colors hover:text-foreground"
            aria-label={t("toggleLocale")}
          >
            {t("toggleLocale")}
          </button>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex min-h-11 min-w-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-foreground md:hidden"
            aria-label={t("menu")}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <ul className="mt-4 flex flex-col gap-3 border-t border-border/50 pt-4 md:hidden">
          {NAV_ITEMS.map((item) => (
            <li key={item.key}>
              <a
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="block min-h-11 py-3 text-sm text-muted transition-colors hover:text-foreground"
              >
                {t(item.key)}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
