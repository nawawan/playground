resource "google_storage_bucket_iam_member" "nawawan_prod_reader_state_bucket" {
  bucket = "nawawan-terraform-state"
  role   = "roles/storage.legacyBucketOwner"
  member = "serviceAccount:${data.google_service_account.nawawan_prod_reader.email}"
}

resource "google_storage_bucket_iam_member" "nawawan_prod_editor_state_bucket" {
  bucket = "nawawan-terraform-state"
  role   = "roles/storage.objectAdmin"
  member = "serviceAccount:${data.google_service_account.nawawan_prod_editor.email}"
}
