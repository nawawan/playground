use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use usecase::model::trajectory::{BoundingBox, Coordinate, LodTrajectory, RawTrajectory};

#[derive(Deserialize, Debug)]
#[serde(rename_all = "snake_case")]
pub struct Gpx {
    pub metadata: Metadata,
    #[serde(rename = "trk")]
    pub track: Track,
}

#[derive(Deserialize, Debug)]
pub struct Metadata {
    pub time: DateTime<Utc>,
}

#[derive(Deserialize, Debug)]
pub struct Track {
    pub name: String,
    #[serde(rename = "type")]
    pub activity_type: String,
    #[serde(rename = "trkseg")]
    pub track_segments: TrackSegment,
}

#[derive(Deserialize, Debug)]
pub struct TrackSegment {
    pub trkpt: Vec<TrackPoint>,
}

#[derive(Deserialize, Debug)]
pub struct TrackPoint {
    #[serde(rename = "@lat")]
    pub latitude: f64,
    #[serde(rename = "@lon")]
    pub longitude: f64,
    #[serde(rename = "ele")]
    pub elevation: f64,
    pub time: DateTime<Utc>,
    pub extensions: Option<Extensions>,
}

#[derive(Deserialize, Debug)]
pub struct Extensions {
    #[serde(rename = "TrackPointExtension")]
    pub track_point_extension: Option<TrackPointExtension>,
}

#[derive(Deserialize, Debug)]
pub struct TrackPointExtension {
    #[serde(rename = "hr")]
    pub heart_rate: Option<i64>,
    #[serde(rename = "atemp")]
    pub ambient_temperature: Option<f64>,
}

#[derive(Serialize, Deserialize, Clone)]
pub struct LineString {
    #[serde(rename = "type")]
    geometry_type: String,
    coordinates: Vec<[f64; 2]>,
}

pub struct Trajectory {
    pub trajectory: RawTrajectory,
}

impl From<Gpx> for Trajectory {
    fn from(gpx: Gpx) -> Self {
        let coordinates = gpx
            .track
            .track_segments
            .trkpt
            .iter()
            .map(|trpt| usecase::model::trajectory::Coordinate {
                latitude: trpt.latitude,
                longitude: trpt.longitude,
            })
            .collect::<Vec<_>>();

        let elevations = gpx
            .track
            .track_segments
            .trkpt
            .iter()
            .map(|trpt| trpt.elevation)
            .collect::<Vec<_>>();

        let heart_rates = gpx
            .track
            .track_segments
            .trkpt
            .iter()
            .filter_map(|trpt| {
                trpt.extensions.as_ref().and_then(|ext| {
                    ext.track_point_extension
                        .as_ref()
                        .and_then(|tpe| tpe.heart_rate)
                })
            })
            .collect::<Vec<_>>();

        let recorded_ats = gpx
            .track
            .track_segments
            .trkpt
            .iter()
            .map(|trpt| trpt.time.naive_local())
            .collect::<Vec<_>>();

        Trajectory {
            trajectory: RawTrajectory {
                name: gpx.track.name.clone(),
                trajectory_type: gpx.track.activity_type.clone(),
                coordinates,
                elevations,
                heart_rates,
                recorded_ats,
                started_at: gpx.metadata.time.naive_local(),
            },
        }
    }
}

impl From<Vec<Coordinate>> for LineString {
    fn from(coords: Vec<Coordinate>) -> Self {
        Self {
            geometry_type: "LineString".to_string(),
            coordinates: coords
                .into_iter()
                .map(|c| [c.longitude, c.latitude])
                .collect(),
        }
    }
}

/// A trajectory of one activity at one LOD level.
///
/// `elevations` is only present for the single-activity endpoint; the bulk
/// endpoint leaves it out to keep the payload small.
#[derive(Serialize, Clone)]
pub struct LodTrajectoryResponse {
    pub activity_id: i64,
    pub lod: i64,
    pub trajectory: LineString,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub elevations: Option<Vec<f64>>,
}

impl LodTrajectoryResponse {
    pub fn new(trajectory: LodTrajectory, with_elevations: bool) -> Self {
        Self {
            activity_id: trajectory.activity_id,
            // zoom_from/zoom_to of LOD n are (2n - 1, 2n).
            lod: (trajectory.zoom_from + 1) / 2,
            elevations: with_elevations.then_some(trajectory.elevations),
            trajectory: trajectory.coordinates.into(),
        }
    }
}

pub const DEFAULT_LOD: i64 = 1;
pub const MAX_LOD: i64 = 4;

pub fn validate_lod(lod: Option<i64>) -> Result<i64, String> {
    let lod = lod.unwrap_or(DEFAULT_LOD);
    if (DEFAULT_LOD..=MAX_LOD).contains(&lod) {
        Ok(lod)
    } else {
        Err(format!("lod must be between {DEFAULT_LOD} and {MAX_LOD}"))
    }
}

/// Parses `minLng,minLat,maxLng,maxLat`.
pub fn parse_bbox(raw: &str) -> Result<BoundingBox, String> {
    let values = raw
        .split(',')
        .map(|v| v.trim().parse::<f64>())
        .collect::<Result<Vec<_>, _>>()
        .map_err(|_| "bbox must be numbers: minLng,minLat,maxLng,maxLat".to_string())?;
    let [min_lng, min_lat, max_lng, max_lat] = values[..] else {
        return Err("bbox must have 4 values: minLng,minLat,maxLng,maxLat".to_string());
    };

    if ![min_lng, min_lat, max_lng, max_lat]
        .iter()
        .all(|v| v.is_finite())
    {
        return Err("bbox must be finite numbers".to_string());
    }
    if !(-90.0..=90.0).contains(&min_lat) || !(-90.0..=90.0).contains(&max_lat) {
        return Err("bbox latitude must be between -90 and 90".to_string());
    }
    if min_lat > max_lat {
        return Err("bbox minLat must be <= maxLat".to_string());
    }
    // The viewport may extend past the antimeridian when the map is wrapped,
    // so longitudes are only required to be ordered, not clamped.
    if min_lng > max_lng {
        return Err("bbox minLng must be <= maxLng".to_string());
    }

    Ok(BoundingBox {
        min_lng,
        min_lat,
        max_lng,
        max_lat,
    })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_bbox_accepts_valid_input() {
        let bbox = parse_bbox("139.0, 35.0,140.0,36.0").unwrap();
        assert_eq!(
            bbox,
            BoundingBox {
                min_lng: 139.0,
                min_lat: 35.0,
                max_lng: 140.0,
                max_lat: 36.0
            }
        );
    }

    #[test]
    fn parse_bbox_rejects_invalid_input() {
        assert!(parse_bbox("1,2,3").is_err());
        assert!(parse_bbox("a,b,c,d").is_err());
        assert!(parse_bbox("140,35,139,36").is_err());
        assert!(parse_bbox("139,36,140,35").is_err());
        assert!(parse_bbox("139,-91,140,35").is_err());
        assert!(parse_bbox("139,35,NaN,36").is_err());
    }

    #[test]
    fn validate_lod_defaults_and_bounds() {
        assert_eq!(validate_lod(None), Ok(1));
        assert_eq!(validate_lod(Some(3)), Ok(3));
        assert!(validate_lod(Some(0)).is_err());
        assert!(validate_lod(Some(5)).is_err());
    }
}
