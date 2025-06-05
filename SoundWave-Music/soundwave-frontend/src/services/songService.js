// Song service will be implemented here 
import { apiClient, endpoints } from './api.js';

export const songService = {
  // Récupérer tous les morceaux avec pagination
  getAllSongs: async (page = 1, limit = 20, filters = {}) => {
    try {
      const params = {
        page,
        limit,
        ...filters
      };
      
      const response = await apiClient.get(endpoints.songs.getAll, { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des morceaux'
      };
    }
  },

  // Récupérer un morceau par ID
  getSongById: async (songId) => {
    try {
      const response = await apiClient.get(endpoints.songs.getById(songId));
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Morceau non trouvé'
      };
    }
  },

  // Créer un nouveau morceau
  createSong: async (songData) => {
    try {
      const response = await apiClient.post(endpoints.songs.create, songData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la création du morceau'
      };
    }
  },

  // Mettre à jour un morceau
  updateSong: async (songId, songData) => {
    try {
      const response = await apiClient.put(endpoints.songs.update(songId), songData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour'
      };
    }
  },

  // Supprimer un morceau
  deleteSong: async (songId) => {
    try {
      await apiClient.delete(endpoints.songs.delete(songId));
      
      return {
        success: true,
        message: 'Morceau supprimé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression'
      };
    }
  },

  // Upload d'un fichier audio
  uploadSong: async (formData, onUploadProgress = null) => {
    try {
      const response = await apiClient.upload(
        endpoints.songs.upload,
        formData,
        onUploadProgress
      );
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'upload'
      };
    }
  },

  // Liker un morceau
  likeSong: async (songId) => {
    try {
      const response = await apiClient.post(endpoints.songs.like(songId));
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du like'
      };
    }
  },

  // Unliker un morceau
  unlikeSong: async (songId) => {
    try {
      const response = await apiClient.delete(endpoints.songs.unlike(songId));
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du unlike'
      };
    }
  },

  // Rechercher des morceaux
  searchSongs: async (query, filters = {}) => {
    try {
      const params = {
        q: query,
        ...filters
      };
      
      const response = await apiClient.get(endpoints.songs.search, { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche'
      };
    }
  },

  // Récupérer les morceaux tendances
  getTrendingSongs: async (limit = 10) => {
    try {
      const response = await apiClient.get(endpoints.songs.trending, {
        params: { limit }
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des tendances'
      };
    }
  },

  // Récupérer les recommandations
  getRecommendations: async (userId = null, limit = 20) => {
    try {
      const params = { limit };
      if (userId) params.userId = userId;
      
      const response = await apiClient.get(endpoints.songs.recommendations, { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des recommandations'
      };
    }
  },

  // Récupérer les morceaux par genre
  getSongsByGenre: async (genre, page = 1, limit = 20) => {
    try {
      const params = {
        genre,
        page,
        limit
      };
      
      const response = await apiClient.get(endpoints.songs.getAll, { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des morceaux'
      };
    }
  },

  // Récupérer les morceaux d'un artiste
  getSongsByArtist: async (artistId, page = 1, limit = 20) => {
    try {
      const params = {
        artist: artistId,
        page,
        limit
      };
      
      const response = await apiClient.get(endpoints.songs.getAll, { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des morceaux'
      };
    }
  },

  // Marquer un morceau comme écouté (pour les statistiques)
  markAsPlayed: async (songId) => {
    try {
      const response = await apiClient.post(`/songs/${songId}/play`);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'enregistrement de la lecture'
      };
    }
  },

  // Récupérer l'historique d'écoute
  getListeningHistory: async (page = 1, limit = 50) => {
    try {
      const params = { page, limit };
      
      const response = await apiClient.get('/songs/history', { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération de l\'historique'
      };
    }
  },

  // Récupérer les morceaux likés
  getLikedSongs: async (page = 1, limit = 50) => {
    try {
      const params = { page, limit };
      
      const response = await apiClient.get('/songs/liked', { params });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des morceaux likés'
      };
    }
  },

  // Signaler un morceau
  reportSong: async (songId, reason) => {
    try {
      const response = await apiClient.post(`/songs/${songId}/report`, {
        reason
      });
      
      return {
        success: true,
        message: 'Signalement envoyé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du signalement'
      };
    }
  },

  // Télécharger un morceau (si autorisé)
  downloadSong: async (songId) => {
    try {
      const response = await apiClient.get(`/songs/${songId}/download`, {
        responseType: 'blob'
      });
      
      return {
        success: true,
        data: response
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du téléchargement'
      };
    }
  }
};