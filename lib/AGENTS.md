# lib

**Parent context:** `../AGENTS.md`
**Updated:** 2026-10-27

## Purpose
Non-UI modules shared by pages and components.

## Key Files
| File | Description |
|------|-------------|
| `site/routes.ts` | Prototype page names to routes (`PAGE_ROUTES`), `pathFor()`, `pageForSlug()` |
| `site/copy.ts` | `getSiteCopy(locale)`: `c`, `r`, `href`, `wa` for the generated components; deck ids map to message keys with `/` |
| `site/head-script.ts` | The prototype's before-paint scripts, plus `__href`, `__page`, `__pageOf` and `__t` for the ported modules |
| `site/js-copy.ts` | The plain-text strings the modules read through `window.__t` |

## For AI Agents

### Working In This Directory
- `head-script.ts` runs before first paint as an inline script: keep it ES5, with no imports at runtime.
