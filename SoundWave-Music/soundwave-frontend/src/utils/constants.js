// Constants will be implemented here 
// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
export const SPOTIFY_API_URL = 'https://api.spotify.com/v1';
export const CLOUDINARY_BASE_URL = import.meta.env.VITE_CLOUDINARY_URL || '';

// Routes
export const ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  LIBRARY: '/library',
  PLAYLIST: '/playlist',
  ARTIST: '/artist',
  ALBUM: '/album',
  PROFILE: '/profile',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard'
};

// User Roles
export const USER_ROLES = {
  LISTENER: 'listener',
  ARTIST: 'artist',
  ADMIN: 'admin'
};

// Audio Player States
export const PLAYER_STATES = {
  PLAYING: 'playing',
  PAUSED: 'paused',
  STOPPED: 'stopped',
  LOADING: 'loading'
};

// Genres musicaux
export const MUSIC_GENRES = [
  'Pop', 'Rock', 'Hip-Hop', 'R&B', 'Jazz', 'Classical', 
  'Electronic', 'Country', 'Reggae', 'Blues', 'Folk', 
  'Alternative', 'Indie', 'Funk', 'Soul', 'Disco'
];

// Messages d'erreur
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette fonctionnalité.',
  FORBIDDEN: 'Vous n\'avez pas les droits pour effectuer cette action.',
  NOT_FOUND: 'Ressource non trouvée.',
  SERVER_ERROR: 'Erreur serveur. Veuillez réessayer plus tard.',
  VALIDATION_ERROR: 'Données invalides. Vérifiez les informations saisies.',
  UPLOAD_ERROR: 'Erreur lors de l\'upload du fichier.',
  AUDIO_ERROR: 'Impossible de lire ce fichier audio.'
};

// Messages de succès
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Connexion réussie !',
  REGISTER_SUCCESS: 'Inscription réussie ! Vérifiez votre email.',
  UPDATE_SUCCESS: 'Mise à jour effectuée avec succès.',
  UPLOAD_SUCCESS: 'Fichier uploadé avec succès.',
  DELETE_SUCCESS: 'Suppression effectuée avec succès.',
  PLAYLIST_CREATED: 'Playlist créée avec succès.',
  SONG_ADDED: 'Morceau ajouté à la playlist.',
  FOLLOW_SUCCESS: 'Vous suivez maintenant cet artiste.',
  UNFOLLOW_SUCCESS: 'Vous ne suivez plus cet artiste.'
};

// Configuration de pagination
export const PAGINATION = {
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
  DEFAULT_PAGE: 1
};

// Formats de fichiers supportés
export const SUPPORTED_AUDIO_FORMATS = [
  'audio/mpeg', 'audio/mp3', 'audio/wav', 
  'audio/ogg', 'audio/aac', 'audio/flac'
];

export const SUPPORTED_IMAGE_FORMATS = [
  'image/jpeg', 'image/jpg', 'image/png', 
  'image/webp', 'image/gif'
];

// Tailles d'images
export const IMAGE_SIZES = {
  THUMBNAIL: { width: 150, height: 150 },
  MEDIUM: { width: 300, height: 300 },
  LARGE: { width: 640, height: 640 },
  COVER: { width: 1200, height: 630 }
};

// Durées de cache (en millisecondes)
export const CACHE_DURATIONS = {
  SHORT: 5 * 60 * 1000,      // 5 minutes
  MEDIUM: 30 * 60 * 1000,    // 30 minutes
  LONG: 24 * 60 * 60 * 1000  // 24 heures
};

// Configuration du lecteur audio
export const AUDIO_CONFIG = {
  DEFAULT_VOLUME: 0.8,
  FADE_DURATION: 500,
  CROSSFADE_DURATION: 3000,
  SEEK_STEP: 10, // secondes
  VOLUME_STEP: 0.1
};

// Statistiques par défaut
export const DEFAULT_STATS = {
  PLAYS: 0,
  LIKES: 0,
  SHARES: 0,
  FOLLOWERS: 0,
  FOLLOWING: 0
};

// Configuration des notifications
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Durée des notifications (en millisecondes)
export const NOTIFICATION_DURATION = 4000;

// Configuration des animations
export const ANIMATION_CONFIG = {
  DURATION: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500
  },
  EASING: {
    EASE_IN_OUT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    EASE_OUT: 'cubic-bezier(0, 0, 0.2, 1)',
    EASE_IN: 'cubic-bezier(0.4, 0, 1, 1)'
  }
};

// Breakpoints responsive
export const BREAKPOINTS = {
  SM: '640px',
  MD: '768px',
  LG: '1024px',
  XL: '1280px',
  '2XL': '1536px'
};