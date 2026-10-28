# app

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
Next.js App Router tree. Localized pages live under `[locale]/`. Locale-independent routes (API, sitemap, robots, global error) sit at the top level.

## Key Files
| File | Description |
|------|-------------|
| `[locale]/layout.tsx` | Root layout: `dir` per locale, import map, before-paint scripts, Google Fonts, JSON-LD (keeps the Prof. Nadav Cohen disambiguation), the `__t` strings |
| `[locale]/[[...slug]]/page.tsx` | The 16 pages: static params, per-page metadata with hreflang and the page's OG image, `PageShell` |
| `[locale]/site-port.css` | Styles the port adds to the prototype CSS |
| `[locale]/error.tsx`, `not-found.tsx` | Error and 404 pages from the deck's `error.*` and `404.*` strings |
| `global-error.tsx` | Root error boundary; reads the locale from the URL and its strings from `messages/error.json` |
| `api/newsletter/route.ts` | POST email signup with validation and per-IP rate limit, in memory (not linked from the redesign) |
| `sitemap.ts` | The 16 pages per locale with hreflang |
| `robots.ts` | Allows AI search bots, blocks training-only crawlers |

## For AI Agents

### Working In This Directory
- Every page that shows UI belongs under `[locale]/`, and `proxy.ts` only matches `/` and `/(he|en)/...`. Read `params` as a Promise (`const { locale } = await params`).
- Page links are plain `<a>` built with `pathFor()`: every page is a full load, so a page's module never outlives it.
- Per-page metadata sets `canonical` and `languages` alternates for both locales.
- `global-error.tsx` cannot use `useTranslations`.

### Testing Requirements
No tests live here. Check route changes in the browser in both `/he` (RTL) and `/en`.

## Dependencies

### Internal
`@/i18n/routing`, `@/lib/site/*`, `@/components/site/*`, `messages/*.json`.

### External
`next-intl`.

## Manual Notes
