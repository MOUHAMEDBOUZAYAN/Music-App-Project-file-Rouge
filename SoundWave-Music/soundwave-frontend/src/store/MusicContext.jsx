import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-hot-toast';

// Types d'actions
const ACTIONS = {
  SET_CURRENT_TRACK: 'SET_CURRENT_TRACK',
  SET_IS_PLAYING: 'SET_IS_PLAYING',
  SET_QUEUE: 'SET_QUEUE',
  ADD_TO_QUEUE: 'ADD_TO_QUEUE',
  REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE',
  CLEAR_QUEUE: 'CLEAR_QUEUE',
  SET_SHUFFLE: 'SET_SHUFFLE',
  SET_REPEAT: 'SET_REPEAT',
  SET_VOLUME: 'SET_VOLUME',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_DURATION: 'SET_DURATION',
  PLAY_NEXT: 'PLAY_NEXT',
  PLAY_PREVIOUS: 'PLAY_PREVIOUS',
  TOGGLE_LIKE: 'TOGGLE_LIKE',
  SET_PLAYLIST: 'SET_PLAYLIST',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY'
};

// État initial
const initialState = {
  currentTrack: null,
  isPlaying: false,
  queue: [],
  currentQueueIndex: 0,
  shuffle: false,
  repeat: 'none', // 'none', 'one', 'all'
  volume: 0.7,
  currentTime: 0,
  duration: 0,
  likedTracks: [],
  currentPlaylist: null,
  playHistory: []
};

// Reducer
function musicReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_CURRENT_TRACK:
      return {
        ...state,
        currentTrack: action.payload,
        currentTime: 0,
        duration: 0
      };

    case ACTIONS.SET_IS_PLAYING:
      return {
        ...state,
        isPlaying: action.payload
      };

    case ACTIONS.SET_QUEUE:
      return {
        ...state,
        queue: action.payload,
        currentQueueIndex: 0
      };

    case ACTIONS.ADD_TO_QUEUE:
      return {
        ...state,
        queue: [...state.queue, action.payload]
      };

    case ACTIONS.REMOVE_FROM_QUEUE:
      const newQueue = state.queue.filter((_, index) => index !== action.payload);
      const newIndex = state.currentQueueIndex >= action.payload 
        ? Math.max(0, state.currentQueueIndex - 1) 
        : state.currentQueueIndex;
      
      return {
        ...state,
        queue: newQueue,
        currentQueueIndex: newIndex
      };

    case ACTIONS.CLEAR_QUEUE:
      return {
        ...state,
        queue: [],
        currentQueueIndex: 0
      };

    case ACTIONS.SET_SHUFFLE:
      return {
        ...state,
        shuffle: action.payload
      };

    case ACTIONS.SET_REPEAT:
      return {
        ...state,
        repeat: action.payload
      };

    case ACTIONS.SET_VOLUME:
      return {
        ...state,
        volume: action.payload
      };

    case ACTIONS.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload
      };

    case ACTIONS.SET_DURATION:
      return {
        ...state,
        duration: action.payload
      };

    case ACTIONS.PLAY_NEXT:
      let nextIndex = state.currentQueueIndex + 1;
      
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIndex = 0;
        } else {
          return state; // Fin de la file d'attente
        }
      }
      
      return {
        ...state,
        currentQueueIndex: nextIndex,
        currentTrack: state.queue[nextIndex] || null,
        currentTime: 0
      };

    case ACTIONS.PLAY_PREVIOUS:
      let prevIndex = state.currentQueueIndex - 1;
      
      if (prevIndex < 0) {
        if (state.repeat === 'all') {
          prevIndex = state.queue.length - 1;
        } else {
          return state; // Début de la file d'attente
        }
      }
      
      return {
        ...state,
        currentQueueIndex: prevIndex,
        currentTrack: state.queue[prevIndex] || null,
        currentTime: 0
      };

    case ACTIONS.TOGGLE_LIKE:
      const trackId = action.payload;
      const isLiked = state.likedTracks.includes(trackId);
      
      return {
        ...state,
        likedTracks: isLiked
          ? state.likedTracks.filter(id => id !== trackId)
          : [...state.likedTracks, trackId]
      };

    case ACTIONS.SET_PLAYLIST:
      return {
        ...state,
        currentPlaylist: action.payload
      };

    case ACTIONS.ADD_TO_HISTORY:
      const newHistory = [action.payload, ...state.playHistory.filter(track => track.id !== action.payload.id)];
      return {
        ...state,
        playHistory: newHistory.slice(0, 50) // Garder seulement les 50 dernières
      };

    default:
      return state;
  }
}

