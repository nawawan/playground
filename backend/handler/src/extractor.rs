use axum::extract::FromRequestParts;
use axum::http::request::Parts;
use std::sync::Arc;

use usecase::model::user::User;
use usecase::service::service::Service;
use usecase::service::user::user_service::UserService;

use crate::cf_jwt::{JwtError, verify_cf_jwt};
use crate::error::UsecaseError;

const CF_JWT_HEADER: &str = "Cf-Access-Jwt-Assertion";

pub struct AuthorizedUser {
    pub user: User,
}

impl FromRequestParts<Arc<Service>> for AuthorizedUser {
    type Rejection = UsecaseError;

    async fn from_request_parts(
        parts: &mut Parts,
        service: &Arc<Service>,
    ) -> Result<Self, Self::Rejection> {
        let token = parts
            .headers
            .get(CF_JWT_HEADER)
            .and_then(|v| v.to_str().ok())
            .ok_or_else(|| UsecaseError::unauthorized("unauthorized error"))?;

        let claims = verify_cf_jwt(token, &service.jwks_cache, &service.config.cf_access_aud)
            .await
            .map_err(|e| {
                let msg = match &e {
                    JwtError::MissingKid => "invalid JWT: missing kid",
                    JwtError::InvalidToken(_) => "invalid JWT",
                    JwtError::JwksFetch(_) => "failed to fetch JWKS",
                    JwtError::UnknownKid(_) => "unknown JWT key ID",
                };
                UsecaseError::unauthorized(msg)
            })?;

        let user = service
            .get_user_by_email(&claims.email)
            .await
            .map_err(|_| UsecaseError::unauthorized("unauthorized error"))?;

        Ok(Self { user })
    }
}
