import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { playlistService } from '../services/playlistService.js';
import { songService } from '../services/songService.js';
import { Save, Music, Globe, Lock, Plus, Search, X, Play } from 'lucide-react';
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
    <div className="min-h-screen bg-gray-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Créer une playlist</h1>
        <p className="text-gray-400">Créez votre playlist personnalisée</p>
      </div>

      {/* Simple Form */}
      <div className="max-w-md mx-auto bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-6 text-center">Informations de la playlist</h2>
        
        <form onSubmit={handleCreate} className="space-y-4">
          {/* Playlist Name */}
          <div>
            <label htmlFor="playlistName" className="block text-sm font-medium text-gray-300 mb-2">
              Nom de la playlist *
            </label>
            <input
              type="text"
              id="playlistName"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez le nom de votre playlist"
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              required
            />
          </div>

          {/* Playlist Description */}
          <div>
            <label htmlFor="playlistDescription" className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              id="playlistDescription"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Décrivez votre playlist (optionnel)"
              rows={3}
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400 resize-none"
            />
          </div>

          {/* Privacy Setting */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Visibilité
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  checked={isPublic}
                  onChange={() => setIsPublic(true)}
                  className="mr-3 text-green-500 focus:ring-green-500"
                />
                <Globe className="h-4 w-4 mr-2 text-green-500" />
                <span className="text-gray-300">Publique</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="privacy"
                  checked={!isPublic}
                  onChange={() => setIsPublic(false)}
                  className="mr-3 text-green-500 focus:ring-green-500"
                />
                <Lock className="h-4 w-4 mr-2 text-gray-400" />
                <span className="text-gray-300">Privée</span>
              </label>
            </div>
          </div>

          {/* Create Button */}
          <button
            type="submit"
            disabled={creating || !name.trim()}
            className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {creating ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
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
        <div className="mt-6">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="h-5 w-5" />
            {showSearch ? 'Masquer la recherche' : 'Ajouter des chansons'}
          </button>
        </div>

        {/* Search Section */}
        {showSearch && (
          <div className="mt-6 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold mb-4 text-white">Rechercher des chansons</h3>
            
            {/* Search Input */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher une chanson..."
                className="flex-1 px-4 py-2 bg-gray-600 border border-gray-500 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-white placeholder-gray-400"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !searchQuery.trim()}
                className="bg-green-500 hover:bg-green-600 text-black px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Search className="h-4 w-4" />
                {isSearching ? 'Recherche...' : 'Rechercher'}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-300 mb-2">Résultats de recherche:</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((song) => (
                    <div key={song._id} className="flex items-center justify-between p-3 bg-gray-600 rounded-lg">
                      <div className="flex items-center gap-3">
                        <img
                          src={song.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop'}
                          alt={song.title}
                          className="w-10 h-10 rounded object-cover"
                        />
                        <div>
                          <p className="text-white font-medium text-sm">{song.title}</p>
                          <p className="text-gray-400 text-xs">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleAddSong(song)}
                        className="bg-green-500 hover:bg-green-600 text-black px-3 py-1 rounded text-xs transition-colors"
                      >
                        Ajouter
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Songs */}
            {selectedSongs.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-2">Chansons sélectionnées ({selectedSongs.length}):</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedSongs.map((song) => (
                    <div key={song._id} className="flex items-center justify-between p-2 bg-gray-600 rounded-lg">
                      <div className="flex items-center gap-2">
                        <img
                          src={song.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=30&h=30&fit=crop'}
                          alt={song.title}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div>
                          <p className="text-white text-xs font-medium">{song.title}</p>
                          <p className="text-gray-400 text-xs">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveSong(song._id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
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

        {/* Info */}
        <div className="mt-6 p-4 bg-blue-900/30 border border-blue-500/30 rounded-lg">
          <div className="flex items-start gap-3">
            <Music className="h-5 w-5 text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm text-blue-300">
                <strong>Astuce:</strong> Vous pouvez ajouter des chansons maintenant ou après la création.
              </p>
              <p className="text-xs text-blue-400 mt-1">
                La playlist apparaîtra dans votre bibliothèque et dans le menu latéral.
              </p>
            </div>
          </div>
        </div>

        {/* User Info */}
        <div className="mt-4 p-3 bg-gray-700 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'}
              alt="User"
              className="w-6 h-6 rounded-full"
            />
            <span>Créée par <strong>{user?.username || 'Utilisateur'}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;