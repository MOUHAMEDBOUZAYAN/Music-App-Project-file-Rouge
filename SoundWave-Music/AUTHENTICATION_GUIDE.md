# Guide d'Authentification et d'Autorisation - SoundWave

## Vue d'ensemble

Ce guide explique le système d'authentification et d'autorisation implémenté dans l'application SoundWave pour la création et la gestion de musique.

## Architecture du Système

### 1. Rôles Utilisateur

L'application définit trois rôles principaux :

- **`listener`** : Utilisateur de base qui peut écouter de la musique, créer des playlists, liker des chansons
- **`artist`** : Artiste qui peut uploader, modifier et supprimer ses propres chansons
- **`admin`** : Administrateur avec tous les droits, y compris la modération

### 2. Modèle de Données Utilisateur

```javascript
// Modèle User (backend)
{
  username: String,
  email: String,
  password: String (hashé),
  role: {
    type: String,
    enum: ['listener', 'artist', 'admin'],
    default: 'listener'
  },
  profilePicture: String,
  bio: String,
  followers: [User],
  following: [User]
}
```

## Backend - Authentification

### 1. Middleware d'Authentification

#### `auth.middleware.js`

```javascript
// Middleware principal pour protéger les routes
const protect = async (req, res, next) => {
  // Vérifie le token JWT dans les headers
  // Ajoute l'utilisateur à req.user
}

// Middleware pour vérifier le rôle d'artiste
const artist = (req, res, next) => {
  // Vérifie si l'utilisateur est artiste ou admin
}

// Middleware pour vérifier le rôle d'admin
const admin = (req, res, next) => {
  // Vérifie si l'utilisateur est admin
}

// Middleware pour vérifier la propriété
const owner = (req, res, next) => {
  // Vérifie si l'utilisateur est propriétaire ou admin
}
```

### 2. Routes Protégées

#### Routes de Chansons

```javascript
// Upload de chanson - Artistes seulement
router.post('/songs', 
  protect, 
  artist,  // Seuls les artistes peuvent uploader
  uploadLimiter, 
  validateSong, 
  songController.uploadSong
);

// Modification de chanson - Propriétaire ou admin
router.put('/songs/:id', 
  protect, 
  artist,  // Doit être artiste
  owner,   // Doit être propriétaire
  validateSong, 
  songController.updateSong
);

// Suppression de chanson - Propriétaire ou admin
router.delete('/songs/:id', 
  protect, 
  artist,  // Doit être artiste
  owner,   // Doit être propriétaire
  songController.deleteSong
);
```

### 3. Contrôleur de Chansons

```javascript
// Vérification automatique des permissions
const uploadSong = async (req, res, next) => {
  // Le middleware 'artist' s'assure déjà que l'utilisateur est un artiste ou admin
  const uploaderId = req.user._id;
  
  // Upload du fichier et création de la chanson
  const song = await Song.create({
    // ... données de la chanson
    uploader: uploaderId
  });
};
```

## Frontend - Authentification

### 1. Contexte d'Authentification

#### `AuthContext.jsx`

```javascript
// État global d'authentification
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Actions disponibles
const login = async (userData) => { /* ... */ };
const logout = () => { /* ... */ };
const updateUser = (userData) => { /* ... */ };

// Utilitaires de vérification
const hasRole = (role) => state.user?.role === role;
const isArtist = () => hasRole('artist') || hasRole('admin');
const isAdmin = () => hasRole('admin');
const canUploadMusic = () => isArtist() || isAdmin();
```

### 2. Composant de Protection des Routes

#### `ProtectedRoute.jsx`

```javascript
const ProtectedRoute = ({ 
  children, 
  requireAuth = true, 
  requireRole = null, 
  requireArtist = false,
  requireAdmin = false 
}) => {
  // Vérifications automatiques :
  // 1. Authentification requise
  // 2. Rôle spécifique requis
  // 3. Rôle d'artiste requis
  // 4. Rôle d'admin requis
  
  // Redirection automatique vers /login si non authentifié
  // Affichage de messages d'erreur appropriés
};
```

### 3. Utilisation dans les Routes

```javascript
// Routes protégées par rôle
<Route path="upload" element={
  <ProtectedRoute requireAuth={true} requireArtist={true}>
    <UploadSong />
  </ProtectedRoute>
} />

<Route path="admin" element={
  <ProtectedRoute requireAuth={true} requireAdmin={true}>
    <AdminPanel />
  </ProtectedRoute>
} />
```

### 4. Composant d'Upload de Chanson

#### `UploadSong.jsx`

```javascript
const UploadSong = () => {
  const { isAuthenticated, user, canUploadMusic } = useAuth();
  const navigate = useNavigate();
  
  // Vérification automatique des permissions
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { 
        state: { 
          message: 'Vous devez être connecté pour uploader une chanson',
          redirectTo: '/upload'
        }
      });
      return;
    }

    if (!canUploadMusic()) {
      navigate('/profile', { 
        state: { 
          message: 'Seuls les artistes peuvent uploader des chansons',
          type: 'warning'
        }
      });
      return;
    }
  }, [isAuthenticated, canUploadMusic]);

  // Interface conditionnelle
  if (!isAuthenticated || !canUploadMusic()) {
    return <AccessDeniedMessage />;
  }
};
```

