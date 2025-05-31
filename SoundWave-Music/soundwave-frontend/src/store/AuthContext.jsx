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
        const token = secureStorage.get('authToken');
        const user = secureStorage.get('user');
        
        if (token && user) {
          dispatch({
            type: AuthActionTypes.LOGIN_SUCCESS,
            payload: { token, user }
          });
        } else {
          dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error);
        dispatch({ type: AuthActionTypes.SET_LOADING, payload: false });
      }
    };

    checkAuth();
  }, []);

  // Actions
  const login = async (userData) => {
    dispatch({ type: AuthActionTypes.LOGIN_START });
    
    try {
      const { user, token } = userData;
      
      // Sauvegarde dans le localStorage
      secureStorage.set('authToken', token);
      secureStorage.set('user', user);
      
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: { user, token }
      });
      
      return { success: true };
    } catch (error) {
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