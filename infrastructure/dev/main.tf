terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.4.0"
    }
  }
}

provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone
}

data "google_project" "nawawan_dev" {
  project_id = var.project
}

data "google_project" "nawawan" {
  project_id = "nawawan"
}