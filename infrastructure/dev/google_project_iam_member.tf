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

# prodのSAへのdevのprojectへの権限(読み取り専用)
locals {
  prod_sa_emails = [
    "serviceAccount:nawawan-prod-reader@nawawan.iam.gserviceaccount.com",
    "serviceAccount:nawawan-prod-editor@nawawan.iam.gserviceaccount.com"
  ]
}
resource "google_project_iam_member" "nawawan_prod_for_project" {
  for_each = toset(local.prod_sa_emails)
  project = var.project
  role    = "roles/viewer"
  member  = each.value
}

resource "google_project_iam_member" "nawawan_prod_editor_for_resource" {
  project = var.project
  role    = "roles/resourcemanager.projectIamAdmin"
  member  = "serviceAccount:nawawan-prod-editor@nawawan.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "nawawan_prod_editor_for_secret" {
  project = var.project
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:nawawan-prod-editor@nawawan.iam.gserviceaccount.com"
}
