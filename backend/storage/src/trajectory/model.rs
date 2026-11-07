use usecase::model::trajectory::{Coordinate, LodTrajectory};
use geozero::wkb;
use geo_types::{Coord, Geometry, LineString};
use chrono::NaiveDateTime;

pub struct LodTrajectoryRow {
    pub id: i64,
    pub activity_id: i64,
    pub coordinates: wkb::Decode<Geometry<f64>>,
    pub elevations: Vec<f64>,
    pub heart_rates: Vec<i64>,
    pub recorded_ats: Vec<NaiveDateTime>,
    pub zoom_from: i64,
    pub zoom_to: i64,
}

impl TryFrom<LodTrajectoryRow> for LodTrajectory {
    type Error = String;

    fn try_from(row: LodTrajectoryRow) -> Result<Self, Self::Error> {
        let geometry = row.coordinates.geometry.ok_or_else(|| "Failed to decode geometry from WKB")?;

        let Geometry::LineString(line) = geometry else {
            return Err("Expected LineString geometry".to_string());
        };

        let coordinates = line
            .coords()
            .map(|coord| Coordinate {
                latitude: coord.y,
                longitude: coord.x,
            })
            .collect();

        Ok(LodTrajectory {
            id: row.id,
            activity_id: row.activity_id,
            coordinates,
            elevations: row.elevations,
            heart_rates: row.heart_rates,
            recorded_ats: row.recorded_ats,
            zoom_from: row.zoom_from,
            zoom_to: row.zoom_to,
        })
    }
}