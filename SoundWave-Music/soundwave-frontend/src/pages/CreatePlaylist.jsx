import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { playlistService } from '../services/playlistService.js';
import { songService } from '../services/songService.js';
import { apiClient, endpoints } from '../services/api.js';
import { Music, Plus, Search, X, ChevronRight, Clock, Play, MoreHorizontal, Globe, Lock, Heart, Save } from 'lucide-react';

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
        // Search for artists first
        let artistsRes = null;
        try {
          artistsRes = await apiClient.get(endpoints.search.artists, { params: { q: query, limit: 1 }, signal: controller.signal });
        } catch (err) {
          // ignore cancellation/timeouts
        }
        const artists = artistsRes?.data || artistsRes?.results || [];

        if (Array.isArray(artists) && artists.length > 0) {
          const artist = artists[0];
          try {
            const albumsRes = await apiClient.get(endpoints.artists.albums(artist._id || artist.id), { params: { limit: 12 }, signal: controller.signal });
            const artistAlbums = albumsRes?.data || [];
            if (Array.isArray(artistAlbums) && artistAlbums.length > 0) {
              setMode('albums');
              setAlbums(artistAlbums);
              setResults([]);
              return;
            }
          } catch (_) {
            // fallback to songs
          }
        }

        // Search for songs (local) puis fallback Deezer si vide
        let localRes = null;
        try {
          localRes = await songService.searchSongs({ q: query, limit: 15 });
        } catch (_) {}

        let list = localRes?.success ? (localRes.data?.data || localRes.data || []) : [];

        // Removed Deezer fallback
        // if (!list || list.length === 0) {
        //   try {
        //     const deezer = await DeezerService.search(query, 15);
        //     list = (deezer?.data || []).map((t) => ({
        //       id: `deezer-${t.id}`,
        //       externalId: t.id,
        //       provider: 'deezer',
        //       title: t.title,
        //       artist: t.artist?.name,
        //       album: t.album?.title,
        //       duration: t.duration ? `${Math.floor(t.duration / 60)}:${String(t.duration % 60).padStart(2, '0')}` : '3:00',
        //       cover: t.album?.cover || t.album?.cover_medium,
        //     }));
        //   } catch (_) {}
        // }

        setMode('songs');
        setResults(list || []);
        setAlbums([]);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(handle);
    };
  }, [query]);

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
    if (selectedIds.has(id)) return;
    setSelectedSongs(prev => [...prev, song]);
  };

  const removeSong = (songId) => {
    setSelectedSongs(prev => prev.filter(s => (s._id || s.id) !== songId));
  };

  const handleCreate = async () => {
    if (!name.trim()) return;
    setCreating(true);
    try {
      const payload = {
        name: name.trim(),
        description: description.trim(),
        isPublic,
        songs: selectedSongs.map(s => s._id || s.id)
      };
      const res = await playlistService.createPlaylist(payload);
      if (res.success) {
        const created = res.data?.data;
        if (created && created._id) {
          navigate(`/playlist/${created._id}`);
          return;
        }
        navigate('/playlists');
      }
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
              <p className="text-sm font-medium text-white mb-2">Playlist publique</p>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-transparent text-6xl font-black text-white outline-none mb-4 w-full"
                placeholder="Ma playlist"
              />
              <div className="flex items-center gap-2 text-gray-300">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
                  alt="User"
                  className="w-6 h-6 rounded-full"
                />
                <span className="font-medium">{user?.username || 'Yassin Bouryou'}</span>
                <span>• {selectedSongs.length} titres, </span>
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
            <button className="text-gray-400 hover:text-white">
              <MoreHorizontal className="h-8 w-8" />
            </button>
          </div>
        </div>
      </div>

      {/* Songs List */}
      <div className="px-6">
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
          {selectedSongs.map((song, index) => (
            <div
              key={song.id}
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
                  src={song.cover} 
                  alt={song.title}
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="text-white font-medium">{song.title}</p>
                  <p className="text-gray-400 text-sm">{song.artist}</p>
                </div>
              </div>
              
              <div className="col-span-3 flex items-center">
                <span className="text-gray-400 text-sm hover:text-white cursor-pointer">
                  {song.album}
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
                <span className="text-gray-400 text-sm">{song.duration}</span>
              </div>
            </div>
          ))}
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
            </div>

            {/* Search Results */}
            <div className="max-h-96 overflow-y-auto">
              {searching && (
                <div className="p-6 text-center text-gray-400">
                  Recherche en cours...
                </div>
              )}

              {!searching && query && results.length === 0 && albums.length === 0 && (
                <div className="p-6 text-center text-gray-400">
                  Aucun résultat trouvé
                </div>
              )}

              {/* Album Results */}
              {mode === 'albums' && albums.map((album) => (
                <div key={album._id || album.id} className="p-4 hover:bg-gray-800">
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
                        <div key={song._id || song.id} className="flex items-center gap-4 p-2 rounded hover:bg-gray-700/50">
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
                <div key={song._id || song.id} className="p-4 hover:bg-gray-800">
                  <div className="flex items-center gap-4">
                    <img 
                      src={song.cover || song.album?.cover || song.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop'} 
                      alt="cover" 
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-white font-medium">{song.title || song.name}</p>
                      <p className="text-gray-400 text-sm">{song.artist?.name || song.artist || 'Artiste inconnu'}</p>
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
                    <button className="text-gray-400 hover:text-white">Voir tous les artistes</button>
                    <button className="text-gray-400 hover:text-white">Voir tous les albums</button>
                    <button className="text-gray-400 hover:text-white">Voir tous les titres</button>
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
              key={song._id || song.id}
              className="grid grid-cols-12 gap-4 px-4 py-2 rounded-md hover:bg-gray-800/50 group"
            >
              <div className="col-span-6 flex items-center gap-3">
                <img 
                  src={song.cover || song.album?.cover || song.coverUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=64&h=64&fit=crop'} 
                  alt="cover" 
                  className="w-10 h-10 rounded object-cover"
                />
                <div>
                  <p className="text-white font-medium">{song.title || song.name}</p>
                  <p className="text-gray-400 text-sm">{song.artist?.name || song.artist || 'Artiste'}</p>
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