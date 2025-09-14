import { apiClient, endpoints } from './api.js';

export const artistService = {
  // Rechercher des artistes
  searchArtists: async (params = {}) => {
    try {
      console.log('🔍 Searching artists with params:', params);
      const response = await apiClient.get('/search/artists', { params });
      console.log('🔍 Artists search response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error searching artists:', error);
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

  // Obtenir les albums d'un artiste
  getArtistAlbums: async (artistId, params = {}) => {
    try {
      const response = await apiClient.get(`/artists/${artistId}/albums`, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des albums de l\'artiste'
      };
    }
  },

  // Obtenir mes chansons (pour l'artiste connecté)
  getMySongs: async (params = {}) => {
    try {
      const response = await apiClient.get('/artists/me/songs', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de mes chansons'
      };
    }
  },

  // Obtenir mes albums (pour l'artiste connecté)
  getMyAlbums: async (params = {}) => {
    try {
      const response = await apiClient.get('/artists/me/albums', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de mes albums'
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
      console.error('❌ Error in followArtist:', error);
      const errorMessage = error.response?.data?.message || 'Erreur lors du suivi de l\'artiste';
      
      // Si l'erreur indique que l'utilisateur suit déjà l'artiste, on considère ça comme un succès
      if (errorMessage.includes('déjà')) {
        console.log('✅ User already follows artist, treating as success');
        return {
          success: true,
          data: { message: errorMessage },
          alreadyFollowing: true
        };
      }
      
      return {
        success: false,
        error: errorMessage
      };
    }
  },

  // Obtenir les artistes suivis
  getFollowedArtists: async (params = {}) => {
    try {
      const response = await apiClient.get('/users/following', { params });
      console.log('🔍 getFollowedArtists response:', response.data);
      return {
        success: true,
        data: response.data.following || [] // Utiliser 'following' au lieu de 'data'
      };
    } catch (error) {
      console.error('❌ Error in getFollowedArtists:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des artistes suivis',
        data: []
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
