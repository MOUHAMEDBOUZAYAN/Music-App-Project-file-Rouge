import React, { useState } from 'react';
import { Heart, Clock, Plus, Music, User, Disc } from 'lucide-react';

const Library = () => {
  const [activeTab, setActiveTab] = useState('playlists');

  const tabs = [
    { id: 'playlists', name: 'Playlists', icon: Music },
    { id: 'liked', name: 'Liked Songs', icon: Heart },
    { id: 'recent', name: 'Recently Played', icon: Clock },
    { id: 'artists', name: 'Artists', icon: User },
    { id: 'albums', name: 'Albums', icon: Disc },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'playlists':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-white">Your Playlists</h3>
              <button className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="h-4 w-4" />
                <span>Create Playlist</span>
              </button>
            </div>
            <div className="text-center py-12">
              <Music className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No playlists yet</p>
              <p className="text-gray-500">Create your first playlist to get started</p>
            </div>
          </div>
        );
      
      case 'liked':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Liked Songs</h3>
            <div className="text-center py-12">
              <Heart className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No liked songs yet</p>
              <p className="text-gray-500">Like songs to see them here</p>
            </div>
          </div>
        );
      
      case 'recent':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Recently Played</h3>
            <div className="text-center py-12">
              <Clock className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No recent activity</p>
              <p className="text-gray-500">Start listening to music to see your history</p>
            </div>
          </div>
        );
      
      case 'artists':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Followed Artists</h3>
            <div className="text-center py-12">
              <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No followed artists</p>
              <p className="text-gray-500">Follow artists to see them here</p>
            </div>
          </div>
        );
      
      case 'albums':
        return (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">Saved Albums</h3>
            <div className="text-center py-12">
              <Disc className="h-16 w-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No saved albums</p>
              <p className="text-gray-500">Save albums to see them here</p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Your Library</h1>
        <p className="text-gray-300">Manage your music collection</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-700">
        <div className="flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-500'
                    : 'border-transparent text-gray-400 hover:text-white hover:border-gray-600'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{tab.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div className="min-h-96">
        {renderContent()}
      </div>
    </div>
  );
};

export default Library; 