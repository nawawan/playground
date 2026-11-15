use async_trait::async_trait;
use aws_sdk_s3::primitives::ByteStream;
use bytes::Bytes;
use chrono::NaiveDateTime;
use tracing::error;

use crate::repository::Repository;
use usecase::errors::repo_error::RepoError;
use usecase::model::photo::{Photo, PhotoPosition, PositionSource};
use usecase::repository::photo::PhotoRepository;

const COLUMNS: &str = "id, activity_id, image_key, thumbnail_key, distance_m, lng, lat, exif_lng, exif_lat, taken_at, position_source";

// Keys are unique (uuid), so a stored object never changes.
const CACHE_CONTROL: &str = "public, max-age=31536000, immutable";

#[derive(sqlx::FromRow)]
struct PhotoRow {
    id: i64,
    activity_id: i64,
    image_key: String,
    thumbnail_key: String,
    distance_m: Option<f64>,
    lng: Option<f64>,
    lat: Option<f64>,
    exif_lng: Option<f64>,
    exif_lat: Option<f64>,
    taken_at: Option<NaiveDateTime>,
    position_source: Option<String>,
}

impl From<PhotoRow> for Photo {
    fn from(row: PhotoRow) -> Self {
        let position = match (row.distance_m, row.lng, row.lat, row.position_source) {
            (Some(distance_m), Some(lng), Some(lat), Some(source)) => {
                PositionSource::try_from(source.as_str())
                    .ok()
                    .map(|source| PhotoPosition {
                        distance_m,
                        lng,
                        lat,
                        source,
                    })
            }
            _ => None,
        };
        Photo {
            id: row.id,
            activity_id: row.activity_id,
            image_key: row.image_key,
            thumbnail_key: row.thumbnail_key,
            position,
            exif_lng: row.exif_lng,
            exif_lat: row.exif_lat,
            taken_at: row.taken_at,
        }
    }
}

fn not_found(photo_id: i64) -> RepoError {
    RepoError::NotFound(format!("Photo with id: {} not found", photo_id))
}

#[async_trait]
impl PhotoRepository for Repository {
    async fn create_photo(&self, photo: Photo) -> Result<Photo, RepoError> {
        let position = photo.position;
        let row: PhotoRow = sqlx::query_as(&format!(
            "INSERT INTO photo (activity_id, image_key, thumbnail_key, distance_m, lng, lat, exif_lng, exif_lat, taken_at, position_source)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             RETURNING {COLUMNS}"
        ))
        .bind(photo.activity_id)
        .bind(&photo.image_key)
        .bind(&photo.thumbnail_key)
        .bind(position.map(|p| p.distance_m))
        .bind(position.map(|p| p.lng))
        .bind(position.map(|p| p.lat))
        .bind(photo.exif_lng)
        .bind(photo.exif_lat)
        .bind(photo.taken_at)
        .bind(position.map(|p| p.source.as_str()))
        .fetch_one(&self.pool)
        .await
        .map_err(|e| match &e {
            sqlx::Error::Database(db) if db.is_foreign_key_violation() => RepoError::NotFound(
                format!("Activity with id: {} not found", photo.activity_id),
            ),
            _ => {
                error!("Failed to create photo: {}", e);
                RepoError::Internal("Failed to create photo".to_string())
            }
        })?;
        Ok(row.into())
    }

    async fn get_photo(&self, photo_id: i64) -> Result<Photo, RepoError> {
        let row: Option<PhotoRow> =
            sqlx::query_as(&format!("SELECT {COLUMNS} FROM photo WHERE id = $1"))
                .bind(photo_id)
                .fetch_optional(&self.pool)
                .await
                .map_err(|e| {
                    error!("Failed to get photo: {}", e);
                    RepoError::Internal("Failed to get photo".to_string())
                })?;
        row.map(Photo::from).ok_or_else(|| not_found(photo_id))
    }

