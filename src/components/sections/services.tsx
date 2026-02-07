"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";

const TIERS = [
  { key: "discovery", price: null, highlighted: false },
  { key: "consultation", price: "₪1,500", highlighted: false },
  { key: "fullBuild", price: "₪30,000", highlighted: true },
  { key: "enterprise", price: null, highlighted: false },
] as const;

export function Services() {
  const t = useTranslations("Services");

  return (
    <section id="services" className="bg-surface/30 py-24">
      <div className="mx-auto max-w-6xl px-6">
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-3 text-muted">{t("subtitle")}</p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {TIERS.map((tier, i) => (
            <motion.div
              key={tier.key}
              className={`relative flex flex-col rounded-2xl border p-6 ${
                tier.highlighted
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border/50 bg-surface/50"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {tier.highlighted && (
                <span className="absolute -top-3 start-1/2 -translate-x-1/2 rtl:translate-x-1/2 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  {t("popular")}
                </span>
              )}

              <h3 className="text-lg font-semibold text-foreground">
                {t(`tiers.${tier.key}.title`)}
              </h3>

              <div className="mt-3">
                {tier.price ? (
                  <p className="text-sm text-muted">
                    {t("startingAt")}{" "}
                    <span dir="ltr" className="text-2xl font-bold text-foreground">
                      {tier.price}
                    </span>
                  </p>
                ) : (
                  <p className="text-2xl font-bold text-primary">
                    {tier.key === "discovery" ? t("free") : t("contactUs")}
                  </p>
                )}
              </div>

              <p className="mt-3 flex-1 text-sm text-muted">
                {t(`tiers.${tier.key}.description`)}
              </p>

              <ul className="mt-4 space-y-2">
                {(
                  t.raw(`tiers.${tier.key}.features`) as string[]
                ).map((feature: string, fi: number) => (
                  <li
                    key={fi}
                    className="flex items-start gap-2 text-sm text-muted"
                  >
                    <span className="mt-0.5 text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                href="#contact"
                className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-xl text-sm font-medium transition-transform hover:scale-105 ${
                  tier.highlighted
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-foreground hover:bg-surface"
                }`}
              >
                {tier.price ? t("bookCall") : t("contactUs")}
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
