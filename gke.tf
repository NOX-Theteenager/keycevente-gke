resource "google_container_cluster" "primary" {
  name     = "keycevente-cluster"
  location = "europe-west1"

  # On active le mode Autopilot pour l'optimisation des coûts et la simplicité
  enable_autopilot = true

  network    = google_compute_network.vpc_app.id
  subnetwork = google_compute_subnetwork.subnet_app.id

  # Sécurité : Restreindre l'accès au plan de contrôle K8s
  master_authorized_networks_config {
    cidr_blocks {
      cidr_block   = "0.0.0.0/0" # À restreindre à ton IP fixe si possible
      display_name = "External Access"
    }
  }
}
