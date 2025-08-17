import React, { createContext, useContext, useReducer, useEffect } from 'react';
import spotifyService from '../services/spotifyService';

// Types d'actions
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_SPOTIFY_TOKEN: 'SET_SPOTIFY_TOKEN',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_CURRENT_TRACK: 'SET_CURRENT_TRACK',
  SET_PLAYBACK_STATE: 'SET_PLAYBACK_STATE',
  SET_QUEUE: 'SET_QUEUE',
  SET_PLAYLISTS: 'SET_PLAYLISTS',
  SET_NEW_RELEASES: 'SET_NEW_RELEASES',
  SET_FEATURED_PLAYLISTS: 'SET_FEATURED_PLAYLISTS',
  SET_CATEGORIES: 'SET_CATEGORIES',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  ADD_TO_QUEUE: 'ADD_TO_QUEUE',
  REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE',
  SET_VOLUME: 'SET_VOLUME',
  SET_REPEAT_MODE: 'SET_REPEAT_MODE',
  SET_SHUFFLE_MODE: 'SET_SHUFFLE_MODE'
};

// État initial
const initialState = {
  loading: false,
  error: null,
  spotifyToken: null,
  userProfile: null,
  searchResults: null,
  currentTrack: null,
  playbackState: {
    isPlaying: false,
    progress: 0,
    duration: 0,
    volume: 0.5,
    repeatMode: 'off',
    shuffleMode: false
  },
  queue: [],
  playlists: [],
  newReleases: [],
  featuredPlaylists: [],
  categories: [],
  recentlyPlayed: []
};

// Reducer
function spotifyReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    
    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    
    case ACTIONS.SET_SPOTIFY_TOKEN:
      return { ...state, spotifyToken: action.payload };
    
    case ACTIONS.SET_USER_PROFILE:
      return { ...state, userProfile: action.payload };
    
    case ACTIONS.SET_SEARCH_RESULTS:
      return { ...state, searchResults: action.payload };
    
    case ACTIONS.SET_CURRENT_TRACK:
      return { ...state, currentTrack: action.payload };
    
    case ACTIONS.SET_PLAYBACK_STATE:
      return { ...state, playbackState: { ...state.playbackState, ...action.payload } };
    
    case ACTIONS.SET_QUEUE:
      return { ...state, queue: action.payload };
    
    case ACTIONS.SET_PLAYLISTS:
      return { ...state, playlists: action.payload };
    
    case ACTIONS.SET_NEW_RELEASES:
      return { ...state, newReleases: action.payload };
    
    case ACTIONS.SET_FEATURED_PLAYLISTS:
      return { ...state, featuredPlaylists: action.payload };
    
    case ACTIONS.SET_CATEGORIES:
      return { ...state, categories: action.payload };
    
    case ACTIONS.CLEAR_SEARCH:
      return { ...state, searchResults: null };
    
    case ACTIONS.ADD_TO_QUEUE:
      return { ...state, queue: [...state.queue, action.payload] };
    
    case ACTIONS.REMOVE_FROM_QUEUE:
      return { 
        ...state, 
        queue: state.queue.filter((_, index) => index !== action.payload) 
      };
    
    case ACTIONS.SET_VOLUME:
      return { 
        ...state, 
        playbackState: { ...state.playbackState, volume: action.payload } 
      };
    
    case ACTIONS.SET_REPEAT_MODE:
      return { 
        ...state, 
        playbackState: { ...state.playbackState, repeatMode: action.payload } 
      };
    
    case ACTIONS.SET_SHUFFLE_MODE:
      return { 
        ...state, 
        playbackState: { ...state.playbackState, shuffleMode: action.payload } 
      };
    
    default:
      return state;
  }
}

// Contexte
const SpotifyContext = createContext();

// Hook personnalisé
export const useSpotify = () => {
  const context = useContext(SpotifyContext);
  if (!context) {
    throw new Error('useSpotify doit être utilisé dans un SpotifyProvider');
  }
  return context;
};

