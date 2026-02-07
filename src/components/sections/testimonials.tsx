"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";

const TESTIMONIAL_IDS = [0, 1, 2];

export function Testimonials() {
  const t = useTranslations("Testimonials");

  const items = TESTIMONIAL_IDS.map((i) => ({
    quote: t(`items.${i}.quote`),
    name: t(`items.${i}.name`),
    title: t(`items.${i}.title`),
  }));

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
        items={items}
        direction="left"
        speed="slow"
        pauseOnHover
      />
    </section>
  );
}
