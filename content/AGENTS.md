# content

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
Blog posts as MDX files in `blog/`. Each file becomes `/he/blog/<slug>` and `/en/blog/<slug>`.

## Key Files
| File | Description |
|------|-------------|
| `blog/*.mdx` | One post per file; the filename (without `.mdx`) is the slug |

## For AI Agents

### Working In This Directory
- Slugs must match `^[a-zA-Z0-9_-]+$`, or `lib/blog.ts` silently ignores the file.
- Frontmatter: `title` and `description` (Hebrew), `titleEn` and `descriptionEn` (English fallbacks), `date` (`YYYY-MM-DD`, used for sorting), `tags` (array), and optional `readingTime` (minutes; computed when missing).
- The post body is written once, in Hebrew. Only the title and description have English versions.
- Custom elements in the body must exist in `components/mdx-components.tsx`.
- The sitemap picks up new posts on its own, but `lastModified` in `app/sitemap.ts` is a fixed date.

## Dependencies

### Internal
Read by `lib/blog.ts`.

## Manual Notes
