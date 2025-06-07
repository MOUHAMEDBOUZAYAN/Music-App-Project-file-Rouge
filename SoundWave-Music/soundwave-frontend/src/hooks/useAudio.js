// useAudio hook will be implemented here 
import { useState, useEffect, useRef } from 'react';
import { useMusic } from '../store/MusicContext.jsx';

export const useAudio = (src = null) => {
  const audioRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const musicContext = useMusic();

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const audio = audioRef.current;

    // Événements audio
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => {
      setIsLoading(false);
      setDuration(audio.duration || 0);
    };
    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleEnded = () => setIsPlaying(false);
    const handleError = () => {
      setError('Erreur lors du chargement du fichier audio');
      setIsLoading(false);
    };
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    // Ajout des événements
    audio.addEventListener('loadstart', handleLoadStart);
    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('loadstart', handleLoadStart);
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  // Charger une nouvelle source
  const load = (newSrc) => {
    if (audioRef.current) {
      audioRef.current.src = newSrc;
      setError(null);
    }
  };

  // Lecture
  const play = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
      } catch (err) {
        setError('Impossible de lire le fichier audio');
      }
    }
  };

  // Pause
  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  // Toggle play/pause
  const togglePlay = async () => {
    if (isPlaying) {
      pause();
    } else {
      await play();
    }
  };

  // Recherche dans le temps
  const seekTo = (time) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(duration, time));
    }
  };

  // Régler le volume
  const setVolume = (volume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  };

  // Charger la source au montage si fournie
  useEffect(() => {
    if (src) {
      load(src);
    }
  }, [src]);

  return {
    // État
    isLoading,
    error,
    currentTime,
    duration,
    isPlaying,
    
    // Actions
    load,
    play,
    pause,
    togglePlay,
    seekTo,
    setVolume,
    
    // Référence audio
    audioRef
  };
};