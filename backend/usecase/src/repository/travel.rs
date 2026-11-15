use async_trait::async_trait;
use uuid::Uuid;

use crate::errors::repo_error::RepoError;
use crate::model::travel::Travel;

#[async_trait]
pub trait TravelRepository: Send + Sync {
    async fn create_travel(&self, user_id: Uuid, name: &str) -> Result<Travel, RepoError>;
    async fn list_travels(&self) -> Result<Vec<Travel>, RepoError>;
    async fn update_travel(&self, travel_id: i64, name: &str) -> Result<Travel, RepoError>;
    /// Deletes the travel; its activities become standalone (`travel_id = NULL`).
    async fn delete_travel(&self, travel_id: i64) -> Result<(), RepoError>;
    /// Attaches the activity to a travel, or detaches it with `None`.
    async fn set_activity_travel(
        &self,
        activity_id: i64,
        travel_id: Option<i64>,
    ) -> Result<(), RepoError>;
}
