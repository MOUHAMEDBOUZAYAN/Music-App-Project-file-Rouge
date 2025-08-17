# 🎵 Intégration Spotify - SoundWave Music

Ce guide explique comment configurer et utiliser l'intégration Spotify complète dans votre application SoundWave Music.

## 📋 Prérequis

- Compte développeur Spotify
- Application Spotify créée dans le [Dashboard Spotify Developer](https://developer.spotify.com/dashboard)
- Node.js et npm installés
- MongoDB installé et configuré

## 🔧 Configuration Backend

### 1. Variables d'environnement

Créez un fichier `.env` dans le dossier `soundwave-backend` :

```bash
# Configuration Spotify
SPOTIFY_CLIENT_ID=votre_client_id_spotify
SPOTIFY_CLIENT_SECRET=votre_client_secret_spotify
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback

# Configuration de la base de données
MONGODB_URI=mongodb://localhost:27017/soundwave

# Configuration JWT
JWT_SECRET=votre_jwt_secret

# Configuration du serveur
PORT=5000
NODE_ENV=development
```

### 2. Configuration Spotify Developer Dashboard

1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Créez une nouvelle application
3. Notez votre `Client ID` et `Client Secret`
4. Dans les paramètres de l'application, ajoutez l'URL de redirection :
   - `http://localhost:5000/api/auth/spotify/callback` (développement)
   - `https://votre-domaine.com/api/auth/spotify/callback` (production)

### 3. Installation des dépendances

```bash
cd soundwave-backend
npm install
```

### 4. Démarrage du serveur

```bash
npm run dev
```

## 🎨 Configuration Frontend

### 1. Variables d'environnement

Créez un fichier `.env` dans le dossier `soundwave-frontend` :

```bash
REACT_APP_API_URL=http://localhost:5000
```

### 2. Installation des dépendances

```bash
cd soundwave-frontend
npm install
```

### 3. Démarrage de l'application

```bash
npm run dev
```

## 🚀 Fonctionnalités disponibles

### Authentification Spotify
- Connexion avec compte Spotify
- Gestion des tokens d'accès et de rafraîchissement
- Redirection automatique après authentification

### Recherche
- Recherche en temps réel de morceaux, artistes, albums et playlists
- Filtres par type de contenu
- Résultats paginés
- Debouncing pour optimiser les performances

### Bibliothèque utilisateur
- Récupération des playlists personnelles
- Profil utilisateur Spotify
- Morceaux aimés
- Artistes suivis

### Découverte
- Nouvelles sorties
- Playlists en vedette
- Catégories de musique
- Recommandations personnalisées

### Lecteur audio
- Contrôles de lecture (play, pause, suivant, précédent)
- Gestion de la queue
- Contrôles de volume
- Modes de lecture (répétition, aléatoire)

## 📱 Composants créés

### 1. SpotifyLogin
- Interface de connexion Spotify moderne
- Design responsive avec animations
- Gestion des erreurs d'authentification

### 2. SpotifySearch
- Barre de recherche avancée
- Filtres par type de contenu
- Affichage des résultats organisés
- Recherche en temps réel

### 3. SpotifyHome
- Page d'accueil avec contenu dynamique
- Nouvelles sorties
- Playlists en vedette
- Catégories de musique
- Interface moderne et attrayante

### 4. SpotifyContext
- Gestion de l'état global Spotify
- Actions pour toutes les fonctionnalités
- Gestion des erreurs et du chargement

## 🔌 API Endpoints

### Authentification
- `GET /api/auth/spotify/login` - Redirection vers Spotify
- `GET /api/auth/spotify/callback` - Gestion du callback
- `POST /api/auth/spotify/refresh` - Rafraîchissement du token

### Recherche et contenu
- `GET /api/spotify/search` - Recherche globale
- `GET /api/spotify/me` - Profil utilisateur
- `GET /api/spotify/playlists` - Playlists utilisateur
- `GET /api/spotify/playlist/:id` - Détails d'une playlist
- `GET /api/spotify/album/:id` - Détails d'un album
- `GET /api/spotify/artist/:id` - Détails d'un artiste
- `GET /api/spotify/new-releases` - Nouvelles sorties
- `GET /api/spotify/featured-playlists` - Playlists en vedette
- `GET /api/spotify/categories` - Catégories de musique

## 🎯 Utilisation

### 1. Connexion Spotify
```jsx
import { useSpotify } from '../store/SpotifyContext';

const MyComponent = () => {
  const { login, spotifyToken, loading } = useSpotify();

  const handleLogin = async () => {
    try {
      await login();
    } catch (error) {
      console.error('Erreur de connexion:', error);
    }
  };

  return (
    <button onClick={handleLogin} disabled={loading}>
      {loading ? 'Connexion...' : 'Se connecter avec Spotify'}
    </button>
  );
};
```

### 2. Recherche
```jsx
const { search, searchResults, loading } = useSpotify();

const handleSearch = async (query) => {
  try {
    await search(query, 'track,artist,album,playlist', 20);
  } catch (error) {
    console.error('Erreur de recherche:', error);
  }
};
```

### 3. Lecture de musique
```jsx
const { playTrack, pauseTrack, currentTrack } = useSpotify();

const handlePlay = (track) => {
  playTrack(track);
};
```

## 🛠️ Personnalisation

### Thème
Modifiez les couleurs dans `src/config/spotify.js` :

```javascript
THEME: {
  PRIMARY_COLOR: '#1DB954', // Couleur principale
  SECONDARY_COLOR: '#191414', // Couleur secondaire
  ACCENT_COLOR: '#1ED760', // Couleur d'accent
  // ... autres couleurs
}
```

### Configuration des composants
Ajustez les paramètres dans `COMPONENT_CONFIG` :

```javascript
CARDS: {
  ALBUM: {
    SHOW_ARTIST: true,
    SHOW_YEAR: true,
    IMAGE_SIZE: 'medium'
  }
}
```

## 🔒 Sécurité

- Tokens stockés de manière sécurisée
- Validation des requêtes
- Gestion des erreurs d'authentification
- Rate limiting sur les API
- CORS configuré

## 🐛 Dépannage

### Erreurs courantes

1. **"Invalid redirect URI"**
   - Vérifiez l'URL de redirection dans le Dashboard Spotify
   - Assurez-vous que l'URL correspond exactement

2. **"Invalid client"**
   - Vérifiez votre Client ID et Client Secret
   - Assurez-vous que l'application est active

3. **"Network error"**
   - Vérifiez que le backend est démarré
   - Vérifiez l'URL de l'API dans la configuration

4. **"Token expired"**
   - Le token a expiré, reconnectez-vous
   - Vérifiez la logique de rafraîchissement

### Logs de débogage

Activez les logs dans le backend :

```javascript
// Dans app.js
app.use(morgan('dev'));
```

## 📚 Ressources supplémentaires

- [Documentation Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Spotify Web API Node](https://github.com/thelinmichael/spotify-web-api-node)
- [React Context API](https://reactjs.org/docs/context.html)
- [Tailwind CSS](https://tailwindcss.com/)

## 🤝 Contribution

Pour contribuer à l'intégration Spotify :

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.

---

**Note :** Cette intégration utilise l'API Spotify officielle. Assurez-vous de respecter les [conditions d'utilisation de Spotify](https://developer.spotify.com/terms/).
