"use client"

import { useTranslations, useLocale } from "next-intl"
import { useEffect, useState, useCallback, useRef } from "react"
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
  Clock,
  X,
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

// Decorative gradient constants — rtl-ok: non-directional use
const GRAD_BORDER = "linear-gradient(135deg, oklch(0.81 0.17 193 / 0.5), oklch(0.65 0.25 350 / 0.4), oklch(0.81 0.17 193 / 0.3))" // rtl-ok
const GRAD_TEXT = "linear-gradient(135deg, oklch(0.81 0.17 193), oklch(0.65 0.25 350))" // rtl-ok

const MAX_RECENT = 5

/** Highlight substrings of `text` that match chars in `query` (fuzzy). */
function FuzzyHighlight({ text, query }: { text: string; query: string }) {
  if (!query.trim()) return <span>{text}</span>

  // Build a simple contiguous-match highlight
  const lowerText = text.toLowerCase()
  const lowerQuery = query.toLowerCase().trim()
  const idx = lowerText.indexOf(lowerQuery)

  if (idx === -1) {
    // No contiguous match — highlight individual chars
    const queryChars = new Set(lowerQuery)
    return (
      <span>
        {text.split("").map((char, i) => (
          queryChars.has(char.toLowerCase()) ? (
            <mark
              key={i}
              style={{
                background: "oklch(0.81 0.17 193 / 0.25)",
                color: "oklch(0.87 0.19 193)",
                borderRadius: "2px",
                padding: "0 1px",
              }}
            >
              {char}
            </mark>
          ) : (
            <span key={i}>{char}</span>
          )
        ))}
      </span>
    )
  }

  return (
    <span>
      {text.slice(0, idx)}
      <mark
        style={{
          background: "oklch(0.81 0.17 193 / 0.25)",
          color: "oklch(0.87 0.19 193)",
          borderRadius: "3px",
          padding: "0 2px",
        }}
      >
        {text.slice(idx, idx + lowerQuery.length)}
      </mark>
      {text.slice(idx + lowerQuery.length)}
    </span>
  )
}

