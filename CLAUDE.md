# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

nadavc.ai: the site of NadavAI, Nadav Cohen's software house (systems, automations, AI agents and WhatsApp bots, apps, websites). 16 pages in Hebrew (primary, RTL) and English. Built with Next.js 16 (App Router), React 19 and next-intl, and deployed to Cloudflare through OpenNext. The pages are a port of the approved prototype in `~/design-redesign/nadavc-ai/demos/site-v1`.

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

**The port.** `scripts/port/sync.py` (Python 3 + bs4) ports the prototype at the design repo's HEAD. Re-run it after every prototype commit and commit what it writes; never edit its outputs by hand:
- `public/site/**`: the prototype's CSS, JS modules and assets as they are. Document-relative paths become `/site/...`, `.html` links become `__href('<page>')`, and Hebrew literals become `__t('<deck id>')`. Hand fixes to a module go in `scripts/port/js_patches.py` as exact replacements (a patch that stops applying stops the sync).
- `components/site/generated/*.tsx`: one server component per page, plus the shared header, footer and dock. Every text run whose text equals a deck string becomes `c(id)` / `r(id, tags)`.
- `messages/{he,en}.json`: every deck string, keyed by deck id with `/` in place of `.` (next-intl reads dots as nesting). `messages/js-ids.json` lists the ids the modules read through `window.__t`.
- `scripts/port/REPORT.md`: what is still literal (no deck id yet).

**Copy.** Strings come from the deck, never typed into code: `COPY-FULL.md` (approved), then `COPY-GAP.md` (draft) in the design repo, then `scripts/port/COPY-PORT.md` (the port's own draft rows). A new string goes into a deck file first, then the sync. `scripts/copy-gate.sh [base-url]` runs the prototype's copy rules on the 16 rendered pages and the modules.

**Routing and i18n.** One catch-all route, `app/[locale]/[[...slug]]/page.tsx`, renders the 16 pages; `lib/site/routes.ts` maps prototype page names to routes. `i18n/routing.ts` defines `he` (default) and `en`; `proxy.ts` is the next-intl middleware. Links are plain `<a>`: every page is a full load, as in the prototype, so a page module never outlives its page.

**Runtime.** `app/[locale]/layout.tsx` puts the import map (three.js 0.170.0 from jsDelivr) and the prototype's two before-paint scripts (`lib/site/head-script.ts`: calm mode and `html.pfx`, the night/day look, plus `__href`, `__page`, `__t`) in `<head>`. `components/site/page-shell.tsx` adds the page's stylesheets, its `<body>` class and its module; `components/site/engine.tsx` loads GSAP, ScrollTrigger and Lenis from the prototype's CDNs and then the module, after hydration. `app/[locale]/site-port.css` holds the few styles the port adds (language switch, LTR arrows).

**Security headers.** `next.config.ts` sets a strict CSP and COEP `credentialless`. The CDNs above and the framed MediZen demo are allowed there; any new external origin must be added to the matching directive, or the browser blocks it silently.

**Newsletter.** `app/api/newsletter/route.ts` validates the email and rate-limits by IP, but it stores subscribers in an in-memory `Set`. The redesign does not link to it.

**Deploy.** Deployment goes to Cloudflare via `@opennextjs/cloudflare` (`open-next.config.ts`, `wrangler.jsonc` with output `.open-next/assets`). `package.json` has no deploy script.

**Other tooling in the repo.** `dagger/` (a Dagger CI module, excluded from `tsconfig`), `devenv.nix`, `turbo.json`, and a large set of GitHub workflows under `.github/workflows/` that run on self-hosted runners.

## MANUAL

### Product and brand
- Marketing-only site: no auth, no accounts, no database, and no test accounts. Why: it decides how much safety and data tooling a change needs (none beyond the newsletter route).
- Keep the JSON-LD disambiguation in `app/[locale]/layout.tsx` ("Not to be confused with Prof. Nadav Cohen, the deep learning researcher at Tel Aviv University") through every rewrite. Why: search engines and AI answers otherwise merge the two people.
- No usage numbers anywhere: no user, download, client or revenue counts. Only what the approved bio says. Why: the copy deck forbids them, and the old "10+ apps, 86 skills, 52 agents" lines were removed from the JSON-LD, `public/llms.txt` and `public/manifest.json` in the redesign.
- `WIKIDATA-ENTRY.md` is a brand document, not tooling; "APEX" there is Nadav's product. Why: it was removed from tooling only.

### Deploy and CI
- Production is nadavc.ai on Cloudflare Pages via OpenNext. Never Vercel or Netlify, despite the old docs and `README.md`. Why: only the Cloudflare config exists in the repo.
- semantic-release publishes from `main` only (`.releaserc.json`). CI builds with `ROLLUP_NATIVE_THREADS=0 CI=true pnpm build`. Why: that is the command the gate actually runs.
- GitHub Actions run on Nadav's self-hosted runner `[self-hosted, linux, x64, pop-os]`; Node comes from fnm `v24.14.0` and pnpm from corepack. CI results go to Telegram. Why: hosted-runner assumptions (setup-node caches, ubuntu images) do not hold here.
- Workflows reference Supabase secrets (`NEXT_PUBLIC_SUPABASE_*`, `VITE_SUPABASE_*`). They are leftovers of a shared template. Why: this project has no Supabase, so do not wire anything to them.

### Tests and gates
- `pool: "forks"` must stay at the top level of `test` in `vitest.config.ts`. Why: a nested `forks` object is ignored, which already caused a real failure.
- `bundle-check.yml` fails when the build output exceeds 6500 KB. Why: it is the only bundle guard (the prototype's engines load from CDNs and do not count).
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
- The design source of truth is `~/design-redesign/nadavc-ai`: the prototype `demos/site-v1`, the owner decisions `ANSWERS.md`, the copy `COPY-FULL.md`. Change the prototype there, then port it with `scripts/port/sync.py`. Why: the decisions and copy are settled there with the owner, and the sync keeps the two in step.
- The night (A) and day (B) looks are the prototype's `css/looks.css` scopes; the visitor's switch sits in the header. Why: Nadav kept both looks as a light/dark choice (ANSWERS #51).
- Launch gates stay as placeholders until Nadav closes them: the legal entity name, the AI-check monthly cap, client consents (RetroBarber, חתום בנשיקה, the social clients), Google Play links, hello@nadavc.ai. Why: they are his decisions, and inventing them would publish false facts.
