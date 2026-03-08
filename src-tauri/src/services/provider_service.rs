use sqlx::SqlitePool;
use uuid::Uuid;

use crate::{
    error::{AppError, AppResult},
    models::Provider,
};

use super::now_rfc3339;

pub async fn list_providers(db: &SqlitePool) -> AppResult<Vec<Provider>> {
    let providers = sqlx::query_as::<_, Provider>(
        "SELECT id, name, provider_type, base_url, api_key, model, is_default, created_at, updated_at FROM providers ORDER BY is_default DESC, updated_at DESC",
    )
    .fetch_all(db)
    .await?;

    Ok(providers)
}

pub async fn create_provider(
    db: &SqlitePool,
    name: &str,
    provider_type: &str,
    base_url: &str,
    api_key: Option<&str>,
    model: &str,
) -> AppResult<Provider> {
    let normalized_name = name.trim();
    let normalized_provider_type = provider_type.trim();
    let normalized_base_url = base_url.trim().trim_end_matches('/');
    let normalized_model = model.trim();

    if normalized_name.is_empty()
        || normalized_provider_type.is_empty()
        || normalized_base_url.is_empty()
        || normalized_model.is_empty()
    {
        return Err(AppError::Validation(
            "Provider name, type, base URL, and model are required".to_string(),
        ));
    }

    let now = now_rfc3339();
    let provider = Provider {
        id: Uuid::new_v4().to_string(),
        name: normalized_name.to_string(),
        provider_type: normalized_provider_type.to_string(),
        base_url: normalized_base_url.to_string(),
        api_key: api_key.map(std::string::ToString::to_string),
        model: normalized_model.to_string(),
        is_default: false,
        created_at: now.clone(),
        updated_at: now,
    };

    sqlx::query(
        "INSERT INTO providers (id, name, provider_type, base_url, api_key, model, is_default, created_at, updated_at) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
    )
    .bind(&provider.id)
    .bind(&provider.name)
    .bind(&provider.provider_type)
    .bind(&provider.base_url)
    .bind(&provider.api_key)
    .bind(&provider.model)
    .bind(provider.is_default)
    .bind(&provider.created_at)
    .bind(&provider.updated_at)
    .execute(db)
    .await?;

    Ok(provider)
}

pub async fn update_provider(
    db: &SqlitePool,
    id: &str,
    name: &str,
    base_url: &str,
    api_key: Option<&str>,
    model: &str,
) -> AppResult<()> {
    let normalized_name = name.trim();
    let normalized_base_url = base_url.trim().trim_end_matches('/');
    let normalized_model = model.trim();

    if normalized_name.is_empty() || normalized_base_url.is_empty() || normalized_model.is_empty() {
        return Err(AppError::Validation(
            "Provider name, base URL, and model are required".to_string(),
        ));
    }

    let now = now_rfc3339();
    let result = sqlx::query(
        "UPDATE providers SET name = ?1, base_url = ?2, api_key = ?3, model = ?4, updated_at = ?5 WHERE id = ?6",
    )
    .bind(normalized_name)
    .bind(normalized_base_url)
    .bind(api_key)
    .bind(normalized_model)
    .bind(&now)
    .bind(id)
    .execute(db)
    .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Provider not found: {id}")));
    }

    Ok(())
}

pub async fn delete_provider(db: &SqlitePool, id: &str) -> AppResult<()> {
    let result = sqlx::query("DELETE FROM providers WHERE id = ?1")
        .bind(id)
        .execute(db)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Provider not found: {id}")));
    }

    Ok(())
}

pub async fn set_default_provider(db: &SqlitePool, id: &str) -> AppResult<()> {
    let now = now_rfc3339();
    let mut tx = db.begin().await?;

    sqlx::query("UPDATE providers SET is_default = 0, updated_at = ?1")
        .bind(&now)
        .execute(&mut *tx)
        .await?;

    let result = sqlx::query("UPDATE providers SET is_default = 1, updated_at = ?1 WHERE id = ?2")
        .bind(&now)
        .bind(id)
        .execute(&mut *tx)
        .await?;

    if result.rows_affected() == 0 {
        return Err(AppError::NotFound(format!("Provider not found: {id}")));
    }

    tx.commit().await?;
    Ok(())
}

pub async fn get_provider_for_chat(db: &SqlitePool, provider_id: Option<&str>) -> AppResult<Provider> {
    if let Some(id) = provider_id {
        let provider = sqlx::query_as::<_, Provider>(
            "SELECT id, name, provider_type, base_url, api_key, model, is_default, created_at, updated_at FROM providers WHERE id = ?1",
        )
        .bind(id)
        .fetch_optional(db)
        .await?;

        return provider.ok_or_else(|| AppError::NotFound(format!("Provider not found: {id}")));
    }

    let provider = sqlx::query_as::<_, Provider>(
        "SELECT id, name, provider_type, base_url, api_key, model, is_default, created_at, updated_at FROM providers WHERE is_default = 1 ORDER BY updated_at DESC LIMIT 1",
    )
    .fetch_optional(db)
    .await?;

    provider.ok_or_else(|| AppError::NotFound("No default provider configured".to_string()))
}
