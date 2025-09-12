import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Shuffle, 
  Repeat, 
  Volume2, 
  VolumeX,
  Heart,
  List,
  Monitor,
  Maximize2,
  Mic2,
  Music
} from 'lucide-react';
import NowPlayingSheet from './NowPlayingSheet';
import { toast } from 'react-hot-toast';
import { useMusic } from '../../store/MusicContext';

const AudioPlayer = () => {
  const {
    currentTrack,
    isPlaying,
    queue,
    togglePlayPause,
    nextTrack,
    previousTrack,
    setShuffle,
    setRepeat,
    toggleLike,
    likedTracks,
  } = useMusic();
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showQueue, setShowQueue] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  // Debug current state
  console.log('🎵 AudioPlayer render - currentTrack:', currentTrack);
  console.log('🎵 AudioPlayer render - isPlaying:', isPlaying);
  console.log('🎵 AudioPlayer render - currentTrack audioUrl:', currentTrack?.audioUrl);

  // Gérer la lecture audio
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      const audioUrl = currentTrack.audioUrl || currentTrack.previewUrl || currentTrack.preview_url || '';
      const fullAudioUrl = audioUrl 
        ? (audioUrl.startsWith('http') ? audioUrl : `http://localhost:5000${audioUrl}`)
        : '';
      
      console.log('🎵 Loading audio:', { audioUrl, fullAudioUrl, currentTrack });
      
      audioRef.current.src = fullAudioUrl;
      audioRef.current.load();
      
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error('❌ Erreur de lecture:', error);
          console.error('❌ Audio URL:', fullAudioUrl);
          toast.error('Impossible de lire cette piste');
        });
      }
    }
  }, [currentTrack]);

  // Gérer la lecture/pause
  useEffect(() => {
    console.log('🎵 AudioPlayer - isPlaying changed:', isPlaying, 'currentTrack:', currentTrack?.title);
    if (audioRef.current) {
      if (isPlaying) {
        console.log('🎵 Attempting to play audio...');
        audioRef.current.play().catch(error => {
          console.error('❌ Play error:', error);
          toast.error('Impossible de lire cette piste');
        });
      } else {
        console.log('🎵 Pausing audio...');
        audioRef.current.pause();
      }
    } else {
      console.log('❌ audioRef.current is null');
    }
  }, [isPlaying]);

  // Gérer le volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  // Événements audio
  const handleLoadedMetadata = () => {
    setDuration(audioRef.current.duration);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleEnded = () => {
    nextTrack();
  };

  const handleProgressClick = (e) => {
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const clickPercent = clickX / width;
    const newTime = clickPercent * duration;
    
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleToggleLike = async () => {
    if (!currentTrack) return;
    
    try {
      const trackId = currentTrack._id || currentTrack.id;
      const wasLiked = likedTracks.includes(trackId);
      
      console.log('🎵 AudioPlayer - handleToggleLike called:', { track: currentTrack, trackId, wasLiked });
      
      await toggleLike(currentTrack);
      
      if (wasLiked) {
        toast.success('Retiré des favoris');
      } else {
        toast.success('Ajouté aux favoris');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour des favoris:', error);
      toast.error('Erreur lors de la mise à jour des favoris');
    }
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) {
    // Afficher un player minimal avec contrôles désactivés
    return (
      <div className="fixed bottom-0 left-64 right-0 bg-black border-t border-gray-800 z-40 lg:left-64">
        <div className="px-4 py-2">
          {/* Barre de progression vide */}
          <div className="w-full h-1 bg-gray-600"></div>
          
          {/* Contrôles principaux désactivés */}
          <div className="flex items-center justify-between h-16">
            {/* Informations de la piste - vide */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-14 h-14 bg-gray-800 rounded flex-shrink-0"></div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-gray-500">Aucune piste sélectionnée</div>
                <div className="text-xs text-gray-600">Sélectionnez une musique pour commencer</div>
              </div>
            </div>

            {/* Contrôles de lecture centraux désactivés */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="flex items-center space-x-4">
                <button disabled className="text-gray-600 cursor-not-allowed">
                  <Shuffle className="h-5 w-5" />
                </button>
                <button disabled className="text-gray-600 cursor-not-allowed">
                  <SkipBack className="h-6 w-6" />
                </button>
                <button disabled className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center cursor-not-allowed">
                  <Play className="h-5 w-5 text-gray-400 ml-1" />
                </button>
                <button disabled className="text-gray-600 cursor-not-allowed">
                  <SkipForward className="h-6 w-6" />
                </button>
                <button disabled className="text-gray-600 cursor-not-allowed">
                  <Repeat className="h-5 w-5" />
                </button>
              </div>
              
              {/* Barre de progression du temps vide */}
              <div className="flex items-center space-x-2 w-full max-w-md">
                <span className="text-xs text-gray-600 w-10 text-right">0:00</span>
                <div className="flex-1 h-1 bg-gray-600 rounded-full"></div>
                <span className="text-xs text-gray-600 w-10">0:00</span>
              </div>
            </div>

            {/* Contrôles supplémentaires désactivés */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
              <button disabled className="text-gray-600 cursor-not-allowed">
                <List className="h-4 w-4" />
              </button>
              <button disabled className="text-gray-600 cursor-not-allowed">
                <Mic2 className="h-4 w-4" />
              </button>
              <button disabled className="text-gray-600 cursor-not-allowed">
                <Monitor className="h-4 w-4" />
              </button>
              
              {/* Contrôle du volume désactivé */}
              <div className="flex items-center space-x-2">
                <button disabled className="text-gray-600 cursor-not-allowed">
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
              
              <button disabled className="text-gray-600 cursor-not-allowed">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Lecteur audio caché */}
      <audio
        ref={audioRef}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        preload="metadata"
      />

             {/* Barre de lecture (style Spotify) */}
       <div className="fixed bottom-0 left-0 right-0 bg-black border-t border-gray-800 z-[35] lg:left-64 lg:z-40">
        <div className="px-4 py-2">
          {/* Barre de progression (desktop/tablette) */}
          <div 
            ref={progressRef}
            className="hidden md:block w-full h-1 bg-gray-600 cursor-pointer hover:h-1.5 transition-all duration-200"
            onClick={handleProgressClick}
          >
            <div 
              className="h-full bg-green-500 hover:bg-green-400 transition-colors"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>

          {/* Contrôles principaux (desktop) */}
          <div className="hidden md:flex items-center justify-between h-16">
            {/* Informations de la piste */}
            <div className="flex items-center space-x-4 flex-1 min-w-0">
              <div className="w-14 h-14 bg-gray-800 rounded flex-shrink-0 flex items-center justify-center">
                {(currentTrack.cover || currentTrack.coverUrl) ? (
                  <img 
                    src={currentTrack.cover || currentTrack.coverUrl} 
                    alt={currentTrack.title}
                    className="w-full h-full object-cover rounded"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                ) : (
                  <Music className="h-7 w-7 text-gray-400" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-white truncate">
                  {currentTrack.title || 'Aucune piste sélectionnée'}
                </div>
                <div className="text-xs text-gray-400 truncate">
                  {typeof currentTrack.artist === 'string' ? currentTrack.artist : (currentTrack.artist?.name || currentTrack.artist?.username || 'Sélectionnez une musique')}
                </div>
              </div>
              <button 
                onClick={handleToggleLike}
                className={`p-2 rounded-full transition-colors ${
                  likedTracks.includes(currentTrack?._id || currentTrack?.id) ? 'text-green-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className="h-4 w-4" fill={likedTracks.includes(currentTrack?._id || currentTrack?.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            {/* Contrôles de lecture centraux */}
            <div className="flex flex-col items-center space-y-2 flex-1">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setShuffle(true)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Shuffle className="h-5 w-5" />
                </button>
                <button 
                  onClick={previousTrack}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipBack className="h-6 w-6" />
                </button>
                <button 
                  onClick={togglePlayPause}
                  className="w-8 h-8 bg-white rounded-full flex items-center justify-center hover:scale-105 transition-transform"
                >
                  {isPlaying ? (
                    <Pause className="h-4 w-4 text-black" />
                  ) : (
                    <Play className="h-4 w-4 text-black" style={{ marginLeft: '1px' }} />
                  )}
                </button>
                <button 
                  onClick={nextTrack}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <SkipForward className="h-6 w-6" />
                </button>
                <button 
                  onClick={() => setRepeat('all')}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <Repeat className="h-5 w-5" />
                </button>
              </div>
              
              {/* Barre de progression du temps */}
              <div className="flex items-center space-x-2 w-full max-w-md">
                <span className="text-xs text-gray-400 w-10 text-right">
                  {formatTime(currentTime)}
                </span>
                <div className="flex-1 h-1 bg-gray-600 rounded-full">
                  <div 
                    className="h-full bg-white rounded-full"
                    style={{ width: `${(currentTime / duration) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-gray-400 w-10">
                  {formatTime(duration)}
                </span>
              </div>
            </div>

            {/* Contrôles supplémentaires */}
            <div className="flex items-center space-x-4 flex-1 justify-end">
                             <button 
                 onClick={() => setShowQueue(!showQueue)}
                 className="text-gray-400 hover:text-white transition-colors"
                 title="File d'attente"
               >
                 <List className="h-4 w-4" />
               </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Mic2 className="h-4 w-4" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <List className="h-4 w-4" />
              </button>
              <button className="text-gray-400 hover:text-white transition-colors">
                <Monitor className="h-4 w-4" />
              </button>
              
              {/* Contrôle du volume */}
              <div 
                className="flex items-center space-x-2"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <button 
                  onClick={toggleMute}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </button>
                {showVolumeSlider && (
                  <div className="w-20 h-1 bg-gray-600 rounded-full">
                    <input
                      ref={volumeRef}
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={handleVolumeChange}
                      className="w-full h-1 bg-green-500 rounded-full appearance-none cursor-pointer"
                      style={{
                        background: `linear-gradient(to right, #1db954 0%, #1db954 ${(isMuted ? 0 : volume) * 100}%, #4d4d4d ${(isMuted ? 0 : volume) * 100}%, #4d4d4d 100%)`
                      }}
                    />
                  </div>
                )}
              </div>
              
              <button className="text-gray-400 hover:text-white transition-colors">
                <Maximize2 className="h-4 w-4" />
              </button>
            </div>
          </div>
          {/* Barre compacte mobile */}
          <div className="md:hidden mt-2">
            <button onClick={() => setIsSheetOpen(true)} className="w-full flex items-center justify-between">
              <div className="min-w-0">
                <div className="text-white text-sm font-medium truncate max-w-[12rem]">{currentTrack.title}</div>
                <div className="text-gray-400 text-xs truncate max-w-[12rem]">{typeof currentTrack.artist === 'string' ? currentTrack.artist : (currentTrack.artist?.username || currentTrack.artist?.name || 'Artiste inconnu')}</div>
              </div>
              <div className="flex items-center space-x-2 ml-3">
                <button type="button" onClick={(e) => { e.stopPropagation(); handleToggleLike(); }} className="p-2 text-gray-300">
                  <Heart className="h-4 w-4" fill={likedTracks.includes(currentTrack?._id || currentTrack?.id) ? 'currentColor' : 'none'} />
                </button>
                <button type="button" onClick={(e) => { e.stopPropagation(); togglePlayPause(); }} className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center">
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" style={{ marginLeft: '1px' }} />}
                </button>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* File d'attente */}
      {showQueue && (
        <div className="fixed bottom-20 right-4 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl z-40">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold">File d'attente</h3>
              <button 
                onClick={() => setShowQueue(false)}
                className="text-gray-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {queue.map((track, index) => (
                <div 
                  key={track.id} 
                  className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                    index === 0 ? 'bg-green-500/20 text-green-400' : 'hover:bg-gray-800'
                  }`}
                >
                  <div className="w-8 h-8 bg-gray-700 rounded flex-shrink-0">
                    {track.coverUrl && (
                      <img 
                        src={track.coverUrl} 
                        alt={track.title}
                        className="w-full h-full object-cover rounded"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-white truncate">
                      {track.title}
                    </div>
                    <div className="text-xs text-gray-400 truncate">
                      {track.artist}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">
                    {track.duration ? formatTime(track.duration) : '0:00'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {/* Now Playing bottom sheet (mobile) */}
      <NowPlayingSheet
        track={currentTrack}
        isOpen={isSheetOpen}
        onClose={() => setIsSheetOpen(false)}
        onPlayPause={togglePlayPause}
        isPlaying={isPlaying}
        onNext={nextTrack}
        onPrevious={previousTrack}
        onToggleLike={handleToggleLike}
      />
    </>
  );
};

export default AudioPlayer;
