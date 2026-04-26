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