export function CommandPalette() {
  const t = useTranslations("commandPalette")
  const locale = useLocale()
  const [isMac, setIsMac] = useState(true)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

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
    { label: "WhatsApp", href: "https://wa.me/972505245677", icon: Phone, external: true },
    { label: t("email"), href: "mailto:nadav@nadavc.ai", icon: Mail, external: true },
  ]

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    document.addEventListener("keydown", down)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(navigator.platform?.toLowerCase().includes("mac") ?? /mac/i.test(navigator.userAgent))
    // Load recent searches from sessionStorage
    try {
      const stored = sessionStorage.getItem("cmd-recent")
      if (stored) setRecentSearches(JSON.parse(stored) as string[])
    } catch {
      // ignore
    }
    return () => document.removeEventListener("keydown", down)
  }, [])

  const saveRecent = useCallback((label: string) => {
    setRecentSearches((prev) => {
      const next = [label, ...prev.filter((r) => r !== label)].slice(0, MAX_RECENT)
      try { sessionStorage.setItem("cmd-recent", JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }, [])

  const clearRecent = useCallback(() => {
    setRecentSearches([])
    try { sessionStorage.removeItem("cmd-recent") } catch { /* ignore */ }
  }, [])

  const handleSelect = useCallback((value: string, label: string) => {
    setOpen(false)
    saveRecent(label)

    const link = links.find((l) => l.href === value)
    if (link?.external) {
      window.open(value, "_blank", "noreferrer")
      return
    }
    if (value === "ai-status") return
    if (value.startsWith("#")) {
      const el = document.querySelector(value)
      if (el) el.scrollIntoView({ behavior: "smooth" })
    }
  }, [links, saveRecent])

  const handleOpenChange = useCallback((v: boolean) => {
    setOpen(v)
    if (!v) setQuery("")
  }, [])

  const shortcutLabel = isMac ? "⌘K" : "Ctrl+K"

  return (
    <>
      {/* Trigger button in navbar */}
      <button
        onClick={() => setOpen(true)}
        className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-border bg-bg-surface text-text-muted hover:border-cyan/40 hover:text-text-secondary transition-all text-xs font-mono group/trigger"
        aria-label={`${t("search")} (${shortcutLabel})`}
      >
        <Terminal className="w-3 h-3 text-cyan/70 group-hover/trigger:text-cyan transition-colors" />
        <span className="hidden xl:inline">{t("search")}</span>
        <kbd
          className="px-1.5 py-0.5 rounded border border-border text-[10px] font-mono"
          style={{
            background: "oklch(0.085 0.025 245 / 0.8)",
            color: "oklch(0.81 0.17 193)",
            borderColor: "oklch(0.81 0.17 193 / 0.25)",
          }}
        >
          {shortcutLabel}
        </kbd>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={handleOpenChange}
      >
        <span className="sr-only" role="heading" aria-level={2}>Command Palette</span>
        {/* Premium gradient border wrapper */}
        <div
          className="relative rounded-2xl p-[1px]"
          style={{ background: GRAD_BORDER }}
        >
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "oklch(0.10 0.022 243 / 0.95)",
              backdropFilter: "blur(40px) saturate(180%)",
              WebkitBackdropFilter: "blur(40px) saturate(180%)",
            }}
          >
            {/* Ambient top glow inside dialog */}
            <div
              aria-hidden="true"
              className="absolute inset-x-0 top-0 h-24 pointer-events-none"
              style={{
                background: "radial-gradient(ellipse 80% 100% at 50% 0%, oklch(0.81 0.17 193 / 0.06), transparent)",
              }}
            />

            {/* Header: input + keyboard hint */}
            <div className="relative flex items-center border-b border-border/60 px-4">
              <Terminal className="w-4 h-4 text-cyan shrink-0 me-3" aria-hidden="true" />
              <CommandInput
                ref={inputRef}
                placeholder={t("placeholder")}
                value={query}
                onValueChange={setQuery}
                className={`flex-1 bg-transparent border-none outline-none text-text placeholder:text-text-muted font-mono text-sm py-4 ${
                  locale === "he" ? "text-end" : "text-start"
                }`}
                dir={locale === "he" ? "rtl" : "ltr"}
              />
              {/* Keyboard shortcut hint */}
              <div className="flex items-center gap-1.5 shrink-0 ms-3">
                <kbd
                  className="px-1.5 py-0.5 rounded text-[9px] font-mono border"
                  style={{
                    background: "oklch(0.14 0.022 243)",
                    borderColor: "oklch(0.22 0.02 260 / 0.6)",
                    color: "oklch(0.55 0.02 260)",
                  }}
                  title="Escape to close"
                >
                  ESC
                </kbd>
                <span className="text-text-dim text-[10px] font-mono">{shortcutLabel}</span>
              </div>
            </div>

            <CommandList
              dir={locale === "he" ? "rtl" : "ltr"}
              className={`max-h-[400px] overflow-y-auto scrollbar-hide ${locale === "he" ? "text-end" : "text-start"}`}
            >
              <CommandEmpty>
                <div className="flex flex-col items-center gap-2 py-8 text-text-muted">
                  <Terminal className="w-8 h-8 opacity-30" />
                  <span className="text-sm">{t("empty")}</span>
                </div>
              </CommandEmpty>

              {/* Recent searches — only shown when no query */}
              {!query && recentSearches.length > 0 && (
                <>
                  <CommandGroup
                    heading={
                      <div className="flex items-center justify-between w-full">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3 h-3" />
                          {t("recentGroup") ?? "Recent"}
                        </span>
                        <button
                          onClick={clearRecent}
                          className="p-0.5 rounded hover:text-text transition-colors"
                          aria-label="Clear recent searches"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    }
                  >
                    {recentSearches.map((label) => (
                      <CommandItem
                        key={`recent-${label}`}
                        value={`recent-${label}`}
                        onSelect={() => {
                          // Find the matching section/link and navigate
                          const match =
                            sections.find((s) => s.label === label) ??
                            links.find((l) => l.label === label)
                          if (match) handleSelect(match.href, label)
                        }}
                        className={`flex items-center gap-3 rounded-lg px-3 py-2 text-text-muted ${
                          locale === "he" ? "flex-row-reverse" : ""
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5 shrink-0 opacity-50" />
                        <span className="text-sm">{label}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                  <CommandSeparator />
                </>
              )}

              {/* Nav sections */}
              <CommandGroup heading={t("navGroup")}>
                {sections.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.label}
                    onSelect={() => handleSelect(item.href, item.label)}
                    className={`group/cmd flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                      locale === "he" ? "flex-row-reverse" : ""
                    }`}
                    style={{
                      // selected state highlight via data attribute — handled by shadcn
                    }}
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0 transition-all"
                      style={{
                        background: "oklch(0.81 0.17 193 / 0.08)",
                        border: "1px solid oklch(0.81 0.17 193 / 0.15)",
                      }}
                    >
                      <item.icon className="w-4 h-4 text-cyan" />
                    </div>
                    <div className={`flex flex-col min-w-0 ${locale === "he" ? "items-end" : "items-start"}`}>
                      <span className="text-sm text-text font-medium truncate">
                        <FuzzyHighlight text={item.label} query={query} />
                      </span>
                      <span className="text-xs text-text-muted truncate">{item.description}</span>
                    </div>
                    {/* Per-item arrow hint */}
                    <span
                      aria-hidden="true"
                      className="ms-auto shrink-0 opacity-0 group-data-[selected=true]/cmd:opacity-100 transition-opacity"
                      style={{
                        background: GRAD_TEXT,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "10px",
                        fontFamily: "monospace",
                      }}
                    >
                      ↵
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>

              <CommandSeparator />

              {/* External links */}
              <CommandGroup heading={t("linksGroup")}>
                {links.map((item) => (
                  <CommandItem
                    key={item.href}
                    value={item.label}
                    onSelect={() => handleSelect(item.href, item.label)}
                    className={`group/cmd flex items-center gap-3 rounded-xl px-3 py-2.5 cursor-pointer transition-all ${
                      locale === "he" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
                      style={{
                        background: "oklch(0.65 0.25 350 / 0.08)",
                        border: "1px solid oklch(0.65 0.25 350 / 0.15)",
                      }}
                    >
                      <item.icon className="w-4 h-4 text-pink" />
                    </div>
                    <span className="text-sm text-text font-medium">
                      <FuzzyHighlight text={item.label} query={query} />
                    </span>
                    <span
                      aria-hidden="true"
                      className="ms-auto shrink-0 opacity-0 group-data-[selected=true]/cmd:opacity-100 transition-opacity"
                      style={{
                        background: GRAD_TEXT,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontSize: "10px",
                        fontFamily: "monospace",
                      }}
                    >
                      ↵
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>

            {/* Footer hint bar */}
            <div
              className="flex items-center justify-between px-4 py-2 border-t border-border/40 text-[10px] font-mono text-text-dim"
              style={{
                background: "oklch(0.085 0.025 245 / 0.5)",
              }}
            >
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded border border-border/60 bg-bg-elevated">↑↓</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded border border-border/60 bg-bg-elevated">↵</kbd>
                  select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1 rounded border border-border/60 bg-bg-elevated">ESC</kbd>
                  close
                </span>
              </div>
              <span
                className="font-bold"
                style={{
                  background: GRAD_TEXT,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                NADAV.AI
              </span>
            </div>
          </div>
        </div>
      </CommandDialog>
    </>
  )
}
