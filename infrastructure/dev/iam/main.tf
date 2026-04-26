terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.4.0"
    }
  }
}

provider "google" {
  project = "nawawan-dev"
  region  = "asia-northeast1"
}

data "google_service_account" "nawawan_dev_reader" {
  account_id = "nawawan-dev-reader"
  project    = "nawawan-dev"
}

data "google_service_account" "nawawan_dev_editor" {
  account_id = "nawawan-dev-editor"
  project    = "nawawan-dev"
}
