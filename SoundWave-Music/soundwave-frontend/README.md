# SoundWave Frontend

Une application de streaming musical moderne construite avec React, Vite et Tailwind CSS.

## 🚀 Fonctionnalités

### ✅ Fonctionnalités Implémentées

- **Interface utilisateur moderne** avec design responsive
- **Navigation complète** avec sidebar et navbar
- **Pages principales** :
  - Accueil avec sections recommandées
  - Recherche avec filtres et suggestions
  - Bibliothèque personnelle
  - Gestion des playlists
  - Chansons aimées
  - Découverte d'artistes
  - Paramètres utilisateur

- **Composants réutilisables** :
  - AudioPlayer avec contrôles complets
  - Modal avec overlay et animations
  - SearchBar avec suggestions et filtres
  - TrackList pour affichage des chansons
  - Cards pour albums, playlists et artistes

- **Gestion d'état avancée** :
  - Context API pour l'authentification
  - Reducer pour la gestion globale de l'application
  - Hooks personnalisés pour l'API et l'audio

- **Authentification** :
  - Connexion/Inscription
  - Réinitialisation de mot de passe
  - Gestion des tokens JWT

### 🎵 Fonctionnalités Audio

- **Lecteur audio complet** avec contrôles de lecture
- **Gestion de la queue** avec ajout/suppression
- **Contrôles avancés** : shuffle, repeat, volume
- **Barre de progression** interactive
- **Mode plein écran** pour le lecteur

### 🎨 Interface Utilisateur

- **Design moderne** avec thème sombre
- **Animations fluides** et transitions
- **Responsive design** pour tous les appareils
- **Accessibilité** avec navigation clavier
- **Icônes Lucide React** pour une cohérence visuelle

## 📁 Structure du Projet

```
src/
├── components/
│   ├── auth/           # Composants d'authentification
│   ├── common/         # Composants réutilisables
│   ├── music/          # Composants musicaux
│   ├── player/         # Composants du lecteur
│   └── user/           # Composants utilisateur
├── hooks/              # Hooks personnalisés
├── pages/              # Pages principales
├── services/           # Services API
├── store/              # Gestion d'état
├── styles/             # Styles CSS
└── utils/              # Utilitaires
```

## 🛠️ Technologies Utilisées

- **React 18** - Framework principal
- **Vite** - Build tool et dev server
- **Tailwind CSS** - Framework CSS utilitaire
- **React Router** - Navigation SPA
- **Lucide React** - Icônes
- **Context API** - Gestion d'état
- **Jest & Testing Library** - Tests

## 🚀 Installation et Démarrage

### Prérequis

- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

1. **Cloner le repository**
```bash
git clone <repository-url>
cd SoundWave-Music/soundwave-frontend
```

2. **Installer les dépendances**
```bash
npm install
# ou
yarn install
```

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env.local
```

4. **Démarrer le serveur de développement**
```bash
npm run dev
# ou
yarn dev
```

L'application sera accessible sur `http://localhost:5173`

### Scripts Disponibles

```bash
npm run dev          # Démarre le serveur de développement
npm run build        # Construit l'application pour la production
npm run preview      # Prévisualise la build de production
npm run test         # Lance les tests
npm run test:watch   # Lance les tests en mode watch
npm run lint         # Vérifie le code avec ESLint
npm run lint:fix     # Corrige automatiquement les erreurs ESLint
```

## 🔧 Configuration

### Variables d'Environnement

Créez un fichier `.env.local` avec les variables suivantes :

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=SoundWave
VITE_APP_VERSION=1.0.0
```

### Configuration Tailwind

Le fichier `tailwind.config.js` contient la configuration personnalisée :

- Couleurs du thème SoundWave
- Breakpoints responsives
- Animations personnalisées
- Plugins supplémentaires

## 📱 Composants Principaux

### AudioPlayer
Lecteur audio complet avec contrôles avancés :
- Lecture/pause
- Navigation (précédent/suivant)
- Contrôle du volume
- Barre de progression
- Mode shuffle/repeat
- Gestion de la queue

### SearchBar
Barre de recherche avancée :
- Suggestions en temps réel
- Filtres par type (chansons, artistes, albums)
- Recherche vocale
- Historique de recherche

### Modal
Composant modal réutilisable :
- Overlay avec backdrop blur
- Fermeture par clic ou touche Escape
- Tailles configurables
- Animations fluides

## 🎯 Fonctionnalités Avancées

### Gestion d'État
- **AppProvider** : État global de l'application
- **AuthContext** : Gestion de l'authentification
- **MusicContext** : État de la musique et du lecteur

### Hooks Personnalisés
- **useApi** : Gestion des appels API
- **useAudio** : Contrôle audio avancé
- **useAuth** : Gestion de l'authentification
- **useLocalStorage** : Persistance des données

### Services API
- **api.js** : Configuration axios et intercepteurs
- **authService.js** : Services d'authentification
- **songService.js** : Services pour les chansons
- **playlistService.js** : Services pour les playlists
- **userService.js** : Services utilisateur

## 🧪 Tests

### Structure des Tests
```
tests/
├── App.test.jsx          # Tests de l'application principale
├── components/           # Tests des composants
├── hooks/               # Tests des hooks
└── utils/               # Tests des utilitaires
```

### Lancement des Tests
```bash
npm run test             # Tests unitaires
npm run test:watch       # Tests en mode watch
npm run test:coverage    # Tests avec couverture
```

## 🚀 Déploiement

### Build de Production
```bash
npm run build
```

### Déploiement sur Vercel
1. Connectez votre repository GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Déploiement sur Netlify
1. Connectez votre repository GitHub à Netlify
2. Configurez le build command : `npm run build`
3. Configurez le publish directory : `dist`

## 🤝 Contribution

### Guidelines
1. Fork le repository
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

### Standards de Code
- Utilisez ESLint et Prettier
- Suivez les conventions React
- Écrivez des tests pour les nouvelles fonctionnalités
- Documentez les composants complexes

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🆘 Support

Pour toute question ou problème :
- Ouvrez une issue sur GitHub
- Consultez la documentation
- Contactez l'équipe de développement

## 🔮 Roadmap

### Fonctionnalités Futures
- [ ] Mode hors ligne
- [ ] Synchronisation cross-device
- [ ] Intégration Spotify/Apple Music
- [ ] Podcasts
- [ ] Radio en direct
- [ ] Partage social
- [ ] Mode collaboratif pour les playlists
- [ ] Reconnaissance musicale
- [ ] Recommandations IA

---

**SoundWave** - Votre expérience musicale moderne 🎵
