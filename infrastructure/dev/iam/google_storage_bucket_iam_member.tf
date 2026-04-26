resource "google_storage_bucket_iam_member" "nawawan_dev_reader_state_bucket" {
  bucket = "nawawan-dev-terraform-state"
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${data.google_service_account.nawawan_dev_reader.email}"
}

resource "google_storage_bucket_iam_member" "nawawan_dev_editor_state_bucket" {
  bucket = "nawawan-dev-terraform-state"
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${data.google_service_account.nawawan_dev_editor.email}"
}
