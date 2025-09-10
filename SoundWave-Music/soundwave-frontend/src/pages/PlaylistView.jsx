import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { playlistService } from '../services/playlistService.js';
import { songService } from '../services/songService.js';
import { useMusic } from '../store/MusicContext.jsx';
import { 
  Plus, 
  Music, 
  Search, 
  X, 
  Play, 
  Heart, 
  ArrowLeft,
  Globe,
  Lock,
  MoreVertical
} from 'lucide-react';
import toast from 'react-hot-toast';

const PlaylistView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const { playPlaylist, playTrack } = useMusic();
  
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddSongs, setShowAddSongs] = useState(false);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      console.log('❌ User not authenticated, redirecting to login');
      navigate('/login');
    } else {
      console.log('✅ User authenticated:', user);
      console.log('👤 Current user details:', {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      });
    }
  }, [isAuthenticated, navigate, user]);

  // Load playlist data
  useEffect(() => {
    const loadPlaylist = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const response = await playlistService.getPlaylistById(id);
        if (response.success) {
          setPlaylist(response.data);
          console.log('✅ Playlist loaded:', response.data);
          console.log('🔍 Playlist owner details:', {
            ownerId: response.data.owner._id,
            ownerUsername: response.data.owner.username,
            ownerEmail: response.data.owner.email
          });
          console.log('🔍 Current user vs owner:', {
            currentUserId: user._id,
            playlistOwnerId: response.data.owner._id,
            isOwner: user._id === response.data.owner._id
          });
        } else {
          toast.error('Playlist non trouvée');
          navigate('/library');
        }
      } catch (error) {
        console.error('Error loading playlist:', error);
        toast.error('Erreur lors du chargement de la playlist');
        navigate('/library');
      } finally {
        setLoading(false);
      }
    };

    loadPlaylist();
  }, [id, navigate]);

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    
    console.log('🔍 Starting search for:', searchQuery);
    console.log('🔍 API Base URL:', 'http://localhost:5000/api');
    setIsSearching(true);
    try {
      const response = await songService.searchSongs(searchQuery);
      console.log('🔍 Search response:', response);
      console.log('🔍 Response type:', typeof response);
      console.log('🔍 Response keys:', Object.keys(response || {}));
      
      if (response && response.success) {
        setSearchResults(response.data || []);
        console.log('🔍 Search results:', response.data);
        console.log('🔍 Results count:', response.data?.length || 0);
        if (response.data?.length > 0) {
          toast.success(`${response.data.length} résultats trouvés`);
        } else {
          toast.info('Aucun résultat trouvé');
        }
      } else {
        console.error('🔍 Search failed:', response);
        toast.error('Erreur lors de la recherche');
      }
    } catch (error) {
      console.error('🔍 Search error:', error);
      console.error('🔍 Error details:', error.response?.data);
      console.error('🔍 Error status:', error.response?.status);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  // Auto-search when typing (debounced)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        handleSearch();
      } else {
        setSearchResults([]);
      }
    }, 500); // 500ms delay

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  // Add song to playlist
  const handleAddSong = async (song) => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour modifier cette playlist');
      return;
    }
    
    if (!user) {
      toast.error('Informations utilisateur manquantes');
      return;
    }
    
    // Check if user is the owner of the playlist
    if (playlist && playlist.owner && playlist.owner._id !== user._id) {
      toast.error('Vous n\'êtes pas le propriétaire de cette playlist');
      return;
    }
    
    try {
      console.log('➕ Adding song to playlist:', { 
        playlistId: id, 
        songId: song._id,
        songTitle: song.title,
        userId: user._id,
        username: user.username,
        playlistOwner: playlist?.owner?._id,
        playlistOwnerUsername: playlist?.owner?.username,
        isOwner: playlist?.owner?._id === user._id
      });
      
      const response = await playlistService.addSongToPlaylist(id, song._id);
      console.log('➕ Add response:', response);
      
      if (response.success) {
        // Update local playlist state
        setPlaylist(prev => ({
          ...prev,
          songs: [...(prev.songs || []), song],
          songsCount: (prev.songsCount || 0) + 1
        }));
        toast.success(`${song.title} ajoutée à la playlist`);
      } else {
        console.error('➕ Add failed:', response.error);
        toast.error(response.error || 'Erreur lors de l\'ajout de la chanson');
      }
    } catch (error) {
      console.error('Error adding song:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 403) {
        toast.error('Vous n\'êtes pas autorisé à modifier cette playlist');
      } else if (error.response?.status === 401) {
        toast.error('Vous devez être connecté pour modifier cette playlist');
      } else {
        toast.error('Erreur lors de l\'ajout de la chanson');
      }
    }
  };

  // Remove song from playlist
  const handleRemoveSong = async (songId) => {
    if (!isAuthenticated) {
      toast.error('Vous devez être connecté pour modifier cette playlist');
      return;
    }
    
    if (!user) {
      toast.error('Informations utilisateur manquantes');
      return;
    }
    
    // Check if user is the owner of the playlist
    if (playlist && playlist.owner && playlist.owner._id !== user._id) {
      toast.error('Vous n\'êtes pas le propriétaire de cette playlist');
      return;
    }
    
    try {
      console.log('🗑️ Removing song from playlist:', { 
        playlistId: id, 
        songId, 
        userId: user._id,
        username: user.username,
        playlistOwner: playlist?.owner?._id,
        playlistOwnerUsername: playlist?.owner?.username,
        isOwner: playlist?.owner?._id === user._id
      });
      
      const response = await playlistService.removeSongFromPlaylist(id, songId);
      console.log('🗑️ Remove response:', response);
      
      if (response.success) {
        // Update local playlist state
        setPlaylist(prev => ({
          ...prev,
          songs: prev.songs.filter(s => s._id !== songId),
          songsCount: prev.songsCount - 1
        }));
        toast.success('Chanson retirée de la playlist');
      } else {
        console.error('🗑️ Remove failed:', response.error);
        toast.error(response.error || 'Erreur lors de la suppression de la chanson');
      }
    } catch (error) {
      console.error('Error removing song:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      if (error.response?.status === 403) {
        toast.error('Vous n\'êtes pas autorisé à modifier cette playlist');
      } else if (error.response?.status === 401) {
        toast.error('Vous devez être connecté pour modifier cette playlist');
      } else {
        toast.error('Erreur lors de la suppression de la chanson');
      }
    }
  };

  // Play playlist
  const handlePlayPlaylist = () => {
    if (playlist.songs && playlist.songs.length > 0) {
      const playlistData = {
        name: playlist.name,
        tracks: playlist.songs
      };
      playPlaylist(playlistData, 0);
      toast.success(`Lecture de la playlist "${playlist.name}"`);
    } else {
      toast.error('Aucune chanson dans la playlist');
    }
  };

  // Play single song
  const handlePlaySong = (song) => {
    playTrack(song);
    toast.success(`Lecture de ${song.title}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Chargement de la playlist...</p>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Playlist non trouvée</p>
          <button
            onClick={() => navigate('/library')}
            className="mt-4 px-6 py-2 bg-green-500 text-black rounded-full font-semibold hover:bg-green-400 transition-colors"
          >
            Retour à la bibliothèque
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="relative bg-gradient-to-b from-gray-800 to-black">
        <div className="px-6 py-8">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate('/library')}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold">Playlist</h1>
          </div>

          <div className="flex items-end gap-6">
            {/* Playlist Cover */}
            <div className="w-56 h-56 bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="flex flex-col items-center text-gray-400">
                <Music className="h-16 w-16 mb-2" />
                <span className="text-sm">
                  {playlist.isPublic ? 'Playlist publique' : 'Playlist privée'}
                </span>
              </div>
            </div>

            {/* Playlist Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {playlist.isPublic ? (
                  <Globe className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-white">
                  {playlist.isPublic ? 'Playlist publique' : 'Playlist privée'}
                </span>
              </div>
              
              <h2 className="text-6xl font-black text-white mb-4">
                {playlist.name}
              </h2>
              
              <p className="text-gray-300 mb-4">
                {playlist.description || 'Aucune description'}
              </p>
              
              <div className="flex items-center gap-2 text-gray-300">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                  alt="User"
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium">{user?.username || 'Utilisateur'}</span>
                <span>• {playlist.songs?.length || 0} titres</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button
              onClick={handlePlayPlaylist}
              className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform"
            >
              <Play className="h-6 w-6 text-black ml-1" fill="currentColor" />
            </button>
            
            {playlist && playlist.owner && playlist.owner._id === user._id ? (
              <button
                onClick={() => setShowAddSongs(!showAddSongs)}
                className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-full font-semibold transition-colors"
              >
                <Plus className="h-5 w-5" />
                {showAddSongs ? 'Masquer l\'ajout' : 'Ajouter des chansons'}
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-gray-600 text-gray-300 px-6 py-3 rounded-full font-semibold">
                <Lock className="h-5 w-5" />
                Vous ne pouvez pas modifier cette playlist
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Songs Section */}
      {showAddSongs && playlist && playlist.owner && playlist.owner._id === user._id && (
        <div className="px-6 py-6">
          <div className="bg-gray-800 rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-white">Ajouter des chansons</h3>
            
            {/* Search Input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une chanson..."
                className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="h-5 w-5" />
                {isSearching ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-medium text-gray-300 mb-4">Résultats de recherche ({searchResults.length}):</h4>
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {searchResults.map((song) => (
                    <div key={song._id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center gap-4">
                        <img
                          src={song.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=60&h=60&fit=crop'}
                          alt={song.title}
                          className="w-12 h-12 rounded object-cover"
                        />
                        <div>
                          <p className="text-white font-medium">{song.title}</p>
                          <p className="text-gray-400 text-sm">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handlePlaySong(song)}
                          className="p-2 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors"
                        >
                          <Play className="h-4 w-4 text-white" />
                        </button>
                        <button
                          onClick={() => handleAddSong(song)}
                          className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg text-sm transition-colors"
                        >
                          Ajouter
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No Results Message */}
            {searchQuery && !isSearching && searchResults.length === 0 && (
              <div className="mb-6 p-4 bg-gray-700 rounded-lg text-center">
                <p className="text-gray-400">Aucun résultat trouvé pour "{searchQuery}"</p>
                <p className="text-gray-500 text-sm mt-1">Essayez avec d'autres mots-clés</p>
                <div className="mt-3 p-3 bg-blue-900/30 rounded-lg">
                  <p className="text-blue-300 text-sm">
                    <strong>Conseil:</strong> Essayez de rechercher:
                  </p>
                  <ul className="text-blue-300 text-sm mt-2 ml-4">
                    <li>• "7arak" (recherche complète)</li>
                    <li>• "7" (recherche partielle)</li>
                    <li>• "Souvenir" (autre chanson)</li>
                    <li>• "Show" (nom d'artiste)</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Debug Info */}
            {true && (
              <div className="mb-4 p-3 bg-gray-800 rounded-lg text-xs text-gray-400">
                <p><strong>Debug Info:</strong></p>
                <p>Search Query: "{searchQuery}"</p>
                <p>Is Searching: {isSearching.toString()}</p>
                <p>Results Count: {searchResults.length}</p>
                <p>API URL: http://localhost:5000/api</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Songs List */}
      <div className="px-6 pb-6">
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">
            Chansons dans la playlist ({playlist.songs?.length || 0})
          </h3>
          
          {playlist.songs && playlist.songs.length > 0 ? (
            <div className="space-y-2">
              {playlist.songs.map((song, index) => (
                <div key={song._id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                  <div className="flex items-center gap-4">
                    <span className="text-gray-400 text-sm w-8">{index + 1}</span>
                    <img
                      src={song.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop'}
                      alt={song.title}
                      className="w-10 h-10 rounded object-cover"
                    />
                    <div>
                      <p className="text-white font-medium">{song.title}</p>
                      <p className="text-gray-400 text-sm">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlaySong(song)}
                      className="p-2 bg-gray-600 hover:bg-gray-500 rounded-full transition-colors"
                    >
                      <Play className="h-4 w-4 text-white" />
                    </button>
                    {playlist && playlist.owner && playlist.owner._id === user._id && (
                      <button
                        onClick={() => handleRemoveSong(song._id)}
                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">Aucune chanson dans cette playlist</p>
              <p className="text-gray-500">Utilisez le bouton "Ajouter des chansons" pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
