# lib

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
Non-UI modules shared by pages and components.

## Key Files
| File | Description |
|------|-------------|
| `blog.ts` | Server-only MDX reader (`fs`): `getAllPosts()` (sorted by date, newest first), `getPostBySlug()`, `getAllSlugs()`; also blocks path traversal in slugs |
| `sound.ts` | UI sounds (`hover`, `click`, `whoosh`, `success`) from `public/sounds/`; imports Howler only after the user enables sound; muted by default, preference saved in `localStorage` under `nadavai-sound-enabled`, silent under reduced motion |
| `utils.ts` | `cn()` = `twMerge(clsx(...))` |
| `*.test.ts` | Unit tests for `sound.ts` and `utils.ts` |

## For AI Agents

### Working In This Directory
- `blog.ts` uses `fs`, so call it only from server components and route handlers.
- `sound.ts` is `"use client"`. Keep Howler a dynamic import so it stays out of the initial bundle.

### Testing Requirements
`pnpm vitest related lib/<file>.ts --run`. Property tests for `cn` live in `test/utils.prop.test.ts`.

## Dependencies

### External
`gray-matter`, `reading-time`, `howler`, `clsx`, `tailwind-merge`.

## Manual Notes
