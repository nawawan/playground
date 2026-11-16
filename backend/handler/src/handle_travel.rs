use axum::Json;
use axum::extract::{Path, State};
use axum::http::StatusCode;
use std::sync::Arc;
use tracing::error;

use super::helper;
use crate::error::UsecaseError;
use crate::extractor::AuthorizedUser;
use crate::handler::Handler;
use crate::model::activity::ActivityResponse;
use crate::model::travel::{TravelRequest, TravelResponse, UpdateActivityRequest};
use usecase::service::service::Service;
use usecase::service::trajectory::trajectory_service::TrajectoryService;
use usecase::service::travel::travel_service::TravelService;

impl Handler {
    pub async fn list_travels(
        state: State<Arc<Service>>,
    ) -> Result<Json<Vec<TravelResponse>>, UsecaseError> {
        let travels = state.0.list_travels().await?;
        Ok(Json(
            travels.into_iter().map(TravelResponse::from).collect(),
        ))
    }

    pub async fn create_travel(
        user: AuthorizedUser,
        state: State<Arc<Service>>,
        Json(req): Json<TravelRequest>,
    ) -> Result<Json<TravelResponse>, UsecaseError> {
        helper::validate_admin(&user)?;
        let travel = state.0.create_travel(user.user.id, &req.name).await?;
        Ok(Json(travel.into()))
    }

    pub async fn update_travel(
        user: AuthorizedUser,
        state: State<Arc<Service>>,
        Path(travel_id): Path<i64>,
        Json(req): Json<TravelRequest>,
    ) -> Result<Json<TravelResponse>, UsecaseError> {
        helper::validate_admin(&user)?;
        let travel = state.0.update_travel(travel_id, &req.name).await?;
        Ok(Json(travel.into()))
    }

    pub async fn delete_travel(
        user: AuthorizedUser,
        state: State<Arc<Service>>,
        Path(travel_id): Path<i64>,
    ) -> Result<StatusCode, UsecaseError> {
        helper::validate_admin(&user)?;
        state.0.delete_travel(travel_id).await?;
        Ok(StatusCode::NO_CONTENT)
    }

    /// Attaches the activity to a travel, or detaches it (`travel_id: null`).
    pub async fn update_activity(
        user: AuthorizedUser,
        state: State<Arc<Service>>,
        Path(activity_id): Path<i64>,
        Json(req): Json<UpdateActivityRequest>,
    ) -> Result<Json<ActivityResponse>, UsecaseError> {
        if let Err(e) = helper::validate_admin(&user) {
            error!("Permission denied: {}", e.error.message);
            return Err(e);
        }
        let travel_id = req
            .travel_id
            .as_deref()
            .map(|id| {
                id.parse::<i64>()
                    .map_err(|_| UsecaseError::bad_request("travel_id must be a numeric string"))
            })
            .transpose()?;

        let service = state.0.clone();
        service.set_activity_travel(activity_id, travel_id).await?;
        let activity = service.get_activity(activity_id).await?;
        Ok(Json(activity.into()))
    }
}
