use uuid::Uuid;

#[derive(Clone, Debug)]
pub struct Travel {
    pub id: i64,
    pub user_id: Uuid,
    pub name: String,
}
