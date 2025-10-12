import React, { useState, useRef, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX,
  Repeat,
  Shuffle,
  List,
  Heart
} from 'lucide-react';

const AudioPlayer = ({ 
  currentTrack, 
  isPlaying, 
  onPlayPause, 
  onNext, 
  onPrevious, 
  onVolumeChange,
  onSeek,
  onToggleRepeat,
  onToggleShuffle,
  onToggleLike,
  onToggleQueue,
  queue,
  showQueue = false
}) => {
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [repeat, setRepeat] = useState('none'); // none, one, all
  const [shuffle, setShuffle] = useState(false);
  
  const audioRef = useRef(null);
  const progressRef = useRef(null);

  // Format time helper
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
    onVolumeChange?.(newVolume);
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    onVolumeChange?.(newMuted ? 0 : volume);
  };

  // Handle progress bar click
  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = clickX / width;
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
    onSeek?.(newTime);
  };

  // Handle repeat toggle
  const handleRepeatToggle = () => {
    const newRepeat = repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none';
    setRepeat(newRepeat);
    onToggleRepeat?.(newRepeat);
  };

  // Handle shuffle toggle
  const handleShuffleToggle = () => {
    const newShuffle = !shuffle;
    setShuffle(newShuffle);
    onToggleShuffle?.(newShuffle);
  };

  // Update progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioRef.current && isPlaying) {
        setCurrentTime(audioRef.current.currentTime);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  if (!currentTrack) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 z-50">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Track Info */}
        <div className="flex items-center space-x-4 flex-1 min-w-0">
          <img
            src={currentTrack.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=56&h=56&fit=crop'}
            alt={currentTrack.title}
            className="w-14 h-14 rounded object-cover"
          />
          <div className="min-w-0 flex-1">
            <h4 className="text-white font-medium truncate">{currentTrack.title}</h4>
            <p className="text-gray-400 text-sm truncate">{currentTrack.artist}</p>
          </div>
          <button
            onClick={() => onToggleLike?.(currentTrack.id)}
            className={`p-2 rounded-full transition-colors ${
              currentTrack.isLiked 
                ? 'text-red-500 hover:text-red-400' 
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <Heart className="h-5 w-5" fill={currentTrack.isLiked ? 'currentColor' : 'none'} />
          </button>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center space-x-4">
          <button
            onClick={handleShuffleToggle}
            className={`p-2 rounded-full transition-colors ${
              shuffle ? 'text-blue-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Shuffle className="h-5 w-5" />
          </button>
          
          <button
            onClick={onPrevious}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <SkipBack className="h-6 w-6" />
          </button>
          
          <button
            onClick={onPlayPause}
            className="w-8 h-8 bg-white text-black rounded-full hover:bg-gray-200 transition-colors flex items-center justify-center"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" style={{ marginLeft: '1px' }} />}
          </button>
          
          <button
            onClick={onNext}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleRepeatToggle}
            className={`p-2 rounded-full transition-colors ${
              repeat !== 'none' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Repeat className="h-5 w-5" />
            {repeat === 'one' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-400 text-xs w-10">{formatTime(currentTime)}</span>
            <div
              ref={progressRef}
              onClick={handleProgressClick}
              className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer relative"
            >
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${(currentTime / duration) * 100}%` }}
              />
            </div>
            <span className="text-gray-400 text-xs w-10">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Controls */}
        <div className="flex items-center space-x-2">
          <div className="relative">
            <button
              onMouseEnter={() => setShowVolumeSlider(true)}
              onMouseLeave={() => setShowVolumeSlider(false)}
              onClick={handleMuteToggle}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="h-5 w-5" />
              ) : (
                <Volume2 className="h-5 w-5" />
              )}
            </button>
            
            {showVolumeSlider && (
              <div
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
                className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 p-2 bg-gray-800 rounded-lg border border-gray-700"
              >
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${volume}%, #374151 ${volume}%, #374151 100%)`
                  }}
                />
              </div>
            )}
          </div>
          
          <button
            onClick={() => onToggleQueue?.()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Queue Panel */}
      {showQueue && queue && queue.length > 0 && (
        <div className="bg-gray-800 border-t border-gray-700 max-h-64 overflow-y-auto">
          <div className="p-4">
            <h3 className="text-white font-medium mb-3">Queue</h3>
            <div className="space-y-2">
              {queue.map((track, index) => (
                <div
                  key={track.id}
                  className="flex items-center space-x-3 p-2 rounded hover:bg-gray-700 transition-colors"
                >
                  <img
                    src={track.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop'}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{track.title}</p>
                    <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                  </div>
                  <span className="text-gray-500 text-xs">{formatTime(track.duration)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Hidden audio element for actual playback */}
      <audio
        ref={audioRef}
        src={
          currentTrack.audioUrl 
            ? (currentTrack.audioUrl.startsWith('http') ? currentTrack.audioUrl : `http://localhost:5000${currentTrack.audioUrl}`)
            : null
        }
        onLoadedMetadata={() => {
          console.log('✅ Audio metadata loaded');
          setDuration(audioRef.current?.duration || 0);
        }}
        onCanPlay={() => {
          console.log('✅ Audio can play');
        }}
        onError={(e) => {
          console.error('❌ Audio playback error:', e);
          console.error('❌ Audio URL:', currentTrack.audioUrl);
          console.error('❌ Current track:', currentTrack);
        }}
        onLoadStart={() => {
          console.log('🔄 Audio loading started:', currentTrack.audioUrl);
        }}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default AudioPlayer; 