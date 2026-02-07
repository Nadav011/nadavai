"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { Testimonial } from "@/types";

const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    name: "David Levy",
    role: "CTO",
    company: "TechStartup IL",
    content: "Nadav's AI automation saved us 20 hours per week. His understanding of both AI and practical business needs is rare.",
    metric: "20 hrs/week saved",
  },
  {
    id: "2",
    name: "Sarah Cohen",
    role: "Product Manager",
    company: "FinTech Co",
    content: "The app Nadav built completely transformed our workflow. Fast delivery and outstanding quality.",
    metric: "3x faster workflows",
  },
  {
    id: "3",
    name: "Amit Ben-David",
    role: "Founder",
    company: "E-Commerce Plus",
    content: "Working with Nadav was a game-changer. He brought AI solutions we didn't even know were possible.",
    metric: "40% cost reduction",
  },
];

export function Testimonials() {
  const t = useTranslations("Testimonials");

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
          {TESTIMONIALS.map((testimonial, i) => (
            <motion.blockquote
              key={testimonial.id}
              className="flex flex-col rounded-2xl border border-border/50 bg-background/50 p-6"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {testimonial.metric && (
                <span className="mb-3 inline-flex self-start rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  {testimonial.metric}
                </span>
              )}
              <p className="flex-1 text-sm text-muted italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>
              <footer className="mt-4 border-t border-border/50 pt-4">
                <p className="text-sm font-semibold text-foreground">
                  {testimonial.name}
                </p>
                <p className="text-xs text-muted">
                  {testimonial.role}, {testimonial.company}
                </p>
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
