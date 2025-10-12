import React, { useState } from 'react';
import { Play, Pause, Heart, MoreVertical, Clock, Music } from 'lucide-react';
import SongCard from './SongCard';

const TrackList = ({ tracks = [], onPlay, onLike, currentTrack = null, isPlaying = false }) => {
  const [likedTracks, setLikedTracks] = useState(new Set());

  const handlePlay = (track) => {
    if (onPlay) {
      onPlay(track);
    }
  };

  const handleLike = (trackId) => {
    setLikedTracks(prev => {
      const newSet = new Set(prev);
      if (newSet.has(trackId)) {
        newSet.delete(trackId);
      } else {
        newSet.add(trackId);
      }
      return newSet;
    });
    
    if (onLike) {
      onLike(trackId);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Use real tracks from database only
  const displayTracks = tracks || [];

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-4">
          <h3 className="text-white font-semibold">Chansons</h3>
          <span className="text-gray-400 text-sm">{displayTracks.length} chanson{displayTracks.length > 1 ? 's' : ''}</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Play className="h-4 w-4" />
            <span>Tout jouer</span>
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        {displayTracks.map((track, index) => (
          <div
            key={track.id || track._id || index}
            className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors group ${
              currentTrack?.id === track.id || currentTrack?._id === track._id ? 'bg-gray-800' : ''
            }`}
          >
            {/* Track Number */}
            <div className="w-8 text-center text-gray-400 text-sm">
              {index + 1}
            </div>

            {/* Album Cover */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={track.coverUrl || track.coverImage || track.cover || `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=48&h=48&fit=crop`}
                alt={track.title}
                className="w-full h-full rounded object-cover"
                onError={(e) => {
                  e.target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=48&h=48&fit=crop`;
                }}
              />
              <button
                onClick={() => handlePlay(track)}
                className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {(currentTrack?.id === track.id || currentTrack?._id === track._id) && isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white" />
                )}
              </button>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium truncate ${
                (currentTrack?.id === track.id || currentTrack?._id === track._id) ? 'text-blue-500' : 'text-white'
              }`}>
                {track.title || track.name || 'Titre inconnu'}
              </h4>
              <p className="text-gray-400 text-sm truncate">
                {track.artist?.name || track.artist?.username || track.artist || 'Artiste inconnu'}
              </p>
            </div>

            {/* Album */}
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-gray-400 text-sm truncate">
                {track.album?.title || track.album?.name || track.album || 'Album inconnu'}
              </p>
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">
                {formatDuration(track.duration || 180)}
              </span>
              
              <button
                onClick={() => handleLike(track.id || track._id)}
                className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                  likedTracks.has(track.id || track._id) ? 'text-green-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className="h-4 w-4" fill={likedTracks.has(track.id || track._id) ? 'currentColor' : 'none'} />
              </button>
              
              <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {displayTracks.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Aucune chanson disponible</p>
          <p className="text-gray-500">Ajoutez de la musique pour commencer</p>
        </div>
      )}
    </div>
  );
};

export default TrackList; 