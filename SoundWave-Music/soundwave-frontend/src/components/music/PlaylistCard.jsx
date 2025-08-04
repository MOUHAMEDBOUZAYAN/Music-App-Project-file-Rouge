import React from 'react';
import { Play, Heart, MoreVertical, Music, Clock } from 'lucide-react';

const PlaylistCard = ({ playlist, onPlay, onLike, isLiked = false }) => {
  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const getRandomColor = () => {
    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-purple-500',
      'from-green-500 to-blue-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors group">
      {/* Playlist Cover */}
      <div className="relative mb-4">
        <div className={`w-full aspect-square rounded-lg bg-gradient-to-br ${getRandomColor()} flex items-center justify-center`}>
          <Music className="h-12 w-12 text-white" />
        </div>
        <button
          onClick={() => onPlay(playlist)}
          className="absolute bottom-2 right-2 bg-green-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-600"
        >
          <Play className="h-5 w-5" />
        </button>
      </div>

      {/* Playlist Info */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold truncate">{playlist.name}</h3>
        <p className="text-gray-400 text-sm line-clamp-2">{playlist.description || 'No description'}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Music className="h-3 w-3" />
              <span>{playlist.songCount || 0} songs</span>
            </span>
            {playlist.duration && (
              <span className="flex items-center space-x-1">
                <Clock className="h-3 w-3" />
                <span>{formatDuration(playlist.duration)}</span>
              </span>
            )}
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onLike(playlist.id)}
              className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Heart className="h-3 w-3" fill={isLiked ? 'currentColor' : 'none'} />
            </button>
            
            <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
              <MoreVertical className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Creator Info */}
        {playlist.creator && (
          <div className="flex items-center space-x-2 pt-2 border-t border-gray-700">
            <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {playlist.creator.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-gray-400 text-xs">by {playlist.creator}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlaylistCard; 