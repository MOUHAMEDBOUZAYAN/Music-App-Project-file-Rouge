// Auth service will be implemented here 
import { apiClient, endpoints } from './api.js';
import { secureStorage } from '../utils/helpers.js';

export const authService = {
  // Connexion utilisateur
  login: async (credentials) => {
    try {
      const response = await apiClient.post(endpoints.auth.login, {
        email: credentials.email,
        password: credentials.password
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la connexion'
      };
    }
  },

  // Inscription utilisateur
  register: async (userData) => {
    try {
      const response = await apiClient.post(endpoints.auth.register, {
        email: userData.email,
        password: userData.password,
        username: userData.username,
        role: userData.role || 'listener',
        firstName: userData.firstName,
        lastName: userData.lastName
      });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'inscription'
      };
    }
  },

  // Déconnexion
  logout: async () => {
    try {
      await apiClient.post(endpoints.auth.logout);
      
      // Nettoyage du stockage local
      secureStorage.remove('authToken');
      secureStorage.remove('user');
      
      return { success: true };
    } catch (error) {
      // Même en cas d'erreur, on nettoie le stockage local
      secureStorage.remove('authToken');
      secureStorage.remove('user');
      
      return {
        success: false,
        error: error.message || 'Erreur lors de la déconnexion'
      };
    }
  },

  // Rafraîchissement du token
  refreshToken: async () => {
    try {
      const refreshToken = secureStorage.get('refreshToken');
      
      if (!refreshToken) {
        throw new Error('Aucun token de rafraîchissement trouvé');
      }
      
      const response = await apiClient.post(endpoints.auth.refresh, {
        refreshToken
      });
      
      // Mise à jour des tokens
      secureStorage.set('authToken', response.data.token);
      if (response.data.refreshToken) {
        secureStorage.set('refreshToken', response.data.refreshToken);
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du rafraîchissement du token'
      };
    }
  },

  // Mot de passe oublié
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post(endpoints.auth.forgotPassword, {
        email
      });
      
      return {
        success: true,
        message: response.message || 'Email de récupération envoyé'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'envoi de l\'email'
      };
    }
  },

  // Réinitialisation du mot de passe
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiClient.post(endpoints.auth.resetPassword, {
        token,
        password: newPassword
      });
      
      return {
        success: true,
        message: response.message || 'Mot de passe réinitialisé avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la réinitialisation'
      };
    }
  },

  // Vérification d'email
  verifyEmail: async (token) => {
    try {
      const response = await apiClient.post(endpoints.auth.verifyEmail, {
        token
      });
      
      return {
        success: true,
        message: response.message || 'Email vérifié avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la vérification'
      };
    }
  },

  // Vérification de la validité du token
  validateToken: async () => {
    try {
      const token = secureStorage.get('authToken');
      
      if (!token) {
        return { success: false, error: 'Aucun token trouvé' };
      }
      
      // Vérification avec le serveur
      const response = await apiClient.get(endpoints.users.profile);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      // Token invalide ou expiré
      secureStorage.remove('authToken');
      secureStorage.remove('user');
      
      return {
        success: false,
        error: 'Token invalide ou expiré'
      };
    }
  },

  // Changement de mot de passe (utilisateur connecté)
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword
      });
      
      return {
        success: true,
        message: response.message || 'Mot de passe modifié avec succès'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du changement de mot de passe'
      };
    }
  },

  // Vérification de la disponibilité d'un nom d'utilisateur
  checkUsernameAvailability: async (username) => {
    try {
      const response = await apiClient.get(`/auth/check-username/${username}`);
      
      return {
        success: true,
        available: response.available
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la vérification'
      };
    }
  },

  // Vérification de la disponibilité d'un email
  checkEmailAvailability: async (email) => {
    try {
      const response = await apiClient.get(`/auth/check-email/${email}`);
      
      return {
        success: true,
        available: response.available
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la vérification'
      };
    }
  }
};