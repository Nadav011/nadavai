"use client"

import React, { useState } from "react"
import { ExternalLink, Github, Star, ArrowDown, Globe, Cpu, Layers, Clock, Shield } from "lucide-react"
import { useTranslations } from "next-intl"
import { ScrollReveal } from "./scroll-reveal"
import { SectionHeader } from "./section-header"
import { TiltCard } from "./tilt-card"





export function Projects() {
  const t = useTranslations("projects")
  const [activeProject, setActiveProject] = useState<number | null>(null)

  const projects = [
    {
      title: "Mexicani",
      description: t("p1"),
      tech: ["React", "TypeScript", "Supabase", "TanStack Query", "Tailwind"],
      category: "Enterprise",
      icon: Layers,
      status: "production",
      statusColor: "#27ca40",
      stars: 0,
      featured: true,
      color: "#06d6e0",
      metrics: { pages: "149", tables: "111" },
      github: "https://github.com/Nadav011/Mexicani",
      demo: "",
    },
    {
      title: "Cash",
      description: t("p2"),
      tech: ["React", "TypeScript", "Supabase", "PWA", "Capacitor"],
      category: "PWA",
      icon: Globe,
      status: "production",
      statusColor: "#27ca40",
      stars: 0,
      featured: true,
      color: "#e84393",
      metrics: { offline: "100%", sync: "Real-time" },
      github: "https://github.com/Nadav011/cash",
      demo: "https://cash-ashy-zeta.vercel.app",
    },
    {
      title: "Shifts",
      description: t("p3"),
      tech: ["React", "TypeScript", "Supabase", "DnD Kit", "Framer Motion"],
      category: "SaaS",
      icon: Clock,
      status: "beta",
      statusColor: "#ffbd2e",
      stars: 0,
      featured: false,
      color: "#4f46e5",
      metrics: { components: "154", hooks: "25" },
      github: "https://github.com/Nadav011/mexicani-shifts",
      demo: "",
    },
    {
      title: "hatumdigital",
      description: t("p4"),
      tech: ["React", "TypeScript", "Supabase", "Capacitor", "Zod"],
      category: "Mobile App",
      icon: Cpu,
      status: "production",
      statusColor: "#27ca40",
      stars: 0,
      featured: false,
      color: "#06d6e0",
      metrics: { platform: "iOS", patterns: "Clean" },
      github: "https://github.com/Nadav011/hatumdigital",
      demo: "",
    },
    {
      title: "Z",
      description: t("p5"),
      tech: ["React", "TypeScript", "Supabase", "PWA", "Workbox"],
      category: "PWA",
      icon: Cpu,
      status: "production",
      statusColor: "#27ca40",
      stars: 0,
      featured: false,
      color: "#e84393",
      metrics: { offline: "100%", currency: "ILS" },
      github: "https://github.com/Nadav011/Z",
      demo: "",
    },
    {
      title: "SportChat",
      description: t("p6"),
      tech: ["Flutter", "Dart", "Supabase", "Riverpod"],
      category: "Mobile",
      icon: Globe,
      status: "beta",
      statusColor: "#ffbd2e",
      stars: 0,
      featured: false,
      color: "#4f46e5",
      metrics: { modules: "28", arch: "Clean" },
      github: "",
      demo: "",
    },
    {
      title: "APEX Engine",
      description: t("p7"),
      tech: ["TypeScript", "Bun", "Claude Code", "AST"],
      category: "Dev Tool",
      icon: Shield,
      status: "production",
      statusColor: "#27ca40",
      stars: 0,
      featured: true,
      color: "#4f46e5",
      metrics: { gates: "579", matrix: "10x7" },
      github: "https://github.com/Nadav011",
      demo: "",
    },
    {
      title: "FinanceApp",
      description: t("p8"),
      tech: ["React Native", "Expo", "TypeScript", "Tamagui"],
      category: "Finance",
      icon: Cpu,
      status: "beta",
      statusColor: "#ffbd2e",
      stars: 0,
      featured: false,
      color: "#06d6e0",
      metrics: { platform: "iOS/Android", lang: "Hebrew" },
      github: "https://github.com/Nadav011/israeli-finance-app",
      demo: "",
    },
  ]

  const statusLabels: Record<string, string> = {
    production: "PRODUCTION",
    live: "LIVE",
    featured: "FEATURED",
    stable: "STABLE",
    beta: "BETA",
    popular: "POPULAR",
  }

  return (
    <section id="projects" aria-label="פרויקטים" className="relative py-24 md:py-32">
      <div className="absolute inset-0 dot-grid-subtle opacity-[0.15] pointer-events-none" aria-hidden="true" />
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <SectionHeader
          badge={t("badge")}
          title={t("title")}
          highlight={t("highlight")}
          description={t("description")}
        />

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project, i) => (
            <ScrollReveal key={i} delay={i * 80} direction={i % 2 === 0 ? "right" : "left"}>
              <TiltCard className={project.featured ? "md:row-span-1" : ""}>
                <div
                  className="group relative h-full rounded-2xl border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] overflow-hidden transition-all duration-700 hover:border-opacity-50"
                  onMouseEnter={() => setActiveProject(i)}
                  onMouseLeave={() => setActiveProject(null)}
                  style={{
                    borderColor: activeProject === i ? `${project.color}30` : undefined,
                    boxShadow: activeProject === i ? `0 0 40px ${project.color}08` : undefined,
                  }}
                >
                  {/* Top accent line */}
                  <div
                    className="absolute top-0 inset-x-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: `linear-gradient(to right, transparent, ${project.color}, transparent)` }}
                  />

                  <div className="p-6">
                    {/* Header row */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
                          style={{
                            background: `${project.color}10`,
                            border: `1px solid ${project.color}20`,
                          }}
                        >
                          <project.icon className="w-5 h-5" style={{ color: project.color }} />
                        </div>
                        <div>
                          <span className="text-[10px] font-mono tracking-wider uppercase text-[hsl(215,20%,45%)]">
                            {project.category}
                          </span>
                        </div>
                      </div>

                      {/* Status badge */}
                      <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${project.statusColor}12`, border: `1px solid ${project.statusColor}25` }}>
                        <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: project.statusColor }} />
                        <span className="text-[10px] font-mono font-semibold" style={{ color: project.statusColor }}>
                          {statusLabels[project.status]}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-bold text-[hsl(210,40%,98%)] mb-2 group-hover:text-[hsl(210,40%,100%)] transition-colors">
                      {project.title}
                    </h3>

                    {/* Description */}
                    <p className="text-sm text-[hsl(215,20%,55%)] leading-relaxed mb-5">{project.description}</p>

                    {/* Metrics */}
                    <div className="flex items-center gap-4 mb-5">
                      {Object.entries(project.metrics).map(([key, val]) => (
                        <div key={key} className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-[hsl(210,40%,98%)]">{val}</span>
                          <span className="text-[10px] font-mono text-[hsl(215,20%,40%)] uppercase">{key}</span>
                        </div>
                      ))}
                    </div>

                    {/* Tech stack */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.tech.map((t) => (
                        <span
                          key={t}
                          className="text-[11px] font-mono px-2.5 py-1 rounded-md bg-[hsl(215,28%,10%)] text-[hsl(215,20%,55%)] border border-[hsl(215,28%,16%)] group-hover:border-[hsl(215,28%,20%)] transition-colors"
                        >
                          {t}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-[hsl(215,28%,12%)]">
                      <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="text-sm font-mono font-semibold text-[hsl(210,40%,98%)]">AI Built</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-[hsl(215,28%,12%)] text-[hsl(215,20%,45%)] hover:text-[hsl(210,40%,98%)] transition-all" aria-label="GitHub">
                            <Github className="w-4 h-4" />
                          </a>
                        )}
                        {project.demo && (
                          <a
                            href={project.demo}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-300"
                            style={{
                              background: `${project.color}10`,
                              color: project.color,
                              border: `1px solid ${project.color}20`,
                            }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = `${project.color}20` }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = `${project.color}10` }}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Demo
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Background hover glow */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
                    style={{
                      background: `radial-gradient(ellipse at top, ${project.color}06, transparent 70%)`,
                    }}
                  />
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>

        {/* View more CTA */}
        <ScrollReveal delay={300}>
          <div className="flex justify-center mt-12">
            <a href="https://github.com/Nadav011" target="_blank" rel="noreferrer" className="group flex items-center gap-2 px-6 py-3 rounded-xl border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,6%)] text-sm font-medium text-[hsl(215,20%,65%)] hover:text-[#06d6e0] hover:border-[#06d6e0]/30 transition-all duration-500">
              {t("viewMore")}
              <ArrowDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
            </a>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
