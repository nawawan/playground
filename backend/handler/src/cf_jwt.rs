use jsonwebtoken::{Algorithm, DecodingKey, Validation, decode, decode_header};
use serde::{Deserialize, Serialize};
use shared::jwks_cache::{Jwk, JwksCache};
use std::sync::Arc;

#[derive(Debug, Deserialize, Serialize, Clone)]
pub struct CfAccessClaims {
    pub iss: String,
    pub aud: Vec<String>,
    pub email: String,
    pub sub: String,
    pub exp: u64,
    pub iat: u64,
}

#[derive(Debug)]
pub enum JwtError {
    MissingKid,
    InvalidToken(String),
    JwksFetch(String),
    UnknownKid(String),
}

pub async fn verify_cf_jwt(
    token: &str,
    cache: &Arc<JwksCache>,
    expected_aud: &str,
) -> Result<CfAccessClaims, JwtError> {
    let header = decode_header(token).map_err(|e| JwtError::InvalidToken(e.to_string()))?;
    let kid = header.kid.ok_or(JwtError::MissingKid)?;

    let jwks = cache
        .get_keys()
        .await
        .map_err(|e| JwtError::JwksFetch(e.to_string()))?;
    let jwk = find_jwk_by_kid(&jwks.keys, &kid);

    let jwk = if let Some(k) = jwk {
        k.clone()
    } else {
        let refreshed = cache
            .refresh()
            .await
            .map_err(|e| JwtError::JwksFetch(e.to_string()))?;
        find_jwk_by_kid(&refreshed.keys, &kid)
            .ok_or_else(|| JwtError::UnknownKid(kid.clone()))?
            .clone()
    };

    verify_with_key(token, &jwk, expected_aud)
}

fn verify_with_key(token: &str, jwk: &Jwk, expected_aud: &str) -> Result<CfAccessClaims, JwtError> {
    let decoding_key = DecodingKey::from_rsa_components(&jwk.n, &jwk.e)
        .map_err(|e| JwtError::InvalidToken(e.to_string()))?;

    let mut validation = Validation::new(Algorithm::RS256);
    validation.set_audience(&[expected_aud]);

    let token_data = decode::<CfAccessClaims>(token, &decoding_key, &validation)
        .map_err(|e| JwtError::InvalidToken(e.to_string()))?;

    Ok(token_data.claims)
}

fn find_jwk_by_kid<'a>(keys: &'a [Jwk], kid: &str) -> Option<&'a Jwk> {
    keys.iter().find(|k| k.kid == kid)
}
