use async_trait::async_trait;
use bytes::Bytes;
use tracing::{error, warn};
use uuid::Uuid;

use super::imaging::{ProcessedImage, process_image};
use super::metadata::{PhotoMetadata, read_metadata};
use super::position::{Track, decide_position};
use crate::errors::app_error::AppError;
use crate::model::photo::{Photo, PositionSource};
use crate::service::service::Service;
use crate::service::trajectory::trajectory_service::TrajectoryService;

/// The finest LOD stored for every activity (see `create_activity_by_trajectory`).
const POSITIONING_LOD: i64 = 3;
pub const MAX_PHOTO_BYTES: usize = 20 * 1024 * 1024;

pub struct PhotoUploadFile {
    pub file_name: String,
    pub data: Bytes,
}

/// The outcome for one uploaded file; one failing file must not fail the rest.
pub struct PhotoUploadResult {
    pub file_name: String,
    pub result: Result<Photo, String>,
}

#[async_trait]
pub trait PhotoService {
    /// Stores the photos of an activity and places each on its track: by shooting
    /// time first, then by EXIF GPS. `clock_offset_seconds` corrects a camera
    /// whose clock is off (added to the shooting time).
    async fn upload_photos(
        &self,
        activity_id: i64,
        files: Vec<PhotoUploadFile>,
        clock_offset_seconds: i64,
    ) -> Result<Vec<PhotoUploadResult>, AppError>;
    async fn list_photos(&self, activity_id: Option<i64>) -> Result<Vec<Photo>, AppError>;
    /// Places (or moves) a photo at `distance_m` from the start of its activity.
    async fn place_photo(&self, photo_id: i64, distance_m: f64) -> Result<Photo, AppError>;
    async fn delete_photo(&self, photo_id: i64) -> Result<(), AppError>;
}

struct Prepared {
    processed: ProcessedImage,
    metadata: PhotoMetadata,
}

/// CPU-bound: EXIF parsing, decoding and re-encoding.
fn prepare(data: &[u8]) -> Result<Prepared, String> {
    let metadata = read_metadata(data);
    let processed = process_image(data, metadata.orientation)?;
    Ok(Prepared {
        processed,
        metadata,
    })
}

impl Service {
    async fn track_of(&self, activity_id: i64, distance_m: f64) -> Result<Option<Track>, AppError> {
        let lod = self.get_trajectory(activity_id, POSITIONING_LOD).await?;
        Ok(Track::new(lod.coordinates, lod.recorded_ats, distance_m))
    }

    async fn store_photo(
        &self,
        activity_id: i64,
        track: Option<&Track>,
        clock_offset_seconds: i64,
        data: Bytes,
    ) -> Result<Photo, String> {
        if data.len() > MAX_PHOTO_BYTES {
            return Err(format!(
                "file is too large (max {} MB)",
                MAX_PHOTO_BYTES / 1024 / 1024
            ));
        }

        let Prepared {
            processed,
            metadata,
        } = tokio::task::spawn_blocking(move || prepare(&data))
            .await
            .map_err(|e| {
                error!("photo processing task failed: {e}");
                "failed to process image".to_string()
            })??;

        let taken_at = metadata.taken_at_utc(clock_offset_seconds);
        let position = track.and_then(|track| decide_position(track, taken_at, metadata.gps));

        let name = Uuid::now_v7();
        let image_key = format!("photos/{activity_id}/{name}.jpg");
        let thumbnail_key = format!("photos/{activity_id}/{name}_thumb.jpg");

        self.repository
            .put_photo_object(&image_key, "image/jpeg", Bytes::from(processed.image))
            .await
            .map_err(|_| "failed to store image".to_string())?;
        if self
            .repository
            .put_photo_object(
                &thumbnail_key,
                "image/jpeg",
                Bytes::from(processed.thumbnail),
            )
            .await
            .is_err()
        {
            self.discard_objects(&[&image_key]).await;
            return Err("failed to store thumbnail".to_string());
        }

        let photo = Photo {
            id: 0,
            activity_id,
            image_key: image_key.clone(),
            thumbnail_key: thumbnail_key.clone(),
            position,
            exif_lng: metadata.gps.map(|(lng, _)| lng),
            exif_lat: metadata.gps.map(|(_, lat)| lat),
            taken_at,
        };
        match self.repository.create_photo(photo).await {
            Ok(photo) => Ok(photo),
            Err(_) => {
                self.discard_objects(&[&image_key, &thumbnail_key]).await;
                Err("failed to save photo".to_string())
            }
        }
    }

    /// Best effort: an orphaned object is harmless, a failed request is not.
    async fn discard_objects(&self, keys: &[&str]) {
        for key in keys {
            if let Err(e) = self.repository.delete_photo_object(key).await {
                warn!("failed to delete photo object {key}: {e}");
            }
        }
    }
}

#[async_trait]
impl PhotoService for Service {
    async fn upload_photos(
        &self,
        activity_id: i64,
        files: Vec<PhotoUploadFile>,
        clock_offset_seconds: i64,
    ) -> Result<Vec<PhotoUploadResult>, AppError> {
        let activity = self.repository.get_activity(activity_id).await?;
        let track = self.track_of(activity_id, activity.distance).await?;
        if track.is_none() {
            warn!("activity {activity_id} has too few points to place photos");
        }

        let mut results = Vec::with_capacity(files.len());
        for file in files {
            let result = self
                .store_photo(activity_id, track.as_ref(), clock_offset_seconds, file.data)
                .await;
            results.push(PhotoUploadResult {
                file_name: file.file_name,
                result,
            });
        }
        Ok(results)
    }

    async fn list_photos(&self, activity_id: Option<i64>) -> Result<Vec<Photo>, AppError> {
        Ok(self.repository.list_photos(activity_id).await?)
    }

    async fn place_photo(&self, photo_id: i64, distance_m: f64) -> Result<Photo, AppError> {
        if !distance_m.is_finite() || distance_m < 0.0 {
            return Err(AppError::invalid(Some(
                "distance_m must be a non-negative number",
            )));
        }
        let photo = self.repository.get_photo(photo_id).await?;
        let activity = self.repository.get_activity(photo.activity_id).await?;
        let track = self
            .track_of(photo.activity_id, activity.distance)
            .await?
            .ok_or_else(|| AppError::invalid(Some("activity has no track to place photos on")))?;

        let position = track.locate_by_distance(distance_m, PositionSource::Manual);
        Ok(self
            .repository
            .update_photo_position(photo_id, position)
            .await?)
    }

    async fn delete_photo(&self, photo_id: i64) -> Result<(), AppError> {
        let photo = self.repository.get_photo(photo_id).await?;
        self.repository.delete_photo(photo_id).await?;
        self.discard_objects(&[&photo.image_key, &photo.thumbnail_key])
            .await;
        Ok(())
    }
}
