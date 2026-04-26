data "google_project" "nawawan_dev" {
  project_id = "nawawan-dev"
}

resource "google_project_iam_member" "dev_sa_prod_artifact_registry_reader" {
  project = var.project
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:nawawan-dev-reader@nawawan-dev.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "dev_cloud_run_service_agent_prod_artifact_registry_reader" {
  project = var.project
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:service-${data.google_project.nawawan_dev.number}@serverless-robot-prod.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "dev_prod_reader_for_reader" {
  project = var.project
  role    = "roles/viewer"
  member  = "serviceAccount:nawawan-dev-reader@nawawan-dev.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "dev_prod_reader_for_editor" {
  project = var.project
  role    = "roles/viewer"
  member  = "serviceAccount:nawawan-dev-editor@nawawan-dev.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "dev_sa_prod_artifact_registry_editor" {
  project = var.project
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:nawawan-dev-editor@nawawan-dev.iam.gserviceaccount.com"
}
