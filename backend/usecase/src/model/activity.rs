use serde::{Deserialize, Serialize};


#[derive(Serialize, Deserialize, Clone)]
pub struct Activity {
    pub id: i64,
    pub user_id: String,
    pub name: String,
    pub distance: f64,
    pub duration: i32,
    pub elevation_gain: i32,
    pub start_time: chrono::NaiveDateTime,
}