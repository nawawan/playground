resource "google_secret_manager_secret" "github_token" {
  secret_id = "github-token-secret"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret_version" "github_token_secret_version" {
  secret      = google_secret_manager_secret.github_token.id
  secret_data = var.github_token
}
