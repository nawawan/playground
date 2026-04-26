resource "google_cloud_run_v2_service" "nawawan_dev_service" {
  provider = google
  project  = var.project
  location = var.region
  deletion_protection = false
  name     = "nawawan-dev-service"
  ingress = "INGRESS_TRAFFIC_ALL"

  scaling {
    max_instance_count = 3
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }

  template {
    containers {
      image = "asia-northeast1-docker.pkg.dev/nawawan/nawawan-prod-repository/nawawan-playground:latest"

      env {
        name = "ENV"
        value = "dev"
      }
      env {
        name = "DATABASE_URL"
        value_source {
          secret_key_ref {
            secret = google_secret_manager_secret.dev_database_url.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "CLOUDFLARE_ACCESS_KEY_ID"
        value_source {
          secret_key_ref {
            secret = google_secret_manager_secret.dev_cloudflare_access_key_id.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "CLOUDFLARE_SECRET_ACCESS_KEY"
        value_source {
          secret_key_ref {
            secret = google_secret_manager_secret.dev_cloudflare_secret_access_key.secret_id
            version = "latest"
          }
        }
      }
      env {
        name = "CLOUDFLARE_ACCOUNT_ID"
        value_source {
            secret_key_ref {
              secret = google_secret_manager_secret.dev_cloudflare_account_id.secret_id
              version = "latest"
            }
        }
      }
      env {
        name = "REDIS_HOST"
        value = "localhost"
      }
      env {
        name = "REDIS_PORT"
        value = 6379
      }
      env {
        name = "TOKEN_TTL"
        value = 300
      }
      env {
        name = "REFRESH_TTL"
        value = 86400
      }
      env {
        name = "BLOG_PAGE"
        value = "https://nawawan.com/blogs"
      }
      env {
        name = "PAGE_HOST"
        value = "https://nawawan.com"
      }
    }
  }
}
