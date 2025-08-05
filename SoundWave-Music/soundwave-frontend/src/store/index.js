import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { MusicProvider, useMusic } from './MusicContext';

// Global App State
const AppStateContext = createContext();
const AppDispatchContext = createContext();

// Initial app state
const initialState = {
  // UI State
  sidebarCollapsed: false,
  theme: 'dark',
  language: 'en',
  notifications: [],
  modals: {
    isOpen: false,
    type: null,
    data: null
  },
  
  // Search State
  search: {
    query: '',
    filters: {
      type: 'all', // all, songs, artists, albums, playlists
      genre: null,
      duration: null,
      year: null
    },
    results: [],
    loading: false,
    error: null
  },
  
  // Player State
  player: {
    isVisible: false,
    isMinimized: false,
    volume: 80,
    muted: false,
    repeat: 'none', // none, one, all
    shuffle: false,
    crossfade: false,
    crossfadeDuration: 3
  },
  
  // Queue State
  queue: {
    current: null,
    history: [],
    upcoming: [],
    isShuffled: false
  },
  
  // Library State
  library: {
    playlists: [],
    likedSongs: [],
    followedArtists: [],
    savedAlbums: [],
    recentlyPlayed: []
  },
  
  // User Preferences
  preferences: {
    audioQuality: 'medium', // low, medium, high
    autoPlay: true,
    notifications: {
      newReleases: true,
      concertAlerts: true,
      socialActivity: true
    },
    privacy: {
      publicProfile: true,
      listeningActivity: false,
      dataCollection: true
    }
  },
  
  // Error State
  errors: [],
  
  // Loading States
  loading: {
    app: false,
    auth: false,
    music: false,
    library: false
  }
};

// Action types
export const APP_ACTIONS = {
  // UI Actions
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_THEME: 'SET_THEME',
  SET_LANGUAGE: 'SET_LANGUAGE',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  
  // Search Actions
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_SEARCH_FILTERS: 'SET_SEARCH_FILTERS',
  SET_SEARCH_RESULTS: 'SET_SEARCH_RESULTS',
  SET_SEARCH_LOADING: 'SET_SEARCH_LOADING',
  SET_SEARCH_ERROR: 'SET_SEARCH_ERROR',
  CLEAR_SEARCH: 'CLEAR_SEARCH',
  
  // Player Actions
  SET_PLAYER_VISIBLE: 'SET_PLAYER_VISIBLE',
  SET_PLAYER_MINIMIZED: 'SET_PLAYER_MINIMIZED',
  SET_VOLUME: 'SET_VOLUME',
  SET_MUTED: 'SET_MUTED',
  SET_REPEAT: 'SET_REPEAT',
  SET_SHUFFLE: 'SET_SHUFFLE',
  SET_CROSSFADE: 'SET_CROSSFADE',
  
  // Queue Actions
  SET_CURRENT_TRACK: 'SET_CURRENT_TRACK',
  ADD_TO_QUEUE: 'ADD_TO_QUEUE',
  REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE',
  CLEAR_QUEUE: 'CLEAR_QUEUE',
  SHUFFLE_QUEUE: 'SHUFFLE_QUEUE',
  
  // Library Actions
  SET_PLAYLISTS: 'SET_PLAYLISTS',
  ADD_PLAYLIST: 'ADD_PLAYLIST',
  UPDATE_PLAYLIST: 'UPDATE_PLAYLIST',
  REMOVE_PLAYLIST: 'REMOVE_PLAYLIST',
  SET_LIKED_SONGS: 'SET_LIKED_SONGS',
  ADD_LIKED_SONG: 'ADD_LIKED_SONG',
  REMOVE_LIKED_SONG: 'REMOVE_LIKED_SONG',
  SET_FOLLOWED_ARTISTS: 'SET_FOLLOWED_ARTISTS',
  ADD_FOLLOWED_ARTIST: 'ADD_FOLLOWED_ARTIST',
  REMOVE_FOLLOWED_ARTIST: 'REMOVE_FOLLOWED_ARTIST',
  
  // Preferences Actions
  UPDATE_PREFERENCES: 'UPDATE_PREFERENCES',
  
  // Error Actions
  ADD_ERROR: 'ADD_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  
  // Loading Actions
  SET_LOADING: 'SET_LOADING',
  CLEAR_LOADING: 'CLEAR_LOADING'
};

