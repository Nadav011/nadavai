---
paths:
  - "components/**"
  - "app/**/*.tsx"
  - "app/**/*.css"
---

# UI rules for nadavc.ai

- The theme lives only in `@theme inline` in `app/globals.css`. Do not add a `tailwind.config.ts`. Why: Tailwind 4 CSS-first is a deliberate choice, and a config file would split the token source.
- New colors are OKLCH tokens (`var(--color-cyan)`, `var(--color-pink)`, `var(--color-bg-deep)`, ...), never hex or HSL. Why: the palette is P3 wide-gamut, and other formats fall outside the token system.
- Simple reveals use CSS scroll-driven animation (`animation-timeline: scroll()` / `view()`). Complex sequences use GSAP ScrollTrigger. Why: it keeps GSAP work off the main thread for the easy cases.
- Do not "simplify" the three Lenis-to-GSAP-ticker sync lines in `components/gsap-setup.tsx`. Why: without them smooth scroll and ScrollTrigger drift apart.
- Every animation honors `prefers-reduced-motion`. Why: the site animates continuously and has no global off switch.
- A `linear-gradient(to right)` or other direction-bound value gets an RTL variant, or a `/* rtl-ok */` comment when the LTR direction is deliberate. Why: review can then tell a deliberate choice from an RTL bug.
- Reuse the utilities defined in `globals.css` before writing new ones: `glass`, `glass-strong`, `dot-grid`, `dot-grid-subtle`, `mesh-gradient`, `text-gradient*`, `glow-cyan`, `glow-pink`, `glow-text`, `gradient-border`, `grid-bg`, `section-divider`, `shader-fallback`, `holographic`, `noise-bg`, `scrollbar-hide`. Why: they carry the site's look and its fallbacks.
- `components/` is all client components (`"use client"`), while server work and metadata stay in `app/`. Why: the sections depend on GSAP and browser APIs.
- Locale switching goes through `next-view-transitions`. Why: it is already wired in the layout.
