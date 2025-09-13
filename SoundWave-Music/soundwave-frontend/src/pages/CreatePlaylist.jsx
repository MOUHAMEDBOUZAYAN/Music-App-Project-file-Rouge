import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { playlistService } from '../services/playlistService.js';
import { songService } from '../services/songService.js';
import { Save, Music, Globe, Lock, Plus, Search, X, Play, Sparkles, Headphones, Volume2, Star } from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePlaylist = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [creating, setCreating] = useState(false);
  
  // Search states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [selectedSongs, setSelectedSongs] = useState([]);

  // Search function
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      const response = await songService.searchSongs(searchQuery);
      if (response.success) {
        setSearchResults(response.data || []);
      } else {
        toast.error('Erreur lors de la recherche');
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Erreur lors de la recherche');
    } finally {
      setIsSearching(false);
    }
  };

  // Add song to playlist
  const handleAddSong = (song) => {
    if (!selectedSongs.find(s => s._id === song._id)) {
      setSelectedSongs([...selectedSongs, song]);
      toast.success(`${song.title} ajoutée à la playlist`);
    }
  };

  // Remove song from playlist
  const handleRemoveSong = (songId) => {
    setSelectedSongs(selectedSongs.filter(s => s._id !== songId));
    toast.success('Chanson retirée de la playlist');
  };

  // Redirect if not authenticated
  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!name.trim()) {
      toast.error('Veuillez entrer un nom pour votre playlist');
      return;
    }
    
    setCreating(true);
    
    try {
      console.log('🎵 Creating playlist:', { name, description, isPublic });
      
      const payload = {
        name: name.trim(),
        description: description.trim(),
        isPublic,
        songs: selectedSongs.map(s => s._id) // Include selected songs
      };
      
      const res = await playlistService.createPlaylist(payload);
      console.log('📥 Response received:', res);
      
      if (res.success) {
        const created = res.data?.data || res.data;
        console.log('✅ Playlist created successfully:', created);
        
        // Save to localStorage for Sidebar and Library
        try {
          const existingPlaylists = JSON.parse(localStorage.getItem('userPlaylists') || '[]');
          console.log('💾 Existing playlists in localStorage:', existingPlaylists.length);
          
          const newPlaylist = {
            _id: created._id,
            id: created._id,
            name: created.name,
            description: created.description,
            isPublic: created.isPublic,
            songs: created.songs || [],
            owner: created.owner || user,
            createdAt: new Date().toISOString()
          };
          
          console.log('💾 New playlist to save:', newPlaylist);
          
          const updatedPlaylists = [...existingPlaylists, newPlaylist];
          localStorage.setItem('userPlaylists', JSON.stringify(updatedPlaylists));
          
          console.log('💾 Updated playlists count:', updatedPlaylists.length);
          console.log('💾 localStorage after save:', JSON.parse(localStorage.getItem('userPlaylists') || '[]').length);
          
          // Dispatch event to update Sidebar and Library
          window.dispatchEvent(new CustomEvent('localStorageChange'));
          
          console.log('💾 localStorageChange event dispatched');
          console.log('💾 Playlist saved to localStorage for Sidebar and Library');
        } catch (error) {
          console.error('❌ Error saving playlist to localStorage:', error);
        }
        
        toast.success(`Playlist "${name}" créée avec succès!`);
        
        // Clear form
        setName('');
        setDescription('');
        
        console.log('🎵 Ready to create another playlist');
        
      } else {
        console.error('❌ Error creating playlist:', res.error);
        toast.error(`Erreur lors de la création de la playlist: ${res.error}`);
      }
    } catch (error) {
      console.error('❌ Error creating playlist:', error);
      toast.error('Erreur lors de la création de la playlist');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Background Effects - Spotify style */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-black to-green-600/5"></div>
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_50%,rgba(29,185,84,0.1),transparent_50%)]"></div>
      <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(30,215,96,0.08),transparent_50%)]"></div>
      
      {/* Floating Elements - Green theme */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full blur-xl opacity-15 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-gradient-to-r from-green-500 to-green-600 rounded-full blur-xl opacity-10 animate-pulse delay-1000"></div>
      
      <div className="relative z-10 p-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white via-green-200 to-emerald-200 bg-clip-text text-transparent">
              Créer une playlist
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Créez votre playlist personnalisée et partagez votre passion musicale avec le monde
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Headphones className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Informations de la playlist</h2>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-6">
                {/* Playlist Name */}
                <div className="space-y-3">
                  <label htmlFor="playlistName" className="block text-sm font-semibold text-white/90 mb-2">
                    Nom de la playlist *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="playlistName"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Entrez le nom de votre playlist"
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/70"
                      required
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Playlist Description */}
                <div className="space-y-3">
                  <label htmlFor="playlistDescription" className="block text-sm font-semibold text-white/90 mb-2">
                    Description
                  </label>
                  <div className="relative">
                    <textarea
                      id="playlistDescription"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Décrivez votre playlist (optionnel)"
                      rows={4}
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 resize-none backdrop-blur-sm transition-all duration-300 hover:bg-gray-800/70"
                    />
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>

                {/* Privacy Setting */}
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-white/90 mb-3">
                    Visibilité
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className={`relative cursor-pointer group ${isPublic ? 'ring-2 ring-green-500' : ''}`}>
                      <input
                        type="radio"
                        name="privacy"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${isPublic 
                        ? 'bg-green-500/20 border-green-500 text-white' 
                        : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-800/70 hover:border-gray-500'}`}>
                        <div className="flex items-center gap-3">
                          <Globe className="h-5 w-5" />
                          <span className="font-medium">Publique</span>
                        </div>
                        <p className="text-xs mt-1 opacity-80">Visible par tous</p>
                      </div>
                    </label>
                    <label className={`relative cursor-pointer group ${!isPublic ? 'ring-2 ring-green-500' : ''}`}>
                      <input
                        type="radio"
                        name="privacy"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="sr-only"
                      />
                      <div className={`p-4 rounded-xl border-2 transition-all duration-300 ${!isPublic 
                        ? 'bg-green-500/20 border-green-500 text-white' 
                        : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:bg-gray-800/70 hover:border-gray-500'}`}>
                        <div className="flex items-center gap-3">
                          <Lock className="h-5 w-5" />
                          <span className="font-medium">Privée</span>
                        </div>
                        <p className="text-xs mt-1 opacity-80">Seulement vous</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Create Button */}
                <button
                  type="submit"
                  disabled={creating || !name.trim()}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black font-bold py-4 px-6 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5 disabled:transform-none"
                >
                  {creating ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-black/30 border-t-black"></div>
                      Création...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      Créer la playlist
                    </>
                  )}
                </button>
              </form>

              {/* Add Songs Section */}
              <div className="mt-8">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5"
                >
                  <Plus className="h-5 w-5" />
                  {showSearch ? 'Masquer la recherche' : 'Ajouter des chansons'}
                </button>
              </div>
            </div>

            {/* Songs Section */}
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 border border-gray-700 shadow-2xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Volume2 className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-white">Gestion des chansons</h2>
              </div>

              {/* Search Section */}
              {showSearch && (
                <div className="space-y-6">
                  <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-600">
                    <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
                      <Search className="h-5 w-5" />
                      Rechercher des chansons
                    </h3>
                    
                    {/* Search Input */}
                    <div className="flex gap-3 mb-6">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher une chanson..."
                          className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300"
                        />
                      </div>
                      <button
                        onClick={handleSearch}
                        disabled={isSearching || !searchQuery.trim()}
                        className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black px-6 py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5 disabled:transform-none"
                      >
                        <Search className="h-4 w-4" />
                        {isSearching ? 'Recherche...' : 'Rechercher'}
                      </button>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-semibold text-white/90 mb-3 flex items-center gap-2">
                          <Star className="h-4 w-4 text-yellow-400" />
                          Résultats de recherche ({searchResults.length})
                        </h4>
                        <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                          {searchResults.map((song) => (
                            <div key={song._id} className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-600 hover:bg-gray-800/70 transition-all duration-300 group">
                              <div className="flex items-center gap-4">
                                <div className="relative">
                                  <img
                                    src={song.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop'}
                                    alt={song.title}
                                    className="w-12 h-12 rounded-lg object-cover shadow-lg"
                                  />
                                  <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                    <Play className="h-4 w-4 text-white" />
                                  </div>
                                </div>
                                <div>
                                  <p className="text-white font-medium text-sm">{song.title}</p>
                                  <p className="text-gray-400 text-xs">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddSong(song)}
                                className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-black px-4 py-2 rounded-lg text-xs transition-all duration-300 shadow-lg hover:shadow-green-500/25 transform hover:-translate-y-0.5 flex items-center gap-1"
                              >
                                <Plus className="h-3 w-3" />
                                Ajouter
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Selected Songs */}
                  {selectedSongs.length > 0 && (
                    <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-600">
                      <h4 className="text-sm font-semibold text-white/90 mb-4 flex items-center gap-2">
                        <Music className="h-4 w-4 text-green-400" />
                        Chansons sélectionnées ({selectedSongs.length})
                      </h4>
                      <div className="space-y-3 max-h-60 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {selectedSongs.map((song, index) => (
                          <div key={song._id} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg border border-gray-600 hover:bg-gray-800/70 transition-all duration-300 group">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white">
                                {index + 1}
                              </div>
                              <img
                                src={song.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop'}
                                alt={song.title}
                                className="w-10 h-10 rounded-lg object-cover shadow-md"
                              />
                              <div>
                                <p className="text-white text-sm font-medium">{song.title}</p>
                                <p className="text-gray-400 text-xs">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveSong(song._id)}
                              className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-500/20 rounded-lg"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Bottom Info Section */}
          <div className="mt-8 max-w-4xl mx-auto grid md:grid-cols-2 gap-6">

            {/* Info Card */}
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-xl rounded-2xl p-6 border border-green-500/20 shadow-xl">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <Music className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Astuce</h3>
                  <p className="text-sm text-green-200 leading-relaxed">
                    Vous pouvez ajouter des chansons maintenant ou après la création de votre playlist.
                  </p>
                  <p className="text-xs text-green-300/80 mt-2">
                    La playlist apparaîtra automatiquement dans votre bibliothèque et dans le menu latéral.
                  </p>
                </div>
              </div>
            </div>

            {/* User Info Card */}
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-600 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=48&h=48&fit=crop&crop=face'}
                    alt="User"
                    className="w-12 h-12 rounded-full border-2 border-green-500/50 shadow-lg"
                  />
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full border-2 border-gray-900"></div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Créateur</h3>
                  <p className="text-sm text-gray-300">
                    Créée par <span className="font-medium text-white">{user?.username || 'Utilisateur'}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Membre depuis SoundWave
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;