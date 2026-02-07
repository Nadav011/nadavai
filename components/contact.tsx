"use client"

import { Send, Mail, MessageSquare, Zap, Phone } from "lucide-react"
import { ScrollReveal } from "./scroll-reveal"
import { Magnetic } from "./magnetic"

export function Contact() {
  return (
    <section id="contact" className="relative py-24 md:py-32 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 w-[800px] h-[400px] bg-[#06d6e0]/5 rounded-full blur-[120px]" style={{ left: "50%", transform: "translateX(-50%)" }} />

      <div className="relative max-w-4xl mx-auto px-4 md:px-8 text-center">
        <ScrollReveal>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#e84393]/20 bg-[#e84393]/5 mb-6">
            <Zap className="w-3.5 h-3.5 text-[#e84393]" />
            <span className="text-xs font-mono text-[#e84393] tracking-wider uppercase">{"בוא נעשה משהו מטורף"}</span>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={100}>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-[hsl(210,40%,98%)] mb-6 leading-[1.1]">
            {"יש לך רעיון?"}
            <br />
            <span className="text-gradient-animated">{"בוא נבנה אותו."}</span>
          </h2>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <p className="text-lg text-[hsl(215,20%,55%)] max-w-xl mx-auto mb-10 leading-relaxed">
            {"לא משנה אם זה MVP קטן או מערכת enterprise - אם זה כרוך ב-AI ו-code, אני יכול לבנות את זה. מהר."}
          </p>
        </ScrollReveal>

        {/* Terminal-style contact box */}
        <ScrollReveal delay={300}>
          <div className="relative mx-auto max-w-2xl rounded-xl overflow-hidden border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)]">
            {/* Terminal header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[hsl(215,28%,16%)] bg-[hsl(222,47%,6%)]">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
              </div>
              <span className="text-xs font-mono text-[hsl(215,20%,40%)]">contact.sh</span>
              <div className="w-12" />
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 space-y-4 text-end">
              <div className="flex items-center gap-3 font-mono text-sm">
                <span className="text-[#06d6e0]">$</span>
                <span className="text-[hsl(215,20%,60%)]">echo</span>
                <span className="text-[#e84393]">{'"איך ליצור קשר"'}</span>
              </div>

              <div className="space-y-3 me-6">
                {/* WhatsApp - Primary CTA */}
                <a
                  href="https://wa.me/972504401760"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-[#27ca40]/30 bg-[#27ca40]/5 hover:border-[#27ca40]/50 hover:bg-[#27ca40]/10 transition-all group"
                >
                  <Phone className="w-5 h-5 text-[#27ca40]" />
                  <div className="text-end">
                    <div className="text-sm font-medium text-[hsl(210,40%,98%)]">{"WhatsApp"}</div>
                    <div className="text-xs text-[#27ca40]">{"הכי מהיר - תגובה תוך דקות"}</div>
                  </div>
                </a>

                <a
                  href="mailto:hello@nadavc.ai"
                  className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(215,28%,14%)] bg-[hsl(222,47%,4%)] hover:border-[#06d6e0]/30 transition-all group"
                >
                  <Mail className="w-5 h-5 text-[#06d6e0]" />
                  <div className="text-end">
                    <div className="text-sm font-medium text-[hsl(210,40%,98%)]">hello@nadavc.ai</div>
                    <div className="text-xs text-[hsl(215,20%,45%)]">{"מייל - תמיד עונה"}</div>
                  </div>
                </a>

                <a
                  href="https://m.me/nadav.cohen.167"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-lg border border-[hsl(215,28%,14%)] bg-[hsl(222,47%,4%)] hover:border-[#e84393]/30 transition-all group"
                >
                  <MessageSquare className="w-5 h-5 text-[#e84393]" />
                  <div className="text-end">
                    <div className="text-sm font-medium text-[hsl(210,40%,98%)]">{"הודעה בפייסבוק"}</div>
                    <div className="text-xs text-[hsl(215,20%,45%)]">{"DM פתוח - כתוב לי"}</div>
                  </div>
                </a>
              </div>

              <div className="flex items-center gap-3 font-mono text-sm pt-2">
                <span className="text-[#27ca40]">{">"}</span>
                <span className="text-[hsl(215,20%,50%)]">{"זמן תגובה ממוצע:"}</span>
                <span className="text-[#06d6e0]">{"< 24 שעות"}</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Main CTA - WhatsApp */}
        <ScrollReveal delay={400}>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Magnetic strength={0.2}>
              <a
                href="https://wa.me/972504401760"
                target="_blank"
                rel="noreferrer"
                className="group relative inline-flex items-center gap-3 px-10 py-5 rounded-xl text-lg font-bold text-[hsl(222,47%,4%)] bg-gradient-to-l from-[#27ca40] to-[#22a838] hover:shadow-[0_0_50px_hsl(135,65%,45%,0.4)] transition-all duration-500"
              >
                <Phone className="w-5 h-5" />
                {"שלח הודעה בוואטסאפ"}
              </a>
            </Magnetic>
            <Magnetic strength={0.2}>
              <a
                href="mailto:hello@nadavc.ai"
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl text-base font-medium text-[hsl(210,40%,98%)] border border-[hsl(215,28%,20%)] bg-[hsl(222,47%,7%)] hover:border-[#06d6e0]/40 transition-all duration-500"
              >
                <Send className="w-4 h-4 text-[#06d6e0]" />
                {"שלח מייל"}
              </a>
            </Magnetic>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
