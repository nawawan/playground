terraform {
    backend "gcs" {
        bucket  = "nawawan-dev-terraform-state"
        prefix  = "dev/terraform/state"
    }
}