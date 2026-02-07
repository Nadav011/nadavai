"use client"

import { useState, useEffect } from "react"
import { Phone, X } from "lucide-react"

export function WhatsAppButton() {
  const [visible, setVisible] = useState(false)
  const [tooltip, setTooltip] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (!tooltip) return
    const timer = setTimeout(() => setTooltip(false), 8000)
    return () => clearTimeout(timer)
  }, [tooltip])

  if (!visible) return null

  return (
    <div className="fixed bottom-6 start-6 z-50 flex items-end gap-3">
      {/* Tooltip */}
      {tooltip && (
        <div className="relative animate-fade-up">
          <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[hsl(222,47%,7%)] border border-[hsl(215,28%,16%)] shadow-lg">
            <span className="text-sm text-[hsl(210,40%,98%)]">{"צריך עזרה? דבר איתי"}</span>
            <button
              onClick={() => setTooltip(false)}
              className="p-0.5 rounded hover:bg-[hsl(215,28%,14%)] transition-colors"
              aria-label="סגור"
            >
              <X className="w-3 h-3 text-[hsl(215,20%,45%)]" />
            </button>
          </div>
          {/* Arrow */}
          <div className="absolute bottom-2 -start-2 w-3 h-3 rotate-45 bg-[hsl(222,47%,7%)] border-b border-s border-[hsl(215,28%,16%)]" />
        </div>
      )}

      {/* Button */}
      <a
        href="https://wa.me/972504401760"
        target="_blank"
        rel="noreferrer"
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:shadow-[0_4px_30px_rgba(37,211,102,0.6)] hover:scale-110 transition-all duration-300"
        aria-label="WhatsApp"
      >
        {/* Ping animation */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20" />
        <Phone className="w-6 h-6 text-white relative z-10" />
      </a>
    </div>
  )
}
