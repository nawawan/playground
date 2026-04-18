resource "google_iam_workload_identity_pool" "nawawan_prod_pool" {
  provider                  = google
  workload_identity_pool_id = "nawawan-prod-pool"
  display_name              = "nawawan prod pool"
  description               = "Workload Identity Pool for Nawawan prod actions"
}

resource "google_iam_workload_identity_pool_provider" "nawawan_prod_github_provider" {
  provider                           = google
  workload_identity_pool_id          = google_iam_workload_identity_pool.nawawan_prod_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-prod-reader"
  display_name                       = "GitHub actions Provider"
  description                        = "Workload Identity Pool Provider for GitHub Actions"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
    "attribute.ref_type"   = "assertion.ref_type"
    "attribute.event_name" = "assertion.event_name"
  }

  attribute_condition = <<EOT
    assertion.repository == "nawawan/playground" &&
    assertion.event_name in ["pull_request", "workflow_dispatch"]
  EOT
}

resource "google_iam_workload_identity_pool_provider" "nawawan_prod_github_provider_editor" {
  provider                           = google
  workload_identity_pool_id          = google_iam_workload_identity_pool.nawawan_prod_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github-prod-editor"
  display_name                       = "GitHub actions editor Provider"
  description                        = "Workload Identity Pool Provider for GitHub Actions"

  oidc {
    issuer_uri = "https://token.actions.githubusercontent.com"
  }

  attribute_mapping = {
    "google.subject"       = "assertion.sub"
    "attribute.repository" = "assertion.repository"
    "attribute.ref"        = "assertion.ref"
    "attribute.ref_type"   = "assertion.ref_type"
  }

  attribute_condition = <<EOT
    assertion.repository == "nawawan/playground" &&
    assertion.ref_type == "branch" &&
    assertion.ref == "refs/heads/main"
  EOT
}