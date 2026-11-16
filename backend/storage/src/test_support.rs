//! Helpers shared by the repository tests (real database, no R2 calls).

use anyhow::Result;
use aws_config::BehaviorVersion;
use aws_sdk_s3::Client;
use shared::config::Config;
use uuid::Uuid;

use crate::repository::Repository;

pub async fn test_repository(pool: sqlx::PgPool) -> Repository {
    Repository::new(
        pool,
        Client::new(&aws_config::load_defaults(BehaviorVersion::latest()).await),
        Config {
            host: "test".into(),
            env: "dev".into(),
            cf_access_team_domain: "test.cloudflareaccess.com".into(),
            cf_access_aud: "test_aud".into(),
            blog_r2_bucket: "test_bucket".into(),
        },
    )
}

pub async fn insert_user(pool: &sqlx::PgPool) -> Result<Uuid> {
    let id = Uuid::now_v7();
    sqlx::query("INSERT INTO users (id, name, email, role) VALUES ($1, $2, $3, 'admin')")
        .bind(id)
        .bind(format!("user-{id}"))
        .bind(format!("{id}@example.com"))
        .execute(pool)
        .await?;
    Ok(id)
}

pub async fn insert_activity(pool: &sqlx::PgPool, user_id: Uuid) -> Result<i64> {
    let id: i64 = sqlx::query_scalar(
        "INSERT INTO activity (user_id, name, started_at) VALUES ($1, 'a', '2026-05-10 09:00:00') RETURNING id",
    )
    .bind(user_id)
    .fetch_one(pool)
    .await?;
    Ok(id)
}
