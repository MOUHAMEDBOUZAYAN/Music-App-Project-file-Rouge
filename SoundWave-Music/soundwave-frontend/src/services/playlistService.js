import api from './api';

class PlaylistService {
  // Get all playlists for current user
  async getUserPlaylists(page = 1, limit = 20) {
    try {
      const response = await api.get('/playlists', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user playlists:', error);
      throw error;
    }
  }

  // Get playlist by ID
  async getPlaylistById(playlistId) {
    try {
      const response = await api.get(`/playlists/${playlistId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist:', error);
      throw error;
    }
  }

  // Create new playlist
  async createPlaylist(playlistData) {
    try {
      const response = await api.post('/playlists', playlistData);
      return response.data;
    } catch (error) {
      console.error('Error creating playlist:', error);
      throw error;
    }
  }

  // Update playlist
  async updatePlaylist(playlistId, playlistData) {
    try {
      const response = await api.put(`/playlists/${playlistId}`, playlistData);
      return response.data;
    } catch (error) {
      console.error('Error updating playlist:', error);
      throw error;
    }
  }

  // Delete playlist
  async deletePlaylist(playlistId) {
    try {
      const response = await api.delete(`/playlists/${playlistId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting playlist:', error);
      throw error;
    }
  }

  // Add song to playlist
  async addSongToPlaylist(playlistId, songId) {
    try {
      const response = await api.post(`/playlists/${playlistId}/songs`, {
        songId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding song to playlist:', error);
      throw error;
    }
  }

  // Remove song from playlist
  async removeSongFromPlaylist(playlistId, songId) {
    try {
      const response = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing song from playlist:', error);
      throw error;
    }
  }

  // Reorder songs in playlist
  async reorderPlaylistSongs(playlistId, songOrder) {
    try {
      const response = await api.put(`/playlists/${playlistId}/songs/reorder`, {
        songOrder
      });
      return response.data;
    } catch (error) {
      console.error('Error reordering playlist songs:', error);
      throw error;
    }
  }

  // Get playlist songs
  async getPlaylistSongs(playlistId, page = 1, limit = 50) {
    try {
      const response = await api.get(`/playlists/${playlistId}/songs`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist songs:', error);
      throw error;
    }
  }

  // Like playlist
  async likePlaylist(playlistId) {
    try {
      const response = await api.post(`/playlists/${playlistId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error liking playlist:', error);
      throw error;
    }
  }

  // Unlike playlist
  async unlikePlaylist(playlistId) {
    try {
      const response = await api.delete(`/playlists/${playlistId}/like`);
      return response.data;
    } catch (error) {
      console.error('Error unliking playlist:', error);
      throw error;
    }
  }

  // Follow playlist
  async followPlaylist(playlistId) {
    try {
      const response = await api.post(`/playlists/${playlistId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Error following playlist:', error);
      throw error;
    }
  }

  // Unfollow playlist
  async unfollowPlaylist(playlistId) {
    try {
      const response = await api.delete(`/playlists/${playlistId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Error unfollowing playlist:', error);
      throw error;
    }
  }

  // Get playlist followers
  async getPlaylistFollowers(playlistId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/playlists/${playlistId}/followers`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist followers:', error);
      throw error;
    }
  }

  // Share playlist
  async sharePlaylist(playlistId, shareData) {
    try {
      const response = await api.post(`/playlists/${playlistId}/share`, shareData);
      return response.data;
    } catch (error) {
      console.error('Error sharing playlist:', error);
      throw error;
    }
  }

  // Get shared playlists
  async getSharedPlaylists(page = 1, limit = 20) {
    try {
      const response = await api.get('/playlists/shared', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching shared playlists:', error);
      throw error;
    }
  }

  // Search playlists
  async searchPlaylists(query, page = 1, limit = 20) {
    try {
      const response = await api.get('/playlists/search', {
        params: { q: query, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching playlists:', error);
      throw error;
    }
  }

  // Get featured playlists
  async getFeaturedPlaylists(page = 1, limit = 20) {
    try {
      const response = await api.get('/playlists/featured', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching featured playlists:', error);
      throw error;
    }
  }

  // Get trending playlists
  async getTrendingPlaylists(page = 1, limit = 20) {
    try {
      const response = await api.get('/playlists/trending', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching trending playlists:', error);
      throw error;
    }
  }

  // Get playlist recommendations
  async getPlaylistRecommendations(playlistId, limit = 10) {
    try {
      const response = await api.get(`/playlists/${playlistId}/recommendations`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist recommendations:', error);
      throw error;
    }
  }

  // Duplicate playlist
  async duplicatePlaylist(playlistId, newName) {
    try {
      const response = await api.post(`/playlists/${playlistId}/duplicate`, {
        name: newName
      });
      return response.data;
    } catch (error) {
      console.error('Error duplicating playlist:', error);
      throw error;
    }
  }

  // Export playlist
  async exportPlaylist(playlistId, format = 'json') {
    try {
      const response = await api.get(`/playlists/${playlistId}/export`, {
        params: { format },
        responseType: format === 'json' ? 'json' : 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting playlist:', error);
      throw error;
    }
  }

  // Import playlist
  async importPlaylist(playlistData) {
    try {
      const response = await api.post('/playlists/import', playlistData);
      return response.data;
    } catch (error) {
      console.error('Error importing playlist:', error);
      throw error;
    }
  }

  // Get playlist analytics
  async getPlaylistAnalytics(playlistId) {
    try {
      const response = await api.get(`/playlists/${playlistId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist analytics:', error);
      throw error;
    }
  }

  // Update playlist cover
  async updatePlaylistCover(playlistId, file) {
    try {
      const formData = new FormData();
      formData.append('cover', file);

      const response = await api.put(`/playlists/${playlistId}/cover`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating playlist cover:', error);
      throw error;
    }
  }

  // Get collaborative playlists
  async getCollaborativePlaylists(page = 1, limit = 20) {
    try {
      const response = await api.get('/playlists/collaborative', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching collaborative playlists:', error);
      throw error;
    }
  }

  // Add collaborator to playlist
  async addCollaborator(playlistId, userId) {
    try {
      const response = await api.post(`/playlists/${playlistId}/collaborators`, {
        userId
      });
      return response.data;
    } catch (error) {
      console.error('Error adding collaborator:', error);
      throw error;
    }
  }

  // Remove collaborator from playlist
  async removeCollaborator(playlistId, userId) {
    try {
      const response = await api.delete(`/playlists/${playlistId}/collaborators/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error removing collaborator:', error);
      throw error;
    }
  }

  // Get playlist collaborators
  async getPlaylistCollaborators(playlistId) {
    try {
      const response = await api.get(`/playlists/${playlistId}/collaborators`);
      return response.data;
    } catch (error) {
      console.error('Error fetching playlist collaborators:', error);
      throw error;
    }
  }

  // Mock data for development/testing
  getMockPlaylists() {
    return [
      {
        id: 1,
        name: 'My Favorites 2024',
        description: 'Best songs of 2024 so far',
        coverUrl: 'https://via.placeholder.com/300/1DB954/FFFFFF?text=MF2024',
        creator: {
          id: 1,
          name: 'John Doe',
          username: 'johndoe'
        },
        songCount: 25,
        duration: 5400, // in seconds
        isPublic: true,
        isCollaborative: false,
        followers: 45,
        likes: 12,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T15:45:00Z'
      },
      {
        id: 2,
        name: 'Workout Mix',
        description: 'High energy songs for the gym',
        coverUrl: 'https://via.placeholder.com/300/FF6B6B/FFFFFF?text=WORKOUT',
        creator: {
          id: 1,
          name: 'John Doe',
          username: 'johndoe'
        },
        songCount: 18,
        duration: 3600,
        isPublic: true,
        isCollaborative: false,
        followers: 23,
        likes: 8,
        createdAt: '2024-01-10T14:20:00Z',
        updatedAt: '2024-01-18T09:15:00Z'
      },
      {
        id: 3,
        name: 'Chill Vibes',
        description: 'Relaxing music for studying',
        coverUrl: 'https://via.placeholder.com/300/4ECDC4/FFFFFF?text=CHILL',
        creator: {
          id: 1,
          name: 'John Doe',
          username: 'johndoe'
        },
        songCount: 32,
        duration: 7200,
        isPublic: false,
        isCollaborative: false,
        followers: 0,
        likes: 0,
        createdAt: '2024-01-05T16:45:00Z',
        updatedAt: '2024-01-19T11:30:00Z'
      }
    ];
  }

  getMockPlaylistSongs() {
    return [
      {
        id: 1,
        title: 'Blinding Lights',
        artist: 'The Weeknd',
        album: 'After Hours',
        duration: 200,
        coverUrl: 'https://via.placeholder.com/48/1DB954/FFFFFF?text=BL',
        addedAt: '2024-01-15T10:30:00Z'
      },
      {
        id: 2,
        title: 'Dance Monkey',
        artist: 'Tones and I',
        album: 'The Kids Are Coming',
        duration: 210,
        coverUrl: 'https://via.placeholder.com/48/1DB954/FFFFFF?text=DM',
        addedAt: '2024-01-15T10:35:00Z'
      },
      {
        id: 3,
        title: 'Shape of You',
        artist: 'Ed Sheeran',
        album: '÷ (Divide)',
        duration: 235,
        coverUrl: 'https://via.placeholder.com/48/1DB954/FFFFFF?text=SOY',
        addedAt: '2024-01-15T10:40:00Z'
      }
    ];
  }
}

export default new PlaylistService(); 