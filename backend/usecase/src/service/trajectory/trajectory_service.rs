use crate::model::activity::Activity;
use crate::model::trajectory::{LodTrajectory, RawTrajectory};
use crate::errors::app_error::AppError;
use crate::service::trajectory::helper;

use async_trait::async_trait;
use tracing::error;
use uuid::Uuid;


#[async_trait]
trait TrajectoryService {
    // async fn upload_trajectory(&self, trajectory: Trajectory) -> Result<Trajectory, AppError>;
    // async fn get_trajectory(&self, activity_id: String, zoom_level: i32) -> Result<Trajectory, AppError>;
    // async fn delete_trajectory(&self, activity_id: String) -> Result<(), AppError>;
    async fn create_activity_by_trajectory(&self, trajectory: RawTrajectory, user_id: Uuid) -> Result<Activity, AppError>;
    async fn get_activity(&self, activity_id: String) -> Result<Activity, AppError>;
    async fn list_activities(&self, user_id: String) -> Vec<Activity>;
}

#[async_trait]
impl TrajectoryService for Service {
    async fn create_activity_by_trajectory(&self, trajectory: RawTrajectory, user_id: Uuid) -> Result<Activity, AppError> {
        let sum_distance = helper::calculate_distance_sum(&trajectory.coordinates);

        let mut trajectories = Vec::<LodTrajectory>::new();
        for i in 1..5 {
            trajectories.push(helper::thin_out_raw_trajectory_by_lod(&trajectory, i));
        }

        let activity = Activity {

        }

        let mut tx = self.repository.create_transaction().await?;
        let activity = self.repository.create_activity(&mut tx, activity).await?;
        tx.commit().await.map_err(|e| {
            error!("Failed to commit transaction for creating activity: {e}");
            AppError::internal(Some("Transaction commit failed"))
        })?;
        Ok(activity)
    }
    async fn get_activity(&self, activity_id: String) -> Result<Activity, AppError> {
        let activity = self.repository.get_activity(activity_id).await?;
        Ok(activity)
    }
    async fn list_activities(&self, user_id: String) -> Vec<Activity> {
        self.repository.list_activities(user_id).await
    }
}