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

/// Axis-aligned bounding box in WGS84 (lng/lat degrees).
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct BoundingBox {
    pub min_lng: f64,
    pub min_lat: f64,
    pub max_lng: f64,
    pub max_lat: f64,
}

#[derive(Clone, Copy)]
pub struct Coordinate {
    pub latitude: f64,
    pub longitude: f64,
}
