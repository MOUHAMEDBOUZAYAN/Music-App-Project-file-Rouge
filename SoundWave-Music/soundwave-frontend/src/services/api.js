// API configuration will be implemented here 
import axios from 'axios';
import { API_BASE_URL, ERROR_MESSAGES } from '../utils/constants.js';
import { handleApiError, secureStorage } from '../utils/helpers.js';

// Configuration de base d'Axios
const api = axios.create({
  baseURL: API_BASE_URL || '/api',
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
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    refresh: '/api/auth/refresh',
    forgotPassword: '/api/auth/forgot-password',
    resetPassword: '/api/auth/reset-password',
    verifyEmail: '/api/auth/verify-email',
    changePassword: '/api/auth/change-password'
  },
  
  // Utilisateurs
  users: {
    profile: '/api/users/profile',
    update: '/api/users/profile',
    uploadAvatar: '/api/users/avatar',
    follow: (userId) => `/api/users/${userId}/follow`,
    unfollow: (userId) => `/api/users/${userId}/unfollow`,
    followers: (userId) => `/api/users/${userId}/followers`,
    following: (userId) => `/api/users/${userId}/following`,
    search: '/api/users/search'
  },
  
  // Morceaux
  songs: {
    getAll: '/api/songs',
    getById: (id) => `/api/songs/${id}`,
    create: '/api/songs',
    update: (id) => `/api/songs/${id}`,
    delete: (id) => `/api/songs/${id}`,
    upload: '/api/songs',
    like: (id) => `/api/songs/${id}/like`,
    liked: '/api/songs/liked',
    search: '/api/songs/search',
    trending: '/api/songs/trending',
    recommendations: '/api/songs/recommendations'
  },
  
  // Albums
  albums: {
    getAll: '/api/albums',
    getById: (id) => `/api/albums/${id}`,
    create: '/api/albums',
    update: (id) => `/api/albums/${id}`,
    delete: (id) => `/api/albums/${id}`,
    songs: (id) => `/api/albums/${id}/songs`
  },
  
  // Artistes
  artists: {
    getAll: '/api/artists',
    getById: (id) => `/api/artists/${id}`,
    create: '/api/artists',
    update: (id) => `/api/artists/${id}`,
    delete: (id) => `/api/artists/${id}`,
    popular: '/api/artists/popular',
    topTracks: (id) => `/api/artists/${id}/tracks`,
    albums: (id) => `/api/artists/${id}/albums`
  },
  
  // Playlists
  playlists: {
    getAll: '/api/playlists',
    getById: (id) => `/api/playlists/${id}`,
    create: '/api/playlists',
    update: (id) => `/api/playlists/${id}`,
    delete: (id) => `/api/playlists/${id}`,
    addSong: (id) => `/api/playlists/${id}/songs`,
    removeSong: (playlistId, songId) => `/api/playlists/${playlistId}/songs/${songId}`,
    follow: (id) => `/api/playlists/${id}/follow`,
    unfollow: (id) => `/api/playlists/${id}/unfollow`
  },
  
  // Recherche
  search: {
    global: '/api/search',
    songs: '/api/search/songs',
    artists: '/api/search/artists',
    albums: '/api/search/albums',
    playlists: '/api/search/playlists'
  },
  
  // Statistiques
  analytics: {
    dashboard: '/api/analytics/dashboard',
    songStats: (id) => `/api/analytics/songs/${id}`,
    userStats: '/api/analytics/user',
    trending: '/api/analytics/trending'
  }
};

// Favorites (externes)
endpoints.favorites = {
  external: '/api/favorites/external',
  removeExternal: (provider, externalId) => `/api/favorites/external/${provider}/${externalId}`
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