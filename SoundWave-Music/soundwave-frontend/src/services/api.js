// API configuration will be implemented here 
import axios from 'axios';
import { API_BASE_URL, ERROR_MESSAGES } from '../utils/constants.js';
import { handleApiError, secureStorage } from '../utils/helpers.js';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000, // Augmenté à 30 secondes
  headers: {
    'Content-Type': 'application/json',
  },
  // Configuration pour éviter les boucles infinies
  retry: 2,
  retryDelay: 1000,
});

// Intercepteur de requêtes - Ajout du token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = secureStorage.get('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log des requêtes en développement
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur de réponses - Gestion des erreurs globales
api.interceptors.response.use(
  (response) => {
    // Log des réponses en développement
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error) => {
    // Gestion spéciale des erreurs de connexion réseau
    if (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK') {
      console.error('❌ Erreur de connexion réseau:', error.message);
      return Promise.reject({
        message: 'Erreur de connexion réseau. Vérifiez votre connexion internet et que le serveur backend fonctionne.',
        status: 'NETWORK_ERROR',
        originalError: error
      });
    }

    // Gestion des timeouts
    if (error.code === 'ECONNABORTED') {
      console.error('❌ Timeout de la requête:', error.message);
      return Promise.reject({
        message: 'La requête a pris trop de temps. Vérifiez votre connexion.',
        status: 'TIMEOUT',
        originalError: error
      });
    }

    const errorInfo = handleApiError(error);
    
    // Gestion spécifique des codes d'erreur
    switch (errorInfo.status) {
      case 401:
        // Token expiré ou invalide
        secureStorage.remove('authToken');
        secureStorage.remove('user');
        // Redirection vers la page de connexion
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        break;
        
      case 403:
        console.error('❌ Accès refusé:', errorInfo.message);
        // Ne pas rediriger automatiquement pour les erreurs 403
        // Laisser chaque composant gérer l'erreur selon le contexte
        break;
        
      case 404:
        console.error('❌ Ressource non trouvée:', errorInfo.message);
        break;
        
      case 500:
        console.error('❌ Erreur serveur:', errorInfo.message);
        break;
        
      default:
        console.error('❌ Erreur API:', errorInfo.message);
    }
    
    return Promise.reject(errorInfo);
  }
);

// API Endpoints
export const endpoints = {
  // Authentification
  auth: {
    login: '/auth/login',
    register: '/auth/register',
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
    verifyEmail: '/auth/verify-email',
    changePassword: '/auth/change-password'
  },
  
  // Utilisateurs
  users: {
    profile: '/users/profile',
    update: '/users/profile',
    uploadAvatar: '/users/avatar',
    follow: (userId) => `/users/${userId}/follow`,
    unfollow: (userId) => `/users/${userId}/unfollow`,
    followers: (userId) => `/users/${userId}/followers`,
    following: (userId) => `/users/${userId}/following`,
    search: '/users/search'
  },
  
  // Morceaux
  songs: {
    getAll: '/songs',
    getById: (id) => `/songs/${id}`,
    create: '/songs',
    update: (id) => `/songs/${id}`,
    delete: (id) => `/songs/${id}`,
    upload: '/songs',
    like: (id) => `/songs/${id}/like`,
    liked: '/songs/liked',
    search: '/songs/search',
    trending: '/songs/trending',
    recommendations: '/songs/recommendations'
  },
  
  // Albums
  albums: {
    getAll: '/albums',
    getById: (id) => `/albums/${id}`,
    create: '/albums',
    update: (id) => `/albums/${id}`,
    delete: (id) => `/albums/${id}`,
    songs: (id) => `/albums/${id}/songs`
  },
  
  // Artistes
  artists: {
    getAll: '/artists',
    getById: (id) => `/artists/${id}`,
    create: '/artists',
    update: (id) => `/artists/${id}`,
    delete: (id) => `/artists/${id}`,
    popular: '/artists/popular',
    topTracks: (id) => `/artists/${id}/tracks`,
    albums: (id) => `/artists/${id}/albums`
  },
  
  // Playlists
  playlists: {
    getAll: '/playlists',
    getById: (id) => `/playlists/${id}`,
    create: '/playlists',
    update: (id) => `/playlists/${id}`,
    delete: (id) => `/playlists/${id}`,
    addSong: (id) => `/playlists/${id}/songs`,
    removeSong: (playlistId, songId) => `/playlists/${playlistId}/songs/${songId}`,
    follow: (id) => `/playlists/${id}/follow`,
    unfollow: (id) => `/playlists/${id}/unfollow`
  },
  
  // Recherche
  search: {
    global: '/search',
    songs: '/search/songs',
    artists: '/search/artists',
    albums: '/search/albums',
    playlists: '/search/playlists'
  },
  
  // Statistiques
  analytics: {
    dashboard: '/analytics/dashboard',
    songStats: (id) => `/analytics/songs/${id}`,
    userStats: '/analytics/user',
    trending: '/analytics/trending'
  }
};

// Favorites (externes)
endpoints.favorites = {
  external: '/favorites/external',
  removeExternal: (provider, externalId) => `/favorites/external/${provider}/${externalId}`
};

// Fonctions utilitaires pour les requêtes API
export const apiClient = {
  // GET request
  get: async (url, config = {}) => {
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // POST request
  post: async (url, data = {}, config = {}) => {
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // PUT request
  put: async (url, data = {}, config = {}) => {
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // PATCH request
  patch: async (url, data = {}, config = {}) => {
    try {
      const response = await api.patch(url, data, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // DELETE request
  delete: async (url, config = {}) => {
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  // Upload de fichiers
  upload: async (url, formData, onUploadProgress = null) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      };
      
      if (onUploadProgress) {
        config.onUploadProgress = onUploadProgress;
      }
      
      const response = await api.post(url, formData, config);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default api;