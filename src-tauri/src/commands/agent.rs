use tauri::State;

use crate::{
    error::AppResult,
    models::AgentRun,
    services::agent_service,
    state::AppState,
};

#[tauri::command]
pub async fn list_agent_runs(
    state: State<'_, AppState>,
    session_id: String,
) -> AppResult<Vec<AgentRun>> {
    agent_service::list_agent_runs(state.pool(), &session_id).await
}
