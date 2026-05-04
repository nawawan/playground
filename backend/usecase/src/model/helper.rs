use uuid::Uuid;

use crate::errors::app_error::AppError;

pub fn uuid_from_string(s: &str) -> Result<Uuid, AppError> {
    Uuid::parse_str(s).map_err(|_| AppError::invalid(Some(s)))
}
