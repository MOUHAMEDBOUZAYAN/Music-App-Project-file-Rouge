# 🎵 SoundWave Music - Instructions de Configuration

## Problème identifié
Les erreurs de timeout et de connexion réseau indiquent que le backend n'est pas démarré ou n'est pas accessible.

## Solution rapide

### 1. Démarrer le Backend
```bash
cd soundwave-backend
npm install
npm run dev
```

### 2. Démarrer le Frontend (dans un nouveau terminal)
```bash
cd soundwave-frontend
npm install
npm run dev
```

### 3. Ou utiliser les scripts automatiques
- `start-backend.bat` - Démarrer seulement le backend
- `start-frontend.bat` - Démarrer seulement le frontend  
- `start-both.bat` - Démarrer les deux en même temps

## Configuration requise

### Base de données MongoDB
1. Installer MongoDB sur votre système
2. Démarrer le service MongoDB
3. Créer un fichier `.env` dans `soundwave-backend/` avec :
```
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/soundwave
JWT_SECRET=your-super-secret-jwt-key
CORS_ORIGIN=http://localhost:3000
```

### Ports utilisés
- Backend: http://localhost:5000
- Frontend: http://localhost:3000

## Vérification du fonctionnement

1. Ouvrir http://localhost:5000/api/health - doit retourner "OK"
2. Ouvrir http://localhost:3000 - doit afficher l'interface SoundWave

## Fonctionnalités des artistes

Une fois le backend démarré, les artistes peuvent :
- Accéder au tableau de bord via la sidebar
- Uploader des chansons
- Créer des albums
- Voir leurs créations sur la page d'accueil

## Dépannage

Si les erreurs persistent :
1. Vérifier que MongoDB est démarré
2. Vérifier que les ports 3000 et 5000 sont libres
3. Redémarrer les serveurs
4. Vérifier les logs dans la console
