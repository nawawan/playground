variable "project" {
  default = "nawawan"
}

variable "region" {
  default = "asia-northeast1"
}

variable "zone" {
  default = "asia-northeast1-a"
}

variable "github_token" {
  type      = string
  sensitive = true
}

variable "github_repository_uri" {
  default = "https://github.com/nawawan/playground.git"
}