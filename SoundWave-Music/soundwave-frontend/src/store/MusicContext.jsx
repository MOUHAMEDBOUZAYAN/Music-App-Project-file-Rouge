// MusicContext will be implemented here 
import React, { createContext, useContext, useReducer, useRef, useEffect } from 'react';
import { PLAYER_STATES, AUDIO_CONFIG } from '../utils/constants.js';
import { shuffleArray } from '../utils/helpers.js';

// État initial
const initialState = {
  // Lecture en cours
  currentSong: null,
  isPlaying: false,
  playerState: PLAYER_STATES.STOPPED,
  
  // Progression
  currentTime: 0,
  duration: 0,
  buffered: 0,
  
  // Volume et paramètres
  volume: AUDIO_CONFIG.DEFAULT_VOLUME,
  isMuted: false,
  previousVolume: AUDIO_CONFIG.DEFAULT_VOLUME,
  
  // Queue et playlists
  queue: [],
  currentIndex: 0,
  originalQueue: [],
  
  // Modes de lecture
  isShuffled: false,
  repeatMode: 'none', // 'none', 'all', 'one'
  
  // États
  isLoading: false,
  error: null
};

// Types d'actions
const MusicActionTypes = {
  SET_CURRENT_SONG: 'SET_CURRENT_SONG',
  SET_PLAYING: 'SET_PLAYING',
  SET_PLAYER_STATE: 'SET_PLAYER_STATE',
  SET_CURRENT_TIME: 'SET_CURRENT_TIME',
  SET_DURATION: 'SET_DURATION',
  SET_BUFFERED: 'SET_BUFFERED',
  SET_VOLUME: 'SET_VOLUME',
  TOGGLE_MUTE: 'TOGGLE_MUTE',
  SET_QUEUE: 'SET_QUEUE',
  SET_CURRENT_INDEX: 'SET_CURRENT_INDEX',
  TOGGLE_SHUFFLE: 'TOGGLE_SHUFFLE',
  SET_REPEAT_MODE: 'SET_REPEAT_MODE',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer pour la gestion des états
const musicReducer = (state, action) => {
  switch (action.type) {
    case MusicActionTypes.SET_CURRENT_SONG:
      return {
        ...state,
        currentSong: action.payload,
        currentTime: 0,
        duration: 0
      };
      
    case MusicActionTypes.SET_PLAYING:
      return {
        ...state,
        isPlaying: action.payload,
        playerState: action.payload ? PLAYER_STATES.PLAYING : PLAYER_STATES.PAUSED
      };
      
    case MusicActionTypes.SET_PLAYER_STATE:
      return {
        ...state,
        playerState: action.payload,
        isPlaying: action.payload === PLAYER_STATES.PLAYING
      };
      
    case MusicActionTypes.SET_CURRENT_TIME:
      return {
        ...state,
        currentTime: action.payload
      };
      
    case MusicActionTypes.SET_DURATION:
      return {
        ...state,
        duration: action.payload
      };
      
    case MusicActionTypes.SET_BUFFERED:
      return {
        ...state,
        buffered: action.payload
      };
      
    case MusicActionTypes.SET_VOLUME:
      return {
        ...state,
        volume: action.payload,
        isMuted: action.payload === 0
      };
      
    case MusicActionTypes.TOGGLE_MUTE:
      return {
        ...state,
        isMuted: !state.isMuted,
        volume: !state.isMuted ? 0 : state.previousVolume,
        previousVolume: !state.isMuted ? state.volume : state.previousVolume
      };
      
    case MusicActionTypes.SET_QUEUE:
      return {
        ...state,
        queue: action.payload.queue,
        originalQueue: action.payload.originalQueue || action.payload.queue,
        currentIndex: action.payload.index || 0
      };
      
    case MusicActionTypes.SET_CURRENT_INDEX:
      return {
        ...state,
        currentIndex: action.payload
      };
      
    case MusicActionTypes.TOGGLE_SHUFFLE:
      const newIsShuffled = !state.isShuffled;
      let newQueue = [...state.queue];
      let newIndex = state.currentIndex;
      
      if (newIsShuffled) {
        // Activer le shuffle
        const currentSong = state.queue[state.currentIndex];
        const otherSongs = state.queue.filter((_, index) => index !== state.currentIndex);
        const shuffledOthers = shuffleArray(otherSongs);
        newQueue = [currentSong, ...shuffledOthers];
        newIndex = 0;
      } else {
        // Désactiver le shuffle
        newQueue = [...state.originalQueue];
        const currentSong = state.queue[state.currentIndex];
        newIndex = state.originalQueue.findIndex(song => song.id === currentSong.id);
      }
      
      return {
        ...state,
        isShuffled: newIsShuffled,
        queue: newQueue,
        currentIndex: newIndex
      };
      
    case MusicActionTypes.SET_REPEAT_MODE:
      return {
        ...state,
        repeatMode: action.payload
      };
      
    case MusicActionTypes.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      };
      
    case MusicActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      };
      
    case MusicActionTypes.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
      
    default:
      return state;
  }
};

