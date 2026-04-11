resource "google_iam_workload_identity_pool" "nawawan_dev_pool" {
  provider                  = google
  workload_identity_pool_id = "nawawan-dev-pool"
  display_name              = "nawawan dev pool"
  description               = "Workload Identity Pool for Nawawan dev actions"
}

resource "google_iam_workload_identity_pool_provider" "nawawan_dev_github_provider" {
  provider                           = google
  workload_identity_pool_id          = google_iam_workload_identity_pool.nawawan_dev_pool.workload_identity_pool_id
  workload_identity_pool_provider_id = "github"
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
  }

  attribute_condition = <<EOT
    assertion.repository == "nawawan/playground" &&
    assertion.ref.startsWith("refs/heads/") &&
    assertion.ref_type == "branch"
  EOT
}