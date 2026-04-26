use reqwest::Client as HttpClient;
use serde::Deserialize;
use std::sync::Arc;
use tokio::sync::RwLock;

#[derive(Deserialize, Clone)]
pub struct Jwks {
    pub keys: Vec<Jwk>,
}

#[derive(Deserialize, Clone)]
pub struct Jwk {
    pub kid: String,
    pub n: String,
    pub e: String,
}

#[derive(Debug)]
pub enum JwksFetchError {
    Http(String),
}

impl std::fmt::Display for JwksFetchError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            JwksFetchError::Http(msg) => write!(f, "JWKS fetch error: {}", msg),
        }
    }
}

pub struct JwksCache {
    http_client: HttpClient,
    team_domain: String,
    cached: RwLock<Option<Jwks>>,
}

impl JwksCache {
    pub fn new(team_domain: String) -> Arc<Self> {
        Arc::new(Self {
            http_client: HttpClient::new(),
            team_domain,
            cached: RwLock::new(None),
        })
    }

    pub async fn get_keys(&self) -> Result<Jwks, JwksFetchError> {
        {
            let guard = self.cached.read().await;
            if let Some(ref keys) = *guard {
                return Ok(keys.clone());
            }
        }
        self.fetch_and_cache().await
    }

    pub async fn refresh(&self) -> Result<Jwks, JwksFetchError> {
        self.fetch_and_cache().await
    }

    async fn fetch_and_cache(&self) -> Result<Jwks, JwksFetchError> {
        let url = format!("https://{}/cdn-cgi/access/certs", self.team_domain);
        let jwks: Jwks = self
            .http_client
            .get(&url)
            .send()
            .await
            .map_err(|e| JwksFetchError::Http(e.to_string()))?
            .json()
            .await
            .map_err(|e| JwksFetchError::Http(e.to_string()))?;

        let mut guard = self.cached.write().await;
        *guard = Some(jwks.clone());
        Ok(jwks)
    }
}
