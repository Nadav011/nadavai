# AGENTS.md — Auto-generated from Claude Code APEX System

> WARNING: This file is auto-generated. Do not edit manually.
> Source: ~/.claude/CLAUDE.md + auto-learned rules
> Sync command: /sync-agents


## Rules

1. **ZERO TRUST:** Zod validation at all boundaries, Result<T,E> pattern, 0% `any` types
2. **INFINITE SCALE:** Bundle < 100KB, code splitting mandatory
3. **IMMORTALITY:** Max 150 lines/file, self-documenting code
4. **ROI:** Query caching with TanStack Query, optimistic updates
5. **RTL-FIRST:** ms-/me-/inset-s-/inset-e- ONLY (never ml-/mr-/left-/right-)
6. **RESPONSIVE:** Mobile-first, 44x44px touch targets, 8pt grid

## RTL Requirements

- `ml-`/`mr-` -> `ms-`/`me-` | `pl-`/`pr-` -> `ps-`/`pe-`
- `text-left/right` -> `text-start/end`
- `left-`/`right-` (inset) -> `inset-s-`/`inset-e-`
- Directional icons -> `rtl:rotate-180`
- Numbers/dates: `<span dir="ltr">{number}</span>`

## Code Standards

- camelCase (vars/funcs), PascalCase (components/types), SCREAMING_SNAKE (constants)
- Max 20-30 lines per function, 150 lines per file
- TypeScript strict mode, no `any`, no `enum` (use `as const`)
- `Result<T,E>` for expected errors, not try/catch
- Prefer early returns for guard clauses

## Stack

- Next.js 16.1.6, React 19.2.4, TypeScript 5.9.3
- Tailwind CSS 4.2.1, Biome 2.4.4
- Supabase 2.97.0, TanStack Query 5.90.21
- Zod 4.3.6, Pino 10.3.1, Sentry 10.40.0

## Security

- All AI endpoints: defense-in-depth (6 layers mandatory)
- Rate limit -> Input validation -> Prompt isolation -> LLM -> Output filtering -> Monitoring
- NEVER user data in system prompts, NEVER unlimited maxSteps
- CSP: no unsafe-eval, narrow img-src to self/data/blob only

## Testing

- Vitest 4 (pool: forks, top-level config — NOT nested forks object)
- TypeScript coverage >= 90% (type-coverage --at-least 90)
- Run: `pnpm run typecheck && pnpm run lint && pnpm run test`
