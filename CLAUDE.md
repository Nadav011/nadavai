# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

nadavc.ai: Nadav Cohen's personal portfolio and blog site. It is a single-page landing in Hebrew (primary, RTL) and English, plus an MDX blog. Built with Next.js 16 (App Router), React 19, Tailwind 4 and next-intl, and deployed to Cloudflare through OpenNext.

## Commands

pnpm only (`packageManager: pnpm@10.30.3`), Node >= 24.14.0 (`engines`; `.nvmrc` wrongly says 22, see Open items).

- `pnpm dev`: dev server (Turbopack)
- `pnpm typecheck`: `tsc --noEmit`
- `pnpm lint`: ESLint flat config (`eslint-config-next` core-web-vitals + typescript)
- `pnpm vitest related <files> --run`: tests touching the given files
- `pnpm vitest run lib/utils.test.ts`: a single test file; add `-t "<name>"` for a single test
- `pnpm build`: production Next build

Tests use Vitest with jsdom. `test/setup.ts` mocks `matchMedia`, `ResizeObserver`, `IntersectionObserver` and `scrollIntoView`, and pins fast-check to `seed: 42` (override the run count with `FC_NUM_RUNS`). Property tests are named `*.prop.test.ts`. Stryker mutation testing is configured in `stryker.config.json`.

## Architecture

**Routing and i18n.** Every page lives under `app/[locale]/`. `i18n/routing.ts` defines locales `he` (default) and `en`, and exports the locale-aware `Link`, `redirect` and `useRouter`. Use those instead of `next/link` so locale prefixes are kept. `proxy.ts` is the next-intl middleware (Next 16 renamed `middleware.ts` to `proxy.ts`). `i18n/request.ts` loads `messages/<locale>.json`. `app/[locale]/layout.tsx` sets `dir="rtl"` for `he` and holds the site-wide metadata, hreflang alternates and the JSON-LD Person/ProfilePage schema.

**UI strings.** Section components read their text from `messages/he.json` and `messages/en.json`, one namespace per section (`hero`, `projects`, `services`, ...). Any new string goes into both files under the same key.

**Home page composition.** `app/[locale]/page.tsx` renders the hero eagerly and loads every below-the-fold section with `next/dynamic`. Client-only extras (custom cursor, WhatsApp button, easter egg, ambient orbs) load with `ssr: false` inside `components/non-critical.tsx`, and GSAP loads the same way through `components/gsap-setup-lazy.tsx`. `dynamic(..., { ssr: false })` is only valid inside a `"use client"` file, which is why these wrapper files exist. Keep new heavy or decorative pieces behind the same pattern.

**Blog.** Posts are `.mdx` files in `content/blog/`. `lib/blog.ts` reads them from disk with gray-matter. Frontmatter: `title`, `titleEn`, `description`, `descriptionEn`, `date`, `tags`, optional `readingTime`. The Hebrew fields are primary, and the `*En` fields are fallbacks for the `en` locale. Slugs are validated against `^[a-zA-Z0-9_-]+$` to block path traversal. `app/[locale]/blog/[slug]/page.tsx` renders posts with `next-mdx-remote/rsc` and `components/mdx-components.tsx`. `app/sitemap.ts` lists the posts through `getAllSlugs()`. `app/feed.xml` is not built from the blog: it serves a hardcoded `PROJECTS` array.

**Styling.** Tailwind 4 with no `tailwind.config`. The design tokens are OKLCH values inside `@theme inline` in `app/globals.css`, which also holds the section glow and divider utilities used on the home page. The site is dark-only (`className="dark"` on `<html>`). shadcn primitives live in `components/ui/` (`components.json`). Fonts are loaded in the layout via `next/font`: Heebo (Hebrew), Space Grotesk and JetBrains Mono.

**Security headers.** `next.config.ts` sets a strict CSP and COEP `credentialless` on every route. Any new external origin (script, font, image, iframe, fetch) must be added to the matching CSP directive, or the browser blocks it silently.

**Newsletter.** `app/api/newsletter/route.ts` validates the email and rate-limits by IP, but it stores subscribers in an in-memory `Set`. There is no real email provider yet.

**Deploy.** Deployment goes to Cloudflare via `@opennextjs/cloudflare` (`open-next.config.ts`, `wrangler.jsonc` with output `.open-next/assets`). `package.json` has no deploy script.

**Other tooling in the repo.** `dagger/` (a Dagger CI module, excluded from `tsconfig`), `devenv.nix`, `turbo.json`, and a large set of GitHub workflows under `.github/workflows/` that run on self-hosted runners.