    async fn list_photos(&self, activity_id: Option<i64>) -> Result<Vec<Photo>, RepoError> {
        let rows: Vec<PhotoRow> = sqlx::query_as(&format!(
            "SELECT {COLUMNS} FROM photo
             WHERE ($1::bigint IS NULL OR activity_id = $1)
             ORDER BY activity_id, taken_at, id"
        ))
        .bind(activity_id)
        .fetch_all(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to list photos: {}", e);
            RepoError::Internal("Failed to list photos".to_string())
        })?;
        Ok(rows.into_iter().map(Photo::from).collect())
    }

    async fn update_photo_position(
        &self,
        photo_id: i64,
        position: PhotoPosition,
    ) -> Result<Photo, RepoError> {
        let row: Option<PhotoRow> = sqlx::query_as(&format!(
            "UPDATE photo
             SET distance_m = $2, lng = $3, lat = $4, position_source = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING {COLUMNS}"
        ))
        .bind(photo_id)
        .bind(position.distance_m)
        .bind(position.lng)
        .bind(position.lat)
        .bind(position.source.as_str())
        .fetch_optional(&self.pool)
        .await
        .map_err(|e| {
            error!("Failed to update photo position: {}", e);
            RepoError::Internal("Failed to update photo position".to_string())
        })?;
        row.map(Photo::from).ok_or_else(|| not_found(photo_id))
    }

    async fn delete_photo(&self, photo_id: i64) -> Result<(), RepoError> {
        let result = sqlx::query("DELETE FROM photo WHERE id = $1")
            .bind(photo_id)
            .execute(&self.pool)
            .await
            .map_err(|e| {
                error!("Failed to delete photo: {}", e);
                RepoError::Internal("Failed to delete photo".to_string())
            })?;
        if result.rows_affected() == 0 {
            return Err(not_found(photo_id));
        }
        Ok(())
    }

    async fn put_photo_object(
        &self,
        key: &str,
        content_type: &str,
        data: Bytes,
    ) -> Result<(), RepoError> {
        self.r2_client
            .put_object()
            .bucket(&self.config.blog_r2_bucket)
            .key(format!("_uploads/{key}"))
            .content_type(content_type)
            .cache_control(CACHE_CONTROL)
            .body(ByteStream::from(data))
            .send()
            .await
            .map_err(|e| {
                error!(key = %key, error = %e, "Failed to upload photo object");
                RepoError::Internal("Failed to upload photo".to_string())
            })?;
        Ok(())
    }

    async fn delete_photo_object(&self, key: &str) -> Result<(), RepoError> {
        self.r2_client
            .delete_object()
            .bucket(&self.config.blog_r2_bucket)
            .key(format!("_uploads/{key}"))
            .send()
            .await
            .map_err(|e| {
                error!(key = %key, error = %e, "Failed to delete photo object");
                RepoError::Internal("Failed to delete photo".to_string())
            })?;
        Ok(())
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::test_support::{insert_activity, insert_user, test_repository};
    use anyhow::Result;

    fn photo(activity_id: i64, position: Option<PhotoPosition>) -> Photo {
        Photo {
            id: 0,
            activity_id,
            image_key: format!("photos/{activity_id}/a.jpg"),
            thumbnail_key: format!("photos/{activity_id}/a_thumb.jpg"),
            position,
            exif_lng: Some(138.1),
            exif_lat: Some(36.7),
            taken_at: None,
        }
    }

    fn position(distance_m: f64, source: PositionSource) -> PhotoPosition {
        PhotoPosition {
            distance_m,
            lng: 138.0,
            lat: 36.0,
            source,
        }
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn stores_placed_and_unplaced_photos(pool: sqlx::PgPool) -> Result<()> {
        let user_id = insert_user(&pool).await?;
        let activity_id = insert_activity(&pool, user_id).await?;
        let repo = test_repository(pool).await;

        let placed = repo
            .create_photo(photo(
                activity_id,
                Some(position(1500.0, PositionSource::Time)),
            ))
            .await?;
        let unplaced = repo.create_photo(photo(activity_id, None)).await?;

        let fetched = repo.get_photo(placed.id).await?;
        let p = fetched.position.expect("placed");
        assert_eq!(p.distance_m, 1500.0);
        assert_eq!(p.source, PositionSource::Time);
        assert_eq!(fetched.exif_lng, Some(138.1));

        assert!(repo.get_photo(unplaced.id).await?.position.is_none());
        assert_eq!(repo.list_photos(Some(activity_id)).await?.len(), 2);
        assert_eq!(repo.list_photos(None).await?.len(), 2);
        assert!(repo.list_photos(Some(activity_id + 1)).await?.is_empty());
        Ok(())
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn places_an_unplaced_photo_manually(pool: sqlx::PgPool) -> Result<()> {
        let user_id = insert_user(&pool).await?;
        let activity_id = insert_activity(&pool, user_id).await?;
        let repo = test_repository(pool).await;
        let created = repo.create_photo(photo(activity_id, None)).await?;

        let updated = repo
            .update_photo_position(created.id, position(42.0, PositionSource::Manual))
            .await?;
        let p = updated.position.expect("placed");
        assert_eq!(p.distance_m, 42.0);
        assert_eq!(p.source, PositionSource::Manual);

        assert!(matches!(
            repo.update_photo_position(created.id + 100, position(1.0, PositionSource::Manual))
                .await,
            Err(RepoError::NotFound(_))
        ));
        Ok(())
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn deletes_photos(pool: sqlx::PgPool) -> Result<()> {
        let user_id = insert_user(&pool).await?;
        let activity_id = insert_activity(&pool, user_id).await?;
        let repo = test_repository(pool).await;
        let created = repo.create_photo(photo(activity_id, None)).await?;

        repo.delete_photo(created.id).await?;
        assert!(matches!(
            repo.get_photo(created.id).await,
            Err(RepoError::NotFound(_))
        ));
        assert!(matches!(
            repo.delete_photo(created.id).await,
            Err(RepoError::NotFound(_))
        ));
        Ok(())
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn rejects_photos_of_unknown_activities(pool: sqlx::PgPool) -> Result<()> {
        let repo = test_repository(pool).await;
        assert!(matches!(
            repo.create_photo(photo(12345, None)).await,
            Err(RepoError::NotFound(_))
        ));
        Ok(())
    }

    #[sqlx::test(migrations = "../src/migrations")]
    async fn deleting_an_activity_deletes_its_photos(pool: sqlx::PgPool) -> Result<()> {
        let user_id = insert_user(&pool).await?;
        let activity_id = insert_activity(&pool, user_id).await?;
        let repo = test_repository(pool.clone()).await;
        let created = repo.create_photo(photo(activity_id, None)).await?;

        sqlx::query("DELETE FROM activity WHERE id = $1")
            .bind(activity_id)
            .execute(&pool)
            .await?;
        assert!(matches!(
            repo.get_photo(created.id).await,
            Err(RepoError::NotFound(_))
        ));
        Ok(())
    }
}
