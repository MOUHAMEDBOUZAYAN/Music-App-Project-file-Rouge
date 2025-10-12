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
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="p-8">
        {/* Header - Style Spotify simple */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Créer une playlist</h1>
          <p className="text-gray-400">Créez une playlist pour partager votre musique avec vos amis</p>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Détails de la playlist</h2>
              
              <form onSubmit={handleCreate} className="space-y-6">
                {/* Playlist Name */}
                <div>
                  <label htmlFor="playlistName" className="block text-sm font-medium text-white mb-2">
                    Nom de la playlist *
                  </label>
                  <input
                    type="text"
                    id="playlistName"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ma nouvelle playlist"
                    className="w-full px-3 py-3 bg-[#121212] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                    required
                  />
                </div>

                {/* Playlist Description */}
                <div>
                  <label htmlFor="playlistDescription" className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    id="playlistDescription"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Ajoutez une description optionnelle"
                    rows={4}
                    className="w-full px-3 py-3 bg-[#121212] border border-gray-600 rounded text-white placeholder-gray-400 resize-none focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                  />
                </div>

                {/* Privacy Setting */}
                <div>
                  <label className="block text-sm font-medium text-white mb-3">
                    Visibilité
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="privacy"
                        checked={isPublic}
                        onChange={() => setIsPublic(true)}
                        className="text-green-500 focus:ring-green-500"
                      />
                      <div>
                        <span className="text-white font-medium">Publique</span>
                        <p className="text-sm text-gray-400">Visible par tous</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="privacy"
                        checked={!isPublic}
                        onChange={() => setIsPublic(false)}
                        className="text-green-500 focus:ring-green-500"
                      />
                      <div>
                        <span className="text-white font-medium">Privée</span>
                        <p className="text-sm text-gray-400">Seulement vous</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Create Button */}
                <button
                  type="submit"
                  disabled={creating || !name.trim()}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 px-6 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {creating ? 'Création...' : 'Créer la playlist'}
                </button>
              </form>

              {/* Add Songs Section */}
              <div className="mt-6">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="w-full border border-gray-600 hover:border-white text-white font-medium py-3 px-6 rounded-full transition-colors duration-200"
                >
                  {showSearch ? 'Masquer la recherche' : 'Ajouter des chansons'}
                </button>
              </div>
            </div>

            {/* Songs Section */}
            <div className="bg-[#181818] rounded-lg p-6">
              <h2 className="text-xl font-semibold text-white mb-6">Ajouter des chansons</h2>

              {/* Search Section */}
              {showSearch && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4 text-white">
                      Rechercher des chansons
                    </h3>
                    
                    {/* Search Input */}
                    <div className="flex gap-3 mb-6">
                      <div className="flex-1">
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Rechercher une chanson..."
                          className="w-full px-3 py-3 bg-[#121212] border border-gray-600 rounded text-white placeholder-gray-400 focus:outline-none focus:border-white focus:ring-1 focus:ring-white"
                        />
                      </div>
                      <button
                        onClick={handleSearch}
                        disabled={isSearching || !searchQuery.trim()}
                        className="bg-green-500 hover:bg-green-600 text-black px-6 py-3 rounded-full transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSearching ? 'Recherche...' : 'Rechercher'}
                      </button>
                    </div>

                    {/* Search Results */}
                    {searchResults.length > 0 && (
                      <div className="space-y-4">
                        <h4 className="text-sm font-medium text-gray-400 mb-3">
                          Résultats de recherche ({searchResults.length})
                        </h4>
                        <div className="space-y-2 max-h-80 overflow-y-auto">
                          {searchResults.map((song) => (
                            <div key={song._id} className="flex items-center justify-between p-3 bg-[#121212] rounded hover:bg-[#282828] transition-colors duration-200 group">
                              <div className="flex items-center gap-3">
                                <img
                                  src={song.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=50&h=50&fit=crop'}
                                  alt={song.title}
                                  className="w-10 h-10 rounded object-cover"
                                />
                                <div>
                                  <p className="text-white text-sm font-medium">{song.title}</p>
                                  <p className="text-gray-400 text-xs">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                                </div>
                              </div>
                              <button
                                onClick={() => handleAddSong(song)}
                                className="bg-green-500 hover:bg-green-600 text-black px-3 py-1 rounded-full text-xs transition-colors duration-200"
                              >
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
                    <div>
                      <h4 className="text-sm font-medium text-gray-400 mb-3">
                        Chansons sélectionnées ({selectedSongs.length})
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {selectedSongs.map((song, index) => (
                          <div key={song._id} className="flex items-center justify-between p-3 bg-[#121212] rounded hover:bg-[#282828] transition-colors duration-200">
                            <div className="flex items-center gap-3">
                              <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold text-black">
                                {index + 1}
                              </div>
                              <img
                                src={song.coverImage || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=40&h=40&fit=crop'}
                                alt={song.title}
                                className="w-10 h-10 rounded object-cover"
                              />
                              <div>
                                <p className="text-white text-sm font-medium">{song.title}</p>
                                <p className="text-gray-400 text-xs">{song.artist?.username || song.artist?.name || 'Artiste inconnu'}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleRemoveSong(song._id)}
                              className="text-gray-400 hover:text-white transition-colors"
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

        </div>
      </div>
    </div>
  );
};

export default CreatePlaylist;