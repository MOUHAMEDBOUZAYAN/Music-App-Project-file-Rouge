// Song service will be implemented here 
import { apiClient, endpoints } from './api.js';

export const songService = {
  // Rechercher des chansons
  searchSongs: async (params = {}) => {
    try {
      const response = await apiClient.get(endpoints.songs.search, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche'
      };
    }
  },

  // Obtenir une chanson par ID
  getSongById: async (id) => {
    try {
      const response = await apiClient.get(`${endpoints.songs.base}/${id}`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération de la chanson'
      };
    }
  },

  // Uploader une nouvelle chanson
  uploadSong: async (songData, audioFile, coverFile = null) => {
    try {
      const formData = new FormData();
      
      // Ajouter les données de la chanson
      Object.keys(songData).forEach(key => {
        if (songData[key] !== null && songData[key] !== undefined) {
          if (key === 'tags' && Array.isArray(songData[key])) {
            formData.append(key, JSON.stringify(songData[key]));
          } else {
            formData.append(key, songData[key]);
          }
        }
      });
      
      // Ajouter le fichier audio
      if (audioFile) {
        formData.append('audio', audioFile);
      }
      
      // Ajouter la cover si présente
      if (coverFile) {
        formData.append('cover', coverFile);
      }
      
      const response = await apiClient.post(endpoints.songs.upload, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          // Ici vous pouvez émettre un événement pour mettre à jour la progression
          console.log('Upload progress:', percentCompleted);
        },
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'upload de la chanson'
      };
    }
  },

  // Mettre à jour une chanson
  updateSong: async (id, songData) => {
    try {
      const response = await apiClient.put(`${endpoints.songs.base}/${id}`, songData);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour'
      };
    }
  },

  // Supprimer une chanson
  deleteSong: async (id) => {
    try {
      await apiClient.delete(`${endpoints.songs.base}/${id}`);
      return {
        success: true,
        message: 'Chanson supprimée avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la suppression'
      };
    }
  },

  // Aimer/ne plus aimer une chanson
  likeSong: async (id) => {
    try {
      const response = await apiClient.post(`${endpoints.songs.base}/${id}/like`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'action like'
      };
    }
  },

  // Ajouter un commentaire
  addComment: async (id, comment) => {
    try {
      const response = await apiClient.post(`${endpoints.songs.base}/${id}/comment`, {
        content: comment
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de l\'ajout du commentaire'
      };
    }
  },

  // Obtenir les chansons tendance
  getTrendingSongs: async (params = {}) => {
    try {
      const response = await apiClient.get(endpoints.songs.trending, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des tendances'
      };
    }
  },

  // Obtenir les chansons d'un artiste
  getArtistSongs: async (artistId, params = {}) => {
    try {
      const response = await apiClient.get(`${endpoints.songs.base}/artist/${artistId}`, { params });
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

  // Obtenir les chansons likées par l'utilisateur
  getLikedSongs: async (params = {}) => {
    try {
      const response = await apiClient.get(endpoints.songs.liked, { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des chansons likées'
      };
    }
  }
};