resource "google_project_iam_member" "nawawan_dev_project_reader_member" {
  project = "nawawan-dev"
  role    = "roles/viewer"
  member  = "serviceAccount:${data.google_service_account.nawawan_dev_reader.email}"
}

resource "google_project_iam_member" "nawawan_dev_secret_accessor" {
  project = "nawawan-dev"
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:${data.google_service_account.nawawan_dev_reader.email}"
}

resource "google_project_iam_member" "nawawan_dev_project_editor_member" {
  project = "nawawan-dev"
  role    = "roles/editor"
  member  = "serviceAccount:${data.google_service_account.nawawan_dev_editor.email}"
}

locals {
  prod_sa_emails = [
    "serviceAccount:nawawan-prod-reader@nawawan.iam.gserviceaccount.com",
    "serviceAccount:nawawan-prod-editor@nawawan.iam.gserviceaccount.com"
  ]
}

resource "google_project_iam_member" "nawawan_prod_for_project" {
  for_each = toset(local.prod_sa_emails)
  project  = "nawawan-dev"
  role     = "roles/viewer"
  member   = each.value
}

resource "google_project_iam_member" "nawawan_prod_editor_for_resource" {
  project = "nawawan-dev"
  role    = "roles/resourcemanager.projectIamAdmin"
  member  = "serviceAccount:nawawan-prod-editor@nawawan.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "nawawan_prod_editor_for_secret" {
  project = "nawawan-dev"
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:nawawan-prod-editor@nawawan.iam.gserviceaccount.com"
}
