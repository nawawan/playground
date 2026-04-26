use super::super::repository::*;
use async_trait::async_trait;
use usecase::errors::repo_error::RepoError;
use usecase::model::user::User;
use usecase::repository::user::UserRepository;
use uuid::Uuid;

#[async_trait]
impl UserRepository for Repository {
    async fn get_user_by_email(&self, email: &str) -> Result<User, RepoError> {
        let user = sqlx::query_as!(
            User,
            "SELECT id, name, email, role FROM users WHERE email = $1",
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
}
