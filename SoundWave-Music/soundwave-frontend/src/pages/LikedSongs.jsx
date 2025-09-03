import React, { useState, useEffect } from 'react';
import { Heart, Play, Shuffle, MoreVertical, Clock, User } from 'lucide-react';
import TrackList from '../components/music/TrackList';
import { useMusic } from '../store/MusicContext';
import { songService } from '../services/songService';

const LikedSongs = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('dateAdded'); // dateAdded, title, artist, duration
  const { likedTracks, toggleLike } = useMusic();

  useEffect(() => {
    const loadLikedSongs = async () => {
      try {
        // Charger directement depuis l'API
        const res = await songService.getLikedSongs();
        const apiSongs = Array.isArray(res?.data?.data) ? res.data.data : [];
        const results = apiSongs.map(s => {
          if (s.type === 'external') {
            return {
              id: s.externalId,
              title: s.title || `Titre ${s.externalId}`,
              artist: s.artist || 'Artiste inconnu',
              album: s.album || '—',
              duration: s.duration || 180,
              cover: s.cover || 'https://via.placeholder.com/40/1DB954/FFFFFF?text=🎵',
              dateAdded: (s.createdAt ? new Date(s.createdAt) : new Date()).toISOString().split('T')[0],
              isLiked: true
            };
          }
          return {
            id: s._id,
            title: s.title,
            artist: s.artist || 'Artiste inconnu',
            album: s.album || '—',
            duration: s.duration || 180,
            cover: s.cover || 'https://via.placeholder.com/40/1DB954/FFFFFF?text=🎵',
            dateAdded: (s.createdAt ? new Date(s.createdAt) : new Date()).toISOString().split('T')[0],
            isLiked: true
          };
        });

        setLikedSongs(results);
        setIsLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement des musiques likées:', error);
        setLikedSongs([]);
        setIsLoading(false);
      }
    };

    loadLikedSongs();
    
    return () => {};
  }, [likedTracks]);

  // Sort songs based on selected criteria
  const sortedSongs = [...likedSongs].sort((a, b) => {
    switch (sortBy) {
      case 'title':
        return a.title.localeCompare(b.title);
      case 'artist':
        return a.artist.localeCompare(b.artist);
      case 'duration':
        return a.duration - b.duration;
      case 'dateAdded':
      default:
        return new Date(b.dateAdded) - new Date(a.dateAdded);
    }
  });

  const handlePlayAll = () => {
    // TODO: Implement play all functionality
    console.log('Playing all liked songs');
  };

  const handleShuffle = () => {
    // TODO: Implement shuffle functionality
    console.log('Shuffling liked songs');
  };

  const handleRemoveFromLiked = (songId) => {
    try {
      // Mettre à jour le contexte (source de vérité)
      toggleLike(songId);
      // Mettre à jour l'état local
      setLikedSongs(prev => prev.filter(song => song.id !== songId));
      
      console.log(`Musique ${songId} retirée des favoris`);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-lg p-8">
        <div className="flex items-center space-x-6">
          <div className="w-32 h-32 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
            <Heart className="h-16 w-16 text-white" fill="white" />
          </div>
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-2">Chansons aimées</h1>
            <p className="text-white text-opacity-90 mb-4">
              {likedSongs.length} chanson{likedSongs.length > 1 ? 's' : ''} • 
              {formatDuration(likedSongs.reduce((total, song) => total + song.duration, 0))}
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={handlePlayAll}
                className="flex items-center space-x-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-gray-100 transition-colors"
              >
                <Play className="h-5 w-5" />
                <span>Lecture</span>
              </button>
              <button
                onClick={handleShuffle}
                className="flex items-center space-x-2 bg-white bg-opacity-20 text-white px-6 py-3 rounded-full font-medium hover:bg-opacity-30 transition-colors"
              >
                <Shuffle className="h-5 w-5" />
                <span>Mélanger</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-white">Toutes les chansons</h2>
          <span className="text-gray-400">({likedSongs.length})</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <label className="text-gray-400 text-sm">Trier par:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 text-white border border-gray-700 rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="dateAdded">Date d'ajout</option>
            <option value="title">Titre</option>
            <option value="artist">Artiste</option>
            <option value="duration">Durée</option>
          </select>
        </div>
      </div>

      {/* Songs List */}
      {likedSongs.length === 0 ? (
        <div className="text-center py-12">
          <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">Aucune chanson aimée</p>
          <p className="text-gray-500">Likez des chansons pour les voir ici</p>
        </div>
      ) : (
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-700 text-gray-400 text-sm font-medium">
            <div className="col-span-1">#</div>
            <div className="col-span-5">Titre</div>
            <div className="col-span-3">Artiste</div>
            <div className="col-span-2">Album</div>
            <div className="col-span-1 text-right">Durée</div>
          </div>
          
          {sortedSongs.map((song, index) => (
            <div
              key={song.id}
              className="grid grid-cols-12 gap-4 p-4 hover:bg-gray-750 transition-colors group"
            >
              <div className="col-span-1 flex items-center">
                <span className="text-gray-400 text-sm">{index + 1}</span>
              </div>
              
              <div className="col-span-5 flex items-center space-x-3">
                <img
                  src={song.cover}
                  alt={song.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{song.title}</p>
                  <p className="text-gray-400 text-sm truncate">{song.album}</p>
                </div>
              </div>
              
              <div className="col-span-3 flex items-center">
                <p className="text-gray-300 truncate">{song.artist}</p>
              </div>
              
              <div className="col-span-2 flex items-center">
                <p className="text-gray-400 text-sm truncate">{song.album}</p>
              </div>
              
              <div className="col-span-1 flex items-center justify-between">
                <span className="text-gray-400 text-sm">
                  {formatDuration(song.duration)}
                </span>
                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleRemoveFromLiked(song.id)}
                    className="p-1 text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <Heart className="h-4 w-4" fill="currentColor" />
                  </button>
                  <button className="p-1 text-gray-400 hover:text-white transition-colors">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Statistiques</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{likedSongs.length}</div>
            <div className="text-gray-400 text-sm">Chansons aimées</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">
              {formatDuration(likedSongs.reduce((total, song) => total + song.duration, 0))}
            </div>
            <div className="text-gray-400 text-sm">Durée totale</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500">
              {new Set(likedSongs.map(song => song.artist)).size}
            </div>
            <div className="text-gray-400 text-sm">Artistes différents</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LikedSongs;
