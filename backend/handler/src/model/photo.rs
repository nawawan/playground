use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use usecase::model::photo::Photo;

#[derive(Serialize, Deserialize, Clone)]
pub struct PhotoResponse {
    #[serde(with = "super::id_string")]
    pub id: i64,
    #[serde(with = "super::id_string")]
    pub activity_id: i64,
    pub url: String,
    pub thumbnail_url: String,
    /// Meters from the start of the activity; `null` while not placed.
    pub distance_m: Option<f64>,
    pub lng: Option<f64>,
    pub lat: Option<f64>,
    /// `time` | `exif` | `manual`; `null` while not placed.
    pub position_source: Option<String>,
    pub taken_at: Option<NaiveDateTime>,
}

impl PhotoResponse {
    /// `host` is the public origin that serves the `_uploads/` objects.
    pub fn new(photo: Photo, host: &str) -> Self {
        let url = |key: &str| format!("{host}/_uploads/{key}");
        Self {
            id: photo.id,
            activity_id: photo.activity_id,
            url: url(&photo.image_key),
            thumbnail_url: url(&photo.thumbnail_key),
            distance_m: photo.position.map(|p| p.distance_m),
            lng: photo.position.map(|p| p.lng),
            lat: photo.position.map(|p| p.lat),
            position_source: photo.position.map(|p| p.source.as_str().to_string()),
            taken_at: photo.taken_at,
        }
    }
}

/// The result for one uploaded file: either `photo` or `error` is set.
#[derive(Serialize)]
pub struct PhotoUploadItemResponse {
    pub file_name: String,
    pub photo: Option<PhotoResponse>,
    pub error: Option<String>,
}

#[derive(Deserialize)]
pub struct PlacePhotoRequest {
    pub distance_m: f64,
}

#[derive(Deserialize)]
pub struct ListPhotosQuery {
    pub activity_id: Option<String>,
}
