// AuthContext will be implemented here 
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { secureStorage } from '../utils/helpers.js';
import { USER_ROLES } from '../utils/constants.js';

// État initial
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Types d'actions
const AuthActionTypes = {
  LOGIN_START: 'LOGIN_START',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAILURE: 'LOGIN_FAILURE',
  LOGOUT: 'LOGOUT',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_LOADING: 'SET_LOADING'
};

// Reducer pour la gestion des états
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.LOGIN_START:
      return {
        ...state,
        isLoading: true,
        error: null
      };
      
    case AuthActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
      
    case AuthActionTypes.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
      
    case AuthActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null
      };
      
    case AuthActionTypes.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
      
    case AuthActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    case AuthActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    default:
      return state;
  }
};

// Création du contexte
const AuthContext = createContext();

// Provider du contexte
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Vérification de l'authentification au chargement
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Nettoyer le localStorage au démarrage
        const cleanedCount = secureStorage.cleanup();
        if (cleanedCount > 0) {
          console.log(`🧹 Nettoyage du localStorage: ${cleanedCount} éléments supprimés`);
        }
        
        const token = secureStorage.get('authToken');
        let user = secureStorage.get('user');
        
        // Nettoyer le token des guillemets supplémentaires
        if (token && typeof token === 'string') {
          const cleanedToken = token.replace(/^["']|["']$/g, '');
          if (cleanedToken !== token) {
            console.log('🧹 Token nettoyé des guillemets supplémentaires');
            console.log('🔑 Token original:', token.substring(0, 20) + '...');
            console.log('🔑 Token nettoyé:', cleanedToken.substring(0, 20) + '...');
            console.log('🔑 Token identique:', cleanedToken === token);
            console.log('🔑 Token length original:', token.length);
            console.log('🔑 Token length nettoyé:', cleanedToken.length);
            console.log('🔑 Token starts with quote:', token.startsWith('"') || token.startsWith("'"));
            console.log('🔑 Token ends with quote:', token.endsWith('"') || token.endsWith("'"));
            console.log('🔑 Token first char:', token.charAt(0));
            console.log('🔑 Token last char:', token.charAt(token.length - 1));
            console.log('🔑 Token first char code:', token.charCodeAt(0));
            console.log('🔑 Token last char code:', token.charCodeAt(token.length - 1));
            secureStorage.set('authToken', cleanedToken);
            token = cleanedToken; // Utiliser le token nettoyé
          } else {
            console.log('🔑 Token déjà propre:', token.substring(0, 20) + '...');
          }
        }
        
        // Corriger les anciens formats (double JSON encodé)
        if (user && typeof user === 'string') {
          try {
            const reparsed = JSON.parse(user);
            if (reparsed && typeof reparsed === 'object') {
              user = reparsed;
              secureStorage.set('user', user); // normaliser le stockage
            }
          } catch (_) {
            // valeur inutilisable, on la nettoie
            secureStorage.remove('user');
            user = null;
          }
        }
        
        // Vérifier que les données sont valides
        if (token && user && typeof user === 'object' && user._id) {
          console.log('✅ Authentification trouvée:', { user: user.username, token: token.substring(0, 20) + '...' });
          dispatch({
            type: AuthActionTypes.LOGIN_SUCCESS,
            payload: { token, user }
          });
        } else {
          console.log('ℹ️ Aucune authentification valide trouvée');
          console.log('🔍 Token exists:', !!token);
          console.log('🔍 User exists:', !!user);
          console.log('🔍 User type:', typeof user);
          console.log('🔍 User has _id:', user && user._id);
          // Nettoyer les données invalides minimales
          if (token && !user) secureStorage.remove('authToken');
          if (user && !token) secureStorage.remove('user');
          dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('❌ Erreur lors de la vérification de l\'authentification:', error);
        // Nettoyer les données corrompues
        secureStorage.remove('authToken');
        secureStorage.remove('user');
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Actions
  const login = async (userData) => {
    dispatch({ type: AuthActionTypes.LOGIN_START });
    
    try {
      console.log('🔐 Données reçues dans AuthContext:', userData);
      
      // Vérifier la structure des données
      let user, token;
      
      if (userData.data) {
        // Structure: { data: { user, token } }
        user = userData.data.user;
        token = userData.data.token;
        console.log('✅ Structure data détectée:', { user, token });
      } else if (userData.user && userData.token) {
        // Structure: { user, token }
        user = userData.user;
        token = userData.token;
        console.log('✅ Structure directe détectée:', { user, token });
      } else if (userData.success && userData.data) {
        // Structure: { success: true, data: { user, token } }
        user = userData.data.user;
        token = userData.data.token;
        console.log('✅ Structure success détectée:', { user, token });
      } else {
        console.error('❌ Structure de données invalide:', userData);
        throw new Error('Structure de données invalide pour la connexion');
      }
      
      // Vérifier que les données nécessaires existent
      if (!user || !token) {
        console.error('❌ Données manquantes:', { user: !!user, token: !!token });
        throw new Error('Données utilisateur ou token manquantes');
      }
      
      console.log('✅ Données validées, sauvegarde en cours...');
      
      // Nettoyer le token des guillemets supplémentaires
      const cleanedToken = token.replace(/^["']|["']$/g, '');
      
      // Sauvegarde dans le localStorage
      const tokenSaved = secureStorage.set('authToken', cleanedToken);
      const userSaved = secureStorage.set('user', user);
      
      console.log('🔑 Token original:', token.substring(0, 20) + '...');
      console.log('🔑 Token nettoyé:', cleanedToken.substring(0, 20) + '...');
      console.log('🔑 Token sauvegardé:', cleanedToken.substring(0, 20) + '...');
      console.log('🔑 Token identique:', cleanedToken === token);
      console.log('🔑 Token length original:', token.length);
      console.log('🔑 Token length nettoyé:', cleanedToken.length);
      console.log('🔑 Token starts with quote:', token.startsWith('"') || token.startsWith("'"));
      console.log('🔑 Token ends with quote:', token.endsWith('"') || token.endsWith("'"));
      console.log('🔑 Token first char:', token.charAt(0));
      console.log('🔑 Token last char:', token.charAt(token.length - 1));
      console.log('🔑 Token first char code:', token.charCodeAt(0));
      console.log('🔑 Token last char code:', token.charCodeAt(token.length - 1));
      
      if (!tokenSaved || !userSaved) {
        throw new Error('Erreur lors de la sauvegarde des données');
      }
      
      console.log('✅ Données sauvegardées avec succès');
      
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: { user, token }
      });
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur lors de la connexion:', error);
      dispatch({
        type: AuthActionTypes.LOGIN_FAILURE,
        payload: error.message
      });
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    // Suppression des données du localStorage
    secureStorage.remove('authToken');
    secureStorage.remove('user');
    
    dispatch({ type: AuthActionTypes.LOGOUT });
  };

  const updateUser = (userData) => {
    const updatedUser = { ...state.user, ...userData };
    secureStorage.set('user', updatedUser);
    
    // Nettoyer le token s'il existe
    const token = secureStorage.get('authToken');
    if (token && typeof token === 'string') {
      const cleanedToken = token.replace(/^["']|["']$/g, '');
      if (cleanedToken !== token) {
        console.log('🧹 Token nettoyé dans updateUser');
        console.log('🔑 Token original:', token.substring(0, 20) + '...');
        console.log('🔑 Token nettoyé:', cleanedToken.substring(0, 20) + '...');
        console.log('🔑 Token identique:', cleanedToken === token);
        console.log('🔑 Token length original:', token.length);
        console.log('🔑 Token length nettoyé:', cleanedToken.length);
        console.log('🔑 Token starts with quote:', token.startsWith('"') || token.startsWith("'"));
        console.log('🔑 Token ends with quote:', token.endsWith('"') || token.endsWith("'"));
        console.log('🔑 Token first char:', token.charAt(0));
        console.log('🔑 Token last char:', token.charAt(token.length - 1));
        secureStorage.set('authToken', cleanedToken);
      } else {
        console.log('🔑 Token déjà propre dans updateUser:', token.substring(0, 20) + '...');
      }
    }
    
    dispatch({
      type: AuthActionTypes.UPDATE_USER,
      payload: userData
    });
  };

  const clearError = () => {
    dispatch({ type: AuthActionTypes.CLEAR_ERROR });
  };

  // Utilitaires
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  const isArtist = () => hasRole(USER_ROLES.ARTIST);
  const isListener = () => hasRole(USER_ROLES.LISTENER);
  const isAdmin = () => hasRole(USER_ROLES.ADMIN);

  const canUploadMusic = () => {
    return isArtist() || isAdmin();
  };

  const canModerate = () => {
    return isAdmin();
  };

  // Valeur du contexte
  const contextValue = {
    // État
    ...state,
    
    // Actions
    login,
    logout,
    updateUser,
    clearError,
    
    // Utilitaires
    hasRole,
    isArtist,
    isListener,
    isAdmin,
    canUploadMusic,
    canModerate
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
};

export default AuthContext;