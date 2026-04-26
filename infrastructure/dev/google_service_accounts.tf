resource "google_service_account" "nawawan_dev_reader" {
  provider     = google
  account_id   = "nawawan-dev-reader"
  display_name = "Nawawan Dev Reader"
}

resource "google_service_account" "nawawan_dev_editor" {
  provider     = google
  account_id   = "nawawan-dev-editor"
  display_name = "Nawawan Dev Editor"
}
