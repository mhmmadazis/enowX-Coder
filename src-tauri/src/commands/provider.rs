use tauri::State;

use crate::{
    error::AppResult,
    models::Provider,
    services::provider_service,
    state::AppState,
};

#[tauri::command]
pub async fn list_providers(state: State<'_, AppState>) -> AppResult<Vec<Provider>> {
    provider_service::list_providers(state.pool()).await
}

#[tauri::command]
pub async fn create_provider(
    state: State<'_, AppState>,
    name: String,
    provider_type: String,
    base_url: String,
    api_key: Option<String>,
    model: String,
) -> AppResult<Provider> {
    provider_service::create_provider(
        state.pool(),
        &name,
        &provider_type,
        &base_url,
        api_key.as_deref(),
        &model,
    )
    .await
}

#[tauri::command]
pub async fn update_provider(
    state: State<'_, AppState>,
    id: String,
    name: String,
    base_url: String,
    api_key: Option<String>,
    model: String,
) -> AppResult<()> {
    provider_service::update_provider(
        state.pool(),
        &id,
        &name,
        &base_url,
        api_key.as_deref(),
        &model,
    )
    .await
}

#[tauri::command]
pub async fn delete_provider(state: State<'_, AppState>, id: String) -> AppResult<()> {
    provider_service::delete_provider(state.pool(), &id).await
}

#[tauri::command]
pub async fn set_default_provider(state: State<'_, AppState>, id: String) -> AppResult<()> {
    provider_service::set_default_provider(state.pool(), &id).await
}
