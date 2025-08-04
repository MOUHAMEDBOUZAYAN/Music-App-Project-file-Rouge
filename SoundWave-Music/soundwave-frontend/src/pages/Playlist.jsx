import React, { useState } from 'react';
import { Plus, Music, Save, X, Play, Heart, MoreVertical } from 'lucide-react';

const Playlist = () => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const [playlists, setPlaylists] = useState([]);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (playlistName.trim()) {
      const newPlaylist = {
        id: Date.now(),
        name: playlistName,
        description: playlistDescription,
        songCount: 0,
        createdAt: new Date().toLocaleDateString(),
        isPublic: true
      };
      setPlaylists([...playlists, newPlaylist]);
      setPlaylistName('');
      setPlaylistDescription('');
      setShowCreateForm(false);
    }
  };

  const deletePlaylist = (playlistId) => {
    setPlaylists(playlists.filter(playlist => playlist.id !== playlistId));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Playlists</h1>
          <p className="text-gray-300">Create and manage your playlists</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      {/* Create Playlist Form */}
      {showCreateForm && (
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Create New Playlist</h2>
            <button
              onClick={() => setShowCreateForm(false)}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          
          <form onSubmit={handleCreatePlaylist} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Playlist Name
              </label>
              <input
                type="text"
                value={playlistName}
                onChange={(e) => setPlaylistName(e.target.value)}
                placeholder="Enter playlist name..."
                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={playlistDescription}
                onChange={(e) => setPlaylistDescription(e.target.value)}
                placeholder="Describe your playlist..."
                rows="3"
                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="h-4 w-4" />
                <span>Create Playlist</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Playlists List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Your Playlists</h2>
        
        {playlists.length === 0 ? (
          <div className="text-center py-12">
            <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">No playlists yet</p>
            <p className="text-gray-500">Create your first playlist to get started</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playlists.map((playlist) => (
              <div key={playlist.id} className="bg-gray-800 rounded-lg p-4 hover:bg-gray-750 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">{playlist.name}</h3>
                    <p className="text-gray-400 text-sm mb-2">
                      {playlist.description || 'No description'}
                    </p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>{playlist.songCount} songs</span>
                      <span>Created {playlist.createdAt}</span>
                    </div>
                  </div>
                  <button className="text-gray-400 hover:text-white">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button className="flex items-center space-x-1 bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                    <Play className="h-3 w-3" />
                    <span>Play</span>
                  </button>
                  <button className="flex items-center space-x-1 text-gray-400 hover:text-white px-3 py-1 rounded text-sm transition-colors">
                    <Heart className="h-3 w-3" />
                    <span>Like</span>
                  </button>
                  <button
                    onClick={() => deletePlaylist(playlist.id)}
                    className="flex items-center space-x-1 text-red-400 hover:text-red-300 px-3 py-1 rounded text-sm transition-colors"
                  >
                    <X className="h-3 w-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist; 