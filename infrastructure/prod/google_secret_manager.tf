resource "google_secret_manager_secret" "github_token" {
  secret_id = "github-token-secret"

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "prod_cloudflare_access_key_id" {
  secret_id = "prod_cloudflare_access_key_id"

  labels = {
    label = "prod_cloudflare_access_key_id"
  }

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "prod_cloudflare_secret_access_key" {
  secret_id = "prod_cloudflare_secret_access_key"

  labels = {
    label = "prod_cloudflare_secret_access_key"
  }

  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "prod_cloudflare_account_id" {
  secret_id = "prod_cloudflare_account_id"

  labels = {
    label = "prod_cloudflare_account_id"
  }

  replication {
    auto {}
  }
}