## Flux d'Authentification

### 1. Connexion Utilisateur

1. **Formulaire de connexion** → `LoginForm.jsx`
2. **Appel API** → `authService.login()`
3. **Vérification backend** → `auth.controller.js`
4. **Génération JWT** → Token retourné au frontend
5. **Stockage local** → Token sauvegardé dans localStorage
6. **Mise à jour contexte** → `AuthContext` mis à jour
7. **Redirection** → Vers la page demandée ou l'accueil

### 2. Upload de Chanson

1. **Accès à la page** → Vérification automatique des permissions
2. **Formulaire d'upload** → Validation côté client
3. **Soumission** → `songService.uploadSong()`
4. **Middleware backend** → Vérification JWT + rôle artiste
5. **Upload fichier** → Cloudinary ou stockage local
6. **Création en DB** → Chanson liée à l'utilisateur
7. **Confirmation** → Retour au frontend

### 3. Gestion des Erreurs

#### Erreurs d'Authentification
- **401 Unauthorized** : Token manquant ou invalide
- **403 Forbidden** : Permissions insuffisantes
- **Redirection automatique** vers `/login` avec message

#### Messages d'Erreur Contextuels
```javascript
// Messages spécifiques selon le contexte
if (!isAuthenticated) {
  message = 'Vous devez être connecté pour accéder à cette fonctionnalité';
} else if (!canUploadMusic()) {
  message = 'Seuls les artistes peuvent uploader des chansons';
} else if (!isAdmin()) {
  message = 'Accès administrateur requis';
}
```

## Sécurité

### 1. Protection des Routes Backend

- **Middleware `protect`** : Vérification JWT obligatoire
- **Middleware `artist`** : Vérification du rôle artiste
- **Middleware `owner`** : Vérification de la propriété
- **Rate limiting** : Protection contre les abus

### 2. Protection des Routes Frontend

- **Composant `ProtectedRoute`** : Vérification automatique
- **Redirection automatique** : Vers login si non authentifié
- **Messages contextuels** : Explication des permissions requises

### 3. Validation des Données

- **Validation côté client** : Feedback immédiat
- **Validation côté serveur** : Sécurité absolue
- **Sanitisation** : Protection contre les injections

## Utilisation

### 1. Pour les Développeurs

#### Ajouter une Route Protégée
```javascript
<Route path="nouvelle-route" element={
  <ProtectedRoute requireAuth={true} requireArtist={true}>
    <NouveauComposant />
  </ProtectedRoute>
} />
```

#### Vérifier les Permissions dans un Composant
```javascript
const { isAuthenticated, isArtist, canUploadMusic } = useAuth();

if (!canUploadMusic()) {
  return <AccessDenied />;
}
```

#### Ajouter un Middleware Backend
```javascript
router.post('/nouvelle-route', 
  protect, 
  artist,  // Si nécessaire
  nouveauController.action
);
```

### 2. Pour les Utilisateurs

#### Devenir Artiste
1. Créer un compte utilisateur
2. Se connecter
3. Aller dans les paramètres du profil
4. Changer le rôle vers "artist"
5. Sauvegarder les modifications

#### Uploader une Chanson
1. Se connecter avec un compte artiste
2. Cliquer sur "Upload" dans la navigation
3. Suivre le processus en 3 étapes
4. Publier la chanson

## Tests

### 1. Tests d'Authentification
```javascript
// Vérifier que les routes protégées redirigent
test('redirects to login when not authenticated', () => {
  // ...
});

// Vérifier que les artistes peuvent uploader
test('allows artists to upload songs', () => {
  // ...
});
```

### 2. Tests d'Autorisation
```javascript
// Vérifier que seuls les propriétaires peuvent modifier
test('only owners can edit songs', () => {
  // ...
});
```

## Maintenance

### 1. Ajout de Nouveaux Rôles
1. Modifier le modèle `User` (backend)
2. Mettre à jour les constantes (frontend)
3. Ajouter les middlewares nécessaires
4. Mettre à jour les composants de protection

### 2. Modification des Permissions
1. Identifier les routes concernées
2. Mettre à jour les middlewares
3. Tester les changements
4. Mettre à jour la documentation

## Conclusion

Ce système d'authentification et d'autorisation garantit que :

- ✅ Seuls les utilisateurs authentifiés peuvent accéder aux fonctionnalités privées
- ✅ Seuls les artistes peuvent créer et gérer de la musique
- ✅ Seuls les propriétaires peuvent modifier leurs contenus
- ✅ Les administrateurs ont tous les droits
- ✅ L'expérience utilisateur est fluide avec des messages contextuels
- ✅ La sécurité est maintenue à tous les niveaux

Le système est extensible et peut facilement être adapté pour de nouveaux rôles ou permissions.
