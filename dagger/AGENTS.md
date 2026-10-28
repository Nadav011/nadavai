# dagger

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
A Dagger CI module (`ci-pipeline`) with its own `package.json`, kept apart from the app. It is excluded from the root `tsconfig.json`.

## Key Files
| File | Description |
|------|-------------|
| `src/index.ts` | Pipeline functions `base`, `typecheck`, `lint`, `test`, `security` (Trivy), `ci`, `build`; comments are in Hebrew |
| `package.json` | `@dagger.io/dagger`, Biome for its own lint |

## For AI Agents

### Working In This Directory
- This is a generic template copied between projects. Its `lint()` step says Biome, while the app lints with ESLint, so check what a step actually runs before relying on it.
- Run it with `dagger call ci` from the repo root (`dagger.json` points here). `.github/workflows/ci-dagger.yml` is the workflow that uses it.

## Manual Notes
