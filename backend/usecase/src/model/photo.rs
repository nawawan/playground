use chrono::NaiveDateTime;

/// How the position of a photo on the activity was decided.
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum PositionSource {
    /// Shooting time matched against the recorded times of the track.
    Time,
    /// EXIF GPS snapped to the nearest point of the track.
    Exif,
    /// Placed by hand (click on the elevation chart).
    Manual,
}

impl PositionSource {
    pub fn as_str(&self) -> &'static str {
        match self {
            PositionSource::Time => "time",
            PositionSource::Exif => "exif",
            PositionSource::Manual => "manual",
        }
    }
}

impl TryFrom<&str> for PositionSource {
    type Error = String;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        match value {
            "time" => Ok(PositionSource::Time),
            "exif" => Ok(PositionSource::Exif),
            "manual" => Ok(PositionSource::Manual),
            other => Err(format!("unknown position source: {other}")),
        }
    }
}

/// A position on an activity, in meters from its start.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct PhotoPosition {
    pub distance_m: f64,
    pub lng: f64,
    pub lat: f64,
    pub source: PositionSource,
}

#[derive(Clone, Debug)]
pub struct Photo {
    pub id: i64,
    pub activity_id: i64,
    /// Object keys relative to the `_uploads/` prefix.
    pub image_key: String,
    pub thumbnail_key: String,
    pub position: Option<PhotoPosition>,
    pub exif_lng: Option<f64>,
    pub exif_lat: Option<f64>,
    /// UTC, camera clock offset applied.
    pub taken_at: Option<NaiveDateTime>,
}