// App reducer
const appReducer = (state, action) => {
  switch (action.type) {
    // UI Actions
    case APP_ACTIONS.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarCollapsed: !state.sidebarCollapsed
      };
      
    case APP_ACTIONS.SET_THEME:
      return {
        ...state,
        theme: action.payload
      };
      
    case APP_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload
      };
      
    case APP_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [...state.notifications, {
          id: Date.now(),
          ...action.payload
        }]
      };
      
    case APP_ACTIONS.REMOVE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(n => n.id !== action.payload)
      };
      
    case APP_ACTIONS.OPEN_MODAL:
      return {
        ...state,
        modals: {
          isOpen: true,
          type: action.payload.type,
          data: action.payload.data
        }
      };
      
    case APP_ACTIONS.CLOSE_MODAL:
      return {
        ...state,
        modals: {
          isOpen: false,
          type: null,
          data: null
        }
      };
      
    // Search Actions
    case APP_ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        search: {
          ...state.search,
          query: action.payload
        }
      };
      
    case APP_ACTIONS.SET_SEARCH_FILTERS:
      return {
        ...state,
        search: {
          ...state.search,
          filters: {
            ...state.search.filters,
            ...action.payload
          }
        }
      };
      
    case APP_ACTIONS.SET_SEARCH_RESULTS:
      return {
        ...state,
        search: {
          ...state.search,
          results: action.payload,
          loading: false,
          error: null
        }
      };
      
    case APP_ACTIONS.SET_SEARCH_LOADING:
      return {
        ...state,
        search: {
          ...state.search,
          loading: action.payload
        }
      };
      
    case APP_ACTIONS.SET_SEARCH_ERROR:
      return {
        ...state,
        search: {
          ...state.search,
          error: action.payload,
          loading: false
        }
      };
      
    case APP_ACTIONS.CLEAR_SEARCH:
      return {
        ...state,
        search: {
          query: '',
          filters: initialState.search.filters,
          results: [],
          loading: false,
          error: null
        }
      };
      
    // Player Actions
    case APP_ACTIONS.SET_PLAYER_VISIBLE:
      return {
        ...state,
        player: {
          ...state.player,
          isVisible: action.payload
        }
      };
      
    case APP_ACTIONS.SET_PLAYER_MINIMIZED:
      return {
        ...state,
        player: {
          ...state.player,
          isMinimized: action.payload
        }
      };
      
    case APP_ACTIONS.SET_VOLUME:
      return {
        ...state,
        player: {
          ...state.player,
          volume: action.payload
        }
      };
      
    case APP_ACTIONS.SET_MUTED:
      return {
        ...state,
        player: {
          ...state.player,
          muted: action.payload
        }
      };
      
    case APP_ACTIONS.SET_REPEAT:
      return {
        ...state,
        player: {
          ...state.player,
          repeat: action.payload
        }
      };
      
    case APP_ACTIONS.SET_SHUFFLE:
      return {
        ...state,
        player: {
          ...state.player,
          shuffle: action.payload
        }
      };
      
    case APP_ACTIONS.SET_CROSSFADE:
      return {
        ...state,
        player: {
          ...state.player,
          crossfade: action.payload
        }
      };
      
    // Queue Actions
    case APP_ACTIONS.SET_CURRENT_TRACK:
      return {
        ...state,
        queue: {
          ...state.queue,
          current: action.payload
        }
      };
      
    case APP_ACTIONS.ADD_TO_QUEUE:
      return {
        ...state,
        queue: {
          ...state.queue,
          upcoming: [...state.queue.upcoming, action.payload]
        }
      };
      
    case APP_ACTIONS.REMOVE_FROM_QUEUE:
      return {
        ...state,
        queue: {
          ...state.queue,
          upcoming: state.queue.upcoming.filter((_, index) => index !== action.payload)
        }
      };
      
    case APP_ACTIONS.CLEAR_QUEUE:
      return {
        ...state,
        queue: {
          ...state.queue,
          upcoming: []
        }
      };
      
    case APP_ACTIONS.SHUFFLE_QUEUE:
      return {
        ...state,
        queue: {
          ...state.queue,
          upcoming: action.payload,
          isShuffled: !state.queue.isShuffled
        }
      };
      
    // Library Actions
    case APP_ACTIONS.SET_PLAYLISTS:
      return {
        ...state,
        library: {
          ...state.library,
          playlists: action.payload
        }
      };
      
    case APP_ACTIONS.ADD_PLAYLIST:
      return {
        ...state,
        library: {
          ...state.library,
          playlists: [...state.library.playlists, action.payload]
        }
      };
      
    case APP_ACTIONS.UPDATE_PLAYLIST:
      return {
        ...state,
        library: {
          ...state.library,
          playlists: state.library.playlists.map(playlist =>
            playlist.id === action.payload.id ? action.payload : playlist
          )
        }
      };
      
    case APP_ACTIONS.REMOVE_PLAYLIST:
      return {
        ...state,
        library: {
          ...state.library,
          playlists: state.library.playlists.filter(playlist => playlist.id !== action.payload)
        }
      };
      
    case APP_ACTIONS.SET_LIKED_SONGS:
      return {
        ...state,
        library: {
          ...state.library,
          likedSongs: action.payload
        }
      };
      
    case APP_ACTIONS.ADD_LIKED_SONG:
      return {
        ...state,
        library: {
          ...state.library,
          likedSongs: [...state.library.likedSongs, action.payload]
        }
      };
      
    case APP_ACTIONS.REMOVE_LIKED_SONG:
      return {
        ...state,
        library: {
          ...state.library,
          likedSongs: state.library.likedSongs.filter(song => song.id !== action.payload)
        }
      };
      
    case APP_ACTIONS.SET_FOLLOWED_ARTISTS:
      return {
        ...state,
        library: {
          ...state.library,
          followedArtists: action.payload
        }
      };
      
    case APP_ACTIONS.ADD_FOLLOWED_ARTIST:
      return {
        ...state,
        library: {
          ...state.library,
          followedArtists: [...state.library.followedArtists, action.payload]
        }
      };
      
    case APP_ACTIONS.REMOVE_FOLLOWED_ARTIST:
      return {
        ...state,
        library: {
          ...state.library,
          followedArtists: state.library.followedArtists.filter(artist => artist.id !== action.payload)
        }
      };
      
    // Preferences Actions
    case APP_ACTIONS.UPDATE_PREFERENCES:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          ...action.payload
        }
      };
      
    // Error Actions
    case APP_ACTIONS.ADD_ERROR:
      return {
        ...state,
        errors: [...state.errors, {
          id: Date.now(),
          ...action.payload
        }]
      };
      
    case APP_ACTIONS.REMOVE_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload)
      };
      
    case APP_ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        errors: []
      };
      
    // Loading Actions
    case APP_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };
      
    case APP_ACTIONS.CLEAR_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload]: false
        }
      };
      
    default:
      return state;
  }
};

