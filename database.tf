resource "google_sql_database_instance" "postgres" {
  name             = "keycevente-db-instance"
  database_version = "POSTGRES_15"
  region           = "europe-west1"

  # Très important : attendre que la connexion privée du VPC soit prête
  depends_on = [google_service_networking_connection.private_vpc_connection]

  settings {
    tier = "db-f1-micro"
    ip_configuration {
      ipv4_enabled    = false
      private_network = google_compute_network.vpc_data.id
    }
  }
}
