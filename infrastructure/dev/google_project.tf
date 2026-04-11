resource "google_project_service" "iamcredentials_dev" {
  provider = google
  project  = var.project
  service  = "iamcredentials.googleapis.com"
}

resource "google_project_service" "iam_dev" {
  project = var.project
  service = "iam.googleapis.com"
}

resource "google_project_service" "sts_dev" {
  project = var.project
  service = "sts.googleapis.com"
}