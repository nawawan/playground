use chrono::NaiveDateTime;
use serde::{Deserialize, Serialize};
use usecase::model::activity::Activity;

use crate::model::trajectory::LineString;

mod option_id_string {
    use serde::{Deserialize, Deserializer, Serializer, de};

    pub fn serialize<S: Serializer>(id: &Option<i64>, serializer: S) -> Result<S::Ok, S::Error> {
        match id {
            Some(id) => serializer.serialize_str(&id.to_string()),
            None => serializer.serialize_none(),
        }
    }

    pub fn deserialize<'de, D: Deserializer<'de>>(
        deserializer: D,
    ) -> Result<Option<i64>, D::Error> {
        Option::<String>::deserialize(deserializer)?
            .map(|id| id.parse().map_err(de::Error::custom))
            .transpose()
    }
}

#[derive(Serialize, Deserialize, Clone)]
pub struct ActivityResponse {
    #[serde(with = "super::id_string")]
    pub id: i64,
    pub name: String,
    pub distance: f64,
    pub duration: i64,
    pub elevation_gain: f64,
    pub start_time: NaiveDateTime,
    /// `null` for a standalone activity.
    #[serde(with = "option_id_string")]
    pub travel_id: Option<i64>,
    pub trajectory: Option<LineString>,
    pub elevations: Vec<f64>,
}

impl From<Activity> for ActivityResponse {
    fn from(activity: Activity) -> Self {
        Self {
            id: activity.id,
            name: activity.name,
            distance: activity.distance,
            duration: activity.duration,
            elevation_gain: activity.elevation_gain,
            start_time: activity.start_time,
            travel_id: activity.travel_id,
            elevations: activity.thin_elevation.unwrap_or_default(),
            trajectory: activity
                .thin_trajectory
                .map_or(None, |coord| Some(coord.into())),
        }
    }
}
