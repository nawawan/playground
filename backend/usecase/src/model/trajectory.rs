use chrono::{NaiveDateTime};

pub struct RawTrajectory {
    pub name: String,
    pub trajectory_type: String,
    pub coordinates: Vec<Coordinate>,
    pub elevations: Vec<f64>,
    pub heart_rates: Vec<i64>,
    pub recorded_ats: Vec<NaiveDateTime>,
    pub started_at: NaiveDateTime,
}

pub struct LodTrajectory {
    pub id: i64,
    pub activity_id: i64,
    pub name: String,
    pub trajectory_type: String,
    pub coordinates: Vec<Coordinate>,
    pub elevations: Vec<f64>,
    pub heart_rates: Vec<i64>,
    pub recorded_ats: Vec<NaiveDateTime>,
    pub started_at: NaiveDateTime,
    pub zoom_from: i64,
    pub zoom_to: i64,
}

#[derive(Clone)]
pub struct Coordinate {
    pub latitude: f64,
    pub longitude: f64,
}