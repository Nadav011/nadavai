"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";

const VIDEOS = [
  { id: "video1", category: "tutorials", publishedAt: "2026-01-20" },
  { id: "video2", category: "ai", publishedAt: "2026-01-12" },
  { id: "video3", category: "tutorials", publishedAt: "2026-01-05" },
];

export function YouTube() {
  const t = useTranslations("YouTube");

  return (
    <section className="bg-surface/30 py-24">
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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {VIDEOS.map((video, i) => (
            <motion.div
              key={video.id}
              className="group cursor-pointer overflow-hidden rounded-2xl border border-border/50 bg-background/50 transition-colors hover:border-primary/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="flex aspect-video items-center justify-center bg-surface">
                <span className="text-4xl">▶</span>
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
                  {t(`videos.${video.id}.title`)}
                </h3>
                <p dir="ltr" className="mt-1 text-xs text-muted">
                  {video.publishedAt}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
