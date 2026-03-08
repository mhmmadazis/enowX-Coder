use futures_util::StreamExt;
use reqwest::header::{AUTHORIZATION, CONTENT_TYPE};
use serde_json::Value;
use sqlx::SqlitePool;
use tauri::{AppHandle, Emitter};
use uuid::Uuid;

use crate::{
    error::{AppError, AppResult},
    models::Message,
};

use super::{now_rfc3339, provider_service};

pub async fn get_messages(db: &SqlitePool, session_id: &str) -> AppResult<Vec<Message>> {
    let messages = sqlx::query_as::<_, Message>(
        "SELECT id, session_id, role, content, created_at FROM messages WHERE session_id = ?1 ORDER BY created_at ASC",
    )
    .bind(session_id)
    .fetch_all(db)
    .await?;

    Ok(messages)
}

pub async fn send_message(
    db: &SqlitePool,
    session_id: &str,
    content: &str,
    provider_id: Option<&str>,
    app_handle: &AppHandle,
) -> AppResult<()> {
    let result = send_message_inner(db, session_id, content, provider_id, app_handle).await;
    if let Err(error) = &result {
        let _ = app_handle.emit("chat-error", error.to_string());
    }

    result
}

async fn send_message_inner(
    db: &SqlitePool,
    session_id: &str,
    content: &str,
    provider_id: Option<&str>,
    app_handle: &AppHandle,
) -> AppResult<()> {
    let normalized_content = content.trim();
    if normalized_content.is_empty() {
        return Err(AppError::Validation("Message content cannot be empty".to_string()));
    }

    let user_message = Message {
        id: Uuid::new_v4().to_string(),
        session_id: session_id.to_string(),
        role: "user".to_string(),
        content: normalized_content.to_string(),
        created_at: now_rfc3339(),
    };

    sqlx::query(
        "INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
    )
    .bind(&user_message.id)
    .bind(&user_message.session_id)
    .bind(&user_message.role)
    .bind(&user_message.content)
    .bind(&user_message.created_at)
    .execute(db)
    .await?;

    let provider = provider_service::get_provider_for_chat(db, provider_id).await?;
    let history = get_messages(db, session_id).await?;

    let client = reqwest::Client::new();
    let endpoint = format!("{}/chat/completions", provider.base_url.trim_end_matches('/'));

    let openai_messages: Vec<Value> = history
        .iter()
        .map(|message| {
            serde_json::json!({
                "role": message.role,
                "content": message.content,
            })
        })
        .collect();

    let payload = serde_json::json!({
        "model": provider.model,
        "messages": openai_messages,
        "stream": true,
    });

    let mut request = client
        .post(endpoint)
        .header(CONTENT_TYPE, "application/json")
        .json(&payload);

    if let Some(key) = provider.api_key.filter(|value| !value.trim().is_empty()) {
        request = request.header(AUTHORIZATION, format!("Bearer {key}"));
    }

    let response = request.send().await?;
    if !response.status().is_success() {
        let status = response.status();
        let body = response
            .text()
            .await
            .unwrap_or_else(|_| "Unable to read error body".to_string());

        return Err(AppError::Http(format!(
            "Provider request failed with status {status}: {body}"
        )));
    }

    let mut stream = response.bytes_stream();
    let mut line_buffer = String::new();
    let mut assistant_output = String::new();

    while let Some(chunk_result) = stream.next().await {
        let chunk = chunk_result?;
        line_buffer.push_str(&String::from_utf8_lossy(&chunk));

        while let Some(newline_pos) = line_buffer.find('\n') {
            let mut line = line_buffer[..newline_pos].to_string();
            line_buffer.drain(..=newline_pos);

            if line.ends_with('\r') {
                line.pop();
            }

            if handle_sse_line(&line, app_handle, &mut assistant_output)? {
                break;
            }
        }
    }

    if !line_buffer.is_empty() {
        let _ = handle_sse_line(&line_buffer, app_handle, &mut assistant_output)?;
    }

    let assistant_message = Message {
        id: Uuid::new_v4().to_string(),
        session_id: session_id.to_string(),
        role: "assistant".to_string(),
        content: assistant_output,
        created_at: now_rfc3339(),
    };

    sqlx::query(
        "INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?1, ?2, ?3, ?4, ?5)",
    )
    .bind(&assistant_message.id)
    .bind(&assistant_message.session_id)
    .bind(&assistant_message.role)
    .bind(&assistant_message.content)
    .bind(&assistant_message.created_at)
    .execute(db)
    .await?;

    let _ = app_handle.emit("chat-done", assistant_message.id.clone());
    Ok(())
}

fn handle_sse_line(line: &str, app_handle: &AppHandle, output: &mut String) -> AppResult<bool> {
    let trimmed = line.trim();
    if trimmed.is_empty() {
        return Ok(false);
    }

    let Some(payload) = trimmed.strip_prefix("data:") else {
        return Ok(false);
    };

    let payload = payload.trim();
    if payload == "[DONE]" {
        return Ok(true);
    }

    let value: Value = serde_json::from_str(payload)?;
    let token_opt = value
        .get("choices")
        .and_then(Value::as_array)
        .and_then(|choices| choices.first())
        .and_then(|choice| choice.get("delta"))
        .and_then(|delta| delta.get("content"))
        .and_then(Value::as_str);

    if let Some(token) = token_opt {
        output.push_str(token);
        let _ = app_handle.emit("chat-token", token.to_string());
    }

    Ok(false)
}
