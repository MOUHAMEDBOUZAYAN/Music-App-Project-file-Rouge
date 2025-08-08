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
  Heart,
  Maximize2,
  Minimize2
} from 'lucide-react';

const PlayerControls = ({
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
  onToggleFullscreen,
  currentTrack,
  volume = 80,
  isMuted = false,
  repeat = 'none',
  shuffle = false,
  showQueue = false,
  isFullscreen = false
}) => {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  
  const progressRef = useRef(null);
  const volumeRef = useRef(null);

  // Format time helper
  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle progress bar interaction
  const handleProgressMouseDown = (e) => {
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleProgressMouseMove = (e) => {
    if (isDragging) {
      handleProgressClick(e);
    }
  };

  const handleProgressMouseUp = () => {
    setIsDragging(false);
  };

  const handleProgressClick = (e) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const percentage = Math.max(0, Math.min(1, clickX / width));
    const newTime = percentage * duration;
    
    setCurrentTime(newTime);
    onSeek?.(newTime);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseInt(e.target.value);
    onVolumeChange?.(newVolume);
  };

  // Handle mute toggle
  const handleMuteToggle = () => {
    onVolumeChange?.(isMuted ? volume : 0);
  };

  // Handle repeat toggle
  const handleRepeatToggle = () => {
    const newRepeat = repeat === 'none' ? 'all' : repeat === 'all' ? 'one' : 'none';
    onToggleRepeat?.(newRepeat);
  };

  // Handle shuffle toggle
  const handleShuffleToggle = () => {
    onToggleShuffle?.(!shuffle);
  };

  // Update progress bar
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying && !isDragging) {
        setCurrentTime(prev => {
          const newTime = prev + 1;
          return newTime > duration ? duration : newTime;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, isDragging, duration]);

  // Global mouse event listeners for progress dragging
  useEffect(() => {
    if (isDragging) {
      const handleGlobalMouseMove = (e) => handleProgressMouseMove(e);
      const handleGlobalMouseUp = () => handleProgressMouseUp();

      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [isDragging]);

  return (
    <div className="flex flex-col space-y-4">
      {/* Progress Bar */}
      <div className="flex items-center space-x-3">
        <span className="text-gray-400 text-xs w-12 text-right">
          {formatTime(currentTime)}
        </span>
        <div
          ref={progressRef}
          onMouseDown={handleProgressMouseDown}
          className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer relative group"
        >
          <div
            className="h-full bg-blue-500 rounded-full transition-all relative"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
        <span className="text-gray-400 text-xs w-12">
          {formatTime(duration)}
        </span>
      </div>

      {/* Main Controls */}
      <div className="flex items-center justify-between">
        {/* Left Controls */}
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
            className="p-3 bg-white text-black rounded-full hover:bg-gray-200 transition-colors"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>
          
          <button
            onClick={onNext}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <SkipForward className="h-6 w-6" />
          </button>
          
          <button
            onClick={handleRepeatToggle}
            className={`p-2 rounded-full transition-colors relative ${
              repeat !== 'none' ? 'text-blue-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Repeat className="h-5 w-5" />
            {repeat === 'one' && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center space-x-4">
          {/* Volume Controls */}
          <div className="relative flex items-center space-x-2">
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
                  ref={volumeRef}
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

          {/* Like Button */}
          {currentTrack && (
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
          )}

          {/* Queue Toggle */}
          <button
            onClick={() => onToggleQueue?.()}
            className={`p-2 rounded-full transition-colors ${
              showQueue ? 'text-blue-500' : 'text-gray-400 hover:text-white'
            }`}
          >
            <List className="h-5 w-5" />
          </button>

          {/* Fullscreen Toggle */}
          <button
            onClick={() => onToggleFullscreen?.()}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerControls;
