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
      
      // Si la connexion réussit, sauvegarder les données
      if (response.data.success) {
        secureStorage.set('authToken', response.data.token);
        secureStorage.set('user', JSON.stringify(response.data.user));
      }
      
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
      console.log('Envoi des données d\'inscription:', userData);
      
      const response = await apiClient.post(endpoints.auth.register, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        confirmPassword: userData.confirmPassword,
        userType: userData.userType || 'listener'
      });
      
      console.log('Réponse du serveur:', response.data);
      
      // Si l'inscription réussit, sauvegarder les données
      if (response.data.success) {
        secureStorage.set('authToken', response.data.token);
        secureStorage.set('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Erreur lors de l\'inscription'
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

  // Vérification de l'authentification
  isAuthenticated: () => {
    const token = secureStorage.get('authToken');
    const user = secureStorage.get('user');
    return !!(token && user);
  },

  // Récupération des données utilisateur
  getCurrentUser: () => {
    const user = secureStorage.get('user');
    return user ? JSON.parse(user) : null;
  },

  // Mise à jour du profil utilisateur
  updateProfile: async (profileData) => {
    try {
      const response = await apiClient.put(endpoints.users.update, profileData);
      
      // Mettre à jour les données utilisateur en local
      if (response.data.success) {
        secureStorage.set('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du profil'
      };
    }
  },

  // Changement de mot de passe
  changePassword: async (passwordData) => {
    try {
      const response = await apiClient.put(endpoints.auth.changePassword, passwordData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors du changement de mot de passe'
      };
    }
  },

  // Demande de réinitialisation de mot de passe
  forgotPassword: async (email) => {
    try {
      const response = await apiClient.post(endpoints.auth.forgotPassword, { email });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la demande de réinitialisation'
      };
    }
  },

  // Réinitialisation de mot de passe
  resetPassword: async (resetData) => {
    try {
      const response = await apiClient.post(endpoints.auth.resetPassword, resetData);
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la réinitialisation du mot de passe'
      };
    }
  },

  // Vérification d'email
  verifyEmail: async (token) => {
    try {
      const response = await apiClient.post(endpoints.auth.verifyEmail, { token });
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Erreur lors de la vérification de l\'email'
      };
    }
  }
};