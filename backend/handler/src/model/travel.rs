use serde::{Deserialize, Serialize};
use usecase::model::travel::Travel;

#[derive(Serialize, Deserialize, Clone)]
pub struct TravelResponse {
    #[serde(with = "super::id_string")]
    pub id: i64,
    pub name: String,
}

impl From<Travel> for TravelResponse {
    fn from(travel: Travel) -> Self {
        Self {
            id: travel.id,
            name: travel.name,
        }
    }
}

#[derive(Deserialize)]
pub struct TravelRequest {
    pub name: String,
}

/// `PATCH /api/activities/{id}`. `travel_id: null` makes the activity standalone.
#[derive(Deserialize)]
pub struct UpdateActivityRequest {
    pub travel_id: Option<String>,
}
