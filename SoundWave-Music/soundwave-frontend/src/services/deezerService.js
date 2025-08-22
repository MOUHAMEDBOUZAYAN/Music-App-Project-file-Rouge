// Deezer API Service - Utilise le backend comme proxy pour éviter les erreurs CORS
const BACKEND_API = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const DeezerService = {
  // Appel API via le backend
  async call(endpoint) {
    try {
      console.log(`🔄 Appel Deezer via backend: ${BACKEND_API}/api/deezer${endpoint}`);
      const response = await fetch(`${BACKEND_API}/api/deezer${endpoint}`);
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      const result = await response.json();
      console.log(`✅ Réponse Deezer reçue:`, result);
      return result.data || result;
    } catch (error) {
      console.error('❌ Erreur Deezer via backend:', error);
      throw error;
    }
  },

  // Recherche
  async search(query, limit = 20) {
    const data = await this.call(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);
    return { data };
  },

  // Nouvelles sorties
  async getNewReleases(limit = 20) {
    const data = await this.call(`/chart/tracks?limit=${limit}`);
    return { data };
  },

  // Playlists populaires
  async getFeaturedPlaylists(limit = 20) {
    const data = await this.call(`/chart/playlists?limit=${limit}`);
    return { data };
  },

  // Albums populaires
  async getPopularAlbums(limit = 20) {
    const data = await this.call(`/chart/albums?limit=${limit}`);
    return { data };
  },

  // Artistes populaires
  async getPopularArtists(limit = 20) {
    const data = await this.call(`/chart/artists?limit=${limit}`);
    return { data };
  },

  // Album par ID
  async getAlbum(id) {
    const data = await this.call(`/album/${id}`);
    return { data };
  },

  // Artiste par ID
  async getArtist(id) {
    const data = await this.call(`/artist/${id}`);
    return { data };
  },

  // Top tracks d'un artiste
  async getArtistTopTracks(id) {
    const data = await this.call(`/artist/${id}/top`);
    return { data };
  },

  // Playlist par ID
  async getPlaylist(id) {
    const data = await this.call(`/playlist/${id}`);
    return { data };
  },

  // Genres
  async getGenres() {
    const data = await this.call('/genre');
    return { data };
  }
};

export default DeezerService;
