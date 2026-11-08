use uuid::Uuid;

#[derive(Clone)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub role: String,
    pub thumbnail: Option<String>,
    pub summary: Option<String>,
    pub place: Option<String>,
}

/// プロフィールの更新内容。3項目すべてを置き換える(None は未設定=NULL)。
#[derive(Clone)]
pub struct UserProfileUpdate {
    pub thumbnail: Option<String>,
    pub summary: Option<String>,
    pub place: Option<String>,
}
