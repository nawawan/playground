use async_trait::async_trait;
use uuid::Uuid;

use crate::errors::app_error::AppError;
use crate::model::travel::Travel;
use crate::service::service::Service;

const MAX_TRAVEL_NAME_CHARS: usize = 100;

#[async_trait]
pub trait TravelService {
    async fn create_travel(&self, user_id: Uuid, name: &str) -> Result<Travel, AppError>;
    async fn list_travels(&self) -> Result<Vec<Travel>, AppError>;
    async fn update_travel(&self, travel_id: i64, name: &str) -> Result<Travel, AppError>;
    async fn delete_travel(&self, travel_id: i64) -> Result<(), AppError>;
    async fn set_activity_travel(
        &self,
        activity_id: i64,
        travel_id: Option<i64>,
    ) -> Result<(), AppError>;
}

fn validate_name(name: &str) -> Result<&str, AppError> {
    let name = name.trim();
    if name.is_empty() {
        return Err(AppError::invalid(Some("travel name must not be empty")));
    }
    if name.chars().count() > MAX_TRAVEL_NAME_CHARS {
        return Err(AppError::invalid(Some("travel name is too long")));
    }
    Ok(name)
}

#[async_trait]
impl TravelService for Service {
    async fn create_travel(&self, user_id: Uuid, name: &str) -> Result<Travel, AppError> {
        let name = validate_name(name)?;
        Ok(self.repository.create_travel(user_id, name).await?)
    }

    async fn list_travels(&self) -> Result<Vec<Travel>, AppError> {
        Ok(self.repository.list_travels().await?)
    }

    async fn update_travel(&self, travel_id: i64, name: &str) -> Result<Travel, AppError> {
        let name = validate_name(name)?;
        Ok(self.repository.update_travel(travel_id, name).await?)
    }

    async fn delete_travel(&self, travel_id: i64) -> Result<(), AppError> {
        Ok(self.repository.delete_travel(travel_id).await?)
    }

    async fn set_activity_travel(
        &self,
        activity_id: i64,
        travel_id: Option<i64>,
    ) -> Result<(), AppError> {
        Ok(self
            .repository
            .set_activity_travel(activity_id, travel_id)
            .await?)
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn trims_and_validates_the_name() {
        assert_eq!(validate_name("  戸隠 ").ok(), Some("戸隠"));
        assert!(validate_name("   ").is_err());
        assert!(validate_name(&"あ".repeat(101)).is_err());
        assert!(validate_name(&"あ".repeat(100)).is_ok());
    }
}
