resource "google_secret_manager_secret" "github_token" {
  secret_id = "github-token-secret"

  replication {
    auto {}
  }
}