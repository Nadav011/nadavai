# NadavAI — Claude Code Configuration

## Project Overview
Personal portfolio and AI showcase website for Nadav Cohen (nadavc.ai).
i18n (next-intl), GSAP+Lenis animations, OKLCH P3-wide-gamut color system.
Stack: Next.js 16, React 19, Tailwind 4.2 (CSS-first), GSAP 3.14, Lenis, motion/react, next-intl
Deploy: Vercel (auto-deploy from main) | Domain: nadavc.ai

## Architecture (2026 Overhaul)
- **CSS**: Tailwind 4.2 CSS-first — `@theme inline` in `app/globals.css`, NO `tailwind.config.ts`
- **Colors**: OKLCH P3-wide-gamut — `var(--color-cyan)`, `var(--color-pink)`, `var(--color-bg-deep)` etc.
- **Animations**: CSS scroll-driven (`animation-timeline: scroll()/view()`) for simple reveals, GSAP ScrollTrigger for complex
- **Scroll**: Lenis smooth scroll synced with GSAP ticker (3 critical lines in gsap-setup.tsx)
- **Transitions**: next-view-transitions for locale switching
- **Sound**: Howler.js (lib/sound.ts), muted by default, respects prefers-reduced-motion
- **Components**: 34 files in components/, all client-side ("use client")

## Rules
- RTL-first (Hebrew is primary language)
- pnpm only (not npm)
- All Tailwind classes must use logical properties (ms-/me-/ps-/pe-/inset-s-/inset-e- — NEVER ml-/mr-/pl-/pr-/left-/right-)
- All directional icons (ChevronLeft/Right, ArrowLeft/Right) need `rtl:rotate-180`
- All `linear-gradient(to right)` must have `/* rtl-ok */` comment or RTL variant
- OKLCH for all new colors — no new HSL or hex
- `prefers-reduced-motion` on EVERY animation
- Touch targets minimum 44px
- `aria-label` on all interactive elements

## Key Custom Utilities (defined in globals.css)
`glass`, `glass-strong`, `dot-grid`, `dot-grid-subtle`, `mesh-gradient`, `text-gradient`, `text-gradient-cyan`, `text-gradient-mixed`, `text-gradient-animated`, `glow-cyan`, `glow-pink`, `glow-text`, `gradient-border`, `grid-bg`, `section-divider`, `shader-fallback`, `holographic`, `noise-bg`, `scrollbar-hide`

## Stats (keep in sync)
- 10+ production apps, 86 AI skills, 52 automation agents
- Update in: hero.tsx, opengraph-image.tsx, feed.xml/route.ts, layout.tsx JSON-LD, he.json, en.json, llms.txt
