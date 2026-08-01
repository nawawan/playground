use async_trait::async_trait;

use crate::model::trajectory::{Trajectory};
use crate::errors::app_error::AppError;
use crate::model::activity::Activity;

#[async_trait]
pub trait TrajectoryRepository: Send + Sync {
    async fn create_trajectory(&self, trajectory: Trajectory) -> Result<Trajectory, AppError>;
    async fn upload_trajectory(&self, trajectory: Trajectory) -> Result<Trajectory, AppError>;
    async fn get_trajectory(&self, activity_id: String, zoom_level: i32) -> Result<Trajectory, AppError>;

    async fn create_activity(&self, tx: &mut sqlx::Transaction<'_, sqlx::Postgres>, activity: Activity) -> Result<Activity, AppError>;
    async fn get_activity(&self, activity_id: String) -> Result<Activity, AppError>;
    async fn list_activities(&self, user_id: String) -> Vec<Activity>;
}