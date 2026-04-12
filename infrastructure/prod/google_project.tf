resource "google_project_service" "iamcredentials_prod" {
  provider = google
  project  = var.project
  service  = "iamcredentials.googleapis.com"
}

resource "google_project_service" "iam_prod" {
  project = var.project
  service = "iam.googleapis.com"
}

resource "google_project_service" "sts_prod" {
  project = var.project
  service = "sts.googleapis.com"
}

resource "google_project_service" "cloudresourcemanager_prod" {
  project = var.project
  service = "cloudresourcemanager.googleapis.com"
}