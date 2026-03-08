use sqlx::SqlitePool;

use crate::{
    error::AppResult,
    models::AgentRun,
};

pub async fn list_agent_runs(db: &SqlitePool, session_id: &str) -> AppResult<Vec<AgentRun>> {
    let runs = sqlx::query_as::<_, AgentRun>(
        "SELECT id, session_id, agent_type, status, input, output, error, started_at, completed_at, created_at FROM agent_runs WHERE session_id = ?1 ORDER BY created_at DESC",
    )
    .bind(session_id)
    .fetch_all(db)
    .await?;

    Ok(runs)
}
