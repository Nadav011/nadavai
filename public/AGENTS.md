# public

**Parent context:** `../AGENTS.md`
**Updated:** 2026-10-27

## Purpose
Static files served from the site root.

## Key Files
| File | Description |
|------|-------------|
| `site/**` | The prototype's CSS, JS modules and assets, written by `scripts/port/sync.py`. Never edit by hand |
| `manifest.json` | PWA manifest |
| `icon-*.png`, `icon-*.svg` | App icons. They are still the old brand's icons |
| `llms.txt` | Site summary for LLM crawlers, built from the English deck strings |

## For AI Agents

### Working In This Directory
- Facts in `llms.txt` duplicate the layout's JSON-LD, so a change in one is made in the other too.
