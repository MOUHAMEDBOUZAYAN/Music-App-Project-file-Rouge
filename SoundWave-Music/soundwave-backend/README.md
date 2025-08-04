# 🎵 SoundWave Backend API

Backend complet pour l'application SoundWave - Une plateforme de streaming musical moderne.

## 🚀 Fonctionnalités

### 🔐 Authentification & Autorisation
- **JWT Authentication** avec refresh tokens
- **Rôles utilisateurs** : Listener, Artist, Admin
- **OAuth Spotify** intégration
- **Validation** complète des données

### 🎵 Gestion Musicale
- **Upload de chansons** avec support multi-formats
- **Gestion d'albums** et playlists
- **Métadonnées** automatiques extraction
- **Streaming** optimisé

### 👥 Fonctionnalités Sociales
- **Système de suivi** (follow/unfollow)
- **Likes et commentaires** sur tous les contenus
- **Partage** de contenu
- **Notifications** en temps réel

### 🔍 Recherche & Découverte
- **Recherche globale** multi-critères
- **Recommandations** personnalisées
- **Tendances** et classements
- **Filtres avancés**

### 🛡️ Sécurité & Performance
- **Rate limiting** intelligent
- **Validation** des entrées
- **Logging** complet
- **Cache** Redis (optionnel)

## 📁 Structure du Projet

```
src/
├── config/          # Configuration (DB, JWT, etc.)
├── controllers/     # Contrôleurs de l'API
├── middleware/      # Middlewares personnalisés
├── models/          # Modèles Mongoose
├── routes/          # Routes de l'API
├── services/        # Services métier
├── utils/           # Utilitaires
└── app.js          # Point d'entrée
```

## 🛠️ Installation

### Prérequis
- Node.js (v16+)
- MongoDB
- Redis (optionnel)
- Compte Cloudinary
- Compte Spotify Developer

### 1. Cloner le projet
```bash
git clone <repository-url>
cd SoundWave-Music/soundwave-backend
```

### 2. Installer les dépendances
```bash
npm install
```

### 3. Configuration
Créer un fichier `.env` basé sur `.env.example` :

```env
# Configuration du serveur
NODE_ENV=development
PORT=5000

# Base de données MongoDB
MONGODB_URI=mongodb://localhost:27017/soundwave

# JWT
JWT_SECRET=votre_secret_jwt_tres_securise_et_long
JWT_EXPIRES_IN=7d

# CORS
ALLOWED_ORIGINS=http://localhost:3000

# Cloudinary
CLOUDINARY_CLOUD_NAME=votre_cloud_name
CLOUDINARY_API_KEY=votre_api_key
CLOUDINARY_API_SECRET=votre_api_secret

# Spotify API
SPOTIFY_CLIENT_ID=votre_spotify_client_id
SPOTIFY_CLIENT_SECRET=votre_spotify_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback
```

### 4. Démarrer le serveur
```bash
# Développement
npm run dev

# Production
npm start
```

## 📚 API Documentation

### 🔐 Authentification

#### Enregistrement
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "listener"
}
```

#### Connexion
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### 👥 Utilisateurs

#### Obtenir le profil
```http
GET /api/users/profile/:username
Authorization: Bearer <token>
```

#### Mettre à jour le profil
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "username": "new_username",
  "bio": "Ma bio",
  "avatar": "https://example.com/avatar.jpg"
}
```

### 🎵 Chansons

#### Uploader une chanson
```http
POST /api/songs
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Ma chanson",
  "artist": "Mon artiste",
  "album": "Mon album",
  "genre": "Rock",
  "audio": <fichier_audio>
}
```

#### Rechercher des chansons
```http
GET /api/search/songs?q=rock&genre=rock&page=1&limit=10
```

### 📝 Playlists

#### Créer une playlist
```http
POST /api/playlists
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Ma playlist",
  "description": "Description de ma playlist",
  "isPublic": true,
  "songs": ["song_id_1", "song_id_2"]
}
```

### 🔍 Recherche

#### Recherche globale
```http
GET /api/search?q=rock&type=song&page=1&limit=10
```

#### Tendances
```http
GET /api/search/trending
```

## 🛡️ Middlewares

