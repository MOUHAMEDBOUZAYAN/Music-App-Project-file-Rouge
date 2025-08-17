# 🎵 SoundWave Music - Application de Musique avec Intégration Spotify

SoundWave Music est une application web moderne de streaming musical qui intègre l'API Spotify pour offrir une expérience musicale complète et immersive.

## ✨ Fonctionnalités

### 🎵 Intégration Spotify Complète
- **Authentification Spotify** : Connexion sécurisée avec compte Spotify
- **Recherche avancée** : Recherche en temps réel de morceaux, artistes, albums et playlists
- **Bibliothèque personnelle** : Accès aux playlists, morceaux aimés et artistes suivis
- **Découverte musicale** : Nouvelles sorties, playlists en vedette et recommandations
- **Lecteur audio** : Contrôles de lecture complets avec gestion de la queue

### 🎨 Interface Moderne
- **Design responsive** : Optimisé pour tous les appareils
- **Thème sombre** : Interface élégante inspirée de Spotify
- **Animations fluides** : Transitions et interactions utilisateur
- **Navigation intuitive** : Structure claire et facile à utiliser

### 🔧 Architecture Technique
- **Backend Node.js** : API REST avec Express et MongoDB
- **Frontend React** : Interface utilisateur moderne avec hooks et context
- **Gestion d'état** : Context API pour la gestion globale de l'état
- **API sécurisée** : JWT, CORS et validation des données

## 🚀 Démarrage Rapide

### Option 1 : Installation Automatique (Recommandée)
1. **Double-cliquez** sur `install-spotify.bat` (Windows)
2. Suivez les instructions à l'écran
3. Configurez vos identifiants Spotify
4. Lancez l'application avec `start-app.bat`

### Option 2 : Installation Manuelle

#### Prérequis
- [Node.js](https://nodejs.org/) (v16 ou supérieur)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- [MongoDB](https://mongodb.com/) (optionnel pour le développement)

#### Configuration Spotify
1. Créez une application sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Notez votre `Client ID` et `Client Secret`
3. Ajoutez l'URL de redirection : `http://localhost:5000/api/auth/spotify/callback`

#### Installation Backend
```bash
cd soundwave-backend
npm install
# Créez un fichier .env avec vos variables d'environnement
npm run dev
```

#### Installation Frontend
```bash
cd soundwave-frontend
npm install
# Créez un fichier .env avec vos variables d'environnement
npm run dev
```

## 📁 Structure du Projet

```
SoundWave-Music/
├── 📚 Documentation
│   ├── SPOTIFY_INTEGRATION.md     # Guide complet Spotify
│   └── README.md                  # Ce fichier
├── 🔧 Scripts d'installation
│   ├── install-spotify.bat        # Installation Windows
│   ├── install-spotify.sh         # Installation Linux/Mac
│   └── start-app.bat              # Démarrage rapide
├── ⚙️ Backend (Node.js + Express)
│   ├── src/
│   │   ├── routes/                # Routes API
│   │   ├── controllers/           # Contrôleurs
│   │   ├── middleware/            # Middlewares
│   │   ├── models/                # Modèles MongoDB
│   │   └── config/                # Configuration
│   └── package.json
└── 🎨 Frontend (React + Vite)
    ├── src/
    │   ├── components/            # Composants React
    │   ├── pages/                 # Pages de l'application
    │   ├── store/                 # Gestion d'état
    │   ├── services/              # Services API
    │   └── config/                # Configuration
    └── package.json
```

## 🎯 Fonctionnalités Principales

### 🔐 Authentification
- Connexion sécurisée avec Spotify OAuth 2.0
- Gestion automatique des tokens d'accès
- Sessions utilisateur persistantes

### 🔍 Recherche Musicale
- Recherche en temps réel avec debouncing
- Filtres par type de contenu (morceaux, artistes, albums, playlists)
- Résultats organisés et paginés
- Interface de recherche intuitive

### 📚 Bibliothèque Personnelle
- Accès aux playlists personnelles
- Morceaux aimés et favoris
- Artistes suivis
- Historique d'écoute

### 🎵 Lecteur Audio
- Contrôles de lecture complets
- Gestion de la queue de lecture
- Contrôles de volume et modes de lecture
- Interface moderne et responsive

### 🌟 Découverte
- Nouvelles sorties musicales
- Playlists en vedette
- Catégories de musique
- Recommandations personnalisées

## 🛠️ Technologies Utilisées

### Backend
- **Node.js** : Runtime JavaScript
- **Express** : Framework web
- **MongoDB** : Base de données
- **Mongoose** : ODM MongoDB
- **JWT** : Authentification
- **Spotify Web API Node** : Intégration Spotify

### Frontend
- **React 18** : Bibliothèque UI
- **Vite** : Build tool
- **Tailwind CSS** : Framework CSS
- **React Router** : Navigation
- **Context API** : Gestion d'état
- **Axios** : Client HTTP

## 🔧 Configuration

### Variables d'Environnement Backend
```bash
# Spotify
SPOTIFY_CLIENT_ID=votre_client_id
SPOTIFY_CLIENT_SECRET=votre_client_secret
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback

# Base de données
MONGODB_URI=mongodb://localhost:27017/soundwave

# Sécurité
JWT_SECRET=votre_jwt_secret

# Serveur
PORT=5000
NODE_ENV=development
```

### Variables d'Environnement Frontend
```bash
REACT_APP_API_URL=http://localhost:5000
REACT_APP_SPOTIFY_CLIENT_ID=votre_client_id
```

## 📱 Utilisation

### Connexion Spotify
1. Cliquez sur "Se connecter avec Spotify"
2. Autorisez l'application à accéder à votre compte
3. Vous êtes redirigé vers l'application

### Recherche de Musique
1. Utilisez la barre de recherche en haut
2. Filtrez par type de contenu si nécessaire
3. Cliquez sur un résultat pour plus de détails

### Lecture de Musique
1. Cliquez sur le bouton play d'un morceau
2. Utilisez les contrôles du lecteur en bas
3. Gérez votre queue de lecture

## 🐛 Dépannage

### Erreurs Courantes
- **"Invalid redirect URI"** : Vérifiez l'URL dans le Dashboard Spotify
- **"Network error"** : Vérifiez que le backend est démarré
- **"Token expired"** : Reconnectez-vous à Spotify

### Logs de Débogage
- Vérifiez la console du navigateur
- Consultez les logs du serveur backend
- Activez le mode debug dans la configuration

## 📚 Documentation

- **[SPOTIFY_INTEGRATION.md](SPOTIFY_INTEGRATION.md)** : Guide complet de l'intégration Spotify
- **[API Spotify](https://developer.spotify.com/documentation/web-api/)** : Documentation officielle
- **[React Docs](https://reactjs.org/docs/)** : Documentation React

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 🙏 Remerciements

- [Spotify](https://spotify.com/) pour l'API musicale
- [React](https://reactjs.org/) pour le framework frontend
- [Node.js](https://nodejs.org/) pour le runtime backend
- [Tailwind CSS](https://tailwindcss.com/) pour le framework CSS

## 📞 Support

- 📧 Email : support@soundwave-music.com
- 🐛 Issues : [GitHub Issues](https://github.com/username/soundwave-music/issues)
- 📖 Documentation : Consultez les fichiers de documentation

---

**🎵 Bonne écoute avec SoundWave Music !**

*Une application musicale moderne et intuitive, propulsée par l'API Spotify.*