// Création du contexte
const MusicContext = createContext();

// Provider du contexte
export const MusicProvider = ({ children }) => {
  const [state, dispatch] = useReducer(musicReducer, initialState);
  const audioRef = useRef(null);
  const progressUpdateRef = useRef(null);

  // Initialisation de l'élément audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.preload = 'metadata';
    
    // Événements audio
    const audio = audioRef.current;
    
    const handleLoadStart = () => {
      dispatch({ type: MusicActionTypes.SET_LOADING, payload: true });
    };
    
    const handleCanPlay = () => {
      dispatch({ type: MusicActionTypes.SET_LOADING, payload: false });
      dispatch({ type: MusicActionTypes.SET_DURATION, payload: audio.duration || 0 });
    };
    
    const handleTimeUpdate = () => {
      dispatch({ type: MusicActionTypes.SET_CURRENT_TIME, payload: audio.currentTime });
    };
    
    const handleEnded = () => {
      handleNext();
    };
    
    const handleError = (e) => {
      dispatch({
        type: MusicActionTypes.SET_ERROR,
        payload: 'Erreur lors de la lecture du fichier audio'
      });
    };
    
    const handleProgress = () => {
      if (audio.buffered.length > 0) {
        const buffered = audio.buffered.end(audio.buffered.length - 1);
        dispatch({ type: MusicActionTypes.SET_BUFFERED, payload: buffered });
      }
    };
    
    // Ajout des événements
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('progress', handleProgress);
    
    // Nettoyage
    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('progress', handleProgress);
      audio.pause();
    };
  }, []);

  // Actions principales
  const playSong = async (song, queue = null, index = 0) => {
    try {
      dispatch({ type: MusicActionTypes.SET_LOADING, payload: true });
      
      if (queue) {
        dispatch({
          type: MusicActionTypes.SET_QUEUE,
          payload: { queue, index }
        });
      }
      
      dispatch({ type: MusicActionTypes.SET_CURRENT_SONG, payload: song });
      
      if (audioRef.current) {
        audioRef.current.src = song.audioUrl;
        audioRef.current.volume = state.volume;
        await audioRef.current.play();
        dispatch({ type: MusicActionTypes.SET_PLAYING, payload: true });
      }
    } catch (error) {
      dispatch({
        type: MusicActionTypes.SET_ERROR,
        payload: 'Impossible de lire ce morceau'
      });
    }
  };

  const togglePlay = async () => {
    if (!state.currentSong || !audioRef.current) return;
    
    try {
      if (state.isPlaying) {
        audioRef.current.pause();
        dispatch({ type: MusicActionTypes.SET_PLAYING, payload: false });
      } else {
        await audioRef.current.play();
        dispatch({ type: MusicActionTypes.SET_PLAYING, payload: true });
      }
    } catch (error) {
      dispatch({
        type: MusicActionTypes.SET_ERROR,
        payload: 'Erreur lors de la lecture'
      });
    }
  };

  const handleNext = () => {
    if (state.queue.length === 0) return;
    
    let nextIndex;
    
    if (state.repeatMode === 'one') {
      // Répéter le morceau actuel
      nextIndex = state.currentIndex;
    } else if (state.currentIndex === state.queue.length - 1) {
      // Dernier morceau
      if (state.repeatMode === 'all') {
        nextIndex = 0;
      } else {
        // Arrêter la lecture
        dispatch({ type: MusicActionTypes.SET_PLAYING, payload: false });
        return;
      }
    } else {
      nextIndex = state.currentIndex + 1;
    }
    
    dispatch({ type: MusicActionTypes.SET_CURRENT_INDEX, payload: nextIndex });
    playSong(state.queue[nextIndex], null, nextIndex);
  };

  const handlePrevious = () => {
    if (state.queue.length === 0) return;
    
    // Si on est au début du morceau (< 3 secondes), passer au précédent
    // Sinon, revenir au début du morceau actuel
    if (state.currentTime < 3) {
      let prevIndex;
      
      if (state.currentIndex === 0) {
        prevIndex = state.repeatMode === 'all' ? state.queue.length - 1 : 0;
      } else {
        prevIndex = state.currentIndex - 1;
      }
      
      dispatch({ type: MusicActionTypes.SET_CURRENT_INDEX, payload: prevIndex });
      playSong(state.queue[prevIndex], null, prevIndex);
    } else {
      seekTo(0);
    }
  };

  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      dispatch({ type: MusicActionTypes.SET_CURRENT_TIME, payload: time });
    }
  };

  const setVolume = (volume) => {
    const newVolume = Math.max(0, Math.min(1, volume));
    
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
    
    dispatch({ type: MusicActionTypes.SET_VOLUME, payload: newVolume });
  };

  const toggleMute = () => {
    dispatch({ type: MusicActionTypes.TOGGLE_MUTE });
    
    if (audioRef.current) {
      audioRef.current.volume = state.isMuted ? state.previousVolume : 0;
    }
  };

  const toggleShuffle = () => {
    dispatch({ type: MusicActionTypes.TOGGLE_SHUFFLE });
  };

  const cycleRepeatMode = () => {
    const modes = ['none', 'all', 'one'];
    const currentModeIndex = modes.indexOf(state.repeatMode);
    const nextMode = modes[(currentModeIndex + 1) % modes.length];
    
    dispatch({ type: MusicActionTypes.SET_REPEAT_MODE, payload: nextMode });
  };

  const addToQueue = (songs) => {
    const newQueue = [...state.queue, ...songs];
    dispatch({
      type: MusicActionTypes.SET_QUEUE,
      payload: { queue: newQueue, originalQueue: newQueue }
    });
  };

  const removeFromQueue = (index) => {
    const newQueue = state.queue.filter((_, i) => i !== index);
    let newIndex = state.currentIndex;
    
    if (index < state.currentIndex) {
      newIndex = state.currentIndex - 1;
    } else if (index === state.currentIndex && index === newQueue.length) {
      newIndex = Math.max(0, newQueue.length - 1);
    }
    
    dispatch({
      type: MusicActionTypes.SET_QUEUE,
      payload: { queue: newQueue, originalQueue: newQueue, index: newIndex }
    });
  };

  const clearQueue = () => {
    dispatch({
      type: MusicActionTypes.SET_QUEUE,
      payload: { queue: [], originalQueue: [], index: 0 }
    });
  };

  const clearError = () => {
    dispatch({ type: MusicActionTypes.CLEAR_ERROR });
  };

  // Valeur du contexte
  const contextValue = {
    // État
    ...state,
    
    // Actions
    playSong,
    togglePlay,
    handleNext,
    handlePrevious,
    seekTo,
    setVolume,
    toggleMute,
    toggleShuffle,
    cycleRepeatMode,
    addToQueue,
    removeFromQueue,
    clearQueue,
    clearError,
    
    // Utilitaires
    audioRef
  };

  return (
    <MusicContext.Provider value={contextValue}>
      {children}
    </MusicContext.Provider>
  );
};

// Hook personnalisé pour utiliser le contexte
export const useMusic = () => {
  const context = useContext(MusicContext);
  
  if (!context) {
    throw new Error('useMusic doit être utilisé dans un MusicProvider');
  }
  
  return context;
};

export default MusicContext;