### Authentification
- `protect` - Vérification JWT
- `admin` - Vérification admin
- `owner` - Vérification propriétaire

### Validation
- `validateRegister` - Validation enregistrement
- `validateSong` - Validation chansons
- `validatePlaylist` - Validation playlists

### Sécurité
- `rateLimit` - Limitation de taux
- `cors` - Configuration CORS
- `helmet` - Headers de sécurité

## 🗄️ Modèles de Données

### User
```javascript
{
  username: String,
  email: String,
  password: String,
  role: String, // 'listener', 'artist', 'admin'
  avatar: String,
  bio: String,
  followersCount: Number,
  followingCount: Number
}
```

### Song
```javascript
{
  title: String,
  artist: String,
  album: String,
  genre: String,
  duration: Number,
  audioUrl: String,
  uploader: ObjectId,
  views: Number,
  likes: [ObjectId],
  comments: [ObjectId]
}
```

### Playlist
```javascript
{
  name: String,
  description: String,
  owner: ObjectId,
  songs: [ObjectId],
  isPublic: Boolean,
  views: Number,
  likes: [ObjectId]
}
```

## 🚀 Scripts Disponibles

```bash
# Développement
npm run dev          # Démarrer avec nodemon
npm run start        # Démarrer en production

# Tests
npm run test         # Lancer les tests
npm run test:watch   # Tests en mode watch

# Linting
npm run lint         # Vérifier le code
npm run lint:fix     # Corriger automatiquement

# Base de données
npm run db:seed      # Peupler la DB
npm run db:reset     # Réinitialiser la DB
```

## 🔧 Configuration Avancée

### Variables d'Environnement

| Variable | Description | Défaut |
|----------|-------------|--------|
| `NODE_ENV` | Environnement | `development` |
| `PORT` | Port du serveur | `5000` |
| `MONGODB_URI` | URI MongoDB | `mongodb://localhost:27017/soundwave` |
| `JWT_SECRET` | Secret JWT | Requis |
| `CLOUDINARY_*` | Config Cloudinary | Requis |
| `SPOTIFY_*` | Config Spotify | Optionnel |

### Base de Données

#### Index recommandés
```javascript
// Users
db.users.createIndex({ "email": 1 }, { unique: true })
db.users.createIndex({ "username": 1 }, { unique: true })

// Songs
db.songs.createIndex({ "title": "text", "artist": "text", "album": "text" })
db.songs.createIndex({ "uploader": 1 })
db.songs.createIndex({ "genre": 1 })

// Playlists
db.playlists.createIndex({ "owner": 1 })
db.playlists.createIndex({ "isPublic": 1 })
```

## 🧪 Tests

```bash
# Tests unitaires
npm run test

# Tests d'intégration
npm run test:integration

# Couverture de code
npm run test:coverage
```

## 📊 Monitoring

### Logs
Les logs sont sauvegardés dans `logs/` :
- `requests.log` - Toutes les requêtes
- `errors.log` - Erreurs
- `slow-requests.log` - Requêtes lentes
- `activities.log` - Activités utilisateurs

### Métriques
- Temps de réponse moyen
- Taux d'erreur
- Utilisation mémoire/CPU
- Requêtes par minute

## 🔒 Sécurité

### Bonnes Pratiques Implémentées
- ✅ Validation des entrées
- ✅ Rate limiting
- ✅ CORS configuré
- ✅ Headers de sécurité
- ✅ JWT sécurisé
- ✅ Hachage des mots de passe
- ✅ Logging des activités

### Recommandations
- Utiliser HTTPS en production
- Configurer un firewall
- Surveiller les logs
- Mettre à jour régulièrement les dépendances

## 🚀 Déploiement

### Heroku
```bash
# Configurer les variables d'environnement
heroku config:set NODE_ENV=production
heroku config:set MONGODB_URI=your_mongodb_uri
heroku config:set JWT_SECRET=your_jwt_secret

# Déployer
git push heroku main
```

### Docker
```bash
# Construire l'image
docker build -t soundwave-backend .

# Lancer le conteneur
docker run -p 5000:5000 soundwave-backend
```

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la documentation
- Contacter l'équipe de développement

---

**SoundWave Backend** - Propulsé par Node.js, Express et MongoDB 🎵 