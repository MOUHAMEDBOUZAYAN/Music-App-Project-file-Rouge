import React from 'react';
import { Play, Heart, MoreVertical, Clock } from 'lucide-react';

const SongCard = ({ song, onPlay, onLike, isLiked = false }) => {
  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors group">
      {/* Album Cover */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <img
          src={song.coverUrl || song.cover || 'https://via.placeholder.com/48/1DB954/FFFFFF?text=🎵'}
          alt={song.title}
          className="w-full h-full rounded object-cover"
        />
        <button
          onClick={() => onPlay(song)}
          className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Play className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Song Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-medium truncate">{song.title}</h4>
        <p className="text-gray-400 text-sm truncate">{song.artist}</p>
      </div>

      {/* Album */}
      <div className="hidden md:block flex-1 min-w-0">
        <p className="text-gray-400 text-sm truncate">{song.album}</p>
      </div>

      {/* Duration */}
      <div className="flex items-center space-x-2">
        <span className="text-gray-400 text-sm">
          {formatDuration(song.duration || 180)}
        </span>
        
        <button
          onClick={() => onLike(song.id)}
          className={`p-1 rounded hover:bg-gray-700 transition-colors ${
            isLiked ? 'text-green-500' : 'text-gray-400 hover:text-white'
          }`}
        >
          <Heart className="h-4 w-4" fill={isLiked ? 'currentColor' : 'none'} />
        </button>
        
        <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
          <MoreVertical className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export default SongCard; 