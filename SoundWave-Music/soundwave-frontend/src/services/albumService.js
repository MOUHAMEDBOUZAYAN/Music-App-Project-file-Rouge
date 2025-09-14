import api from './api';

const albumService = {
  // Créer un album
  createAlbum: async (formData) => {
    console.log('🎵 Creating album with formData:', formData);
    const response = await api.post('/albums', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Album created successfully:', response.data);
    return response.data;
  },

  // Obtenir tous les albums
  getAllAlbums: async (params = {}) => {
    const response = await api.get('/albums', { params });
    return response.data;
  },

  // Rechercher des albums
  searchAlbums: async (query, params = {}) => {
    console.log('🔍 Searching albums with query:', query);
    const response = await api.get('/albums', { 
      params: { 
        search: query, 
        limit: params.limit || 10,
        ...params 
      } 
    });
    console.log('🔍 Albums search response:', response.data);
    return response.data;
  },

  // Obtenir les albums de l'utilisateur connecté
  getUserAlbums: async (params = {}) => {
    const response = await api.get('/albums/user', { params });
    return response.data;
  },

  // Supprimer un album
  deleteAlbum: async (albumId) => {
    const response = await api.delete(`/albums/${albumId}`);
    return response.data;
  },

  // Obtenir un album par ID
  getAlbumById: async (id) => {
    console.log('💿 Fetching album by ID:', id);
    const response = await api.get(`/albums/${id}`);
    console.log('💿 Album API response:', response.data);
    return response.data;
  },

  // Mettre à jour un album
  updateAlbum: async (id, data) => {
    const response = await api.put(`/albums/${id}`, data);
    return response.data;
  },

  // Supprimer un album
  deleteAlbum: async (id) => {
    const response = await api.delete(`/albums/${id}`);
    return response.data;
  },

  // Ajouter une chanson à un album
  addSongToAlbum: async (albumId, songId) => {
    const response = await api.post(`/albums/${albumId}/songs`, { songId });
    return response.data;
  },

  // Retirer une chanson d'un album
  removeSongFromAlbum: async (albumId, songId) => {
    const response = await api.delete(`/albums/${albumId}/songs/${songId}`);
    return response.data;
  },

  // Rechercher des albums
  searchAlbums: async (query, params = {}) => {
    const response = await api.get('/albums', { 
      params: { search: query, ...params } 
    });
    return response.data;
  },

  // Obtenir les albums suivis
  getFollowedAlbums: async (params = {}) => {
    try {
      const response = await api.get('/users/followed-albums', { params });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des albums suivis'
      };
    }
  },

  // Suivre/ne plus suivre un album
  followAlbum: async (albumId) => {
    try {
      const response = await api.post(`/albums/${albumId}/follow`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors du suivi de l\'album'
      };
    }
  },

  // Aimer/ne plus aimer un album
  likeAlbum: async (albumId) => {
    try {
      const response = await api.post(`/albums/${albumId}/like`);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la mise à jour des favoris'
      };
    }
  },
};

export { albumService };
