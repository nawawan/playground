# prodのArtifact RegistryをdevのService AccountでアクセスできるようにするためのIAM設定 
resource "google_project_iam_member" "dev_sa_prod_artifact_registry_reader" {
  project = data.google_project.nawawan-prod.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.nawawan_dev_reader.email}"
}

# CI上で用いるSAのdevのprojectへの権限(読み取り専用)
resource "google_project_iam_member" "nawawan_dev_project_reader_member" {
  provider = google
  project  = var.project
  role     = "roles/viewer"
  member   = "serviceAccount:${google_service_account.nawawan_dev_reader.email}"
}

resource "google_project_iam_member" "nawawan_dev_secret_accessor" {
    project = var.project
    role = "roles/secretmanager.secretAccessor"
    member = "serviceAccount:${google_service_account.nawawan_dev_reader.email}"
}

# CIのapply用SAのdevのprojectへの権限(編集者)
resource "google_project_iam_member" "nawawan_dev_project_editor_member" {
  provider = google
  project  = var.project
  role     = "roles/editor"
  member   = "serviceAccount:${google_service_account.nawawan_dev_editor.email}"
}

# prodのArtifact RegistryをdevのService AccountでアクセスできるようにするためのIAM設定 
resource "google_project_iam_member" "dev_sa_prod_artifact_registry_editor" {
  project = data.google_project.nawawan-prod.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.nawawan_dev_editor.email}"
}