# Réservation d'une adresse IP publique globale (Anycast) pour le Load Balancer
resource "google_compute_global_address" "keycevente_public_ip" {
  name         = "keycevente-public-ip"
  address_type = "EXTERNAL"
  description  = "IP statique publique pour le Load Balancer Ingress de Keycevente"
}

# Output pour afficher l'IP dans le terminal à la fin du déploiement
output "public_ip_address" {
  value       = google_compute_global_address.keycevente_public_ip.address
  description = "L'adresse IP à configurer dans ta zone DNS (enregistrement A)"
}
