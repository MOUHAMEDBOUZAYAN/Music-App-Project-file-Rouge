// Configuration Spotify pour le frontend
export const SPOTIFY_CONFIG = {
  // URL de l'API backend
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  
  // Endpoints Spotify
  ENDPOINTS: {
    LOGIN: '/api/auth/spotify/login',
    CALLBACK: '/api/auth/spotify/callback',
    REFRESH: '/api/auth/spotify/refresh',
    SEARCH: '/api/spotify/search',
    PROFILE: '/api/spotify/me',
    PLAYLISTS: '/api/spotify/playlists',
    PLAYLIST: '/api/spotify/playlist',
    ALBUM: '/api/spotify/album',
    ARTIST: '/api/spotify/artist',
    ARTIST_TOP_TRACKS: '/api/spotify/artist',
    ARTIST_ALBUMS: '/api/spotify/artist',
    RECOMMENDATIONS: '/api/spotify/recommendations',
    NEW_RELEASES: '/api/spotify/new-releases',
    FEATURED_PLAYLISTS: '/api/spotify/featured-playlists',
    CATEGORIES: '/api/spotify/categories',
    CATEGORY_PLAYLISTS: '/api/spotify/category'
  },

  // Configuration par défaut
  DEFAULTS: {
    SEARCH_LIMIT: 20,
    SEARCH_OFFSET: 0,
    MARKET: 'FR',
    COUNTRY: 'FR'
  },

  // Types de recherche disponibles
  SEARCH_TYPES: {
    TRACK: 'track',
    ARTIST: 'artist',
    ALBUM: 'album',
    PLAYLIST: 'playlist',
    ALL: 'track,artist,album,playlist'
  },

  // Modes de lecture
  PLAYBACK_MODES: {
    REPEAT: {
      OFF: 'off',
      TRACK: 'track',
      CONTEXT: 'context'
    },
    SHUFFLE: {
      ON: true,
      OFF: false
    }
  },

  // Configuration des images
  IMAGE_SIZES: {
    SMALL: 64,
    MEDIUM: 300,
    LARGE: 640
  },

  // Configuration des playlists
  PLAYLIST_TYPES: {
    PUBLIC: 'public',
    PRIVATE: 'private',
    COLLABORATIVE: 'collaborative'
  },

  // Configuration des catégories
  CATEGORY_LIMITS: {
    DEFAULT: 20,
    MAX: 50
  },

  // Configuration des recommandations
  RECOMMENDATION_LIMITS: {
    MIN: 1,
    MAX: 100,
    DEFAULT: 20
  },

  // Configuration des scopes d'autorisation
  SCOPES: [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-modify-private',
    'user-library-read',
    'user-library-modify',
    'user-follow-read',
    'user-follow-modify',
    'user-top-read',
    'user-read-recently-played'
  ],

  // Configuration des erreurs
  ERROR_MESSAGES: {
    AUTH_FAILED: 'Échec de l\'authentification avec Spotify',
    TOKEN_EXPIRED: 'Token Spotify expiré',
    NETWORK_ERROR: 'Erreur de réseau',
    SEARCH_FAILED: 'Échec de la recherche',
    PROFILE_LOAD_FAILED: 'Impossible de charger le profil',
    PLAYLIST_LOAD_FAILED: 'Impossible de charger les playlists',
    ALBUM_LOAD_FAILED: 'Impossible de charger l\'album',
    ARTIST_LOAD_FAILED: 'Impossible de charger l\'artiste'
  },

  // Configuration des notifications
  NOTIFICATIONS: {
    DURATION: 4000,
    POSITION: 'top-right'
  },

  // Configuration du thème
  THEME: {
    PRIMARY_COLOR: '#1DB954', // Vert Spotify
    SECONDARY_COLOR: '#191414', // Noir Spotify
    ACCENT_COLOR: '#1ED760', // Vert clair Spotify
    BACKGROUND_COLOR: '#121212',
    SURFACE_COLOR: '#282828',
    TEXT_PRIMARY: '#FFFFFF',
    TEXT_SECONDARY: '#B3B3B3'
  }
};

// Configuration des routes de l'application
export const APP_ROUTES = {
  HOME: '/',
  SEARCH: '/search',
  LIBRARY: '/library',
  LIKED_SONGS: '/liked-songs',
  PLAYLIST: '/playlist/:id',
  ALBUM: '/album/:id',
  ARTIST: '/artist/:id',
  SETTINGS: '/settings',
  SPOTIFY_LOGIN: '/spotify-login'
};

// Configuration des composants
export const COMPONENT_CONFIG = {
  // Configuration des cartes
  CARDS: {
    ALBUM: {
      ASPECT_RATIO: '1/1',
      IMAGE_SIZE: 'medium',
      SHOW_ARTIST: true,
      SHOW_YEAR: true
    },
    ARTIST: {
      IMAGE_SIZE: 'large',
      SHOW_FOLLOWERS: true,
      SHOW_GENRES: true
    },
    PLAYLIST: {
      IMAGE_SIZE: 'medium',
      SHOW_OWNER: true,
      SHOW_TRACK_COUNT: true
    },
    TRACK: {
      IMAGE_SIZE: 'small',
      SHOW_ALBUM: true,
      SHOW_DURATION: true
    }
  },

  // Configuration de la recherche
  SEARCH: {
    DEBOUNCE_DELAY: 500,
    MIN_QUERY_LENGTH: 2,
    MAX_RESULTS_PER_TYPE: 50,
    SHOW_FILTERS: true
  },

  // Configuration du lecteur
  PLAYER: {
    SHOW_PROGRESS: true,
    SHOW_VOLUME: true,
    SHOW_CONTROLS: true,
    AUTO_PLAY: false,
    CROSSFADE: false
  }
};

export default SPOTIFY_CONFIG;
