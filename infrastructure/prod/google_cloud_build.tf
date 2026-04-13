resource "google_cloudbuildv2_connection" "cloudbuild_connection" {
    location = var.region
    name = "cloudbuild-connection"

    github_config {
        app_installation_id = 84909474

        authorizer_credential {
          oauth_token_secret_version = google_secret_manager_secret_version.github_token_secret_version.id
        }
    }
}

resource "google_cloudbuild_trigger" "cloudbuild_trigger" {
    project = var.project
    name = "cloudbuild-trigger"
    description = "Cloud Build trigger for GitHub repository"

    trigger_template {
      branch_name = "main"
      repo_name = "nawawan/playground"
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