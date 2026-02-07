"use client"

import { useState } from "react"
import { Zap, Send } from "lucide-react"

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
      { label: "Facebook", href: "https://www.facebook.com/nadav.cohen.167" },
    ],
  },
]

function NewsletterForm() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setStatus("success")
        setEmail("")
      } else {
        setStatus("error")
      }
    } catch {
      setStatus("error")
    }
  }

  return (
    <div className="py-8 border-t border-[hsl(215,28%,14%)]">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <h4 className="text-sm font-semibold text-[hsl(210,40%,98%)] mb-1">
            {"הישארו מעודכנים"}
          </h4>
          <p className="text-xs text-[hsl(215,20%,45%)]">
            {"טיפים, מדריכים וחדשות AI ישירות למייל"}
          </p>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="email"
              dir="ltr"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setStatus("idle") }}
              placeholder="your@email.com"
              className="w-full h-11 px-4 rounded-lg bg-[hsl(222,47%,6%)] border border-[hsl(215,28%,16%)] text-sm text-[hsl(210,40%,98%)] placeholder:text-[hsl(215,20%,35%)] focus:outline-none focus:border-[#06d6e0]/50 transition-colors"
              required
            />
          </div>
          <button
            type="submit"
            className="h-11 px-5 rounded-lg bg-gradient-to-l from-[#06d6e0] to-[#0abfca] text-[hsl(222,47%,4%)] text-sm font-bold flex items-center gap-2 hover:shadow-[0_0_20px_hsl(187,92%,55%,0.3)] transition-shadow"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{"הרשמה"}</span>
          </button>
        </form>
      </div>
      {status === "success" && (
        <p className="mt-3 text-xs text-[#06d6e0]">{"תודה! נוסף/ה בהצלחה לרשימת התפוצה"}</p>
      )}
      {status === "error" && (
        <p className="mt-3 text-xs text-[#e84393]">{"שגיאה, נסו שוב מאוחר יותר"}</p>
      )}
    </div>
  )
}

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

        {/* Newsletter */}
        <NewsletterForm />

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
