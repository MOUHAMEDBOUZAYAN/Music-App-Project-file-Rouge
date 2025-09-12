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
  MoreVertical,
  Users,
  Clock,
  Music2
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
    <div className="min-h-screen bg-black text-white pb-48 md:pb-32">
      {/* Header avec bouton retour seulement - Style Spotify */}
      <div className="sticky top-0 z-10 bg-black/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-6 py-4">
          <button 
            onClick={() => navigate('/library')}
            className="p-2 rounded-full bg-gray-800 hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Bannière de la playlist - Style Spotify exact */}
      <div className="relative h-96">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black"></div>
        <img
          src={playlist.songs && playlist.songs.length > 0 && playlist.songs[0].coverImage 
            ? `http://localhost:5000${playlist.songs[0].coverImage}` 
            : `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop&crop=center`}
          alt={playlist.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = `https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1200&h=400&fit=crop&crop=center`;
          }}
        />
        
        {/* Badge Playlist - Style Spotify */}
        <div className="absolute top-6 left-6 flex items-center space-x-2 bg-purple-500/90 backdrop-blur-sm px-3 py-1 rounded-full">
          <Music className="h-4 w-4 text-white" />
          <span className="text-xs font-medium text-white">
            {playlist.isPublic ? 'Playlist publique' : 'Playlist privée'}
          </span>
        </div>

        {/* Informations de la playlist - Style Spotify */}
        <div className="absolute bottom-6 left-6 right-6">
          <h1 className="text-6xl font-black text-white mb-4">
            {playlist.name}
          </h1>
          <p className="text-gray-300 text-lg mb-2">
            {playlist.songs?.length || 0} chanson{(playlist.songs?.length || 0) > 1 ? 's' : ''} • Créée par {playlist.owner?.username || user?.username || 'Utilisateur'}
          </p>
          {playlist.description && (
            <p className="text-gray-300 text-sm max-w-2xl line-clamp-2">
              {playlist.description}
            </p>
          )}
        </div>
      </div>

      {/* Actions (favori comme Spotify) */}
      <div className="px-6 pt-3">
        <div className="flex items-center space-x-4">
          <button
            onClick={handlePlayPlaylist}
            className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 transition-colors"
            aria-label="Ajouter aux favoris"
            title="Ajouter aux favoris"
          >
            <Heart className="h-5 w-5" />
          </button>
          
          {/* Bouton S'abonner */}
          <button
            className="px-4 py-3 rounded-full transition-colors bg-green-500 text-black font-medium hover:bg-green-400"
            aria-label="S'abonner"
            title="S'abonner"
          >
            S'abonner
          </button>
          
          <button className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700" aria-label="Partager">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17V7h2v7.17l3.59-3.59L17 10l-5 5z"/>
            </svg>
          </button>
          <button className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700" aria-label="Plus d'options">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Bouton de lecture principal - Style Spotify exact */}
      <div className="px-6 pt-4">
        <button
          onClick={handlePlayPlaylist}
          className="w-16 h-16 rounded-full bg-green-500 flex items-center justify-center shadow-xl hover:scale-105 hover:bg-green-400 transition-all duration-200"
          aria-label="Lecture de la playlist"
        >
          <Play className="h-8 w-8 text-black ml-1" />
        </button>
      </div>

      {/* Logo de l'app */}
      <div className="px-6 pt-3">
        <div className="flex items-center space-x-2">
          <img src="/icons/LogoS.svg" alt="SoundWave" className="w-6 h-6" />
          <span className="text-gray-400 text-sm">SoundWave</span>
        </div>
      </div>

      {/* Description de la playlist - Style Spotify */}
      <div className="px-6 pt-2">
        <p className="text-gray-300 text-sm leading-relaxed">
          {playlist.description || `Une collection de ${playlist.songs?.length || 0} chansons soigneusement sélectionnées.`}
        </p>
      </div>

      {/* Statistiques de la playlist - Style Spotify */}
      <div className="px-6 pt-4">
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {Math.floor(Math.random() * 10000 + 1000).toLocaleString('fr-FR')} auditeurs
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Music className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {playlist.songs?.length || 0} titres
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-gray-400" />
            <span className="text-gray-400">
              {playlist.songs?.reduce((total, song) => total + (song.duration || 0), 0) 
                ? `${Math.floor(playlist.songs.reduce((total, song) => total + (song.duration || 0), 0) / 60)} min`
                : '—'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Section Ajouter des chansons - Style Spotify */}
      {showAddSongs && playlist && playlist.owner && playlist.owner._id === user._id && (
        <div className="px-6 py-6">
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-6">Ajouter des chansons</h2>
            
            {/* Search Input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une chanson..."
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
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
                <div className="space-y-1">
                  {searchResults.map((song) => (
                    <div key={song._id} className="group flex items-center p-4 rounded-lg hover:bg-gray-800/50 transition-colors">
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                        <img 
                          src={song.coverImage ? `http://localhost:5000${song.coverImage}` : 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'} 
                          alt={song.title} 
                          className="w-full h-full object-cover" 
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                          }}
                        />
                      </div>
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center space-x-2">
                          <h3 className="font-medium text-white truncate">{song.title}</h3>
                        </div>
                        <p className="text-sm text-gray-400 truncate">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                      </div>
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => handlePlaySong(song)} className="p-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors">
                          <Play className="h-4 w-4 text-black ml-0.5" />
                        </button>
                        <button onClick={() => handleAddSong(song)} className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg text-sm transition-colors">
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
              <div className="mb-6 p-4 bg-gray-800 rounded-lg text-center">
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
          </div>
        </div>
      )}

      {/* Section Chansons de la playlist - Style Spotify exact */}
      <div className="px-6 py-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-6">Chansons de la playlist</h2>
          {playlist.songs && playlist.songs.length > 0 ? (
            <>
              {/* Liste compacte mobile comme Spotify */}
              <div className="md:hidden divide-y divide-gray-800 rounded-lg overflow-hidden bg-transparent">
                {playlist.songs.map((song, index) => (
                  <div key={song._id} className="flex items-center px-3 py-3 hover:bg-gray-800/50 transition-colors">
                    <span className="w-6 text-gray-400 mr-3 text-sm font-medium">{index + 1}</span>
                    <div className="w-12 h-12 rounded bg-gray-800 overflow-hidden mr-3 flex-shrink-0">
                      <img 
                        src={song.coverImage ? `http://localhost:5000${song.coverImage}` : 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'} 
                        alt={song.title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white text-sm font-medium truncate">{song.title}</div>
                      <div className="text-gray-400 text-xs truncate">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</div>
                    </div>
                    <div className="ml-3 flex items-center space-x-3">
                      <button onClick={() => handlePlaySong(song)} className="text-gray-300 hover:text-white transition-colors">
                        <Play className="h-4 w-4" />
                      </button>
                      <button onClick={() => handlePlaySong(song)} className="w-8 h-8 rounded-full bg-green-500 text-black flex items-center justify-center hover:scale-105 transition-transform">
                        <Play className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Liste desktop actuelle */}
              <div className="hidden md:block space-y-1">
                {playlist.songs.map((song, index) => (
                  <div 
                    key={song._id} 
                    className="group flex items-center p-4 rounded-lg hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 flex items-center justify-center text-gray-400 group-hover:text-white transition-colors font-medium flex-shrink-0 mr-8">
                      {index + 1}
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg overflow-hidden flex-shrink-0 mr-12">
                      <img 
                        src={song.coverImage ? `http://localhost:5000${song.coverImage}` : 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop'} 
                        alt={song.title} 
                        className="w-full h-full object-cover" 
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=100&h=100&fit=crop';
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0 mr-8">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-white truncate">{song.title}</h3>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                    </div>
                    <div className="flex items-center space-x-8 text-sm text-gray-400 flex-shrink-0">
                      <span className="hidden lg:block w-24 text-right mr-8">{song.plays || '—'}</span>
                      <span className="w-16 text-right mr-8">{song.duration ? `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}` : '—'}</span>
                      <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); handlePlaySong(song); }} className="p-2 rounded-full bg-green-500 hover:bg-green-400 transition-colors">
                          <Play className="h-4 w-4 text-black ml-0.5" />
                        </button>
                        <button onClick={(e) => { e.stopPropagation(); handlePlaySong(song); }} className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition-colors">
                          <Music2 className="h-4 w-4 text-white" />
                        </button>
                        {playlist && playlist.owner && playlist.owner._id === user._id && (
                          <button onClick={(e) => { e.stopPropagation(); handleRemoveSong(song._id); }} className="p-2 rounded-full bg-red-500 hover:bg-red-400 transition-colors">
                            <X className="h-4 w-4 text-white" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Aucune chanson dans cette playlist</h3>
              <p className="text-gray-400">Utilisez le bouton "Ajouter des chansons" pour commencer</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlaylistView;
