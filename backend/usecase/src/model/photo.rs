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

/// The time zone the camera clock was set to. It is only used for photos whose EXIF
/// has no `OffsetTimeOriginal`: EXIF times carry no time zone of their own.
#[derive(Clone, Copy, Debug, Default, PartialEq, Eq)]
pub enum CameraTimeZone {
    #[default]
    Jst,
    Utc,
}

impl CameraTimeZone {
    pub fn utc_offset_seconds(&self) -> i64 {
        match self {
            CameraTimeZone::Jst => 9 * 3600,
            CameraTimeZone::Utc => 0,
        }
    }
}

impl TryFrom<&str> for CameraTimeZone {
    type Error = String;

    fn try_from(value: &str) -> Result<Self, Self::Error> {
        match value.trim().to_ascii_uppercase().as_str() {
            "JST" => Ok(CameraTimeZone::Jst),
            "UTC" => Ok(CameraTimeZone::Utc),
            other => Err(format!("unsupported time zone: {other} (JST or UTC)")),
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

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_the_camera_time_zone() {
        assert_eq!(CameraTimeZone::try_from("JST"), Ok(CameraTimeZone::Jst));
        assert_eq!(CameraTimeZone::try_from(" utc "), Ok(CameraTimeZone::Utc));
        assert!(CameraTimeZone::try_from("PST").is_err());
        assert!(CameraTimeZone::try_from("").is_err());
    }

    #[test]
    fn defaults_to_jst() {
        assert_eq!(CameraTimeZone::default().utc_offset_seconds(), 9 * 3600);
        assert_eq!(CameraTimeZone::Utc.utc_offset_seconds(), 0);
    }
}
