use uuid::Uuid;

#[derive(Clone)]
pub struct User {
    pub id: Uuid,
    pub name: String,
    pub email: String,
    pub role: String,
}
