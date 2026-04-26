resource "google_cloud_run_service_iam_member" "nawawan_dev_service_invoker" {
    service = google_cloud_run_v2_service.nawawan_dev_service.name
    location = var.region
    project = var.project
    member = "allUsers"
    role   = "roles/run.invoker"
}