// App Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('soundwave_preferences');
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences);
        dispatch({
          type: APP_ACTIONS.UPDATE_PREFERENCES,
          payload: preferences
        });
      } catch (error) {
        console.error('Error loading preferences:', error);
      }
    }
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem('soundwave_preferences', JSON.stringify(state.preferences));
  }, [state.preferences]);

  // Auto-remove notifications after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      if (state.notifications.length > 0) {
        dispatch({
          type: APP_ACTIONS.REMOVE_NOTIFICATION,
          payload: state.notifications[0].id
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [state.notifications]);

  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        <AuthProvider>
          <MusicProvider>
            {children}
          </MusicProvider>
        </AuthProvider>
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

// Custom hooks for using the app state
export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppProvider');
  }
  return context;
};

export const useAppDispatch = () => {
  const context = useContext(AppDispatchContext);
  if (!context) {
    throw new Error('useAppDispatch must be used within an AppProvider');
  }
  return context;
};

// Combined hook for state and dispatch
export const useApp = () => {
  const state = useAppState();
  const dispatch = useAppDispatch();
  const auth = useAuth();
  const music = useMusic();

  return {
    state,
    dispatch,
    auth,
    music,
    
    // Convenience methods
    actions: {
      // UI Actions
      toggleSidebar: () => dispatch({ type: APP_ACTIONS.TOGGLE_SIDEBAR }),
      setTheme: (theme) => dispatch({ type: APP_ACTIONS.SET_THEME, payload: theme }),
      setLanguage: (language) => dispatch({ type: APP_ACTIONS.SET_LANGUAGE, payload: language }),
      addNotification: (notification) => dispatch({ type: APP_ACTIONS.ADD_NOTIFICATION, payload: notification }),
      removeNotification: (id) => dispatch({ type: APP_ACTIONS.REMOVE_NOTIFICATION, payload: id }),
      openModal: (type, data) => dispatch({ type: APP_ACTIONS.OPEN_MODAL, payload: { type, data } }),
      closeModal: () => dispatch({ type: APP_ACTIONS.CLOSE_MODAL }),
      
      // Search Actions
      setSearchQuery: (query) => dispatch({ type: APP_ACTIONS.SET_SEARCH_QUERY, payload: query }),
      setSearchFilters: (filters) => dispatch({ type: APP_ACTIONS.SET_SEARCH_FILTERS, payload: filters }),
      setSearchResults: (results) => dispatch({ type: APP_ACTIONS.SET_SEARCH_RESULTS, payload: results }),
      setSearchLoading: (loading) => dispatch({ type: APP_ACTIONS.SET_SEARCH_LOADING, payload: loading }),
      setSearchError: (error) => dispatch({ type: APP_ACTIONS.SET_SEARCH_ERROR, payload: error }),
      clearSearch: () => dispatch({ type: APP_ACTIONS.CLEAR_SEARCH }),
      
      // Player Actions
      setPlayerVisible: (visible) => dispatch({ type: APP_ACTIONS.SET_PLAYER_VISIBLE, payload: visible }),
      setPlayerMinimized: (minimized) => dispatch({ type: APP_ACTIONS.SET_PLAYER_MINIMIZED, payload: minimized }),
      setVolume: (volume) => dispatch({ type: APP_ACTIONS.SET_VOLUME, payload: volume }),
      setMuted: (muted) => dispatch({ type: APP_ACTIONS.SET_MUTED, payload: muted }),
      setRepeat: (repeat) => dispatch({ type: APP_ACTIONS.SET_REPEAT, payload: repeat }),
      setShuffle: (shuffle) => dispatch({ type: APP_ACTIONS.SET_SHUFFLE, payload: shuffle }),
      setCrossfade: (crossfade) => dispatch({ type: APP_ACTIONS.SET_CROSSFADE, payload: crossfade }),
      
      // Queue Actions
      setCurrentTrack: (track) => dispatch({ type: APP_ACTIONS.SET_CURRENT_TRACK, payload: track }),
      addToQueue: (track) => dispatch({ type: APP_ACTIONS.ADD_TO_QUEUE, payload: track }),
      removeFromQueue: (index) => dispatch({ type: APP_ACTIONS.REMOVE_FROM_QUEUE, payload: index }),
      clearQueue: () => dispatch({ type: APP_ACTIONS.CLEAR_QUEUE }),
      shuffleQueue: (shuffledQueue) => dispatch({ type: APP_ACTIONS.SHUFFLE_QUEUE, payload: shuffledQueue }),
      
      // Library Actions
      setPlaylists: (playlists) => dispatch({ type: APP_ACTIONS.SET_PLAYLISTS, payload: playlists }),
      addPlaylist: (playlist) => dispatch({ type: APP_ACTIONS.ADD_PLAYLIST, payload: playlist }),
      updatePlaylist: (playlist) => dispatch({ type: APP_ACTIONS.UPDATE_PLAYLIST, payload: playlist }),
      removePlaylist: (id) => dispatch({ type: APP_ACTIONS.REMOVE_PLAYLIST, payload: id }),
      setLikedSongs: (songs) => dispatch({ type: APP_ACTIONS.SET_LIKED_SONGS, payload: songs }),
      addLikedSong: (song) => dispatch({ type: APP_ACTIONS.ADD_LIKED_SONG, payload: song }),
      removeLikedSong: (id) => dispatch({ type: APP_ACTIONS.REMOVE_LIKED_SONG, payload: id }),
      setFollowedArtists: (artists) => dispatch({ type: APP_ACTIONS.SET_FOLLOWED_ARTISTS, payload: artists }),
      addFollowedArtist: (artist) => dispatch({ type: APP_ACTIONS.ADD_FOLLOWED_ARTIST, payload: artist }),
      removeFollowedArtist: (id) => dispatch({ type: APP_ACTIONS.REMOVE_FOLLOWED_ARTIST, payload: id }),
      
      // Preferences Actions
      updatePreferences: (preferences) => dispatch({ type: APP_ACTIONS.UPDATE_PREFERENCES, payload: preferences }),
      
      // Error Actions
      addError: (error) => dispatch({ type: APP_ACTIONS.ADD_ERROR, payload: error }),
      removeError: (id) => dispatch({ type: APP_ACTIONS.REMOVE_ERROR, payload: id }),
      clearErrors: () => dispatch({ type: APP_ACTIONS.CLEAR_ERRORS }),
      
      // Loading Actions
      setLoading: (key, value) => dispatch({ type: APP_ACTIONS.SET_LOADING, payload: { key, value } }),
      clearLoading: (key) => dispatch({ type: APP_ACTIONS.CLEAR_LOADING, payload: key })
    }
  };
};

// Export everything
export {
  APP_ACTIONS,
  initialState,
  appReducer
};

export default AppProvider; 