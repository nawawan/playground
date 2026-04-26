resource "google_secret_manager_secret_iam_member" "cloud_build_github_token_accessor" {
  secret_id = data.google_secret_manager_secret.github_token.id
  role      = "roles/secretmanager.secretAccessor"
  member    = "serviceAccount:service-${data.google_project.nawawan.number}@gcp-sa-cloudbuild.iam.gserviceaccount.com"
}
