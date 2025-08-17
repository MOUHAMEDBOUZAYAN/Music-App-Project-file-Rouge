import api from './api';

class SpotifyService {
  constructor() {
    this.retryCount = 0;
    this.maxRetries = 3;
    this.retryDelay = 1000; // 1 seconde
  }

  // Méthode utilitaire pour gérer les retry
  async retryRequest(requestFn, maxRetries = this.maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      if (this.retryCount < maxRetries && this.isRetryableError(error)) {
        this.retryCount++;
        await this.delay(this.retryDelay * this.retryCount);
        return this.retryRequest(requestFn, maxRetries);
      }
      this.retryCount = 0;
      throw error;
    }
  }

  // Vérifier si l'erreur est récupérable
  isRetryableError(error) {
    return error.response?.status >= 500 || error.code === 'ECONNRESET';
  }

  // Délai entre les tentatives
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Authentification Spotify
  async login() {
    try {
      const response = await api.get('/api/auth/spotify/login');
      return response.data;
    } catch (error) {
      console.error('Erreur de connexion Spotify:', error);
      throw new Error('Erreur lors de la connexion Spotify');
    }
  }

  async handleCallback(code) {
    try {
      const response = await api.get(`/api/auth/spotify/callback?code=${code}`);
      return response.data;
    } catch (error) {
      console.error('Erreur callback Spotify:', error);
      throw new Error('Erreur lors de la gestion du callback Spotify');
    }
  }

  async refreshToken(refreshToken) {
    try {
      const response = await api.post('/api/auth/spotify/refresh', { refresh_token: refreshToken });
      return response.data;
    } catch (error) {
      console.error('Erreur refresh token:', error);
      throw new Error('Erreur lors du rafraîchissement du token');
    }
  }

  // Profil utilisateur
  async getProfile() {
    try {
      const response = await api.get('/api/spotify/me');
      return response.data;
    } catch (error) {
      console.error('Erreur profil utilisateur:', error);
      throw new Error('Erreur lors de la récupération du profil');
    }
  }

  // Recherche
  async search(query, type = 'track,artist,album,playlist', limit = 20, offset = 0) {
    try {
      const response = await api.get('/api/spotify/search', {
        params: { q: query, type, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur recherche:', error);
      throw new Error('Erreur lors de la recherche');
    }
  }

  // Playlists
  async getUserPlaylists(limit = 20, offset = 0) {
    try {
      const response = await api.get('/api/spotify/playlists', {
        params: { limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur playlists utilisateur:', error);
      throw new Error('Erreur lors de la récupération des playlists');
    }
  }

  async getPlaylist(id) {
    try {
      const response = await api.get(`/api/spotify/playlist/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur playlist:', error);
      throw new Error('Erreur lors de la récupération de la playlist');
    }
  }

  // Albums
  async getAlbum(id) {
    try {
      const response = await api.get(`/api/spotify/album/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur album:', error);
      throw new Error('Erreur lors de la récupération de l\'album');
    }
  }

  // Artistes
  async getArtist(id) {
    try {
      const response = await api.get(`/api/spotify/artist/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur artiste:', error);
      throw new Error('Erreur lors de la récupération de l\'artiste');
    }
  }

  async getArtistTopTracks(id, market = 'FR') {
    try {
      const response = await api.get(`/api/spotify/artist/${id}/top-tracks`, {
        params: { market }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur top tracks artiste:', error);
      throw new Error('Erreur lors de la récupération des top tracks');
    }
  }

  async getArtistAlbums(id, includeGroups = 'album,single', limit = 20, offset = 0) {
    try {
      const response = await api.get(`/api/spotify/artist/${id}/albums`, {
        params: { include_groups: includeGroups, limit, offset }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur albums artiste:', error);
      throw new Error('Erreur lors de la récupération des albums');
    }
  }

  // Recommandations
  async getRecommendations(seedArtists, seedGenres, seedTracks, limit = 20, market = 'FR') {
    try {
      const response = await api.get('/api/spotify/recommendations', {
        params: { 
          seed_artists: seedArtists?.join(','), 
          seed_genres: seedGenres?.join(','), 
          seed_tracks: seedTracks?.join(','), 
          limit, 
          market 
        }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur recommandations:', error);
      throw new Error('Erreur lors de la récupération des recommandations');
    }
  }

  // Nouvelles sorties
  async getNewReleases(limit = 20, offset = 0, country = 'FR') {
    try {
      const response = await api.get('/api/spotify/new-releases', {
        params: { limit, offset, country }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur nouvelles sorties:', error);
      throw new Error('Erreur lors de la récupération des nouvelles sorties');
    }
  }

  // Playlists en vedette
  async getFeaturedPlaylists(limit = 20, offset = 0, country = 'FR') {
    try {
      const response = await api.get('/api/spotify/featured-playlists', {
        params: { limit, offset, country }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur playlists en vedette:', error);
      throw new Error('Erreur lors de la récupération des playlists en vedette');
    }
  }

  // Catégories
  async getCategories(limit = 20, offset = 0, country = 'FR') {
    try {
      const response = await api.get('/api/spotify/categories', {
        params: { limit, offset, country }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur catégories:', error);
      throw new Error('Erreur lors de la récupération des catégories');
    }
  }

  async getCategoryPlaylists(categoryId, limit = 20, offset = 0, country = 'FR') {
    try {
      const response = await api.get(`/api/spotify/category/${categoryId}/playlists`, {
        params: { limit, offset, country }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur playlists catégorie:', error);
      throw new Error('Erreur lors de la récupération des playlists de catégorie');
    }
  }

  // Méthodes utilitaires
  formatDuration(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  formatNumber(num) {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  }

  getSmallestImage(images) {
    if (!images || images.length === 0) return null;
    return images.reduce((smallest, image) => {
      return (image.height < smallest.height) ? image : smallest;
    });
  }

  getLargestImage(images) {
    if (!images || images.length === 0) return null;
    return images.reduce((largest, image) => {
      return (image.height > largest.height) ? image : largest;
    });
  }
}

export default new SpotifyService();
