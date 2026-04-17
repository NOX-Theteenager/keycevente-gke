# Configuration du fournisseur Google Cloud
provider "google" {
  project = "keycevente-gke"
  region  = "europe-west1"
}

# Configuration du Backend pour stocker le State sur le Cloud
terraform {
  backend "gcs" {
    bucket = "keycevente-terraform-state"
    prefix = "terraform/state"
  }

  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}
