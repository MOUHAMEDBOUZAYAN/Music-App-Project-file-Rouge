import React from 'react';
import { Play, Heart, MoreVertical } from 'lucide-react';

const AlbumCard = ({ album, onPlay, onLike, isLiked = false }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors group">
      {/* Album Cover */}
      <div className="relative mb-4">
        <img
          src={album.coverUrl || 'https://via.placeholder.com/200/1DB954/FFFFFF?text=🎵'}
          alt={album.title}
          className="w-full aspect-square rounded-lg object-cover"
        />
        <button
          onClick={() => onPlay(album)}
          className="absolute bottom-2 right-2 bg-green-500 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-green-600"
        >
          <Play className="h-5 w-5" />
        </button>
      </div>

      {/* Album Info */}
      <div className="space-y-2">
        <h3 className="text-white font-semibold truncate">{album.title}</h3>
        <p className="text-gray-400 text-sm truncate">{album.artist}</p>
        
        <div className="flex items-center justify-between">
          <span className="text-gray-500 text-xs">
            {album.releaseYear} • {album.trackCount} tracks
          </span>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onLike(album.id)}
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
      </div>
    </div>
  );
};

export default AlbumCard; 