# public

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
Static files served from the site root.

## Key Files
| File | Description |
|------|-------------|
| `manifest.json` | PWA manifest, referenced from the layout metadata |
| `icon-*.png`, `icon-*.svg` | App icons (192, 512, maskable 512) |
| `llms.txt` | Site summary for LLM crawlers |
| `sounds/*.mp3` | `hover`, `click`, `whoosh`, `success`, the files mapped in `lib/sound.ts` |

## For AI Agents

### Working In This Directory
- Renaming a sound file means updating `SOUND_FILES` in `lib/sound.ts`.
- Facts in `llms.txt` (projects, numbers, contact details) duplicate the layout's JSON-LD, so a change in one should be made in the other too.

## Manual Notes
