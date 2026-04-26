resource "google_secret_manager_secret" "dev_database_url" {
    secret_id =  "database-url"

    labels = {
        label = "dev-database-url"
    }

    replication {
        auto {}
    }
}

resource "google_secret_manager_secret" "dev_cloudflare_access_key_id" {
    secret_id = "dev_cloudflare_access_key_id"

    labels = {
        label = "dev_cloudflare_access_key_id"
    }

    replication {
      auto {}
    }
}

resource "google_secret_manager_secret" "dev_cloudflare_secret_access_key" {
    secret_id = "dev_cloudflare_secret_access_key"

    labels = {
        label = "dev_cloudflare_secret_access_key"
    }

    replication {
      auto {}
    }
}

resource "google_secret_manager_secret" "dev_cloudflare_account_id" {
    secret_id = "dev_cloudflare_account_id"

    labels = {
        label = "dev_cloudflare_account_id"
    }

    replication {
      auto {}
    }
}
