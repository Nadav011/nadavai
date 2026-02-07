"use client";

import { useTranslations } from "next-intl";

const COMPANIES = [
  "Company 1",
  "Company 2",
  "Company 3",
  "Company 4",
  "Company 5",
  "Company 6",
  "Company 7",
  "Company 8",
];

export function CompaniesMarquee() {
  const t = useTranslations("Companies");

  return (
    <section className="overflow-hidden border-y border-border/50 py-12">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted">
          {t("title")}
        </h2>
      </div>

      {/* Infinite scroll marquee */}
      <div className="relative">
        <div className="pointer-events-none absolute inset-y-0 start-0 z-10 w-24 bg-gradient-to-r from-background to-transparent rtl:bg-gradient-to-l" />
        <div className="pointer-events-none absolute inset-y-0 end-0 z-10 w-24 bg-gradient-to-l from-background to-transparent rtl:bg-gradient-to-r" />

        <div className="flex animate-[marquee_30s_linear_infinite] gap-12">
          {[...COMPANIES, ...COMPANIES].map((company, i) => (
            <div
              key={`${company}-${i}`}
              className="flex h-12 shrink-0 items-center justify-center rounded-lg border border-border/30 bg-surface/30 px-8 text-sm font-medium text-muted"
            >
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
