# app

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
Next.js App Router tree. Localized pages live under `[locale]/`. Locale-independent routes (API, feed, sitemap, robots, OG image, global error) sit at the top level.

## Key Files
| File | Description |
|------|-------------|
| `[locale]/layout.tsx` | Root layout: fonts, `dir` per locale, site metadata, hreflang, JSON-LD Person/ProfilePage, `NextIntlClientProvider` |
| `[locale]/page.tsx` | Home page: hero eager, every other section through `next/dynamic` |
| `[locale]/blog/page.tsx` | Blog index from `getAllPosts()` |
| `[locale]/blog/[slug]/page.tsx` | Post page, `generateStaticParams` from `getAllSlugs()`, rendered with `MDXRemote` (RSC) |
| `[locale]/error.tsx`, `not-found.tsx`, `loading.tsx` | Localized error, 404 and loading states (`error` / `notFound` message namespaces) |
| `global-error.tsx` | Root error boundary; it sits outside the intl provider, so it guesses the locale from the URL and hardcodes its text |
| `api/newsletter/route.ts` | POST email signup: validation and per-IP rate limit, stored in an in-memory `Set` (no provider yet) |
| `feed.xml/route.ts` | RSS built from a hardcoded `PROJECTS` array, not from the blog |
| `sitemap.ts` | Home and blog URLs per locale with hreflang; `lastModified` is a fixed date |
| `robots.ts` | Allows AI search bots, blocks training-only crawlers |
| `opengraph-image.tsx` | Generated 1200×630 OG image (`runtime = "edge"`) |
| `globals.css` | Tailwind 4 entry: OKLCH tokens in `@theme inline`, section glow and divider utilities |

## For AI Agents

### Working In This Directory
- Every page that shows UI belongs under `[locale]/`, and `proxy.ts` only matches `/` and `/(he|en)/...`. Read `params` as a Promise (`const { locale } = await params`).
- Internal links use `Link` from `@/i18n/routing`, never `next/link`.
- Per-page metadata sets `canonical` and `languages` alternates for both locales, following the blog pages.
- `global-error.tsx` cannot use `useTranslations`.

### Testing Requirements
No tests live here. Check route changes in the browser in both `/he` (RTL) and `/en`.

## Dependencies

### Internal
`@/i18n/routing`, `@/lib/blog`, `@/components/*`, `messages/*.json`.

### External
`next-intl`, `next-mdx-remote/rsc`, `next-view-transitions`, `lucide-react`.

## Manual Notes
