use async_trait::async_trait;
use bytes::Bytes;

use crate::errors::repo_error::RepoError;
use crate::model::photo::{Photo, PhotoPosition};

#[async_trait]
pub trait PhotoRepository: Send + Sync {
    async fn create_photo(&self, photo: Photo) -> Result<Photo, RepoError>;
    async fn get_photo(&self, photo_id: i64) -> Result<Photo, RepoError>;
    /// Lists photos, optionally only those of one activity, oldest first.
    async fn list_photos(&self, activity_id: Option<i64>) -> Result<Vec<Photo>, RepoError>;
    async fn update_photo_position(
        &self,
        photo_id: i64,
        position: PhotoPosition,
    ) -> Result<Photo, RepoError>;
    async fn delete_photo(&self, photo_id: i64) -> Result<(), RepoError>;

    /// Stores an object under `_uploads/{key}` in the bucket.
    async fn put_photo_object(
        &self,
        key: &str,
        content_type: &str,
        data: Bytes,
    ) -> Result<(), RepoError>;
    async fn delete_photo_object(&self, key: &str) -> Result<(), RepoError>;
}
