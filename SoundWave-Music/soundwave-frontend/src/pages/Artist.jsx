import React, { useState } from 'react';
import { User, Music, Heart, Play, Plus, Search } from 'lucide-react';

const Artist = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [followedArtists, setFollowedArtists] = useState([]);

  // Mock data for featured artists
  const featuredArtists = [
    {
      id: 1,
      name: 'Taylor Swift',
      genre: 'Pop',
      followers: '85.2M',
      image: 'https://via.placeholder.com/150/1DB954/FFFFFF?text=TS',
      isFollowed: false
    },
    {
      id: 2,
      name: 'Drake',
      genre: 'Hip-Hop',
      followers: '67.8M',
      image: 'https://via.placeholder.com/150/1DB954/FFFFFF?text=DR',
      isFollowed: false
    },
    {
      id: 3,
      name: 'Ed Sheeran',
      genre: 'Pop',
      followers: '52.1M',
      image: 'https://via.placeholder.com/150/1DB954/FFFFFF?text=ES',
      isFollowed: false
    },
    {
      id: 4,
      name: 'Beyoncé',
      genre: 'R&B',
      followers: '45.9M',
      image: 'https://via.placeholder.com/150/1DB954/FFFFFF?text=BE',
      isFollowed: false
    },
    {
      id: 5,
      name: 'The Weeknd',
      genre: 'R&B',
      followers: '38.7M',
      image: 'https://via.placeholder.com/150/1DB954/FFFFFF?text=TW',
      isFollowed: false
    },
    {
      id: 6,
      name: 'Ariana Grande',
      genre: 'Pop',
      followers: '42.3M',
      image: 'https://via.placeholder.com/150/1DB954/FFFFFF?text=AG',
      isFollowed: false
    }
  ];

  const handleFollowArtist = (artistId) => {
    setFollowedArtists(prev => {
      if (prev.includes(artistId)) {
        return prev.filter(id => id !== artistId);
      } else {
        return [...prev, artistId];
      }
    });
  };

  const filteredArtists = featuredArtists.filter(artist =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    artist.genre.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Artists</h1>
        <p className="text-gray-300">Discover and follow your favorite artists</p>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <div className="relative">
          <input
            type="text"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        </div>
      </div>

      {/* Featured Artists */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Featured Artists</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArtists.map((artist) => (
            <div key={artist.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={artist.image}
                  alt={artist.name}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div className="flex-1">
                  <h3 className="text-white font-semibold text-lg">{artist.name}</h3>
                  <p className="text-gray-400 text-sm">{artist.genre}</p>
                  <p className="text-gray-500 text-xs">{artist.followers} followers</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                  <Play className="h-3 w-3" />
                  <span>Play</span>
                </button>
                <button
                  onClick={() => handleFollowArtist(artist.id)}
                  className={`flex items-center space-x-1 px-3 py-1 rounded text-sm transition-colors ${
                    followedArtists.includes(artist.id)
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'text-gray-400 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Heart className="h-3 w-3" />
                  <span>{followedArtists.includes(artist.id) ? 'Following' : 'Follow'}</span>
                </button>
                <button className="flex items-center space-x-1 text-gray-400 hover:text-white px-3 py-1 rounded text-sm transition-colors">
                  <Plus className="h-3 w-3" />
                  <span>More</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredArtists.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No artists found</p>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </div>

      {/* Genres Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Browse by Genre</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {['Pop', 'Hip-Hop', 'R&B', 'Rock', 'Electronic', 'Jazz'].map((genre) => (
            <button
              key={genre}
              className="bg-gray-800 text-white p-4 rounded-lg hover:bg-gray-750 transition-colors text-center"
            >
              <Music className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <span className="text-sm font-medium">{genre}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Artist; 