// Provider
export const SpotifyProvider = ({ children }) => {
  const [state, dispatch] = useReducer(spotifyReducer, initialState);

  // Actions
  const actions = {
    setLoading: (loading) => dispatch({ type: ACTIONS.SET_LOADING, payload: loading }),
    setError: (error) => dispatch({ type: ACTIONS.SET_ERROR, payload: error }),
    setSpotifyToken: (token) => dispatch({ type: ACTIONS.SET_SPOTIFY_TOKEN, payload: token }),
    setUserProfile: (profile) => dispatch({ type: ACTIONS.SET_USER_PROFILE, payload: profile }),
    setSearchResults: (results) => dispatch({ type: ACTIONS.SET_SEARCH_RESULTS, payload: results }),
    setCurrentTrack: (track) => dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: track }),
    setPlaybackState: (playbackState) => dispatch({ type: ACTIONS.SET_PLAYBACK_STATE, payload: playbackState }),
    setQueue: (queue) => dispatch({ type: ACTIONS.SET_QUEUE, payload: queue }),
    setPlaylists: (playlists) => dispatch({ type: ACTIONS.SET_PLAYLISTS, payload: playlists }),
    setNewReleases: (releases) => dispatch({ type: ACTIONS.SET_NEW_RELEASES, payload: releases }),
    setFeaturedPlaylists: (playlists) => dispatch({ type: ACTIONS.SET_FEATURED_PLAYLISTS, payload: playlists }),
    setCategories: (categories) => dispatch({ type: ACTIONS.SET_CATEGORIES, payload: categories }),
    clearSearch: () => dispatch({ type: ACTIONS.CLEAR_SEARCH }),
    addToQueue: (track) => dispatch({ type: ACTIONS.ADD_TO_QUEUE, payload: track }),
    removeFromQueue: (index) => dispatch({ type: ACTIONS.REMOVE_FROM_QUEUE, payload: index }),
    setVolume: (volume) => dispatch({ type: ACTIONS.SET_VOLUME, payload: volume }),
    setRepeatMode: (mode) => dispatch({ type: ACTIONS.SET_REPEAT_MODE, payload: mode }),
    setShuffleMode: (mode) => dispatch({ type: ACTIONS.SET_SHUFFLE_MODE, payload: mode })
  };

  // Méthodes Spotify
  const spotifyMethods = {
    // Authentification
    login: async () => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        await spotifyService.login();
      } catch (error) {
        actions.setError(error.message);
      } finally {
        actions.setLoading(false);
      }
    },

    handleCallback: async (code) => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.handleCallback(code);
        actions.setSpotifyToken(response.access_token);
        return response;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Profil utilisateur
    getUserProfile: async () => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getProfile();
        actions.setUserProfile(response.data);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Recherche
    search: async (query, type = 'track,artist,album,playlist', limit = 20, offset = 0) => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.search(query, type, limit, offset);
        actions.setSearchResults(response.data);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Playlists
    getUserPlaylists: async (limit = 20, offset = 0) => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getUserPlaylists(limit, offset);
        actions.setPlaylists(response.data.items);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    getPlaylist: async (id) => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getPlaylist(id);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Albums
    getAlbum: async (id) => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getAlbum(id);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Artistes
    getArtist: async (id) => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getArtist(id);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    getArtistTopTracks: async (id, market = 'FR') => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getArtistTopTracks(id, market);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    getArtistAlbums: async (id, limit = 20, offset = 0) => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getArtistAlbums(id, limit, offset);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Recommandations
    getRecommendations: async (seedArtists, seedGenres, seedTracks, limit = 20, market = 'FR') => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getRecommendations(seedArtists, seedGenres, seedTracks, limit, market);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Nouvelles sorties
    getNewReleases: async (limit = 20, offset = 0, country = 'FR') => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getNewReleases(limit, offset, country);
        actions.setNewReleases(response.data.albums.items);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Playlists en vedette
    getFeaturedPlaylists: async (limit = 20, offset = 0, country = 'FR') => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getFeaturedPlaylists(limit, offset, country);
        actions.setFeaturedPlaylists(response.data.playlists.items);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Catégories
    getCategories: async (limit = 20, offset = 0, country = 'FR') => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getCategories(limit, offset, country);
        actions.setCategories(response.data.categories.items);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    getCategoryPlaylists: async (categoryId, limit = 20, offset = 0, country = 'FR') => {
      try {
        actions.setLoading(true);
        actions.setError(null);
        const response = await spotifyService.getCategoryPlaylists(categoryId, limit, offset, country);
        return response.data;
      } catch (error) {
        actions.setError(error.message);
        throw error;
      } finally {
        actions.setLoading(false);
      }
    },

    // Contrôles de lecture
    playTrack: (track) => {
      actions.setCurrentTrack(track);
      actions.setPlaybackState({ isPlaying: true });
    },

    pauseTrack: () => {
      actions.setPlaybackState({ isPlaying: false });
    },

    resumeTrack: () => {
      actions.setPlaybackState({ isPlaying: true });
    },

    nextTrack: () => {
      if (state.queue.length > 0) {
        const nextTrack = state.queue[0];
        actions.setCurrentTrack(nextTrack);
        actions.removeFromQueue(0);
      }
    },

    previousTrack: () => {
      // Logique pour la piste précédente
    },

    // Gestion de la queue
    addToQueue: (track) => {
      actions.addToQueue(track);
    },

    removeFromQueue: (index) => {
      actions.removeFromQueue(index);
    },

    clearQueue: () => {
      actions.setQueue([]);
    },

    // Contrôles de volume et mode
    setVolume: (volume) => {
      actions.setVolume(volume);
    },

    setRepeatMode: (mode) => {
      actions.setRepeatMode(mode);
    },

    setShuffleMode: (mode) => {
      actions.setShuffleMode(mode);
    },

    // Utilitaires
    formatDuration: spotifyService.formatDuration,
    formatNumber: spotifyService.formatNumber,
    getSmallestImage: spotifyService.getSmallestImage,
    getLargestImage: spotifyService.getLargestImage
  };

  // Charger les données initiales
  useEffect(() => {
    let isMounted = true;
    
    const loadInitialData = async () => {
      if (state.spotifyToken && !state.loading && isMounted) {
        try {
          // Charger les données en parallèle pour éviter les boucles
          await Promise.allSettled([
            spotifyMethods.getUserProfile().catch(err => console.warn('Erreur profil:', err)),
            spotifyMethods.getUserPlaylists().catch(err => console.warn('Erreur playlists:', err)),
            spotifyMethods.getNewReleases().catch(err => console.warn('Erreur nouvelles sorties:', err)),
            spotifyMethods.getFeaturedPlaylists().catch(err => console.warn('Erreur playlists vedette:', err)),
            spotifyMethods.getCategories().catch(err => console.warn('Erreur catégories:', err))
          ]);
        } catch (error) {
          console.error('Erreur lors du chargement initial:', error);
        }
      }
    };

    // Délai pour éviter les appels trop fréquents
    const timer = setTimeout(loadInitialData, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [state.spotifyToken]); // Dépendance unique

  const value = {
    ...state,
    ...spotifyMethods
  };

  return (
    <SpotifyContext.Provider value={value}>
      {children}
    </SpotifyContext.Provider>
  );
};
