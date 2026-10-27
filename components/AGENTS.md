# components

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
All site UI. Three kinds live side by side in one flat folder:
- page sections, each rendered once on the home page
- reusable visual effects and wrappers
- client-only infrastructure: GSAP, Lenis, lazy loaders

## Key Files
| File | Description |
|------|-------------|
| `hero.tsx`, `projects.tsx`, `services.tsx`, `process.tsx`, `testimonials.tsx`, `blog.tsx`, `youtube.tsx`, `guides.tsx`, `resources.tsx`, `news.tsx`, `social.tsx`, `contact.tsx` | Home page sections. Each reads its own `messages` namespace via `useTranslations("<section>")` and animates with GSAP |
| `navbar.tsx`, `footer.tsx` | Site chrome, shared by the home page and the blog pages |
| `gsap-setup.tsx` | Registers `ScrollTrigger` and `SplitText`, creates the single Lenis instance and syncs it with ScrollTrigger; `getLenis()` exposes it |
| `gsap-setup-lazy.tsx`, `non-critical.tsx` | `"use client"` wrappers whose only job is `dynamic(..., { ssr: false })` |
| `hero-3d.tsx` | Spline scene (lazy, skipped under reduced motion or on load failure); the scene URL must stay allowed in the CSP |
| `command-palette.tsx` | cmdk palette (`commandPalette` namespace), mounted from the navbar |
| `sound-toggle.tsx` | Toggles UI sounds through `@/lib/sound` |
| `mdx-components.tsx` | `getMDXComponents()` element map for blog posts |
| `section-header.tsx`, `split-text.tsx`, `scroll-reveal.tsx`, `tilt-card.tsx`, `magnetic.tsx`, `spotlight.tsx`, `code-card.tsx`, `animated-counter.tsx`, `tech-marquee.tsx` | Reusable effects and layout pieces |
| `custom-cursor.tsx`, `ambient-orbs.tsx`, `whatsapp-button.tsx`, `easter-egg.tsx` | Decorative, client-only, loaded through `non-critical.tsx` |

## Subdirectories
| Directory | Purpose |
|-----------|---------|
| `ui/` | shadcn primitives (see `ui/AGENTS.md`) |

## For AI Agents

### Working In This Directory
- Section text comes from `messages/he.json` and `messages/en.json`. Item lists are built in the component from keys such as `t("p1")`...`t("p6")`, so adding an item means adding keys to both message files.
- New decorative or heavy client-only components go behind `non-critical.tsx`, or behind a new `"use client"` wrapper with `ssr: false`. A new section needs a `dynamic` import in `app/[locale]/page.tsx`.
- Use the existing Lenis instance through `getLenis()`, and register GSAP plugins only in `gsap-setup.tsx`.
- Layout must work in RTL: use logical properties (`ms-`/`me-`, `start`/`end`). The few physical `left` values carry an `rtl-ok` comment that explains why.
- Respect `prefers-reduced-motion` in new animations, as `hero-3d.tsx` and `lib/sound.ts` do.

### Testing Requirements
Coverage excludes `command-palette.tsx`, `gsap-setup-lazy.tsx` and `non-critical.tsx`. Visual changes need a browser check in `/he` and `/en`, at desktop and at mobile width.

## Dependencies

### Internal
`@/i18n/routing` (`Link`), `@/lib/utils` (`cn`), `@/lib/sound`, `ui/*`.

### External
`gsap` and `@gsap/react`, `lenis`, `@splinetool/react-spline`, `cmdk`, `embla-carousel-react`, `react-fast-marquee`, `react-parallax-tilt`, `lucide-react`.

## Manual Notes
