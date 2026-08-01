use async_trait::async_trait;

use usecase::{model::activity::Activity, repository::trajectory::TrajectoryRepository};
use crate::repository::Repository;

#[async_trait]
impl TrajectoryRepository for Repository {
    // Implementation for each method would go here
    async fn create_trajectory(&self, trajectory: Trajectory) -> Result<Trajectory, AppError> {
        // Implementation for creating a trajectory
        Ok(trajectory)
    }
    async fn upload_trajectory(&self, trajectory: Trajectory) -> Result<Trajectory, AppError> {
        // Implementation for uploading a trajectory
        Ok(trajectory)
    }
    async fn get_trajectory(&self, activity_id: String, zoom_level: i32) -> Result<Trajectory, AppError> {
        // Implementation for getting a trajectory
        Ok(Trajectory { /* fields */ })  
    }

    async fn create_activity(&self, tx: &mut sqlx::Transaction<'_, sqlx::Postgres>, activity: Activity) -> Result<Activity, AppError> {
        // Implementation for creating an activity
        Ok(activity)
    }
    async fn get_activity(&self, activity_id: String) -> Result<Activity, AppError> {
        // Implementation for getting an activity
        Err(AppError::NotFound(format!("Activity with id: {} not found", activity_id)))
    }
    async fn list_activities(&self, user_id: String) -> Vec<Activity> {
        // Implementation for listing activities
        Vec::<Activity>::new()
    }
}