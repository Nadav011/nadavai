"use client"

import { useTranslations, useLocale } from "next-intl"
import { useEffect, useState } from "react"
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

export function CommandPalette() {
  const t = useTranslations("commandPalette")
  const locale = useLocale()
  const [isMac, setIsMac] = useState(true) // Default true for SSR

  const sections = [
    { label: t("projects"), href: "#projects", icon: Briefcase, description: t("projectsDesc") },
    { label: t("services"), href: "#services", icon: Zap, description: t("servicesDesc") },
    { label: t("process"), href: "#process", icon: Cpu, description: t("processDesc") },
    { label: t("blog"), href: "#blog", icon: PenLine, description: t("blogDesc") },
    { label: t("youtube"), href: "#youtube", icon: Play, description: t("youtubeDesc") },
    { label: t("guides"), href: "#guides", icon: BookOpen, description: t("guidesDesc") },
    { label: t("resources"), href: "#resources", icon: FolderGit2, description: t("resourcesDesc") },
    { label: t("news"), href: "#news", icon: Newspaper, description: t("newsDesc") },
    { label: t("contact"), href: "#contact", icon: Phone, description: t("contactDesc") },
  ]

  const links = [
    { label: "GitHub", href: "https://github.com/Nadav011", icon: Github, external: true },
    { label: "Facebook", href: "https://www.facebook.com/nadav.cohen.167", icon: Facebook, external: true },
    { label: "WhatsApp", href: "https://wa.me/972504401760", icon: Phone, external: true },
    { label: t("email"), href: "mailto:hello@nadavc.ai", icon: Mail, external: true },
  ]

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

  useEffect(() => {
    setIsMac(navigator.platform?.toLowerCase().includes("mac") ?? /mac/i.test(navigator.userAgent))
  }, [])

  const handleSelect = (value: string) => {
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
  }

  return (
    <>
      {/* Keyboard hint in navbar */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[hsl(215,28%,16%)] bg-[hsl(222,47%,5%)] text-[hsl(215,20%,45%)] hover:border-[#06d6e0]/30 hover:text-[hsl(215,20%,60%)] transition-all text-xs font-mono"
      >
        <Terminal className="w-3 h-3" />
        <span className="hidden xl:inline">{t("search")}</span>
        <kbd className="px-1.5 py-0.5 rounded bg-[hsl(215,28%,12%)] border border-[hsl(215,28%,18%)] text-[10px] font-mono">
          {isMac ? "⌘K" : "Ctrl+K"}
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder={t("placeholder")}
          className={locale === "he" ? "text-end" : "text-start"}
          dir={locale === "he" ? "rtl" : "ltr"}
        />
        <CommandList
          dir={locale === "he" ? "rtl" : "ltr"}
          className={locale === "he" ? "text-end" : "text-start"}
        >
          <CommandEmpty>{t("empty")}</CommandEmpty>

          <CommandGroup heading={t("navGroup")}>
            {sections.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => handleSelect(item.href)}
                className={`flex items-center gap-3 ${locale === "he" ? "flex-row-reverse" : ""}`}
              >
                <item.icon className="w-4 h-4 text-[#06d6e0]" />
                <div className={`flex flex-col ${locale === "he" ? "items-end" : "items-start"}`}>
                  <span>{item.label}</span>
                  <span className="text-xs text-[hsl(215,20%,45%)]">{item.description}</span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading={t("linksGroup")}>
            {links.map((item) => (
              <CommandItem
                key={item.href}
                value={item.label}
                onSelect={() => handleSelect(item.href)}
                className={`flex items-center gap-3 ${locale === "he" ? "flex-row-reverse" : ""}`}
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
