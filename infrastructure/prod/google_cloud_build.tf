resource "google_cloudbuildv2_connection" "cloudbuild_connection" {
    location = var.region
    name = "cloudbuild-connection"

    github_config {
        app_installation_id = 0

        authorizer_credential {
          oauth_token_secret_version = google_secret_manager_secret.github_token_secret_version.id
        }
    }
}

resource "goog;e_cloudbuild_trigger" "cloudbuild_trigger" {
    project = var.project
    name = "cloudbuild-trigger"
    description = "Cloud Build trigger for GitHub repository"

    github {
        owner = "nawawan"
        name = "playground"
        push {
            branch = "main"
        }
    }

    build {
        steps {
            name = "gcr.io/cloud-builders/docker"
            args = ["build", "-t", "gcr.io/${var.project}/nawawan-playground:${var.image_tag}", "."]
        }
        images = ["gcr.io/${var.project}/nawawan-playground:${var.image_tag}"]
    }
}