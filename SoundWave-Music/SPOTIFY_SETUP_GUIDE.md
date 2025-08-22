# 🎵 Guide de Configuration Spotify pour SoundWave

## 📋 Prérequis
- Un compte Spotify (gratuit ou Premium)
- Node.js installé sur votre machine
- Accès à l'internet

## 🚀 Configuration étape par étape

### 1. Créer une application Spotify
1. Allez sur [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Connectez-vous avec votre compte Spotify
3. Cliquez sur **"Create App"**
4. Remplissez les informations :
   - **App name** : `SoundWave Music` (ou le nom de votre choix)
   - **App description** : `Application de streaming musical`
   - **Website** : `http://localhost:3000`
   - **Redirect URIs** : `http://localhost:3000/spotify-callback`
   - **API/SDKs** : Cochez "Web API"
5. Cliquez sur **"Save"**

### 2. Récupérer vos clés
1. Dans votre application créée, vous verrez :
   - **Client ID** : Copiez cette valeur
   - **Client Secret** : Cliquez sur "Show Client Secret" et copiez la valeur

### 3. Configurer les clés dans votre projet
1. Ouvrez le fichier `soundwave-frontend/src/config/spotify-keys.js`
2. Remplacez les valeurs par vos vraies clés :
   ```javascript
   export const SPOTIFY_KEYS = {
     CLIENT_ID: 'votre_vrai_client_id_ici',
     CLIENT_SECRET: 'votre_vrai_client_secret_ici',
     REDIRECT_URI: 'http://localhost:3000/spotify-callback'
   };
   ```

### 4. Démarrer l'application
1. **Frontend** (dans un terminal) :
   ```bash
   cd soundwave-frontend
   npm run dev
   ```
   L'application sera accessible sur `http://localhost:3000`

2. **Backend** (dans un autre terminal) :
   ```bash
   cd soundwave-backend
   npm install
   npm run dev
   ```
   L'API sera accessible sur `http://localhost:5000`

### 5. Tester la connexion
1. Allez sur `http://localhost:3000/spotify-test`
2. Cliquez sur **"Se connecter à Spotify"**
3. Autorisez l'application dans Spotify
4. Cliquez sur **"Tester la connexion"**

## 🔧 Dépannage

### Erreur "Pas de token"
- Assurez-vous d'être connecté à Spotify
- Vérifiez que vos clés sont correctes

### Erreur 401 (Unauthorized)
- Vérifiez votre Client ID et Client Secret
- Assurez-vous que l'application Spotify est active

### Erreur 403 (Forbidden)
- Vérifiez que vous avez ajouté le bon Redirect URI
- Assurez-vous que tous les scopes sont autorisés

### Erreur de réseau
- Vérifiez que le backend est démarré sur le port 5000
- Vérifiez votre connexion internet

## 📱 Utilisation

Une fois configuré, vous pourrez :
- ✅ Écouter de la musique depuis Spotify
- ✅ Créer des playlists
- ✅ Rechercher des artistes, albums et morceaux
- ✅ Accéder à vos playlists personnelles
- ✅ Découvrir de nouvelles musiques

## 🔒 Sécurité

- **Ne partagez jamais** vos clés Spotify
- **N'ajoutez pas** le fichier `spotify-keys.js` à Git
- **Utilisez des variables d'environnement** en production

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez les logs du backend
3. Assurez-vous que toutes les étapes de configuration sont suivies

---

**🎉 Félicitations !** Votre application SoundWave est maintenant connectée à Spotify !
