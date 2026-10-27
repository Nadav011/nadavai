# messages

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
All UI strings, one JSON file per locale, loaded by `i18n/request.ts`.

## Key Files
| File | Description |
|------|-------------|
| `he.json` | Hebrew (default locale) |
| `en.json` | English |

The top-level keys are namespaces:
- page sections: `layout`, `nav`, `hero`, `services`, `projects`, `process`, `testimonials`, `blog`, `youtube`, `guides`, `resources`, `news`, `social`, `contact`, `footer`
- UI pieces: `commandPalette`, `whatsapp`, `common`, `categories`
- error pages: `error`, `notFound`

## For AI Agents

### Working In This Directory
- Every key exists in both files with the same path. A key missing in one locale shows up as a runtime error on that locale.
- Hebrew is the source text, and English is the translation.

## Manual Notes
