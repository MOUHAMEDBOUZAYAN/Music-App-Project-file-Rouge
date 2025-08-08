import React from 'react';
import { Play, Pause, MoreVertical, X, Music } from 'lucide-react';

const Queue = ({
  queue = [],
  currentTrack,
  isPlaying,
  onPlayTrack,
  onRemoveFromQueue,
  onClearQueue,
  onPlayPause
}) => {
  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getQueuePosition = (trackId) => {
    return queue.findIndex(track => track.id === trackId) + 1;
  };

  if (queue.length === 0) {
    return (
      <div className="p-6 text-center">
        <Music className="h-12 w-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400 text-lg">Queue vide</p>
        <p className="text-gray-500 text-sm">Ajoutez des chansons à votre queue pour commencer</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div>
          <h3 className="text-lg font-semibold text-white">Queue</h3>
          <p className="text-gray-400 text-sm">
            {queue.length} chanson{queue.length > 1 ? 's' : ''} • 
            {formatDuration(queue.reduce((total, track) => total + (track.duration || 0), 0))}
          </p>
        </div>
        <button
          onClick={onClearQueue}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Current Track */}
      {currentTrack && (
        <div className="p-4 border-b border-gray-700">
          <h4 className="text-sm font-medium text-gray-400 mb-3">En cours</h4>
          <div className="flex items-center space-x-3 p-3 bg-blue-600 bg-opacity-20 rounded-lg">
            <img
              src={currentTrack.cover || 'https://via.placeholder.com/48/1DB954/FFFFFF?text=🎵'}
              alt={currentTrack.title}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium truncate">{currentTrack.title}</p>
              <p className="text-gray-300 text-sm truncate">{currentTrack.artist}</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">
                {formatDuration(currentTrack.duration)}
              </span>
              <button
                onClick={onPlayPause}
                className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Queue List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <h4 className="text-sm font-medium text-gray-400 mb-3">
            Suivant ({queue.length})
          </h4>
          
          <div className="space-y-2">
            {queue.map((track, index) => (
              <div
                key={track.id}
                className="flex items-center space-x-3 p-2 hover:bg-gray-700 rounded-lg transition-colors group"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <span className="text-gray-500 text-sm w-6 text-center">
                    {index + 1}
                  </span>
                  <img
                    src={track.cover || 'https://via.placeholder.com/40/1DB954/FFFFFF?text=🎵'}
                    alt={track.title}
                    className="w-10 h-10 rounded object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {track.title}
                    </p>
                    <p className="text-gray-400 text-xs truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <span className="text-gray-500 text-xs">
                    {formatDuration(track.duration)}
                  </span>
                  <button
                    onClick={() => onPlayTrack(track)}
                    className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <Play className="h-3 w-3" />
                  </button>
                  <button
                    onClick={() => onRemoveFromQueue(track.id)}
                    className="p-1 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                  >
                    <X className="h-3 w-3" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                    <MoreVertical className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">
            Durée totale: {formatDuration(queue.reduce((total, track) => total + (track.duration || 0), 0))}
          </span>
          <button
            onClick={onClearQueue}
            className="text-gray-400 hover:text-white transition-colors"
          >
            Vider la queue
          </button>
        </div>
      </div>
    </div>
  );
};

export default Queue;
