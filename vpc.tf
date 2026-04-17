# VPC Application (Web + Backend pour ton Next.js)
resource "google_compute_network" "vpc_app" {
  name                    = "vpc-app"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet_app" {
  name          = "subnet-app"
  network       = google_compute_network.vpc_app.id
  ip_cidr_range = "10.0.1.0/24"
  region        = "europe-west1"
}

# VPC Data (Base de données)
resource "google_compute_network" "vpc_data" {
  name                    = "vpc-data"
  auto_create_subnetworks = false
}

resource "google_compute_subnetwork" "subnet_data" {
  name          = "subnet-data"
  network       = google_compute_network.vpc_data.id
  ip_cidr_range = "10.0.2.0/24"
  region        = "europe-west1"
}

# Peering entre App et Data
resource "google_compute_network_peering" "app_to_data" {
  name         = "app-to-data"
  network      = google_compute_network.vpc_app.id
  peer_network = google_compute_network.vpc_data.id
}

resource "google_compute_network_peering" "data_to_app" {
  name         = "data-to-app"
  network      = google_compute_network.vpc_data.id
  peer_network = google_compute_network.vpc_app.id
}

# 1. Réserver une plage d'adresses IP privées pour les services Google
resource "google_compute_global_address" "private_ip_address" {
  name          = "google-managed-services-range"
  purpose       = "VPC_PEERING"
  address_type  = "INTERNAL"
  prefix_length = 16
  network       = google_compute_network.vpc_data.id # On le lie au VPC Data
}

# 2. Créer la connexion privée (le tunnel entre ton VPC et les services Google)
resource "google_service_networking_connection" "private_vpc_connection" {
  network                 = google_compute_network.vpc_data.id
  service                 = "servicenetworking.googleapis.com"
  reserved_peering_ranges = [google_compute_global_address.private_ip_address.name]
}

