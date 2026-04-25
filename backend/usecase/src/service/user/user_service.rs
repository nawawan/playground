use async_trait::async_trait;

use crate::errors::app_error::AppError;
use crate::model::user::User;
use crate::service::service::Service;

#[async_trait]
pub trait UserService {
    async fn get_user_by_email(&self, email: &str) -> Result<User, AppError>;
}

#[async_trait]
impl UserService for Service {
    async fn get_user_by_email(&self, email: &str) -> Result<User, AppError> {
        let user = self.repository.get_user_by_email(email).await?;
        Ok(user)
    }
}
