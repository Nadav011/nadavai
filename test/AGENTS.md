# test

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
Global Vitest setup and tests that are not tied to a single module. Most unit tests sit next to their source file (`lib/*.test.ts`, `i18n/*.test.ts`).

## Key Files
| File | Description |
|------|-------------|
| `setup.ts` | Loads jest-dom matchers; sets a fixed fast-check seed (`42`; run count from `FC_NUM_RUNS`, default 100); mocks `matchMedia`, `ResizeObserver`, `IntersectionObserver`, `scrollIntoView`, `crypto.randomUUID` |
| `smoke.test.ts` | Checks that Vitest and jsdom run |
| `utils.prop.test.ts` | fast-check property tests for `cn()` |

## For AI Agents

### Working In This Directory
- Name property-based tests `*.prop.test.ts`.
- A browser API a component needs under jsdom gets mocked in `setup.ts`, not in each test.
- Stryker mutation testing (`stryker.config.json`) uses the same Vitest setup.

## Dependencies

### External
`vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `fast-check`, `@fast-check/vitest`, `jsdom`.

## Manual Notes
