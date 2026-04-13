resource "google_cloudbuildv2_connection" "cloudbuild_connection" {
    location = var.region
    name = "cloudbuild-connection"

    depends_on = [ 
        google_project_service.cloudbuild_prod,
        google_project_service.secretmanager_prod,
        google_project_iam_member.cloud_build_secret_accessor,
        google_secret_manager_secret_iam_member.cloud_build_github_token_accessor
    ]

    github_config {
        app_installation_id = 84909474

        authorizer_credential {
          oauth_token_secret_version = google_secret_manager_secret_version.github_token_secret_version.id
        }
    }
}

resource "google_cloudbuildv2_repository" "playground_repository" {
    project = var.project
    location = var.region
    name = "playground"
    parent_connection = google_cloudbuildv2_connection.cloudbuild_connection.name
    remote_uri = "https://github.com/nawawan/playground.git"
}

resource "google_cloudbuild_trigger" "cloudbuild_trigger" {
    project = var.project
    location = var.region
    name = "cloudbuild-trigger"
    description = "Cloud Build trigger for GitHub repository"

    repository_event_config {
      repository = google_cloudbuildv2_repository.playground_repository.id

      push {
        branch = "^main$"
      }
    }

    build {
        step {
            name = "gcr.io/cloud-builders/docker"
            args = [
                "build", 
                "-t", 
                "${var.region}-docker.pkg.dev/${var.project}/${google_artifact_registry_repository.nawawan_prod_repository.repository_id}/nawawan-playground:$$SHORT_SHA",
                "."
            ]
        }

        images = ["${var.region}-docker.pkg.dev/${var.project}/${google_artifact_registry_repository.nawawan_prod_repository.repository_id}/nawawan-playground:$$SHORT_SHA"]
    }
}
