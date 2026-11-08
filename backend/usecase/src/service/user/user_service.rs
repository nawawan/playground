use async_trait::async_trait;
use uuid::Uuid;

use crate::errors::app_error::AppError;
use crate::model::user::{User, UserProfileUpdate};
use crate::service::service::Service;

const MAX_THUMBNAIL_LEN: usize = 2048;
const MAX_SUMMARY_LEN: usize = 10_000;
const MAX_PLACE_LEN: usize = 100;

#[async_trait]
pub trait UserService {
    async fn get_user_by_email(&self, email: &str) -> Result<User, AppError>;
    async fn get_user_by_name(&self, name: &str) -> Result<User, AppError>;
    async fn update_user_profile(
        &self,
        id: Uuid,
        profile: UserProfileUpdate,
    ) -> Result<User, AppError>;
}

#[async_trait]
impl UserService for Service {
    async fn get_user_by_email(&self, email: &str) -> Result<User, AppError> {
        let user = self.repository.get_user_by_email(email).await?;
        Ok(user)
    }

    async fn get_user_by_name(&self, name: &str) -> Result<User, AppError> {
        let user = self.repository.get_user_by_name(name).await?;
        Ok(user)
    }

    async fn update_user_profile(
        &self,
        id: Uuid,
        profile: UserProfileUpdate,
    ) -> Result<User, AppError> {
        validate_len("thumbnail", &profile.thumbnail, MAX_THUMBNAIL_LEN)?;
        validate_len("summary", &profile.summary, MAX_SUMMARY_LEN)?;
        validate_len("place", &profile.place, MAX_PLACE_LEN)?;

        let user = self.repository.update_user_profile(id, profile).await?;
        Ok(user)
    }
}

fn validate_len(field: &str, value: &Option<String>, max: usize) -> Result<(), AppError> {
    match value {
        Some(v) if v.chars().count() > max => Err(AppError::invalid(Some(&format!(
            "{field} must be at most {max} characters"
        )))),
        _ => Ok(()),
    }
}
