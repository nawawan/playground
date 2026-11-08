use axum::{
    Json,
    extract::{Path, State},
};
use std::sync::Arc;
use tracing::error;

use crate::extractor::AuthorizedUser;
use crate::helper;
use crate::model::user::{UpdateUserRequest, UserResponse};

use super::error::UsecaseError;
use super::handler::Handler;
use usecase::service::service::Service;
use usecase::service::user::user_service::UserService;

impl Handler {
    /// 公開API。ホームページのプロフィール表示に使う。
    pub async fn get_user(
        state: State<Arc<Service>>,
        Path(name): Path<String>,
    ) -> Result<Json<UserResponse>, UsecaseError> {
        let user = state.0.get_user_by_name(&name).await?;
        Ok(Json(user.into()))
    }

    /// JWT で認証されたユーザー自身のプロフィールを更新する。
    /// 更新対象は body ではなく JWT 由来のユーザーに固定し、他人のレコードは更新できない。
    pub async fn update_user(
        user: AuthorizedUser,
        state: State<Arc<Service>>,
        Json(req): Json<UpdateUserRequest>,
    ) -> Result<Json<UserResponse>, UsecaseError> {
        if let Err(e) = helper::validate_admin(&user) {
            error!("Permission denied: {}", e.error.message);
            return Err(e);
        }

        let updated = state
            .0
            .update_user_profile(user.user.id, req.into())
            .await?;
        Ok(Json(updated.into()))
    }
}
