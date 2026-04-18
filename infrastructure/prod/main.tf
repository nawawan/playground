terraform {
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "7.4.0"
    }
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~>7.4.0"
    }
  }
}

data "google_project" "nawawan" {
    project_id = var.project
}

provider "google" {
  project = var.project
  region  = var.region
  zone    = var.zone
}

provider "google-beta" {
  project = var.project
  region  = var.region
  zone    = var.zone
}