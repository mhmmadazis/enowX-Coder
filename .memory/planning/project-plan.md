# enowX-Coder Project Plan

**Status**: 🚧 In Progress
**Last Updated**: 2026-03-08 00:00
**Related**: `planning/plan-visualizer-app.md`

## Summary
Full project plan created via brainstorming session. enowX-Coder is an AI orchestration desktop app: multi-project chat, agent monitoring, skills management, provider config. 4 phases, ~6 weeks to MVP.

## Vision
AI orchestration platform — not just a chat app. Direct LLM API (custom provider first), Tauri desktop, Rust backend, React frontend with 3-panel layout.

## Architecture Decisions
- **Tauri 2** over Electron (size, performance, Rust)
- **Direct LLM API** — no middleware, custom provider prioritized
- **Streaming via Tauri events** — `app.emit('chat-token')` per token
- **Zustand** — separate stores: useProjectStore, useSessionStore, useChatStore, useSettingsStore, useAgentStore
- **SQLite via sqlx** — projects, sessions, messages, providers, agent_runs
- **CSS Grid** app shell — 3-panel, no docking library for MVP
- **Provider trait** in Rust — pluggable LLM backends

## Phases
| Phase | Scope | Target | Status |
|---|---|---|---|
| 1 — Foundation | App shell, Rust structure, SQLite, Zustand | Mar 7–14 | 🚧 20% |
| 2 — Core Chat | Streaming, multi-session, context, rendering | Mar 15–28 | ⏳ |
| 3 — Orchestration | Agent monitor, skills manager, metrics | Mar 29–Apr 11 | ⏳ |
| 4 — Polish | Onboarding, error states, shortcuts, v0.1.0 | Apr 12–20 | ⏳ |

## Layout (3-panel CSS Grid)
```
┌──────────┬──────────────────────┬──────────┐
│  Left    │       Header         │  Right   │
│ Sidebar  ├──────────────────────┤ Sidebar  │
│ 220px    │    Chat Area         │  280px   │
│          │  (centered, max-w)   │          │
│ Projects ├──────────────────────┤ Agents   │
│ Sessions │       Footer         │ Skills   │
│ Settings │       32-40px        │ Metrics  │
└──────────┴──────────────────────┴──────────┘
```

## Data Model (SQLite)
- `Project` — id, name, path, timestamps
- `Session` — id, project_id, title (auto-gen), model, timestamps
- `Message` — id, session_id, role, content, tokens_in, tokens_out, created_at
- `Provider` — id, name, base_url, api_key, is_default, created_at
- `AgentRun` — id, session_id, name, status, started_at, finished_at

## Next Steps (Phase 1)
- [ ] CSS Grid app shell (t1)
- [ ] Rust backend structure — commands/services/models/state/error (t2)
- [ ] SQLite + migrations (t3)
- [ ] Zustand stores (t4)
- [ ] Left sidebar UI (t5)
