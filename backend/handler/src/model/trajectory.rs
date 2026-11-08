use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};

use usecase::model::trajectory::{Coordinate, LodTrajectory, RawTrajectory, Tile};

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

        // Heart rate is optional (e.g. activities recorded without a sensor).
        // Keep it aligned with the other per-point vectors: either every point
        // has a value, or the whole series is dropped (empty).
        let heart_rates = gpx
            .track
            .track_segments
            .trkpt
            .iter()
            .map(|trpt| {
                trpt.extensions
                    .as_ref()
                    .and_then(|ext| ext.track_point_extension.as_ref())
                    .and_then(|tpe| tpe.heart_rate)
            })
            .collect::<Option<Vec<_>>>()
            .unwrap_or_default();

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
    #[serde(with = "super::id_string")]
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

/// Highest tile zoom accepted; keeps `2^z` well inside `i32` and rejects nonsense.
pub const MAX_TILE_ZOOM: u32 = 18;

/// Parses a slippy-map tile `z/x/y` (XYZ scheme, `y` counted from the north).
pub fn parse_tile(raw: &str) -> Result<Tile, String> {
    let invalid = || "tile must be z/x/y, e.g. 8/227/100".to_string();
    let mut parts = raw.split('/');
    let (Some(z), Some(x), Some(y), None) =
        (parts.next(), parts.next(), parts.next(), parts.next())
    else {
        return Err(invalid());
    };
    let z: u32 = z.parse().map_err(|_| invalid())?;
    let x: u32 = x.parse().map_err(|_| invalid())?;
    let y: u32 = y.parse().map_err(|_| invalid())?;

    if z > MAX_TILE_ZOOM {
        return Err(format!("tile zoom must be at most {MAX_TILE_ZOOM}"));
    }
    let tiles_per_side = 1u32 << z;
    if x >= tiles_per_side || y >= tiles_per_side {
        return Err(format!(
            "tile x and y must be less than {tiles_per_side} at zoom {z}"
        ));
    }

    Ok(Tile { z, x, y })
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parse_tile_accepts_valid_input() {
        assert_eq!(
            parse_tile("8/227/100"),
            Ok(Tile {
                z: 8,
                x: 227,
                y: 100
            })
        );
        assert_eq!(parse_tile("0/0/0"), Ok(Tile { z: 0, x: 0, y: 0 }));
        assert_eq!(
            parse_tile("18/262143/0"),
            Ok(Tile {
                z: 18,
                x: 262143,
                y: 0
            })
        );
    }

    #[test]
    fn parse_tile_rejects_invalid_input() {
        assert!(parse_tile("8/227").is_err());
        assert!(parse_tile("8/227/100/1").is_err());
        assert!(parse_tile("a/b/c").is_err());
        assert!(parse_tile("8/-1/100").is_err());
        // x / y out of range for the zoom
        assert!(parse_tile("0/1/0").is_err());
        assert!(parse_tile("8/256/0").is_err());
        assert!(parse_tile("8/0/256").is_err());
        // zoom too high
        assert!(parse_tile("19/0/0").is_err());
    }

    #[test]
    fn validate_lod_defaults_and_bounds() {
        assert_eq!(validate_lod(None), Ok(1));
        assert_eq!(validate_lod(Some(3)), Ok(3));
        assert!(validate_lod(Some(0)).is_err());
        assert!(validate_lod(Some(5)).is_err());
    }

    fn trkpt(hr: Option<i64>) -> String {
        let extensions = hr.map_or(String::new(), |hr| {
            format!(
                "<extensions><TrackPointExtension><hr>{hr}</hr></TrackPointExtension></extensions>"
            )
        });
        format!(
            r#"<trkpt lat="35.0" lon="139.0"><ele>10.0</ele><time>2026-01-01T00:00:00Z</time>{extensions}</trkpt>"#
        )
    }

    fn parse(heart_rates: &[Option<i64>]) -> Trajectory {
        let points = heart_rates.iter().map(|hr| trkpt(*hr)).collect::<String>();
        let xml = format!(
            r#"<gpx><metadata><time>2026-01-01T00:00:00Z</time></metadata>
            <trk><name>run</name><type>running</type><trkseg>{points}</trkseg></trk></gpx>"#
        );
        Trajectory::from(quick_xml::de::from_str::<Gpx>(&xml).unwrap())
    }

    #[test]
    fn heart_rates_are_empty_without_a_sensor() {
        let raw = parse(&[None, None, None]).trajectory;
        assert_eq!(raw.coordinates.len(), 3);
        assert!(raw.heart_rates.is_empty());
    }

    #[test]
    fn heart_rates_are_kept_when_every_point_has_one() {
        let raw = parse(&[Some(100), Some(110), Some(120)]).trajectory;
        assert_eq!(raw.heart_rates, vec![100, 110, 120]);
    }

    #[test]
    fn heart_rates_are_dropped_when_any_point_misses_one() {
        // A partial series would be misaligned with coordinates, so drop it.
        let raw = parse(&[Some(100), None, Some(120)]).trajectory;
        assert_eq!(raw.coordinates.len(), 3);
        assert!(raw.heart_rates.is_empty());
    }
}
