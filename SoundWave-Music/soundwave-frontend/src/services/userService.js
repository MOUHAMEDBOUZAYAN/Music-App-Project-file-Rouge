import api from './api';

class UserService {
  // Get current user profile
  async getCurrentUser() {
    try {
      const response = await api.get('/api/users/me');
      return response.data;
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }

  // Get user profile by ID
  async getUserById(userId) {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Update user profile
  async updateProfile(userData) {
    try {
      const response = await api.put('/api/users/profile', userData);
      return response.data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  // Update user avatar
  async updateAvatar(file) {
    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.put('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error updating avatar:', error);
      throw error;
    }
  }

  // Change password
  async changePassword(passwordData) {
    try {
      const response = await api.put('/users/password', passwordData);
      return response.data;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  // Delete user account
  async deleteAccount() {
    try {
      const response = await api.delete('/users/account');
      return response.data;
    } catch (error) {
      console.error('Error deleting account:', error);
      throw error;
    }
  }

  // Follow user
  async followUser(userId) {
    try {
      const response = await api.post(`/api/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Error following user:', error);
      throw error;
    }
  }

  // Unfollow user
  async unfollowUser(userId) {
    try {
      // Backend utilise un POST toggle sur le même endpoint
      const response = await api.post(`/api/users/${userId}/follow`);
      return response.data;
    } catch (error) {
      console.error('Error unfollowing user:', error);
      throw error;
    }
  }

  // Get user followers
  async getUserFollowers(userId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/api/users/${userId}/followers`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching followers:', error);
      throw error;
    }
  }

  // Get user following
  async getUserFollowing(userId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/api/users/${userId}/following`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching following:', error);
      throw error;
    }
  }

  // Get user playlists
  async getUserPlaylists(userId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/users/${userId}/playlists`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user playlists:', error);
      throw error;
    }
  }

  // Get user liked songs
  async getUserLikedSongs(userId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/users/${userId}/liked-songs`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching liked songs:', error);
      throw error;
    }
  }

  // Get user recently played
  async getUserRecentlyPlayed(userId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/users/${userId}/recently-played`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recently played:', error);
      throw error;
    }
  }

  // Search users
  async searchUsers(query, page = 1, limit = 20) {
    try {
      const response = await api.get('/users/search', {
        params: { q: query, page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats(userId) {
    try {
      const response = await api.get(`/users/${userId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Get user activity feed
  async getUserActivity(userId, page = 1, limit = 20) {
    try {
      const response = await api.get(`/users/${userId}/activity`, {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching user activity:', error);
      throw error;
    }
  }

  // Block user
  async blockUser(userId) {
    try {
      const response = await api.post(`/users/${userId}/block`);
      return response.data;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  // Unblock user
  async unblockUser(userId) {
    try {
      const response = await api.delete(`/users/${userId}/block`);
      return response.data;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  }

  // Get blocked users
  async getBlockedUsers(page = 1, limit = 20) {
    try {
      const response = await api.get('/users/blocked', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      throw error;
    }
  }

  // Update user preferences
  async updatePreferences(preferences) {
    try {
      const response = await api.put('/users/preferences', preferences);
      return response.data;
    } catch (error) {
      console.error('Error updating preferences:', error);
      throw error;
    }
  }

  // Get user preferences
  async getUserPreferences() {
    try {
      const response = await api.get('/users/preferences');
      return response.data;
    } catch (error) {
      console.error('Error fetching preferences:', error);
      throw error;
    }
  }

  // Verify email
  async verifyEmail(token) {
    try {
      const response = await api.post('/users/verify-email', { token });
      return response.data;
    } catch (error) {
      console.error('Error verifying email:', error);
      throw error;
    }
  }

  // Resend verification email
  async resendVerificationEmail() {
    try {
      const response = await api.post('/users/resend-verification');
      return response.data;
    } catch (error) {
      console.error('Error resending verification email:', error);
      throw error;
    }
  }

  // Get user notifications
  async getUserNotifications(page = 1, limit = 20) {
    try {
      const response = await api.get('/users/notifications', {
        params: { page, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  // Mark notification as read
  async markNotificationAsRead(notificationId) {
    try {
      const response = await api.put(`/users/notifications/${notificationId}/read`);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  // Mark all notifications as read
  async markAllNotificationsAsRead() {
    try {
      const response = await api.put('/users/notifications/read-all');
      return response.data;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  // Delete notification
  async deleteNotification(notificationId) {
    try {
      const response = await api.delete(`/users/notifications/${notificationId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }

  // Get user recommendations
  async getUserRecommendations(userId, type = 'songs', limit = 20) {
    try {
      const response = await api.get(`/users/${userId}/recommendations`, {
        params: { type, limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      throw error;
    }
  }

  // Export user data
  async exportUserData() {
    try {
      const response = await api.get('/users/export-data', {
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting user data:', error);
      throw error;
    }
  }

  // Mock data for development/testing
  getMockUser() {
    return {
      id: 1,
      username: 'johndoe',
      email: 'john.doe@example.com',
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://via.placeholder.com/150/1DB954/FFFFFF?text=JD',
      bio: 'Music lover and aspiring artist',
      location: 'New York, NY',
      role: 'listener',
      isVerified: true,
      isArtist: false,
      followers: 234,
      following: 156,
      playlists: 12,
      likedSongs: 89,
      createdAt: '2023-01-15T10:30:00Z',
      lastActive: '2024-01-20T15:45:00Z'
    };
  }

  getMockUserStats() {
    return {
      totalStreams: 125000,
      monthlyListeners: 4500,
      totalPlayTime: 1250000, // in seconds
      favoriteGenres: ['Pop', 'Rock', 'Electronic'],
      topArtists: ['The Weeknd', 'Ed Sheeran', 'Taylor Swift'],
      listeningHours: 347,
      averageSessionLength: 25 // in minutes
    };
  }
}

export default new UserService(); 