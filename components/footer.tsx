"use client"

import { Zap } from "lucide-react"

const footerLinks = [
  {
    title: "ניווט",
    links: [
      { label: "פרויקטים", href: "#projects" },
      { label: "שירותים", href: "#services" },
      { label: "מדריכים", href: "#guides" },
      { label: "משאבים", href: "#resources" },
    ],
  },
  {
    title: "תוכן",
    links: [
      { label: "חדשות", href: "#news" },
      { label: "מדריכי וידאו", href: "#guides" },
      { label: "ריפוזיטוריז", href: "#resources" },
      { label: "צור קשר", href: "#contact" },
    ],
  },
  {
    title: "סושיאל",
    links: [
      { label: "GitHub", href: "https://github.com/Nadav011" },
      { label: "Facebook", href: "#" },
      { label: "YouTube", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-[hsl(215,28%,16%)] bg-[hsl(222,47%,3%)]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Main footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4">
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-[#06d6e0] to-[#e84393] p-[1px]">
                <div className="flex items-center justify-center w-full h-full rounded-[6px] bg-[hsl(222,47%,3%)]">
                  <Zap className="w-4 h-4 text-[#06d6e0]" />
                </div>
              </div>
              <span className="text-lg font-bold text-[hsl(210,40%,98%)]">NADAV<span className="text-gradient">.AI</span></span>
            </a>
            <p className="text-sm text-[hsl(215,20%,45%)] leading-relaxed mb-4">
              {"בונה את העתיד עם AI. כל פרויקט, כל שורת קוד, כל פיקסל - מופעל על ידי בינה מלאכותית."}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#27ca40] animate-pulse" />
              <span className="text-xs font-mono text-[hsl(215,20%,40%)]">{"זמין לפרויקטים"}</span>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-4">{group.title}</h4>
              <div className="flex flex-col gap-2.5">
                {group.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    {...(link.href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
                    className="text-sm text-[hsl(215,20%,50%)] hover:text-[#06d6e0] transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-[hsl(215,28%,14%)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 font-mono text-xs text-[hsl(215,20%,35%)]">
            <span>{">"}</span>
            <span>NADAV.AI</span>
            <span className="text-[hsl(215,20%,25%)]">|</span>
            <span>2026</span>
            <span className="text-[hsl(215,20%,25%)]">|</span>
            <span>{"Built with AI"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-[hsl(215,20%,35%)]">
            <span className="font-mono">{"powered by"}</span>
            <span className="text-gradient font-mono font-semibold">{"artificial intelligence"}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
