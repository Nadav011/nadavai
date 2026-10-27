# .github

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-27 · **Updated:** 2026-10-27

## Purpose
GitHub configuration: code owners, PR labels and Actions workflows.

## Key Files
| File | Description |
|------|-------------|
| `CODEOWNERS` | Review ownership |
| `labeler.yml` | Path-to-label rules for `pr-auto-label.yml` |
| `workflows/ci.yml` | Main gate: typecheck, lint and tests in parallel, then build |
| `workflows/ci-dagger.yml` | The same gate through the `dagger/` module; its deploy job is commented out |
| `workflows/lighthouse.yml`, `accessibility.yml`, `bundle-check.yml` | Performance, a11y and bundle-size checks (`.lighthouserc.cjs` at the root) |
| `workflows/security-scan.yml`, `medusa-scan.yml`, `trivy-autofix.yml`, `dependency-review.yml`, `license-check.yml` | Security and dependency scanning |
| `workflows/mutation-testing.yml`, `coverage-gate.yml` | Stryker and the coverage thresholds |
| `workflows/semantic-release.yml`, `changelog.yml` | Releases (`.releaserc.json`) and `CHANGELOG.md` |

The remaining workflows (`ai-self-heal`, `dead-code-cleanup`, `circular-deps`, `code-quality`, `dependency-health`, `lockfile-sync`, `cache-cleanup`, `runner-health-check`) are maintenance jobs.

## For AI Agents

### Working In This Directory
- Jobs run on self-hosted runners labeled `[self-hosted, linux, x64, pop-os]`. Node comes from the runner's fnm install, and pnpm comes from corepack.
- Pin third-party actions by commit SHA with the version in a comment, as the existing steps do.
- `ci.yml` ignores pushes that change only `**.md` files.

## Manual Notes
