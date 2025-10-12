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
    try {
      console.log('🔍 Searching albums with query:', query);
      const response = await api.get('/search/albums', { 
        params: { 
          q: query, 
          limit: params.limit || 10,
          ...params 
        } 
      });
      console.log('🔍 Albums search response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error searching albums:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche d\'albums'
      };
    }
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
    console.log('💿 Album ID type:', typeof id);
    console.log('💿 Album ID length:', id?.length);
    
    try {
      const response = await api.get(`/albums/${id}`);
      console.log('💿 Album API response:', response.data);
      console.log('💿 Album API response success:', response.data?.success);
      console.log('💿 Album API response data:', response.data?.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching album by ID:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      // Return error in the same format as success
      return {
        success: false,
        error: error.response?.data?.message || 'Album non trouvé',
        status: error.response?.status
      };
    }
  },

  // Mettre à jour un album
  updateAlbum: async (id, formData) => {
    console.log('🎵 Updating album with ID:', id, 'and formData:', formData);
    const response = await api.put(`/albums/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Album updated successfully:', response.data);
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