// Créer le contexte
const MusicContext = createContext();

// Hook personnalisé pour utiliser le contexte
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic doit être utilisé dans un MusicProvider');
  }
  return context;
};

// Provider du contexte
export const MusicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);

  // Actions
  const actions = {
    // Lecture
    playTrack: (track) => {
      dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: track });
      dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
      dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: track });
    },

    playPause: () => {
      dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: !state.isPlaying });
    },

    playNext: () => {
      if (state.queue.length > 0) {
        dispatch({ type: ACTIONS.PLAY_NEXT });
      }
    },

    playPrevious: () => {
      if (state.queue.length > 0) {
        dispatch({ type: ACTIONS.PLAY_PREVIOUS });
      }
    },

    // File d'attente
    setQueue: (tracks) => {
      dispatch({ type: ACTIONS.SET_QUEUE, payload: tracks });
    },

    addToQueue: (track) => {
      dispatch({ type: ACTIONS.ADD_TO_QUEUE, payload: track });
      toast.success('Ajouté à la file d\'attente');
    },

    removeFromQueue: (index) => {
      dispatch({ type: ACTIONS.REMOVE_FROM_QUEUE, payload: index });
    },

    clearQueue: () => {
      dispatch({ type: ACTIONS.CLEAR_QUEUE });
    },

    // Contrôles
    setShuffle: (shuffle) => {
      dispatch({ type: ACTIONS.SET_SHUFFLE, payload: shuffle });
    },

    setRepeat: (repeat) => {
      dispatch({ type: ACTIONS.SET_REPEAT, payload: repeat });
    },

    setVolume: (volume) => {
      dispatch({ type: ACTIONS.SET_VOLUME, payload: volume });
    },

    setCurrentTime: (time) => {
      dispatch({ type: ACTIONS.SET_CURRENT_TIME, payload: time });
    },

    setDuration: (duration) => {
      dispatch({ type: ACTIONS.SET_DURATION, payload: duration });
    },

    // Favoris
    toggleLike: (trackId) => {
      dispatch({ type: ACTIONS.TOGGLE_LIKE, payload: trackId });
    },

    // Playlist
    setCurrentPlaylist: (playlist) => {
      dispatch({ type: ACTIONS.SET_PLAYLIST, payload: playlist });
    },

    // Lecture d'album/playlist
    playAlbum: (album) => {
      if (album.tracks && album.tracks.length > 0) {
        const tracks = album.tracks.map(track => ({
          ...track,
          album: album.name,
          coverUrl: album.coverUrl
        }));
        
        dispatch({ type: ACTIONS.SET_QUEUE, payload: tracks });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: tracks[0] });
        dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
        dispatch({ type: ACTIONS.SET_CURRENT_PLAYLIST, payload: album });
        
        toast.success(`Lecture de l'album ${album.name}`);
      }
    },

    playPlaylist: (playlist) => {
      if (playlist.tracks && playlist.tracks.length > 0) {
        const tracks = playlist.tracks.map(track => ({
          ...track,
          playlist: playlist.name,
          coverUrl: playlist.coverUrl
        }));
        
        dispatch({ type: ACTIONS.SET_QUEUE, payload: tracks });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: tracks[0] });
        dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
        dispatch({ type: ACTIONS.SET_CURRENT_PLAYLIST, payload: playlist });
        
        toast.success(`Lecture de la playlist ${playlist.name}`);
      }
    },

    // Recherche et lecture
    searchAndPlay: async (query) => {
      try {
        // Ici vous pouvez implémenter la logique de recherche
        // Pour l'instant, on simule
        toast.success(`Recherche de "${query}"`);
      } catch (error) {
        toast.error('Erreur lors de la recherche');
      }
    }
  };

  // Sauvegarder l'état dans le localStorage
  useEffect(() => {
    localStorage.setItem('musicState', JSON.stringify({
      volume: state.volume,
      likedTracks: state.likedTracks,
      playHistory: state.playHistory
    }));
  }, [state.volume, state.likedTracks, state.playHistory]);

  // Charger l'état depuis le localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('musicState');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        if (parsed.volume !== undefined) {
          actions.setVolume(parsed.volume);
        }
        if (parsed.likedTracks) {
          // Restaurer les favoris
          parsed.likedTracks.forEach(trackId => {
            if (!state.likedTracks.includes(trackId)) {
              actions.toggleLike(trackId);
            }
          });
        }
      } catch (error) {
        console.error('Erreur lors du chargement de l\'état:', error);
      }
    }
  }, []);

  const value = {
    ...state,
    ...actions
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
};

export default MusicContext;