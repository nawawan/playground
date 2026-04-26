terraform {
  backend "gcs" {
    bucket = "nawawan-terraform-state"
    prefix = "prod/iam/terraform/state"
  }
}
