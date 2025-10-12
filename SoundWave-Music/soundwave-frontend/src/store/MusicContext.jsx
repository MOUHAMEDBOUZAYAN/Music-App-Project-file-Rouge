import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { songService } from '../services/songService';
import toast from 'react-hot-toast';

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
      console.log('🎵 NEXT_TRACK reducer - currentIndex:', state.currentQueueIndex, 'queueLength:', state.queue.length);
      
      if (state.queue.length === 0) {
        console.log('❌ NEXT_TRACK - No tracks in queue');
        return state;
      }
      
      let nextIndex = state.currentQueueIndex + 1;
      if (nextIndex >= state.queue.length) {
        if (state.repeat === 'all') {
          nextIndex = 0;
          console.log('🔄 NEXT_TRACK - Repeating from beginning');
        } else {
          console.log('❌ NEXT_TRACK - End of queue reached');
          return state; // Fin de la file d'attente
        }
      }
      
      const nextTrack = state.queue[nextIndex];
      console.log('✅ NEXT_TRACK - Moving to track:', nextTrack?.title, 'at index:', nextIndex);
      
      return {
        ...state,
        currentQueueIndex: nextIndex,
        currentTrack: nextTrack || null,
        currentTime: 0
      };

    case ACTIONS.PREVIOUS_TRACK:
      console.log('🎵 PREVIOUS_TRACK reducer - currentIndex:', state.currentQueueIndex, 'queueLength:', state.queue.length);
      
      if (state.queue.length === 0) {
        console.log('❌ PREVIOUS_TRACK - No tracks in queue');
        return state;
      }
      
      let prevIndex = state.currentQueueIndex - 1;
      if (prevIndex < 0) {
        if (state.repeat === 'all') {
          prevIndex = state.queue.length - 1;
          console.log('🔄 PREVIOUS_TRACK - Repeating from end');
        } else {
          console.log('❌ PREVIOUS_TRACK - Beginning of queue reached');
          return state; // Début de la file d'attente
        }
      }
      
      const prevTrack = state.queue[prevIndex];
      console.log('✅ PREVIOUS_TRACK - Moving to track:', prevTrack?.title, 'at index:', prevIndex);
      
      return {
        ...state,
        currentQueueIndex: prevIndex,
        currentTrack: prevTrack || null,
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
        toast.error('Aucune piste sélectionnée');
        return;
      }
      
      // Ensure we have all required fields
      const processedTrack = {
        ...track,
        id: track.id || track._id,
        _id: track._id || track.id,
        title: track.title || 'Titre inconnu',
        artist: track.artist?.name || track.artist?.username || track.artist || 'Artiste inconnu',
        audioUrl: track.audioUrl || (track._id ? `http://localhost:5000/uploads/audio/${track._id}.mp3` : null),
        cover: track.cover || track.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop'
      };
      
      if (!processedTrack.audioUrl) {
        console.error('❌ Track missing audioUrl:', processedTrack);
        toast.error('URL audio manquante pour cette piste');
        return;
      }
      
      console.log('✅ Processed track for playback:', processedTrack);
      
      dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: processedTrack });
      dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
      dispatch({ type: ACTIONS.ADD_TO_HISTORY, payload: processedTrack });
      
      console.log('✅ Track set for playback:', processedTrack.title);
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

    playArtist: (artist, startIndex = 0) => {
      console.log('🎵 MusicContext - playArtist called with:', artist);
      console.log('🎵 MusicContext - artist.tracks:', artist.tracks);
      console.log('🎵 MusicContext - startIndex:', startIndex);
      
      if (artist.tracks && artist.tracks.length > 0) {
        const currentTrackToSet = artist.tracks[startIndex];
        console.log('🎵 MusicContext - Setting currentTrack to:', currentTrackToSet);
        console.log('🎵 MusicContext - currentTrack audioUrl:', currentTrackToSet?.audioUrl);
        
        dispatch({ type: ACTIONS.SET_QUEUE, payload: artist.tracks });
        dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: currentTrackToSet });
        dispatch({ type: 'SET_CURRENT_QUEUE_INDEX', payload: startIndex });
        dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
        dispatch({ type: ACTIONS.SET_ARTIST, payload: artist });
        console.log('✅ Artist set for playback:', artist.username || artist.name, 'with', artist.tracks.length, 'tracks');
      } else {
        console.log('❌ MusicContext - No tracks found in artist:', artist);
      }
    },

    togglePlayPause: () => {
      if (!state.currentTrack) {
        console.log('❌ MusicContext - No current track to play');
        toast.error('Aucune piste sélectionnée');
        return;
      }
      console.log('🎵 MusicContext - togglePlayPause:', !state.isPlaying, 'currentTrack:', state.currentTrack?.title);
      dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: !state.isPlaying });
    },

    nextTrack: () => {
      console.log('🎵 nextTrack called - queue length:', state.queue.length, 'currentIndex:', state.currentQueueIndex);
      
      if (state.queue.length === 0) {
        console.log('❌ No tracks in queue');
        toast.error('لا توجد أغاني في قائمة التشغيل');
        return;
      }
      
      if (state.currentQueueIndex >= state.queue.length - 1) {
        if (state.repeat === 'all') {
          console.log('🔄 Repeating playlist from beginning');
          dispatch({ type: 'SET_CURRENT_QUEUE_INDEX', payload: 0 });
          dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: state.queue[0] });
          dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
        } else {
          console.log('❌ End of queue reached');
          toast.error('انتهت قائمة التشغيل');
        }
        return;
      }
      
      dispatch({ type: ACTIONS.NEXT_TRACK });
    },

    previousTrack: () => {
      console.log('🎵 previousTrack called - queue length:', state.queue.length, 'currentIndex:', state.currentQueueIndex);
      
      if (state.queue.length === 0) {
        console.log('❌ No tracks in queue');
        toast.error('لا توجد أغاني في قائمة التشغيل');
        return;
      }
      
      if (state.currentQueueIndex <= 0) {
        if (state.repeat === 'all') {
          console.log('🔄 Repeating playlist from end');
          const lastIndex = state.queue.length - 1;
          dispatch({ type: 'SET_CURRENT_QUEUE_INDEX', payload: lastIndex });
          dispatch({ type: ACTIONS.SET_CURRENT_TRACK, payload: state.queue[lastIndex] });
          dispatch({ type: ACTIONS.SET_IS_PLAYING, payload: true });
        } else {
          console.log('❌ Beginning of queue reached');
          toast.error('بداية قائمة التشغيل');
        }
        return;
      }
      
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
          const response = await songService.likeSong(idStr);
          console.log('✅ Like request successful:', response);
          
          // Mettre à jour l'état local immédiatement
          const isCurrentlyLiked = state.likedTracks.includes(idStr);
          const newLikedTracks = isCurrentlyLiked
            ? state.likedTracks.filter(id => id !== idStr)
            : [...state.likedTracks, idStr];
          
          console.log('🔄 Updating local state:', { 
            isCurrentlyLiked, 
            oldLikedTracks: state.likedTracks, 
            newLikedTracks 
          });
          
          dispatch({ type: ACTIONS.SET_LIKED_TRACKS, payload: newLikedTracks });
          
          // Recharger les chansons likées depuis l'API pour synchroniser
          try {
            const res = await songService.getLikedSongs();
            let likedIds = [];
            if (res?.data) {
              if (Array.isArray(res.data)) {
                likedIds = res.data.map(s => s._id);
              } else if (res.data.data && Array.isArray(res.data.data)) {
                likedIds = res.data.data.map(s => s._id);
              }
            }
            console.log('🔄 Refreshing liked tracks from API:', likedIds);
            dispatch({ type: ACTIONS.SET_LIKED_TRACKS, payload: likedIds });
          } catch (refreshError) {
            console.warn('⚠️ Failed to refresh liked tracks from API:', refreshError);
            // Garder l'état local même si le refresh échoue
          }
        } else {
          // Ancien support des favoris externes supprimé
          throw new Error('Unsupported track id');
        }
      } catch (e) {
        console.error('❌ Like request failed:', e);
        // Afficher un message d'erreur à l'utilisateur
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
        console.log('📡 getLikedSongs response in context:', res);
        console.log('📡 getLikedSongs response type:', typeof res);
        console.log('📡 getLikedSongs response keys:', Object.keys(res || {}));
        console.log('📡 getLikedSongs response structure:', {
          success: res?.success,
          data: res?.data,
          dataType: typeof res?.data,
          isArray: Array.isArray(res?.data),
          dataLength: Array.isArray(res?.data) ? res.data.length : 'N/A'
        });
        
        // Gérer différentes structures de réponse
        let likedSongs = [];
        if (res?.data) {
          if (Array.isArray(res.data)) {
            likedSongs = res.data;
            console.log('📡 Found array of songs:', likedSongs.length, 'songs');
            console.log('📡 First song structure:', likedSongs[0]);
          } else if (res.data.data && Array.isArray(res.data.data)) {
            likedSongs = res.data.data;
            console.log('📡 Found nested array of songs:', likedSongs.length, 'songs');
            console.log('📡 First song structure:', likedSongs[0]);
          }
        }
        
        // Extract IDs for state management
        let likedIds = likedSongs.map(s => s._id || s.id).filter(Boolean);
        console.log('🎵 Extracted liked IDs:', likedIds);
        console.log('🎵 Full liked songs data:', likedSongs);
        
        dispatch({ type: ACTIONS.SET_LIKED_TRACKS, payload: likedIds });
        return likedSongs; // Return full songs data instead of just IDs
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
        let likedIds = [];
        if (res?.data) {
          if (Array.isArray(res.data)) {
            likedIds = res.data.map(s => s._id);
          } else if (res.data.data && Array.isArray(res.data.data)) {
            likedIds = res.data.data.map(s => s._id);
          }
        }
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