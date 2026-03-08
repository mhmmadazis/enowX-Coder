use std::sync::Arc;

use sqlx::{sqlite::SqlitePoolOptions, SqlitePool};

use crate::error::AppResult;

#[derive(Clone)]
pub struct AppState {
    pub db: Arc<SqlitePool>,
}

impl AppState {
    pub async fn new(database_url: &str) -> AppResult<Self> {
        let pool = SqlitePoolOptions::new()
            .max_connections(10)
            .connect(database_url)
            .await?;

        sqlx::query("PRAGMA foreign_keys = ON")
            .execute(&pool)
            .await?;

        Ok(Self { db: Arc::new(pool) })
    }

    pub fn pool(&self) -> &SqlitePool {
        self.db.as_ref()
    }
}
