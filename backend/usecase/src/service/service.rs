use crate::repository::repositories::Repositories;
use shared::config::Config;
use shared::jwks_cache::JwksCache;
use std::sync::Arc;

pub struct Service {
    pub config: Config,
    pub repository: Box<dyn Repositories>,
    pub jwks_cache: Arc<JwksCache>,
}

impl Service {
    pub fn new(
        config: Config,
        repository: Box<dyn Repositories>,
        jwks_cache: Arc<JwksCache>,
    ) -> Self {
        Self {
            config,
            repository,
            jwks_cache,
        }
    }
}
