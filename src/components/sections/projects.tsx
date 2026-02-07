"use client";

import { useTranslations } from "next-intl";
import { motion } from "motion/react";
import type { Project } from "@/types";

const PROJECTS: Project[] = [
  {
    id: "mexicani",
    title: "Mexicani",
    description: "Franchise management system with AI-powered analytics and real-time tracking",
    image: "/images/projects/mexicani.png",
    techStack: ["Next.js", "Supabase", "TypeScript", "Tailwind"],
    liveUrl: "https://mexicani.app",
    githubUrl: "https://github.com/nadavcohen/mexicani",
    featured: true,
  },
  {
    id: "cash",
    title: "Cash",
    description: "Delivery tracking PWA with offline-first architecture and real-time updates",
    image: "/images/projects/cash.png",
    techStack: ["React", "Vite", "Supabase", "PWA"],
    liveUrl: "https://cash.app",
    featured: true,
  },
  {
    id: "shifts",
    title: "Shifts",
    description: "Shift management platform with automated scheduling and employee dashboard",
    image: "/images/projects/shifts.png",
    techStack: ["Next.js", "TypeScript", "Supabase"],
    featured: false,
  },
  {
    id: "hatumdigital",
    title: "Hatum Digital",
    description: "Order management system with real-time inventory tracking",
    image: "/images/projects/hatumdigital.png",
    techStack: ["React", "Vite", "TypeScript"],
    liveUrl: "https://hatumdigital.app",
    featured: false,
  },
];

export function Projects() {
  const t = useTranslations("Projects");

  return (
    <section id="projects" className="py-24">
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

        <div className="grid gap-6 sm:grid-cols-2">
          {PROJECTS.map((project, i) => (
            <motion.article
              key={project.id}
              className="group relative overflow-hidden rounded-2xl border border-border/50 bg-surface/50 p-6 transition-colors hover:border-primary/30"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              {project.featured && (
                <span className="absolute top-4 end-4 rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary">
                  {t("featured")}
                </span>
              )}

              <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-background/50">
                <span className="text-2xl font-bold text-muted/30">
                  {project.title}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="mt-2 text-sm text-muted">{project.description}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-md bg-background px-2 py-1 text-xs text-muted"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="mt-4 flex gap-3">
                {project.liveUrl && (
                  <a
                    href={project.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {t("viewLive")} →
                  </a>
                )}
                {project.githubUrl && (
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted hover:text-foreground"
                  >
                    {t("viewCode")}
                  </a>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
