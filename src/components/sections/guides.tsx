"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { BackgroundBeams } from "@/components/ui/background-beams";

const GUIDES = [
  {
    id: "1",
    title: "Building Your First AI Agent",
    difficulty: "beginner" as const,
    readingTime: 15,
  },
  {
    id: "2",
    title: "Next.js 16 App Router Deep Dive",
    difficulty: "intermediate" as const,
    readingTime: 25,
  },
  {
    id: "3",
    title: "Advanced RAG Patterns for Production",
    difficulty: "advanced" as const,
    readingTime: 30,
  },
];

const DIFFICULTY_COLORS = {
  beginner: "bg-green-500/10 text-green-400",
  intermediate: "bg-secondary/10 text-secondary",
  advanced: "bg-destructive/10 text-destructive",
} as const;

export function Guides() {
  const t = useTranslations("Guides");

  return (
    <section className="relative overflow-hidden bg-surface/30 py-24">
      {/* Aceternity BackgroundBeams decoration */}
      <BackgroundBeams className="opacity-30" />

      <div className="relative mx-auto max-w-6xl px-6">
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

        <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide, i) => (
            <motion.article
              key={guide.id}
              className="group rounded-2xl border border-border/50 bg-background/50 p-6 backdrop-blur-sm transition-colors hover:border-primary/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="mb-3 flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-xs ${DIFFICULTY_COLORS[guide.difficulty]}`}>
                  {t(`difficulty.${guide.difficulty}`)}
                </span>
                <span dir="ltr" className="text-xs text-muted">
                  {guide.readingTime} {t("minRead")}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {guide.title}
              </h3>
              <a
                href={`/guides/${guide.id}`}
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                {t("readGuide")} →
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
