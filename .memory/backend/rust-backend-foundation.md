# Rust Backend Foundation (Tauri 2)

**Date**: 2026-03-08
**Status**: ✅ Completed

## Scope
Implemented complete backend foundation for `src-tauri/` with models, services, commands, app state, migrations, and startup wiring.

## Files Added
- `src-tauri/src/error.rs`
- `src-tauri/src/state.rs`
- `src-tauri/src/models/mod.rs`
- `src-tauri/src/models/project.rs`
- `src-tauri/src/models/session.rs`
- `src-tauri/src/models/message.rs`
- `src-tauri/src/models/provider.rs`
- `src-tauri/src/models/agent_run.rs`
- `src-tauri/src/commands/mod.rs`
- `src-tauri/src/commands/project.rs`
- `src-tauri/src/commands/session.rs`
- `src-tauri/src/commands/chat.rs`
- `src-tauri/src/commands/provider.rs`
- `src-tauri/src/commands/agent.rs`
- `src-tauri/src/services/mod.rs`
- `src-tauri/src/services/project_service.rs`
- `src-tauri/src/services/session_service.rs`
- `src-tauri/src/services/chat_service.rs`
- `src-tauri/src/services/provider_service.rs`
- `src-tauri/src/services/agent_service.rs`
- `src-tauri/migrations/20260308000_init.sql`

## Files Updated
- `src-tauri/src/lib.rs`
- `src-tauri/src/main.rs`
- `src-tauri/build.rs`
- `src-tauri/tauri.conf.json`

## Key Decisions
- `AppError` central enum with `thiserror` + `From<...>` conversions for sqlx/reqwest/serde/tauri/migration errors.
- `AppState` uses `Arc<SqlitePool>` and exposes `pool()` accessor.
- Commands are thin async wrappers that only call service functions.
- All frontend DTO structs use `#[serde(rename_all = "camelCase")]`.
- Startup performs `AppState::new(...)` + `sqlx::migrate!("./migrations").run(...)`.
- `send_message` service persists user message, resolves provider/default provider, streams SSE tokens via Tauri events (`chat-token`, `chat-done`, `chat-error`), then persists assistant message.

## Verification
- `cargo build` ✅
- `cargo clippy -- -D warnings` ✅
- LSP diagnostics for changed Rust files: no actionable diagnostics (macro parse workaround via cfg split for rust-analyzer).

## Environment Notes
- This environment lacked system WebKitGTK dev libs required by Tauri Linux build.
- Build verification was completed using temporary local pkg-config/lib path injection during command execution.

## Next Steps
- Integrate frontend calls to new IPC commands.
- Add auth/secret storage strategy for provider API keys.
- Add integration tests for services and chat streaming parser.
