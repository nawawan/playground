resource "google_service_account" "nawawan_dev_reader" {
  provider      = google
  account_id    = "nawawan-dev-reader"
  display_name  = "Nawawan Dev Reader"
}

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


resource "google_service_account" "nawawan_dev_editor" {
  provider      = google
  account_id    = "nawawan-dev-editor"
  display_name  = "Nawawan Dev Editor"
}

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