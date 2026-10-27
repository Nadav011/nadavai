# ui

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
shadcn/ui primitives installed through `components.json` at the repo root.

## Key Files
| File | Description |
|------|-------------|
| `button.tsx` | `Button` with `class-variance-authority` variants and Radix `Slot` |
| `command.tsx` | cmdk wrappers used by `command-palette.tsx` |
| `dialog.tsx` | Radix Dialog wrappers (used by `command.tsx`) |
| `sonner.tsx` | Toast container |

## For AI Agents

### Working In This Directory
- Add primitives with the shadcn CLI rather than by hand, so `components.json` stays the source of the setup.
- These files use single quotes, unlike the rest of `components/`. Keep each file in its own style.
- Colors come from the OKLCH tokens in `app/globals.css` (the "shadcn compat" block), so don't hardcode colors here.

## Dependencies

### External
`@radix-ui/react-dialog`, `@radix-ui/react-slot`, `cmdk`, `sonner`, `class-variance-authority`.

## Manual Notes
