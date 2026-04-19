resource "google_project_service_identity" "cloudbuild" {
  provider = google-beta
  project  = var.project
  service  = "cloudbuild.googleapis.com"

  depends_on = [google_project_service.cloudbuild_prod]
}