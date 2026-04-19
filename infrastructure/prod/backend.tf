terraform {
  backend "gcs" {
    bucket = "nawawan-terraform-state"
    prefix = "prod/terraform/state"
  }
}