## MANUAL

### Product and brand
- Marketing-only site: no auth, no accounts, no database, and no test accounts. Why: it decides how much safety and data tooling a change needs (none beyond the newsletter route).
- Keep the JSON-LD disambiguation in `app/[locale]/layout.tsx` ("Not to be confused with Prof. Nadav Cohen, the deep learning researcher at Tel Aviv University") through every rewrite. Why: search engines and AI answers otherwise merge the two people.
- The headline numbers (10+ production apps, 86 AI skills, 52 automation agents) appear in 7 places: `components/hero.tsx`, `app/opengraph-image.tsx`, `app/feed.xml/route.ts`, the layout JSON-LD, `messages/he.json`, `messages/en.json`, `public/llms.txt`. Change all of them together. Why: otherwise the structured data contradicts the page.
- "APEX" in site content (projects, news, feed, llms.txt, a blog post, `WIKIDATA-ENTRY.md`) is Nadav's product, not the retired agent harness. Keep it. Why: it was removed from tooling only. `WIKIDATA-ENTRY.md` is a brand document, not tooling.

### Deploy and CI
- Production is nadavc.ai on Cloudflare Pages via OpenNext. Never Vercel or Netlify, despite the old docs and `README.md`. Why: only the Cloudflare config exists in the repo.
- semantic-release publishes from `main` only (`.releaserc.json`). CI builds with `ROLLUP_NATIVE_THREADS=0 CI=true pnpm build`. Why: that is the command the gate actually runs.
- GitHub Actions run on Nadav's self-hosted runner `[self-hosted, linux, x64, pop-os]`; Node comes from fnm `v24.14.0` and pnpm from corepack. CI results go to Telegram. Why: hosted-runner assumptions (setup-node caches, ubuntu images) do not hold here.
- Workflows reference Supabase secrets (`NEXT_PUBLIC_SUPABASE_*`, `VITE_SUPABASE_*`). They are leftovers of a shared template. Why: this project has no Supabase, so do not wire anything to them.

### Tests and gates
- `pool: "forks"` must stay at the top level of `test` in `vitest.config.ts`. Why: a nested `forks` object is ignored, which already caused a real failure.
- `bundle-check.yml` fails when the build output exceeds 6500 KB. Why: the site ships GSAP, Spline and Lenis, and the budget is the only bundle guard.
- Lighthouse CI (`.lighthouserc.cjs`) and Stryker (`lib/**`, `i18n/**`, `break: null`) only warn and never fail the build. `coverage-gate.yml` ratchets a threshold stored in `.coverage-threshold`. Why: read their output as advisory, and do not cite them as passing gates.
- There is no `type-coverage` check. Why: an old doc claimed one, but it is not installed.

### SEO
- Every SEO finding cites a findings file or script output; otherwise it is marked "not measured". Why: the site exists for search and AI visibility, so unmeasured SEO claims mislead the owner.

### Environment
- `devenv.nix` provides the dev shell (`devenv up dev`, `devenv up test-watch`) and pre-commit hooks: a `console.log` block, and an RTL check that rejects `ml-`/`mr-`/`pl-`/`pr-` in `className`. Its Biome hook calls a tool that is not installed. Why: a commit failing on Biome is that hook, not the code.
- The app reads only `NODE_ENV` and `FC_NUM_RUNS`; there is no `.env`. Why: a new env var is a new deploy dependency on Cloudflare.

### Open items
1. The newsletter route loses subscribers and rate-limit state on every cold start. It needs an email provider and a shared rate-limit store before the newsletter is promoted.
2. `.nvmrc` says 22, while `engines` and CI need 24.14.0.
3. `devenv.nix` still carries cross-project placeholders (a dev probe on port 5173, a Flutter comment), and the `scan` script in `package.json` points at port 5173. Next serves port 3000.
4. `README.md` is stock create-next-app text.
5. `REVERSE-ENGINEERING-2026-07-26.md` and `mockups/` are Nadav's untracked files. Leave them alone.

### Redesign
- The 2026 redesign of nadavc.ai is designed outside this repo, in `~/design-redesign/nadavc-ai`: the prototype is `demos/site-v1`, the owner decisions are `ANSWERS.md` #1–54, and all site copy is in `COPY-FULL.md`. Treat those files as the source of truth for the redesign, not the current components. Why: the decisions and copy were settled there with the owner, and the current site predates them.
- The redesign is ported into this repo only after the re-init is finished, and in its own session. Do not start the port as a side task of other work. Why: the port is a large change that needs a clean CLAUDE.md and a dedicated session.
