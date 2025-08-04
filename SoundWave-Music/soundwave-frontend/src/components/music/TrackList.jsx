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

  // Mock data if no tracks provided
  const defaultTracks = tracks.length === 0 ? [
    {
      id: 1,
      title: 'Blinding Lights',
      artist: 'The Weeknd',
      album: 'After Hours',
      duration: 200,
      coverUrl: 'https://via.placeholder.com/48/1DB954/FFFFFF?text=BL'
    },
    {
      id: 2,
      title: 'Dance Monkey',
      artist: 'Tones and I',
      album: 'The Kids Are Coming',
      duration: 210,
      coverUrl: 'https://via.placeholder.com/48/1DB954/FFFFFF?text=DM'
    },
    {
      id: 3,
      title: 'Shape of You',
      artist: 'Ed Sheeran',
      album: '÷ (Divide)',
      duration: 235,
      coverUrl: 'https://via.placeholder.com/48/1DB954/FFFFFF?text=SOY'
    },
    {
      id: 4,
      title: 'Uptown Funk',
      artist: 'Mark Ronson ft. Bruno Mars',
      album: 'Uptown Special',
      duration: 270,
      coverUrl: 'https://via.placeholder.com/48/1DB954/FFFFFF?text=UF'
    },
    {
      id: 5,
      title: 'Despacito',
      artist: 'Luis Fonsi ft. Daddy Yankee',
      album: 'Vida',
      duration: 229,
      coverUrl: 'https://via.placeholder.com/48/1DB954/FFFFFF?text=DES'
    }
  ] : tracks;

  return (
    <div className="space-y-2">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-4">
          <h3 className="text-white font-semibold">Tracks</h3>
          <span className="text-gray-400 text-sm">{defaultTracks.length} songs</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Play className="h-4 w-4" />
            <span>Play All</span>
          </button>
        </div>
      </div>

      {/* Track List */}
      <div className="space-y-1">
        {defaultTracks.map((track, index) => (
          <div
            key={track.id}
            className={`flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-800 transition-colors group ${
              currentTrack?.id === track.id ? 'bg-gray-800' : ''
            }`}
          >
            {/* Track Number */}
            <div className="w-8 text-center text-gray-400 text-sm">
              {index + 1}
            </div>

            {/* Album Cover */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={track.coverUrl}
                alt={track.title}
                className="w-full h-full rounded object-cover"
              />
              <button
                onClick={() => handlePlay(track)}
                className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {currentTrack?.id === track.id && isPlaying ? (
                  <Pause className="h-5 w-5 text-white" />
                ) : (
                  <Play className="h-5 w-5 text-white" />
                )}
              </button>
            </div>

            {/* Track Info */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium truncate ${
                currentTrack?.id === track.id ? 'text-blue-500' : 'text-white'
              }`}>
                {track.title}
              </h4>
              <p className="text-gray-400 text-sm truncate">{track.artist}</p>
            </div>

            {/* Album */}
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-gray-400 text-sm truncate">{track.album}</p>
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-2">
              <span className="text-gray-400 text-sm">
                {formatDuration(track.duration)}
              </span>
              
              <button
                onClick={() => handleLike(track.id)}
                className={`p-1 rounded hover:bg-gray-700 transition-colors ${
                  likedTracks.has(track.id) ? 'text-green-500' : 'text-gray-400 hover:text-white'
                }`}
              >
                <Heart className="h-4 w-4" fill={likedTracks.has(track.id) ? 'currentColor' : 'none'} />
              </button>
              
              <button className="p-1 text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {defaultTracks.length === 0 && (
        <div className="text-center py-12">
          <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No tracks available</p>
          <p className="text-gray-500">Add some music to get started</p>
        </div>
      )}
    </div>
  );
};

export default TrackList; 