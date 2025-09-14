import { apiClient, endpoints } from './api.js';

export const playlistService = {
  // Obtenir toutes les playlists
  getAllPlaylists: async (params = {}) => {
    try {
      const response = await apiClient.get(endpoints.playlists.getAll, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des playlists'
      };
    }
  },

  // Rechercher des playlists
  searchPlaylists: async (params = {}) => {
    try {
      console.log('🔍 Searching playlists with params:', params);
      const response = await apiClient.get('/search/playlists', { params });
      console.log('🔍 Playlists search response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error searching playlists:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche de playlists'
      };
    }
  },

  // Obtenir une playlist par ID
  getPlaylistById: async (id) => {
    try {
      const response = await apiClient.get(endpoints.playlists.getById(id));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de la playlist'
      };
    }
  },

  // Obtenir les playlists recommandées
  getRecommendedPlaylists: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/playlists/recommended', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des playlists recommandées'
      };
    }
  },

  // Créer une nouvelle playlist
  createPlaylist: async (playlistData) => {
    try {
      const response = await apiClient.post(endpoints.playlists.create, playlistData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de la playlist'
      };
    }
  },

  // Mettre à jour une playlist
  updatePlaylist: async (id, playlistData) => {
    try {
      const response = await apiClient.put(endpoints.playlists.update(id), playlistData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de la playlist'
      };
    }
  },

  // Supprimer une playlist
  deletePlaylist: async (id) => {
    try {
      await apiClient.delete(endpoints.playlists.delete(id));
      return {
        success: true,
        message: 'Playlist supprimée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression de la playlist'
      };
    }
  },

  // Ajouter une chanson à une playlist
  addSongToPlaylist: async (playlistId, songId) => {
    try {
      const response = await apiClient.post(endpoints.playlists.addSong(playlistId), { songId });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'ajout de la chanson à la playlist'
      };
    }
  },

  // Retirer une chanson d'une playlist
  removeSongFromPlaylist: async (playlistId, songId) => {
    try {
      await apiClient.delete(endpoints.playlists.removeSong(playlistId, songId));
      return {
        success: true,
        message: 'Chanson retirée de la playlist avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du retrait de la chanson de la playlist'
      };
    }
  },

  // Suivre une playlist
  followPlaylist: async (id) => {
    try {
      const response = await apiClient.post(endpoints.playlists.follow(id));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du suivi de la playlist'
      };
    }
  },

  // Ne plus suivre une playlist
  unfollowPlaylist: async (id) => {
    try {
      const response = await apiClient.delete(endpoints.playlists.unfollow(id));
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'arrêt du suivi de la playlist'
      };
    }
  },

  // Créer une playlist brouillon
  createDraftPlaylist: async (playlistData) => {
    try {
      const response = await apiClient.post('/playlists/draft', playlistData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la création de la playlist brouillon'
      };
    }
  },

  // Obtenir la playlist brouillon de l'utilisateur
  getDraftPlaylist: async () => {
    try {
      const response = await apiClient.get('/playlists/draft');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de la playlist brouillon'
      };
    }
  },

  // Mettre à jour la playlist brouillon
  updateDraftPlaylist: async (playlistData) => {
    try {
      const response = await apiClient.put('/playlists/draft', playlistData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour de la playlist brouillon'
      };
    }
  },

  // Supprimer la playlist brouillon
  deleteDraftPlaylist: async () => {
    try {
      await apiClient.delete('/playlists/draft');
      return {
        success: true,
        message: 'Playlist brouillon supprimée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression de la playlist brouillon'
      };
    }
  },

  // Obtenir les playlists publiques
  getPublicPlaylists: async (params = {}) => {
    try {
      const response = await apiClient.get('/playlists/public', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des playlists publiques'
      };
    }
  }
}; 