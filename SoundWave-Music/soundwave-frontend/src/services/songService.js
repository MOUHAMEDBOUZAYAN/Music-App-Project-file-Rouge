import api from './api';

const songService = {
  // Uploader une chanson
  uploadSong: async (formData) => {
    console.log('🎵 Uploading song with formData:', formData);
    const response = await api.post('/songs', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Song uploaded successfully:', response.data);
    return response.data;
  },

  // Obtenir toutes les chansons
  getAllSongs: async (params = {}) => {
    const response = await api.get('/songs/all', { params });
    return response.data;
  },

  // Rechercher des chansons
  searchSongs: async (params = {}) => {
    try {
      console.log('🔍 Searching songs with params:', params);
      const response = await api.get('/search/songs', { params });
      console.log('🔍 Songs search response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error searching songs:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la recherche de chansons'
      };
    }
  },

  // Obtenir les chansons de l'utilisateur connecté
  getUserSongs: async (params = {}) => {
    const response = await api.get('/songs/user', { params });
    return response.data;
  },

  // Supprimer une chanson
  deleteSong: async (songId) => {
    const response = await api.delete(`/songs/${songId}`);
    return response.data;
  },

  // Obtenir les chansons tendance
  getTrendingSongs: async (params = {}) => {
    const response = await api.get('/songs/trending', { params });
    return response.data;
  },

  // Obtenir les chansons likées
  getLikedSongs: async () => {
    console.log('🔍 getLikedSongs API call starting...');
    const response = await api.get('/songs/liked');
    console.log('🔍 getLikedSongs API response:', response);
    console.log('🔍 getLikedSongs response.data:', response.data);
    console.log('🔍 getLikedSongs response.data.success:', response.data?.success);
    console.log('🔍 getLikedSongs response.data.data:', response.data?.data);
    console.log('🔍 getLikedSongs response.data.data length:', Array.isArray(response.data?.data) ? response.data.data.length : 'Not an array');
    if (Array.isArray(response.data?.data) && response.data.data.length > 0) {
      console.log('🔍 First liked song from API:', response.data.data[0]);
    }
    return response.data;
  },

  // Rechercher des chansons (fonction alternative)
  searchSongsByQuery: async (query, params = {}) => {
    console.log('🔍 songService.searchSongsByQuery called with:', query);
    const response = await api.get('/search/songs', { 
      params: { q: query, ...params } 
    });
    console.log('🔍 songService response:', response.data);
    return response.data;
  },

  // Obtenir une chanson par ID
  getSongById: async (id) => {
    console.log('🎵 Fetching song by ID:', id);
    console.log('🎵 Song ID type:', typeof id);
    console.log('🎵 Song ID length:', id?.length);
    
    try {
      const response = await api.get(`/songs/${id}`);
      console.log('🎵 Song API response:', response.data);
      console.log('🎵 Song API response success:', response.data?.success);
      console.log('🎵 Song API response data:', response.data?.data);
      return response.data;
    } catch (error) {
      console.error('❌ Error fetching song by ID:', error);
      console.error('❌ Error response:', error.response);
      console.error('❌ Error status:', error.response?.status);
      console.error('❌ Error data:', error.response?.data);
      
      // Return error in the same format as success
      return {
        success: false,
        error: error.response?.data?.message || 'Chanson non trouvée',
        status: error.response?.status
      };
    }
  },

  // Mettre à jour une chanson
  updateSong: async (id, data) => {
    console.log('🔄 Updating song with ID:', id);
    console.log('🔄 Update data:', data);
    const response = await api.put(`/songs/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('✅ Song updated successfully:', response.data);
    return response.data;
  },

  // Supprimer une chanson
  deleteSong: async (id) => {
    const response = await api.delete(`/songs/${id}`);
    return response.data;
  },

  // Aimer/ne plus aimer une chanson
  likeSong: async (id) => {
    const response = await api.post(`/songs/${id}/like`);
    return response.data;
  },

  // Ajouter un commentaire
  addComment: async (id, content) => {
    const response = await api.post(`/songs/${id}/comment`, { content });
    return response.data;
  },

  // Obtenir les chansons d'un artiste spécifique
  getSongsByArtist: async (artistId, params = {}) => {
    try {
      console.log('🎵 Getting songs for artist:', artistId);
      const response = await api.get(`/songs/artist/${artistId}`, { params });
      console.log('🎵 Songs by artist response:', response.data);
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('❌ Error getting songs by artist:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erreur lors de la récupération des chansons de l\'artiste',
        data: []
      };
    }
  },
};

export { songService };