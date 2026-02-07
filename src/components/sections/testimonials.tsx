"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const TESTIMONIALS = [
  {
    quote:
      "Nadav's AI automation saved us 20 hours per week. His understanding of both AI and practical business needs is rare.",
    name: "David Levy",
    title: "CTO, TechStartup IL",
  },
  {
    quote:
      "The app Nadav built completely transformed our workflow. Fast delivery and outstanding quality.",
    name: "Sarah Cohen",
    title: "Product Manager, FinTech Co",
  },
  {
    quote:
      "Working with Nadav was a game-changer. He brought AI solutions we didn't even know were possible.",
    name: "Amit Ben-David",
    title: "Founder, E-Commerce Plus",
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
      </div>

      {/* Aceternity InfiniteMovingCards */}
      <InfiniteMovingCards
        items={TESTIMONIALS}
        direction="left"
        speed="slow"
        pauseOnHover
      />
    </section>
  );
}
