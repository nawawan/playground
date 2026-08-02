use uuid::Uuid;
use chrono::{DateTime, NaiveDateTime, Utc};


#[derive(Clone)]
pub struct Activity {
    pub id: i64,
    pub user_id: Uuid,
    pub name: String,
    pub distance: f64,
    pub duration: i64,
    pub elevation_gain: f64,
    pub start_time: NaiveDateTime,
}