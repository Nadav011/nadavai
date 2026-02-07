"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";

const STATS = [
  { key: "projects", value: "10+" },
  { key: "years", value: "5+" },
  { key: "clients", value: "30+" },
] as const;

export function Hero() {
  const t = useTranslations("Hero");

  return (
    <section
      id="about"
      className="relative flex min-h-screen items-center overflow-hidden pt-24 pb-16"
    >
      {/* Spotlight gradient background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 start-1/2 h-[600px] w-[600px] -translate-x-1/2 rtl:translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-1/4 end-0 h-[400px] w-[400px] rounded-full bg-accent/10 blur-[100px]" />
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-8 px-6 lg:grid-cols-2 lg:gap-12">
        {/* Text content */}
        <motion.div
          className="flex flex-col justify-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <p className="text-sm font-medium text-primary">{t("greeting")}</p>
          <h1 className="mt-2 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            {t("name")}
          </h1>
          <p className="mt-3 text-xl text-muted sm:text-2xl">{t("role")}</p>
          <p className="mt-4 max-w-md text-lg text-muted/80">{t("tagline")}</p>

          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#contact"
              className="inline-flex min-h-11 items-center rounded-xl bg-primary px-6 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
            >
              {t("cta")}
            </a>
            <a
              href="#projects"
              className="inline-flex min-h-11 items-center rounded-xl border border-border px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            >
              {t("secondary")}
            </a>
          </div>
        </motion.div>

        {/* Stats bento grid */}
        <motion.div
          className="grid grid-cols-2 gap-4 self-center sm:grid-cols-3"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        >
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.key}
              className="flex flex-col items-center justify-center rounded-2xl border border-border/50 bg-surface/50 p-6 backdrop-blur-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            >
              <span dir="ltr" className="text-3xl font-bold text-primary">
                {stat.value}
              </span>
              <span className="mt-1 text-xs text-muted">{t(stat.key)}</span>
            </motion.div>
          ))}

          {/* Photo placeholder */}
          <div className="col-span-2 flex items-center justify-center rounded-2xl border border-border/50 bg-surface/50 p-8 backdrop-blur-sm sm:col-span-3 lg:col-span-2">
            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/20">
              <span className="text-4xl font-bold text-primary">NC</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
