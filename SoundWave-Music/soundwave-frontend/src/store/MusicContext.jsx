import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { songService } from '../services/songService';

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
  SET_LIKED_TRACKS: 'SET_LIKED_TRACKS',
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
      console.log('🎵 MusicContext reducer - SET_CURRENT_TRACK:', action.payload);
      console.log('🎵 MusicContext reducer - currentTrack audioUrl:', action.payload?.audioUrl);
      return {
        ...state,
        currentTrack: action.payload,
        currentTime: 0,
        duration: 0
      };

    case ACTIONS.SET_IS_PLAYING:
      console.log('🎵 MusicContext - SET_IS_PLAYING:', action.payload, 'currentTrack:', state.currentTrack?.title);
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

    case 'SET_CURRENT_QUEUE_INDEX':
      return {
        ...state,
        currentQueueIndex: action.payload
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
      const isCurrentlyLiked = state.likedTracks.includes(trackId);
      const newLikedTracks = isCurrentlyLiked
        ? state.likedTracks.filter(id => id !== trackId)
        : [...state.likedTracks, trackId];
      
      console.log('🔄 TOGGLE_LIKE action:', { 
        trackId, 
        isCurrentlyLiked, 
        oldLikedTracks: state.likedTracks, 
        newLikedTracks 
      });
      
      return {
        ...state,
        likedTracks: newLikedTracks
      };

    case ACTIONS.SET_LIKED_TRACKS:
      const updatedLikedTracks = Array.isArray(action.payload) ? action.payload : [];
      console.log('🔄 SET_LIKED_TRACKS action:', { 
        payload: action.payload, 
        updatedLikedTracks,
        oldLikedTracks: state.likedTracks 
      });
      
      // تجنب التحديث إذا كانت القيم متطابقة
      if (JSON.stringify(state.likedTracks) === JSON.stringify(updatedLikedTracks)) {
        console.log('🔄 No change in likedTracks, skipping update');
        return state;
      }
      
      return {
        ...state,
        likedTracks: updatedLikedTracks
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
      console.log('🎵 playTrack called with:', track);
      
      if (!track) {
        console.error('❌ No track provided to playTrack');
        return;
      }
      
      if (!track.audioUrl) {
        console.error('❌ Track missing audioUrl:', track);
        return;
      }
      
      dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: track });
      dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
      dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: track });
      
      console.log('✅ Track set for playback:', track.title);
    },

    playPlaylist: (playlist, startIndex = 0) => {
      console.log('🎵 MusicContext - playPlaylist called with:', playlist);
      console.log('🎵 MusicContext - playlist.tracks:', playlist.tracks);
      console.log('🎵 MusicContext - startIndex:', startIndex);
      
      if (playlist.tracks && playlist.tracks.length > 0) {
        const currentTrackToSet = playlist.tracks[startIndex];
        console.log('🎵 MusicContext - Setting currentTrack to:', currentTrackToSet);
        console.log('🎵 MusicContext - currentTrack audioUrl:', currentTrackToSet?.audioUrl);
        
        dispatch({ type: ACTIONS.SET_QUEUE, payload: playlist.tracks });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: currentTrackToSet });
        dispatch({ type: 'SET_CURRENT_QUEUE_INDEX', payload: startIndex });
        dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
        dispatch({ type: ACTIONS.SET_PLAYLIST, payload: playlist });
        console.log('✅ Playlist set for playback:', playlist.name, 'with', playlist.tracks.length, 'tracks');
      } else {
        console.log('❌ MusicContext - No tracks found in playlist:', playlist);
      }
    },

    playAlbum: (album, startIndex = 0) => {
      if (album.tracks && album.tracks.length > 0) {
        dispatch({ type: ACTIONS.SET_QUEUE, payload: album.tracks });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: album.tracks[startIndex] });
        dispatch({ type: 'SET_CURRENT_QUEUE_INDEX', payload: startIndex });
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

    toggleLike: async (track) => {
      const rawId = typeof track === 'object' ? (track._id || track.id) : track;
      const idStr = String(rawId || '').trim();
      const isMongoId = /^[a-f\d]{24}$/i.test(idStr);

      console.log('🔄 toggleLike called with:', { track, rawId, idStr, isMongoId });

      try {
        if (isMongoId) {
          console.log('📡 Sending like request to API for:', idStr);
          await songService.likeSong(idStr);
          console.log('✅ Like request successful');
          
          // Recharger les chansons likées après succès
          const res = await songService.getLikedSongs();
          const likedIds = Array.isArray(res?.data)
            ? res.data.map(s => s._id)
            : [];
          console.log('🔄 Refreshing liked tracks:', likedIds);
          dispatch({ type: ACTIONS.SET_LIKED_TRACKS, payload: likedIds });
        } else {
          // Ancien support des favoris externes supprimé
          throw new Error('Unsupported track id');
        }
      } catch (e) {
        console.error('❌ Like request failed:', e);
        // لا rollback - فقط إظهار الخطأ
        throw e;
      }
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
    },

    refreshLikedSongs: async () => {
      try {
        console.log('🔄 refreshLikedSongs called');
        console.log('🔑 Auth token in context:', localStorage.getItem('authToken'));
        const res = await songService.getLikedSongs();
        console.log('📡 getLikedSongs response:', res);
        
        const likedIds = Array.isArray(res?.data)
          ? res.data.map(s => s._id)
          : [];
        
        console.log('🎵 Extracted liked IDs:', likedIds);
        dispatch({ type: ACTIONS.SET_LIKED_TRACKS, payload: likedIds });
        return res.data || [];
      } catch (e) {
        console.error('❌ Erreur lors du rechargement des chansons likées:', e);
        console.error('❌ Error details:', {
          status: e.status,
          message: e.message,
          response: e.response
        });
        
        // إذا كان الخطأ 401، المستخدم غير مسجل دخول
        if (e.status === 401) {
          console.log('🔐 User not authenticated in context');
          dispatch({ type: ACTIONS.SET_LIKED_TRACKS, payload: [] });
          return [];
        }
        
        // إذا كان الخطأ 429، انتظر قليلاً قبل إعادة المحاولة
        if (e.status === 429) {
          console.log('⏳ Rate limit reached, waiting before retry...');
          await new Promise(resolve => setTimeout(resolve, 2000)); // انتظار 2 ثانية
        }
        
        // في حالة الخطأ، لا تغير likedTracks
        return [];
      }
    }
  };

  // Ne plus persister les likes dans localStorage; garder seulement volume/historique si besoin
  useEffect(() => {
    localStorage.setItem('musicState', JSON.stringify({
      volume: state.volume,
      playHistory: state.playHistory
    }));
  }, [state.volume, state.playHistory]);

  // Charger likes depuis l'API au montage
  useEffect(() => {
    const init = async () => {
      try {
        const savedState = localStorage.getItem('musicState');
        if (savedState) {
          const parsed = JSON.parse(savedState);
          if (parsed.volume !== undefined) {
            actions.setVolume(parsed.volume);
          }
          if (parsed.playHistory) {
            parsed.playHistory.forEach(track => {
              dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: track });
            });
          }
        }
        const res = await songService.getLikedSongs();
        const likedIds = Array.isArray(res?.data?.data)
          ? res.data.data.map(s => s._id)
          : [];
        dispatch({ type: ACTIONS.SET_LIKED_TRACKS, payload: likedIds });
      } catch (e) {
        dispatch({ type: ACTIONS.SET_LIKED_TRACKS, payload: [] });
      }
    };
    init();
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