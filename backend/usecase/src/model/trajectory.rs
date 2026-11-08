use chrono::NaiveDateTime;

pub struct RawTrajectory {
    pub name: String,
    pub trajectory_type: String,
    pub coordinates: Vec<Coordinate>,
    pub elevations: Vec<f64>,
    pub heart_rates: Vec<i64>,
    pub recorded_ats: Vec<NaiveDateTime>,
    pub started_at: NaiveDateTime,
}

#[derive(Clone)]
pub struct LodTrajectory {
    pub id: i64,
    pub activity_id: i64,
    pub coordinates: Vec<Coordinate>,
    pub elevations: Vec<f64>,
    pub heart_rates: Vec<i64>,
    pub recorded_ats: Vec<NaiveDateTime>,
    pub zoom_from: i64,
    pub zoom_to: i64,
}

pub struct TrajectoryView {
    pub id: i64,
    pub activity_id: i64,
    pub name: String,
    pub trajectory_type: String,
    pub coordinates: serde_json::Value,
    pub elevations: Vec<f64>,
    pub heart_rates: Vec<i64>,
    pub recorded_ats: Vec<NaiveDateTime>,
    pub started_at: NaiveDateTime,
}

/// A slippy-map tile (XYZ scheme, Web Mercator): `x` counts from the west and
/// `y` from the north, both in `0..2^z`.
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Tile {
    pub z: u32,
    pub x: u32,
    pub y: u32,
}

#[derive(Clone, Copy)]
pub struct Coordinate {
    pub latitude: f64,
    pub longitude: f64,
}
