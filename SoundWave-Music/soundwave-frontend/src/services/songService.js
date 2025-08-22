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
      const response = await apiClient.get(`/api/songs/${id}`);
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
      const response = await apiClient.put(`/api/songs/${id}`, songData);
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
      await apiClient.delete(`/api/songs/${id}`);
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
      const response = await apiClient.post(`/api/songs/${id}/like`);
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
      const response = await apiClient.post(`/api/songs/${id}/comment`, {
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
      const response = await apiClient.get(`/api/songs/artist/${artistId}`, { params });
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
  },

  // Obtenir les albums récents
  getRecentAlbums: async (params = {}) => {
    try {
      const response = await apiClient.get('/api/songs/all', {
        params: {
          ...params,
          sortBy: 'releaseDate',
          sortOrder: 'desc'
        }
      });
      
      // Grouper par album et formater
      const albumsMap = new Map();
      
      response.data.forEach(song => {
        if (song.album) {
          const albumId = song.album._id || song.album.id;
          if (!albumsMap.has(albumId)) {
            albumsMap.set(albumId, {
              id: albumId,
              name: song.album.title || song.album.name,
              artist: song.album.artist?.name || song.artist?.name || 'Artiste inconnu',
              coverUrl: song.album.cover || song.album.artwork || song.cover,
              genre: song.genre || 'Pop',
              releaseDate: song.releaseDate || song.createdAt,
              tracks: []
            });
          }
          
          const album = albumsMap.get(albumId);
          album.tracks.push(song);
        }
      });
      
      // Trier par date de sortie et retourner
      const recentAlbums = Array.from(albumsMap.values())
        .sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate))
        .slice(0, params.limit || 10);
      
      return {
        success: true,
        data: recentAlbums
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des albums récents:', error);
      return {
        success: false,
        error: 'Impossible de récupérer les albums récents',
        data: []
      };
    }
  }
};