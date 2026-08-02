use std::sync::Arc;
use axum::extract::State;
use axum::body::Bytes;
use tracing::error;

use super::helper;
use usecase::service::service::Service;
use usecase::service::trajectory::trajectory_service::TrajectoryService;
use crate::extractor::AuthorizedUser;
use crate::model::trajectory::{Gpx, Trajectory};
use crate::error::UsecaseError;
use crate::handler::Handler;
impl Handler {
    pub async fn upload_gpx(
        user: AuthorizedUser,
        state: State<Arc<Service>>,
        body: Bytes,
    ) -> Result<String, UsecaseError> {
        if let Err(e) = helper::validate_admin(&user) {
            error!("Permission denied: {}", e.error.message);
            return Err(e);
        }

        let gpx: Gpx = quick_xml::de::from_reader(body.as_ref())
            .map_err(|e| UsecaseError::bad_request(&format!("Failed to parse GPX: {}", e)))?;
        let trajectory = Trajectory::from(gpx);

        let service = state.0.clone();
        service.create_activity_by_trajectory(trajectory.trajectory, user.user.id).await
            .map_err(|e| UsecaseError::internal(&format!("Failed to create activity: {}", e)))?;
        Ok("GPX upload successful".to_string())
    }
}