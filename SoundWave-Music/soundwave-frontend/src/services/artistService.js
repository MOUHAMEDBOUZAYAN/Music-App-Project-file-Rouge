import { apiClient, endpoints } from './api.js';

export const artistService = {
  // Rechercher des artistes
  searchArtists: async (params = {}) => {
    try {
      const response = await apiClient.get(endpoints.search.artists, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche d\'artistes'
      };
    }
  },

  // Obtenir les artistes populaires
  getPopularArtists: async (params = {}) => {
    try {
      const response = await apiClient.get('/artists/popular', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des artistes populaires'
      };
    }
  },

  // Obtenir un artiste par ID
  getArtistById: async (id) => {
    try {
      const response = await apiClient.get(`/artists/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de l\'artiste'
      };
    }
  },

  // Obtenir les chansons d'un artiste
  getArtistSongs: async (artistId, params = {}) => {
    try {
      const response = await apiClient.get(`/artists/${artistId}/songs`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des chansons de l\'artiste'
      };
    }
  },

  // Suivre un artiste
  followArtist: async (artistId) => {
    try {
      const response = await apiClient.post(`/artists/${artistId}/follow`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du suivi de l\'artiste'
      };
    }
  },

  // Ne plus suivre un artiste
  unfollowArtist: async (artistId) => {
    try {
      const response = await apiClient.delete(`/artists/${artistId}/follow`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'arrêt du suivi de l\'artiste'
      };
    }
  }
};
