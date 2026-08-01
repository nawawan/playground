use std::sync::Arc;
use axum::extract::State;
use axum::body::Bytes;

use usecase::service::service::Service;
use crate::model::trajectory::{Gpx, Trajectory};
use crate::error::UsecaseError;
use crate::handler::Handler;
impl Handler {
    pub async fn upload_gpx(
        state: State<Arc<Service>>,
        body: Bytes
    ) -> Result<String, UsecaseError> {
        let gpx: Gpx = quick_xml::de::from_reader(body.as_ref())
            .map_err(|e| UsecaseError::bad_request(&format!("Failed to parse GPX: {}", e)))?;
        let trajectory = Trajectory::from(gpx);

        let service = state.0.clone();
        Ok("GPX upload successful".to_string())
    }
}