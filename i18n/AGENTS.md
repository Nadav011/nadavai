# i18n

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
next-intl configuration: which locales exist, and how each request gets its messages.

## Key Files
| File | Description |
|------|-------------|
| `routing.ts` | `locales: ["he", "en"]`, `defaultLocale: "he"`; exports locale-aware `Link`, `redirect`, `usePathname`, `useRouter`, `getPathname` |
| `request.ts` | Loads `messages/<locale>.json` and falls back to the default locale |
| `routing.test.ts` | Asserts the routing config by mocking `next-intl/routing` and `next-intl/navigation` (they need Next internals jsdom lacks) |

## For AI Agents

### Working In This Directory
- Adding a locale touches more than `routing.ts`. You also need:
  - the matcher in `proxy.ts`
  - the `"he" | "en"` casts in `request.ts` and `app/[locale]/layout.tsx`
  - the `getDirection()` logic in that layout
  - the hreflang maps in the pages and the sitemap
  - a new `messages/<locale>.json`
- Import navigation helpers from here, not from `next/link` or `next/navigation`.

### Testing Requirements
`pnpm vitest run i18n/routing.test.ts`.

## Dependencies

### External
`next-intl`.

## Manual Notes
