use super::super::model::user::{User, UserProfileUpdate};
use crate::errors::repo_error::RepoError;
use async_trait::async_trait;
use uuid::Uuid;

#[async_trait]
pub trait UserRepository: Send + Sync {
    async fn get_user_by_email(&self, email: &str) -> Result<User, RepoError>;
    async fn get_user_by_name(&self, name: &str) -> Result<User, RepoError>;
    async fn update_user_profile(
        &self,
        id: Uuid,
        profile: UserProfileUpdate,
    ) -> Result<User, RepoError>;
}
