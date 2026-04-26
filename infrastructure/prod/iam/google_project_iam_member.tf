resource "google_project_iam_member" "nawawan_prod_project_reader_member" {
  project = "nawawan"
  role    = "roles/viewer"
  member  = "serviceAccount:${data.google_service_account.nawawan_prod_reader.email}"
}

resource "google_project_iam_member" "nawawan_prod_project_editor_member" {
  project = "nawawan"
  role    = "roles/editor"
  member  = "serviceAccount:${data.google_service_account.nawawan_prod_editor.email}"
}

resource "google_project_iam_member" "cloud_build_secret_accessor" {
  project = "nawawan"
  role    = "roles/secretmanager.secretAccessor"
  member  = "serviceAccount:service-${data.google_project.nawawan.number}@gcp-sa-cloudbuild.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "dev_sa_prod_artifact_registry_reader" {
  project = "nawawan"
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:nawawan-dev-reader@nawawan-dev.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "dev_cloud_run_service_agent_prod_artifact_registry_reader" {
  project = "nawawan"
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:service-${data.google_project.nawawan_dev.number}@serverless-robot-prod.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "dev_prod_reader_for_reader" {
  project = "nawawan"
  role    = "roles/viewer"
  member  = "serviceAccount:nawawan-dev-reader@nawawan-dev.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "dev_prod_reader_for_editor" {
  project = "nawawan"
  role    = "roles/viewer"
  member  = "serviceAccount:nawawan-dev-editor@nawawan-dev.iam.gserviceaccount.com"
}

resource "google_project_iam_member" "dev_sa_prod_artifact_registry_editor" {
  project = "nawawan"
  role    = "roles/artifactregistry.writer"
  member  = "serviceAccount:nawawan-dev-editor@nawawan-dev.iam.gserviceaccount.com"
}
