# 🎵 Configuration Spotify pour SoundWave

## 📋 Prérequis

1. **Compte Spotify** (gratuit ou premium)
2. **Application Spotify développeur** créée sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

## 🔧 Configuration Backend

### 1. Créer une application Spotify

1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Cliquez sur **"Create App"**
3. Remplissez les informations :
   - **App name** : `SoundWave Music`
   - **App description** : `Application de musique avec intégration Spotify`
   - **Website** : `http://localhost:3000`
   - **Redirect URI** : `http://localhost:5000/api/auth/spotify/callback`
   - **API/SDKs** : Cochez les cases nécessaires

### 2. Obtenir les identifiants

Après création, vous obtiendrez :
- **Client ID** : Identifiant unique de votre application
- **Client Secret** : Clé secrète pour l'authentification

### 3. Configurer les variables d'environnement

Créez un fichier `.env` dans le dossier `soundwave-backend/` :

```env
# Configuration Spotify
SPOTIFY_CLIENT_ID=votre_client_id_ici
SPOTIFY_CLIENT_SECRET=votre_client_secret_ici
SPOTIFY_REDIRECT_URI=http://localhost:5000/api/auth/spotify/callback

# Configuration du serveur
PORT=5000
NODE_ENV=development

# Configuration JWT
JWT_SECRET=votre_jwt_secret_ici
JWT_EXPIRES_IN=7d
```

### 4. Configurer les scopes Spotify

Les scopes suivants sont configurés dans `spotify.routes.js` :

```javascript
const scopes = [
  'user-read-private',           // Profil utilisateur
  'user-read-email',            // Email utilisateur
  'user-read-playback-state',   // État de lecture
  'user-modify-playback-state', // Contrôle de lecture
  'user-read-currently-playing', // Morceau en cours
  'playlist-read-private',      // Playlists privées
  'playlist-read-collaborative', // Playlists collaboratives
  'playlist-modify-public',     // Modifier playlists publiques
  'playlist-modify-private',    // Modifier playlists privées
  'user-library-read',          // Bibliothèque utilisateur
  'user-library-modify',        // Modifier bibliothèque
  'user-follow-read',           // Suivre des artistes
  'user-follow-modify',         // Modifier suivis
  'user-top-read',              // Top utilisateur
  'user-read-recently-played'   // Morceaux récents
];
```

## 🚀 Démarrage de l'application

### 1. Démarrer le backend

```bash
cd soundwave-backend
npm install
npm start
```

Le serveur devrait démarrer sur `http://localhost:5000`

### 2. Démarrer le frontend

```bash
cd soundwave-frontend
npm install
npm run dev
```

L'application devrait s'ouvrir sur `http://localhost:3000`

## 🔐 Test de l'authentification

1. Allez sur `http://localhost:3000/login`
2. Cliquez sur le bouton **"Se connecter avec Spotify"**
3. Autorisez l'application à accéder à votre compte Spotify
4. Vous devriez être redirigé vers la page d'accueil avec vos données Spotify

## 🐛 Résolution des problèmes

### Erreur "Variables d'environnement Spotify non configurées"

**Solution** : Vérifiez que votre fichier `.env` contient bien :
- `SPOTIFY_CLIENT_ID`
- `SPOTIFY_CLIENT_SECRET`

### Erreur "Erreur de connexion réseau"

**Solutions** :
1. Vérifiez que le backend fonctionne sur le port 5000
2. Vérifiez votre connexion internet
3. Vérifiez que les URLs de redirection correspondent

### Erreur "Invalid redirect URI"

**Solution** : Vérifiez que l'URL de redirection dans votre app Spotify correspond exactement à :
`http://localhost:5000/api/auth/spotify/callback`

### Erreur "Invalid client"

**Solution** : Vérifiez que votre `CLIENT_ID` et `CLIENT_SECRET` sont corrects

## 📱 Fonctionnalités disponibles

Une fois configuré, vous pourrez :

- ✅ **Connexion Spotify** : Authentification OAuth 2.0
- ✅ **Profil utilisateur** : Informations et préférences
- ✅ **Recherche** : Morceaux, artistes, albums, playlists
- ✅ **Bibliothèque** : Playlists et morceaux likés
- ✅ **Lecture** : Contrôle de la musique
- ✅ **Découverte** : Nouvelles sorties et recommandations
- ✅ **Catégories** : Navigation par genre musical

## 🔒 Sécurité

- Les tokens Spotify sont stockés de manière sécurisée
- L'authentification utilise OAuth 2.0 standard
- Les requêtes API sont protégées par JWT
- Les erreurs sont gérées de manière sécurisée

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez les logs du serveur backend
3. Vérifiez votre configuration Spotify Developer
4. Assurez-vous que tous les services sont démarrés

---

**Note** : Cette configuration est pour le développement local. Pour la production, utilisez des URLs HTTPS et des domaines appropriés.
