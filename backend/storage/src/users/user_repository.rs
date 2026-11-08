use super::super::repository::*;
use async_trait::async_trait;
use usecase::errors::repo_error::RepoError;
use usecase::model::user::{User, UserProfileUpdate};
use usecase::repository::user::UserRepository;
use uuid::Uuid;

#[async_trait]
impl UserRepository for Repository {
    async fn get_user_by_email(&self, email: &str) -> Result<User, RepoError> {
        let user = sqlx::query_as!(
            User,
            "SELECT id, name, email, role, thumbnail, summary, place FROM users WHERE email = $1",
            email
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => {
                RepoError::NotFound(format!("User with email: {} not found", email))
            }
            _ => RepoError::Internal(format!(
                "Failed to get user by email: {}, error: {}",
                email, e
            )),
        })?;

        Ok(user)
    }

    async fn get_user_by_name(&self, name: &str) -> Result<User, RepoError> {
        let user = sqlx::query_as!(
            User,
            "SELECT id, name, email, role, thumbnail, summary, place FROM users WHERE name = $1",
            name
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => {
                RepoError::NotFound(format!("User with name: {} not found", name))
            }
            _ => RepoError::Internal(format!(
                "Failed to get user by name: {}, error: {}",
                name, e
            )),
        })?;

        Ok(user)
    }

    async fn update_user_profile(
        &self,
        id: Uuid,
        profile: UserProfileUpdate,
    ) -> Result<User, RepoError> {
        let user = sqlx::query_as!(
            User,
            "UPDATE users SET thumbnail = $2, summary = $3, place = $4 WHERE id = $1 \
             RETURNING id, name, email, role, thumbnail, summary, place",
            id,
            profile.thumbnail,
            profile.summary,
            profile.place
        )
        .fetch_one(&self.pool)
        .await
        .map_err(|e| match e {
            sqlx::Error::RowNotFound => RepoError::NotFound(format!("User {} not found", id)),
            _ => RepoError::Internal(format!("Failed to update user {}, error: {}", id, e)),
        })?;

        Ok(user)
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use anyhow::Result;
    use aws_config::BehaviorVersion;
    use aws_sdk_s3::Client;
    use shared::config::Config;

    async fn test_repository(pool: sqlx::PgPool) -> Repository {
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

    async fn insert_user(repo: &Repository, name: &str) -> Result<Uuid> {
        let id = Uuid::now_v7();
        sqlx::query("INSERT INTO users (id, name, email, role) VALUES ($1, $2, $3, 'admin')")
            .bind(id)
            .bind(name)
            .bind(format!("{name}@example.com"))
            .execute(&repo.pool)
            .await?;
        Ok(id)
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn test_update_user_profile_and_get_by_name(pool: sqlx::PgPool) -> Result<()> {
        let repo = test_repository(pool).await;
        let id = insert_user(&repo, "nawa").await?;
        insert_user(&repo, "other").await?;

        let updated = repo
            .update_user_profile(
                id,
                UserProfileUpdate {
                    thumbnail: Some("https://example.com/a.png".into()),
                    summary: Some("summary".into()),
                    place: Some("Tokyo".into()),
                },
            )
            .await?;
        assert_eq!(updated.id, id);
        assert_eq!(updated.place.as_deref(), Some("Tokyo"));

        let fetched = repo.get_user_by_name("nawa").await?;
        assert_eq!(
            fetched.thumbnail.as_deref(),
            Some("https://example.com/a.png")
        );
        assert_eq!(fetched.summary.as_deref(), Some("summary"));

        // 他のユーザーは更新されない
        let other = repo.get_user_by_name("other").await?;
        assert!(other.summary.is_none());
        Ok(())
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn test_update_user_profile_can_clear_fields(pool: sqlx::PgPool) -> Result<()> {
        let repo = test_repository(pool).await;
        let id = insert_user(&repo, "nawa").await?;
        repo.update_user_profile(
            id,
            UserProfileUpdate {
                thumbnail: None,
                summary: Some("x".into()),
                place: Some("y".into()),
            },
        )
        .await?;
        let cleared = repo
            .update_user_profile(
                id,
                UserProfileUpdate {
                    thumbnail: None,
                    summary: None,
                    place: None,
                },
            )
            .await?;
        assert!(cleared.summary.is_none() && cleared.place.is_none());
        Ok(())
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn test_user_not_found(pool: sqlx::PgPool) -> Result<()> {
        let repo = test_repository(pool).await;
        assert!(matches!(
            repo.get_user_by_name("nobody").await,
            Err(RepoError::NotFound(_))
        ));
        assert!(matches!(
            repo.update_user_profile(
                Uuid::now_v7(),
                UserProfileUpdate {
                    thumbnail: None,
                    summary: None,
                    place: None
                }
            )
            .await,
            Err(RepoError::NotFound(_))
        ));
        Ok(())
    }
}
