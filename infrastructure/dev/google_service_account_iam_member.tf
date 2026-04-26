resource "google_service_account_iam_member" "nawawan_dev_reader_member" {
  provider           = google
  service_account_id = google_service_account.nawawan_dev_reader.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.nawawan_dev_pool.name}/attribute.repository/nawawan/playground"
}

resource "google_service_account_iam_member" "nawawan_dev_editor_member" {
  provider           = google
  service_account_id = google_service_account.nawawan_dev_editor.name
  role               = "roles/iam.workloadIdentityUser"
  member             = "principalSet://iam.googleapis.com/${google_iam_workload_identity_pool.nawawan_dev_pool.name}/attribute.repository/nawawan/playground"
}
