import React from 'react';
import { User, Music, Heart, MoreVertical, Play } from 'lucide-react';

const UserCard = ({ user, onFollow, onPlay, isFollowing = false }) => {
  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getRandomColor = () => {
    const colors = [
      'from-blue-500 to-purple-500',
      'from-green-500 to-blue-500',
      'from-purple-500 to-pink-500',
      'from-yellow-500 to-orange-500',
      'from-red-500 to-pink-500',
      'from-indigo-500 to-purple-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors group">
      {/* User Avatar and Info */}
      <div className="flex items-center space-x-4 mb-4">
        <div className={`w-16 h-16 bg-gradient-to-br ${getRandomColor()} rounded-full flex items-center justify-center flex-shrink-0`}>
          {user.avatar ? (
            <img
              src={user.avatar}
              alt={user.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span className="text-white text-xl font-bold">
              {getInitials(user.name)}
            </span>
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-lg truncate">{user.name}</h3>
          <p className="text-gray-400 text-sm truncate">@{user.username}</p>
          {user.isArtist && (
            <div className="flex items-center space-x-1 mt-1">
              <Music className="h-3 w-3 text-blue-500" />
              <span className="text-blue-500 text-xs font-medium">Artist</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onFollow(user.id)}
            className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              isFollowing
                ? 'bg-green-600 text-white hover:bg-green-700'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Heart className="h-3 w-3" fill={isFollowing ? 'currentColor' : 'none'} />
            <span>{isFollowing ? 'Following' : 'Follow'}</span>
          </button>
          
          <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
            <MoreVertical className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-3 gap-4 mb-4 text-center">
        <div>
          <div className="text-white font-semibold">{user.followers || 0}</div>
          <div className="text-gray-400 text-xs">Followers</div>
        </div>
        <div>
          <div className="text-white font-semibold">{user.following || 0}</div>
          <div className="text-gray-400 text-xs">Following</div>
        </div>
        <div>
          <div className="text-white font-semibold">{user.playlists || 0}</div>
          <div className="text-gray-400 text-xs">Playlists</div>
        </div>
      </div>

      {/* Bio */}
      {user.bio && (
        <div className="mb-4">
          <p className="text-gray-300 text-sm line-clamp-2">{user.bio}</p>
        </div>
      )}

      {/* Recent Activity */}
      {user.recentTracks && user.recentTracks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-white font-medium text-sm">Recently Played</h4>
          <div className="space-y-1">
            {user.recentTracks.slice(0, 3).map((track, index) => (
              <div key={index} className="flex items-center space-x-2 p-2 rounded hover:bg-gray-700 transition-colors">
                <img
                  src={track.coverUrl || 'https://via.placeholder.com/32/1DB954/FFFFFF?text=🎵'}
                  alt={track.title}
                  className="w-8 h-8 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{track.title}</p>
                  <p className="text-gray-400 text-xs truncate">{track.artist}</p>
                </div>
                <button
                  onClick={() => onPlay(track)}
                  className="p-1 text-gray-400 hover:text-white hover:bg-gray-600 rounded transition-colors"
                >
                  <Play className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Location */}
      {user.location && (
        <div className="flex items-center space-x-1 text-gray-400 text-xs mt-4 pt-4 border-t border-gray-700">
          <span>📍 {user.location}</span>
        </div>
      )}
    </div>
  );
};

export default UserCard; 