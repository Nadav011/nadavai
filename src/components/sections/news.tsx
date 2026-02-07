"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";

const NEWS_ITEMS = [
  {
    id: "1",
    title: "OpenAI Releases GPT-5 with Reasoning Capabilities",
    date: "2026-02-01",
    category: "AI",
  },
  {
    id: "2",
    title: "Next.js 16 Introduces Cache Components",
    date: "2026-01-28",
    category: "Development",
  },
  {
    id: "3",
    title: "GSAP Goes Fully Free After Webflow Acquisition",
    date: "2026-01-20",
    category: "Tools",
  },
];

export function News() {
  const t = useTranslations("News");

  return (
    <section className="py-24">
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

        <div className="space-y-4">
          {NEWS_ITEMS.map((item, i) => (
            <motion.article
              key={item.id}
              className="flex items-center gap-4 rounded-xl border border-border/50 bg-surface/50 p-4 transition-colors hover:border-primary/30"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <span className="shrink-0 rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {item.category}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-sm font-medium text-foreground">
                  {item.title}
                </h3>
              </div>
              <time dir="ltr" className="shrink-0 text-xs text-muted">
                {item.date}
              </time>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
