"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { BlogPost } from "@/types";

const POSTS: BlogPost[] = [
  {
    id: "1",
    title: "How I Built a Full App with AI in 48 Hours",
    excerpt: "A deep dive into using AI tools to build production-ready apps at record speed.",
    category: "ai",
    readingTime: 8,
    date: "2026-01-15",
  },
  {
    id: "2",
    title: "The Future of AI-First Development",
    excerpt: "Why every developer should be thinking AI-first in 2026.",
    category: "development",
    readingTime: 5,
    date: "2026-01-10",
  },
  {
    id: "3",
    title: "Next.js 16: Everything You Need to Know",
    excerpt: "A comprehensive guide to the latest features in Next.js 16.",
    category: "tutorials",
    readingTime: 12,
    date: "2026-01-05",
  },
];

export function Blog() {
  const t = useTranslations("Blog");

  return (
    <section id="blog" className="py-24">
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
          {POSTS.map((post, i) => (
            <motion.article
              key={post.id}
              className="group rounded-2xl border border-border/50 bg-surface/50 p-6 transition-colors hover:border-primary/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="mb-3 flex items-center gap-3 text-xs text-muted">
                <span className="rounded-full bg-primary/10 px-2 py-0.5 text-primary">
                  {t(`categories.${post.category}`)}
                </span>
                <span dir="ltr">{post.readingTime} {t("minRead")}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                {post.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
              <a
                href={`/blog/${post.id}`}
                className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
              >
                {t("readMore")} →
              </a>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
