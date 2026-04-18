# prodのArtifact RegistryをdevのService AccountでアクセスできるようにするためのIAM設定 
resource "google_project_iam_member" "dev_sa_prod_artifact_registry_reader" {
  project = data.google_project.nawawan-prod.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.dev_sa.email}"
}

# CI上で用いるSAのdevのprojectへの権限(読み取り専用)
resource "google_project_iam_member" "nawawan_dev_project_reader_member" {
  provider = google
  project  = var.project
  role     = "roles/viewer"
  member   = "serviceAccount:${google_service_account.nawawan_dev_reader.email}"
}

resource "google_service_account_iam_member" "nawawan_dev_reader_member" {
  provider = google
  service_account_id = google_service_account.nawawan_dev_reader.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.nawawan_dev_pool.name}/attribute.repository/nawawan/playground"
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

resource "google_service_account_iam_member" "nawawan_dev_editor_member" {
  provider = google
  service_account_id = google_service_account.nawawan_dev_editor.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.nawawan_dev_pool.name}/attribute.repository/nawawan/playground"
}

# tfState用のGCSバケットへのアクセス権限
resource "google_storage_bucket_iam_member" "nawawan_dev_reader_state_bucket" {
  provider = google
  bucket   = "nawawan-dev-terraform-state"
  role     = "roles/storage.objectAdmin"
  member   = "serviceAccount:${google_service_account.nawawan_dev_reader.email}"
}

resource "google_storage_bucket_iam_member" "nawawan_dev_editor_state_bucket" {
  provider = google
  bucket   = "nawawan-dev-terraform-state"
  role     = "roles/storage.objectAdmin"
  member   = "serviceAccount:${google_service_account.nawawan_dev_editor.email}"
}