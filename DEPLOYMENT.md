# Guide de Déploiement keycevente

Ce guide vous explique comment déployer keycevente en production.

## 1. Déploiement avec Docker Compose (VPS/Server)

### Prérequis
- VPS Linux (Ubuntu 20.04+, Debian, CentOS)
- Docker & Docker Compose installés
- Domain name (optionnel)
- SSL certificate (optionnel)

### Étapes

#### 1.1 Préparer le serveur
```bash
# SSH dans votre serveur
ssh user@your-server-ip

# Mettre à jour
sudo apt update && sudo apt upgrade -y

# Installer Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Installer Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Vérifier
docker --version
docker-compose --version
```

#### 1.2 Cloner et configurer
```bash
# Cloner le repo
git clone <repository> keycevente
cd keycevente

# Créer le fichier d'environnement
cp .env.example .env.local

# Éditer les variables
nano .env.local
```

Variables importantes à modifier :
```env
# Utiliser des mots de passe forts en production
DB_PASSWORD=your-strong-random-password
DB_USER=postgres
DB_NAME=keycevente

# Ports (peut être derrière un reverse proxy)
APP_PORT=3000

# URLs
NEXT_PUBLIC_API_URL=https://your-domain.com
```

#### 1.3 Démarrer les services
```bash
# Démarrer en background
docker-compose up -d

# Vérifier le statut
docker-compose ps

# Voir les logs
docker-compose logs -f
```

#### 1.4 Configurer Nginx (optionnel reverse proxy)
```bash
# Installer Nginx
sudo apt install nginx -y

# Créer la config
sudo nano /etc/nginx/sites-available/keycevente
```

Config exemple :
```nginx
upstream keycevente {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com;
    client_max_body_size 10M;

    location / {
        proxy_pass http://keycevente;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

```bash
# Activer la config
sudo ln -s /etc/nginx/sites-available/keycevente /etc/nginx/sites-enabled/

# Tester
sudo nginx -t

# Redémarrer Nginx
sudo systemctl restart nginx
```

#### 1.5 Configurer SSL avec Let's Encrypt
```bash
# Installer Certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtenir le certificat
sudo certbot --nginx -d your-domain.com

# Auto-renew
sudo systemctl enable certbot.timer
```

## 2. Déploiement avec Docker Hub

### Pusher l'image
```bash
# Login
docker login

# Build et tag
docker build -t your-username/keycevente:latest .

# Push
docker push your-username/keycevente:latest

# Sur le serveur, puller et démarrer
docker pull your-username/keycevente:latest
docker run -d \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://... \
  your-username/keycevente:latest
```

## 3. Déploiement sur Vercel (Frontend uniquement)

Vercel ne supporte pas PostgreSQL natif. Options :

### Option A: Backend externe + Frontend Vercel

1. **Déployer le backend ailleurs** (VPS avec Docker)
2. **Configurer les variables Vercel** :
```
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
DATABASE_URL=postgresql://your-external-db
```

3. **Déployer sur Vercel** :
```bash
# Connecter le repo
vercel link

# Configurer les env vars dans le dashboard Vercel
# Settings > Environment Variables

# Déployer
vercel deploy --prod
```

### Option B: Backend intégré sur Vercel

Vercel supporte les API routes mais pas les databases persistantes. 
Utiliser Vercel Postgres :

```bash
# Ajouter Vercel Postgres
vercel env add DATABASE_URL

# Déployer
vercel deploy --prod
```

Puis migrer le schéma et les données à Vercel Postgres.

## 4. Déploiement sur Railway

Railway supporte Docker et PostgreSQL :

```bash
# Installer Railway CLI
npm i -g @railway/cli

# Login
railway login

# Initier le projet
railway init

# Configurer les services
# (Docker + PostgreSQL depuis le dashboard)

# Déployer
railway up
```

## 5. Déploiement sur Render

Render supporte également Docker :

1. Créer un compte Render
2. Créer un nouveau Web Service
3. Connecter le repo GitHub
4. Configurer :
   - Build command: `docker build`
   - Start command: `docker run`
5. Ajouter une base de données PostgreSQL
6. Déployer

## 6. Déploiement sur AWS

### Avec ECS (Elastic Container Service)

```bash
# Créer ECR repository
aws ecr create-repository --repository-name keycevente

