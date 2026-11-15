use async_trait::async_trait;
use tracing::error;
use uuid::Uuid;

use crate::repository::Repository;
use usecase::errors::repo_error::RepoError;
use usecase::model::travel::Travel;
use usecase::repository::travel::TravelRepository;

#[derive(sqlx::FromRow)]
struct TravelRow {
    id: i64,
    user_id: Uuid,
    name: String,
}

impl From<TravelRow> for Travel {
    fn from(row: TravelRow) -> Self {
        Travel {
            id: row.id,
            user_id: row.user_id,
            name: row.name,
        }
    }
}

#[async_trait]
impl TravelRepository for Repository {
    async fn create_travel(&self, user_id: Uuid, name: &str) -> Result<Travel, RepoError> {
        let row: TravelRow = sqlx::query_as(
            "INSERT INTO travel (user_id, name) VALUES ($1, $2) RETURNING id, user_id, name",
        )
        .bind(user_id)
        .bind(name)
        .fetch_one(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to create travel: {}", e);
            RepoError::Internal("Failed to create travel".to_string())
        })?;
        Ok(row.into())
    }

    async fn list_travels(&self) -> Result<Vec<Travel>, RepoError> {
        let rows: Vec<TravelRow> =
            sqlx::query_as("SELECT id, user_id, name FROM travel ORDER BY id")
                .fetch_all(&self.pool)
                .await
                .map_err(|e| {
                    error!("Failed to list travels: {}", e);
                    RepoError::Internal("Failed to list travels".to_string())
                })?;
        Ok(rows.into_iter().map(Travel::from).collect())
    }

    async fn update_travel(&self, travel_id: i64, name: &str) -> Result<Travel, RepoError> {
        let row: Option<TravelRow> = sqlx::query_as(
            "UPDATE travel SET name = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, user_id, name",
        )
        .bind(travel_id)
        .bind(name)
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to update travel: {}", e);
            RepoError::Internal("Failed to update travel".to_string())
        })?;
        row.map(Travel::from)
            .ok_or_else(|| RepoError::NotFound(format!("Travel with id: {} not found", travel_id)))
    }

    async fn delete_travel(&self, travel_id: i64) -> Result<(), RepoError> {
        // activity.travel_id is ON DELETE SET NULL: the activities stay.
        let result = sqlx::query("DELETE FROM travel WHERE id = $1")
            .bind(travel_id)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to delete travel: {}", e);
                RepoError::Internal("Failed to delete travel".to_string())
            })?;
        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!(
                "Travel with id: {} not found",
                travel_id
            )));
        }
        Ok(())
    }

    async fn set_activity_travel(
        &self,
        activity_id: i64,
        travel_id: Option<i64>,
    ) -> Result<(), RepoError> {
        let result = sqlx::query("UPDATE activity SET travel_id = $2 WHERE id = $1")
            .bind(activity_id)
            .bind(travel_id)
            .execute(&self.pool)
            .await
            .map_err(|e| match &e {
                sqlx::Error::Database(db) if db.is_foreign_key_violation() => {
                    RepoError::NotFound(format!("Travel with id: {:?} not found", travel_id))
                }
                _ => {
                    error!("Failed to set travel of activity: {}", e);
                    RepoError::Internal("Failed to set travel of activity".to_string())
                }
            })?;
        if result.rows_affected() == 0 {
            return Err(RepoError::NotFound(format!(
                "Activity with id: {} not found",
                activity_id
            )));
        }
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_support::{insert_activity, insert_user, test_repository};
    use anyhow::Result;

    async fn travel_id_of(pool: &sqlx::PgPool, activity_id: i64) -> Result<Option<i64>> {
        Ok(
            sqlx::query_scalar("SELECT travel_id FROM activity WHERE id = $1")
                .bind(activity_id)
                .fetch_one(pool)
                .await?,
        )
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn travel_crud_round_trip(pool: sqlx::PgPool) -> Result<()> {
        let user_id = insert_user(&pool).await?;
        let repo = test_repository(pool).await;

        let travel = repo.create_travel(user_id, "戸隠").await?;
        assert_eq!(travel.name, "戸隠");
        assert_eq!(repo.list_travels().await?.len(), 1);

        let renamed = repo.update_travel(travel.id, "戸隠 2日間").await?;
        assert_eq!(renamed.name, "戸隠 2日間");

        repo.delete_travel(travel.id).await?;
        assert!(repo.list_travels().await?.is_empty());
        assert!(matches!(
            repo.delete_travel(travel.id).await,
            Err(RepoError::NotFound(_))
        ));
        assert!(matches!(
            repo.update_travel(travel.id, "x").await,
            Err(RepoError::NotFound(_))
        ));
        Ok(())
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn attaches_and_detaches_activities(pool: sqlx::PgPool) -> Result<()> {
        let user_id = insert_user(&pool).await?;
        let activity_id = insert_activity(&pool, user_id).await?;
        let repo = test_repository(pool.clone()).await;
        let travel = repo.create_travel(user_id, "t").await?;

        repo.set_activity_travel(activity_id, Some(travel.id))
            .await?;
        assert_eq!(travel_id_of(&pool, activity_id).await?, Some(travel.id));

        repo.set_activity_travel(activity_id, None).await?;
        assert_eq!(travel_id_of(&pool, activity_id).await?, None);
        Ok(())
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn rejects_unknown_travel_and_activity(pool: sqlx::PgPool) -> Result<()> {
        let user_id = insert_user(&pool).await?;
        let activity_id = insert_activity(&pool, user_id).await?;
        let repo = test_repository(pool).await;

        assert!(matches!(
            repo.set_activity_travel(activity_id, Some(999)).await,
            Err(RepoError::NotFound(_))
        ));
        assert!(matches!(
            repo.set_activity_travel(999, None).await,
            Err(RepoError::NotFound(_))
        ));
        Ok(())
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn deleting_a_travel_keeps_its_activities(pool: sqlx::PgPool) -> Result<()> {
        let user_id = insert_user(&pool).await?;
        let activity_id = insert_activity(&pool, user_id).await?;
        let repo = test_repository(pool.clone()).await;
        let travel = repo.create_travel(user_id, "t").await?;
        repo.set_activity_travel(activity_id, Some(travel.id))
            .await?;

        repo.delete_travel(travel.id).await?;
        assert_eq!(travel_id_of(&pool, activity_id).await?, None);
        Ok(())
    }
}
