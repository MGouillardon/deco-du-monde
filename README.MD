# Deco Du Monde - Gestion de Studio Photo

Application de gestion pour studio photo développée avec AdonisJS 6, Vue3 et Inertia.

## Fonctionnalités principales
- Gestion des événements photo
- Gestion des articles
- Gestion des décors
- Gestion des utilisateurs et des rôles
- Planning intéractif des événements
- Dashboard avec widgets

## Technologies

- Backend: AdonisJS 6
- Frontend: Vue3
- ORM: Lucid
- Base de données: MySQL
- Tests: Japa
- CI: GitHub Actions

## Installation

1. Cloner le repository
```bash
git clone [url-du-repo]
cd deco-du-monde
```

2. Installer les dépendances
```bash
npm install
```

3. Configuration
```bash
cp .env.example .env
node ace generate:key
```

4. Base de données
```bash
# Configurer les variables DB_* dans .env
node ace migration:run
node ace db:seed
```

5. Lancer l'application
```bash
npm run dev
```

L'application sera disponible sur `http://localhost:3333`

## Tests

L'application utilise Japa pour les tests. Trois types de tests sont disponibles :

```bash
# Tests unitaires
node ace test unit

# Tests fonctionnels
node ace test functional

# Tests E2E
node ace test browser
```

## Structure du projet

### Backend (AdonisJS)
```
.
app/
├── abilities/           # Gestion des autorisations
│   └── main.ts
├── controllers/        # Contrôleurs de l'application
│   ├── admin/          # Administration
│   │   └── dashboard/  # Gestion du tableau de bord
│   └── auth/           # Authentification
├── enums/              # Énumérations TypeScript
├── middleware/         # Middleware de l'application
├── models/             # Modèles Lucid ORM
│   ├── event.ts
│   ├── item.ts
│   ├── user.ts
│   └── ...
├── policies/          # Politiques d'autorisation
│   ├── dashboard_policy.ts
│   ├── event_policy.ts
│   └── ...
└── validators/        # Validation des données
    ├── auth/
    └── dashboard/```
```

### Frontend (Inertia/Vue.js)
```
inertia/
├── components/         # Composants réutilisables
│   ├── UI/             # Composants d'interface utilisateur
│   ├── Widgets/        # Widgets du dashboard
│   ├── Messages/       # Composants de messages
│   └── icons/          # Composants d'icônes
├── composables/        # Composables Vue.js
├── layouts/            # Layouts de l'application
├── pages/              # Pages de l'application
│   ├── Admin/          # Interface d'administration
│   │   ├── Auth/       # Pages d'authentification
│   │   └── Dashboard/  # Pages du tableau de bord
│   └── errors/         # Pages d'erreur
└── utils/              # Utilitaires JavaScript
```

## Documentation détaillée

### Guide des Tests

#### Configuration de l'environnement de test

1. Créer le fichier `.env.test`
```env
DB_CONNECTION=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_DATABASE=decodumonde_test
```

2. Préparation de la base de test
```bash
node ace migration:run --force
```

#### Structure des tests

- `tests/functional/`: Tests d'API et d'intégration
  - `events/`: Tests liés aux événements
  - `items/`: Tests liés aux articles
  - `sets/`: Tests liés aux décors
  - `users/`: Tests liés aux utilisateurs

- `tests/unit/`: Tests unitaires des services
  - `services/`: Tests des services métier

- `tests/browser/`: Tests E2E
  - `event/`: Tests des interactions utilisateur

### Intégration Continue

Le projet utilise GitHub Actions pour l'intégration continue. Configuration dans `.github/workflows/ci.yml`.

#### Pipeline CI

Le pipeline s'exécute automatiquement sur :
- Push sur la branche principale
- Pull Requests

Étapes :
1. Installation de Node.js et des dépendances
2. Configuration de MySQL
3. Préparation de l'environnement de test
4. Exécution des migrations
5. Lancement des tests
6. Vérification du code style

Pour plus de détails, consulter le fichier CI dans le repository.