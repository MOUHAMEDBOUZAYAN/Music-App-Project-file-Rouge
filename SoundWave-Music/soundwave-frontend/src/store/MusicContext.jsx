import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Actions
const ACTIONS = {
  SET_CURRENT_TRACK: 'SET_CURRENT_TRACK',
  SET_IS_PLAYING: 'SET_IS_PLAYING',
  SET_QUEUE: 'SET_QUEUE',
  ADD_TO_QUEUE: 'ADD_TO_QUEUE',
  REMOVE_FROM_QUEUE: 'REMOVE_FROM_QUEUE',
  CLEAR_QUEUE: 'CLEAR_QUEUE',
  NEXT_TRACK: 'NEXT_TRACK',
  PREVIOUS_TRACK: 'PREVIOUS_TRACK',
  SET_SHUFFLE: 'SET_SHUFFLE',
  SET_REPEAT: 'SET_REPEAT',
  SET_VOLUME: 'SET_VOLUME',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_DURATION: 'SET_DURATION',
  TOGGLE_LIKE: 'TOGGLE_LIKE',
  SET_PLAYLIST: 'SET_PLAYLIST',
  ADD_TO_HISTORY: 'ADD_TO_HISTORY',
  SET_ALBUM: 'SET_ALBUM',
  SET_ARTIST: 'SET_ARTIST'
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
  currentAlbum: null,
  currentArtist: null,
  playHistory: []
};

// Reducer
const musicReducer = (state, action) => {
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
      return {
        ...state,
        queue: newQueue,
        currentQueueIndex: Math.min(state.currentQueueIndex, newQueue.length - 1)
      };

    case ACTIONS.CLEAR_QUEUE:
      return {
        ...state,
        queue: [],
        currentQueueIndex: 0
      };

    case ACTIONS.NEXT_TRACK:
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

    case ACTIONS.PREVIOUS_TRACK:
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

    case ACTIONS.TOGGLE_LIKE:
      const trackId = action.payload;
      return {
        ...state,
        likedTracks: state.likedTracks.includes(trackId)
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

    case ACTIONS.SET_ALBUM:
      return {
        ...state,
        currentAlbum: action.payload
      };

    case ACTIONS.SET_ARTIST:
      return {
        ...state,
        currentArtist: action.payload
      };

    default:
      return state;
  }
};

// Contexte
const MusicContext = createContext();

// Provider
export const MusicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);

  // Actions
  const actions = {
    setCurrentTrack: (track) => {
      dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: track });
      if (track) {
        dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: track });
      }
    },

    playTrack: (track) => {
      dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: track });
      dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
      if (track) {
        dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: track });
      }
    },

    playPlaylist: (playlist, startIndex = 0) => {
      if (playlist.tracks && playlist.tracks.length > 0) {
        dispatch({ type: ACTIONS.SET_QUEUE, payload: playlist.tracks });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: playlist.tracks[startIndex] });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: startIndex });
        dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
        dispatch({ type: ACTIONS.SET_PLAYLIST, payload: playlist });
      }
    },

    playAlbum: (album, startIndex = 0) => {
      if (album.tracks && album.tracks.length > 0) {
        dispatch({ type: ACTIONS.SET_QUEUE, payload: album.tracks });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: album.tracks[startIndex] });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: startIndex });
        dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
        dispatch({ type: ACTIONS.SET_ALBUM, payload: album });
      }
    },

    playArtist: (artist) => {
      if (artist.topTracks && artist.topTracks.length > 0) {
        dispatch({ type: ACTIONS.SET_QUEUE, payload: artist.topTracks });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: artist.topTracks[0] });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: 0 });
        dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
        dispatch({ type: ACTIONS.SET_ARTIST, payload: artist });
      }
    },

    togglePlayPause: () => {
      dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: !state.isPlaying });
    },

    nextTrack: () => {
      dispatch({ type: ACTIONS.NEXT_TRACK });
    },

    previousTrack: () => {
      dispatch({ type: ACTIONS.PREVIOUS_TRACK });
    },

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

    toggleLike: (trackId) => {
      dispatch({ type: ACTIONS.TOGGLE_LIKE, payload: trackId });
    },

    addToQueue: (track) => {
      dispatch({ type: ACTIONS.ADD_TO_QUEUE, payload: track });
    },

    removeFromQueue: (index) => {
      dispatch({ type: ACTIONS.REMOVE_FROM_QUEUE, payload: index });
    },

    clearQueue: () => {
      dispatch({ type: ACTIONS.CLEAR_QUEUE });
    },

    addToPlaylist: (playlistId, track) => {
      // Cette action sera gérée par le service de playlist
      console.log('Ajouter à la playlist:', playlistId, track);
    },

    createPlaylist: (playlistData) => {
      // Cette action sera gérée par le service de playlist
      console.log('Créer une playlist:', playlistData);
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
          // Restaurer les tracks likés
          parsed.likedTracks.forEach(trackId => {
            dispatch({ type: ACTIONS.TOGGLE_LIKE, payload: trackId });
          });
        }
        if (parsed.playHistory) {
          // Restaurer l'historique
          parsed.playHistory.forEach(track => {
            dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: track });
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

// Hook personnalisé
export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic doit être utilisé dans un MusicProvider');
  }
  return context;
};

export default MusicContext;