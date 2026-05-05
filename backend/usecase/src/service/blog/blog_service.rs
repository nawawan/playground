use super::super::service::Service;
use crate::errors::app_error::AppError;
use crate::model::blog::{self, Blog, BlogFilter, BlogRequest, BlogStatus};
use crate::model::helper::uuid_from_string;
use crate::model::image::Image;

use async_trait::async_trait;
use bytes::Bytes;
use shared::markdown_converter::convert;
use std::env;
use tracing::error;
use uuid::Uuid;

#[async_trait]
pub trait BlogService {
    async fn get_blog(&self, id: String) -> Result<Blog, AppError>;
    async fn list_blogs(&self, year: Option<&String>, month: Option<&String>) -> Vec<Blog>;
    async fn create_blog(&self, blog: BlogRequest) -> Result<Blog, AppError>;
    async fn update_blog(&self, blog: BlogRequest) -> Result<Blog, AppError>;
    async fn create_draft(&self) -> Result<String, AppError>;
    async fn upload_blog_image(&self, image_data: Bytes) -> Result<Image, AppError>;
}

#[async_trait]
impl BlogService for Service {
    async fn list_blogs(&self, year: Option<&String>, month: Option<&String>) -> Vec<Blog> {
        let filter = BlogFilter::new(year, month);
        let blogs = self.repository.list_blogs(filter).await;

        blogs
    }

    async fn get_blog(&self, id: String) -> Result<Blog, AppError> {
        let blog = self
            .repository
            .get_blog(uuid_from_string(&id)?)
            .await
            .map_err(|e| {
                error!("Failed to get blog by id: {}, err: {}", id, e);
                AppError::internal(Some("Failed to get blog"))
            })?;
        Ok(blog)
    }

    async fn create_draft(&self) -> Result<String, AppError> {
        let mut tx = self.repository.create_transaction().await?;
        let id = self.repository.create_draft(&mut tx).await?;
        tx.commit().await.map_err(|e| {
            error!("Failed to commit transaction for creating draft: {e}");
            AppError::internal(Some("Transaction commit failed"))
        })?;
        Ok(id)
    }

    async fn create_blog(&self, blog_req: BlogRequest) -> Result<Blog, AppError> {
        let uuid = Uuid::now_v7();
        let blog_url = env::var("BLOG_PAGE");

        if let Err(e) = blog_url {
            error!("BLOG_PAGE environment variable is not set: {e}");
            return Err(AppError::internal(Some("environment variable is not set")));
        }
        let content_key = format!("{}/{}.html", blog_url.unwrap(), uuid);

        let blog = Blog {
            id: uuid,
            title: blog_req.title,
            content_key: content_key,
            status: BlogStatus::Published,
        };

        let result = {
            let mut tx = self.repository.create_transaction().await?;
            let blog = self.repository.create_blog(&mut tx, blog).await?;
            self.repository
                .upload_blog_file(uuid.to_string(), blog_req.content)
                .await?;

            tx.commit().await.map_err(|e| {
                error!("Failed to commit transaction for creating blog: {e}");
                AppError::internal(Some("Transaction commit failed"))
            })?;

            Ok::<Blog, AppError>(blog)
        };

        result
    }

    async fn update_blog(&self, blog_req: BlogRequest) -> Result<Blog, AppError> {
        let blog_url = env::var("BLOG_PAGE");

        if let Err(e) = blog_url {
            error!("BLOG_PAGE environment variable is not set: {e}");
            return Err(AppError::internal(Some("environment variable is not set")));
        }

        if blog_req.id.is_none() {
            error!("id is not set");
            return Err(AppError::invalid(Some("invalid request")));
        }
        let blog_id_str = blog_req
            .id
            .ok_or(AppError::invalid(Some("Blog id is not set")))?;
        let blog_id = Uuid::parse_str(&blog_id_str.clone()).map_err(|e| {
            error!("A format of blog id is invalid");
            return AppError::invalid(Some("Invalid blog id"));
        })?;

        let content_key = format!("{}/{}.html", blog_url.unwrap(), blog_id_str);

        let blog = Blog {
            id: blog_id,
            title: blog_req.title,
            content_key: content_key,
            status: BlogStatus::Published,
        };

        let content_html = convert(&blog_req.content).map_err(|e| {
            error!("Failed to convert markdown into html");
            return AppError::internal(Some("Failed to convert markdown file"));
        })?;

        let result = {
            let mut tx = self.repository.create_transaction().await?;
            let blog = self.repository.create_blog(&mut tx, blog).await?;
            self.repository
                .upload_blog_file(blog_id_str, content_html)
                .await?;

            tx.commit().await.map_err(|e| {
                error!("Failed to commit transaction for creating blog: {e}");
                AppError::internal(Some("Transaction commit failed"))
            })?;

            Ok::<Blog, AppError>(blog)
        };

        result
    }

    async fn upload_blog_image(&self, image_data: Bytes) -> Result<Image, AppError> {
        let image_id = Uuid::now_v7().to_string();
        self.repository
            .upload_image(image_id, image_data)
            .await
            .map_err(|e| {
                error!("Failed to upload blog image: {e}");
                AppError::internal(Some("Failed to upload blog image"))
            })
    }
}
