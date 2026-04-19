use super::super::model::user::User;
use crate::errors::repo_error::RepoError;
use async_trait::async_trait;

#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn get_user_by_email(&self, email: &str) -> Result<User, RepoError>;
}
