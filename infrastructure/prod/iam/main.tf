terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.4.0"
    }
  }
}

provider "google" {
  project = "nawawan"
  region  = "asia-northeast1"
}

data "google_project" "nawawan" {
  project_id = "nawawan"
}

data "google_project" "nawawan_dev" {
  project_id = "nawawan-dev"
}

data "google_service_account" "nawawan_prod_reader" {
  account_id = "nawawan-prod-reader"
  project    = "nawawan"
}

data "google_service_account" "nawawan_prod_editor" {
  account_id = "nawawan-prod-editor"
  project    = "nawawan"
}

data "google_secret_manager_secret" "github_token" {
  secret_id = "github-token-secret"
  project   = "nawawan"
}
