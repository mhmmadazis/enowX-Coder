# AI Skills Setup

**Status**: ✅ Complete
**Last Updated**: 2026-03-08 00:00
**Related**: `setup/agents-rules.md`

## Summary
5 skills created in `.claude/skills/`. 4 are passive-but-always-active (enforced via AGENTS.md). 1 is on-demand.

## Skills Created

### git-master
- **Path**: `.claude/skills/git-master/SKILL.md`
- **Trigger**: Any git operation, commit, branch, or `.gitignore` change
- **Covers**: Conventional Commits, trunk-based dev, branch lifecycle, gitignore hygiene, remote ops

### enowx-rust
- **Path**: `.claude/skills/enowx-rust/SKILL.md`
- **Trigger**: Any Rust code in `src-tauri/`
- **Covers**: Tauri patterns, AppError/thiserror, commands-as-thin-wrappers, async, serde camelCase, sqlx

### plan-visualizer
- **Path**: `.claude/skills/plan-visualizer/SKILL.md`
- **Trigger**: Alongside brainstorming + mnemosyne
- **Covers**: Writes to `.plans/src/data/plan.json`, full schema reference, workflow for updating kanban/phases/ERD

### mnemosyne
- **Path**: `.claude/skills/mnemosyne/SKILL.md`
- **Trigger**: After any task completion with file edits + verification
- **Covers**: Write `.memory/` files, update session-summary.md

### systematic-debugging (pre-installed)
- **Trigger**: Any bug/error/test failure
- **Covers**: Root cause first, no symptom fixes

### brainstorming (pre-installed)
- **Trigger**: Before any new feature implementation
- **Covers**: Explore intent, propose 2-3 approaches, validate design in sections

## Packages
- `git-master.zip`, `enowx-rust.zip`, `plan-visualizer.zip` in `.claude/skills/`

## Next Steps
- [ ] Create `enowx-fe` skill when frontend patterns are established
