use axum::Json;
use axum::extract::{Multipart, Path, Query, State};
use axum::http::StatusCode;
use std::sync::Arc;

use super::helper;
use crate::error::UsecaseError;
use crate::extractor::AuthorizedUser;
use crate::handler::Handler;
use crate::model::photo::{
    ListPhotosQuery, PhotoResponse, PhotoUploadItemResponse, PlacePhotoRequest,
};
use usecase::model::photo::CameraTimeZone;
use usecase::service::photo::photo_service::{PhotoService, PhotoUploadFile};
use usecase::service::service::Service;

impl Handler {
    /// Multipart: one or more `image` files and an optional `time_zone` text field
    /// (`JST` by default, or `UTC`): the time zone the camera clock was set to, used
    /// for photos whose EXIF has no offset of its own.
    pub async fn upload_photos(
        user: AuthorizedUser,
        state: State<Arc<Service>>,
        Path(activity_id): Path<i64>,
        mut multipart: Multipart,
    ) -> Result<Json<Vec<PhotoUploadItemResponse>>, UsecaseError> {
        helper::validate_admin(&user)?;

        let mut files = Vec::new();
        let mut camera_time_zone = CameraTimeZone::default();
        while let Some(field) = multipart
            .next_field()
            .await
            .map_err(|e| UsecaseError::bad_request(&e.body_text()))?
        {
            match field.name() {
                Some("image") => {
                    let file_name = field.file_name().unwrap_or("unknown").to_string();
                    let data = field
                        .bytes()
                        .await
                        .map_err(|e| UsecaseError::bad_request(&e.body_text()))?;
                    files.push(PhotoUploadFile { file_name, data });
                }
                Some("time_zone") => {
                    let text = field
                        .text()
                        .await
                        .map_err(|e| UsecaseError::bad_request(&e.body_text()))?;
                    camera_time_zone = CameraTimeZone::try_from(text.as_str())
                        .map_err(|e| UsecaseError::bad_request(&e))?;
                }
                _ => {}
            }
        }
        if files.is_empty() {
            return Err(UsecaseError::bad_request("No image field in multipart"));
        }

        let service = state.0.clone();
        let results = service
            .upload_photos(activity_id, files, camera_time_zone)
            .await?;
        let host = &service.config.host;
        Ok(Json(
            results
                .into_iter()
                .map(|r| match r.result {
                    Ok(photo) => PhotoUploadItemResponse {
                        file_name: r.file_name,
                        photo: Some(PhotoResponse::new(photo, host)),
                        error: None,
                    },
                    Err(error) => PhotoUploadItemResponse {
                        file_name: r.file_name,
                        photo: None,
                        error: Some(error),
                    },
                })
                .collect(),
        ))
    }

    pub async fn list_activity_photos(
        state: State<Arc<Service>>,
        Path(activity_id): Path<i64>,
    ) -> Result<Json<Vec<PhotoResponse>>, UsecaseError> {
        Self::photos_response(state, Some(activity_id)).await
    }

    pub async fn list_photos(
        state: State<Arc<Service>>,
        Query(query): Query<ListPhotosQuery>,
    ) -> Result<Json<Vec<PhotoResponse>>, UsecaseError> {
        let activity_id = query
            .activity_id
            .as_deref()
            .map(|id| {
                id.parse::<i64>()
                    .map_err(|_| UsecaseError::bad_request("activity_id must be a numeric string"))
            })
            .transpose()?;
        Self::photos_response(state, activity_id).await
    }

    async fn photos_response(
        state: State<Arc<Service>>,
        activity_id: Option<i64>,
    ) -> Result<Json<Vec<PhotoResponse>>, UsecaseError> {
        let service = state.0.clone();
        let photos = service.list_photos(activity_id).await?;
        let host = &service.config.host;
        Ok(Json(
            photos
                .into_iter()
                .map(|p| PhotoResponse::new(p, host))
                .collect(),
        ))
    }

    /// Places (or moves) a photo along its activity.
    pub async fn place_photo(
        user: AuthorizedUser,
        state: State<Arc<Service>>,
        Path(photo_id): Path<i64>,
        Json(req): Json<PlacePhotoRequest>,
    ) -> Result<Json<PhotoResponse>, UsecaseError> {
        helper::validate_admin(&user)?;
        let service = state.0.clone();
        let photo = service.place_photo(photo_id, req.distance_m).await?;
        Ok(Json(PhotoResponse::new(photo, &service.config.host)))
    }

    pub async fn delete_photo(
        user: AuthorizedUser,
        state: State<Arc<Service>>,
        Path(photo_id): Path<i64>,
    ) -> Result<StatusCode, UsecaseError> {
        helper::validate_admin(&user)?;
        state.0.delete_photo(photo_id).await?;
        Ok(StatusCode::NO_CONTENT)
    }
}
