"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";

const REPOS = [
  { name: "ai-skills", description: "Collection of AI agent skills and prompts", stars: 120, forks: 25 },
  { name: "ai-agents", description: "Production-ready AI agent framework", stars: 85, forks: 18 },
  { name: "nextjs-starter", description: "RTL-first Next.js starter with AI integration", stars: 45, forks: 12 },
];

export function Resources() {
  const t = useTranslations("Resources");

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

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {REPOS.map((repo, i) => (
            <motion.div
              key={repo.name}
              className="group rounded-2xl border border-border/50 bg-surface/50 p-6 transition-colors hover:border-primary/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <h3 className="text-lg font-semibold text-foreground font-mono">
                {repo.name}
              </h3>
              <p className="mt-2 text-sm text-muted">{repo.description}</p>

              <div className="mt-4 flex gap-4">
                <span className="flex items-center gap-1 text-sm text-muted" dir="ltr">
                  ⭐ {repo.stars} {t("stars")}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted" dir="ltr">
                  🍴 {repo.forks} {t("forks")}
                </span>
              </div>

              <a
                href={`https://github.com/nadavcohen/${repo.name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                {t("viewRepo")} →
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
