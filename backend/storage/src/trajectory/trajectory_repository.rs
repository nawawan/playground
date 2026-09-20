use async_trait::async_trait;
use chrono::NaiveDateTime;
use geo_types::{Coord, Geometry, LineString};
use geozero::wkb;
use tracing::error;
use usecase::model::trajectory::Coordinate;
use uuid::Uuid;

use crate::repository::Repository;
use usecase::errors::repo_error::RepoError;
use usecase::model::{activity::Activity, trajectory::LodTrajectory};
use usecase::repository::trajectory::TrajectoryRepository;

// The thinnest LOD band, produced for every activity at upload time. Joining
// on it guarantees exactly one trajectory_lod row per activity_id.
const THIN_TRAJECTORY_ZOOM_FROM: i32 = 1;

#[derive(sqlx::FromRow)]
struct ActivityRow {
    id: i64,
    user_id: Uuid,
    name: String,
    started_at: NaiveDateTime,
    distance: f64,
    elevation: f64,
    duration: i64,
    trajectory: wkb::Decode<Geometry<f64>>,
}

fn geometry_to_coordinates(geometry: Geometry<f64>) -> Vec<Coordinate> {
    let Geometry::LineString(line_string) = geometry else {
        return Vec::new();
    };

    line_string
        .coords()
        .map(|coord| Coordinate {
            latitude: coord.y,
            longitude: coord.x,
        })
        .collect()
}

#[async_trait]
impl TrajectoryRepository for Repository {
    // Implementation for each method would go here
    async fn create_trajectory(
        &self,
        tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
        trajectory: LodTrajectory,
    ) -> Result<LodTrajectory, RepoError> {
        // I hate this conversion
        // Convert the domain model before opening a transaction.
        // Geometry conversion and WKB encoding may be CPU-intensive,
        // so they should not extend the transaction lifetime.
        let line_string = LineString::new(
            trajectory
                .coordinates
                .iter()
                .map(|coord| Coord {
                    x: coord.longitude,
                    y: coord.latitude,
                })
                .collect(),
        );
        sqlx::query!(
            r#"
            INSERT INTO trajectory_lod (activity_id, trajectory, recorded_ats, elevations, heart_rates, zoom_from, zoom_to)
            VALUES($1, ST_SetSRID($2::geometry, 4326), $3, $4, $5, $6, $7);
            "#,
            trajectory.activity_id,
            wkb::Encode(Geometry::LineString(line_string)) as _,
            &trajectory.recorded_ats,
            &trajectory.elevations,
            &trajectory.heart_rates,
            trajectory.zoom_from,
            trajectory.zoom_to,
        )
        .execute(&mut **tx)
        .await
        .map_err(|e| {
            error!("Failed to create trajectory: {}", e);
            RepoError::Internal("Failed to create trajectory".to_string())
        })?;
        Ok(trajectory)
    }
    async fn upload_trajectory(
        &self,
        trajectory: LodTrajectory,
    ) -> Result<LodTrajectory, RepoError> {
        // Implementation for uploading a trajectory
        Ok(trajectory)
    }
    async fn get_trajectory(
        &self,
        activity_id: i64,
        zoom_level: i32,
    ) -> Result<LodTrajectory, RepoError> {
        // Implementation for getting a trajectory
        Err(RepoError::NotFound(format!("a")))
    }

    async fn create_activity(
        &self,
        tx: &mut sqlx::Transaction<'_, sqlx::Postgres>,
        mut activity: Activity,
    ) -> Result<Activity, RepoError> {
        // Implementation for creating an activity
        let record = sqlx::query!(
            r#"INSERT INTO activity (user_id, name, started_at, distance, elevation, duration) 
            VALUES($1, $2, $3, $4, $5, $6) 
            RETURNING id"#,
            activity.user_id,
            activity.name,
            activity.start_time,
            activity.distance,
            activity.elevation_gain,
            activity.duration,
        )
        .fetch_one(&mut **tx)
        .await
        .map_err(|e| {
            error!("Failed to create activity: {}", e);
            RepoError::Internal("Failed to create activity".to_string())
        })?;
        activity.id = record.id;
        Ok(activity)
    }
    async fn get_activity(&self, activity_id: String) -> Result<Activity, RepoError> {
        // Implementation for getting an activity
        Err(RepoError::NotFound(format!(
            "Activity with id: {} not found",
            activity_id
        )))
    }
    async fn list_activities(&self, user_id: String) -> Result<Vec<Activity>, RepoError> {
        let user_id: Uuid = user_id
            .parse()
            .map_err(|_| RepoError::Internal("Invalid user id".to_string()))?;

        let mut builder = sqlx::QueryBuilder::new(
            "SELECT a.id, a.user_id, a.name, a.started_at, a.distance, a.elevation, a.duration, t.trajectory
             FROM activity a
             INNER JOIN trajectory_lod t ON t.activity_id = a.id AND t.zoom_from = ",
        );
        builder.push_bind(THIN_TRAJECTORY_ZOOM_FROM);
        builder.push(" WHERE a.user_id = ").push_bind(user_id);

        let records: Vec<ActivityRow> = builder
            .build_query_as::<ActivityRow>()
            .fetch_all(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to list activities: {}", e);
                RepoError::Internal("Failed to list activities".to_string())
            })?;

        Ok(records
            .into_iter()
            .map(|record| Activity {
                id: record.id,
                user_id: record.user_id,
                name: record.name,
                start_time: record.started_at,
                distance: record.distance,
                elevation_gain: record.elevation,
                duration: record.duration,
                thin_trajectory: record.trajectory.geometry.map(geometry_to_coordinates),
            })
            .collect())
    }
}
