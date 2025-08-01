# API Routes Documentation - SoundWave Backend

Ce document décrit toutes les routes de l'API SoundWave avec leurs middlewares associés.

## 📋 Table des Matières

1. [Authentification](#authentification)
2. [Utilisateurs](#utilisateurs)
3. [Chansons](#chansons)
4. [Playlists](#playlists)
5. [Albums](#albums)
6. [Administration](#administration)
7. [Recherche](#recherche)
8. [Fonctionnalités Sociales](#fonctionnalités-sociales)
9. [Spotify Integration](#spotify-integration)

## 🔐 Authentification

### Base URL: `/api/auth`

| Méthode | Route | Description | Accès | Middlewares |
|---------|-------|-------------|-------|-------------|
| POST | `/register` | Enregistrer un nouvel utilisateur | Public | `registerLimiter`, `validateRegister`, `activityLogger` |
| POST | `/login` | Connecter un utilisateur | Public | `authLimiter`, `validateLogin`, `activityLogger` |

## 👥 Utilisateurs

### Base URL: `/api/users`

| Méthode | Route | Description | Accès | Middlewares |
|---------|-------|-------------|-------|-------------|
| GET | `/` | Obtenir tous les utilisateurs | Public | `searchLimiter`, `validatePagination` |
| GET | `/profile/:username` | Profil public d'un utilisateur | Public | `searchLimiter` |
| PUT | `/profile` | Mettre à jour le profil | Privé | `protect`, `validateUserProfile`, `activityLogger` |
| POST | `/:id/follow` | Suivre/ne plus suivre | Privé | `protect`, `validateObjectId`, `socialActionLimiter`, `activityLogger` |
| GET | `/:id/followers` | Liste des followers | Public | `validateObjectId`, `validatePagination` |
| GET | `/:id/following` | Liste des utilisateurs suivis | Public | `validateObjectId`, `validatePagination` |

## 🎵 Chansons

### Base URL: `/api/songs`

| Méthode | Route | Description | Accès | Middlewares |
|---------|-------|-------------|-------|-------------|
| GET | `/` | Rechercher des chansons | Public | `searchLimiter`, `validateSearch`, `validatePagination` |
| GET | `/:id` | Détails d'une chanson | Public | `validateObjectId` |
| POST | `/` | Uploader une chanson | Privé | `protect`, `uploadLimiter`, `validateSong`, `activityLogger` |
| PUT | `/:id` | Mettre à jour une chanson | Privé | `protect`, `owner`, `validateSong`, `activityLogger` |
| DELETE | `/:id` | Supprimer une chanson | Privé | `protect`, `owner`, `activityLogger` |
| POST | `/:id/like` | Aimer/ne plus aimer | Privé | `protect`, `validateObjectId`, `socialActionLimiter`, `activityLogger` |
| POST | `/:id/comment` | Ajouter un commentaire | Privé | `protect`, `validateObjectId`, `validateComment`, `commentLimiter`, `activityLogger` |

## 📝 Playlists

### Base URL: `/api/playlists`

| Méthode | Route | Description | Accès | Middlewares |
|---------|-------|-------------|-------|-------------|
| GET | `/` | Playlists de l'utilisateur | Privé | `protect`, `validatePagination` |
| GET | `/:id` | Détails d'une playlist | Public/Privé | `validateObjectId` |
| POST | `/` | Créer une playlist | Privé | `protect`, `validatePlaylist`, `activityLogger` |
| PUT | `/:id` | Mettre à jour une playlist | Privé | `protect`, `owner`, `validatePlaylist`, `activityLogger` |
| DELETE | `/:id` | Supprimer une playlist | Privé | `protect`, `owner`, `activityLogger` |
| POST | `/:id/songs` | Ajouter une chanson | Privé | `protect`, `owner`, `validateObjectId`, `activityLogger` |
| DELETE | `/:id/songs/:songId` | Retirer une chanson | Privé | `protect`, `owner`, `validateObjectId`, `activityLogger` |

## 💿 Albums

### Base URL: `/api/albums`

| Méthode | Route | Description | Accès | Middlewares |
|---------|-------|-------------|-------|-------------|
| GET | `/` | Obtenir tous les albums | Public | `searchLimiter`, `validatePagination` |
| GET | `/:id` | Détails d'un album | Public | `validateObjectId` |
| POST | `/` | Créer un album | Privé | `protect`, `uploadLimiter`, `activityLogger` |
| PUT | `/:id` | Mettre à jour un album | Privé | `protect`, `owner`, `activityLogger` |
| DELETE | `/:id` | Supprimer un album | Privé | `protect`, `owner`, `activityLogger` |

## 🔧 Administration

### Base URL: `/api/admin`

| Méthode | Route | Description | Accès | Middlewares |
|---------|-------|-------------|-------|-------------|
| GET | `/dashboard` | Statistiques du tableau de bord | Admin | `protect`, `admin`, `activityLogger` |
| GET | `/users` | Liste de tous les utilisateurs | Admin | `protect`, `admin`, `validatePagination` |
| PUT | `/users/:id` | Mettre à jour un utilisateur | Admin | `protect`, `admin`, `validateObjectId`, `activityLogger` |
| DELETE | `/users/:id` | Supprimer un utilisateur | Admin | `protect`, `admin`, `validateObjectId`, `activityLogger` |
| GET | `/content` | Contenu à modérer | Admin | `protect`, `admin`, `validatePagination` |

## 🔍 Recherche

### Base URL: `/api/search`

| Méthode | Route | Description | Accès | Middlewares |
|---------|-------|-------------|-------|-------------|
| GET | `/` | Recherche globale | Public | `searchLimiter`, `validateSearch`, `validatePagination`, `activityLogger` |
| GET | `/songs` | Rechercher des chansons | Public | `searchLimiter`, `validateSearch`, `validatePagination`, `activityLogger` |
| GET | `/artists` | Rechercher des artistes | Public | `searchLimiter`, `validateSearch`, `validatePagination`, `activityLogger` |
| GET | `/albums` | Rechercher des albums | Public | `searchLimiter`, `validateSearch`, `validatePagination`, `activityLogger` |
| GET | `/playlists` | Rechercher des playlists | Public | `searchLimiter`, `validateSearch`, `validatePagination`, `activityLogger` |
| GET | `/users` | Rechercher des utilisateurs | Public | `searchLimiter`, `validateSearch`, `validatePagination`, `activityLogger` |
| GET | `/trending` | Obtenir les tendances | Public | `searchLimiter`, `validatePagination`, `activityLogger` |
| GET | `/recommendations` | Recommandations personnalisées | Privé | `searchLimiter`, `validatePagination`, `activityLogger` |

## 🌐 Fonctionnalités Sociales

### Base URL: `/api/social`

| Méthode | Route | Description | Accès | Middlewares |
|---------|-------|-------------|-------|-------------|
| POST | `/like/:type/:id` | Aimer un élément | Privé | `protect`, `validateObjectId`, `socialActionLimiter`, `activityLogger` |
| POST | `/comment/:type/:id` | Ajouter un commentaire | Privé | `protect`, `validateObjectId`, `validateComment`, `commentLimiter`, `activityLogger` |
| DELETE | `/comment/:commentId` | Supprimer un commentaire | Privé | `protect`, `validateObjectId`, `activityLogger` |
| GET | `/feed` | Flux d'activité | Privé | `protect`, `validatePagination` |
| GET | `/activity/:userId` | Activité d'un utilisateur | Public | `validateObjectId`, `validatePagination` |
| POST | `/share/:type/:id` | Partager un élément | Privé | `protect`, `validateObjectId`, `socialActionLimiter`, `activityLogger` |
| GET | `/trending` | Éléments tendance | Public | `validatePagination` |
| POST | `/report/:type/:id` | Signaler un élément | Privé | `protect`, `validateObjectId`, `socialActionLimiter`, `activityLogger` |
| GET | `/notifications` | Notifications | Privé | `protect`, `validatePagination` |
| PUT | `/notifications/:id/read` | Marquer comme lue | Privé | `protect`, `validateObjectId` |
| DELETE | `/notifications/:id` | Supprimer notification | Privé | `protect`, `validateObjectId` |

## 🎧 Spotify Integration

### Base URL: `/api/auth/spotify`

| Méthode | Route | Description | Accès | Middlewares |
|---------|-------|-------------|-------|-------------|
| GET | `/login` | Redirection vers Spotify | Public | `corsAuth`, `activityLogger` |
| GET | `/callback` | Callback Spotify | Public | `corsAuth`, `activityLogger` |
| POST | `/refresh` | Rafraîchir le token | Privé | `corsAuth`, `activityLogger` |

## 📊 Codes de Statut HTTP

| Code | Description |
|------|-------------|
| 200 | Succès |
| 201 | Créé avec succès |
| 400 | Requête invalide |
| 401 | Non autorisé |
| 403 | Accès interdit |
| 404 | Ressource non trouvée |
| 429 | Trop de requêtes |
| 500 | Erreur serveur |

## 🔒 Middlewares Utilisés

### Authentification
- `protect` - Vérification du token JWT
- `admin` - Vérification des droits administrateur
- `owner` - Vérification de la propriété

### Validation
- `validateRegister` - Validation de l'enregistrement
- `validateLogin` - Validation de la connexion
- `validateUserProfile` - Validation du profil utilisateur
- `validateSong` - Validation des chansons
- `validatePlaylist` - Validation des playlists
- `validateObjectId` - Validation des IDs MongoDB
- `validatePagination` - Validation de la pagination
- `validateSearch` - Validation de la recherche
- `validateComment` - Validation des commentaires

### Limitation de Taux
- `generalLimiter` - Limitation générale (100 req/15min)
- `authLimiter` - Limitation authentification (5 req/15min)
- `registerLimiter` - Limitation enregistrement (3 req/heure)
- `searchLimiter` - Limitation recherche (30 req/min)
- `uploadLimiter` - Limitation uploads (10 req/heure)
- `commentLimiter` - Limitation commentaires (10 req/5min)
- `socialActionLimiter` - Limitation actions sociales (20 req/min)

### Logging
- `activityLogger` - Log des activités spécifiques

### CORS
- `corsAuth` - CORS pour l'authentification

## 📝 Exemples d'Utilisation

### Authentification
```bash
# Enregistrement
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}

# Connexion
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Recherche
```bash
# Recherche globale
GET /api/search?q=rock&type=song&page=1&limit=10

# Recherche de chansons
GET /api/search/songs?q=artist&page=1&limit=20
```

### Actions Sociales
```bash
# Aimer une chanson
POST /api/social/like/song/507f1f77bcf86cd799439011
Authorization: Bearer <token>

# Ajouter un commentaire
POST /api/social/comment/song/507f1f77bcf86cd799439011
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Super chanson !"
}
```

## 🚀 Démarrage Rapide

1. **Installer les dépendances :**
   ```bash
   npm install
   ```

2. **Configurer les variables d'environnement :**
   ```env
   JWT_SECRET=votre_secret_jwt
   NODE_ENV=development
   ALLOWED_ORIGINS=http://localhost:3000
   ```

3. **Démarrer le serveur :**
   ```bash
   npm run dev
   ```

4. **Tester l'API :**
   ```bash
   curl http://localhost:5000/api/auth/register
   ``` 