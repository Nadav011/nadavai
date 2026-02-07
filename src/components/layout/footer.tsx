"use client";

import { useTranslations, useLocale } from "next-intl";
import { Github, Linkedin, Youtube, Facebook } from "lucide-react";

const ICON_MAP = { github: Github, linkedin: Linkedin, youtube: Youtube, facebook: Facebook } as const;

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/nadavcohen", icon: "github" as const },
  { label: "LinkedIn", href: "https://linkedin.com/in/nadavcohen", icon: "linkedin" as const },
  { label: "YouTube", href: "https://youtube.com/@nadavcohen", icon: "youtube" as const },
  { label: "Facebook", href: "https://facebook.com/nadavcohen", icon: "facebook" as const },
];

export function Footer() {
  const t = useTranslations("Footer");
  const tNav = useTranslations("Nav");
  const locale = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-surface">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <a href={`/${locale}`} className="flex items-center gap-1 text-lg font-bold">
              <span className="text-foreground">NADAV</span>
              <span className="text-primary">AI</span>
            </a>
            <p className="mt-3 text-sm text-muted">{t("tagline")}</p>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("sections.navigation")}
            </h3>
            <ul className="space-y-2">
              {(["about", "projects", "blog", "services", "contact"] as const).map(
                (key) => (
                  <li key={key}>
                    <a
                      href={`#${key}`}
                      className="text-sm text-muted transition-colors hover:text-primary"
                    >
                      {tNav(key)}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("sections.social")}
            </h3>
            <ul className="space-y-2">
              {SOCIAL_LINKS.map((link) => {
                const Icon = ICON_MAP[link.icon];
                return (
                  <li key={link.icon}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-primary"
                    >
                      <Icon className="h-4 w-4" />
                      {link.label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {t("sections.legal")}
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href={`/${locale}/privacy`}
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  {t("links.privacy")}
                </a>
              </li>
              <li>
                <a
                  href={`/${locale}/terms`}
                  className="text-sm text-muted transition-colors hover:text-primary"
                >
                  {t("links.terms")}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 border-t border-border/50 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-muted">
            &copy; {year} NADAVAI. {t("rights")}
          </p>
          <p className="text-xs text-muted">{t("builtWith")}</p>
        </div>
      </div>
    </footer>
  );
}