# Build et push
docker build -t keycevente:latest .
docker tag keycevente:latest <account-id>.dkr.ecr.<region>.amazonaws.com/keycevente:latest
docker push <account-id>.dkr.ecr.<region>.amazonaws.com/keycevente:latest

# Créer RDS PostgreSQL instance
# (dans console AWS)

# Configurer ECS task definition avec l'image ECR
# Configurer ALB pour routing

# Déployer le service ECS
```

## 7. Maintenance et Monitoring

### Backups PostgreSQL

```bash
# Backup manuel
docker-compose exec postgres pg_dump -U postgres keycevente > backup.sql

# Restaurer
docker-compose exec postgres psql -U postgres keycevente < backup.sql

# Backup automatique (cron job)
0 2 * * * docker-compose -f /path/to/docker-compose.yml exec -T postgres pg_dump -U postgres keycevente > /backups/keycevente-$(date +\%Y\%m\%d).sql
```

### Logs et Monitoring

```bash
# Logs en continu
docker-compose logs -f

# Logs spécifique
docker-compose logs -f app
docker-compose logs -f postgres

# Monitoring avec Portainer (optionnel)
docker run -d \
  -p 8000:8000 \
  -p 9000:9000 \
  -v /var/run/docker.sock:/var/run/docker.sock \
  portainer/portainer-ce
```

### Health Checks

```bash
# Vérifier la santé
docker-compose ps

# Manuellement
curl http://localhost:3000/api/categories
```

### Updates

```bash
# Tirer les changements
git pull

# Rebuild et restart
docker-compose up -d --build
```

## 8. Configuration de Production

### Variables d'environnement sécurisées
```bash
# Ne JAMAIS commiter .env.local
# Stocker dans des secret managers :
# - AWS Secrets Manager
# - HashiCorp Vault
# - GitHub Secrets (CI/CD)
# - Vercel Environment Variables
```

### Optimisations
```bash
# Réduire la taille des logs
# Configurer les limites de ressources dans docker-compose
# Mettre en place les caches

# Dans docker-compose.yml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M
        reservations:
          cpus: '0.5'
          memory: 256M
```

### Monitoring des ressources
```bash
# Utiliser DataDog, New Relic, ou Prometheus
# Configurer des alerts

# Exemple simple : watch
watch docker stats
```

## 9. Troubleshooting

### Application ne démarre pas
```bash
# Vérifier les logs
docker-compose logs app

# Redémarrer
docker-compose restart
```

### Base de données non accessible
```bash
# Vérifier le container postgres
docker-compose logs postgres

# Vérifier la connexion
docker-compose exec postgres pg_isready

# Recréer le container
docker-compose down
docker-compose up -d
```

### Port déjà en utilisation
```bash
# Changer le port dans .env.local
APP_PORT=3001

# Ou tuer le processus
sudo lsof -i :3000
sudo kill -9 <PID>
```

## 10. Rollback et Disaster Recovery

```bash
# Sauvegarder la config
cp docker-compose.yml docker-compose.yml.backup

# En cas de problème
docker-compose down
git checkout <previous-commit>
docker-compose up -d

# Restaurer la base de données
docker-compose exec postgres psql -U postgres keycevente < backup.sql
```

## Checkliste de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Mot de passe DB changé
- [ ] Certificat SSL installé
- [ ] Firewall configuré
- [ ] Backups planifiés
- [ ] Monitoring activé
- [ ] Health checks testés
- [ ] Reverse proxy configuré (optionnel)
- [ ] DNS pointant correctement
- [ ] Test de charge effectué

## Support

Pour plus d'aide, consultez :
- Docker Documentation: https://docs.docker.com
- Docker Compose: https://docs.docker.com/compose
- Next.js Deployment: https://nextjs.org/docs/deployment
- PostgreSQL: https://www.postgresql.org/docs

---

**keycevente est prêt pour la production!**
