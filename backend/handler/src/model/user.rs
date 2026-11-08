use usecase::model::user::{User, UserProfileUpdate};

/// 公開用のユーザー情報。email / role は含めない。
#[derive(Debug, Clone, serde::Deserialize, serde::Serialize)]
pub struct UserResponse {
    pub id: String,
    pub username: String,
    pub thumbnail: Option<String>,
    pub summary: Option<String>,
    pub place: Option<String>,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id.to_string(),
            username: user.name,
            thumbnail: user.thumbnail,
            summary: user.summary,
            place: user.place,
        }
    }
}

#[derive(Debug, Clone, serde::Deserialize)]
pub struct UpdateUserRequest {
    pub thumbnail: Option<String>,
    pub summary: Option<String>,
    pub place: Option<String>,
}

impl From<UpdateUserRequest> for UserProfileUpdate {
    fn from(req: UpdateUserRequest) -> Self {
        // 空文字は未設定(NULL)として扱う
        let normalize = |v: Option<String>| v.filter(|s| !s.trim().is_empty());
        Self {
            thumbnail: normalize(req.thumbnail),
            summary: normalize(req.summary),
            place: normalize(req.place),
        }
    }
}
