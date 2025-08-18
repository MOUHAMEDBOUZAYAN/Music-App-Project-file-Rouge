import { apiClient, endpoints } from './api.js';

export const musicDataService = {
  // Récupérer les albums populaires
  getPopularAlbums: async (limit = 20) => {
    try {
      const response = await apiClient.get(endpoints.songs.getAll, {
        params: {
          limit,
          sort: 'popularity',
          order: 'desc'
        }
      });
      
      // Grouper par album et calculer la popularité
      const albumsMap = new Map();
      
      response.data.forEach(song => {
        if (song.album) {
          const albumId = song.album._id || song.album.id;
          if (!albumsMap.has(albumId)) {
            albumsMap.set(albumId, {
              id: albumId,
              title: song.album.title || song.album.name,
              artist: song.album.artist?.name || song.artist?.name || 'Artiste inconnu',
              cover: song.album.cover || song.album.artwork || song.cover,
              genre: song.genre || 'Pop',
              popularity: 0,
              songCount: 0
            });
          }
          
          const album = albumsMap.get(albumId);
          album.popularity += song.playCount || 0;
          album.songCount += 1;
        }
      });
      
      // Trier par popularité et retourner les albums
      const popularAlbums = Array.from(albumsMap.values())
        .sort((a, b) => b.popularity - a.popularity)
        .slice(0, limit);
      
      return {
        success: true,
        data: popularAlbums
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des albums populaires:', error);
      return {
        success: false,
        error: 'Impossible de récupérer les albums populaires',
        data: []
      };
    }
  },

  // Récupérer les chansons populaires
  getPopularSongs: async (limit = 20) => {
    try {
      const response = await apiClient.get(endpoints.songs.trending, {
        params: { limit }
      });
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des chansons populaires:', error);
      return {
        success: false,
        error: 'Impossible de récupérer les chansons populaires',
        data: []
      };
    }
  },

  // Récupérer les nouvelles sorties
  getNewReleases: async (limit = 20) => {
    try {
      const response = await apiClient.get(endpoints.songs.getAll, {
        params: {
          limit,
          sort: 'releaseDate',
          order: 'desc'
        }
      });
      
      // Filtrer et formater les nouvelles sorties
      const newReleases = response.data
        .filter(song => song.releaseDate || song.createdAt)
        .map(song => ({
          id: song._id || song.id,
          title: song.title || song.name,
          artist: song.artist?.name || 'Artiste inconnu',
          cover: song.cover || song.artwork,
          genre: song.genre || 'Pop',
          releaseDate: song.releaseDate || song.createdAt
        }))
        .slice(0, limit);
      
      return {
        success: true,
        data: newReleases
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des nouvelles sorties:', error);
      return {
        success: false,
        error: 'Impossible de récupérer les nouvelles sorties',
        data: []
      };
    }
  },

  // Récupérer les genres musicaux
  getMusicGenres: async () => {
    try {
      // Essayer de récupérer les genres depuis l'API
      const response = await apiClient.get(endpoints.songs.getAll);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      // Fallback: utiliser les genres par défaut avec des couleurs
      const defaultGenres = [
        { name: 'Pop', color: 'bg-pink-500', path: '/genre/pop' },
        { name: 'Rock', color: 'bg-red-600', path: '/genre/rock' },
        { name: 'Hip-Hop', color: 'bg-yellow-600', path: '/genre/hip-hop' },
        { name: 'R&B', color: 'bg-purple-600', path: '/genre/rnb' },
        { name: 'Jazz', color: 'bg-indigo-600', path: '/genre/jazz' },
        { name: 'Classical', color: 'bg-gray-600', path: '/genre/classical' },
        { name: 'Electronic', color: 'bg-blue-500', path: '/genre/electronic' },
        { name: 'Country', color: 'bg-green-600', path: '/genre/country' },
        { name: 'Reggae', color: 'bg-orange-500', path: '/genre/reggae' },
        { name: 'Blues', color: 'bg-blue-800', path: '/genre/blues' },
        { name: 'Folk', color: 'bg-teal-600', path: '/genre/folk' },
        { name: 'Alternative', color: 'bg-purple-800', path: '/genre/alternative' },
        { name: 'Indie', color: 'bg-pink-600', path: '/genre/indie' },
        { name: 'Funk', color: 'bg-yellow-500', path: '/genre/funk' },
        { name: 'Soul', color: 'bg-red-500', path: '/genre/soul' },
        { name: 'Disco', color: 'bg-purple-500', path: '/genre/disco' }
      ];
      
      return {
        success: true,
        data: defaultGenres
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des genres:', error);
      
      // Fallback: genres par défaut
      const fallbackGenres = [
        { name: 'Pop', color: 'bg-pink-500', path: '/genre/pop' },
        { name: 'Rock', color: 'bg-red-600', path: '/genre/rock' },
        { name: 'Hip-Hop', color: 'bg-yellow-600', path: '/genre/hip-hop' },
        { name: 'R&B', color: 'bg-purple-600', path: '/genre/rnb' },
        { name: 'Jazz', color: 'bg-indigo-600', path: '/genre/jazz' },
        { name: 'Classical', color: 'bg-gray-600', path: '/genre/classical' },
        { name: 'Electronic', color: 'bg-blue-500', path: '/genre/electronic' },
        { name: 'Country', color: 'bg-green-600', path: '/genre/country' },
        { name: 'Reggae', color: 'bg-orange-500', path: '/genre/reggae' },
        { name: 'Blues', color: 'bg-blue-800', path: '/genre/blues' },
        { name: 'Folk', color: 'bg-teal-600', path: '/genre/folk' },
        { name: 'Alternative', color: 'bg-purple-800', path: '/genre/alternative' },
        { name: 'Indie', color: 'bg-pink-600', path: '/genre/indie' },
        { name: 'Funk', color: 'bg-yellow-500', path: '/genre/funk' },
        { name: 'Soul', color: 'bg-red-500', path: '/genre/soul' },
        { name: 'Disco', color: 'bg-purple-500', path: '/genre/disco' }
      ];
      
      return {
        success: true,
        data: fallbackGenres
      };
    }
  },

  // Rechercher de la musique
  searchMusic: async (query, type = 'all', limit = 20) => {
    try {
      const response = await apiClient.get(endpoints.search.global, {
        params: {
          q: query,
          type,
          limit
        }
      });
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return {
        success: false,
        error: 'Erreur lors de la recherche',
        data: []
      };
    }
  },

  // Récupérer les recommandations
  getRecommendations: async (userId = null, limit = 20) => {
    try {
      const params = { limit };
      if (userId) {
        params.userId = userId;
      }
      
      const response = await apiClient.get(endpoints.songs.recommendations, { params });
      
      return {
        success: true,
        data: response.data || []
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des recommandations:', error);
      return {
        success: false,
        error: 'Impossible de récupérer les recommandations',
        data: []
      };
    }
  },

  // Récupérer les artistes populaires
  getPopularArtists: async (limit = 10) => {
    try {
      console.log('🎵 Récupération des artistes populaires...');
      const response = await apiClient.get(endpoints.artists.popular, {
        params: { limit }
      });
      
      console.log('✅ Artistes populaires récupérés:', response);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: 'Format de réponse invalide',
        data: []
      };
    } catch (error) {
      console.error('💥 Erreur lors de la récupération des artistes populaires:', error);
      return {
        success: false,
        error: 'Impossible de récupérer les artistes populaires',
        data: []
      };
    }
  },

  // Récupérer les playlists recommandées
  getRecommendedPlaylists: async (limit = 10) => {
    try {
      console.log('🎵 Récupération des playlists recommandées...');
      const response = await apiClient.get(endpoints.playlists.getAll, {
        params: { limit }
      });
      
      console.log('✅ Playlists recommandées récupérées:', response);
      
      if (response.success && response.data) {
        return {
          success: true,
          data: response.data
        };
      }
      
      return {
        success: false,
        error: 'Format de réponse invalide',
        data: []
      };
    } catch (error) {
      console.error('💥 Erreur lors de la récupération des playlists recommandées:', error);
      return {
        success: false,
        error: 'Impossible de récupérer les playlists recommandées',
        data: []
      };
    }
  }
};

export default musicDataService;
