resource "google_cloudbuildv2_connection" "cloudbuild_connection" {
  location = var.region
  name     = "cloudbuild-connection"

  depends_on = [
    google_project_service.cloudbuild_prod,
    google_project_service.secretmanager_prod,
    google_project_iam_member.cloud_build_secret_accessor,
    google_secret_manager_secret_iam_member.cloud_build_github_token_accessor
  ]

  github_config {
    app_installation_id = 84909474

    authorizer_credential {

      oauth_token_secret_version = "${google_secret_manager_secret.github_token.id}/versions/latest"
    }
  }
}

resource "google_cloudbuildv2_repository" "playground_repository" {
  project           = var.project
  location          = var.region
  name              = "playground"
  parent_connection = google_cloudbuildv2_connection.cloudbuild_connection.id
  remote_uri        = var.github_repository_uri
}

resource "google_cloudbuild_trigger" "cloudbuild_trigger_push" {
  provider    = google-beta
  project     = var.project
  location    = var.region
  name        = "cloudbuild-trigger"
  description = "Cloud Build trigger for GitHub repository"

  service_account = "projects/${var.project}/serviceAccounts/${data.google_project.nawawan.number}-compute@developer.gserviceaccount.com"

  repository_event_config {
    repository = google_cloudbuildv2_repository.playground_repository.id

    push {
      branch = "^main$"
    }
  }

  filename = "cloudbuild.yaml"
}

resource "google_cloudbuild_trigger" "cloudbuild_trigger_pr" {
  provider    = google-beta
  project     = var.project
  location    = var.region
  name        = "cloudbuild-trigger"
  description = "Cloud Build trigger for GitHub repository for pull requests"

  service_account = "projects/${var.project}/serviceAccounts/${data.google_project.nawawan.number}-compute@developer.gserviceaccount.com"

  repository_event_config {
    repository = google_cloudbuildv2_repository.playground_repository.id

    pull_request {
      branch       = "^main$"
      invert_regex = true
    }
  }

  filename = "cloudbuild.yaml"
}

