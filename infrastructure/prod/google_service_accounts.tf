resource "google_service_account" "nawawan_prod_reader" {
  provider     = google
  account_id   = "nawawan-prod-reader"
  display_name = "Nawawan Prod Reader"
}

resource "google_service_account_iam_member" "nawawan_prod_reader_member" {
  provider           = google
  service_account_id = google_service_account.nawawan_prod_reader.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.nawawan_prod_pool.name}/attribute.repository/nawawan/playground"
}

resource "google_service_account" "nawawan_prod_editor" {
  provider     = google
  account_id   = "nawawan-prod-editor"
  display_name = "Nawawan Prod Editor"
}

resource "google_service_account_iam_member" "nawawan_prod_editor_member" {
  provider           = google
  service_account_id = google_service_account.nawawan_prod_editor.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.nawawan_prod_pool.name}/attribute.repository/nawawan/playground"
}
