resource "google_service_account" "nawawan_prod_reader" {
  provider     = google
  account_id   = "nawawan-prod-reader"
  display_name = "Nawawan Prod Reader"
}

resource "google_service_account" "nawawan_prod_editor" {
  provider     = google
  account_id   = "nawawan-prod-editor"
  display_name = "Nawawan Prod Editor"
}
