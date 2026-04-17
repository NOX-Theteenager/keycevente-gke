# keycevente - E-commerce MVP

Une plateforme e-commerce complète et moderne spécialisée dans les claviers mécaniques, keycaps et accessoires.

## Technologies

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Database**: PostgreSQL 16
- **Containerization**: Docker & Docker Compose
- **Icons**: Lucide React
- **State Management**: React Hooks

## Architecture

```
keycevente/
├── app/
│   ├── api/                    # API Routes
│   │   ├── categories/         # GET categories
│   │   ├── products/           # GET products (with search & filter)
│   │   ├── products/[id]/      # GET product details
│   │   ├── cart/              # GET/DELETE cart
│   │   ├── cart/items/        # POST/PATCH/DELETE cart items
│   │   ├── orders/            # POST create order
│   │   └── orders/[number]/   # GET order details
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page
│   ├── catalog/               # Products catalog
│   ├── product/[id]/          # Product detail
│   ├── cart/                  # Shopping cart
│   ├── checkout/              # Checkout form
│   ├── order-confirmation/    # Order confirmation
│   └── globals.css            # Global styles
├── components/
│   ├── header.tsx             # Navigation header
│   ├── footer.tsx             # Footer
│   ├── product-card.tsx       # Product card component
│   ├── cart-item.tsx          # Cart item component
│   └── category-filter.tsx    # Category sidebar
├── lib/
│   ├── db.ts                  # Database connection pool
│   ├── db-helpers.ts          # Database query helpers
│   └── types.ts               # TypeScript types
├── scripts/
│   ├── init-db.sql            # Database schema & seed data
│   └── seed-db.js             # Node.js seed script
├── Dockerfile                 # Multi-stage production build
├── docker-compose.yml         # Orchestration config
└── .env.local                 # Environment variables
```

## Démarrage Rapide

### Prérequis
- Docker & Docker Compose installés
- Node.js 20+ (pour développement local)
- PostgreSQL 16+ (pour développement local)

### Avec Docker (Recommandé)

1. **Cloner le projet**
```bash
git clone <repository>
cd keycevente
```

2. **Créer le fichier .env**
```bash
cp .env.example .env.local
```

3. **Démarrer tous les services**
```bash
docker-compose up -d
```

4. **Vérifier que la base de données est initialisée**
```bash
docker-compose exec postgres psql -U postgres -d keycevente -c "SELECT COUNT(*) FROM products;"
```

5. **Accéder à l'application**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api/*

6. **Arrêter les services**
```bash
docker-compose down
```

### Développement Local (sans Docker)

1. **Installer les dépendances**
```bash
pnpm install
# ou npm install
```

2. **Configurer la base de données PostgreSQL**
```bash
# Créer la base de données
createdb keycevente

# Initialiser le schéma et les données
psql keycevente < scripts/init-db.sql

# Ou avec Node.js
node scripts/seed-db.js
```

3. **Configurer les variables d'environnement**
```bash
# Créer .env.local
cp .env.example .env.local

# Modifier les valeurs si nécessaire
DB_HOST=localhost  # pas "postgres" en développement local
```

4. **Démarrer le serveur de développement**
```bash
pnpm dev
# ou npm run dev
```

5. **Accéder à l'application**
- Frontend: http://localhost:3000
- API: http://localhost:3000/api/*

## Fonctionnalités

### Utilisateur
- **Accueil**: Présentation et produits en vedette
- **Catalogue**: Filtrage par catégories et recherche par texte
- **Détails Produit**: Description complète, images, stock disponible
- **Panier**: Gestion des quantités, mise à jour en temps réel
- **Paiement**: Formulaire de commande avec validation
- **Confirmation**: Détails de la commande avec numéro de suivi

### Catégories
- Claviers Mécaniques
- Keycaps
- Switches
- Accessoires

### Base de Données
- **15+ produits** avec images et descriptions
- **Gestion du stock** avec vérification de disponibilité
- **Panier persistant** par session
- **Commandes** avec détails complets

## API Endpoints

### Catégories
```
GET /api/categories
```

### Produits
```
GET /api/products                 # Tous les produits
GET /api/products?categoryId=1    # Par catégorie
GET /api/products?search=clavier  # Recherche
GET /api/products/[id]            # Détails
```

### Panier
```
GET /api/cart                     # Récupérer le panier
POST /api/cart/items              # Ajouter un article
PATCH /api/cart/items             # Mettre à jour la quantité
DELETE /api/cart/items            # Supprimer un article
DELETE /api/cart                  # Vider le panier
```

### Commandes
```
POST /api/orders                  # Créer une commande
GET /api/orders/[orderNumber]     # Détails de la commande
```

## Build et Déploiement

### Build Docker
```bash
docker build -t keycevente:latest .
```

### Exécuter le conteneur
```bash
docker run -p 3000:3000 \
  -e DB_HOST=postgres \
  -e DB_USER=postgres \
  -e DB_PASSWORD=postgres \
  -e DB_NAME=keycevente \
  keycevente:latest
```

### Build de production
```bash
pnpm build
pnpm start
```

## Configuration Docker Compose

Variables disponibles dans `.env.local`:
- `DB_USER`: Utilisateur PostgreSQL (défaut: postgres)
- `DB_PASSWORD`: Mot de passe PostgreSQL (défaut: postgres)
- `DB_NAME`: Nom de la base de données (défaut: keycevente)
- `DB_PORT`: Port PostgreSQL (défaut: 5432)
- `APP_PORT`: Port de l'application (défaut: 3000)

## Debugging

### Voir les logs du conteneur
```bash
docker-compose logs -f app
docker-compose logs -f postgres
```

### Accéder à PostgreSQL
```bash
docker-compose exec postgres psql -U postgres -d keycevente
```

### Redémarrer les services
```bash
docker-compose restart
```

### Nettoyer complètement
```bash
docker-compose down -v  # Supprime aussi les volumes de données
```

## Structure des Données

### Catégories
```sql
- Claviers Mécaniques
- Keycaps
- Switches
- Accessoires
```

### Produits (15 articles)
Chaque produit contient:
- Nom et description
- Prix en euros
- Quantité en stock
- Catégorie
- URL d'image

### Commandes
- Numéro unique (ORD-timestamp)
- Informations client
- Articles commandés avec prix unitaire
- Montant total
- Statut (pending, confirmed, shipped, delivered)

## Performance

- **Multi-stage Docker build** pour images optimisées
- **Base de données indexée** pour recherche rapide
- **Images optimisées avec Next.js Image** composant
- **API Routes serverless** optimisées

## Sécurité

- **Parameterized queries** pour prévenir les injections SQL
- **CORS configuration** dans les API routes
- **Variables d'environnement** pour les secrets
- **Session ID** pour le panier (cookies sécurisés)

## Développement

### Ajouter une nouvelle page
```bash
# Pages dans app/ avec routing automatique
mkdir app/nouvelle-page
echo "'use client';\n..." > app/nouvelle-page/page.tsx
```

### Ajouter un nouvel endpoint API
```bash
# API Routes dans app/api/
mkdir app/api/endpoint
echo "export async function GET() { ... }" > app/api/endpoint/route.ts
```

### Ajouter un nouveau produit
```bash
# Ajouter directement dans init-db.sql ou via INSERT SQL
INSERT INTO products (name, description, price, stock_quantity, category_id, image_url)
VALUES ('Nouveau Produit', 'Description', 99.99, 10, 1, 'image-url');
```

## Support et Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Docker Documentation](https://docs.docker.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)

## License

Propriétaire - keycevente MVP
