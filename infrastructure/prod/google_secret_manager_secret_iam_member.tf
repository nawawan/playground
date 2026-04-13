data "google_project" "current" {
  project_id = var.project
}

resource "google_project_iam_member" "cloud_build_secret_accessor" {
  project = var.project
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${google_project_service_identity.cloudbuild.email}"
}

resource "google_secret_manager_secret_iam_member" "cloud_build_github_token_accessor" {
  provider  = google
  secret_id = google_secret_manager_secret.github_token.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:${google_project_service_identity.cloudbuild.email}"
}