use chrono::{DateTime, FixedOffset};
pub struct Trajectory {
    pub id: i64,
    pub activity_id: i64,
}


pub struct RawTrajectory {
    pub name: String,
    pub trajectory_type: String,
    pub coordinates: Vec<Coordinate>,
    pub elevations: Vec<f64>,
    pub heart_rates: Vec<u32>,
    pub recorded_ats: Vec<DateTime<FixedOffset>>,
    pub started_at: DateTime<FixedOffset>,
}

#[derive(Clone)]
pub struct Coordinate {
    pub latitude: f64,
    pub longitude: f64,
}