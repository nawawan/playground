resource "google_artifact_registry_repository" "nawawan_prod_repository" {
  provider      = google
  project       = var.project
  location      = var.region
  repository_id = "nawawan-prod-repository"
  description   = "docker repository for nawawan prod"
  format        = "DOCKER"
}