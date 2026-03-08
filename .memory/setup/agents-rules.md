# AGENTS.md Rules

**Status**: ✅ Complete
**Last Updated**: 2026-03-08 00:00
**Related**: `setup/skills.md`

## Summary
`AGENTS.md` at project root defines 5 always-active rules for OpenCode. Loaded automatically every session — no manual skill loading needed for these.

## Rules Defined

| # | Trigger | Skill | Key Behavior |
|---|---|---|---|
| 1 | Any git op / gitignore change | `git-master` | Conventional Commits, trunk-based, `git add -p` |
| 2 | Any bug/error/failure | `systematic-debugging` | Root cause before fix, no random changes |
| 3 | Before new feature | `brainstorming` | Explore intent, 2-3 approaches, validate sections |
| 4 | After task completion | `mnemosyne` | Write `.memory/`, update session-summary.md |
| 5 | Alongside brainstorming | `plan-visualizer` | Read then write `.plans/src/data/plan.json` |

## File Location
- `AGENTS.md` — project root, tracked in git
- Removed `AGENTS.md` from `.gitignore` (was accidentally excluded)

## Code Standards in AGENTS.md
- Rust: `AppError` + thiserror, no `unwrap()`, async commands, `camelCase` serde, clippy clean
- TypeScript: strict, no `as any`, no `@ts-ignore`
