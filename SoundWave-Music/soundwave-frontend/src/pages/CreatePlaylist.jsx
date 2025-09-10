import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { playlistService } from '../services/playlistService.js';
import { songService } from '../services/songService.js';
import { apiClient, endpoints } from '../services/api.js';
import { Music, Plus, Search, X, ChevronRight, Clock, Play, MoreHorizontal, Globe, Lock, Heart, Save } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const [name, setName] = useState('Ma playlist n°1');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState([]);
  const [albums, setAlbums] = useState([]);
  const [mode, setMode] = useState('songs');
  const [albumTracks, setAlbumTracks] = useState({});
  const [recommended, setRecommended] = useState([]);
  const [searchFilter, setSearchFilter] = useState('all'); // 'all', 'songs', 'artists', 'albums'

  const [selectedSongs, setSelectedSongs] = useState([]);
  const [creating, setCreating] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setAlbums([]);
      setMode('songs');
      return;
    }

    const controller = new AbortController();

    const handle = setTimeout(async () => {
      setSearching(true);
      try {
        console.log('🔍 Recherche de chansons pour:', query);
        
        // Search for songs directly using API
        let songsRes = null;
        try {
          console.log('🔍 Tentative de recherche via API...');
          // Try the correct endpoint first
          songsRes = await apiClient.get('/songs/search', { 
            params: { q: query, limit: 15 }, 
            signal: controller.signal 
          });
          console.log('📥 Réponse de recherche API:', songsRes?.data);
        } catch (err) {
          console.error('❌ Erreur de recherche API:', err);
          // Fallback to songService
          try {
            console.log('🔄 Tentative de recherche via songService...');
            songsRes = await songService.searchSongs({ q: query, limit: 15 });
            console.log('📥 Fallback songService:', songsRes);
          } catch (fallbackErr) {
            console.error('❌ Erreur fallback songService:', fallbackErr);
            // Try alternative endpoints
            try {
              console.log('🔄 Tentative de recherche alternative...');
            songsRes = await apiClient.get('/songs', {
              params: { q: query, limit: 15 },
              signal: controller.signal
            });
              console.log('📥 Recherche alternative:', songsRes?.data);
            } catch (altErr) {
              console.error('❌ Erreur recherche alternative:', altErr);
              // Try search endpoint
              try {
                console.log('🔄 Tentative de recherche search...');
                songsRes = await apiClient.get('/search/songs', {
                  params: { q: query, limit: 15 },
                  signal: controller.signal
                });
                console.log('📥 Recherche search:', songsRes?.data);
              } catch (searchErr) {
                console.error('❌ Erreur recherche search:', searchErr);
              }
            }
          }
        }

        let list = [];
        if (songsRes?.data?.data) {
          list = songsRes.data.data;
        } else if (songsRes?.data) {
          list = Array.isArray(songsRes.data) ? songsRes.data : [];
        } else if (songsRes?.success && songsRes.data) {
          list = Array.isArray(songsRes.data) ? songsRes.data : [];
        } else if (songsRes?.results) {
          list = Array.isArray(songsRes.results) ? songsRes.results : [];
        }

        console.log('🎵 Chansons trouvées:', list);
        console.log('📊 Nombre de chansons:', list.length);

        // Si aucune chanson trouvée, afficher un message d'erreur
        if (!list || list.length === 0) {
          console.log('ℹ️ Aucune chanson trouvée dans la base de données');
          // Ne pas afficher toast ici car c'est normal si pas de résultats
        }

        // Apply search filter
        let filteredResults = list;
        if (searchFilter === 'songs') {
          filteredResults = list.filter(song => song.title || song.name);
        } else if (searchFilter === 'artists') {
          filteredResults = list.filter(song => song.artist);
        } else if (searchFilter === 'albums') {
          filteredResults = list.filter(song => song.album);
        }
        
        setMode('songs');
        setResults(filteredResults);
        setAlbums([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(handle);
    };
  }, [query, searchFilter]);

  const fetchAlbumTracks = async (albumId) => {
    if (albumTracks[albumId]) return;
    try {
      const res = await apiClient.get(endpoints.albums.songs(albumId));
      const tracks = res?.data || [];
      setAlbumTracks(prev => ({ ...prev, [albumId]: tracks }));
    } catch (_) {
      // noop
    }
  };

  // Load recommended songs
  useEffect(() => {
    const loadRecommended = async () => {
      try {
        const res = await songService.getTrendingSongs({ limit: 12 });
        if (res.success) {
          const list = res.data?.data || res.data || [];
          setRecommended(list);
        }
      } catch (_) {
        // Default recommendations for demo
        setRecommended([
          {
            id: 'demo-1',
            title: 'RBI M3ANA',
            artist: 'Stormy',
            album: 'ICEBERG',
            duration: '3:22',
            cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop'
          },
          {
            id: 'demo-2',
            title: 'TWINS',
            artist: 'Stormy',
            album: 'OMEGA',
            duration: '2:58',
            cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=64&h=64&fit=crop'
          },
          {
            id: 'demo-3',
            title: 'Lalla w Mali',
            artist: 'Fayoumi',
            album: 'Lalla w Mali',
            duration: '4:12',
            cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=64&h=64&fit=crop'
          }
        ]);
      }
    };
    loadRecommended();
  }, []);

  const selectedIds = useMemo(() => new Set(selectedSongs.map(s => s._id || s.id)), [selectedSongs]);

  const addSong = (song) => {
    const id = song._id || song.id;
    if (selectedIds.has(id)) {
      toast.error('Cette chanson est déjà dans la playlist');
      return;
    }
    setSelectedSongs(prev => [...prev, song]);
    toast.success(`${song.title || song.name} ajoutée à la playlist`);
  };

  const removeSong = (songId) => {
    const song = selectedSongs.find(s => (s._id || s.id) === songId);
    setSelectedSongs(prev => prev.filter(s => (s._id || s.id) !== songId));
    if (song) {
      toast.success(`${song.title || song.name} retirée de la playlist`);
    }
  };

  const handleCreate = async () => {
    if (!name.trim()) {
      toast.error('Veuillez entrer un nom pour votre playlist');
      return;
    }
    
    setCreating(true);
    try {
      console.log('🎵 Création de la playlist...', { name, description, isPublic, songsCount: selectedSongs.length });
      
      const payload = {
        name: name.trim(),
        description: description.trim(),
        isPublic,
        songs: selectedSongs.map(s => s._id || s.id)
      };
      
      console.log('📤 Payload envoyé:', payload);
      
      const res = await playlistService.createPlaylist(payload);
      console.log('📥 Réponse reçue:', res);
      
      if (res.success) {
        const created = res.data?.data || res.data;
        console.log('✅ Playlist créée avec succès:', created);
        
        toast.success(`Playlist "${name}" créée avec succès!`);
        
        if (created && created._id) {
          navigate(`/playlist/${created._id}`);
          return;
        }
        navigate('/playlists');
      } else {
        console.error('❌ Erreur lors de la création:', res.error);
        toast.error(`Erreur lors de la création de la playlist: ${res.error}`);
      }
    } catch (error) {
      console.error('💥 Erreur lors de la création de la playlist:', error);
      toast.error(`Erreur lors de la création de la playlist: ${error.message || 'Erreur inconnue'}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Main Header with Playlist Info */}
      <div className="relative bg-gradient-to-b from-gray-800 to-black">
        <div className="px-6 py-8">
          <div className="flex items-end gap-6">
            {/* Playlist Cover */}
            <div className="w-56 h-56 bg-gray-800 rounded-lg shadow-2xl flex items-center justify-center relative overflow-hidden">
              <div className="flex flex-col items-center text-gray-400">
                <Music className="h-16 w-16 mb-2" />
                <span className="text-sm">Playlist publique</span>
              </div>
            </div>

            {/* Playlist Details */}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                {isPublic ? (
                  <Globe className="h-4 w-4 text-green-500" />
                ) : (
                  <Lock className="h-4 w-4 text-gray-400" />
                )}
                <span className="text-sm font-medium text-white">
                  {isPublic ? 'Playlist publique' : 'Playlist privée'}
                </span>
              </div>
              
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-6xl font-black text-white outline-none mb-4 w-full"
                placeholder="Ma playlist"
              />
              
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ajoutez une description à votre playlist..."
                className="bg-transparent text-gray-300 outline-none mb-4 w-full resize-none"
                rows={2}
              />
              
              <div className="flex items-center gap-2 text-gray-300">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                  alt="User"
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium">{user?.username || 'Yassin Bouryou'}</span>
                <span>• {selectedSongs.length} titres</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4 mt-8">
            <button className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center hover:scale-105 transition-transform">
              <Play className="h-6 w-6 text-black ml-1" fill="currentColor" />
            </button>
            <button className="text-gray-400 hover:text-white">
              <Heart className="h-8 w-8" />
            </button>
            <button 
              onClick={() => setShowSearchModal(true)}
              className="text-gray-400 hover:text-white"
            >
              <Plus className="h-8 w-8" />
            </button>
            <button 
              onClick={() => setIsPublic(!isPublic)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${
                isPublic 
                  ? 'border-green-500 text-green-500 hover:bg-green-500 hover:text-black' 
                  : 'border-gray-600 text-gray-400 hover:border-gray-400 hover:text-white'
              }`}
            >
              {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
              {isPublic ? 'Publique' : 'Privée'}
            </button>
            <button className="text-gray-400 hover:text-white">
              <MoreHorizontal className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="px-6">
        {/* Header with Add Button */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Chansons</h2>
          <button
            onClick={() => setShowSearchModal(true)}
            className="bg-green-500 hover:bg-green-600 text-black font-bold px-4 py-2 rounded-full transition-colors flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Ajouter des chansons
          </button>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-4 py-2 text-gray-400 text-sm font-medium border-b border-gray-800 mb-4">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Titre</div>
          <div className="col-span-3">Album</div>
          <div className="col-span-1">Date d'ajout</div>
          <div className="col-span-1 text-right">
            <Clock className="h-4 w-4 ml-auto" />
          </div>
        </div>

        {/* Selected Songs */}
        <div className="space-y-1">
          {selectedSongs.length === 0 ? (
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-300 mb-2">Votre playlist est vide</h3>
              <p className="text-gray-500 mb-6">Ajoutez des chansons pour commencer à créer votre playlist</p>
              <button
                onClick={() => setShowSearchModal(true)}
                className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-3 rounded-full transition-colors"
              >
                <Plus className="h-5 w-5 inline mr-2" />
                Ajouter des chansons
              </button>
            </div>
          ) : (
            selectedSongs.map((song, index) => (
            <div
              key={song._id || song.id || index}
              className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-800/50 group"
            >
              <div className="col-span-1 flex items-center">
                <span className="text-gray-400 group-hover:hidden">{index + 1}</span>
                <button className="hidden group-hover:block text-white">
                  <Play className="h-4 w-4" />
                </button>
              </div>
              
              <div className="col-span-6 flex items-center gap-3">
                <img 
                  src={song.cover || song.coverImage || song.album?.cover || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop'} 
                  alt={song.title || song.name}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="text-white font-medium">{song.title || song.name}</p>
                  <p className="text-gray-400 text-sm">
                    {typeof song.artist === 'object' 
                      ? (song.artist?.username || song.artist?.name || 'Artiste inconnu')
                      : (song.artist || 'Artiste inconnu')
                    }
                  </p>
                </div>
              </div>
              
              <div className="col-span-3 flex items-center">
                <span className="text-gray-400 text-sm hover:text-white cursor-pointer">
                  {song.album?.title || song.album?.name || song.album || '—'}
                </span>
              </div>
              
              <div className="col-span-1 flex items-center">
                <span className="text-gray-400 text-sm">il y a 19 minutes</span>
              </div>
              
              <div className="col-span-1 flex items-center justify-end">
                <button
                  onClick={() => removeSong(song.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white mr-2"
                >
                  <X className="h-4 w-4" />
                </button>
                <span className="text-gray-400 text-sm">{song.duration || '—'}</span>
              </div>
            </div>
            ))
          )}
        </div>
      </div>

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-start justify-center pt-16">
          <div className="bg-gray-900 rounded-lg w-full max-w-2xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
              <h2 className="text-xl font-bold">Cherchons du contenu à ajouter à votre playlist</h2>
              <button
                onClick={() => setShowSearchModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-6 border-b border-gray-800">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Recherchez des titres, artistes ou albums..."
                  className="w-full bg-gray-800 text-white pl-12 pr-4 py-3 rounded-md outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              
              {/* Search Filters */}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setSearchFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    searchFilter === 'all'
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Tout
                </button>
                <button
                  onClick={() => setSearchFilter('songs')}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    searchFilter === 'songs'
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Titres
                </button>
                <button
                  onClick={() => setSearchFilter('artists')}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    searchFilter === 'artists'
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Artistes
                </button>
                <button
                  onClick={() => setSearchFilter('albums')}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    searchFilter === 'albums'
                      ? 'bg-green-500 text-black'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Albums
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {searching && (
                <div className="p-6 text-center text-gray-400">
                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
                  <p className="text-lg font-semibold">Recherche en cours...</p>
                  <p className="text-sm">Recherche de chansons pour "{query}"</p>
                </div>
              )}

              {!searching && query && results.length === 0 && albums.length === 0 && (
                <div className="p-6 text-center text-gray-400">
                  <Search className="h-12 w-12 mx-auto mb-4 text-gray-600" />
                  <h3 className="text-lg font-semibold mb-2">Aucun résultat trouvé</h3>
                  <p className="text-sm">Essayez avec d'autres mots-clés ou vérifiez votre connexion</p>
                  <p className="text-xs mt-2">Filtre actuel: {searchFilter}</p>
                </div>
              )}

              {/* Album Results */}
              {mode === 'albums' && albums.map((album) => (
                <div key={album._id || album.id || Math.random()} className="p-4 hover:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <img 
                      src={album.cover || album.artwork || album.coverUrl} 
                      alt="cover" 
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{album.title || album.name}</p>
                      <p className="text-gray-400 text-sm">Album • {album.artist?.name || album.artist || 'Artiste'}</p>
                    </div>
                    <button
                      onClick={() => fetchAlbumTracks(album._id || album.id)}
                      className="text-gray-400 hover:text-white"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Album Tracks */}
                  {albumTracks[album._id || album.id] && (
                    <div className="mt-4 ml-20 space-y-2">
                      {albumTracks[album._id || album.id].map((song) => (
                        <div key={song._id || song.id || Math.random()} className="flex items-center gap-4 p-2 rounded hover:bg-gray-700/50">
                          <div className="w-6 text-center text-gray-500 text-sm">•</div>
                          <div className="flex-1">
                            <p className="text-white text-sm">{song.title || song.name}</p>
                            <p className="text-gray-400 text-xs">{song.artist?.name || song.artist || 'Artiste'}</p>
                          </div>
                          <button
                            onClick={() => {
                              addSong(song);
                              setShowSearchModal(false);
                            }}
                            disabled={selectedIds.has(song._id || song.id)}
                            className="px-3 py-1 rounded-full border border-gray-600 text-xs text-white hover:bg-white hover:text-black disabled:opacity-50"
                          >
                            Ajouter
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Song Results */}
              {mode === 'songs' && results.map((song) => (
                <div key={song._id || song.id || Math.random()} className="p-4 hover:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <img 
                      src={song.coverImage || song.cover || song.album?.cover || song.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop'} 
                      alt="cover" 
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{typeof song.title === 'string' ? song.title : song.name || 'Titre inconnu'}</p>                       <p className="text-gray-400 text-sm">
                        {typeof song.artist === 'object' 
                          ? (song.artist?.username || song.artist?.name || 'Artiste inconnu')
                          : (song.artist || 'Artiste inconnu')
                        }
                      </p>
                    </div>
                    <div className="text-gray-400 text-sm mr-4">
                      {song.album?.title || song.album?.name || '—'}
                    </div>
                    <button
                      onClick={() => {
                        addSong(song);
                        setShowSearchModal(false);
                      }}
                      disabled={selectedIds.has(song._id || song.id)}
                      className="px-4 py-2 rounded-full border border-gray-600 text-sm text-white hover:bg-white hover:text-black disabled:opacity-50"
                    >
                      Ajouter
                    </button>
                  </div>
                </div>
              ))}

              {/* Quick Links */}
              {mode === 'songs' && results.length > 0 && (
                <div className="p-4 border-t border-gray-800">
                  <div className="flex gap-6 text-sm">
                    <button 
                      onClick={() => setSearchFilter('artists')}
                      className="text-gray-400 hover:text-white"
                    >
                      Voir tous les artistes
                    </button>
                    <button 
                      onClick={() => setSearchFilter('albums')}
                      className="text-gray-400 hover:text-white"
                    >
                      Voir tous les albums
                    </button>
                    <button 
                      onClick={() => setSearchFilter('songs')}
                      className="text-gray-400 hover:text-white"
                    >
                      Voir tous les titres
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Recommendations Section */}
      <div className="px-6 py-8">
        <h3 className="text-2xl font-bold mb-6">Recommandés</h3>
        <p className="text-gray-400 text-sm mb-6">En fonction du contenu de cette playlist</p>
        
        <div className="space-y-1">
          {recommended.map((song) => (
            <div
              key={song._id || song.id || Math.random()}
              className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-800/50 group"
            >
              <div className="col-span-6 flex items-center gap-3">
                <img 
                  src={song.coverImage || song.cover || song.album?.cover || song.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop'} 
                  alt="cover" 
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="text-white font-medium">{song.title || song.name}</p>
                  <p className="text-gray-400 text-sm">
                    {typeof song.artist === 'object' 
                      ? (song.artist?.username || song.artist?.name || 'Artiste inconnu')
                      : (song.artist || 'Artiste inconnu')
                    }
                  </p>
                </div>
              </div>
              
              <div className="col-span-4 flex items-center">
                <span className="text-gray-400 text-sm hover:text-white cursor-pointer">
                  {song.album?.title || song.album?.name || song.album || '—'}
                </span>
              </div>
              
              <div className="col-span-2 flex items-center justify-end gap-2">
                <button
                  onClick={() => addSong(song)}
                  disabled={selectedIds.has(song._id || song.id)}
                  className="px-4 py-1 rounded-full border border-gray-600 text-sm text-gray-200 hover:bg-white hover:text-black disabled:opacity-50"
                >
                  Ajouter
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t border-gray-800">
          <button className="text-green-500 hover:text-green-400 font-medium">
            Actualiser
          </button>
        </div>
      </div>

      {/* Create Button - Fixed */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={handleCreate}
          disabled={creating}
          className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transition-colors"
        >
          <Save className="h-5 w-5" />
          {creating ? 'Création...' : 'Créer la playlist'}
        </button>
      </div>
    </div>
  );
};

export default CreatePlaylist;