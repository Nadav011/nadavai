"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Briefcase,
  BookOpen,
  FolderGit2,
  Newspaper,
  Phone,
  Github,
  Facebook,
  Mail,
  Zap,
  Terminal,
  Cpu,
  Sparkles,
  ArrowDown,
  PenLine,
  Play,
} from "lucide-react"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

const sections = [
  { label: "פרויקטים", href: "#projects", icon: Briefcase, description: "ראה מה בניתי" },
  { label: "שירותים", href: "#services", icon: Zap, description: "שירותי AI ופיתוח" },
  { label: "תהליך עבודה", href: "#process", icon: Cpu, description: "איך אני עובד" },
  { label: "בלוג", href: "#blog", icon: PenLine, description: "פוסטים ותובנות" },
  { label: "YouTube", href: "#youtube", icon: Play, description: "סרטונים ומדריכים" },
  { label: "מדריכים", href: "#guides", icon: BookOpen, description: "מדריכים וטיפים" },
  { label: "משאבים", href: "#resources", icon: FolderGit2, description: "כלים חינמיים" },
  { label: "חדשות", href: "#news", icon: Newspaper, description: "חדשות טכנולוגיה" },
  { label: "צור קשר", href: "#contact", icon: Phone, description: "דבר איתי" },
]

const links = [
  { label: "GitHub", href: "https://github.com/Nadav011", icon: Github, external: true },
  { label: "Facebook", href: "https://www.facebook.com/nadav.cohen.167", icon: Facebook, external: true },
  { label: "WhatsApp", href: "https://wa.me/972504401760", icon: Phone, external: true },
  { label: "אימייל", href: "mailto:hello@nadavc.ai", icon: Mail, external: true },
]

const quickActions = [
  { label: "הורד קורות חיים", action: "cv", icon: ArrowDown },
  { label: "מצב AI", action: "ai-status", icon: Sparkles },
]

export function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const handleSelect = useCallback((value: string) => {
    setOpen(false)

    // Check for external links
    const link = links.find((l) => l.href === value)
    if (link?.external) {
      window.open(value, "_blank", "noreferrer")
      return
    }

    // Check for actions
    if (value === "ai-status") {
      return
    }

    // Section navigation
    if (value.startsWith("#")) {
      const el = document.querySelector(value)
      if (el) {
        el.scrollIntoView({ behavior: "smooth" })
      }
    }
  }, [])

  return (
    <>
      {/* Keyboard hint in navbar */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] text-[hsl(215,20%,45%)] hover:border-[#06d6e0]/30 hover:text-[hsl(215,20%,60%)] transition-all text-xs font-mono"
      >
        <Terminal className="w-3 h-3" />
        <span className="hidden xl:inline">{"חיפוש"}</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[hsl(215,28%,12%)] border border-[hsl(215,28%,18%)] text-[10px] font-mono">
          ⌘K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder={"חפש עמוד, פעולה, קישור..."} className="text-end" dir="rtl" />
        <CommandList dir="rtl" className="text-end">
          <CommandEmpty>{"לא נמצאו תוצאות."}</CommandEmpty>

          <CommandGroup heading="ניווט">
            {sections.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => handleSelect(item.href)}
                className="flex items-center gap-3 flex-row-reverse"
              >
                <item.icon className="w-4 h-4 text-[#06d6e0]" />
                <div className="flex flex-col items-end">
                  <span>{item.label}</span>
                  <span className="text-xs text-[hsl(215,20%,45%)]">{item.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="קישורים">
            {links.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => handleSelect(item.href)}
                className="flex items-center gap-3 flex-row-reverse"
              >
                <item.icon className="w-4 h-4 text-[#e84393]" />
                <span>{item.label}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
