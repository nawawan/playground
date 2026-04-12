// sa for github actions to read
resource "google_service_account" "nawawan_prod_reader" {
  provider     = google
  account_id   = "nawawan-prod-reader"
  display_name = "Nawawan Prod Reader"
}

resource "google_project_iam_member" "nawawan_prod_project_reader_member" {
  provider = google
  project  = var.project
  role     = "roles/viewer"
  member   = "serviceAccount:${google_service_account.nawawan_prod_reader.email}"
}

resource "google_service_account_iam_member" "nawawan_prod_reader_member" {
  provider           = google
  service_account_id = google_service_account.nawawan_prod_reader.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.nawawan_prod_pool.name}/attribute.repository/nawawan/playground"
}

// sa for github actions with editor role
resource "google_service_account" "nawawan_prod_editor" {
  provider     = google
  account_id   = "nawawan-prod-editor"
  display_name = "Nawawan Prod Editor"
}

resource "google_project_iam_member" "nawawan_prod_project_editor_member" {
  provider = google
  project  = var.project
  role     = "roles/editor"
  member   = "serviceAccount:${google_service_account.nawawan_prod_editor.email}"
}

resource "google_service_account_iam_member" "nawawan_prod_editor_member" {
  provider           = google
  service_account_id = google_service_account.nawawan_prod_editor.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.nawawan_prod_pool.name}/attribute.repository/nawawan/playground"
}

resource "google_storage_bucket_iam_member" "nawawan_prod_reader_state_bucket" {
  provider = google
  bucket   = "nawawan-terraform-state"
  role     = "roles/storage.objectViewer"
  member   = "serviceAccount:${google_service_account.nawawan_prod_reader.email}"
}

resource "google_storage_bucket_iam_member" "nawawan_prod_editor_state_bucket" {
  provider = google
  bucket   = "nawawan-terraform-state"
  role     = "roles/storage.objectEditor"
  member   = "serviceAccount:${google_service_account.nawawan_prod_editor.email}"
}


// sa for secret manager access
resource "google_service_account" "nawawan_prod_secret_manager" {
  provider     = google
  account_id   = "nawawan-secret-manager"
  display_name = "Nawawan Prod Secret Manager"
}

resource "google_project_iam_member" "nawawan_prod_secret_manager_member" {
  provider = google
  project  = var.project
  role     = "roles/secretmanager.secretAccessor"
  member   = "serviceAccount:${google_service_account.nawawan_prod_secret_manager.email}"
}